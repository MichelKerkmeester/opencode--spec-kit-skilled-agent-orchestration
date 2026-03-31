---
title: "Implementation Plan: Ground Truth ID [02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/plan]"
description: "Create map-ground-truth-ids.ts, a standalone TypeScript CLI that re-maps 297 stale relevance judgments in ground-truth.json to live memory IDs via FTS5 search on context-index.sqlite, restoring meaningful ablation study metrics."
trigger_phrases:
  - "ground truth id remapping plan"
  - "map-ground-truth-ids implementation"
  - "fts5 remapping script"
  - "ablation metrics fix implementation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Ground Truth ID Remapping

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ES2022, Node 20+) |
| **Framework** | Standalone CLI script, no framework |
| **Storage** | Read: `context-index.sqlite` (better-sqlite3); Write: `ground-truth.json` (in-place) |
| **Testing** | Manual execution + ablation study result verification |

### Overview

The script `map-ground-truth-ids.ts` opens the live SQLite memory database in read-only mode and, for each of the 110 queries in `ground-truth.json`, executes a two-pass FTS5 search against the `memory_fts` table using the query's `expectedResultDescription` as the search string. The top 1-3 ranked memories are assigned graded relevance (3/2/1) and written back to `ground-truth.json`, replacing the stale ID-based relevance array with live mappings. The script is designed to run idempotently and safely: it writes to a temp file before renaming atomically, and it prints a summary report to stdout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear: ablation metrics are all-zero due to stale IDs
- [x] Success criteria measurable: ablation Recall@K > 0 after remapping
- [x] Dependencies identified: better-sqlite3 confirmed in package.json; database confirmed at `mcp_server/database/context-index.sqlite`
- [x] FTS5 table `memory_fts` confirmed present in live database
- [x] Live database confirmed: 411 parent memories, IDs 266–25784

### Definition of Done

- [ ] `map-ground-truth-ids.ts` created and executes without TypeScript errors
- [ ] `ground-truth.json` updated with at least 80% of queries mapped to valid live IDs
- [ ] Ablation study (`eval_run_ablation`) returns at least one non-zero metric
- [ ] Summary report output matches actual query/match counts
- [ ] Spec, plan, tasks, checklist all updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Standalone CLI script — no server, no framework, no long-running process.

### Key Components

- **CLI Entry Point**: Parses `--db-path` and `--gt-path` flags; resolves defaults relative to `__dirname`
- **DatabaseAdapter**: Opens `context-index.sqlite` via `better-sqlite3` in read-only mode; prepares FTS5 MATCH statement
- **QueryMapper**: Iterates the 110 queries, skips hard-negatives, runs two-pass FTS5 search (phrase → keyword fallback), assigns graded relevance
- **RelevanceBuilder**: Constructs the new `relevances` array with `{ queryId, memoryId, relevance }` entries
- **AtomicWriter**: Serializes updated JSON to a temp file, then `fs.renameSync` to the final path
- **SummaryReporter**: Prints matched/unmatched counts, grade distribution, and any unmatched query IDs to stdout

### Data Flow

```
ground-truth.json (read)
    ↓ extract expectedResultDescription for each query
QueryMapper
    ↓ FTS5 MATCH against memory_fts (context-index.sqlite, read-only)
    ↓ top 3 results → grades 3, 2, 1
RelevanceBuilder
    ↓ construct new relevances[]
AtomicWriter
    ↓ write to /tmp/ground-truth.json.tmp → rename to ground-truth.json
SummaryReporter → stdout
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Script Scaffolding

- [ ] Create `mcp_server/scripts/map-ground-truth-ids.ts` with shebang and module boilerplate
- [ ] Import `better-sqlite3`, `fs`, `path` — no new dependencies required
- [ ] Parse CLI flags: `--db-path` (default: `../database/context-index.sqlite`), `--gt-path` (default: `../lib/eval/data/ground-truth.json`), `--dry-run` (optional preview mode)
- [ ] Resolve and validate both paths exist before proceeding; exit with clear error if missing

### Phase 2: Core Remapping Logic

- [ ] Load and parse `ground-truth.json`; extract queries and existing relevances
- [ ] Open SQLite in read-only mode: `new Database(dbPath, { readonly: true })`
- [ ] Prepare FTS5 statement: `SELECT m.id, m.title FROM memory_fts f JOIN memory_index m ON m.id = f.rowid WHERE memory_fts MATCH ? ORDER BY rank LIMIT 3`
- [ ] Implement `mapQuery(query)`: strip FTS5 special chars, run phrase search; if 0 results, tokenize description and run keyword search
- [ ] Assign grades: result[0] → 3, result[1] → 2, result[2] → 1; skip hard-negative queries entirely
- [ ] Build new `relevances` array; preserve `queries` array unchanged

### Phase 3: Output and Verification

- [ ] Write updated JSON atomically (temp file + rename); skip rename if `--dry-run`
- [ ] Print summary report: total non-hard-negative queries, matched count, unmatched count, grade distribution (count of 3s/2s/1s), list of unmatched query IDs
- [ ] Run `npx tsx mcp_server/scripts/map-ground-truth-ids.ts` end-to-end; confirm exit 0
- [ ] Verify ablation study returns non-zero Recall@K by running `eval_run_ablation` with `storeResults: false`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual: script execution | Full run against live database; check exit code and summary output | `npx tsx` |
| Manual: JSON integrity | Verify output JSON parses and `queries` array is unchanged | `node -e "JSON.parse(require('fs').readFileSync(...))"` |
| Manual: ablation metrics | Run `eval_run_ablation` after remapping; confirm Recall@K > 0 | MCP `eval_run_ablation` tool |
| Manual: dry-run mode | Confirm `--dry-run` prints output without modifying `ground-truth.json` | `npx tsx ... --dry-run` + file mtime check |
| Manual: hard-negative guard | Confirm no relevance entries generated for `category: "hard_negative"` queries | Inspect output JSON `relevances` array |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` | Internal (npm) | Green — in `package.json` | Cannot open SQLite; use `node:sqlite` fallback (Node 22+) |
| `context-index.sqlite` | Internal (file) | Green — confirmed at `mcp_server/database/` | No memories to map; script exits with clear error |
| `ground-truth.json` | Internal (file) | Green — 110 queries, 297 relevances confirmed | Nothing to remap; script exits cleanly |
| `memory_fts` FTS5 table | Internal (DB table) | Green — confirmed in schema | FTS5 search fails; fall back to LIKE-based title search |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Updated `ground-truth.json` produces worse ablation results than expected, or file is corrupted
- **Procedure**: Restore `ground-truth.json` from git history: `git checkout HEAD -- .opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Scaffolding) ──► Phase 2 (Core Logic) ──► Phase 3 (Output & Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scaffolding | None | Core Logic |
| Core Logic | Scaffolding (file + DB open working) | Output & Verify |
| Output & Verify | Core Logic (relevances array populated) | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scaffolding | Low | 30–45 minutes |
| Core Remapping Logic | Medium | 1–2 hours |
| Output & Verification | Low | 30–45 minutes |
| **Total** | | **2–3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Original `ground-truth.json` committed to git (current state preserved in history)
- [ ] `--dry-run` mode tested and confirmed to not modify the file
- [ ] Backup copy at `mcp_server/lib/eval/data/ground-truth.json.bak` (optional, created by script if `--backup` flag used)

### Rollback Procedure

1. Immediately: `git checkout HEAD -- .opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json`
2. Verify restored file: `python3 -c "import json; d=json.load(open('ground-truth.json')); print(len(d['relevances']), 'relevances')"`
3. Re-run ablation to confirm metrics revert to zero (confirming original stale state restored)
4. Investigate FTS5 mismatch and re-run script with adjusted search logic

### Data Reversal

- **Has data migrations?** No — only `ground-truth.json` is modified; no schema changes
- **Reversal procedure**: `git checkout HEAD -- <path-to-ground-truth.json>`
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
