# Iteration 005: Skill Advisor and Skill Graph Lane Fusion

## Focus

Evaluate advisor scoring fusion, ambiguity handling, freshness, and the path toward learned weights.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts:5`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts:24`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:42`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:148`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:270`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:101`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:141`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:101`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:15`

## Findings

- The lane registry now has five lanes: explicit author, lexical, graph causal, derived generated, and semantic shadow. Only the first four are live; semantic shadow weight is `0.00` (`lane-registry.ts:5`).
- Runtime weights are strict literal values, not learned or user-configurable online weights (`weights-config.ts:24`). That is a safe contract, but it constrains learned-fusion experiments to offline or shadow mode.
- Ambiguity is detected when the top-two confidence difference is <= 0.05 (`ambiguity.ts:7`). Fusion then exposes lane contributions and threshold pass/fail metadata when attribution is requested (`fusion.ts:356`, `advisor-recommend.ts:141`).
- Advisor availability is fail-open. If the graph is absent or unavailable, recommendations are empty with warnings rather than hard errors (`advisor-recommend.ts:101`). Status exposes freshness, sourceChanged, daemonAvailable, trustState, and lane weights (`advisor-status.ts:101`, `:140`).
- Skill graph queries support several relationship modes, but handler output sanitizes source paths and content hashes (`skill-graph/query.ts:15`, `:188`). That is appropriate for public responses, but hidden source metadata cannot directly support learned ranking diagnostics.

## Insights

Advisor fusion is now explainable enough to support an offline training corpus. The cleanest next step is not changing live weights; it is adding shadow-learned weights and comparing them against strict registry weights on ambiguous prompts.

## Open Questions

- What is the golden ambiguous-prompt corpus for skill advisor routing?
- Should semantic shadow graduate from weight 0 only after it improves recall without increasing false advisor activations?

## Next Focus

Inspect causal graph and deep-loop affordances for ranking, contradiction, and convergence signals.

## Convergence

newInfoRatio: 0.56. More repetition appears, but advisor-specific learned-weight constraints are new.

