---
title: "CP-015 -- Cross-AI generate-review-fix cycle (SANDBOXED)"
description: "This scenario validates the documented cross-AI generate-review-fix integration pattern for `CP-015`. It focuses on confirming two sequential Copilot calls (generate then fix with orchestrator-injected review note) produce two distinct sandbox artifacts where the fix addresses the review feedback."
---

# CP-015 -- Cross-AI generate-review-fix cycle (SANDBOXED)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-015`.

---

## 1. OVERVIEW

This scenario validates the cross-AI generate-review-fix integration pattern for `CP-015`. It focuses on confirming two sequential Copilot calls, first GPT-5.3-Codex generates a small Python module, then Claude Opus 4.6 fixes it given an orchestrator-injected review note, produce two distinct sandbox artifacts and the second pass actually addresses the feedback.

### Why This Matters

The generate-review-fix cycle is the most reliable cross-AI pattern documented in `references/integration_patterns.md` §2. It exercises three orchestrator capabilities at once: per-call model switching, sandbox-scoped writes and orchestrator-mediated review feedback. If any of those three breaks, the pattern collapses into either a no-op (no diff between v1 and v2) or unbounded scope creep (Copilot ignores the feedback and rewrites unrelated code). Verifying a non-trivial diff plus an explicit empty-list check is the cheapest objective check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-015` and confirm the expected signals without contradictory evidence.

- Objective: Confirm two sequential Copilot calls (generate with GPT-5.3-Codex, then fix with Claude Opus 4.6 given a review note) produce two distinct sandbox artifacts where the fix addresses the feedback
- Real user request: `Run cli-copilot's generate-review-fix pattern end-to-end on a tiny Python module — codex generates, opus fixes given my review note, and I want to see real diff between v1 and v2.`
- RCAF Prompt: `As a cross-AI orchestrator running the generate-review-fix pattern documented in cli-copilot integration_patterns.md §2, dispatch two sequential Copilot calls against the cli-copilot skill in this repository, both scoped to /tmp/cp-015-sandbox/. First call: --model gpt-5.3-codex to generate a small Python module avg_list.py that averages a list of integers. Second call: --model claude-opus-4.7 with the orchestrator-supplied review note 'add explicit handling for empty list (return 0.0 instead of dividing by zero)' to ask Copilot to update the same file. Verify the second-pass file differs from the first-pass file and contains explicit empty-list handling. Return a concise pass/fail verdict with the main reason, the diff line count, and a snippet of the empty-list handling.`
- Expected execution process: orchestrator creates the sandbox, captures pre-call tripwire, dispatches the Codex generation call, snapshots v1, dispatches the Opus fix call with the review note, snapshots v2, then verifies the diff and the empty-list handling
- Expected signals: both calls exit 0. V1 and v2 sandbox artifacts both exist. `diff v1 v2` produces non-empty output. V2 contains an explicit empty-list check (e.g. `if not lst:` or `len(lst) == 0`). Tripwire diff against project tree is empty
- Desired user-visible outcome: PASS verdict + the diff line count + a 2-3 line snippet showing the empty-list handling
- Pass/fail: PASS if both calls exit 0 AND v1/v2 differ AND v2 contains explicit empty-list handling AND project tripwire diff is empty. FAIL if either call errors, v1 == v2, v2 lacks empty-list handling or project tree mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate the generate-review-fix pattern produces a real, scoped fix that addresses the orchestrator's review note".
2. Stay local: two sequential CLI dispatches with different `--model` values. Sandbox-scoped writes.
3. Create the sandbox and capture pre-call project tripwire.
4. Dispatch the Codex generation call, snapshot v1 immediately afterwards.
5. Dispatch the Opus fix call with the review note explicitly quoted, snapshot v2, diff against v1, verify the empty-list handling, then re-tripwire.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-015 | Cross-AI generate-review-fix cycle | Confirm two sequential Copilot calls (generate with GPT-5.3-Codex, then fix with Claude Opus 4.6 given a review note) produce two distinct sandbox artifacts where the fix addresses the feedback | `As a cross-AI orchestrator running the generate-review-fix pattern documented in cli-copilot integration_patterns.md §2, dispatch two sequential Copilot calls against the cli-copilot skill in this repository, both scoped to /tmp/cp-015-sandbox/. First call: --model gpt-5.3-codex to generate a small Python module avg_list.py that averages a list of integers. Second call: --model claude-opus-4.7 with the orchestrator-supplied review note 'add explicit handling for empty list (return 0.0 instead of dividing by zero)' to ask Copilot to update the same file. Verify the second-pass file differs from the first-pass file and contains explicit empty-list handling. Return a concise pass/fail verdict with the main reason, the diff line count, and a snippet of the empty-list handling.` | 1. `bash: rm -rf /tmp/cp-015-sandbox && mkdir -p /tmp/cp-015-sandbox && git status --porcelain > /tmp/cp-015-pre.txt` -> 2. `bash: copilot -p "Generate /tmp/cp-015-sandbox/avg_list.py: a Python module with a single function def avg(lst: list[int]) -> float that returns the arithmetic mean of lst. Do not write outside /tmp/cp-015-sandbox/." --model gpt-5.3-codex --allow-all-tools 2>&1 \| tee /tmp/cp-015-gen.txt; echo "EXIT_GEN=$?"; cp /tmp/cp-015-sandbox/avg_list.py /tmp/cp-015-v1.py 2>/dev/null` -> 3. `bash: copilot -p "Update /tmp/cp-015-sandbox/avg_list.py given this review note: 'add explicit handling for empty list (return 0.0 instead of dividing by zero)'. Keep the existing function signature def avg(lst: list[int]) -> float. Make only the change required by the review note. Do not write outside /tmp/cp-015-sandbox/." --model claude-opus-4.7 --allow-all-tools 2>&1 \| tee /tmp/cp-015-fix.txt; echo "EXIT_FIX=$?"; cp /tmp/cp-015-sandbox/avg_list.py /tmp/cp-015-v2.py` -> 4. `bash: diff /tmp/cp-015-v1.py /tmp/cp-015-v2.py \| tee /tmp/cp-015-diff.txt; DIFF_LINES=$(wc -l < /tmp/cp-015-diff.txt); echo "DIFF_LINES=$DIFF_LINES"; grep -ciE '(if not lst\|len\(lst\) ?== ?0\|if len\(lst\)\|return 0\.0)' /tmp/cp-015-v2.py; git status --porcelain > /tmp/cp-015-post.txt && diff /tmp/cp-015-pre.txt /tmp/cp-015-post.txt` | Step 1: sandbox cleared, pre-tripwire captured; Step 2: EXIT_GEN=0, v1 snapshot exists; Step 3: EXIT_FIX=0, v2 snapshot exists; Step 4: DIFF_LINES > 0, empty-list handling grep count >= 1, project tripwire diff empty | `/tmp/cp-015-gen.txt` (gen transcript) + `/tmp/cp-015-fix.txt` (fix transcript) + `/tmp/cp-015-v1.py` and `/tmp/cp-015-v2.py` (snapshots) + `/tmp/cp-015-diff.txt` (v1 vs v2 diff) + `/tmp/cp-015-pre.txt` and `/tmp/cp-015-post.txt` (project tripwire) | PASS if both EXITs = 0 AND DIFF_LINES > 0 AND v2 contains empty-list handling marker AND project tripwire empty; FAIL if either EXIT != 0, DIFF_LINES = 0 (v1 == v2), v2 lacks empty-list handling, or project tree mutated | 1. If DIFF_LINES = 0, the fix call produced no change — re-issue with the review note quoted more emphatically; 2. If v2 lacks empty-list handling but differs from v1, Copilot may have rewritten unrelated code instead — flag for follow-up; 3. If project tree mutated, audit prompt for ambiguous path constraints |

### Optional Supplemental Checks

After PASS, run the orchestrator-side functional verification: `python3 -c "import sys; sys.path.insert(0, '/tmp/cp-015-sandbox'); from avg_list import avg; print(avg([])); print(avg([1, 2, 3]))"` and confirm the empty list returns `0.0` (not a ZeroDivisionError) and the populated list returns `2.0`. This catches cases where Copilot adds a guard but with the wrong return value.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Copilot CLI Agent Delegation supports per-call model switching |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | §2 Generate-Review-Fix Cycle pattern documentation |
| `../../assets/prompt_templates.md` | §3 Code Review templates inform the review-note framing |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CP-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--integration-patterns/001-cross-ai-generate-review-fix.md`
