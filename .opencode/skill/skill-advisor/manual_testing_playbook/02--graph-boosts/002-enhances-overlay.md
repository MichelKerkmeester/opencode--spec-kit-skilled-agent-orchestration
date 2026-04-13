---
title: "GB-002 -- Enhances Overlay"
description: "This scenario validates Enhances Overlay for `GB-002`. It focuses on review and OpenCode overlay skills boosting one another through enhances edges without collapsing into a single-result route."
---

# GB-002 -- Enhances Overlay

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GB-002`.

---

## 1. OVERVIEW

This scenario validates Enhances Overlay for `GB-002`. It focuses on review and OpenCode overlay skills boosting one another through enhances edges without collapsing into a single-result route.

### Why This Matters

If overlay boosts disappear, operators will miss the paired review and OpenCode guidance that should travel together on OpenCode-specific review work.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `GB-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify enhances edges surface both review and OpenCode overlay skills
- Real user request: `"review opencode typescript module"`
- Prompt: `As a graph boost validation operator, validate enhances overlay behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "review opencode typescript module" --threshold 0. Verify sk-code-review and sk-code-opencode both appear with visible !graph:enhances evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: sk-code-review or sk-code-opencode is top-1, the companion skill also appears, and at least one result shows a `!graph:enhances` reason
- Pass/fail: PASS if both overlay skills appear with graph enhances evidence; FAIL if only one appears or the graph relationship is absent

---

## 3. TEST EXECUTION

### Prompt

`As a graph boost validation operator, validate enhances overlay behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "review opencode typescript module" --threshold 0. Verify sk-code-review and sk-code-opencode both appear with visible !graph:enhances evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "review opencode typescript module" --threshold 0`

### Expected

sk-code-review or sk-code-opencode ranks first, the companion skill also appears in the results, and at least one result includes `!graph:enhances` in the reason field.

### Evidence

Capture the full JSON output showing both overlay skills, their confidence scores, and the enhances reason that links them.

### Pass/Fail

- **Pass**: Both overlay skills appear and the graph enhances relationship is visible in the reasons
- **Fail**: Only one skill appears, or the companion result lacks graph enhances evidence

### Failure Triage

Check the reciprocal enhances edges in `.opencode/skill/sk-code-review/graph-metadata.json` and `.opencode/skill/sk-code-opencode/graph-metadata.json`. Verify the compiled adjacency still contains those edges. Review enhances boost handling in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine that applies enhances boosts |
| `.opencode/skill/sk-code-review/graph-metadata.json` | Review overlay metadata declaring enhances links |
| `.opencode/skill/sk-code-opencode/graph-metadata.json` | OpenCode overlay metadata declaring the reciprocal enhances link |

---

## 5. SOURCE METADATA

- Group: Graph Boosts
- Playbook ID: GB-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--graph-boosts/002-enhances-overlay.md`
