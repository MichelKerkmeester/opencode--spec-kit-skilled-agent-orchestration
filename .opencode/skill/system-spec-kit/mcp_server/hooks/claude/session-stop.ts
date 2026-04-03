#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Stop Hook — Session Stop
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code Stop event (async). Parses transcript for
// token usage, stores a snapshot, and updates lightweight session state.

import { spawnSync } from 'node:child_process';
import { openSync, fstatSync, readSync, closeSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseHookStdin, hookLog, withTimeout, HOOK_TIMEOUT_MS,
} from './shared.js';
import { ensureStateDir, loadState, updateState, cleanStaleStates } from './hook-state.js';
import { parseTranscript, estimateCost } from './claude-transcript.js';

/** Default max age (ms) for stale state cleanup in --finalize mode */
const FINALIZE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Limit spec-folder detection to the transcript tail where recent messages live. */
const SPEC_FOLDER_TAIL_BYTES = 50 * 1024;
const SPEC_FOLDER_PATH_RE = /(?:\.opencode\/)?specs\/[^\s"'`]+/g;
const SPEC_FOLDER_PREFIXES = ['.opencode/specs/', 'specs/'] as const;
const SPEC_FOLDER_CANONICAL_PREFIX = 'specs/';
const SPEC_FOLDER_SEGMENT_RE = /^\d{2,3}(?:--|-)[\w-]+$/;
const HOOK_DIR = dirname(fileURLToPath(import.meta.url));
const AUTOSAVE_TIMEOUT_MS = 4000;
const IS_CLI_ENTRY = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;

function resolveGenerateContextScriptPath(): string | null {
  const explicitPath = process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT;
  const candidates = [
    explicitPath?.trim(),
    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
  ].filter((candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0);

  for (const candidate of candidates) {
    try {
      const fileHandle = openSync(candidate, 'r');
      closeSync(fileHandle);
      return candidate;
    } catch {
      // Candidate missing or unreadable — continue.
    }
  }

  return null;
}

function runContextAutosave(sessionId: string): void {
  const state = loadState(sessionId);
  const specFolder = state?.lastSpecFolder?.trim();
  const summary = state?.sessionSummary?.text?.trim();

  if (!specFolder || !summary) {
    return;
  }

  const scriptPath = resolveGenerateContextScriptPath();
  if (!scriptPath) {
    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
    return;
  }

  const payload = {
    specFolder,
    sessionSummary: summary,
    observations: [`Auto-saved from Claude Stop hook for session ${sessionId}.`],
    recent_context: [summary],
    user_prompts: [],
    exchanges: [],
    toolCalls: [],
  };

  const result = spawnSync(
    process.execPath,
    [scriptPath, '--json', JSON.stringify(payload)],
    {
      cwd: process.cwd(),
      encoding: 'utf-8',
      timeout: AUTOSAVE_TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 1024 * 1024,
    },
  );

  if (typeof result.status === 'number' && result.status === 0) {
    hookLog('info', 'session-stop', `Context auto-save completed for ${specFolder}`);
    return;
  }

  const stderr = (result.stderr ?? '').trim();
  const stdout = (result.stdout ?? '').trim();
  const errorText = stderr || stdout || result.error?.message || `exit=${String(result.status)}`;
  hookLog('warn', 'session-stop', `Context auto-save failed: ${errorText}`);
}

function selectDetectedSpecFolder(
  normalizedMatches: string[],
  currentSpecFolder: string | null,
): string | null {
  const uniqueMatches = [...new Set(normalizedMatches)];
  if (uniqueMatches.length === 0) {
    return null;
  }

  if (currentSpecFolder && uniqueMatches.includes(currentSpecFolder)) {
    return currentSpecFolder;
  }

  if (uniqueMatches.length === 1) {
    return uniqueMatches[0];
  }

  return null;
}

/**
 * Extract a brief summary from the last assistant message.
 * Truncates to ~200 chars at the nearest sentence boundary.
 */
function extractSessionSummary(message: string): string {
  const trimmed = message.trim();
  if (trimmed.length <= 200) return trimmed;

  // Find the last sentence-ending punctuation within 200 chars
  const slice = trimmed.slice(0, 200);
  const lastSentenceEnd = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('.\n'),
    slice.lastIndexOf('! '),
    slice.lastIndexOf('?\n'),
    slice.lastIndexOf('? '),
  );

  if (lastSentenceEnd > 80) {
    // Found a reasonable sentence boundary (at least 80 chars in)
    return slice.slice(0, lastSentenceEnd + 1);
  }

  // No good sentence boundary — hard truncate at 200
  return slice + '...';
}

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

  // --finalize mode: manual cleanup of stale session states
  if (process.argv.includes('--finalize')) {
    const removed = cleanStaleStates(FINALIZE_MAX_AGE_MS);
    hookLog('info', 'session-stop', `Finalize: cleaned ${removed} stale state file(s) older than 24h`);
    return;
  }

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
  const stateBeforeStop = loadState(sessionId);
  if (input.transcript_path) {
    const startOffset = stateBeforeStop?.metrics?.lastTranscriptOffset ?? 0;

    try {
      const { usage, newOffset } = await parseTranscript(
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
    } catch (err: unknown) {
      hookLog('warn', 'session-stop', `Transcript parsing failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Auto-detect spec folder from transcript paths
  if (input.transcript_path) {
    const detectedSpec = detectSpecFolder(input.transcript_path as string, stateBeforeStop?.lastSpecFolder ?? null);
    if (!stateBeforeStop?.lastSpecFolder && detectedSpec) {
      updateState(sessionId, { lastSpecFolder: detectedSpec });
      hookLog('info', 'session-stop', `Auto-detected spec folder: ${detectedSpec}`);
    } else if (stateBeforeStop?.lastSpecFolder && detectedSpec === stateBeforeStop.lastSpecFolder) {
      hookLog('info', 'session-stop', `Validated active spec folder from transcript: ${detectedSpec}`);
    } else if (stateBeforeStop?.lastSpecFolder && detectedSpec && detectedSpec !== stateBeforeStop.lastSpecFolder) {
      updateState(sessionId, { lastSpecFolder: detectedSpec });
      hookLog(
        'info',
        'session-stop',
        `Retargeted autosave spec folder from ${stateBeforeStop.lastSpecFolder} to ${detectedSpec}`,
      );
    } else if (!detectedSpec) {
      hookLog('warn', 'session-stop', 'Spec folder detection was ambiguous; preserving existing autosave target.');
    }
  }

  // Extract session summary from last assistant message
  if (input.last_assistant_message) {
    const text = extractSessionSummary(input.last_assistant_message);
    updateState(sessionId, {
      sessionSummary: { text, extractedAt: new Date().toISOString() },
    });
    hookLog('info', 'session-stop', `Session summary extracted (${text.length} chars)`);
  }

  runContextAutosave(sessionId);

  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
}

/** Detect active spec folder from transcript content */
export function detectSpecFolder(transcriptPath: string, currentSpecFolder: string | null = null): string | null {
  let fileDescriptor: number | undefined;

  try {
    fileDescriptor = openSync(transcriptPath, 'r');
    const { size } = fstatSync(fileDescriptor);
    if (size === 0) {
      return null;
    }

    const bytesToRead = Math.min(size, SPEC_FOLDER_TAIL_BYTES);
    const startPosition = Math.max(0, size - bytesToRead);
    const buffer = Buffer.alloc(bytesToRead);
    const bytesRead = readSync(fileDescriptor, buffer, 0, bytesToRead, startPosition);
    const content = buffer.toString('utf-8', 0, bytesRead);
    const specMatches = content.match(SPEC_FOLDER_PATH_RE) ?? [];
    if (specMatches.length === 0) {
      return null;
    }

    const normalizedMatches: string[] = [];
    for (const rawPath of specMatches) {
      const normalizedPath = normalizeSpecFolderPath(rawPath);
      if (!normalizedPath) {
        continue;
      }
      normalizedMatches.push(normalizedPath);
    }

    return selectDetectedSpecFolder(normalizedMatches, currentSpecFolder);
  } catch {
    /* transcript not readable */
  } finally {
    if (fileDescriptor !== undefined) {
      closeSync(fileDescriptor);
    }
  }

  return null;
}

function normalizeSpecFolderPath(rawPath: string): string | null {
  const matchedPrefix = SPEC_FOLDER_PREFIXES.find((prefix) => rawPath.includes(prefix));
  if (!matchedPrefix) {
    return null;
  }

  const relativeSegments = rawPath
    .slice(rawPath.indexOf(matchedPrefix) + matchedPrefix.length)
    .split('/')
    .filter(Boolean);
  const specSegments: string[] = [];

  for (const segment of relativeSegments) {
    if (!SPEC_FOLDER_SEGMENT_RE.test(segment)) {
      break;
    }
    specSegments.push(segment);
  }

  if (specSegments.length === 0) {
    return null;
  }

  return `${SPEC_FOLDER_CANONICAL_PREFIX}${specSegments.join('/')}`;
}

// Run — exit cleanly even on error (async hook, but still must not crash)
if (IS_CLI_ENTRY) {
  main().catch((err: unknown) => {
    hookLog('error', 'session-stop', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
  }).finally(() => {
    process.exit(0);
  });
}
