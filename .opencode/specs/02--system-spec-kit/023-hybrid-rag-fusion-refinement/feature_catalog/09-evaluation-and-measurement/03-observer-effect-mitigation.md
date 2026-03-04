# Observer effect mitigation

## Current Reality

Measurement infrastructure should not degrade the system it measures. A health check compares search p95 latency with eval logging enabled versus disabled and fires an alert when overhead exceeds 10%. In practice, measured overhead stays within the 5ms p95 budget. If the eval database becomes unavailable (disk full, file lock, corruption), search continues normally with logging silently disabled. The system never blocks a user query to record an evaluation metric.

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Observer effect mitigation
- Current reality source: feature_catalog.md
