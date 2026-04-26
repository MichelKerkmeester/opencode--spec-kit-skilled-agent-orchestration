---
title: "CG-001 -- Direct prompt with text output"
description: "This scenario validates the baseline non-interactive Gemini CLI invocation pattern (`gemini \"[prompt]\" -o text`) for `CG-001`. It focuses on confirming a single-shot prompt returns human-readable text without entering the REPL."
---

# CG-001 -- Direct prompt with text output

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-001`.

---

## 1. OVERVIEW

This scenario validates the baseline non-interactive Gemini CLI invocation pattern for `CG-001`. It focuses on confirming that `gemini "[prompt]" -o text 2>&1` returns a human-readable response without entering the REPL and without leaving the orchestrator blocked on stdin.

### Why This Matters

Every cli-gemini delegation flows through this baseline pattern. If non-interactive text output does not work, no other Gemini-side scenario in this playbook can be trusted. Cross-AI orchestration would silently degrade into hung shells inside Bash tool calls.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CG-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `gemini "[prompt]" -o text 2>&1` returns a non-empty, human-readable response in a single non-interactive invocation
- Real user request: `Ask Gemini to summarise what cli-gemini's role is in this repo and return it as plain text I can paste into a status update.`
- Prompt: `As a cross-AI orchestrator delegating from Claude Code, invoke Gemini CLI in non-interactive mode against the cli-gemini skill in this repository. Verify a single-shot prompt returns plain readable text without opening a REPL and without leaving the calling shell blocked on input. Return a concise pass/fail verdict with the main reason and the first ~10 lines of Gemini's response.`
- Expected execution process: orchestrator runs `command -v gemini` first, then issues a single `gemini "..." -o text 2>&1` call from Bash, captures stdout/stderr together and validates non-empty output
- Expected signals: `command -v gemini` resolves to a binary path, `gemini "..." -o text 2>&1` exits 0, stdout contains a multi-sentence answer to the prompt and no REPL banner/prompt asking the operator to type
- Desired user-visible outcome: a short paragraph (1-3 sentences) summarising cli-gemini's role, returned to the operator with a PASS verdict
- Pass/fail: PASS if `gemini` is installed AND the single-shot call exits 0 with non-empty plain text response. FAIL if the binary is missing, the call errors, the call hangs awaiting REPL input or stdout is empty

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate the most basic non-interactive Gemini CLI invocation works end-to-end".
2. Stay local: this is a direct CLI dispatch from the calling AI. No sub-agent delegation needed.
3. Probe `command -v gemini` first so a missing binary fails fast with a clear remediation step.
4. Issue the single non-interactive `gemini "..." -o text 2>&1` call.
5. Compare observed text against the desired user-visible outcome and return a one-line verdict plus the first ~10 lines of Gemini's response.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-001 | Direct prompt with text output | Confirm `gemini "[prompt]" -o text 2>&1` returns a non-empty plain-text response in a single non-interactive invocation | `As a cross-AI orchestrator delegating from Claude Code, invoke Gemini CLI in non-interactive mode against the cli-gemini skill in this repository. Verify a single-shot prompt returns plain readable text without opening a REPL and without leaving the calling shell blocked on input. Return a concise pass/fail verdict with the main reason and the first ~10 lines of Gemini's response.` | 1. `bash: command -v gemini` -> 2. `bash: gemini "Summarise the role of the cli-gemini skill in this repository in 2-3 sentences." -o text 2>&1` | Step 1: prints an absolute path to a `gemini` binary; Step 2: exits 0, stdout contains a 2-3 sentence answer in plain text, no REPL banner | Captured stdout from Step 1 (binary path) + first ~10 lines of Step 2 stdout + final exit code | PASS if Step 1 resolves to a binary AND Step 2 exits 0 with non-empty plain-text answer; FAIL if Step 1 prints nothing, Step 2 hangs / errors / returns empty stdout | 1. Re-check installation with `npm install -g @google/gemini-cli`; 2. Verify auth (`echo $GEMINI_API_KEY` or run `gemini` once interactively); 3. Re-run with `--debug` and inspect `2>&1` stream for 401/429/timeout markers |

### Optional Supplemental Checks

If Step 2 succeeds but stdout looks suspiciously short, re-run with `-d` (debug) once and confirm at least one tool call or model turn was attempted before declaring PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (baseline invocation pattern in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `--output text` flag, non-interactive mode, and exit-code expectations |
| `../../assets/prompt_quality_card.md` | CLEAR check applied to the dispatched prompt |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CG-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/001-direct-prompt-text-output.md`
