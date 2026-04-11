---
title: "Tasks: Graph Testing and Playbook Alignment [042.006]"
description: "Completed task log for the graph verification and playbook alignment phase."
trigger_phrases:
  - "042.006"
  - "graph testing tasks"
importance_tier: "important"
contextType: "tasks"
---
# Tasks: Graph Testing and Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Read the Phase 002 graph-runtime surfaces and identify the CommonJS and TypeScript contracts that need integration coverage. (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`)
- [x] T002 Locate the live playbook trees and README files that need graph capability updates. (`sk-deep-research`; `sk-deep-review`; `sk-improve-agent`)
- [x] T003 Confirm the exact playbook filenames and verification-surface paths before packet closeout. (the seven graph-related playbook files plus the two Vitest suites)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the graph integration suite. (`.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts`)
- [x] T005 Add the graph stress suite. (`.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts`)
- [x] T006 Add research graph playbooks. (`.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md`; `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md`)
- [x] T007 Add review graph playbooks. (`.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md`; `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md`)
- [x] T008 Add improve-agent graph-adjacent playbooks. (`.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`; `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`; `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md`)
- [x] T009 Update graph capability references in the three affected skill READMEs. (`.opencode/skill/sk-deep-research/README.md`; `.opencode/skill/sk-deep-review/README.md`; `.opencode/skill/sk-improve-agent/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm the two Vitest suites and seven playbook files exist at the documented paths. (all paths cited in `spec.md` and `implementation-summary.md`)
- [x] T011 Record the verification surfaces and README updates in the packet docs with evidence. (`checklist.md`; `implementation-summary.md`)
- [x] T012 Run strict validation on the phase folder until it passes cleanly. (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Graph verification surfaces and playbook files recorded at live repo paths
- [x] Strict validation passes for the phase packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
