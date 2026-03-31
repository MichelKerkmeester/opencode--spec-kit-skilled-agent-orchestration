// ───────────────────────────────────────────────────────────────
// TEST: Runtime Detection
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { detectRuntime, areHooksAvailable, getRecoveryApproach } from '../lib/code-graph/runtime-detection.js';

describe('runtime detection', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    // Restore original env
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    }
    Object.assign(process.env, originalEnv);
  });

  describe('detectRuntime', () => {
    it('detects claude-code when CLAUDE_CODE=1', () => {
      process.env.CLAUDE_CODE = '1';
      const result = detectRuntime();
      expect(result.runtime).toBe('claude-code');
      expect(result.hookPolicy).toBe('enabled');
    });

    it('detects unknown runtime by default', () => {
      delete process.env.CLAUDE_CODE;
      delete process.env.CLAUDE_SESSION_ID;
      delete process.env.CODEX_CLI;
      delete process.env.COPILOT_CLI;
      delete process.env.GEMINI_CLI;
      const result = detectRuntime();
      expect(result.runtime).toBe('unknown');
    });
  });

  describe('areHooksAvailable', () => {
    it('returns true for claude-code', () => {
      process.env.CLAUDE_CODE = '1';
      expect(areHooksAvailable()).toBe(true);
    });

    it('returns false for unknown runtime', () => {
      delete process.env.CLAUDE_CODE;
      delete process.env.CLAUDE_SESSION_ID;
      delete process.env.MCP_SERVER_NAME;
      expect(areHooksAvailable()).toBe(false);
    });
  });

  describe('getRecoveryApproach', () => {
    it('returns hooks for claude-code', () => {
      process.env.CLAUDE_CODE = '1';
      expect(getRecoveryApproach()).toBe('hooks');
    });

    it('returns tool_fallback for unknown', () => {
      delete process.env.CLAUDE_CODE;
      delete process.env.CLAUDE_SESSION_ID;
      delete process.env.MCP_SERVER_NAME;
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });
  });
});
