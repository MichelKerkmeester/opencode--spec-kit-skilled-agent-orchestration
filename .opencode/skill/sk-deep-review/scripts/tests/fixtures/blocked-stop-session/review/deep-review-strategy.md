---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied to `review/` during initialization. Tracks review progress across iterations.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Serves as the persistent brain for this blocked-stop review fixture. Records which dimensions remain, what was found, what approaches failed, and where the next iteration should focus.

### Usage

- Init: Start from the review config and keep the reducer-owned anchors intact.
- Per iteration: Capture findings, blocked-stop history, and the next focus signal.
- Mutability: Mutable within this fixture only.
- Protection: Reducer-owned anchors remain machine managed.
- Ownership: Human explanation outside anchors, reducer updates inside anchors.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Blocked-stop fixture that exercises legal-stop gating, registry lineage, and dashboard surfacing for review mode.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- This fixture does not model synthesis completion.
- This fixture does not attempt to resolve any finding.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop only after all required dimensions are covered and no active P0 remains.
- Preserve blocked-stop evidence when legal-stop gates fail.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 1
- P1 (Required): 2
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Iteration files keep the finding lineage explicit across severity changes.
- The blocked-stop bundle preserves the legal-stop veto reasons in one event.

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- Convergence alone is insufficient when dimension coverage and P0 resolution gates still fail.

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data.

### Dashboard rendering bug in the progress table was not reproducible from the traced inputs. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Dashboard rendering bug in the progress table was not reproducible from the traced inputs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dashboard rendering bug in the progress table was not reproducible from the traced inputs.

### Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active.

### Replaying the same correctness trace with synthetic durations did not change the registry outcome. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Replaying the same correctness trace with synthetic durations did not change the registry outcome.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replaying the same correctness trace with synthetic durations did not change the registry outcome.

### The blocked-stop bundle itself is structurally complete, so the failure is not caused by missing event fields. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The blocked-stop bundle itself is structurally complete, so the failure is not caused by missing event fields.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The blocked-stop bundle itself is structurally complete, so the failure is not caused by missing event fields.

### Token-only request mutation did not suppress the export leak because the reviewerId trust boundary stayed intact. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Token-only request mutation did not suppress the export leak because the reviewerId trust boundary stayed intact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Token-only request mutation did not suppress the export leak because the reviewerId trust boundary stayed intact.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
- Serializer-only causes were ruled out once the export authorization path reproduced.

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
BLOCKED on: dimensionCoverageGate, p0ResolutionGate
Recovery: Resolve active P0 (F001) and cover traceability + maintainability dimensions before next iteration.
Address the blocking gates before the next iteration.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- This fixture is intentionally incomplete on traceability and maintainability coverage.
- F002 is expected to show a severity transition from P2 to P1.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-blocked-stop-fixture, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: fixture
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-04-11T12:00:00Z
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:review-boundaries -->
