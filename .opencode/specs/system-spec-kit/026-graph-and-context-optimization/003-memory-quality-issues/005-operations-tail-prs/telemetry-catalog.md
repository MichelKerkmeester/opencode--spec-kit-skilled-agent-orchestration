---
title: "Telemetry Catalog: Phase 5 — Operations Tail"
description: "Operator-facing metric crosswalk for the PR-9 save-quality telemetry set folded into Phase 5 closeout."
trigger_phrases:
  - "phase 5 telemetry catalog"
  - "memory save metrics crosswalk"
  - "m1 m9 defect mapping"
importance_tier: important
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["telemetry-catalog.md"]

---
# Telemetry Catalog: Phase 5 — Operations Tail

> Reconciled on 2026-04-08 during the deep-review remediation cycle. This catalog now matches the current `memory-save-quality-alerts.yml` contract and documents aspirational bucket-share/ratio/p95 rules only as future enhancements that require additional telemetry instrumentation.

This catalog freezes the Phase 5 operator view of the PR-9 telemetry surface. It stays intentionally guardrail-sized: the metrics map directly to defect classes or latency risk, and the current alert thresholds reflect the raw scalar metrics emitted by the implementation rather than a broader tracing design. [SOURCE: ../research/iterations/iteration-024.md:23-30] [SOURCE: ../research/iterations/iteration-024.md:135-147]

## Metric Crosswalk

| Metric | Meaning | Defect class mapping | Threshold | Alert rule pointer |
|--------|---------|----------------------|-----------|--------------------|
| M1 `memory_save_overview_length_histogram` | Per-save OVERVIEW length sample emitted as a raw numeric value | D1 regression watch | Warn when any emitted sample is non-zero for 30m; future bucket-share alerting requires bucketed/denominator telemetry that is not emitted today | `memory-save-quality-alerts.yml :: MemorySaveOverviewBoundaryWarn` |
| M2 `memory_save_decision_fallback_used_total` | Counts saves where lexical fallback produced decisions | D2 | No standalone alert; investigate with M8 if non-zero | `memory-save-quality-alerts.yml :: via reviewer trend only` |
| M3 `memory_save_trigger_phrase_rejected_total` | Counts rejected trigger phrases by reason | D3 | No standalone alert; trend with warning review signals | `memory-save-quality-alerts.yml :: via reviewer trend only` |
| M4 `memory_save_frontmatter_tier_drift_total` | Counts frontmatter vs metadata tier mismatches | D4 | Page immediately if > 0 in 15m | `memory-save-quality-alerts.yml :: MemorySaveTierDriftPage` |
| M5 `memory_save_continuation_signal_hit_total` | Counts continuation-pattern hits, labeled by detected pattern, when save titles look like lineage continuations | D5 | Warn if continuation-pattern hits are > 0 for 1h; future ambiguous-ratio alerting requires an explicit ambiguity numerator/denominator that is not emitted today | `memory-save-quality-alerts.yml :: MemorySaveContinuationAmbiguousWarn` |
| M6 `memory_save_git_provenance_missing_total` | Counts JSON-mode saves where expected provenance did not land | D7 | Warn if > 5/hour with successful extraction denominator present | `memory-save-quality-alerts.yml :: MemorySaveGitProvenanceMissingWarn` |
| M7 `memory_save_template_anchor_violations_total` | Counts overview TOC/comment/HTML anchor mismatches | D8 | Warn if > 0 after PR-1 rollout | `memory-save-quality-alerts.yml :: MemorySaveTemplateAnchorWarn` |
| M8 `memory_save_review_violation_total` | Counts per-check reviewer failures by `check_id` and severity | D1-D8 aggregate guardrail | Page if HIGH D1/D2/D4/D7 reviewer hits are > 0 in 15m | `memory-save-quality-alerts.yml :: MemorySaveHighSeverityReviewPage` |
| M9 `memory_save_duration_seconds` | Per-save review wall-clock duration sample emitted in seconds | Latency / PR-7 plus PR-9 overhead | Warn when an emitted sample is > 0.50 seconds for 30m; future p95 alerting requires histogram/quantile aggregation that is not emitted today | `memory-save-quality-alerts.yml :: MemorySaveDurationP95Warn` |

## Notes

- The catalog intentionally stops at M1-M9 for this phase, even though iteration 24 also sketched M10 and M11 as nice-to-have follow-ons. [SOURCE: ../research/iterations/iteration-024.md:95-107] [SOURCE: ../research/iterations/iteration-024.md:145-147]
- Current implementation note: `emitMemoryMetric()` writes structured `memory_metric` events with a numeric `metric_value` and string labels; it does not emit Prometheus histogram buckets, derived ratios, or quantiles. The M1/M5/M9 threshold language above is therefore intentionally scoped to the current scalar contract.
- `memory_save_review_completed` and `memory_save_review_violation` remain the structured-log companions for the counter and sample surface. [SOURCE: ../research/iterations/iteration-024.md:109-115]
- Alert severity follows the frozen reviewer severity split: D1, D2, D4, and D7 are the page-worthy group; D3, D5, D6, and D8 stay warning-oriented unless they trend upward. [SOURCE: ../research/iterations/iteration-024.md:135-142]
