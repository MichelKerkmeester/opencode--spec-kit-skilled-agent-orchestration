---
title: "CG-005 -- Approval mode comparison (default vs never)"
description: "This scenario validates the three documented approval modes (`always`, `unless-allow-listed`, `never`) for `CG-005` by comparing default behaviour against `--approval-mode never`. It focuses on confirming the operator can pick the right approval posture for read-only vs sandboxed-write workflows."
---

# CG-005 -- Approval mode comparison (default vs never)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-005`.

---

## 1. OVERVIEW

This scenario validates the three documented Gemini CLI approval modes for `CG-005`. It focuses on confirming that a read-only prompt under the default mode (`unless-allow-listed`) completes without operator interaction and that `--approval-mode never` is functionally equivalent to `--yolo` for orchestration purposes (no prompts, auto-approved tool calls).

### Why This Matters

The cli-gemini orchestrator picks between approval modes per task, `unless-allow-listed` for read-only audits, `never` (or `--yolo`) for sandboxed background generation. Operators need to verify both ends of the spectrum work as documented before relying on either mode in scripted dispatches.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CG-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a read-only prompt under default approval mode completes without operator interaction AND `--approval-mode never` produces the same hands-off behaviour for the same prompt
- Real user request: `Compare what happens when I ask Gemini to read one file under the default approval mode versus the never mode — I want to make sure neither one stops to ask me about safe read tools.`
- Prompt: `As a cross-AI orchestrator selecting an approval posture, invoke Gemini CLI twice against the cli-gemini skill in this repository: once with default approval and once with --approval-mode never, both restricted to read-only tools. Verify both runs return a non-empty answer with no operator prompt blocking stdin and that neither modifies the working tree. Return a concise pass/fail verdict with the main reason and a one-line note about whether default vs never produced a meaningful behavioural difference for this read-only prompt.`
- Expected execution process: orchestrator dispatches the same prompt twice with `--allowed-tools read_file,search_file_content,glob,list_directory`, captures both outputs and tripwires `git status --porcelain` before and after the entire pair
- Expected signals: both calls exit 0 and return non-empty answers, neither call blocks on stdin and `git status --porcelain` is unchanged before and after. Outputs may differ in wording but both name the file or describe its contents accurately
- Desired user-visible outcome: PASS verdict + a one-line comparison such as `default vs never produced equivalent read-only output, no project mutations`
- Pass/fail: PASS if both calls exit 0 with non-empty answers AND project tree is unchanged AND neither hangs on a prompt. FAIL if either call errors, hangs, returns empty output or the project tree is mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify both ends of the approval-mode spectrum behave hands-off for read-only prompts".
2. Stay local. This is a direct CLI dispatch with no sub-agent involvement.
3. Use `--allowed-tools` to box Gemini into read-only operations as a defence in depth.
4. Run a `git status` tripwire around the full two-call sequence so any unexpected mutation is caught immediately.
5. Surface a clear comparison verdict so the operator can pick the right mode for future scenarios.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-005 | Approval mode comparison | Confirm default approval and `--approval-mode never` both complete a read-only prompt without operator interaction or project mutation | `As a cross-AI orchestrator selecting an approval posture, invoke Gemini CLI twice against the cli-gemini skill in this repository: once with default approval and once with --approval-mode never, both restricted to read-only tools. Verify both runs return a non-empty answer with no operator prompt blocking stdin and that neither modifies the working tree. Return a concise pass/fail verdict with the main reason and a one-line note about whether default vs never produced a meaningful behavioural difference for this read-only prompt.` | 1. `bash: git -C "$PWD" status --porcelain > /tmp/cg-005-before.txt` -> 2. `bash: gemini "Read .opencode/skill/cli-gemini/SKILL.md and answer in one sentence: what is the only supported model name?" --allowed-tools read_file,search_file_content,glob,list_directory -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-005-default.txt; echo EXIT_DEFAULT=$?` -> 3. `bash: gemini "Read .opencode/skill/cli-gemini/SKILL.md and answer in one sentence: what is the only supported model name?" --approval-mode never --allowed-tools read_file,search_file_content,glob,list_directory -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-005-never.txt; echo EXIT_NEVER=$?` -> 4. `bash: git -C "$PWD" status --porcelain > /tmp/cg-005-after.txt && diff /tmp/cg-005-before.txt /tmp/cg-005-after.txt` | Step 2: `EXIT_DEFAULT=0`, `/tmp/cg-005-default.txt` mentions `gemini-3.1-pro-preview`; Step 3: `EXIT_NEVER=0`, `/tmp/cg-005-never.txt` mentions `gemini-3.1-pro-preview`; Step 4: `diff` produces no output (project tree unchanged) | `/tmp/cg-005-default.txt`, `/tmp/cg-005-never.txt`, the two echoed exit codes, the `diff` output | PASS if both calls exit 0, both outputs name the supported model, AND the diff is empty; FAIL if either call errors / hangs, either output is empty or wrong, or the diff shows mutations | 1. If either call hangs, send SIGINT and check whether the prompt was awaiting tool approval (indicates `--allowed-tools` did not bind); 2. If outputs disagree on the model name, re-read SKILL.md §3 to confirm contract; 3. If diff shows mutations under read-only allowlist, escalate immediately — this is a Gemini CLI contract violation |

### Optional Supplemental Checks

If you want a third data point, repeat with `--approval-mode always` and a fresh non-interactive shell, the call should return immediately with an unfulfilled-tool error rather than hang. Skip on rate-limited days.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (approval-mode references in §3 HOW IT WORKS and §4 RULES) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §4 COMMAND-LINE FLAGS documents `--approval-mode` values |
| `../../references/gemini_tools.md` | §5 TOOL INVOCATION → approval modes table; §7 TOOL RESTRICTIONS for `--allowed-tools` |

---

## 5. SOURCE METADATA

- Group: Auto-Approve / YOLO
- Playbook ID: CG-005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--auto-approve-yolo/002-approval-mode-comparison.md`
