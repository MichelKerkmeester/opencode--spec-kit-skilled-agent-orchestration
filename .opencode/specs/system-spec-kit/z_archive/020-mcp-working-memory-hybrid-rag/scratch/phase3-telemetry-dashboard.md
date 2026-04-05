# Phase 3 Telemetry Dashboard (T056)

> Lane: pre-rollout evaluation (simulated dashboard driven by current artifacts; no production-traffic claims).

## Snapshot

- Generated at: `2026-02-19T10:09:15.295Z`
- Sample count: `1000`
- Data source (queries): `scratch/eval-dataset-1000.json`
- Data source (extraction metrics): `scratch/phase2-closure-metrics.json`

## Core Metrics

| Metric | Value |
|--------|-------|
| Session boost rate | 40.00% |
| Causal boost rate | 33.40% |
| Pressure activation rate | 64.00% |
| Extraction count | 104 |
| Extraction match rate | 26.00% |

## Alert Status

| Alert | Status | Threshold | Value | Note |
|-------|--------|-----------|-------|------|
| session-boost-rate | OK | >= 25% | 40.00% | Session boost should trigger often enough to validate ranking impact. |
| causal-boost-rate | OK | >= 15% | 33.40% | Causal boost should activate for linked-neighbor lookups. |
| pressure-activation-rate | WARN | between 10% and 60% | 64.00% | Pressure policy should activate in high-usage windows but not dominate traffic. |
| extraction-count | OK | > 0 inserts | 104 | Extraction pipeline must produce inserts for telemetry to be meaningful. |

## Raw Counts

- sessionBoostApplied: 400
- causalBoostApplied: 334
- pressureOverridesApplied: 640
- extractionInserted: 104
- extractionSkipped: 283
- extractionMissed: 13

