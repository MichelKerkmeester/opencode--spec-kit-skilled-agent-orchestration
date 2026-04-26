---
title: "CO-026 -- Parallel detached session (use case 2 — port + share)"
description: "This scenario validates the parallel detached session pattern (use case 2) for `CO-026`. It focuses on confirming an in-OpenCode operator can spawn a SEPARATE OpenCode session via `--share --port <N>` with its own session id and state directory."
---

# CO-026 -- Parallel detached session (use case 2 -- port + share)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-026`.

---

## 1. OVERVIEW

This scenario validates Parallel detached session (use case 2) for `CO-026`. It focuses on confirming the documented use case 2 path in `references/integration_patterns.md` §3. An in-OpenCode operator can spawn a SEPARATE OpenCode session via `--share --port <N>` with its own session id and its own state directory under `~/.opencode/state/`, distinct from the parent session.

### Why This Matters

Use case 2 is the documented exception to the self-invocation guard. The guard MUST trip on in-OpenCode runtime AND the prompt MUST include parallel-session keywords for the dispatch to be permitted (per ADR-001 + SKILL.md §1 "When NOT to Use" exception clause). If the dispatch is refused even with valid parallel-session keywords, every ablation, worker farm and parallel research workflow regresses. If the dispatch is permitted without parallel-session keywords, the safety story collapses. This test exercises the legitimate use case 2 path with the keywords included.

> **Cross-AI dependency note:** This scenario can be executed from outside OpenCode (the originating runtime is unimportant). What matters is that the dispatched `opencode run --share --port <N>` command emits a session.started event with a session id distinct from the originator's session id (if any) and that the state directory is created independently. PASS condition is satisfied by opencode emitting the new session id and creating an independent state directory. Share URL publication is opt-in per CHK-033 (operator confirmation required).

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CO-026` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `opencode run --share --port <N>` (with explicit parallel-session keywords in the prompt) creates a SEPARATE session with its own session id and its own state directory under `~/.opencode/state/`.
- Real user request: `Spawn a parallel detached opencode run on port 4096 to run a small isolated worker task. Confirm the new session has its own session id and its own state directory, and that we did NOT trigger the self-invocation refusal.`
- Prompt: `As an in-OpenCode operator (or external runtime simulating one) spawning a parallel detached OpenCode session for a small isolated worker task, dispatch opencode run with --share --port 4096 and a prompt that explicitly says "parallel detached session" + "ablation suite" so the smart router permits use case 2. Verify the dispatch creates a new session with its own session id, its own state directory at ~/.opencode/state/<id>/, and that the dispatch is NOT refused with the self-invocation message. Return a concise pass/fail verdict naming the new session id and confirming the state directory exists.`
- Expected execution process: External-AI orchestrator dispatches `opencode run --share --port 4096` with a prompt that explicitly includes the parallel-session keywords. Captures the JSON event stream, extracts the session id from session.started, validates `~/.opencode/state/<session-id>/` exists and validates no refusal message appears. CHK-033 share URL confirmation: this scenario uses `--share` only because use case 2 documents it as the canonical pattern and the share URL is for inspection (the operator MUST confirm before publishing, with no real publication occurring in this test).
- Expected signals: Dispatch exits 0. JSON event stream emits `session.started` with a non-empty session_id. `~/.opencode/state/<session-id>/` directory exists after dispatch. No refusal message ("self-invocation refused") in stderr. The session id is distinct from the originating session (if any).
- Desired user-visible outcome: Verdict naming the new session id and confirming the state directory exists.
- Pass/fail: PASS if exit 0 AND new session_id captured AND state directory exists AND no refusal message. FAIL if dispatch is refused or state directory is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch `opencode run --share --port 4096` with a prompt including the parallel-session keywords.
3. Capture the new session_id from session.started.
4. Validate `~/.opencode/state/<id>/` exists.
5. Confirm no refusal message in stderr.
6. Return a verdict naming the session id and state path.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-026 | Parallel detached session (use case 2) | Confirm `opencode run --share --port <N>` with parallel-session keywords creates a separate session id and state directory | `As an in-OpenCode operator (or external runtime simulating one) spawning a parallel detached OpenCode session for a small isolated worker task, dispatch opencode run with --share --port 4096 and a prompt that explicitly says "parallel detached session" + "ablation suite" so the smart router permits use case 2. Verify the dispatch creates a new session with its own session id, its own state directory at ~/.opencode/state/<id>/, and that the dispatch is NOT refused with the self-invocation message. Return a concise pass/fail verdict naming the new session id and confirming the state directory exists.` | 1. `bash: opencode run --share --port 4096 --model anthropic/claude-opus-4-7 --agent general --variant high --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "Spawn a parallel detached session for a small isolated ablation suite worker. Briefly say hello and confirm you are running in a separate OpenCode session." > /tmp/co-026-events.jsonl 2>&1 && echo "DISPATCH: $?"` -> 2. `bash: SID=$(jq -r 'select(.type == "session.started") \| .session_id' /tmp/co-026-events.jsonl \| head -1) && echo "Detached SID=$SID"` -> 3. `bash: ls -d ~/.opencode/state/"$SID" 2>&1 \| head -3 && echo "STATE_DIR_CHECK: $?"` -> 4. `bash: grep -ciE 'self-invocation refused' /tmp/co-026-events.jsonl` -> 5. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-026-events.jsonl \| grep -ciE '(parallel\|detached\|separate)'` | Step 1: DISPATCH exit 0 (dispatch was permitted because the prompt has parallel-session keywords); Step 2: SID captured non-empty; Step 3: state directory exists at `~/.opencode/state/<SID>/`; Step 4: refusal message count = 0; Step 5: session.completed references parallel/detached/separate (acknowledging the use case 2 context) | `/tmp/co-026-events.jsonl`, captured SID and state-dir listing, terminal echoes | PASS if exit 0 AND new SID captured AND state directory exists AND zero refusal messages; FAIL if dispatch refused, state directory missing, or session id is empty | 1. If the dispatch is refused with the self-invocation message, the prompt may not have the correct parallel-session keywords — re-prompt with explicit "parallel detached" wording; 2. If `~/.opencode/state/<id>/` is missing, the state directory may live elsewhere on this OS — `find ~ -name lock 2>/dev/null \| head` to locate; 3. If port 4096 is in use, swap to a higher port (e.g., 4097) — port collisions cause silent dispatch errors; 4. NEVER actually open or share the published URL — this test only validates the session creation path, not the share publication |

### Optional Supplemental Checks

For per-port isolation, dispatch a second parallel detached session on a different port (e.g., 4097) immediately after the first. Confirm both have distinct session ids AND distinct state directories. This proves multiple parallel sessions can coexist on the same machine without state contention.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§3 USE CASE 2: IN-OPENCODE PARALLEL DETACHED SESSION) | Use case 2 contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 "When NOT to Use" parallel-session exception, §2 self-invocation guard parallel-session keyword check, NEVER rule 2 (CHK-033) |
| `../../assets/prompt_templates.md` (TEMPLATE 2: IN-OPENCODE PARALLEL DETACHED SESSION) | Canonical use case 2 prompt shape |
| `../../references/cli_reference.md` | §4 `--share` + `--port` flag rows, §8 STATE LOCATION |

---

## 5. SOURCE METADATA

- Group: Parallel Detached
- Playbook ID: CO-026
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--parallel-detached/001-parallel-detached-session.md`
