---
title: "Checklist: Non-Hook Auto-Priming & Session Health [024/018]"
description: "9 items across P1/P2 for phase 018."
---
# Checklist: Phase 018 — Non-Hook Auto-Priming & Session Health

## P1 — Must Pass

- [x] PrimePackage includes specFolder, codeGraphStatus, cocoIndexAvailable, recommendedCalls — memory-surface.ts PrimePackage type
- [x] First tool call triggers auto-prime with structured meta and hints — context-server.ts primeSessionIfNeeded()
- [x] session_health tool returns ok/warning/stale traffic-light status — handlers/session-health.ts
- [x] Token budget enforced on prime payload — enforceAutoSurfaceTokenBudget applied
- [x] Tool call timestamps tracked per session — recordToolCall/getSessionTimestamps in memory-surface.ts

## P2 — Should Pass

- [x] session_health registered in tool-schemas.ts — schema and input schema present
- [x] Handler wired in lifecycle-tools.ts — dispatch path verified
- [ ] F045: sessionPrimed flag retry on failure — DEFERRED (flag set before try block)
- [ ] F046: cocoIndex path uses configured root instead of process.cwd() — DEFERRED
