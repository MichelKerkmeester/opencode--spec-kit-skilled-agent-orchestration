---
title: "Verification Checklist: Ground Truth ID Remapping"
description: "Quality gates for map-ground-truth-ids.ts and the updated ground-truth.json, ensuring stale memory IDs are replaced with valid live IDs and ablation metrics are non-zero."
trigger_phrases:
  - "ground truth remapping checklist"
  - "map-ground-truth-ids verification"
  - "ablation fix quality gates"
importance_tier: "important"
contextType: "verification"
---
# Verification Checklist: Ground Truth ID Remapping

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-010 all present with acceptance criteria [E:spec.md]
- [ ] CHK-002 [P0] Technical approach defined in plan.md — FTS5 two-pass search strategy and atomic write procedure documented [E:plan.md]
- [ ] CHK-003 [P0] Live database confirmed accessible: `node -e "require('better-sqlite3')('mcp_server/database/context-index.sqlite',{readonly:true}).close()"` exits 0 [E:manual verification]
- [ ] CHK-004 [P1] `memory_fts` FTS5 table confirmed present in `context-index.sqlite` schema [E:manual schema check]
- [ ] CHK-005 [P1] Hard-negative query IDs identified and documented (expected: ~8-10 queries with `category: "hard_negative"`) [E:ground-truth.json inspection]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `map-ground-truth-ids.ts` compiles without TypeScript errors: `npx tsc --noEmit` from `mcp_server/` [E:tsc output]
- [ ] CHK-011 [P0] No unhandled promise rejections or synchronous exceptions on successful run (exit code 0) [E:script stdout/stderr]
- [ ] CHK-012 [P0] Individual query FTS failures are caught and logged to stderr; script continues to next query rather than aborting [E:error handling test]
- [ ] CHK-013 [P1] `sanitizeFtsQuery()` handles FTS5 special characters: `AND`, `OR`, `NOT`, `NEAR`, `"`, `*`, `(`, `)` — verified by manual inspection of function [E:code review]
- [ ] CHK-014 [P1] Database opened in read-only mode (`{ readonly: true }`) — confirmed no writes to `context-index.sqlite` [E:code review + file mtime check]
- [ ] CHK-015 [P1] Two-pass FTS5 search implemented: phrase pass → keyword fallback if 0 results [E:code review]
- [ ] CHK-016 [P2] Code follows project TypeScript patterns (strict types, no `any`, named functions) — consistent with `reindex-embeddings.ts` style [E:code review]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Dry-run mode: `npx tsx mcp_server/scripts/map-ground-truth-ids.ts --dry-run` prints summary and exits 0 without modifying `ground-truth.json` (verify file mtime unchanged) [E:dry-run output + mtime check]
- [ ] CHK-021 [P0] Live run: `npx tsx mcp_server/scripts/map-ground-truth-ids.ts` completes with exit 0; summary shows total=110, matched ≥88 (80%), unmatched ≤22 [E:script summary output]
- [ ] CHK-022 [P0] All `memoryId` values in updated `ground-truth.json` are within live DB range 266–25784: `node -e "const d=require('./ground-truth.json'); const ids=d.relevances.map(r=>r.memoryId); console.log(Math.min(...ids), Math.max(...ids))"` [E:node verification command]
- [ ] CHK-023 [P0] Ablation study returns non-zero metric: `eval_run_ablation({storeResults:false})` shows Recall@K > 0 for at least one channel [E:ablation tool output]
- [ ] CHK-024 [P1] Hard-negative queries produce zero relevance entries: count of `relevances` entries for hard_negative query IDs is 0 [E:JSON inspection]
- [ ] CHK-025 [P1] Relevance grades are in valid range (0-3 only): `node -e "const d=require('./ground-truth.json'); const invalid=d.relevances.filter(r=>![0,1,2,3].includes(r.relevance)); console.log(invalid.length)"` returns 0 [E:node verification command]
- [ ] CHK-026 [P1] `queries` array is unchanged after remapping (same 110 entries, same IDs and fields): compare query IDs before and after script run [E:diff or manual check]
- [ ] CHK-027 [P2] `--db-path` and `--gt-path` flags work with absolute paths: run with explicit paths pointing to the same files [E:manual test]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded file paths outside `__dirname`-relative defaults; all paths resolved from CLI flags or relative to script location [E:code review]
- [ ] CHK-031 [P0] No external network calls — confirmed by code review (only `fs`, `path`, `better-sqlite3`) [E:code review + import audit]
- [ ] CHK-032 [P1] Script output is scoped to `--gt-path` target only; no writes to any other file except the temp file in `/tmp/` during atomic write [E:code review + strace/fs event check]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Script header comment documents: purpose, usage example, `--db-path`/`--gt-path`/`--dry-run` flags, and note to re-run after DB migrations [E:map-ground-truth-ids.ts header]
- [ ] CHK-041 [P1] `ground-truth-generator.ts` line 101 comment remains accurate (it already references this script; confirm the description matches actual implementation) [E:ground-truth-generator.ts]
- [ ] CHK-042 [P1] spec.md, plan.md, tasks.md reflect actual implementation (no drift from what was built) [E:post-implementation review]
- [ ] CHK-043 [P2] `implementation-summary.md` created after completion with actual ablation metrics before and after remapping [E:implementation-summary.md]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] New script placed at `mcp_server/scripts/map-ground-truth-ids.ts` — consistent with existing `mcp_server/scripts/reindex-embeddings.ts` location [E:file path verification]
- [ ] CHK-051 [P1] No temp files left in `mcp_server/scripts/` or project root after script completes (temp file in `/tmp/` is cleaned up or script handles cleanup) [E:directory listing]
- [ ] CHK-052 [P2] Context saved to `memory/` after completion using `generate-context.js` [E:memory save confirmation]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 4 | 0/4 |

**Verification Date**: —
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
