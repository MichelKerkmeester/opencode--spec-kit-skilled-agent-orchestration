---
title: "Tasks: Ground Truth ID Remapping [system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/tasks]"
description: "Task breakdown for creating map-ground-truth-ids.ts and updating ground-truth.json with live memory IDs to restore non-zero ablation study metrics."
trigger_phrases:
  - "ground truth remapping tasks"
  - "map-ground-truth-ids tasks"
  - "ablation fix task list"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Ground Truth ID Remapping

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `better-sqlite3` is importable in script context — run `node -e "require('better-sqlite3')"` from `mcp_server/` (`mcp_server/package.json`)
- [ ] T002 Verify `memory_fts` FTS5 table exists and is queryable in `context-index.sqlite` — run a test MATCH query via `node -e` (`mcp_server/database/context-index.sqlite`)
- [ ] T003 [P] Confirm `ground-truth.json` structure: validate 110 queries and `expectedResultDescription` present on all non-hard-negative entries (`mcp_server/lib/eval/data/ground-truth.json`)
- [ ] T004 [P] Identify all hard-negative query IDs (category `"hard_negative"`) so they can be skipped during mapping — document count in implementation notes (`mcp_server/lib/eval/data/ground-truth.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create `mcp_server/scripts/map-ground-truth-ids.ts` with CLI entry point: parse `--db-path`, `--gt-path`, `--dry-run` flags; resolve defaults relative to `__dirname` (`mcp_server/scripts/map-ground-truth-ids.ts`)
- [ ] T006 Implement `openDatabase(dbPath)`: open `context-index.sqlite` via `better-sqlite3` in read-only mode; throw with clear message if file not found (`mcp_server/scripts/map-ground-truth-ids.ts`)
- [ ] T007 Implement `sanitizeFtsQuery(text)`: strip FTS5 reserved tokens (`AND`, `OR`, `NOT`, `NEAR`, `"`, `*`, `(`, `)`) and truncate to 200 characters (`mcp_server/scripts/map-ground-truth-ids.ts`)
- [ ] T008 Implement two-pass FTS5 search `searchMemories(db, description)`: pass 1 — full phrase search with `MATCH ?` and `LIMIT 3`; pass 2 — if 0 results, join top 3-5 individual keywords and retry (`mcp_server/scripts/map-ground-truth-ids.ts`)
- [ ] T009 Implement `mapQuery(db, query)`: call `searchMemories`; for each result assign grade 3/2/1 in rank order; return empty array for hard-negative queries (`mcp_server/scripts/map-ground-truth-ids.ts`)
- [ ] T010 Implement `buildRelevances(db, queries)`: iterate all 110 queries, call `mapQuery`, accumulate into `GroundTruthRelevance[]` array (`mcp_server/scripts/map-ground-truth-ids.ts`)
- [ ] T011 Implement atomic write: serialize updated JSON to `/tmp/ground-truth-remap-<timestamp>.json`, then `fs.renameSync` to `--gt-path` target; skip rename if `--dry-run` (`mcp_server/scripts/map-ground-truth-ids.ts`)
- [ ] T012 Add error handling: wrap individual query FTS errors in try/catch, log to stderr, continue; wrap file I/O errors with exit code 1 (`mcp_server/scripts/map-ground-truth-ids.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run `npx tsx mcp_server/scripts/map-ground-truth-ids.ts --dry-run`; confirm script prints summary without modifying `ground-truth.json` (verify file mtime unchanged) (`mcp_server/scripts/map-ground-truth-ids.ts`)
- [ ] T014 Run `npx tsx mcp_server/scripts/map-ground-truth-ids.ts` (live run); confirm exit 0, summary shows 80%+ queries matched, no IDs outside range 266–25784 (`mcp_server/lib/eval/data/ground-truth.json`)
- [ ] T015 Verify updated `ground-truth.json` validity: `node -e "const d=require('./ground-truth.json'); console.log(d.queries.length, d.relevances.length)"` — must show 110 queries (`mcp_server/lib/eval/data/ground-truth.json`)
- [ ] T016 Run ablation study via `eval_run_ablation` with `storeResults: false`; confirm at least one channel returns Recall@K > 0 (MCP tool call)
- [ ] T017 [P] Update `implementation-summary.md` with actual metrics from T016 ablation run and any remapping statistics (to be created post-implementation)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T001–T016 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `ground-truth.json` contains only memory IDs in range 266–25784
- [ ] Ablation study returns Recall@K > 0 for at least one channel
- [ ] `map-ground-truth-ids.ts` compiles without TypeScript errors (`npx tsc --noEmit`)
- [ ] Summary report from script matches actual DB statistics
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` — requirements REQ-001 through REQ-010, success criteria SC-001 through SC-005
- **Plan**: See `plan.md` — architecture, phase dependencies, FTS5 two-pass search strategy
- **Checklist**: See `checklist.md` — P0/P1/P2 verification items
- **Ground Truth Data**: `mcp_server/lib/eval/data/ground-truth.json` — 110 queries, relevances to be updated
- **Generator Module**: `mcp_server/lib/eval/ground-truth-generator.ts` line 101 — references this script
- **Data Types**: `mcp_server/lib/eval/ground-truth-data.ts` — `GroundTruthQuery`, `GroundTruthRelevance` interfaces
- **Live Database**: `mcp_server/database/context-index.sqlite` — 411 parent memories, IDs 266–25784
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
