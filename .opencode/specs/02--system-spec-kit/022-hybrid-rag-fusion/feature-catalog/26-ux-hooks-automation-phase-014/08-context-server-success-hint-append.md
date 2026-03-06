# Context-server success-path hint append

## Current Reality

The context-server success path now appends UX hints through `appendAutoSurfaceHints` while preserving the existing `autoSurfacedContext` payload. This adds guidance without changing the established context auto-surface contract. The finalized implementation runs that append step before token-budget enforcement and recomputes final token metadata from the completed envelope.

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Context-server success-path hint append
- Current reality source: feature_catalog.md
