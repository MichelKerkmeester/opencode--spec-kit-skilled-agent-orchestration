---
title: "Verification Checklist: manual-testing-per-playbook [template:level_2/checklist.md]"
description: "Verification checklist for manual testing across 19 playbook phases"
trigger_phrases:
  - "manual testing checklist"
  - "playbook verification"
  - "umbrella checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook

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

- [ ] CHK-001 [P0] Parent spec.md exists and documents the exact-ID coverage model
- [ ] CHK-002 [P0] Parent plan.md exists and describes the execution approach
- [ ] CHK-003 [P0] Parent tasks.md exists with task breakdown
- [ ] CHK-004 [P0] All 19 phase directories exist (001-retrieval through 019-feature-flag-reference)
- [ ] CHK-005 [P1] Manual testing playbook resolves at the expected relative path
- [ ] CHK-006 [P1] Each phase directory contains spec.md and plan.md documenting test scenarios
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-040 [P0] Recursive validate.sh --recursive run on 014-manual-testing-per-playbook with 0 errors
- [ ] CHK-041 [P0] No scenario IDs missing from phase ownership (zero orphans)
- [ ] CHK-042 [P0] No duplicate scenario ID assignments across phases (zero duplicates)
- [ ] CHK-043 [P1] Parent spec.md, plan.md, tasks.md synchronized with execution results
- [ ] CHK-044 [P1] Implementation-summary.md completed with actual execution data
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### Phase 001-019 Execution Status

- [ ] CHK-010 [P0] Phase 001 (retrieval) — all assigned scenarios executed and verdicted
- [ ] CHK-011 [P0] Phase 002 (mutation) — all assigned scenarios executed and verdicted
- [ ] CHK-012 [P0] Phase 003 (discovery) — all assigned scenarios executed and verdicted
- [ ] CHK-013 [P0] Phase 004 (maintenance) — all assigned scenarios executed and verdicted
- [ ] CHK-014 [P0] Phase 005 (lifecycle) — all assigned scenarios executed and verdicted
- [ ] CHK-015 [P0] Phase 006 (analysis) — all assigned scenarios executed and verdicted
- [ ] CHK-016 [P0] Phase 007 (evaluation) — all assigned scenarios executed and verdicted
- [ ] CHK-017 [P0] Phase 008 (bug-fixes-and-data-integrity) — all assigned scenarios executed and verdicted
- [ ] CHK-018 [P0] Phase 009 (evaluation-and-measurement) — all assigned scenarios executed and verdicted
- [ ] CHK-019 [P0] Phase 010 (graph-signal-activation) — all assigned scenarios executed and verdicted
- [ ] CHK-020 [P0] Phase 011 (scoring-and-calibration) — all assigned scenarios executed and verdicted
- [ ] CHK-021 [P0] Phase 012 (query-intelligence) — all assigned scenarios executed and verdicted
- [ ] CHK-022 [P0] Phase 013 (memory-quality-and-indexing) — all assigned scenarios executed and verdicted
- [ ] CHK-023 [P0] Phase 014 (pipeline-architecture) — all assigned scenarios executed and verdicted
- [ ] CHK-024 [P0] Phase 015 (retrieval-enhancements) — all assigned scenarios executed and verdicted
- [ ] CHK-025 [P0] Phase 016 (tooling-and-scripts) — all assigned scenarios executed and verdicted
- [ ] CHK-026 [P0] Phase 017 (governance) — all assigned scenarios executed and verdicted
- [ ] CHK-027 [P0] Phase 018 (ux-hooks) — all assigned scenarios executed and verdicted
- [ ] CHK-028 [P0] Phase 019 (feature-flag-reference) — all assigned scenarios executed and verdicted

### Result Aggregation

- [ ] CHK-030 [P0] All scenario verdicts collected across 19 phases with zero skipped
- [ ] CHK-031 [P0] FAIL verdicts root-caused and either fixed or documented
- [ ] CHK-032 [P1] PARTIAL verdicts categorized with clear reasons (environment, data, config)
- [ ] CHK-033 [P1] Per-phase execution evidence captured in scratch/ directories
- [ ] CHK-034 [P2] Aggregate pass/partial/fail counts reconciled against total scenario inventory
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] No secrets or credentials introduced during testing
- [ ] CHK-051 [P1] Scope limited to documentation and test execution within this spec folder
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] All phase spec.md files document scenario IDs, prompts, and pass/fail criteria
- [ ] CHK-061 [P1] Phase plan.md files document execution pipelines
- [ ] CHK-062 [P2] Findings saved to memory/ if significant discoveries made
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Temporary files confined to scratch/ directories only
- [ ] CHK-071 [P1] scratch/ directories cleaned before final completion claim
- [ ] CHK-072 [P2] description.json valid and up to date in root and phase folders
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 0/27 |
| P1 Items | 11 | 0/11 |
| P2 Items | 3 | 0/3 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Umbrella verification for 19-phase manual testing
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
