# Iteration 014: D3 checklist evidence replay

## Focus
D3 Traceability - replay CHK-020 through CHK-041 against the current `skill_advisor.py` runtime so the checklist's integration and behavioral evidence reflects the shipped advisor instead of older snapshots.

## Verified checks
- CHK-020, CHK-021, CHK-022, CHK-023, CHK-030, CHK-040, and CHK-041 still reproduce from the live advisor. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health` still reports `"skill_graph_loaded": true`; `python3 ... "code review"` still returns `sk-code-review` at `0.95`; `python3 ... "use figma"` still surfaces `!graph:depends(mcp-figma,0.9)` for `mcp-code-mode`; and the regression suite still passes `44/44` with `12/12` P0 cases green.
- CHK-033 remains legitimately deferred. The compiled graph still ships with an empty `conflicts` array, while `_apply_graph_conflict_penalty()` still exists and would raise uncertainty by `0.15` if any conflicting passing pair were later defined. [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:154] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:171]

## Findings

### P1 - Required
- **F130**: CHK-031's evidence string has gone stale. The checklist still says `"use figma"` proves the dependency pull-up with `mcp-code-mode at 0.92`, but the current live advisor returns the same dependency reason at `0.95`. The integration still works; the problem is that the checklist is freezing an old score and no longer serves as executable evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/checklist.md:79] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:120] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:127]
- **F131**: CHK-032's sk-code family-affinity example no longer reproduces. The checklist claims `"build full stack"` demonstrates `!graph:family(sk-code)`, but the exact prompt currently returns no recommendations, and the shipped regression prompt `"build full stack typescript service"` returns only `sk-code-opencode` without any family-affinity reason. That means the checklist is now pointing at a non-demonstrable proof point for the claimed behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/checklist.md:80] [SOURCE: .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:38] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:141] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:151]

## Ruled Out
- This is not a fresh integration break in graph loading, fallback handling, or regression safety. The health probe, `_load_skill_graph()` fallback path, and the graph-boost regression dataset still behave as the checklist says; only the behavioral-evidence examples for CHK-031/032 have drifted.
- This is not a hidden `conflicts` regression. The current compiled graph still defines no conflicting pairs, so the deferred CHK-033 row remains justified.

## Dead Ends
- None. Replaying the exact checklist prompts made the drift obvious quickly: one row now has a stale confidence number, and the other cites an example prompt that no longer demonstrates the claimed family-affinity evidence.

## Recommended Next Focus
Stabilization / convergence - the active D3 set now includes both the older packet-local checklist drift (F060/F061) and the newly replayed top-level behavioral-evidence drift (F130/F131), so the next pass should decide whether the registry is complete enough to synthesize the final report.
