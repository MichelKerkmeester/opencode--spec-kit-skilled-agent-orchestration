---
title: "GB-003 -- Ghost Candidate Prevention"
description: "This scenario validates Ghost Candidate Prevention for `GB-003`. It focuses on preventing graph boosts from creating ranked skills with no non-graph evidence."
---

# GB-003 -- Ghost Candidate Prevention

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GB-003`.

---

## 1. OVERVIEW

This scenario validates Ghost Candidate Prevention for `GB-003`. It focuses on preventing graph boosts from creating ranked skills with no non-graph evidence.

### Why This Matters

If graph-only candidates can appear from nothing, operators will receive recommendations that look connected in the graph but are not grounded in the actual request.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `GB-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify every returned skill has at least one non-graph reason
- Real user request: `"build something"`
- Prompt: `As a graph boost validation operator, validate ghost candidate prevention against .opencode/skill/skill-advisor/scripts/skill_advisor.py "build something" --threshold 0. Verify no returned skill relies on graph evidence alone and every result has at least one non-graph match reason. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: no result contains only `!graph:*` reasons, and each returned skill has lexical, phrase, semantic, explicit, or command evidence in addition to any graph reason
- Pass/fail: PASS if all results have non-graph evidence; FAIL if any result appears with graph-derived evidence only

---

## 3. TEST EXECUTION

### Prompt

`As a graph boost validation operator, validate ghost candidate prevention against .opencode/skill/skill-advisor/scripts/skill_advisor.py "build something" --threshold 0. Verify no returned skill relies on graph evidence alone and every result has at least one non-graph match reason. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "build something" --threshold 0`

### Expected

Every result has at least one non-graph match reason. No skill appears in the output purely because of `!graph:family`, `!graph:sibling`, or another graph-only boost.

### Evidence

Capture the full JSON output and inspect each `reason` field so the evidence clearly shows whether any result contains only graph-derived matches.

### Pass / Fail

- **Pass**: Every returned skill includes at least one non-graph evidence source
- **Fail**: Any returned skill appears with only graph-derived evidence

### Failure Triage

Review candidate construction and graph boost application order in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`. Confirm the compiled `.opencode/skill/skill-advisor/scripts/skill-graph.json` does not broaden families unexpectedly. Compare against regression fixture expectations in `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine that must suppress graph-only candidates |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled graph surface that can introduce family or sibling boosts |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Regression fixture set covering abstain and graph-safety expectations |

---

## 5. SOURCE METADATA

- Group: Graph Boosts
- Playbook ID: GB-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--graph-boosts/003-ghost-prevention.md`
