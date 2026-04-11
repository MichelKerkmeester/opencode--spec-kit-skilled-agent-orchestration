---
title: "Tasks: Wave Executor [042.003]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "042.003"
  - "tasks"
  - "wave executor"
  - "segment planner"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Wave Executor

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

**Task Format**: `T### or T-WE-NEW-N [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the fan-out/join proof path before implementing any wave-mode runtime work.
- Confirm whether the task touches planner logic, workflow lifecycle, or merge verification.
- Confirm the exact large-target trigger being implemented for research or review.
- Confirm whether the task belongs to v1 heuristic segmentation or v2 graph-enhanced segmentation.
- Confirm which mandatory prepass artifact must exist before dispatch.
- Confirm how segment provenance will be preserved after merge.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `FANOUT-PROVEN` | No wave-execution task may proceed past design until fan-out/join capability is proven. |
| `REQ-LINKED` | Every task must map to at least one wave-executor requirement. |
| `LEAF-SAFE` | No task may move orchestration responsibilities into LEAF workers. |
| `SEGMENT-DETERMINISTIC` | Segment identity and order must be reproducible from the same inputs. |
| `GATED-ACTIVATION` | Wave mode must activate only for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity. |
| `BOARD-MACHINE-FIRST` | `board.json` is reducer-owned and the dashboard is derived; neither is a human-maintained strategy surface. |
| `MERGE-KEYED` | Merge contracts must key by `sessionId`, `generation`, `segment`, `wave`, and `findingId`, not append order. |
| `MERGE-AUDITABLE` | Segment merge must preserve provenance, dedupe, and conflict metadata. |

### Status Reporting Format
- `pending`: task has not started and still fits the current phase scope.
- `in-progress`: implementation or validation is underway.
- `blocked`: a dependency such as graph convergence or merge semantics is unresolved.
- `completed`: implementation and verification are both complete.

### Blocked Task Protocol
- If fan-out/join is unproven on the current YAML engine, block all wave-execution work beyond prototype or proof tasks.
- If Phase 002 graph convergence is not ready, block prune/promote work instead of inventing stop heuristics.
- If Phase 002 coverage graph is not operational, block v2 graph-enhanced segmentation and stay on v1 heuristic planning.
- If segment IDs are unstable between replay runs, block merge tasks until planner determinism is restored.
- If wave mode begins to alter the default small-target path, block release until the routing boundary is corrected.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Fan-Out/Join Proof

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T-WE-NEW-1 | Completed | REQ-000, REQ-002 | `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md` |

- [x] T-WE-NEW-1 Prototype or implement workflow fan-out/join capability so wave execution has a proven orchestration path before any wave-mode runtime build proceeds.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### v1 Deterministic Heuristic Segmentation

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T001 | Completed | REQ-001 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-review/references/loop_protocol.md` |
| T002 | Completed | REQ-001, REQ-006 | `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json` |
| T003 | Completed | REQ-003, REQ-004 | `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-review/references/state_format.md` |
| T-WE-NEW-2 | Completed | REQ-007 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/references/loop_protocol.md` |
| T-WE-NEW-3 | Completed | REQ-007 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md` |
| T-WE-NEW-4 | Completed | REQ-004 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-review/references/state_format.md` |
| T-WE-NEW-5 | Completed | REQ-006 | `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md` |

- [x] T001 Define v1 deterministic heuristic segmentation for review files and research domains, keeping segment identity and ordering reproducible.
- [x] T002 Add segment-plan versioning, activation-gate configuration, and strategy surfaces for research and review.
- [x] T003 Define reducer-owned `board.json`, a derived dashboard render, and segment-state artifact contracts.
- [x] T-WE-NEW-2 Build `hotspot-inventory.json` generation for review with file ranking, directory clusters, and coverage priorities.
- [x] T-WE-NEW-3 Build `domain-ledger.json` generation for research with source domains, authority levels, and cluster assignments.
- [x] T-WE-NEW-4 Define the JSONL merge contract with explicit key ordering and keyed dedupe semantics.
- [x] T-WE-NEW-5 Add activation gates so wave mode only activates for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### Phase 2b: Graph-Enhanced Segmentation and Lifecycle Integration

### v2 Graph-Enhanced Segmentation and Wave Lifecycle

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T004 | Completed | REQ-002 | `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
| T005 | Completed | REQ-005 | `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
| T006 | Completed | REQ-003, REQ-008 | `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` |
| T007 | Completed | REQ-006 | `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json` |
| T008 | Completed | REQ-006 | `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` |
| T009 | Completed | REQ-004, REQ-008 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-review/references/state_format.md` |

- [x] T004 Implement the shared wave lifecycle manager for fan-out, join, prune, promote, and merge transitions once T-WE-NEW-1 is proven.
- [x] T005 Wrap Phase 002 graph signals for per-segment convergence, pruning, and v2 graph-enhanced segmentation.
- [x] T006 Add reducer-owned coordination-board updates for conflicts, dedupe, promoted findings, `board.json`, and derived dashboard rendering.
- [x] T007 Wire research command and workflow surfaces for activation-gated wave mode.
- [x] T008 Wire review command and workflow surfaces for activation-gated wave mode.
- [x] T009 Implement segment JSONL lineage and deterministic merge helpers keyed by explicit identifiers.
<!-- /ANCHOR:phase-3 -->

---

## Phase 3: Verification

### Merge Proof and Recovery Hardening

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T010 | Completed | REQ-009 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` |
| T011 | Completed | REQ-004, REQ-008, REQ-009 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` |
| T012 | Completed | REQ-006, REQ-009 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |

- [x] T010 Create planner and lifecycle tests for fan-out/join proof, deterministic v1 segmentation, and gated wave transitions.
- [x] T011 Create merge tests that prove explicit-key provenance, dedupe, and conflict metadata survive repeated merges without trusting append order.
- [x] T012 Create resume and default-path regression tests so wave mode stays bounded to large-target execution and falls back cleanly when prerequisites are missing.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task remains mapped to a wave-executor requirement and concrete file set.
- [x] Fan-out/join proof remains a hard prerequisite for all wave-mode execution work.
- [x] Wave orchestration stays outside LEAF worker responsibilities.
- [x] Segment provenance, dedupe, and conflict tracking survive merge.
- [x] `board.json` remains reducer-owned and the dashboard remains derived.
- [x] Default single-stream deep research and deep review remain intact.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Implementation Plan**: See `plan.md`
- **Parent Packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
