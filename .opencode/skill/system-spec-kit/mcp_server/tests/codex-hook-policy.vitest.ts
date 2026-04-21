import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearCodexHookPolicyCacheForTests,
  detectCodexHookPolicy,
  type CodexProbeCommand,
  type CodexProbeResult,
} from '../lib/codex-hook-policy.js';

function probeResult(overrides: Partial<CodexProbeResult> = {}): CodexProbeResult {
  return {
    ok: true,
    stdout: '',
    stderr: '',
    exitCode: 0,
    timedOut: false,
    ...overrides,
  };
}

function fixedClock() {
  let time = 10;
  return {
    now: () => {
      time += 5;
      return time;
    },
    currentDate: () => new Date('2026-04-19T10:00:00.000Z'),
  };
}

afterEach(() => {
  clearCodexHookPolicyCacheForTests();
});

function writeCodexSettings(workspaceRoot: string, content = '{"hooks":{}}'): string {
  const settingsPath = path.join(workspaceRoot, '.codex', 'settings.json');
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, content, 'utf8');
  return settingsPath;
}

describe('Codex hook policy detector', () => {
  it('returns live when version succeeds and settings JSON is valid', () => {
    const clock = fixedClock();
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-hook-policy-'));
    writeCodexSettings(workspaceRoot);
    const runCommand = vi.fn((command: CodexProbeCommand) => {
      if (command.args.includes('--version')) {
        return probeResult({ stdout: 'codex-cli 0.121.0\n' });
      }
      return probeResult({ ok: false, exitCode: 2, stderr: 'unexpected argument list' });
    });

    try {
      const policy = detectCodexHookPolicy({
        workspaceRoot,
        runCommand,
        now: clock.now,
        currentDate: clock.currentDate,
        useCache: false,
      });

      expect(policy).toEqual({
        hooks: 'live',
        probedAt: '2026-04-19T10:00:00.000Z',
        diagnostics: {
          probeDurationMs: 5,
          codexVersion: 'codex-cli 0.121.0',
        },
      });
      expect(runCommand).toHaveBeenCalledTimes(1);
      expect(runCommand).toHaveBeenCalledWith(expect.objectContaining({
        command: 'codex',
        args: ['--version'],
        timeoutMs: 500,
      }));
    } finally {
      fs.rmSync(workspaceRoot, { recursive: true, force: true });
    }
  });

  it('returns live when version is valid even if a hooks-list probe would fail', () => {
    const clock = fixedClock();
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-hook-policy-'));
    writeCodexSettings(workspaceRoot);
    const policy = detectCodexHookPolicy({
      runCommand: (command) => command.args.includes('--version')
        ? probeResult({ stdout: 'codex-cli 0.121.0' })
        : probeResult({ ok: false, exitCode: 2, stderr: 'unexpected argument list' }),
      workspaceRoot,
      now: clock.now,
      currentDate: clock.currentDate,
      useCache: false,
    });

    fs.rmSync(workspaceRoot, { recursive: true, force: true });
    expect(policy.hooks).toBe('live');
    expect(policy.diagnostics.reason).toBeUndefined();
  });

  it('returns unavailable when the version probe times out', () => {
    const clock = fixedClock();
    const versionTimeout = detectCodexHookPolicy({
      runCommand: () => probeResult({ ok: false, timedOut: true, exitCode: null, errorCode: 'ETIMEDOUT' }),
      now: clock.now,
      currentDate: clock.currentDate,
      useCache: false,
    });

    expect(versionTimeout.hooks).toBe('unavailable');
    expect(versionTimeout.diagnostics.reason).toBe('CODEX_VERSION_PROBE_TIMEOUT');
  });

  it('scrubs Superset/Codex TUI environment from the version probe', () => {
    const clock = fixedClock();
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-hook-policy-'));
    writeCodexSettings(workspaceRoot);
    process.env.CODEX_TUI_RECORD_SESSION = '1';
    process.env.CODEX_TUI_SESSION_LOG_PATH = '/tmp/session.jsonl';
    process.env.CODEX_CI = '1';
    process.env.CODEX_THREAD_ID = 'thread-1';

    try {
      const runCommand = vi.fn((command: CodexProbeCommand) => {
        expect(command.env?.CODEX_TUI_RECORD_SESSION).toBeUndefined();
        expect(command.env?.CODEX_TUI_SESSION_LOG_PATH).toBeUndefined();
        expect(command.env?.CODEX_CI).toBeUndefined();
        expect(command.env?.CODEX_THREAD_ID).toBeUndefined();
        return probeResult({ stdout: 'codex-cli 0.121.0' });
      });

      const policy = detectCodexHookPolicy({
        workspaceRoot,
        runCommand,
        now: clock.now,
        currentDate: clock.currentDate,
        useCache: false,
      });

      expect(policy.hooks).toBe('live');
      expect(runCommand).toHaveBeenCalledTimes(1);
    } finally {
      delete process.env.CODEX_TUI_RECORD_SESSION;
      delete process.env.CODEX_TUI_SESSION_LOG_PATH;
      delete process.env.CODEX_CI;
      delete process.env.CODEX_THREAD_ID;
      fs.rmSync(workspaceRoot, { recursive: true, force: true });
    }
  });

  it('detects repo-local settings JSON as the authoritative registration signal', () => {
    const clock = fixedClock();
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-hook-policy-'));
    writeCodexSettings(workspaceRoot, JSON.stringify({
      hooks: {
        UserPromptSubmit: [{ command: 'node dist/hooks/codex/user-prompt-submit.js' }],
        PreToolUse: [{ command: 'node dist/hooks/codex/pre-tool-use.js' }],
      },
    }));

    try {
      const policy = detectCodexHookPolicy({
        workspaceRoot,
        runCommand: () => probeResult({ stdout: 'codex-cli 0.121.0' }),
        now: clock.now,
        currentDate: clock.currentDate,
        useCache: false,
      });

      expect(policy.hooks).toBe('live');
      expect(policy.diagnostics.reason).toBeUndefined();
    } finally {
      fs.rmSync(workspaceRoot, { recursive: true, force: true });
    }
  });

  it('caches the probe result once per process session', () => {
    const clock = fixedClock();
    const runCommand = vi.fn(() => probeResult({ stdout: 'codex-cli 0.121.0' }));

    const first = detectCodexHookPolicy({
      runCommand,
      now: clock.now,
      currentDate: clock.currentDate,
    });
    const second = detectCodexHookPolicy({
      runCommand,
      now: clock.now,
      currentDate: clock.currentDate,
    });

    expect(first).toBe(second);
    expect(runCommand).toHaveBeenCalledTimes(1);
  });
});
