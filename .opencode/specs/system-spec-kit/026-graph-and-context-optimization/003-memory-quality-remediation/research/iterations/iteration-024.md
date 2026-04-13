# Iteration 24: Observability Hooks for Post-fix Pipeline (Q21)

## Focus
PR-9 is explicitly the guardrail PR at the tail of the 9-PR train, and iteration 19 already defined the structural reviewer contract (`CHECK-D1..D8`) that should catch the known memory-save regressions. But the live save path still runs that review only after the file is written, prints a human-readable report to stdout, and optionally applies an internal `quality_score` penalty; nothing in the current path emits an external low-cardinality production signal that an operator could alert on before users read a broken memory file. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:311-328] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-155] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419]

The minimal production-safe answer is therefore not "add full observability everywhere." It is: keep the new reviewer assertions, but also emit a compact metric/log layer at the save boundary so D1/D2/D4/D7 regressions page quickly, D3/D5/D8 drift becomes visible as warning trends, and PR-7/PR-9 overhead stays measurable. The codebase already has a reusable structured JSON logger on stderr, plus a few targeted audit events, so the missing piece is a save-pipeline telemetry catalog rather than a brand-new logging substrate. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:463-481] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:850-865] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:800-811]

## Approach
- Re-read Gen-3 scope to keep this pass inside Q21 and anchor the recommendation to PR-9 rather than reopening the root-cause work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:215-246]
- Use iteration 19's `CHECK-D1..D8` contract as the defect-to-signal map, because that is already the frozen reviewer surface PR-9 is meant to ship. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:25-155]
- Audit the save path for real existing observability hooks: structured JSON logger, stdout review print, degradation warnings, and any currently emitted audit events. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:463-474]
- Prefer low-cardinality counters/histograms at the save boundary; keep path/title/detail payloads in structured logs only. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48]
- Treat D1/D2/D4/D7 as page-worthy because iteration 19 already classified them as HIGH reviewer failures, and keep D3/D5/D6/D8 warning-level unless they spike. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-149]

## Existing telemetry surface (baseline)
| Primitive | Location | Current use |
|-----------|----------|-------------|
| `structuredLog()` | `scripts/utils/logger.ts`, `core/workflow.ts`, `extractors/collect-session-data.ts` | JSON-on-stderr events; already used for enrichment degradation, contamination audit, and observation truncation. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:463-474] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:850-865] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:800-811] |
| `console.log` / `console.warn` | `core/post-save-review.ts`, `core/workflow.ts` | Human-readable progress, degraded-enrichment warnings, and post-save reviewer output. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:608-611] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:468-474] |
| `quality_score` penalty | `core/post-save-review.ts`, `core/workflow.ts` | Internal score feedback after review findings; useful for artifact scoring, not external operator alerting. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:356-375] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1790-1796] |
| Dedicated metrics (`counter` / `histogram` / `span`) | No dedicated abstraction surfaced in the scoped scripts audit | Proposal assumes a thin `memory-telemetry.ts` wrapper layered on top of `structuredLog()` now, with optional later bridge to StatsD/OpenTelemetry. |

## Proposed metric catalog

### M0: memory_save_total
- Type: counter (labels: outcome=passed/issues_found/skipped, input_mode=json/captured)
- Meaning: denominator for every alert and dashboard ratio
- Watches: overall save health, alert normalization
- Cardinality: low
- Priority: HIGH (ship with PR-9)

### M1: memory_save_overview_length_histogram
- Type: histogram (buckets: 0, 100, 250, 450, 500, 600, 1000, 5000)
- Meaning: distribution of OVERVIEW length per save
- Watches: D1 regression (spike at 500-boundary bucket)
- Cardinality: low
- Priority: HIGH (ship with PR-9)

### M2: memory_save_decision_fallback_used_total
- Type: counter
- Meaning: number of saves where lexical fallback produced decisions
- Watches: D2 regression (spike after PR-6 merge)
- Cardinality: low
- Priority: HIGH

### M3: memory_save_trigger_phrase_rejected_total
- Type: counter (labels: reason=path_fragment/stopword/bigram)
- Meaning: how many phrases got filtered per save
- Watches: D3 filter effectiveness plus false-positive drift
- Cardinality: low-medium
- Priority: HIGH

### M4: memory_save_frontmatter_tier_drift_total
- Type: counter
- Meaning: number of saves where frontmatter tier does not equal metadata tier
- Watches: D4 regression
- Cardinality: low
- Priority: HIGH

### M5: memory_save_continuation_signal_hit_total
- Type: counter (labels: pattern=extended/continuation/skipped_ambiguous)
- Meaning: continuation signal hit frequency plus skip reasons
- Watches: D5 gating correctness
- Cardinality: low
- Priority: HIGH

### M6: memory_save_git_provenance_missing_total
- Type: counter
- Meaning: JSON-mode saves where provenance was expected but `head_ref` / `commit_ref` did not land
- Watches: D7 regression
- Cardinality: low
- Priority: HIGH

### M7: memory_save_template_anchor_violations_total
- Type: counter
- Meaning: TOC/anchor/comment mismatches caught by the template contract
- Watches: D8 regression
- Cardinality: low
- Priority: MEDIUM

### M8: memory_save_review_violation_total
- Type: counter (labels: check_id=D1..D8, severity=HIGH/MEDIUM)
- Meaning: per-check failure frequency from the PR-9 reviewer
- Watches: all D1-D8 defects simultaneously
- Cardinality: low
- Priority: HIGH

### M9: memory_save_duration_seconds
- Type: histogram (buckets: 0.01, 0.05, 0.10, 0.25, 0.50, 1, 2, 5)
- Meaning: save-flow wall-clock time from review start to review output
- Watches: PR-7 plus PR-9 performance impact
- Cardinality: low
- Priority: HIGH

### M10: memory_save_predecessor_discovery_total
- Type: counter (labels: outcome=hit/miss/ambiguous/error)
- Meaning: outcome mix for PR-7 predecessor lookup
- Watches: D5 lineage effectiveness and unexpected error rate
- Cardinality: low
- Priority: HIGH

### M11: memory_save_provenance_extraction_total
- Type: counter (labels: outcome=success/failure/skipped)
- Meaning: explicit denominator for D7 alerts so "missing provenance" can be interpreted against expected opportunities
- Watches: provenance seam health after PR-4
- Cardinality: low
- Priority: HIGH

## Proposed log events
- `memory_save_started` at `info` with `input_mode`, `save_mode`, `spec_folder_name`, `provenance_expected`, `continuation_signal`, `review_enabled` when Step 10.5 begins in `workflow.ts`.
- `memory_save_predecessor_discovery` at `info`/`warn` with `pattern`, `outcome`, `candidate_count`, `duration_ms` when PR-7 lookup runs.
- `memory_save_review_completed` at `info`/`warn` with `status`, `issue_count`, `high_count`, `medium_count`, `low_count`, `score_penalty`, `duration_ms` after `printPostSaveReview()`.
- `memory_save_review_violation` at `warn` with `check_id`, `severity`, `field`, `message`, `input_mode` once per D1-D8 hit.
- `memory_save_git_provenance_degraded` at `warn` with `provenance_expected`, `head_ref_present`, `commit_ref_present`, `repository_state`, `is_detached_head` when D7-like degradation lands.
- `memory_save_template_contract_violation` at `warn` with `anchor_comment`, `anchor_html_id`, `toc_target` when D8 fires.

## Proposed healthcheck
Prefer a CLI canary over a server `/healthz`, because the save pipeline in scope is script-driven rather than a long-lived HTTP service. Add `scripts/memory-doctor.ts --canary` that runs one clean save fixture plus defect-shaped canaries through the same `reviewPostSaveQuality()` path, emits the metric/log set above, and exits `0` for healthy, `1` for warning-only drift, `2` for any HIGH regression. The command should assert two things: expected zero-only metrics (`memory_save_frontmatter_tier_drift_total`, `memory_save_git_provenance_missing_total`, `memory_save_review_violation_total{severity="HIGH"}`) stay at zero on the clean canary, and expected defect fixtures increment the matching per-check metric exactly once. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:25-155] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-230]

## Dashboard mock (text layout)
```text
┌──────────────────────────────────────────────────────┐
│ Memory Save Health                                  │
├──────────────────────────────────────────────────────┤
│ [M0] Saves/min + issues_found ratio                 │
│ [M1] OVERVIEW length p50/p95 + 500-600 bucket share │
│ [M4] Tier drift: 0 (must stay 0)                    │
│ [M6] Missing git provenance / hr                    │
│ [M8] Review violations by check_id + severity       │
│ [M9] Save duration p50/p95                          │
│ [M10] Predecessor discovery hit/miss/ambiguous      │
└──────────────────────────────────────────────────────┘
```

## Alerting rules
- ALERT: `memory_save_frontmatter_tier_drift_total > 0` in 15m -> page immediately (D4 should be zero post-fix).
- ALERT: `memory_save_review_violation_total{check_id=~"D1|D2|D4|D7",severity="HIGH"} > 0` in 15m -> page.
- ALERT: `memory_save_git_provenance_missing_total > 5/hour` AND `memory_save_provenance_extraction_total{outcome="success"} > 0` -> warn.
- ALERT: `memory_save_overview_length_histogram` 500-600 bucket share > 20% of JSON saves for 30m -> warn.
- ALERT: `memory_save_duration_seconds` p95 > 0.50 for 30m -> warn.
- ALERT: `memory_save_predecessor_discovery_total{outcome="ambiguous"} / memory_save_continuation_signal_hit_total > 0.20` for 1h -> warn.
- ALERT: `memory_save_template_anchor_violations_total > 0` after PR-1 rollout -> warn.

## Rollout plan
- Best fit: ship a new `scripts/lib/memory-telemetry.ts` consumed by `post-save-review.ts` and the Step 10.5 callsite in `workflow.ts`, reusing `structuredLog()` for transport and keeping reviewer logic focused on detection rather than log formatting. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797]
- Minimum ship set for PR-9: M0, M1, M4, M6, M8, M9, plus `memory_save_review_completed` and `memory_save_review_violation` logs.
- Nice-to-have / defer: M7, M10, M11 and a canary `memory doctor` CLI if PR-9 scope gets tight.
- Estimated LOC: ~130 (helper + 2 callsites + tests)

## Findings
1. The live save boundary already has a precise injection point: Step 10.5 runs `reviewPostSaveQuality()` after file write, prints the review, and computes a score penalty, so telemetry can attach there without changing upstream extraction semantics. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797]
2. The current reviewer is still output-only from an operator perspective: it returns structured issues in memory, but its shipped surface is stdout text plus JSON print, not a metric or alert channel. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-230] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419]
3. A reusable structured logging primitive already exists and writes JSON to stderr, which is the right substrate for minimal save telemetry because it preserves stdout for CLI/data output. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:8-10] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48]
4. The scripts layer already emits low-cardinality operational events such as `contamination_audit` and `observation_truncation_applied`, so adding `memory_save_*` events is consistent with current practice rather than a new observability pattern. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:850-865] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:800-811]
5. PR-9 is intentionally scoped as the post-save reviewer upgrade at the end of the PR train, which means the telemetry set should stay guardrail-sized and defect-oriented rather than introducing a broad tracing platform in the same change. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:320-330]
6. Iteration 19 already gave a severity map for the checks: D1/D2/D4/D7 are HIGH and D3/D5/D6/D8 are MEDIUM, which naturally converts into page-vs-warn alert tiers for the new metrics. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-149]

## Ruled out / not reproducible
- Full tracing / span instrumentation in PR-9 is ruled out as the first ship vehicle; the code in scope already has a JSON logger and a narrow reviewer callsite, so counters/histograms plus structured events are the minimal fit for the stated guardrail PR. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:328-330]
- A server-style `/healthz` endpoint is not the preferred first healthcheck because the save path under study is a CLI/script workflow, not a resident HTTP service. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:608-611]

## New questions raised
- Should `memory-telemetry.ts` stop at `structuredLog()` emission, or should PR-9 also define a pluggable adapter boundary for StatsD / OpenTelemetry export?
- Where should `provenance_expected` live after PR-4: derived in `workflow.ts`, or passed explicitly into the reviewer input contract?

## Next focus recommendation
Iteration 25 should execute Q22 (cross-runtime capture-mode parity). See strategy §15. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:223-246]
