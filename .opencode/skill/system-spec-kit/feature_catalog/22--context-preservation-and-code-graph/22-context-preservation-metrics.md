---
title: "Context preservation metrics"
description: "In-memory session quality scoring and event tracking that computes a QualityScore from recency, recovery, graph freshness, and continuity factors."
---

# Context preservation metrics

## 1. OVERVIEW

In-memory session quality scoring and event tracking that computes a QualityScore from recency, recovery, graph freshness, and continuity factors.

The context-metrics module maintains lightweight in-memory state for the current session: tool call count, memory recovery calls, code graph queries, spec folder transitions, and priming status. It computes a QualityScore (0.0-1.0) with 4 weighted factors: recency (time since last tool call, decays over time), recovery (1.0 if memory recovered this session), graphFreshness (1.0 fresh, 0.5 stale, 0.0 empty), and continuity (1.0 if spec folder stable, lower on transitions). Quality levels map to healthy (score >= 0.7), degraded (>= 0.4), or critical (< 0.4). No database persistence; state resets on server restart.

---

## 2. CURRENT REALITY

mcp_server/lib/session/context-metrics.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/session/context-metrics.ts` | Lib | Event recording and QualityScore computation |
| `mcp_server/handlers/session-health.ts` | Handler | Consumer: includes QualityScore in session_health response |
| `mcp_server/lib/session/session-manager.ts` | Lib | Session state management (complements metrics) |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Context preservation metrics
- Current reality source: spec 024-compact-code-graph phase 023
