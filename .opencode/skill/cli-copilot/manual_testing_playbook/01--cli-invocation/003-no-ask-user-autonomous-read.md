---
title: "CP-003 -- `--no-ask-user` autonomous read"
description: "This scenario validates the `--no-ask-user` autonomy contract for `CP-003`. It focuses on confirming the flag lets a strictly read-only prompt complete without operator interaction or project mutation."
---

# CP-003 -- `--no-ask-user` autonomous read

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-003`.

---

## 1. OVERVIEW

This scenario validates the `--no-ask-user` autonomy flag for `CP-003`. It focuses on confirming the flag honours its documented "no interactive questions" contract for a read-only prompt while leaving the working tree untouched.

### Why This Matters

`--no-ask-user` is the documented complement to `--allow-all-tools` per SKILL.md §3, together they form the full autonomy contract. While CP-002 covers the write side, CP-003 covers the read side: any orchestrator running unattended scenarios needs guaranteed silence from Copilot for read-only probes (no clarifying questions, no permission gates). Verifying this in isolation (without `--allow-all-tools`) catches regressions where `--no-ask-user` alone fails to suppress operator prompts.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--no-ask-user` lets a read-only prompt complete without operator interaction or project mutation
- Real user request: `Ask Copilot a quick read-only question and confirm it answers without ever asking me a clarifying question or modifying anything in the repo.`
- Prompt: `As a cross-AI orchestrator running unattended, invoke Copilot CLI with --no-ask-user against the cli-copilot skill in this repository for a strictly read-only prompt. Verify the call exits 0, returns a non-empty answer, and never blocks stdin asking a clarifying question. Return a concise pass/fail verdict with the main reason and the parsed answer.`
- Expected execution process: orchestrator captures a pre-call tripwire (`git status --porcelain`), dispatches `copilot -p "..." --no-ask-user 2>&1` for a read-only question, then verifies non-empty answer and unchanged working tree
- Expected signals: `EXIT=0`. Stdout contains a multi-sentence answer naming Copilot CLI capabilities. `git status --porcelain` diff is empty. No operator prompt appears
- Desired user-visible outcome: PASS verdict + a one-line note that the autonomous read completed without operator interaction
- Pass/fail: PASS if EXIT=0 AND non-empty answer AND tripwire diff is empty AND no operator prompt blocked stdin. FAIL if the call hangs awaiting input, returns empty output, mutates the project tree or errors

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate --no-ask-user delivers silent autonomy for a read-only prompt".
2. Stay local: this is a direct CLI dispatch from the calling AI. No sub-agent delegation needed.
3. Capture a pre-call tripwire to detect any unintended project-tree mutation.
4. Dispatch the read-only `copilot -p "..." --no-ask-user 2>&1` call.
5. Compare observed output against the desired user-visible outcome, verify the tripwire diff is empty, return a one-line verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-003 | `--no-ask-user` autonomous read | Confirm `--no-ask-user` lets a read-only prompt complete without operator interaction or project mutation | `As a cross-AI orchestrator running unattended, invoke Copilot CLI with --no-ask-user against the cli-copilot skill in this repository for a strictly read-only prompt. Verify the call exits 0, returns a non-empty answer, and never blocks stdin asking a clarifying question. Return a concise pass/fail verdict with the main reason and the parsed answer.` | 1. `bash: git status --porcelain > /tmp/cp-003-pre.txt` -> 2. `bash: copilot -p "List 3 documented capabilities of GitHub Copilot CLI as a numbered list. Do not write any files." --no-ask-user 2>&1 | tee /tmp/cp-003-out.txt` -> 3. `bash: git status --porcelain > /tmp/cp-003-post.txt && diff /tmp/cp-003-pre.txt /tmp/cp-003-post.txt` | Step 1: pre-tripwire captured; Step 2: exits 0, stdout contains a numbered list of >= 3 capabilities, no clarifying-question prompt; Step 3: tripwire diff is empty | `/tmp/cp-003-out.txt` (transcript) + `/tmp/cp-003-pre.txt` and `/tmp/cp-003-post.txt` (tripwire pair) + diff output | PASS if EXIT=0 AND stdout contains numbered capability list AND tripwire diff is empty AND no operator prompt blocked stdin; FAIL if call hangs, returns empty, mutates project tree, or asks a clarifying question | 1. Re-check `--no-ask-user` is the documented autonomy flag in cli_reference.md §5; 2. If a clarifying prompt appeared, verify the binary version supports non-interactive autonomy without `--allow-all-tools`; 3. If tripwire diff non-empty, audit the prompt for any inadvertent write triggers and tighten the scope language |

### Optional Supplemental Checks

After PASS, re-run with a deliberately ambiguous prompt (e.g. "tell me about it") to confirm Copilot still returns *some* answer rather than asking a clarifying question, the autonomy contract requires Copilot to make a best-effort guess rather than block.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, `--no-ask-user` documented in §3 Core Invocation Pattern table |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `--no-ask-user` flag in §5 FLAGS REFERENCE |
| `../../assets/prompt_quality_card.md` | CLEAR check confirms the dispatched prompt is unambiguous enough to avoid clarifying-question triggers |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CP-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/003-no-ask-user-autonomous-read.md`
