---
title: "Add Continuity Search Intent Profile - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] `shared/algorithms/adaptive-fusion.ts:60-141` contains a `continuity` profile with the research-defined weights.
- [ ] The new profile is wired through an internal caller seam such as `mcp_server/lib/search/hybrid-search.ts:1226` and is not dead configuration.
- [ ] No public intent-union or routing-surface files change in this narrow-scope phase.
## P1 (Should Fix)
- [ ] Adaptive-fusion and adaptive-ranking tests cover the new profile explicitly.
- [ ] `mcp_server/tests/k-value-optimization.vitest.ts` includes continuity-specific prompts while the typed judged sweep remains unchanged.
- [ ] The implementation order note in `../research/research.md:273-289` is respected so this phase lands after telemetry, length-penalty removal, and the rerank minimum change.
## P2 (Advisory)
- [ ] A follow-on note captures the separate public-intent expansion work if operator-facing APIs later need an explicit continuity intent.
- [ ] Retrieval tuning notes record that the string-typed K harness is the approved validation path for the narrow rollout.
