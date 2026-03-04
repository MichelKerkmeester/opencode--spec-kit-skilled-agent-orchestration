# Checkpoint deletion (checkpoint_delete)

## Current Reality

Permanently removes a named checkpoint from the `checkpoints` table. Returns a boolean indicating whether the checkpoint was found and deleted. No confirmation prompt. No safety net. If you delete the wrong checkpoint, it is gone. Use `checkpoint_list` first to verify the name.

---

## Source Metadata

- Group: Lifecycle
- Source feature title: Checkpoint deletion (checkpoint_delete)
- Summary match found: No
- Current reality source: feature_catalog.md
