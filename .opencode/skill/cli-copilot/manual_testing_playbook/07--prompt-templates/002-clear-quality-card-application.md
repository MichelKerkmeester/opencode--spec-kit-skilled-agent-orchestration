---
title: "CP-019 -- CLEAR quality card application"
description: "This scenario validates the documented CLEAR 5-check and RCAF framework selection for `CP-019`. It focuses on confirming applying RCAF to a Generation task produces an answer that honours the requested Format slot."
---

# CP-019 -- CLEAR quality card application

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-019`.

---

## 1. OVERVIEW

This scenario validates the documented prompt-quality discipline for `CP-019`. It focuses on confirming that selecting RCAF (per the documented Task-to-Framework map for Generation tasks) and constructing a single-prompt dispatch using all four RCAF components (Role, Context, Action, Format) produces an answer that honours the requested Format slot exactly.

### Why This Matters

`assets/prompt_quality_card.md` is one of the two ALWAYS-loaded assets per SKILL.md §2 Smart Routing. The card is meant to deliver lightweight prompt quality without requiring the full `sk-improve-prompt` skill load. If the discipline does not actually improve outputs (i.e. Copilot ignores the Format slot even when it is explicit), the card's value is purely cosmetic. Verifying Format compliance via a strict JSON-keys check is the cheapest objective signal.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-019` and confirm the expected signals without contradictory evidence.

- Objective: Confirm applying RCAF (per `assets/prompt_quality_card.md` §3) produces an answer that honours the requested Format slot exactly (a JSON object with exact keys)
- Real user request: `Apply cli-copilot's prompt-quality discipline — pick RCAF for a generation task, build a prompt with all four RCAF slots, run the CLEAR 5-check, and verify Copilot's answer matches the requested Format.`
- Prompt: `As a cross-AI orchestrator following cli-copilot's prompt-quality discipline, look up the documented framework for a Generation task in assets/prompt_quality_card.md §3 (expect RCAF). Build a single-prompt dispatch using all four RCAF components (Role, Context, Action, Format) and run the CLEAR 5-check before dispatch. Verify Copilot's answer follows the requested Format and addresses the Action without inventing scope. Return a concise pass/fail verdict with the main reason, the framework chosen, and a one-line check that the requested Format was honoured.`
- Expected execution process: orchestrator captures pre-call tripwire, builds the RCAF-structured prompt with explicit JSON-format request, dispatches the call, then verifies the response is a JSON object with exactly the requested keys (`name`, `purpose`, `flag`)
- Expected signals: `EXIT=0`. Response is a JSON object with exactly the requested keys (`name`, `purpose`, `flag`). Each key has a non-empty value. Tripwire diff is empty
- Desired user-visible outcome: PASS verdict + a one-line note such as `framework=RCAF; format honoured (JSON keys: name, purpose, flag)`
- Pass/fail: PASS if EXIT=0 AND response parses as JSON AND has exactly the 3 expected keys AND each key non-empty AND tripwire diff empty. FAIL if response is not JSON, missing/extra keys, empty values or project tree mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate the prompt-quality discipline (RCAF + CLEAR) actually improves Format compliance".
2. Stay local: this is a direct CLI dispatch with an RCAF-structured prompt.
3. Capture pre-call tripwire.
4. Construct the RCAF prompt: Role (cli-copilot reviewer), Context (Copilot CLI flag inventory), Action (return one flag as JSON), Format (exact 3-key JSON object).
5. Dispatch, parse the response with `jq`, verify exact keys and non-empty values.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-019 | CLEAR quality card application | Confirm applying RCAF (per `assets/prompt_quality_card.md` §3) produces an answer that honours the requested Format slot exactly | `As a cross-AI orchestrator following cli-copilot's prompt-quality discipline, look up the documented framework for a Generation task in assets/prompt_quality_card.md §3 (expect RCAF). Build a single-prompt dispatch using all four RCAF components (Role, Context, Action, Format) and run the CLEAR 5-check before dispatch. Verify Copilot's answer follows the requested Format and addresses the Action without inventing scope. Return a concise pass/fail verdict with the main reason, the framework chosen, and a one-line check that the requested Format was honoured.` | 1. `bash: git status --porcelain > /tmp/cp-019-pre.txt` -> 2. `bash: copilot -p "Role: you are a Copilot CLI flag-reference summariser. Context: cli-copilot supports flags like -p, --allow-all-tools, --no-ask-user, --model, --target. Action: pick exactly ONE flag and describe it. Format: return ONLY a JSON object on a single line with exactly these three keys (no others, no markdown fences, no commentary): name (the flag with leading dashes), purpose (one short sentence), flag (the same string as name)." --model claude-sonnet-4.6 2>&1 | tee /tmp/cp-019-raw.txt; echo "EXIT=$?"` -> 3. `bash: grep -oE '\{[^}]*\}' /tmp/cp-019-raw.txt | head -1 > /tmp/cp-019-out.json; cat /tmp/cp-019-out.json; jq -e '.name and .purpose and .flag' /tmp/cp-019-out.json && jq -r 'keys | join(",")' /tmp/cp-019-out.json && git status --porcelain > /tmp/cp-019-post.txt && diff /tmp/cp-019-pre.txt /tmp/cp-019-post.txt` | Step 1: pre-tripwire captured; Step 2: EXIT=0, response contains a JSON object; Step 3: extracted JSON parses, has all 3 keys with non-empty values, key list is exactly `flag,name,purpose` (alphabetised by jq), tripwire diff empty | `/tmp/cp-019-raw.txt` (full transcript) + `/tmp/cp-019-out.json` (extracted JSON) + jq output + `/tmp/cp-019-pre.txt` and `/tmp/cp-019-post.txt` (tripwire pair) | PASS if EXIT=0 AND extracted JSON parses AND has exactly 3 keys AND all values non-empty AND tripwire diff empty; FAIL if response is not JSON, missing keys, extra keys, empty values, or project tree mutated | 1. If response is wrapped in markdown fences, the Format slot was not strictly honoured — re-issue with stronger "no markdown fences" framing; 2. If extra keys appear, the model may be inventing scope — flag for review (PARTIAL is acceptable if the requested 3 keys are present and non-empty); 3. If response is not JSON at all, the prompt-quality discipline failed for this task — re-check the framework selection (RCAF for generation per quality_card.md §3) |

### Optional Supplemental Checks

After PASS, run a second iteration with a different flag request and confirm the Format compliance is consistent across calls. A one-shot PASS that fails on the second call suggests Copilot is responding to specific framing cues rather than genuinely honouring Format slots.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §2 Smart Routing ALWAYS-loads `prompt_quality_card.md` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_quality_card.md` | §2 Framework Selection Table (RCAF for general implementation), §3 Task to Framework Map (Generation -> RCAF), §4 CLEAR 5-Check |
| `../../assets/prompt_templates.md` | §2 Code Generation templates use the RCAF framework label |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CP-019
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--prompt-templates/002-clear-quality-card-application.md`
