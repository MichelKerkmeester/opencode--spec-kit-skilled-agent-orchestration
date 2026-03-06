# Atomic-save parity and partial-indexing hints

## Current Reality

`atomicSaveMemory()` now returns the same `postMutationHooks` envelope shape and UX hint payloads as the primary save path. The finalized follow-up pass also preserved structured partial-indexing guidance so callers can handle atomic-save outcomes with the same parsing and recovery flow used for standard saves.

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Atomic-save parity and partial-indexing hints
- Current reality source: feature_catalog.md
