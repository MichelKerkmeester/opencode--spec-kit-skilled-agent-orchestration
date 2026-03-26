---
title: "099 -- Real-time filesystem watching (P1-7)"
description: "This scenario validates Real-time filesystem watching (P1-7) for `099`. It focuses on Confirm file watcher debounce, hash seeding, and ENOENT grace."
---

# 099 -- Real-time filesystem watching (P1-7)

## 1. OVERVIEW

This scenario validates Real-time filesystem watching (P1-7) for `099`. It focuses on Confirm file watcher debounce, hash seeding, and ENOENT grace.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `099` and confirm the expected signals without contradicting evidence.

- Objective: Confirm file watcher debounce, hash seeding, and ENOENT grace
- Prompt: `Validate SPECKIT_FILE_WATCHER behavior. Capture the evidence needed to prove File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash
- Pass/fail: PASS if debounce works, hash dedup prevents redundant reindex, and ENOENT is handled silently

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 099 | Real-time filesystem watching (P1-7) | Confirm file watcher debounce, hash seeding, and ENOENT grace | `Validate SPECKIT_FILE_WATCHER behavior. Capture the evidence needed to prove File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash. Return a concise user-facing pass/fail verdict with the main reason.` | 1) set `SPECKIT_FILE_WATCHER=true` and start server 2) create a new `.md` file in a watched spec directory → verify `add` event seeds the hash cache 3) modify the file → verify reindex triggers after 2s debounce 4) modify with identical content → verify NO redundant reindex (hash dedup) 5) rapidly create then delete a file → verify no ENOENT crash (graceful handling) | File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash | Server logs for `[file-watcher]` messages | PASS if debounce works, hash dedup prevents redundant reindex, and ENOENT is handled silently | Inspect `lib/ops/file-watcher.ts` for `seedHash`, `scheduleReindex`, and ENOENT catch |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md](../../feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 099
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/099-real-time-filesystem-watching-p1-7.md`
