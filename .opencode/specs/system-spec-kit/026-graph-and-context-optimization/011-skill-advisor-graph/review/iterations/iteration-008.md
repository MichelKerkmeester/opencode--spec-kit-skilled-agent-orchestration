# Iteration 008: D1 correctness stabilization on the non-routable `skill-advisor` graph node

## Focus
D1 Correctness - verify whether the compiled 21-node graph's `skill-advisor` self-entry can leak into live routing through `_apply_graph_boosts()` or `_apply_family_affinity()`.

## Scorecard
- Dimensions covered: D1 Correctness
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Verified claims
- The compiled graph really does carry a 21st `skill-advisor` node in the `system` family with broad outgoing `enhances` edges, but the advisor runtime only discovers routable records from top-level `*/SKILL.md` files. The `skill-advisor/` folder has README-based assets plus metadata/scripts, but no `SKILL.md`, so it is not part of the cached skill record set that later gets ranked. [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:93-96] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:165-188] [SOURCE: .opencode/skill/skill-advisor:1-6] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1005-1020]
- Graph boosts do not propagate through the non-routable node unless both the source and the target already exist in the pre-graph `snapshot`. `_apply_graph_boosts()` skips every target whose snapshot entry is missing or non-positive, so the dormant `skill-advisor -> *` edges cannot mint new candidates or amplify zero-score skills. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:83-128]
- Family affinity likewise does not create a `skill-advisor` candidate from the `system` family. `_apply_family_affinity()` only boosts members already present in `skill_boosts` with `0 < boost < 1.0`, and recommendation assembly later iterates only the discovered `skills` map. Even if a future change pre-seeded `skill-advisor`, the ghost node still would not appear in ranked output unless runtime discovery also started treating it as a real skill. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:131-151] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1516-1603] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:93-96] [SOURCE: .opencode/skill/skill-advisor:1-6]
- There is no alternate seed path from compiled graph `signals` or `prerequisite_for` edges into runtime routing. The advisor only reads `adjacency` for `enhances` / `siblings` / `depends_on` boosts and `conflicts` for uncertainty penalties, so the 21st node's unused metadata does not currently alter recommendation ordering. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:83-128] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:154-171] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1512-1514] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]

## Findings

### P0 - Blocker
- None.

### P1 - Required
- None.

### P2 - Suggestion
- None.

## Ruled Out
- The 21st node does not currently cause incorrect routing via graph-boost propagation or family affinity; the live mismatch remains an observability / packet-accuracy issue already covered by earlier traceability findings, not a fresh D1 behavior defect. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:83-151] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1538-1635] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:93-96] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:165-188] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]
- Re-checking prompts that mention routing or the graph does not surface a ghost `skill-advisor` recommendation because no `skill-advisor` record is ever materialized for the ranking loop to emit. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:93-96] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:165-188] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1538-1635]

## Dead Ends
- Trying to turn the 21st node into a live routing ghost without a code change went nowhere: the current guards require an existing positive snapshot entry before graph propagation or family affinity can do any work, and the ranking loop still only walks discovered skill records. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:83-151] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1538-1635] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:93-96]

## Recommended Next Focus
Synthesis / convergence - this D1 stabilization pass ruled out the suspected 21-node routing bug, so the remaining active blockers are still the packet traceability drifts already logged in F020-F023, F050-F052, and F060-F061.
