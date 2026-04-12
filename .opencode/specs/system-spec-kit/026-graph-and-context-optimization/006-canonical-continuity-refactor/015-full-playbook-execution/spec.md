<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Phase 015 Playbook Coverage Accounting and Partial Execution"
description: "Account for the live system-spec-kit playbook inventory against the post-006 codebase, capture real handler-level evidence, and document where current runtime automation is only partial instead of complete."
trigger_phrases:
  - "playbook coverage accounting"
  - "manual testing run"
  - "phase 015 spec"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/015-full-playbook-execution"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the playbook coverage accounting packet and documented the live results"
    next_safe_action: "Use the failure inventory to drive follow-on remediation"
    blockers:
      - "Automated suite has two concrete failures"
      - "Most playbook scenarios are still unautomatable through direct handler execution"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:phase015-spec"
      session_id: "phase015-full-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How many active scenario files exist in the live filesystem"
level: 2
status: "completed"
parent: "006-canonical-continuity-refactor"
---
# Feature Specification: Phase 015 Playbook Coverage Accounting and Partial Execution

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-12 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `014-playbook-prompt-rewrite` |
| **Successor** | `016-deep-review-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root playbook inventory and earlier packet notes no longer match current reality closely enough to trust without execution. Phase 015 exists to account for the live playbook against the current Phase 006 codebase, capture packet-local evidence, and show exactly where handler automation stops being truthful or fully executable.

### Purpose
Produce an execution-backed coverage report for the full playbook surface and the requested automated suite, including honest partial-execution boundaries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute every active scenario file under `.opencode/skill/system-spec-kit/manual_testing_playbook/`
- Run the requested automated Vitest command
- Patch the manual runner only where it blocks truthful execution
- Write packet-local reporting docs for the outcome

### Out of Scope
- Rewriting playbook scenario content
- Feature catalog edits
- Runtime code remediation for any failures found

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` | Modify | Retarget output and support live playbook formats |
| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts` | Modify | Align fixture report metadata with the Phase 015 packet |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Modify/Create | Record the execution evidence in the phase packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute all active playbook scenario files | Final runner pass accounts for every live active scenario file |
| REQ-002 | Run the requested automated suite command | Packet includes the command, the observed failure evidence, and the executed subset counts |
| REQ-003 | Keep scope narrow | Only runner/fixture execution support plus packet docs are changed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Capture packet-local artifacts | Manual runner JSON/JSONL written under this phase scratch folder |
| REQ-005 | Record manual result classes honestly | `PASS`, `FAIL`, `SKIP`, and `UNAUTOMATABLE` totals are documented without inflation |
| REQ-006 | Document blockers clearly | Automated failures, stale playbook counts, and weak manual passes are called out in packet docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All live active playbook files are classified in the final manual result set.
- **SC-002**: The packet contains a concrete automated-suite failure inventory rather than a vague "suite failed" note.
- **SC-003**: The packet distinguishes truthful handler automation from operator-only or transport-dependent scenarios.

### Acceptance Scenarios

- **Given** the live manual playbook tree, **when** the final runner pass completes, **then** `297/297` active scenario files are present in the result set.
- **Given** the requested Vitest command, **when** the automated subset is replayed with stable per-file reporting, **then** the packet records the executed-subset counts and the failing files.
- **Given** the live playbook prose formats, **when** the runner parses numbered commands, multiple prompt blocks, and split Section 2/Section 3 scenarios, **then** no active scenario files are silently dropped.
- **Given** shell-, source-, or transport-driven scenarios, **when** the runner cannot truthfully express them as direct handler calls, **then** they are recorded as `UNAUTOMATABLE` instead of being inflated into passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Built `mcp_server/dist` handlers | Runner cannot dispatch live handlers without them | Rebuild with `npm run build` before final reporting |
| Risk | Playbook index drift | Packet could report stale scenario counts | Use filesystem-backed counts instead of trusting the root audit block |
| Risk | Overstating automation coverage | Would make the packet misleading | Preserve `UNAUTOMATABLE` when shell, source, or transport evidence cannot be truthfully synthesized from handler calls |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for the execution pass itself. Follow-on work belongs to remediation packets for the automated failures and the large manual `UNAUTOMATABLE` surface.
<!-- /ANCHOR:questions -->
