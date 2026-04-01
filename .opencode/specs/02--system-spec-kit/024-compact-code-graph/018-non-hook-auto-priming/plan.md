---
title: "Plan: Non-Hook Auto-Priming & Session Health [024/018]"
description: "Implementation order for MCP first-call auto-priming and session health monitoring."
---
# Plan: Phase 018 — Non-Hook Auto-Priming & Session Health

## Implementation Order

1. **PrimePackage data structure** (30-40 LOC)
   - Define PrimePackage type: specFolder, codeGraphStatus, cocoIndexAvailable, recommendedCalls
   - Export from memory-surface.ts for use by context-server.ts

2. **First-call auto-prime in context-server.ts** (60-80 LOC)
   - Add `sessionPrimed` boolean flag to context-server state
   - Implement `primeSessionIfNeeded()` that gathers context on first tool call
   - Inject PrimePackage as structured meta + human-readable hints into response
   - Apply `enforceAutoSurfaceTokenBudget` to keep prime payload bounded

3. **Session health handler** (80-100 LOC)
   - Create `handlers/session-health.ts` with `session_health` tool
   - Return traffic-light status: ok / warning / stale
   - Criteria: time since last call, memory recovery state, code graph freshness, spec folder presence

4. **Tool call tracking** (20-30 LOC)
   - Add `recordToolCall()` and `getSessionTimestamps()` exports to memory-surface.ts
   - Track first and last tool call timestamps per session

5. **Tool schema registration** (15-20 LOC)
   - Register `session_health` in tool-schemas.ts and schemas/tool-input-schemas.ts
   - Wire handler in tools/lifecycle-tools.ts

6. **Health warning injection** (20-30 LOC)
   - Inject recovery hints into normal tool responses when health drops to warning/stale
   - Trigger from context-server.ts dispatch path

## Dependencies
- None — additive feature, no existing behavior changed

## Estimated Total LOC: 360-670
