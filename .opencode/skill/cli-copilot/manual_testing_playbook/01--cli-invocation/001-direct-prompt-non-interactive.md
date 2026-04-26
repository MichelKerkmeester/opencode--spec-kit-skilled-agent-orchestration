---
title: "CP-001 -- Direct prompt with non-interactive `-p` flag"
description: "This scenario validates the baseline non-interactive Copilot CLI invocation pattern (`copilot -p \"[prompt]\" 2>&1`) for `CP-001`. It focuses on confirming a single-shot prompt returns human-readable text without entering the interactive TUI."
---

# CP-001 -- Direct prompt with non-interactive `-p` flag

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-001`.

---

## 1. OVERVIEW

This scenario validates the baseline non-interactive Copilot CLI invocation pattern for `CP-001`. It focuses on confirming that `copilot -p "[prompt]" 2>&1` returns a human-readable response without entering the TUI and without leaving the orchestrator blocked on stdin.

### Why This Matters

Every cli-copilot delegation flows through this baseline pattern. If non-interactive `-p` does not work, no other Copilot-side scenario in this playbook can be trusted. Cross-AI orchestration would silently degrade into hung shells inside Bash tool calls or accidentally launch the full-screen TUI.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `copilot -p "[prompt]" 2>&1` returns a non-empty, human-readable response in a single non-interactive invocation
- Real user request: `Ask Copilot to summarise what cli-copilot's role is in this repo and return it as plain text I can paste into a status update.`
- Prompt: `As a cross-AI orchestrator delegating from Claude Code, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository. Verify a single-shot -p prompt returns a readable response without opening the TUI and without leaving the calling shell blocked on input. Return a concise pass/fail verdict with the main reason and the first ~10 lines of Copilot's response.`
- Expected execution process: orchestrator runs `command -v copilot` first, then issues a single `copilot -p "..." 2>&1` call from Bash, captures stdout/stderr together and validates non-empty output
- Expected signals: `command -v copilot` resolves to a binary path. `copilot -p "..." 2>&1` exits 0. Stdout contains a multi-sentence answer to the prompt. No TUI banner/prompt asking the operator to type
- Desired user-visible outcome: a short paragraph (1-3 sentences) summarising cli-copilot's role, returned to the operator with a PASS verdict
- Pass/fail: PASS if `copilot` is installed AND the single-shot call exits 0 with non-empty plain text response. FAIL if the binary is missing, the call errors, the call hangs awaiting TUI input or stdout is empty

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate the most basic non-interactive Copilot CLI invocation works end-to-end".
2. Stay local: this is a direct CLI dispatch from the calling AI. No sub-agent delegation needed.
3. Probe `command -v copilot` first so a missing binary fails fast with a clear remediation step.
4. Issue the single non-interactive `copilot -p "..." 2>&1` call.
5. Compare observed text against the desired user-visible outcome and return a one-line verdict plus the first ~10 lines of Copilot's response.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-001 | Direct prompt with non-interactive `-p` flag | Confirm `copilot -p "[prompt]" 2>&1` returns a non-empty plain-text response in a single non-interactive invocation | `As a cross-AI orchestrator delegating from Claude Code, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository. Verify a single-shot -p prompt returns a readable response without opening the TUI and without leaving the calling shell blocked on input. Return a concise pass/fail verdict with the main reason and the first ~10 lines of Copilot's response.` | 1. `bash: command -v copilot` -> 2. `bash: copilot -p "Summarise the role of the cli-copilot skill in this repository in 2-3 sentences." 2>&1 | tee /tmp/cp-001-out.txt` | Step 1: prints an absolute path to a `copilot` binary; Step 2: exits 0, stdout contains a 2-3 sentence answer in plain text, no TUI banner | Captured stdout from Step 1 (binary path) + first ~10 lines of `/tmp/cp-001-out.txt` + final exit code | PASS if Step 1 resolves to a binary AND Step 2 exits 0 with non-empty plain-text answer; FAIL if Step 1 prints nothing, Step 2 hangs / errors / returns empty stdout | 1. Re-check installation with `npm install -g @github/copilot`; 2. Verify auth (`copilot login` or `echo $GH_TOKEN`); 3. Re-run with stderr captured separately to inspect TUI-detection or auth errors |

### Optional Supplemental Checks

If Step 2 succeeds but stdout looks suspiciously short, re-run with the prompt asking for an explicit count (e.g. "give 3 specific capabilities") and confirm Copilot returns a numbered list before declaring PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface (baseline invocation pattern in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `-p` flag, non-interactive mode and exit-code expectations (§4 CORE INVOCATION) |
| `../../assets/prompt_quality_card.md` | CLEAR check applied to the dispatched prompt |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CP-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/001-direct-prompt-non-interactive.md`
