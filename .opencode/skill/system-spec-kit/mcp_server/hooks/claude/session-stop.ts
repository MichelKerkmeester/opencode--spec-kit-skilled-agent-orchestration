#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Stop Hook — Session Stop
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code Stop event (async). Parses transcript for
// token usage, stores a snapshot, and updates lightweight session state.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { openSync, fstatSync, readSync, closeSync, statSync, type Stats } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseHookStdin, hookLog, withTimeout, HOOK_TIMEOUT_MS, getRequiredSessionId,
  type HookInput,
} from './shared.js';
import {
  ensureStateDir, loadState, updateState, cleanStaleStates,
  type HookState, type HookProducerMetadata, type PersistedHookState,
} from './hook-state.js';
import { parseTranscript, estimateCost, type TranscriptUsage } from './claude-transcript.js';

/** Default max age (ms) for stale state cleanup in --finalize mode */
const FINALIZE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Limit spec-folder detection to the transcript tail where recent messages live. */
const DEFAULT_SPEC_FOLDER_TAIL_BYTES = 50 * 1024;
const SPEC_FOLDER_TAIL_BYTES_ENV = 'SPECKIT_STOP_HOOK_SPEC_TAIL_BYTES';
const SPEC_FOLDER_PATH_RE = /(?:\.opencode\/)?specs\/[^\s"'`]+/g;
const SPEC_FOLDER_PREFIXES = ['.opencode/specs/', 'specs/'] as const;
const SPEC_FOLDER_CANONICAL_PREFIX = 'specs/';
const SPEC_FOLDER_SEGMENT_RE = /^\d{2,3}(?:--|-)[\w-]+$/;
const SPEC_FOLDER_NAMESPACE_SEGMENT_RE = /^[a-z][\w-]+$/i;
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

export type SessionStopAutosaveOutcome = 'ran' | 'skipped' | 'failed' | 'deferred';
export type SessionStopRetargetReason =
  | 'detected_different_packet'
  | 'no_previous_packet'
  | 'ambiguous_transcript'
  | 'transcript_io_failed'
  | null;

type SpecFolderDetectionReason =
  | 'current_packet'
  | 'detected_single_packet'
  | 'ambiguous_transcript'
  | 'transcript_io_failed'
  | 'no_match';

interface DetectSpecFolderOptions {
  tailBytes?: number;
}

interface SpecFolderDetectionResult {
  specFolder: string | null;
  reason: SpecFolderDetectionReason;
}

/**
 * Run context autosave using the in-memory merged state returned by the
 * single atomic `updateState()` call.
 *
 * T-SST-10 (R31-002/R32-002): Autosave reads from the merged state carried
 * in-process — NOT from a fresh disk reload. A disk reload here would
 * create a torn-state window where interleaved writers could re-compose
 * fields between the stop hook's atomic write and the autosave spawn.
 */
function runContextAutosave(
  sessionId: string,
  state: PersistedHookState,
): SessionStopAutosaveOutcome {
  const specFolder = state.lastSpecFolder?.trim();
  const summary = state.sessionSummary?.text?.trim();

  if (!specFolder || !summary) {
    return 'skipped';
  }

  const scriptPath = resolveGenerateContextScriptPath();
  if (!scriptPath) {
    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
    return 'skipped';
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
    return 'ran';
  }

  const stderr = (result.stderr ?? '').trim();
  const stdout = (result.stdout ?? '').trim();
  const errorText = stderr || stdout || result.error?.message || `exit=${String(result.status)}`;
  hookLog('warn', 'session-stop', `Context auto-save failed: ${errorText}`);
  return 'failed';
}

export interface SessionStopProcessOptions {
  autosaveMode?: 'enabled' | 'disabled';
}

export interface OperationResult<T = void> {
  status: 'ran' | 'skipped' | 'failed' | 'deferred';
  reason?: string;
  detail?: string;
  value?: T;
}

export interface SessionStopProcessResult {
  touchedPaths: string[];
  parsedMessageCount: number;
  autosaveMode: 'enabled' | 'disabled';
  autosaveOutcome: SessionStopAutosaveOutcome;
  retargetReason: SessionStopRetargetReason;
  producerMetadataWritten: boolean;
  transcriptOutcome: OperationResult<{ parsedMessageCount: number; lastTranscriptOffset: number }>;
  producerMetadataOutcome: OperationResult<HookProducerMetadata>;
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

function resolveSpecFolderTailBytes(explicitTailBytes?: number): number {
  if (Number.isInteger(explicitTailBytes) && explicitTailBytes && explicitTailBytes > 0) {
    return explicitTailBytes;
  }

  const configuredTailBytes = Number.parseInt(process.env[SPEC_FOLDER_TAIL_BYTES_ENV] ?? '', 10);
  if (Number.isInteger(configuredTailBytes) && configuredTailBytes > 0) {
    return configuredTailBytes;
  }

  return DEFAULT_SPEC_FOLDER_TAIL_BYTES;
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

/** Log token snapshot details after transcript parsing succeeds. */
function logTokenSnapshot(
  usage: { promptTokens: number; completionTokens: number; totalTokens: number; model: string | null },
  cost: number,
): void {
  hookLog('info', 'session-stop', `Token snapshot: ${usage.totalTokens} total (${usage.model ?? 'unknown'}), est. $${cost}`);
}

/**
 * Build producer metadata from a pre-captured transcript stat.
 *
 * T-SST-09 (R20-001): The caller MUST pass a transcript stat snapshotted
 * BEFORE `parseTranscript()` runs, so the metadata describes the same
 * transcript generation that was parsed. A re-stat here would produce
 * metadata pointing at a later state than the tokens/offset reflect.
 */
function buildProducerMetadata(
  transcriptPath: string,
  transcriptStat: Stats,
  usage: TranscriptUsage,
): HookProducerMetadata {
  const fingerprint = createHash('sha256')
    .update(`${transcriptPath}:${transcriptStat.size}:${transcriptStat.mtimeMs}`)
    .digest('hex')
    .slice(0, 16);

  return {
    lastClaudeTurnAt: transcriptStat.mtime.toISOString(),
    transcript: {
      path: transcriptPath,
      fingerprint,
      sizeBytes: transcriptStat.size,
      modifiedAt: transcriptStat.mtime.toISOString(),
    },
    cacheTokens: {
      cacheCreationInputTokens: usage.cacheCreationTokens,
      cacheReadInputTokens: usage.cacheReadTokens,
    },
  };
}

export async function processStopHook(
  input: HookInput,
  options: SessionStopProcessOptions = {},
): Promise<SessionStopProcessResult> {
  const autosaveMode = options.autosaveMode ?? 'enabled';
  let parsedMessageCount = 0;
  let producerMetadataWritten = false;
  let autosaveOutcome: SessionStopAutosaveOutcome = 'skipped';
  let retargetReason: SessionStopRetargetReason = null;
  let transcriptOutcome: OperationResult<{ parsedMessageCount: number; lastTranscriptOffset: number }> = {
    status: 'skipped',
    reason: 'no_transcript_path',
  };
  let producerMetadataOutcome: OperationResult<HookProducerMetadata> = {
    status: 'skipped',
    reason: 'no_transcript_path',
  };

  // Guard: only run if stop hook is actively being processed
  if (input.stop_hook_active === false) {
    hookLog('info', 'session-stop', 'Stop hook not active, skipping');
    return {
      touchedPaths: [],
      parsedMessageCount,
      autosaveMode,
      autosaveOutcome,
      retargetReason,
      producerMetadataWritten,
      transcriptOutcome,
      producerMetadataOutcome,
    };
  }

  const sessionId = getRequiredSessionId(input.session_id, 'session-stop');
  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);

  // ────────────────────────────────────────────────────────────────
  // ACCUMULATE PATCH — do NOT write state mid-flight
  // ────────────────────────────────────────────────────────────────
  // T-SST-10 (R31-002/R32-002): Collapse what were previously three
  // independent `recordStateUpdate()` calls (transcript/metrics+producer,
  // spec folder retarget, session summary) into a single atomic
  // `updateState()` at the end of this function. Intermediate writes
  // would create a torn-state window visible to interleaved writers and
  // to the autosave process that previously re-read from disk.
  const stateBeforeStopResult = loadState(sessionId);
  const stateBeforeStop = stateBeforeStopResult.ok ? stateBeforeStopResult.state : null;
  const patch: Partial<HookState> = {};
  let producerMetadata: HookProducerMetadata | null = null;

  // Parse transcript for token usage
  if (input.transcript_path) {
    const transcriptPath = input.transcript_path as string;
    const startOffset = stateBeforeStop?.metrics?.lastTranscriptOffset ?? 0;

    // T-SST-09 (R20-001): Snapshot transcript stat BEFORE parseTranscript()
    // runs so the fingerprint/size/mtime describe the same generation the
    // parser will consume. A re-stat inside buildProducerMetadata would
    // capture a later state than the bytes actually parsed (cursor and
    // metadata describing different transcript generations).
    let preParseStat: Stats | null = null;
    try {
      preParseStat = statSync(transcriptPath);
    } catch (err: unknown) {
      // Leave preParseStat null; the parse attempt below will surface the
      // real error and we simply skip producer-metadata construction.
      hookLog('warn', 'session-stop', `Pre-parse transcript stat failed: ${err instanceof Error ? err.message : String(err)}`);
    }

    try {
      const { usage, newOffset } = await parseTranscript(transcriptPath, startOffset);

      parsedMessageCount = usage.messageCount;
      if (usage.messageCount > 0) {
        const cost = estimateCost(usage);
        logTokenSnapshot(usage, cost);
        transcriptOutcome = {
          status: 'ran',
          value: {
            parsedMessageCount: usage.messageCount,
            lastTranscriptOffset: newOffset,
          },
        };

        if (preParseStat) {
          try {
            producerMetadata = buildProducerMetadata(transcriptPath, preParseStat, usage);
            producerMetadataOutcome = {
              status: 'ran',
              value: producerMetadata,
            };
          } catch (err: unknown) {
            producerMetadataOutcome = {
              status: 'failed',
              reason: 'producer_metadata_failed',
              detail: err instanceof Error ? err.message : String(err),
            };
            hookLog('warn', 'session-stop', `Producer metadata build failed: ${producerMetadataOutcome.detail}`);
          }
        } else {
          producerMetadataOutcome = {
            status: 'failed',
            reason: 'producer_metadata_failed',
            detail: 'Pre-parse transcript stat unavailable',
          };
        }

        patch.metrics = {
          estimatedPromptTokens: usage.promptTokens,
          estimatedCompletionTokens: usage.completionTokens,
          lastTranscriptOffset: newOffset,
        };
        if (producerMetadata) {
          patch.producerMetadata = producerMetadata;
        }

        hookLog('info', 'session-stop',
          `Parsed ${usage.messageCount} messages: ${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.totalTokens} total tokens`);
      } else {
        transcriptOutcome = {
          status: 'skipped',
          reason: 'no_new_messages',
        };
        producerMetadataOutcome = {
          status: 'skipped',
          reason: 'no_new_messages',
        };
      }
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : String(err);
      transcriptOutcome = {
        status: 'failed',
        reason: 'transcript_parse_failed',
        detail,
      };
      producerMetadataOutcome = {
        status: 'failed',
        reason: 'transcript_parse_failed',
        detail,
      };
      hookLog('warn', 'session-stop', `Transcript parsing failed: ${detail}`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // Auto-detect spec folder from transcript paths
  // ────────────────────────────────────────────────────────────────
  // T-SST-11 (R37-002): Refresh lastSpecFolder from a fresh state read
  // immediately before detection, so the "prefer currentSpecFolder"
  // preference inside selectDetectedSpecFolder does not lock in a stale
  // generation if another writer advanced the packet target between
  // handler entry and this step.
  if (input.transcript_path) {
    const refreshedStateResult = loadState(sessionId);
    const refreshedState = refreshedStateResult.ok ? refreshedStateResult.state : null;
    const currentSpecFolder = refreshedState?.lastSpecFolder ?? stateBeforeStop?.lastSpecFolder ?? null;
    const detectedSpec = detectSpecFolderResult(
      input.transcript_path as string,
      currentSpecFolder,
    );
    if (!currentSpecFolder && detectedSpec.specFolder) {
      patch.lastSpecFolder = detectedSpec.specFolder;
      retargetReason = 'no_previous_packet';
      hookLog('info', 'session-stop', `Auto-detected spec folder: ${detectedSpec.specFolder}`);
    } else if (currentSpecFolder && detectedSpec.specFolder === currentSpecFolder) {
      hookLog('info', 'session-stop', `Validated active spec folder from transcript: ${detectedSpec.specFolder}`);
    } else if (
      currentSpecFolder
      && detectedSpec.specFolder
      && detectedSpec.specFolder !== currentSpecFolder
    ) {
      retargetReason = 'detected_different_packet';
      patch.lastSpecFolder = detectedSpec.specFolder;
      hookLog(
        'info',
        'session-stop',
        `Retargeted autosave spec folder from ${currentSpecFolder} to ${detectedSpec.specFolder}`,
      );
    } else if (detectedSpec.reason === 'ambiguous_transcript') {
      retargetReason = 'ambiguous_transcript';
      hookLog('warn', 'session-stop', 'Spec folder detection was ambiguous; preserving existing autosave target.');
    } else if (detectedSpec.reason === 'transcript_io_failed') {
      retargetReason = 'transcript_io_failed';
      hookLog('warn', 'session-stop', 'Spec folder detection skipped: transcript I/O failed; preserving existing autosave target.');
    }
  }

  // Extract session summary from last assistant message
  if (input.last_assistant_message) {
    const text = extractSessionSummary(input.last_assistant_message);
    patch.sessionSummary = { text, extractedAt: new Date().toISOString() };
    hookLog('info', 'session-stop', `Session summary extracted (${text.length} chars)`);
  }

  // ────────────────────────────────────────────────────────────────
  // Single atomic state write
  // ────────────────────────────────────────────────────────────────
  // T-SST-10 (R31-002/R32-002): Apply accumulated patch exactly once.
  // T-SST-12 (R33-003): Consume `persisted: false` — if the write was
  // attempted but did not land on disk, the autosave MUST abort;
  // spawning the continuity script would otherwise persist stale disk
  // state (or a mix of fields from separate generations). When there is
  // nothing to patch (no transcript, no summary, no retarget), no write
  // is attempted and autosave falls through to its own skip logic using
  // the pre-handler state snapshot.
  const touchedPaths: string[] = [];
  let autosaveState: PersistedHookState | null = stateBeforeStop;
  let stateWriteFailed = false;

  if (Object.keys(patch).length > 0) {
    const updateResult = updateState(sessionId, patch);
    autosaveState = updateResult.merged;
    if (updateResult.persisted) {
      touchedPaths.push(updateResult.path);
      if (patch.producerMetadata) {
        producerMetadataWritten = true;
      }
    } else {
      stateWriteFailed = true;
    }
  }

  if (autosaveMode === 'enabled') {
    if (stateWriteFailed) {
      autosaveOutcome = 'failed';
    } else if (!autosaveState) {
      // No pre-existing state and no patch attempted → nothing to save.
      autosaveOutcome = 'skipped';
    } else {
      autosaveOutcome = runContextAutosave(sessionId, autosaveState);
    }
  }

  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
  return {
    touchedPaths,
    parsedMessageCount,
    autosaveMode,
    autosaveOutcome,
    retargetReason,
    producerMetadataWritten,
    transcriptOutcome,
    producerMetadataOutcome,
  };
}

async function main(): Promise<void> {
  ensureStateDir();

  // --finalize mode: manual cleanup of stale session states
  if (process.argv.includes('--finalize')) {
    const cleanup = cleanStaleStates(FINALIZE_MAX_AGE_MS);
    hookLog(
      'info',
      'session-stop',
      `Finalize: cleaned ${cleanup.removed} stale state file(s) older than 24h; skipped ${cleanup.skipped}`,
    );
    return;
  }

  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'session-stop', 'No stdin input received');
    return;
  }
  await processStopHook(input);
}

/** Detect active spec folder from transcript content */
function detectSpecFolderResult(
  transcriptPath: string,
  currentSpecFolder: string | null = null,
  options: DetectSpecFolderOptions = {},
): SpecFolderDetectionResult {
  let fileDescriptor: number | undefined;
  const tailBytes = resolveSpecFolderTailBytes(options.tailBytes);

  try {
    fileDescriptor = openSync(transcriptPath, 'r');
    const { size } = fstatSync(fileDescriptor);
    if (size === 0) {
      return { specFolder: null, reason: 'no_match' };
    }

    const bytesToRead = Math.min(size, tailBytes);
    const startPosition = Math.max(0, size - bytesToRead);
    const buffer = Buffer.alloc(bytesToRead);
    const bytesRead = readSync(fileDescriptor, buffer, 0, bytesToRead, startPosition);
    const content = buffer.toString('utf-8', 0, bytesRead);
    const specMatches = content.match(SPEC_FOLDER_PATH_RE) ?? [];
    if (specMatches.length === 0) {
      return { specFolder: null, reason: 'no_match' };
    }

    const normalizedMatches: string[] = [];
    for (const rawPath of specMatches) {
      const normalizedPath = normalizeSpecFolderPath(rawPath);
      if (!normalizedPath) {
        continue;
      }
      normalizedMatches.push(normalizedPath);
    }
    if (normalizedMatches.length === 0) {
      return { specFolder: null, reason: 'no_match' };
    }

    const detectedSpecFolder = selectDetectedSpecFolder(normalizedMatches, currentSpecFolder);
    if (detectedSpecFolder) {
      return {
        specFolder: detectedSpecFolder,
        reason: detectedSpecFolder === currentSpecFolder ? 'current_packet' : 'detected_single_packet',
      };
    }

    return { specFolder: null, reason: 'ambiguous_transcript' };
  } catch {
    return { specFolder: null, reason: 'transcript_io_failed' };
  } finally {
    if (fileDescriptor !== undefined) {
      closeSync(fileDescriptor);
    }
  }
}

/** Detect active spec folder from transcript content */
export function detectSpecFolder(
  transcriptPath: string,
  currentSpecFolder: string | null = null,
  options: DetectSpecFolderOptions = {},
): string | null {
  return detectSpecFolderResult(transcriptPath, currentSpecFolder, options).specFolder;
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
  let seenNumberedSegment = false;

  for (const segment of relativeSegments) {
    if (SPEC_FOLDER_SEGMENT_RE.test(segment)) {
      seenNumberedSegment = true;
      specSegments.push(segment);
      continue;
    }

    if (!seenNumberedSegment && SPEC_FOLDER_NAMESPACE_SEGMENT_RE.test(segment)) {
      specSegments.push(segment);
      continue;
    }

    if (seenNumberedSegment) {
      break;
    }
    return null;
  }

  if (specSegments.length === 0 || !seenNumberedSegment) {
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
