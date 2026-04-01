---
title: "Tasks: Non-Hook Auto-Priming & Session Health [024/018]"
description: "Task tracking for MCP first-call auto-priming and session health."
---
# Tasks: Phase 018 — Non-Hook Auto-Priming & Session Health

## Completed

- [x] PrimePackage struct defined — memory-surface.ts (specFolder, codeGraphStatus, cocoIndexAvailable, recommendedCalls)
- [x] primeSessionIfNeeded() wired into context-server.ts — sessionPrimed flag + auto-prime on first tool call
- [x] Token budget enforcement on prime payload — enforceAutoSurfaceTokenBudget applied
- [x] session_health tool created — handlers/session-health.ts (132 lines), returns ok/warning/stale
- [x] recordToolCall/getSessionTimestamps exports — memory-surface.ts:101-107
- [x] Tool schema registration — session_health registered in tool-schemas.ts and schemas/tool-input-schemas.ts
- [x] Handler wired in lifecycle-tools.ts — session_health dispatched from tool dispatch

## Deferred

- [ ] F045: sessionPrimed flag set before try block — retry suppressed on failure (P2)
- [ ] F046: cocoIndex path hardcoded via process.cwd() — should use configured path (P2)
- [ ] F047: Dual lastToolCallAt state in memory-surface.ts and context-metrics.ts — needs consolidation (P2)
