<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | level2-verify | compact -->
---
title: "Enrich Tier3 Prompt with Continuity Model Context - Execution Plan"
status: planned
parent_spec: 006-tier3-prompt-enrichment/spec.md
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/006-tier3-prompt-enrichment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the Tier 3 continuity prompt enrichment"
    next_safe_action: "Patch the prompt text in Phase 1, then add assertions in Phase 2"
---
# Execution Plan
## Summary <!-- ANCHOR:summary -->Enrich `buildTier3Prompt()` with a short continuity-model paragraph and verify the prompt shape directly.<!-- /ANCHOR:summary -->
## Quality Gates <!-- ANCHOR:quality-gates -->The phase only closes if the paragraph lands without altering category count, refusal guidance, or merge-mode guidance.<!-- /ANCHOR:quality-gates -->
## Architecture <!-- ANCHOR:architecture -->Keep the change inside the Tier 3 prompt text so classifier behavior shifts only through better context, not runtime rewiring.<!-- /ANCHOR:architecture -->
## Phases <!-- ANCHOR:phases -->This plan separates prompt text changes from verification updates.<!-- /ANCHOR:phases -->
## Phase 1
Add one continuity-model paragraph covering the resume ladder, canonical continuity target, 8 categories, and the `metadata_only` target rule.
## Phase 2
Add or update prompt-shape assertions so the new paragraph is checked by tests rather than left as an unguarded text edit.
## Testing <!-- ANCHOR:testing -->Run `npx tsc --noEmit` and `npx vitest run tests/content-router.vitest.ts` from `.opencode/skill/system-spec-kit/mcp_server`.<!-- /ANCHOR:testing -->
## Dependencies <!-- ANCHOR:dependencies -->Depends on the current prompt contract in `content-router.ts` and focused router test coverage in the mcp server package.<!-- /ANCHOR:dependencies -->
## Rollback <!-- ANCHOR:rollback -->If the prompt wording causes confusion or test churn, revert the paragraph and its assertions together.<!-- /ANCHOR:rollback -->
