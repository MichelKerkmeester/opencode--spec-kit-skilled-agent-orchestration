---
title: "Implementation Plan: 005 lifecycle manual testing"
description: "This Level 1 plan turns the lifecycle playbook rows into a runnable phase packet. It defines preconditions, sandbox controls, execution order, evidence collection, and review-ready verdict handling for nine lifecycle scenarios."
trigger_phrases:
  - "lifecycle plan"
  - "phase 005 plan"
  - "checkpoint testing"
  - "ingest lifecycle verification"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: 005 lifecycle manual testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Filesystem spec folder documentation |
| **Testing** | manual + MCP |

### Overview
Translate the lifecycle playbook rows into a single phase 005 execution plan that operators can follow without re-reading the full umbrella packet. The plan keeps execution ordered around preconditions, tool runs, evidence capture, and review-protocol verdicts while isolating destructive lifecycle scenarios inside a disposable sandbox.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent `../spec.md` and `../plan.md` reviewed for phase 005 scope.
- [x] Playbook rows for EX-015, EX-016, EX-017, EX-018, NEW-097, NEW-114, NEW-124, NEW-134, and NEW-144 identified.
- [x] Review protocol acceptance rules available for evidence and verdict formatting.
- [x] Feature catalog links confirmed for all nine lifecycle scenarios.
- [x] Sandbox-only requirement acknowledged for destructive tests.

### Definition of Done
- [ ] `spec.md` and `plan.md` document all nine lifecycle tests with prompt, command, evidence, and PASS criteria.
- [ ] Execution order separates non-destructive and destructive scenarios.
- [ ] Destructive steps define sandbox isolation, checkpoint naming, and rollback handling.
- [ ] Evidence expectations map cleanly to PASS/PARTIAL/FAIL review protocol outcomes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual lifecycle test execution pipeline

### Key Components
- **Preconditions package**: Sandbox spec folder, seed files, and checkpoint naming rules prepared before any lifecycle run.
- **Operator + MCP runtime**: Human-driven execution that issues the exact playbook prompt and command sequence.
- **Evidence bundle**: Tool outputs, filesystem checks, logs, and optional DB proofs captured per test ID.
- **Verdict review**: Review protocol converts collected evidence into PASS, PARTIAL, or FAIL without changing the scenario contract.

### Data Flow
`preconditions -> execute -> evidence -> verdict`

Preconditions are established first so each test starts from a known sandbox state. The operator then executes the exact manual prompt through the MCP runtime, captures the required evidence immediately after each command sequence, and closes the scenario with a verdict that references the playbook PASS rule and review protocol acceptance checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 Preconditions
- [ ] Confirm the sandbox spec folder, disposable test database, and seed markdown files needed for checkpoint and ingest scenarios.
- [ ] Prepare a fresh recovery target for startup and archival drills so committed, stale, archived, and restored states are observable.
- [ ] Record the checkpoint naming convention `pre-[test-id]-[action]` before any state-changing run.
- [ ] Verify required MCP tools are reachable: checkpoint, ingest start/status/cancel, health, and any supporting archival or recovery entry points.

### Phase 2 Non-Destructive Tests
- [ ] Run EX-015 and EX-016 first to confirm checkpoint creation and listing on clean sandbox state.
- [ ] Execute NEW-097, NEW-114, NEW-134, and NEW-144 with evidence capture focused on state transitions, validation errors, recovery roots, and advisory forecast fields.
- [ ] Treat outputs from these scenarios as baseline evidence for later destructive drills.
- [ ] Stop and reset the sandbox if any non-destructive prerequisite fails, rather than continuing into restore, delete, or archival changes.

### Phase 3 Destructive Tests
- [ ] Run EX-017, EX-018, and NEW-124 only inside a disposable sandbox backed by a fresh test database or checkpoint; never run destructive lifecycle tests against production data.
- [ ] Create a pre-test checkpoint named `pre-[test-id]-[action]` before each destructive scenario so restore or cleanup starts from a known point.
- [ ] Treat EX-018 as destructive by definition, and keep restore or archival mutations sandbox-only when validating EX-017 or NEW-124.
- [ ] After each destructive test, roll back by restoring the pre-test checkpoint or rebuilding the sandbox fixture before starting the next scenario.

### Phase 4 Evidence Collection and Verdict
- [ ] Capture prompt transcript, command output, and any filesystem, health, DB, or log evidence required by the playbook row.
- [ ] Evaluate each scenario against the review protocol: preconditions satisfied, commands executed as written, expected signals present, evidence readable, and rationale explicit.
- [ ] Record a PASS, PARTIAL, or FAIL verdict per test ID, then roll those outcomes into the phase-level lifecycle summary.
- [ ] Flag any missing evidence or unsafe sandbox handling as a blocker before release-readiness review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| EX-015 | Checkpoint creation | `Create checkpoint pre-bulk-delete` | manual/MCP |
| EX-016 | Checkpoint listing | `List checkpoints newest first` | manual/MCP |
| EX-017 | Checkpoint restore | `Restore checkpoint with merge mode` | manual/MCP |
| EX-018 | Checkpoint deletion | `Delete stale checkpoint by name` | manual/MCP |
| NEW-097 | Async ingestion job lifecycle | `Validate memory_ingest_start/status/cancel lifecycle.` | manual/MCP |
| NEW-114 | Path traversal validation | `Ingest a file using a path with ../ segments and verify rejection` | manual/MCP |
| NEW-124 | Automatic archival lifecycle coverage | `Validate automatic archival subsystem vector/BM25 parity and protected tier behavior.` | manual/MCP |
| NEW-134 | Startup pending-file recovery lifecycle coverage | `Validate startup pending-file recovery behavior across committed and stale files.` | manual/MCP |
| NEW-144 | Advisory ingest lifecycle forecast | `Validate ingest forecast contract and early-progress caveats.` | manual/MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../manual_testing_playbook/manual_testing_playbook.md` | Internal | Green | Exact prompts, commands, evidence, and PASS rules cannot be reconstructed safely |
| `../../manual_testing_playbook/manual_testing_playbook.md` §5 Review Protocol | Internal | Green | Verdict and evidence handling may drift from review expectations |
| `../../feature_catalog/05--lifecycle/` | Internal | Green | Feature traceability for the nine lifecycle scenarios is lost |
| MCP runtime with checkpoint and ingest tools | Runtime | Green | Lifecycle scenarios cannot be executed or validated as written |
| Disposable sandbox spec folder and test data | Runtime | Yellow | Destructive tests must pause until isolated fixtures exist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any destructive lifecycle scenario changes the sandbox unexpectedly, evidence becomes inconsistent, or production-adjacent data is touched.
- **Procedure**: Stop the run, restore the matching `pre-[test-id]-[action]` checkpoint or discard the disposable test database, rebuild the sandbox fixture, and rerun only after the unsafe condition is removed.
<!-- /ANCHOR:rollback -->

---
