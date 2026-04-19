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

describe('Codex hook policy detector', () => {
  it('returns live when version and hook probes succeed', () => {
    const clock = fixedClock();
    const runCommand = vi.fn((command: CodexProbeCommand) => {
      if (command.args.includes('--version')) {
        return probeResult({ stdout: 'codex-cli 0.121.0\n' });
      }
      return probeResult({ stdout: 'UserPromptSubmit\nPreToolUse\n' });
    });

    const policy = detectCodexHookPolicy({
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
    expect(runCommand).toHaveBeenCalledWith({
      command: 'codex',
      args: ['--version'],
      timeoutMs: 500,
    });
    expect(runCommand).toHaveBeenCalledWith({
      command: 'codex',
      args: ['hooks', 'list'],
      timeoutMs: 500,
    });
  });

  it('returns partial when version is known but hook probe fails', () => {
    const clock = fixedClock();
    const policy = detectCodexHookPolicy({
      runCommand: (command) => command.args.includes('--version')
        ? probeResult({ stdout: 'codex-cli 0.121.0' })
        : probeResult({ ok: false, exitCode: 2, stderr: 'unexpected argument list' }),
      now: clock.now,
      currentDate: clock.currentDate,
      useCache: false,
    });

    expect(policy.hooks).toBe('partial');
    expect(policy.diagnostics.codexVersion).toBe('codex-cli 0.121.0');
    expect(policy.diagnostics.reason).toBe('CODEX_HOOKS_PROBE_FAILED');
  });

  it('returns unavailable when any probe times out', () => {
    const clock = fixedClock();
    const versionTimeout = detectCodexHookPolicy({
      runCommand: () => probeResult({ ok: false, timedOut: true, exitCode: null, errorCode: 'ETIMEDOUT' }),
      now: clock.now,
      currentDate: clock.currentDate,
      useCache: false,
    });

    expect(versionTimeout.hooks).toBe('unavailable');
    expect(versionTimeout.diagnostics.reason).toBe('CODEX_VERSION_PROBE_TIMEOUT');

    const hooksTimeout = detectCodexHookPolicy({
      runCommand: (command) => command.args.includes('--version')
        ? probeResult({ stdout: 'codex-cli 0.121.0' })
        : probeResult({ ok: false, timedOut: true, exitCode: null, errorCode: 'ETIMEDOUT' }),
      now: clock.now,
      currentDate: clock.currentDate,
      useCache: false,
    });

    expect(hooksTimeout.hooks).toBe('unavailable');
    expect(hooksTimeout.diagnostics.codexVersion).toBe('codex-cli 0.121.0');
    expect(hooksTimeout.diagnostics.reason).toBe('CODEX_HOOKS_PROBE_TIMEOUT');
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
    expect(runCommand).toHaveBeenCalledTimes(2);
  });
});
