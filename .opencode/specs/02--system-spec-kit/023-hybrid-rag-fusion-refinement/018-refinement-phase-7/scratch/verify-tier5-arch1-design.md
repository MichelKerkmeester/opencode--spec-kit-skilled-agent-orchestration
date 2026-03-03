# Tier 5 Architecture Verification + ARCH-1 API Design

Date: 2026-03-03

---

## Part 1: ARCH Verification

### ARCH-2: Eval CLIs in scripts/evals/ — PASS

**Evidence:** 11 eval scripts found in `.opencode/skill/system-spec-kit/scripts/evals/`:
- `collect-redaction-calibration-inputs.ts`
- `map-ground-truth-ids.ts`
- `run-ablation.ts`
- `run-bm25-baseline.ts`
- `run-chk210-quality-backfill.ts`
- `run-performance-benchmarks.ts`
- `run-phase1-5-shadow-eval.ts`
- `run-phase2-closure-metrics.mjs`
- `run-phase3-telemetry-dashboard.ts`
- `run-quality-legacy-remediation.ts`
- `run-redaction-calibration.ts`

None located under `mcp_server/scripts/`.

---

### ARCH-4: Algorithms in shared/algorithms/ — PASS

**Evidence:** 4 files in `.opencode/skill/system-spec-kit/shared/algorithms/`:
- `index.ts` — barrel re-export of all algorithms
- `adaptive-fusion.ts` — FusionWeights, DegradedModeContract, adaptive fusion logic
- `rrf-fusion.ts` — Reciprocal Rank Fusion (RRF) with constants, interfaces
- `mmr-reranker.ts` — Maximal Marginal Relevance reranker

**Zero imports from mcp_server:** `grep -rn "from.*mcp_server" shared/algorithms/` returned no matches.
Internal dependencies only: `adaptive-fusion.ts` imports from `./rrf-fusion` (sibling within shared/).

---

### ARCH-5: shared/config.ts + shared/paths.ts — PASS

**Evidence:**

`shared/config.ts` (4 LOC) — Pure env var reading:
```typescript
export function getDbDir(): string | undefined {
  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
}
```
No DB operations, no side effects, no imports.

`shared/paths.ts` (11 LOC) — Exports `DB_PATH`:
```typescript
import { getDbDir } from './config';
const DEFAULT_DB_PATH = path.join(__dirname, '../../mcp_server/database/context-index.sqlite');
export const DB_PATH: string = (() => {
  const dir = getDbDir();
  return dir ? path.resolve(process.cwd(), dir, 'context-index.sqlite') : DEFAULT_DB_PATH;
})();
```
Clean dependency chain: `paths.ts` imports from `./config` only. Already used by `scripts/memory/cleanup-orphaned-vectors.ts` via `@spec-kit/shared/paths`.

---

### ARCH-6: memory-save.ts <= 1600 LOC — PASS

**Evidence:**
- `wc -l memory-save.ts` = **1520 LOC** (under 1600 threshold)
- All 4 extracted handler modules exist in `mcp_server/handlers/`:
  - `chunking-orchestrator.ts`
  - `causal-links-processor.ts`
  - `pe-gating.ts`
  - `quality-loop.ts`

---

### ARCH-7: No circular deps — PASS

**Evidence:**
- `mcp_server/lib/search/search-types.ts` exists (5 LOC, exports `GraphSearchFn` type)
- `memory-crud-health.ts` imports from core modules only:
  - `../core` (checkDatabaseUpdated, isEmbeddingModelReady)
  - `../lib/search/vector-index`
  - `../lib/providers/embeddings`
  - `../lib/response/envelope`
  - `../utils`
  - `./memory-index` (peer handler)
  - `./types`, `./memory-crud-types` (type-only)
- **No lib/ module imports from handlers/:** `grep "from.*handlers" mcp_server/lib/` returned zero matches.
- No obvious circular import patterns detected.

---

### ARCH-8: scripts/lib/retry-manager.ts deleted — PASS

**Evidence:** `ls scripts/lib/retry-manager.ts` returned "No such file or directory". File is confirmed deleted.

---

### ARCH-9: ground-truth-data.ts <= 100 LOC — PASS

**Evidence:**
- `wc -l ground-truth-data.ts` = **74 LOC** (under 100 threshold)
- JSON data file exists: `mcp_server/lib/eval/data/ground-truth.json` confirmed present.

---

## Part 1 Summary

| Item   | Status | Key Evidence                                          |
| ------ | ------ | ----------------------------------------------------- |
| ARCH-2 | PASS   | 11 eval scripts in scripts/evals/                     |
| ARCH-4 | PASS   | 4 files in shared/algorithms/, zero mcp_server imports|
| ARCH-5 | PASS   | config.ts=pure env, paths.ts exports DB_PATH          |
| ARCH-6 | PASS   | 1520 LOC (<=1600), 4 extracted modules exist          |
| ARCH-7 | PASS   | search-types.ts exists, no circular deps found        |
| ARCH-8 | PASS   | retry-manager.ts confirmed deleted                    |
| ARCH-9 | PASS   | 74 LOC (<=100), ground-truth.json exists              |

**Result: 7/7 PASS**

---

## Part 2: ARCH-1 Stable Indexing API Design

### Current State: Scripts Importing from mcp_server/

Only 2 script files import from `mcp_server/` internals (both in `scripts/evals/`):

**1. `run-ablation.ts`** — 5 imports:
| Import                                | Source Module                         |
| ------------------------------------- | ------------------------------------- |
| `runAblation`, `storeAblationResults`, `formatAblationReport`, `toHybridSearchFlags`, `isAblationEnabled`, `ALL_CHANNELS` + types | `mcp_server/lib/eval/ablation-framework` |
| `initEvalDb`                          | `mcp_server/lib/eval/eval-db`         |
| `generateQueryEmbedding`              | `mcp_server/lib/providers/embeddings` |
| `init` (as initHybridSearch), `hybridSearchEnhanced` | `mcp_server/lib/search/hybrid-search` |
| `* as vectorIndex`                    | `mcp_server/lib/search/vector-index`  |

**2. `run-bm25-baseline.ts`** — 4 imports:
| Import                                | Source Module                         |
| ------------------------------------- | ------------------------------------- |
| `fts5Bm25Search`, `isFts5Available`   | `mcp_server/lib/search/sqlite-fts`    |
| `runBM25Baseline`, `recordBaselineMetrics` + types | `mcp_server/lib/eval/bm25-baseline` |
| `loadGroundTruth`                     | `mcp_server/lib/eval/ground-truth-generator` |
| `initEvalDb`                          | `mcp_server/lib/eval/eval-db`         |

**Note:** `scripts/core/workflow.ts`, `scripts/memory/cleanup-orphaned-vectors.ts`, and all other script files have zero mcp_server imports. `cleanup-orphaned-vectors.ts` already uses `@spec-kit/shared/paths` correctly.

---

### Proposed API Surface

#### Group 1: Eval Framework (used by eval scripts exclusively)

```
mcp_server/api/eval.ts
```

| Function / Type                | Source Module                 | Purpose                                     |
| ------------------------------ | ---------------------------- | ------------------------------------------- |
| `initEvalDb()`                 | lib/eval/eval-db             | Initialize eval metrics database            |
| `runAblation()`                | lib/eval/ablation-framework  | Run channel ablation study                  |
| `storeAblationResults()`       | lib/eval/ablation-framework  | Persist ablation results                    |
| `formatAblationReport()`       | lib/eval/ablation-framework  | Format markdown report                      |
| `toHybridSearchFlags()`        | lib/eval/ablation-framework  | Convert channel config to search flags      |
| `isAblationEnabled()`          | lib/eval/ablation-framework  | Check SPECKIT_ABLATION env flag             |
| `ALL_CHANNELS`                 | lib/eval/ablation-framework  | List of all ablation channels               |
| `runBM25Baseline()`            | lib/eval/bm25-baseline       | Run BM25-only baseline measurement          |
| `recordBaselineMetrics()`      | lib/eval/bm25-baseline       | Persist baseline metrics                    |
| `loadGroundTruth()`            | lib/eval/ground-truth-generator | Load ground truth dataset                |
| Type: `AblationChannel`        | lib/eval/ablation-framework  | Channel enum type                           |
| Type: `AblationSearchFn`       | lib/eval/ablation-framework  | Search function signature for ablation      |
| Type: `AblationReport`         | lib/eval/ablation-framework  | Report structure                            |
| Type: `BM25SearchFn`           | lib/eval/bm25-baseline       | BM25 search function signature              |
| Type: `BM25SearchResult`       | lib/eval/bm25-baseline       | BM25 result structure                       |
| Type: `BM25BaselineResult`     | lib/eval/bm25-baseline       | Baseline result structure                   |

#### Group 2: Search (used by eval scripts for running searches)

```
mcp_server/api/search.ts
```

| Function / Type                | Source Module                | Purpose                                      |
| ------------------------------ | --------------------------- | -------------------------------------------- |
| `init()` (hybrid search init)  | lib/search/hybrid-search    | Initialize hybrid search subsystem           |
| `hybridSearchEnhanced()`       | lib/search/hybrid-search    | Execute enhanced hybrid search               |
| `fts5Bm25Search()`             | lib/search/sqlite-fts       | Execute FTS5 BM25 search                     |
| `isFts5Available()`            | lib/search/sqlite-fts       | Check FTS5 availability                      |
| `vectorIndex.*` (namespace)    | lib/search/vector-index     | Vector index operations (init, search, etc.) |
| Type: `HybridSearchOptions`    | lib/search/hybrid-search    | Search options                               |
| Type: `HybridSearchResult`     | lib/search/hybrid-search    | Search result                                |

#### Group 3: Providers (used by eval scripts for embeddings)

```
mcp_server/api/providers.ts
```

| Function / Type                | Source Module                 | Purpose                                    |
| ------------------------------ | ---------------------------- | ------------------------------------------ |
| `generateQueryEmbedding()`     | lib/providers/embeddings     | Generate embedding vector for a query      |

#### Barrel Re-export

```
mcp_server/api/index.ts
```

```typescript
export * from './eval';
export * from './search';
export * from './providers';
```

---

### Module Structure

```
mcp_server/
  api/
    index.ts          # Barrel: re-exports all public API
    eval.ts           # Re-exports from lib/eval/* (ablation, bm25, ground-truth, eval-db)
    search.ts         # Re-exports from lib/search/* (hybrid-search, sqlite-fts, vector-index)
    providers.ts      # Re-exports from lib/providers/* (embeddings)
```

---

### Consumer Map

| Consumer Script                | API Groups Used          | Current Import Count |
| ------------------------------ | ------------------------ | -------------------- |
| `scripts/evals/run-ablation.ts`       | eval, search, providers | 5 import statements  |
| `scripts/evals/run-bm25-baseline.ts`  | eval, search            | 4 import statements  |

After ARCH-1, both scripts would import exclusively from `mcp_server/api/`:

```typescript
// run-ablation.ts — BEFORE (5 deep imports)
import { ... } from '../../mcp_server/lib/eval/ablation-framework';
import { initEvalDb } from '../../mcp_server/lib/eval/eval-db';
import { generateQueryEmbedding } from '../../mcp_server/lib/providers/embeddings';
import { init, hybridSearchEnhanced } from '../../mcp_server/lib/search/hybrid-search';
import * as vectorIndex from '../../mcp_server/lib/search/vector-index';

// run-ablation.ts — AFTER (1 stable import)
import {
  runAblation, storeAblationResults, formatAblationReport,
  toHybridSearchFlags, isAblationEnabled, ALL_CHANNELS,
  initEvalDb, generateQueryEmbedding,
  init as initHybridSearch, hybridSearchEnhanced, vectorIndex,
  type AblationChannel, type AblationSearchFn, type AblationReport,
} from '../../mcp_server/api';
```

---

### Design Considerations

1. **Scope is small:** Only 2 consumer files with 9 total import statements. The API surface is well-bounded.
2. **vectorIndex namespace import:** `run-ablation.ts` uses `import * as vectorIndex`. The API module should re-export the entire namespace or provide a `vectorIndex` object.
3. **No scripts/core/ or scripts/memory/ consumers:** These already use `@spec-kit/shared/` (the correct pattern). No migration needed.
4. **tsconfig path alias recommended:** Consider adding `@spec-kit/api` alias pointing to `mcp_server/api/index.ts` for cleaner imports.
5. **Versioning:** The API surface should be marked `@public` with JSDoc to signal stability guarantees.

---

### Estimated Effort

| Task                                              | LOC   | Effort     |
| ------------------------------------------------- | ----- | ---------- |
| Create `mcp_server/api/eval.ts`                   | ~25   | 15 min     |
| Create `mcp_server/api/search.ts`                 | ~20   | 15 min     |
| Create `mcp_server/api/providers.ts`              | ~5    | 5 min      |
| Create `mcp_server/api/index.ts` (barrel)         | ~5    | 5 min      |
| Update `run-ablation.ts` imports                  | ~10   | 10 min     |
| Update `run-bm25-baseline.ts` imports             | ~10   | 10 min     |
| Add tsconfig path alias (optional)                | ~3    | 5 min      |
| Verify compilation + run eval scripts             | —     | 15 min     |
| **Total**                                         | ~78   | **~1.5 hr**|

**Complexity:** Low. Pure re-export modules with zero logic. Risk is minimal since it is additive (existing deep imports keep working until migration is complete).
