# Activation window persistence

## Current Reality

The `ensureActivationTimestampInitialized` path was added to `save-quality-gate.ts` to preserve the warn-only window activation timestamp across process restarts. Without this, the 14-day warm-up period restarted on every server reload. Regression test `WO7` verifies persistence.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Persisted activation window initialization and warn-only gating |
| `mcp_server/handlers/memory-save.ts` | Handler | Invokes quality gate path during save flow |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/save-quality-gate.vitest.ts` | WO7 persisted activation-window regression and warn-only checks |
| `mcp_server/tests/mpab-quality-gate-integration.vitest.ts` | Integration behavior when quality-gate modes interact with save flow |

## Source Metadata

- Group: Alignment remediation (Phase 016)
- Source feature title: Activation window persistence
- Current reality source: feature_catalog.md
