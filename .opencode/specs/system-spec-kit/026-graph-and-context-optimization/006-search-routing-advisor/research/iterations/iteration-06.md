## Iteration 06

### Focus
Graph-conflict penalty correctness: whether the conflict safeguard actually changes threshold outcomes after it increases uncertainty.

### Findings
- The advisor computes `passes_threshold` for each recommendation before applying the graph conflict penalty. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2829-2837`
- The conflict routine derives the set of conflicting recommendations from the already-frozen `passes_threshold` flags. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:960-970`
- For each conflicting recommendation, the routine then raises `uncertainty` by `0.15` but never recomputes `passes_threshold`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:972-975`
- This is not a theoretical guardrail only: the graph phase documents `_apply_graph_conflict_penalty()` as one of the shipped runtime controls for routing quality. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/implementation-summary.md:40-45`

### New Questions
- Are there production prompts where the penalty pushes uncertainty above the allowed threshold while the stale pass flag still remains `true`?
- Should the recomputation happen immediately after the penalty or should `passes_threshold` be derived lazily at sort time?
- Do any tests assert that conflict-penalized pairs stop passing dual-threshold gating?
- Could the same stale-state pattern exist after other late recommendation mutators?

### Status
new-territory
