<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "Validate Continuity Profile Weights - Tasks"
status: planned
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/006-continuity-profile-validation"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured implementation tasks for the continuity tuning phase"
    next_safe_action: "Execute the judged query build-out and continuity sweep"
---
# Tasks
## Notation <!-- ANCHOR:notation -->`[ ]` pending, `[x]` complete, `T-V*` verification-only.<!-- /ANCHOR:notation -->
## Phase 1 <!-- ANCHOR:phase-1 -->
- [ ] T-01: Add a 20-30 query judged continuity fixture in `mcp_server/lib/eval/k-value-analysis.ts`.
- [ ] T-02: Reuse the existing K grid and metrics helpers for the continuity benchmark.
<!-- /ANCHOR:phase-1 -->
## Phase 2 <!-- ANCHOR:phase-2 -->
- [ ] T-03: Extend `mcp_server/tests/k-value-optimization.vitest.ts` with the continuity sweep.
- [ ] T-04: Record the keep/change recommendation for continuity profile weights.
<!-- /ANCHOR:phase-2 -->
## Phase 3 <!-- ANCHOR:phase-3 -->
- [ ] T-05: Add the one-paragraph continuity model description to `mcp_server/lib/routing/content-router.ts`.
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/k-value-optimization.vitest.ts`
<!-- /ANCHOR:phase-3 -->
## Completion <!-- ANCHOR:completion -->Close when the judged sweep yields an explicit continuity recommendation and the prompt paragraph is in place.<!-- /ANCHOR:completion -->
## Cross-Refs <!-- ANCHOR:cross-refs -->See `spec.md` for scope and `plan.md` for the two-phase execution sequence.<!-- /ANCHOR:cross-refs -->
