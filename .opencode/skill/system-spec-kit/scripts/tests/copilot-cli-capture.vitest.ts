// TEST: Copilot CLI Capture
// Covers workspace selection, event pairing, and tool extraction
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

function writeWorkspace(filePath: string, fields: Record<string, string>): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const content = Object.entries(fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  fs.writeFileSync(filePath, `${content}\n`, 'utf-8');
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

describe('captureCopilotConversation', () => {
  it('returns null when no matching Copilot workspace exists for the current project', async () => {
    const tempHome = makeTempRoot('speckit-copilot-home-');
    process.env.HOME = tempHome;

    const { captureCopilotConversation } = await import('../extractors/copilot-cli-capture');
    const result = await captureCopilotConversation(20, '/tmp/missing-project');

    expect(result).toBeNull();
  });

  it('selects the newest matching workspace and extracts prompts, responses, and tool calls', async () => {
    const tempHome = makeTempRoot('speckit-copilot-home-');
    process.env.HOME = tempHome;

    const projectRoot = '/tmp/spec-kit-project';
    const root = path.join(tempHome, '.copilot', 'session-state');

    const olderDir = path.join(root, 'older-session');
    writeWorkspace(path.join(olderDir, 'workspace.yaml'), {
      id: 'older-session',
      cwd: projectRoot,
      git_root: projectRoot,
      updated_at: '2026-03-15T09:00:00.000Z',
    });
    writeJsonl(path.join(olderDir, 'events.jsonl'), [
      {
        type: 'session.start',
        timestamp: '2026-03-15T09:00:00.000Z',
        data: { sessionId: 'older-session' },
      },
    ]);

    const matchingDir = path.join(root, 'matching-session');
    writeWorkspace(path.join(matchingDir, 'workspace.yaml'), {
      id: 'matching-session',
      cwd: projectRoot,
      git_root: projectRoot,
      updated_at: '2026-03-15T10:00:00.000Z',
    });
    writeJsonl(path.join(matchingDir, 'events.jsonl'), [
      {
        type: 'session.start',
        timestamp: '2026-03-15T10:00:00.000Z',
        data: {
          sessionId: 'matching-session',
          context: {
            cwd: projectRoot,
            gitRoot: projectRoot,
          },
        },
      },
      {
        type: 'user.message',
        timestamp: '2026-03-15T10:00:01.000Z',
        data: {
          content: 'Use the Copilot transcript as a stateless fallback.',
        },
      },
      {
        type: 'assistant.message',
        timestamp: '2026-03-15T10:00:02.000Z',
        data: {
          content: '',
          toolRequests: [
            {
              toolCallId: 'call_01',
              name: 'view',
              arguments: {
                path: '/tmp/spec-kit-project/scripts/loaders/data-loader.ts',
                description: 'Inspect the loader file',
              },
            },
          ],
        },
      },
      {
        type: 'tool.execution_start',
        timestamp: '2026-03-15T10:00:02.500Z',
        data: {
          toolCallId: 'call_01',
          toolName: 'view',
          arguments: {
            path: '/tmp/spec-kit-project/scripts/loaders/data-loader.ts',
            description: 'Inspect the loader file',
          },
        },
      },
      {
        type: 'tool.execution_complete',
        timestamp: '2026-03-15T10:00:03.000Z',
        data: {
          toolCallId: 'call_01',
          success: true,
          result: {
            content: 'Loader inspection complete.',
          },
        },
      },
      {
        type: 'assistant.message',
        timestamp: '2026-03-15T10:00:04.000Z',
        data: {
          content: 'I inspected the loader and prepared the Copilot fallback.',
        },
      },
    ]);

    const foreignDir = path.join(root, 'foreign-session');
    writeWorkspace(path.join(foreignDir, 'workspace.yaml'), {
      id: 'foreign-session',
      cwd: '/tmp/other-project',
      git_root: '/tmp/other-project',
      updated_at: '2026-03-15T11:00:00.000Z',
    });
    writeJsonl(path.join(foreignDir, 'events.jsonl'), [
      {
        type: 'session.start',
        timestamp: '2026-03-15T11:00:00.000Z',
        data: { sessionId: 'foreign-session' },
      },
    ]);

    const { captureCopilotConversation } = await import('../extractors/copilot-cli-capture');
    const result = await captureCopilotConversation(20, projectRoot);

    expect(result).not.toBeNull();
    expect(result?.sessionId).toBe('matching-session');
    expect(result?.sessionTitle).toContain('Use the Copilot transcript');
    expect(result?.exchanges).toEqual([
      expect.objectContaining({
        userInput: 'Use the Copilot transcript as a stateless fallback.',
        assistantResponse: 'I inspected the loader and prepared the Copilot fallback.',
      }),
    ]);
    expect(result?.toolCalls).toEqual([
      expect.objectContaining({
        tool: 'view',
        status: 'completed',
        input: expect.objectContaining({
          path: 'scripts/loaders/data-loader.ts',
        }),
      }),
    ]);
  });

  it('accepts repo-root Copilot workspace records for an active .opencode workspace identity', async () => {
    const tempHome = makeTempRoot('speckit-copilot-home-');
    process.env.HOME = tempHome;

    const repoRoot = '/tmp/spec-kit-project';
    const workspacePath = `${repoRoot}/.opencode`;
    const sessionDir = path.join(tempHome, '.copilot', 'session-state', 'workspace-match');

    writeWorkspace(path.join(sessionDir, 'workspace.yaml'), {
      id: 'workspace-match',
      cwd: repoRoot,
      git_root: repoRoot,
      updated_at: '2026-03-15T12:30:00.000Z',
    });
    writeJsonl(path.join(sessionDir, 'events.jsonl'), [
      {
        type: 'session.start',
        timestamp: '2026-03-15T12:30:00.000Z',
        data: { sessionId: 'workspace-match' },
      },
      {
        type: 'user.message',
        timestamp: '2026-03-15T12:30:01.000Z',
        data: { content: 'Match repo-root Copilot metadata to the .opencode workspace.' },
      },
      {
        type: 'assistant.message',
        timestamp: '2026-03-15T12:30:02.000Z',
        data: { content: 'Resolved the Copilot workspace through the canonical .opencode identity.' },
      },
    ]);

    const { captureCopilotConversation } = await import('../extractors/copilot-cli-capture');
    const result = await captureCopilotConversation(20, workspacePath);

    expect(result?.sessionId).toBe('workspace-match');
    expect(result?.exchanges[0]).toEqual(expect.objectContaining({
      userInput: 'Match repo-root Copilot metadata to the .opencode workspace.',
      assistantResponse: 'Resolved the Copilot workspace through the canonical .opencode identity.',
    }));
  });
});
