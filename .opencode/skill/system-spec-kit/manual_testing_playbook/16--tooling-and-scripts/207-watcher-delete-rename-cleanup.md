---
title: "207 -- Watcher delete/rename cleanup"
description: "This scenario validates watcher delete/rename cleanup for `207`. It focuses on confirming stale index entries are purged on delete and rename."
---

# 207 -- Watcher delete/rename cleanup

## 1. OVERVIEW

This scenario validates watcher delete/rename cleanup for `207`. It focuses on confirming stale index entries are purged on delete and rename.

---

## 2. CURRENT REALITY

Operators run the watcher runtime coverage and confirm deleted files are purged from the index, renames clean up old paths and create fresh entries, and debounce handling prevents stale rename bursts from leaving orphaned results.

- Objective: Confirm delete and rename cleanup remove stale index state
- Prompt: `Validate watcher delete/rename cleanup. Capture the evidence needed to prove unlink events call removeFn for deleted markdown files; rename is handled as old-path cleanup plus new-path indexing; the default 2-second debounce window collapses rapid rename/change bursts into a single stable reindex; and burst or concurrent renames leave only the final live paths indexed. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: unlink events call removeFn for deleted markdown files; rename removes the old path and indexes the new path; the default 2-second debounce window collapses rapid rename/change bursts to one stable reindex; burst renames keep only the final path indexed; concurrent renames remove all stale paths and keep all renamed paths indexed
- Pass/fail: PASS if stale paths are removed, renamed paths are reindexed, and no orphaned entries remain after delete, rename, burst-rename, or concurrent-rename flows

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 207 | Watcher delete/rename cleanup | Confirm delete and rename cleanup remove stale index state | `Validate watcher delete/rename cleanup. Capture the evidence needed to prove unlink events call removeFn for deleted markdown files; rename is handled as old-path cleanup plus new-path indexing; the default 2-second debounce window collapses rapid rename/change bursts into a single stable reindex; and burst or concurrent renames leave only the final live paths indexed. Return a concise user-facing pass/fail verdict with the main reason.` | 1) run the file-watcher Vitest suite and capture the delete/unlink scenario where removeFn is called for a deleted markdown file 2) capture the rename lifecycle scenario showing unlink on the old path and add on the new path 3) capture the default-window debounce scenario proving rapid changes within the 2-second window coalesce to one reindex 4) capture the burst-rename scenario showing only the final path remains indexed 5) capture the concurrent-rename scenario showing every stale path is removed and every renamed path is indexed | unlink events call removeFn for deleted markdown files; rename removes the old path and indexes the new path; the default 2-second debounce window collapses rapid rename/change bursts to one stable reindex; burst renames keep only the final path indexed; concurrent renames remove all stale paths and keep all renamed paths indexed | Vitest output for delete/unlink, rename lifecycle, default debounce, burst rename, and concurrent rename cases + any logged indexed-path snapshots used to prove stale entries were removed | PASS if stale paths are removed, renamed paths are reindexed, and no orphaned entries remain after delete, rename, burst-rename, or concurrent-rename flows | Inspect `mcp_server/lib/ops/file-watcher.ts` debounce scheduling, unlink handling, and `removeFn` wiring if stale entries persist or rename paths duplicate |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md](../../feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 207
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/207-watcher-delete-rename-cleanup.md`
