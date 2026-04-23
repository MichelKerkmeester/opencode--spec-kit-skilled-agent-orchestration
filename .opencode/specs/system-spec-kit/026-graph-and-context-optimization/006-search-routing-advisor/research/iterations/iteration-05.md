## Iteration 05

### Focus
Intent-mapping regression pressure from phrase routing plus graph signal boosts: whether the stronger matching surfaces increase dependence on later safety checks.

### Findings
- The phrase-booster packet moved 24 tokenizer-broken multi-word entries into phrase routing and added 15 more phrase entries, including hyphenated forms that the token matcher could not represent safely. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/implementation-summary.md:60-72`
- Graph signal boosts now add per-skill boosts based on matched signal phrases and can accumulate to a capped `3.0` total boost for a skill. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:895-930`
- The graph packet also added relationship boosts and a `+0.15` uncertainty conflict penalty as explicit runtime behavior. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/implementation-summary.md:40-45`
- Because phrase routing and graph signal routing are both now stronger than the old token-only baseline, the system is more dependent on the post-boost threshold/conflict stages to suppress false-positive co-recommendations. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/implementation-summary.md:60-72`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:895-930`

### New Questions
- Does the current threshold pipeline correctly demote conflicting boosted skills after uncertainty rises?
- Which phrase-driven cases most often co-occur with graph-family boosts?
- Are there regression tests that combine phrase boosts with graph conflict metadata instead of testing them separately?
- Would logging pre- and post-penalty pass/fail states expose hidden over-routing cases?

### Status
converging
