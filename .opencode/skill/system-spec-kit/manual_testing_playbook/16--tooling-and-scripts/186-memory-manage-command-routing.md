---
title: "186 -- /memory:manage command routing"
description: "This scenario validates /memory:manage command routing for `186`. It focuses on verifying the command's default stats mode and supported subcommand routing: scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, and ingest."
---

# 186 -- /memory:manage command routing

## 1. OVERVIEW

This scenario validates /memory:manage command routing for `186`. It focuses on Verify the command's default stats mode and key subcommand routing: scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, and ingest.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `186` and confirm the expected signals without contradicting evidence.

- Objective: Verify `/memory:manage` default stats dashboard and subcommand routing for the currently supported management modes
- Prompt: `Validate /memory:manage command routing across the currently supported management modes. Capture the evidence needed to prove No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns error. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: No-args shows stats dashboard via `memory_stats()` + `memory_list()`; scan routes to `memory_index_scan()`; health routes to `memory_health()`; checkpoint subcommands route to checkpoint tools; ingest subcommands route to ingest tools; unrecognized mode returns STATUS=FAIL
- Pass/fail: PASS: Default shows stats dashboard, each subcommand invokes its dedicated tool, unrecognized mode errors cleanly; FAIL: Default mode skips stats, subcommand routes to wrong tool, or unrecognized mode does not error

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 186 | /memory:manage command routing | Verify `/memory:manage` default stats dashboard and subcommand routing | `Validate /memory:manage command routing across the currently supported management modes. Capture the evidence needed to prove No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns error. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/memory:manage` with no arguments and verify the stats dashboard appears showing total, size, indexed date, tier distribution, and top folders via `memory_stats()` + `memory_list({ limit: 10, sortBy: "updated_at" })` 2) Invoke `/memory:manage scan` and verify `memory_index_scan()` is called 3) Invoke `/memory:manage scan --force` and verify force re-index is triggered 4) Invoke `/memory:manage health` and verify `memory_health()` is called 5) Invoke `/memory:manage checkpoint list` and verify `checkpoint_list()` is called 6) Invoke `/memory:manage checkpoint create test-snap` and verify `checkpoint_create()` is called 7) Invoke `/memory:manage ingest status abc-123` and verify `memory_ingest_status()` is called 8) Invoke `/memory:manage delete 42` and verify confirmation prompt appears before `memory_delete()` 9) Invoke `/memory:manage bulk-delete temporary --older-than 30` and verify confirmation prompt appears before `memory_bulk_delete()` 10) Invoke `/memory:manage invalid-mode` and verify `STATUS=FAIL ERROR="Unknown mode"` is returned | No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns STATUS=FAIL error | Tool invocation logs for each subcommand; stats dashboard output for default mode; error output for unrecognized mode | PASS: Default shows stats dashboard, each subcommand invokes its dedicated tool, unrecognized mode errors cleanly; FAIL: Default mode skips stats, subcommand routes to wrong tool, or unrecognized mode does not error | Verify argument routing logic in Section 4 of manage.md → Check mode parsing in mandatory first action → Confirm tool-to-mode mapping → Inspect confirmation gates on destructive operations (delete, bulk-delete, checkpoint restore) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/13-constitutional-memory-manager-command.md](../../feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md)
- Command file: [.opencode/command/memory/manage.md](../../../../command/memory/manage.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 186
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/186-memory-manage-command-routing.md`
