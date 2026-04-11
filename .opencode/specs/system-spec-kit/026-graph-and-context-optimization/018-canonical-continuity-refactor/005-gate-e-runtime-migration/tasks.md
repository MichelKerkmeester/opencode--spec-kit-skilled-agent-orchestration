---
title: "Tasks: Gate E — Runtime Migration [system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/005-gate-e-runtime-migration/tasks]"
description: "Phased Gate E task list for canonical rollout, surface-parity batches, and CLI handback coordination."
trigger_phrases:
  - "tasks"
  - "gate e"
  - "runtime migration"
  - "canonical rollout"
  - "phase 018"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Gate E — Runtime Migration

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

- [ ] T001 Confirm entry-gate evidence: Gates A-D closed, dual-write shadow stable for at least 7 days, and the impact-analysis artifact is available (`../implementation-design.md`, `../resource-map.md`, `../research/iterations/iteration-040.md`)
- [ ] T002 Promote `shadow_only -> dual_write_10pct` and record the transition, hold window, and dashboards (`../research/iterations/iteration-034.md`)
- [ ] T003 Observe 24h at `dual_write_10pct`; halt if divergence, correctness-loss, or blackout-window rules fire (`../research/iterations/iteration-034.md`)
- [ ] T004 Promote `dual_write_10pct -> dual_write_50pct` after the hold clears (`../research/iterations/iteration-034.md`)
- [ ] T005 Observe 24h at `dual_write_50pct` and capture week-1 evidence for the packet tracker (`../research/iterations/iteration-040.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Promote `dual_write_50pct -> dual_write_100pct` and enforce the 48h observation window (`../research/iterations/iteration-034.md`)
- [ ] T007 Promote `dual_write_100pct -> canonical`; keep the legacy path read-only as verification substrate, not as the default (`../research/iterations/iteration-034.md`)
- [ ] T008 [P] Update command and workflow surfaces from resource-map surface E: `.opencode/command/memory/*.md`, `.opencode/command/spec_kit/*.md`, and workflow YAML assets
- [ ] T009 [P] Update agent and skill surfaces from resource-map surfaces E and F: `.opencode/agent/*.md`, `sk-*` skills, and the 44 system-spec-kit files called out in `../scratch/resource-map/06-skill-surface-exhaustive.md`
- [ ] T010 [P] Start top-level docs and README parity passes: root instructions, architecture and install docs, the MCP server overview, and the memory-relevant README set from `../scratch/resource-map/07-sub-readmes.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Finish all 160-plus mapped surface updates and resolve any remaining terminology drift against the file matrix (`../resource-map.md`, sections 8.1, 8.2, 8.5)
- [ ] T012 Update the 8 CLI handback files in one lockstep batch: each `cli-*` skill doc plus prompt-template asset, aligned to the shipped `generate-context.js` contract
- [ ] T013 Rewrite the 19 memory-relevant sub-READMEs and touch the 92 doc-parity README surfaces where terminology changed (`../scratch/resource-map/07-sub-readmes.md`)
- [ ] T014 Hold `canonical` for at least 7 days, verify all alert thresholds remain quiet, and capture week-2/week-4 archive-review checkpoints (`../research/iterations/iteration-034.md`, `../research/iterations/iteration-040.md`)
- [ ] T015 Prepare the optional `legacy_cleanup` handoff only if Gate F permanence conditions are already satisfied; otherwise close Gate E in `canonical`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All rollout-transition tasks are complete with evidence and no `[B]` blockers.
- [ ] All mapped surfaces, including CLI handback files and README parity sets, are updated or explicitly deferred with approval.
- [ ] The Gate E checklist shows `canonical` healthy for at least 7 days and rollback still available.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **ADR context**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
