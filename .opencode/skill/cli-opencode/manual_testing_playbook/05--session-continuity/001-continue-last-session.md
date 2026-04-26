---
title: "CO-018 -- Continue last session via -c / --continue"
description: "This scenario validates the `-c` / `--continue` flag for `CO-018`. It focuses on confirming the next dispatch resumes the most recent session in the project and the follow-up prompt has access to the prior turn's context."
---

# CO-018 -- Continue last session via -c / --continue

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-018`.

---

## 1. OVERVIEW

This scenario validates Continue last session via `-c` for `CO-018`. It focuses on confirming `-c` (alias `--continue`) resumes the most recent session in the project (per `references/cli_reference.md` §4 flag table) and the follow-up dispatch has direct access to the prior turn's context without re-explanation.

### Why This Matters

Session continuity is the foundation of multi-step workflows that span more than one `opencode run` invocation. Without `-c`, every dispatch is fully stateless and the calling AI must re-paste context with each call (expensive in tokens, fragile in fidelity). If `-c` silently starts a fresh session instead of resuming, multi-turn cli-opencode workflows regress to single-turn. This test proves the resume contract is intact.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-018` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `-c` resumes the most recent project session and the follow-up dispatch has access to the prior turn's content without re-explanation.
- Real user request: `Run a 2-step opencode workflow: first turn establishes context (define a unique technical concept), second turn with -c references the concept by name. Confirm the second turn answers correctly without me re-explaining the concept.`
- Prompt: `As an external-AI conductor running a 2-step opencode workflow, dispatch the first opencode run to define a unique technical concept (the "snowflake reducer") in one paragraph. Then dispatch the second opencode run with -c and a follow-up question about the concept (e.g. "what was the key invariant?"). Verify the second response references the snowflake reducer concept without asking for re-explanation. Return a concise pass/fail verdict naming the invariant from the second turn.`
- Expected execution process: External-AI orchestrator dispatches the first turn establishing the concept, then dispatches the second turn with `-c` and a follow-up question. Validates the second turn's response references the concept by name from turn 1.
- Expected signals: Both dispatches exit 0. Second dispatch references "snowflake reducer" or its invariant from the first turn. Second response does NOT ask for re-explanation or context (no "what is X?", "could you describe X?" phrasing).
- Desired user-visible outcome: Verdict naming the invariant the second turn referenced and confirming continuity worked.
- Pass/fail: PASS if both exit 0 AND second turn references the snowflake reducer concept. FAIL if second turn asks for re-explanation or response is generic.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch first turn establishing the snowflake reducer concept.
3. Dispatch second turn with `-c` and the follow-up question.
4. Validate the second response references the concept and its invariant.
5. Return a verdict naming the invariant.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-018 | Continue last session via -c | Confirm `-c` resumes the most recent project session and the follow-up has access to prior context | `As an external-AI conductor running a 2-step opencode workflow, dispatch the first opencode run to define a unique technical concept (the "snowflake reducer") in one paragraph. Then dispatch the second opencode run with -c and a follow-up question about the concept (e.g. "what was the key invariant?"). Verify the second response references the snowflake reducer concept without asking for re-explanation. Return a concise pass/fail verdict naming the invariant from the second turn.` | 1. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" "Define the (fictional) snowflake reducer pattern in one short paragraph: it is a parallel-fold reducer over a binary tree that requires the snowflake commutativity invariant to produce deterministic output. The key invariant is snowflake commutativity (operands must commute pairwise across all six branches)." > /tmp/co-018-turn1.jsonl 2>&1 && echo "TURN1: $?"` -> 2. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" -c "Recall the pattern we just discussed. What is its key invariant? Answer in one short sentence." > /tmp/co-018-turn2.jsonl 2>&1 && echo "TURN2: $?"` -> 3. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-018-turn2.jsonl \| grep -ciE '(snowflake\|commutativity\|invariant)'` -> 4. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-018-turn2.jsonl \| grep -ciE '(could you describe\|what is\|please define\|context.*missing)'` | Step 1: TURN1 exit 0; Step 2: TURN2 exit 0; Step 3: count of snowflake/commutativity/invariant references >= 1 (the second turn referenced the prior concept); Step 4: count of re-explanation phrases = 0 (no "what is X?" or context-missing language) | `/tmp/co-018-turn1.jsonl`, `/tmp/co-018-turn2.jsonl`, terminal grep counts | PASS if both exit 0 AND second turn references snowflake concept AND no re-explanation requests; FAIL if second turn asks for re-explanation or is generic | 1. If second turn asks for re-explanation, `-c` may not have resumed — verify the most recent session is correct via `~/.opencode/state/<id>/metadata.json`; 2. If second turn is generic, the resume may have loaded the wrong session — try `--session <id>` with the explicit id from turn 1's `session.started` event; 3. If `-c` is rejected with `unknown option`, version drift — fall back to `--continue` long form; 4. If both turns share the same session id in JSON, that is correct and indicates resume worked |

### Optional Supplemental Checks

For multi-turn depth, add a third turn with another `-c` and a question that depends on BOTH prior turns. Confirm the third turn references content from both turn 1 and turn 2. This catches regressions where `-c` only resumes the immediately prior turn but loses earlier context.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 `-c`/`--continue` flag row + §4 sessions/share/ports paragraph) | Continue flag documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 core flag table (`-c`/`--continue`) |
| `../../references/cli_reference.md` | §4 sessions/share URLs/ports paragraph |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CO-018
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--session-continuity/001-continue-last-session.md`
