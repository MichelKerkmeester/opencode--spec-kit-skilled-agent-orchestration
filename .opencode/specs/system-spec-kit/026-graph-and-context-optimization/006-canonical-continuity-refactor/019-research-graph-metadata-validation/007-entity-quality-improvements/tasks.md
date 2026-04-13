<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "Improve Graph Metadata Entity Quality - Tasks"
status: planned
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/007-entity-quality-improvements"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured implementation tasks for entity quality improvements"
    next_safe_action: "Patch deriveEntities and add focused leak coverage"
---
# Tasks
## Notation <!-- ANCHOR:notation -->`[ ]` pending, `[x]` complete, `T-V*` verification-only.<!-- /ANCHOR:notation -->
## Phase 1 <!-- ANCHOR:phase-1 -->
- [ ] T-01: Raise the `deriveEntities()` cap from `16` to `24`.
- [ ] T-02: Add a current-folder scope guard with canonical-doc exceptions.
<!-- /ANCHOR:phase-1 -->
## Phase 2 <!-- ANCHOR:phase-2 -->
- [ ] T-03: Reject bare runtime-name entities including `python`, `node`, `bash`, and `sh`.
- [ ] T-04: Add focused graph-metadata coverage for the cap, scope, and rejection fixes.
<!-- /ANCHOR:phase-2 -->
## Phase 3 <!-- ANCHOR:phase-3 -->
- [ ] T-05: Re-run the entity quality check and record before/after leak counts.
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
<!-- /ANCHOR:phase-3 -->
## Completion <!-- ANCHOR:completion -->Close when the nine known scope leaks are gone and useful local entities survive up to the new cap.<!-- /ANCHOR:completion -->
## Cross-Refs <!-- ANCHOR:cross-refs -->See `spec.md` for the bounded parser scope and `plan.md` for the parser-first rollout.<!-- /ANCHOR:cross-refs -->
