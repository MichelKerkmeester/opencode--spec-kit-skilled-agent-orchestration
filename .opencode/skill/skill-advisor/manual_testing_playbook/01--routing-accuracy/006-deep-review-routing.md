---
title: "RA-006 -- Deep Review Routing"
description: "This scenario validates Deep Review Routing for `RA-006`. It focuses on deep review prompts routing to sk-deep-review and not to sk-deep-research."
---

# RA-006 -- Deep Review Routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RA-006`.

---

## 1. OVERVIEW

This scenario validates Deep Review Routing for `RA-006`. It focuses on deep review prompts routing correctly to sk-deep-review, with sk-deep-research absent from results.

### Why This Matters

If deep review prompts route to sk-deep-research instead, operators will enter an open-ended research loop when they need a focused code quality audit -- wasting time and producing the wrong artifact type.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RA-006` and confirm the expected signals without contradictory evidence.

- Objective: Deep review routes to sk-deep-review not sk-deep-research
- Real user request: `"deep review loop for release readiness"`
- Prompt: `As a routing accuracy operator, validate deep review routing against .opencode/skill/skill-advisor/scripts/skill_advisor.py "deep review loop for release readiness". Verify sk-deep-review is top-1 and sk-deep-research is absent. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: sk-deep-review as top-1, sk-deep-research absent or below threshold
- Pass/fail: PASS if sk-deep-review is top-1 and sk-deep-research absent; FAIL if sk-deep-research is top-1 or appears via graph sibling boost

---

## 3. TEST EXECUTION

### Prompt

`As a routing accuracy operator, validate deep review routing against .opencode/skill/skill-advisor/scripts/skill_advisor.py "deep review loop for release readiness". Verify sk-deep-review is top-1 and sk-deep-research is absent. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "deep review loop for release readiness"`

### Expected

sk-deep-review is top-1. sk-deep-research does NOT appear in results (sibling edge removed, no graph-based confusion between the two skills).

### Evidence

Capture the full JSON output showing the top-1 skill and confirming sk-deep-research is absent from the results array entirely.

### Pass / Fail

- **Pass**: sk-deep-review is top-1; sk-deep-research absent or below threshold
- **Fail**: sk-deep-research is top-1 or appears via graph sibling boost

### Failure Triage

Check that sibling edges between sk-deep-review and sk-deep-research have been removed in graph-metadata.json. Verify `.opencode/skill/skill-advisor/scripts/skill_advisor.py` is not confusing "review" and "research" keywords. Confirm `.opencode/skill/skill-advisor/scripts/skill-graph.json` does not contain stale sibling relationships.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine under test |
| `.opencode/skill/sk-deep-review/graph-metadata.json` | Graph metadata defining sk-deep-review signals |
| `.opencode/skill/sk-deep-research/graph-metadata.json` | Graph metadata for the competing sibling skill |

---

## 5. SOURCE METADATA

- Group: Routing Accuracy
- Playbook ID: RA-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--routing-accuracy/006-deep-review-routing.md`
