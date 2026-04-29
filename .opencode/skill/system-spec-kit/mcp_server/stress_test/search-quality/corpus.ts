// ───────────────────────────────────────────────────────────────
// MODULE: Search Quality Corpus
// ───────────────────────────────────────────────────────────────
// Small deterministic corpus for the measurement-first harness. The fixtures
// encode expected outcomes only; they do not call production memory stores.

type SearchQualityChannel = 'memory_search' | 'code_graph_query' | 'skill_graph_query';
type SearchQualityWorkstream = 'W3' | 'W4' | 'W5' | 'W6' | 'W7';

interface SearchQualityCitationExpectation {
  requiredIds: string[];
  allowRefusalInstead?: boolean;
}

interface SearchQualityCase {
  id: string;
  query: string;
  source:
    | 'v1.0.1-stress'
    | 'v1.0.2-rerun'
    | 'ambiguous'
    | 'paraphrase'
    | 'trust-tree'
    | 'rerank-gate'
    | 'advisor-shadow'
    | 'duplicate-heavy'
    | 'degraded-readiness';
  workstream?: SearchQualityWorkstream;
  expectedRelevantIds: string[];
  expectedChannels: SearchQualityChannel[];
  citationExpectation?: SearchQualityCitationExpectation;
  refusalExpected?: boolean;
  notes: string;
}

interface SearchQualityCorpus {
  version: string;
  cases: SearchQualityCase[];
}

const SEARCH_QUALITY_CORPUS: SearchQualityCorpus = {
  version: '006-search-query-rag-optimization-baseline-v1',
  cases: [
    {
      id: 'v101-weak-retrieval-refusal',
      query: 'weak memory search should not cite unsupported paths',
      source: 'v1.0.1-stress',
      expectedRelevantIds: ['weak-refusal-policy'],
      expectedChannels: ['memory_search'],
      citationExpectation: {
        requiredIds: ['weak-refusal-policy'],
        allowRefusalInstead: true,
      },
      refusalExpected: true,
      notes: 'Models the v1.0.1 weak-retrieval hallucinated-path failure mode.',
    },
    {
      id: 'v102-code-graph-fallback',
      query: 'code graph full scan required fallback decision',
      source: 'v1.0.2-rerun',
      expectedRelevantIds: ['code-graph-full-scan-fallback'],
      expectedChannels: ['code_graph_query'],
      citationExpectation: {
        requiredIds: ['code-graph-full-scan-fallback'],
      },
      notes: 'Models the v1.0.2 marginal code-graph proof cell as a harness case.',
    },
    {
      id: 'ambiguous-advisor-routing',
      query: 'review this routing prompt and tell me which skill applies',
      source: 'ambiguous',
      expectedRelevantIds: ['advisor-ambiguity-lane-breakdown'],
      expectedChannels: ['skill_graph_query'],
      citationExpectation: {
        requiredIds: ['advisor-ambiguity-lane-breakdown'],
      },
      notes: 'Ambiguous advisor prompt that should preserve lane/ambiguity evidence.',
    },
    {
      id: 'paraphrase-query-plan',
      query: 'show the plan for search evaluation using different wording',
      source: 'paraphrase',
      expectedRelevantIds: ['query-plan-telemetry-contract'],
      expectedChannels: ['memory_search', 'skill_graph_query'],
      citationExpectation: {
        requiredIds: ['query-plan-telemetry-contract'],
      },
      notes: 'Paraphrase fixture for future query-plan and learned-routing calibration.',
    },
  ],
};

const WORKSTREAM_SEARCH_QUALITY_CASES: SearchQualityCase[] = [
  {
    id: 'w3-trust-tree-contradiction',
    query: 'compose response policy code graph advisor cocoindex contradiction provenance',
    source: 'trust-tree',
    workstream: 'W3',
    expectedRelevantIds: ['trust-tree-response-policy', 'trust-tree-contradiction-edge'],
    expectedChannels: ['memory_search', 'code_graph_query', 'skill_graph_query'],
    citationExpectation: {
      requiredIds: ['trust-tree-response-policy', 'trust-tree-contradiction-edge'],
    },
    notes: 'W3 multi-source provenance cell with one causal contradiction edge.',
  },
  {
    id: 'w4-ambiguous-rerank-disagreement',
    query: 'ambiguous review routing prompt with weak channel agreement',
    source: 'rerank-gate',
    workstream: 'W4',
    expectedRelevantIds: ['rerank-canonical-ambiguous'],
    expectedChannels: ['memory_search', 'skill_graph_query'],
    citationExpectation: {
      requiredIds: ['rerank-canonical-ambiguous'],
    },
    notes: 'W4 ambiguous query where weak channel agreement should trigger conditional rerank.',
  },
  {
    id: 'w5-advisor-shadow-ambiguous',
    query: 'ambiguous advisor prompt where learned shadow weights should explain but not alter live recommendation',
    source: 'advisor-shadow',
    workstream: 'W5',
    expectedRelevantIds: ['advisor-shadow-weight-diagnostic'],
    expectedChannels: ['skill_graph_query'],
    citationExpectation: {
      requiredIds: ['advisor-shadow-weight-diagnostic'],
    },
    notes: 'W5 labeled advisor prompt for shadow learned-weight diagnostics.',
  },
  {
    id: 'w6-cocoindex-duplicate-heavy',
    query: 'semantic code search duplicate-heavy path-class calibration',
    source: 'duplicate-heavy',
    workstream: 'W6',
    expectedRelevantIds: ['cocoindex-canonical-spec'],
    expectedChannels: ['memory_search'],
    citationExpectation: {
      requiredIds: ['cocoindex-canonical-spec'],
    },
    notes: 'W6 duplicate-heavy candidate list where adaptive overfetch should preserve canonical path recall.',
  },
  {
    id: 'w7-code-graph-stale',
    query: 'code graph stale readiness should preserve fallback metrics',
    source: 'degraded-readiness',
    workstream: 'W7',
    expectedRelevantIds: ['code-graph-stale-fallback'],
    expectedChannels: ['code_graph_query'],
    citationExpectation: {
      requiredIds: ['code-graph-stale-fallback'],
    },
    notes: 'W7 stale graph readiness fallback cell.',
  },
  {
    id: 'w7-code-graph-empty',
    query: 'code graph empty readiness full scan fallback',
    source: 'degraded-readiness',
    workstream: 'W7',
    expectedRelevantIds: ['code-graph-empty-fallback'],
    expectedChannels: ['code_graph_query'],
    citationExpectation: {
      requiredIds: ['code-graph-empty-fallback'],
    },
    notes: 'W7 empty graph fallback cell.',
  },
  {
    id: 'w7-code-graph-full-scan-required',
    query: 'code graph full scan required fallback envelope survives harness',
    source: 'degraded-readiness',
    workstream: 'W7',
    expectedRelevantIds: ['code-graph-full-scan-required-fallback'],
    expectedChannels: ['code_graph_query'],
    citationExpectation: {
      requiredIds: ['code-graph-full-scan-required-fallback'],
    },
    notes: 'W7 explicit full-scan-required fallback cell.',
  },
  {
    id: 'w7-code-graph-unavailable',
    query: 'code graph unavailable readiness routes to rg fallback',
    source: 'degraded-readiness',
    workstream: 'W7',
    expectedRelevantIds: ['code-graph-unavailable-rg-fallback'],
    expectedChannels: ['code_graph_query'],
    citationExpectation: {
      requiredIds: ['code-graph-unavailable-rg-fallback'],
    },
    notes: 'W7 unavailable graph fallback cell.',
  },
];

const SEARCH_QUALITY_EXTENDED_CORPUS: SearchQualityCorpus = {
  version: '007-search-rag-measurement-driven-implementation-v1',
  cases: [
    ...SEARCH_QUALITY_CORPUS.cases,
    ...WORKSTREAM_SEARCH_QUALITY_CASES,
  ],
};

export {
  SEARCH_QUALITY_EXTENDED_CORPUS,
  SEARCH_QUALITY_CORPUS,
  WORKSTREAM_SEARCH_QUALITY_CASES,
  type SearchQualityCase,
  type SearchQualityChannel,
  type SearchQualityCitationExpectation,
  type SearchQualityCorpus,
  type SearchQualityWorkstream,
};
