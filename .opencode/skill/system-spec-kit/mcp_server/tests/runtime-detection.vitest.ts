// ───────────────────────────────────────────────────────────────
// TEST: Runtime Detection
// ───────────────────────────────────────────────────────────────
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect, afterEach } from 'vitest';
import { clearCodexHookPolicyCacheForTests } from '../lib/codex-hook-policy.js';
import { detectRuntime, areHooksAvailable, getRecoveryApproach } from '../code_graph/lib/runtime-detection.js';

function clearRuntimeEnv(): void {
  delete process.env.CLAUDE_CODE;
  delete process.env.CLAUDE_SESSION_ID;
  delete process.env.MCP_SERVER_NAME;
  delete process.env.CODEX_CLI;
  delete process.env.CODEX_THREAD_ID;
  delete process.env.CODEX_TUI_RECORD_SESSION;
  delete process.env.CODEX_TUI_SESSION_LOG_PATH;
  delete process.env.CODEX_SANDBOX;
  delete process.env.OPENAI_API_KEY;
  delete process.env.COPILOT_CLI;
  delete process.env.GITHUB_COPILOT_TOKEN;
  delete process.env.GEMINI_CLI;
  delete process.env.GOOGLE_GENAI_USE_VERTEXAI;
}

describe('runtime detection', () => {
  const originalEnv = { ...process.env };
  const originalCwd = process.cwd();
  let tempDir: string | null = null;

  afterEach(() => {
    if (tempDir) {
      process.chdir(originalCwd);
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
    clearCodexHookPolicyCacheForTests();

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

    it('detects codex-cli when CODEX_THREAD_ID is present', () => {
      process.env.CODEX_THREAD_ID = 'thread-123';
      const result = detectRuntime();
      expect(result.runtime).toBe('codex-cli');
      expect(['live', 'partial', 'unavailable']).toContain(result.hookPolicy);
    });

    it('detects copilot-cli with enabled hooks when repo hook config is present', () => {
      clearRuntimeEnv();
      process.env.COPILOT_CLI = '1';
      const result = detectRuntime();
      expect(result.runtime).toBe('copilot-cli');
      expect(result.hookPolicy).toBe('enabled');
    });

    it('treats copilot-cli as disabled_by_scope when no repo hook config exists', () => {
      clearRuntimeEnv();
      process.env.COPILOT_CLI = '1';

      tempDir = mkdtempSync(join(tmpdir(), 'copilot-runtime-'));
      process.chdir(tempDir);

      const result = detectRuntime();
      expect(result.runtime).toBe('copilot-cli');
      expect(result.hookPolicy).toBe('disabled_by_scope');
    });

    it('detects unknown runtime by default', () => {
      delete process.env.CLAUDE_CODE;
      delete process.env.CLAUDE_SESSION_ID;
      delete process.env.CODEX_CLI;
      delete process.env.CODEX_THREAD_ID;
      delete process.env.CODEX_TUI_RECORD_SESSION;
      delete process.env.CODEX_TUI_SESSION_LOG_PATH;
      delete process.env.COPILOT_CLI;
      delete process.env.GEMINI_CLI;
      const result = detectRuntime();
      expect(result.runtime).toBe('unknown');
    });

    it('treats null Gemini hooks blocks as disabled_by_scope', () => {
      delete process.env.CLAUDE_CODE;
      delete process.env.CLAUDE_SESSION_ID;
      delete process.env.MCP_SERVER_NAME;
      delete process.env.CODEX_CLI;
      delete process.env.CODEX_THREAD_ID;
      delete process.env.CODEX_TUI_RECORD_SESSION;
      delete process.env.CODEX_TUI_SESSION_LOG_PATH;
      delete process.env.COPILOT_CLI;
      process.env.GEMINI_CLI = '1';

      tempDir = mkdtempSync(join(tmpdir(), 'gemini-runtime-'));
      mkdirSync(join(tempDir, '.gemini'), { recursive: true });
      writeFileSync(
        join(tempDir, '.gemini', 'settings.json'),
        JSON.stringify({ hooks: null, hooksConfig: null }),
        'utf8',
      );
      process.chdir(tempDir);

      const result = detectRuntime();
      expect(result.runtime).toBe('gemini-cli');
      expect(result.hookPolicy).toBe('disabled_by_scope');
    });
  });

  describe('areHooksAvailable', () => {
    it('returns true for claude-code', () => {
      process.env.CLAUDE_CODE = '1';
      expect(areHooksAvailable()).toBe(true);
    });

    it('returns false for unknown runtime', () => {
      clearRuntimeEnv();
      expect(areHooksAvailable()).toBe(false);
    });
  });

  describe('getRecoveryApproach', () => {
    it('returns hooks for claude-code', () => {
      process.env.CLAUDE_CODE = '1';
      expect(getRecoveryApproach()).toBe('hooks');
    });

    it('returns tool_fallback for unknown', () => {
      clearRuntimeEnv();
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });
  });
});
