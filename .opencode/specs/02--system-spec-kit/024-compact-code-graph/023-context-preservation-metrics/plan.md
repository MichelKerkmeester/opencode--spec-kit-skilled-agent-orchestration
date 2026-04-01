---
title: "Plan: Context Preservation Metrics [024/023]"
description: "Implementation order for session metrics collection and quality scoring."
---
# Plan: Phase 023 — Context Preservation Metrics

## Implementation Order

1. **SessionMetrics and MetricEvent types** (30-40 LOC)
   - Define SessionMetrics type: session start/resume timestamps, tool call counts, recovery stats
   - Define MetricEvent type: event name, timestamp, metadata
   - Export from lib/session/context-metrics.ts

2. **recordMetricEvent() collector** (40-50 LOC)
   - Implement in-memory metric event recording
   - Track: session start/resume/clear, tool calls, memory recovery, code graph scans
   - Lightweight — no SQLite persistence (in-memory only)

3. **computeQualityScore() scoring** (50-60 LOC)
   - 4-factor quality scoring: recency, recovery, graphFreshness, continuity
   - Return QualityScore: healthy / degraded / critical
   - Weighted formula combining all 4 factors

4. **Wire into context-server.ts** (20-30 LOC)
   - Add 4 recordMetricEvent call sites for key lifecycle events
   - Instrument tool dispatch, session start, priming, and health checks

5. **Wire into session_health** (15-20 LOC)
   - session_health handler uses computeQualityScore for its traffic-light status
   - Exposes quality factors in response metadata

## Deferred

- Phase C (Dashboard integration): No context metrics section in eval-reporting dashboard
- Phase D (Drift Detection): No rule-based alerts implemented
- F058: SQLite persistence — spec promised periodic writes but implementation is in-memory only

## Dependencies
- Phase 018 (session health tool) recommended first

## Estimated Total LOC: 650-1170 (Phases C+D deferred reduces to ~200-300)
