---
title: "Gate C — Writer Ready"
description: "Gate C task ledger for the writer-critical path of phase 018."
trigger_phrases: ["gate c", "writer ready", "tasks", "phase 018", "parity proof"]
importance_tier: "critical"
contextType: "implementation"
level: "3+"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Closed Gate C task ledger against the shipped writer contract"
    next_safe_action: "Include Gate C packet docs in the commit-ready file list"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md"]
---
<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate C — Writer Ready

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `pending` | Historical marker only; no pending tasks remain |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Historical blocker marker only; no blocked tasks remain |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build `spec-doc-structure.ts` and wire the five new rule aliases into `validate.sh` (`mcp_server/lib/validation/spec-doc-structure.ts`, `scripts/spec/validate.sh`). [Evidence: source present in both files; `tests/spec-doc-structure.vitest.ts` passed on 2026-04-12]
- [x] T002 [P] Build `contentRouter` with Tier 1 rules, Tier 2 prototype support, and Tier 3 strict JSON fallback (`mcp_server/lib/routing/content-router.ts`). [Evidence: source present; `tests/content-router.vitest.ts` passed on 2026-04-12]
- [x] T003 [P] Build `anchorMergeOperation` with the five canonical merge modes and post-merge legality checks (`mcp_server/lib/merge/anchor-merge-operation.ts`). [Evidence: source present; `tests/anchor-merge-operation.vitest.ts` passed on 2026-04-12]
- [x] T004 Build `atomicIndexMemory` as the drop-in replacement for `atomicSaveMemory` (`mcp_server/handlers/save/atomic-index-memory.ts`). [Evidence: source present; `tests/atomic-index-memory.vitest.ts` and `tests/handler-memory-save.vitest.ts` passed on 2026-04-12]
- [x] T004b [P] Build `thinContinuityRecord` as the typed reader/writer for the `_memory.continuity` YAML sub-block with 14-field schema + 2048-byte budget enforcement per iter 005/024 (`mcp_server/lib/continuity/thin-continuity-record.ts`). [Evidence: source present; `tests/thin-continuity-record.vitest.ts` passed on 2026-04-12]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rewrite `memory-save.ts` around routed saves while keeping `withSpecFolderLock` unchanged (`mcp_server/handlers/memory-save.ts`). [Evidence: source present; `tests/memory-save-extended.vitest.ts` and `tests/handler-memory-save.vitest.ts` passed on 2026-04-12]
- [x] T006 Refactor `generate-context.ts` to the new routed writer path and reuse the `nested-changelog.ts` read-transform-write pattern (`scripts/memory/generate-context.ts`). [Evidence: source present; `scripts/tests/generate-context-cli-authority.vitest.ts` passed on 2026-04-12]
- [x] T007 [P] Add `_memory.continuity` to all level templates and keep the block within the iter 024 budget (`templates/level_{1,2,3,3+}/*.md`). [Evidence: template rollout verified on 2026-04-12; `tests/spec-doc-structure.vitest.ts` passed; packet strict validation passed]
- [x] T008 [P] Update save pipeline contracts to `AtomicIndex*` types (`mcp_server/handlers/save/types.ts`). [Evidence: source present; `tests/tool-input-schema.vitest.ts` and `tests/atomic-index-memory.vitest.ts` passed on 2026-04-12]
- [x] T009 [P] Adapt save helpers and schemas for doc-anchor identity, route hints, and continuity fields (`handlers/save/{create-record,dedup,post-insert,response-builder,validation-responses}.ts`, `handlers/causal-links-processor.ts`, `lib/validation/save-quality-gate.ts`, `schemas/tool-input-schemas.ts`, `handlers/memory-triggers.ts`). [Evidence: source present; `tests/create-record-identity.vitest.ts`, `tests/tool-input-schema.vitest.ts`, and `tests/handler-memory-save.vitest.ts` passed on 2026-04-12]
- [x] T010 N/A — concept removed by Phase 018 no-observation directive. [Evidence: Gate C now closes on routed writer correctness, strict validation, and targeted suites without a shadow-only proof/control-plane requirement]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Execute the current Gate C verification subset: validator, routing, merge, continuity, atomic index, save-handler, schema, and generator authority suites. [Evidence: `tests/spec-doc-structure.vitest.ts`, `tests/content-router.vitest.ts`, `tests/anchor-merge-operation.vitest.ts`, `tests/thin-continuity-record.vitest.ts`, `tests/atomic-index-memory.vitest.ts`, `tests/memory-save-extended.vitest.ts`, `tests/handler-memory-save.vitest.ts`, `tests/tool-input-schema.vitest.ts`, `tests/create-record-identity.vitest.ts` passed as 9 files / 215 tests on 2026-04-12; `scripts/tests/generate-context-cli-authority.vitest.ts` passed on 2026-04-12]
- [x] T012 Close Gate C with synchronized packet docs, green typechecks, strict validation, and verified Gate D handoff evidence. [Evidence: `npm run --workspace=@spec-kit/mcp-server typecheck` passed on 2026-04-12; `npm run --workspace=@spec-kit/scripts typecheck` passed on 2026-04-12; `validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready` passed on 2026-04-12]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All thirteen tasks are marked `[x]`. [Evidence: this file]
- [x] No `[B]` blocked tasks remain on validator, writer core, templates, or Gate C closeout. [Evidence: this file contains no active `[B]` markers]
- [x] Checklist evidence proves Gate C exit criteria and leaves Gate D as the next gate. [Evidence: `checklist.md` completed on 2026-04-12]
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
