---
title: "Feature Specification: Manual Testing — Pipeline Architecture (Phase 014)"
description: "Manual test execution tracking for 18 pipeline architecture scenarios covering 4-stage pipeline refactor, MPAB aggregation, chunk ordering, schema validation, DB path standardisation, cross-process rebinding, and lineage state projection."
trigger_phrases:
  - "pipeline architecture testing"
  - "014 pipeline architecture"
  - "phase 014 manual testing"
  - "4-stage pipeline refactor test"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Manual Testing — Pipeline Architecture (Phase 014)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `015-manual-testing-per-playbook` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [013-memory-quality-and-indexing](../013-memory-quality-and-indexing/spec.md) |
| **Successor** | [015-retrieval-enhancements](../015-retrieval-enhancements/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The pipeline architecture category (14--pipeline-architecture) contains 22 features spanning the 4-stage pipeline refactor, chunk-to-memory aggregation, schema validation, DB path standardisation, cross-process rebinding, and lineage projection. These features have never been manually verified against the published playbook scenarios, so conformance is unknown.

### Purpose
Execute all 18 playbook scenarios for the pipeline architecture category and record PASS/FAIL/SKIP per scenario, producing a verified conformance record.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute all 18 playbook scenarios listed in section 4
- Record result (PASS / FAIL / SKIP) and evidence for each scenario
- Capture any defects found during execution

### Out of Scope
- Fixing defects (tracked separately)
- Testing scenarios outside the 14--pipeline-architecture category
- Automated test creation

### Scenario Inventory

| ID | Playbook File | Title |
|----|--------------|-------|
| 049 | 049-4-stage-pipeline-refactor-r6.md | 4-stage pipeline refactor (R6) |
| 050 | 050-mpab-chunk-to-memory-aggregation-r1.md | MPAB chunk-to-memory aggregation (R1) |
| 051 | 051-chunk-ordering-preservation-b2.md | Chunk ordering preservation (B2) |
| 052 | 052-template-anchor-optimization-s2.md | Template anchor optimization (S2) |
| 053 | 053-validation-signals-as-retrieval-metadata-s3.md | Validation signals as retrieval metadata (S3) |
| 054 | 054-learned-relevance-feedback-r11.md | Learned relevance feedback (R11) |
| 067 | 067-search-pipeline-safety.md | Search pipeline safety |
| 071 | 071-performance-improvements.md | Performance improvements |
| 076 | 076-activation-window-persistence.md | Activation window persistence |
| 078 | 078-legacy-v1-pipeline-removal.md | Legacy V1 pipeline removal |
| 080 | 080-pipeline-and-mutation-hardening.md | Pipeline and mutation hardening |
| 087 | 087-db-path-extraction-and-import-standardization.md | DB_PATH extraction and import standardisation |
| 095 | 095-strict-zod-schema-validation-p0-1.md | Strict Zod schema validation (P0-1) |
| 112 | 112-cross-process-db-hot-rebinding.md | Cross-process DB hot rebinding |
| 115 | 115-transaction-atomicity-on-rename-failure-p0-5.md | Transaction atomicity on rename failure (P0-5) |
| 129 | 129-lineage-state-active-projection-and-asof-resolution.md | Lineage state active projection and asOf resolution |
| 130 | 130-lineage-backfill-rollback-drill.md | Lineage backfill rollback drill |
| 146 | 146-dynamic-server-instructions-p1-6.md | Dynamic server instructions (P1-6) |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Clean-slate Level 2 specification for Phase 014 manual test execution |
| `plan.md` | Rewrite | Execution plan for all 18 scenarios |
| `tasks.md` | Rewrite | One task per scenario, all pending |
| `checklist.md` | Rewrite | P0 checklist items per scenario, all unchecked |
| `implementation-summary.md` | Rewrite | Blank template, Not Started |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 049 | 4-stage pipeline refactor (R6) | 14--pipeline-architecture/01-4-stage-pipeline-refactor.md |
| 2 | 050 | MPAB chunk-to-memory aggregation (R1) | 14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md |
| 3 | 051 | Chunk ordering preservation (B2) | 14--pipeline-architecture/03-chunk-ordering-preservation.md |
| 4 | 052 | Template anchor optimization (S2) | 14--pipeline-architecture/04-template-anchor-optimization.md |
| 5 | 053 | Validation signals as retrieval metadata (S3) | 14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md |
| 6 | 054 | Learned relevance feedback (R11) | 14--pipeline-architecture/06-learned-relevance-feedback.md |
| 7 | 067 | Search pipeline safety | 14--pipeline-architecture/07-search-pipeline-safety.md |
| 8 | 071 | Performance improvements | 14--pipeline-architecture/08-performance-improvements.md |
| 9 | 076 | Activation window persistence | 14--pipeline-architecture/09-activation-window-persistence.md |
| 10 | 078 | Legacy V1 pipeline removal | 14--pipeline-architecture/10-legacy-v1-pipeline-removal.md |
| 11 | 080 | Pipeline and mutation hardening | 14--pipeline-architecture/11-pipeline-and-mutation-hardening.md |
| 12 | 087 | DB_PATH extraction and import standardization | 14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md |
| 13 | 095 | Strict Zod schema validation (P0-1) | 14--pipeline-architecture/13-strict-zod-schema-validation.md |
| 14 | 112 | Cross-process DB hot rebinding | 14--pipeline-architecture/17-cross-process-db-hot-rebinding.md |
| 15 | 115 | Transaction atomicity on rename failure (P0-5) | 14--pipeline-architecture/21-atomic-pending-file-recovery.md |
| 16 | 129 | Lineage state active projection and asOf resolution | 14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md |
| 17 | 130 | Lineage backfill rollback drill | 14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md |
| 18 | 146 | Dynamic server instructions (P1-6) | 14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md |
| 19 | 201 | Warm server / daemon mode | 14--pipeline-architecture/15-warm-server-daemon-mode.md |
| 20 | 202 | Backend storage adapter abstraction | 14--pipeline-architecture/16-backend-storage-adapter-abstraction.md |
| 21 | 203 | Atomic write-then-index API | 14--pipeline-architecture/18-atomic-write-then-index-api.md |
| 22 | 204 | Embedding retry orchestrator | 14--pipeline-architecture/19-embedding-retry-orchestrator.md |
| 23 | 205 | 7-layer tool architecture metadata | 14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-049 | Execute scenario 049 — 4-stage pipeline refactor (R6) | PASS: all 4 stages execute in sequence; stage-4 scores unchanged after completion. FAIL: stage skipped or stage-4 scores mutated |
| REQ-050 | Execute scenario 050 — MPAB chunk-to-memory aggregation (R1) | PASS: computed MPAB score matches manual calculation within 0.001 tolerance. FAIL: score deviation >0.001 or missing chunk contributions |
| REQ-051 | Execute scenario 051 — Chunk ordering preservation (B2) | PASS: marker sequence in collapsed output matches original save order. FAIL: markers out of order or missing |
| REQ-052 | Execute scenario 052 — Template anchor optimization (S2) | PASS: anchor metadata present; scores identical with and without anchor enrichment. FAIL: anchor metadata missing or score mutation detected |
| REQ-053 | Execute scenario 053 — Validation signals as retrieval metadata (S3) | PASS: all multipliers in [0.8, 1.2]; positive validations increase multiplier; zero validations = 1.0. FAIL: multiplier out of bounds or zero-validation not neutral |
| REQ-054 | Execute scenario 054 — Learned relevance feedback (R11) | PASS: triggers learned from helpful validations with queryId; safeguards cap total learned triggers. FAIL: triggers learned without queryId or safeguard limits exceeded |
| REQ-067 | Execute scenario 067 — Search pipeline safety | PASS: pipeline safely handles summary/lexical heavy queries with correct filtering and tokenisation |
| REQ-071 | Execute scenario 071 — Performance improvements | PASS: optimised paths active; heavy query timing shows no regressions compared to baseline |
| REQ-076 | Execute scenario 076 — Activation window persistence | PASS: activation window timestamp survives restart; warn-only behaviour maintained |
| REQ-078 | Execute scenario 078 — Legacy V1 pipeline removal | PASS: zero V1 pipeline references exist; all queries execute via V2 pipeline exclusively |
| REQ-080 | Execute scenario 080 — Pipeline and mutation hardening | PASS: all mutation paths atomic; error handling leaves no partial state; cleanup complete |
| REQ-087 | Execute scenario 087 — DB_PATH extraction and import standardisation | PASS: all entry points resolve the same DB path; env var precedence consistent across scripts and tools |
| REQ-095 | Execute scenario 095 — Strict Zod schema validation (P0-1) | PASS: strict mode rejects unknown params; passthrough mode allows them |
| REQ-112 | Execute scenario 112 — Cross-process DB hot rebinding | PASS: server detects marker file; reinitialises DB; returns current non-stale data; health is healthy |
| REQ-115 | Execute scenario 115 — Transaction atomicity on rename failure (P0-5) | PASS: pending file survives rename failure; recovery function can find and process it |
| REQ-129 | Execute scenario 129 — Lineage state active projection and asOf resolution | PASS: memory-lineage-state.vitest.ts completes with all tests passing; transcript shows both valid and malformed lineage cases |
| REQ-130 | Execute scenario 130 — Lineage backfill rollback drill | PASS: memory-lineage-backfill.vitest.ts completes with all tests passing; execution and rollback evidence captured |
| REQ-146 | Execute scenario 146 — Dynamic server instructions (P1-6) | PASS: enabled mode emits overview with counts and channels; disabled mode yields empty string |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 18 scenarios executed (PASS, FAIL, or SKIP — no "Not Started" remaining)
- **SC-002**: Every result has an evidence note (observation, command output, or explicit skip reason)
- **SC-003**: All FAIL results have a defect note capturing the observed vs expected behaviour
### Acceptance Scenarios

**Given** the `014-pipeline-architecture` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `014-pipeline-architecture` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `014-pipeline-architecture` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `014-pipeline-architecture` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Playbook scenario files in scratch/playbook/ | Cannot execute without scenario steps | Locate files before starting |
| Dependency | `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Exact prompts and pass criteria source | Treat playbook as source of truth |
| Dependency | `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Verdict rubric (PASS/PARTIAL/FAIL) | Load before any verdict assignment |
| Dependency | `../../feature_catalog/14--pipeline-architecture/` | Feature context per scenario | Link every scenario to its feature file |
| Risk | Cross-process rebinding (112) requires multiple processes | May be hard to reproduce locally | Document environment setup steps; use code inspection if live run not possible |
| Risk | Transaction atomicity (115) requires simulated rename failure | Edge case needs controlled failure injection | Use transaction-manager test hooks in isolated fixture |
| Risk | Lineage backfill rollback (130) alters DB state | Could corrupt test environment | Run in isolated test DB; record checkpoint before execution |
| Risk | Destructive scenarios (080, 112, 115, 130) share state | Evidence can be invalidated | Require disposable sandboxes and checkpoints |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should any future phase refresh split shared lineage feature references (129 and 130 both link to the same feature file) into separate scenario-specific links?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each scenario execution must complete or time out within 5 minutes

### Reliability
- **NFR-R01**: Test environment must be reset to clean state before each stateful scenario (080, 112, 115, 130)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Scenario Boundaries
- Scenarios that share DB state must be run in isolation or with state reset between runs
- Scenarios marked P0-N in the playbook title are hard blockers — FAIL results must be escalated immediately

### Error Scenarios
- If the playbook scenario file is missing: record SKIP with note "scenario file not found"
- If the MCP server is unavailable: halt execution and record environment issue
- If sandbox isolation fails for destructive scenarios: mark blocked rather than proceeding
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 18 scenarios, moderate tool surface |
| Risk | 12/25 | 4 stateful/destructive scenarios need isolation |
| Research | 4/20 | Playbook steps are pre-defined |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
