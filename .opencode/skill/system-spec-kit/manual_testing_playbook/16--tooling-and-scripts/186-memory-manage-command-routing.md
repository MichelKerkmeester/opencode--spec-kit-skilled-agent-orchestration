---
title: "186 -- /memory:manage command routing"
description: "This scenario validates /memory:manage command routing for `186`. It focuses on verifying the command's default stats mode and supported subcommand routing: scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, and ingest."
---

# 186 -- /memory:manage command routing

## 1. OVERVIEW

This scenario validates /memory:manage command routing for `186`. It focuses on Verify the command's default stats mode and key subcommand routing: scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, and ingest.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `/memory:manage` default stats dashboard and subcommand routing for the currently supported management modes.
- Real user request: `` Please validate /memory:manage command routing against /memory:manage and tell me whether the expected signals are present: No-args shows stats dashboard via `memory_stats()` + `memory_list()`; scan routes to `memory_index_scan()`; health routes to `memory_health()`; checkpoint subcommands route to checkpoint tools; ingest subcommands route to ingest tools; unrecognized mode returns STATUS=FAIL. ``
- RCAF Prompt: `As a tooling validation operator, validate /memory:manage command routing against /memory:manage. Verify /memory:manage default stats dashboard and subcommand routing for the currently supported management modes. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: No-args shows stats dashboard via `memory_stats()` + `memory_list()`; scan routes to `memory_index_scan()`; health routes to `memory_health()`; checkpoint subcommands route to checkpoint tools; ingest subcommands route to ingest tools; unrecognized mode returns STATUS=FAIL
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Default shows stats dashboard, each subcommand invokes its dedicated tool, unrecognized mode errors cleanly; FAIL: Default mode skips stats, subcommand routes to wrong tool, or unrecognized mode does not error

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, verify /memory:manage default stats dashboard and subcommand routing against /memory:manage. Verify no-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns STATUS=FAIL error. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Invoke `/memory:manage` with no arguments and verify the stats dashboard appears showing total, size, indexed date, tier distribution, and top folders via `memory_stats()` + `memory_list({ limit: 10, sortBy: "updated_at" })`
2. Invoke `/memory:manage scan` and verify `memory_index_scan()` is called
3. Invoke `/memory:manage scan --force` and verify force re-index is triggered
4. Invoke `/memory:manage health` and verify `memory_health()` is called
5. Invoke `/memory:manage checkpoint list` and verify `checkpoint_list()` is called
6. Invoke `/memory:manage checkpoint create test-snap` and verify `checkpoint_create()` is called
7. Invoke `/memory:manage ingest status abc-123` and verify `memory_ingest_status()` is called
8. Invoke `/memory:manage delete 42` and verify confirmation prompt appears before `memory_delete()`
9. Invoke `/memory:manage bulk-delete temporary --older-than 30` and verify confirmation prompt appears before `memory_bulk_delete()`
10. Invoke `/memory:manage invalid-mode` and verify `STATUS=FAIL ERROR="Unknown mode"` is returned

### Expected

No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns STATUS=FAIL error

### Evidence

Tool invocation logs for each subcommand; stats dashboard output for default mode; error output for unrecognized mode

### Pass / Fail

- **Pass**: Default shows stats dashboard, each subcommand invokes its dedicated tool, unrecognized mode errors cleanly
- **Fail**: Default mode skips stats, subcommand routes to wrong tool, or unrecognized mode does not error

### Failure Triage

Verify argument routing logic in Section 4 of manage.md → Check mode parsing in mandatory first action → Confirm tool-to-mode mapping → Inspect confirmation gates on destructive operations (delete, bulk-delete, checkpoint restore)

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/13-constitutional-memory-manager-command.md](../../feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md)
- Command file: [.opencode/command/memory/manage.md](../../../../command/memory/manage.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 186
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/186-memory-manage-command-routing.md`
