# ADV-002 -- Pre-computed hits routing

## 1. OVERVIEW

This scenario validates Pre-computed hits routing for `ADV-002`. It focuses on Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill.

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `ADV-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill
- Prompt: `Test skill advisor with pre-computed CocoIndex hits`
- Expected signals: JSON output is valid; `sk-git` appears in recommendations; its confidence is higher than without semantic hits (compare mentally with a plain run); `reason` references semantic boost
- Pass/fail: PASS if `sk-git` appears in recommendations with confidence reflecting semantic boost; PARTIAL if `sk-git` appears but confidence unchanged from baseline; FAIL if command errors or `sk-git` absent

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ADV-002 | Pre-computed hits routing | Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill | `Test skill advisor with pre-computed CocoIndex hits` | 1. `bash: python3 .opencode/skill/scripts/skill_advisor.py "deploy to production" --semantic-hits '[{"path":".opencode/skill/sk-git/SKILL.md","score":0.92}]' --show-rejections` -> 2. Inspect JSON output: `sk-git` should appear with boosted confidence | JSON output is valid; `sk-git` appears in recommendations; its confidence is higher than without semantic hits (compare mentally with a plain run); `reason` references semantic boost | Full JSON output; `sk-git` recommendation entry with confidence score | PASS if `sk-git` appears in recommendations with confidence reflecting semantic boost; PARTIAL if `sk-git` appears but confidence unchanged from baseline; FAIL if command errors or `sk-git` absent | Verify `--semantic-hits` JSON is valid (must be array of objects with `path` and `score`); check skill_advisor.py `SEMANTIC_BOOST_MULTIPLIER` config; run without `--semantic-hits` to compare baseline |

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../../manual_testing_playbook.md)

## 5. SOURCE METADATA

- Group: Skill Advisor Integration
- Playbook ID: ADV-002
- Canonical root source: `manual_testing_playbook.md`
- Snippet path: `snippets/05--skill-advisor-integration/002-pre-computed-hits-routing.md`
