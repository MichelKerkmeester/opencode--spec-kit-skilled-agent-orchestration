---
title: "Plan: Hookless Priming Optimization [024/024]"
description: "Implementation order for 10 hookless priming improvements."
---
# Plan: Phase 024 — Hookless Priming Optimization

## Implementation Order

1. **Item 10: Gemini detection fix** (10-20 LOC)
   - Read runtime-detection.ts, find where Gemini is classified
   - Check if .gemini/settings.json hooks block is detected
   - Fix detection to return 'hooks' when hooks are configured

2. **Items 1-3: Agent updates** (30-50 LOC)
   - Update context-prime.md: 2 calls instead of 4, urgency skip
   - Update orchestrate.md: reframe as best-effort
   - Copy to all 5 runtime dirs

3. **Item 5: Shared snapshot helper** (60-80 LOC)
   - Create lib/session/session-snapshot.ts
   - Extract: getSessionSnapshot() returning { specFolder, currentTask, graphFreshness, cocoAvailable, sessionQuality }
   - Used by: buildServerInstructions, PrimePackage, session_health

4. **Item 4: Server instructions enrichment** (40-60 LOC)
   - In context-server.ts buildServerInstructions()
   - Call getSessionSnapshot() and add recovery digest section
   - ~150-400 tokens, only when snapshot has useful data

5. **Item 6: Tool description improvements** (20-30 LOC)
   - In tool-schemas.ts: add "Call this on session start" to session_resume
   - Add "Use for session recovery" to memory_context
   - Add "Check before long tasks" to session_health

6. **Item 8: session_resume minimal mode** (30-40 LOC)
   - Add optional `minimal: boolean` param
   - When true: skip full memory_context resume, return only graph + coco + health
   - Update schema + handler

7. **Item 7: session_bootstrap composite** (80-100 LOC)
   - New handler combining session_resume(minimal) + session_health + graph_status
   - Register in tool-schemas, wire dispatcher
   - Returns single comprehensive bootstrap packet

8. **Item 9: Bootstrap telemetry** (40-60 LOC)
   - Add recordBootstrapEvent to context-metrics.ts
   - Track: source (hook/mcp/agent/manual), duration_ms, completeness (partial/full)
   - Wire into primeSessionIfNeeded and session_resume

## Estimated Total: 310-440 LOC
## Dependencies: None (all prerequisites from 017-023 complete)
