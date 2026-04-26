---
title: "CO-022 -- Memory Epilogue handback to generate-context.js"
description: "This scenario validates the Memory Epilogue handback for `CO-022`. It focuses on confirming the dispatched OpenCode session emits a properly-delimited MEMORY_HANDBACK_START / END block with a structured JSON payload that the calling AI can extract and feed to generate-context.js."
---

# CO-022 -- Memory Epilogue handback to generate-context.js

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-022`.

---

## 1. OVERVIEW

This scenario validates Memory Epilogue handback for `CO-022`. It focuses on confirming the dispatched OpenCode session emits a properly-delimited `<!-- MEMORY_HANDBACK_START --> ... <!-- MEMORY_HANDBACK_END -->` block containing a structured JSON payload and that the calling AI can extract the payload via the regex documented in SKILL.md §4 step 2 and validate it as JSON parseable into `generate-context.js`.

### Why This Matters

The Memory Handback Protocol is the canonical context-preservation bridge between cli-opencode dispatches and the project's Spec Kit Memory system. Without it, every cross-AI dispatch's findings are ephemeral. The handback delimiters and JSON shape are part of the cli-opencode skill's contract with `generate-context.js`. If the dispatched session emits malformed delimiters, missing required fields or a payload that does not parse, the entire continuity story between cross-AI workflows and spec-kit memory regresses. This test validates the end-to-end handback path.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-022` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a cli-opencode dispatch with the Template 13 Memory Epilogue produces a properly-delimited MEMORY_HANDBACK block containing a structured JSON payload that parses successfully and includes the documented canonical fields (specFolder, sessionSummary, user_prompts, observations, recent_context, FILES, nextSteps).
- Real user request: `Run an opencode run with the Memory Epilogue from prompt_templates.md template 13 appended to the prompt. Confirm the dispatched session emits the MEMORY_HANDBACK delimiters and the JSON payload includes all canonical fields.`
- Prompt: `As an external-AI conductor preserving context from a cli-opencode dispatch, dispatch a small task with the Template 13 Memory Epilogue appended. Verify the response includes the MEMORY_HANDBACK_START / END delimiters, the contents between them parse as valid JSON, and the JSON includes specFolder, sessionSummary, user_prompts, observations, recent_context, FILES, and nextSteps. Return a concise pass/fail verdict naming the captured specFolder and the nextSteps count.`
- Expected execution process: External-AI orchestrator dispatches with the Memory Epilogue appended, captures the response, extracts the MEMORY_HANDBACK block via regex, validates the JSON payload parses and confirms canonical fields are present.
- Expected signals: Dispatch exits 0. Response contains exactly one MEMORY_HANDBACK_START / END pair. The contents between the delimiters parse as JSON. The JSON includes specFolder, sessionSummary, user_prompts, observations, recent_context, FILES and nextSteps fields. NextSteps has at least one entry.
- Desired user-visible outcome: Verdict naming the captured specFolder and the nextSteps count.
- Pass/fail: PASS if exit 0 AND exactly one delimiter pair AND JSON parses AND all canonical fields present AND nextSteps non-empty. FAIL if delimiters missing/duplicated, JSON invalid or canonical fields missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with the Template 13 Memory Epilogue appended.
3. Extract MEMORY_HANDBACK block via grep / sed.
4. Strip the HTML comment delimiters and validate the inner JSON parses.
5. Validate canonical fields are present.
6. Return a verdict naming the specFolder and nextSteps count.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-022 | Memory Epilogue handback to generate-context.js | Confirm the dispatched session emits a properly-delimited MEMORY_HANDBACK with all canonical JSON fields | `As an external-AI conductor preserving context from a cli-opencode dispatch, dispatch a small task with the Template 13 Memory Epilogue appended. Verify the response includes the MEMORY_HANDBACK_START / END delimiters, the contents between them parse as valid JSON, and the JSON includes specFolder, sessionSummary, user_prompts, observations, recent_context, FILES, and nextSteps. Return a concise pass/fail verdict naming the captured specFolder and the nextSteps count.` | 1. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "Briefly summarize the cli-opencode skill in two short sentences. Then append a Memory Epilogue using the canonical structured JSON shape: include MEMORY_HANDBACK_START and MEMORY_HANDBACK_END as HTML comment delimiters. The JSON between them MUST include specFolder='/Users/.../048-cli-testing-playbooks/', sessionSummary, user_prompts (array with 1 entry), observations (array, at least 1), recent_context (array, at least 1), FILES (array, at least 1 entry with path/DESCRIPTION/ACTION/MODIFICATION_MAGNITUDE), and nextSteps (array with at least 1 entry)." > /tmp/co-022-events.jsonl 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-022-events.jsonl > /tmp/co-022-text.txt && wc -c /tmp/co-022-text.txt` -> 4. `bash: grep -c 'MEMORY_HANDBACK_START' /tmp/co-022-text.txt && grep -c 'MEMORY_HANDBACK_END' /tmp/co-022-text.txt` -> 5. `bash: python3 -c "import re,sys,json; t=open('/tmp/co-022-text.txt').read(); m=re.search(r'<!--\s*MEMORY_HANDBACK_START\s*-->([\s\S]*?)<!--\s*MEMORY_HANDBACK_END\s*-->', t); body=m.group(1).strip() if m else ''; obj=json.loads(re.search(r'\{[\s\S]*\}', body).group(0)) if body else {}; open('/tmp/co-022-payload.json','w').write(json.dumps(obj,indent=2)); print('FIELDS:', sorted(obj.keys()))"` -> 6. `bash: jq -r 'keys' /tmp/co-022-payload.json` -> 7. `bash: jq -r '.specFolder' /tmp/co-022-payload.json` -> 8. `bash: jq -r '.nextSteps \| length' /tmp/co-022-payload.json` | Step 1: events captured; Step 2: exit 0; Step 3: text non-empty; Step 4: each delimiter count = 1; Step 5: parsed payload JSON includes the canonical field set; Step 6: keys list includes specFolder, sessionSummary, user_prompts, observations, recent_context, FILES, nextSteps; Step 7: specFolder is a non-empty string; Step 8: nextSteps length >= 1 | `/tmp/co-022-events.jsonl`, `/tmp/co-022-text.txt`, `/tmp/co-022-payload.json` | PASS if exit 0 AND exactly one delimiter pair AND JSON parses AND all 7 canonical fields present AND nextSteps non-empty; FAIL if any check fails | 1. If delimiters are missing, the prompt may not have been explicit enough — re-prompt verbatim with the Template 13 wording; 2. If JSON does not parse, inspect for trailing commas or unescaped quotes — common LLM JSON failure modes; 3. If canonical fields are missing, list which ones in the failure report and update the prompt; 4. If `<!--` is rendered as `&lt;!--` in JSON output, the model escaped the comments — re-prompt asking to keep raw HTML comment syntax |

### Optional Supplemental Checks

For end-to-end continuity validation, after extracting the JSON payload, save it to a temp file and feed it to `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/co-022-payload.json` (only against a sandbox spec folder). Confirm the save completes and the POST-SAVE QUALITY REVIEW reports PASSED or only MEDIUM issues. This proves the handback fully integrates with `generate-context.js`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../assets/prompt_templates.md` (TEMPLATE 13: Memory Epilogue) | Canonical Memory Epilogue body |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §4 Memory Handback Protocol (7-step procedure), regex `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/` |
| `../../references/integration_patterns.md` (§7 MEMORY HANDBACK) | Integration with generate-context.js |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CO-022
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--integration-patterns/002-memory-epilogue-handback.md`
