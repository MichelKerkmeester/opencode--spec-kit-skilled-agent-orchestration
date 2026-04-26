---
title: "099 -- Real-time filesystem watching (P1-7)"
description: "This scenario validates Real-time filesystem watching (P1-7) for `099`. It focuses on Confirm file watcher debounce, hash seeding, and ENOENT grace."
---

# 099 -- Real-time filesystem watching (P1-7)

## 1. OVERVIEW

This scenario validates Real-time filesystem watching (P1-7) for `099`. It focuses on Confirm file watcher debounce, hash seeding, and ENOENT grace.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `099` and confirm the expected signals without contradicting evidence.

- Objective: Confirm file watcher debounce, hash seeding, and ENOENT grace
- Prompt: `As a tooling validation operator, validate Real-time filesystem watching (P1-7) against SPECKIT_FILE_WATCHER=true. Verify file watcher debounce, hash seeding, and ENOENT grace. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash
- Pass/fail: PASS if debounce works, hash dedup prevents redundant reindex, and ENOENT is handled silently

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm file watcher debounce, hash seeding, and ENOENT grace against SPECKIT_FILE_WATCHER=true. Verify file add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. set `SPECKIT_FILE_WATCHER=true` and start server
2. create a new `.md` file in a watched spec directory → verify `add` event seeds the hash cache
3. modify the file → verify reindex triggers after 2s debounce
4. modify with identical content → verify NO redundant reindex (hash dedup)
5. rapidly create then delete a file → verify no ENOENT crash (graceful handling)

### Expected

File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash

### Evidence

Server logs for `[file-watcher]` messages

### Pass / Fail

- **Pass**: debounce works, hash dedup prevents redundant reindex, and ENOENT is handled silently
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `lib/ops/file-watcher.ts` for `seedHash`, `scheduleReindex`, and ENOENT catch

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md](../../feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 099
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/099-real-time-filesystem-watching-p1-7.md`
