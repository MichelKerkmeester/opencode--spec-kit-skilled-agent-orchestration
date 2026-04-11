---
title: "Tasks: Further Deep-Loop Improvements [008]"
description: "Completed Level 3 task record for the delivered Phase 008 runtime-truth, graph, reducer, fixture, and release-closeout work."
trigger_phrases:
  - "008"
  - "phase 8 tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Further Deep-Loop Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[P]` | Parallelizable during the original implementation |

**Task Format**: `T### Description` followed by concrete evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Consolidated the audit findings into the Phase 008 delivery scope. `[EVIDENCE: ../research/research.md; commit d504f19ca]`
- [x] T002 Finalized the three Phase 008 architectural decisions before the runtime wiring stabilized. `[EVIDENCE: commit 84a29f574; decision-record.md]`
- [x] T003 Established the shipped evidence chain across research, review, improve-agent, and shared graph surfaces. `[EVIDENCE: v1.6.0.0; v1.3.0.0; v1.2.0.0]`
- [x] T004 Captured the focused closing audit as a phase-local artifact. `[EVIDENCE: scratch/closing-review.md; commit c07c9fbcf]`
- [x] T005 Recorded the final release-readiness reconciliation work. `[EVIDENCE: commit f99739742]`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Contract Truth

- [x] T006 Research workflows gained blocked-stop and normalized pause emission on the visible path. `[EVIDENCE: .opencode/changelog/12--sk-deep-research/v1.6.0.0.md]`
- [x] T007 Review workflows gained the equivalent blocked-stop and normalized pause emission. `[EVIDENCE: .opencode/changelog/13--sk-deep-review/v1.3.0.0.md]`
- [x] T008 Improve-agent workflows gained journal wiring and a corrected CLI example. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.0.0.md]`
- [x] T009 Improve-agent shipped minimum data and replay counts before verdicts. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.0.0.md]`

### Graph Wiring

- [x] T010 Chose the canonical graph regime for convergence handling. `[EVIDENCE: decision-record.md]`
- [x] T011 Wired graph upsert and graph convergence into the live research path. `[EVIDENCE: .opencode/changelog/12--sk-deep-research/v1.6.0.0.md]`
- [x] T012 Wired graph upsert and graph convergence into the live review path. `[EVIDENCE: .opencode/changelog/13--sk-deep-review/v1.3.0.0.md]`
- [x] T013 Added session-scoped graph reads and dedicated isolation coverage. `[EVIDENCE: v1.6.0.0; v1.3.0.0; .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts]`
- [x] T014 Provisioned structural graph tooling on the live deep-research and deep-review paths. `[EVIDENCE: implementation-summary.md; decision-record.md]`

### Reducer Surfacing and Replay

- [x] T015 Research reducer surfaced blocked-stop and graph-convergence state in operator-facing outputs. `[EVIDENCE: .opencode/changelog/12--sk-deep-research/v1.6.0.0.md]`
- [x] T016 Review reducer surfaced blocked-stop and graph-convergence state, plus fail-closed handling and repeated-finding split. `[EVIDENCE: .opencode/changelog/13--sk-deep-review/v1.3.0.0.md]`
- [x] T017 Improve-agent reducer shipped replay consumers and sample-quality surfaces. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.0.0.md]`

### Fixtures and Release Close-out

- [x] T018 Added durable Phase 008 fixtures and new scenario coverage across all three skills. `[EVIDENCE: implementation-summary.md §What Was Built; three release notes]`
- [x] T019 Wrote all three skill release notes for Phase 008 packaging. `[EVIDENCE: v1.6.0.0; v1.3.0.0; v1.2.0.0]`
- [x] T020 Saved packet completion context after Phase 008 shipped. `[EVIDENCE: commit 38f07e065]`
- [x] T021 Closed the remaining P1 findings from the focused closing audit. `[EVIDENCE: commit c07c9fbcf]`
- [x] T022 Reconciled packet-level release-readiness surfaces to the shipped reality. `[EVIDENCE: commit f99739742]`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Research release evidence records active graph usage, blocked-stop surfacing, and fixture coverage. `[EVIDENCE: .opencode/changelog/12--sk-deep-research/v1.6.0.0.md]`
- [x] T024 Review release evidence records fail-closed reducer handling, graph usage, and fixture coverage. `[EVIDENCE: .opencode/changelog/13--sk-deep-review/v1.3.0.0.md]`
- [x] T025 Improve-agent release evidence records journal wiring, sample-quality, and replay consumers. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.0.0.md]`
- [x] T026 Dedicated graph and reducer suites exist for the phase. `[EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts; session-isolation.vitest.ts]`
- [x] T027 Focused closing audit captured the remaining Phase 008 release-readiness gaps. `[EVIDENCE: scratch/closing-review.md]`
- [x] T028 Closing-audit fixes were landed and documented. `[EVIDENCE: c07c9fbcf; f99739742]`
- [x] T029 The phase packet itself is aligned to the current Level 3 template. `[EVIDENCE: validate.sh --strict on this phase]`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All three skills have Phase 008 release evidence. `[EVIDENCE: T023-T025]`
- [x] The packet records both the initial phase delivery and the later closing-audit remediation. `[EVIDENCE: T027-T028]`
- [x] External references point only to real repo paths and phase-local artifacts. `[EVIDENCE: strict validation]`
- [x] The phase packet validates under the current Level 3 contract. `[EVIDENCE: T029]`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Document | Purpose |
|----------|---------|
| `spec.md` | Completed requirement and outcome record |
| `plan.md` | Delivered A-E passes plus audit-remediation view |
| `checklist.md` | Evidence-backed verification record |
| `decision-record.md` | Canonical Phase 008 design decisions |
| `implementation-summary.md` | Shipped outcome narrative and verification summary |
| `scratch/closing-review.md` | Focused audit that triggered the final remediation commits |

### AI Execution Protocol

#### Pre-Task Checklist

- [x] Ground packet claims in real release and phase-local artifacts. `[EVIDENCE: three release notes; scratch/closing-review.md]`
- [x] Use only current repo paths for all non-packet references. `[EVIDENCE: strict validation target]`

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SCOPE | Only phase-folder docs are edited in this closeout pass. |
| TASK-EVIDENCE | Every completed task uses a release note, commit, file path, or validator citation. |
| TASK-REALITY | Packet wording reflects shipped A-E delivery plus closing-audit remediation, not the original planning state. |
| TASK-REFERENCES | External references use explicit repo-relative paths only. |

#### Status Reporting Format

`Phase 008 [COMPLETE] — releases, fixtures, closing audit, remediation, and strict validation all reconciled`

#### Blocked Task Protocol

No blocked tasks remain in this closeout pass.
<!-- /ANCHOR:cross-refs -->
