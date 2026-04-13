<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "Improve Graph Metadata Entity Quality - Tasks"
status: complete
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements"
    last_updated_at: "2026-04-13T14:24:00Z"
    last_updated_by: "codex"
    recent_action: "Completed deriveEntities improvements, focused tests, and repo-wide entity-quality verification"
    next_safe_action: "Reuse this phase if cross-spec entity leakage or runtime-name noise reappears"
---
# Tasks
## Notation <!-- ANCHOR:notation -->`[ ]` pending, `[x]` complete, `T-V*` verification-only.<!-- /ANCHOR:notation -->
## Phase 1 <!-- ANCHOR:phase-1 -->
- [x] T-01: Raise the `deriveEntities()` cap from `16` to `24`.
- [x] T-02: Add a current-folder scope guard with canonical-doc exceptions.
<!-- /ANCHOR:phase-1 -->
## Phase 2 <!-- ANCHOR:phase-2 -->
- [x] T-03: Reject bare runtime-name entities including `python`, `node`, `bash`, `sh`, `npm`, `npx`, `vitest`, `jest`, and `tsc`.
- [x] T-04: Add focused graph-metadata coverage for the cap, scope, rejection, and external-canonical-doc leak fixes.
<!-- /ANCHOR:phase-2 -->
## Phase 3 <!-- ANCHOR:phase-3 -->
- [x] T-05: Re-run the entity quality check and record before/after leak counts. Evidence: packet research baseline recorded `9` true cross-spec canonical-doc leaks, average `16.00` entities per active folder, and `1` suspicious runtime name (`python`); the post-refresh active scan now reports `0` scope leaks, average `23.89` entities per folder, and `0` runtime-name entities.
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
<!-- /ANCHOR:phase-3 -->
## Completion <!-- ANCHOR:completion -->Close when the nine known scope leaks are gone and useful local entities survive up to the new cap.<!-- /ANCHOR:completion -->
## Cross-Refs <!-- ANCHOR:cross-refs -->See `spec.md` for the bounded parser scope and `plan.md` for the parser-first rollout.<!-- /ANCHOR:cross-refs -->
