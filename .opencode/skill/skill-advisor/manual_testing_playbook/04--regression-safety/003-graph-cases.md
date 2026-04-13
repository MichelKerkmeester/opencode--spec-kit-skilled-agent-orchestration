---
title: "RS-003 -- Graph-Specific Cases"
description: "This scenario validates Graph-Specific Cases for `RS-003`. It focuses on the dedicated graph regression cases staying green after metadata and boost changes."
---

# RS-003 -- Graph-Specific Cases

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RS-003`.

---

## 1. OVERVIEW

This scenario validates Graph-Specific Cases for `RS-003`. It focuses on the dedicated graph regression cases staying green after metadata and boost changes.

### Why This Matters

The graph-specific cases are the narrowest safety net for dependency pull-up, overlay boosting, and prerequisite compilation. If they fail, the graph layer has regressed even if general routing still looks healthy.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RS-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify all GRAPH-prefixed regression cases still pass
- Real user request: `"check the graph-specific regression cases only"`
- Prompt: `As a regression safety validation operator, validate graph-specific regression coverage against .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py with the canonical dataset. Verify P1-GRAPH-001, P1-GRAPH-002, and P1-GRAPH-003 are absent from the failures list. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: the regression report contains no failed cases whose IDs start with `P1-GRAPH-`, and the filtered command prints `All GRAPH cases pass`
- Pass/fail: PASS if every graph-specific case passes; FAIL if any GRAPH-prefixed case appears in failures

---

## 3. TEST EXECUTION

### Prompt

`As a regression safety validation operator, validate graph-specific regression coverage against .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py with the canonical dataset. Verify P1-GRAPH-001, P1-GRAPH-002, and P1-GRAPH-003 are absent from the failures list. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl 2>&1 | python3 -c "import sys,json; d=json.load(sys.stdin); [print(f'{c[\"id\"]}: PASS') for c in d.get('failures',[]) if 'GRAPH' in c['id']] or print('All GRAPH cases pass')"`

### Expected

The filtered command reports `All GRAPH cases pass`, which implies P1-GRAPH-001, P1-GRAPH-002, and P1-GRAPH-003 are absent from the failures list.

### Evidence

Capture the filtered command output and, if needed, the full JSON regression report showing an empty GRAPH-specific failure subset.

### Pass / Fail

- **Pass**: No GRAPH-prefixed case appears in the failures list
- **Fail**: Any GRAPH-prefixed case appears in the failures list

### Failure Triage

Inspect the GRAPH rows in `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`. Review the graph-related routing logic in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`. Re-run the failing GRAPH prompt directly and compare it to the compiled `.opencode/skill/skill-advisor/scripts/skill-graph.json`.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py` | Regression harness used to detect GRAPH-case failures |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Dataset containing P1-GRAPH-001 through P1-GRAPH-003 |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled graph surface that the GRAPH cases indirectly exercise |

---

## 5. SOURCE METADATA

- Group: Regression Safety
- Playbook ID: RS-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--regression-safety/003-graph-cases.md`
