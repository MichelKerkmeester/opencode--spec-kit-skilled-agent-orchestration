# Iteration 32: Prototype Centroid Separation

## Focus
Measure inter-category cosine distance across the refreshed prototype library to see whether the corpus itself is now well separated or still semantically tight around the known routing seams.

## Findings
1. Prototype counts remain balanced at five entries per category, but centroid separation is still weakest between `narrative_progress` and `narrative_delivery` (`cosine 0.9084`, `distance 0.0916`). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [INFERENCE: packet-local lexical-vector centroid analysis over routing-prototypes.json]
2. The next closest centroid pair is `narrative_delivery` and `handover_state` (`0.8918`, `distance 0.1082`), which means the old handover and delivery language is still clustered tightly even after the targeted prototype refresh. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [INFERENCE: packet-local lexical-vector centroid analysis over routing-prototypes.json]
3. `decision` and `research_finding` also remain close (`0.8797`, `distance 0.1203`), which fits the remaining research, metadata, and source-of-truth vocabulary overlap seen in the benchmark replay. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [INFERENCE: packet-local lexical-vector centroid analysis over routing-prototypes.json]
4. The farthest centroid pairs involve the strongly structured categories, especially `task_update <-> metadata_only` (`distance 0.3882`) and `task_update <-> drop` (`distance 0.3606`). That confirms the prototype risk surface is concentrated in the narrative categories, not the structured ones. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [INFERENCE: packet-local lexical-vector centroid analysis over routing-prototypes.json]
5. The refreshed library is therefore improved enough for runtime correctness, but it is not globally well separated in embedding space. The router still needs heuristic help to keep the tightest narrative boundaries clean. [INFERENCE: synthesis across centroid distances and the post-implementation replay]

## Ruled Out
- Using balanced prototype counts as proof that the refreshed corpus is now semantically well separated.

## Dead Ends
- Treating centroid distance alone as a proxy for live routed accuracy.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1`

## Assessment
- New information ratio: 0.28
- Questions addressed: RQ-15
- Questions answered: none

## Reflection
- What worked and why: A simple lexical-vector pass was enough to quantify whether the prototype library really spread the categories apart.
- What did not work and why: Counts and labels still hide how much shared narrative vocabulary the categories retain.
- What I would do differently: Pair centroid analysis with nearest-neighbor prototype checks, because the riskiest off-category pair matters more than the average distance.

## Recommended Next Focus
Identify the riskiest off-category prototype pairs and confirm whether the new tests keep those specific examples on the correct side of the boundary.
