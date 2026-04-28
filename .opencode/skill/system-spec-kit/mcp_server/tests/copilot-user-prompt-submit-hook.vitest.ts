import { readFileSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  handleCopilotUserPromptSubmit,
  parseCopilotUserPromptSubmitInput,
  refreshCopilotAdvisorInstructions,
  type CopilotUserPromptSubmitInput,
} from '../hooks/copilot/user-prompt-submit.js';
import {
  mergeSpecKitCopilotContextBlock,
  renderSpecKitCopilotContextBlock,
  SPEC_KIT_COPILOT_CONTEXT_BEGIN,
  SPEC_KIT_COPILOT_CONTEXT_END,
} from '../hooks/copilot/custom-instructions.js';
import { normalizeRuntimeOutput } from '../skill_advisor/lib/normalize-adapter-output.js';
import { renderAdvisorBrief } from '../skill_advisor/lib/render.js';
import { validateAdvisorHookDiagnosticRecord } from '../skill_advisor/lib/metrics.js';
import type { AdvisorHookResult } from '../skill_advisor/lib/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, 'advisor-fixtures');
const tempDirs: string[] = [];

function fixture(name: string): AdvisorHookResult {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as AdvisorHookResult;
}

function diagnosticsSink(): { records: string[]; writeDiagnostic: (line: string) => void } {
  const records: string[] = [];
  return {
    records,
    writeDiagnostic: (line: string) => records.push(line),
  };
}

function parseDiagnostic(line: string): Record<string, unknown> {
  return JSON.parse(line) as Record<string, unknown>;
}

async function tempInstructionsPath(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'speckit-copilot-'));
  tempDirs.push(dir);
  return join(dir, '.copilot', 'copilot-instructions.md');
}

async function runHook(input: CopilotUserPromptSubmitInput, result: AdvisorHookResult) {
  const diagnostics = diagnosticsSink();
  const instructionsPath = await tempInstructionsPath();
  const buildBrief = vi.fn(async () => result);
  const output = await handleCopilotUserPromptSubmit(input, {
    buildBrief,
    buildStartup: () => ({
      graphOutline: null,
      sessionContinuity: null,
      graphSummary: null,
      graphState: 'missing',
      cocoIndexAvailable: false,
      startupSurface: 'Session context received. Current state:\n\n- Code Graph: unavailable',
      sharedPayload: null,
    }),
    instructionsPath,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
  });
  const written = await readFile(instructionsPath, 'utf8');
  return { output, buildBrief, diagnostics, instructionsPath, written };
}

afterEach(async () => {
  delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
  for (const dir of tempDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
});

describe('Copilot UserPromptSubmitted advisor workaround', () => {
  it('AS1 writes startup context and advisor brief to the managed custom-instructions block', async () => {
    const { output, buildBrief, diagnostics, written } = await runHook({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
      timestamp: '2026-04-22T00:00:00Z',
    }, fixture('livePassingSkill.json'));

    expect(output).toEqual({});
    expect(normalizeRuntimeOutput('copilot', output)).toEqual({
      runtime: 'copilot',
      transport: 'json_additional_context',
      additionalContext: null,
      stderrVisible: false,
    });
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'copilot',
      workspaceRoot: '/workspace/project',
    });
    expect(written).toContain(SPEC_KIT_COPILOT_CONTEXT_BEGIN);
    expect(written).toContain('Session context received. Current state:');
    expect(written).toContain('Advisor: live; use sk-code-opencode 0.91/0.23 pass.');
    expect(written).toContain('Workspace: /workspace/project');
    expect(written).toContain('Copilot CLI reads custom instructions on the next submitted prompt');
    expect(written).toContain('scoped to the Workspace above');

    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(validateAdvisorHookDiagnosticRecord(diagnostic)).toBe(true);
    expect(diagnostic.runtime).toBe('copilot');
    expect(diagnostics.records[0]).not.toMatch(/prompt|stdout|stderr|promptFingerprint|promptExcerpt/);
  });

  it('AS2 preserves human instructions outside the managed block and replaces stale generated content', () => {
    const oldBlock = renderSpecKitCopilotContextBlock({
      startupSurface: 'old startup',
      advisorBrief: 'old advisor',
      generatedAt: '2026-04-21T00:00:00.000Z',
    });
    const newBlock = renderSpecKitCopilotContextBlock({
      startupSurface: 'new startup',
      advisorBrief: 'new advisor',
      generatedAt: '2026-04-22T00:00:00.000Z',
    });
    const merged = mergeSpecKitCopilotContextBlock([
      '# Personal Copilot Notes',
      '',
      'Keep this human note.',
      '',
      oldBlock,
      'Keep this footer.',
      '',
    ].join('\n'), newBlock);

    expect(merged).toContain('Keep this human note.');
    expect(merged).toContain('Keep this footer.');
    expect(merged).toContain('new startup');
    expect(merged).toContain('new advisor');
    expect(merged).not.toContain('old startup');
    expect(merged.match(new RegExp(SPEC_KIT_COPILOT_CONTEXT_BEGIN, 'g'))).toHaveLength(1);
    expect(merged.match(new RegExp(SPEC_KIT_COPILOT_CONTEXT_END, 'g'))).toHaveLength(1);
  });

  it('AS3 writes startup-only fallback when the advisor renderer returns null', async () => {
    const { output, written } = await runHook({
      prompt: '/help',
      cwd: '/workspace/project',
    }, fixture('skippedShortCasual.json'));

    expect(output).toEqual({});
    expect(written).toContain('Session context received. Current state:');
    expect(written).toContain('No live advisor brief is available for the latest prompt.');
  });

  it('AS4 respects SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 without calling the producer or writer', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    const diagnostics = diagnosticsSink();
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));
    const writeInstructions = vi.fn();

    const output = await handleCopilotUserPromptSubmit({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief,
      writeInstructions,
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(output).toEqual({});
    expect(buildBrief).not.toHaveBeenCalled();
    expect(writeInstructions).not.toHaveBeenCalled();
    expect(validateAdvisorHookDiagnosticRecord(parseDiagnostic(diagnostics.records[0] ?? '{}'))).toBe(true);
  });

  it('AS5 emits {} for invalid JSON stdin without writing custom instructions', async () => {
    const diagnostics = diagnosticsSink();
    const writeInstructions = vi.fn();
    const input = parseCopilotUserPromptSubmitInput('{not-json');

    const output = await handleCopilotUserPromptSubmit(input, {
      writeInstructions,
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(input).toBeNull();
    expect(output).toEqual({});
    expect(writeInstructions).not.toHaveBeenCalled();
    expect(parseDiagnostic(diagnostics.records[0] ?? '{}').errorCode).toBe('PARSE_FAIL');
  });

  it('CHK-012 keeps prompt text out of diagnostics and writes only sanitized managed context', async () => {
    const diagnostics = diagnosticsSink();
    const instructionsPath = await tempInstructionsPath();
    const result = await refreshCopilotAdvisorInstructions({
      prompt: 'secret user prompt content',
      cwd: '/workspace/project',
    }, {
      buildBrief: vi.fn(async () => fixture('livePassingSkill.json')),
      buildStartup: () => ({
        graphOutline: null,
        sessionContinuity: null,
        graphSummary: null,
        graphState: 'missing',
        cocoIndexAvailable: false,
        startupSurface: `${SPEC_KIT_COPILOT_CONTEXT_BEGIN}\nstartup`,
        sharedPayload: null,
      }),
      instructionsPath,
      renderBrief: renderAdvisorBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
    });
    const written = await readFile(instructionsPath, 'utf8');

    expect(result?.brief).toBe('Advisor: live; use sk-code-opencode 0.91/0.23 pass.');
    expect(diagnostics.records.join('\n')).not.toContain('secret user prompt content');
    expect(written).not.toContain('secret user prompt content');
    expect(written).toContain('[managed block marker removed]');
  });

  it('CHK-008 keeps adapter cache-hit p95 under 60 ms with cached producer output', async () => {
    const result = fixture('livePassingSkill.json');
    result.metrics = {
      ...result.metrics,
      cacheHit: true,
      durationMs: 1,
    };
    const buildBrief = vi.fn(async () => result);
    const durations: number[] = [];

    for (let index = 0; index < 30; index += 1) {
      const diagnostics = diagnosticsSink();
      const startedAt = performance.now();
      const output = await handleCopilotUserPromptSubmit({
        sessionId: `s-${index}`,
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      }, {
        buildBrief,
        buildStartup: () => ({
          graphOutline: null,
          sessionContinuity: null,
          graphSummary: null,
          graphState: 'missing',
          cocoIndexAvailable: false,
          startupSurface: 'Session context received.',
          sharedPayload: null,
        }),
        writeInstructions: vi.fn(async () => ({
          path: '/tmp/copilot-instructions.md',
          written: true,
          changed: true,
        })),
        renderBrief: renderAdvisorBrief,
        writeDiagnostic: diagnostics.writeDiagnostic,
      });
      durations.push(performance.now() - startedAt);
      expect(output).toEqual({});
    }

    const sorted = [...durations].sort((left, right) => left - right);
    const p95 = sorted[Math.ceil(0.95 * sorted.length) - 1] ?? 0;
    expect(p95).toBeLessThanOrEqual(60);
  });
});
