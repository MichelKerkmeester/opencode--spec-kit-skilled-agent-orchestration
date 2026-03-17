---
title: "Feature Specification: manual-testing-per-playbook governance phase [template:level_1/spec.md]"
description: "Phase 017 documents the governance manual test packet for the Spec Kit Memory system. It isolates five governance scenarios from the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "governance manual testing"
  - "phase 017 governance"
  - "feature flag governance tests"
  - "hybrid rag governance playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook governance phase

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
| **Predecessor Phase** | `016-tooling-and-scripts` |
| **Successor Phase** | `018-ux-hooks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual governance scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated governance packet, Phase 017 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single governance-focused specification that maps all five Phase 017 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| NEW-063 | Feature flag governance | [`../../feature_catalog/17--governance/01-feature-flag-governance.md`](../../feature_catalog/17--governance/01-feature-flag-governance.md) | `Audit feature flag governance conformance.` | `1) enumerate flags 2) verify age/limits/review cadence 3) record compliance gaps` |
| NEW-064 | Feature flag sunset audit | [`../../feature_catalog/17--governance/02-feature-flag-sunset-audit.md`](../../feature_catalog/17--governance/02-feature-flag-sunset-audit.md) | `Verify feature flag sunset audit outcomes.` | `1) compare documented disposition vs code 2) verify deprecated/no-op states 3) record deltas` |
| NEW-122 | Governed ingest and scope isolation (Phase 5) | [`../../feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md`](../../feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md) | `Validate Phase 5 governed ingest and retrieval isolation.` | `1) Attempt memory_save() with tenantId/sessionId but missing provenance fields and verify rejection 2) Save with full {tenantId,userId\|agentId,sessionId,provenanceSource,provenanceActor} metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review governance_audit rows` |
| NEW-123 | Shared-space deny-by-default rollout (Phase 6) | [`../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`](../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md) | `Validate Phase 6 shared-memory rollout controls.` | `1) Create space with shared_space_upsert({ spaceId, tenantId, name, rolloutEnabled:true }) 2) Call shared_memory_status() for a non-member and verify no accessible spaces 3) Attempt shared-space save/search as a non-member and verify rejection/filtering 4) Grant membership with shared_space_membership_set() 5) Verify shared access succeeds 6) Flip killSwitch:true and verify access is blocked again` |
| NEW-148 | Shared-memory disabled-by-default and first-run setup | [`../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`](../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md) | `Validate shared-memory default-off enablement and first-run setup.` | `1) Start MCP server without env var → call shared_memory_status() → verify enabled: false 2) Call shared_memory_enable() → verify enabled: true, alreadyEnabled: false, readmeCreated: true 3) Call shared_memory_enable() again → verify alreadyEnabled: true (idempotent) 4) Verify shared-spaces/README.md exists on disk 5) Restart MCP server (no env var) → call shared_memory_status() → verify enabled: true (DB persistence) 6) Set SPECKIT_MEMORY_SHARED_MEMORY=true env var → call shared_memory_status() without DB → verify enabled: true (env override) 7) Run /memory:shared with feature disabled → verify first-run setup prompt appears` |

### Out of Scope
- Executing the five governance scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-governance phases from `001-retrieval/` through `016-tooling-and-scripts/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 017 governance requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 017 governance execution plan and review workflow |
| `tasks.md` | Create | Phase 017 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 017 verification checklist for pre-implementation, testing, and documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document NEW-063 feature flag governance with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if all flags enumerated with governance metadata and compliance gaps identified |
| REQ-002 | Document NEW-064 feature flag sunset audit with its exact prompt, disposition-comparison command sequence, evidence target, and feature link. | PASS if all sunset dispositions match runtime behavior and deprecated flags have no side effects |
| REQ-003 | Document NEW-122 governed ingest and scope isolation with its exact prompt, provenance/scope command sequence, evidence target, and feature link. | PASS if missing provenance is rejected, valid governed save succeeds, cross-scope retrieval returns no hit, and audit rows exist |
| REQ-004 | Document NEW-123 shared-space deny-by-default rollout with its exact prompt, membership/kill-switch command sequence, evidence target, and feature link. | PASS if non-member is denied, member is allowed, and kill switch blocks access again |
| REQ-005 | Document NEW-148 shared-memory disabled-by-default and first-run setup with its exact prompt, enablement command sequence, evidence target, and feature link. | PASS if default is off, enable persists, idempotent, README created, restart persistence works, env override works, and command gate triggers |

No P1 items are defined for this phase; all five governance scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 governance tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for NEW-063, NEW-064, NEW-122, NEW-123, and NEW-148 will be collected.
- **SC-003**: Reviewers can audit every Phase 017 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) and review protocol (`../../manual_testing_playbook/review_protocol.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/17--governance/`](../../feature_catalog/17--governance/) | Supplies feature context for each governance scenario | Keep every test row linked to its mapped governance feature file |
| Dependency | MCP runtime plus governance sandbox corpus | Required to execute `memory_save`, `shared_memory_status`, `shared_memory_enable`, `shared_space_upsert`, and `shared_space_membership_set` scenarios safely | Run stateful tests in an isolated sandbox and preserve restart/checkpoint instructions in the plan |
| Risk | NEW-122 writes scoped memory records that could leak across test runs if sandbox isolation fails | High | Restrict provenance/scope saves to disposable sandbox tenant IDs and document rollback steps before execution |
| Risk | NEW-123 and NEW-148 depend on DB config state and MCP restarts that can persist between runs | Medium | Capture baseline DB config state, clear shared_memory_enabled flag between runs, and restore defaults before the next scenario |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which disposable tenant ID and user/agent combination should Phase 017 reviewers use for NEW-122 governed-ingest tests to avoid cross-contamination with existing memory records?
- Should NEW-148 DB-persistence restart be performed against the same MCP instance used for the preceding governance tests, or should it run in a clean process to avoid stale DB state from NEW-122 or NEW-123?
<!-- /ANCHOR:questions -->

---
