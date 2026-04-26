---
title: "CP-008 -- Autopilot autonomous build (DESTRUCTIVE — SANDBOXED)"
description: "This scenario validates Autopilot multi-step autonomous execution for `CP-008`. It focuses on confirming `--allow-all-tools --no-ask-user` lets Copilot complete a 3-step sandboxed build (create file, modify file, verify with bash) without operator intervention."
---

# CP-008 -- Autopilot autonomous build (DESTRUCTIVE, SANDBOXED)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-008`.

---

## 1. OVERVIEW

This scenario validates Autopilot multi-step autonomous execution for `CP-008`. It focuses on confirming the documented full-autonomy combination `--allow-all-tools --no-ask-user` lets Copilot run a 3-step build inside a sandbox (create file, modify file, verify with bash) without ever pausing for operator approval.

### Why This Matters

Autopilot is one of the four cli-copilot unique capabilities documented in `references/copilot_tools.md` §2, it underwrites all autonomous orchestration including SKILL.md §3 Copilot CLI Agent Delegation row "Autonomous Build". If Autopilot silently breaks the autonomy contract (pausing mid-step for operator approval or only executing the first step), every downstream multi-step delegation pattern inherits the same defect. Verifying a 3-step chain (create -> modify -> verify) that culminates in a real bash invocation is the cheapest end-to-end check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--allow-all-tools --no-ask-user` lets Copilot complete a 3-step sandboxed build (create file, modify file, verify with bash) without operator intervention
- Real user request: `Autopilot a small 3-step build inside a sandbox so I can confirm Copilot really runs autonomously without stopping mid-way for approvals.`
- Prompt: `As a cross-AI orchestrator running Autopilot for autonomous multi-step execution, invoke Copilot CLI with --allow-all-tools --no-ask-user against the cli-copilot skill in this repository, scoped to /tmp/cp-008-sandbox/. Ask Copilot to (1) create a small Python module greet.py with a greet(name) function, (2) add a docstring documenting the function, (3) verify by running python3 -c "from greet import greet; print(greet('Copilot'))" from inside the sandbox. Verify all three steps execute without operator approval prompts and the final python invocation prints the expected greeting. Constrain all writes to the sandbox directory. Return a concise pass/fail verdict with the main reason and the verification output.`
- Expected execution process: orchestrator creates the sandbox, captures pre-call tripwire, dispatches the Autopilot prompt with both `--allow-all-tools` and `--no-ask-user`, then verifies all three step artifacts (file created, docstring added, verification stdout) and confirms the project tree is unchanged
- Expected signals: `EXIT=0`. `/tmp/cp-008-sandbox/greet.py` exists with a `greet(name)` function and a docstring. Running the verification python command from the sandbox prints `Hello, Copilot!` (or equivalent). No operator prompt blocked stdin. Tripwire diff against project tree is empty
- Desired user-visible outcome: PASS verdict + the verification stdout line + a one-line note that all 3 Autopilot steps completed without approval prompts
- Pass/fail: PASS if all 3 step artifacts are present AND verification python prints expected greeting AND no operator prompt blocked stdin AND tripwire diff is empty. FAIL if any step is missing, verification fails, an approval prompt appeared or project tree is mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate Autopilot completes a 3-step chain end-to-end without breaking the autonomy contract".
2. Stay local: this is a direct CLI dispatch with both autonomy flags, but constrained to a sandbox.
3. Capture a pre-call tripwire (`git status --porcelain`).
4. Dispatch the Autopilot prompt. Allow it to take longer than single-step calls (multi-step chains may take 30-90s).
5. Verify each step's artifact, run the orchestrator-side verification python explicitly to double-check, then re-tripwire and return the verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-008 | Autopilot autonomous build | Confirm `--allow-all-tools --no-ask-user` lets Copilot complete a 3-step sandboxed build (create, modify, verify) without operator intervention | `As a cross-AI orchestrator running Autopilot for autonomous multi-step execution, invoke Copilot CLI with --allow-all-tools --no-ask-user against the cli-copilot skill in this repository, scoped to /tmp/cp-008-sandbox/. Ask Copilot to (1) create a small Python module greet.py with a greet(name) function, (2) add a docstring documenting the function, (3) verify by running python3 -c "from greet import greet; print(greet('Copilot'))" from inside the sandbox. Verify all three steps execute without operator approval prompts and the final python invocation prints the expected greeting. Constrain all writes to the sandbox directory. Return a concise pass/fail verdict with the main reason and the verification output.` | 1. `bash: rm -rf /tmp/cp-008-sandbox && mkdir -p /tmp/cp-008-sandbox && git status --porcelain > /tmp/cp-008-pre.txt` -> 2. `bash: copilot -p "Autopilot 3-step build inside /tmp/cp-008-sandbox/. Step 1: create greet.py with a single function def greet(name): return f'Hello, {name}!'. Step 2: add a Python docstring 'Return a friendly greeting.' immediately under the def line. Step 3: run python3 -c \"from greet import greet; print(greet('Copilot'))\" from inside /tmp/cp-008-sandbox/ and report its stdout. Do not write outside /tmp/cp-008-sandbox/." --allow-all-tools --no-ask-user 2>&1 \| tee /tmp/cp-008-out.txt; echo "EXIT=$?"` -> 3. `bash: cat /tmp/cp-008-sandbox/greet.py && cd /tmp/cp-008-sandbox && python3 -c "from greet import greet; print(greet('Copilot'))" > /tmp/cp-008-verify.txt && cat /tmp/cp-008-verify.txt && cd - && git status --porcelain > /tmp/cp-008-post.txt && diff /tmp/cp-008-pre.txt /tmp/cp-008-post.txt` | Step 1: sandbox cleared and pre-tripwire captured; Step 2: EXIT=0, transcript shows 3 distinct step actions (file write, file modify, bash invocation), no approval-prompt markers; Step 3: greet.py contains both the def and the docstring, verification python prints `Hello, Copilot!`, tripwire diff empty | `/tmp/cp-008-out.txt` (Autopilot transcript) + `/tmp/cp-008-sandbox/greet.py` (artifact) + `/tmp/cp-008-verify.txt` (orchestrator-side verification) + `/tmp/cp-008-pre.txt` and `/tmp/cp-008-post.txt` (tripwire pair) | PASS if EXIT=0 AND greet.py has function + docstring AND verification python prints `Hello, Copilot!` AND no approval prompts AND tripwire diff is empty; FAIL if any step missing, verification fails, approval prompt appeared, or project tree mutated | 1. If only step 1 completed, verify `--no-ask-user` plus `--allow-all-tools` are both honoured for chained tool calls (older Copilot CLI versions had inconsistent autonomy across tool boundaries); 2. If verification python fails with ImportError, check Copilot wrote to the correct path; 3. If approval prompt appeared, this is a regression in the Autopilot autonomy contract — capture the exact prompt text and file an issue |

### Optional Supplemental Checks

After PASS, inspect the Autopilot transcript for any sequencing oddities (e.g. step 2 happening before step 1 or the verification python being run before the file exists). Out-of-order execution is technically PASS if the final state is correct, but suggests the model is not strictly ordering tool calls, flag for follow-up review.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Copilot CLI Agent Delegation row "Autonomous Build" uses `--allow-all-tools` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/copilot_tools.md` | §2 Autopilot capability and §3 four-way comparison row "Autopilot: Yes (Autonomous)" |
| `../../references/cli_reference.md` | Documents `--allow-all-tools` and `--no-ask-user` in §5 FLAGS REFERENCE |

---

## 5. SOURCE METADATA

- Group: Autopilot Mode
- Playbook ID: CP-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--autopilot-mode/001-autopilot-autonomous-build.md`
