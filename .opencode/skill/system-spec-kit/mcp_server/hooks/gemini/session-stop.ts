#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Gemini SessionEnd Hook — Session Stop
// ───────────────────────────────────────────────────────────────
// Runs on Gemini CLI SessionEnd event. Saves session state and
// detects the active spec folder from transcript.
//
// Unlike Claude's Stop hook, we don't parse Gemini transcripts for
// token usage — the format differs and isn't documented yet.
//
// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
//                 timestamp, reason: "exit"|"clear"|"logout"|"other" }

import { readFileSync, statSync } from 'node:fs';
import {
  hookLog, withTimeout, HOOK_TIMEOUT_MS,
} from '../claude/shared.js';
import { ensureStateDir, updateState, cleanStaleStates } from '../claude/hook-state.js';
import { parseGeminiStdin } from './shared.js';

/** Default max age for stale state cleanup in --finalize mode */
const FINALIZE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/** F056: Max transcript size to read (5 MB). Prevents OOM on very large sessions. */
const MAX_TRANSCRIPT_BYTES = 5_000_000;

/** Detect active spec folder from transcript content */
function detectSpecFolder(transcriptPath: string): string | null {
  try {
    // F056: Guard against unbounded reads of large transcripts
    const stat = statSync(transcriptPath);
    if (stat.size > MAX_TRANSCRIPT_BYTES) {
      hookLog('warn', 'gemini:session-stop', `Transcript too large (${stat.size} bytes > ${MAX_TRANSCRIPT_BYTES}); skipping spec folder detection`);
      return null;
    }
    const content = readFileSync(transcriptPath, 'utf-8');
    const specMatch = content.match(/\.opencode\/specs\/[\w-]+\/[\w-]+\//g);
    if (specMatch && specMatch.length > 0) {
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

/**
 * Extract a brief summary from the prompt response.
 * Truncates to ~200 chars at the nearest sentence boundary.
 */
function extractSessionSummary(message: string): string {
  const trimmed = message.trim();
  if (trimmed.length <= 200) return trimmed;

  const slice = trimmed.slice(0, 200);
  const lastSentenceEnd = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('.\n'),
    slice.lastIndexOf('! '),
    slice.lastIndexOf('? '),
  );

  if (lastSentenceEnd > 80) {
    return slice.slice(0, lastSentenceEnd + 1);
  }

  return slice + '...';
}

async function main(): Promise<void> {
  ensureStateDir();

  // --finalize mode: manual cleanup of stale session states
  if (process.argv.includes('--finalize')) {
    const removed = cleanStaleStates(FINALIZE_MAX_AGE_MS);
    hookLog('info', 'gemini:session-stop', `Finalize: cleaned ${removed} stale state file(s) older than 24h`);
    return;
  }

  const input = await withTimeout(parseGeminiStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'gemini:session-stop', 'No stdin input received');
    return;
  }

  const sessionId = input.session_id ?? 'unknown';
  hookLog('info', 'gemini:session-stop', `SessionEnd hook fired for session ${sessionId} (reason: ${input.reason ?? 'unknown'})`);

  // Auto-detect spec folder from transcript
  if (input.transcript_path) {
    const detectedSpec = detectSpecFolder(input.transcript_path);
    if (detectedSpec) {
      updateState(sessionId, { lastSpecFolder: detectedSpec });
      hookLog('info', 'gemini:session-stop', `Auto-detected spec folder: ${detectedSpec}`);
    }
  }

  // Extract session summary from prompt_response if available (AfterAgent context)
  if (input.prompt_response && typeof input.prompt_response === 'string') {
    const text = extractSessionSummary(input.prompt_response);
    updateState(sessionId, {
      sessionSummary: { text, extractedAt: new Date().toISOString() },
    });
    hookLog('info', 'gemini:session-stop', `Session summary extracted (${text.length} chars)`);
  }

  hookLog('info', 'gemini:session-stop', `Session ${sessionId} stop processing complete`);
}

// Run — exit cleanly even on error
main().catch((err: unknown) => {
  hookLog('error', 'gemini:session-stop', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
