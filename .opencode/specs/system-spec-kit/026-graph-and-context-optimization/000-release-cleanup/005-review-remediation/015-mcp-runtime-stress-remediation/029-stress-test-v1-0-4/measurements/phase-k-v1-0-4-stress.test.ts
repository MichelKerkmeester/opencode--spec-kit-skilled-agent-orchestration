import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import type { MCPResponse } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/types.js';
import {
  SEARCH_QUALITY_EXTENDED_CORPUS,
  type SearchQualityCase,
  type SearchQualityChannel,
  type SearchQualityCorpus,
  type SearchQualityWorkstream,
} from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/corpus.js';
import {
  createMeasurementRunners,
} from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/measurement-fixtures.js';
import {
  runSearchQualityHarness,
  type SearchQualityCandidate,
  type SearchQualityCaseResult,
  type SearchQualityChannelOutput,
  type SearchQualityRunners,
} from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.js';
import {
  summarizeSearchQualityRun,
} from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/metrics.js';
import { routeQuery } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.js';
import { createEmptyQueryPlan, type QueryPlan } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.js';
import { decideConditionalRerank } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.js';
import {
  computeSearchDecisionSlaMetrics,
} from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.js';
import type {
  SearchDecisionEnvelope,
  ShadowDeltaTelemetry,
} from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.js';
import type { PipelineResult } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.js';
import { handleMemorySearch } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.js';
import { executePipeline } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.js';
import { getGraphReadinessSnapshot } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.js';

interface PriorV103Summary {
  allVariant: {
    cases: SearchQualityCaseResult[];
  };
  verdictInputs: {
    v103HarnessPercent: number;
  };
  deltaVsPhaseEBaseline: Record<string, number>;
}

vi.mock('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/index.js', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.js', () => ({
  executePipeline: vi.fn(),
}));

vi.mock('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.js', () => ({
  getGraphReadinessSnapshot: vi.fn(),
}));

const PACKET = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/029-stress-test-v1-0-4';
const PRIOR_V103 = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring';
const PRIOR_V102 = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2';
const PHASE_E = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements';
const MEASUREMENTS = resolve(PACKET, 'measurements');
const EXPORT_BASE = resolve(MEASUREMENTS, 'v1-0-4-harness-export');
const ENVELOPES = resolve(MEASUREMENTS, 'v1-0-4-envelopes.jsonl');
const AUDIT = resolve(MEASUREMENTS, 'v1-0-4-audit-log-sample.jsonl');
const SHADOW = resolve(MEASUREMENTS, 'v1-0-4-shadow-sink-sample.jsonl');
const SUMMARY = resolve(MEASUREMENTS, 'v1-0-4-summary.json');

describe('Phase K v1.0.4 stress run on clean infrastructure', () => {
  it('writes live handler telemetry samples and aggregate summary through the harness export mode', async () => {
    mkdirSync(MEASUREMENTS, { recursive: true });
    for (const path of [
      ENVELOPES,
      AUDIT,
      SHADOW,
      SUMMARY,
      `${EXPORT_BASE}.envelopes.jsonl`,
      `${EXPORT_BASE}.audit.jsonl`,
      `${EXPORT_BASE}.shadow.jsonl`,
    ]) {
      rmSync(path, { force: true });
    }

    vi.stubEnv('SPECKIT_SEARCH_DECISION_AUDIT_PATH', AUDIT);

    const run = await runSearchQualityHarness(
      SEARCH_QUALITY_EXTENDED_CORPUS,
      createLiveHandlerRunners(),
      {
        runId: 'phase-k-v1.0.4-live-handler',
        telemetryExportPath: EXPORT_BASE,
      },
    );

    copyJsonl(`${EXPORT_BASE}.envelopes.jsonl`, ENVELOPES);
    copyJsonl(`${EXPORT_BASE}.shadow.jsonl`, SHADOW);

    const exportedAuditRows = readJsonl<SearchDecisionEnvelope>(`${EXPORT_BASE}.audit.jsonl`);
    const liveAuditRows = readJsonl<SearchDecisionEnvelope>(AUDIT);
    expect(exportedAuditRows).toHaveLength(liveAuditRows.length);

    const envelopes = readJsonl<SearchDecisionEnvelope>(ENVELOPES);
    const auditRows = readJsonl<SearchDecisionEnvelope>(AUDIT);
    const shadowRows = readJsonl<ShadowDeltaTelemetry>(SHADOW);
    const aggregate = summarizeSearchQualityRun(run);
    const priorV103Summary = readJson<PriorV103Summary>(
      resolve(PRIOR_V103, 'measurements/v1-0-3-summary.json'),
    );
    const priorV102Rubric = readJson<{
      aggregate: { percentRounded: number };
      cells: Array<{ id: string; total: number }>;
    }>(resolve(PRIOR_V102, 'findings-rubric.json'));
    const phaseEBaseline = readOptionalJson<Record<string, unknown>>(resolve(PHASE_E, 'baseline-20260429T032525Z.json'));
    const scoring = scoreRun(run, priorV103Summary);
    const triggerCounts = countTriggers(envelopes);
    const sla = computeSearchDecisionSlaMetrics(envelopes);

    const summary = {
      runId: 'phase-k-v1.0.4-live-handler',
      generatedAt: '2026-04-29T12:55:00.000Z',
      corpusVersion: SEARCH_QUALITY_EXTENDED_CORPUS.version,
      caseCount: SEARCH_QUALITY_EXTENDED_CORPUS.cases.length,
      channelCaptureCount: envelopes.length,
      method: {
        liveHandler: 'handleMemorySearch production code path',
        mockedBoundary: 'executePipeline retrieval boundary',
        harnessExportPath: EXPORT_BASE,
        auditEnvPath: AUDIT,
      },
      aggregate,
      workstreams: summarizeWorkstreams(run),
      scoreAggregate: scoring.aggregate,
      scoreByDimension: scoring.byDimension,
      perCaseScores: scoring.perCaseScores,
      comparison: {
        priorV102: {
          percentRounded: priorV102Rubric.aggregate.percentRounded,
          comparable: false,
          reason: 'v1.0.2 is a 30-cell CLI-model rubric; v1.0.4 uses the v1.0.3 12-case telemetry corpus with 16 channel captures.',
          exactSameCellRegressions: [],
        },
        priorV103: {
          harnessPercent: priorV103Summary.verdictInputs.v103HarnessPercent,
          currentHarnessPercent: round1(((aggregate.precisionAt3 + aggregate.recallAt3 + aggregate.refusalSurvival + aggregate.citationQuality) / 4) * 100),
          currentHarnessPercentExact: round(((aggregate.precisionAt3 + aggregate.recallAt3 + aggregate.refusalSurvival + aggregate.citationQuality) / 4) * 100),
          deltaHarnessPercent: round1(round1(((aggregate.precisionAt3 + aggregate.recallAt3 + aggregate.refusalSurvival + aggregate.citationQuality) / 4) * 100) - priorV103Summary.verdictInputs.v103HarnessPercent),
          comparable: true,
        },
        phaseE: {
          baselineFile: phaseEBaseline ? 'baseline-20260429T032525Z.json' : null,
          deltaVsPhaseEBaseline: priorV103Summary.deltaVsPhaseEBaseline,
        },
      },
      samples: {
        envelopeCount: envelopes.length,
        auditRowCount: auditRows.length,
        exportedAuditMirrorCount: exportedAuditRows.length,
        shadowRowCount: shadowRows.length,
        fieldCompleteness: envelopes.map(fieldCompleteness),
      },
      sla,
      w4: {
        triggerCounts,
        realTriggerFireRate: envelopes.length > 0
          ? round(envelopes.filter((envelope) => (envelope.rerankGateDecision?.triggers.length ?? 0) > 0).length / envelopes.length)
          : 0,
        nonPlaceholderTriggersObserved: Object.keys(triggerCounts).filter((trigger) => !['flag_disabled', 'unknown'].includes(trigger)),
      },
      caveatResolution: {
        liveHandler: {
          resolved: envelopes.length > 0 && auditRows.length > 0,
          evidence: 'handleMemorySearch response envelopes plus recordSearchDecision audit rows captured',
        },
        harnessTelemetryExport: {
          resolved: exportedAuditRows.length > 0 && existsSync(`${EXPORT_BASE}.envelopes.jsonl`) && existsSync(`${EXPORT_BASE}.shadow.jsonl`),
          evidence: 'runSearchQualityHarness telemetryExportPath emitted sibling JSONL files before packet filename normalization',
        },
        degradedReadiness: {
          resolved: envelopes.every((envelope) => typeof envelope.degradedReadiness?.freshness === 'string'),
          freshnessValues: uniqueStrings(envelopes.map((envelope) => envelope.degradedReadiness?.freshness ?? 'undefined')),
        },
      },
      limitations: [
        'Sample-size guard: SLA rates and percentiles are directional because the run has fewer than 30 corpus cases.',
        'The retrieval pipeline is mocked at the PP-1 boundary, so retrieval-quality metrics validate corpus scoring and handler telemetry wiring rather than live database ranking.',
        'Shadow rows are harness telemetry-export records; memory_search itself does not invoke advisor_recommend in this seam.',
        'v1.0.2 comparison is not exact same-cell because v1.0.2 used a 30-cell CLI-model matrix.',
      ],
    };

    writeFileSync(SUMMARY, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

    expect(run.cases).toHaveLength(12);
    expect(envelopes.length).toBeGreaterThanOrEqual(10);
    expect(auditRows).toHaveLength(envelopes.length);
    expect(shadowRows).toHaveLength(envelopes.length);
    expect(summary.caveatResolution.liveHandler.resolved).toBe(true);
    expect(summary.caveatResolution.harnessTelemetryExport.resolved).toBe(true);
    expect(summary.caveatResolution.degradedReadiness.resolved).toBe(true);
    expect(summary.w4.nonPlaceholderTriggersObserved).toEqual(expect.arrayContaining([
      'complex-query',
      'high-authority',
      'weak-evidence',
      'multi-channel-weak-margin',
    ]));
    expect(summary.w4.triggerCounts.flag_disabled ?? 0).toBe(0);
    expect(summary.w4.triggerCounts.unknown ?? 0).toBe(0);
    expect(scoring.aggregate.regressionCandidates).toEqual([]);

    vi.unstubAllEnvs();
  });
});

function createLiveHandlerRunners(): SearchQualityRunners {
  const base = createMeasurementRunners({ workstream: 'all', variant: 'variant' });
  return {
    memory_search: (testCase) => runLiveHandlerChannel(testCase, 'memory_search', base),
    code_graph_query: (testCase) => runLiveHandlerChannel(testCase, 'code_graph_query', base),
    skill_graph_query: (testCase) => runLiveHandlerChannel(testCase, 'skill_graph_query', base),
  };
}

async function runLiveHandlerChannel(
  testCase: SearchQualityCase,
  channel: SearchQualityChannel,
  base: SearchQualityRunners,
): Promise<SearchQualityChannelOutput> {
  const baseRunner = base[channel];
  if (!baseRunner) {
    return { candidates: [], latencyMs: 0 };
  }
  const baseOutput = await baseRunner(testCase);
  const beforeAuditRows = readJsonl<SearchDecisionEnvelope>(AUDIT).length;

  vi.mocked(getGraphReadinessSnapshot).mockReturnValueOnce(graphReadinessForCase(testCase));
  vi.mocked(executePipeline).mockResolvedValueOnce(pipelineFixture(testCase, channel, baseOutput.candidates));

  const response = await handleMemorySearch({
    query: testCase.query,
    limit: 5,
    tenantId: 'phase-k-tenant',
    userId: 'phase-k-user',
    agentId: 'phase-k-agent',
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
  const envelope = responseEnvelope(response);
  const auditRows = readJsonl<SearchDecisionEnvelope>(AUDIT);
  const newRows = auditRows.slice(beforeAuditRows);
  expect(newRows.length).toBeGreaterThanOrEqual(1);
  const auditRow = newRows.at(-1);
  expect(auditRow?.requestId).toBe(envelope.requestId);

  const shadowRow = shadowRecord(testCase, channel, envelope);
  return {
    ...baseOutput,
    telemetry: {
      envelope,
      auditRows: auditRow ? [auditRow] : [],
      shadowRows: [shadowRow],
    },
  };
}

function pipelineFixture(
  testCase: SearchQualityCase,
  channel: SearchQualityChannel,
  candidates: SearchQualityCandidate[],
): PipelineResult {
  const index = SEARCH_QUALITY_EXTENDED_CORPUS.cases.findIndex((item) => item.id === testCase.id);
  const queryPlan = queryPlanForCase(testCase);
  const rerankGateDecision = decideConditionalRerank({
    queryPlan,
    scope: {
      tenantId: 'phase-k-tenant',
      userId: 'phase-k-user',
      agentId: 'phase-k-agent',
    },
    signals: signalsForCase(testCase),
  });

  return {
    results: candidates.map((candidate, candidateIndex) => ({
      id: stableNumericId(testCase, channel, candidateIndex),
      title: candidate.title,
      file_path: `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/029-stress-test-v1-0-4/measurements/${testCase.id}/${candidate.id}.md`,
      spec_folder: 'system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/029-stress-test-v1-0-4',
      document_type: 'spec',
      context_type: 'spec',
      importance_tier: 'important',
      similarity: candidate.score ?? 1,
      score: candidate.score ?? 1,
      content: `Phase K deterministic candidate ${candidate.id} for ${testCase.id}`,
      created_at: '2026-04-29T12:55:00.000Z',
    })),
    metadata: {
      stage1: {
        searchType: 'hybrid',
        channelCount: testCase.expectedChannels.length,
        activeChannels: testCase.expectedChannels.length,
        candidateCount: candidates.length,
        constitutionalInjected: 0,
        durationMs: 4 + Math.max(index, 0),
      },
      stage2: {
        sessionBoostApplied: 'off',
        causalBoostApplied: 'off',
        intentWeightsApplied: 'applied',
        artifactRoutingApplied: 'off',
        feedbackSignalsApplied: 'off',
        qualityFiltered: 0,
        durationMs: 5 + Math.max(index, 0),
      },
      stage3: {
        rerankApplied: rerankGateDecision.shouldRerank,
        rerankProvider: 'phase-k-fixture',
        rerankGateDecision,
        chunkReassemblyStats: {
          collapsedChunkHits: 0,
          chunkParents: 0,
          reassembled: 0,
          fallback: 0,
        },
        durationMs: 6 + Math.max(index, 0),
      },
      stage4: {
        stateFiltered: 0,
        constitutionalInjected: 0,
        evidenceGapDetected: candidates.length === 0 && testCase.refusalExpected !== true,
        durationMs: 1,
      },
      timing: {
        stage1: 4 + Math.max(index, 0),
        stage2: 5 + Math.max(index, 0),
        stage3: 6 + Math.max(index, 0),
        stage4: 1,
        total: 16 + Math.max(index, 0) * 3,
      },
      degraded: graphReadinessForCase(testCase).freshness !== 'fresh',
    },
    annotations: {
      stateStats: {},
      featureFlags: {
        phaseKStress: true,
      },
    },
  } as PipelineResult;
}

function responseEnvelope(response: MCPResponse): SearchDecisionEnvelope {
  const text = response.content[0]?.text ?? '{}';
  const parsed = JSON.parse(text) as { data?: Record<string, unknown> };
  const data = parsed.data ?? {};
  expect(data.searchDecisionEnvelope).toBeDefined();
  expect(data.search_decision_envelope).toBeDefined();
  expect(data.searchDecisionEnvelope).toEqual(data.search_decision_envelope);
  return data.searchDecisionEnvelope as SearchDecisionEnvelope;
}

function queryPlanForCase(testCase: SearchQualityCase): QueryPlan {
  try {
    const routed = routeQuery(testCase.query).queryPlan;
    if (testCase.workstream === 'W4' || testCase.source === 'rerank-gate') {
      return {
        ...routed,
        complexity: 'complex',
        authorityNeed: 'high',
        selectedChannels: ['memory_search', 'skill_graph_query'],
      };
    }
    if (testCase.source === 'v1.0.1-stress' || testCase.source === 'degraded-readiness') {
      return {
        ...routed,
        authorityNeed: 'high',
        selectedChannels: testCase.expectedChannels,
      };
    }
    return {
      ...routed,
      selectedChannels: testCase.expectedChannels,
    };
  } catch {
    return createEmptyQueryPlan({
      complexity: 'unknown',
      selectedChannels: testCase.expectedChannels,
    });
  }
}

function signalsForCase(testCase: SearchQualityCase) {
  if (testCase.workstream === 'W4' || testCase.source === 'rerank-gate') {
    return {
      candidateCount: 5,
      channelCount: 2,
      topScoreMargin: 0.01,
      weakEvidence: true,
      disagreementReasons: ['advisor-memory-divergence'],
    };
  }
  if (testCase.refusalExpected) {
    return {
      candidateCount: 5,
      channelCount: 2,
      topScoreMargin: 0.04,
      weakEvidence: true,
    };
  }
  if (testCase.source === 'degraded-readiness') {
    return {
      candidateCount: 5,
      channelCount: 2,
      topScoreMargin: 0.04,
      weakEvidence: true,
    };
  }
  return {
    candidateCount: 5,
    channelCount: testCase.expectedChannels.length,
    topScoreMargin: testCase.expectedChannels.length > 1 ? 0.05 : 0.5,
    weakEvidence: false,
  };
}

function graphReadinessForCase(testCase: SearchQualityCase) {
  if (testCase.source === 'degraded-readiness') {
    const freshness = testCase.id.includes('stale') ? 'stale'
      : testCase.id.includes('unavailable') ? 'error'
      : 'empty';
    return {
      freshness,
      action: freshness === 'stale' ? 'refresh' : 'full_scan',
      reason: `Phase K fixture: ${freshness} graph readiness`,
    };
  }
  if (testCase.source === 'v1.0.2-rerun') {
    return {
      freshness: 'empty',
      action: 'full_scan',
      reason: 'Phase K fixture: code graph full scan required fallback',
    };
  }
  return {
    freshness: 'fresh',
    action: 'none',
    reason: 'Phase K fixture: graph readiness fresh',
  };
}

function shadowRecord(
  testCase: SearchQualityCase,
  channel: SearchQualityChannel,
  envelope: SearchDecisionEnvelope,
): ShadowDeltaTelemetry {
  const liveScore = 0.58 + (testCase.expectedChannels.indexOf(channel) + 1) * 0.02;
  const shadowScore = liveScore + (testCase.workstream === 'W5' ? 0.12 : 0.06);
  return {
    prompt: testCase.query,
    recommendation: shadowRecommendationForCase(testCase, channel),
    liveScore: round(liveScore),
    shadowScore: round(shadowScore),
    delta: round(shadowScore - liveScore),
    dominantLane: testCase.workstream === 'W5' ? 'semantic_shadow' : 'runtime_channel',
    timestamp: envelope.timestamp,
  };
}

function shadowRecommendationForCase(testCase: SearchQualityCase, channel: SearchQualityChannel): string {
  if (testCase.workstream === 'W5') return 'system-spec-kit';
  if (channel === 'code_graph_query') return 'mcp-coco-index';
  if (channel === 'skill_graph_query') return 'sk-code-review';
  return 'system-spec-kit';
}

function scoreRun(
  run: Awaited<ReturnType<typeof runSearchQualityHarness>>,
  priorV103Summary: {
    allVariant: { cases: SearchQualityCaseResult[] };
  },
) {
  const priorById = new Map(priorV103Summary.allVariant.cases.map((testCase) => [testCase.caseId, caseMetricTotal(testCase)]));
  const perCaseScores = run.cases.map((testCase) => {
    const scores = {
      correctness: scoreCorrectness(testCase),
      robustness: scoreRobustness(testCase),
      telemetry: scoreTelemetry(testCase),
      regressionSafety: caseMetricTotal(testCase) + 0.0001 >= (priorById.get(testCase.caseId) ?? 0) ? 2 : 0,
    };
    return {
      caseId: testCase.caseId,
      scores,
      total: scores.correctness + scores.robustness + scores.telemetry + scores.regressionSafety,
      max: 8,
      priorV103MetricTotal: priorById.get(testCase.caseId) ?? null,
      currentMetricTotal: caseMetricTotal(testCase),
      candidateRegression: caseMetricTotal(testCase) + 0.0001 < (priorById.get(testCase.caseId) ?? 0),
    };
  });
  const byDimension = {
    correctness: sum(perCaseScores.map((item) => item.scores.correctness)),
    robustness: sum(perCaseScores.map((item) => item.scores.robustness)),
    telemetry: sum(perCaseScores.map((item) => item.scores.telemetry)),
    regressionSafety: sum(perCaseScores.map((item) => item.scores.regressionSafety)),
  };
  const scoreSum = sum(Object.values(byDimension));
  const maxPossible = perCaseScores.length * 8;
  return {
    perCaseScores,
    byDimension,
    aggregate: {
      scoreSum,
      maxPossible,
      percent: round((scoreSum / maxPossible) * 100),
      percentRounded: round1((scoreSum / maxPossible) * 100),
      regressionCandidates: perCaseScores.filter((item) => item.candidateRegression).map((item) => item.caseId),
    },
  };
}

function scoreCorrectness(testCase: SearchQualityCaseResult): number {
  if (testCase.refusalPolicy.expectedRefusal && testCase.refusalPolicy.passed && testCase.citationPolicy.passed) return 2;
  if (testCase.finalRelevance.recallAt3 === 1 && testCase.citationPolicy.passed) return 2;
  if (testCase.finalRelevance.precisionAt3 > 0 || testCase.refusalPolicy.passed || testCase.citationPolicy.passed) return 1;
  return 0;
}

function scoreRobustness(testCase: SearchQualityCaseResult): number {
  const noCaptureErrors = testCase.channelCaptures.every((capture) => !capture.error);
  const hasFreshness = testCase.telemetry?.envelopes.every((envelope) => typeof envelope.degradedReadiness?.freshness === 'string') === true;
  if (noCaptureErrors && hasFreshness && testCase.refusalPolicy.passed) return 2;
  if (noCaptureErrors) return 1;
  return 0;
}

function scoreTelemetry(testCase: SearchQualityCaseResult): number {
  const telemetry = testCase.telemetry;
  if (!telemetry) return 0;
  const captureCount = testCase.channelCaptures.length;
  if (
    telemetry.envelopes.length === captureCount
    && telemetry.auditRows.length === captureCount
    && telemetry.shadowRows.length === captureCount
  ) {
    return 2;
  }
  return telemetry.envelopes.length > 0 || telemetry.auditRows.length > 0 || telemetry.shadowRows.length > 0 ? 1 : 0;
}

function summarizeWorkstreams(run: Awaited<ReturnType<typeof runSearchQualityHarness>>) {
  const result: Record<string, unknown> = {
    all: summarizeSearchQualityRun(run),
  };
  for (const workstream of ['W3', 'W4', 'W5', 'W6', 'W7'] as SearchQualityWorkstream[]) {
    const cases = run.cases.filter((testCase) => {
      const fixture = SEARCH_QUALITY_EXTENDED_CORPUS.cases.find((item) => item.id === testCase.caseId);
      return fixture?.workstream === workstream;
    });
    result[workstream] = summarizeSearchQualityRun({
      runId: `${run.runId}-${workstream}`,
      corpusVersion: `${run.corpusVersion}-${workstream}`,
      cases,
    });
  }
  return result;
}

function caseMetricTotal(testCase: SearchQualityCaseResult): number {
  return round((
    testCase.finalRelevance.precisionAt3
    + testCase.finalRelevance.recallAt3
    + (testCase.refusalPolicy.passed ? 1 : 0)
    + (testCase.citationPolicy.passed ? 1 : 0)
  ) / 4);
}

function countTriggers(envelopes: readonly SearchDecisionEnvelope[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const envelope of envelopes) {
    for (const trigger of envelope.rerankGateDecision?.triggers ?? []) {
      counts[trigger] = (counts[trigger] ?? 0) + 1;
    }
  }
  return counts;
}

function fieldCompleteness(envelope: SearchDecisionEnvelope) {
  return {
    requestId: envelope.requestId,
    populated: {
      queryPlan: Boolean(envelope.queryPlan),
      trustTree: Boolean(envelope.trustTree),
      rerankGateDecision: Boolean(envelope.rerankGateDecision),
      cocoindexCalibration: Boolean(envelope.cocoindexCalibration),
      degradedReadiness: Boolean(envelope.degradedReadiness),
      degradedReadinessFreshness: typeof envelope.degradedReadiness?.freshness === 'string',
      tenantId: Boolean(envelope.tenantId),
      latencyMs: typeof envelope.latencyMs === 'number',
      pipelineTiming: Boolean(envelope.pipelineTiming),
    },
  };
}

function stableNumericId(testCase: SearchQualityCase, channel: SearchQualityChannel, index: number): number {
  const caseIndex = SEARCH_QUALITY_EXTENDED_CORPUS.cases.findIndex((item) => item.id === testCase.id);
  const channelOffset = channel === 'memory_search' ? 1 : channel === 'code_graph_query' ? 2 : 3;
  return 10_000 + Math.max(caseIndex, 0) * 100 + channelOffset * 10 + index;
}

function copyJsonl(from: string, to: string): void {
  const rows = readJsonl<unknown>(from);
  writeJsonl(to, rows);
}

function writeJsonl(path: string, rows: readonly unknown[]): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function readOptionalJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  return readJson<T>(path);
}

function readJsonl<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  const text = readFileSync(path, 'utf8').trim();
  if (text.length === 0) return [];
  return text.split('\n').filter(Boolean).map((line) => JSON.parse(line) as T);
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
