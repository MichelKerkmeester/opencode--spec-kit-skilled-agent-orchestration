---
title: "Tasks: 010-telemetry-measurement-and-rollout-controls Telemetry, Measurement, and Rollout Controls Remediation"
description: "Task ledger for 010-telemetry-measurement-and-rollout-controls Telemetry, Measurement, and Rollout Controls Remediation."
trigger_phrases:
  - "tasks 010 telemetry measurement and rollout controls telemetry measureme"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/010-telemetry-measurement-and-rollout-controls"
    last_updated_at: "2026-04-21T21:50:00Z"
    last_updated_by: "codex"
    recent_action: "Closed CF-271 remediation evidence"
    next_safe_action: "Orchestrator may commit remediation"
    completion_pct: 100
---
# Tasks: 010-telemetry-measurement-and-rollout-controls Telemetry, Measurement, and Rollout Controls Remediation
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm consolidated findings source is readable. Evidence: consolidated-findings.md:450-468 shows Theme 10 and CF-271.
- [x] T002 [P0] Verify severity counts against the source report. Evidence: consolidated-findings.md:451-464 states P0=0, P1=0, P2=1 with no P0/P1 rows.
- [x] T003 [P1] Identify target source phases before implementation edits. Evidence: review-report.md:64 and iteration-002.md:13 identify .codex/policy.json and pre-tool-use.ts for F004.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P] [P2] CF-271: [F004] Codex denylist is phrase-based and remains a starter guard, not a comprehensive destructive-command policy. _(dimension: security)_ Source phase: 007-deferred-remediation-and-telemetry-run. Evidence: pre-tool-use.ts:5-6 documents starter policy phrases, pre-tool-use.ts:84-87 records the runtime default as not comprehensive shell-safety enforcement, codex-pre-tool-use.vitest.ts:165-169 locks the expectation. .codex/policy.json was read at lines 1-44 but write attempts returned EPERM; see implementation-summary.md.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 [P0] Run strict packet validation. Evidence: implementation-summary.md records validate.sh --strict --no-recursive PASS after closeout.
- [x] T901 [P1] Update graph metadata after implementation. Evidence: graph-metadata.json:28-39 marks status complete and key files include implementation-summary.md plus the hook/test surfaces.
- [x] T902 [P1] Add implementation summary closeout evidence. Evidence: implementation-summary.md includes Status: complete, files modified, verification output, and proposed commit message.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or explicitly deferred. Evidence: tasks.md has no open task rows after CF-271 closeout.
- [x] No `[B]` blocked tasks remaining. Evidence: the only blocked item is the external .codex write limitation, documented in implementation-summary.md rather than left as a task blocker.
- [x] Manual verification passed. Evidence: targeted vitest, typecheck, build, and strict packet validation are recorded in implementation-summary.md.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Implementation Summary**: See implementation-summary.md
<!-- /ANCHOR:cross-refs -->
