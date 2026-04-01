#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Gemini BeforeAgent Hook — Compact Inject (One-Shot)
// ───────────────────────────────────────────────────────────────
// Runs on Gemini CLI BeforeAgent event. Checks for cached compact
// payload from PreCompress hook and injects it once. Subsequent
// BeforeAgent calls are no-ops (one-shot behavior).
//
// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
//                 timestamp, prompt }
//
// Gemini stdout: JSON with hookSpecificOutput.additionalContext
//   → Gemini appends to the agent's prompt

import {
  hookLog, truncateToTokenBudget,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET,
  sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
} from '../claude/shared.js';
import { ensureStateDir, loadState, readCompactPrime, clearCompactPrime } from '../claude/hook-state.js';
import { parseGeminiStdin, formatGeminiOutput } from './shared.js';

const CACHE_TTL_MS = 30 * 60 * 1000;

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseGeminiStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'gemini:compact-inject', 'No stdin input received');
    return;
  }

  const sessionId = input.session_id ?? 'unknown';

  // One-shot: only inject if there's a pending compact payload
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    // No cached payload — this is the normal case for non-post-compress turns
    return;
  }

  const { payload, cachedAt } = pendingCompactPrime;
  const cachedAtMs = new Date(cachedAt).getTime();
  const cacheAgeMs = Date.now() - cachedAtMs;

  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    hookLog('warn', 'gemini:compact-inject', `Rejecting stale compact cache (cached at ${cachedAt})`);
    return;
  }

  const sanitizedPayload = sanitizeRecoveredPayload(payload);
  const wrappedPayload = wrapRecoveredCompactPayload(sanitizedPayload, cachedAt);

  hookLog('info', 'gemini:compact-inject', `Injecting cached compact brief (${sanitizedPayload.length} chars, cached at ${cachedAt})`);

  const state = loadState(sessionId);
  const sections: string[] = [
    '## Recovered Context (Post-Compression)',
    wrappedPayload,
    '',
    '## Recovery Instructions',
    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
  ];

  if (state?.lastSpecFolder) {
    sections.push('', `## Active Spec Folder`, `Last active: ${state.lastSpecFolder}`);
  }

  const rawOutput = truncateToTokenBudget(sections.join('\n'), COMPACTION_TOKEN_BUDGET);
  const output = formatGeminiOutput(rawOutput);
  process.stdout.write(output);

  // Clear compact payload only AFTER stdout write succeeds
  clearCompactPrime(sessionId);

  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
}

// Run — exit cleanly even on error
main().catch((err: unknown) => {
  hookLog('error', 'gemini:compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
