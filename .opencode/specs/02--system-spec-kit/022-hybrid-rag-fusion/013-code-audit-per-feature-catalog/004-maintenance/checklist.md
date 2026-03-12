---
title: "Verification Checklist: maintenance [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-12"
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
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

## P0

Blocking maintenance checks are tagged inline below and include explicit evidence markers.

## P1

Required maintenance checks are tagged inline below and include explicit evidence markers.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] F-01 and F-02 findings documented with status and evidence in `spec.md` — REQ-001/REQ-002 (F-01 hash mismatch) and REQ-003/REQ-004 (F-02 coverage) documented [EVIDENCE: spec.md requirements + acceptance scenarios updated]
- [x] CHK-002 [P0] Technical remediation approach for F-01 mismatch defined in `plan.md` — Phase 2 Core: remove `skipped_hash`, rename `hash_checks` → `mtime_changed` [EVIDENCE: plan.md Phase 2 + testing strategy]
- [x] CHK-003 [P1] Dependencies for maintenance remediation identified and available — memory-index.ts, incremental-index.ts, startup-checks.ts, Vitest [EVIDENCE: plan.md dependencies table + targeted verification runs]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Incremental scan accounting fields (`skipped_hash`, `hash_checks`) reflect implemented semantics — `skipped_hash` removed, `hash_checks` renamed to `mtime_changed` in ScanResults interface and all usages [EVIDENCE: maintenance code/doc audit + current catalog wording]
- [x] CHK-011 [P0] No incorrect metric naming remains in maintenance-facing outputs — grep confirms zero `skipped_hash`/`hash_checks`/`skipped-by-hash` references in *.ts and feature catalog *.md [EVIDENCE: repo grep on maintenance code and docs]
- [x] CHK-012 [P1] Startup guard functions preserve non-blocking behavior — warning paths use `console.warn`, informational paths use `console.log`, and the guards never throw [EVIDENCE: startup-checks.ts + startup-checks.vitest.ts]
- [x] CHK-013 [P1] Updated code/tests follow existing TypeScript MCP server patterns — review agent score 94/100, tsc --noEmit passes [EVIDENCE: `npx tsc --noEmit` passed]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] F-01 acceptance criteria and behavior mismatch checks validated — `skipped_hash` removed, `mtime_changed` naming matches mtime-only reality; behavioral evidence is `incremental-index-v2.vitest.ts` (primary suite). Legacy `incremental-index.vitest.ts` remains placeholder/deferred and is not behavioral evidence. [EVIDENCE: `npm test -- --run tests/incremental-index.vitest.ts tests/incremental-index-v2.vitest.ts` -> 43 passed, 36 skipped]
- [x] CHK-021 [P0] Startup runtime compatibility logic validated by automated tests — dedicated `startup-checks.vitest.ts` covers marker creation/match/mismatch, runtime mismatch detection, and SQLite validation, and the manual mapping now uses EX-035 instead of incorrect EX-021/EX-022 references. [EVIDENCE: `npm test -- --run tests/startup-checks.vitest.ts` + EX-035 playbook entry]
- [x] CHK-022 [P1] SQLite version pass/warn/extraction-failure scenarios tested — startup-checks.vitest.ts: 14/14 pass (match, mismatch, marker creation, >=3.35.0, <3.35.0, major<3, malformed version, query failure, non-Error throwable, boundary 3.35.0, exact version string) [EVIDENCE: targeted Vitest run output]
- [x] CHK-023 [P1] Manual playbook coverage mapped or gap-noted — F-01 maps to EX-014 (`memory_index_scan`); F-02 (startup runtime compatibility guards) maps to EX-035 and is no longer gap-noted or mis-mapped to EX-021/EX-022 [EVIDENCE: manual_testing_playbook.md existing-features table + cross-reference index]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced in modified maintenance files — review agent confirmed Security 25/25 [EVIDENCE: review findings closed with no secret exposure]
- [x] CHK-031 [P0] Input/state validation remains explicit in startup and indexing paths — `checkSqliteVersion` try/catch preserves validation; `shouldReindex` null-checks preserved [EVIDENCE: startup-checks.ts + incremental indexing behavior unchanged]
- [x] CHK-032 [P1] Warning/error output does not expose sensitive runtime details — warnings show only version strings and file paths, no env vars or credentials [EVIDENCE: startup-checks.ts warning messages reviewed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` stay synchronized with F-01/F-02 findings — spec REQ-001/002 match tasks T004/T007, plan Phase 2 matches implementation [EVIDENCE: cross-doc review after EX-035 remap]
- [x] CHK-041 [P1] Feature catalog Current Reality text matches implemented behavior — "changed content hash" → "changed mtime", "skipped-by-hash" removed from both catalog files [EVIDENCE: maintenance feature catalog files updated]
- [x] CHK-042 [P2] Maintenance test inventory references updated (including stale retry test cleanup) — `incremental-index-v2.vitest.ts` and `startup-checks.vitest.ts` treated as behavioral suites; legacy `incremental-index.vitest.ts` kept as deferred placeholder only
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Maintenance artifacts remain in `004-maintenance/` — all spec docs in correct folder [EVIDENCE: spec folder layout verified]
- [x] CHK-051 [P1] Temporary files are kept in `scratch/` only — no temp files outside scratch/ [EVIDENCE: no repo temp artifacts created]
- [x] CHK-052 [P2] Findings are saved to `memory/` when required — `memory/12-03-26_17-06__maintenance.md` + `memory/metadata.json` created via `generate-context.js`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-12
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
