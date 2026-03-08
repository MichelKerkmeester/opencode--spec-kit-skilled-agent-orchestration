# Chunking Orchestrator Safe Swap

## Current Reality

During re-chunking of parent memories, the orchestrator previously deleted existing child chunks before indexing new replacements. If new chunk indexing failed (all embeddings fail, disk full), both old and new data were lost. The fix introduces a staged swap pattern: new child chunks are indexed first without a parent_id link, then a single database transaction atomically deletes old children, attaches new children to the parent, and updates parent metadata. If new chunk indexing fails completely, old children remain intact and the handler returns an error status.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Re-chunk swap logic with staged indexing |

### Tests

| File | Focus |
|------|-------|
| (no dedicated test file yet) | — |

## Source Metadata

- Group: Bug Fixes and Data Integrity
- Source feature title: Chunking Orchestrator Safe Swap
- Current reality source: P0 code review finding (2026-03-08)
