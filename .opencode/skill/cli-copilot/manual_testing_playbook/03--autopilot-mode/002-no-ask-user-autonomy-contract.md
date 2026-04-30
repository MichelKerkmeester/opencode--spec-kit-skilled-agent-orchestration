---
title: "CP-009 -- `--no-ask-user` autonomy contract under read-only constraint"
description: "This scenario validates the `--no-ask-user` autonomy contract for `CP-009` under a read-only constraint. It focuses on confirming Copilot honours the contract for a read-only analysis prompt without escalating to a clarifying question or write attempt."
---

# CP-009 -- `--no-ask-user` autonomy contract under read-only constraint

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-009`.

---

## 1. OVERVIEW

This scenario validates the `--no-ask-user` autonomy contract for `CP-009` specifically under a **read-only** constraint (no `--allow-all-tools`). It focuses on confirming that for a prompt that explicitly does not require write access, Copilot completes the read-only analysis without escalating to a clarifying question or attempting an out-of-scope write.

### Why This Matters

CP-003 already covers the basic "read-only completes silently" path. CP-009 specifically tests the **autonomy contract under contradiction**, what happens when `--no-ask-user` is set but Copilot might naturally want to write something. The documented contract per SKILL.md §3 says Copilot must make a best-effort decision rather than block. If Copilot escalates ("should I write this to a file?") despite `--no-ask-user`, the contract is broken. This scenario uses a deliberately analysis-flavored prompt that some models might want to "save for later" to stress-test the autonomy boundary.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--no-ask-user` (without `--allow-all-tools`) honours its autonomy contract for a read-only analysis prompt, Copilot returns the analysis or declines clearly, without asking a clarifying question
- Real user request: `Ask Copilot to summarise our cli_reference.md flags and verify it doesn't try to escalate or save files even if it wants to.`
- RCAF Prompt: `As a cross-AI orchestrator probing the autonomy contract, invoke Copilot CLI with --no-ask-user (without --allow-all-tools) against the cli-copilot skill in this repository for a prompt that asks for read-only analysis of references/cli_reference.md. Verify the call completes without operator interaction, returns a non-empty analysis, and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and a one-line note about whether Copilot honoured the read-only autonomy contract or escalated.`
- Expected execution process: orchestrator captures a pre-call tripwire, dispatches `copilot -p "..." --no-ask-user 2>&1` (no `--allow-all-tools`) for a read-only analysis prompt, then verifies non-empty analysis output and unchanged working tree
- Expected signals: `EXIT=0`. Stdout contains a multi-sentence analysis naming at least 2 documented flags from `references/cli_reference.md`. No operator prompt appears (no clarifying question, no "should I write..." question). Tripwire diff is empty
- Desired user-visible outcome: PASS verdict + the named flags + a one-line note that read-only autonomy completed without escalation
- Pass/fail: PASS if EXIT=0 AND stdout contains analysis naming >= 2 documented flags AND no operator prompt appears AND tripwire diff is empty. FAIL if call hangs awaiting input, escalates with a clarifying question, attempts an out-of-scope write or returns empty output

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "stress-test the --no-ask-user autonomy contract on a prompt that some models might want to save for later".
2. Stay local: this is a direct CLI dispatch with `--no-ask-user` only (no `--allow-all-tools`).
3. Capture a pre-call tripwire.
4. Dispatch the read-only analysis prompt.
5. Inspect for analysis content, the absence of clarifying questions and the empty tripwire diff.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-009 | `--no-ask-user` autonomy contract under read-only constraint | Confirm `--no-ask-user` (without `--allow-all-tools`) returns a read-only analysis without escalating to a clarifying question | `As a cross-AI orchestrator probing the autonomy contract, invoke Copilot CLI with --no-ask-user (without --allow-all-tools) against the cli-copilot skill in this repository for a prompt that asks for read-only analysis of references/cli_reference.md. Verify the call completes without operator interaction, returns a non-empty analysis, and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and a one-line note about whether Copilot honoured the read-only autonomy contract or escalated.` | 1. `bash: git status --porcelain > /tmp/cp-009-pre.txt` -> 2. `bash: copilot -p "Read-only analysis: review @./.opencode/skill/cli-copilot/references/cli_reference.md and summarise 3 documented flags from §5 FLAGS REFERENCE. Return the summary in plain text. Do not write any files. Do not ask clarifying questions — make best-effort assumptions if anything is ambiguous." --no-ask-user 2>&1 \| tee /tmp/cp-009-out.txt; echo "EXIT=$?"` -> 3. `bash: git status --porcelain > /tmp/cp-009-post.txt && diff /tmp/cp-009-pre.txt /tmp/cp-009-post.txt && grep -ciE '(^should i\|do you want\|please clarify\|may i\|can i)' /tmp/cp-009-out.txt` | Step 1: pre-tripwire captured; Step 2: EXIT=0, stdout contains analysis naming >= 2 documented flags (e.g. `--prompt`, `--allow-all-tools`, `--model`, `--target`, `--no-ask-user`); Step 3: tripwire diff empty, clarifying-question grep count = 0 | `/tmp/cp-009-out.txt` (transcript) + `/tmp/cp-009-pre.txt` and `/tmp/cp-009-post.txt` (tripwire pair) + clarifying-question grep count | PASS if EXIT=0 AND analysis names >= 2 flags AND clarifying-question grep count = 0 AND tripwire diff empty; FAIL if call hangs, escalates with a clarifying question, mutates tree, or returns empty | 1. If clarifying-question grep > 0, this is a regression in the `--no-ask-user` contract — capture the exact escalation text; 2. If tripwire diff non-empty without `--allow-all-tools`, this is a SECURITY-grade defect (Copilot wrote without write-tool permission); halt and file an issue; 3. If output is empty, retry once with stderr captured separately to surface any silent error |

### Optional Supplemental Checks

After PASS, repeat with an even more ambiguous prompt (e.g. "tell me about the flags") to confirm Copilot still makes a best-effort guess rather than asking. The autonomy contract should hold for ambiguous inputs too.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, `--no-ask-user` documented in §3 Core Invocation Pattern |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `--no-ask-user` flag in §5 FLAGS REFERENCE. The file under analysis is the test target |
| `../../assets/prompt_quality_card.md` | CLEAR check confirms the dispatched prompt explicitly forbids clarifying questions |

---

## 5. SOURCE METADATA

- Group: Autopilot Mode
- Playbook ID: CP-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--autopilot-mode/002-no-ask-user-autonomy-contract.md`
