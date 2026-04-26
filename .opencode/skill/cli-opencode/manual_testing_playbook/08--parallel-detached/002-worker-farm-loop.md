---
title: "CO-027 -- Worker farm loop with </dev/null background dispatch"
description: "This scenario validates the worker-farm loop pattern for `CO-027`. It focuses on confirming N parallel detached sessions can be spawned in a `while read` loop with the documented `</dev/null` redirect to prevent silent stdin consumption."
---

# CO-027 -- Worker farm loop with `</dev/null` background dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-027`.

---

## 1. OVERVIEW

This scenario validates Worker farm loop with `</dev/null` for `CO-027`. It focuses on confirming the documented worker-farm pattern in `references/integration_patterns.md` §6 (silent stdin consumption fix) and `assets/prompt_templates.md` TEMPLATE 8: N parallel detached sessions can be spawned in a background loop with the canonical `</dev/null` redirect that prevents the backgrounded `opencode run` from silently consuming the loop's stdin.

### Why This Matters

The silent stdin consumption trap is the most subtle failure mode in cli-opencode background dispatch loops. Without `</dev/null`, the first iteration's backgrounded process inherits the loop's stdin and reads the rest of the input file, causing the loop to exit after one iteration with no error. SKILL.md ALWAYS rule 5 mandates the `</dev/null` redirect for exactly this reason. If the documented pattern actually fails or the operator skips the redirect, the worker-farm dispatch silently produces only one worker. This test proves both that the redirect works AND that omitting it produces the documented failure (so operators recognize the trap).

> **Cross-AI dependency note:** This scenario validates the documented bash-loop pattern. The originating runtime is irrelevant. The PASS condition is that the documented pattern dispatches all 3 workers (each with its own session id) and the broken pattern (without `</dev/null`) demonstrably fails to dispatch all 3.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-027` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a 3-worker farm loop with the documented `</dev/null` redirect spawns all 3 sessions, AND demonstrate that omitting `</dev/null` causes silent stdin consumption (only some workers spawn).
- Real user request: `Run a small worker farm with 3 detached opencode run sessions, each on a different port. Use the documented </dev/null redirect to prevent silent stdin consumption. Confirm all 3 workers complete successfully.`
- Prompt: `As an in-OpenCode operator (or fresh shell) running a parallel worker farm, dispatch a 3-worker loop using TEMPLATE 8 from prompt_templates.md. Each worker uses opencode run with --share --port (4100 + N) and a small isolated task. Critically, append the documented </dev/null redirect to each backgrounded invocation. After the loop, wait for all workers to complete and verify all 3 produced output files. Return a concise pass/fail verdict naming the worker count completed and confirming </dev/null was applied.`
- Expected execution process: External-AI orchestrator pre-creates an output directory, runs the documented `for n in 1 2 3` loop with `</dev/null` redirect, waits for all 3 backgrounded processes, validates 3 distinct output files exist with content and validates each worker has a distinct session_id.
- Expected signals: All 3 workers complete. 3 output files exist with content. 3 distinct session_ids captured. No silent stdin consumption (loop did not exit early). Shell `wait` returned 0.
- Desired user-visible outcome: Verdict naming all 3 worker session ids and the output file size for each.
- Pass/fail: PASS if all 3 outputs exist AND 3 distinct session_ids AND `wait` exit 0. FAIL if fewer than 3 outputs exist (silent stdin consumption happened) or any session is missing its id.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pre-create `/tmp/co-027-logs/` for the worker outputs.
3. Run the 3-worker `for` loop with `</dev/null` redirect.
4. Wait for all backgrounded workers.
5. Validate all 3 output files exist with content.
6. Validate 3 distinct session_ids.
7. Return a verdict naming all 3 session ids.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-027 | Worker farm loop with `</dev/null` | Confirm 3-worker farm loop with `</dev/null` spawns all 3 sessions and produces 3 distinct session ids | `As an in-OpenCode operator (or fresh shell) running a parallel worker farm, dispatch a 3-worker loop using TEMPLATE 8 from prompt_templates.md. Each worker uses opencode run with --share --port (4100 + N) and a small isolated task. Critically, append the documented </dev/null redirect to each backgrounded invocation. After the loop, wait for all workers to complete and verify all 3 produced output files. Return a concise pass/fail verdict naming the worker count completed and confirming </dev/null was applied.` | 1. `bash: rm -rf /tmp/co-027-logs && mkdir -p /tmp/co-027-logs` -> 2. `bash: for n in 1 2 3; do port=$((4100 + n)); opencode run --share --port "$port" --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "Worker $n in a parallel detached worker farm. Briefly acknowledge you are worker $n in one short sentence." > /tmp/co-027-logs/worker-$n.jsonl 2>&1 </dev/null & done; wait && echo "WAIT: $?"` -> 3. `bash: ls -la /tmp/co-027-logs/ \| tail -5` -> 4. `bash: wc -c /tmp/co-027-logs/worker-1.jsonl /tmp/co-027-logs/worker-2.jsonl /tmp/co-027-logs/worker-3.jsonl` -> 5. `bash: for n in 1 2 3; do jq -r 'select(.type == "session.started") \| .session_id' /tmp/co-027-logs/worker-$n.jsonl \| head -1; done \| sort -u \| wc -l` -> 6. `bash: for n in 1 2 3; do jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-027-logs/worker-$n.jsonl \| grep -ciE "worker $n"; done` | Step 1: log dir created; Step 2: WAIT exit 0; Step 3: 3 worker logs listed; Step 4: each log has byte count > 0; Step 5: count of distinct session ids = 3 (all workers got their own session); Step 6: each worker's response references its own worker number | `/tmp/co-027-logs/worker-{1,2,3}.jsonl`, ls output, distinct-id count | PASS if WAIT exit 0 AND 3 logs with content AND 3 distinct session ids AND each worker references its own number; FAIL if fewer than 3 logs, ids collide, or wait fails | 1. If only 1 worker log has content and the others are empty, the `</dev/null` redirect was missed — re-run with the exact loop body shown above; 2. If `wait` exits non-zero, one of the backgrounded processes failed — inspect the empty log files for stderr clues; 3. If all 3 workers share the same session id, the `--port` may have been ignored — verify version and re-dispatch; 4. If port collision errors appear, raise the port range higher (e.g., 4200+) and retry |

### Optional Supplemental Checks

For the documented failure mode demonstration, optionally repeat the loop WITHOUT `</dev/null` against a `while IFS= read -r line; do ... done < input.txt` form (with input.txt containing 3 dummy lines). Confirm the loop exits early (only 1 worker dispatched). This is the canonical failure that motivated the `</dev/null` rule. Document the failure as expected and do not flag it as a regression.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§6 SILENT STDIN CONSUMPTION) | The documented `</dev/null` fix |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 5 (always append `</dev/null` for background dispatch in `while read` loops) |
| `../../assets/prompt_templates.md` (TEMPLATE 8: WORKER FARM DISPATCH) | Canonical worker-farm loop shape with `</dev/null` |

---

## 5. SOURCE METADATA

- Group: Parallel Detached
- Playbook ID: CO-027
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--parallel-detached/002-worker-farm-loop.md`
