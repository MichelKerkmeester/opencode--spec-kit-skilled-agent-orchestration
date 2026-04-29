// TEST: Live handler SearchDecisionEnvelope capture seam
//
// Layer disclosure:
// - Real: handleMemorySearch, response formatting, buildSearchDecisionEnvelope,
//   and recordSearchDecision with SPECKIT_SEARCH_DECISION_AUDIT_PATH.
// - Mocked: executePipeline returns deterministic candidate rows and stage
//   metadata; core database-readiness checks are no-op stubs.
// - Mocked: getGraphReadinessSnapshot returns deterministic readiness
//   snapshots so TC-3 validates handler wiring without depending on repo
//   graph state.
// - Deterministic fields: tenantId, queryPlan presence, rerankGateDecision,
//   cocoindexCalibration shape, degradedReadiness, pipelineTiming, and audit
//   JSONL emission.
// - Derived fields: requestId, timestamp, latencyMs, trustTree decision, and
//   token/response metadata are produced by the live handler path.

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MCPResponse } from '@spec-kit/shared/types';
import type { PipelineResult } from '../lib/search/pipeline/index.js';
import type { SearchDecisionEnvelope } from '../lib/search/search-decision-envelope.js';

vi.mock('../core/index.js', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../core/db-state.js', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../lib/search/pipeline/index.js', () => ({
  executePipeline: vi.fn(),
}));

vi.mock('../code_graph/lib/ensure-ready.js', () => ({
  getGraphReadinessSnapshot: vi.fn(),
}));

import { handleMemorySearch } from '../handlers/memory-search.js';
import { getGraphReadinessSnapshot } from '../code_graph/lib/ensure-ready.js';
import { executePipeline } from '../lib/search/pipeline/index.js';

interface ParsedResponse {
  summary?: string;
  data?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

const tempDirs: string[] = [];
let auditPath: string;

function pipelineFixture(overrides: Partial<PipelineResult> = {}): PipelineResult {
  const base: PipelineResult = {
    results: [
      {
        id: 101,
        title: 'Live envelope fixture',
        file_path: 'specs/system-spec-kit/026-graph-and-context-optimization/spec.md',
        spec_folder: 'system-spec-kit/026-graph-and-context-optimization',
        context_type: 'spec',
        importance_tier: 'important',
        similarity: 91,
        score: 0.91,
        content: 'SearchDecisionEnvelope fixture candidate',
        created_at: '2026-04-29T00:00:00.000Z',
      },
      {
        id: 102,
        title: 'Decision audit fixture',
        file_path: 'specs/system-spec-kit/026-graph-and-context-optimization/plan.md',
        spec_folder: 'system-spec-kit/026-graph-and-context-optimization',
        context_type: 'plan',
        importance_tier: 'normal',
        similarity: 83,
        score: 0.83,
        content: 'Decision audit fixture candidate',
        created_at: '2026-04-29T00:00:01.000Z',
      },
    ],
    metadata: {
      stage1: {
        searchType: 'hybrid',
        channelCount: 2,
        activeChannels: 2,
        candidateCount: 2,
        constitutionalInjected: 0,
        durationMs: 3,
      },
      stage2: {
        sessionBoostApplied: 'off',
        causalBoostApplied: 'off',
        intentWeightsApplied: 'applied',
        artifactRoutingApplied: 'off',
        feedbackSignalsApplied: 'off',
        qualityFiltered: 0,
        durationMs: 4,
      },
      stage3: {
        rerankApplied: true,
        rerankProvider: 'fixture',
        rerankGateDecision: {
          shouldRerank: true,
          reason: 'eligible:complex-query',
          triggers: ['complex-query'],
        },
        chunkReassemblyStats: {
          collapsedChunkHits: 0,
          chunkParents: 0,
          reassembled: 0,
          fallback: 0,
        },
        durationMs: 5,
      },
      stage4: {
        stateFiltered: 0,
        constitutionalInjected: 0,
        evidenceGapDetected: false,
        durationMs: 1,
      },
      timing: {
        stage1: 3,
        stage2: 4,
        stage3: 5,
        stage4: 1,
        total: 13,
      },
    },
    annotations: {
      stateStats: {},
      featureFlags: {},
    },
  };

  return {
    ...base,
    ...overrides,
    metadata: {
      ...base.metadata,
      ...overrides.metadata,
      stage1: { ...base.metadata.stage1, ...overrides.metadata?.stage1 },
      stage2: { ...base.metadata.stage2, ...overrides.metadata?.stage2 },
      stage3: { ...base.metadata.stage3, ...overrides.metadata?.stage3 },
      stage4: { ...base.metadata.stage4, ...overrides.metadata?.stage4 },
      timing: { ...base.metadata.timing, ...overrides.metadata?.timing },
    },
    annotations: {
      ...base.annotations,
      ...overrides.annotations,
    },
  };
}

function parseResponse(response: MCPResponse): ParsedResponse {
  const text = response.content[0]?.text ?? '{}';
  return JSON.parse(text) as ParsedResponse;
}

function responseEnvelope(response: MCPResponse): SearchDecisionEnvelope {
  const parsed = parseResponse(response);
  const data = parsed.data ?? {};
  expect(data.searchDecisionEnvelope).toBeDefined();
  expect(data.search_decision_envelope).toBeDefined();
  expect(data.searchDecisionEnvelope).toEqual(data.search_decision_envelope);
  return data.searchDecisionEnvelope as SearchDecisionEnvelope;
}

function readAuditRows(): SearchDecisionEnvelope[] {
  expect(existsSync(auditPath)).toBe(true);
  return readFileSync(auditPath, 'utf8')
    .trim()
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as SearchDecisionEnvelope);
}

async function callHandler(query = 'audit source requirement decision envelope'): Promise<MCPResponse> {
  return handleMemorySearch({
    query,
    limit: 2,
    tenantId: 'tenant-live-envelope',
    userId: 'user-live-envelope',
    agentId: 'agent-live-envelope',
    bypassCache: true,
    includeContent: true,
    includeConstitutional: false,
    retrievalLevel: 'local',
    enableSessionBoost: false,
    enableCausalBoost: false,
    autoDetectIntent: false,
    intent: 'understand',
    rerank: true,
  });
}

describe('handleMemorySearch live SearchDecisionEnvelope seam', () => {
  beforeEach(() => {
    const tempDir = mkdtempSync(join(tmpdir(), 'handler-live-envelope-'));
    tempDirs.push(tempDir);
    auditPath = join(tempDir, 'search-decisions.jsonl');
    vi.stubEnv('SPECKIT_SEARCH_DECISION_AUDIT_PATH', auditPath);
    vi.mocked(executePipeline).mockResolvedValue(pipelineFixture());
    vi.mocked(getGraphReadinessSnapshot).mockReturnValue({
      freshness: 'fresh',
      action: 'none',
      reason: 'all tracked files are up-to-date',
    });
  });

  afterEach(() => {
    vi.mocked(executePipeline).mockReset();
    vi.mocked(getGraphReadinessSnapshot).mockReset();
    vi.unstubAllEnvs();
    while (tempDirs.length > 0) {
      const tempDir = tempDirs.pop();
      if (tempDir) rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('TC-1 attaches camelCase and snake_case SearchDecisionEnvelope payloads', async () => {
    const response = await callHandler();
    const envelope = responseEnvelope(response);

    expect(envelope.envelopeVersion).toBe(1);
    expect(envelope.tenantId).toBe('tenant-live-envelope');
    expect(envelope.queryPlan).toBeDefined();
    expect(envelope.queryPlan.selectedChannels.length).toBeGreaterThan(0);
    expect(envelope.trustTree).toBeDefined();
    expect(envelope.trustTree?.decision).toEqual(expect.any(String));
    expect(envelope.rerankGateDecision).toMatchObject({
      shouldRerank: true,
      triggers: ['complex-query'],
    });
    expect(envelope.cocoindexCalibration).toMatchObject({
      requestedLimit: 2,
      effectiveLimit: expect.any(Number),
      duplicateDensity: expect.any(Number),
      recommendedMultiplier: expect.any(Number),
    });
    expect(envelope.latencyMs).toEqual(expect.any(Number));
  });

  it('TC-2 appends a SearchDecisionEnvelope-compatible audit JSONL row', async () => {
    const response = await callHandler('decision audit JSONL representative query');
    const responseDecision = responseEnvelope(response).trustTree?.decision;
    const rows = readAuditRows();

    expect(rows.length).toBeGreaterThanOrEqual(1);
    const row = rows.at(-1);
    expect(row).toMatchObject({
      envelopeVersion: 1,
      tenantId: 'tenant-live-envelope',
      queryPlan: expect.any(Object),
      trustTree: expect.any(Object),
      rerankGateDecision: expect.any(Object),
      cocoindexCalibration: expect.any(Object),
      pipelineTiming: expect.objectContaining({
        stage1: 3,
        stage2: 4,
        stage3: 5,
        stage4: 1,
        total: 13,
      }),
      latencyMs: expect.any(Number),
    });
    expect(row?.trustTree?.decision).toBe(responseDecision);
    expect(row?.trustTree?.decision).toEqual(expect.any(String));
  });

  it('TC-3 emits snapshot-derived degradedReadiness from memory_search', async () => {
    vi.mocked(getGraphReadinessSnapshot).mockReturnValueOnce({
      freshness: 'empty',
      action: 'full_scan',
      reason: 'graph is empty (0 nodes)',
    });
    vi.mocked(executePipeline).mockResolvedValueOnce(pipelineFixture({
      metadata: {
        degraded: true,
        timing: {
          stage1: 1,
          stage2: 0,
          stage3: 0,
          stage4: 0,
          total: 1,
        },
      } as Partial<PipelineResult['metadata']> as PipelineResult['metadata'],
    }));

    const response = await callHandler('degraded code graph readiness fixture');
    const envelope = responseEnvelope(response);

    expect(envelope.degradedReadiness).toMatchObject({
      freshness: 'empty',
      action: 'full_scan',
      reason: 'graph is empty (0 nodes)',
      degraded: true,
    });
    expect(envelope.degradedReadiness?.freshness).toBeDefined();
    expect(getGraphReadinessSnapshot).toHaveBeenCalledWith(process.cwd());
  });
});
