● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effecti
  vescore-fallback-chain.md
  └ 119 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fus
  ion-corrections.md
  └ 42 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-rera
  nker-via-node-llama-cpp.md
  └ 109 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-
  cache.md
  └ 28 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/16-access-driven-p
  opularity-scoring.md
  └ 30 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-struct
  ural-coherence-scoring.md
  └ 27 lines read

● SQL: Create audit todos
  └ 4 row(s) inserted. Last inserted row ID: 4.

● Extract source file paths from feature files
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  base=Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  features=[...
  └ 100 lines...

● Todo started: extract-source-files

● Check if source files are listed in directory READMEs
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  base=Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  features=[...
  └ 147 lines...

● Todo started: check-readme-coverage

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
  └ 421 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
  └ 70 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
  └ 270 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts
  └ 626 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
  └ 554 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ 415 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts
  └ 406 lines read

● Read .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
  └ 490 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ 332 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 521-850
  └ 293 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts lines 1-280
  └ 280 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts lines 281-620
  └ 339 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts
  └ 179 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts lines 260-620
  └ 283 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts lines 620-900

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts lines 1-220
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ 208 lines read

● Grep "catch\s*\([^)]*\)\s*\{\s*\}" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server)
  └ 6 lines found

● Grep "try\s*\{[\s\S]{0,120}?\}\s*catch\s*\([^)]*\)\s*\{\s*(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*)?
(?:return|[\w\.]+\s*=\s*(?:false|0|null)|\s*)\}" (/Users/michelkerkmeester/MEGA/Development/Opencode
 Env/Public/.opencode/skill/system-spec-kit/mcp_server)
  └ 9 files found

● Grep "modelLoadPromisePath|MIN_TOTAL_MEMORY|MAX_ACCUMULATOR_SIZE|triggerMatcher\.clearCache\(\)"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server)
  └ 34 lines found

● Read all unique source files for audit coverage
  $ python3 - <<'PY'
  from pathlib import Path
  import re
  base=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 28 lines...

● Todo completed: audit-source-files, produce-report

---
FEATURE: 12-stage-3-effectivescore-fallback-chain.md  
SOURCE_FILES_AUDITED: 50  
BUGS_FOUND: 1

BUG: F12-001  
FILE: mcp_server/lib/search/local-reranker.ts:28-33,187-190  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Memory gate is stricter than the feature’s documented runtime requirement, which can disable local reranking on supported hosts (4–8GB systems and low-threshold custom-model path).  
EVIDENCE:  
```ts
const MIN_TOTAL_MEMORY_BYTES = 8 * 1024 * 1024 * 1024;
const MIN_TOTAL_MEMORY_CUSTOM_BYTES = 2 * 1024 * 1024 * 1024;
...
const memThreshold = hasCustomModel ? MIN_TOTAL_MEMORY_CUSTOM_BYTES : MIN_TOTAL_MEMORY_BYTES;
if (os.totalmem() < memThreshold) return false;
```  
SUGGESTED_FIX: Align thresholds with intended behavior (default 4GB, custom-model lower threshold), and add unit tests for both default/custom model gating.

README_COVERAGE:
- All 50 implementation files: LISTED in their respective directory README.md (no missing entries detected).

---

FEATURE: 13-scoring-and-fusion-corrections.md  
SOURCE_FILES_AUDITED: 3  
BUGS_FOUND: 1

BUG: F13-001  
FILE: shared/algorithms/rrf-fusion.ts:214-223,338-340,364-385  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Cross-variant fusion aggregates per-variant scores that already include convergence bonus, then applies cross-variant bonus again; this can over-reward convergence.  
EVIDENCE:  
```ts
// per-variant
if (uniqueSourceCount >= 2) {
  const bonus = convergenceBonus * (uniqueSourceCount - 1);
  result.rrfScore += bonus;
}
// cross-variant
const perVariantFused = variantLists.map(lists => fuseResultsMulti(lists, options));
...
existing.rrfScore += result.rrfScore;
...
result.rrfScore += crossVariantBonus;
```  
SUGGESTED_FIX: Merge on base score (subtract or separate per-variant convergence component before cross-variant aggregation), then add exactly one cross-variant bonus.

README_COVERAGE:
- mcp_server/lib/scoring/mpab-aggregation.ts: LISTED in mcp_server/lib/scoring/README.md  
- mcp_server/lib/search/rsf-fusion.ts: LISTED in mcp_server/lib/search/README.md  
- shared/algorithms/rrf-fusion.ts: LISTED in shared/algorithms/README.md

---

FEATURE: 14-local-gguf-reranker-via-node-llama-cpp.md  
SOURCE_FILES_AUDITED: 45  
BUGS_FOUND: 1

BUG: F14-001  
FILE: mcp_server/lib/search/local-reranker.ts:28-33,187-190  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Local reranker memory precondition is overly strict relative to intended rollout behavior; this causes avoidable fallback to non-local ranking.  
EVIDENCE:  
```ts
const MIN_TOTAL_MEMORY_BYTES = 8 * 1024 * 1024 * 1024;
const MIN_TOTAL_MEMORY_CUSTOM_BYTES = 2 * 1024 * 1024 * 1024;
```  
SUGGESTED_FIX: Use intended thresholds and verify with tests for boundary conditions (just-below / just-above threshold).

README_COVERAGE:
- All 45 implementation files: LISTED in their respective directory README.md (no missing entries detected).

---

FEATURE: 15-tool-level-ttl-cache.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 2

BUG: F15-001  
FILE: mcp_server/lib/cache/tool-cache.ts:120-127,329-332,334-336  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Cache cannot represent a legitimate `null` value; `get()` uses `null` as miss sentinel, causing repeated recomputation for tools that return null.  
EVIDENCE:  
```ts
function get<T>(key: string): T | null { ... if (!entry) return null; ... return entry.value; }
const cached = get<T>(key);
if (cached !== null) return cached;
const result = await fn();
set(key, result, ...);
```  
SUGGESTED_FIX: Return `{hit:boolean,value?:T}` from `get()` or use a unique sentinel symbol for misses.

BUG: F15-002  
FILE: mcp_server/handlers/mutation-hooks.ts:22-27,30-34,37-42,45-50,53-58  
SEVERITY: P2-MINOR  
TYPE: ERROR_HANDLING  
DESCRIPTION: Hook failures are swallowed silently, hiding invalidation/cleanup failures and making stale-cache diagnosis hard.  
EVIDENCE:  
```ts
try { triggerMatcher.clearCache(); ... } catch (_error) { triggerCacheCleared = false; }
try { toolCache.invalidateOnWrite(...); } catch (_error) { toolCacheInvalidated = 0; }
```  
SUGGESTED_FIX: Emit structured warning logs on each catch with operation/context so partial hook failure is observable.

README_COVERAGE:
- mcp_server/lib/cache/tool-cache.ts: LISTED in mcp_server/lib/cache/README.md  
- mcp_server/handlers/mutation-hooks.ts: LISTED in mcp_server/handlers/README.md

---

FEATURE: 16-access-driven-popularity-scoring.md  
SOURCE_FILES_AUDITED: 3  
BUGS_FOUND: 2

BUG: F16-001  
FILE: mcp_server/lib/storage/access-tracker.ts:54-61,112-117  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Overflow flush converts fractional accumulator states into whole `+1` writes, inflating counts when map-size safeguard triggers.  
EVIDENCE:  
```ts
if (accumulators.size > MAX_ACCUMULATOR_SIZE) {
  for (const [id] of accumulators) flushAccessCounts(id);
}
...
UPDATE memory_index SET access_count = access_count + 1 ...
```  
SUGGESTED_FIX: Flush exact accumulated value (or scaled integer representation) instead of unconditional `+1` on overflow flush.

BUG: F16-002  
FILE: mcp_server/lib/storage/access-tracker.ts:81-99  
SEVERITY: P2-MINOR  
TYPE: RESOURCE  
DESCRIPTION: `trackMultipleAccesses()` does not enforce the max-accumulator-size guard present in `trackAccess()`, so bulk-only flows can grow map without bound until external reset.  
EVIDENCE:  
```ts
function trackMultipleAccesses(memoryIds: number[]) {
  for (const id of memoryIds) { ... accumulators.set(id, newValue); }
}
```  
SUGGESTED_FIX: Reuse the same overflow guard path used by `trackAccess()` (shared helper).

README_COVERAGE:
- mcp_server/lib/storage/access-tracker.ts: LISTED in mcp_server/lib/storage/README.md  
- mcp_server/lib/scoring/composite-scoring.ts: LISTED in mcp_server/lib/scoring/README.md  
- mcp_server/lib/cognitive/archival-manager.ts: LISTED in mcp_server/lib/cognitive/README.md

---

FEATURE: 17-temporal-structural-coherence-scoring.md  
SOURCE_FILES_AUDITED: 1  
BUGS_FOUND: 1

BUG: F17-001  
FILE: mcp_server/handlers/quality-loop.ts:121-124,383-385  
SEVERITY: P2-MINOR  
TYPE: LOGIC  
DESCRIPTION: Anchor pairing logic uses `includes` set-membership only, so duplicate opens/closes with same name can be misclassified as fully paired.  
EVIDENCE:  
```ts
const unclosed = openAnchors.filter(name => !closeAnchors.includes(name));
const unopened = closeAnchors.filter(name => !openAnchors.includes(name));
```  
SUGGESTED_FIX: Count anchors by name (multiset/frequency map) and compare counts, not just membership.

README_COVERAGE:
- mcp_server/handlers/quality-loop.ts: LISTED in mcp_server/handlers/README.md

---


Total usage est:        1 Premium request
API time spent:         2m 50s
Total session time:     3m 5s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           647.4k in, 10.0k out, 476.9k cached (Est. 1 Premium request)
