// intent-routing.vitest.ts
// Previously tested getSubgraphWeights, which was removed as dead code.
// getSubgraphWeights always returned { causalWeight: 1.0 } regardless of intent.
// The causal weight is now inlined as 1.0 in createUnifiedGraphSearchFn.

import { describe, it } from 'vitest';

describe('intent-routing (placeholder)', () => {
  it('getSubgraphWeights was removed — causal weight is inlined as 1.0', () => {
    // No tests required: the function was dead code and has been deleted.
    // The causal weight (1.0) is now a compile-time constant in
    // createUnifiedGraphSearchFn in lib/search/graph-search-fn.ts.
  });
});
