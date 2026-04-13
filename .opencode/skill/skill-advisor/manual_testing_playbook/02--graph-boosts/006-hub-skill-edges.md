---
title: "GB-006 -- Hub Skill Edges"
description: "This scenario validates Hub Skill Edges for `GB-006`. It focuses on system-spec-kit surfacing its documentation companion skills through outbound graph edges."
---

# GB-006 -- Hub Skill Edges

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GB-006`.

---

## 1. OVERVIEW

This scenario validates Hub Skill Edges for `GB-006`. It focuses on system-spec-kit surfacing its documentation companion skills through outbound graph edges.

### Why This Matters

If the hub edges from system-spec-kit stop working, spec-folder requests will lose the documentation companion context that operators need to finish the task correctly.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `GB-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify system-spec-kit outbound edges surface sk-doc alongside the hub skill
- Real user request: `"spec folder documentation"`
- Prompt: `As a graph boost validation operator, validate hub skill edge behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "spec folder documentation" --threshold 0. Verify system-spec-kit and sk-doc both appear and that the relationship is visible through graph-derived evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: system-spec-kit and sk-doc both appear in the results, and at least one result shows graph-derived edge evidence
- Pass/fail: PASS if both skills appear with a visible edge relationship; FAIL if one is missing or the graph relationship never surfaces

---

## 3. TEST EXECUTION

### Prompt

`As a graph boost validation operator, validate hub skill edge behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "spec folder documentation" --threshold 0. Verify system-spec-kit and sk-doc both appear and that the relationship is visible through graph-derived evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "spec folder documentation" --threshold 0`

### Expected

system-spec-kit and sk-doc both appear in the ranked results. At least one of the returned skills includes a graph-derived reason showing the outbound edge relationship.

### Evidence

Capture the full JSON output showing the two skill entries, their confidence scores, and the graph-derived reason that links the hub skill to its documentation companion.

### Pass/Fail

- **Pass**: system-spec-kit and sk-doc both appear with visible graph edge evidence
- **Fail**: One skill is missing, or the output never shows the graph relationship

### Failure Triage

Check `.opencode/skill/system-spec-kit/graph-metadata.json` for the enhances edge to sk-doc. Verify `.opencode/skill/sk-doc/graph-metadata.json` still reflects the paired documentation relationship. Review graph boost application in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine that applies hub-skill graph boosts |
| `.opencode/skill/system-spec-kit/graph-metadata.json` | Hub skill metadata declaring the documentation-oriented enhances edge |
| `.opencode/skill/sk-doc/graph-metadata.json` | Documentation companion metadata expected to surface beside system-spec-kit |

---

## 5. SOURCE METADATA

- Group: Graph Boosts
- Playbook ID: GB-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--graph-boosts/006-hub-skill-edges.md`
