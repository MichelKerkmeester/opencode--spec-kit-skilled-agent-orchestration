---
title: "Add Continuity Search Intent Profile - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [x] `shared/algorithms/adaptive-fusion.ts:60-141` contains a `continuity` profile with the research-defined weights. Evidence: `adaptive-fusion.ts` ships the `0.52 / 0.18 / 0.07 / 0.23` continuity profile.
- [x] The new profile is wired through an internal caller seam such as `mcp_server/lib/search/hybrid-search.ts:1226` and is not dead configuration. Evidence: `stage1-candidate-gen.ts` consumes `config.adaptiveFusionIntent`, and `search-utils.ts` forwards that intent into fusion.
- [x] No public intent-union or routing-surface files change in this narrow-scope phase. Evidence: continuity wiring is confined to internal adaptive fusion plus the Stage 3 lambda map; the public routing surfaces remain unchanged.
## P1 (Should Fix)
- [x] Adaptive-fusion and adaptive-ranking tests cover the new profile explicitly. Evidence: `adaptive-fusion.vitest.ts` and `adaptive-ranking.vitest.ts` both include continuity-specific assertions.
- [x] `mcp_server/tests/k-value-optimization.vitest.ts` includes continuity-specific prompts while the typed judged sweep remains unchanged. Evidence: `k-value-optimization.vitest.ts` now includes continuity queries, and `intent-classifier.vitest.ts` covers the added continuity lambda.
- [ ] The implementation order note in `../research/research.md:273-289` is respected so this phase lands after telemetry, length-penalty removal, and the rerank minimum change.
## P2 (Advisory)
- [ ] A follow-on note captures the separate public-intent expansion work if operator-facing APIs later need an explicit continuity intent.
- [ ] Retrieval tuning notes record that the string-typed K harness is the approved validation path for the narrow rollout.
