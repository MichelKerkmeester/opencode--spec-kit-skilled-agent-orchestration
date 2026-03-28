---
title: "Packet README: Ablation Benchmark Integrity"
description: "Close-out index for the ablation benchmark repair packet."
trigger_phrases:
  - "packet readme"
  - "ablation benchmark"
  - "benchmark integrity"
importance_tier: "high"
contextType: "general"
---
# Ablation Benchmark Integrity

This packet captures the repair that made Spec Kit Memory ablation trustworthy again on the repo DB.

## Status

- **State**: Complete
- **Date**: 2026-03-28
- **Verdict**: FTS5 weight `0.3` is validated on the repaired benchmark path

## What Changed

- Ablation now fails closed when `ground-truth.json` and the active DB do not share the same parent-memory universe.
- CLI and MCP ablation adapters now normalize `parentMemoryId ?? row.id`.
- Evaluation-only mode bypasses confidence truncation and token-budget truncation so `Recall@K` is not clipped by response-budget heuristics.
- The canonical ground-truth dataset was refreshed against the repo DB and revalidated.
- MCP handler supports `SPECKIT_EVAL_DB_PATH` override via `withAblationDb()` for eval-only DB swapping.
- All 7 MCP runtime configs repointed `MEMORY_DB_PATH` from external `~/.codex/memories/` (44 records) to the repo DB (2,417 records). Symlink placed at the old Codex path for backward compatibility.

## Read First

- `spec.md`: scope, requirements, success criteria
- `plan.md`: implementation phases and rollback
- `tasks.md`: execution history and completion state
- `checklist.md`: verification evidence
- `implementation-summary.md`: final findings, changed files, rerun results

## Verification Snapshot

- Full rerun: `ablation-1774694183830-651d`
- Focused FTS5 rerun: `ablation-1774694221880-ef57`
- Clean baseline Recall@20: `0.32323232323232315`
- FTS5 ablated Recall@20: `0.0`

## Remaining Boundary

None. All MCP configs now use the repo DB and the known limitation is resolved.

## Related Packets

- `../021-ground-truth-id-remapping/`
- `../022-spec-doc-indexing-bypass/`
