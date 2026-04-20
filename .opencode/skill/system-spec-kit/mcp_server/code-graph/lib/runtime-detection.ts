// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Detection
// ───────────────────────────────────────────────────────────────
// Detects the active AI runtime and its hook policy.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { detectCodexHookPolicy } from '../../lib/codex-hook-policy.js';

/** Supported runtime identifiers */
export type RuntimeId = 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli' | 'unknown';

/** Hook policy for the detected runtime */
export type HookPolicy = 'enabled' | 'disabled_by_scope' | 'live' | 'partial' | 'unavailable' | 'unknown';

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
    const hookPolicy = detectCodexHookPolicy().hooks;
    return { runtime: 'codex-cli', hookPolicy };
  }

  // Copilot CLI: sets specific env patterns
  if (env.COPILOT_CLI === '1' || env.GITHUB_COPILOT_TOKEN) {
    const hookPolicy = detectCopilotHookPolicy();
    return { runtime: 'copilot-cli', hookPolicy };
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

/**
 * Detect whether Copilot CLI has a repo-local sessionStart hook configured.
 * Checks .github/hooks/*.json for a sessionStart hook entry.
 */
function detectCopilotHookPolicy(): HookPolicy {
  try {
    const hooksDir = resolve(process.cwd(), '.github', 'hooks');
    if (!existsSync(hooksDir)) return 'disabled_by_scope';

    const hookFiles = readdirSync(hooksDir).filter((name) => name.endsWith('.json'));
    if (hookFiles.length === 0) return 'disabled_by_scope';

    for (const fileName of hookFiles) {
      try {
        const raw = readFileSync(resolve(hooksDir, fileName), 'utf-8');
        const parsed = JSON.parse(raw);
        const sessionStartHooks = parsed?.hooks?.sessionStart;
        if (Array.isArray(sessionStartHooks) && sessionStartHooks.length > 0) {
          return 'enabled';
        }
      } catch {
        // Ignore malformed or unrelated hook files and keep scanning.
      }
    }

    return 'disabled_by_scope';
  } catch {
    return 'unavailable';
  }
}

/** Check if hooks are available for the current runtime */
export function areHooksAvailable(): boolean {
  const { hookPolicy } = detectRuntime();
  return hookPolicy === 'enabled' || hookPolicy === 'live' || hookPolicy === 'partial';
}

/** Get the recommended context recovery approach for the current runtime */
export function getRecoveryApproach(): 'hooks' | 'tool_fallback' {
  return areHooksAvailable() ? 'hooks' : 'tool_fallback';
}
