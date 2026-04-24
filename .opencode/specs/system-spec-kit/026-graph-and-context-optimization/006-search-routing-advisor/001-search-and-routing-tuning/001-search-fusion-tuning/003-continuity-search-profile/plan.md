---
title: "...006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/plan]"
description: 'title: "Add Continuity Search Intent Profile - Execution Plan"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "plan"
  - "003"
  - "continuity"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
parent_spec: 003-continuity-search-profile/spec.md
status: complete
---
# Execution Plan
## Approach
This phase adds a dedicated `continuity` profile at the adaptive-fusion seam only. The research converged on a narrow rollout: add new weights in `shared/algorithms/adaptive-fusion.ts`, wire explicit internal callers to pass the new string intent, and avoid turning continuity into a public `memory_search` intent in the same patch.

The implementation should preserve the current 7-intent public surface and treat any broader classifier, router, or schema work as a separate follow-on. Supporting K-sweep coverage is useful, but it is validation for the narrow profile rather than a prerequisite for the earlier telemetry, length-penalty, or rerank-threshold phases.

## Steps
1. Add `continuity` to `shared/algorithms/adaptive-fusion.ts:60-141` with weights `semantic=0.52`, `keyword=0.18`, `recency=0.07`, and `graph=0.23`, following `../research/research.md:135-159,262-270`.
2. Wire only explicit internal continuity callers through `mcp_server/lib/search/hybrid-search.ts:1226` so adaptive fusion receives the new string intent without editing the public intent unions described in `../research/research.md:148-159`.
3. Confirm the phase does not touch `intent-classifier.ts`, `query-router.ts`, `artifact-routing.ts`, `tests/intent-classifier.vitest.ts`, or `tests/integration-138-pipeline.vitest.ts:321`, which the research names as the public-intent blast radius to avoid.
4. Add targeted coverage in `mcp_server/tests/adaptive-fusion.vitest.ts`, `mcp_server/tests/adaptive-ranking.vitest.ts`, and `mcp_server/tests/k-value-optimization.vitest.ts` so the new profile and the supporting continuity prompts stay validated per `../research/research.md:205-213,287-289`.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/adaptive-fusion.vitest.ts tests/adaptive-ranking.vitest.ts tests/k-value-optimization.vitest.ts`.
- Confirm no public intent enum, router, or artifact-routing files change as part of the narrow profile rollout.

## Risks
- Letting this phase silently expand into a public-intent refactor would blow past the safe scope defined in `../research/research.md:148-159,262-270`.
- Wiring the new profile to the wrong caller seam would create dead config that never affects continuity retrieval.
- Adding K-sweep coverage without keeping it string-typed could force premature changes to the typed judged-sweep path.
