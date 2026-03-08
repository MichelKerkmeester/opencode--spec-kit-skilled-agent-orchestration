● SQL: Create audit todos
  └ 4 row(s) inserted. Last inserted row ID: 4.

● Extract source file paths from feature files
  $ python - <<'PY'
  import re, json
  from pathlib import Path
  base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')...
  └ 28 lines...

● SQL: Update todo status after failed attempt
  └ 1 row(s) updated.

● Extract source file paths from feature files
  $ python3 - <<'PY'
  import re, json
  from pathlib import Path
  base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')...
  └ 35 lines...

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normaliza
  tion.md
  └ 52 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-nove
  lty-boost.md
  └ 54 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-sc
  oring.md
  └ 30 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-
  based-decay.md
  └ 57 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/05-folder-level-re
  levance-scoring.md
  └ 41 lines read

● Read
  .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/06-embedding-cache.md
  └ 29 lines read

● Todo started: extract-sources

● Parse implementation source files per feature
  $ python3 - <<'PY'
  import re, json
  from pathlib import Path
  base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')...
  └ 287 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts
  └ 7 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
  └ 231 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts
  └ 271 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
  └ 270 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts
  └ 222 lines read

● Read .opencode/skill/system-spec-kit/shared/normalization.ts
  └ 246 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts
  └ 359 lines read

● Read .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts
  └ 352 lines read

● Read .opencode/skill/system-spec-kit/shared/types.ts
  └ 507 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
  └ 389 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts
  └ 236 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
  └ 223 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 521-780
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 781-1100
  └ 33 lines read

● Todo started: check-readme-coverage

● Check directory README listing for source files
  $ python3 - <<'PY'
  import re, json
  from pathlib import Path
  root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 273 lines...

● Todo started: deliver-report

---
FEATURE: 01-score-normalization.md  
SOURCE_FILES_AUDITED: 9  
BUGS_FOUND: 3

BUG: SC-001  
FILE: mcp_server/lib/scoring/composite-scoring.ts:20,256-258,569-574  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: The module claims camelCase fallbacks are accepted, but tier selection in multiple paths only reads `importance_tier`; camelCase `importanceTier` inputs are silently treated as `'normal'`, skewing retrievability/importance scoring.  
EVIDENCE:  
- `ScoringInput` comment: “Accepts ... camelCase fallbacks...” (line 16-18)  
- `const tier = ... row.importance_tier ... : 'normal';` (line 256-258)  
- `const tier = row.importance_tier || 'normal';` (line 569, 713)  
SUGGESTED_FIX: Normalize tier access via a helper (e.g., `getTier(row)`) that checks both `importance_tier` and `importanceTier`, then reuse it everywhere.

BUG: SC-002  
FILE: mcp_server/lib/scoring/composite-scoring.ts:505-507  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Document-type multiplier only reads `document_type`; camelCase `documentType` rows are treated as `'memory'`, causing incorrect ranking.  
EVIDENCE: `const docType = (row.document_type as string) || 'memory';` then multiplier lookup.  
SUGGESTED_FIX: Use a normalized accessor (`row.document_type ?? row.documentType ?? 'memory'`) before multiplier lookup.

BUG: SC-003  
FILE: mcp_server/lib/storage/access-tracker.ts:51-62,81-99  
SEVERITY: P1-IMPORTANT  
TYPE: RESOURCE  
DESCRIPTION: `trackAccess` caps accumulator growth, but `trackMultipleAccesses` has no equivalent guard; high-cardinality bulk tracking can grow `accumulators` unbounded until process pressure.  
EVIDENCE:  
- Guard exists only in `trackAccess`: `if (accumulators.size > MAX_ACCUMULATOR_SIZE) ...`  
- `trackMultipleAccesses` updates map without any size check.  
SUGGESTED_FIX: Apply the same cap/flush logic at start of `trackMultipleAccesses` (or refactor both through shared guarded updater).

README_COVERAGE:
- mcp_server/lib/scoring/composite-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/folder-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/importance-tiers.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/interference-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/storage/access-tracker.ts: LISTED in mcp_server/lib/storage/README.md
- mcp_server/lib/telemetry/scoring-observability.ts: LISTED in mcp_server/lib/telemetry/README.md
- shared/normalization.ts: LISTED in shared/README.md
- shared/scoring/folder-scoring.ts: LISTED in shared/scoring/README.md
- shared/types.ts: LISTED in shared/README.md
---

---
FEATURE: 02-cold-start-novelty-boost.md  
SOURCE_FILES_AUDITED: 9  
BUGS_FOUND: 3

BUG: SC-001  
FILE: mcp_server/lib/scoring/composite-scoring.ts:20,256-258,569-574  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: CamelCase tier fallback is not consistently honored, causing `importanceTier` inputs to be scored as default `normal`.  
EVIDENCE: Same tier-only `importance_tier` reads in retrievability and composite paths.  
SUGGESTED_FIX: Centralize tier normalization and consume it in all scoring functions.

BUG: SC-002  
FILE: mcp_server/lib/scoring/composite-scoring.ts:505-507  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: `documentType` (camelCase) is ignored when applying doc-type multiplier, producing incorrect final scores for normalized objects.  
EVIDENCE: `const docType = (row.document_type as string) || 'memory';`  
SUGGESTED_FIX: Read both naming conventions before defaulting.

BUG: SC-003  
FILE: mcp_server/lib/storage/access-tracker.ts:51-62,81-99  
SEVERITY: P1-IMPORTANT  
TYPE: RESOURCE  
DESCRIPTION: Bulk tracking path lacks map size guard and can accumulate unbounded state.  
EVIDENCE: No `MAX_ACCUMULATOR_SIZE` protection in `trackMultipleAccesses`.  
SUGGESTED_FIX: Add shared bounded-accumulator guard to both single and batch paths.

README_COVERAGE:
- mcp_server/lib/scoring/composite-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/folder-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/importance-tiers.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/interference-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/storage/access-tracker.ts: LISTED in mcp_server/lib/storage/README.md
- mcp_server/lib/telemetry/scoring-observability.ts: LISTED in mcp_server/lib/telemetry/README.md
- shared/normalization.ts: LISTED in shared/README.md
- shared/scoring/folder-scoring.ts: LISTED in shared/scoring/README.md
- shared/types.ts: LISTED in shared/README.md
---

---
FEATURE: 03-interference-scoring.md  
SOURCE_FILES_AUDITED: 1  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/scoring/interference-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
---

---
FEATURE: 04-classification-based-decay.md  
SOURCE_FILES_AUDITED: 11  
BUGS_FOUND: 4

BUG: SC-001  
FILE: mcp_server/lib/scoring/composite-scoring.ts:20,256-258,569-574  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: CamelCase tier fallback is incomplete; scoring paths default to `normal` if only `importanceTier` is present.  
EVIDENCE: Tier reads use `importance_tier` only in key scoring functions.  
SUGGESTED_FIX: Use a single normalized tier accessor for all factor calculations.

BUG: SC-002  
FILE: mcp_server/lib/scoring/composite-scoring.ts:505-507  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Document-type multiplier ignores camelCase `documentType`, reducing intended boosts for normalized rows.  
EVIDENCE: Uses `row.document_type` only.  
SUGGESTED_FIX: Accept both `document_type` and `documentType`.

BUG: SC-003  
FILE: mcp_server/lib/storage/access-tracker.ts:51-62,81-99  
SEVERITY: P1-IMPORTANT  
TYPE: RESOURCE  
DESCRIPTION: `trackMultipleAccesses` can grow accumulator map without bound under high-cardinality batch input.  
EVIDENCE: Size cap logic exists only in `trackAccess`.  
SUGGESTED_FIX: Add equivalent size cap/flush logic in batch path.

BUG: SC-004  
FILE: mcp_server/lib/cognitive/fsrs-scheduler.ts:95-113,133-145,192-199  
SEVERITY: P1-IMPORTANT  
TYPE: TYPE_SAFETY  
DESCRIPTION: `processReview` accepts any numeric grade without validation; invalid grades fall into conflicting defaults (`updateDifficulty` treats as EASY while `updateStability` uses non-EASY branch), yielding inconsistent state updates.  
EVIDENCE:  
- `processReview(params, grade: number)` has no range guard.  
- `updateDifficulty` final `else` => EASY behavior.  
- `updateStability` ternary defaults non-1/3/4 grades to 0.8 factor.  
SUGGESTED_FIX: Validate/clamp grade to `{1,2,3,4}` at entry and reject or normalize invalid values before both update functions.

README_COVERAGE:
- mcp_server/lib/cognitive/attention-decay.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/cognitive/fsrs-scheduler.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/scoring/composite-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/folder-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/importance-tiers.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/interference-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/storage/access-tracker.ts: LISTED in mcp_server/lib/storage/README.md
- mcp_server/lib/telemetry/scoring-observability.ts: LISTED in mcp_server/lib/telemetry/README.md
- shared/normalization.ts: LISTED in shared/README.md
- shared/scoring/folder-scoring.ts: LISTED in shared/scoring/README.md
- shared/types.ts: LISTED in shared/README.md
---

---
FEATURE: 05-folder-level-relevance-scoring.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/scoring/folder-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/search/folder-relevance.ts: LISTED in mcp_server/lib/search/README.md
- shared/normalization.ts: LISTED in shared/README.md
- shared/scoring/folder-scoring.ts: LISTED in shared/scoring/README.md
- shared/types.ts: LISTED in shared/README.md
---

---
FEATURE: 06-embedding-cache.md  
SOURCE_FILES_AUDITED: 1  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/cache/embedding-cache.ts: LISTED in mcp_server/lib/cache/README.md
---


Total usage est:        1 Premium request
API time spent:         2m 45s
Total session time:     3m 0s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           514.7k in, 9.2k out, 404.1k cached (Est. 1 Premium request)
