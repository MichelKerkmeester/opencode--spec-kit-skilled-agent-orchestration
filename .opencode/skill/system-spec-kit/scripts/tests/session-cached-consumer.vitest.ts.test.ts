import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import {
  applyCachedSummaryAdditively,
  CACHED_SESSION_SUMMARY_MAX_AGE_MS,
  CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
  evaluateCachedSessionSummaryCandidate,
  type CachedSessionSummaryCandidate,
} from '../../mcp_server/handlers/session-resume.js';
import {
  ensureStateDir,
  saveState,
  type HookState,
} from '../../mcp_server/hooks/claude/hook-state.js';

const NOW_MS = Date.parse('2026-04-08T12:00:00.000Z');
const VALID_SPEC_FOLDER = 'specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated';

function buildTranscriptFingerprint(
  transcriptPath: string,
  sizeBytes: number,
  modifiedAtMs: number,
): string {
  return createHash('sha256')
    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
    .digest('hex')
    .slice(0, 16);
}

function countPresentFields(
  value: Record<string, unknown>,
  requiredFields: readonly string[],
): number {
  return requiredFields.filter((field) => value[field] !== undefined && value[field] !== null).length;
}

type IntegrationScenario = {
  name: string;
  expectedDecision: 'accepted' | 'rejected';
  specFolder?: string;
  extractedAt?: string;
  deleteTranscript?: boolean;
};

const tempRoots: string[] = [];

async function withHookSandbox<T>(
  run: (context: { sessionId: string }) => Promise<T>,
): Promise<T> {
  const sandboxRoot = mkdtempSync(join(tmpdir(), 'speckit-cached-consumer-int-'));
  const projectRoot = join(sandboxRoot, 'project');
  const tempRoot = join(sandboxRoot, 'tmp');
  const originalCwd = process.cwd();
  const originalTmpdir = process.env.TMPDIR;
  const sessionId = `session-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

  tempRoots.push(sandboxRoot);
  writeFileSync(join(sandboxRoot, '.keep'), '', 'utf-8');
  mkdirSync(projectRoot, { recursive: true });
  mkdirSync(tempRoot, { recursive: true });

  process.chdir(projectRoot);
  process.env.TMPDIR = tempRoot;

  try {
    ensureStateDir();
    return await run({ sessionId });
  } finally {
    process.chdir(originalCwd);
    if (originalTmpdir === undefined) {
      delete process.env.TMPDIR;
    } else {
      process.env.TMPDIR = originalTmpdir;
    }
  }
}

function seedHookState(
  sessionId: string,
  scenario: IntegrationScenario,
): void {
  const transcriptRoot = mkdtempSync(join(tmpdir(), 'speckit-cached-consumer-transcript-'));
  tempRoots.push(transcriptRoot);
  const transcriptPath = join(transcriptRoot, `${scenario.name}.jsonl`);
  writeFileSync(
    transcriptPath,
    '{"type":"message","message":{"role":"assistant","content":[{"type":"text","text":"packet 012 continuity summary"}]}}\n',
    'utf-8',
  );

  const modifiedAt = new Date(NOW_MS - 2 * 60 * 1000);
  utimesSync(transcriptPath, modifiedAt, modifiedAt);
  const transcriptStat = statSync(transcriptPath);

  const state: HookState = {
    claudeSessionId: sessionId,
    speckitSessionId: `speckit-${sessionId}`,
    lastSpecFolder: scenario.specFolder ?? VALID_SPEC_FOLDER,
    sessionSummary: {
      text: `Real handler scenario: ${scenario.name}`,
      extractedAt: scenario.extractedAt ?? new Date(NOW_MS - 60 * 1000).toISOString(),
    },
    pendingCompactPrime: null,
    producerMetadata: {
      lastClaudeTurnAt: modifiedAt.toISOString(),
      transcript: {
        path: transcriptPath,
        fingerprint: buildTranscriptFingerprint(transcriptPath, transcriptStat.size, transcriptStat.mtimeMs),
        sizeBytes: transcriptStat.size,
        modifiedAt: modifiedAt.toISOString(),
      },
      cacheTokens: {
        cacheCreationInputTokens: 120,
        cacheReadInputTokens: 60,
      },
    },
    metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
    createdAt: new Date(NOW_MS - 30 * 1000).toISOString(),
    updatedAt: new Date(NOW_MS - 30 * 1000).toISOString(),
  };

  saveState(sessionId, state);
  if (scenario.deleteTranscript) {
    rmSync(transcriptPath);
  }
}

function parseToolData(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0].text).data as Record<string, unknown>;
}

function countRecoveryPasses(data: Record<string, unknown>): number {
  const baseCount = countPresentFields(data, ['memory', 'codeGraph', 'cocoIndex', 'structuralContext']);
  return baseCount + (data.cachedSummary && typeof data.cachedSummary === 'object' && (data.cachedSummary as { status?: string }).status === 'accepted' ? 1 : 0);
}

function hasSessionContinuity(sections: Array<{ title: string }>): boolean {
  return sections.some((section) => section.title === 'Session Continuity');
}

describe('cached SessionStart consumer corpus', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW_MS));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useRealTimers();
    while (tempRoots.length > 0) {
      const tempRoot = tempRoots.pop();
      if (tempRoot) {
        rmSync(tempRoot, { recursive: true, force: true });
      }
    }
  });

  function createCandidate(options: {
    specFolder?: string;
    summaryText?: string;
    extractedAt?: string;
    schemaVersion?: number;
    fingerprintOverride?: string;
  } = {}): CachedSessionSummaryCandidate {
    const tempRoot = mkdtempSync(join(tmpdir(), 'speckit-cached-consumer-'));
    tempRoots.push(tempRoot);

    const transcriptPath = join(tempRoot, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      '{"type":"message","message":{"role":"assistant","content":[{"type":"text","text":"packet 012 continuity summary"}]}}\n',
      'utf-8',
    );

    const modifiedAt = new Date(NOW_MS - 2 * 60 * 1000);
    utimesSync(transcriptPath, modifiedAt, modifiedAt);
    const transcriptStat = statSync(transcriptPath);
    const fingerprint = options.fingerprintOverride
      ?? buildTranscriptFingerprint(transcriptPath, transcriptStat.size, transcriptStat.mtimeMs);

    return {
      schemaVersion: options.schemaVersion ?? CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
      lastSpecFolder: options.specFolder ?? VALID_SPEC_FOLDER,
      summaryText: options.summaryText ?? 'Guarded cached continuity summary from packet 012.',
      extractedAt: options.extractedAt ?? new Date(NOW_MS - 60 * 1000).toISOString(),
      stateUpdatedAt: new Date(NOW_MS - 30 * 1000).toISOString(),
      producerMetadata: {
        lastClaudeTurnAt: modifiedAt.toISOString(),
        transcript: {
          path: transcriptPath,
          fingerprint,
          sizeBytes: transcriptStat.size,
          modifiedAt: modifiedAt.toISOString(),
        },
        cacheTokens: {
          cacheCreationInputTokens: 120,
          cacheReadInputTokens: 60,
        },
      },
    };
  }

  it('matches the frozen corpus outcomes for stale, scope mismatch, fidelity failure, and valid reuse', () => {
    const corpus = [
      {
        name: 'stale',
        candidate: createCandidate({
          extractedAt: new Date(NOW_MS - CACHED_SESSION_SUMMARY_MAX_AGE_MS - 60 * 1000).toISOString(),
        }),
        specFolder: VALID_SPEC_FOLDER,
        expected: { status: 'rejected', category: 'freshness', reason: 'stale_summary' },
      },
      {
        name: 'scope mismatch',
        candidate: createCandidate({
          specFolder: 'specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor',
        }),
        specFolder: VALID_SPEC_FOLDER,
        expected: { status: 'rejected', category: 'freshness', reason: 'scope_mismatch' },
      },
      {
        name: 'fidelity failure',
        candidate: createCandidate({
          schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION + 1,
        }),
        specFolder: VALID_SPEC_FOLDER,
        expected: { status: 'rejected', category: 'fidelity', reason: 'schema_version_mismatch' },
      },
      {
        name: 'valid',
        candidate: createCandidate(),
        specFolder: VALID_SPEC_FOLDER,
        expected: { status: 'accepted', category: 'accepted', reason: 'accepted' },
      },
    ] as const;

    for (const scenario of corpus) {
      const decision = evaluateCachedSessionSummaryCandidate(scenario.candidate, {
        specFolder: scenario.specFolder,
        nowMs: NOW_MS,
      });

      expect(decision.status, scenario.name).toBe(scenario.expected.status);
      expect(decision.category, scenario.name).toBe(scenario.expected.category);
      expect(decision.reason, scenario.name).toBe(scenario.expected.reason);
    }
  });

  it('keeps the valid additive path at or above the live baseline pass rate', () => {
    const decision = evaluateCachedSessionSummaryCandidate(createCandidate(), {
      specFolder: VALID_SPEC_FOLDER,
      nowMs: NOW_MS,
    });

    expect(decision.status).toBe('accepted');

    const liveBaseline = {
      memory: { resumed: true },
      codeGraph: { status: 'fresh' },
      cocoIndex: { available: true },
      structuralContext: { status: 'ready' },
    };
    const additiveResult = applyCachedSummaryAdditively(liveBaseline, decision);
    const requiredFields = ['memory', 'codeGraph', 'cocoIndex', 'structuralContext', 'cachedSummary'] as const;

    const baselineScore = countPresentFields(liveBaseline, requiredFields);
    const additiveScore = countPresentFields(additiveResult, requiredFields);

    expect(baselineScore).toBe(4);
    expect(additiveScore).toBeGreaterThanOrEqual(baselineScore);
    expect(additiveResult.cachedSummary?.continuityText).toContain('Last session worked on');
    expect(additiveResult.cachedSummary?.summaryText).toContain('packet 012');
  });

  it('exercises session_resume, session_bootstrap, and session-prime against the frozen corpus via hook state', async () => {
    vi.doMock('../../mcp_server/handlers/memory-context.js', () => ({
      handleMemoryContext: vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({ status: 'ok', data: { resumed: true } }),
        }],
      })),
    }));

    vi.doMock('../../mcp_server/lib/code-graph/code-graph-db.js', () => ({
      getStats: vi.fn(() => ({
        lastScanTimestamp: '2026-04-08T12:00:00.000Z',
        totalNodes: 42,
        totalEdges: 17,
        totalFiles: 9,
      })),
    }));

    vi.doMock('../../mcp_server/lib/utils/cocoindex-path.js', () => ({
      isCocoIndexAvailable: vi.fn(() => true),
    }));

    vi.doMock('../../mcp_server/lib/session/context-metrics.js', () => ({
      recordBootstrapEvent: vi.fn(),
      recordMetricEvent: vi.fn(),
      computeQualityScore: vi.fn(() => ({ level: 'healthy' })),
    }));

    vi.doMock('../../mcp_server/lib/session/session-snapshot.js', () => ({
      buildStructuralBootstrapContract: vi.fn(() => ({
        status: 'ready',
        summary: 'Structural context ready',
        recommendedAction: 'Use code_graph_query for structural lookups.',
        sourceSurface: 'session_bootstrap',
        provenance: { lastUpdated: '2026-04-08T12:00:00.000Z' },
      })),
    }));

    vi.doMock('../../mcp_server/handlers/session-health.js', () => ({
      handleSessionHealth: vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
        }],
      })),
    }));

    vi.doMock('../../mcp_server/lib/code-graph/startup-brief.js', () => ({
      buildStartupBrief: vi.fn(() => ({
        graphOutline: null,
        sessionContinuity: null,
        graphSummary: { files: 9, nodes: 42, edges: 17, lastScan: '2026-04-08T12:00:00.000Z' },
        graphState: 'ready',
        cocoIndexAvailable: true,
        startupSurface: [
          'Session context received. Current state:',
          '',
          '- Memory: startup summary only (resume on demand)',
          '- Code Graph: ready',
          '- CocoIndex: available',
          '',
          'What would you like to work on?',
        ].join('\n'),
      })),
    }));

    const { handleSessionResume } = await import('../../mcp_server/handlers/session-resume.js');
    const { handleSessionBootstrap } = await import('../../mcp_server/handlers/session-bootstrap.js');
    const { handleStartup } = await import('../../mcp_server/hooks/claude/session-prime.js');

    const scenarios: readonly IntegrationScenario[] = [
      {
        name: 'stale',
        expectedDecision: 'rejected',
        extractedAt: new Date(NOW_MS - CACHED_SESSION_SUMMARY_MAX_AGE_MS - 60 * 1000).toISOString(),
      },
      {
        name: 'scope-mismatch',
        expectedDecision: 'rejected',
        specFolder: 'specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor',
      },
      {
        name: 'fidelity-failure',
        expectedDecision: 'rejected',
        deleteTranscript: true,
      },
      {
        name: 'valid',
        expectedDecision: 'accepted',
      },
    ];

    for (const scenario of scenarios) {
      await withHookSandbox(async ({ sessionId }) => {
        const liveResume = parseToolData(await handleSessionResume({ specFolder: VALID_SPEC_FOLDER }));
        const liveBootstrap = parseToolData(await handleSessionBootstrap({ specFolder: VALID_SPEC_FOLDER }));
        const liveStartup = handleStartup({ session_id: sessionId, specFolder: VALID_SPEC_FOLDER });

        seedHookState(sessionId, scenario);

        const cachedResume = parseToolData(await handleSessionResume({ specFolder: VALID_SPEC_FOLDER }));
        const cachedBootstrap = parseToolData(await handleSessionBootstrap({ specFolder: VALID_SPEC_FOLDER }));
        const cachedStartup = handleStartup({ session_id: sessionId, specFolder: VALID_SPEC_FOLDER });

        const resumeDecision = cachedResume.cachedSummary as { status?: string } | undefined;
        const bootstrapDecision = cachedBootstrap.cachedSummary as { status?: string } | undefined;

        expect(resumeDecision?.status, `${scenario.name}:resume`).toBe(scenario.expectedDecision);
        expect(bootstrapDecision?.status, `${scenario.name}:bootstrap`).toBe(scenario.expectedDecision);

        const liveResumePasses = countRecoveryPasses(liveResume);
        const cachedResumePasses = countRecoveryPasses(cachedResume);
        const liveBootstrapPasses = countRecoveryPasses(liveBootstrap);
        const cachedBootstrapPasses = countRecoveryPasses(cachedBootstrap);

        if (scenario.expectedDecision === 'accepted') {
          expect(cachedResumePasses, `${scenario.name}:resume-pass-count`).toBeGreaterThanOrEqual(liveResumePasses + 1);
          expect(cachedBootstrapPasses, `${scenario.name}:bootstrap-pass-count`).toBeGreaterThanOrEqual(liveBootstrapPasses + 1);
          expect(hasSessionContinuity(cachedStartup), `${scenario.name}:startup-continuity`).toBe(true);
        } else {
          expect(cachedResumePasses, `${scenario.name}:resume-pass-count`).toBe(liveResumePasses);
          expect(cachedBootstrapPasses, `${scenario.name}:bootstrap-pass-count`).toBe(liveBootstrapPasses);
          expect(hasSessionContinuity(cachedStartup), `${scenario.name}:startup-continuity`).toBe(false);
        }

        expect(hasSessionContinuity(liveStartup), `${scenario.name}:live-startup-baseline`).toBe(false);
      });
    }
  });
});
