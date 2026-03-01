# Performance Benchmark Report (CHK-110..CHK-114)

- Generated: 2026-02-19T07:34:23.123Z
- Node: v25.2.1
- Platform: darwin (arm64)

## Thresholds

- NFR-P01 (session boost p95): < 10ms
- NFR-P02 (causal traversal p95): < 20ms
- NFR-P03 (extraction hook p95): < 5ms

## Latency Results

- Session boost p95: 0.025ms
- Causal traversal p95: 1.237ms
- Extraction hook p95: 0.078ms

## Load Test

- Concurrent requests: 1000
- Total wall-clock: 1122.287ms
- Per-request p95: 1.206ms

## Baseline vs Boosted

- Baseline p95: 0.001ms
- Boosted p95: 1.226ms
- p95 delta: 1.225ms (184000.30%)

## Checklist Gate Status

- CHK-110: PASS
- CHK-111: PASS
- CHK-112: PASS
- CHK-113: PASS
- CHK-114: PASS

Raw metrics: performance-benchmark-metrics.json

