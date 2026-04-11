---
title: "Gate C — Writer Ready"
description: "Gate C task ledger for the writer-critical path of phase 018."
trigger_phrases:
  - "gate c"
  - "writer ready"
  - "tasks"
  - "phase 018"
  - "shadow parity"
importance_tier: "critical"
contextType: "implementation"
level: "3+"
gate: "C"
parent: "018-canonical-continuity-refactor"
---
# Tasks: Gate C — Writer Ready

<!-- SPECKIT_LEVEL: 3+ -->
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

- [ ] T001 Build `spec-doc-structure.ts` and wire the five new rule aliases into `validate.sh` (`mcp_server/lib/validation/spec-doc-structure.ts`, `scripts/spec/validate.sh`)
- [ ] T002 [P] Build `contentRouter` with Tier 1 rules, Tier 2 prototype support, and Tier 3 strict JSON fallback (`mcp_server/lib/routing/content-router.ts`)
- [ ] T003 [P] Build `anchorMergeOperation` with the five canonical merge modes and post-merge legality checks (`mcp_server/lib/merge/anchor-merge-operation.ts`)
- [ ] T004 Build `atomicIndexMemory` as the drop-in replacement for `atomicSaveMemory` (`mcp_server/handlers/save/atomic-index-memory.ts`)
- [ ] T004b [P] Build `thinContinuityRecord` as the typed reader/writer for the `_memory.continuity` YAML sub-block with 14-field schema + 2048-byte budget enforcement per iter 005/024 (`mcp_server/lib/continuity/thin-continuity-record.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Rewrite `memory-save.ts` around routed saves while keeping `withSpecFolderLock` unchanged (`mcp_server/handlers/memory-save.ts`)
- [ ] T006 Refactor `generate-context.ts` to the new routed writer path and reuse the `nested-changelog.ts` read-transform-write pattern (`scripts/memory/generate-context.ts`)
- [ ] T007 [P] Add `_memory.continuity` to all level templates and keep the block within the iter 024 budget (`templates/level_{1,2,3,3+}/*.md`)
- [ ] T008 [P] Update save pipeline contracts to `AtomicIndex*` types (`mcp_server/handlers/save/types.ts`)
- [ ] T009 [P] Adapt save helpers and schemas for doc-anchor identity, route hints, and continuity fields (`handlers/save/{create-record,dedup,post-insert,response-builder,validation-responses}.ts`, `handlers/causal-links-processor.ts`, `lib/validation/save-quality-gate.ts`, `schemas/tool-input-schemas.ts`, `handlers/memory-triggers.ts`)
- [ ] T010 Activate `S1 shadow_only`, routing audit, and shadow-compare plumbing via the iter 034 control plane (`feature_flags`, telemetry/reducer surfaces)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Execute the iter 029 catalog: routing 120, merge 50, validator 25, resume 10, integration 25, regression 13 (tests and fixtures)
- [ ] T012 Prove >=95 percent golden-set parity, zero fingerprint rollback, a 7-day stable shadow window, and multi-agent governance sign-off (shadow reducers, dashboards, checklist evidence)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All thirteen tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain on validator, writer core, templates, or shadow proving
- [ ] Checklist evidence proves Gate C exit criteria and leaves Gate D as the next gate
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent packet evidence**: `../implementation-design.md`, `../resource-map.md`, `../scratch/resource-map/{02-handlers,03-scripts,04-templates}.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
