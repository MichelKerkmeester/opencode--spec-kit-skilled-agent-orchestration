// TEST: OpenCode Capture project selection
// Guards against stale project resolution when workspaces share a .opencode anchor.
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

function writeSessionFile(
  storageRoot: string,
  projectId: string,
  sessionId: string,
  directory: string,
  updated: number,
): void {
  const sessionPath = path.join(storageRoot, 'session', projectId, `${sessionId}.json`);
  fs.mkdirSync(path.dirname(sessionPath), { recursive: true });
  fs.writeFileSync(
    sessionPath,
    JSON.stringify({
      id: sessionId,
      title: sessionId,
      directory,
      time: {
        created: updated - 1_000,
        updated,
      },
    }),
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

describe('getProjectId', () => {
  it('ignores unrelated projects that only match via shared .opencode anchors', async () => {
    const tempHome = makeTempRoot('speckit-opencode-home-');
    process.env.HOME = tempHome;

    const storageRoot = path.join(tempHome, '.local', 'share', 'opencode', 'storage');
    const targetWorkspace = path.join(tempHome, 'workspace-target');
    const otherWorkspace = path.join(tempHome, 'workspace-other');

    fs.mkdirSync(path.join(targetWorkspace, '.opencode'), { recursive: true });
    fs.mkdirSync(otherWorkspace, { recursive: true });
    fs.symlinkSync(
      path.join(targetWorkspace, '.opencode'),
      path.join(otherWorkspace, '.opencode'),
      'dir',
    );

    writeSessionFile(storageRoot, 'aaa-stale-project', 'ses_stale', otherWorkspace, 300);
    writeSessionFile(storageRoot, 'zzz-correct-project', 'ses_correct', targetWorkspace, 200);

    const { getProjectId } = await import('../extractors/opencode-capture');
    expect(getProjectId(targetWorkspace)).toBe('zzz-correct-project');
  });

  it('chooses the newest project when multiple exact directory matches exist', async () => {
    const tempHome = makeTempRoot('speckit-opencode-home-');
    process.env.HOME = tempHome;

    const storageRoot = path.join(tempHome, '.local', 'share', 'opencode', 'storage');
    const targetWorkspace = path.join(tempHome, 'workspace-target');
    fs.mkdirSync(path.join(targetWorkspace, '.opencode'), { recursive: true });

    writeSessionFile(storageRoot, 'aaa-older-project', 'ses_old', targetWorkspace, 100);
    writeSessionFile(storageRoot, 'bbb-newer-project', 'ses_new', targetWorkspace, 900);

    const { getProjectId } = await import('../extractors/opencode-capture');
    expect(getProjectId(targetWorkspace)).toBe('bbb-newer-project');
  });

  it('matches when requested directory is a child of the captured session directory', async () => {
    const tempHome = makeTempRoot('speckit-opencode-home-');
    process.env.HOME = tempHome;

    const storageRoot = path.join(tempHome, '.local', 'share', 'opencode', 'storage');
    const targetWorkspace = path.join(tempHome, 'workspace-target');
    const nestedDirectory = path.join(targetWorkspace, '.opencode', 'skill', 'system-spec-kit');

    fs.mkdirSync(path.join(targetWorkspace, '.opencode'), { recursive: true });
    fs.mkdirSync(nestedDirectory, { recursive: true });

    writeSessionFile(storageRoot, 'nested-project', 'ses_nested', targetWorkspace, 500);

    const { getProjectId } = await import('../extractors/opencode-capture');
    expect(getProjectId(nestedDirectory)).toBe('nested-project');
  });

  it('prefers native OpenCode session list and export data for fresh live captures', async () => {
    const tempHome = makeTempRoot('speckit-opencode-home-');
    process.env.HOME = tempHome;

    const workspace = path.join(tempHome, 'workspace-target');
    fs.mkdirSync(workspace, { recursive: true });

    const execFileSync = vi.fn((command: string, args?: readonly string[]) => {
      if (command !== 'opencode' || !args) {
        throw new Error('Unexpected command');
      }

      if (args[0] === 'session' && args[1] === 'list') {
        return [
          'Could not find any skills directories.',
          JSON.stringify([
            {
              id: 'ses_live',
              title: 'OpenCode Proof 2026-03-17',
              updated: 1_777_000_005_000,
              created: 1_777_000_000_000,
              projectId: 'native-project',
              directory: workspace,
            },
          ], null, 2),
        ].join('\n');
      }

      if (args[0] === 'export' && args[1] === 'ses_live') {
        return [
          'Exporting session: ses_live',
          JSON.stringify({
            info: {
              id: 'ses_live',
              title: 'OpenCode Proof 2026-03-17',
              summary: { files: 1 },
              time: {
                created: 1_777_000_000_000,
                updated: 1_777_000_005_000,
              },
            },
            messages: [
              {
                info: {
                  id: 'msg_user_1',
                  sessionID: 'ses_live',
                  role: 'user',
                  time: { created: 1_777_000_000_100 },
                },
                parts: [{ type: 'text', text: 'First prompt' }],
              },
              {
                info: {
                  id: 'msg_assistant_1',
                  sessionID: 'ses_live',
                  role: 'assistant',
                  parentID: 'msg_user_1',
                  agent: 'build',
                  time: { created: 1_777_000_000_200, completed: 1_777_000_000_250 },
                },
                parts: [
                  {
                    type: 'tool',
                    tool: 'read',
                    callID: 'call-read-1',
                    state: {
                      status: 'completed',
                      input: { file: 'README.md' },
                      output: 'file contents',
                      time: { start: 1_777_000_000_205, end: 1_777_000_000_215 },
                    },
                  },
                  { type: 'text', text: 'First answer' },
                ],
              },
              {
                info: {
                  id: 'msg_user_2',
                  sessionID: 'ses_live',
                  role: 'user',
                  time: { created: 1_777_000_001_100 },
                },
                parts: [{ type: 'text', text: 'Second prompt' }],
              },
              {
                info: {
                  id: 'msg_assistant_2',
                  sessionID: 'ses_live',
                  role: 'assistant',
                  parentID: 'msg_user_2',
                  agent: 'build',
                  time: { created: 1_777_000_001_200, completed: 1_777_000_001_260 },
                },
                parts: [
                  {
                    type: 'tool',
                    tool: 'grep',
                    callID: 'call-grep-1',
                    state: {
                      status: 'completed',
                      input: { pattern: 'skipped_duplicate' },
                      output: 'match',
                      time: { start: 1_777_000_001_205, end: 1_777_000_001_220 },
                    },
                  },
                  { type: 'text', text: 'Second answer' },
                ],
              },
            ],
          }, null, 2),
        ].join('\n');
      }

      throw new Error(`Unexpected opencode args: ${args.join(' ')}`);
    });

    vi.doMock('node:child_process', () => ({ execFileSync }));

    const { captureConversation } = await import('../extractors/opencode-capture');
    const result = await captureConversation(10, workspace);

    expect(result.projectId).toBe('native-project');
    expect(result.sessionId).toBe('ses_live');
    expect(result.sessionTitle).toBe('OpenCode Proof 2026-03-17');
    expect(result.exchanges).toHaveLength(2);
    expect(result.exchanges[0]?.userInput).toBe('First prompt');
    expect(result.exchanges[1]?.userInput).toBe('Second prompt');
    expect(result.toolCalls).toHaveLength(2);
    expect(result.toolCalls.map((call) => call.tool)).toEqual(['read', 'grep']);
    expect(execFileSync).toHaveBeenCalledWith(
      'opencode',
      ['session', 'list', '--format', 'json', '--max-count', '200'],
      expect.objectContaining({ encoding: 'utf8' }),
    );
    expect(execFileSync).toHaveBeenCalledWith(
      'opencode',
      ['export', 'ses_live'],
      expect.objectContaining({ encoding: 'utf8' }),
    );
  });
});
