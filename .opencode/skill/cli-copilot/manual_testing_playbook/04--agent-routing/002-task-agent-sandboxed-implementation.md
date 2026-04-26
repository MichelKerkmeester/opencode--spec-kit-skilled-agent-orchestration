---
title: "CP-011 -- `@Task` read-write sandboxed implementation (SANDBOXED)"
description: "This scenario validates the `@Task` built-in agent's read-write capability for `CP-011`. It focuses on confirming the agent prefix with `--allow-all-tools` implements a small documented function in a sandbox directory without touching the project tree."
---

# CP-011 -- `@Task` read-write sandboxed implementation (SANDBOXED)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-011`.

---

## 1. OVERVIEW

This scenario validates the `@Task` built-in agent for `CP-011`. It focuses on confirming `As @Task: ...` with `--allow-all-tools` implements a small documented function in a sandbox directory and the resulting code passes a verification check, all while leaving the project tree untouched.

### Why This Matters

`@Task` is the documented read-write agent in `references/agent_delegation.md` §3, it is the default route for "IMPLEMENT/FIX" tasks per the routing decision guide. CP-010 covers the read-only side (`@Explore`). CP-011 covers the read-write side under strict sandbox isolation. If `@Task` ignores the sandbox scope (writing outside the requested directory, or producing unverifiable output), every implementation-focused delegation pattern inherits the same defect.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `As @Task: ...` with `--allow-all-tools` implements a documented function in `/tmp/cp-011-sandbox/` and the verification check passes, without touching the project tree
- Real user request: `Have Copilot's @Task agent implement a tiny add() function in a sandbox so I can see the agent really delivers working code, scoped only to the sandbox.`
- Prompt: `As a cross-AI orchestrator delegating implementation work, dispatch the @Task agent against the cli-copilot skill in this repository to implement a small documented function in /tmp/cp-011-sandbox/calc.py. Verify the resulting file exists, contains the requested function with a docstring, and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the function signature line.`
- Expected execution process: orchestrator creates the sandbox, captures pre-call tripwire, dispatches the `@Task` prompt scoped strictly to `/tmp/cp-011-sandbox/`, then verifies the resulting file structure (function + docstring) and runs an orchestrator-side python verification to confirm the implementation works
- Expected signals: `EXIT=0`. `/tmp/cp-011-sandbox/calc.py` exists with the requested `add(a, b)` function and a docstring. `python3 -c "from calc import add; print(add(2, 3))"` from inside the sandbox prints `5`. Tripwire diff against project tree is empty
- Desired user-visible outcome: PASS verdict + the function signature + the verification stdout
- Pass/fail: PASS if calc.py exists with function + docstring AND verification python prints `5` AND tripwire diff is empty. FAIL if file missing, docstring missing, verification fails or project tree mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate @Task actually implements working sandboxed code without escaping the requested scope".
2. Stay local: this is a direct CLI dispatch with the `@Task` agent prefix and `--allow-all-tools` (read-write needs autonomy).
3. Create the sandbox and capture a pre-call tripwire.
4. Dispatch the `@Task` prompt with explicit sandbox scope.
5. Verify the artifact, run the orchestrator-side verification python, then re-tripwire.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-011 | `@Task` read-write sandboxed implementation | Confirm `As @Task: ...` with `--allow-all-tools` implements a documented function in `/tmp/cp-011-sandbox/` and the verification check passes, without touching the project tree | `As a cross-AI orchestrator delegating implementation work, dispatch the @Task agent against the cli-copilot skill in this repository to implement a small documented function in /tmp/cp-011-sandbox/calc.py. Verify the resulting file exists, contains the requested function with a docstring, and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the function signature line.` | 1. `bash: rm -rf /tmp/cp-011-sandbox && mkdir -p /tmp/cp-011-sandbox && git status --porcelain > /tmp/cp-011-pre.txt` -> 2. `bash: copilot -p "As @Task: implement /tmp/cp-011-sandbox/calc.py with a single function def add(a: int, b: int) -> int that returns a + b. Add a one-line docstring 'Return the sum of a and b.'. Do not write outside /tmp/cp-011-sandbox/. Do not modify any project files." --allow-all-tools 2>&1 | tee /tmp/cp-011-out.txt; echo "EXIT=$?"` -> 3. `bash: cat /tmp/cp-011-sandbox/calc.py && cd /tmp/cp-011-sandbox && python3 -c "from calc import add; print(add(2, 3))" > /tmp/cp-011-verify.txt && cat /tmp/cp-011-verify.txt && cd - && grep -E '^def add\(a: int, b: int\) -> int:' /tmp/cp-011-sandbox/calc.py && grep -F 'Return the sum of a and b.' /tmp/cp-011-sandbox/calc.py && git status --porcelain > /tmp/cp-011-post.txt && diff /tmp/cp-011-pre.txt /tmp/cp-011-post.txt` | Step 1: sandbox cleared and pre-tripwire captured; Step 2: EXIT=0, transcript shows file write inside sandbox; Step 3: calc.py exists with exact signature, docstring present, verification python prints `5`, tripwire diff empty | `/tmp/cp-011-out.txt` (transcript) + `/tmp/cp-011-sandbox/calc.py` (artifact) + `/tmp/cp-011-verify.txt` (verification stdout) + `/tmp/cp-011-pre.txt` and `/tmp/cp-011-post.txt` (tripwire pair) | PASS if EXIT=0 AND signature matches AND docstring present AND verification prints `5` AND tripwire diff empty; FAIL if file missing, signature differs, docstring missing, verification != `5`, or project tree mutated | 1. If signature differs, re-issue with explicit "exact signature, no changes" framing; 2. If docstring missing, verify the prompt was passed verbatim and the agent did not strip the requirement; 3. If tripwire diff non-empty, audit the prompt for ambiguous path constraints and tighten — `@Task` should not write outside the explicitly named directory |

### Optional Supplemental Checks

After PASS, run a quick negative test: `python3 -c "from calc import add; print(add(-1, 1))"` should print `0`. A wildly wrong implementation would still pass the `add(2, 3) == 5` check by coincidence. The negative-case check guards against that.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Copilot CLI Agent Delegation row "Task Execution: @Task" |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 Copilot CLI Agent Catalog and §4 @Task details |
| `../../references/cli_reference.md` | Documents `--allow-all-tools` requirement for write tools in §5 |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-011
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/002-task-agent-sandboxed-implementation.md`
