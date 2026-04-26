---
title: "CO-019 -- Resume specific session by id (-s / --session)"
description: "This scenario validates the `-s <id>` / `--session <id>` flag for `CO-019`. It focuses on confirming a specific session can be resumed by id and the resumed turn has access to that session's prior context."
---

# CO-019 -- Resume specific session by id (-s / --session)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-019`.

---

## 1. OVERVIEW

This scenario validates Resume specific session by id for `CO-019`. It focuses on confirming `-s <id>` (alias `--session <id>`) resumes a specific captured session id and the resumed turn has access to that session's content (per `references/cli_reference.md` §4 flag table).

### Why This Matters

Where `-c` resumes the most recent session, `-s <id>` resumes any session by its captured id. This is the foundation for managing multiple parallel investigations from the same external runtime. The calling AI captures session ids from JSON event streams and resumes whichever it needs. If `-s` silently starts a fresh session or fails to find the id, multi-investigation workflows break.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CO-019` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `-s <id>` resumes the named session and the resumed turn has access to that session's prior content.
- Real user request: `Run an opencode run dispatch, capture the session id from the JSON event stream, then run a follow-up opencode run with -s <id> referencing the prior turn's content. Confirm the resumed turn correctly references the prior context.`
- Prompt: `As an external-AI conductor managing a captured session id, dispatch a first opencode run with --format json and use jq to extract session_id from the session.started event. Then dispatch a second opencode run with -s <captured-id> and a follow-up question that requires access to the first turn's content. Verify the second response references content from the captured session, not a fresh session. Return a concise pass/fail verdict naming the captured session id and the prior content the second turn referenced.`
- Expected execution process: External-AI orchestrator dispatches turn 1 with `--format json`, parses the session_id from session.started, then dispatches turn 2 with `-s <session-id>` and a follow-up. Validates the second turn references content from the first turn.
- Expected signals: Both dispatches exit 0. Session_id is non-empty in turn 1's session.started event. Turn 2 references content from turn 1 by name (no re-explanation requests).
- Desired user-visible outcome: Verdict naming the captured session id (truncated for readability) and the prior content the second turn referenced.
- Pass/fail: PASS if both exit 0 AND session_id captured AND turn 2 references prior content. FAIL if session_id capture fails or turn 2 cannot resume.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch turn 1 and capture session_id with jq.
3. Dispatch turn 2 with `-s <captured-id>`.
4. Validate the second turn references content from turn 1.
5. Return a verdict naming the session id and the referenced content.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-019 | Resume specific session by id (-s) | Confirm `-s <id>` resumes the named session and the resumed turn references prior content | `As an external-AI conductor managing a captured session id, dispatch a first opencode run with --format json and use jq to extract session_id from the session.started event. Then dispatch a second opencode run with -s <captured-id> and a follow-up question that requires access to the first turn's content. Verify the second response references content from the captured session, not a fresh session. Return a concise pass/fail verdict naming the captured session id and the prior content the second turn referenced.` | 1. `bash: opencode run --model anthropic/claude-opus-4-7 --agent general --variant high --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "Define a fictional concept named the (echo-cascade verifier): it is a CRDT replication primitive that uses cascaded echoes to detect lost updates. State that the cascade depth is fixed at 7." > /tmp/co-019-turn1.jsonl 2>&1 && echo "TURN1: $?"` -> 2. `bash: SID=$(jq -r 'select(.type == "session.started") \| .session_id' /tmp/co-019-turn1.jsonl \| head -1) && echo "Captured session_id: $SID"` -> 3. `bash: opencode run --model anthropic/claude-opus-4-7 --agent general --variant high --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public -s "$SID" "What is the cascade depth we discussed? Answer in one short sentence." > /tmp/co-019-turn2.jsonl 2>&1 && echo "TURN2: $?"` -> 4. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-019-turn2.jsonl \| grep -ciE '(echo-cascade\|cascade depth\|7\|seven)'` -> 5. `bash: jq -r 'select(.type == "session.started") \| .session_id' /tmp/co-019-turn2.jsonl \| head -1` | Step 1: TURN1 exit 0 with session.started event present; Step 2: SID captured non-empty; Step 3: TURN2 exit 0; Step 4: count of cascade/depth/7/seven references >= 1; Step 5: TURN2 session_id matches the captured SID (resume worked, not a new session) | `/tmp/co-019-turn1.jsonl`, `/tmp/co-019-turn2.jsonl`, captured SID in terminal | PASS if both exit 0 AND SID captured AND second turn references prior content AND second turn session id matches captured SID; FAIL if SID capture fails, second turn cannot resume, or second turn opens a fresh session | 1. If `jq` returns empty for session_id, the JSON event stream may use a different field name — try `.payload.session_id` or inspect the raw line; 2. If `-s <id>` is rejected with "session not found", the session may have expired or the id may be malformed — re-capture from a fresh dispatch; 3. If second turn opens a new session id, the resume failed silently — verify the captured id is valid via `~/.opencode/state/<id>/metadata.json`; 4. If the prior content is not referenced, the resume may have loaded the wrong session — try `--continue` instead and capture which session it resumed |

### Optional Supplemental Checks

For multi-session management, capture two distinct session ids from two parallel turn-1 dispatches, then resume each in alternating order. Confirm each resumed turn references the correct prior session's content. This stresses session-id-based routing under contention.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 `-s`/`--session` flag row) | Session id flag documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 core flag table (`-s`/`--session`) |
| `../../references/cli_reference.md` | §4 sessions/share URLs/ports paragraph, §8 state directory layout |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CO-019
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--session-continuity/002-resume-by-session-id.md`
