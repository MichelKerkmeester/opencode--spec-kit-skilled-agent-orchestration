// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Harness
// ───────────────────────────────────────────────────────────────────

import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { mkdtempSync } from 'node:fs';
import {
  ensureStateDir,
  getStatePath,
  loadState,
  type HookState,
} from '../../hooks/claude/hook-state.js';
import {
  processStopHook,
  type SessionStopProcessResult,
} from '../../hooks/claude/session-stop.js';
import type { HookInput } from '../../hooks/claude/shared.js';

export interface StopReplayRunResult {
  process: SessionStopProcessResult;
  state: HookState | null;
  statePath: string;
  stateDir: string;
  stateFileCount: number;
}

export interface StopReplaySandbox {
  sandboxRoot: string;
  projectRoot: string;
  tempRoot: string;
  transcriptPath: string;
  run(inputOverrides?: Partial<HookInput>): Promise<StopReplayRunResult>;
  cleanup(): void;
}

function withSandbox<T>(
  projectRoot: string,
  tempRoot: string,
  fn: () => Promise<T>,
): Promise<T> {
  const previousCwd = process.cwd();
  const previousTmpdir = process.env.TMPDIR;
  process.chdir(projectRoot);
  process.env.TMPDIR = tempRoot;

  return fn().finally(() => {
    process.chdir(previousCwd);
    if (previousTmpdir === undefined) {
      delete process.env.TMPDIR;
    } else {
      process.env.TMPDIR = previousTmpdir;
    }
  });
}

function assertSandboxedWrites(touchedPaths: string[], sandboxRoot: string): void {
  for (const touchedPath of touchedPaths) {
    if (!touchedPath.startsWith(sandboxRoot)) {
      throw new Error(`Out-of-bound write detected: ${touchedPath}`);
    }
  }
}

export function createStopReplaySandbox(
  fixturePath: string,
  sessionId: string = 'replay-session',
): StopReplaySandbox {
  const sandboxRoot = mkdtempSync(join(resolve(tmpdir()), 'speckit-stop-replay-'));
  const projectRoot = join(sandboxRoot, 'project');
  const tempRoot = join(sandboxRoot, 'tmp');
  const transcriptRoot = join(sandboxRoot, 'transcripts');
  const transcriptPath = join(transcriptRoot, basename(fixturePath));

  mkdirSync(projectRoot, { recursive: true });
  mkdirSync(tempRoot, { recursive: true });
  mkdirSync(transcriptRoot, { recursive: true });
  cpSync(fixturePath, transcriptPath);

  return {
    sandboxRoot,
    projectRoot,
    tempRoot,
    transcriptPath,
    async run(inputOverrides: Partial<HookInput> = {}): Promise<StopReplayRunResult> {
      return withSandbox(projectRoot, tempRoot, async () => {
        ensureStateDir();
        const input: HookInput = {
          session_id: sessionId,
          transcript_path: transcriptPath,
          stop_hook_active: true,
          ...inputOverrides,
        };

        const processResult = await processStopHook(input, { autosaveMode: 'disabled' });
        assertSandboxedWrites(processResult.touchedPaths, sandboxRoot);

        const statePath = getStatePath(sessionId);
        const stateDir = dirname(statePath);
        const state = loadState(sessionId);
        const stateFileCount = readdirSync(stateDir).filter((file) => file.endsWith('.json')).length;

        return {
          process: processResult,
          state,
          statePath,
          stateDir,
          stateFileCount,
        };
      });
    },
    cleanup(): void {
      rmSync(sandboxRoot, { recursive: true, force: true });
    },
  };
}
