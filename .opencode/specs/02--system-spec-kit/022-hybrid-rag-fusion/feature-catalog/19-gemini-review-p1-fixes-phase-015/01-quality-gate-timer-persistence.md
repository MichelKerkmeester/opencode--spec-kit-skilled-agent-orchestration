# Quality gate timer persistence

## Current Reality

The `qualityGateActivatedAt` timestamp in `save-quality-gate.ts` was stored purely in-memory. Every server restart reset the 14-day warn-only countdown, preventing the quality gate from graduating to enforcement mode. The fix adds SQLite persistence to the `config` table using the existing key-value store pattern. `isWarnOnlyMode()` lazy-loads from DB when the in-memory value is null. `setActivationTimestamp()` writes to both memory and DB. All DB operations are non-fatal with graceful fallback.

## Source Metadata

- Group: Gemini review P1 fixes (Phase 015)
- Source feature title: Quality gate timer persistence
- Current reality source: feature_catalog.md
