---
title: "Implementation Plan: manual-testing-per-playbook governance phase [template:level_2/plan.md]"
description: "Phase 017 defines the execution plan for five governance manual tests in the Spec Kit Memory system. It sequences preconditions, sandboxed execution, evidence capture, and review-protocol verdicting for governance-focused scenarios."
trigger_phrases:
  - "governance execution plan"
  - "phase 017 manual tests"
  - "feature flag governance verdict plan"
  - "hybrid rag governance review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook governance phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L2 |
| **Storage** | Filesystem spec folder + linked evidence artifacts |
| **Testing** | manual + MCP |

### Overview
This plan converts the five governance scenarios in the manual testing playbook into an ordered execution workflow for Phase 017. The phase covers process-oriented flag governance and audit verification first (063 and 064), then stateful governed-ingest and scope-isolation testing (122), and finally shared-memory rollout controls and first-run setup (123 and 148) which require MCP restarts and DB state management before verdict review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Exact prompts, command sequences, and pass criteria are loaded from [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md).
- [ ] Feature mappings for all 5 governance tests are confirmed against the cross-reference index and governance feature files.
- [ ] Verdict rules from [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) are loaded for PASS/PARTIAL/FAIL handling.
- [ ] Sandbox expectations are identified for stateful scenarios 122, 123, and 148.

### Definition of Done
- [ ] All 5 governance scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 5/5 scenarios for Phase 017 with no skipped test IDs.
- [ ] Any DB config mutations, scoped memory writes, or MCP restart side-effects are restored or explicitly documented before closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual governance test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, runtime baseline, DB config state snapshot, and sandbox/checkpoint setup.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_save`, `memory_search`, `shared_memory_status`, `shared_memory_enable`, `shared_space_upsert`, and `shared_space_membership_set`.
- **Evidence bundle**: Tool outputs, DB query results for `governance_audit` and `shared_space_members` tables, runtime logs, flag snapshots, and restart-persistence comparisons captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked governance feature files.
- [ ] Confirm MCP runtime access for `memory_save`, `memory_search`, `shared_memory_status`, `shared_memory_enable`, `shared_space_upsert`, and `shared_space_membership_set`.
- [ ] Record baseline DB config state (especially `shared_memory_enabled` flag and any existing `governance_audit` rows) before any stateful testing.
- [ ] Prepare disposable sandbox tenant and user/agent IDs for scoped-ingest tests and a clean DB config state for shared-memory enablement tests.

### Phase 2: Non-Destructive Tests
- [ ] Run 063 to audit feature flag governance conformance: enumerate all `SPECKIT_` flags, verify age and review cadence against the B8 governance targets, and capture any compliance gaps.
- [ ] Run 064 to verify sunset audit outcomes: compare documented dispositions (27 graduate, 9 dead, 3 active) against current `search-flags.ts` exports, confirm `isPipelineV2Enabled()` always returns `true`, and record deltas.

### Phase 3: Stateful Tests
- [ ] Run 122 only against disposable sandbox scope identifiers; attempt a save missing provenance fields and capture the rejection, then complete a valid governed save and verify `governance_audit` rows for both allow and deny outcomes before inspecting cross-scope retrieval filtering.
- [ ] Run 123 in sequence: create a shared space with `rolloutEnabled:true`, verify non-member denial, grant membership, verify access, then flip `killSwitch:true` and verify denial again. Capture DB state for `shared_space_members` and `shared_spaces` tables at each step.
- [ ] Run 148 from a clean shared-memory state: verify default-off, enable and confirm idempotency, check the generated shared-spaces README artifact on disk, restart MCP and confirm DB persistence, then verify env-var override. Finally, run `/memory:shared` with the feature disabled and capture the first-run setup prompt. Restore DB to pre-test state after all seven steps are complete.
- [ ] If sandbox isolation fails or DB state from a prior scenario would contaminate the next, stop execution and mark the scenario blocked instead of proceeding.

### Phase 4: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 5/5 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---------|---------------|--------------|----------------|
| 063 | Feature flag governance | `Audit feature flag governance conformance.` | manual |
| 064 | Feature flag sunset audit | `Verify feature flag sunset audit outcomes.` | manual |
| 122 | Governed ingest and scope isolation | `Validate Phase 5 governed ingest and retrieval isolation.` | MCP |
| 123 | Shared-space deny-by-default rollout | `Validate Phase 6 shared-memory rollout controls.` | MCP |
| 148 | Shared-memory disabled-by-default and first-run setup | `Validate shared-memory default-off enablement and first-run setup.` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/17--governance/`](../../feature_catalog/17--governance/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for governance and shared-memory tools | Internal | Yellow | Stateful governance scenarios cannot be executed or compared |
| Disposable sandbox tenant/user IDs and clean DB config state | Internal | Yellow | Scoped-ingest and shared-memory tests cannot run safely without cross-contamination |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scoped memory writes, DB config mutations, or shared-space state from 122/123/148 leave the governance environment in a state that could taint later scenarios or other test phases.
- **Procedure**: Delete disposable sandbox scoped memory records, reset `shared_memory_enabled` to its pre-test value in the DB `config` table, remove any test-created rows from `shared_spaces` and `shared_space_members`, restart the MCP runtime with default env var values, discard compromised evidence, and rerun only the affected scenarios after the baseline is clean again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──► Phase 2 (Non-Destructive) ──► Phase 3 (Stateful) ──► Phase 4 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | Non-Destructive, Stateful |
| Non-Destructive | Preconditions | Stateful |
| Stateful | Preconditions | Verdict |
| Verdict | Non-Destructive, Stateful | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 15-30 min |
| Non-Destructive Tests (063, 064) | Low | 30-60 min |
| Stateful Tests (122, 123, 148) | High | 60-120 min |
| Evidence Collection and Verdict | Medium | 30-60 min |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] Baseline DB config state recorded (shared_memory_enabled value)
- [ ] Sandbox tenant/user IDs prepared
- [ ] governance_audit row count captured before 122

### Rollback Procedure
1. Delete all disposable sandbox scoped memory records by tenantId.
2. Reset `shared_memory_enabled` in the DB `config` table to pre-test value.
3. Remove test-created rows from `shared_spaces` and `shared_space_members`.
4. Restart MCP runtime with default env var values (no SPECKIT_MEMORY_SHARED_MEMORY).
5. Discard compromised evidence artifacts.
6. Rerun affected scenarios from a clean baseline.

### Data Reversal
- **Has data mutations?** Yes (122 scoped memory writes, 123 shared space records, 148 DB config)
- **Reversal procedure**: Follow rollback procedure above; document any irreversible state before execution begins.
<!-- /ANCHOR:enhanced-rollback -->

---
