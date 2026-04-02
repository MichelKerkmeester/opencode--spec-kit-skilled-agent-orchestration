// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Detection
// ───────────────────────────────────────────────────────────────
// Detects the active AI runtime and its hook policy.

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Supported runtime identifiers */
export type RuntimeId = 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli' | 'unknown';

/** Hook policy for the detected runtime */
export type HookPolicy = 'enabled' | 'disabled_by_scope' | 'unavailable' | 'unknown';

/** Runtime detection result */
export interface RuntimeInfo {
  runtime: RuntimeId;
  hookPolicy: HookPolicy;
}

/** Detect the current runtime from environment variables and process context */
export function detectRuntime(): RuntimeInfo {
  const env = process.env;

  // Claude Code: sets CLAUDE_CODE or has specific env patterns
  if (env.CLAUDE_CODE === '1' || env.CLAUDE_SESSION_ID || env.MCP_SERVER_NAME === 'context-server') {
    return { runtime: 'claude-code', hookPolicy: 'enabled' };
  }

  // Codex CLI: sets CODEX_CLI or specific env patterns
  if (
    env.CODEX_CLI === '1'
    || typeof env.CODEX_THREAD_ID === 'string'
    || env.CODEX_TUI_RECORD_SESSION === '1'
    || typeof env.CODEX_TUI_SESSION_LOG_PATH === 'string'
    || env.OPENAI_API_KEY && env.CODEX_SANDBOX
  ) {
    return { runtime: 'codex-cli', hookPolicy: 'unavailable' };
  }

  // Copilot CLI: sets specific env patterns
  if (env.COPILOT_CLI === '1' || env.GITHUB_COPILOT_TOKEN) {
    return { runtime: 'copilot-cli', hookPolicy: 'disabled_by_scope' };
  }

  // Gemini CLI: sets specific env patterns
  // Gemini supports hooks when .gemini/settings.json has a 'hooks' or 'hooksConfig' block.
  if (env.GEMINI_CLI === '1' || env.GOOGLE_GENAI_USE_VERTEXAI) {
    const hookPolicy = detectGeminiHookPolicy();
    return { runtime: 'gemini-cli', hookPolicy };
  }

  return { runtime: 'unknown', hookPolicy: 'unknown' };
}

/**
 * Detect whether Gemini CLI has hooks configured.
 * Checks .gemini/settings.json for a 'hooks' or 'hooksConfig' block.
 */
function detectGeminiHookPolicy(): HookPolicy {
  try {
    const settingsPath = resolve(process.cwd(), '.gemini', 'settings.json');
    if (!existsSync(settingsPath)) return 'unavailable';
    const raw = readFileSync(settingsPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const hasHooksBlock = parsed && (
      (parsed.hooks !== null && typeof parsed.hooks === 'object') ||
      (parsed.hooksConfig !== null && typeof parsed.hooksConfig === 'object')
    );
    if (hasHooksBlock) {
      return 'enabled';
    }
    return 'disabled_by_scope';
  } catch {
    return 'unavailable';
  }
}

/** Check if hooks are available for the current runtime */
export function areHooksAvailable(): boolean {
  const { hookPolicy } = detectRuntime();
  return hookPolicy === 'enabled';
}

/** Get the recommended context recovery approach for the current runtime */
export function getRecoveryApproach(): 'hooks' | 'tool_fallback' {
  return areHooksAvailable() ? 'hooks' : 'tool_fallback';
}
