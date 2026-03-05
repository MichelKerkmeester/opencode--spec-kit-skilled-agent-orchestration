---
title: "Feature Specification: Refinement Phase 5 Finalized Scope [template:level_2/spec.md]"
description: "Level 2 child scope finalized across tranche-1 through tranche-4, including summary alignment, quality-gate robustness, hybrid-search hardening, and child-doc closeout."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify | v2.2"
trigger_phrases:
  - "refinement phase 5"
  - "summary_of_existing_features"
  - "isInShadowPeriod contradiction"
  - "save-quality-gate ensure config"
  - "phase 016 tranche-1 through tranche-4"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Refinement Phase 5 Finalized Scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0/P1 |
| **Status** | Completed |
| **Created** | 2026-03-02 |
| **Branch** | `022-hybrid-rag-fusion/025-finalized-scope` |
| **Parent Spec** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/` |
| **Predecessor Context** | `024-timer-persistence-stage3-fallback/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This child phase is now complete and records a bounded multi-tranche remediation sequence. Delivered scope includes tranche-1 summary alignment and quality-gate hardening, tranche-2 canonical ID dedup hardening, tranche-3 activation-window/fallback-channel continuity fixes plus targeted parent summary alignment updates, and tranche-4 parent-summary documentation polish.

### Purpose

Document and verify the finalized tranche-1 through tranche-4 outcomes with explicit evidence so the child folder accurately reflects completed remediation and remains aligned with parent summary truth.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tranche-1 delivered fixes: summary wording/contradiction corrections and `save-quality-gate.ts` config-table ensure robustness across DB reinitialization/handle changes.
- Tranche-2 delivered fixes: canonical ID dedup hardening in `combinedLexicalSearch()` and legacy `hybridSearch()`.
- Tranche-3 delivered fixes: persisted activation timestamp continuity and tier-2 fallback `forceAllChannels` behavior, plus targeted parent-summary truth alignment corrections.
- Tranche-4 delivered fixes: parent-summary P2 documentation-polish items A-F and child status-doc finalization.
- Keep Level 2 child docs synchronized to completed scope and verification evidence.

### Out of Scope
- Any remediation items not directly tied to the completed tranche-1 through tranche-4 targets listed above.
- Additional feature work, refactors, or architectural redesign.
- Parent-folder rewrites outside the targeted summary-fix and documentation-polish updates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/spec.md` | Modify | Finalized child scope, requirements, and acceptance scenarios for completed tranches |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/plan.md` | Modify | Finalized phase continuity and verification strategy through tranche-4 |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/tasks.md` | Modify | Completed task ledger and final completion criteria |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/checklist.md` | Modify | P0/P1 checklist mapped to the three fixes |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/implementation-summary.md` | Modify | Finalized multi-tranche outcomes and evidence summary |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md` | Modify (implementation tranche) | Terminology alignment for RSF/shadow/fallback/floor/reconsolidation |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` | Modify (implementation tranche) | Resolve `isInShadowPeriod` contradiction |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | Modify (implementation tranche) | Harden config-table ensure behavior and activation-window continuity |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify (implementation tranche) | Canonical ID dedup hardening and tier-2 fallback `forceAllChannels` override |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Modify (implementation tranche) | Regression tests for canonical dedup and tier-2 fallback channel forcing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parent summary docs are aligned for tranche-1, tranche-3, and tranche-4 targeted documentation corrections. | `summary_of_existing_features.md` and `summary_of_new_features.md` reflect consistent RSF/shadow/fallback/floor/reconsolidation, `isInShadowPeriod`, gating/instrumentation/hook-scope/dead-code, and P2 A-F polish truth. |
| REQ-002 | `save-quality-gate.ts` robustness fixes cover both DB-handle churn and persisted activation-window continuity. | Config-table ensure behavior remains valid after DB handle changes, and persisted activation timestamp is preserved across restart; targeted tests pass. |
| REQ-003 | Hybrid-search remediation is complete for canonical dedup and tier-2 all-channel fallback forcing. | Canonicalization is applied in both modern and legacy dedup paths, and `forceAllChannels` is honored for tier-2 fallback; regression tests pass. |
| REQ-004 | Child Level 2 docs are synchronized to finalized tranche-1 through tranche-4 scope. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all reflect completed multi-tranche scope and evidence references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verification commands are finalized and executable for child validation and targeted MCP suite coverage. | `tasks.md` and `plan.md` include child validation command and expanded targeted suite command with passing evidence (`176 tests`). |
| REQ-006 | Acceptance scenarios are explicit for completed Level 2 verification depth. | At least four acceptance scenarios map to completed multi-tranche outcomes and verification closure. |

### Acceptance Scenarios

1. **Given** parent summary files are within targeted remediation scope, **when** tranche-1/tranche-3/tranche-4 summary updates are applied, **then** targeted contradiction and terminology alignment points remain coherent across both summaries.
2. **Given** SQLite handles and process lifecycle can change, **when** save-quality-gate persistence helpers initialize and run, **then** config-table ensure behavior and activation-window timestamp state remain stable.
3. **Given** hybrid search receives mixed memory ID encodings and simple-routed queries, **when** dedup and tier-2 fallback execute, **then** canonical dedup and all-channel fallback behavior are preserved.
4. **Given** tranche-1 through tranche-4 tasks are complete, **when** expanded targeted tests and child validation run, **then** targeted suite passes (`176 tests`) and child validation exits with zero errors.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The child spec reflects finalized, bounded tranche-1 through tranche-4 remediation scope with no stale in-progress language.
- **SC-002**: Parent summary contradiction/wording and P2 polish updates are captured as completed in-scope outcomes with evidence references.
- **SC-003**: Runtime fixes (`save-quality-gate.ts`, `hybrid-search.ts`) are captured with targeted passing regression coverage.
- **SC-004**: Child-folder validation reports zero errors after final documentation alignment.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-extending parent-summary edits beyond targeted tranche items | Medium | Keep parent edits bounded to documented tranche-1/tranche-3/tranche-4 correction sets |
| Risk | Runtime regressions in persistence or fallback logic after hardening | High | Maintain focused regression coverage and expanded targeted suite evidence in child records |
| Dependency | Existing `mcp_server` test harness (`vitest`) | Medium | Use expanded targeted command and capture outputs in `tasks.md`, `checklist.md`, and summary evidence |
| Dependency | Parent-phase context from `023` and predecessor `015` | Low | Keep lineage references in child docs while treating targeted parent summary fixes as in scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The save-quality-gate robustness fix introduces no measurable regression in targeted validation/test runs.
- **NFR-P02**: Child-folder validation remains a single-pass operation.

### Security
- **NFR-S01**: No secrets, credentials, or sensitive runtime data are added in docs or tests.
- **NFR-S02**: Evidence artifacts are text-only and safe for repository storage.

### Reliability
- **NFR-R01**: Config-table ensure behavior remains deterministic across repeated DB handle changes.
- **NFR-R02**: Child validation output remains stable (exit 0 or 1, no errors) after doc updates.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `summary_of_existing_features.md` has multiple mentions of the same feature-flag topic; all references must remain mutually consistent.
- `summary_of_new_features.md` references removed dead code and historical context; contradiction fix must preserve historical notes without conflicting present-tense claims.

### Error Scenarios
- DB handle replacement occurs after initial config-table ensure and old ensure cache is stale.
- Validation passes structurally but wording contradiction remains semantically unresolved in summaries.

### State Transitions
- Current state: all planned remediation tranches in this child are completed and verified.
- Post-tranche state: child docs remain stable as final status artifacts; new remediation needs roll into a subsequent child folder.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three targeted implementation fixes with strict boundary |
| Risk | 18/25 | DB handle lifecycle robustness can affect persistence reliability |
| Research | 10/20 | Requires contradiction and wording alignment against current source text |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- No open blockers for this child; verification evidence is fully captured in child status docs.
- Any new contradiction or drift findings should be deferred to the next child scope (for example `017-*`) unless explicitly reopened.
<!-- /ANCHOR:questions -->

---

<!-- End of filled Level 2 specification for child 016 (tranche-1 through tranche-4 aligned). -->

---

## Phase Navigation

- Successor: `026-opus-remediation`
