---
title: "CG-014 -- Generate-review-fix cross-AI cycle"
description: "This scenario validates the generate-review-fix cross-AI orchestration pattern for `CG-014`. It focuses on confirming the calling AI can drive Gemini through generation, capture an external review, and re-dispatch a focused fix — all into a sandbox directory."
---

# CG-014 -- Generate-review-fix cross-AI cycle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-014`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cg-014-sandbox/` so the project tree is never touched. The `--yolo` flag is constrained to this sandbox via `--include-directories`.

---

## 1. OVERVIEW

This scenario validates the generate-review-fix cross-AI orchestration pattern documented in `references/integration_patterns.md` §2 for `CG-014`. It focuses on proving the orchestrator can drive Gemini through three stages, generate code, capture a review (orchestrator-supplied so the test is deterministic) and re-dispatch a focused fix and that each stage produces an inspectable artifact under a sandbox directory.

### Why This Matters

The generate-review-fix cycle is the canonical cross-AI orchestration pattern in the integration-patterns reference. If any stage silently no-ops (Gemini ignores the review feedback, the fix overwrites with identical content, etc.), the orchestrator's two-call review loop adds latency without adding value. This scenario gives operators a deterministic way to confirm the cycle behaves end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm three sequential Gemini calls (generate → orchestrator-supplied review → fix) produce three distinct sandbox artifacts AND the fix artifact differs from the initial generation in a way that addresses the supplied review feedback
- Real user request: `Run the generate-review-fix loop end-to-end on a tiny Python helper inside /tmp — generate a sum function, then make Gemini fix it after I tell it the function should also handle empty lists.`
- Prompt: `As a cross-AI orchestrator running the generate-review-fix pattern documented in cli-gemini integration_patterns.md, dispatch three sequential Gemini calls against the cli-gemini skill in this repository, all scoped to /tmp/cg-014-sandbox/. First call: generate a small Python module sum_list.py that sums a list of integers. Second call: use the orchestrator-supplied review note 'add explicit handling for empty list (return 0 instead of relying on sum() default)' to ask Gemini to update the same file. Verify the second-pass file differs from the first-pass file and contains explicit empty-list handling. Return a concise pass/fail verdict with the main reason, the diff line count, and a snippet of the empty-list handling.`
- Expected execution process: orchestrator creates a sandbox dir, dispatches the generate call with `--yolo` constrained to the sandbox, captures the v1 artifact, dispatches a fix call with the same constraints, captures the v2 artifact, then `diff`s v1 vs v2 to prove the fix actually changed the code
- Expected signals: both calls exit 0. `/tmp/cg-014-sandbox/sum_list.py` exists after Step 2 (v1) and after Step 4 (v2). `diff /tmp/cg-014-v1.py /tmp/cg-014-v2.py` produces non-empty output. V2 contains an explicit empty-list check (e.g. `if not items` / `len(items) == 0` / `return 0`)
- Desired user-visible outcome: PASS verdict + the diff line count + a 2-3 line snippet showing the empty-list handling
- Pass/fail: PASS if both calls succeed AND v2 differs from v1 AND v2 contains an empty-list handling pattern. FAIL if either call errors, v2 is identical to v1 or v2 lacks empty-list handling

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "drive the generate-review-fix cycle end-to-end and prove the fix actually changes the code".
2. Stay local. The cross-AI nature here is `calling AI ↔ Gemini`, no third-party CLI.
3. Always sandbox under `/tmp/cg-014-sandbox/` and gate `--yolo` with `--include-directories`.
4. Snapshot v1 to a separate path before re-dispatching so the diff is deterministic even if Gemini overwrites in place.
5. Surface the diff line count + the empty-list snippet in the verdict so the operator sees the actual fix rather than just trusting it happened.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-014 | Generate-review-fix cycle | Confirm two sequential Gemini calls (generate then fix) produce two distinct sandbox artifacts and the fix addresses the orchestrator-supplied review feedback | `As a cross-AI orchestrator running the generate-review-fix pattern documented in cli-gemini integration_patterns.md, dispatch three sequential Gemini calls against the cli-gemini skill in this repository, all scoped to /tmp/cg-014-sandbox/. First call: generate a small Python module sum_list.py that sums a list of integers. Second call: use the orchestrator-supplied review note 'add explicit handling for empty list (return 0 instead of relying on sum() default)' to ask Gemini to update the same file. Verify the second-pass file differs from the first-pass file and contains explicit empty-list handling. Return a concise pass/fail verdict with the main reason, the diff line count, and a snippet of the empty-list handling.` | 1. `bash: rm -rf /tmp/cg-014-sandbox && mkdir -p /tmp/cg-014-sandbox` -> 2. `bash: gemini "Generate a Python module at /tmp/cg-014-sandbox/sum_list.py that defines a function sum_list(items) returning the sum of a list of integers. Keep the file under 15 lines. Output only the file." --yolo --include-directories /tmp/cg-014-sandbox -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-014-gen.txt; echo EXIT_GEN=$?` -> 3. `bash: cp /tmp/cg-014-sandbox/sum_list.py /tmp/cg-014-v1.py && cat /tmp/cg-014-v1.py` -> 4. `bash: gemini "Update /tmp/cg-014-sandbox/sum_list.py based on this review note: 'add explicit handling for empty list (return 0 instead of relying on sum() default)'. Modify the file in place. Output only the updated file." --yolo --include-directories /tmp/cg-014-sandbox -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-014-fix.txt; echo EXIT_FIX=$?` -> 5. `bash: cp /tmp/cg-014-sandbox/sum_list.py /tmp/cg-014-v2.py && diff /tmp/cg-014-v1.py /tmp/cg-014-v2.py | wc -l` -> 6. `bash: grep -nE 'if not items\|len\(items\) == 0\|empty\|return 0' /tmp/cg-014-v2.py` | Step 2: `EXIT_GEN=0`, v1 file created; Step 3: v1 content visible; Step 4: `EXIT_FIX=0`, v2 file written; Step 5: diff line count >= 2; Step 6: at least one matching line present in v2 | `/tmp/cg-014-v1.py`, `/tmp/cg-014-v2.py`, the diff line count, the grep output | PASS if Step 5 line count >= 2 AND Step 6 grep finds at least one match; FAIL if v1 and v2 are identical, the empty-list pattern is absent, or either call errors | 1. If v1 == v2, Gemini may have rejected the second call as unnecessary — re-run Step 4 with a stronger directive `Modify the function body to add explicit empty-list handling`; 2. If empty-list pattern is missing but file differs, the fix may have changed cosmetics only — escalate; 3. If `--yolo` did not write to the sandbox, verify `--include-directories` path matches the prompt-supplied path |

### Optional Supplemental Checks

If you want extra signal, run `python3 -c 'import importlib.util, sys; spec=importlib.util.spec_from_file_location("m","/tmp/cg-014-sandbox/sum_list.py"); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); print(m.sum_list([]))'` and confirm it prints `0` rather than erroring.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary (sandbox isolation rule) |
| `../../SKILL.md` | cli-gemini skill surface (generation patterns in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | §2 GENERATE-REVIEW-FIX CYCLE — canonical pattern this scenario validates |
| `../../assets/prompt_templates.md` | §2 CODE GENERATION + §4 BUG FIXING templates referenced by both calls |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CG-014
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--integration-patterns/001-generate-review-fix-cycle.md`
