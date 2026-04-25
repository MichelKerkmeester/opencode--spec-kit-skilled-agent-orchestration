// ───────────────────────────────────────────────────────────────
// TEST: Cross-Runtime Fallback
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, afterEach } from 'vitest';
import { createRuntimeFixture, setRuntimeEnv, clearRuntimeEnv } from './fixtures/runtime-fixtures.js';
import { clearCodexHookPolicyCacheForTests } from '../lib/codex-hook-policy.js';
import { detectRuntime, areHooksAvailable, getRecoveryApproach } from '../code_graph/lib/runtime-detection.js';

const CANONICAL_RUNTIME_HOOK_VOCABULARY = {
  'claude-code': {
    prompt: 'UserPromptSubmit',
    lifecycle: 'SessionStart',
    compaction: 'PreCompact',
    stop: 'Stop',
  },
  'codex-cli': {
    prompt: 'UserPromptSubmit',
    lifecycle: 'SessionStart',
    compaction: null,
    stop: null,
  },
  'copilot-cli': {
    prompt: 'UserPromptSubmit',
    lifecycle: 'SessionStart',
    compaction: null,
    stop: null,
  },
  'gemini-cli': {
    prompt: 'BeforeAgent',
    lifecycle: 'SessionStart',
    compaction: 'PreCompress',
    stop: 'SessionEnd',
  },
} as const;

describe('cross-runtime fallback', () => {
  afterEach(() => {
    clearRuntimeEnv();
    clearCodexHookPolicyCacheForTests();
  });

  describe('each runtime gets correct recovery approach', () => {
    const runtimes = ['claude-code', 'codex-cli', 'copilot-cli', 'gemini-cli'] as const;
    for (const runtime of runtimes) {
      it(`${runtime} has correct fixture`, () => {
        const fixture = createRuntimeFixture(runtime);
        expect(fixture.runtime).toBe(runtime);
        expect(fixture.supports.toolFallback).toBe(true);
      });

      it(`${runtime} detection matches fixture`, () => {
        setRuntimeEnv(runtime);
        const detected = detectRuntime();
        const fixture = createRuntimeFixture(runtime);
        expect(detected.runtime).toBe(fixture.runtime);
        if (runtime === 'gemini-cli') {
          expect(detected.hookPolicy).toBe('unavailable');
          expect(CANONICAL_RUNTIME_HOOK_VOCABULARY[runtime].prompt).toBe('BeforeAgent');
          return;
        }
        expect(detected.hookPolicy).toBe(fixture.hookPolicy);
      });
    }
  });

  describe('tool fallback available for all runtimes', () => {
    it('all runtimes support tool fallback', () => {
      for (const rt of ['claude-code', 'codex-cli', 'copilot-cli', 'gemini-cli'] as const) {
        expect(createRuntimeFixture(rt).supports.toolFallback).toBe(true);
      }
    });
  });

  describe('hook-based recovery for configured runtimes', () => {
    it('claude-code uses hooks', () => {
      setRuntimeEnv('claude-code');
      expect(getRecoveryApproach()).toBe('hooks');
    });
    it('codex-cli uses the recovery approach implied by dynamic hook policy', () => {
      setRuntimeEnv('codex-cli');
      const detected = detectRuntime();
      expect(getRecoveryApproach()).toBe(
        detected.hookPolicy === 'unavailable' ? 'tool_fallback' : 'hooks',
      );
    });
    it('copilot-cli uses hooks when repo hook config is present', () => {
      setRuntimeEnv('copilot-cli');
      expect(getRecoveryApproach()).toBe('hooks');
    });
    it('gemini-cli falls back when the fixture does not load repo-root BeforeAgent/SessionStart config', () => {
      setRuntimeEnv('gemini-cli');
      expect(CANONICAL_RUNTIME_HOOK_VOCABULARY['gemini-cli'].lifecycle).toBe('SessionStart');
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });
  });

  describe('7-scenario test matrix (iter 015)', () => {
    // Scenario 1: Claude Code with hooks enabled
    it('claude-code with hooks enabled: hookPolicy is enabled, areHooksAvailable true, recovery is hooks', () => {
      setRuntimeEnv('claude-code');
      const detected = detectRuntime();
      expect(detected.hookPolicy).toBe('enabled');
      expect(areHooksAvailable()).toBe(true);
      expect(getRecoveryApproach()).toBe('hooks');
    });

    // Scenario 2: Claude Code with hooks disabled (no CLAUDE_CODE env set)
    it('no runtime env set: areHooksAvailable false, recovery is tool_fallback', () => {
      clearRuntimeEnv();
      expect(areHooksAvailable()).toBe(false);
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });

    // Scenario 3: Codex CLI
    it('codex-cli: runtime is codex-cli, hookPolicy is dynamic, recovery follows policy', () => {
      setRuntimeEnv('codex-cli');
      const detected = detectRuntime();
      expect(detected.runtime).toBe('codex-cli');
      expect(['live', 'partial', 'unavailable']).toContain(detected.hookPolicy);
      expect(getRecoveryApproach()).toBe(
        detected.hookPolicy === 'unavailable' ? 'tool_fallback' : 'hooks',
      );
    });

    // Scenario 4: Copilot CLI
    it('copilot-cli: runtime is copilot-cli, hookPolicy is enabled, recovery is hooks when repo hook config exists', () => {
      setRuntimeEnv('copilot-cli');
      const detected = detectRuntime();
      expect(detected.runtime).toBe('copilot-cli');
      expect(detected.hookPolicy).toBe('enabled');
      expect(getRecoveryApproach()).toBe('hooks');
    });

    // Scenario 5: Gemini CLI
    it('gemini-cli: runtime is gemini-cli, canonical names stay BeforeAgent/SessionStart/PreCompress/SessionEnd, but fixture recovery is tool_fallback without repo-root settings.json', () => {
      setRuntimeEnv('gemini-cli');
      const detected = detectRuntime();
      expect(detected.runtime).toBe('gemini-cli');
      expect(detected.hookPolicy).toBe('unavailable');
      expect(CANONICAL_RUNTIME_HOOK_VOCABULARY['gemini-cli']).toEqual({
        prompt: 'BeforeAgent',
        lifecycle: 'SessionStart',
        compaction: 'PreCompress',
        stop: 'SessionEnd',
      });
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });

    // Scenario 6: Unknown runtime
    it('unknown runtime: runtime is unknown, hookPolicy is unknown, recovery is tool_fallback', () => {
      clearRuntimeEnv();
      const detected = detectRuntime();
      expect(detected.runtime).toBe('unknown');
      expect(detected.hookPolicy).toBe('unknown');
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });

    // Scenario 7: Runtime detection failure — graceful degradation
    it('runtime detection failure: detectRuntime does not throw, returns valid RuntimeInfo, recovery is tool_fallback', () => {
      clearRuntimeEnv();
      let detected: ReturnType<typeof detectRuntime> | undefined;
      expect(() => { detected = detectRuntime(); }).not.toThrow();
      expect(detected).toBeDefined();
      expect(detected!.runtime).toBeDefined();
      expect(detected!.hookPolicy).toBeDefined();
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });
  });
});
