import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { loadMatchingStatesMock } = vi.hoisted(() => ({
  loadMatchingStatesMock: vi.fn(() => ({ states: [], errors: [] })),
}));

vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getStats: vi.fn(() => ({
    totalFiles: 10,
    totalNodes: 50,
    totalEdges: 30,
    lastScanTimestamp: new Date().toISOString(),
    dbFileSize: 2048,
    schemaVersion: 1,
    nodesByKind: {},
    edgesByType: {},
    parseHealthSummary: {},
  })),
}));

vi.mock('../lib/code-graph/ensure-ready.js', () => ({
  getGraphFreshness: vi.fn(() => 'fresh'),
}));

vi.mock('../lib/session/context-metrics.js', () => ({
  computeQualityScore: vi.fn(() => ({
    level: 'degraded',
    score: 0.5,
    factors: { recency: 0, recovery: 0, graphFreshness: 0, continuity: 0 },
  })),
  recordMetricEvent: vi.fn(),
  recordBootstrapEvent: vi.fn(),
}));

vi.mock('../hooks/claude/hook-state.js', () => ({
  loadMatchingStates: loadMatchingStatesMock,
}));

interface SessionResumeModule {
  handleSessionResume: (args: {
    specFolder?: string;
    sessionId?: string;
    minimal?: boolean;
  }) => Promise<{ content: Array<{ type: string; text: string }> }>;
}

interface CallerContextModule {
  runWithCallerContext: <T>(ctx: {
    sessionId: string | null;
    transport: 'stdio' | 'sse' | 'ws' | 'unknown';
    connectedAt: string;
    callerPid?: number;
    metadata: Record<string, unknown>;
  }, fn: () => T) => T;
}

const SPEC_FOLDER = 'system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/003-rollout-sweeps';
const workspacesToRemove: string[] = [];
let originalCwd = process.cwd();

function createWorkspace(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'session-resume-auth-'));
}

function writeImplementationSummary(workspacePath: string): void {
  const fullPath = path.join(
    workspacePath,
    '.opencode',
    'specs',
    SPEC_FOLDER,
    'implementation-summary.md',
  );
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(
    fullPath,
    [
      '---',
      'title: "Wave C implementation summary"',
      '_memory:',
      '  continuity:',
      `    packet_pointer: "${SPEC_FOLDER}"`,
      '    last_updated_at: "2026-04-17T15:00:00Z"',
      '    last_updated_by: "session-resume-auth-test"',
      '    recent_action: "Prepared session resume auth fixture"',
      '    next_safe_action: "Run auth binding tests"',
      '    blockers: []',
      '---',
      '# Implementation Summary',
      '',
      'Session resume auth binding fixture.',
      '',
    ].join('\n'),
    'utf8',
  );
}

function makeCallerContext(sessionId: string | null): {
  sessionId: string | null;
  transport: 'stdio' | 'sse' | 'ws' | 'unknown';
  connectedAt: string;
  callerPid: number;
  metadata: Record<string, unknown>;
} {
  return {
    sessionId,
    transport: 'stdio',
    connectedAt: '2026-04-17T15:03:56.239Z',
    callerPid: 4242,
    metadata: {
      pid: 4242,
      source: 'vitest',
    },
  };
}

async function loadModules(): Promise<SessionResumeModule & CallerContextModule> {
  vi.resetModules();
  const [sessionResumeModule, callerContextModule] = await Promise.all([
    import('../handlers/session-resume.js'),
    import('../lib/context/caller-context.js'),
  ]);

  return {
    handleSessionResume: sessionResumeModule.handleSessionResume,
    runWithCallerContext: callerContextModule.runWithCallerContext,
  };
}

async function invokeWithContext(options: {
  handlerSessionId?: unknown;
  callerSessionId: string | null;
}): Promise<{ content: Array<{ type: string; text: string }> }> {
  const workspacePath = createWorkspace();
  workspacesToRemove.push(workspacePath);
  writeImplementationSummary(workspacePath);
  process.chdir(workspacePath);

  const { handleSessionResume, runWithCallerContext } = await loadModules();

  return runWithCallerContext(
    makeCallerContext(options.callerSessionId),
    () => handleSessionResume({
      specFolder: SPEC_FOLDER,
      minimal: true,
      ...(options.handlerSessionId !== undefined ? { sessionId: options.handlerSessionId as string } : {}),
    }),
  );
}

function expectLatestScopeClauses(expectedSessionId: string | undefined): void {
  const latestScope = loadMatchingStatesMock.mock.calls.at(-1)?.[0]?.scope;
  expect(latestScope?.specFolder).toBe(SPEC_FOLDER);
  expect(latestScope?.claudeSessionId).toBe(expectedSessionId);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  originalCwd = process.cwd();
  loadMatchingStatesMock.mockReturnValue({ states: [], errors: [] });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  process.chdir(originalCwd);
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  while (workspacesToRemove.length > 0) {
    const workspacePath = workspacesToRemove.pop();
    if (workspacePath) {
      fs.rmSync(workspacePath, { recursive: true, force: true });
    }
  }
});

describe('session-resume auth binding', () => {
  it('proceeds when args.sessionId matches callerContext.sessionId', async () => {
    const result = await invokeWithContext({
      handlerSessionId: 'session-123',
      callerSessionId: 'session-123',
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
    expectLatestScopeClauses('session-123');
  });

  it('throws on mismatched sessionId in default strict mode', async () => {
    await expect(invokeWithContext({
      handlerSessionId: 'requested-session',
      callerSessionId: 'transport-session',
    })).rejects.toThrow(
      "Session-ID mismatch: args.sessionId='requested-session' vs callerContext.sessionId='transport-session' — rejecting cross-session resume",
    );
  });

  it('proceeds when callerContext.sessionId is null', async () => {
    const result = await invokeWithContext({
      handlerSessionId: 'requested-session',
      callerSessionId: null,
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
    expectLatestScopeClauses('requested-session');
  });

  it('proceeds when args.sessionId is not provided', async () => {
    const result = await invokeWithContext({
      callerSessionId: 'transport-session',
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
    expectLatestScopeClauses(undefined);
  });

  it('logs a warning and proceeds in permissive mode on mismatch', async () => {
    vi.stubEnv('MCP_SESSION_RESUME_AUTH_MODE', 'permissive');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await invokeWithContext({
      handlerSessionId: 'requested-session',
      callerSessionId: 'transport-session',
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
    expect(warnSpy).toHaveBeenCalledWith(
      "[session-resume] Session-ID mismatch: args.sessionId='requested-session' vs callerContext.sessionId='transport-session' (permissive mode — allowing)",
    );
    expectLatestScopeClauses('requested-session');
  });

  it('defaults to strict mode when MCP_SESSION_RESUME_AUTH_MODE is unset', async () => {
    delete process.env.MCP_SESSION_RESUME_AUTH_MODE;

    await expect(invokeWithContext({
      handlerSessionId: 'requested-session',
      callerSessionId: 'transport-session',
    })).rejects.toThrow(
      "Session-ID mismatch: args.sessionId='requested-session' vs callerContext.sessionId='transport-session' — rejecting cross-session resume",
    );
  });

  it('ignores non-string args.sessionId values', async () => {
    const result = await invokeWithContext({
      handlerSessionId: 12345,
      callerSessionId: 'transport-session',
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
    expectLatestScopeClauses(undefined);
  });

  it('treats an empty string sessionId as not provided', async () => {
    const result = await invokeWithContext({
      handlerSessionId: '',
      callerSessionId: 'transport-session',
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
    expectLatestScopeClauses(undefined);
  });
});
