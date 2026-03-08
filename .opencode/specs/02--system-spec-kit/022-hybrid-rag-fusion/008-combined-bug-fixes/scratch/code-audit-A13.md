● SQL: Initialize audit todos
  └ 1 row(s) inserted. Last inserted row ID: 1.

● Read .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-d
  atabase-and-schema.md
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-
  computation.md
  └ 29 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-eff
  ect-mitigation.md
  └ 28 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/04-full-context
  -ceiling-evaluation.md
  └ 26 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  └ 189 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts
  └ 587 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts
  └ 444 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts
  └ 411 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts
  └ 336 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts
  └ 316 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts
  └ 580 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md
  └ 152 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/README.md
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts lines 521-900
  └ 54 lines read

● Grep "eval-db\.vitest\.ts|eval-metrics\.vitest\.ts|shadow-scoring\.vitest\.ts|scoring\.vitest\.ts"
 (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md)
  └ 12 lines found

● Grep "eval-db\.ts|eval-metrics\.ts|shadow-scoring\.ts|eval-ceiling\.ts"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md)
  └ 9 lines found

● Grep "shadow-scoring\.vitest\.ts" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md)
  └ No matches found

● Grep "eval-ceiling\.ts" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md)
  └ 1 line found

● Todo completed: audit-feature-catalog

---
FEATURE: 01-evaluation-database-and-schema.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 1

BUG: EVAL-001  
FILE: mcp_server/lib/eval/eval-db.ts:119-141  
SEVERITY: P1-IMPORTANT  
TYPE: RESOURCE  
DESCRIPTION: Re-initializing the eval DB with a different directory/path replaces the singleton reference without closing the previous SQLite handle, which can leak file descriptors/locks.  
EVIDENCE:  
```ts
if (evalDb && evalDbPath === dbPath) {
  return evalDb;
}
...
const db = new Database(dbPath);
...
evalDb = db;
evalDbPath = dbPath;
```  
SUGGESTED_FIX: Before assigning a new `evalDb` when `evalDb` exists and `evalDbPath !== dbPath`, call `evalDb.close()` (with explicit error handling/logging) to release old resources.

README_COVERAGE:
- mcp_server/lib/eval/eval-db.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/tests/eval-db.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 02-core-metric-computation.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 3

BUG: EVAL-002  
FILE: mcp_server/lib/eval/eval-metrics.ts:191-198  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: `computeRecall` double-counts duplicate memory IDs in results; recall can exceed 1.0 if the same relevant item appears multiple times in top-K.  
EVIDENCE:  
```ts
let hits = 0;
for (const r of topResults) {
  if (relevantIds.has(r.memoryId)) hits++;
}
return hits / relevantIds.size;
```  
SUGGESTED_FIX: Deduplicate retrieved relevant IDs before counting (`Set<number>`), or clamp to `Math.min(1, hits / relevantIds.size)` after dedup.

BUG: EVAL-003  
FILE: mcp_server/lib/eval/eval-metrics.ts:233-239  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: `computeF1` inherits duplicate-hit inflation; recall can exceed 1 and F1 can become >1, violating metric bounds.  
EVIDENCE:  
```ts
const hits = topResults.filter(r => relevantIds.has(r.memoryId)).length;
const p = topResults.length === 0 ? 0 : hits / k;
const r = hits / relevantIds.size;
return 2 * (p * r) / (p + r);
```  
SUGGESTED_FIX: Count unique relevant hits (set intersection), then compute bounded P/R (and clamp final F1 to [0,1] as a safety guard).

BUG: EVAL-004  
FILE: mcp_server/lib/eval/eval-metrics.ts:469-471  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Future timestamps are treated as “recent” because negative age satisfies `ageMs <= cutoffMs`, which can inflate cold-start detection.  
EVIDENCE:  
```ts
const ageMs = now - ts.getTime();
if (ageMs <= cutoffMs) {
  recentRelevantIds.add(entry.memoryId);
}
```  
SUGGESTED_FIX: Require non-negative age: `if (ageMs >= 0 && ageMs <= cutoffMs)`.

README_COVERAGE:
- mcp_server/lib/eval/eval-metrics.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/tests/eval-metrics.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 03-observer-effect-mitigation.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 1

BUG: EVAL-001  
FILE: mcp_server/lib/eval/eval-db.ts:119-141  
SEVERITY: P1-IMPORTANT  
TYPE: RESOURCE  
DESCRIPTION: Re-initialization with a new path can leak the previous DB handle (same issue affecting this feature because it depends on `eval-db.ts`).  
EVIDENCE:  
```ts
if (evalDb && evalDbPath === dbPath) return evalDb;
const db = new Database(dbPath);
evalDb = db;
evalDbPath = dbPath;
```  
SUGGESTED_FIX: Close previous `evalDb` when switching paths before reassigning singleton state.

README_COVERAGE:
- mcp_server/lib/eval/eval-db.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/shadow-scoring.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/tests/eval-db.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/scoring.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/shadow-scoring.vitest.ts: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 04-full-context-ceiling-evaluation.md  
SOURCE_FILES_AUDITED: 3  
BUGS_FOUND: 3

BUG: EVAL-002  
FILE: mcp_server/lib/eval/eval-metrics.ts:191-198  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Duplicate relevant IDs in result lists can inflate recall above 1.  
EVIDENCE:  
```ts
if (relevantIds.has(r.memoryId)) hits++;
return hits / relevantIds.size;
```  
SUGGESTED_FIX: Deduplicate relevant hits prior to division.

BUG: EVAL-003  
FILE: mcp_server/lib/eval/eval-metrics.ts:233-239  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: F1 can exceed valid bounds due to duplicate counting and unbounded recall.  
EVIDENCE:  
```ts
const hits = topResults.filter(r => relevantIds.has(r.memoryId)).length;
const r = hits / relevantIds.size;
return 2 * (p * r) / (p + r);
```  
SUGGESTED_FIX: Use unique-hit counting and bound intermediate/final values to [0,1].

BUG: EVAL-004  
FILE: mcp_server/lib/eval/eval-metrics.ts:469-471  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Future-dated memories incorrectly qualify as recent cold-start candidates.  
EVIDENCE:  
```ts
const ageMs = now - ts.getTime();
if (ageMs <= cutoffMs) { ... }
```  
SUGGESTED_FIX: Exclude negative ages (`ageMs < 0`).

README_COVERAGE:
- mcp_server/lib/eval/eval-ceiling.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/eval-metrics.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/tests/eval-metrics.vitest.ts: LISTED in mcp_server/tests/README.md
---


Total usage est:        1 Premium request
API time spent:         1m 39s
Total session time:     1m 50s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           329.9k in, 5.7k out, 233.1k cached (Est. 1 Premium request)
