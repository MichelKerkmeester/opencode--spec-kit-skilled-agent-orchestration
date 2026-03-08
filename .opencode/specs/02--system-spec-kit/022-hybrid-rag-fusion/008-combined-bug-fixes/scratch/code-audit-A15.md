● Extract source file paths from feature catalog markdown files
  $ python - <<'PY'
  import re, pathlib, json
  base=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement')
  files=[...
  └ 38 lines...

● Extract source file paths from feature markdown using python3
  $ python3 - <<'PY'
  import re, pathlib
  base=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement')
  files=[...
  └ 80 lines...

● Glob "**/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server
  └ 41 files found

● List unique source files referenced by features
  $ python3 - <<'PY'
  import re, pathlib
  base=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  feature_dir=base/'feature_catalog/09--evaluation-and-measurement'...
  └ 42 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts
  └ 222 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  └ 189 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts
  └ 587 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts
  └ 78 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts
  └ 251 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts
  └ 444 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts
  └ 243 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md
  └ 152 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts
  └ 316 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts
  └ 336 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts lines 520-900
  └ 236 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts lines 520-900
  └ 140 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts lines 261-520

  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts lines 261-620
  └ 360 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts lines 1-280
  └ 280 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/channel.vitest.ts
  └ 41 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/README.md
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts lines 520-900

  └ 214 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts lines 520-900
  └ 55 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts lines 620-980
  └ 83 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts lines 280-700
  └ 421 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts
  └ 580 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts
  └ 448 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md
  └ 367 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/README.md lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/README.md lines 261-620
  └ 360 lines read

● Check if each source file is listed in its directory README
  $ python3 - <<'PY'
  import re, pathlib, json
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  feature_dir=root/'feature_catalog/09--evaluation-and-measurement'...
  └ 70 lines...

---
FEATURE: 09-scoring-observability.md  
SOURCE_FILES_AUDITED: 3  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/telemetry/scoring-observability.ts: LISTED in mcp_server/lib/telemetry/README.md
- mcp_server/tests/scoring-observability.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/scoring.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 10-full-reporting-and-ablation-study-framework.md  
SOURCE_FILES_AUDITED: 10  
BUGS_FOUND: 4

BUG: F10-B1  
FILE: mcp_server/lib/eval/eval-metrics.ts:191-197  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: `computeRecall` double-counts duplicate retrieved memory IDs, so recall can exceed 1.0 when the same relevant ID appears multiple times in top-K.  
EVIDENCE:
```ts
let hits = 0;
for (const r of topResults) {
  if (relevantIds.has(r.memoryId)) hits++;
}
return hits / relevantIds.size;
```  
SUGGESTED_FIX: Deduplicate hit IDs before counting (e.g., `const hitIds = new Set(topResults.filter(...).map(...))`) and divide by `relevantIds.size`.

BUG: F10-B2  
FILE: mcp_server/lib/eval/eval-metrics.ts:425-432  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: `computeImportanceWeightedRecall` sums weight for each row in top-K without deduping memory IDs, so duplicate result IDs can inflate weighted recall and incorrectly clamp to 1.  
EVIDENCE:
```ts
for (const r of topResults) {
  const entry = gtMap.get(r.memoryId);
  if (entry && entry.relevance > 0) {
    hitWeight += getWeight(entry);
  }
}
return Math.min(1, hitWeight / totalWeight);
```  
SUGGESTED_FIX: Track seen memory IDs in a `Set<number>` before adding weight.

BUG: F10-B3  
FILE: mcp_server/lib/eval/eval-metrics.ts:469-471  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Future timestamps are treated as cold-start because negative age passes `ageMs <= cutoffMs`, producing false positives.  
EVIDENCE:
```ts
const ageMs = now - ts.getTime();
if (ageMs <= cutoffMs) {
  recentRelevantIds.add(entry.memoryId);
}
```  
SUGGESTED_FIX: Require `ageMs >= 0 && ageMs <= cutoffMs` (or clamp negative age to 0 by explicit policy).

BUG: F10-B4  
FILE: mcp_server/lib/eval/reporting-dashboard.ts:226-240  
SEVERITY: P2-MINOR  
TYPE: LOGIC  
DESCRIPTION: Channel rows are globally truncated with `LIMIT` but no deterministic ordering, causing non-reproducible and potentially incomplete channel aggregates on larger datasets.  
EVIDENCE:
```ts
let sql = `SELECT eval_run_id, channel, hit_count, latency_ms, query_id
           FROM eval_channel_results
           WHERE eval_run_id IN (...)`;
...
sql += ` LIMIT ${DASHBOARD_ROW_LIMIT}`;
```  
SUGGESTED_FIX: Add `ORDER BY created_at DESC` (or by eval_run_id/query_id), and/or paginate per run to avoid arbitrary truncation.

README_COVERAGE:
- mcp_server/lib/eval/ablation-framework.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/eval-db.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/eval-metrics.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/ground-truth-data.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/reporting-dashboard.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/tests/ablation-framework.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/eval-db.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/eval-metrics.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/ground-truth.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/reporting-dashboard.vitest.ts: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 11-shadow-scoring-and-channel-attribution.md  
SOURCE_FILES_AUDITED: 7  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/eval/channel-attribution.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/eval-db.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/shadow-scoring.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/tests/channel.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/eval-db.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/scoring.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/shadow-scoring.vitest.ts: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 12-test-quality-improvements.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- (no source files listed)
---

---
FEATURE: 13-evaluation-and-housekeeping-fixes.md  
SOURCE_FILES_AUDITED: 6  
BUGS_FOUND: 2

BUG: F13-B1  
FILE: mcp_server/lib/eval/eval-logger.ts:54-56  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Eval run counter is initialized only from `eval_channel_results`, so restarts can reuse older IDs when that table is sparse while other eval tables contain newer run IDs.  
EVIDENCE:
```ts
const row = db.prepare(
  'SELECT MAX(eval_run_id) as maxId FROM eval_channel_results'
).get();
if (row?.maxId && row.maxId > _evalRunCounter) {
  _evalRunCounter = row.maxId;
}
```  
SUGGESTED_FIX: Initialize from max across all relevant tables (`eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_metric_snapshots`) via a union/`MAX`.

BUG: F13-B2  
FILE: mcp_server/lib/eval/reporting-dashboard.ts:226-240  
SEVERITY: P2-MINOR  
TYPE: LOGIC  
DESCRIPTION: Channel aggregation query applies a hard LIMIT without ordering, which can return arbitrary subsets and distort per-channel averages/hit counts.  
EVIDENCE:
```ts
sql += ` LIMIT ${DASHBOARD_ROW_LIMIT}`;
return db.prepare(sql).all(...params) as ChannelResultRow[];
```  
SUGGESTED_FIX: Add deterministic `ORDER BY` and pagination strategy aligned to requested runs.

README_COVERAGE:
- mcp_server/lib/eval/eval-db.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/eval-logger.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/lib/eval/reporting-dashboard.ts: LISTED in mcp_server/lib/eval/README.md
- mcp_server/tests/eval-db.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/eval-logger.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/reporting-dashboard.vitest.ts: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 14-cross-ai-validation-fixes.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- (no source files listed)
---


Total usage est:        1 Premium request
API time spent:         2m 24s
Total session time:     2m 40s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           599.0k in, 8.9k out, 445.3k cached (Est. 1 Premium request)
