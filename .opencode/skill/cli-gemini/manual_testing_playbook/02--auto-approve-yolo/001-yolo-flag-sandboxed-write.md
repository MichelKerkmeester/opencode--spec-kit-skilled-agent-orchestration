---
title: "CG-004 -- YOLO flag with sandboxed file write"
description: "This scenario validates `--yolo` (`-y`) auto-approval of tool calls for `CG-004`. It focuses on confirming Gemini CLI writes a file under a disposable temp directory without prompting for approval, while the cli-gemini orchestrator gates the operation behind sandbox isolation."
---

# CG-004 -- YOLO flag with sandboxed file write

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-004`.

> **DESTRUCTIVE SCENARIO**: This scenario uses `--yolo`, which auto-approves all Gemini-side tool calls including file writes and shell commands. Run only inside a disposable `/tmp/cg-004-sandbox/` directory created at Step 1. Never against project files.

---

## 1. OVERVIEW

This scenario validates `--yolo` auto-approval for `CG-004`. It focuses on the cli-gemini orchestration rule that `--yolo` may auto-approve writes only when the operator has explicitly sandboxed the working directory and reviewed the request. The scenario proves the CLI flag works end-to-end and that the orchestrator constrains its blast radius.

### Why This Matters

The cli-gemini SKILL.md lists `--yolo` as a clear danger flag (`NEVER use --yolo on production codebases without explicit user approval`). Operators need a deterministic, sandbox-only way to confirm the flag actually short-circuits approvals before they trust it for legitimate background generation tasks.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `gemini --yolo "[prompt]" -o text` performs a documented file-write tool call against a disposable sandbox directory without prompting the operator and without touching project files
- Real user request: `Have Gemini drop a tiny hello.md note into a throwaway folder under /tmp without asking me to approve every step.`
- RCAF Prompt: `As a cross-AI orchestrator with explicit sandbox approval, invoke Gemini CLI with --yolo against the cli-gemini skill in this repository. Verify the auto-approve flag lets Gemini perform a documented file-write tool call inside the sandbox directory passed via --include-directories without prompting the operator. Constrain all writes to the provided sandbox directory. Return a concise pass/fail verdict with the main reason and the resulting file path.`
- Expected execution process: orchestrator creates a fresh `/tmp/cg-004-sandbox/` directory, dispatches the YOLO call with `--include-directories` pointed at the sandbox, then verifies the resulting artefact lives only inside the sandbox path
- Expected signals: command exits 0. `/tmp/cg-004-sandbox/hello.md` exists and is non-empty. No files were created or modified outside `/tmp/cg-004-sandbox/`. No interactive approval prompt blocked stdin
- Desired user-visible outcome: PASS verdict reporting the absolute path of the created file inside the sandbox and the approximate file size
- Pass/fail: PASS if the sandbox file exists, is non-empty, AND `git status` against the project shows no unintended changes. FAIL if the file is missing, the call hung on an approval prompt or any path outside the sandbox was modified

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "prove `--yolo` short-circuits approvals only inside an explicit sandbox".
2. Stay local. Sandboxing is the orchestrator's responsibility, not Gemini's.
3. Always create the sandbox directory first. Never reuse an existing project directory.
4. Run a `git status` against the project repository BEFORE and AFTER the YOLO call as a tripwire.
5. Return the absolute path of the created file plus the diff of `git status` to prove blast radius was contained.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-004 | YOLO flag with sandboxed file write | Confirm `--yolo` auto-approves a sandboxed file-write tool call without prompting and without touching project files | `As a cross-AI orchestrator with explicit sandbox approval, invoke Gemini CLI with --yolo against the cli-gemini skill in this repository. Verify the auto-approve flag lets Gemini perform a documented file-write tool call inside the sandbox directory passed via --include-directories without prompting the operator. Constrain all writes to the provided sandbox directory. Return a concise pass/fail verdict with the main reason and the resulting file path.` | 1. `bash: rm -rf /tmp/cg-004-sandbox && mkdir -p /tmp/cg-004-sandbox` -> 2. `bash: git -C "$PWD" status --porcelain > /tmp/cg-004-before.txt` -> 3. `bash: gemini "Write a single file named hello.md inside /tmp/cg-004-sandbox/ containing the line 'hello from cli-gemini cg-004'." --yolo --include-directories /tmp/cg-004-sandbox -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-004-out.txt; echo EXIT=$?` -> 4. `bash: ls -l /tmp/cg-004-sandbox/hello.md && cat /tmp/cg-004-sandbox/hello.md` -> 5. `bash: git -C "$PWD" status --porcelain > /tmp/cg-004-after.txt && diff /tmp/cg-004-before.txt /tmp/cg-004-after.txt` | Step 3: `EXIT=0`, no operator prompt blocked stdin; Step 4: `hello.md` exists, is non-empty, contains the expected line; Step 5: `diff` produces no output (project tree unchanged) | `/tmp/cg-004-out.txt`, `/tmp/cg-004-sandbox/hello.md`, `diff` output from Step 5 | PASS if Step 4 finds the sandbox file with expected content AND Step 5 diff is empty AND Step 3 exit code is 0; FAIL if any sandbox check fails OR the diff shows unintended project changes OR the command hung waiting for approval | 1. Re-run with `--approval-mode never` instead of `--yolo` to confirm flag parity; 2. Inspect `/tmp/cg-004-out.txt` for any approval-prompt strings; 3. If project files changed, immediately `git restore` them and escalate — `--yolo` MUST NOT be used outside the sandbox |

### Optional Supplemental Checks

If you want belt-and-braces, also assert that `find /tmp/cg-004-sandbox -type f | wc -l` returns exactly `1` so Gemini did not generate stray helper files.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary (destructive scenario isolation rule) |
| `../../SKILL.md` | cli-gemini skill surface (NEVER rule on `--yolo` in §4 RULES) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §4 COMMAND-LINE FLAGS documents `--yolo`/`-y` and `--include-directories` |
| `../../references/gemini_tools.md` | §5 TOOL INVOCATION documents the approval modes (`always`, `unless-allow-listed`, `never`) |

---

## 5. SOURCE METADATA

- Group: Auto-Approve / YOLO
- Playbook ID: CG-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--auto-approve-yolo/001-yolo-flag-sandboxed-write.md`
