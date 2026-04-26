---
title: "CP-004 -- Explicit model selection (GPT-5.4)"
description: "This scenario validates explicit model selection via `--model gpt-5.4` for `CP-004`. It focuses on confirming the supported model accepts the prompt and an unsupported model name fails fast with a non-zero exit."
---

# CP-004 -- Explicit model selection (GPT-5.4)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-004`.

---

## 1. OVERVIEW

This scenario validates the explicit model selection surface for `CP-004`. It focuses on confirming `--model gpt-5.4` succeeds for a frontier-reasoning prompt and an unsupported model name (e.g. `gpt-bogus-99`) fails fast with a non-zero exit instead of silently falling back.

### Why This Matters

cli-copilot exposes 5 recommended models across 3 providers per SKILL.md §3 Model Selection. Reproducible scripts rely on `--model` pinning to lock behaviour to a known-good model. If `--model` silently ignores unknown values (or worse, falls back to a default without warning), every multi-model orchestration loses its determinism and operators cannot catch typos or misconfigured downstream pipelines.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model gpt-5.4` succeeds for a frontier-reasoning prompt and an unsupported model name fails fast with a non-zero exit
- Real user request: `Pin Copilot to GPT-5.4 for a reasoning question and confirm a typo in the model name fails loudly instead of silently using a different model.`
- Prompt: `As a cross-AI orchestrator preparing reproducible scripts, invoke Copilot CLI with the GPT-5.4 model pinned explicitly against the cli-copilot skill in this repository. Verify the supported model accepts the prompt and an unsupported model name is rejected with a clear non-zero exit. Return a concise pass/fail verdict with the main reason plus the parsed answer from the supported run.`
- Expected execution process: orchestrator dispatches the supported `--model gpt-5.4` call, captures the answer, then dispatches the bogus `--model gpt-bogus-99` call and verifies the non-zero exit and model-related error message
- Expected signals: supported call exits 0 with a multi-sentence answer. Unsupported call exits non-zero with a model-related error in stdout/stderr (e.g. `unknown model`, `unsupported`, `not available`)
- Desired user-visible outcome: PASS verdict with the supported-model answer + a one-line note that the bogus-model call was correctly rejected
- Pass/fail: PASS if supported call exits 0 with non-empty answer AND bogus call exits non-zero with a model-related error. FAIL if either condition is missed (supported call errors, or bogus call exits 0 / silently falls back)

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate explicit model pinning works for the supported case and fails loudly for the unsupported case".
2. Stay local: this is a direct CLI dispatch from the calling AI. No sub-agent delegation needed.
3. Dispatch the supported `--model gpt-5.4` call and capture the answer.
4. Dispatch the bogus `--model gpt-bogus-99` call and capture the exit code + error message.
5. Compare both outcomes and return a one-line verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-004 | Explicit model selection (GPT-5.4) | Confirm `--model gpt-5.4` succeeds and an unsupported model name fails fast with a non-zero exit | `As a cross-AI orchestrator preparing reproducible scripts, invoke Copilot CLI with the GPT-5.4 model pinned explicitly against the cli-copilot skill in this repository. Verify the supported model accepts the prompt and an unsupported model name is rejected with a clear non-zero exit. Return a concise pass/fail verdict with the main reason plus the parsed answer from the supported run.` | 1. `bash: copilot -p "Explain in 2-3 sentences why a frontier reasoning model is preferred for a complex algorithm correctness proof." --model gpt-5.4 2>&1 | tee /tmp/cp-004-supported.txt; echo "EXIT_SUPPORTED=$?"` -> 2. `bash: copilot -p "Same prompt, bogus model" --model gpt-bogus-99 2>&1 | tee /tmp/cp-004-bogus.txt; echo "EXIT_BOGUS=$?"` | Step 1: EXIT_SUPPORTED=0, stdout contains a 2-3 sentence reasoning-model justification; Step 2: EXIT_BOGUS != 0, stdout/stderr contains a model-related error (`unknown`, `unsupported`, `not available`, etc.) | `/tmp/cp-004-supported.txt` (supported transcript + exit code) + `/tmp/cp-004-bogus.txt` (bogus transcript + exit code) | PASS if EXIT_SUPPORTED=0 with non-empty answer AND EXIT_BOGUS != 0 with model-related error; FAIL if EXIT_SUPPORTED != 0, supported answer empty, EXIT_BOGUS=0, or bogus error is generic/missing | 1. Re-check the recommended model IDs in cli_reference.md §6 (5 IDs: gpt-5.4, gpt-5.3-codex, claude-opus-4.6, claude-sonnet-4.6, gemini-3.1-pro-preview); 2. If supported call fails, verify the active Copilot subscription includes the GPT-5.4 entitlement; 3. If bogus call exits 0, check whether Copilot silently fell back to a default — if so, this is a regression in the model-validation surface |

### Optional Supplemental Checks

After PASS, repeat the supported call once with `--model gpt-5.4` again (different prompt) to confirm the model is consistently available, a flaky availability suggests subscription-level rate-limiting rather than CLI behaviour.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, Model Selection table in §3 (5 recommended models) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `--model` flag in §5 FLAGS REFERENCE and the 5 recommended model IDs in §6 MODELS |
| `../../references/copilot_tools.md` | Documents Multi-Provider Models capability in §2 |

---

## 5. SOURCE METADATA

- Group: Multi-Model
- Playbook ID: CP-004
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--multi-model/001-explicit-model-selection-gpt54.md`
