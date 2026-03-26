---
title: "117 -- SQLite datetime session cleanup (P0-7)"
description: "This scenario validates SQLite datetime session cleanup (P0-7) for `117`. It focuses on Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format."
---

# 117 -- SQLite datetime session cleanup (P0-7)

## 1. OVERVIEW

This scenario validates SQLite datetime session cleanup (P0-7) for `117`. It focuses on Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `117` and confirm the expected signals without contradicting evidence.

- Objective: Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format
- Prompt: `"Create sessions with known timestamps and verify cleanup deletes only expired ones". Capture the evidence needed to prove Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats
- Pass/fail: PASS if only expired sessions are deleted regardless of timestamp format and active sessions are preserved

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 117 | SQLite datetime session cleanup (P0-7) | Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format | `"Create sessions with known timestamps and verify cleanup deletes only expired ones". Capture the evidence needed to prove Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** Working memory database accessible. 1) Insert a session with `last_focused` = 45 minutes ago (expired) 2) Insert a session with `last_focused` = 5 minutes ago (active) 3) Run `cleanupOldSessions()` with 30-minute threshold 4) Verify expired session deleted, active session preserved 5) Verify comparison works with both `YYYY-MM-DD HH:MM:SS` and ISO format timestamps | Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats | Session table before/after cleanup + timestamp format verification | PASS if only expired sessions are deleted regardless of timestamp format and active sessions are preserved | Inspect cleanupOldSessions datetime comparison SQL; verify SQLite datetime function compatibility; test with edge-case timestamps (midnight, timezone boundaries) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md](../../feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 117
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/117-sqlite-datetime-session-cleanup-p0-7.md`
