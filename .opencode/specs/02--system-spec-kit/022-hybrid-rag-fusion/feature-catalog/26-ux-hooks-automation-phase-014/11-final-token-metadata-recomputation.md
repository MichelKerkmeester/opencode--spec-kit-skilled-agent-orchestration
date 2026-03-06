# Final token metadata recomputation

## Current Reality

Phase 014 now recomputes final token metadata after `appendAutoSurfaceHints(...)` adds the last response-envelope content and before token-budget enforcement evaluates the payload. This keeps `meta.tokenCount` aligned with the finalized envelope that callers actually receive.

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Final token metadata recomputation
- Current reality source: feature_catalog.md
