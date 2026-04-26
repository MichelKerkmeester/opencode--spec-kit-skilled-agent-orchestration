---
title: "CG-016 -- Background execution parallel dispatch"
description: "This scenario validates the background execution integration pattern for `CG-016`. It focuses on confirming the orchestrator can launch two independent Gemini calls in parallel via shell backgrounding, wait for both, and aggregate the results."
---

# CG-016 -- Background execution parallel dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-016`.

---

## 1. OVERVIEW

This scenario validates the background execution pattern documented in `references/integration_patterns.md` §4 for `CG-016`. It focuses on confirming the orchestrator can launch two independent read-only Gemini calls in parallel using shell backgrounding (`&` + `wait`), capture their outputs to separate files and aggregate the results without race conditions on shared files.

### Why This Matters

Background execution is the cli-gemini integration pattern that lets the calling AI offload long-running analysis to Gemini while continuing other work. Operators need to verify both that the parallel dispatch actually runs concurrently AND that the wait semantics correctly block until all background tasks complete before the verdict is computed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm two independent read-only Gemini calls launched in parallel via shell backgrounding both complete, write to distinct output files and the orchestrator can aggregate their results after `wait`
- Real user request: `Spin up two Gemini calls in parallel — one summarising the cli-gemini SKILL.md and one summarising the cli_reference.md — and give me both summaries once they're done.`
- Prompt: `As a cross-AI orchestrator running parallel reads, dispatch two independent read-only Gemini CLI calls against the cli-gemini skill in this repository: one summarising SKILL.md and one summarising references/cli_reference.md, both running in the background simultaneously. Verify both calls finish, both write to distinct output files, and the orchestrator can read both summaries after wait. Return a concise pass/fail verdict with the main reason and a one-line summary from each output file.`
- Expected execution process: orchestrator launches both calls with `&`, captures the two PIDs, runs `wait` for both, then verifies both output files exist and are non-empty
- Expected signals: both background calls exit 0 (verifiable via the captured PIDs). `/tmp/cg-016-skill.txt` and `/tmp/cg-016-cli.txt` both exist and are non-empty after `wait`. The elapsed wall-clock for the parallel pair is meaningfully less than the sum of two sequential single-call times (rough proxy: total elapsed < 2× the longer single call)
- Desired user-visible outcome: PASS verdict + a one-line summary from each file (e.g. first non-empty line of each output)
- Pass/fail: PASS if both outputs exist and are non-empty AND both background processes exited 0. FAIL if either output is missing/empty or either process exited non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify parallel Gemini dispatch via shell backgrounding works end-to-end".
2. Stay local. This is a direct CLI dispatch.
3. Use `--allowed-tools` read-only allowlists to avoid file-write race conditions per the integration-patterns anti-pattern rule.
4. Capture PIDs with `$!` immediately after each background launch and `wait` on both before computing the verdict.
5. Surface a one-line summary per file in the verdict so the operator sees real evidence both calls produced content.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-016 | Background execution parallel dispatch | Confirm two independent read-only Gemini calls run in parallel via shell backgrounding and both produce non-empty outputs after `wait` | `As a cross-AI orchestrator running parallel reads, dispatch two independent read-only Gemini CLI calls against the cli-gemini skill in this repository: one summarising SKILL.md and one summarising references/cli_reference.md, both running in the background simultaneously. Verify both calls finish, both write to distinct output files, and the orchestrator can read both summaries after wait. Return a concise pass/fail verdict with the main reason and a one-line summary from each output file.` | 1. `bash: rm -f /tmp/cg-016-skill.txt /tmp/cg-016-cli.txt /tmp/cg-016-status.txt && START=$(date +%s)` -> 2. `bash: gemini "@.opencode/skill/cli-gemini/SKILL.md Summarise the role of this skill in 2 sentences. Read-only." --allowed-tools read_file,search_file_content,glob,list_directory -m gemini-3.1-pro-preview -o text > /tmp/cg-016-skill.txt 2>&1 & PID1=$!; gemini "@.opencode/skill/cli-gemini/references/cli_reference.md Summarise this reference in 2 sentences. Read-only." --allowed-tools read_file,search_file_content,glob,list_directory -m gemini-3.1-pro-preview -o text > /tmp/cg-016-cli.txt 2>&1 & PID2=$!; wait $PID1; EXIT1=$?; wait $PID2; EXIT2=$?; ELAPSED=$(($(date +%s) - START)); echo "EXIT1=$EXIT1 EXIT2=$EXIT2 ELAPSED=${ELAPSED}s" > /tmp/cg-016-status.txt; cat /tmp/cg-016-status.txt` -> 3. `bash: ls -l /tmp/cg-016-skill.txt /tmp/cg-016-cli.txt && wc -c /tmp/cg-016-skill.txt /tmp/cg-016-cli.txt` -> 4. `bash: head -1 /tmp/cg-016-skill.txt && echo '---' && head -1 /tmp/cg-016-cli.txt` | Step 2: `EXIT1=0`, `EXIT2=0`, `ELAPSED` printed; Step 3: both files exist with non-zero byte count; Step 4: prints a non-empty first line from each file | `/tmp/cg-016-skill.txt`, `/tmp/cg-016-cli.txt`, `/tmp/cg-016-status.txt` (with PIDs and elapsed) | PASS if both `EXIT1=0` and `EXIT2=0` AND both files are non-empty AND first lines are populated; FAIL if either exit code is non-zero, either file is empty, or `wait` returned before both completed | 1. If only one file is populated, the second background process likely raced on a shared resource — re-check the `&` placement; 2. If `wait` returned immediately, the PID capture may have missed `$!` — verify the order of `&` then `PID=$!`; 3. If `ELAPSED` is suspiciously close to 2× a typical single-call time, the two calls may have run sequentially despite the `&` — escalate; 4. If a 429 rate-limit message appears in either file, dispatch fewer parallel calls per `references/integration_patterns.md` §6 |

### Optional Supplemental Checks

If you want a stricter parallelism check, capture single-call elapsed time once (e.g. just the SKILL.md summarisation) and assert `ELAPSED < 1.6 × single-call time`. Skip on rate-limited days when retries inflate elapsed time.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (background-execution example in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | §4 BACKGROUND EXECUTION, canonical pattern this scenario validates. §12 ANTI-PATTERNS rule 6 documents the file-write race-condition concern |
| `../../references/cli_reference.md` | §10 RATE LIMITS documents the parallel-dispatch quota considerations |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CG-016
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--integration-patterns/003-background-execution-parallel.md`
