---
title: "CP-002 -- `--allow-all-tools` sandboxed file write (DESTRUCTIVE)"
description: "This scenario validates `--allow-all-tools` auto-approval semantics for `CP-002`. It focuses on confirming the flag lets Copilot perform a documented file-write tool call inside a sandbox directory without operator approval prompts and without touching the operator's project tree."
---

# CP-002 -- `--allow-all-tools` sandboxed file write (DESTRUCTIVE)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-002`.

---

## 1. OVERVIEW

This scenario validates the `--allow-all-tools` autonomy flag for `CP-002`. It focuses on confirming the flag auto-approves a sandboxed file-write tool call without prompting the operator and without mutating the project tree outside the sandbox directory.

### Why This Matters

`--allow-all-tools` is the documented autonomy contract for cross-AI delegation per SKILL.md §3, every Autopilot, Cloud Delegation and `@Task` scenario depends on it. If this flag silently fails (still prompts the operator, or executes write tools outside the requested scope), every higher-level scenario inherits the same defect. Verifying it under a strict sandbox plus tripwire diff is the cheapest way to catch the regression.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--allow-all-tools` auto-approves a sandboxed file-write tool call without prompting and without touching project files
- Real user request: `Ask Copilot to autonomously create a small test marker file inside a throwaway sandbox so I can confirm the autonomy flag works without it touching anything outside the sandbox.`
- Prompt: `As a cross-AI orchestrator with explicit sandbox approval, invoke Copilot CLI with --allow-all-tools against the cli-copilot skill in this repository. Verify the auto-approve flag lets Copilot perform a documented file-write tool call inside the sandbox directory /tmp/cp-002-sandbox/ without prompting the operator. Constrain all writes to the provided sandbox directory. Return a concise pass/fail verdict with the main reason and the resulting file path.`
- Expected execution process: orchestrator creates the sandbox directory, captures pre-call `git status --porcelain` baseline, dispatches `copilot -p "..." --allow-all-tools 2>&1` constrained to the sandbox, then verifies the sandbox file exists and the project tree is unchanged
- Expected signals: `EXIT=0`. `/tmp/cp-002-sandbox/hello-copilot.md` exists with the expected content. `git status --porcelain` diff before vs after is empty. No operator prompt blocked stdin
- Desired user-visible outcome: PASS verdict reporting the absolute sandbox path and approximate file size, plus a one-line note that the project tree was unchanged
- Pass/fail: PASS if the sandbox file is created with expected content AND project tree is unchanged AND no operator prompt blocked stdin. FAIL if the file is missing/wrong, the project tree shows a diff or the operator was prompted for approval

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate that --allow-all-tools delivers true autonomy in a strictly bounded sandbox".
2. Stay local: this is a direct CLI dispatch from the calling AI with explicit sandbox scoping.
3. Capture a pre-call tripwire (`git status --porcelain` to a temp file) so any unintended project mutation is caught.
4. Dispatch the autonomous write call constrained to `/tmp/cp-002-sandbox/`.
5. Verify the sandbox artifact, then run the post-call tripwire and diff against the pre-call baseline.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-002 | `--allow-all-tools` sandboxed file write | Confirm `--allow-all-tools` auto-approves a sandboxed file-write tool call without prompting and without touching project files | `As a cross-AI orchestrator with explicit sandbox approval, invoke Copilot CLI with --allow-all-tools against the cli-copilot skill in this repository. Verify the auto-approve flag lets Copilot perform a documented file-write tool call inside the sandbox directory /tmp/cp-002-sandbox/ without prompting the operator. Constrain all writes to the provided sandbox directory. Return a concise pass/fail verdict with the main reason and the resulting file path.` | 1. `bash: mkdir -p /tmp/cp-002-sandbox && git status --porcelain > /tmp/cp-002-pre.txt` -> 2. `bash: copilot -p "Create a small markdown file at /tmp/cp-002-sandbox/hello-copilot.md containing exactly the line 'CP-002 autonomy flag verified'. Do not write anywhere outside /tmp/cp-002-sandbox/." --allow-all-tools 2>&1 | tee /tmp/cp-002-out.txt` -> 3. `bash: cat /tmp/cp-002-sandbox/hello-copilot.md && git status --porcelain > /tmp/cp-002-post.txt && diff /tmp/cp-002-pre.txt /tmp/cp-002-post.txt` | Step 1: sandbox dir exists, pre-tripwire captured; Step 2: exits 0, stdout reports successful file write, no operator prompt; Step 3: sandbox file contains the marker line, tripwire diff is empty | `/tmp/cp-002-out.txt` (full transcript) + `/tmp/cp-002-sandbox/hello-copilot.md` (artifact) + `/tmp/cp-002-pre.txt` and `/tmp/cp-002-post.txt` (tripwire pair) + diff output | PASS if EXIT=0 AND sandbox file contains the marker AND tripwire diff is empty AND no prompt blocked stdin; FAIL if EXIT!=0, file missing/wrong, tripwire diff non-empty, or operator was prompted | 1. Re-check `--allow-all-tools` is still the documented autonomy flag in cli_reference.md §5; 2. If file written outside sandbox, audit the prompt for ambiguous path constraints and tighten; 3. If approval prompt appeared, verify the binary version supports `--allow-all-tools` non-interactive autonomy |

### Optional Supplemental Checks

After PASS, run `cat /tmp/cp-002-sandbox/hello-copilot.md | wc -c` and confirm the file size is plausible for the requested single line (typically 30-60 bytes). A massively larger file suggests Copilot exceeded the requested scope and warrants a re-review.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, `--allow-all-tools` documented in §3 Core Invocation Pattern |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `--allow-all-tools` flag in §5 FLAGS REFERENCE |
| `../../references/copilot_tools.md` | Documents Autopilot autonomous-execution capability that depends on this flag |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CP-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/002-allow-all-tools-sandboxed-write.md`
