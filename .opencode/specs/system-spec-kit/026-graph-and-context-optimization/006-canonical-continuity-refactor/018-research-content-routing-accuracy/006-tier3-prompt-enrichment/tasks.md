<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "Enrich Tier3 Prompt with Continuity Model Context - Tasks"
status: planned
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/006-tier3-prompt-enrichment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured implementation tasks for Tier 3 prompt enrichment"
    next_safe_action: "Update the prompt text and add prompt-shape assertions"
---
# Tasks
## Notation <!-- ANCHOR:notation -->`[ ]` pending, `[x]` complete, `T-V*` verification-only.<!-- /ANCHOR:notation -->
## Phase 1 <!-- ANCHOR:phase-1 -->
- [ ] T-01: Add one continuity-model paragraph to `buildTier3Prompt()` in `mcp_server/lib/routing/content-router.ts`.
- [ ] T-02: Mention the resume ladder, canonical continuity target, eight categories, and the `metadata_only` target rule.
<!-- /ANCHOR:phase-1 -->
## Phase 2 <!-- ANCHOR:phase-2 -->
- [ ] T-03: Keep the existing category list, refusal guidance, and merge-mode guidance intact outside the new paragraph.
- [ ] T-04: Add focused prompt-shape assertions in `tests/content-router.vitest.ts`.
<!-- /ANCHOR:phase-2 -->
## Phase 3 <!-- ANCHOR:phase-3 -->
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`
- [ ] T-05: Confirm no older `_memory.continuity` target wording remains in the prompt text.
<!-- /ANCHOR:phase-3 -->
## Completion <!-- ANCHOR:completion -->Close when the continuity paragraph is asserted by tests and the 8-category contract is unchanged.<!-- /ANCHOR:completion -->
## Cross-Refs <!-- ANCHOR:cross-refs -->See `spec.md` for the prompt contract and `plan.md` for the two-phase rollout.<!-- /ANCHOR:cross-refs -->
