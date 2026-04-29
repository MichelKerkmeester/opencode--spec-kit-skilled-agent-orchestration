// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Freshness Hook Tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  handleCodexUserPromptSubmit,
} from '../hooks/codex/user-prompt-submit.js';
import { smokeCheckCodexColdStartContext } from '../hooks/codex/lib/freshness-smoke-check.js';
import type { CodexUserPromptSubmitInput } from '../hooks/codex/user-prompt-submit.js';
import type { AdvisorHookResult } from '../skill_advisor/lib/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, 'advisor-fixtures');

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

async function runTimeoutHook(input: CodexUserPromptSubmitInput) {
  const diagnostics = diagnosticsSink();
  const output = await handleCodexUserPromptSubmit(input, {
    buildBrief: vi.fn(async () => fixture('failOpenTimeout.json')),
    writeDiagnostic: diagnostics.writeDiagnostic,
  });
  return { output, diagnostics };
}

describe('Codex freshness hardening', () => {
  it('marks timeout fallback context as stale and logs a structured warning', async () => {
    const { output, diagnostics } = await runTimeoutHook({
      prompt: 'implement hook freshness hardening',
      cwd: '/workspace/project',
    });

    expect(output).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: [
          'Advisor: stale (cold-start timeout)',
          'Fallback marker: {"stale":true,"reason":"timeout-fallback"}',
        ].join('\n'),
      },
    });

    const warning = JSON.parse(diagnostics.records[0] ?? '{}') as Record<string, unknown>;
    expect(warning).toMatchObject({
      level: 'warn',
      runtime: 'codex',
      event: 'codex_user_prompt_timeout_fallback',
      stale: true,
      reason: 'timeout-fallback',
      workspaceRoot: '/workspace/project',
    });

    const metric = JSON.parse(diagnostics.records[1] ?? '{}') as Record<string, unknown>;
    expect(metric).toMatchObject({
      runtime: 'codex',
      status: 'stale',
      freshness: 'stale',
      errorCode: 'TIMEOUT',
    });
  });

  it('smoke-checks cold-start context freshness with latency and last update', () => {
    let now = 10;
    const result = smokeCheckCodexColdStartContext({
      now: () => {
        now += 5;
        return now;
      },
      buildStartup: () => ({
        graphOutline: null,
        sessionContinuity: null,
        graphSummary: {
          files: 1,
          nodes: 1,
          edges: 0,
          lastScan: '2026-04-29T12:00:00.000Z',
        },
        graphQualitySummary: null,
        graphState: 'ready',
        graphTrustState: 'live',
        cocoIndexAvailable: false,
        startupSurface: 'Session context received.',
        sharedPayload: null,
        sharedPayloadTransport: null,
      }),
    });

    expect(result).toEqual({
      fresh: true,
      lastUpdateAt: '2026-04-29T12:00:00.000Z',
      latencyMs: 5,
    });
  });
});
