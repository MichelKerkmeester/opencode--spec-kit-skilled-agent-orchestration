---
title: "112 -- Cross-process DB hot rebinding"
description: "This scenario validates Cross-process DB hot rebinding for `112`. It focuses on Confirm marker-file triggers DB reinitialization."
---

# 112 -- Cross-process DB hot rebinding

## 1. OVERVIEW

This scenario validates Cross-process DB hot rebinding for `112`. It focuses on Confirm marker-file triggers DB reinitialization.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `112` and confirm the expected signals without contradicting evidence.

- Objective: Confirm marker-file triggers DB reinitialization
- Prompt: `Validate cross-process DB hot rebinding via marker file. Capture the evidence needed to prove Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind
- Pass/fail: PASS if server detects marker file, reinitializes DB, returns current (non-stale) data, and health is healthy

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 112 | Cross-process DB hot rebinding | Confirm marker-file triggers DB reinitialization | `Validate cross-process DB hot rebinding via marker file. Capture the evidence needed to prove Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind. Return a concise user-facing pass/fail verdict with the main reason.` | 1) start MCP server 2) create a test memory via MCP: `memory_save(filePath)` and note its title 3) from a separate terminal, run `node cli.js bulk-delete --tier scratch --folder specs/test-sandbox` (non-dry-run — this mutates the DB and writes the `DB_UPDATED_FILE` marker) 4) immediately call `memory_stats()` via MCP → verify server detects marker and reinitializes DB 5) verify no stale data from pre-rebind state 6) run `memory_health()` → verify healthy status post-rebind | Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind | memory_stats output post-rebind + memory_health output + marker file detection evidence | PASS if server detects marker file, reinitializes DB, returns current (non-stale) data, and health is healthy | Inspect DB_UPDATED_FILE marker path and detection logic; verify DB reinitialization clears caches; check for stale connection handles |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/17-cross-process-db-hot-rebinding.md](../../feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 112
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/112-cross-process-db-hot-rebinding.md`
