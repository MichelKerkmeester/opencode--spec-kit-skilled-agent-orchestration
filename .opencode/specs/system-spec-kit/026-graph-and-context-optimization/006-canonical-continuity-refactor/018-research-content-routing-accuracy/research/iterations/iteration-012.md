# Iteration 12: Delivery And Progress Prototype Quality

## Focus
Measure whether the prototype library is actually helping separate `narrative_delivery` from `narrative_progress`, or whether the examples are too lexically close to each other.

## Findings
1. The prototype library is balanced by count, but delivery and progress are not especially well separated in language space. A packet-local lexical overlap pass found 45 shared tokens between the combined delivery and progress prototype sets, including `packet`, `phase`, `workflow`, `updated`, `runtime`, `same`, `pass`, and `sequencing`. That means the ambiguous vocabulary is present in both the heuristics and the Tier2 corpus. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [INFERENCE: packet-local lexical overlap script over `routing-prototypes.json` run during iteration 12]
2. The closest cross-category prototype pairings confirm that overlap. `NP-05` is closest to `ND-02`, and `NP-01` is closest to `ND-04`, which is exactly the delivery/progress confusion family the earlier corpus run measured. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:3] [INFERENCE: packet-local nearest-neighbor comparison over prototype token sets run during iteration 12]
3. `negativeHints` are documented on every prototype, but the current router does not consume them anywhere in live routing. They are present in the type shape and test fixtures, yet no production scoring path reads them. That means prototype distribution is doing all of its work through positive chunk text alone. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:151] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:343]
4. Phase `001` therefore needs two prototype-level changes in `routing-prototypes.json`: strengthen at least two delivery prototypes so they emphasize sequencing and gating without repeating implementation-change verbs, and tighten at least one progress prototype so it describes repository deltas without same-pass or rollout vocabulary. `ND-03`, `ND-04`, and `NP-05` are the most obvious candidates because they currently sit closest to the confusion boundary. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:45] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:11] [INFERENCE: packet-local nearest-neighbor comparison over prototype token sets run during iteration 12]

## Ruled Out
- Assuming balanced prototype counts are enough to prevent confusion in Tier2.

## Dead Ends
- Expecting `negativeHints` to already act as a live penalty signal.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:151`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:11`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:45`

## Assessment
- New information ratio: 0.68
- Questions addressed: RQ-7, RQ-10
- Questions answered: RQ-10

## Reflection
- What worked and why: A lightweight token-overlap pass was enough to show that the corpus itself reinforces the ambiguity the heuristics struggle with.
- What did not work and why: Prototype count balance obscured the fact that the actual wording clusters together.
- What I would do differently: Pair every future prototype-library review with a nearest-neighbor scan rather than only a per-category count check.

## Recommended Next Focus
Trace the exact handover and drop patterns that collide in the heuristic layer, because the same kind of cue-level asymmetry may be driving the second confusion pair.
