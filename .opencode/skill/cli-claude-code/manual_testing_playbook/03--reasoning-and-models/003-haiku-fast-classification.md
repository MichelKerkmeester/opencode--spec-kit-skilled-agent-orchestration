---
title: "CC-010 -- Haiku fast classification"
description: "This scenario validates Haiku fast classification for `CC-010`. It focuses on confirming Haiku handles batch classification quickly and cheaply."
---

# CC-010 -- Haiku fast classification

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-010`.

---

## 1. OVERVIEW

This scenario validates Haiku fast classification for `CC-010`. It focuses on confirming Haiku handles batch classification quickly and cheaply.

### Why This Matters

Haiku is the model of choice for batch classification, formatting and simple queries where speed matters more than depth. The cost differential vs Sonnet is approximately 10x - if Haiku is not measurably faster AND cheaper than Sonnet for a trivial batch task, the model selection routing in cli_reference.md and integration_patterns.md misleads orchestrators.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CC-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Haiku (`claude-haiku-4-5-20251001`) handles batch classification of error messages quickly (under 15s) and cheaply (>5x cheaper than Sonnet for the same prompt).
- Real user request: `Use Claude Code at the cheapest tier to bulk-categorize these 8 error messages by type - I just need labels, not deep analysis.`
- Prompt: `As an external-AI conductor needing fast bulk classification of 5-10 error messages by category (syntax/runtime/logic/config/network), dispatch claude -p --model claude-haiku-4-5-20251001 and capture the categorized output. Verify the response classifies every input item, completes in under 15 seconds, and reports a cost noticeably lower than the equivalent Sonnet dispatch. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator constructs a small fixed list of error messages, dispatches twice (once Haiku, once Sonnet for cost comparison), then verifies Haiku is faster AND cheaper.
- Expected signals: Every input error message receives a category label. Response time under 15 seconds. Cost (when JSON output captured) is at least 5x lower than the equivalent Sonnet call for the same prompt.
- Desired user-visible outcome: Verdict naming the runtime, cost differential and the label summary.
- Pass/fail: PASS if all 8 messages classified AND Haiku runtime < 15s AND Haiku cost < (Sonnet cost / 5). FAIL if any condition fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Construct a fixed 8-item error list to keep results comparable.
3. Run Haiku and Sonnet dispatches sequentially with the same prompt.
4. Compare runtime and cost.
5. Return a verdict naming the comparison.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-010 | Haiku fast classification | Confirm Haiku handles batch classification quickly (<15s) and cheaply (>5x cheaper than Sonnet) | `As an external-AI conductor needing fast bulk classification of 5-10 error messages by category (syntax/runtime/logic/config/network), dispatch claude -p --model claude-haiku-4-5-20251001 and capture the categorized output. Verify the response classifies every input item, completes in under 15 seconds, and reports a cost noticeably lower than the equivalent Sonnet dispatch. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: time claude -p "Classify each of these 8 error messages into exactly one category (syntax/runtime/logic/config/network) and return a numbered list: 1. TypeError: undefined is not a function 2. ECONNREFUSED 127.0.0.1:5432 3. Missing semicolon at line 42 4. ENV_VAR not set 5. Maximum call stack exceeded 6. ENOENT: no such file or directory 7. Cannot read property 'foo' of null 8. SyntaxError: unexpected token" --model claude-haiku-4-5-20251001 --output-format json 2>&1 > /tmp/cc-010-haiku.json` -> 2. `bash: time claude -p "Classify each of these 8 error messages into exactly one category (syntax/runtime/logic/config/network) and return a numbered list: 1. TypeError: undefined is not a function 2. ECONNREFUSED 127.0.0.1:5432 3. Missing semicolon at line 42 4. ENV_VAR not set 5. Maximum call stack exceeded 6. ENOENT: no such file or directory 7. Cannot read property 'foo' of null 8. SyntaxError: unexpected token" --model claude-sonnet-4-6 --output-format json 2>&1 > /tmp/cc-010-sonnet.json` -> 3. `bash: jq -r '.result' /tmp/cc-010-haiku.json \| grep -cE '^[0-9]+\.\s' \| tee /tmp/cc-010-count.txt` -> 4. `bash: jq -r '.cost' /tmp/cc-010-haiku.json /tmp/cc-010-sonnet.json` -> 5. `bash: jq -r '.duration' /tmp/cc-010-haiku.json` | Step 1: Haiku JSON written, time output captured; Step 2: Sonnet JSON written, time output captured; Step 3: count of numbered classification lines is 8; Step 4: Haiku cost is at least 5x lower than Sonnet cost; Step 5: Haiku duration < 15000 ms | `/tmp/cc-010-haiku.json`, `/tmp/cc-010-sonnet.json`, terminal `time` output for both runs, count file | PASS if all 8 messages classified AND Haiku duration < 15s AND Haiku cost < (Sonnet cost / 5); FAIL if any condition fails | 1. If classification count < 8, inspect raw output for missing items - the model may have grouped some; 2. If Haiku cost is not at least 5x lower than Sonnet, double-check the model id in JSON output to confirm Haiku actually ran; 3. If Haiku runtime exceeds 15s, network latency may be the cause - re-run and average |

### Optional Supplemental Checks

For a tighter comparison, also capture token usage from JSON metadata. Per-token cost differential between Haiku and Sonnet should align with the documented pricing tiers in references/cli_reference.md and references/claude_tools.md.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Models table (section 6) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | Fast Classification (Batch) template (section 10) |
| `../../references/integration_patterns.md` | Model Selection Strategy (section 6) and cost optimization examples |

---

## 5. SOURCE METADATA

- Group: Reasoning And Models
- Playbook ID: CC-010
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--reasoning-and-models/003-haiku-fast-classification.md`
