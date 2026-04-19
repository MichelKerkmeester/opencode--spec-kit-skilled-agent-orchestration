import { EventEmitter } from 'node:events';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runAdvisorSubprocess } from '../lib/skill-advisor/subprocess.js';

vi.mock('node:child_process', () => ({
  spawn: vi.fn(),
}));

interface MockChild extends EventEmitter {
  stdout: EventEmitter & { setEncoding: (encoding: string) => void };
  stderr: EventEmitter & { setEncoding: (encoding: string) => void };
  kill: ReturnType<typeof vi.fn>;
}

function makeStream(): EventEmitter & { setEncoding: (encoding: string) => void } {
  const stream = new EventEmitter() as EventEmitter & { setEncoding: (encoding: string) => void };
  stream.setEncoding = vi.fn();
  return stream;
}

function mockChild(): MockChild {
  const child = new EventEmitter() as MockChild;
  child.stdout = makeStream();
  child.stderr = makeStream();
  child.kill = vi.fn(() => {
    setTimeout(() => child.emit('close', null, 'SIGKILL'), 0);
    return true;
  });
  return child;
}

async function importSpawnMock() {
  const childProcess = await import('node:child_process');
  return vi.mocked(childProcess.spawn);
}

let workspaceRoot = '';
let scriptPath = '';

beforeEach(() => {
  workspaceRoot = mkdtempSync(join(tmpdir(), 'advisor-subprocess-'));
  scriptPath = join(workspaceRoot, 'skill_advisor.py');
  writeFileSync(scriptPath, '# advisor\n', 'utf8');
  vi.useRealTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  rmSync(workspaceRoot, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('runAdvisorSubprocess', () => {
  it('parses strict JSON array output', async () => {
    const spawnMock = await importSpawnMock();
    const child = mockChild();
    spawnMock.mockReturnValue(child as never);

    const promise = runAdvisorSubprocess('implement feature X', { workspaceRoot, scriptPath });
    child.stdout.emit('data', '[{"skill":"sk-code-opencode","confidence":0.91,"uncertainty":0.1}]');
    child.emit('close', 0, null);
    const result = await promise;

    expect(result.ok).toBe(true);
    expect(result.recommendations[0]?.skill).toBe('sk-code-opencode');
  });

  it('fails open on JSON parse failure', async () => {
    const spawnMock = await importSpawnMock();
    const child = mockChild();
    spawnMock.mockReturnValue(child as never);

    const promise = runAdvisorSubprocess('implement feature X', { workspaceRoot, scriptPath });
    child.stdout.emit('data', '{not-json');
    child.emit('close', 0, null);
    const result = await promise;

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe('JSON_PARSE_FAILED');
  });

  it('kills the child on timeout and reports SIGNAL_KILLED', async () => {
    vi.useFakeTimers();
    const spawnMock = await importSpawnMock();
    const child = mockChild();
    spawnMock.mockReturnValue(child as never);

    const promise = runAdvisorSubprocess('implement feature X', {
      workspaceRoot,
      scriptPath,
      timeoutMs: 5,
    });
    await vi.advanceTimersByTimeAsync(10);
    const result = await promise;

    expect(child.kill).toHaveBeenCalledWith('SIGKILL');
    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe('SIGNAL_KILLED');
  });

  it('retries SQLITE_BUSY once when timeout budget remains', async () => {
    const spawnMock = await importSpawnMock();
    const first = mockChild();
    const second = mockChild();
    spawnMock.mockReturnValueOnce(first as never).mockReturnValueOnce(second as never);

    const promise = runAdvisorSubprocess('implement feature X', {
      workspaceRoot,
      scriptPath,
      timeoutMs: 1000,
      retryJitterMs: () => 75,
    });
    first.stderr.emit('data', 'SQLITE_BUSY database is locked');
    first.emit('close', 1, null);
    setTimeout(() => {
      second.stdout.emit('data', '[{"skill":"sk-code-opencode","confidence":0.91,"uncertainty":0.1}]');
      second.emit('close', 0, null);
    }, 90);
    const result = await promise;

    expect(result.ok).toBe(true);
    expect(result.retriesAttempted).toBe(1);
    expect(spawnMock).toHaveBeenCalledTimes(2);
  });

  it('returns SCRIPT_MISSING before spawning when target is absent', async () => {
    const spawnMock = await importSpawnMock();
    const result = await runAdvisorSubprocess('implement feature X', {
      workspaceRoot,
      scriptPath: join(workspaceRoot, 'missing.py'),
    });

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe('SCRIPT_MISSING');
    expect(spawnMock).not.toHaveBeenCalled();
  });
});
