// TEST: Codex CLI Capture
// Covers transcript selection, reasoning exclusion, and tool extraction
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

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  process.env.HOME = ORIGINAL_HOME;
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop()!, { recursive: true, force: true });
  }
});

describe('captureCodexConversation', () => {
  it('returns null when no matching Codex transcript exists for the current project', async () => {
    const tempHome = makeTempRoot('speckit-codex-home-');
    process.env.HOME = tempHome;

    const { captureCodexConversation } = await import('../extractors/codex-cli-capture');
    const result = await captureCodexConversation(20, '/tmp/missing-project');

    expect(result).toBeNull();
  });

  it('selects the newest project-matching transcript and ignores reasoning-only content', async () => {
    const tempHome = makeTempRoot('speckit-codex-home-');
    process.env.HOME = tempHome;

    const projectRoot = '/tmp/spec-kit-project';
    const sessionsRoot = path.join(tempHome, '.codex', 'sessions', '2026', '03', '15');
    const foreignPath = path.join(sessionsRoot, 'rollout-2026-03-15T09-00-00-foreign.jsonl');
    const matchingPath = path.join(sessionsRoot, 'rollout-2026-03-15T10-00-00-matching.jsonl');

    writeJsonl(foreignPath, [
      {
        timestamp: '2026-03-15T09:00:00.000Z',
        type: 'response_item',
        payload: {
          type: 'session_meta',
          id: 'foreign-session',
          cwd: '/tmp/other-project',
          timestamp: '2026-03-15T09:00:00.000Z',
        },
      },
    ]);

    writeJsonl(matchingPath, [
      {
        timestamp: '2026-03-15T10:00:00.000Z',
        type: 'response_item',
        payload: {
          type: 'session_meta',
          id: 'matching-session',
          cwd: projectRoot,
          timestamp: '2026-03-15T10:00:00.000Z',
        },
      },
      {
        timestamp: '2026-03-15T10:00:01.000Z',
        type: 'response_item',
        payload: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: 'Capture the Codex session for spec-kit memory saves.',
            },
          ],
        },
      },
      {
        timestamp: '2026-03-15T10:00:01.500Z',
        type: 'response_item',
        payload: {
          type: 'reasoning',
          content: null,
        },
      },
      {
        timestamp: '2026-03-15T10:00:02.000Z',
        type: 'response_item',
        payload: {
          type: 'function_call',
          call_id: 'call_01',
          name: 'Read',
          arguments: JSON.stringify({
            filePath: '/tmp/spec-kit-project/scripts/loaders/data-loader.ts',
            description: 'Inspect the loader entry point',
          }),
        },
      },
      {
        timestamp: '2026-03-15T10:00:02.500Z',
        type: 'response_item',
        payload: {
          type: 'function_call',
          call_id: 'call_02',
          name: 'Read',
          arguments: JSON.stringify({
            filePath: '/tmp/outside-project/README.md',
            description: 'Outside project path',
          }),
        },
      },
      {
        timestamp: '2026-03-15T10:00:03.000Z',
        type: 'response_item',
        payload: {
          type: 'function_call_output',
          call_id: 'call_01',
          output: { status: 'ok', summary: 'Loader inspection complete.' },
        },
      },
      {
        timestamp: '2026-03-15T10:00:04.000Z',
        type: 'response_item',
        payload: {
          type: 'message',
          role: 'assistant',
          content: [
            {
              type: 'output_text',
              text: 'I inspected the loader and prepared the Codex fallback.',
            },
          ],
        },
      },
    ]);

    const foreignTime = new Date('2026-03-15T09:00:00.000Z');
    const matchingTime = new Date('2026-03-15T10:00:00.000Z');
    fs.utimesSync(foreignPath, foreignTime, foreignTime);
    fs.utimesSync(matchingPath, matchingTime, matchingTime);

    const { captureCodexConversation } = await import('../extractors/codex-cli-capture');
    const result = await captureCodexConversation(20, projectRoot);

    expect(result).not.toBeNull();
    expect(result?.sessionId).toBe('matching-session');
    expect(result?.sessionTitle).toContain('Capture the Codex session');
    expect(result?.exchanges).toEqual([
      expect.objectContaining({
        userInput: 'Capture the Codex session for spec-kit memory saves.',
        assistantResponse: 'I inspected the loader and prepared the Codex fallback.',
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
    ]));
    expect(result?.toolCalls[1]).toEqual(expect.objectContaining({
      tool: 'read',
      input: expect.not.objectContaining({
        filePath: expect.anything(),
      }),
    }));
  });

  it('accepts repo-root Codex transcripts for an active .opencode workspace identity', async () => {
    const tempHome = makeTempRoot('speckit-codex-home-');
    process.env.HOME = tempHome;

    const repoRoot = '/tmp/spec-kit-project';
    const workspacePath = `${repoRoot}/.opencode`;
    const sessionsRoot = path.join(tempHome, '.codex', 'sessions', '2026', '03', '15');
    const matchingPath = path.join(sessionsRoot, 'rollout-2026-03-15T12-00-00-matching.jsonl');

    writeJsonl(matchingPath, [
      {
        timestamp: '2026-03-15T12:00:00.000Z',
        type: 'response_item',
        payload: {
          type: 'session_meta',
          id: 'matching-session',
          cwd: repoRoot,
          timestamp: '2026-03-15T12:00:00.000Z',
        },
      },
      {
        timestamp: '2026-03-15T12:00:01.000Z',
        type: 'response_item',
        payload: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text: 'Use .opencode as the canonical workspace anchor.' }],
        },
      },
      {
        timestamp: '2026-03-15T12:00:02.000Z',
        type: 'response_item',
        payload: {
          type: 'message',
          role: 'assistant',
          content: [{ type: 'output_text', text: 'Matched the repo-root transcript to the active .opencode workspace.' }],
        },
      },
    ]);

    const { captureCodexConversation } = await import('../extractors/codex-cli-capture');
    const result = await captureCodexConversation(20, workspacePath);

    expect(result?.sessionId).toBe('matching-session');
    expect(result?.exchanges[0]).toEqual(expect.objectContaining({
      userInput: 'Use .opencode as the canonical workspace anchor.',
      assistantResponse: 'Matched the repo-root transcript to the active .opencode workspace.',
    }));
  });
});
