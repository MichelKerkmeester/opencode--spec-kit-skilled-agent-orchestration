---
title: "GB-005 -- Evidence Separation"
description: "This scenario validates Evidence Separation for `GB-005`. It focuses on confidence calibration lowering graph-heavy results when most match reasons are graph-derived."
---

# GB-005 -- Evidence Separation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GB-005`.

---

## 1. OVERVIEW

This scenario validates Evidence Separation for `GB-005`. It focuses on confidence calibration lowering graph-heavy results when most match reasons are graph-derived.

### Why This Matters

If graph-heavy results keep the same confidence as direct matches, graph overlays can look stronger than the literal evidence in the prompt and mislead operators about the real match quality.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `GB-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify graph-heavy results receive the expected confidence penalty
- Real user request: `"review web code"`
- Prompt: `As a graph boost validation operator, validate evidence separation against .opencode/skill/skill-advisor/scripts/skill_advisor.py "review web code" --threshold 0. Verify results with more than 50 percent graph reasons show the expected confidence penalty and do not outrank equivalent direct matches by graph evidence alone. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: graph-heavy results expose `_graph_boost_count`, direct-evidence results remain competitive, and recommendations with mostly graph reasons show reduced confidence
- Pass/fail: PASS if graph-heavy results show a reasonable confidence discount; FAIL if graph-heavy results keep the same or higher confidence than equivalent direct matches

---

## 3. TEST EXECUTION

### Prompt

`As a graph boost validation operator, validate evidence separation against .opencode/skill/skill-advisor/scripts/skill_advisor.py "review web code" --threshold 0. Verify results with more than 50 percent graph reasons show the expected confidence penalty and do not outrank equivalent direct matches by graph evidence alone. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "review web code" --threshold 0`

### Expected

Results with mostly graph-derived reasons expose `_graph_boost_count` in the raw output and show lower confidence than comparable results supported by direct lexical or phrase evidence.

### Evidence

Capture the full JSON output, including `_graph_boost_count`, reason fields, and confidence scores for the direct-match and graph-heavy recommendations you compare.

### Pass/Fail

- **Pass**: Graph-heavy results show a reasonable confidence discount instead of inflating past direct matches
- **Fail**: Results dominated by graph evidence keep the same or higher confidence than equivalent direct matches

### Failure Triage

Inspect the `_graph_boost_count` handling and confidence penalty in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`. Review the compiled graph surface in `.opencode/skill/skill-advisor/scripts/skill-graph.json` to confirm the graph reasons are legitimate. Compare the observed ranking against the prompt's direct match evidence.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Confidence calibration logic that penalizes graph-heavy recommendations |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled graph surface contributing graph-derived reasons |
| `.opencode/skill/sk-code-review/graph-metadata.json` | Representative direct-match metadata for review-oriented routing in this prompt family |

---

## 5. SOURCE METADATA

- Group: Graph Boosts
- Playbook ID: GB-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--graph-boosts/005-evidence-separation.md`
