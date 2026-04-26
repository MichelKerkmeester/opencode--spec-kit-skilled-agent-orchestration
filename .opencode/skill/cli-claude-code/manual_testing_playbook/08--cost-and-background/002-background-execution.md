---
title: "CC-027 -- Background execution"
description: "This scenario validates background execution for `CC-027`. It focuses on confirming a Claude Code dispatch can run in the background and the parent shell can collect output without blocking."
---

# CC-027 -- Background execution

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CC-027`.

---

## 1. OVERVIEW

This scenario validates Background execution for `CC-027`. It focuses on confirming a Claude Code dispatch backgrounded with `&` runs without blocking the parent shell, that `wait` collects the exit code cleanly, and that captured stdout contains the expected response. The companion comparative validation (incremental vs batch streaming) lives at `01--cli-invocation/004-stream-json-incremental-output.md`.

### Why This Matters

Background execution is the load-bearing pattern for parallel cross-AI workloads documented in SKILL.md §3 (How It Works). Operators that run multiple Claude Code dispatches in parallel rely on `&` plus `wait` to fan out without blocking. If a backgrounded dispatch silently consumes stdin from the parent loop, the canonical `</dev/null` redirect breaks, or the parent cannot collect the exit code, parallel workloads regress to serial execution and budgets blow out.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-027` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a backgrounded `claude -p` dispatch with `</dev/null` runs without blocking, that `wait` collects exit 0, and that the captured stdout file contains the expected response.
- Real user request: `Kick off a quick Claude Code analysis in the background while I keep working in this shell, then collect the answer when it finishes.`
- Prompt: `As an external-AI conductor running a parallel workload, dispatch claude -p in the background with stdout captured to a temp file and stdin redirected from /dev/null so the parent shell does not block. Run a small read-only analysis prompt. Verify wait returns exit 0, the temp file contains a non-empty response, and the parent shell remained responsive. Return a verdict naming the temp file, the wait exit code, and the first 80 characters of the captured response.`
- Expected execution process: External-AI orchestrator dispatches a small read-only prompt with `&` plus `</dev/null` plus output redirection, runs an unrelated quick command in the parent while the dispatch runs, then `wait`s and verifies the captured response.
- Expected signals: `wait` returns exit 0. Captured stdout file is non-empty. Parent shell remained responsive (the unrelated command between dispatch and wait completed normally). Dispatched command line includes `&` and `</dev/null`.
- Desired user-visible outcome: A backgrounded analysis result the operator can use as proof the parallel-execution pattern works.
- Pass/fail: PASS if `wait` exits 0 AND captured file is non-empty AND parent shell stayed responsive. FAIL if `wait` errors, output is empty, or parent shell blocked.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Define the small read-only prompt.
3. Dispatch in the background with `</dev/null` and output redirection.
4. Run an unrelated quick command in the parent shell to confirm responsiveness.
5. `wait` for the background dispatch and verify exit 0.
6. Return a verdict naming the temp file, the wait exit code, and a short response snippet.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-027 | Background execution | Confirm a backgrounded claude -p dispatch with `</dev/null` runs without blocking and wait collects exit 0 | `As an external-AI conductor running a parallel workload, dispatch claude -p in the background with stdout captured to a temp file and stdin redirected from /dev/null so the parent shell does not block. Run a small read-only analysis prompt against the cli-claude-code SKILL.md and verify wait returns exit 0, the temp file contains a non-empty response, and the parent shell remained responsive. Return a verdict naming the temp file, the wait exit code, and the first 80 characters of the captured response.` | 1. `bash: rm -f /tmp/cc-027-output.txt /tmp/cc-027-pid.txt` -> 2. `bash: claude -p "Summarize the core principle of cli-claude-code in one sentence based on @./.opencode/skill/cli-claude-code/SKILL.md." --permission-mode plan --output-format text > /tmp/cc-027-output.txt 2>&1 </dev/null & echo $! > /tmp/cc-027-pid.txt` -> 3. `bash: echo "PID: $(cat /tmp/cc-027-pid.txt)" && date '+%H:%M:%S baseline'` -> 4. `bash: wait $(cat /tmp/cc-027-pid.txt) ; echo "wait_exit=$?"` -> 5. `bash: test -s /tmp/cc-027-output.txt && echo OK_NONEMPTY` -> 6. `bash: head -c 80 /tmp/cc-027-output.txt` | Step 1: prior artifacts cleared; Step 2: PID captured immediately, parent did not block; Step 3: PID and timestamp printed without delay; Step 4: `wait_exit=0` printed; Step 5: `OK_NONEMPTY` printed; Step 6: first 80 chars of response printed | `/tmp/cc-027-output.txt`, `/tmp/cc-027-pid.txt`, terminal exit codes and snippet | PASS if wait exits 0 AND captured file is non-empty AND parent shell stayed responsive (steps 2 and 3 returned promptly); FAIL if wait errors or output is empty or parent shell blocked | 1. If the parent shell blocked, the `</dev/null` redirect was missing, re-test with the redirect explicit; 2. If wait returns non-zero, inspect the captured file for the error message and fix the prompt; 3. If output is empty but wait returned 0, check stderr was captured into the same file via `2>&1` |

### Optional Supplemental Checks

For full parallel validation, fan out 3 backgrounded dispatches with distinct prompts and verify all 3 produce non-empty outputs after `wait`. Record cumulative wall-clock and confirm it is materially less than the sum of serial runtimes for the same prompts.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` | Background execution pattern |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 257) | Background execution example with `&` |
| `../../references/integration_patterns.md` | Cross-AI orchestration patterns including parallel dispatch |

---

## 5. SOURCE METADATA

- Group: Cost And Background
- Playbook ID: CC-027
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--cost-and-background/002-background-execution.md`
