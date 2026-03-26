---
title: "Activation window persistence"
description: "Activation window persistence preserves the quality gate warn-only countdown timestamp across process restarts via SQLite storage."
---

# Activation window persistence

## 1. OVERVIEW

Activation window persistence preserves the quality gate warn-only countdown timestamp across process restarts via SQLite storage.

The quality gate needs a two-week trial period before it starts blocking bad saves. Previously, restarting the server reset the trial clock back to zero, so the gate never graduated. This fix remembers the start date in the database so restarts do not affect the countdown. Without it, the quality gate would stay in warning-only mode forever.

---

## 2. CURRENT REALITY

The `ensureActivationTimestampInitialized` path was added to `save-quality-gate.ts` to preserve the warn-only window activation timestamp across process restarts. Without this, the 14-day warm-up period restarted on every server reload. Regression test `WO7` verifies persistence.

---

## 3. SOURCE FILES

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

---

## 4. SOURCE METADATA

- Group: Alignment remediation (Phase 016)
- Source feature title: Activation window persistence
- Current reality source: FEATURE_CATALOG.md
