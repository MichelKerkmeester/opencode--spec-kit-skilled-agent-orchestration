---
title: "Feature Specification: Manual Testing Playbook Phase 014 Pipeline Architecture"
description: "This specification captures the per-playbook manual testing scope for the pipeline-architecture category in Spec Kit Memory. It aligns the full phase 014 scenario set with feature catalog references and acceptance criteria so reviewers can execute and score coverage consistently."
trigger_phrases:
  - "manual testing"
  - "pipeline architecture"
  - "phase 014"
  - "NEW-049"
  - "NEW-146"
importance_tier: "important"
contextType: "specification"
---
# Feature Specification: Manual Testing Playbook Phase 014 Pipeline Architecture

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
Manual test scenarios for pipeline-architecture need structured per-phase documentation so operators can execute the playbook without re-deriving feature intent, scope, or verdict rules. The category spans pipeline flow, scoring safeguards, runtime safety, DB coordination, and lineage recovery, which makes ad hoc execution and review brittle.

### Purpose
Create phase 014 specification coverage that ties every assigned pipeline-architecture scenario to its feature-catalog source and explicit acceptance criteria.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **NEW-049** - 4-stage pipeline refactor - [`../../feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md`](../../feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md)
- **NEW-050** - MPAB chunk-to-memory aggregation - [`../../feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md`](../../feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md)
- **NEW-051** - Chunk ordering preservation - [`../../feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md`](../../feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md)
- **NEW-052** - Template anchor optimization - [`../../feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md`](../../feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md)
- **NEW-053** - Validation signals as retrieval metadata - [`../../feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md`](../../feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md)
- **NEW-054** - Learned relevance feedback - [`../../feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md`](../../feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md)
- **NEW-067** - Search pipeline safety - [`../../feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md`](../../feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md)
- **NEW-071** - Performance improvements - [`../../feature_catalog/14--pipeline-architecture/08-performance-improvements.md`](../../feature_catalog/14--pipeline-architecture/08-performance-improvements.md)
- **NEW-076** - Activation window persistence - [`../../feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md`](../../feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md)
- **NEW-078** - Legacy V1 pipeline removal - [`../../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md`](../../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md)
- **NEW-080** - Pipeline and mutation hardening - [`../../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md`](../../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md)
- **NEW-087** - DB_PATH extraction and import standardization - [`../../feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md`](../../feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md)
- **NEW-095** - Strict Zod schema validation - [`../../feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md`](../../feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md)
- **NEW-112** - Cross-process DB hot rebinding - [`../../feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md`](../../feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md)
- **NEW-115** - Transaction atomicity on rename failure - [`../../feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md`](../../feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md)
- **NEW-129** - Lineage state active projection and asOf resolution - [`../../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md`](../../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md)
- **NEW-130** - Lineage backfill rollback drill - [`../../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md`](../../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md)
- **NEW-146** - Dynamic server instructions at MCP initialization - [`../../feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md`](../../feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md)

### Out of Scope
- Creating or changing the underlying Spec Kit Memory implementation - this phase only documents manual validation.
- Rewriting the canonical playbook or review protocol - this phase consumes those sources and points back to them.
- Executing the scenarios - this phase prepares the documentation operators will run later.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/014-pipeline-architecture/spec.md` | Create | Level 1 phase specification for the pipeline-architecture manual test slice. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/014-pipeline-architecture/plan.md` | Create | Level 1 execution plan for prompts, scenario flow, evidence, and verdict handling. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-NEW-049 | Document the `NEW-049` scenario for **4-stage pipeline refactor** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS: All 4 stages execute in sequence; stage-4 scores unchanged after completion; FAIL: Stage skipped or stage-4 scores mutated |
| REQ-NEW-050 | Document the `NEW-050` scenario for **MPAB chunk-to-memory aggregation** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS: Computed MPAB score matches manual calculation within 0.001 tolerance; FAIL: Score deviation >0.001 or missing chunk contributions |
| REQ-NEW-051 | Document the `NEW-051` scenario for **Chunk ordering preservation** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS: Marker sequence in collapsed output matches original save order; FAIL: Markers out of order or missing |
| REQ-NEW-052 | Document the `NEW-052` scenario for **Template anchor optimization** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS: Anchor metadata present; scores identical with/without anchor enrichment; FAIL: Anchor metadata missing or score mutation detected |
| REQ-NEW-053 | Document the `NEW-053` scenario for **Validation signals as retrieval metadata** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS: All multipliers in [0.8, 1.2]; positive validations increase multiplier; zero validations = 1.0; FAIL: Multiplier out of bounds or zero-validation not neutral |
| REQ-NEW-054 | Document the `NEW-054` scenario for **Learned relevance feedback** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS: Triggers learned from helpful validations with queryId; safeguards cap total learned triggers; FAIL: Triggers learned without queryId or safeguard limits exceeded |
| REQ-NEW-067 | Document the `NEW-067` scenario for **Search pipeline safety** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if pipeline safely handles summary/lexical heavy queries with correct filtering and tokenization |
| REQ-NEW-071 | Document the `NEW-071` scenario for **Performance improvements** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if optimized paths are active and heavy query timing shows no regressions compared to baseline |
| REQ-NEW-076 | Document the `NEW-076` scenario for **Activation window persistence** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if activation window timestamp survives restart and warn-only behavior is maintained |
| REQ-NEW-078 | Document the `NEW-078` scenario for **Legacy V1 pipeline removal** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if zero V1 pipeline references exist and all queries execute via V2 pipeline exclusively |
| REQ-NEW-080 | Document the `NEW-080` scenario for **Pipeline and mutation hardening** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if all mutation paths are atomic, error handling leaves no partial state, and cleanup is complete |
| REQ-NEW-087 | Document the `NEW-087` scenario for **DB_PATH extraction and import standardization** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if all entry points resolve the same DB path and env var precedence is consistent across scripts/tools |
| REQ-NEW-095 | Document the `NEW-095` scenario for **Strict Zod schema validation** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if strict mode rejects unknown params and passthrough mode allows them |
| REQ-NEW-112 | Document the `NEW-112` scenario for **Cross-process DB hot rebinding** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if server detects marker file, reinitializes DB, returns current (non-stale) data, and health is healthy |
| REQ-NEW-115 | Document the `NEW-115` scenario for **Transaction atomicity on rename failure** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if pending file survives rename failure and recovery function can find and process it |
| REQ-NEW-129 | Document the `NEW-129` scenario for **Lineage state active projection and asOf resolution** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if memory-lineage-state.vitest.ts completes with all tests passing and the transcript shows both valid and malformed lineage cases |
| REQ-NEW-130 | Document the `NEW-130` scenario for **Lineage backfill rollback drill** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if memory-lineage-backfill.vitest.ts completes with all tests passing and shows both execution and rollback evidence |
| REQ-NEW-146 | Document the `NEW-146` scenario for **Dynamic server instructions at MCP initialization** with the linked feature context, playbook prompt, execution notes, evidence expectations, and verdict guidance. | PASS if enabled mode emits overview with counts/channels and disabled mode yields empty string |

### P1 - Required (complete OR user-approved deferral)

No additional P1 requirements. Phase completeness depends on documenting every assigned playbook scenario above.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 18 phase-014 pipeline-architecture scenarios are listed with feature-catalog links in scope.
- **SC-002**: Every documented scenario carries the exact playbook prompt in `plan.md` and the pass/fail-derived acceptance criteria in this spec.
- **SC-003**: The plan describes the full execution lifecycle as preconditions -> execute -> evidence -> verdict, including sandbox guidance for state-changing scenarios.
- **SC-004**: Reviewers can determine scenario and feature verdicts using only the generated phase docs plus the canonical playbook and review protocol.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `manual_testing_playbook/manual_testing_playbook.md` | If prompts or PASS text drift, the phase docs become stale. | Treat the playbook as source of truth and refresh this phase whenever those rows change. |
| Dependency | `manual_testing_playbook/review_protocol.md` | Verdict language can diverge from the reviewer's expected rubric. | Keep feature and release verdict wording aligned to the review protocol's PASS/PARTIAL/FAIL rules. |
| Dependency | `feature_catalog/14--pipeline-architecture/` | Missing feature context would make scenario intent harder to understand. | Link every scenario to its phase-14 feature file and note shared files such as lineage coverage. |
| Dependency | MCP runtime, CLI scripts, and test harnesses | Operators need the proper runtime to execute MCP calls, server restarts, and targeted Vitest suites. | Call out execution type, restart expectations, and shell-based suites in the plan. |
| Risk | State-changing scenarios (`NEW-080`, `NEW-112`, `NEW-115`, `NEW-130`) can affect shared environments. | Evidence can be invalidated and working state can drift. | Require disposable sandboxes, checkpoints, and isolated worktrees before those scenarios run. |
| Risk | Phase assignment drift between prompt text and cross-reference tables | Operators could miss a category-mapped test. | Document the resolved 18-scenario set and record the source mismatch in open questions. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The request lists 17 explicit IDs but states `TEST COUNT: 18`; this phase resolves the mismatch by including `NEW-146`, which is mapped to `14--pipeline-architecture` in the playbook cross-reference. Should future assignments list all category-mapped IDs explicitly?
- Should any future phase refresh split shared feature files such as `22-lineage-state-active-projection-and-asof-resolution.md` into separate scenario-specific references, or is shared linkage the preferred pattern?
<!-- /ANCHOR:questions -->

---
