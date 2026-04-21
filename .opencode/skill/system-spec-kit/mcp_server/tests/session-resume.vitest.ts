import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// T-SRS-03: session-resume.getCachedSessionSummaryDecision now uses
// loadMatchingStates instead of loadMostRecentState to enable per-candidate
// retry.  The existing fixtures supply a single state via loadMostRecentStateMock;
// we translate that into a loadMatchingStates shape for the handler.
const { loadMostRecentStateMock, loadMatchingStatesMock } = vi.hoisted(() => {
  const loadMostRecentStateMock = vi.fn(() => ({ ok: false, reason: 'not_found', errors: [] }));
  const loadMatchingStatesMock = vi.fn(() => {
    const recent = loadMostRecentStateMock();
    if (recent.ok) {
      const updatedAtParsed = Date.parse(recent.state.updatedAt);
      const updatedAtMs = Number.isFinite(updatedAtParsed) ? updatedAtParsed : 0;
      return {
        states: [{
          state: recent.state,
          path: recent.path,
          updatedAtMs,
          mtimeMs: updatedAtMs,
        }],
        errors: recent.errors ?? [],
      };
    }
    return {
      states: [],
      errors: recent.errors ?? [],
      ...(recent.reason ? { reason: recent.reason } : {}),
      ...(recent.detail ? { detail: recent.detail } : {}),
    };
  });
  return { loadMostRecentStateMock, loadMatchingStatesMock };
});

vi.mock('../code-graph/lib/code-graph-db.js', () => ({
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

vi.mock('../code-graph/lib/ensure-ready.js', () => ({
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
  loadMostRecentState: loadMostRecentStateMock,
  loadMatchingStates: loadMatchingStatesMock,
}));

import { getCachedSessionSummaryDecision, handleSessionResume } from '../handlers/session-resume.js';
import * as graphDb from '../code-graph/lib/code-graph-db.js';
import { getGraphFreshness } from '../code-graph/lib/ensure-ready.js';
import { computeQualityScore, recordBootstrapEvent } from '../lib/session/context-metrics.js';

function createWorkspace(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'session-resume-'));
}

function specFolderPath(workspacePath: string, specFolder: string): string {
  return path.join(workspacePath, '.opencode', 'specs', specFolder);
}

function writeDoc(workspacePath: string, specFolder: string, relativePath: string, content: string): void {
  const fullPath = path.join(specFolderPath(workspacePath, specFolder), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function buildHandover(lastUpdated = '2026-04-11T12:00:00Z'): string {
  return [
    '---',
    'title: "Gate D handover"',
    `last_updated: "${lastUpdated}"`,
    '---',
    '# Handover',
    '',
    '**Recent action**: Finished the reader refactor',
    '**Next safe action**: Run the targeted resume tests',
    '**Blockers**: Awaiting benchmark evidence',
    '',
  ].join('\n');
}

function buildImplementationSummary(specFolder: string, recentAction = 'Continuity fallback active'): string {
  return [
    '---',
    'title: "Gate D implementation summary"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${specFolder}"`,
    '    last_updated_at: "2026-04-11T11:00:00Z"',
    '    last_updated_by: "resume-test"',
    `    recent_action: "${recentAction}"`,
    '    next_safe_action: "Review the implementation summary body"',
    '    blockers:',
    '      - "Awaiting regression confirmation"',
    '    key_files:',
    '      - "mcp_server/handlers/session-resume.ts"',
    '    completion_pct: 70',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '# Implementation Summary',
    '',
    'Canonical fallback content for the resume ladder.',
    '',
  ].join('\n');
}

function buildTranscriptFingerprint(transcriptPath: string): { fingerprint: string; modifiedAt: string; sizeBytes: number } {
  const stat = fs.statSync(transcriptPath);
  const modifiedAt = stat.mtime.toISOString();
  const fingerprint = createHash('sha256')
    .update(`${transcriptPath}:${stat.size}:${stat.mtimeMs}`)
    .digest('hex')
    .slice(0, 16);

  return {
    fingerprint,
    modifiedAt,
    sizeBytes: stat.size,
  };
}

const workspacesToRemove: string[] = [];
let originalCwd = process.cwd();

  beforeEach(() => {
    vi.clearAllMocks();
    loadMostRecentStateMock.mockReturnValue({ ok: false, reason: 'not_found', errors: [] });
    originalCwd = process.cwd();
  });

afterEach(() => {
  process.chdir(originalCwd);
  while (workspacesToRemove.length > 0) {
    const workspacePath = workspacesToRemove.pop();
    if (workspacePath) {
      fs.rmSync(workspacePath, { recursive: true, force: true });
    }
  }
});

describe('session-resume handler', () => {
  it('returns a resume payload backed by the handover-first ladder', async () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover());
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));
    process.chdir(workspacePath);

    const result = await handleSessionResume({ specFolder });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('ok');
    expect(parsed.data.memory.source).toBe('handover');
    expect(parsed.data.memory.specFolder).toBe(specFolder);
    expect(parsed.data.codeGraph).toBeDefined();
    expect(parsed.data.cocoIndex).toBeDefined();
    expect(parsed.data.payloadContract.kind).toBe('resume');
    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
    expect(parsed.data.opencodeTransport.transportOnly).toBe(true);
    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
  });

  // Deep-review regression coverage for cached session scope priority.
  it('uses the cached session scope only when specFolder is omitted', async () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';
    const transcriptPath = path.join(workspacePath, 'transcript.jsonl');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder, 'Recovered from cached scope'));
      fs.writeFileSync(transcriptPath, '{"role":"assistant","content":"resume"}\n', 'utf8');
      const transcriptIdentity = buildTranscriptFingerprint(transcriptPath);
      process.chdir(workspacePath);

      loadMostRecentStateMock.mockReturnValue({
        ok: true,
        path: '/tmp/mock-state.json',
        state: {
          schemaVersion: 1,
          claudeSessionId: 'cached-session',
          speckitSessionId: null,
          lastSpecFolder: specFolder,
          updatedAt: '2026-04-11T12:30:00Z',
          sessionSummary: {
            text: 'Gate D work is active',
            extractedAt: new Date().toISOString(),
          },
          producerMetadata: {
            lastClaudeTurnAt: '2026-04-11T12:00:00Z',
            transcript: {
              path: transcriptPath,
              fingerprint: transcriptIdentity.fingerprint,
              sizeBytes: transcriptIdentity.sizeBytes,
              modifiedAt: transcriptIdentity.modifiedAt,
            },
            cacheTokens: {
              cacheCreationInputTokens: 12,
              cacheReadInputTokens: 6,
            },
          },
          pendingCompactPrime: null,
          metrics: {
            estimatedPromptTokens: 0,
            estimatedCompletionTokens: 0,
            lastTranscriptOffset: 0,
          },
          createdAt: '2026-04-11T12:00:00Z',
        },
        errors: [],
      });

      const result = await handleSessionResume({});
      const parsed = JSON.parse(result.content[0].text);

      expect(parsed.data.memory.resolution.kind).toBe('cached');
      expect(parsed.data.memory.specFolder).toBe(specFolder);
      expect(parsed.data.hints).toContain('Using the cached session scope to resolve the resume target. Pass specFolder explicitly to override it.');
      expect(parsed.data.opencodeTransport.event.summary).toContain(specFolder);
      expect(warnSpy).toHaveBeenCalledWith(
        `[session_resume] Using cached fallback specFolder for OpenCode transport: ${specFolder}`,
      );
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('maps hook-state schema mismatches to the cached-summary rejection path', () => {
    loadMostRecentStateMock.mockReturnValue({
      ok: false,
      reason: 'schema_mismatch',
      detail: 'Expected schema version 1 but received 2.',
      errors: [],
    });

    const decision = getCachedSessionSummaryDecision({ claudeSessionId: 'bad-session' });

    expect(decision).toMatchObject({
      status: 'rejected',
      category: 'fidelity',
      reason: 'schema_mismatch',
      detail: 'Expected schema version 1 but received 2.',
    });
  });

  it('returns the minimal contract without ladder-backed memory payload', async () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));
    process.chdir(workspacePath);

    const result = await handleSessionResume({ specFolder, minimal: true });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.mode).toBe('minimal');
    expect(parsed.data.memory).toBeUndefined();
    expect(parsed.data.payloadContract).toBeNull();
    expect(parsed.data.opencodeTransport.transportOnly).toBe(true);
    expect(parsed.data.opencodeTransport.messagesTransform.length).toBeGreaterThan(0);
    expect(parsed.data.codeGraph.status).toBe('fresh');
    expect(typeof parsed.data.cocoIndex.available).toBe('boolean');
    expect(parsed.data.structuralContext.sourceSurface).toBe('session_resume');
    expect(parsed.data.graphOps.readiness.sourceSurface).toBe('session_resume');
    expect(parsed.data.sessionQuality).toBe('degraded');
    expect(computeQualityScore).toHaveBeenCalledTimes(1);
    expect(recordBootstrapEvent).not.toHaveBeenCalled();
  });

  it('reports stale graph status in the payload when freshness detection says stale', async () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));
    process.chdir(workspacePath);
    vi.mocked(getGraphFreshness).mockReturnValueOnce('stale');

    const result = await handleSessionResume({ specFolder });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.codeGraph.status).toBe('stale');
    expect(parsed.data.payloadContract.summary).toContain('graph=stale');
  });

  it('handles code graph errors gracefully and still returns the ladder result', async () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));
    process.chdir(workspacePath);
    vi.mocked(graphDb.getStats).mockImplementationOnce(() => {
      throw new Error('DB not initialized');
    });

    const result = await handleSessionResume({ specFolder });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.memory.source).toBe('continuity');
    expect(parsed.data.codeGraph.status).toBe('error');
    expect(parsed.data.hints.some((hint: string) => hint.includes('Code graph unavailable'))).toBe(true);
  });

  it('records bootstrap telemetry for full resume requests', async () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover());
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));
    process.chdir(workspacePath);

    await handleSessionResume({ specFolder });

    expect(recordBootstrapEvent).toHaveBeenCalledWith('tool', expect.any(Number), 'full');
  });
});
