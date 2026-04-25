// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Detection
// ───────────────────────────────────────────────────────────────
// Detects the active AI runtime and its hook policy.

import { existsSync, readFileSync } from 'node:fs';
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
 * Detect whether Gemini CLI has Spec Kit hook surfaces configured.
 * Accepts both Gemini-native names and the normalized aliases used in docs/tests.
 */
function detectGeminiHookPolicy(): HookPolicy {
  try {
    const settingsPath = resolve(process.cwd(), '.gemini', 'settings.json');
    if (!existsSync(settingsPath)) return 'unavailable';
    const raw = readFileSync(settingsPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const hooks = parsed?.hooks;
    const hasHookSurface = hooks && typeof hooks === 'object' && (
      hasNamedHookEntries(hooks, 'BeforeAgent')
      || hasNamedHookEntries(hooks, 'SessionStart')
      || hasNamedHookEntries(hooks, 'PreCompress')
      || hasNamedHookEntries(hooks, 'SessionEnd')
      || hasNamedHookEntries(hooks, 'UserPromptSubmit')
      || hasNamedHookEntries(hooks, 'PreCompact')
      || hasNamedHookEntries(hooks, 'Stop')
    );
    if (hasHookSurface) {
      return 'enabled';
    }
    return 'disabled_by_scope';
  } catch {
    return 'unavailable';
  }
}

/**
 * Detect whether Copilot CLI has Spec Kit wrapper parity configured.
 * Reads the shared .claude/settings.local.json matcher wrappers instead of
 * generic .github/hooks/*.json files that may belong to unrelated tools.
 */
function detectCopilotHookPolicy(): HookPolicy {
  try {
    const settingsPath = resolve(process.cwd(), '.claude', 'settings.local.json');
    if (!existsSync(settingsPath)) return 'disabled_by_scope';

    const raw = readFileSync(settingsPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const hooks = parsed?.hooks;
    if (!hooks || typeof hooks !== 'object') {
      return 'disabled_by_scope';
    }

    const hasPromptWrapper = hasCopilotWrapper(hooks, 'UserPromptSubmit', '/hooks/copilot/user-prompt-submit.js');
    const hasStartupWrapper = hasCopilotWrapper(hooks, 'SessionStart', '/hooks/copilot/session-prime.js');
    return hasPromptWrapper && hasStartupWrapper ? 'enabled' : 'disabled_by_scope';
  } catch {
    return 'unavailable';
  }
}

function hasNamedHookEntries(hooks: unknown, eventName: string): boolean {
  if (typeof hooks !== 'object' || hooks === null) {
    return false;
  }
  const entries = (hooks as Record<string, unknown>)[eventName];
  return Array.isArray(entries) && entries.length > 0;
}

function hasCopilotWrapper(hooks: unknown, eventName: string, bashNeedle: string): boolean {
  if (typeof hooks !== 'object' || hooks === null) {
    return false;
  }
  const entries = (hooks as Record<string, unknown>)[eventName];
  if (!Array.isArray(entries)) {
    return false;
  }
  return entries.some((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      return false;
    }
    const record = entry as Record<string, unknown>;
    return record.type === 'command'
      && typeof record.bash === 'string'
      && record.bash.includes(bashNeedle)
      && typeof record.timeoutSec === 'number'
      && Number.isFinite(record.timeoutSec)
      && record.timeoutSec > 0;
  });
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
