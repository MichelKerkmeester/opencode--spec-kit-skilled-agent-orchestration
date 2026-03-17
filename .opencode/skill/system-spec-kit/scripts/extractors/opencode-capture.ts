// ---------------------------------------------------------------
// MODULE: Opencode Capture
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. OPENCODE CAPTURE
// ───────────────────────────────────────────────────────────────
// Captures and parses OpenCode session data from JSONL conversation logs

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { execFileSync } from 'node:child_process';
import { CONFIG } from '../core';
import { buildWorkspaceIdentity, normalizeAbsolutePath } from '../utils';

/* ───────────────────────────────────────────────────────────────
   INTERFACES
------------------------------------------------------------------*/

/** A prompt entry captured from a session transcript. */
export interface PromptEntry {
  input: string;
  timestamp: string | null;
  parts: unknown[];
  mode: string;
}

/** Metadata describing a captured session. */
export interface SessionInfo {
  id: string;
  title: string;
  created: number;
  updated: number;
  summary: Record<string, unknown>;
  parent_id: string | null;
}

/** Metadata describing a captured message. */
export interface MessageInfo {
  id: string;
  session_id: string;
  role: string;
  created: number;
  completed: number | null;
  parent_id: string | null;
  model: string | null;
  agent: string;
  summary: Record<string, unknown>;
}

/** Metadata describing a captured response. */
export interface ResponseInfo {
  content: string;
  timestamp: number;
  messageId: string;
  agent: string;
}

/** Captures one tool execution observed in the transcript. */
export interface ToolExecution {
  tool: string;
  call_id: string | null;
  input: Record<string, unknown>;
  output: string;
  status: string;
  timestamp: number;
  duration: number | null;
  title: string | null;
  messageId: string;
}

/** Represents a normalized user-assistant exchange. */
export interface Exchange {
  userInput: string;
  assistantResponse: string;
  timestamp: number;
  user_message_id: string;
  assistant_message_id: string | null;
  mode: string;
}

/** Full conversation capture payload assembled from OpenCode artifacts. */
export interface ConversationCapture {
  session_id: string;
  sessionId: string;
  session_title: string;
  sessionTitle: string;
  projectId: string;
  directory: string;
  captured_at: string;
  capturedAt: string;
  exchanges: Exchange[];
  toolCalls: ToolExecution[];
  metadata: {
    total_messages: number;
    total_responses: number;
    total_tool_calls: number;
    session_created: number;
    session_updated: number;
    file_summary: Record<string, unknown>;
  };
}

interface NativeSessionListEntry {
  id: string;
  title?: string;
  updated?: number;
  created?: number;
  projectId?: string;
  directory?: string;
}

interface NativeExportMessage {
  info?: Record<string, unknown>;
  parts?: Record<string, unknown>[];
}

interface NativeExportPayload {
  info?: Record<string, unknown>;
  messages?: NativeExportMessage[];
}

/* ───────────────────────────────────────────────────────────────
   2. STORAGE PATHS
------------------------------------------------------------------*/

const OPENCODE_STORAGE: string = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.local/share/opencode/storage',
);

const PROMPT_HISTORY: string = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.local/state/opencode/prompt-history.jsonl',
);

const nativeSessionMessageCache = new Map<string, MessageInfo[]>();
const nativeMessagePartCache = new Map<string, Record<string, unknown>[]>();

/* ───────────────────────────────────────────────────────────────
   3. UTILITY FUNCTIONS
------------------------------------------------------------------*/

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonSafe<T = unknown>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err: unknown) {
    // F-18: Only silently return null for ENOENT; warn on other errors
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') {
      console.warn(`   Warning: Failed to read ${filePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
    return null;
  }
}

async function readJsonlTail<T = unknown>(filePath: string, limit: number): Promise<T[]> {
  if (!await pathExists(filePath)) {
    return [];
  }

  let fileHandle: Awaited<ReturnType<typeof fs.open>> | null = null;
  try {
    fileHandle = await fs.open(filePath, 'r');
    const stream = fileHandle.createReadStream({ encoding: 'utf-8' });

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    const buffer: T[] = [];

    for await (const line of rl) {
      if (line.trim()) {
        try {
          const parsed = JSON.parse(line) as T;
          buffer.push(parsed);
          if (buffer.length > limit * 2) {
            buffer.splice(0, buffer.length - limit);
          }
        } catch {
          // Skip malformed lines
        }
      }
    }

    return buffer.slice(-limit);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`   Warning: Error reading JSONL: ${errMsg}`);
    return [];
  } finally {
    if (fileHandle) {
      await fileHandle.close().catch(() => {/* best-effort close */});
    }
  }
}

function toFiniteNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function extractJsonPayload(output: string): string | null {
  const trimmed = output.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const candidateStarts = [trimmed.indexOf('{'), trimmed.indexOf('[')]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b);

  for (const start of candidateStarts) {
    const payload = trimmed.slice(start).trim();
    try {
      JSON.parse(payload);
      return payload;
    } catch {
      continue;
    }
  }

  return null;
}

function runOpencodeJsonCommand(args: string[]): unknown | null {
  try {
    const output = execFileSync('opencode', args, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    const payload = extractJsonPayload(output);
    return payload ? JSON.parse(payload) : null;
  } catch {
    return null;
  }
}

function mapNativeSessionListEntry(entry: NativeSessionListEntry): SessionInfo | null {
  if (typeof entry.id !== 'string') {
    return null;
  }

  return {
    id: entry.id,
    title: typeof entry.title === 'string' && entry.title.trim().length > 0 ? entry.title : 'Untitled',
    created: toFiniteNumber(entry.created),
    updated: toFiniteNumber(entry.updated),
    summary: {},
    parent_id: null,
  };
}

function cacheNativeSessionMessages(sessionId: string, messages: NativeExportMessage[]): void {
  const mappedMessages: MessageInfo[] = [];

  for (const message of messages) {
    const info = message.info;
    if (!info || typeof info.id !== 'string' || typeof info.role !== 'string') {
      continue;
    }

    const time = (info.time as Record<string, unknown>) || {};
    const model = info.model as Record<string, unknown> | undefined;
    mappedMessages.push({
      id: info.id,
      session_id: typeof info.sessionID === 'string' ? info.sessionID : sessionId,
      role: info.role,
      created: toFiniteNumber(time.created),
      completed: typeof time.completed === 'number' && Number.isFinite(time.completed) ? time.completed : null,
      parent_id: typeof info.parentID === 'string' ? info.parentID : null,
      model: typeof info.modelID === 'string'
        ? info.modelID
        : typeof model?.modelID === 'string'
          ? model.modelID
          : null,
      agent: typeof info.agent === 'string' ? info.agent : 'general',
      summary: (info.summary as Record<string, unknown>) || {},
    });

    nativeMessagePartCache.set(info.id, Array.isArray(message.parts) ? message.parts : []);
  }

  mappedMessages.sort((a, b) => a.created - b.created);
  nativeSessionMessageCache.set(sessionId, mappedMessages);
}

function readNativeRecentSessions(limit: number): NativeSessionListEntry[] {
  const payload = runOpencodeJsonCommand([
    'session',
    'list',
    '--format',
    'json',
    '--max-count',
    String(Math.max(limit, 1)),
  ]);

  return Array.isArray(payload) ? payload as NativeSessionListEntry[] : [];
}

function populateNativeSessionCache(sessionId: string): boolean {
  if (nativeSessionMessageCache.has(sessionId)) {
    return true;
  }

  const payload = runOpencodeJsonCommand(['export', sessionId]);
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
    return false;
  }

  const exported = payload as NativeExportPayload;
  if (!Array.isArray(exported.messages)) {
    return false;
  }

  cacheNativeSessionMessages(sessionId, exported.messages);
  return nativeSessionMessageCache.has(sessionId);
}

function getCachedMessageText(messageId: string): string | null {
  const parts = nativeMessagePartCache.get(messageId);
  if (!parts) {
    return null;
  }

  const texts = parts
    .filter((part) => part.type === 'text')
    .map((part) => typeof part.text === 'string' ? part.text.trim() : '')
    .filter((text) => text.length > 0);

  return texts.length > 0 ? texts.join('\n') : null;
}

/* ───────────────────────────────────────────────────────────────
   4. PROMPT HISTORY
------------------------------------------------------------------*/

// RC-1/RC-8: Added optional sessionStart/sessionEnd params to scope prompt
// History to the active session's time range. Prevents global prompt history
// From pulling unrelated sessions, fixing 16-day date mismatches.
async function getRecentPrompts(
  limit: number = 20,
  sessionStart?: number,
  sessionEnd?: number
): Promise<PromptEntry[]> {
  const entries = await readJsonlTail<Record<string, unknown>>(PROMPT_HISTORY, limit);

  const mapped = entries.map((entry) => ({
    input: (entry.input as string) || '',
    timestamp: (entry.timestamp as string) || null,
    parts: (entry.parts as unknown[]) || [],
    mode: (entry.mode as string) || 'normal',
  }));

  // When session bounds are provided, filter to only prompts within that window.
  // RC-8 fix: Do NOT fall back to unfiltered prompts — that reintroduces 16-day
  // Mismatch by pulling global prompt history from unrelated sessions.
  if (sessionStart !== undefined && sessionEnd !== undefined) {
    // Guard against invalid bounds (e.g., session.created=0 or clock skew)
    if (sessionStart > 0 && sessionEnd > 0 && sessionStart <= sessionEnd) {
      const filtered = mapped.filter((p) => {
        if (!p.timestamp) return false;
        const ts = new Date(p.timestamp).getTime();
        if (isNaN(ts)) return false;
        return ts >= sessionStart && ts <= sessionEnd;
      });
      return filtered;
    }
    // Invalid bounds — return empty rather than unfiltered global prompts
    return [];
  }

  return mapped;
}

/* ───────────────────────────────────────────────────────────────
   5. SESSION DISCOVERY
------------------------------------------------------------------*/

function getProjectId(directory: string): string | null {
  const sessionDir = path.join(OPENCODE_STORAGE, 'session');
  const workspaceIdentity = buildWorkspaceIdentity(directory);
  let bestMatch: { projectId: string; score: number; updated: number } | null = null;

  const isWithinPath = (candidate: string, base: string): boolean => (
    candidate === base || candidate.startsWith(`${base}/`)
  );

  const scoreSessionDirectoryMatch = (sessionDirectory: string): number => {
    const normalizedRequested = normalizeAbsolutePath(directory);
    const normalizedSession = normalizeAbsolutePath(sessionDirectory);

    if (normalizedRequested === normalizedSession) {
      return 3;
    }

    if (
      isWithinPath(normalizedRequested, normalizedSession)
      || isWithinPath(normalizedSession, normalizedRequested)
    ) {
      return 2;
    }

    if (
      isWithinPath(normalizedRequested, workspaceIdentity.workspaceRoot)
      && isWithinPath(normalizedSession, workspaceIdentity.workspaceRoot)
    ) {
      return 1;
    }

    return 0;
  };

  const nativeSessions = readNativeRecentSessions(200);
  for (const session of nativeSessions) {
    if (typeof session.projectId !== 'string' || typeof session.directory !== 'string') {
      continue;
    }

    const score = scoreSessionDirectoryMatch(session.directory);
    if (score === 0) {
      continue;
    }

    const updated = toFiniteNumber(session.updated);
    if (
      bestMatch === null
      || score > bestMatch.score
      || (score === bestMatch.score && updated > bestMatch.updated)
    ) {
      bestMatch = { projectId: session.projectId, score, updated };
    }
  }

  if (!fsSync.existsSync(sessionDir)) {
    return bestMatch?.projectId ?? null;
  }

  try {
    const projectDirs = fsSync.readdirSync(sessionDir)
      .filter((name) => !name.startsWith('.') && name !== 'global');

    for (const projectId of projectDirs) {
      const projectPath = path.join(sessionDir, projectId);
      const sessions = fsSync.readdirSync(projectPath)
        .filter((name) => name.startsWith('ses_') && name.endsWith('.json'));

      // Check ALL session files, not just the first — project may have
      // Multiple sessions and the matching directory could be in any of them
      for (const sessionName of sessions) {
        try {
          const sessionFile = path.join(projectPath, sessionName);
          const content = fsSync.readFileSync(sessionFile, 'utf-8');
          const session = JSON.parse(content) as Record<string, unknown>;

          if (typeof session.directory !== 'string') {
            continue;
          }

          const score = scoreSessionDirectoryMatch(session.directory);
          if (score === 0) {
            continue;
          }

          const sessionTime = session.time as Record<string, unknown> | undefined;
          const updatedRaw = typeof sessionTime?.updated === 'number' ? sessionTime.updated : 0;
          const updated = Number.isFinite(updatedRaw) ? updatedRaw : 0;

          if (
            bestMatch === null
            || score > bestMatch.score
            || (score === bestMatch.score && updated > bestMatch.updated)
          ) {
            bestMatch = { projectId, score, updated };
          }
        } catch {
          // Skip unreadable session files
        }
      }
    }
  } catch {
    return null;
  }

  return bestMatch?.projectId ?? null;
}

async function getRecentSessions(projectId: string, limit: number = 10): Promise<SessionInfo[]> {
  const nativeSessions = readNativeRecentSessions(Math.max(limit * 10, 100))
    .filter((entry) => entry.projectId === projectId)
    .map(mapNativeSessionListEntry)
    .filter((entry): entry is SessionInfo => entry !== null)
    .sort((a, b) => b.updated - a.updated);

  if (nativeSessions.length > 0) {
    return nativeSessions.slice(0, limit);
  }

  const sessionDir = path.join(OPENCODE_STORAGE, 'session', projectId);

  if (!await pathExists(sessionDir)) {
    return [];
  }

  try {
    const files = await fs.readdir(sessionDir);
    const sessionFiles = files
      .filter((name) => name.startsWith('ses_') && name.endsWith('.json'));

    const sessions: SessionInfo[] = [];

    for (const file of sessionFiles) {
      const session = await readJsonSafe<Record<string, unknown>>(path.join(sessionDir, file));
      if (session) {
        sessions.push({
          id: session.id as string,
          title: (session.title as string) || 'Untitled',
          created: (session.time as Record<string, number>)?.created || 0,
          updated: (session.time as Record<string, number>)?.updated || 0,
          summary: (session.summary as Record<string, unknown>) || {},
          parent_id: (session.parentID as string) || null,
        });
      }
    }

    sessions.sort((a, b) => b.updated - a.updated);
    return sessions.slice(0, limit);
  } catch {
    return [];
  }
}

async function getCurrentSession(projectId: string): Promise<SessionInfo | null> {
  const sessions = await getRecentSessions(projectId, 1);
  return sessions[0] || null;
}

/* ───────────────────────────────────────────────────────────────
   6. MESSAGE RETRIEVAL
------------------------------------------------------------------*/

async function getSessionMessages(sessionId: string): Promise<MessageInfo[]> {
  const cachedMessages = nativeSessionMessageCache.get(sessionId);
  if (cachedMessages) {
    return cachedMessages;
  }

  if (populateNativeSessionCache(sessionId)) {
    return nativeSessionMessageCache.get(sessionId) || [];
  }

  const messageDir = path.join(OPENCODE_STORAGE, 'message', sessionId);

  if (!await pathExists(messageDir)) {
    return [];
  }

  try {
    const files = await fs.readdir(messageDir);
    const messageFiles = files
      .filter((name) => name.startsWith('msg_') && name.endsWith('.json'));

    const messages: MessageInfo[] = [];

    for (const file of messageFiles) {
      const msg = await readJsonSafe<Record<string, unknown>>(path.join(messageDir, file));
      if (msg) {
        messages.push({
          id: msg.id as string,
          session_id: msg.sessionID as string,
          role: msg.role as string,
          created: (msg.time as Record<string, number>)?.created || 0,
          completed: (msg.time as Record<string, number>)?.completed || null,
          parent_id: (msg.parentID as string) || null,
          model: (msg.modelID as string) || null,
          agent: (msg.agent as string) || 'general',
          summary: (msg.summary as Record<string, unknown>) || {},
        });
      }
    }

    messages.sort((a, b) => a.created - b.created);
    return messages;
  } catch {
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   7. PART RETRIEVAL (RESPONSES & TOOL CALLS)
------------------------------------------------------------------*/

async function getMessageParts(messageId: string): Promise<Record<string, unknown>[]> {
  const cachedParts = nativeMessagePartCache.get(messageId);
  if (cachedParts) {
    return cachedParts;
  }

  const partDir = path.join(OPENCODE_STORAGE, 'part', messageId);

  if (!await pathExists(partDir)) {
    return [];
  }

  try {
    const files = await fs.readdir(partDir);
    const partFiles = files
      .filter((name) => name.startsWith('prt_') && name.endsWith('.json'));

    const parts: Record<string, unknown>[] = [];

    for (const file of partFiles) {
      const part = await readJsonSafe<Record<string, unknown>>(path.join(partDir, file));
      if (part) {
        parts.push(part);
      }
    }

    parts.sort((a, b) => {
      const aTime = (a.time as Record<string, number>)?.start || 0;
      const bTime = (b.time as Record<string, number>)?.start || 0;
      return aTime - bTime;
    });
    return parts;
  } catch {
    return [];
  }
}

async function getSessionResponses(sessionId: string): Promise<ResponseInfo[]> {
  const messages = await getSessionMessages(sessionId);
  const responses: ResponseInfo[] = [];

  for (const msg of messages) {
    if (msg.role === 'assistant') {
      const parts = await getMessageParts(msg.id);
      const textParts = parts.filter((p) => p.type === 'text');

      for (const part of textParts) {
        const text = part.text as string | undefined;
        if (text && text.trim()) {
          responses.push({
            content: text,
            timestamp: (part.time as Record<string, number>)?.start || msg.created,
            messageId: msg.id,
            agent: msg.agent,
          });
        }
      }
    }
  }

  return responses;
}

async function getToolExecutions(sessionId: string): Promise<ToolExecution[]> {
  const messages = await getSessionMessages(sessionId);
  const toolCalls: ToolExecution[] = [];

  for (const msg of messages) {
    if (msg.role === 'assistant') {
      const parts = await getMessageParts(msg.id);
      const toolParts = parts.filter((p) => p.type === 'tool');

      for (const part of toolParts) {
        const state = part.state as Record<string, unknown> | undefined;
        toolCalls.push({
          tool: (part.tool as string) || 'unknown',
          call_id: (part.callID as string) || null,
          input: (state?.input as Record<string, unknown>) || {},
          output: truncateOutput(state?.output as string | undefined),
          status: (state?.status as string) || 'unknown',
          timestamp: (state?.time as Record<string, number>)?.start || msg.created,
          duration: calculateDuration(state?.time as Record<string, number> | undefined),
          title: (state?.title as string) || null,
          messageId: msg.id,
        });
      }
    }
  }

  return toolCalls;
}

function truncateOutput(output: string | undefined, maxLength?: number): string {
  if (!output || typeof output !== 'string') return '';
  const limit = maxLength ?? CONFIG.TOOL_OUTPUT_MAX_LENGTH;
  const codePoints = Array.from(output);
  if (codePoints.length <= limit) return output;
  const marker = '\n... [truncated] ...\n';
  const markerCodePoints = Array.from(marker);
  if (limit <= markerCodePoints.length) {
    return codePoints.slice(0, Math.max(0, limit)).join('');
  }
  const available = limit - markerCodePoints.length;
  const prefixLength = Math.floor(available / 2);
  const suffixLength = available - prefixLength;
  return codePoints.slice(0, prefixLength).join('')
    + marker
    + codePoints.slice(codePoints.length - suffixLength).join('');
}

function calculateDuration(time: Record<string, number> | undefined): number | null {
  if (!time || !time.start || !time.end) return null;
  return time.end - time.start;
}

/* ───────────────────────────────────────────────────────────────
   8. FULL CONVERSATION CAPTURE
------------------------------------------------------------------*/

async function captureConversation(
  maxMessages: number = 10,
  directory: string = process.cwd()
): Promise<ConversationCapture> {
  const projectId = getProjectId(directory);
  if (!projectId) {
    throw new Error(`No OpenCode sessions found for: ${directory}`);
  }

  const session = await getCurrentSession(projectId);
  if (!session) {
    throw new Error('No active session found');
  }

  // RC-1/RC-8: Scope prompts to the active session's time range
  const prompts = await getRecentPrompts(maxMessages, session.created, session.updated);
  const messages = await getSessionMessages(session.id);
  const responses = await getSessionResponses(session.id);
  const toolCalls = await getToolExecutions(session.id);
  const exchanges = buildExchanges(prompts, messages, responses, maxMessages);
  const capturedAt = new Date().toISOString();

  return {
    session_id: session.id,
    sessionId: session.id,
    session_title: session.title,
    sessionTitle: session.title,
    projectId: projectId,
    directory: directory,
    captured_at: capturedAt,
    capturedAt,
    exchanges: exchanges,
    toolCalls: toolCalls.slice(-maxMessages * 3),
    metadata: {
      total_messages: messages.length,
      total_responses: responses.length,
      total_tool_calls: toolCalls.length,
      // F-33: Validate session timestamps are finite before propagating
      session_created: Number.isFinite(session.created) ? session.created : 0,
      session_updated: Number.isFinite(session.updated) ? session.updated : 0,
      file_summary: session.summary,
    },
  };
}

function buildExchanges(
  prompts: PromptEntry[],
  messages: MessageInfo[],
  responses: ResponseInfo[],
  limit: number
): Exchange[] {
  const exchanges: Exchange[] = [];
  const userMessages = messages.filter((m) => m.role === 'user');
  const consumedPromptIndices = new Set<number>();

  for (let i = 0; i < Math.min(userMessages.length, limit); i++) {
    const userMsg = userMessages[userMessages.length - 1 - i];

    // F-17: Match by session-relative ordering first (position-based),
    // Then fall back to timestamp tolerance matching
    const positionIndex = prompts.length - 1 - i;
    let promptIndex: number;

    if (positionIndex >= 0 && !consumedPromptIndices.has(positionIndex)) {
      // Position-based match: align from end of both arrays
      promptIndex = positionIndex;
    } else {
      // Timestamp tolerance fallback
      promptIndex = prompts.findIndex((p, index) => {
        if (consumedPromptIndices.has(index)) return false;
        if (!p.timestamp && !userMsg.created) return false;
        const promptDate = new Date(p.timestamp || '');
        if (isNaN(promptDate.getTime())) return false;
        const promptTime = promptDate.getTime();
        return Math.abs(promptTime - userMsg.created) < CONFIG.TIMESTAMP_MATCH_TOLERANCE_MS;
      });
    }

    const prompt = promptIndex >= 0 ? prompts[promptIndex] : undefined;
    if (promptIndex >= 0) {
      consumedPromptIndices.add(promptIndex);
    }

    const matchingResponses = responses.filter((r) => {
      const responseMsg = messages.find((m) => m.id === r.messageId);
      return responseMsg?.parent_id === userMsg.id;
    });
    const response = matchingResponses[0];

    const userInput: string | null = prompt?.input
      || getCachedMessageText(userMsg.id)
      || (userMsg.summary as Record<string, string>)?.title
      || null;
    const assistantResponseContent = matchingResponses.map((r) => r.content).join('\n');
    const assistantResponse: string | null = assistantResponseContent
      ? Array.from(assistantResponseContent).slice(0, CONFIG.TOOL_OUTPUT_MAX_LENGTH).join('')
      : null;

    if (!userInput && !assistantResponse) {
      continue;
    }

    exchanges.unshift({
      userInput: userInput || 'User initiated conversation',
      assistantResponse: assistantResponse || 'Assistant processed request',
      timestamp: userMsg.created,
      user_message_id: userMsg.id,
      assistant_message_id: response?.messageId || null,
      mode: prompt?.mode || 'normal',
    });
  }

  return exchanges;
}

/* ───────────────────────────────────────────────────────────────
   9. EXPORTS
------------------------------------------------------------------*/

export {
  // Snake_case exports (original)
  getRecentPrompts,
  getSessionResponses,
  getToolExecutions,
  captureConversation,
  getProjectId,
  getRecentSessions,
  getCurrentSession,
  getSessionMessages,
  getMessageParts,
  pathExists,
  readJsonSafe,
  readJsonlTail,
  OPENCODE_STORAGE,
  PROMPT_HISTORY,
};
