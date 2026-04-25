// ───────────────────────────────────────────────────────────────
// MODULE: Shim Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..', '..');
const shimPath = resolve(repoRoot, '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py');

function runShim(args: string[], input = '', env: NodeJS.ProcessEnv = {}) {
  return spawnSync('python3', [shimPath, ...args], {
    cwd: repoRoot,
    input,
    encoding: 'utf8',
    env: {
      ...process.env,
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      ...env,
    },
  });
}

function parseJson(stdout: string): unknown {
  return JSON.parse(stdout.trim() || 'null');
}

describe('skill_advisor.py compat shim', () => {
  it('routes to native advisor_recommend when forced native and keeps legacy JSON array shape', () => {
    const result = runShim(['--force-native', 'save this conversation context to memory']);
    expect(result.status).toBe(0);
    const parsed = parseJson(result.stdout);
    expect(parsed).toEqual([
      expect.objectContaining({
        skill: 'system-spec-kit',
        kind: 'skill',
        source: 'native',
      }),
    ]);
  });

  it('falls back to local Python scoring when native is forced off', () => {
    const result = runShim(['--force-local', 'help me commit my changes']);
    expect(result.status).toBe(0);
    const parsed = parseJson(result.stdout);
    expect(parsed).toEqual([
      expect.objectContaining({
        skill: 'sk-git',
        kind: 'skill',
      }),
    ]);
  });

  it('preserves --stdin mode and does not leak prompt text through native metadata', () => {
    const secretPrompt = 'save this private-address@example.com context';
    const result = runShim(['--force-native', '--stdin'], secretPrompt);
    expect(result.status).toBe(0);
    expect(result.stdout).not.toContain(secretPrompt);
    expect(result.stdout).not.toContain('private-address@example.com');
    expect(parseJson(result.stdout)).toEqual([
      expect.objectContaining({ source: 'native' }),
    ]);
  });

  it('honors the shared disabled flag with no recommendation', () => {
    const result = runShim(['test prompt'], '', {
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
    });
    expect(result.status).toBe(0);
    expect(parseJson(result.stdout)).toEqual([]);
  });

  it('lets --force-native override the shared disabled flag', () => {
    const result = runShim(['--force-native', 'save this conversation context to memory'], '', {
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
    });
    expect(result.status).toBe(0);
    expect(parseJson(result.stdout)).toEqual([
      expect.objectContaining({
        source: 'native',
        skill: 'system-spec-kit',
      }),
    ]);
  });

  it('tries native mode when --force-native is combined with semantic flags', () => {
    const result = runShim(['--force-native', '--semantic', 'save this conversation context to memory']);
    expect(result.status).toBe(0);
    expect(parseJson(result.stdout)).toEqual([
      expect.objectContaining({
        source: 'native',
        skill: 'system-spec-kit',
      }),
    ]);
  });
});
