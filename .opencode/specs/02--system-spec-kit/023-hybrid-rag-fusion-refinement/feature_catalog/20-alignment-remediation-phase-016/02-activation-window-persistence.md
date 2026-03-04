# Activation window persistence

## Current Reality

The `ensureActivationTimestampInitialized` path was added to `save-quality-gate.ts` to preserve the warn-only window activation timestamp across process restarts. Without this, the 14-day warm-up period restarted on every server reload. Regression test `WO7` verifies persistence.

## Source Metadata

- Group: Alignment remediation (Phase 016)
- Source feature title: Activation window persistence
- Current reality source: feature_catalog.md
