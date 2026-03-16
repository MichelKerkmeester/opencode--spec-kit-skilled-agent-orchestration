---
title: "Feature Specification: manual-testing-per-playbook maintenance phase [template:level_1/spec.md]"
description: "Phase 004 documents the maintenance manual test packet for the Spec Kit Memory system. It isolates two maintenance scenarios — incremental index scan and startup runtime compatibility guards — so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "maintenance manual testing"
  - "phase 004 maintenance"
  - "memory index scan testing"
  - "startup compatibility guard testing"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook maintenance phase

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
Manual maintenance scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated maintenance packet, Phase 004 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single maintenance-focused specification that maps both Phase 004 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| EX-014 | Incremental sync run | [`../../feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md`](../../feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md) | `Run index scan for changed docs` | `memory_index_scan(force:false)` -> `memory_stats()` |
| EX-035 | Startup diagnostics verification | [`../../feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md`](../../feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md) | `Run the dedicated startup guard validation suite` | `cd .opencode/skill/system-spec-kit/mcp_server` -> `npm test -- --run tests/startup-checks.vitest.ts` |

### Out of Scope
- Executing the two maintenance scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-maintenance phases from `001-retrieval/` through `019-feature-flag-reference/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 004 maintenance requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 004 maintenance execution plan and review workflow |
| `tasks.md` | Create | Phase 004 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 004 verification checklist for documentation and evidence quality |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document EX-014 incremental sync run with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if changed files reflected in scan summary and updated index state after `memory_index_scan(force:false)` -> `memory_stats()` |
| REQ-002 | Document EX-035 startup diagnostics verification with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if `startup-checks.vitest.ts` completes with all tests passing covering runtime mismatch, marker creation, and SQLite diagnostics |

No P1 items are defined for this phase; both maintenance scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both maintenance tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for EX-014 and EX-035 will be collected.
- **SC-003**: Reviewers can audit every Phase 004 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) and review protocol (`../../manual_testing_playbook/review_protocol.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/04--maintenance/`](../../feature_catalog/04--maintenance/) | Supplies feature context for each maintenance scenario | Keep every test row linked to its mapped maintenance feature file |
| Dependency | MCP runtime for `memory_index_scan` and `memory_stats` | Required to execute EX-014 incremental scan scenario | Run against a sandbox with known changed files; preserve the sandbox state for stat comparison |
| Dependency | Node.js runtime and `npm test` build toolchain | Required to execute EX-035 startup guard validation suite in `mcp_server/` | Confirm Node version, install dependencies, and run from the correct working directory |
| Risk | EX-014 incremental scan can modify the live index if run outside a sandbox | Medium | Restrict scan execution to a dedicated sandbox spec folder and verify stats delta before and after |
| Risk | EX-035 test run mutates the `.node-version-marker` file if the runtime has changed | Low | Run on a stable CI-like environment; restore the original marker if it changes unexpectedly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which sandbox spec folder should Phase 004 reviewers target for the EX-014 incremental scan so that the changed-file count remains deterministic across runs?
- Should EX-035 be executed against the project's current Node version, or should reviewers also simulate a version mismatch to test the warning path?
<!-- /ANCHOR:questions -->

---
