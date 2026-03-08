● Todo added: Extract source files from feature catalog entries

● Read .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/01-graph-chan
  nel-id-fix.md
  └ 38 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-coll
  apse-deduplication.md
  └ 28 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activat
  ion-fan-effect-divisor.md
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-co
  ntent-hash-deduplication.md
  └ 54 lines read

● Todo started: extract-source-paths

● Parse feature files and check README coverage
  $ python3 - <<'PY'
  import re, os, json
  root='/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit'
  features=[...
  └ 76 lines...

● List implementation files for deep audit
  $ python3 - <<'PY'
  import re, os
  root='/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit'
  features=[...
  └ 41 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts
  └ 474 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
  └ 385 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts
  └ 179 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts
  └ 155 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts
  └ 77 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
  └ 424 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/utils/path-security.ts
  └ 7 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ 57 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts
  └ 265 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
  └ 367 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts
  └ 13 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts
  └ 11 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts
  └ 283 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
  └ 108 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts
  └ 121 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts
  └ 56 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts
  └ 433 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts
  └ 340 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
  └ 231 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts
  └ 25 lines read

● Read .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts
  └ 45 lines read

● Read .opencode/skill/system-spec-kit/shared/utils/path-security.ts
  └ 107 lines read

● Grep "contentHash|content_hash|quality_flags|quality_score|normalizeContentForEmbedding|readFileWi
thEncoding|memory_type|importance_tier" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts)
  └ 16 lines found

● Grep "cache/cognitive/rollout-policy|lib/cognitive/rollout-policy"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server)
  └ 7 lines found

● Grep "isFeatureEnabled\(|SPECKIT_ROLLOUT_PERCENT|rollout" in **/*.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server)
  └ 82 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts
  └ 57 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts
  └ 91 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts lines 150-210
  └ 61 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts lines 1-260
  └ 208 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts lines 500-760
  └ 261 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts lines 760-980
  └ 193 lines read

● Read all source files and run heuristic bug scan
  $ python3 - <<'PY'
  import re, os
  root='/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit'
  features=[...
  └ 70 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts lines 36-48
  └ 12 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts lines 120-156
  └ 36 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts lines 51-121
  └ 70 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts lines 344-352
  └ 9 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts lines 49-57
  └ 9 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts lines 192-201
  └ 10 lines read

● Todo completed: audit-source-files, check-readme-coverage

---
FEATURE: 01-graph-channel-id-fix.md  
SOURCE_FILES_AUDITED: 13  
BUGS_FOUND: 2

BUG: F1-B1  
FILE: mcp_server/lib/cognitive/rollout-policy.ts:41-47  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Partial rollouts fail open when `identity` is missing/blank, so features can be enabled for all requests instead of being gated by rollout percentage.  
EVIDENCE:
```ts
const rolloutPercent = getRolloutPercent();
if (rolloutPercent >= 100) return true;
if (rolloutPercent <= 0) return false;

if (!identity || identity.trim().length === 0) {
  return true;
}
```
SUGGESTED_FIX: For `0 < rolloutPercent < 100`, return `false` when identity is absent (fail closed), or require a deterministic fallback identity source.

BUG: F1-B2  
FILE: mcp_server/lib/search/graph-search-fn.ts:122-154  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: The FTS5 query computes `fts_score` and orders by strength*BM25, but final candidate `score` uses only `row.strength`, dropping lexical relevance signal.  
EVIDENCE:
```ts
* Scores incorporate both edge strength and FTS5 BM25 relevance.
...
SELECT ..., -bm25(...) AS fts_score
...
const score = typeof row.strength === 'number'
  ? Math.min(1, Math.max(0, row.strength))
  : 0;
```
SUGGESTED_FIX: Combine normalized `fts_score` with `strength` in the output score (e.g., weighted blend or normalized product) and keep ordering/output scoring consistent.

README_COVERAGE:
- mcp_server/lib/cognitive/rollout-policy.ts: LISTED in mcp_server/lib/cognitive/README.md  
- mcp_server/lib/parsing/content-normalizer.ts: LISTED in mcp_server/lib/parsing/README.md  
- mcp_server/lib/search/bm25-index.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/graph-flags.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/graph-search-fn.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/search-types.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/spec-folder-hierarchy.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/tests/bm25-index.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in mcp_server/tests/README.md  
- mcp_server/tests/graph-flags.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/graph-search-fn.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/rollout-policy.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/spec-folder-hierarchy.vitest.ts: MISSING in mcp_server/tests/README.md  
---

---
FEATURE: 02-chunk-collapse-deduplication.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/chunking/anchor-chunker.ts: LISTED in mcp_server/lib/chunking/README.md  
- mcp_server/lib/chunking/chunk-thinning.ts: LISTED in mcp_server/lib/chunking/README.md  
- mcp_server/lib/scoring/mpab-aggregation.ts: LISTED in mcp_server/lib/scoring/README.md  
- mcp_server/tests/chunk-thinning.vitest.ts: MISSING in mcp_server/tests/README.md  
- mcp_server/tests/mpab-aggregation.vitest.ts: MISSING in mcp_server/tests/README.md  
---

---
FEATURE: 03-co-activation-fan-effect-divisor.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 3

BUG: F3-B1  
FILE: mcp_server/lib/cognitive/co-activation.ts:52,107-120  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Related-memory cache key uses only `memoryId`; calls with different `limit` values can return stale/truncated results from prior smaller-limit cache entries.  
EVIDENCE:
```ts
const RELATED_CACHE = new Map<number, { results: RelatedMemory[]; expiresAt: number }>();
...
function getRelatedMemories(memoryId: number, limit: number = ...) { ... }
const cached = RELATED_CACHE.get(memoryId);
if (cached && Date.now() < cached.expiresAt) return cached.results;
```
SUGGESTED_FIX: Key cache by `(memoryId, limit)` or cache full list and apply `slice(0, limit)` on read.

BUG: F3-B2  
FILE: mcp_server/lib/cognitive/co-activation.ts:349-350  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Spread activation hot path does not apply fan-effect divisor, so high-degree hubs can still dominate propagation.  
EVIDENCE:
```ts
const decayedScore = current.score * CO_ACTIVATION_CONFIG.decayPerHop * (rel.similarity / 100);
if (decayedScore < 0.01) continue;
```
SUGGESTED_FIX: Apply neighbor-count scaling (e.g., divide by `sqrt(neighborMap.size)` or equivalent per-hop fan-effect term) before enqueueing neighbors.

BUG: F3-B3  
FILE: mcp_server/lib/cognitive/co-activation.ts:193-200  
SEVERITY: P2-MINOR  
TYPE: ERROR_HANDLING  
DESCRIPTION: `Float32Array` construction checks `byteLength % 4` but not `byteOffset % 4`; misaligned buffers can throw `RangeError`.  
EVIDENCE:
```ts
const uint8 = new Uint8Array(embeddingRow.embedding);
if (uint8.byteLength === 0 || uint8.byteLength % 4 !== 0) return 0;
const embedding = new Float32Array(uint8.buffer, uint8.byteOffset, uint8.byteLength / 4);
```
SUGGESTED_FIX: Add `uint8.byteOffset % 4 === 0` guard; otherwise copy to a new aligned buffer before constructing `Float32Array`.

README_COVERAGE:
- mcp_server/lib/cognitive/co-activation.ts: LISTED in mcp_server/lib/cognitive/README.md  
- mcp_server/tests/co-activation.vitest.ts: LISTED in mcp_server/tests/README.md  
---

---
FEATURE: 04-sha-256-content-hash-deduplication.md  
SOURCE_FILES_AUDITED: 27  
BUGS_FOUND: 1

BUG: F4-B1  
FILE: mcp_server/handlers/save/dedup.ts:50-56  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Dedup query excludes `embedding_status='pending'` but unintentionally also excludes `NULL` statuses (`NULL != 'pending'` is unknown/false), missing valid duplicates for legacy rows.  
EVIDENCE:
```ts
WHERE spec_folder = ?
  AND content_hash = ?
  AND parent_id IS NULL
  AND embedding_status != 'pending'
```
SUGGESTED_FIX: Make null-safe predicate, e.g. `COALESCE(embedding_status, '') != 'pending'` (or explicit `embedding_status IS NULL OR embedding_status != 'pending'`).

README_COVERAGE:
- mcp_server/handlers/memory-crud-types.ts: LISTED in mcp_server/handlers/README.md  
- mcp_server/handlers/save/dedup.ts: LISTED in mcp_server/handlers/save/README.md  
- mcp_server/handlers/save/types.ts: LISTED in mcp_server/handlers/save/README.md  
- mcp_server/hooks/mutation-feedback.ts: MISSING in mcp_server/hooks/README.md  
- mcp_server/lib/config/memory-types.ts: LISTED in mcp_server/lib/config/README.md  
- mcp_server/lib/config/type-inference.ts: LISTED in mcp_server/lib/config/README.md  
- mcp_server/lib/parsing/memory-parser.ts: LISTED in mcp_server/lib/parsing/README.md  
- mcp_server/lib/scoring/importance-tiers.ts: LISTED in mcp_server/lib/scoring/README.md  
- mcp_server/lib/storage/incremental-index.ts: LISTED in mcp_server/lib/storage/README.md  
- mcp_server/lib/utils/canonical-path.ts: LISTED in mcp_server/lib/utils/README.md  
- mcp_server/lib/utils/path-security.ts: LISTED in mcp_server/lib/utils/README.md  
- shared/parsing/quality-extractors.ts: LISTED in shared/parsing/README.md  
- shared/utils/path-security.ts: LISTED in shared/utils/README.md  
- mcp_server/tests/content-hash-dedup.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/importance-tiers.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/incremental-index-v2.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/incremental-index.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/integration-session-dedup.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/memory-parser-extended.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/memory-parser.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/memory-types.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/unit-composite-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/unit-folder-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/unit-path-security.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/unit-tier-classifier-types.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/unit-transaction-metrics-types.vitest.ts: LISTED in mcp_server/tests/README.md  
- shared/parsing/quality-extractors.test.ts: LISTED in shared/parsing/README.md  
---


Total usage est:        1 Premium request
API time spent:         3m 14s
Total session time:     3m 30s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           1.2m in, 10.2k out, 985.6k cached (Est. 1 Premium request)
