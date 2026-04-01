---
title: "Checklist: Context Preservation Metrics [024/023]"
description: "10 items across P1/P2 for phase 023."
---
# Checklist: Phase 023 — Context Preservation Metrics

## P1 — Must Pass

- [x] SessionMetrics type tracks session lifecycle data — lib/session/context-metrics.ts
- [x] MetricEvent type records timestamped events with metadata — lib/session/context-metrics.ts
- [x] recordMetricEvent() stores events in memory — collector function exported
- [x] computeQualityScore() returns healthy/degraded/critical — 4-factor weighted scoring
- [x] session_health tool uses quality score for traffic-light status — handlers/session-health.ts
- [ ] Phase C: Dashboard integration shows context metrics — DEFERRED (not implemented)

## P2 — Should Pass

- [x] context-server.ts instrumented at 4 lifecycle points — recordMetricEvent call sites at lines 690-699
- [x] Quality factors include recency, recovery, graphFreshness, continuity — 4-factor formula
- [ ] F058: Metrics persisted to SQLite periodically — DEFERRED (in-memory only)
- [ ] F065: Weight rationale for quality factors documented — DEFERRED (P2)
- [ ] F066: graphFreshness threshold tuned for auto-trigger cadence — DEFERRED (24h may be too generous)
- [ ] Phase D: Drift detection with rule-based alerts — DEFERRED (not implemented)
