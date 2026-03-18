// ---------------------------------------------------------------
// MODULE: Copilot CLI Capture
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. COPILOT CLI CAPTURE
// ───────────────────────────────────────────────────────────────
// Captures Copilot transcript data from ~/.copilot/session-state for
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
} from '../utils';
import { sanitizeToolDescription, sanitizeToolInputPaths, isApiErrorContent } from '../utils/tool-sanitizer';

const COPILOT_HOME = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.copilot',
);
const COPILOT_SESSION_STATE = path.join(COPILOT_HOME, 'session-state');
const MAX_EXCHANGES_DEFAULT = 20;

type CopilotWorkspace = {
  id?: string;
  cwd?: string;
  git_root?: string;
  updated_at?: string;
};

type CopilotEvent = {
  type?: string;
  timestamp?: string;
  data?: Record<string, unknown>;
};

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

function parseWorkspaceYaml(content: string): CopilotWorkspace {
  const workspace: CopilotWorkspace = {};

  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    const [, rawKey, rawValue] = match;
    const value = rawValue.trim().replace(/^['"]|['"]$/g, '');

    switch (rawKey) {
      case 'id':
      case 'cwd':
      case 'git_root':
      case 'updated_at':
        workspace[rawKey] = value;
        break;
      default:
        break;
    }
  }

  return workspace;
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

function buildSessionTitle(exchanges: CaptureExchange[], sessionId: string): string {
  const firstPrompt = exchanges.find((exchange) => (exchange.userInput || '').trim().length > 0);
  if (firstPrompt) {
    return (firstPrompt.userInput || '').trim().slice(0, 80);
  }

  return `Copilot CLI session ${sessionId.slice(0, 8)}`;
}

async function resolveWorkspace(
  projectRoot: string,
): Promise<{ eventsPath: string; workspace: CopilotWorkspace } | null> {
  if (!fsSync.existsSync(COPILOT_SESSION_STATE)) {
    return null;
  }

  const candidates = fsSync.readdirSync(COPILOT_SESSION_STATE, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const matches: Array<{ eventsPath: string; workspace: CopilotWorkspace; sortTimestamp: number }> = [];

  for (const candidate of candidates) {
    const sessionDir = path.join(COPILOT_SESSION_STATE, candidate);
    const workspacePath = path.join(sessionDir, 'workspace.yaml');
    const eventsPath = path.join(sessionDir, 'events.jsonl');

    if (!fsSync.existsSync(workspacePath) || !fsSync.existsSync(eventsPath)) {
      continue;
    }

    const workspaceContent = await fs.readFile(workspacePath, 'utf-8');
    const workspace = parseWorkspaceYaml(workspaceContent);
    const exactMatch = isSameWorkspacePath(projectRoot, workspace.cwd)
      || isSameWorkspacePath(projectRoot, workspace.git_root);
    if (!exactMatch) {
      continue;
    }

    const eventStats = await fs.stat(eventsPath);
    matches.push({
      eventsPath,
      workspace,
      sortTimestamp: transcriptTimestamp(workspace.updated_at) || eventStats.mtimeMs,
    });
  }

  if (matches.length === 0) {
    return null;
  }

  matches.sort((a, b) => b.sortTimestamp - a.sortTimestamp);
  return {
    eventsPath: matches[0].eventsPath,
    workspace: matches[0].workspace,
  };
}

export async function captureCopilotConversation(
  maxExchanges: number = MAX_EXCHANGES_DEFAULT,
  projectRoot: string,
): Promise<OpencodeCapture | null> {
  const resolved = await resolveWorkspace(projectRoot);
  if (!resolved) {
    return null;
  }

  const { eventsPath, workspace } = resolved;
  const rawEvents = await readJsonl(eventsPath);
  if (rawEvents.length === 0) {
    return null;
  }

  const events = rawEvents
    .filter((entry): entry is CopilotEvent => !!entry && typeof entry === 'object')
    .map((entry) => entry as CopilotEvent);
  const pendingPrompts: PendingPrompt[] = [];
  const exchanges: CaptureExchange[] = [];
  const toolCalls: CaptureToolCall[] = [];
  const toolCallIndexById = new Map<string, number>();
  let discoveredSessionId = workspace.id || path.basename(path.dirname(eventsPath));
  let sessionCreatedAt = '';
  let sessionUpdatedAt = '';

  for (const event of events) {
    if (event.type === 'session.start') {
      const sessionId = event.data?.sessionId;
      if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
        discoveredSessionId = sessionId;
      }

      sessionCreatedAt = event.timestamp || sessionCreatedAt;
      continue;
    }

    if (event.type === 'user.message') {
      const content = typeof event.data?.content === 'string'
        ? event.data.content
        : (typeof event.data?.transformedContent === 'string' ? event.data.transformedContent : '');

      if (!content.trim()) {
        continue;
      }

      pendingPrompts.push({
        prompt: content.trim(),
        timestamp: event.timestamp || new Date().toISOString(),
      });
      continue;
    }

    if (event.type === 'assistant.message') {
      const toolRequests = Array.isArray(event.data?.toolRequests)
        ? event.data.toolRequests
        : [];

      for (const request of toolRequests) {
        if (!request || typeof request !== 'object') {
          continue;
        }

        const record = request as Record<string, unknown>;
        const callId = typeof record.toolCallId === 'string' ? record.toolCallId : null;
        if (!callId || toolCallIndexById.has(callId)) {
          continue;
        }

        const rawInput = record.arguments && typeof record.arguments === 'object'
          ? record.arguments as Record<string, unknown>
          : {};
        const input = sanitizeToolInputPaths(projectRoot, rawInput);
        const toolName = normalizeToolName(record.name);

        toolCallIndexById.set(callId, toolCalls.length);
        toolCalls.push({
          tool: toolName,
          title: typeof input.description === 'string' ? sanitizeToolDescription(input.description) : toolName,
          status: 'pending',
          timestamp: event.timestamp || new Date().toISOString(),
          input,
          output: '',
        });
      }

      const content = typeof event.data?.content === 'string' ? event.data.content.trim() : '';
      if (!content) {
        continue;
      }

      // Skip API error messages — they carry no useful session content
      if (isApiErrorContent(content)) {
        continue;
      }

      const pendingPrompt = pendingPrompts.shift();
      if (!pendingPrompt) {
        continue;
      }

      exchanges.push({
        userInput: pendingPrompt.prompt,
        assistantResponse: content,
        timestamp: pendingPrompt.timestamp || event.timestamp || new Date().toISOString(),
      });
      sessionUpdatedAt = event.timestamp || sessionUpdatedAt;
      continue;
    }

    if (event.type === 'tool.execution_start') {
      const toolName = normalizeToolName(event.data?.toolName);
      const callId = typeof event.data?.toolCallId === 'string' ? event.data.toolCallId : `${toolName}-${toolCalls.length}`;
      const rawInput = event.data?.arguments && typeof event.data.arguments === 'object'
        ? event.data.arguments as Record<string, unknown>
        : {};
      const input = sanitizeToolInputPaths(projectRoot, rawInput);
      const existingIndex = toolCallIndexById.get(callId);

      if (existingIndex === undefined) {
        toolCallIndexById.set(callId, toolCalls.length);
        toolCalls.push({
          tool: toolName,
          title: typeof input.description === 'string' ? sanitizeToolDescription(input.description) : toolName,
          status: 'pending',
          timestamp: event.timestamp || new Date().toISOString(),
          input,
          output: '',
        });
      } else {
        toolCalls[existingIndex] = {
          ...toolCalls[existingIndex],
          input,
          timestamp: event.timestamp || toolCalls[existingIndex].timestamp,
        };
      }

      continue;
    }

    if (event.type === 'tool.execution_complete') {
      const callId = typeof event.data?.toolCallId === 'string' ? event.data.toolCallId : null;
      if (!callId) {
        continue;
      }

      const existingIndex = toolCallIndexById.get(callId);
      if (existingIndex === undefined) {
        continue;
      }

      const existing = toolCalls[existingIndex];
      const output = stringifyPreview(event.data?.result);
      toolCalls[existingIndex] = {
        ...existing,
        status: event.data?.success === false ? 'error' : 'completed',
        title: existing.title || output.slice(0, 80) || existing.tool,
        timestamp: event.timestamp || existing.timestamp,
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
      session_updated: transcriptTimestamp(sessionUpdatedAt || workspace.updated_at || String(sortedExchanges.at(-1)?.timestamp || '')),
      file_summary: {
        eventsPath,
      },
    },
    sessionId: discoveredSessionId,
    sessionTitle,
    capturedAt: new Date().toISOString(),
  };
}

export {
  COPILOT_HOME,
  COPILOT_SESSION_STATE,
};
