---
title: "027/006 — Checklist"
description: "Acceptance verification for promotion gates."
importance_tier: "high"
contextType: "implementation"
---
# 027/006 Checklist

## P0 (HARD BLOCKER)
- [ ] Shadow-cycle harness replays corpus without live state mutation
- [ ] Weight-delta cap: proposals >0.05 rejected
- [ ] Promotion gate evaluator checks full research.md §11 slice bundle:
  - [ ] ≥75% full-corpus exact top-1
  - [ ] ≥72.5% stratified holdout top-1
  - [ ] UNKNOWN fallback count ≤ 10
  - [ ] Gold-`none` false-fire count no increase
  - [ ] Explicit-skill top-1 / no-abstain no regression
  - [ ] Ambiguity slice stable (top-2-within-0.05)
  - [ ] Derived-lane attribution complete
  - [ ] Adversarial-stuffing fixture blocked
  - [ ] Lifecycle slices: supersession redirects / archived excluded / rolled-back v1 preserved
  - [ ] Cache-hit p95 ≤50ms
  - [ ] Uncached deterministic p95 ≤60ms
  - [ ] Exact parity preservation (from 027/003)
  - [ ] Canonical regression fixtures green (P0 pass 1.0, failed 0, command-bridge FP ≤0.05)
- [ ] Two-positive-shadow-cycles rule enforced
- [ ] Semantic live weight locked at 0.00 (cannot raise without gate approval)
- [ ] Corpus + latency + safety bench harnesses exist + callable

## P1 (Required)
- [ ] Rollback on regression (weights reverted cleanly)
- [ ] Ablation tooling reused from 027/003
- [ ] Per-gate result artifacts written for audit
- [ ] CLI entry point for end-to-end promotion evaluation

## P2 (Suggestion)
- [ ] Optional batch/benchmark tools (deferred from r01 D3)
- [ ] Historical comparison tracking

## Integration / Regression
- [ ] Full vitest suite green
- [ ] TS build clean
- [ ] Shadow cycles produce zero audit-detected live mutations
- [ ] Simulated regressions correctly fail gates (4 scenarios)

## Research conformance
- [ ] C6 semantic stays shadow-only (0.00 live) through first wave
- [ ] C8 ≥75% full corpus + ≥72.5% holdout thresholds enforced
- [ ] G5 deterministic holdout replay, no live side effects, two positive cycles, rollback on regression
- [ ] G6 full bundled promotion policy: ≥75/72.5 + two shadow cycles + no safety/latency regression + exact parity + regression-suite gates + bounded learned-only
