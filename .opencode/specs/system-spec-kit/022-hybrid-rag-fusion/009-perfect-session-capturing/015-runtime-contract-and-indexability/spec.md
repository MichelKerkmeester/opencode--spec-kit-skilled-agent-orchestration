---
title: "Fea [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-runtime-contract-and-indexability/spec]"
description: "Implement explicit validation-rule metadata and write/index dispositions for the session-capturing pipeline."
trigger_phrases:
  - "runtime contract"
  - "indexability"
  - "phase 015"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Runtime Contract And Indexability

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-18 |
| **Branch** | `015-runtime-contract-and-indexability` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | [014-stateless-quality-gates](../014-stateless-quality-gates/spec.md) |
| **Successor** | [016-json-mode-hybrid-enrichment](../016-json-mode-hybrid-enrichment/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The session-capturing runtime used one broad `qualityValidation.valid` boolean as the last indexing gate. That made it hard to express the intended policy: some failures should abort the write, some should allow a write but skip indexing, and V10-only source-mismatch diagnostics should still be able to write and index when stronger gates pass.

### Purpose

Make write-vs-index behavior explicit by introducing validation-rule metadata and one shared disposition contract for saved memories.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add validation-rule metadata and helper exports in `scripts/memory/validate-memory-quality.ts`.
- Update `scripts/core/workflow.ts` to use `abort_write`, `write_skip_index`, and `write_and_index`.
- Persist clearer indexing-status reasons in workflow metadata.
- Add focused regression coverage for the new runtime contract.

### Out of Scope
- Refreshing retained live CLI artifacts.
- Redesigning retrieval weighting or embedding generation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts` | Modify | Add rule metadata and disposition helpers |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Enforce explicit write/index policy |
| `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` | Modify | Persist policy-aware indexing status |
| `.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts` | Create | Prove rule-metadata behavior |
| `.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts` | Modify | Prove V10 indexing and write-only policy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Validation rules must expose explicit metadata | Rule metadata defines severity, write blocking, index blocking, source applicability, and rationale |
| REQ-002 | Workflow must resolve one explicit disposition per save | Runtime uses `abort_write`, `write_skip_index`, or `write_and_index` instead of indexing directly from `qualityValidation.valid` |
| REQ-003 | V10-only failures must write and index | Workflow E2E proves V10-only stateless saves index successfully |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Index-blocking-only failures must stay writeable | Metadata persists a policy-aware skipped-index status and reason |
| REQ-005 | Operator docs must describe the contract | The parent pack and catalog reference the explicit dispositions honestly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: V10-only soft failures no longer fall into a write-only path.
- **SC-002**: Write-only indexing policy is explicit in both runtime code and metadata.
- **SC-003**: Focused regression coverage proves the new contract.

### Acceptance Scenarios

1. **Given** a stateless save fails only `V10`, **when** the workflow completes, **then** the memory is written and indexed.
2. **Given** a save hits a write-blocking rule such as `V8`, `V9`, or `V11`, **when** the workflow evaluates dispositions, **then** the write is aborted instead of being indexed accidentally.

> **Post-phase addition:** Rule `V11` (API error content defense) was added after phase 018 shipped (commit `01e781ab9`). It detects status codes, JSON error payloads, `request_id` leaks, and error-dominated trigger phrases, producing an `abort_write` disposition with `severity: 'high'`, `blockOnWrite: true`, `blockOnIndex: true`, `appliesToSources: 'all'`. Tests cover it in `workflow-e2e.vitest.ts`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing audit baseline from phases `016` and `017` | High | Keep the new policy consistent with the reconciled stateless contract |
| Risk | Broader validation changes could accidentally block valid writes | High | Keep upstream template, insufficiency, and quality-threshold aborts separate |
| Post-phase | V11 rule added after 018 shipped | Low | V11 follows the same metadata/disposition contract; tests already cover it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should V2 remain write-only long term, or should it eventually be promoted to either hard block or fully indexable once corpus evidence improves?
<!-- /ANCHOR:questions -->
