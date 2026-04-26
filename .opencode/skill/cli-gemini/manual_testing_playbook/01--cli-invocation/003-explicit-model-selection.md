---
title: "CG-003 -- Explicit model selection"
description: "This scenario validates explicit model pinning via `-m gemini-3.1-pro-preview` for `CG-003`. It focuses on confirming the only supported model is accepted and that omitting `-m` does not silently swap models in scripted dispatches."
---

# CG-003 -- Explicit model selection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-003`.

---

## 1. OVERVIEW

This scenario validates explicit model selection for `CG-003`. It focuses on confirming `gemini -m gemini-3.1-pro-preview "[prompt]" -o text` runs successfully against the only supported model and that the model identity is observable from the structured output so scripted dispatches can be audited later.

### Why This Matters

The cli-gemini SKILL.md and `cli_reference.md` both pin `gemini-3.1-pro-preview` as the only supported model. If an unsupported model name is silently accepted or if the scripted invocation cannot prove which model answered, cross-AI orchestrators lose the ability to attribute behaviour to a specific model release.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `gemini -m gemini-3.1-pro-preview "[prompt]" -o json` exits 0 and returns a parseable JSON envelope, while an obviously unsupported model name fails fast with a clear error
- Real user request: `Pin Gemini to the supported model and prove which model just answered me; also show what happens if I typo the model name.`
- Prompt: `As a cross-AI orchestrator preparing reproducible scripts, invoke Gemini CLI with the supported model pinned explicitly against the cli-gemini skill in this repository. Verify the supported model accepts the prompt and an unsupported model name is rejected with a clear non-zero exit. Return a concise pass/fail verdict with the main reason plus the parsed answer from the supported run.`
- Expected execution process: orchestrator runs one supported-model call, captures JSON, then runs one obviously-unsupported call (`gemini-bogus-model`) to verify the binary refuses to silently fall back
- Expected signals: supported call exits 0, JSON parses, `.response` is non-empty. Unsupported call exits non-zero, stderr contains a model-related error string (e.g. `Model not found`, `invalid model` or a 400-class error message)
- Desired user-visible outcome: PASS verdict with the supported-model answer + a one-line note that the bogus-model call was correctly rejected
- Pass/fail: PASS if the supported model returns a parseable JSON answer AND the bogus model name fails non-zero. FAIL if the supported model errors OR the bogus model is silently accepted with output

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "lock model identity for scripted dispatches and prove fail-fast on bad names".
2. Stay local: this is a direct CLI dispatch.
3. Run the supported-model call first. Bail out early if even the supported model fails (no point testing the negative path).
4. Run the bogus-model call and treat a non-zero exit as the desired outcome (this is a negative-path test).
5. Return both results in the verdict so the operator sees what passed and what was expected to fail.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-003 | Explicit model selection | Confirm `-m gemini-3.1-pro-preview` succeeds and an unsupported model name fails fast | `As a cross-AI orchestrator preparing reproducible scripts, invoke Gemini CLI with the supported model pinned explicitly against the cli-gemini skill in this repository. Verify the supported model accepts the prompt and an unsupported model name is rejected with a clear non-zero exit. Return a concise pass/fail verdict with the main reason plus the parsed answer from the supported run.` | 1. `bash: gemini "Reply with the single word READY." -m gemini-3.1-pro-preview -o json 2>&1 > /tmp/cg-003-ok.json; echo EXIT_OK=$?` -> 2. `bash: jq -r '.response' /tmp/cg-003-ok.json` -> 3. `bash: gemini "Reply with the single word NOPE." -m gemini-bogus-model -o text 2>&1 > /tmp/cg-003-bad.txt; echo EXIT_BAD=$?` | Step 1: `EXIT_OK=0`, `/tmp/cg-003-ok.json` begins with `{`; Step 2: `.response` contains `READY` (any casing); Step 3: `EXIT_BAD` is non-zero AND `/tmp/cg-003-bad.txt` mentions the unsupported model name or a 400-class error | `/tmp/cg-003-ok.json` and `/tmp/cg-003-bad.txt` saved + the two echoed exit codes | PASS if Step 1 exits 0, Step 2 returns non-empty `.response`, AND Step 3 exits non-zero with a model-related error in stderr/stdout; FAIL if the supported call errors OR the bogus-model call exits 0 with a normal answer | 1. Inspect `/tmp/cg-003-ok.json` head to confirm JSON envelope shape matches CG-002; 2. Inspect `/tmp/cg-003-bad.txt` for the actual error string and reconcile against `references/cli_reference.md` §12 TROUBLESHOOTING; 3. If bogus model is silently accepted, escalate — Gemini CLI may have shipped a fallback policy that breaks the cli-gemini contract |

### Optional Supplemental Checks

If you want extra confidence that the supported-model answer actually came from `gemini-3.1-pro-preview`, re-run Step 1 with `-d` (debug) once and confirm the debug log line that names the resolved model. Skip this check on rate-limited days.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (model selection table in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §5 MODEL SELECTION pins `gemini-3.1-pro-preview` as the only supported model |
| `../../references/integration_patterns.md` | §5 MODEL SELECTION STRATEGY mandates explicit `-m` in scripts for predictability |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CG-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/003-explicit-model-selection.md`
