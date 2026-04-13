---
title: "RA-008 -- Semantic Search Routing"
description: "This scenario validates Semantic Search Routing for `RA-008`. It focuses on correct routing of semantic search prompts to mcp-coco-index with confidence >= 0.80."
---

# RA-008 -- Semantic Search Routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RA-008`.

---

## 1. OVERVIEW

This scenario validates Semantic Search Routing for `RA-008`. It focuses on correct routing of codebase search and semantic discovery prompts to mcp-coco-index with confidence >= 0.80.

### Why This Matters

If semantic search prompts misroute, operators will use grep or manual file browsing instead of vector-based semantic search -- missing conceptually relevant code and degrading codebase exploration quality.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RA-008` and confirm the expected signals without contradictory evidence.

- Objective: Correct routing of search prompts to mcp-coco-index
- Real user request: `"find code that handles auth"`
- Prompt: `As a routing accuracy operator, validate semantic search routing against skill_advisor.py "find code that handles auth". Verify mcp-coco-index is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: mcp-coco-index as top-1, confidence >= 0.80
- Pass/fail: PASS if mcp-coco-index is top-1 with confidence >= 0.80; FAIL if different skill is top-1 or confidence < 0.80

---

## 3. TEST EXECUTION

### Prompt

`As a routing accuracy operator, validate semantic search routing against skill_advisor.py "find code that handles auth". Verify mcp-coco-index is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth"`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "semantic code search for rate limiting"`
3. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "search the codebase for middleware"`

### Expected

mcp-coco-index is the top-1 result with confidence >= 0.80 for all variants. Match reasons should include search/find/code-related keyword or phrase signals.

### Evidence

Capture the full JSON output showing skill name, confidence score, passes_threshold flag, and match reasons for each command.

### Pass / Fail

- **Pass**: mcp-coco-index is top-1 with confidence >= 0.80 for all prompts
- **Fail**: Different skill is top-1 or confidence < 0.80 for any prompt

### Failure Triage

Check mcp-coco-index graph-metadata.json for search/find/code trigger_phrases. Verify intent_signals cover semantic search keywords. Confirm no competing skill captures generic "find" or "search" terms.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine under test |
| `.opencode/skill/mcp-coco-index/graph-metadata.json` | Graph metadata defining mcp-coco-index signals and edges |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset with search routing cases |

---

## 5. SOURCE METADATA

- Group: Routing Accuracy
- Playbook ID: RA-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--routing-accuracy/008-semantic-search-routing.md`
