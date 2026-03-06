# Shared post-mutation hook wiring

## Current Reality

Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete, and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Shared post-mutation hook wiring
- Current reality source: feature_catalog.md
