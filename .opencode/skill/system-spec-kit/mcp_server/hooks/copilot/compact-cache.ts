#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Copilot Compact Cache Hook
// ───────────────────────────────────────────────────────────────
// Builds a cached compact payload for Copilot-driven sessions so the
// SessionStart surface can recover context with explicit provenance.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  hookLog,
  truncateToTokenBudget,
  withTimeout,
  HOOK_TIMEOUT_MS,
  COMPACTION_TOKEN_BUDGET,
  getRequiredSessionId,
} from '../claude/shared.js';
import { ensureStateDir, getProjectHash, updateState } from '../claude/hook-state.js';
import {
  createPreMergeSelectionMetadata,
  createSharedPayloadEnvelope,
} from '../../lib/context/shared-payload.js';
import { wrapRecoveredCompactPayload } from '../shared-provenance.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

const RECOVERED_MARKER_PREFIXES = wrapRecoveredCompactPayload(
  'payload',
  '1970-01-01T00:00:00.000Z',
  {
    producer: 'hook_cache',
    trustState: 'cached',
    sourceSurface: 'copilot-compact-cache',
  },
)
  .split('\n')
  .filter((line) => line.startsWith('[SOURCE:') || line.startsWith('[PROVENANCE:') || line === '[/SOURCE]')
  .map((line) => {
    if (line.startsWith('[SOURCE:')) {
      return '[SOURCE: hook-cache';
    }
    if (line.startsWith('[PROVENANCE:')) {
      return '[PROVENANCE:';
    }
      return line;
  });

if (RECOVERED_MARKER_PREFIXES.length < 3) {
  throw new Error('[speckit-hook:copilot] wrapper format regression: expected >=3 marker prefixes, got ' + RECOVERED_MARKER_PREFIXES.length);
}

const COMPACT_FEEDBACK_GUARDS = [
  ...RECOVERED_MARKER_PREFIXES.map((prefix) => new RegExp(`^\\s*${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')),
  /^\s*##\s+Recovered Context/i,
  /^\s*##\s+Recovery Instructions/i,
  /\bauto-recovered\b/i,
] as const;

/** Parsed JSON payload from the Copilot compact-cache hook stdin channel. */
export interface CopilotHookInput {
  readonly session_id?: string;
  readonly sessionId?: string;
  readonly transcript_path?: string;
  readonly transcriptPath?: string;
  readonly cwd?: string;
  readonly hook_event_name?: string;
  readonly timestamp?: string;
  readonly source?: string;
  readonly trigger?: 'manual' | 'auto' | string;
  readonly [key: string]: unknown;
}

async function parseCopilotStdin(): Promise<CopilotHookInput | null> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString('utf-8').trim();
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CopilotHookInput;
  } catch (err: unknown) {
    hookLog('warn', 'copilot:compact-cache', `Failed to parse hook stdin: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

function tailFile(filePath: string, lines: number): string[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const allLines = content.split('\n');
    return allLines.slice(Math.max(0, allLines.length - lines));
  } catch (_error: unknown) {
    return [];
  }
}

function extractFilePaths(lines: string[]): string[] {
  const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
  const paths = new Set<string>();
  for (const line of lines) {
    const matches = line.match(pathRegex);
    if (matches) {
      for (const match of matches) {
        paths.add(match);
      }
    }
  }
  return [...paths].slice(0, 20);
}

function extractTopics(lines: string[]): string[] {
  const topics = new Set<string>();
  for (const line of lines) {
    const specMatch = line.match(/specs\/[\w-]+/g);
    if (specMatch) {
      specMatch.forEach((match) => topics.add(match));
    }
    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
    if (toolMatch) {
      toolMatch.forEach((match) => topics.add(match));
    }
  }
  return [...topics].slice(0, 10);
}

function detectSpecFolder(lines: string[]): string | null {
  const specFolderRe = /\.opencode\/specs\/[\w/-]+/g;
  const frequency = new Map<string, number>();
  for (const line of lines) {
    const matches = line.match(specFolderRe);
    if (!matches) {
      continue;
    }
    for (const match of matches) {
      const folder = match.replace(/\/[^/]+\.\w+$/, '');
      frequency.set(folder, (frequency.get(folder) ?? 0) + 1);
    }
  }
  if (frequency.size === 0) {
    return null;
  }
  return [...frequency.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}

function stripRecoveredCompactLines(lines: string[]): string[] {
  return lines.filter((line) => !COMPACT_FEEDBACK_GUARDS.some((guard) => guard.test(line)));
}

function buildCompactContext(transcriptLines: string[]): string {
  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
  const filePaths = extractFilePaths(sanitizedLines);
  const topics = extractTopics(sanitizedLines);
  const sections: string[] = [];

  const specFolder = detectSpecFolder(sanitizedLines);
  if (specFolder) {
    sections.push(`## Active Spec Folder\n${specFolder}`);
  }

  if (filePaths.length > 0) {
    sections.push(`## Active Files\n${filePaths.map((filePath) => `- ${filePath}`).join('\n')}`);
  }
  if (topics.length > 0) {
    sections.push(`## Recent Topics\n${topics.map((topic) => `- ${topic}`).join('\n')}`);
  }

  const meaningfulLines = sanitizedLines
    .filter((line) => line.trim().length > 10 && !line.startsWith('{'))
    .slice(-5);
  if (meaningfulLines.length > 0) {
    sections.push(`## Recent Context\n${meaningfulLines.join('\n')}`);
  }

  return sections.join('\n\n');
}

function readSessionId(input: CopilotHookInput): string | undefined {
  return typeof input.session_id === 'string'
    ? input.session_id
    : typeof input.sessionId === 'string'
      ? input.sessionId
      : undefined;
}

function readTranscriptPath(input: CopilotHookInput): string | undefined {
  return typeof input.transcript_path === 'string'
    ? input.transcript_path
    : typeof input.transcriptPath === 'string'
      ? input.transcriptPath
      : undefined;
}

/**
 * Build and persist a fallback compact-context cache for one Copilot session.
 *
 * @param input - Parsed hook input from stdin
 * @returns Persisted cache metadata, or null when no valid input was supplied
 */
export function cacheCompactContext(input: CopilotHookInput | null): {
  sessionId: string;
  payload: string;
  persisted: boolean;
} | null {
  if (!input) {
    hookLog('warn', 'copilot:compact-cache', 'No stdin input received');
    return null;
  }

  ensureStateDir();
  const sessionId = getRequiredSessionId(readSessionId(input), 'copilot:compact-cache');
  hookLog('info', 'copilot:compact-cache', `Compact cache triggered for session ${sessionId} (project: ${getProjectHash()})`);

  const transcriptPath = readTranscriptPath(input);
  const transcriptLines = transcriptPath ? tailFile(transcriptPath, 50) : [];
  if (transcriptPath) {
    hookLog('info', 'copilot:compact-cache', `Read ${transcriptLines.length} transcript lines`);
  }

  const rawContext = buildCompactContext(transcriptLines);
  const payload = truncateToTokenBudget(rawContext, COMPACTION_TOKEN_BUDGET);
  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
  const filePaths = extractFilePaths(sanitizedLines);
  const topics = extractTopics(sanitizedLines);
  const selection = createPreMergeSelectionMetadata({
    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics'],
    fileCount: filePaths.length,
    topicCount: topics.length,
    attentionSignalCount: 0,
    notes: [
      sanitizedLines.length !== transcriptLines.length
        ? 'Recovered compact transcript lines were removed before Copilot cache assembly.'
        : 'No recovered compact transcript lines detected in Copilot cache assembly.',
    ],
    antiFeedbackGuards: [
      'Strip recovered hook-cache source markers before transcript summarization.',
      'Do not reuse recovery wrapper text as session-state evidence.',
    ],
  });

  const timestamp = new Date().toISOString();
  const updateResult = updateState(sessionId, {
    pendingCompactPrime: {
      payload,
      cachedAt: timestamp,
      payloadContract: createSharedPayloadEnvelope({
        kind: 'compaction',
        sections: [{
          key: 'fallback-compact-context',
          title: 'Fallback Compact Context',
          content: payload,
          source: 'session',
        }],
        summary: 'Fallback compaction cache assembled from sanitized Copilot transcript tail',
        provenance: {
          producer: 'hook_cache',
          sourceSurface: 'copilot-compact-cache',
          trustState: 'cached',
          generatedAt: timestamp,
          lastUpdated: null,
          sourceRefs: ['copilot-compact-cache', 'hook-state'],
        },
        selection,
      }),
    },
  });

  if (!updateResult.persisted) {
    hookLog('warn', 'copilot:compact-cache', `Compact context cache was not persisted for session ${sessionId}`);
  } else {
    hookLog('info', 'copilot:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
  }

  return {
    sessionId,
    payload,
    persisted: updateResult.persisted,
  };
}

async function main(): Promise<void> {
  const input = await withTimeout(parseCopilotStdin(), HOOK_TIMEOUT_MS, null);
  cacheCompactContext(input);
}

if (IS_CLI_ENTRY) {
  main().catch((err: unknown) => {
    hookLog('error', 'copilot:compact-cache', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
  }).finally(() => {
    process.exit(0);
  });
}
