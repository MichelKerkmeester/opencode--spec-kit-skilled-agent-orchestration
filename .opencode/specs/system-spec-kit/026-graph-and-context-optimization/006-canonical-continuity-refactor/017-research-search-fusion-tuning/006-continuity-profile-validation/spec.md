<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | level2-verify | compact -->
---
title: "Validate Continuity Profile Weights"
status: planned
level: 2
type: implementation
parent: 017-research-search-fusion-tuning
created: 2026-04-13
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/006-continuity-profile-validation"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created Level 2 planning docs for continuity profile validation"
    next_safe_action: "Implement the judged continuity sweep and prompt update"
---
# Validate Continuity Profile Weights
## Metadata <!-- ANCHOR:metadata -->Parent `017-research-search-fusion-tuning`; Level 2; status planned; created 2026-04-13.<!-- /ANCHOR:metadata -->
## Problem <!-- ANCHOR:problem -->Continuity tuning still relies on mixed-intent evidence, and the Tier 3 prompt lacks an explicit continuity model paragraph.<!-- /ANCHOR:problem -->
## Scope <!-- ANCHOR:scope -->In scope: judged continuity queries, K sweep evaluation, continuity-profile recommendation, and one prompt paragraph in `k-value-analysis.ts`, `k-value-optimization.vitest.ts`, and `content-router.ts`. Out of scope: non-continuity retuning and taxonomy changes.<!-- /ANCHOR:scope -->
## Requirements <!-- ANCHOR:requirements -->
- REQ-001: Add 20-30 judged continuity-style queries with expected results.
- REQ-002: Run the existing `{10,20,40,60,80,100,120}` sweep against continuity judgments.
- REQ-003: Produce an explicit keep/change recommendation for continuity weights.
- REQ-004: Add one continuity-model paragraph to the Tier 3 prompt.
- REQ-005: Keep non-continuity intent logic unchanged in this phase.
<!-- /ANCHOR:requirements -->
## Success Criteria <!-- ANCHOR:success-criteria -->
- SC-001: Continuity tuning is justified by judged metrics instead of intuition.
- **Given** a resume-style query set, **when** the sweep runs, **then** every supported K value is scored.
- **Given** the sweep output, **when** the phase closes, **then** the continuity profile decision is explicit.
- **Given** Tier 3 prompt text, **when** continuity routing is reviewed, **then** the continuity model paragraph is present.
- **Given** non-continuity intents, **when** this phase lands, **then** their behavior remains unchanged.
<!-- /ANCHOR:success-criteria -->
## Risks <!-- ANCHOR:risks -->Synthetic continuity queries could overfit the recommendation, and prompt wording could drift from the judged evaluation model if both changes are not kept aligned.<!-- /ANCHOR:risks -->
## Questions <!-- ANCHOR:questions -->Open question: whether judged evidence confirms the current continuity weights or warrants a profile change.<!-- /ANCHOR:questions -->
