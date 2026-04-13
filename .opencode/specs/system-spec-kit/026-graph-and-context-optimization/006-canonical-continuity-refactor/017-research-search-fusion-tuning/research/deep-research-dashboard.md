# Deep Research Dashboard

## Status

| Field | Value |
|---|---|
| Topic | Search fusion weight optimization and reranking threshold calibration |
| Session ID | `75c06db9-0994-48a7-916d-bd008514d63a` |
| Status | COMPLETE |
| Iterations | 10 / 10 |
| Started | 2026-04-13T04:50:40Z |
| Last update | 2026-04-13T05:50:00Z |
| Progressive synthesis | true |

## Question Coverage

| Question | Status | Outcome |
|---|---|---|
| `RQ-1` | Answered | `search-weights.json` is secondary; continuity tuning should target adaptive fusion plus RRF K |
| `RQ-2` | Answered | `0.2346` is canonical FSRS v4 and should not be packet-locally retuned |
| `RQ-3` | Answered with bounded evidence | Quality uplift is visible in fixtures; live latency telemetry is missing |
| `RQ-4` | Answered | Long-doc penalty is mismatched to actual spec-doc corpus shape |
| `RQ-5` | Answered as bounded unknown | Current code cannot measure cache hit rate |

## Iteration Metrics

| Run | Focus | Findings | New info ratio | Questions answered |
|---|---|---:|---:|---|
| 1 | Cross-encoder constants | 3 | 0.85 | - |
| 2 | Stage 1/2 plus search-weights inventory | 3 | 0.78 | - |
| 3 | Canonical decay and source-of-truth paths | 3 | 0.72 | `RQ-2` |
| 4 | Adaptive fusion profiles | 3 | 0.62 | - |
| 5 | RRF K-sensitivity | 3 | 0.55 | - |
| 6 | Continuity query mapping | 3 | 0.46 | `RQ-1` |
| 7 | Provider behavior and fixtures | 3 | 0.38 | `RQ-3` |
| 8 | Length penalty fit and cache observability | 3 | 0.30 | `RQ-4` |
| 9 | Recommendation framing | 3 | 0.22 | `RQ-5` |
| 10 | Final synthesis | 4 | 0.12 | `RQ-1`-`RQ-5` consolidated |

## Aggregate Metrics

| Metric | Value |
|---|---:|
| Total findings logged | 31 |
| Average new info ratio | 0.50 |
| Distinct code/doc sources cited | 15 |
| Corpus probes executed | 3 |
| Blocked measurement areas | 2 |

## High-Signal Findings

1. `search-weights.json` is not the hybrid fusion control plane; it only affects vector smart-ranking.
2. FSRS `0.2346` is canonical across scheduler and search-time decay usage.
3. The long-document penalty threshold (`>2000`) hits `78.6%` of system-spec-kit markdown docs.
4. Cache hit rate is currently unmeasurable because the reranker exports latency but not hit/miss counters.
5. Repo-native K-sweep tooling already supports intent-specific RRF calibration.

## Recommendation Snapshot

| Area | Recommendation |
|---|---|
| Fusion weights | Add a dedicated continuity config surface instead of reusing `search-weights.json` |
| RRF K | Test `K=60-80` for continuity-style discovery and `K=10-20` for literal navigation |
| Rerank threshold | Raise the minimum rerank candidate threshold above `2` |
| Length penalty | Raise or remove the `>2000` long-doc penalty for spec-doc continuity paths |
| Cache TTL | Keep `5m` until hit/miss telemetry exists |

## Follow-On Blockers

- Add provider-tagged latency metrics
- Add reranker cache hit/miss counters
- Add a continuity-specific judged query set for K and weight evaluation
