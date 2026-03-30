// ───────────────────────────────────────────────────────────────
// MODULE: Ground Truth Data Loader
// ───────────────────────────────────────────────────────────────
// Feature catalog: Synthetic ground truth corpus
import groundTruthData from './data/ground-truth.json' with { type: 'json' };

export type IntentType =
  | 'add_feature'
  | 'fix_bug'
  | 'refactor'
  | 'security_audit'
  | 'understand'
  | 'find_spec'
  | 'find_decision';

export type ComplexityTier = 'simple' | 'moderate' | 'complex';

export type QueryCategory =
  | 'factual'
  | 'temporal'
  | 'graph_relationship'
  | 'cross_document'
  | 'hard_negative'
  | 'anchor_based'
  | 'scope_filtered';

export type QuerySource = 'manual' | 'trigger_derived' | 'pattern_derived' | 'seed';

export interface GroundTruthQuery {
  id: number;
  query: string;
  intentType: IntentType;
  complexityTier: ComplexityTier;
  category: QueryCategory;
  source: QuerySource;
  expectedResultDescription: string;
  notes?: string;
}

export interface GroundTruthRelevance {
  queryId: number;
  memoryId: number;
  relevance: 0 | 1 | 2 | 3;
}

const { queries, relevances } = groundTruthData as {
  queries: GroundTruthQuery[];
  relevances: GroundTruthRelevance[];
};

export const GROUND_TRUTH_QUERIES: GroundTruthQuery[] = queries;
export const GROUND_TRUTH_RELEVANCES: GroundTruthRelevance[] = relevances;

function computeDistribution(
  key: keyof Pick<GroundTruthQuery, 'intentType' | 'complexityTier' | 'category'>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of GROUND_TRUTH_QUERIES) {
    const val = q[key] as string;
    counts[val] = (counts[val] ?? 0) + 1;
  }
  return counts;
}

export const QUERY_DISTRIBUTION = {
  total: GROUND_TRUTH_QUERIES.length,
  bySource: {
    seed: GROUND_TRUTH_QUERIES.filter(q => q.source === 'seed').length,
    pattern_derived: GROUND_TRUTH_QUERIES.filter(q => q.source === 'pattern_derived').length,
    trigger_derived: GROUND_TRUTH_QUERIES.filter(q => q.source === 'trigger_derived').length,
    manual: GROUND_TRUTH_QUERIES.filter(q => q.source === 'manual').length,
  },
  byIntentType: computeDistribution('intentType'),
  byComplexityTier: computeDistribution('complexityTier'),
  byCategory: computeDistribution('category'),
  hardNegativeCount: GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative').length,
  manualQueryCount: GROUND_TRUTH_QUERIES.filter(q => q.source === 'manual').length,
} as const;
