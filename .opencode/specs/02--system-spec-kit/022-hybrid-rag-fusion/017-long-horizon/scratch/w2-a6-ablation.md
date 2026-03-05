# W2-A6: Ablation Framework Implementation (R13-S3)

**Status:** COMPLETE
**File:** `mcp_server/lib/eval/ablation-framework.ts` (~290 LOC)
**Feature flag:** `SPECKIT_ABLATION=true`

## Architecture

The ablation framework follows the shadow-scoring pattern: dependency-injected search function, fail-safe try-catch wrappers, feature-flag gating, and eval DB storage.

### Core Design

```
AblationConfig + SearchFn
        |
        v
  [Baseline run]  -- all channels enabled, compute per-query Recall@K
        |
        v
  [Ablation runs] -- for each channel: disable it, rerun all queries
        |
        v
  [Delta calc]    -- per-query: ablated_recall - baseline_recall
        |
        v
  [Sign test]     -- two-sided binomial sign test for significance
        |
        v
  [Store + Report] -- eval_metric_snapshots + markdown report
```

### Channel Toggle Mechanism

The `AblationSearchFn` type accepts a `Set<AblationChannel>` of disabled channels. The convenience function `toHybridSearchFlags()` maps these to `HybridSearchOptions` flags (`useVector`, `useBm25`, `useFts`, `useGraph`). The `trigger` channel must be handled separately by the caller since trigger matching lives outside `hybridSearch`.

### Statistical Significance

Uses a two-sided sign test (exact binomial) rather than t-test:
- No normality assumption required
- Robust for small sample sizes
- Counts: queriesHurt (removing channel decreased recall), queriesHelped (increased), queriesUnchanged (tied)
- p-value computed only when n >= 5 non-tied observations

### Storage Schema

Reuses existing `eval_metric_snapshots` table:
- `metric_name = 'ablation_baseline_recall@20'` for baseline row
- `metric_name = 'ablation_recall@20_delta'` for per-channel rows
- `channel` = ablated channel name (or 'all' for baseline)
- `metadata` = JSON with full result details including p-value

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `isAblationEnabled()` | function | Feature flag check |
| `ALL_CHANNELS` | const | `['vector','bm25','fts5','graph','trigger']` |
| `runAblation(searchFn, config)` | async function | Main entry point |
| `storeAblationResults(report)` | function | Persist to eval DB |
| `formatAblationReport(report)` | function | Markdown table output |
| `toHybridSearchFlags(disabled)` | function | Map to hybridSearch options |

## Integration Points

- **eval-metrics.ts** — `computeRecall()` for Recall@K calculation
- **ground-truth-data.ts** — `GROUND_TRUTH_QUERIES`, `GROUND_TRUTH_RELEVANCES`
- **eval-db.ts** — `initEvalDb()`, `getEvalDb()` for DB access
- **hybrid-search.ts** — `toHybridSearchFlags()` maps to search options

## Usage Example

```typescript
import { runAblation, storeAblationResults, formatAblationReport, toHybridSearchFlags } from './ablation-framework';

// Wrap your search function
const searchFn = async (query, disabledChannels) => {
  const flags = toHybridSearchFlags(disabledChannels);
  const results = await hybridSearch(query, embedding, { ...flags });
  return results.map((r, i) => ({ memoryId: r.id, score: r.score, rank: i + 1 }));
};

// Run ablation
const report = await runAblation(searchFn, { channels: ['vector', 'bm25', 'fts5', 'graph'] });
if (report) {
  storeAblationResults(report);
  console.log(formatAblationReport(report));
}
```

## Patterns Followed

1. **Shadow-scoring pattern** — dependency injection, fail-safe, feature-flag gated
2. **BM25-baseline pattern** — eval_metric_snapshots storage with negative eval_run_id
3. **Eval-logger pattern** — try-catch wrapper, console.warn on failure, never throws
4. **Search-flags pattern** — direct `process.env` check for experimental feature
