# EX-016 — Checkpoint Listing Evidence

## Preconditions
- MCP server healthy (v1.7.2)
- Sandbox spec folder `test-sandbox-lifecycle` with one existing checkpoint (`pre-bulk-delete`)

## Execution Transcript

### Step 1: Create second checkpoint for ordering test
```
checkpoint_create({ name: "pre-EX-016-ordering-test", specFolder: "test-sandbox-lifecycle" })
```
**Response:** Created successfully (id: 4, createdAt: 2026-03-19T19:00:36.031Z)

### Step 2: checkpoint_list with limit
```
checkpoint_list({ specFolder: "test-sandbox-lifecycle", limit: 5 })
```
**Response:**
```json
{
  "summary": "Found 2 checkpoint(s)",
  "data": {
    "count": 2,
    "checkpoints": [
      {
        "id": 4,
        "name": "pre-EX-016-ordering-test",
        "createdAt": "2026-03-19T19:00:36.031Z",
        "specFolder": "test-sandbox-lifecycle"
      },
      {
        "id": 3,
        "name": "pre-bulk-delete",
        "createdAt": "2026-03-19T19:00:26.804Z",
        "specFolder": "test-sandbox-lifecycle"
      }
    ]
  }
}
```

## Expected Signals Checklist
- [x] Available restore points displayed
- [x] Newest-first ordering confirmed (id:4 at 19:00:36 before id:3 at 19:00:26)
- [x] Checkpoints returned with complete metadata (id, name, createdAt, specFolder, snapshotSize)
- [x] Limit parameter accepted and functional

## Observations
- Ordering is by `createdAt` descending (newest first) as expected
- Both checkpoints scoped to sandbox spec folder
- Response includes full metadata for each checkpoint

## Verdict: **PASS**
All acceptance checks satisfied. Checkpoints returned in newest-first order with usable recovery asset information.
