---
title: "Feature Specification: manual-testing-per-playbook discovery phase [template:level_1/spec.md]"
description: "Phase 003 documents the discovery manual test packet for the Spec Kit Memory system. It breaks three discovery scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "discovery manual testing"
  - "phase 003 discovery"
  - "spec kit memory discovery tests"
  - "hybrid rag fusion discovery playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook discovery phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual discovery scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated discovery packet, Phase 003 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single discovery-focused specification that maps all three Phase 003 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| EX-011 | Folder inventory audit | [`../../feature_catalog/03--discovery/01-memory-browser-memorylist.md`](../../feature_catalog/03--discovery/01-memory-browser-memorylist.md) | `List memories in target spec folder` | `memory_list(specFolder,limit,offset)` |
| EX-012 | System baseline snapshot | [`../../feature_catalog/03--discovery/02-system-statistics-memorystats.md`](../../feature_catalog/03--discovery/02-system-statistics-memorystats.md) | `Return stats with composite ranking` | `memory_stats(folderRanking:composite,includeScores:true)` |
| EX-013 | Index/FTS integrity check | [`../../feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md`](../../feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md) | `Run full health and divergent_aliases` | `memory_health(reportMode:full)` -> `memory_health(reportMode:divergent_aliases)` |

### Out of Scope
- Executing the three discovery scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-discovery phases from `001-retrieval/` through `002-mutation/` and `004-maintenance/` onward.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 003 discovery requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 003 discovery execution plan and review workflow |
| `tasks.md` | Create | Phase 003 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 003 Level 2 verification checklist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document EX-011 folder inventory audit with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if browsable inventory returned with paginated list and totals |
| REQ-002 | Document EX-012 system baseline snapshot with its exact stats prompt, composite-ranking command sequence, evidence target, and feature link. | PASS if dashboard fields populated including counts, tiers, and folder ranking |
| REQ-003 | Document EX-013 index/FTS integrity check with its exact health prompt, full-then-divergent-aliases command sequence, evidence target, and feature link. | PASS if report completes with healthy/degraded status and actionable diagnostics |

No P1 items are defined for this phase; all three discovery scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 discovery tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for EX-011, EX-012, and EX-013 will be collected.
- **SC-003**: Reviewers can audit every Phase 003 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) and review protocol (`../../manual_testing_playbook/review_protocol.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/03--discovery/`](../../feature_catalog/03--discovery/) | Supplies feature context for each discovery scenario | Keep every test row linked to its mapped discovery feature file |
| Dependency | MCP runtime plus indexed memory corpus | Required to execute `memory_list`, `memory_stats`, and `memory_health` scenarios safely | Run tests against a stable indexed corpus; avoid corpus mutations during discovery-phase execution |
| Risk | EX-013 `autoRepair: true` can modify index state if triggered accidentally | Medium | Do not pass `autoRepair: true` or `confirmed: true` during read-only verification runs; rely on the read-only `full` and `divergent_aliases` modes only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which spec folder path should be used as the canonical target for EX-011 to produce a representative paginated inventory without polluting production data?
- Should EX-013 divergent-aliases run be executed against a corpus that is known to have alias conflicts, or is the diagnostic output from a clean corpus sufficient as evidence?
<!-- /ANCHOR:questions -->

---
