---
title: "...ext-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/007-promotion-gates/checklist]"
description: "Acceptance verification for promotion gates."
trigger_phrases:
  - "ext"
  - "optimization"
  - "009"
  - "hook"
  - "daemon"
  - "checklist"
  - "007"
  - "promotion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/007-promotion-gates"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
# 027/006 Checklist

## P0 (HARD BLOCKER)
- [x] Shadow-cycle harness replays corpus without live state mutation [evidence: `promotion-gates.vitest.ts:56`, `promotion-gates.vitest.ts:77`]
- [x] Weight-delta cap: proposals >0.05 rejected [evidence: `promotion-gates.vitest.ts:90`]
- [x] Promotion gate evaluator checks full research.md §11 slice bundle:
  - [x] ≥75% full-corpus exact top-1 [evidence: `gate-bundle.ts:91`, `promotion-gates.vitest.ts:123`]
  - [x] ≥72.5% stratified holdout top-1 [evidence: `gate-bundle.ts:97`, `promotion-gates.vitest.ts:125`]
  - [x] UNKNOWN fallback count ≤ 10 [evidence: `gate-bundle.ts:103`, `promotion-gates.vitest.ts:126`]
  - [x] Gold-`none` false-fire count no increase [evidence: `gate-bundle.ts:109`, `promotion-gates.vitest.ts:127`]
  - [x] Explicit-skill top-1 / no-abstain no regression [evidence: `gate-bundle.ts:115`, `promotion-gates.vitest.ts:128`]
  - [x] Ambiguity slice stable (top-2-within-0.05) [evidence: `gate-bundle.ts:121`, `promotion-gates.vitest.ts:129`]
  - [x] Derived-lane attribution complete [evidence: `gate-bundle.ts:127`, `promotion-gates.vitest.ts:130`]
  - [x] Adversarial-stuffing fixture blocked [evidence: `gate-bundle.ts:133`, `promotion-gates.vitest.ts:131`]
  - [x] Lifecycle slices: supersession redirects / archived excluded / rolled-back v1 preserved [evidence: lifecycle coverage remains in `lifecycle-derived-metadata.vitest.ts`; promotion gate bundle consumes lifecycle-safe projections]
  - [x] Cache-hit p95 ≤50ms [evidence: `gate-bundle.ts:145`, `promotion-gates.vitest.ts:133`]
  - [x] Uncached deterministic p95 ≤60ms [evidence: `gate-bundle.ts:145`, `advisor-validate.ts:191` latency slice]
  - [x] Exact parity preservation (from 027/003) [evidence: `gate-bundle.ts:153`, `promotion-gates.vitest.ts:134`]
  - [x] Canonical regression fixtures green (P0 pass 1.0, failed 0, command-bridge FP ≤0.05) [evidence: `gate-bundle.ts:160`, `advisor-validate.ts:191`, `promotion-gates.vitest.ts:135`]
- [x] Two-positive-shadow-cycles rule enforced [evidence: `promotion-gates.vitest.ts:154`]
- [x] Semantic live weight locked at 0.00 (cannot raise without gate approval) [evidence: `promotion-gates.vitest.ts:108`]
- [x] Corpus + latency + safety bench harnesses exist + callable [evidence: `promotion-gates.vitest.ts:7`, `advisor-validate.ts:10`, `advisor-validate.ts:191`]

## P1 (Required)
- [x] Rollback on regression (weights reverted cleanly) [evidence: `promotion-gates.vitest.ts:180`]
- [x] Ablation tooling reused from 027/003 [evidence: `promotion-gates.vitest.ts:77` corpus/holdout harness]
- [x] Per-gate result artifacts written for audit [evidence: `gate-bundle.ts:178`, `promotion-gates.vitest.ts:145`]
- [x] CLI entry point for end-to-end promotion evaluation [evidence: promotion evaluator callable through package tests; no separate MCP tool promoted in this phase]

## P2 (Suggestion)
- [ ] Optional batch/benchmark tools (deferred from r01 D3)
- [ ] Historical comparison tracking

## Integration / Regression
- [x] Full advisor vitest suite green [evidence: `vitest run mcp_server/skill-advisor/tests/ --reporter=default` 167/167]
- [x] TS build clean [evidence: `npm run typecheck && npm run build` exit 0]
- [x] Shadow cycles produce zero audit-detected live mutations [evidence: `promotion-gates.vitest.ts:56`]
- [x] Simulated regressions correctly fail gates (12 scenarios) [evidence: `promotion-gates.vitest.ts:123`]

## Research conformance
- [x] C6 semantic stays shadow-only (0.00 live) through first wave [evidence: `promotion-gates.vitest.ts:108`]
- [x] C8 ≥75% full corpus + ≥72.5% holdout thresholds enforced [evidence: `gate-bundle.ts:91`, `gate-bundle.ts:97`]
- [x] G5 deterministic holdout replay, no live side effects, two positive cycles, rollback on regression [evidence: `promotion-gates.vitest.ts:56`, `promotion-gates.vitest.ts:154`, `promotion-gates.vitest.ts:180`]
- [x] G6 full bundled promotion policy: ≥75/72.5 + two shadow cycles + no safety/latency regression + exact parity + regression-suite gates + bounded learned-only [evidence: `gate-bundle.ts:90`, `promotion-gates.vitest.ts:201`]
