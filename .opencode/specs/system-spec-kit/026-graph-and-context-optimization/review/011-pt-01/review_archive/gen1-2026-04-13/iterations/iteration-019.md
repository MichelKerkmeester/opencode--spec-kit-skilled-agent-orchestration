# Iteration 019: D1 correctness stabilization on graph-boost snapshot ordering

## Focus
D1 Correctness - verify whether `_apply_graph_boosts()` or the later calibration/filter stages can compound graph-derived boosts within a single `analyze_request()` call.

## Scorecard
- Dimensions covered: D1 Correctness
- Files reviewed: 1
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Verified claims
- `_apply_graph_boosts()` snapshots the pre-graph `skill_boosts` map before it starts propagating. The loop iterates that frozen snapshot and only writes transitive boosts into targets that were already positive in the snapshot, so earlier writes in the same pass never become fresh seeds for later edges. That blocks same-pass A -> B -> C and A <-> B feedback compounding inside the graph pass itself. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:83-128]
- `_apply_family_affinity()` is a separate one-shot pass after graph propagation. For each family it computes the set of already-strong members before mutating weaker siblings, so affinity can add one bounded follow-on bump but cannot recursively amplify its own writes during the same family iteration. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:131-151]
- `analyze_request()` applies graph boosts and family affinity once, before corpus scoring, confidence calibration, the graph-dominance dampener, conflict-penalty handling, and threshold assignment. No later stage writes back into `skill_boosts`, and `analyze_prompt()` only calls `filter_recommendations()` on the finished recommendation list. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1449-1514] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1537-1641] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1681-1697]
- The remaining ordering defect on this pipeline surface is still the already-logged F001, not a new compounding bug: `_apply_graph_conflict_penalty()` runs before current-pass `passes_threshold` values are recomputed, so conflict penalties stay inert, but that defect is distinct from graph-boost feedback looping. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:154-171] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1590-1619]

## Findings

### P0 - Blocker
- None.

### P1 - Required
- None. Existing F001 remains unchanged and already captures the only live ordering defect on this analyze-request pipeline surface. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:154-171] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1590-1619]

### P2 - Suggestion
- None.

## Ruled Out
- Same-pass graph-derived compounding inside `_apply_graph_boosts()` is not present in the current advisor code because propagation always reads from a frozen snapshot and skips zero/missing targets. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:93-128]
- Neither calibration nor filtering re-enters graph propagation. After `_apply_graph_boosts()` and `_apply_family_affinity()` finish, the remaining stages only score, calibrate, penalize, threshold, rank, and filter recommendation records. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1537-1641] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1681-1697]

## Dead Ends
- Trying to reinterpret `filter_recommendations()` as a second boost phase went nowhere: it only recomputes `passes_threshold` under the caller's thresholds and optionally drops rejected recommendations; it never mutates `skill_boosts` or `boost_reasons`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1415-1441] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1681-1697]

## Recommended Next Focus
Synthesis / convergence - iteration 019 re-confirmed that the feedback-loop concern is ruled out and that F001 is already the only open ordering defect on the analyze-request pipeline, so the remaining blocking work is still the active packet and metadata drift set (F001, F060, F061, F080, F081, F090, F110, F130, F131, F150, F170).
