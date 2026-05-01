# Iteration 013 — C3: Skill advisor recommendation quality

## Focus
I audited the checked-in skill advisor regression corpus and the local Python scorer path for false positives, false negatives, and confidence hedging. The main question was whether green regression metrics reflect correct routing behavior or fixture expectations that encode bad recommendations.

## Actions Taken
- Enumerated advisor-related files with `rg --files | rg 'skill_advisor|advisor|regression|fixture|fixtures'`.
- Read `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` in full.
- Read the regression harness in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py`, especially `run_case_inprocess()`, `evaluate_case()`, and `compute_metrics()`.
- Ran the regression harness against the fixture in both in-process and subprocess modes; all 102 runner-case evaluations passed.
- Generated a read-only per-case table from `evaluate_case()` to inspect top skills, confidence, and uncertainty for all 51 fixture rows.
- Traced the local scorer through `analyze_prompt()`, `filter_recommendations()`, `analyze_request()`, and `calculate_confidence()`.
- Verified the suspicious case with `skill_advisor.py --force-local --show-rejections -- "review and update this"`.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-013-C3-01 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:26` | The regression fixture expects `sk-code-review` for `review and update this`, and the advisor returns it with high confidence (`0.93`, uncertainty `0.28`). That is a bad recommendation for a write/edit prompt: `sk-code-review` says review use cases are findings/gate passes and explicitly excludes feature implementation without review intent at `.opencode/skill/sk-code-review/SKILL.md:30` and `.opencode/skill/sk-code-review/SKILL.md:36`. The scorer cause is visible in `analyze_request()`: token boosts are applied directly at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:2759`, `review` has a stronger single-skill boost at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:1256`, while `update` only gives `sk-code` `0.2` in the multi-skill map at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:1442`. `calculate_confidence()` then lets boosted scores cap at `0.95` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:2359`, so the false positive confidently passes `filter_recommendations()` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:2547`. | Change fixture line 26 to expect `sk-code` or to mark the case ambiguous, then add a write-intent override/penalty: when `review` co-occurs with edit verbs such as `update`, `fix`, `modify`, or `implement`, prefer `sk-code` unless the prompt also contains review-only terms like `findings`, `diff`, `PR review`, `security review`, or `no edits`. |

## Questions Answered
- Where does the advisor confidently recommend the wrong skill? The clearest checked-in example is fixture `P1-REVIEW-007` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:26`.
- Where does it correctly hedge with low confidence? `P0-UNC-001` abstains for `api chain mcp` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:7`; the paired confidence-only case at line 8 returns `mcp-code-mode` despite uncertainty `0.39`, which is expected because `filter_recommendations()` bypasses uncertainty in confidence-only mode at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:2556`.
- What dominates false positives? Broad review/audit lexical and intent boosts overpower weak implementation signals. In the concrete failing pattern, `review` maps directly to `sk-code-review`, while `update` is diluted across `mcp-code-mode`, `sk-git`, and `sk-code`.
- What dominates false negatives? None were observed in the 51-row fixture under the default threshold; all expected positive and abstain cases passed in both runner modes.

## Questions Remaining
- Does the native TypeScript scorer reproduce the same `review + edit verb` failure after projection/fusion, or is this only the Python compatibility path?
- How often do real prompts combine review verbs with implementation verbs beyond the single fixture case, especially `review and fix`, `audit and patch`, and `check then update`?
- Should the regression harness store per-case results in its JSON report so future audits do not need a custom diagnostic table?

## Next Focus
Follow up with a targeted corpus expansion around mixed-intent prompts: review-only, edit-only, and review-plus-edit. The useful next pass is not more broad fixture sampling; it is calibrating disambiguation rules between `sk-code-review`, `sk-code`, and `sk-code-opencode`.
