<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "Enrich Tier3 Prompt with Continuity Model Context - Tasks"
status: completed
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Added the continuity context paragraph and locked it with prompt-shape assertions"
    next_safe_action: "No further phase-local work required beyond packet-level follow-through"
---
# Tasks
## Notation <!-- ANCHOR:notation -->`[ ]` pending, `[x]` complete, `T-V*` verification-only.<!-- /ANCHOR:notation -->
## Phase 1 <!-- ANCHOR:phase-1 -->
- [x] T-01: Add one continuity-model paragraph to `buildTier3Prompt()` in `mcp_server/lib/routing/content-router.ts`.
- [x] T-02: Mention the resume ladder, canonical continuity target, eight categories, and the `metadata_only` target rule.
<!-- /ANCHOR:phase-1 -->
## Phase 2 <!-- ANCHOR:phase-2 -->
- [x] T-03: Keep the existing category list, refusal guidance, and merge-mode guidance intact outside the new paragraph.
- [x] T-04: Add focused prompt-shape assertions in `tests/content-router.vitest.ts`.
<!-- /ANCHOR:phase-2 -->
## Phase 3 <!-- ANCHOR:phase-3 -->
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`
- [x] T-05: Confirm no older `_memory.continuity` target wording remains in the prompt text.
<!-- /ANCHOR:phase-3 -->
## Completion <!-- ANCHOR:completion -->Close when the continuity paragraph is asserted by tests and the 8-category contract is unchanged.<!-- /ANCHOR:completion -->
## Cross-Refs <!-- ANCHOR:cross-refs -->See `spec.md` for the prompt contract and `plan.md` for the two-phase rollout.<!-- /ANCHOR:cross-refs -->
