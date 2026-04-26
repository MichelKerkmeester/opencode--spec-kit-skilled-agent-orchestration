---
title: "CX-002 -- gpt-5.5 model lock"
description: "This scenario validates the gpt-5.5 model lock for `CX-002`. It focuses on confirming gpt-5.5 is the only supported model and that the explicit pin succeeds end-to-end."
---

# CX-002 -- gpt-5.5 model lock

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-002`.

---

## 1. OVERVIEW

This scenario validates the `gpt-5.5` model lock for `CX-002`. It focuses on confirming `gpt-5.5` is the only supported model and that an explicit `--model gpt-5.5` pin produces a successful response, with a documented paper trail that no other model ID was silently substituted.

### Why This Matters

SKILL.md §3 and `references/cli_reference.md` §5 both lock the skill to a single model (`gpt-5.5`). If a future Codex CLI release ships another model and the operator silently switches, every scenario downstream of the model lock loses its baseline. This scenario keeps the model contract honest.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CX-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify that explicit `--model gpt-5.5` is the only supported model ID and that the dispatch succeeds end-to-end with that pin.
- Real user request: `Codex is supposed to be on gpt-5.5 only — confirm that's still true and that the pin works.`
- Prompt: `As a cross-AI orchestrator validating the cli-codex model contract, dispatch a small documentation-style request explicitly pinned to --model gpt-5.5 with -c service_tier="fast". Verify the response is coherent, exit code is 0, and confirm via the skill docs that no other model ID is in scope. Return a one-line PASS/FAIL with the observed exit code and the model named in the dispatch.`
- Expected execution process: Operator confirms `references/cli_reference.md` §5 lists `gpt-5.5` as the only supported model -> dispatches a small doc-style task with `--model gpt-5.5` explicit -> captures the dispatched command line and stdout -> records the model pin in evidence.
- Expected signals: `codex exec` exits 0 with `--model gpt-5.5` explicitly passed. Stdout contains a coherent answer to a small documentation prompt. The skill reference (`references/cli_reference.md` §5) confirms `gpt-5.5` is the only supported model.
- Desired user-visible outcome: Confirmation that the documented model pin works end-to-end, with a paper trail that the operator did not silently fall back to a different ID.
- Pass/fail: PASS if exit code is 0 AND `--model gpt-5.5` appears in the dispatched command line AND `references/cli_reference.md` §5 still lists `gpt-5.5` as the only supported model. FAIL if any of these checks miss.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `references/cli_reference.md` §5 and confirm `gpt-5.5` is still the sole supported ID.
2. Dispatch a small documentation prompt with the explicit model pin.
3. Capture the dispatched command line and stdout.
4. Verify exit code 0 and coherent prose response.
5. Return a one-line PASS/FAIL.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-002 | gpt-5.5 model lock | Verify gpt-5.5 is the only supported model and the explicit pin succeeds | `As a cross-AI orchestrator validating the cli-codex model contract, dispatch a small documentation-style request explicitly pinned to --model gpt-5.5 with -c service_tier="fast". Verify the response is coherent, exit code is 0, and confirm via the skill docs that no other model ID is in scope. Return a one-line PASS/FAIL with the observed exit code and the model named in the dispatch.` | 1. `bash: grep -A 3 "Supported Model" .opencode/skill/cli-codex/references/cli_reference.md` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only "Explain in two sentences what 'idempotent' means in a REST API context." > /tmp/cli-codex-cx002.txt 2>&1` -> 3. `bash: cat /tmp/cli-codex-cx002.txt` | Step 1: only `gpt-5.5` listed under Supported Model section; Step 2: exit 0; Step 3: stdout contains a coherent two-sentence definition of "idempotent" | Captured stdout `/tmp/cli-codex-cx002.txt`, dispatched command line, exit code, grep output from Step 1 | PASS if all three steps match expected signals AND `--model gpt-5.5` appears verbatim in the dispatched command line; FAIL if any other model ID is listed in cli_reference.md §5 OR exit code is non-zero | (1) Re-read `cli_reference.md` §5 to confirm model lock unchanged; (2) re-run dispatch with `2>&1 | tee` for stderr inline; (3) check `OPENAI_API_KEY` validity if exit non-zero |

### Optional Supplemental Checks

- Confirm SKILL.md §3 also names `gpt-5.5` as the default model (consistency check across the skill's own docs).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation, §3 Model Selection) | Documents the model pin and selection strategy |
| `../../references/cli_reference.md` (§5 Model Selection) | Authoritative model reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §5 Supported Model table - the authoritative list |
| `../../SKILL.md` | §3 Default Invocation - documents the `gpt-5.5` pin |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CX-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/002-gpt-5-5-model-lock.md`
