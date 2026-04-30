---
title: "Tasks: MCP Stress-Cycle Doc Cleanup"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Six-task list driving the 6 P2 advisory closures from the 011 deep-review."
trigger_phrases:
  - "002-mcp-stress-cycle-cleanup"
  - "validator hygiene"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/002-mcp-stress-cycle-cleanup"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Strict-validator closure pass"
    next_safe_action: "Keep validators green"
    completion_pct: 100
---

# Tasks: MCP Stress-Cycle Doc Cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

**Task Format**: `T### [REQ] Description. Evidence: observed artifact or command exit.`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** [REQ-001] Refresh parent 015-mcp-runtime-stress-remediation/resource-map.md to cover 18 children. Evidence: resource-map.md lists child folders `001`-`018`, updates summary totals to 43 references, marks `011` complete, and records this cleanup packet as the refresh owner.
- [x] **T002** [REQ-002] Soften "monotonic decay" wording in 011-post-stress-followup-research/research/research.md. Evidence: research synthesis says the sequence has an overall downward trajectory with rebounds at iterations 5 and 8, not strict monotonic decay.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T003** [REQ-003] Update HANDOVER-deferred.md so each entry either points downstream to 012-018 or stays deferred with explicit reason. Evidence: v1.0.2 items point to `012`-`018`; older 006 tuning, 007 v2, and client-side guard items remain deferred with rationale.
- [x] **T004** [REQ-004] Reconcile feature-catalog-impact-audit.md and testing-playbook-impact-audit.md against live catalog/playbook state. Evidence: audits include 2026-04-28 current-state reconciliation blocks and cite live `system-spec-kit` roots plus packet-018 residual owner.
- [x] **T005** [REQ-005] Reorganize context-index.md into cycle-phase groups. Evidence: 18 children grouped under Baseline, Research, Remediation, Rerun, Followup Research, and Planned Fixes.
- [x] **T006** [REQ-006] Author `010-stress-test-rerun-v1-0-2/findings-rubric.json` with per-cell scores, weights, baseline, and aggregate. Evidence: the sidecar contains all 30 cells, 4 equal-weight dimensions, score sum 201/240, and `percentRounded: 83.8`.
- [x] **T007** [REQ-006] Reference rubric sidecar from findings.md. Evidence: findings.md links to `findings-rubric.json` as the machine-readable replay sidecar.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T008** Run strict validator on this cleanup packet. Evidence: closure pass records the strict-validator command and exit code in the temporary hygiene summary.
- [x] **T009** Re-read the 011 review report and mark F-001..F-006 closed in implementation-summary.md. Evidence: implementation-summary.md includes an F-001..F-006 closure table.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All six advisory findings have recorded closure evidence.
- [x] Rubric sidecar replayability is documented.
- [x] Cleanup packet strict validator passes after template restructuring.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Implementation Summary**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
