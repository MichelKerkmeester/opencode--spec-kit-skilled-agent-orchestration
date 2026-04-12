---
title: "117 -- SQLite datetime session cleanup (P0-7)"
description: "This scenario validates SQLite datetime session cleanup (P0-7) for `117`. It focuses on Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format."
audited_post_018: true
---

# 117 -- SQLite datetime session cleanup (P0-7)

## 1. OVERVIEW

This scenario validates SQLite datetime session cleanup (P0-7) for `117`. It focuses on Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `117` and confirm the expected signals without contradicting evidence.

- Objective: Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format
- Prompt: `As a data-integrity validation operator, validate SQLite datetime session cleanup (P0-7) against last_focused. Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats
- Pass/fail: PASS if only expired sessions are deleted regardless of timestamp format and active sessions are preserved

---

## 3. TEST EXECUTION

### Prompt

```
As a data-integrity validation operator, verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format against last_focused. Verify expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. **Precondition:** Working memory database accessible.
2. Insert a session with `last_focused` = 45 minutes ago (expired)
3. Insert a session with `last_focused` = 5 minutes ago (active)
4. Run `cleanupOldSessions()` with 30-minute threshold
5. Verify expired session deleted, active session preserved
6. Verify comparison works with both `YYYY-MM-DD HH:MM:SS` and ISO format timestamps

### Expected

Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats

### Evidence

Session table before/after cleanup + timestamp format verification

### Pass / Fail

- **Pass**: only expired sessions are deleted regardless of timestamp format and active sessions are preserved
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect cleanupOldSessions datetime comparison SQL; verify SQLite datetime function compatibility; test with edge-case timestamps (midnight, timezone boundaries)

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md](../../feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 117
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/117-sqlite-datetime-session-cleanup-p0-7.md`
