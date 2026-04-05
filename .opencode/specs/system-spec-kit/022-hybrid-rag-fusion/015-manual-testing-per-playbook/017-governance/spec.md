---
title: "Feature Specification [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/017-governance/spec]"
description: "Phase 017 documents the governance manual test packet for the Spec Kit Memory system. It isolates five governance scenarios from the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "governance manual testing"
  - "phase 017 governance"
  - "feature flag governance tests"
  - "hybrid rag governance playbook"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook governance phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [016-tooling-and-scripts](../016-tooling-and-scripts/spec.md) |
| **Successor** | [018-ux-hooks](../018-ux-hooks/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual governance scenarios for the Spec Kit Memory system live inside the central playbook and require a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated governance packet, Phase 017 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single governance-focused specification that maps all five Phase 017 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| 063 | Feature flag governance | [`../../feature_catalog/17--governance/01-feature-flag-governance.md`](../../feature_catalog/17--governance/01-feature-flag-governance.md) | `Audit feature flag governance conformance.` | `1) enumerate flags 2) verify age/limits/review cadence 3) record compliance gaps` |
| 064 | Feature flag sunset audit | [`../../feature_catalog/17--governance/02-feature-flag-sunset-audit.md`](../../feature_catalog/17--governance/02-feature-flag-sunset-audit.md) | `Verify feature flag sunset audit outcomes.` | `1) compare documented disposition vs code 2) verify deprecated/no-op states 3) record deltas` |
| 122 | Governed ingest and scope isolation (Phase 5) | [`../../feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md`](../../feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md) | `Validate Phase 5 governed ingest and retrieval isolation.` | `1) Attempt memory_save() with tenantId/sessionId but missing provenance fields and verify rejection 2) Save with full {tenantId,userId\|agentId,sessionId,provenanceSource,provenanceActor} metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review governance_audit rows` |
| 123 | Shared-space deny-by-default rollout (Phase 6) | [`../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`](../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md) | `Validate Phase 6 shared-memory rollout controls.` | `1) Create space with shared_space_upsert({ spaceId, tenantId, name, rolloutEnabled:true }) 2) Call shared_memory_status() for a non-member and verify no accessible spaces 3) Attempt shared-space save/search as a non-member and verify rejection/filtering 4) Grant membership with shared_space_membership_set() 5) Verify shared access succeeds 6) Flip killSwitch:true and verify access is blocked again` |
| 148 | Shared-memory disabled-by-default and first-run setup | [`../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`](../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md) | `Validate shared-memory default-off enablement and first-run setup.` | `1) Start MCP server without env var → call shared_memory_status() → verify enabled: false 2) Call shared_memory_enable() → verify enabled: true, alreadyEnabled: false, readmeCreated: true 3) Call shared_memory_enable() again → verify alreadyEnabled: true (idempotent) 4) Verify shared-spaces/README.md exists on disk 5) Restart MCP server (no env var) → call shared_memory_status() → verify enabled: true (DB persistence) 6) Set SPECKIT_MEMORY_SHARED_MEMORY=true env var → call shared_memory_status() without DB → verify enabled: true (env override) 7) Run /memory:manage shared with the feature disabled → verify first-run setup prompt appears` |

### Out of Scope
- Executing the five governance scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-governance phases from `001-retrieval/` through `016-tooling-and-scripts/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 017 governance requirements, test inventory, and acceptance criteria |
| `plan.md` | Rewrite | Phase 017 governance execution plan and review workflow |
| `tasks.md` | Rewrite | Phase 017 task tracker for setup, execution, and verification work |
| `checklist.md` | Rewrite | Phase 017 verification checklist for pre-execution and evidence quality gates |
| `implementation-summary.md` | Rewrite | Blank template pending execution |
| `description.json` | Rewrite | Reset to Draft, Not Started |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 063 | Feature flag governance | 17--governance/01-feature-flag-governance.md |
| 2 | 064 | Feature flag sunset audit | 17--governance/02-feature-flag-sunset-audit.md |
| 3 | 122 | Governed ingest and scope isolation (Phase 5) | 17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md |
| 4 | 123 | Shared-space deny-by-default rollout (Phase 6) | 17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md |
| 5 | 148 | Shared-memory disabled-by-default and first-run setup | 17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute 063 feature flag governance: audit all SPECKIT_ flag conformance against governance targets. | PASS if all flags are enumerated with governance metadata and compliance gaps are identified |
| REQ-002 | Execute 064 feature flag sunset audit: compare documented dispositions vs. code runtime state. | PASS if all sunset dispositions match runtime behavior and deprecated flags have no side effects |
| REQ-003 | Execute 122 governed ingest and scope isolation: validate provenance enforcement and cross-scope retrieval filtering. | PASS if missing provenance is rejected, valid governed save succeeds, cross-scope retrieval returns no hit, and audit rows exist |
| REQ-004 | Execute 123 shared-space deny-by-default rollout: validate rollout controls, membership, and kill switch. | PASS if non-member is denied, member is allowed, and kill switch blocks access again |
| REQ-005 | Execute 148 shared-memory disabled-by-default and first-run setup: validate enablement lifecycle end-to-end. | PASS if default is off, enable persists, idempotent, README created, restart persistence works, env override works, and command gate triggers |

No P1 items are defined for this phase; all five governance scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 governance scenarios (063, 064, 122, 123, 148) are executed with evidence captured per the review protocol.
- **SC-002**: Each scenario has a PASS, PARTIAL, or FAIL verdict with explicit rationale.
- **SC-003**: Coverage is reported as 5/5 with no skipped test IDs.
- **SC-004**: Any DB config mutations and scoped memory writes are restored or explicitly documented before phase closeout.
### Acceptance Scenarios

**Given** the `017-governance` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `017-governance` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `017-governance` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `017-governance` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth; update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review; do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/17--governance/`](../../feature_catalog/17--governance/) | Supplies feature context for each governance scenario | Keep every test row linked to its mapped governance feature file |
| Dependency | MCP runtime plus governance sandbox corpus | Required to execute `memory_save`, `shared_memory_status`, `shared_memory_enable`, `shared_space_upsert`, and `shared_space_membership_set` scenarios safely | Run stateful tests in an isolated sandbox and preserve restart/checkpoint instructions in the plan |
| Risk | 122 writes scoped memory records that could leak across test runs if sandbox isolation fails | High | Restrict provenance/scope saves to disposable sandbox tenant IDs and document rollback steps before execution |
| Risk | 123 and 148 depend on DB config state and MCP restarts that can persist between runs | Medium | Capture baseline DB config state, clear shared_memory_enabled flag between runs, and restore defaults before the next scenario |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which disposable tenant ID and user/agent combination should Phase 017 reviewers use for 122 governed-ingest tests to avoid cross-contamination with existing memory records?
- Should 148 DB-persistence restart be performed against the same MCP instance used for the preceding governance tests, or should it run in a clean process to avoid stale DB state from 122 or 123?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each governance scenario command sequence must complete within the MCP tool timeout window (no hung calls).

### Security
- **NFR-S01**: Scoped memory writes for 122 must use disposable sandbox tenant/user IDs isolated from production memory records.
- **NFR-S02**: Kill-switch and rollout flag state must be restored to pre-test baseline after 123 and 148.

### Reliability
- **NFR-R01**: Evidence artifacts must be captured before any rollback so verdict review can proceed independently of runtime state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Missing provenance fields (122): System must reject save, not silently succeed.
- Kill switch set to true mid-session (123): Access must be blocked immediately without requiring restart.

### Error Scenarios
- MCP restart failure during 148: Mark scenario BLOCKED and document the stale DB state before continuing.
- Sandbox contamination from prior scenario: Stop execution, document the contamination, restore baseline.

### State Transitions
- 148 steps 2 → 3 (idempotent enable): Second call must return `alreadyEnabled: true`.
- 123 step 6 (kill switch): Access denied without removing the membership record.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 5 scenarios, mix of stateless audit and stateful MCP calls |
| Risk | 20/25 | Stateful DB config changes, MCP restart dependency, sandbox isolation risk |
| Research | 8/20 | Exact prompts and commands already defined in playbook |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
