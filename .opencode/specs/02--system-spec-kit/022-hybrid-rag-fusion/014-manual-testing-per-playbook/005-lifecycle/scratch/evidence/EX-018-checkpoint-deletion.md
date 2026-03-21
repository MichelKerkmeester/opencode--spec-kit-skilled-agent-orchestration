# EX-018 — Checkpoint Deletion Evidence

## Preconditions
- MCP server healthy (v1.7.2)
- Pre-test checkpoint `pre-EX-018-delete` created (id: 7, sandbox-scoped)
- Sandbox spec folder `test-sandbox-lifecycle` with 5 checkpoints
- Target for deletion: `pre-EX-016-ordering-test` (stale sandbox checkpoint)

## Execution Transcript

### Step 1: Before-list
```
checkpoint_list({ specFolder: "test-sandbox-lifecycle" })
```
**Response:** Found 5 checkpoint(s)
- id:8 `pre-124-archival` (19:03:48)
- id:7 `pre-EX-018-delete` (19:03:47)
- id:6 `pre-EX-017-restore` (19:03:47)
- id:4 `pre-EX-016-ordering-test` (19:00:36) **<-- target**
- id:3 `pre-bulk-delete` (19:00:26)

### Step 2: checkpoint_delete (with safety confirmation)
```
checkpoint_delete({ name: "pre-EX-016-ordering-test", confirmName: "pre-EX-016-ordering-test" })
```
**Response:**
```json
{
  "summary": "Checkpoint \"pre-EX-016-ordering-test\" deleted successfully",
  "data": {
    "success": true,
    "safetyConfirmationUsed": true,
    "checkpointName": "pre-EX-016-ordering-test",
    "deletedAt": "2026-03-19T19:04:08.575Z"
  }
}
```

### Step 3: After-list
```
checkpoint_list({ specFolder: "test-sandbox-lifecycle" })
```
**Response:** Found 4 checkpoint(s)
- id:8 `pre-124-archival` (19:03:48)
- id:7 `pre-EX-018-delete` (19:03:47)
- id:6 `pre-EX-017-restore` (19:03:47)
- id:3 `pre-bulk-delete` (19:00:26)

### Step 4: Rollback
```
checkpoint_restore({ name: "pre-EX-018-delete", clearExisting: false })
```
**Response:** Restored successfully.

## Expected Signals Checklist
- [x] Removed checkpoint absent from after-list
- [x] Before-list shows 5 checkpoints, after-list shows 4
- [x] Safety confirmation (`confirmName`) was required and used
- [x] Deletion was sandbox-only (all checkpoints scoped to `test-sandbox-lifecycle`)
- [x] Rollback completed successfully

## Observations
- `confirmName` parameter provides double-confirmation safety for destructive delete
- Deletion is immediate and permanent (checkpoint removed from DB)
- Rollback via restore of pre-test checkpoint worked correctly
- Count decreased from 5 to 4, target checkpoint `pre-EX-016-ordering-test` no longer in list

## Verdict: **PASS**
All acceptance checks satisfied. Checkpoint deleted from sandbox list with safety confirmation, before/after evidence confirms removal.
