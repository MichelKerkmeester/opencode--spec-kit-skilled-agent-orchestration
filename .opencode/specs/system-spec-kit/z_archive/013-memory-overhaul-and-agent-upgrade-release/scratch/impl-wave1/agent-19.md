# Agent 19 - Wave 1 Slice A19

## Scope
- Updated `.opencode/skill/system-spec-kit/README.md`.
- Updated `.opencode/skill/system-spec-kit/mcp_server/README.md`.

## Changes Applied
- Added explicit Spec 126 post-implementation hardening notes for:
  - import-path regression fixes in `context-server.ts` and `attention-decay.ts`
  - `memory_index_scan` specFolder boundary filtering and incremental chain coverage hardening
  - `memory_save` preservation of `document_type` and `spec_level` in update/reinforce flows
  - vector-index metadata update plumbing
  - causal edge conflict-update semantics preserving stable edge IDs

## Validation
- Documentation-only edit; no code/runtime checks required.
