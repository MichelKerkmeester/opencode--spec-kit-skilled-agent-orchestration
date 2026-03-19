# EX-015 — Checkpoint Creation Evidence

## Preconditions
- MCP server healthy (v1.7.2, 679 memories, all subsystems green)
- Sandbox spec folder `test-sandbox-lifecycle` created with seed files
- Checkpoint naming convention: `pre-[test-id]-[action]`

## Execution Transcript

### Step 1: checkpoint_create
```
checkpoint_create({ name: "pre-bulk-delete", specFolder: "test-sandbox-lifecycle" })
```
**Response:**
```json
{
  "summary": "Checkpoint \"pre-bulk-delete\" created successfully",
  "data": {
    "success": true,
    "checkpoint": {
      "id": 3,
      "name": "pre-bulk-delete",
      "createdAt": "2026-03-19T19:00:26.804Z",
      "specFolder": "test-sandbox-lifecycle",
      "gitBranch": null,
      "snapshotSize": 105,
      "metadata": { "memoryCount": 0 }
    }
  }
}
```

### Step 2: checkpoint_list (confirm discoverable)
```
checkpoint_list({ specFolder: "test-sandbox-lifecycle" })
```
**Response:**
```json
{
  "summary": "Found 1 checkpoint(s)",
  "data": {
    "count": 1,
    "checkpoints": [{
      "id": 3,
      "name": "pre-bulk-delete",
      "createdAt": "2026-03-19T19:00:26.804Z",
      "specFolder": "test-sandbox-lifecycle",
      "snapshotSize": 105,
      "metadata": { "memoryCount": 0, "vectorCount": 0, "includeEmbeddings": true }
    }]
  }
}
```

## Expected Signals Checklist
- [x] New checkpoint listed
- [x] Checkpoint name matches requested name
- [x] Checkpoint is scoped to sandbox spec folder
- [x] Snapshot size is non-zero (105 bytes)

## Observations
- Checkpoint creation is near-instant (2ms latency)
- Auto-surface hook injected 1 constitutional + 4 triggered memories during both operations
- Checkpoint is immediately discoverable via `checkpoint_list`

## Verdict: **PASS**
All acceptance checks satisfied. Checkpoint created and discoverable.
