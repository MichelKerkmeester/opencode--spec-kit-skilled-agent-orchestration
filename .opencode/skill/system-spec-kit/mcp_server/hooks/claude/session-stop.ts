#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Stop Hook — Session Stop
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code Stop event (async). Parses transcript for
// token usage, stores snapshot, and optionally saves session context.

import { readFileSync } from 'node:fs';
import {
  parseHookStdin, hookLog, withTimeout, HOOK_TIMEOUT_MS,
} from './shared.js';
import { ensureStateDir, loadState, updateState } from './hook-state.js';
import { parseTranscript, estimateCost } from './claude-transcript.js';

/** Auto-save output token threshold */
const AUTO_SAVE_TOKEN_THRESHOLD = 1000;

/** Store a token snapshot in the hook state (lightweight alternative to SQLite) */
function storeTokenSnapshot(
  sessionId: string,
  usage: { promptTokens: number; completionTokens: number; totalTokens: number; model: string | null },
  cost: number,
): void {
  const state = loadState(sessionId);
  if (!state) return;

  updateState(sessionId, {
    metrics: {
      estimatedPromptTokens: usage.promptTokens,
      estimatedCompletionTokens: usage.completionTokens,
      lastTranscriptOffset: 0,
    },
  });

  hookLog('info', 'session-stop', `Token snapshot: ${usage.totalTokens} total (${usage.model ?? 'unknown'}), est. $${cost}`);
}

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'session-stop', 'No stdin input received');
    return;
  }

  // Guard: only run if stop hook is actively being processed
  if (input.stop_hook_active === false) {
    hookLog('info', 'session-stop', 'Stop hook not active, skipping');
    return;
  }

  const sessionId = input.session_id ?? 'unknown';
  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);

  // Parse transcript for token usage
  if (input.transcript_path) {
    const state = loadState(sessionId);
    const startOffset = state?.metrics?.lastTranscriptOffset ?? 0;

    try {
      const { usage, newOffset } = parseTranscript(
        input.transcript_path as string,
        startOffset,
      );

      if (usage.messageCount > 0) {
        const cost = estimateCost(usage);
        storeTokenSnapshot(sessionId, usage, cost);

        // Update offset for incremental parsing on next stop
        updateState(sessionId, {
          metrics: {
            estimatedPromptTokens: usage.promptTokens,
            estimatedCompletionTokens: usage.completionTokens,
            lastTranscriptOffset: newOffset,
          },
        });

        hookLog('info', 'session-stop',
          `Parsed ${usage.messageCount} messages: ${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.totalTokens} total tokens`);
      }
    } catch (err) {
      hookLog('warn', 'session-stop', `Transcript parsing failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Auto-detect spec folder from transcript paths
  if (input.transcript_path) {
    const detectedSpec = detectSpecFolder(input.transcript_path as string);
    if (detectedSpec) {
      updateState(sessionId, { lastSpecFolder: detectedSpec });
      hookLog('info', 'session-stop', `Auto-detected spec folder: ${detectedSpec}`);
    }
  }

  // Auto-save when output tokens exceed threshold
  const state = loadState(sessionId);
  if (state?.metrics?.estimatedCompletionTokens && state.metrics.estimatedCompletionTokens > AUTO_SAVE_TOKEN_THRESHOLD) {
    hookLog('info', 'session-stop', `Completion tokens (${state.metrics.estimatedCompletionTokens}) exceed threshold (${AUTO_SAVE_TOKEN_THRESHOLD}) — auto-save recommended`);
    updateState(sessionId, {
      pendingCompactPrime: {
        payload: `Session had ${state.metrics.estimatedCompletionTokens} completion tokens. Use memory_context({ mode: "resume", profile: "resume" }) to recover full context.`,
        cachedAt: new Date().toISOString(),
      },
    });
  }

  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
}

/** Detect active spec folder from transcript content */
function detectSpecFolder(transcriptPath: string): string | null {
  try {
    const content = readFileSync(transcriptPath, 'utf-8');
    // Look for spec folder paths mentioned in recent messages
    const specMatch = content.match(/\.opencode\/specs\/[\w-]+\/[\w-]+\//g);
    if (specMatch && specMatch.length > 0) {
      // Return the most frequently mentioned spec folder
      const counts = new Map<string, number>();
      for (const p of specMatch) {
        counts.set(p, (counts.get(p) ?? 0) + 1);
      }
      let best = '';
      let bestCount = 0;
      for (const [path, count] of counts) {
        if (count > bestCount) { best = path; bestCount = count; }
      }
      return best || null;
    }
  } catch { /* transcript not readable */ }
  return null;
}

// Run — exit cleanly even on error (async hook, but still must not crash)
main().catch((err) => {
  hookLog('error', 'session-stop', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
