# Iteration 015: D2 Security confidence-calibration recheck

## Focus
D2 Security - re-check the graph-boost confidence calibration path in `skill_advisor.py`, with emphasis on `_graph_boost_count` accounting and the evidence-separation haircut for graph-derived evidence.

## Verified claims
- `GB-005` defines the target behavior narrowly: graph-heavy results should expose `_graph_boost_count`, receive a confidence discount when most reasons are graph-derived, and avoid outranking equivalent direct matches by graph evidence alone. [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/005-evidence-separation.md:26] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/005-evidence-separation.md:29] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/005-evidence-separation.md:46] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/005-evidence-separation.md:54]
- `_apply_graph_boosts()` and `_apply_family_affinity()` only add graph reasons to targets that already had a positive score before the graph pass, so the runtime cannot mint a zero-evidence recommendation from graph edges alone. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:93] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:95] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:102] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:112] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:122] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:141] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:147]
- `_graph_boost_count` is wired consistently for the shipped graph surfaces: every transitive and family boost appends a `!graph:`-prefixed marker, and the counter/haircut logic keys off that same prefix before applying the `> 50%` confidence discount. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:106] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:116] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:126] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:151] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1576] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1578] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1607] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1609]

## Findings
- No new F140+ findings. This pass did not find a graph-only confidence-bypass path in the shipped calibration logic.

## Ruled Out
- A strict graph-only threshold bypass is not possible in the current implementation because both graph boost helpers skip zero-base targets before adding graph evidence. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:95] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:102] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:112] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:122] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:147]
- Family-affinity reasons are not silently excluded from the guardrail; they are emitted as `!graph:family(...)` and therefore counted by `_graph_boost_count`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:151] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1578]
- In this review run, the documented `GB-005` prompt plus a 4,005-prompt pair sweep over shipped signal vocabulary produced no passing recommendation with `_graph_boost_count / _num_matches > 0.5`, so the current evidence-separation haircut appears to block strict graph-majority recommendations from clearing the default `0.8` threshold.

## Dead Ends
- None. Once the graph helpers were traced, the remaining work was bounded to runtime spot checks.

## Recommended Next Focus
Synthesis / convergence - D2 confidence calibration did not add F140+, so the active registry looks stable enough for final verdict synthesis around F060, F061, F080, F081, and F110.
