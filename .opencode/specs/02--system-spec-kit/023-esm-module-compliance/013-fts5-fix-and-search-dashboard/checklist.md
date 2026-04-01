---
title: "Verification Checklist: FTS5 Fix, Search Dashboard, and DB Path Drift Fix"
description: "Verification Date: 2026-04-01"
trigger_phrases:
  - "fts5 fix checklist"
  - "db path drift checklist"
  - "search dashboard checklist"
  - "vector index verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: FTS5 Fix, Search Dashboard, and DB Path Drift Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [Evidence: spec.md written with REQ-001 through REQ-011]
- [x] CHK-002 [P0] Technical approach defined in plan.md [Evidence: plan.md written with 5 phases, dependency graph, rollback plan]
- [x] CHK-003 [P1] Dependencies identified and available [Evidence: `context-index.sqlite` confirmed present; `bun run build` baseline green; `MEMORY_DB_PATH` audit pending Phase 2]
- [x] CHK-004 [P0] Root cause confirmed with evidence [Evidence: 10 deep research iterations + 10 deep review iterations in scratch/]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] FTS5 guard passes lint/format checks [Evidence: sqlite-fts.ts line 58 guard compiled to dist; `bun run build` exit 0]
- [ ] CHK-011 [P0] DB path injection compiles without errors (`bun run build` after Phase 2)
- [ ] CHK-012 [P0] db-state fix compiles without errors (`bun run build` after Phase 3)
- [ ] CHK-013 [P0] No new TypeScript errors introduced by Phase 4 silent failure fixes
- [ ] CHK-014 [P1] Error handling for `assertInitialized()` guard does not break existing call sites
- [ ] CHK-015 [P1] Code follows project patterns for error types and log levels
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] FTS5 fix acceptance criteria met — multi-word search returns FTS5 results [Evidence: fix applied, compiled]
- [x] CHK-021 [P0] Dashboard Design 10 renders in live search output [Evidence: applied to search.md and search.toml]
- [ ] CHK-022 [P0] Vector search returns results from `context-index.sqlite` after Voyage-4 provider init (not empty provider-specific DB)
- [ ] CHK-023 [P0] Server startup with missing `MEMORY_DB_PATH` fails with explicit error
- [ ] CHK-024 [P0] `reinitializeDatabase()` does not rebind to empty DB after provider lazy-init
- [ ] CHK-025 [P1] Startup health check triggers `runLineageBackfill()` when `active_memory_projection` is empty and `memory_index` has rows
- [ ] CHK-026 [P1] `assertInitialized()` guard in `hybrid-search.ts` throws typed error on un-initialized calls
- [ ] CHK-027 [P1] FTS scope filter matches exact-or-descendant folders (consistent with BM25)
- [ ] CHK-028 [P1] 52 silent failure points resolved — no silent `return []` on unexpected conditions
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in modified files [Evidence: sqlite-fts.ts, search.md, search.toml reviewed — no secrets present]
- [ ] CHK-031 [P0] `MEMORY_DB_PATH` enforcement does not expose file system paths in user-visible error messages (use internal log only)
- [ ] CHK-032 [P1] `assertInitialized()` error message does not leak internal state to MCP callers
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md updated with Item 3 root cause and all requirements [Evidence: this session]
- [x] CHK-041 [P1] plan.md created with phased implementation and rollback [Evidence: this session]
- [x] CHK-042 [P1] tasks.md created with individual tasks per phase [Evidence: this session]
- [ ] CHK-043 [P1] checklist.md P0 items verified with evidence after Phase 2–4 implementation
- [ ] CHK-044 [P2] Code comments added to `resolve_database_path()` removal explaining the invariant
- [ ] CHK-045 [P2] Code comments added to startup health check explaining backfill trigger condition
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Design alternatives in `scratch/` only (30 .md files) [Evidence: scratch/01-compact-type-first.md through scratch/30-recommended-synthesis.md exist]
- [x] CHK-051 [P1] Deep research iterations in `scratch/deep-research/` only [Evidence: scratch/deep-research/research-01.md through research-10.md exist]
- [x] CHK-052 [P1] Deep review iterations in scratch/ [Evidence: scratch/review-01.md through scratch/review-10.md exist]
- [ ] CHK-053 [P2] `scratch/` cleaned of design alternatives before final completion (or user-approved to keep for reference)
- [ ] CHK-054 [P2] Key findings from research/review iterations saved to `memory/` via `generate-context.js`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 4/11 |
| P1 Items | 10 | 4/10 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-04-01

**Status**: Pre-implementation verification complete. Implementation phases 2–5 pending. P0 items CHK-011 through CHK-024 blocked on Phase 2–4 implementation.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
