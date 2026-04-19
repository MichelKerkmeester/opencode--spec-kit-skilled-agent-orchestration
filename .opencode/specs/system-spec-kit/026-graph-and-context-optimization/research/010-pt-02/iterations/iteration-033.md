# Iteration 33: Riskeist Prototype Pairs After Refresh

## Focus
Find the nearest off-category prototype pairs after the corpus refresh, then compare those risks to the new boundary tests to see whether behavior improved faster than library separation.

## Findings
1. The riskiest off-category pair is still `ND-03` versus `HS-04` (`cosine 0.8244`, `distance 0.1756`). That keeps the delivery-versus-handover seam visibly alive inside the prototype space even after the refresh. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:65] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:157] [INFERENCE: packet-local nearest-neighbor scan over routing-prototypes.json]
2. The next risky pairs are `HS-01` versus `RF-05` (`0.7786`) and `NP-01` versus `ND-03` (`0.7590`), which means the refreshed corpus still clusters state-heavy blocker language near research findings and some implementation narratives near delivery mechanics. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:133] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:207] [INFERENCE: packet-local nearest-neighbor scan over routing-prototypes.json]
3. The live router nevertheless keeps the five specifically refreshed hotspot prototypes on the correct side of the boundary: `ND-03`, `ND-04`, `NP-05`, `HS-01`, and `HS-04` all pass the dedicated boundary test. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:503] [INFERENCE: targeted routing-only Vitest run]
4. That means the post-implementation improvement is behavior-first rather than corpus-first. The heuristics and floors now rescue the hardest pairs even though their embeddings remain close. [INFERENCE: synthesis across nearest-neighbor scan and routing-only tests]
5. The remaining prototype risk is therefore shorter or mixed fragments, not full hotspot prototypes that still land on the wrong side under normal router execution. [INFERENCE: synthesis across iterations 26, 29, and 32]

## Ruled Out
- Treating the refreshed hotspot prototypes as still behaviorally broken just because their embeddings remain close.

## Dead Ends
- Expecting prototype refreshes alone to remove the need for heuristic boundary rules in the narrative categories.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:65`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:133`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:503`

## Assessment
- New information ratio: 0.23
- Questions addressed: RQ-15
- Questions answered: RQ-15

## Reflection
- What worked and why: Nearest-neighbor inspection exposed the real prototype hotspots more clearly than centroid averages alone.
- What did not work and why: Prototype distance by itself cannot tell whether the live router now compensates correctly for the remaining overlap.
- What I would do differently: Keep one measurement for corpus geometry and a separate one for routed behavior, because the refresh improved those two layers by different amounts.

## Recommended Next Focus
Synthesize the remaining exact errors and identify the smallest next changes that would move the abbreviated-fragment behavior toward a defensible 95%+ story.
