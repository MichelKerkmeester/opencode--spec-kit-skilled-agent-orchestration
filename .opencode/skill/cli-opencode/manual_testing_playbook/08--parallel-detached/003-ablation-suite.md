---
title: "CO-028 -- Ablation suite via parallel detached sessions"
description: "This scenario validates the ablation suite pattern for `CO-028`. It focuses on confirming TEMPLATE 7 from prompt_templates.md (CIDI framework, parallel detached) can drive a small ablation comparison with results captured to per-session state files."
---

# CO-028 -- Ablation suite via parallel detached sessions

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-028`.

---

## 1. OVERVIEW

> **DESTRUCTIVE SCENARIO (CHK-033):** This test exercises two parallel `opencode run --share` invocations which can publish two live share session URLs simultaneously. To prevent accidental publication from the operator's real project tree, both ablation workers MUST run inside a sandbox tmpdir (`--dir /tmp/co-share-sandbox-028/`) AND the operator MUST explicitly confirm before any URL is published or opened. Recovery and teardown steps in section 3 (Failure Triage) MUST be executed after every run, pass or fail.

This scenario validates Ablation suite via parallel detached sessions for `CO-028`. It focuses on confirming TEMPLATE 7 (Ablation suite, CIDI framework) can drive a small ablation comparison across two configurations dispatched in parallel detached OpenCode sessions, with each session writing structured results to its own output file for downstream comparison.

### Why This Matters

Ablation suites are one of the canonical use cases for parallel detached sessions (per `references/opencode_tools.md` §3 + `references/integration_patterns.md` §3). Each ablation must run in an isolated session so plugin state, MCP state and conversation context do not leak between configurations. The aggregator process compares the per-session outputs and produces the verdict. If the parallel detached sessions silently share state, ablation results become meaningless. This test proves the pattern with two real ablation configurations.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-028` and confirm the expected signals without contradictory evidence.

- Objective: Confirm two parallel detached sessions running an ablation comparison (variant high vs variant minimal) produce two distinct outputs with measurably different reasoning depth, demonstrating the variant flag drives the depth difference.
- Real user request: `Run a small ablation suite with two parallel detached opencode run sessions: one with --variant high and one with --variant minimal. Both ask the same multi-dimensional architecture question. Confirm the high-variant session produces a noticeably deeper response.`
- Prompt: `As an in-OpenCode operator (or fresh shell) running an ablation suite per TEMPLATE 7 (CIDI framework), dispatch two parallel detached opencode run sessions on different ports — one with --variant high and one with --variant minimal — both asking the same multi-dimensional architecture trade-off question. Capture each session's output to its own log file. Compute the byte-count ratio between the two responses. Verify the high-variant response is at least 2x larger than the minimal-variant response. Return a concise pass/fail verdict naming the byte-count ratio and the session ids.`
- Expected execution process: External-AI orchestrator pre-creates the output dir, dispatches two parallel detached sessions with the same prompt but different `--variant` levels, waits for both, computes byte counts of the two response payloads, validates the ratio is at least 2.0 and surfaces the session ids.
- Expected signals: Both dispatches exit 0. Two distinct session_ids. High-variant response byte count is at least 2x minimal-variant byte count. Both responses reference the same architectural question.
- Desired user-visible outcome: Verdict naming the byte-count ratio, both session ids and the recommended variant for ablation default.
- Pass/fail: PASS if both exit 0 AND distinct session ids AND ratio >= 2.0. FAIL if either dispatch fails, ids collide or ratio is below 2.0 (variant flag has no measurable effect).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pre-create the sandbox tmpdir and ablation dir: `rm -rf /tmp/co-share-sandbox-028/ /tmp/co-028-ablation/ && mkdir -p /tmp/co-share-sandbox-028/ /tmp/co-028-ablation/`. NEVER run with `--dir` pointing at the operator project tree.
3. Dispatch two parallel detached sessions with `--dir /tmp/co-share-sandbox-028/`, the same prompt, but different variants.
4. Wait for both.
5. Compute byte counts and ratio.
6. Validate distinct session ids.
7. Confirm operator explicit consent before any URL publication. No share URLs MAY be published from the operator project tree.
8. After the run (pass or fail) revoke each URL via `opencode session revoke ${SID_HIGH}` and `opencode session revoke ${SID_MIN}`, then remove the sandbox tmpdir via `rm -rf /tmp/co-share-sandbox-028/`.
9. Return a verdict naming ratio, ids and sandbox teardown confirmation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-028 | Ablation suite via parallel detached sessions | Confirm 2-session ablation (variant high vs minimal) produces measurably different reasoning depth | `As an in-OpenCode operator (or fresh shell) running an ablation suite per TEMPLATE 7 (CIDI framework), dispatch two parallel detached opencode run sessions on different ports — one with --variant high and one with --variant minimal — both asking the same multi-dimensional architecture trade-off question. Capture each session's output to its own log file. Compute the byte-count ratio between the two responses. Verify the high-variant response is at least 2x larger than the minimal-variant response. Return a concise pass/fail verdict naming the byte-count ratio and the session ids.` | 1. `bash: rm -rf /tmp/co-share-sandbox-028/ /tmp/co-028-ablation && mkdir -p /tmp/co-share-sandbox-028/ /tmp/co-028-ablation` -> 2. `bash: opencode run --share --port 4200 --model github-copilot/gpt-5.4 --agent general --variant high --format json --dir /tmp/co-share-sandbox-028/ "Ablation suite worker A (variant high). Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-028-ablation/variant-high.jsonl 2>&1 </dev/null & opencode run --share --port 4201 --model github-copilot/gpt-5.4 --agent general --variant minimal --format json --dir /tmp/co-share-sandbox-028/ "Ablation suite worker B (variant minimal). Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-028-ablation/variant-minimal.jsonl 2>&1 </dev/null &; wait && echo "WAIT: $?"` -> 3. `bash: HIGH=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-028-ablation/variant-high.jsonl \| wc -c); MIN=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-028-ablation/variant-minimal.jsonl \| wc -c); echo "HIGH=$HIGH MIN=$MIN RATIO=$(echo "scale=2; $HIGH/$MIN" \| bc 2>/dev/null \|\| echo NA)"` -> 4. `bash: SID_HIGH=$(jq -r 'select(.type == "session.started") \| .session_id' /tmp/co-028-ablation/variant-high.jsonl \| head -1); SID_MIN=$(jq -r 'select(.type == "session.started") \| .session_id' /tmp/co-028-ablation/variant-minimal.jsonl \| head -1); [ "$SID_HIGH" != "$SID_MIN" ] && [ -n "$SID_HIGH" ] && [ -n "$SID_MIN" ] && echo "DISTINCT_SESSIONS_OK" \|\| echo "DISTINCT_FAIL"` | Step 1: sandbox tmpdir and ablation dir created; Step 2: WAIT exit 0 and both `--dir` values resolve to `/tmp/co-share-sandbox-028/`, not the operator project tree; Step 3: HIGH and MIN byte counts captured; RATIO >= 2.0; Step 4: prints DISTINCT_SESSIONS_OK | `/tmp/co-028-ablation/variant-{high,minimal}.jsonl`, terminal ratio + session id output, sandbox tmpdir path | PASS only after operator explicitly confirms sandbox URL publication; the URLs MUST NOT be published from the operator project tree. PASS requires WAIT exit 0 AND distinct session ids AND RATIO >= 2.0 AND both `--dir` values resolve to the sandbox tmpdir. FAIL if either dispatch fails, ids collide, ratio < 2.0, OR either `--dir` resolves to anything outside the sandbox tmpdir | 1. Recovery / teardown (RUN AFTER EVERY RUN, pass or fail): (a) Revoke each URL via `opencode session revoke ${SID_HIGH}` and `opencode session revoke ${SID_MIN}`; (b) Remove the sandbox tmpdir with `rm -rf /tmp/co-share-sandbox-028/`. 2. If RATIO is close to 1.0, the variant flag may be silently ignored — see CO-012 for variant-effect troubleshooting; 3. If session ids collide, the parallel detached pattern is leaking state — verify both ports are unique; 4. If `wait` exits non-zero, inspect each log file for stderr clues; 5. If ratio computation fails, `bc` may be missing — fall back to manual computation: `printf "%d %d\n" $HIGH $MIN`; 6. NEVER run with `--dir` pointing at the operator project tree |

### Optional Supplemental Checks

For per-session state isolation, list `~/.opencode/state/<SID_HIGH>/` and `~/.opencode/state/<SID_MIN>/` and confirm both exist independently. Inspect `messages.jsonl` in each to confirm no cross-session message leakage occurred. This stress-tests the state-directory isolation contract under parallel ablation load.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt_templates.md` (TEMPLATE 7: ABLATION SUITE) | Canonical ablation suite pattern |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 5 (background dispatch `</dev/null`) |
| `../../references/opencode_tools.md` (§3 PARALLEL DETACHED SESSIONS) | Documents the unique value prop |
| `../../references/integration_patterns.md` (§3 USE CASE 2) | The use case 2 contract |

---

## 5. SOURCE METADATA

- Group: Parallel Detached
- Playbook ID: CO-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--parallel-detached/003-ablation-suite.md`
