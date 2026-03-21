// ---------------------------------------------------------------
// MODULE: Gemini CLI Capture
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. GEMINI CLI CAPTURE
// ───────────────────────────────────────────────────────────────
// Captures Gemini transcript data from ~/.gemini/tmp for
// stateless memory-save enrichment.

/**
 * @deprecated RECOVERY-ONLY — This module is part of the stateless dynamic capture path,
 * which is deprecated for routine saves (Phase 017). In JSON-primary mode, the AI provides
 * structured data directly. This module only executes when --recovery is explicitly passed.
 */

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
} from '../utils';
import { sanitizeToolInputPaths, normalizeToolStatus, isApiErrorContent } from '../utils/tool-sanitizer';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

const GEMINI_HOME = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.gemini',
);
const GEMINI_HISTORY = path.join(GEMINI_HOME, 'history');
const GEMINI_TMP = path.join(GEMINI_HOME, 'tmp');
const MAX_EXCHANGES_DEFAULT = 20;

type GeminiMessageContentBlock = {
  text?: string;
};

type GeminiToolCall = {
  id?: string;
  name?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  status?: string;
  timestamp?: string;
  resultDisplay?: string;
  displayName?: string;
  description?: string;
};

type GeminiMessage = {
  id?: string;
  timestamp?: string;
  type?: string;
  content?: unknown;
  displayContent?: unknown;
  thoughts?: unknown[];
  toolCalls?: GeminiToolCall[];
};

type GeminiSession = {
  sessionId?: string;
  startTime?: string;
  lastUpdated?: string;
  messages?: GeminiMessage[];
};

type PendingPrompt = {
  prompt: string;
  timestamp: string;
};

/* ───────────────────────────────────────────────────────────────
   2. UTILITY FUNCTIONS
------------------------------------------------------------------*/

function transcriptTimestamp(value?: string): number {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
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

      const block = item as GeminiMessageContentBlock;
      return typeof block.text === 'string' ? block.text : '';
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

function normalizeToolName(rawName: unknown): string {
  return typeof rawName === 'string' ? rawName.toLowerCase() : 'unknown';
}

// sanitizeToolInputPaths imported from ../utils/tool-sanitizer

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

function extractToolResultText(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (!Array.isArray(value)) {
    return stringifyPreview(value);
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return stringifyPreview(item);
      }

      const record = item as Record<string, unknown>;
      const functionResponse = record.functionResponse;
      if (!functionResponse || typeof functionResponse !== 'object') {
        return stringifyPreview(record);
      }

      const response = (functionResponse as Record<string, unknown>).response;
      if (!response || typeof response !== 'object') {
        return stringifyPreview(functionResponse);
      }

      return typeof (response as Record<string, unknown>).output === 'string'
        ? (response as Record<string, unknown>).output as string
        : stringifyPreview(response);
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

function buildSessionTitle(exchanges: CaptureExchange[], sessionId: string): string {
  const firstPrompt = exchanges.find((exchange) => (exchange.userInput || '').trim().length > 0);
  if (firstPrompt) {
    return (firstPrompt.userInput || '').trim().slice(0, 80);
  }

  return `Gemini CLI session ${sessionId.slice(0, 8)}`;
}

/* ───────────────────────────────────────────────────────────────
   3. SESSION RESOLUTION
------------------------------------------------------------------*/

function getMatchingProjectDirs(projectRoot: string): string[] {
  if (!fsSync.existsSync(GEMINI_HISTORY)) {
    return [];
  }

  const matches: string[] = [];
  const entries = fsSync.readdirSync(GEMINI_HISTORY, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const projectRootPath = path.join(GEMINI_HISTORY, entry.name, '.project_root');
    if (!fsSync.existsSync(projectRootPath)) {
      continue;
    }

    try {
      const value = fsSync.readFileSync(projectRootPath, 'utf-8').trim();
      if (isSameWorkspacePath(projectRoot, value)) {
        matches.push(entry.name);
      }
    } catch {
      continue;
    }
  }

  return matches;
}

async function resolveSession(projectRoot: string): Promise<{ sessionPath: string; session: GeminiSession } | null> {
  const matchingDirs = getMatchingProjectDirs(projectRoot);
  if (matchingDirs.length === 0) {
    return null;
  }

  let newestMatch: { sessionPath: string; session: GeminiSession; sortTimestamp: number } | null = null;

  for (const matchingDir of matchingDirs) {
    const chatsDir = path.join(GEMINI_TMP, matchingDir, 'chats');
    if (!fsSync.existsSync(chatsDir)) {
      continue;
    }

    const sessionFiles = fsSync.readdirSync(chatsDir)
      .filter((entry) => entry.startsWith('session-') && entry.endsWith('.json'))
      .map((entry) => path.join(chatsDir, entry));

    for (const sessionPath of sessionFiles) {
      try {
        const content = await fs.readFile(sessionPath, 'utf-8');
        const session = JSON.parse(content) as GeminiSession;
        const fileStats = await fs.stat(sessionPath);
        const sortTimestamp = transcriptTimestamp(session.lastUpdated) || fileStats.mtimeMs;

        if (!newestMatch || sortTimestamp > newestMatch.sortTimestamp) {
          newestMatch = {
            sessionPath,
            session,
            sortTimestamp,
          };
        }
      } catch {
        continue;
      }
    }
  }

  return newestMatch
    ? { sessionPath: newestMatch.sessionPath, session: newestMatch.session }
    : null;
}

/* ───────────────────────────────────────────────────────────────
   4. CONVERSATION CAPTURE
------------------------------------------------------------------*/

export async function captureGeminiConversation(
  maxExchanges: number = MAX_EXCHANGES_DEFAULT,
  projectRoot: string,
): Promise<OpencodeCapture | null> {
  const resolved = await resolveSession(projectRoot);
  if (!resolved) {
    return null;
  }

  const { sessionPath, session } = resolved;
  const messages = Array.isArray(session.messages) ? session.messages : [];
  if (messages.length === 0) {
    return null;
  }

  const pendingPrompts: PendingPrompt[] = [];
  const exchanges: CaptureExchange[] = [];
  const toolCalls: CaptureToolCall[] = [];
  const toolCallIndexById = new Map<string, number>();
  const discoveredSessionId = session.sessionId || path.basename(sessionPath, '.json');

  for (const message of messages) {
    const contentText = extractTextContent(message.content);
    const displayText = extractTextContent(message.displayContent);

    if (Array.isArray(message.toolCalls)) {
      for (const call of message.toolCalls) {
        const callId = typeof call.id === 'string' ? call.id : `${call.name || 'tool'}-${toolCalls.length}`;
        const input = sanitizeToolInputPaths(projectRoot, call.args || {});
        const output = extractToolResultText(call.result);
        const title = call.description || call.displayName || call.resultDisplay || output.slice(0, 80) || call.name || 'tool';

        toolCallIndexById.set(callId, toolCalls.length);
        toolCalls.push({
          tool: normalizeToolName(call.name),
          title,
          status: normalizeToolStatus(call.status),
          timestamp: call.timestamp || message.timestamp || new Date().toISOString(),
          input,
          output,
        });
      }
    }

    if (message.type === 'user') {
      const prompt = contentText || displayText;
      if (!prompt) {
        continue;
      }

      pendingPrompts.push({
        prompt,
        timestamp: message.timestamp || new Date().toISOString(),
      });
      continue;
    }

    if (message.type !== 'gemini') {
      continue;
    }

    const assistantText = contentText || displayText;
    if (!assistantText) {
      continue;
    }

    // Skip API error messages — they carry no useful session content
    if (isApiErrorContent(assistantText)) {
      continue;
    }

    const pendingPrompt = pendingPrompts.shift();
    if (!pendingPrompt) {
      continue;
    }

    exchanges.push({
      userInput: pendingPrompt.prompt,
      assistantResponse: assistantText,
      timestamp: pendingPrompt.timestamp || message.timestamp || new Date().toISOString(),
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
      session_created: transcriptTimestamp(session.startTime || String(sortedExchanges[0]?.timestamp || '')),
      session_updated: transcriptTimestamp(session.lastUpdated || String(sortedExchanges.at(-1)?.timestamp || '')),
      file_summary: {
        sessionPath,
      },
    },
    sessionId: discoveredSessionId,
    sessionTitle,
    capturedAt: new Date().toISOString(),
  };
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
------------------------------------------------------------------*/

export {
  GEMINI_HISTORY,
  GEMINI_HOME,
  GEMINI_TMP,
};
