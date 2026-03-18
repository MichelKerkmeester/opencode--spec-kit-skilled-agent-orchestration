// ---------------------------------------------------------------
// MODULE: Codex CLI Capture
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CODEX CLI CAPTURE
// ───────────────────────────────────────────────────────────────
// Captures Codex transcript data from ~/.codex/sessions for
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
  isSameWorkspacePath,
  toWorkspaceRelativePath,
} from '../utils';
import { sanitizeToolDescription } from '../utils/tool-sanitizer';

const CODEX_HOME = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.codex',
);
const CODEX_SESSIONS = path.join(CODEX_HOME, 'sessions');
const MAX_EXCHANGES_DEFAULT = 20;

type CodexSessionMetaPayload = {
  id?: string;
  cwd?: string;
  timestamp?: string;
};

type CodexSessionMetaEntry = {
  type?: string;
  timestamp?: string;
  payload?: CodexSessionMetaPayload;
};

type CodexMessageContentBlock = {
  type?: string;
  text?: string;
};

type CodexMessageEntry = {
  type?: string;
  role?: string;
  content?: unknown;
  timestamp?: string;
};

type CodexFunctionCallEntry = {
  type?: string;
  call_id?: string;
  name?: string;
  arguments?: unknown;
  timestamp?: string;
};

type CodexFunctionCallOutputEntry = {
  type?: string;
  call_id?: string;
  output?: unknown;
  timestamp?: string;
};

type NormalizedCodexEntry =
  | CodexSessionMetaEntry
  | CodexMessageEntry
  | CodexFunctionCallEntry
  | CodexFunctionCallOutputEntry
  | { type?: string; timestamp?: string };

type PendingPrompt = {
  prompt: string;
  timestamp: string;
};

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

function normalizeCodexEntry(entry: unknown): NormalizedCodexEntry | null {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const record = entry as Record<string, unknown>;

  if (record.type === 'response_item' && record.payload && typeof record.payload === 'object') {
    const payload = record.payload as Record<string, unknown>;
    if (payload.type === 'session_meta') {
      return {
        type: 'session_meta',
        timestamp: typeof record.timestamp === 'string'
          ? record.timestamp
          : (typeof payload.timestamp === 'string' ? payload.timestamp : undefined),
        payload: payload as CodexSessionMetaPayload,
      };
    }

    return {
      ...payload,
      timestamp: typeof record.timestamp === 'string'
        ? record.timestamp
        : (typeof payload.timestamp === 'string' ? payload.timestamp : undefined),
    };
  }

  return record as NormalizedCodexEntry;
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
      if (typeof item === 'string') {
        return item;
      }

      if (!item || typeof item !== 'object') {
        return '';
      }

      const block = item as CodexMessageContentBlock;
      if (typeof block.text === 'string') {
        return block.text;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

function normalizeToolName(rawName: unknown): string {
  return typeof rawName === 'string' ? rawName.toLowerCase() : 'unknown';
}

function relativeProjectPath(projectRoot: string, maybeFilePath: string): string {
  return toWorkspaceRelativePath(projectRoot, maybeFilePath);
}

function sanitizeToolInputPaths(projectRoot: string, input: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = { ...input };

  const pathKeys = ['filePath', 'file_path', 'path'];
  for (const key of pathKeys) {
    if (typeof sanitized[key] !== 'string') {
      continue;
    }

    const relativePath = relativeProjectPath(projectRoot, sanitized[key] as string);
    if (relativePath) {
      sanitized[key] = relativePath;
    } else {
      delete sanitized[key];
    }
  }

  const listKeys = ['paths', 'filePaths', 'file_paths'];
  for (const key of listKeys) {
    if (!Array.isArray(sanitized[key])) {
      continue;
    }

    const relativePaths = (sanitized[key] as unknown[])
      .filter((value): value is string => typeof value === 'string')
      .map((value) => relativeProjectPath(projectRoot, value))
      .filter(Boolean);

    if (relativePaths.length > 0) {
      sanitized[key] = relativePaths;
    } else {
      delete sanitized[key];
    }
  }

  return sanitized;
}

function stringifyPreview(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (value === null || value === undefined) {
    return '';
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function parseToolArguments(rawArguments: unknown): Record<string, unknown> {
  if (rawArguments && typeof rawArguments === 'object' && !Array.isArray(rawArguments)) {
    return { ...(rawArguments as Record<string, unknown>) };
  }

  if (typeof rawArguments !== 'string') {
    return {};
  }

  try {
    const parsed = JSON.parse(rawArguments) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return {};
  }

  return {};
}

function buildSessionTitle(exchanges: CaptureExchange[], sessionId: string): string {
  const firstPrompt = exchanges.find((exchange) => (exchange.userInput || '').trim().length > 0);
  if (firstPrompt) {
    return (firstPrompt.userInput || '').trim().slice(0, 80);
  }

  return `Codex CLI session ${sessionId.slice(0, 8)}`;
}

function listTranscriptCandidates(rootDir: string): string[] {
  if (!fsSync.existsSync(rootDir)) {
    return [];
  }

  const candidates: string[] = [];
  const stack: string[] = [rootDir];

  while (stack.length > 0) {
    const currentDir = stack.pop();
    if (!currentDir) {
      continue;
    }

    const entries = fsSync.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name.startsWith('rollout-') && entry.name.endsWith('.jsonl')) {
        candidates.push(entryPath);
      }
    }
  }

  return candidates;
}

async function resolveTranscript(
  projectRoot: string,
): Promise<{ transcriptPath: string; transcriptLines: unknown[] } | null> {
  const candidates = listTranscriptCandidates(CODEX_SESSIONS);
  if (candidates.length === 0) {
    return null;
  }

  const stats = await Promise.all(
    candidates.map(async (candidatePath) => ({
      candidatePath,
      mtimeMs: (await fs.stat(candidatePath)).mtimeMs,
    })),
  );

  stats.sort((a, b) => b.mtimeMs - a.mtimeMs);

  for (const { candidatePath } of stats) {
    const transcriptLines = await readJsonl(candidatePath);
    if (transcriptLines.length === 0) {
      continue;
    }

    const sessionMeta = transcriptLines
      .map((line) => normalizeCodexEntry(line))
      .find((entry) => entry?.type === 'session_meta') as CodexSessionMetaEntry | undefined;

    if (isSameWorkspacePath(projectRoot, sessionMeta?.payload?.cwd)) {
      return { transcriptPath: candidatePath, transcriptLines };
    }
  }

  return null;
}

export async function captureCodexConversation(
  maxExchanges: number = MAX_EXCHANGES_DEFAULT,
  projectRoot: string,
): Promise<OpencodeCapture | null> {
  const resolved = await resolveTranscript(projectRoot);
  if (!resolved) {
    return null;
  }

  const { transcriptPath, transcriptLines } = resolved;
  const pendingPrompts: PendingPrompt[] = [];
  const exchanges: CaptureExchange[] = [];
  const toolCalls: CaptureToolCall[] = [];
  const toolCallIndexById = new Map<string, number>();
  let discoveredSessionId = path.basename(transcriptPath, '.jsonl');
  let sessionCreatedAt = '';
  let sessionUpdatedAt = '';

  for (const line of transcriptLines) {
    const entry = normalizeCodexEntry(line);
    if (!entry) {
      continue;
    }

    if (entry.type === 'session_meta') {
      const sessionMeta = entry as CodexSessionMetaEntry;
      if (typeof sessionMeta.payload?.id === 'string' && sessionMeta.payload.id.trim().length > 0) {
        discoveredSessionId = sessionMeta.payload.id;
      }

      sessionCreatedAt = sessionMeta.payload?.timestamp || sessionMeta.timestamp || sessionCreatedAt;
      continue;
    }

    if (entry.type === 'reasoning') {
      continue;
    }

    if (entry.type === 'message') {
      const messageEntry = entry as CodexMessageEntry;
      const text = extractTextContent(messageEntry.content);
      if (!text) {
        continue;
      }

      if (messageEntry.role === 'user') {
        pendingPrompts.push({
          prompt: text,
          timestamp: messageEntry.timestamp || new Date().toISOString(),
        });
        continue;
      }

      if (messageEntry.role !== 'assistant') {
        continue;
      }

      const pendingPrompt = pendingPrompts.shift();
      if (!pendingPrompt) {
        continue;
      }

      exchanges.push({
        userInput: pendingPrompt.prompt,
        assistantResponse: text,
        timestamp: pendingPrompt.timestamp || messageEntry.timestamp || new Date().toISOString(),
      });
      sessionUpdatedAt = messageEntry.timestamp || sessionUpdatedAt;
      continue;
    }

    if (entry.type === 'function_call') {
      const functionCall = entry as CodexFunctionCallEntry;
      const rawInput = parseToolArguments(functionCall.arguments);
      const input = sanitizeToolInputPaths(projectRoot, rawInput);
      const toolName = normalizeToolName(functionCall.name);
      const title = typeof input.description === 'string'
        ? sanitizeToolDescription(input.description)
        : toolName;

      toolCallIndexById.set(functionCall.call_id || `${toolName}-${toolCalls.length}`, toolCalls.length);
      toolCalls.push({
        tool: toolName,
        title,
        status: 'pending',
        timestamp: functionCall.timestamp || new Date().toISOString(),
        input,
        output: '',
      });
      continue;
    }

    if (entry.type === 'function_call_output') {
      const functionOutput = entry as CodexFunctionCallOutputEntry;
      const toolIndex = toolCallIndexById.get(functionOutput.call_id || '');
      if (toolIndex === undefined) {
        continue;
      }

      const output = stringifyPreview(functionOutput.output);
      const existing = toolCalls[toolIndex];
      toolCalls[toolIndex] = {
        ...existing,
        status: 'completed',
        title: existing.title || output.slice(0, 80) || existing.tool,
        output,
      };
      continue;
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
      session_created: transcriptTimestamp(sessionCreatedAt || String(sortedExchanges[0]?.timestamp || '')),
      session_updated: transcriptTimestamp(sessionUpdatedAt || String(sortedExchanges.at(-1)?.timestamp || '')),
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
  CODEX_HOME,
  CODEX_SESSIONS,
};
