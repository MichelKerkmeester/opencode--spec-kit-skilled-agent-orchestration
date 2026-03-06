# Duplicate-save no-op feedback hardening

## Current Reality

Duplicate-content save no-op responses no longer emit false `postMutationHooks`, cache-clear booleans, or misleading invalidation hints. They now explain that the save was a no-op and that caches were left unchanged, so callers receive accurate mutation feedback without pretending a hook ran.

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Duplicate-save no-op feedback hardening
- Current reality source: feature_catalog.md
