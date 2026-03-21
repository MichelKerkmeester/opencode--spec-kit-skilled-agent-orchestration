---
title: "Feature Specification: manual-testing-per-playbook ux-hooks phase [template:level_1/spec.md]"
description: "Phase 018 documents the UX-hooks manual test packet for the Spec Kit Memory system. It breaks five UX-hooks scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "ux hooks manual testing"
  - "phase 018 ux hooks"
  - "mutation feedback hooks testing"
  - "checkpoint confirmName manual tests"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook ux-hooks phase

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
| **Predecessor Phase** | `017-governance` |
| **Successor Phase** | `019-feature-flag-reference` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual UX-hooks scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated UX-hooks packet, Phase 018 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single UX-hooks-focused specification that maps all five Phase 018 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| 103 | UX hook module coverage (`mutation-feedback`, `response-hints`) | [`../../feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md`](../../feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md) | `Validate 103 hook module behavior for mutation feedback and response hints. Capture the evidence needed to prove Test output shows suite pass (6 tests), including latency/cache-clear booleans, errors field verification, error propagation hints, and finalized hint payload assertions. Return a concise user-facing pass/fail verdict with the main reason.` | `1) npx vitest run tests/hooks-ux-feedback.vitest.ts` |
| 104 | Mutation save-path UX parity and no-op hardening | [`../../feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md`](../../feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md) | `Run save-path UX scenarios and verify duplicate-save and unchanged-save no-op behavior, FSRS corruption guard, plus atomic-save parity. Capture the evidence needed to prove Suite passes and assertions show no false postMutationHooks on duplicate or unchanged saves, cache-left-unchanged messaging, FSRS fields not reset on no-op saves, and parity between standard and atomic save responses. Return a concise user-facing pass/fail verdict with the main reason.` | `1) npx vitest run tests/memory-save-ux-regressions.vitest.ts 2) inspect assertions covering duplicate-content and unchanged-content save no-op responses 3) inspect assertions verifying FSRS fields (review_count, last_review) are not reset on no-op saves 4) inspect assertions covering atomic-save postMutationHooks, hints, and partial-indexing guidance parity` |
| 105 | Context-server success-envelope finalization | [`../../feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md`](../../feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md) | `Validate the finalized context-server success-envelope path, including token metadata recomputation.` | `1) npx vitest run tests/context-server.vitest.ts 2) inspect assertions covering appended success hints 3) inspect assertions covering preserved autoSurfacedContext 4) inspect assertions covering final token metadata after hint append and before budget enforcement` |
| 106 | Hooks barrel + README synchronization | [`../../feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md`](../../feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md) | `Validate hook barrel and README coverage for the finalized UX-hook surface.` | `1) rg "mutation-feedback\|response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts 2) rg "mutation-feedback\|response-hints\|MutationHookResult\|postMutationHooks" .opencode/skill/system-spec-kit/mcp_server/hooks/README.md` |
| 107 | Checkpoint confirmName and schema enforcement | [`../../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md`](../../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md) | `Validate checkpoint delete confirmName enforcement across handler and schema layers. Capture the evidence needed to prove Validation and handler suites pass with missing-confirmName rejection plus successful delete confirmation reporting, and context-server Group 13b structural tests pass. Return a concise user-facing pass/fail verdict with the main reason.` | `1) npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts 2) npx vitest run tests/context-server.vitest.ts (Group 13b: T103–T106 structural source-code pattern verification) 3) inspect rejection assertions for missing confirmName 4) inspect success assertions for safetyConfirmationUsed=true` |

### Out of Scope
- Executing the five UX-hooks scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-UX-hooks phases from other phase folders within `014-manual-testing-per-playbook/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 018 UX-hooks requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 018 UX-hooks execution plan and review workflow |
| `tasks.md` | Create | Phase 018 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 018 verification checklist for QA validation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document 103 UX hook module coverage with its exact playbook prompt, vitest command, evidence target, and feature link. | PASS if `tests/hooks-ux-feedback.vitest.ts` passes all 6 tests with no failing assertions covering latency/cache-clear booleans, `errors: string[]` field in mutation feedback data, error propagation hint verification, and finalized hint payload |
| REQ-002 | Document 104 mutation save-path UX parity and no-op hardening with its exact prompt, multi-assertion command sequence, evidence target, and feature link. | PASS if both duplicate and unchanged no-ops suppress false hook metadata, FSRS fields are preserved, and atomic-save responses match the primary save contract |
| REQ-003 | Document 105 context-server success-envelope finalization with its exact prompt, four-step vitest sequence, evidence target, and feature link. | PASS if `tests/context-server.vitest.ts` passes and assertions cover the final success-envelope path end to end |
| REQ-004 | Document 106 hooks barrel and README synchronization with its exact prompt, ripgrep command sequence, evidence target, and feature link. | PASS if both files reference the new modules and contract fields |
| REQ-005 | Document 107 checkpoint confirmName and schema enforcement with its exact prompt, three-suite vitest sequence plus context-server Group 13b, evidence target, and feature link. | PASS if the three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end |

No P1 items are defined for this phase; all five UX-hooks scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 UX-hooks tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for 103, 104, 105, 106, and 107 will be collected.
- **SC-003**: Reviewers can audit every Phase 018 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | Playbook review protocol (embedded in playbook §4) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/18--ux-hooks/`](../../feature_catalog/18--ux-hooks/) | Supplies feature context for each UX-hooks scenario | Keep every test row linked to its mapped UX-hooks feature file |
| Dependency | MCP runtime and vitest test suite for hook and save-path tests | Required to execute 103, 104, 105, and 107 scenarios | Confirm vitest suite is compiled and test files exist before execution |
| Dependency | `ripgrep` (`rg`) CLI tool available in runtime environment | Required to execute 106 barrel and README checks | Verify `rg` is installed; fall back to `grep -r` if absent |
| Risk | 107 involves validating rejection of missing `confirmName` which could mask false positives if schema enforcement is incomplete | High | Run all three suites (handler, tool-input-schema, mcp-input-validation) plus context-server Group 13b together; do not accept partial suite pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should 106 `rg` commands target the repository root or a specific `mcp_server/hooks/` path for consistent cross-machine results?
- Is there a vitest alias or npm script that wraps the three-suite 107 run, or must all three files be listed explicitly each time?
<!-- /ANCHOR:questions -->

---
