---
title: "Tasks: Non-Hook Auto-Priming & Session Health [024/018]"
description: "Task tracking for MCP first-call auto-priming and session health."
---
# Tasks: Phase 018 — Non-Hook Auto-Priming & Session Health

**Overall phase state:** PARTIAL — the core MCP behavior shipped, but follow-up limitations and cross-phase doc ownership remain open.

## Completed

- [x] PrimePackage struct defined — memory-surface.ts (specFolder, codeGraphStatus, cocoIndexAvailable, recommendedCalls)
- [x] primeSessionIfNeeded() wired into context-server.ts — sessionPrimed flag + auto-prime on first tool call
- [x] Token budget enforcement on prime payload — enforceAutoSurfaceTokenBudget applied
- [x] session_health tool created — handlers/session-health.ts (132 lines), returns ok/warning/stale
- [x] recordToolCall/getSessionTimestamps exports — memory-surface.ts:101-107
- [x] Tool schema registration — session_health registered in tool-schemas.ts and schemas/tool-input-schemas.ts
- [x] Handler wired in lifecycle-tools.ts — session_health dispatched from tool dispatch
- [x] F045 fixed — sessionPrimed now flips after successful priming instead of before the try block
- [x] F046 fixed — CocoIndex availability now uses the shared helper instead of process.cwd()-based lookup

## Deferred / Follow-Up

- [ ] session_health idle-gap timer excludes the current health-check call — KNOWN LIMITATION
- [ ] spec-folder-change warning path is surfaced by session_health — NOT IMPLEMENTED
- [ ] CLAUDE.md/GEMINI.md gate-doc parity is closed in this phase — handled later in Phase 021 instead
- [ ] F047: Dual lastToolCallAt state in memory-surface.ts and context-metrics.ts — needs consolidation (P2 tech debt)
