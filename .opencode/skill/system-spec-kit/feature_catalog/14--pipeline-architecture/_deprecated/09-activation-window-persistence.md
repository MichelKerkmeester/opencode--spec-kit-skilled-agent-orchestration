---
title: "Activation window persistence"
description: "Archived copy of the activation window persistence entry. The live path no longer uses the legacy quality-gate timer path."
audited_post_018: true
deprecated_at: 2026-04-11
deprecated_by: phase-006-canonical-continuity-refactor
deprecated_reason: "The legacy quality-gate timer path is no longer part of the live pipeline."
---

# Activation window persistence

## 1. OVERVIEW

Activation window persistence preserves the legacy quality-gate countdown timestamp across process restarts via SQLite storage.

The quality gate originally used a two-week timer before it began blocking bad saves. Previously, restarting the server reset that timer back to zero, so the gate never graduated. This fix remembered the start date in the database so restarts did not affect the countdown.

---

## 2. CURRENT REALITY

The `ensureActivationTimestampInitialized` path was added to `save-quality-gate.ts` to preserve the legacy activation timestamp across process restarts. Without this, the 14-day timer restarted on every server reload. Regression test `WO7` captures the historical behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Persisted legacy timer initialization before phase-018 retirement |
| `mcp_server/handlers/memory-save.ts` | Handler | Invokes quality gate path during save flow |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/save-quality-gate.vitest.ts` | WO7 historical activation-timestamp persistence regression |
| `mcp_server/tests/mpab-quality-gate-integration.vitest.ts` | Historical integration behavior for the retired timer path |

---

## 4. SOURCE METADATA

- Group: Alignment remediation (Phase 016)
- Source feature title: Activation window persistence
- Current reality source: FEATURE_CATALOG.md
