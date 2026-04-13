---
title: "Add Continuity Search Intent Profile - Tasks"
status: planned
---
# Tasks
- [ ] T-01: Add the `continuity` weight profile to `shared/algorithms/adaptive-fusion.ts:60-141` with the `0.52 / 0.18 / 0.07 / 0.23` weights from `../research/research.md:137-141`.
- [ ] T-02: Wire explicit internal callers through `mcp_server/lib/search/hybrid-search.ts:1226` so adaptive fusion can receive `'continuity'` without changing the public search-intent API.
- [ ] T-03: Guard the phase boundary by confirming `intent-classifier.ts`, `query-router.ts`, `artifact-routing.ts`, `tests/intent-classifier.vitest.ts`, and `tests/integration-138-pipeline.vitest.ts:321` stay untouched, as required by `../research/research.md:148-159,262-270`.
- [ ] T-04: Add focused coverage in `mcp_server/tests/adaptive-fusion.vitest.ts` and `mcp_server/tests/adaptive-ranking.vitest.ts` for the new internal profile.
- [ ] T-05: Add continuity-specific prompts to `mcp_server/tests/k-value-optimization.vitest.ts` using the recovery-oriented examples from `../research/research.md:205-213`.
## Verification
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/adaptive-fusion.vitest.ts tests/adaptive-ranking.vitest.ts tests/k-value-optimization.vitest.ts`
