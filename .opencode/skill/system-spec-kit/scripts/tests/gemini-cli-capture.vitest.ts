// TEST: Gemini CLI Capture
// Covers project-root matching, thought exclusion, and tool extraction
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_HOME = process.env.HOME;
const tempRoots: string[] = [];

function makeTempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  process.env.HOME = ORIGINAL_HOME;
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop()!, { recursive: true, force: true });
  }
});

describe('captureGeminiConversation', () => {
  it('returns null when no Gemini project mapping exists for the current project', async () => {
    const tempHome = makeTempRoot('speckit-gemini-home-');
    process.env.HOME = tempHome;

    const { captureGeminiConversation } = await import('../extractors/gemini-cli-capture');
    const result = await captureGeminiConversation(20, '/tmp/missing-project');

    expect(result).toBeNull();
  });

  it('uses the mapped project directory, ignores thoughts, and extracts tool calls', async () => {
    const tempHome = makeTempRoot('speckit-gemini-home-');
    process.env.HOME = tempHome;

    const projectRoot = '/tmp/spec-kit-project';
    const historyDir = path.join(tempHome, '.gemini', 'history', 'public');
    fs.mkdirSync(historyDir, { recursive: true });
    fs.writeFileSync(path.join(historyDir, '.project_root'), `${projectRoot}\n`, 'utf-8');

    const chatsDir = path.join(tempHome, '.gemini', 'tmp', 'public', 'chats');
    const olderPath = path.join(chatsDir, 'session-2026-03-15T09-00-older.json');
    writeJson(olderPath, {
      sessionId: 'older-session',
      startTime: '2026-03-15T09:00:00.000Z',
      lastUpdated: '2026-03-15T09:00:30.000Z',
      messages: [
        {
          id: 'old-user',
          timestamp: '2026-03-15T09:00:00.000Z',
          type: 'user',
          content: [{ text: 'Older session prompt.' }],
        },
      ],
    });

    const matchingPath = path.join(chatsDir, 'session-2026-03-15T10-00-matching.json');
    writeJson(matchingPath, {
      sessionId: 'matching-session',
      startTime: '2026-03-15T10:00:00.000Z',
      lastUpdated: '2026-03-15T10:00:30.000Z',
      messages: [
        {
          id: 'user-01',
          timestamp: '2026-03-15T10:00:00.000Z',
          type: 'user',
          content: [{ text: 'Use Gemini as the final native fallback.' }],
        },
        {
          id: 'gemini-tools',
          timestamp: '2026-03-15T10:00:10.000Z',
          type: 'gemini',
          content: '',
          thoughts: [
            {
              subject: 'Internal reasoning',
              description: 'This should not appear in the capture output.',
            },
          ],
          toolCalls: [
            {
              id: 'glob_01',
              name: 'glob',
              args: {
                path: '/tmp/spec-kit-project/scripts/loaders/data-loader.ts',
              },
              status: 'completed',
              timestamp: '2026-03-15T10:00:11.000Z',
              resultDisplay: 'Found 1 matching file',
              result: [
                {
                  functionResponse: {
                    response: {
                      output: '/tmp/spec-kit-project/scripts/loaders/data-loader.ts',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'gemini-response',
          timestamp: '2026-03-15T10:00:20.000Z',
          type: 'gemini',
          content: [{ text: 'I found the matching session and prepared the Gemini fallback.' }],
        },
      ],
    });

    const olderTime = new Date('2026-03-15T09:00:30.000Z');
    const matchingTime = new Date('2026-03-15T10:00:30.000Z');
    fs.utimesSync(olderPath, olderTime, olderTime);
    fs.utimesSync(matchingPath, matchingTime, matchingTime);

    const { captureGeminiConversation } = await import('../extractors/gemini-cli-capture');
    const result = await captureGeminiConversation(20, projectRoot);

    expect(result).not.toBeNull();
    expect(result?.sessionId).toBe('matching-session');
    expect(result?.sessionTitle).toContain('Use Gemini as the final native fallback');
    expect(result?.exchanges).toEqual([
      expect.objectContaining({
        userInput: 'Use Gemini as the final native fallback.',
        assistantResponse: 'I found the matching session and prepared the Gemini fallback.',
      }),
    ]);
    expect(result?.toolCalls).toEqual([
      expect.objectContaining({
        tool: 'glob',
        status: 'completed',
        input: expect.objectContaining({
          path: 'scripts/loaders/data-loader.ts',
        }),
      }),
    ]);
  });

  it('accepts repo-root Gemini project mappings for an active .opencode workspace identity', async () => {
    const tempHome = makeTempRoot('speckit-gemini-home-');
    process.env.HOME = tempHome;

    const repoRoot = '/tmp/spec-kit-project';
    const workspacePath = `${repoRoot}/.opencode`;
    const historyDir = path.join(tempHome, '.gemini', 'history', 'public');
    fs.mkdirSync(historyDir, { recursive: true });
    fs.writeFileSync(path.join(historyDir, '.project_root'), `${repoRoot}\n`, 'utf-8');

    const chatsDir = path.join(tempHome, '.gemini', 'tmp', 'public', 'chats');
    const matchingPath = path.join(chatsDir, 'session-2026-03-15T12-45-matching.json');
    writeJson(matchingPath, {
      sessionId: 'matching-session',
      startTime: '2026-03-15T12:45:00.000Z',
      lastUpdated: '2026-03-15T12:45:30.000Z',
      messages: [
        {
          id: 'user-01',
          timestamp: '2026-03-15T12:45:00.000Z',
          type: 'user',
          content: [{ text: 'Resolve repo-root Gemini history through the .opencode workspace.' }],
        },
        {
          id: 'gemini-response',
          timestamp: '2026-03-15T12:45:20.000Z',
          type: 'gemini',
          content: [{ text: 'Matched the Gemini session to the canonical .opencode identity.' }],
        },
      ],
    });

    const { captureGeminiConversation } = await import('../extractors/gemini-cli-capture');
    const result = await captureGeminiConversation(20, workspacePath);

    expect(result?.sessionId).toBe('matching-session');
    expect(result?.exchanges[0]).toEqual(expect.objectContaining({
      userInput: 'Resolve repo-root Gemini history through the .opencode workspace.',
      assistantResponse: 'Matched the Gemini session to the canonical .opencode identity.',
    }));
  });

  it('excludes API error content from assistant exchanges', async () => {
    const tempHome = makeTempRoot('speckit-gemini-home-');
    process.env.HOME = tempHome;

    const projectRoot = '/tmp/spec-kit-project';
    const historyDir = path.join(tempHome, '.gemini', 'history', 'api-err-project');
    fs.mkdirSync(historyDir, { recursive: true });
    fs.writeFileSync(path.join(historyDir, '.project_root'), `${projectRoot}\n`, 'utf-8');

    const chatsDir = path.join(tempHome, '.gemini', 'tmp', 'api-err-project', 'chats');
    const sessionPath = path.join(chatsDir, 'session-2026-03-15T16-00-api-err.json');
    writeJson(sessionPath, {
      sessionId: 'api-err-session',
      startTime: '2026-03-15T16:00:00.000Z',
      lastUpdated: '2026-03-15T16:00:04.000Z',
      messages: [
        {
          id: 'user-1',
          timestamp: '2026-03-15T16:00:01.000Z',
          type: 'user',
          content: [{ text: 'First prompt' }],
        },
        {
          id: 'gemini-err',
          timestamp: '2026-03-15T16:00:02.000Z',
          type: 'gemini',
          content: [{ text: 'API Error: 503 Service Unavailable' }],
        },
        {
          id: 'user-2',
          timestamp: '2026-03-15T16:00:03.000Z',
          type: 'user',
          content: [{ text: 'Second prompt' }],
        },
        {
          id: 'gemini-ok',
          timestamp: '2026-03-15T16:00:04.000Z',
          type: 'gemini',
          content: [{ text: 'Here is a valid response.' }],
        },
      ],
    });

    const sessionTime = new Date('2026-03-15T16:00:04.000Z');
    fs.utimesSync(sessionPath, sessionTime, sessionTime);

    const { captureGeminiConversation } = await import('../extractors/gemini-cli-capture');
    const result = await captureGeminiConversation(20, projectRoot);

    expect(result).not.toBeNull();
    const responses = result!.exchanges
      .map((e) => e.assistantResponse)
      .filter(Boolean);
    expect(responses).not.toContain('API Error: 503 Service Unavailable');
    expect(responses).toContain('Here is a valid response.');
  });
});
