---
title: "CC-016 -- Resume specific session by ID"
description: "This scenario validates Resume specific session by ID for `CC-016`. It focuses on confirming `--resume SESSION_ID` resumes a specific session captured from prior JSON output."
---

# CC-016 -- Resume specific session by ID

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-016`.

---

## 1. OVERVIEW

This scenario validates Resume specific session by ID for `CC-016`. It focuses on confirming `--resume SESSION_ID` resumes a specific session captured from prior JSON output.

### Why This Matters

While `--continue` always picks the most recent session, `--resume SESSION_ID` is the precise mechanism for managing multiple parallel investigations. Cross-AI orchestrators running concurrent dispatches MUST be able to resume specific sessions to maintain isolation. If session ID resumption silently falls back to the most recent session, parallel investigations cross-contaminate.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--resume SESSION_ID` resumes a specific session by ID and the resumed turn has access to the original session's context.
- Real user request: `Capture a Claude Code session ID from JSON output, then later resume that exact session by ID and verify the new turn has the original context.`
- Prompt: `As an external-AI conductor managing multiple parallel Claude Code investigations, dispatch an initial claude -p ... --output-format json call, capture its session_id via jq, then dispatch a later claude -p "..." --resume "$SESSION_ID" call that explicitly references content from the first turn. Verify the resumed turn correctly references the prior context. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator dispatches turn 1 in JSON mode against a deliberately distinctive query (so the response contents are easy to reference later), captures the `session_id`, optionally dispatches an unrelated turn in between to prove `--resume` is not just `--continue`, then dispatches the resumed turn and verifies context.
- Expected signals: First call's JSON output includes a non-empty `session_id`. Resume call exits 0. Resumed response references specific content from the original turn rather than asking for re-paste.
- Desired user-visible outcome: Verdict naming the captured session_id and the cross-reference observed in the resumed turn.
- Pass/fail: PASS if `session_id` is captured AND resumed turn references original context AND zero re-paste language. FAIL if `session_id` missing or resume falls back to most-recent session.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch turn 1 in JSON mode with a deliberately distinctive query.
3. Capture `session_id` from JSON.
4. Optionally dispatch an unrelated intervening turn to prove `--resume` is not just most-recent.
5. Dispatch the resumed turn with `--resume "$SESSION_ID"`.
6. Compare resumed-turn content against original-turn content.
7. Return a verdict naming the session_id and cross-reference.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-016 | Resume specific session by ID | Confirm `--resume SESSION_ID` resumes the named session with prior context | `As an external-AI conductor managing multiple parallel Claude Code investigations, dispatch an initial claude -p ... --output-format json call, capture its session_id via jq, then dispatch a later claude -p "..." --resume "$SESSION_ID" call that explicitly references content from the first turn. Verify the resumed turn correctly references the prior context. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: claude -p "Pick a fictional but specific code-naming convention I should use in my project (one short rule, like 'all React components must end in Component') and remember it for follow-up questions." --permission-mode plan --output-format json 2>&1 > /tmp/cc-016-turn1.json` -> 2. `bash: SESSION_ID=$(jq -r '.session_id // .session.id // .id' /tmp/cc-016-turn1.json) && echo "$SESSION_ID" > /tmp/cc-016-session-id.txt && echo "Session: $SESSION_ID"` -> 3. `bash: claude -p "Quick unrelated question: what is the capital of France?" --permission-mode plan --output-format text 2>&1 > /tmp/cc-016-intervening.txt` -> 4. `bash: claude -p "What was the specific code-naming convention you suggested earlier? Quote it back to me verbatim." --resume "$(cat /tmp/cc-016-session-id.txt)" --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-016-resumed.txt` -> 5. `bash: jq -r '.result' /tmp/cc-016-turn1.json > /tmp/cc-016-turn1-text.txt` -> 6. `bash: grep -ciE "(don't have\|please re\|share again\|re-paste\|cannot recall)" /tmp/cc-016-resumed.txt` | Step 1: turn 1 JSON written; Step 2: session_id captured (non-empty); Step 3: intervening dispatch completes (its content is irrelevant); Step 4: resumed turn quotes back the convention from turn 1; Step 5: turn 1 text extracted; Step 6: count of "no context" language is 0 | `/tmp/cc-016-turn1.json`, `/tmp/cc-016-session-id.txt`, `/tmp/cc-016-intervening.txt`, `/tmp/cc-016-resumed.txt`, `/tmp/cc-016-turn1-text.txt` | PASS if session_id captured AND resumed turn quotes/paraphrases the convention from turn 1 AND zero "no context" language; FAIL if session_id missing, resume falls back to intervening turn, or resumed turn cannot recall the convention | 1. If `session_id` is empty, inspect raw JSON envelope with `jq '.' /tmp/cc-016-turn1.json` to find the actual key path; 2. If resumed turn references the intervening dispatch instead of turn 1, `--resume` may be aliasing to `--continue` - file a critical bug; 3. If resumed turn cannot recall the convention but does not say "no context", the session may have expired - reduce time between turns and re-run |

### Optional Supplemental Checks

If the JSON envelope shape changes between Claude Code versions, the `session_id` extraction path in step 2 may need adjustment. Document the discovered key path in evidence so future runs can update the playbook.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Session management flags (section 5) and section 10 (session management) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | Session Continuity pattern (section 10) including session ID extraction example |
| `../../references/cli_reference.md` | `--resume` and `--fork-session` flag documentation |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CC-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--session-continuity/002-resume-specific-session-by-id.md`
