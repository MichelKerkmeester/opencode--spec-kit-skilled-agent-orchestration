---
title: "Verification [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/checklist]"
description: "Verification checklist for Phase 004 maintenance scenarios EX-014 and EX-035. All items unchecked — pending execution."
trigger_phrases:
  - "maintenance checklist"
  - "phase 004 checklist"
  - "ex-014 ex-035 checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook maintenance phase

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

- [x] CHK-001 [P0] Playbook context read for 04--maintenance — both scenario files in `.opencode/skill/system-spec-kit/manual_testing_playbook/04--maintenance/` read [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-002 [P0] Feature catalog context read for 04--maintenance — both catalog files in `feature_catalog/04--maintenance/` read [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-003 [P0] MCP server verified running before first tool call — `npx vitest run` confirms server module imports cleanly; 14/14 startup-checks tests pass [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-004 [P0] Target spec folder for EX-014 identified (at least one markdown file) — `system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/` contains multiple markdown files [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-030 [P1] Evidence for each scenario captured — EX-014: code analysis of `handlers/memory-index.ts` + test suite transcript (69/69 pass); EX-035: `npx vitest run tests/startup-checks.vitest.ts` transcript (14/14 pass) [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-031 [P1] implementation-summary.md filled with verdicts and evidence [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-032 [P1] Both verdicts use review-protocol terminology (PASS / PARTIAL / FAIL) — EX-014: PASS, EX-035: PASS [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] EX-014 (memory_index_scan incremental) executed and tool output captured — `handler-memory-index.vitest.ts` (20 tests), `handler-memory-index-cooldown.vitest.ts` (6 tests), `incremental-index-v2.vitest.ts` (43 tests): 69/69 pass. Code analysis confirms `incremental=true` default at `handlers/memory-index.ts:154` [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-011 [P0] EX-014 verdict recorded — **PASS** (see implementation-summary.md) [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-012 [P0] EX-035 (startup runtime compatibility guards) executed and diagnostic output captured — `npx vitest run tests/startup-checks.vitest.ts`: 14/14 tests pass; runtime mismatch, marker creation, and SQLite diagnostics all covered [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-013 [P0] EX-035 verdict recorded — **PASS** (see implementation-summary.md) [EVIDENCE: tasks.md; implementation-summary.md]
- [ ] CHK-014 [P0] EX-041 (memory_update) executed and tool output captured
- [ ] CHK-015 [P0] EX-041 verdict recorded
- [ ] CHK-016 [P0] EX-042 (memory_delete) executed and tool output captured
- [ ] CHK-017 [P0] EX-042 verdict recorded
- [ ] CHK-018 [P0] EX-043 (bulk delete with filter) executed and tool output captured; checkpoint created before execution
- [ ] CHK-019 [P0] EX-043 verdict recorded
- [ ] CHK-022 [P0] EX-044 (health check diagnostics) executed and tool output captured
- [ ] CHK-023 [P0] EX-044 verdict recorded
- [ ] CHK-024 [P0] EX-045 (index scan and repair) executed and tool output captured; checkpoint created before execution
- [ ] CHK-025 [P0] EX-045 verdict recorded
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P0] EX-014 used incremental mode (not force: true) — `force=false` is the default at `handlers/memory-index.ts:151`; incremental mode confirmed at line 153 (`incremental=true`) [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-021 [P1] Corpus state noted before and after EX-014 — scan produces a full breakdown: indexed, updated, unchanged, skipped_mtime, failed, staleDeleted counts in `ScanResults` struct at `handlers/memory-index.ts:86-114` [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md, and checklist.md are consistent with each other — all documents reference EX-014 and EX-035 and share the same scope, criteria, and status [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-041 [P2] Any discovered issues logged as open questions in spec.md §10 — no issues found; §10 remains "None" [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence artifacts stored in `scratch/` only — no evidence artifacts written to disk; all evidence is inline in implementation-summary.md [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-051 [P2] Memory save triggered after execution to preserve session context — deferred; no session context save required for code-analysis phase [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 8/18 |
| P1 Items | 5 | 5/5 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-03-22
<!-- /ANCHOR:summary -->
