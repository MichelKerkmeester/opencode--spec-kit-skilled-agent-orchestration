// TEST: Claude Code Capture
// Covers transcript selection, prompt/tool extraction, and graceful fallback
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

function writeJsonl(filePath: string, entries: unknown[]): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${entries.map((entry) => JSON.stringify(entry)).join('\n')}\n`,
    'utf-8',
  );
}

function sanitizedProjectRoot(projectRoot: string): string {
  return projectRoot.replace(/[^A-Za-z0-9._-]+/g, '-');
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

describe('captureClaudeConversation', () => {
  it('returns null when no Claude project transcript exists for the current project', async () => {
    const tempHome = makeTempRoot('speckit-claude-home-');
    process.env.HOME = tempHome;

    const { captureClaudeConversation } = await import('../extractors/claude-code-capture');
    const result = await captureClaudeConversation(20, '/tmp/missing-project');

    expect(result).toBeNull();
  });

  it('prefers the exact history-matched session transcript and ignores thinking and command scaffolding', async () => {
    const tempHome = makeTempRoot('speckit-claude-home-');
    process.env.HOME = tempHome;

    const projectRoot = '/tmp/spec-kit-project';
    const projectDir = path.join(
      tempHome,
      '.claude',
      'projects',
      sanitizedProjectRoot(projectRoot),
    );
    const historyPath = path.join(tempHome, '.claude', 'history.jsonl');

    fs.mkdirSync(projectDir, { recursive: true });
    fs.mkdirSync(path.dirname(historyPath), { recursive: true });

    fs.writeFileSync(
      historyPath,
      [
        JSON.stringify({
          project: projectRoot,
          sessionId: 'matched-session',
          timestamp: Date.now(),
        }),
        JSON.stringify({
          project: projectRoot,
          sessionId: 'older-session',
          timestamp: Date.now() - 1_000,
        }),
      ].join('\n'),
      'utf-8',
    );

    writeJsonl(path.join(projectDir, 'older-session.jsonl'), [
      {
        type: 'user',
        timestamp: '2026-03-15T08:00:00.000Z',
        message: { content: 'Older prompt that should not be selected.' },
        sessionId: 'older-session',
      },
    ]);

    writeJsonl(path.join(projectDir, 'matched-session.jsonl'), [
      {
        type: 'file-history-snapshot',
        timestamp: '2026-03-15T09:00:00.000Z',
        snapshot: {
          trackedFileBackups: {
            '/tmp/spec-kit-project/scripts/core/workflow.ts': { version: 1 },
            '/tmp/outside-project/README.md': { version: 1 },
          },
        },
      },
      {
        type: 'user',
        timestamp: '2026-03-15T09:00:01.000Z',
        message: {
          content: '<local-command-caveat>Ignore this local command transcript.</local-command-caveat>',
        },
        sessionId: 'matched-session',
      },
      {
        type: 'user',
        timestamp: '2026-03-15T09:00:02.000Z',
        message: {
          content: 'Implement the Claude capture fallback for stateless saves.',
        },
        sessionId: 'matched-session',
      },
      {
        type: 'assistant',
        timestamp: '2026-03-15T09:00:03.000Z',
        message: {
          content: [
            { type: 'thinking', thinking: 'private chain of thought' },
            { type: 'text', text: 'I will inspect the loader and add a bounded fallback.' },
          ],
        },
        sessionId: 'matched-session',
      },
      {
        type: 'assistant',
        timestamp: '2026-03-15T09:00:04.000Z',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'toolu_01',
              name: 'Read',
              input: {
                filePath: 'scripts/loaders/data-loader.ts',
                description: 'Inspect the loader entry point',
              },
            },
          ],
        },
        sessionId: 'matched-session',
      },
      {
        type: 'user',
        timestamp: '2026-03-15T09:00:05.000Z',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'toolu_01',
              content: [{ type: 'text', text: 'Loader inspection complete.' }],
              is_error: false,
            },
          ],
        },
        sessionId: 'matched-session',
      },
    ]);

    const { captureClaudeConversation } = await import('../extractors/claude-code-capture');
    const result = await captureClaudeConversation(20, projectRoot);

    expect(result).not.toBeNull();
    expect(result?.sessionId).toBe('matched-session');
    expect(result?.sessionTitle).toContain('Implement the Claude capture fallback');
    expect(result?.exchanges).toEqual([
      expect.objectContaining({
        userInput: 'Implement the Claude capture fallback for stateless saves.',
        assistantResponse: 'I will inspect the loader and add a bounded fallback.',
      }),
    ]);
    expect(result?.toolCalls).toEqual(expect.arrayContaining([
      expect.objectContaining({
        tool: 'read',
        status: 'completed',
        input: expect.objectContaining({
          filePath: 'scripts/loaders/data-loader.ts',
        }),
      }),
      expect.objectContaining({
        tool: 'edit',
        status: 'snapshot',
        input: expect.objectContaining({
          filePath: 'scripts/core/workflow.ts',
        }),
      }),
    ]));
  });

  it('falls back to the newest transcript when history has no exact session hint', async () => {
    const tempHome = makeTempRoot('speckit-claude-home-');
    process.env.HOME = tempHome;

    const projectRoot = '/tmp/spec-kit-project';
    const projectDir = path.join(
      tempHome,
      '.claude',
      'projects',
      sanitizedProjectRoot(projectRoot),
    );

    fs.mkdirSync(projectDir, { recursive: true });

    const olderPath = path.join(projectDir, 'older.jsonl');
    const newerPath = path.join(projectDir, 'newer.jsonl');
    writeJsonl(olderPath, [
      {
        type: 'user',
        timestamp: '2026-03-15T07:00:00.000Z',
        message: { content: 'Older session prompt.' },
        sessionId: 'older',
      },
    ]);
    writeJsonl(newerPath, [
      {
        type: 'user',
        timestamp: '2026-03-15T10:00:00.000Z',
        message: { content: 'Newest transcript prompt.' },
        sessionId: 'newer',
      },
      {
        type: 'assistant',
        timestamp: '2026-03-15T10:00:01.000Z',
        message: { content: [{ type: 'text', text: 'Newest transcript response.' }] },
        sessionId: 'newer',
      },
    ]);

    const olderTime = new Date('2026-03-15T07:00:00.000Z');
    const newerTime = new Date('2026-03-15T10:00:00.000Z');
    fs.utimesSync(olderPath, olderTime, olderTime);
    fs.utimesSync(newerPath, newerTime, newerTime);

    const { captureClaudeConversation } = await import('../extractors/claude-code-capture');
    const result = await captureClaudeConversation(20, projectRoot);

    expect(result?.sessionId).toBe('newer');
    expect(result?.exchanges[0]).toEqual(expect.objectContaining({
      userInput: 'Newest transcript prompt.',
      assistantResponse: 'Newest transcript response.',
    }));
  });

  it('accepts repo-root Claude transcripts for an active .opencode workspace identity', async () => {
    const tempHome = makeTempRoot('speckit-claude-home-');
    process.env.HOME = tempHome;

    const repoRoot = '/tmp/spec-kit-project';
    const workspacePath = `${repoRoot}/.opencode`;
    const projectDir = path.join(
      tempHome,
      '.claude',
      'projects',
      sanitizedProjectRoot(repoRoot),
    );
    const historyPath = path.join(tempHome, '.claude', 'history.jsonl');

    fs.mkdirSync(projectDir, { recursive: true });
    fs.mkdirSync(path.dirname(historyPath), { recursive: true });
    fs.writeFileSync(
      historyPath,
      `${JSON.stringify({ project: repoRoot, sessionId: 'repo-root-session', timestamp: Date.now() })}\n`,
      'utf-8',
    );

    writeJsonl(path.join(projectDir, 'repo-root-session.jsonl'), [
      {
        type: 'user',
        timestamp: '2026-03-15T11:00:00.000Z',
        message: { content: 'Normalize the workspace identity through .opencode.' },
        sessionId: 'repo-root-session',
      },
      {
        type: 'assistant',
        timestamp: '2026-03-15T11:00:01.000Z',
        message: { content: [{ type: 'text', text: 'Matched the repo root to the canonical .opencode workspace.' }] },
        sessionId: 'repo-root-session',
      },
    ]);

    const { captureClaudeConversation } = await import('../extractors/claude-code-capture');
    const result = await captureClaudeConversation(20, workspacePath);

    expect(result?.sessionId).toBe('repo-root-session');
    expect(result?.exchanges[0]).toEqual(expect.objectContaining({
      userInput: 'Normalize the workspace identity through .opencode.',
      assistantResponse: 'Matched the repo root to the canonical .opencode workspace.',
    }));
  });
});
