<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | level2-verify | compact -->
---
title: "Enrich Tier3 Prompt with Continuity Model Context"
status: complete
level: 2
type: implementation
parent: 002-content-routing-accuracy
created: 2026-04-13
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Closed the phase after the continuity prompt enrichment and prompt-shape verification landed"
    next_safe_action: "Reuse this phase if Tier 3 continuity wording drifts again"
---
# Enrich Tier3 Prompt with Continuity Model Context
## Metadata <!-- ANCHOR:metadata -->Parent `002-content-routing-accuracy`; Level 2; status complete; created 2026-04-13.<!-- /ANCHOR:metadata -->
## Problem <!-- ANCHOR:problem -->The Tier 3 classifier prompt lists categories and merge rules, but it does not currently explain the continuity model that resume routing follows.<!-- /ANCHOR:problem -->
## Scope <!-- ANCHOR:scope -->In scope: one continuity-model paragraph in `mcp_server/lib/routing/content-router.ts` plus prompt-shape coverage. Out of scope: K-sweep evaluation, new categories, or Tier 3 wiring changes.<!-- /ANCHOR:scope -->
## Requirements <!-- ANCHOR:requirements -->
- REQ-001: Add one prompt paragraph describing the resume ladder.
- REQ-002: Name `implementation-summary.md` as the canonical continuity target.
- REQ-003: Re-state that the router still chooses from the existing 8 categories.
- REQ-004: Explain that `metadata_only` targets `implementation-summary.md`.
- REQ-005: Preserve current category, refusal, and merge-mode contracts outside the new paragraph.
<!-- /ANCHOR:requirements -->
## Success Criteria <!-- ANCHOR:success-criteria -->
- SC-001: The final prompt includes the continuity-model paragraph without broader contract drift.
- **Given** the Tier 3 system prompt, **when** it is read after this phase, **then** the resume ladder is explicit.
- **Given** `metadata_only` routing, **when** the prompt is inspected, **then** it points to `implementation-summary.md`.
- **Given** the 8-category taxonomy, **when** the prompt is updated, **then** the category list remains unchanged.
- **Given** prompt-shape tests, **when** they run, **then** the new paragraph is asserted directly.
<!-- /ANCHOR:success-criteria -->
## Risks <!-- ANCHOR:risks -->The new paragraph could accidentally contradict existing routing language or reintroduce older `_memory.continuity` targeting phrasing.<!-- /ANCHOR:risks -->
## Questions <!-- ANCHOR:questions -->No open questions remain. The continuity paragraph is now guarded by the existing focused router prompt-shape coverage.<!-- /ANCHOR:questions -->
