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

const CLAUDE_HOME = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.claude',
);
const CLAUDE_PROJECTS = path.join(CLAUDE_HOME, 'projects');
const CLAUDE_HISTORY = path.join(CLAUDE_HOME, 'history.jsonl');
const MAX_HISTORY_CANDIDATES = 5;
const MAX_EXCHANGES_DEFAULT = 20;

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

async function getRecentSessionCandidates(projectRoot: string): Promise<string[]> {
  if (!fsSync.existsSync(CLAUDE_HISTORY)) {
    return [];
  }

  try {
    const content = await fs.readFile(CLAUDE_HISTORY, 'utf-8');
    const seen = new Set<string>();
    const candidates: string[] = [];
    const lines = content.split('\n');

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (!line) {
        continue;
      }

      let parsed: ClaudeHistoryEntry;
      try {
        parsed = JSON.parse(line) as ClaudeHistoryEntry;
      } catch {
        continue;
      }

      if (!isSameWorkspacePath(projectRoot, parsed.project) || typeof parsed.sessionId !== 'string') {
        continue;
      }

      if (seen.has(parsed.sessionId)) {
        continue;
      }

      seen.add(parsed.sessionId);
      candidates.push(parsed.sessionId);

      if (candidates.length >= MAX_HISTORY_CANDIDATES) {
        break;
      }
    }

    return candidates;
  } catch {
    return [];
  }
}

async function resolveTranscriptPath(projectRoot: string): Promise<string | null> {
  const projectDirs = Array.from(new Set(
    getWorkspacePathVariants(projectRoot)
      .map((workspacePath) => path.join(CLAUDE_PROJECTS, sanitizeProjectRoot(workspacePath)))
      .filter((projectDir) => fsSync.existsSync(projectDir))
  ));

  if (projectDirs.length === 0) {
    return null;
  }

  const sessionCandidates = await getRecentSessionCandidates(projectRoot);
  const matchingCandidates = projectDirs.flatMap((projectDir) =>
    sessionCandidates
      .map((sessionId) => path.join(projectDir, `${sessionId}.jsonl`))
      .filter((candidatePath) => fsSync.existsSync(candidatePath))
  );

  if (matchingCandidates.length > 0) {
    const stats = await Promise.all(
      matchingCandidates.map(async (candidatePath) => ({
        candidatePath,
        mtimeMs: (await fs.stat(candidatePath)).mtimeMs,
      })),
    );
    stats.sort((a, b) => b.mtimeMs - a.mtimeMs);
    return stats[0]?.candidatePath || null;
  }

  const allCandidates = (await Promise.all(
    projectDirs.map(async (projectDir) =>
      (await fs.readdir(projectDir))
        .filter((entry) => entry.endsWith('.jsonl'))
        .map((entry) => path.join(projectDir, entry))
    )
  )).flat();

  if (allCandidates.length === 0) {
    return null;
  }

  const stats = await Promise.all(
    allCandidates.map(async (candidatePath) => ({
      candidatePath,
      mtimeMs: (await fs.stat(candidatePath)).mtimeMs,
    })),
  );
  stats.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return stats[0]?.candidatePath || null;
}

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

export async function captureClaudeConversation(
  maxExchanges: number = MAX_EXCHANGES_DEFAULT,
  projectRoot: string,
): Promise<OpencodeCapture | null> {
  const transcriptPath = await resolveTranscriptPath(projectRoot);
  if (!transcriptPath) {
    return null;
  }

  const transcriptLines = await readJsonl(transcriptPath);
  if (transcriptLines.length === 0) {
    return null;
  }

  const pendingPrompts: PendingPrompt[] = [];
  const exchanges: CaptureExchange[] = [];
  const toolCalls: CaptureToolCall[] = [];
  const toolCallIndexById = new Map<string, number>();
  const snapshotPaths = new Set<string>();
  let discoveredSessionId = path.basename(transcriptPath, '.jsonl');

  for (const line of transcriptLines) {
    const event = line as ClaudeTranscriptEvent;

    if (typeof event.sessionId === 'string' && event.sessionId.trim().length > 0) {
      discoveredSessionId = event.sessionId;
    }

    if (event.type === 'file-history-snapshot') {
      const timestamp = event.snapshot?.timestamp || event.timestamp || new Date().toISOString();
      const tracked = event.snapshot?.trackedFileBackups || {};

      for (const absolutePath of Object.keys(tracked)) {
        if (snapshotPaths.has(absolutePath)) {
          continue;
        }

        snapshotPaths.add(absolutePath);
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
        const input = typeof block.input === 'object' && block.input !== null
          ? block.input as Record<string, unknown>
          : {};
        const title = typeof input.description === 'string'
          ? input.description
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
    if (pendingPrompt) {
      exchanges.push({
        userInput: pendingPrompt.prompt,
        assistantResponse: assistantText,
        timestamp: pendingPrompt.timestamp || event.timestamp || new Date().toISOString(),
      });
    }
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
      session_created: transcriptTimestamp(String(sortedExchanges[0]?.timestamp || '')),
      session_updated: transcriptTimestamp(String(sortedExchanges.at(-1)?.timestamp || '')),
      file_summary: {
        transcriptPath,
      },
    },
    sessionId: discoveredSessionId,
    sessionTitle,
    capturedAt: new Date().toISOString(),
  };
}

export {
  CLAUDE_HISTORY,
  CLAUDE_HOME,
  CLAUDE_PROJECTS,
  sanitizeProjectRoot,
};
