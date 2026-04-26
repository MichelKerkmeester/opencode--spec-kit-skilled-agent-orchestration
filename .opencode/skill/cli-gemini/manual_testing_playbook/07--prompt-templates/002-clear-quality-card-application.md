---
title: "CG-018 -- CLEAR quality card application"
description: "This scenario validates the prompt-quality-card asset (`assets/prompt_quality_card.md`) for `CG-018`. It focuses on confirming an operator can apply the documented framework-selection table and CLEAR 5-check to a representative task and arrive at the documented framework choice."
---

# CG-018 -- CLEAR quality card application

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-018`.

---

## 1. OVERVIEW

This scenario validates the `assets/prompt_quality_card.md` for `CG-018`. It focuses on confirming an operator can apply the Task → Framework map (§3) and the CLEAR 5-check (§4) to a representative task, arrive at the documented framework choice and confirm Gemini's resulting answer carries the framework's expected shape (e.g. RCAF answer cites a Role + Action + Format).

### Why This Matters

The prompt quality card is one of two ALWAYS-loaded resources in the cli-gemini smart router and is the orchestrator's first-line defence against weak prompts. If the framework-selection table or CLEAR check do not actually shape Gemini's answer in observable ways, the asset becomes ceremony rather than control. This scenario verifies the card has practical bite.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-018` and confirm the expected signals without contradictory evidence.

- Objective: Confirm applying RCAF (per §3 Task → Framework map for `Generation`) to a small generation task produces an answer that visibly carries the four RCAF components (Role, Context, Action, Format)
- Real user request: `Pick the right framework off the cli-gemini prompt quality card for a small generation task, run the CLEAR check on the prompt, dispatch it, and show me the answer carries the framework's expected shape.`
- Prompt: `As a cross-AI orchestrator following cli-gemini's prompt-quality discipline, look up the documented framework for a Generation task in assets/prompt_quality_card.md §3 (expect RCAF). Build a single-prompt dispatch using all four RCAF components (Role, Context, Action, Format) and run the CLEAR 5-check before dispatch. Verify Gemini's answer follows the requested Format and addresses the Action without inventing scope. Return a concise pass/fail verdict with the main reason, the framework chosen, and a one-line check that the requested Format was honoured.`
- Expected execution process: orchestrator (1) confirms `Generation → RCAF` from the card, (2) builds an RCAF-shaped prompt with explicit Role/Context/Action/Format slots, (3) runs the CLEAR 5-check mentally and notes the result, (4) dispatches the prompt, (5) verifies the response honours the requested Format (e.g. JSON object with the requested keys)
- Expected signals: command exits 0, framework chosen is RCAF (per §3 of the card), dispatched prompt explicitly labels Role / Context / Action / Format and Gemini's response is a JSON object containing exactly the keys requested by the Format slot (`name`, `signature`, `purpose`). The response addresses the requested Action (a single utility function specification) without ballooning into a broader implementation
- Desired user-visible outcome: PASS verdict + a one-line note like `framework=RCAF; format honoured (JSON keys: name, signature, purpose)`
- Pass/fail: PASS if the response parses as JSON AND has the exact requested keys AND describes a single utility (not a sprawling design). FAIL if the response is not JSON, missing keys or violates the Action's scope

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "prove the prompt-quality card actually shapes Gemini's output in observable ways".
2. Stay local. This is a direct CLI dispatch.
3. Walk the card briefly: §3 Task to Framework Map shows `Generation → RCAF`. §4 CLEAR 5-check is the pre-dispatch sanity pass.
4. Build the prompt with explicit `Role:`, `Context:`, `Action:`, `Format:` labels so the structure is auditable in evidence.
5. Verify the response shape (JSON keys) rather than the response prose, so the test is deterministic.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-018 | CLEAR quality card application | Confirm applying RCAF (per the documented framework map) produces an answer that honours the requested Format slot | `As a cross-AI orchestrator following cli-gemini's prompt-quality discipline, look up the documented framework for a Generation task in assets/prompt_quality_card.md §3 (expect RCAF). Build a single-prompt dispatch using all four RCAF components (Role, Context, Action, Format) and run the CLEAR 5-check before dispatch. Verify Gemini's answer follows the requested Format and addresses the Action without inventing scope. Return a concise pass/fail verdict with the main reason, the framework chosen, and a one-line check that the requested Format was honoured.` | 1. `bash: gemini "Role: senior Python developer specifying a single utility function. Context: a small Python codebase that needs a single helper called clamp(x, lo, hi). Action: produce the public specification for clamp — name, signature, and one-sentence purpose. Format: respond with a single raw JSON object containing exactly the keys name (string), signature (string), purpose (string). No prose around the JSON, no markdown fences." -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-018.txt; echo EXIT=$?` -> 2. `bash: cat /tmp/cg-018.txt` -> 3. `bash: jq -r 'keys | sort | join(",")' /tmp/cg-018.txt` -> 4. `bash: jq -r '.name, .signature, .purpose' /tmp/cg-018.txt` | Step 1: `EXIT=0`; Step 2: prints a JSON object; Step 3: prints exactly `name,purpose,signature`; Step 4: prints three non-empty lines | `/tmp/cg-018.txt`, outputs from Steps 3 and 4 | PASS if Step 3 prints exactly `name,purpose,signature` AND Step 4 prints three non-empty lines AND `signature` resembles a function signature like `clamp(x, lo, hi)`; FAIL if `jq` errors, keys are wrong, or any value is empty | 1. If `jq` errors, Gemini wrapped JSON in markdown — re-run with stricter `Output ONLY raw JSON, no markdown fences, no prose`; 2. If keys are wrong, the Format slot was ignored — re-emphasise `keys must be EXACTLY name, signature, purpose`; 3. If `signature` is missing the function name, the Context/Action slots were under-specified — apply the CLEAR Expression check more strictly |

### Optional Supplemental Checks

If you want extra confidence the card actually drove the choice (rather than the operator picking RCAF independently), document the CLEAR 5-check pass/fail per question (Correctness/Logic/Expression/Arrangement/Reusability) in the evidence so reviewers can audit the discipline.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (`assets/prompt_quality_card.md` listed as ALWAYS-loaded in §2 SMART ROUTING) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_quality_card.md` | §2 Framework Selection Table, §3 Task to Framework Map, §4 CLEAR 5-Check — the exact card applied by this scenario |
| `../../assets/prompt_templates.md` | §11 TEMPLATE VARIABLES documents placeholder conventions referenced during prompt construction |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CG-018
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--prompt-templates/002-clear-quality-card-application.md`
