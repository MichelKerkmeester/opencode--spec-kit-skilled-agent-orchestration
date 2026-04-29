// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Adapter Test Utilities
// ───────────────────────────────────────────────────────────────────

import { EventEmitter } from 'node:events';
import { spawn } from 'node:child_process';

import { expect, vi } from 'vitest';

import type { Mock, MockedFunction } from 'vitest';
import type { AdapterInput } from '../matrix-runners/adapter-common.js';

class MockStream extends EventEmitter {
  readonly setEncoding: Mock<(encoding: BufferEncoding) => void> = vi.fn();
}

/** Minimal child-process mock used by matrix adapter tests. */
export class MockChildProcess extends EventEmitter {
  readonly stdout = new MockStream();
  readonly stderr = new MockStream();
  readonly stdin: {
    readonly write: Mock<(chunk: string) => void>;
    readonly end: Mock<() => void>;
  } = {
    write: vi.fn(),
    end: vi.fn(),
  };
  readonly kill: Mock<(signal?: NodeJS.Signals | number) => boolean> = vi.fn(() => true);
}

/** Build a default matrix adapter input for a single expected signal. */
export function baseInput(signal: string): AdapterInput {
  return {
    featureId: 'F1',
    promptTemplate: 'Return the matrix signal.',
    expectedSignal: signal,
    timeoutSeconds: 1,
    workingDir: process.cwd(),
  };
}

/** Return the typed mocked spawn function. */
export function spawnMock(): MockedFunction<typeof spawn> {
  return vi.mocked(spawn);
}

/** Mock a child process that emits stdout/stderr and exits successfully. */
export function mockSpawnSuccess(stdout: string, stderr = ''): MockChildProcess {
  const child = new MockChildProcess();
  spawnMock().mockReturnValue(child as never);
  setTimeout(() => {
    if (stdout.length > 0) {
      child.stdout.emit('data', stdout);
    }
    if (stderr.length > 0) {
      child.stderr.emit('data', stderr);
    }
    child.emit('close', 0, null);
  }, 0);
  return child;
}

/** Mock a child process that stays open until the adapter timeout fires. */
export function mockSpawnNeverCloses(): MockChildProcess {
  const child = new MockChildProcess();
  spawnMock().mockReturnValue(child as never);
  return child;
}

/** Assert the adapter spawned the expected command and argument vector. */
export function expectSpawned(command: string, args: readonly string[]): void {
  expect(spawnMock()).toHaveBeenCalledWith(
    command,
    args,
    expect.objectContaining({ stdio: ['pipe', 'pipe', 'pipe'] }),
  );
}
