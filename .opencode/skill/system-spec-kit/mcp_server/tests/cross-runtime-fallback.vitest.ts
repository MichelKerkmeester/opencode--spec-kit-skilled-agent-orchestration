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
});
