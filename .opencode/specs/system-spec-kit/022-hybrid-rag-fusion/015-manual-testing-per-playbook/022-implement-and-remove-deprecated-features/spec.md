---
title: "...tem-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/022-implement-and-remove-deprecated-features/spec]"
description: "Phase 022 documents the implement-and-remove-deprecated-features manual test packet for the Spec Kit Memory system. It groups three deprecated feature lifecycle scenarios from the central playbook so testers can verify deprecated feature identification, safe removal process, and post-removal reference cleanup."
trigger_phrases:
  - "implement remove deprecated manual testing"
  - "phase 022 deprecated features"
  - "deprecated feature removal tests"
  - "hybrid rag deprecated playbook"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/022-implement-and-remove-deprecated-features"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: manual-testing-per-playbook implement-and-remove-deprecated-features phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft — Level 2 packet scaffold created; execution pending |
| **Created** | 2026-03-24 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [021-remediation-revalidation](../021-remediation-revalidation/spec.md) |
| **Catalog Phase** | [007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features](../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The implement-and-remove-deprecated-features phase (catalog phase 022) targets 6 features: 3 deprecated modules to wire into production (graph calibration, temporal contiguity, consumption logger) and 3 dead modules to remove entirely (channel attribution, fusion shadow V2, full-context ceiling eval). Manual testing scenarios are needed to verify that deprecated features are correctly identified, the safe removal process leaves no orphaned references, and post-removal the codebase is clean.

### Purpose
Provide a single implement-and-remove-deprecated-features-focused specification that maps three Phase 022 test scenarios to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook and the catalog phase scope.

**Draft Status Note:** This packet requires full testing scenarios before it can be considered complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| PB-022-01 | Deprecated feature identification | [`../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md`](../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md) | `Identify all deprecated flags and functions targeted for implementation or removal.` | `1) List the 3 IMPLEMENT targets: graph-calibration.ts, temporal-contiguity.ts, consumption-logger.ts 2) Verify each has @deprecated marker or hardcoded disabled flag in source 3) List the 3 REMOVE targets: channel-attribution.ts, fusion-lab.ts (shadow V2; historical - fusion-lab.js deleted in commit 56c67030f), eval-ceiling.ts 4) Verify each REMOVE target still exists in codebase (or confirm already removed) 5) Record inventory as evidence` |
| PB-022-02 | Safe removal process verification | [`../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md`](../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md) | `Verify safe removal process: feature flag off, tests pass, remove code.` | `1) For one REMOVE target (e.g., channel-attribution.ts), confirm its feature flag is OFF or absent 2) Run vitest to confirm all tests pass with the module present but disabled 3) Verify the source file, test file, catalog entry, and playbook entry have been removed (or mark as pending) 4) Run vitest again to confirm tests still pass after removal 5) Record pre/post test results as evidence` |
| PB-022-03 | No runtime references remain after removal | [`../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md`](../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md) | `Verify no runtime references remain after deprecated feature removal.` | `1) For each REMOVE target, grep -r the module name across entire codebase 2) Check import statements: no file should import the removed module 3) Check feature catalog index files for stale references 4) Check playbook index for stale references 5) Check README files for stale mentions 6) Record any remaining references as evidence gaps` |

### Out of Scope
- Executing the three scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-deprecated-features phases from `001-retrieval/` through `021-remediation-revalidation/`.
- Actually performing the implementation or removal of the 6 features (that is catalog phase 022's scope).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 022 implement-and-remove-deprecated-features requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 022 execution order, evidence flow, and rollback guidance |
| `tasks.md` | Create | Phase 022 task tracker for PB-022-01 through PB-022-03 |
| `checklist.md` | Create | Phase 022 verification gates and evidence checklist |
| `implementation-summary.md` | Create | Packet scaffold status until manual execution completes |
| `description.json` | Create | Phase 022 metadata |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 022 | Audit phase scenarios | See parent spec |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute PB-022-01 deprecated feature identification: inventory all 6 targets and verify their current state. | PASS if all 3 IMPLEMENT targets show deprecated/disabled markers and all 3 REMOVE targets are accounted for (present or already removed) |
| REQ-002 | Execute PB-022-02 safe removal process: demonstrate the flag-off-then-remove lifecycle for one target. | PASS if tests pass before removal, the module and all artifacts are removed, and tests pass after removal |
| REQ-003 | Execute PB-022-03 no runtime references remain: grep confirms zero imports and zero index references for removed modules. | PASS if grep returns zero runtime references (imports, requires, catalog entries, playbook entries) for all REMOVE targets |

No P1 items are defined for this phase; all three deprecated-feature scenarios are mandatory for coverage.

### P1 - Packet Governance Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-901 | 022-implement-and-remove-deprecated-features packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 022-implement-and-remove-deprecated-features |
| REQ-902 | 022-implement-and-remove-deprecated-features packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 022-implement-and-remove-deprecated-features |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 deprecated-feature scenarios (PB-022-01 through PB-022-03) are executed with evidence captured per the review protocol.
- **SC-002**: Each scenario has a PASS, PARTIAL, or FAIL verdict with explicit rationale.
- **SC-003**: Coverage is reported as 3/3 with no skipped test IDs.
- **SC-004**: Any remaining references discovered during PB-022-03 are recorded for follow-up remediation.
### Acceptance Scenarios

**Given** the `022-implement-and-remove-deprecated-features` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `022-implement-and-remove-deprecated-features` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `022-implement-and-remove-deprecated-features` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `022-implement-and-remove-deprecated-features` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth; update this phase packet only from that document |
| Dependency | [`../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md`](../../007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md) | Supplies the 6-feature scope (3 implement, 3 remove) and delegation plan | Keep every test row linked to its mapped catalog scope |
| Dependency | Catalog phase 022 implementation must be complete before PB-022-02 and PB-022-03 can fully execute | PB-022-02 tests the removal result; if removal has not happened, mark as BLOCKED | Check catalog phase 022 status before executing; run PB-022-01 (identification) regardless |
| Risk | REMOVE targets may already be deleted by the time this phase executes | Low | PB-022-01 checks current state; if already removed, PB-022-03 still validates no references remain |
| Risk | Test suite may have flaky tests unrelated to the deprecated feature removal | Medium | Run vitest twice and compare; ignore flakes that appear in both runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Has catalog phase 022's delegation plan (5 GPT-5.4 agents) been executed? If not, PB-022-02 and PB-022-03 should be deferred until implementation is complete.
- Should PB-022-02 test the removal of all 3 REMOVE targets, or is one representative target sufficient for the manual test packet?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: vitest runs for PB-022-02 must complete within the standard CI timeout window.
- **NFR-P02**: Codebase-wide grep for PB-022-03 must complete within 60 seconds.

### Security
- **NFR-S01**: No real API keys or credentials may appear in evidence artifacts.

### Reliability
- **NFR-R01**: Evidence must capture grep output verbatim so reviewers can independently verify zero-reference claims.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- REMOVE target referenced only in comments or documentation (not runtime code): Document as a non-blocking reference; PASS for runtime but note for documentation cleanup.
- IMPLEMENT target already wired into production by the time of testing: Verify the wiring is correct and the feature flag gates it properly.

### Error Scenarios
- vitest fails after removal due to unrelated test: Isolate the failure; if unrelated to the removed module, mark PB-022-02 as PASS with caveat.
- Grep returns false positives (e.g., git history, node_modules): Filter to source directories only (mcp_server/src, feature_catalog, manual_testing_playbook).

### State Transitions
- Module removed but feature flag constant still defined: Acceptable if the flag is no longer read anywhere; document for future cleanup.
- Module removed but re-added in a later commit: Mark PB-022-03 as FAIL and document the regression.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 3 scenarios covering 6 features (3 implement + 3 remove) |
| Risk | 10/25 | Depends on catalog phase 022 completion; test suite stability risk |
| Research | 6/20 | Targets clearly defined in catalog phase spec |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
