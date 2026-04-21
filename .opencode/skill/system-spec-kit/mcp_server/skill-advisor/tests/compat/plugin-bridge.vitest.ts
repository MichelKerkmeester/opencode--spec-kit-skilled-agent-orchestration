// ───────────────────────────────────────────────────────────────
// MODULE: Plugin Bridge Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..', '..');
const bridgePath = resolve(repoRoot, '.opencode/plugins/spec-kit-skill-advisor-bridge.mjs');

function runBridge(payload: Record<string, unknown>, env: NodeJS.ProcessEnv = {}) {
  return spawnSync('node', [bridgePath], {
    cwd: repoRoot,
    input: JSON.stringify({
      workspaceRoot: repoRoot,
      maxTokens: 80,
      thresholdConfidence: 0.7,
      ...payload,
    }),
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env,
    },
  });
}

function parseBridge(stdout: string): { status: string; brief: string | null; metadata: Record<string, unknown> } {
  return JSON.parse(stdout.trim());
}

describe('spec-kit skill advisor plugin bridge compat path', () => {
  it('delegates to native advisor_recommend when the daemon probe is available', () => {
    const result = runBridge({ prompt: 'save this conversation context to memory' });
    expect(result.status).toBe(0);
    const parsed = parseBridge(result.stdout);
    expect(parsed.status).toBe('ok');
    expect(parsed.brief).toContain('Advisor:');
    expect(parsed.brief).toContain('system-spec-kit');
    expect(parsed.metadata.route).toBe('native');
  });

  it('falls back to the Python-backed brief producer when native is forced local', () => {
    const result = runBridge({ prompt: 'help me commit my changes', forceLocal: true }, {
      SPECKIT_SKILL_ADVISOR_FORCE_LOCAL: '1',
    });
    expect(result.status).toBe(0);
    const parsed = parseBridge(result.stdout);
    expect(parsed.status).toBe('ok');
    expect(parsed.metadata.route).toBe('python');
  });

  it('returns a prompt-safe disabled brief for the shared disabled flag', () => {
    const result = runBridge({ prompt: 'private@example.com should not appear' }, {
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
    });
    expect(result.status).toBe(0);
    const parsed = parseBridge(result.stdout);
    expect(parsed.status).toBe('skipped');
    expect(parsed.brief).toBe('Advisor: disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED.');
    expect(result.stdout).not.toContain('private@example.com');
  });
});
