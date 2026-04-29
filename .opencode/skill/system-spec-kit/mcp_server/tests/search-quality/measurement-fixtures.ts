// ───────────────────────────────────────────────────────────────
// MODULE: Search Quality Measurement Fixtures
// ───────────────────────────────────────────────────────────────

import {
  SEARCH_QUALITY_EXTENDED_CORPUS,
  type SearchQualityCase,
  type SearchQualityChannel,
  type SearchQualityCorpus,
  type SearchQualityWorkstream,
} from './corpus.js';
import {
  runSearchQualityHarness,
  type SearchQualityCandidate,
  type SearchQualityChannelOutput,
  type SearchQualityRun,
  type SearchQualityRunners,
} from './harness.js';
import {
  summarizeSearchQualityRun,
  type SearchQualityMetricSummary,
} from './metrics.js';

type MeasurementVariant = 'baseline' | 'variant';

interface MeasurementRecord {
  runId: string;
  workstream: SearchQualityWorkstream | 'all';
  variant: MeasurementVariant;
  hypothesis: string;
  corpusVersion: string;
  summary: SearchQualityMetricSummary;
  cases: SearchQualityRun['cases'];
}

const HYPOTHESES: Record<SearchQualityWorkstream | 'all', string> = {
  all: 'Global baseline should preserve Phase D harness pass/fail dimensions across all current fixtures.',
  W3: 'W3 trust-tree composition should improve citation-quality on multi-source contradiction cells without reducing precision, recall, or refusal-survival.',
  W4: 'W4 conditional rerank should improve precision@3 on ambiguous weak-agreement cells while keeping synthetic p95 latency under 5ms.',
  W5: 'W5 shadow learned weights should improve advisor diagnostic citation-quality while leaving live recommendation behavior unchanged.',
  W6: 'W6 CocoIndex duplicate-density calibration should improve duplicate-heavy precision@3 and preserve recall through canonical path selection.',
  W7: 'W7 degraded-readiness stress cells should preserve recall, citation-quality, and refusal-survival across stale, empty, full-scan-required, and unavailable graph states.',
};

const BASELINE_CANDIDATES: Record<string, Partial<Record<SearchQualityChannel, SearchQualityCandidate[]>>> = {
  'w3-trust-tree-contradiction': {
    memory_search: [
      candidate('trust-tree-response-policy', 'Response policy provenance', 'memory_search', 1),
      candidate('unsupported-trust-claim', 'Unsupported trust claim', 'memory_search', 2),
    ],
    code_graph_query: [
      candidate('code-graph-readiness-signal', 'Code graph readiness signal', 'code_graph_query', 1),
    ],
    skill_graph_query: [
      candidate('advisor-trust-state-signal', 'Advisor trust state signal', 'skill_graph_query', 1),
    ],
  },
  'w4-ambiguous-rerank-disagreement': {
    memory_search: [
      candidate('rerank-adjacent-noise', 'Adjacent ambiguous noise', 'memory_search', 1),
      candidate('rerank-canonical-ambiguous', 'Canonical ambiguous rerank case', 'memory_search', 2),
    ],
    skill_graph_query: [
      candidate('rerank-skill-neighbor', 'Skill neighbor disagreement', 'skill_graph_query', 1),
    ],
  },
  'w5-advisor-shadow-ambiguous': {
    skill_graph_query: [
      candidate('advisor-live-routing-only', 'Live routing without shadow diagnostic', 'skill_graph_query', 1),
      candidate('advisor-shadow-weight-diagnostic', 'Shadow learned weight diagnostic', 'skill_graph_query', 2, []),
    ],
  },
  'w6-cocoindex-duplicate-heavy': {
    memory_search: [
      candidate('cocoindex-duplicate-spec-a', 'Duplicate spec path A', 'memory_search', 1),
      candidate('cocoindex-duplicate-spec-b', 'Duplicate spec path B', 'memory_search', 2),
      candidate('cocoindex-canonical-spec', 'Canonical CocoIndex spec path', 'memory_search', 3),
    ],
  },
  'w7-code-graph-stale': {
    code_graph_query: [
      candidate('code-graph-stale-fallback', 'Stale graph fallback envelope', 'code_graph_query', 1),
    ],
  },
  'w7-code-graph-empty': {
    code_graph_query: [
      candidate('code-graph-empty-fallback', 'Empty graph fallback envelope', 'code_graph_query', 1),
    ],
  },
  'w7-code-graph-full-scan-required': {
    code_graph_query: [
      candidate('code-graph-full-scan-required-fallback', 'Full scan required fallback envelope', 'code_graph_query', 1),
    ],
  },
  'w7-code-graph-unavailable': {
    code_graph_query: [
      candidate('code-graph-unavailable-rg-fallback', 'Unavailable graph rg fallback envelope', 'code_graph_query', 1),
    ],
  },
};

const VARIANT_CANDIDATES: Record<SearchQualityWorkstream, Record<string, Partial<Record<SearchQualityChannel, SearchQualityCandidate[]>>>> = {
  W3: {
    'w3-trust-tree-contradiction': {
      memory_search: [
        candidate('trust-tree-response-policy', 'Response policy provenance', 'memory_search', 1),
      ],
      code_graph_query: [
        candidate('trust-tree-contradiction-edge', 'Contradiction edge provenance', 'code_graph_query', 1),
      ],
      skill_graph_query: [
        candidate('advisor-trust-state-signal', 'Advisor trust state signal', 'skill_graph_query', 2),
      ],
    },
  },
  W4: {
    'w4-ambiguous-rerank-disagreement': {
      memory_search: [
        candidate('rerank-canonical-ambiguous', 'Canonical ambiguous rerank case', 'memory_search', 1),
      ],
      skill_graph_query: [],
    },
  },
  W5: {
    'w5-advisor-shadow-ambiguous': {
      skill_graph_query: [
        candidate('advisor-shadow-weight-diagnostic', 'Shadow learned weight diagnostic', 'skill_graph_query', 1),
        candidate('advisor-live-routing-only', 'Live routing unchanged', 'skill_graph_query', 2),
      ],
    },
  },
  W6: {
    'w6-cocoindex-duplicate-heavy': {
      memory_search: [
        candidate('cocoindex-canonical-spec', 'Canonical CocoIndex spec path', 'memory_search', 1),
      ],
    },
  },
  W7: {
    'w7-code-graph-stale': BASELINE_CANDIDATES['w7-code-graph-stale'] ?? {},
    'w7-code-graph-empty': BASELINE_CANDIDATES['w7-code-graph-empty'] ?? {},
    'w7-code-graph-full-scan-required': BASELINE_CANDIDATES['w7-code-graph-full-scan-required'] ?? {},
    'w7-code-graph-unavailable': BASELINE_CANDIDATES['w7-code-graph-unavailable'] ?? {},
  },
};

function corpusForWorkstream(workstream: SearchQualityWorkstream | 'all'): SearchQualityCorpus {
  if (workstream === 'all') return SEARCH_QUALITY_EXTENDED_CORPUS;
  return {
    version: `${SEARCH_QUALITY_EXTENDED_CORPUS.version}-${workstream}`,
    cases: SEARCH_QUALITY_EXTENDED_CORPUS.cases.filter((testCase) => testCase.workstream === workstream),
  };
}

function createMeasurementRunners(args: {
  workstream: SearchQualityWorkstream | 'all';
  variant: MeasurementVariant;
}): SearchQualityRunners {
  return {
    memory_search: (testCase) => staticOutput(testCase, 'memory_search', args),
    code_graph_query: (testCase) => staticOutput(testCase, 'code_graph_query', args),
    skill_graph_query: (testCase) => staticOutput(testCase, 'skill_graph_query', args),
  };
}

async function runMeasurement(args: {
  workstream: SearchQualityWorkstream | 'all';
  variant: MeasurementVariant;
  runId?: string;
}): Promise<MeasurementRecord> {
  const corpus = corpusForWorkstream(args.workstream);
  const run = await runSearchQualityHarness(corpus, createMeasurementRunners(args), {
    runId: args.runId ?? `${args.workstream}-${args.variant}`,
  });
  return {
    runId: run.runId,
    workstream: args.workstream,
    variant: args.variant,
    hypothesis: HYPOTHESES[args.workstream],
    corpusVersion: run.corpusVersion,
    summary: summarizeSearchQualityRun(run),
    cases: run.cases,
  };
}

function staticOutput(
  testCase: SearchQualityCase,
  channel: SearchQualityChannel,
  args: { workstream: SearchQualityWorkstream | 'all'; variant: MeasurementVariant },
): SearchQualityChannelOutput {
  const variantCandidates = args.variant === 'variant' && testCase.workstream
    ? VARIANT_CANDIDATES[testCase.workstream]?.[testCase.id]?.[channel]
    : undefined;
  const candidates = variantCandidates ?? BASELINE_CANDIDATES[testCase.id]?.[channel] ?? [];
  const fallbackLatency = args.variant === 'variant' ? 2 : 1;
  return {
    candidates,
    refused: testCase.refusalExpected === true && channel === 'memory_search',
    citationIds: candidates.flatMap((item) => item.citationIds ?? []),
    latencyMs: fallbackLatency,
  };
}

function candidate(
  id: string,
  title: string,
  channel: SearchQualityChannel,
  rank: number,
  citationIds: string[] = [id],
): SearchQualityCandidate {
  return {
    id,
    title,
    channel,
    rank,
    score: 1 / rank,
    citationIds,
  };
}

export {
  type MeasurementRecord,
  type MeasurementVariant,
  HYPOTHESES,
  corpusForWorkstream,
  createMeasurementRunners,
  runMeasurement,
};
