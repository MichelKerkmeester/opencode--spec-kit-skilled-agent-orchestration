<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | level2-verify | compact -->
---
title: "Validate Continuity Profile Weights - Execution Plan"
status: planned
parent_spec: 006-continuity-profile-validation/spec.md
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/006-continuity-profile-validation"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the judged continuity sweep and prompt enrichment work"
    next_safe_action: "Implement Phase 1 data setup, then Phase 2 evaluation and prompt changes"
---
# Execution Plan
## Summary <!-- ANCHOR:summary -->Add judged continuity evaluation to the existing K-sweep harness, then align the Tier 3 prompt with the same continuity model.<!-- /ANCHOR:summary -->
## Quality Gates <!-- ANCHOR:quality-gates -->The phase is complete only if the judged set covers 20-30 queries, the sweep produces an explicit recommendation, and the prompt paragraph ships without taxonomy drift.<!-- /ANCHOR:quality-gates -->
## Architecture <!-- ANCHOR:architecture -->Reuse the current K-analysis helpers and keep the runtime change isolated to `buildTier3Prompt()` in `content-router.ts`.<!-- /ANCHOR:architecture -->
## Phases <!-- ANCHOR:phases -->This plan is split into a benchmark-setup phase and an evaluation-plus-prompt phase.<!-- /ANCHOR:phases -->
## Phase 1
Create the 20-30 query judged continuity fixture and wire it into the existing sweep helpers without changing non-continuity intent behavior.
## Phase 2
Run the continuity sweep in tests, record the keep/change recommendation, and add the one-paragraph continuity model text to the Tier 3 prompt.
## Testing <!-- ANCHOR:testing -->Run `npx tsc --noEmit` and `npx vitest run tests/k-value-optimization.vitest.ts` from `.opencode/skill/system-spec-kit/mcp_server`.<!-- /ANCHOR:testing -->
## Dependencies <!-- ANCHOR:dependencies -->Depends on the existing K grid, continuity intent wiring, and targeted Vitest coverage in the mcp server package.<!-- /ANCHOR:dependencies -->
## Rollback <!-- ANCHOR:rollback -->If the judged set or prompt change proves noisy, revert the fixture and prompt paragraph together so evaluation and routing semantics stay aligned.<!-- /ANCHOR:rollback -->
