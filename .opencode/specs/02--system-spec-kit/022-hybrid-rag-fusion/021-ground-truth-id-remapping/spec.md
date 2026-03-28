---
title: "Feature Specification: Ground Truth ID Remapping"
description: "The ablation study produces all-zero retrieval metrics because ground-truth.json references stale memory IDs from a prior DB snapshot. This spec covers creating the missing map-ground-truth-ids.ts script that re-maps 297 relevance judgments to live memory IDs via FTS5 search."
trigger_phrases:
  - "ground truth id remapping"
  - "ablation study zero metrics"
  - "map-ground-truth-ids"
  - "stale memory IDs"
  - "ground-truth.json relevance"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Ground Truth ID Remapping

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-27 |
| **Branch** | `021-ground-truth-id-remapping` |
| **Parent Spec** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The ablation study (`eval_run_ablation`) produces all-zero retrieval metrics — Recall, MRR, Precision, NDCG, MAP, and Hit Rate are all 0.0 — because `ground-truth.json` references memory IDs (e.g., 32599, 22351, 22303, 7518, 7285) from a prior database snapshot. The current live database contains 411 parent memories with IDs in the range 266–25784; none of the stale IDs exist. The script referenced in code comments — `scripts/map-ground-truth-ids.ts` (cited in `ground-truth-generator.ts` line 101) — was never created.

### Purpose

Create `map-ground-truth-ids.ts` so that all 297 relevance judgments in `ground-truth.json` reference valid live memory IDs, enabling the ablation study to produce meaningful Recall/MRR/Precision deltas showing which retrieval channels (vector, bm25, fts5, graph, trigger) contribute to quality.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `mcp_server/scripts/map-ground-truth-ids.ts` — a standalone TypeScript CLI script
- Read each query's `expectedResultDescription` from `ground-truth.json`
- Open the live `database/context-index.sqlite` directly using `better-sqlite3`
- Run FTS5 search against the `memory_fts` table for each of the 110 queries
- Assign graded relevance scores: 3 (highly relevant, FTS rank top match), 2 (relevant, secondary match), 1 (partial match, lower-scoring result)
- Update the `relevances` array in `ground-truth.json` in-place with the new memory IDs
- Emit a summary report: queries matched, unmatched, confidence distribution, and any queries that fall back to -1 (no live match found)
- Preserve existing hard-negative queries (no relevances expected for `category: "hard_negative"`)

### Out of Scope

- Modifications to `eval_run_ablation` or the eval pipeline itself — the script only updates the data file
- Automatic re-running of the ablation study — that is a separate workflow
- Adding new queries to `ground-truth.json` — existing 110 queries are sufficient
- Vector embedding-based search for remapping — FTS5 is sufficient and avoids cold-start embedding load

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/scripts/map-ground-truth-ids.ts` | Create | New CLI script performing FTS5-based remapping |
| `mcp_server/lib/eval/data/ground-truth.json` | Modify | Update `relevances` array with live memory IDs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Script reads `ground-truth.json` and opens `context-index.sqlite` via `better-sqlite3` | Script runs without errors; both files load successfully |
| REQ-002 | FTS5 search executed for each of the 110 non-hard-negative queries using `expectedResultDescription` as the search string | All 110 queries processed; no unhandled exceptions |
| REQ-003 | Top matches assigned graded relevance: grade 3 for rank-1, grade 2 for rank-2, grade 1 for rank-3 | Relevance entries in output JSON use values 0-3 only |
| REQ-004 | Hard-negative queries (category `"hard_negative"`) receive no relevance entries | Zero relevance rows in output for all hard_negative queries |
| REQ-005 | Updated `ground-truth.json` written in-place; JSON structure preserved with identical `queries` array | File parses as valid JSON; `queries` array unchanged; `relevances` updated |
| REQ-006 | Summary report printed to stdout: total queries, matched count, unmatched count, ID distribution | Report visible in terminal after script completes |
| REQ-007 | Unmatched queries (FTS5 returns no results) produce no relevance entries and are listed in the summary as unmatched | No -1 sentinel values remain in the output file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Script accepts optional `--db-path` and `--gt-path` CLI flags to override default paths | Running with explicit paths works; defaults work without flags |
| REQ-009 | Multi-strategy FTS5 search: try exact phrase, then individual keywords if no results | Queries with unusual vocabulary still match at least one memory when semantically relevant |
| REQ-010 | Script is executable via `npx ts-node` or compiled `tsx` without requiring a project build step | Runs from repo root with `npx tsx mcp_server/scripts/map-ground-truth-ids.ts` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running the ablation study after executing the script produces at least one non-zero Recall@K value for at least one retrieval channel
- **SC-002**: At least 80% of the 110 non-hard-negative queries receive at least one relevance entry (grade 1-3) in the updated `ground-truth.json`
- **SC-003**: Script completes in under 30 seconds on the live database with 411 parent memories
- **SC-004**: The updated `ground-truth.json` is valid JSON and passes `loadGroundTruth()` in `ground-truth-generator.ts` without errors
- **SC-005**: No relevance entries with `memoryId` values outside the live database ID range (266–25784) remain in the output file
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `better-sqlite3` npm package | Script cannot open database | Already present in `package.json` dependencies; no install needed |
| Dependency | `context-index.sqlite` at `mcp_server/database/` | No live memories to match against | File confirmed to exist with 411 parent memories; use `--db-path` flag if path differs |
| Risk | FTS5 returns irrelevant matches for vague `expectedResultDescription` text | Low-quality relevance judgments inflate metrics | Grade only top 3 results; queries with low FTS rank scores are noted in summary |
| Risk | FTS5 returns no matches for highly specific technical queries | High unmatched rate leaves many queries without relevance | Implement two-pass search: phrase first, then keyword fallback |
| Risk | ground-truth.json is overwritten with corrupt JSON on script error | Loss of original 297 relevance judgments | Write to a temp file first, then rename atomically; keep original backed up |
| Risk | Memory IDs in live DB are renumbered in a future migration | Remapped IDs go stale again | Document re-run procedure in script header; add `--dry-run` flag to preview changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Script must process all 110 queries and complete within 30 seconds on a MacBook-class machine with SSD storage
- **NFR-P02**: FTS5 queries must not open the database in WAL mode with exclusive locks; use read-only mode for the database connection

### Security
- **NFR-S01**: Script must not write to any path outside the project directory; output must be scoped to `--gt-path` or the default `ground-truth.json` path
- **NFR-S02**: No external network calls — all operations are local filesystem + SQLite only

### Reliability
- **NFR-R01**: Script must exit with code 0 on success, non-zero on unrecoverable error (e.g., database not found, JSON parse failure)
- **NFR-R02**: Partial failures (individual query FTS error) must be caught and logged, not cause the entire script to abort; affected queries are listed in the summary
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `expectedResultDescription`: Script logs a warning and skips the query, listing it as unmatched in the summary
- Query description longer than 500 characters: Truncate to first 200 characters for the FTS5 search string to avoid query parse errors
- FTS5 special characters in description (e.g., `AND`, `OR`, `"`, `*`): Escape or strip special tokens before passing to FTS5 MATCH clause

### Error Scenarios
- Database file not found at default path: Script exits with clear error message listing the expected path and the `--db-path` flag
- `ground-truth.json` is malformed JSON: Script exits without writing, preserving the original file unchanged
- SQLite locked (another process has exclusive lock): Script retries once after 500ms, then exits with error

### State Transitions
- Script interrupted mid-write: Atomic write via temp file + rename prevents partial JSON corruption
- Re-running the script: Safe to run multiple times; output is idempotent given the same database state
- Database has been vacuumed / IDs resequenced since last run: Summary report shows ID distribution change; user must verify ablation results afterward
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 2 files changed; ~250 LOC; single system (SQLite + JSON) |
| Risk | 10/25 | File mutation risk (ground-truth.json); no auth/API; no breaking changes to existing code |
| Research | 8/20 | FTS5 MATCH syntax already understood; better-sqlite3 already used in project |
| **Total** | **32/70** | **Level 2 — verification checklist warranted due to data mutation** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the script also update `ground-truth-data.ts` by regenerating `GROUND_TRUTH_RELEVANCES`, or is modifying `ground-truth.json` sufficient (given that `ground-truth-data.ts` imports the JSON directly)?
- Is a `--dry-run` flag required before GA, or is the atomic write + backup sufficient safety?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
