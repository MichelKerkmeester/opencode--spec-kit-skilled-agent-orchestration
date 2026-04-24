---
title: "Execution Plan"
description: "This implementation plan captures Execution Plan for tier3 prompt enrichment."
trigger_phrases:
  - "tier3 prompt enrichment"
  - "content routing accuracy"
  - "execution plan"
  - "tier3 prompt enrichment plan"
  - "system spec kit"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | level2-verify | compact -->
---
title: "...6-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment/plan]"
description: 'title: "Enrich Tier3 Prompt with Continuity Model Context - Execution Plan"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "plan"
  - "006"
  - "tier3"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Closed the Tier 3 continuity prompt-enrichment phase"
    next_safe_action: "Reuse this phase if continuity-model prompt wording drifts again"
parent_spec: 006-tier3-prompt-enrichment/spec.md
status: complete
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
