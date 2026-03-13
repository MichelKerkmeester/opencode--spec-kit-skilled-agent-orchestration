---
title: "Tasks: 001-baseline-and-safety-rails"
description: "Phase 1 task breakdown for Hydra baseline hardening and safety-rail delivery."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "phase 1 tasks"
  - "baseline tasks"
  - "safety rails tasks"
importance_tier: "critical"
contextType: "general"
---
<!-- ANCHOR:document -->
# Tasks: 001-baseline-and-safety-rails

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Track A: Baseline Inventory and Scope Control

- [x] T001 Audit Phase 1 runtime, test, and documentation drift against the parent roadmap
- [x] T002 Define the Phase 1 scope boundary and handoff to Phase 2
- [x] T003 Create the Phase 1 Level 3+ documentation package

---

## Track B: Runtime and Tooling Hardening

- [x] T010 Add a working build script in `.opencode/skill/system-spec-kit/mcp_server/package.json`
- [x] T011 Isolate Hydra roadmap capability flags in `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts`
- [x] T012 Stabilize baseline snapshot behavior in `.opencode/skill/system-spec-kit/mcp_server/lib/eval/hydra-baseline.ts`
- [x] T013 Export reusable helpers in `.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts`
- [x] T014 Export reusable helpers in `.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts`
- [x] T015 Add schema compatibility validation in `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`

---

## Track C: Verification

- [x] T020 Add focused capability-flag coverage in `tests/hydra-capability-flags.vitest.ts`
- [x] T021 Add baseline helper coverage in `tests/hydra-baseline.vitest.ts`
- [x] T022 Add checkpoint-script coverage in `tests/migration-checkpoint-scripts.vitest.ts`
- [x] T023 Add schema-compatibility coverage in `tests/vector-index-schema-compatibility.vitest.ts`
- [x] T024 Run Phase 1 TypeScript and Vitest verification sweep
- [x] T025 Run manual baseline and graph phase smoke checks against built `dist`

---

## Track D: Documentation and Release Readiness

- [x] T030 Update feature catalog for Phase 1 baseline capabilities
- [x] T031 Update manual testing playbook with baseline procedures
- [x] T032 Update MCP README, install guide, telemetry docs, test docs, and environment variable reference
- [x] T033 Update the parent `015` planning docs to reflect the delivered hardening slice honestly
- [ ] T034 Decide whether residual baseline observability work remains inside Phase 1 or moves to a later tracked follow-up

---

## Coordination Checkpoints

- [x] T040 Confirm parent roadmap still treats phases 2-6 as planned work
- [x] T041 Record actual verification evidence in `implementation-summary.md`
- [ ] T042 Obtain maintainer sign-off on final Phase 1 handoff criteria

---

## Completion Criteria

- [ ] All required Phase 1 acceptance criteria are met
- [ ] No `[B]` blocked tasks remain
- [x] Delivered hardening slice is backed by automated verification
- [x] Documentation tells the truth about current status

---

## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`

<!-- /ANCHOR:document -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm predecessor phase gates are satisfied before implementation starts.
- Re-read `spec.md`, `plan.md`, and `decision-record.md` before touching code.
- Keep the phase boundary explicit; do not pull work forward from later phases.
- Record whether the task changes docs only or runtime behavior.

### Execution Rules

| Rule | Expectation |
|------|-------------|
| TASK-SEQ | Finish prerequisite tasks before dependent tasks |
| TASK-SCOPE | Stay within the files and outcomes listed for this phase |
| TASK-VERIFY | Do not mark execution complete without recorded evidence |
| TASK-DOCS | Update `implementation-summary.md` and `checklist.md` whenever evidence changes |

### Status Reporting Format

- `STARTED:` task id, owner, and target files
- `IN PROGRESS:` current checkpoint and remaining blocker-free work
- `BLOCKED:` blocker, evidence, and next decision needed
- `DONE:` evidence reference and handoff state

### Blocked Task Protocol

1. Stop work as soon as a predecessor gate, safety rule, or rollout assumption is violated.
2. Record the blocker in `tasks.md` with `[B]` and explain the impacted downstream work.
3. Update `implementation-summary.md` before handing the phase back for review.
<!-- /ANCHOR:ai-protocol -->
