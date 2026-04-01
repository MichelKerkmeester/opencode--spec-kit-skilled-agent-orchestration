// ───────────────────────────────────────────────────────────────
// TEST: Cross-Runtime Fallback
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, afterEach } from 'vitest';
import { createRuntimeFixture, setRuntimeEnv, clearRuntimeEnv } from './fixtures/runtime-fixtures.js';
import { detectRuntime, areHooksAvailable, getRecoveryApproach } from '../lib/code-graph/runtime-detection.js';

describe('cross-runtime fallback', () => {
  afterEach(() => { clearRuntimeEnv(); });

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

  describe('hook-based recovery only for claude-code', () => {
    it('claude-code uses hooks', () => {
      setRuntimeEnv('claude-code');
      expect(getRecoveryApproach()).toBe('hooks');
    });
    it('codex-cli uses tool_fallback', () => {
      setRuntimeEnv('codex-cli');
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });
    it('copilot-cli uses tool_fallback', () => {
      setRuntimeEnv('copilot-cli');
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });
    it('gemini-cli uses tool_fallback', () => {
      setRuntimeEnv('gemini-cli');
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
    it('codex-cli: runtime is codex-cli, hookPolicy is unavailable, recovery is tool_fallback', () => {
      setRuntimeEnv('codex-cli');
      const detected = detectRuntime();
      expect(detected.runtime).toBe('codex-cli');
      expect(detected.hookPolicy).toBe('unavailable');
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });

    // Scenario 4: Copilot CLI
    it('copilot-cli: runtime is copilot-cli, hookPolicy is disabled_by_scope, recovery is tool_fallback', () => {
      setRuntimeEnv('copilot-cli');
      const detected = detectRuntime();
      expect(detected.runtime).toBe('copilot-cli');
      expect(detected.hookPolicy).toBe('disabled_by_scope');
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });

    // Scenario 5: Gemini CLI (Phase 024: hookPolicy is dynamic, 'unavailable' without .gemini/settings.json)
    it('gemini-cli: runtime is gemini-cli, hookPolicy is unavailable (no settings.json), recovery is tool_fallback', () => {
      setRuntimeEnv('gemini-cli');
      const detected = detectRuntime();
      expect(detected.runtime).toBe('gemini-cli');
      expect(detected.hookPolicy).toBe('unavailable');
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
