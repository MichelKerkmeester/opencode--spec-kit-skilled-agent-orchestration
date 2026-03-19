// ---------------------------------------------------------------
// MODULE: Claude Code Capture
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CLAUDE CODE CAPTURE
// ───────────────────────────────────────────────────────────────
// Captures Claude Code transcript data from ~/.claude/projects for
// stateless memory-save enrichment.

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

import type {
  CaptureExchange,
  CaptureToolCall,
  OpencodeCapture,
} from '../utils/input-normalizer';
import {
  getWorkspacePathVariants,
  isSameWorkspacePath,
  toWorkspaceRelativePath,
} from '../utils';
import { sanitizeToolDescription, sanitizeToolInputPaths } from '../utils/tool-sanitizer';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
------------------------------------------------------------------*/

const CLAUDE_HOME = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.claude',
);
const CLAUDE_PROJECTS = path.join(CLAUDE_HOME, 'projects');
const CLAUDE_HISTORY = path.join(CLAUDE_HOME, 'history.jsonl');
const MAX_EXCHANGES_DEFAULT = 20;

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
------------------------------------------------------------------*/

type ClaudeHistoryEntry = {
  project?: string;
  sessionId?: string;
  timestamp?: number;
};

type ClaudeTranscriptEvent = {
  type?: string;
  timestamp?: string;
  sessionId?: string;
  uuid?: string;
  isMeta?: boolean;
  message?: {
    content?: unknown;
  };
  snapshot?: {
    trackedFileBackups?: Record<string, unknown>;
    timestamp?: string;
  };
};

type PendingPrompt = {
  prompt: string;
  timestamp: string;
};

export interface ClaudeSessionHints {
  expectedSessionId?: string | null;
  sessionStartTs?: number | null;
  invocationTs?: number | null;
}

type TranscriptCandidate = {
  transcriptPath: string;
  sessionId: string;
  transcriptLines: unknown[];
  sessionCreated: number;
  sessionUpdated: number;
  historyTimestamp: number;
};

/* ───────────────────────────────────────────────────────────────
   3. UTILITY FUNCTIONS
------------------------------------------------------------------*/

function sanitizeProjectRoot(projectRoot: string): string {
  return projectRoot.replace(/[^A-Za-z0-9._-]+/g, '-');
}

function transcriptTimestamp(value?: string): number {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

async function readJsonl(filePath: string): Promise<unknown[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter((entry) => entry !== null);
  } catch {
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   4. HISTORY & TRANSCRIPT RESOLUTION
------------------------------------------------------------------*/

async function readHistoryEntries(projectRoot: string): Promise<ClaudeHistoryEntry[]> {
  if (!fsSync.existsSync(CLAUDE_HISTORY)) {
    return [];
  }

  try {
    const content = await fs.readFile(CLAUDE_HISTORY, 'utf-8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as ClaudeHistoryEntry;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is ClaudeHistoryEntry => (
        entry !== null && isSameWorkspacePath(projectRoot, entry.project)
      ));
  } catch {
    return [];
  }
}

function collectActiveTaskSessionIds(tasksRoot: string): string[] {
  if (!fsSync.existsSync(tasksRoot)) {
    return [];
  }

  const sessionIds = new Set<string>();
  const queue: string[] = [tasksRoot];

  while (queue.length > 0) {
    const currentDir = queue.pop();
    if (!currentDir) {
      continue;
    }

    let entries: fsSync.Dirent[];
    try {
      entries = fsSync.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }

      if (!entry.isFile() || entry.name !== '.lock') {
        continue;
      }

      // Only treat sessions with recently-modified lock files as "active".
      // Stale locks from ended sessions must not influence candidate selection.
      const LOCK_FRESHNESS_MS = 2 * 60 * 60 * 1000; // 2 hours
      try {
        const lockStat = fsSync.statSync(fullPath);
        if (Date.now() - lockStat.mtimeMs > LOCK_FRESHNESS_MS) {
          continue;
        }
      } catch {
        continue;
      }

      const candidateSessionId = path.basename(path.dirname(fullPath));
      if (candidateSessionId && candidateSessionId !== 'tasks') {
        sessionIds.add(candidateSessionId);
      }
    }
  }

  return [...sessionIds];
}

function collectTranscriptEventBounds(transcriptLines: unknown[], transcriptPath: string): {
  sessionCreated: number;
  sessionUpdated: number;
  sessionId: string;
} {
  let sessionCreated = 0;
  let sessionUpdated = 0;
  let discoveredSessionId = path.basename(transcriptPath, '.jsonl');

  for (const line of transcriptLines) {
    const event = line as ClaudeTranscriptEvent;
    if (typeof event.sessionId === 'string' && event.sessionId.trim().length > 0) {
      discoveredSessionId = event.sessionId.trim();
    }

    const timestamp = Math.max(
      transcriptTimestamp(event.timestamp),
      transcriptTimestamp(event.snapshot?.timestamp),
    );
    if (timestamp <= 0) {
      continue;
    }

    if (sessionCreated === 0 || timestamp < sessionCreated) {
      sessionCreated = timestamp;
    }
    if (timestamp > sessionUpdated) {
      sessionUpdated = timestamp;
    }
  }

  return {
    sessionCreated,
    sessionUpdated,
    sessionId: discoveredSessionId,
  };
}

function candidateMatchesTimeWindow(candidate: TranscriptCandidate, sessionHints?: ClaudeSessionHints): boolean {
  if (!sessionHints) {
    return true;
  }

  const sessionUpdated = candidate.sessionUpdated || candidate.sessionCreated;
  if (sessionUpdated <= 0) {
    return false;
  }

  const lowerBound = typeof sessionHints.sessionStartTs === 'number' && Number.isFinite(sessionHints.sessionStartTs)
    ? sessionHints.sessionStartTs - (5 * 60 * 1000)
    : typeof sessionHints.invocationTs === 'number' && Number.isFinite(sessionHints.invocationTs)
      ? sessionHints.invocationTs - (3 * 60 * 60 * 1000)
      : null;
  const upperBound = typeof sessionHints.invocationTs === 'number' && Number.isFinite(sessionHints.invocationTs)
    ? sessionHints.invocationTs + (10 * 60 * 1000)
    : null;

  if (lowerBound !== null && sessionUpdated < lowerBound) {
    return false;
  }

  if (upperBound !== null && sessionUpdated > upperBound) {
    return false;
  }

  return true;
}

async function buildTranscriptCandidates(
  projectDirs: string[],
  historyEntries: ClaudeHistoryEntry[],
): Promise<TranscriptCandidate[]> {
  const historyTimestamps = new Map<string, number>();
  for (const entry of historyEntries) {
    if (typeof entry.sessionId !== 'string') {
      continue;
    }

    const timestamp = typeof entry.timestamp === 'number' && Number.isFinite(entry.timestamp)
      ? entry.timestamp
      : 0;
    const existing = historyTimestamps.get(entry.sessionId) ?? 0;
    if (timestamp > existing) {
      historyTimestamps.set(entry.sessionId, timestamp);
    }
  }

  const transcriptPaths = (await Promise.all(
    projectDirs.map(async (projectDir) =>
      (await fs.readdir(projectDir))
        .filter((entry) => entry.endsWith('.jsonl'))
        .map((entry) => path.join(projectDir, entry))
    )
  )).flat();

  const candidates: TranscriptCandidate[] = [];
  for (const transcriptPath of transcriptPaths) {
    const transcriptLines = await readJsonl(transcriptPath);
    if (transcriptLines.length === 0) {
      continue;
    }

    const bounds = collectTranscriptEventBounds(transcriptLines, transcriptPath);
    candidates.push({
      transcriptPath,
      transcriptLines,
      sessionId: bounds.sessionId,
      sessionCreated: bounds.sessionCreated,
      sessionUpdated: bounds.sessionUpdated,
      historyTimestamp: historyTimestamps.get(bounds.sessionId) ?? 0,
    });
  }

  return candidates;
}

function pickBestCandidate(
  candidates: TranscriptCandidate[],
  sessionHints?: ClaudeSessionHints,
): TranscriptCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  const sortedByHistory = [...candidates].sort((a, b) => (
    b.historyTimestamp - a.historyTimestamp
    || b.sessionUpdated - a.sessionUpdated
    || a.transcriptPath.localeCompare(b.transcriptPath)
  ));
  const sortedByFreshness = [...candidates].sort((a, b) => (
    b.sessionUpdated - a.sessionUpdated
    || b.historyTimestamp - a.historyTimestamp
    || a.transcriptPath.localeCompare(b.transcriptPath)
  ));

  const exactSessionMatches = typeof sessionHints?.expectedSessionId === 'string' && sessionHints.expectedSessionId.trim().length > 0
    ? sortedByFreshness.filter((candidate) => candidate.sessionId === sessionHints.expectedSessionId)
    : [];
  const activeTaskMatches = collectActiveTaskSessionIds(path.join(CLAUDE_HOME, 'tasks'))
    .map((sessionId) => sortedByFreshness.find((candidate) => candidate.sessionId === sessionId) || null)
    .filter((candidate): candidate is TranscriptCandidate => candidate !== null);

  // Exact session ID match is deterministic — return immediately without time window filtering
  if (exactSessionMatches.length > 0) {
    return exactSessionMatches[0];
  }

  const rankedGroups: TranscriptCandidate[][] = [
    activeTaskMatches,
    sortedByHistory.filter((candidate) => candidate.historyTimestamp > 0),
    sortedByFreshness,
  ];
  const seen = new Set<string>();

  for (const group of rankedGroups) {
    for (const candidate of group) {
      if (seen.has(candidate.transcriptPath)) {
        continue;
      }
      seen.add(candidate.transcriptPath);

      if (candidateMatchesTimeWindow(candidate, sessionHints)) {
        return candidate;
      }
    }
  }

  // P1-5: Ambiguity detection — warn when groups 1-2 produced no match
  // and groups 3-4 have multiple candidates within 10 minutes of each other
  const fallbackCandidates = [
    ...sortedByHistory.filter((c) => c.historyTimestamp > 0),
    ...sortedByFreshness,
  ];
  const uniqueFallback = Array.from(new Map(fallbackCandidates.map((c) => [c.transcriptPath, c])).values());
  if (uniqueFallback.length >= 2) {
    const timestamps = uniqueFallback.map((c) => c.sessionUpdated || c.sessionCreated).filter((t) => t > 0).sort((a, b) => b - a);
    if (timestamps.length >= 2 && (timestamps[0] - timestamps[timestamps.length - 1]) <= 10 * 60 * 1000) {
      console.warn(`   Warning: MULTI_SESSION_AMBIGUITY: ${uniqueFallback.length} candidates within 10min window. Specify --session-id for deterministic selection.`);
    }
  }

  return null;
}

async function resolveTranscript(projectRoot: string, sessionHints?: ClaudeSessionHints): Promise<TranscriptCandidate | null> {
  const projectDirs = Array.from(new Set(
    getWorkspacePathVariants(projectRoot)
      .map((workspacePath) => path.join(CLAUDE_PROJECTS, sanitizeProjectRoot(workspacePath)))
      .filter((projectDir) => fsSync.existsSync(projectDir))
  ));

  if (projectDirs.length === 0) {
    return null;
  }

  const historyEntries = await readHistoryEntries(projectRoot);
  const candidatePool = await buildTranscriptCandidates(projectDirs, historyEntries);

  if (candidatePool.length === 0) {
    return null;
  }

  return pickBestCandidate(candidatePool, sessionHints);
}

/* ───────────────────────────────────────────────────────────────
   5. CONTENT EXTRACTION
------------------------------------------------------------------*/

function extractTextContent(content: unknown): string {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return '';
      }

      const block = item as Record<string, unknown>;
      return block.type === 'text' && typeof block.text === 'string'
        ? block.text
        : '';
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

function extractToolResultText(content: unknown): string {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (!item || typeof item !== 'object') {
        return '';
      }

      const block = item as Record<string, unknown>;
      if (block.type === 'text' && typeof block.text === 'string') {
        return block.text;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

function isIgnorableUserPrompt(rawText: string): boolean {
  if (!rawText) {
    return true;
  }

  return (
    rawText.includes('<local-command-caveat>')
    || rawText.includes('<command-name>')
    || rawText.includes('<command-message>')
  );
}

function normalizeToolName(rawName: unknown): string {
  return typeof rawName === 'string' ? rawName.toLowerCase() : 'unknown';
}

function relativeProjectPath(projectRoot: string, maybeFilePath: string): string {
  return toWorkspaceRelativePath(projectRoot, maybeFilePath);
}

function createSnapshotToolCall(
  projectRoot: string,
  filePath: string,
  timestamp: string,
): CaptureToolCall | null {
  const relativePath = relativeProjectPath(projectRoot, filePath);
  if (!relativePath) {
    return null;
  }

  return {
    tool: 'edit',
    title: 'Tracked file history snapshot',
    status: 'snapshot',
    timestamp,
    output: '',
    input: {
      filePath: relativePath,
    },
  };
}

function buildSessionTitle(exchanges: CaptureExchange[], sessionId: string): string {
  const firstPrompt = exchanges.find((exchange) => (exchange.userInput || '').trim().length > 0);
  if (firstPrompt) {
    return (firstPrompt.userInput || '').trim().slice(0, 80);
  }

  return `Claude Code session ${sessionId.slice(0, 8)}`;
}

/* ───────────────────────────────────────────────────────────────
   6. CONVERSATION CAPTURE
------------------------------------------------------------------*/

export async function captureClaudeConversation(
  maxExchanges: number = MAX_EXCHANGES_DEFAULT,
  projectRoot: string,
  sessionHints?: ClaudeSessionHints,
): Promise<OpencodeCapture | null> {
  const transcript = await resolveTranscript(projectRoot, sessionHints);
  if (!transcript) {
    return null;
  }

  const { transcriptPath, transcriptLines, sessionCreated, sessionUpdated, sessionId: resolvedSessionId } = transcript;
  if (transcriptLines.length === 0) {
    return null;
  }

  const pendingPrompts: PendingPrompt[] = [];
  const exchanges: CaptureExchange[] = [];
  const toolCalls: CaptureToolCall[] = [];
  const toolCallIndexById = new Map<string, number>();
  const snapshotPaths = new Set<string>();
  let discoveredSessionId = resolvedSessionId || path.basename(transcriptPath, '.jsonl');

  for (const line of transcriptLines) {
    const event = line as ClaudeTranscriptEvent;

    if (typeof event.sessionId === 'string' && event.sessionId.trim().length > 0) {
      discoveredSessionId = event.sessionId;
    }

    if (event.type === 'file-history-snapshot') {
      const timestamp = event.snapshot?.timestamp || event.timestamp || new Date().toISOString();
      const tracked = event.snapshot?.trackedFileBackups || {};

      for (const absolutePath of Object.keys(tracked)) {
        // Use relative path for dedup to avoid absolute/relative mismatches
        const relativePath = relativeProjectPath(projectRoot, absolutePath);
        const dedupKey = relativePath || absolutePath;
        if (snapshotPaths.has(dedupKey)) {
          continue;
        }

        snapshotPaths.add(dedupKey);
        const snapshotTool = createSnapshotToolCall(projectRoot, absolutePath, timestamp);
        if (snapshotTool) {
          toolCalls.push(snapshotTool);
        }
      }
      continue;
    }

    if (event.type === 'user') {
      const rawContent = event.message?.content;

      if (Array.isArray(rawContent)) {
        for (const item of rawContent) {
          if (!item || typeof item !== 'object') {
            continue;
          }

          const block = item as Record<string, unknown>;
          if (block.type !== 'tool_result' || typeof block.tool_use_id !== 'string') {
            continue;
          }

          const toolCallIndex = toolCallIndexById.get(block.tool_use_id);
          if (toolCallIndex === undefined) {
            continue;
          }

          const status = block.is_error === true ? 'error' : 'completed';
          const output = extractToolResultText(block.content);
          const existing = toolCalls[toolCallIndex];
          toolCalls[toolCallIndex] = {
            ...existing,
            status,
            title: existing.title || output.slice(0, 80) || existing.tool,
            output,
          };
        }
      }

      if (event.isMeta) {
        continue;
      }

      const text = extractTextContent(rawContent);
      if (!text || isIgnorableUserPrompt(text)) {
        continue;
      }

      pendingPrompts.push({
        prompt: text,
        timestamp: event.timestamp || new Date().toISOString(),
      });
      continue;
    }

    // Skip API error messages — they carry no useful session content
    if (event.type === 'assistant' && (event as Record<string, unknown>).isApiErrorMessage === true) {
      continue;
    }

    if (event.type !== 'assistant') {
      continue;
    }

    const assistantContent = event.message?.content;
    if (Array.isArray(assistantContent)) {
      for (const item of assistantContent) {
        if (!item || typeof item !== 'object') {
          continue;
        }

        const block = item as Record<string, unknown>;
        if (block.type !== 'tool_use' || typeof block.id !== 'string') {
          continue;
        }

        const toolName = normalizeToolName(block.name);
        const rawInput = typeof block.input === 'object' && block.input !== null
          ? block.input as Record<string, unknown>
          : {};
        const input = sanitizeToolInputPaths(projectRoot, rawInput);
        const title = typeof input.description === 'string'
          ? sanitizeToolDescription(input.description)
          : toolName;

        toolCallIndexById.set(block.id, toolCalls.length);
        toolCalls.push({
          tool: toolName,
          title,
          status: 'pending',
          timestamp: event.timestamp || new Date().toISOString(),
          output: '',
          input,
        });
      }
    }

    const assistantText = extractTextContent(assistantContent);
    if (!assistantText) {
      continue;
    }

    const pendingPrompt = pendingPrompts.shift();
    exchanges.push({
      userInput: pendingPrompt?.prompt || '',
      assistantResponse: assistantText,
      timestamp: pendingPrompt?.timestamp || event.timestamp || new Date().toISOString(),
    });
  }

  while (pendingPrompts.length > 0) {
    const pendingPrompt = pendingPrompts.shift();
    if (!pendingPrompt) {
      continue;
    }

    exchanges.push({
      userInput: pendingPrompt.prompt,
      assistantResponse: '',
      timestamp: pendingPrompt.timestamp,
    });
  }

  if (exchanges.length === 0 && toolCalls.length === 0) {
    return null;
  }

  const sortedExchanges = exchanges
    .sort((a, b) => transcriptTimestamp(String(a.timestamp)) - transcriptTimestamp(String(b.timestamp)))
    .slice(-Math.max(1, maxExchanges));
  const sessionTitle = buildSessionTitle(sortedExchanges, discoveredSessionId);

  return {
    exchanges: sortedExchanges,
    toolCalls,
      metadata: {
        total_messages: sortedExchanges.length,
        total_responses: sortedExchanges.filter((exchange) => (exchange.assistantResponse || '').trim().length > 0).length,
        total_tool_calls: toolCalls.length,
        session_created: sessionCreated || transcriptTimestamp(String(sortedExchanges[0]?.timestamp || '')),
        session_updated: sessionUpdated || transcriptTimestamp(String(sortedExchanges.at(-1)?.timestamp || '')),
        file_summary: {
          transcriptPath,
        },
        _sourceTranscriptPath: transcriptPath,
        _sourceSessionId: discoveredSessionId,
        _sourceSessionCreated: sessionCreated || transcriptTimestamp(String(sortedExchanges[0]?.timestamp || '')),
        _sourceSessionUpdated: sessionUpdated || transcriptTimestamp(String(sortedExchanges.at(-1)?.timestamp || '')),
      },
    sessionId: discoveredSessionId,
    sessionTitle,
    capturedAt: new Date().toISOString(),
  };
}

/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
------------------------------------------------------------------*/

export {
  CLAUDE_HISTORY,
  CLAUDE_HOME,
  CLAUDE_PROJECTS,
  sanitizeProjectRoot,
};
