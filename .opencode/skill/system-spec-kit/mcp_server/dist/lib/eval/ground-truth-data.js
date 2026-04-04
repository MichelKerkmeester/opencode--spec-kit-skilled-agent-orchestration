// ───────────────────────────────────────────────────────────────
// MODULE: Ground Truth Data Loader
// ───────────────────────────────────────────────────────────────
// Feature catalog: Synthetic ground truth corpus
import groundTruthData from './data/ground-truth.json' with { type: 'json' };
const { queries, relevances } = groundTruthData;
export const GROUND_TRUTH_QUERIES = queries;
export const GROUND_TRUTH_RELEVANCES = relevances;
function computeDistribution(key) {
    const counts = {};
    for (const q of GROUND_TRUTH_QUERIES) {
        const val = q[key];
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
};
//# sourceMappingURL=ground-truth-data.js.map