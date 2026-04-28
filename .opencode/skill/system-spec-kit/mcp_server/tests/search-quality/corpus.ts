// ───────────────────────────────────────────────────────────────
// MODULE: Search Quality Corpus
// ───────────────────────────────────────────────────────────────
// Small deterministic corpus for the measurement-first harness. The fixtures
// encode expected outcomes only; they do not call production memory stores.

type SearchQualityChannel = 'memory_search' | 'code_graph_query' | 'skill_graph_query';

interface SearchQualityCitationExpectation {
  requiredIds: string[];
  allowRefusalInstead?: boolean;
}

interface SearchQualityCase {
  id: string;
  query: string;
  source: 'v1.0.1-stress' | 'v1.0.2-rerun' | 'ambiguous' | 'paraphrase';
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

export {
  SEARCH_QUALITY_CORPUS,
  type SearchQualityCase,
  type SearchQualityChannel,
  type SearchQualityCitationExpectation,
  type SearchQualityCorpus,
};
