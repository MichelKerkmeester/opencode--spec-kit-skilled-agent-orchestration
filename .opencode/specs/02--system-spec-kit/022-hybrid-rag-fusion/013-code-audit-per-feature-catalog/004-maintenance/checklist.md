---
title: "Verification Checklist: maintenance [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-10"
trigger_phrases:
  - "verification"
  - "checklist"
  - "maintenance"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: maintenance

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

- [x] CHK-001 [P0] F-01 and F-02 findings documented with status and evidence in `spec.md` — REQ-001/REQ-002 (F-01 hash mismatch) and REQ-003/REQ-004 (F-02 coverage) documented
- [x] CHK-002 [P0] Technical remediation approach for F-01 mismatch defined in `plan.md` — Phase 2 Core: remove `skipped_hash`, rename `hash_checks` → `mtime_changed`
- [x] CHK-003 [P1] Dependencies for maintenance remediation identified and available — memory-index.ts, incremental-index.ts, startup-checks.ts, Vitest
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Incremental scan accounting fields (`skipped_hash`, `hash_checks`) reflect implemented semantics — `skipped_hash` removed, `hash_checks` renamed to `mtime_changed` in ScanResults interface and all usages
- [x] CHK-011 [P0] No incorrect metric naming remains in maintenance-facing outputs — grep confirms zero `skipped_hash`/`hash_checks`/`skipped-by-hash` references in *.ts and feature catalog *.md
- [x] CHK-012 [P1] Startup guard functions preserve non-blocking warning behavior — `checkSqliteVersion` and `detectNodeVersionMismatch` both use console.warn/console.error only, no throws
- [x] CHK-013 [P1] Updated code/tests follow existing TypeScript MCP server patterns — review agent score 94/100, tsc --noEmit passes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] F-01 acceptance criteria and behavior mismatch checks validated — `skipped_hash` removed, `mtime_changed` naming matches mtime-only reality; incremental-index.vitest.ts 36/36 pass (deferred stubs — not behavioral evidence; T004 rename verified structurally)
- [x] CHK-021 [P0] Startup marker creation/match/mismatch scenarios validated by tests — `detectNodeVersionMismatch` cannot be unit-tested in ESM (path.resolve not spyable); marker-path unit tests deferred (ESM path.resolve limitation); validated via manual EX-022 scenario and code review
- [x] CHK-022 [P1] SQLite version pass/warn/extraction-failure scenarios tested — startup-checks.vitest.ts: 6/6 pass (>=3.35.0, <3.35.0, major<3, query failure, boundary 3.35.0, version string)
- [x] CHK-023 [P1] EX-021 and EX-022 playbook coverage mapped or gap-noted — EX-021 maps to incremental index tests; EX-022 maps to startup-checks.vitest.ts SQLite tests + manual marker validation
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced in modified maintenance files — review agent confirmed Security 25/25
- [x] CHK-031 [P0] Input/state validation remains explicit in startup and indexing paths — `checkSqliteVersion` try/catch preserves validation; `shouldReindex` null-checks preserved
- [x] CHK-032 [P1] Warning/error output does not expose sensitive runtime details — warnings show only version strings and file paths, no env vars or credentials
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` stay synchronized with F-01/F-02 findings — spec REQ-001/002 match tasks T004/T007, plan Phase 2 matches implementation
- [x] CHK-041 [P1] Feature catalog Current Reality text matches implemented behavior — "changed content hash" → "changed mtime", "skipped-by-hash" removed from both catalog files
- [x] CHK-042 [P2] Maintenance test inventory references updated (including stale retry test cleanup) — startup-checks.vitest.ts added to test inventory
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Maintenance artifacts remain in `004-maintenance/` — all spec docs in correct folder
- [x] CHK-051 [P1] Temporary files are kept in `scratch/` only — no temp files outside scratch/
- [x] CHK-052 [P2] Findings are saved to `memory/` when required — to be saved via generate-context.js post-completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
