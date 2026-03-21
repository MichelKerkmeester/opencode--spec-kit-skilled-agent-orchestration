# Pre-Execution Analysis: 005 Lifecycle Phase

## Open Questions Resolved

### Q1: Sandbox spec folder path
**Answer:** `test-sandbox-lifecycle`
- Created at `.opencode/specs/test-sandbox-lifecycle/memory/` with 20 seed markdown files
- Checkpoint naming: `pre-[test-id]-[action]` (e.g., `pre-bulk-delete`, `pre-EX-017-restore`)

### Q2: Restart procedure for 097 requeue verification
**Answer:** Server restart is required to trigger `resetIncompleteJobsToQueued()` (context-server.ts line 1070 → startupScan → job-queue.ts line 219). This cannot be tested via MCP without interrupting the running session. Evidence relies on code analysis + unit tests (job-queue-state-edge.vitest.ts T005b-Q8).

### Q3: Evidence format for 124 DB parity checks
**Answer:** MCP tool outputs serve as primary evidence where available. For internal operations (archival, recovery), code analysis with exact file:line references and unit test citations provides equivalent evidence. Direct SQL is not exposed through MCP tools.

## Execution Sequence

| Order | Test ID | Type | MCP Tools | Dependencies |
|-------|---------|------|-----------|-------------|
| 1 | EX-015 | Non-destructive | checkpoint_create → checkpoint_list | None |
| 2 | EX-016 | Non-destructive | checkpoint_create → checkpoint_list | EX-015 (checkpoint exists) |
| 3 | 097 | Non-destructive | ingest_start → ingest_status → ingest_cancel | Seed files |
| 4 | 114 | Non-destructive | ingest_start (invalid + valid paths) | Seed files |
| 5 | 134 | Non-destructive | Code analysis only | None |
| 6 | 144 | Non-destructive | ingest_start → ingest_status | Seed files |
| 7 | EX-017 | Destructive | checkpoint_restore → memory_health | Pre-test checkpoint |
| 8 | EX-018 | Destructive | checkpoint_list → checkpoint_delete → checkpoint_list | Pre-test checkpoint |
| 9 | 124 | Destructive | Code analysis only | Pre-test checkpoint |

## Parameter Resolution

- `<sandbox-spec>` → `test-sandbox-lifecycle`
- `<target-spec>` → `test-sandbox-lifecycle`
- `<checkpoint-name>` → per-test naming: `pre-bulk-delete`, `pre-EX-016-ordering-test`, etc.
- Traversal path → `../../etc/passwd`
- Out-of-base path → `/tmp/outside-base/file.md`
- Valid ingest paths → absolute paths under `.opencode/specs/test-sandbox-lifecycle/memory/`
