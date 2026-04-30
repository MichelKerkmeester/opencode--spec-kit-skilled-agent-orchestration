// ───────────────────────────────────────────────────────────────
// MODULE: sa-030 / sa-031 / sa-032 / sa-033 — Hook Parity Stress Test
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { handleClaudeUserPromptSubmit } from '../../hooks/claude/user-prompt-submit.js';
import { handleCopilotUserPromptSubmit, refreshCopilotAdvisorInstructions } from '../../hooks/copilot/user-prompt-submit.js';
import { handleGeminiUserPromptSubmit } from '../../hooks/gemini/user-prompt-submit.js';
import {
  handleCodexUserPromptSubmit,
  parseCodexUserPromptSubmitInputSources,
} from '../../hooks/codex/user-prompt-submit.js';
import { handleCodexSessionStart as runCodexSessionStart } from '../../hooks/codex/session-start.js';
import { normalizeRuntimeOutput } from '../../skill_advisor/lib/normalize-adapter-output.js';
import type { AdvisorHookResult } from '../../skill_advisor/lib/skill-advisor-brief.js';

const REPO_ROOT = resolve(import.meta.dirname, '../../../../../../');
const CLAUDE_SETTINGS = resolve(REPO_ROOT, '.claude/settings.local.json');
const COPILOT_SETTINGS = resolve(REPO_ROOT, '.github/hooks/superset-notify.json');
const GEMINI_SETTINGS = resolve(REPO_ROOT, '.gemini/settings.json');
const CODEX_SETTINGS = resolve(REPO_ROOT, '.codex/settings.json');

function fixtureBrief(runtime: 'claude' | 'copilot' | 'gemini' | 'codex'): AdvisorHookResult {
  return {
    status: 'ok',
    freshness: 'live',
    brief: null,
    recommendations: [{
      skill: 'system-spec-kit',
      kind: 'skill',
      confidence: 0.91,
      uncertainty: 0.18,
      passes_threshold: true,
      reason: `${runtime} parity fixture`,
    }],
    diagnostics: null,
    metrics: {
      durationMs: 2,
      cacheHit: false,
      subprocessInvoked: false,
      retriesAttempted: 0,
      recommendationCount: 1,
      tokenCap: 80,
    },
    generatedAt: '2026-04-30T00:00:00.000Z',
    sharedPayload: null,
  };
}

function renderBrief(result: AdvisorHookResult): string {
  const top = result.recommendations[0];
  return top ? `Advisor: ${top.skill} ${top.confidence}/${top.uncertainty} pass.` : '';
}

function readJson(path: string): Record<string, unknown> {
  expect(existsSync(path)).toBe(true);
  return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
}

describe('sa-030 / sa-031 / sa-032 / sa-033 — hooks parity layer', () => {
  it('settings-driven invocation points each runtime at its own compiled adapter', () => {
    const claude = readJson(CLAUDE_SETTINGS);
    const copilot = readJson(COPILOT_SETTINGS);
    const gemini = readJson(GEMINI_SETTINGS);
    const codex = readJson(CODEX_SETTINGS);

    expect(JSON.stringify(claude)).toContain('dist/hooks/claude/user-prompt-submit.js');
    expect(JSON.stringify(claude)).not.toContain('dist/hooks/copilot/user-prompt-submit.js');
    expect(JSON.stringify(copilot)).toContain('spec-kit-copilot-hook.sh userPromptSubmitted');
    expect(JSON.stringify(gemini)).toContain('dist/hooks/gemini/user-prompt-submit.js');
    expect(JSON.stringify(codex)).toContain('dist/hooks/codex/user-prompt-submit.js');
    expect(JSON.stringify(codex)).toContain('dist/hooks/codex/session-start.js');
  });

  it('normalizes Claude, Gemini, and Codex prompt-hook output to the same additionalContext transport', async () => {
    const [claude, gemini, codex] = await Promise.all([
      handleClaudeUserPromptSubmit({
        cwd: REPO_ROOT,
        prompt: 'save packet 044 context',
      }, {
        buildBrief: async () => fixtureBrief('claude'),
        renderBrief,
        writeDiagnostic: () => undefined,
      }),
      handleGeminiUserPromptSubmit({
        cwd: REPO_ROOT,
        userPrompt: 'save packet 044 context',
      }, {
        buildBrief: async () => fixtureBrief('gemini'),
        renderBrief,
        writeDiagnostic: () => undefined,
      }),
      handleCodexUserPromptSubmit({
        cwd: REPO_ROOT,
        request: { prompt: 'save packet 044 context' },
      }, {
        buildBrief: async () => fixtureBrief('codex'),
        renderBrief,
        writeDiagnostic: () => undefined,
      }),
    ]);

    const normalized = [
      normalizeRuntimeOutput('claude', claude),
      normalizeRuntimeOutput('gemini', gemini),
      normalizeRuntimeOutput('codex', codex),
    ];

    expect(normalized.map((entry) => entry.transport)).toEqual([
      'json_additional_context',
      'json_additional_context',
      'json_additional_context',
    ]);
    expect(new Set(normalized.map((entry) => entry.additionalContext))).toEqual(new Set([
      'Advisor: system-spec-kit 0.91/0.18 pass.',
    ]));
    expect(normalized.every((entry) => entry.stderrVisible === false)).toBe(true);
  });

  it('refreshes Copilot instructions through the parity layer without returning prompt-mutating output', async () => {
    const writes: string[] = [];
    const result = await refreshCopilotAdvisorInstructions({
      cwd: REPO_ROOT,
      userPrompt: 'save packet 044 context',
      sessionID: 's-copilot',
    }, {
      buildBrief: async () => fixtureBrief('copilot'),
      renderBrief,
      buildStartup: () => ({ startupSurface: 'Startup: fixture' }) as never,
      writeInstructions: async (payload) => {
        writes.push(`${payload.advisorBrief}\n${payload.startupSurface}`);
        return { path: '[fixture]', bytesWritten: 12, changed: true };
      },
      writeDiagnostic: () => undefined,
    });
    const hookOutput = await handleCopilotUserPromptSubmit({
      cwd: REPO_ROOT,
      prompt: 'save packet 044 context',
    }, {
      buildBrief: async () => fixtureBrief('copilot'),
      renderBrief,
      writeInstructions: async () => ({ path: '[fixture]', bytesWritten: 0, changed: false }),
      writeDiagnostic: () => undefined,
    });

    expect(result?.brief).toBe('Advisor: system-spec-kit 0.91/0.18 pass.');
    expect(writes[0]).toContain('Startup: fixture');
    expect(hookOutput).toEqual({});
  });

  it('keeps Codex stdin-vs-argv parsing and SessionStart startup output deterministic', async () => {
    const parsed = parseCodexUserPromptSubmitInputSources(
      JSON.stringify({ prompt: 'stdin wins', cwd: REPO_ROOT }),
      [JSON.stringify({ prompt: 'argv loses', cwd: REPO_ROOT })],
    );
    const sessionStart = await runCodexSessionStart({
      cwd: REPO_ROOT,
      source: 'startup',
      context_window_tokens: 100,
      context_window_max: 10_000,
    }, {
      startupSections: () => [{ title: 'Codex Startup', content: 'packet 044' }],
      writeDiagnostic: () => undefined,
    });

    expect(parsed.input?.prompt).toBe('stdin wins');
    expect(parsed.diagnostics).toEqual({
      source: 'stdin',
      dualInputDetected: true,
      reason: 'STDIN_ARGV_BOTH_PRESENT_USING_STDIN',
    });
    expect(normalizeRuntimeOutput('codex', sessionStart).additionalContext).toContain('Codex Startup');
  });
});
