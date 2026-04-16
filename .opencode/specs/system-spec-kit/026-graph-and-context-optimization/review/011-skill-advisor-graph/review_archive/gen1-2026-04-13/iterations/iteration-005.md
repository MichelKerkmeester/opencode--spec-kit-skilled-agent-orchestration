# Iteration 005: D1 correctness deep pass on compiler validation semantics

## Focus
D1 Correctness deep pass on `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`, the checked-in `.opencode/skill/skill-advisor/scripts/skill-graph.json`, and the Section 3.3 damping constants consumed by `.opencode/skill/skill-advisor/scripts/skill_advisor.py`.

## Scorecard
- Dimensions covered: D1 Correctness
- Files reviewed: 6
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.35

## Verified claims
- Section 3.3's damping constants still match the implementation: enhances uses `0.3`, siblings `0.15`, depends_on `0.2`, family affinity `0.08`, and the boost floor remains `0.1`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/spec.md:145-147] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/plan.md:88-97] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:100-149]
- The checked-in `skill-graph.json` still matches the structure emitted by `compile_graph()` (`schema_version`, `generated_at`, `skill_count`, `families`, `adjacency`, `signals`, `conflicts`, `hub_skills`); this pass did not find a stale generated-artifact bug. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:388-455] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]
- Family classification is currently consistent with the compiler contract: metadata validation constrains `family` to the six allowed buckets and compilation emits those same sorted buckets into `families`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:107-117] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:390-402] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:440-454] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]

## Findings

### P0 - Blocker
- None.

### P1 - Required
- **F040**: `validate_skill_metadata()` does not enforce the edge-type-specific weight bands promised by the packet. Section 3.1 says `depends_on` / `prerequisite_for` must be `0.7-1.0`, `enhances` `0.3-0.7`, `siblings` `0.4-0.6`, and `conflicts_with` `0.5-1.0`, but the validator only checks that each weight is numeric and inside `[0.0, 1.0]`. Semantically invalid metadata such as `depends_on: 0.1` or `siblings: 0.9` will therefore pass `--validate-only` and feed incorrect boost strengths into runtime routing. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/spec.md:115-121] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:124-146] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:100-127]
- **F041**: `validate_edge_symmetry()` treats reciprocal edges as symmetric even when the weights disagree. For `depends_on` / `prerequisite_for` and `siblings`, the check only verifies that the reverse target exists; it never compares reciprocal weights or contexts. That means `A siblings B @0.6` and `B siblings A @0.4` pass as "symmetric", even though `skill_advisor.py` consumes those directional weights directly and will apply different transitive strengths depending on which side of the pair had the initial signal. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:267-295] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:100-127]

### P2 - Suggestion
- None.

## Ruled Out
- The current `hub_skills` list is internally consistent with the shipped `compute_hub_skills()` implementation; this pass did not find a fresh emitter bug there beyond the documentation drift already captured in F023. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:366-385] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]
- I did not find a family bucketing bug in the current graph: the compiler emits the six validated families and the checked artifact reflects those same buckets. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:107-117] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:390-402] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]

## Dead Ends
- Investigating the current checked-in `skill-graph.json` as a stale or hand-edited artifact went nowhere; recompilation from today's metadata reproduces the same structure, adjacency, family buckets, and hub list in the checked payload. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:388-455] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]

## Recommended Next Focus
Stabilization / convergence pass - all four review dimensions are now covered, so the next iteration should re-check active P0/P1 findings and decide whether the loop is ready to synthesize.
