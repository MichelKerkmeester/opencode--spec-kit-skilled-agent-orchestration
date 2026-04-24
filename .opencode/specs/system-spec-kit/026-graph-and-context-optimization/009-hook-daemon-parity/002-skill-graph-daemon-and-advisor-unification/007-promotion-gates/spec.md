---
title: "...-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/007-promotion-gates/spec]"
description: "Shadow-cycle infrastructure for semantic + learned channels. Semantic live weight stays 0.00 through first wave. Only bounded learned/adaptive live influence eligible first. Accuracy/safety/latency gates: ≥75% full corpus + ≥72.5% holdout + two positive shadow cycles + no regression + exact parity."
trigger_phrases:
  - "027/006"
  - "promotion gates"
  - "shadow cycle"
  - "semantic channel"
  - "learned ranking"
  - "accuracy threshold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/007-promotion-gates"
    last_updated_at: "2026-04-20T22:15:00Z"
    last_updated_by: "codex"
    recent_action: "Corrected shipped-state drift and §11 gate bundle scope after post-review remediation"
    next_safe_action: "Use remediation-report.md for review closure"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-scaffold-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 027/006 — Promotion Gates

<!-- SPECKIT_LEVEL: 2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-20 |
| **Parent** | `../` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../006-compat-migration-and-bootstrap/spec.md` |
| **Predecessors** | `../004-native-advisor-core/`, `../005-mcp-advisor-surface/` |
| **Ship SHA** | `5696acf4a` |
| **Post-review remediation** | Parent review `remediation-report.md` adds missing §11 gates in `gate-bundle.ts` |
| **Research source** | `research.md` §6 C6/C8 + §13.4 G5/G6; iterations 021, 023, 054-055 |

## 2. PROBLEM & PURPOSE

### Problem
Research kept semantic and learned ranking channels **shadow-only** (weight 0.00 live) until measured + gated. Without shadow-cycle infrastructure + promotion gates, there's no safe path for those channels to earn live weight. And without ablation/benchmark tooling the 5-lane fusion can't be tuned without regressing safety + latency.

### Purpose
Ship shadow-cycle harness + bounded learned/adaptive live-influence path + strict accuracy/safety/latency promotion gates. Never let semantic or learned ranking cross into live scoring without passing the gates.

## 3. SCOPE

### In Scope
- `lib/promotion/shadow-cycle.ts` — replay 200-prompt corpus through candidate fusion weights / semantic channels without live side effects.
- `lib/promotion/weight-delta.ts` — bounded learned/adaptive live-influence path (max weight delta per promotion = 0.05).
- `lib/promotion/gate-bundle.ts` — promotion gate evaluator checking (full research.md §11 slice bundle):
  - ≥75% full-corpus exact top-1 (higher than 003's 70% baseline)
  - ≥72.5% stratified holdout top-1 (higher than 003's 70% baseline)
  - UNKNOWN fallback count ≤ 10 (preserved from 003)
  - Gold-`none` false-fire count: no increase from baseline
  - Explicit-skill prompts: no top-1/no-abstain regression; derived lane does not displace
  - Ambiguity slice stable: top-2-within-0.05 still renders ambiguous
  - Derived-lane attribution complete on derived-dominant matches
  - Adversarial-stuffing fixture blocked
  - Lifecycle slices (from 027/002 fixtures): supersession redirects correctly, archived skills excluded from default, rolled-back skills stay at schema v1
  - No latency regression (cache-hit p95 ≤50ms; uncached deterministic p95 ≤60ms)
  - Exact parity preservation (from 027/003)
  - Regression-suite gates (existing canonical fixtures stay green; P0 pass 1.0; command-bridge FP ≤0.05)
- Two-positive-shadow-cycles requirement before promotion.
- Semantic live weight locked at 0.00 through first promotion wave.
- `bench/corpus-bench.ts` + `bench/holdout-bench.ts` — corpus + holdout measurement harnesses.
- `bench/latency-bench.ts` — cache-hit + uncached latency harness.
- Handler-backed validation slices in `advisor-validate.ts` — gold-`none`, parity, ambiguity, derived attribution, adversarial-stuffing, regression-suite status.
- Tests under `tests/promotion/**`.

### Out of Scope
- Actual promotion of a semantic lane (that's the follow-on engineering once harness + gates are shipped; no data to promote yet).
- Live learned ranking beyond bounded adaptive (deferred until harness validates safety).
- Changing the initial 5-lane weights from 027/003 — any change gates through this packet.

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. Shadow-cycle harness replays corpus + regression fixtures without touching live state.
2. Weight-delta path capped at 0.05 per promotion.
3. Promotion gate evaluator checks the full 12-gate bundle, including the original 7 criteria plus explicit §11 correctness slices.
4. Two-positive-shadow-cycles rule enforced.
5. Semantic live weight locked at 0.00 (cannot be raised without harness + gate approval).
6. Corpus accuracy harness measures full + holdout top-1.
7. Latency harness measures cache-hit + uncached p95.
8. Safety harness measures gold-`none` false-fire rate.

### 4.2 P1 (Required)
1. Rollback on regression during any gate check.
2. Ablation tooling reused from 027/003.
3. Per-gate result artifacts written for audit.
4. CLI entry point for running promotion evaluation end-to-end.

### 4.3 P2 (Suggestion)
1. Optional batch/benchmark tools (deferred from r01 D3).
2. Historical comparison (track gate results across promotion attempts).

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** Shadow-cycle harness replays corpus; no live state mutation detected.
2. **AC-2** Weight delta >0.05 proposed → rejected at harness input.
3. **AC-3** Promotion attempt meeting all 7 criteria + two positive cycles → gate passes.
4. **AC-4** Promotion attempt failing corpus threshold (74.5% < 75%) → gate fails; clear reason reported.
5. **AC-5** Promotion attempt with regression in gold-`none` count → gate fails.
6. **AC-6** Promotion attempt with cache-hit p95 regression to 55ms → gate fails.
7. **AC-7** Semantic weight raise to 0.01 without gate approval → blocked at weights-config load time.
8. **AC-8** Rollback on regression: proposed weights reverted cleanly, corpus baseline restored.

## 6. FILES TO CHANGE

### New (under `mcp_server/skill-advisor/`)
- `lib/promotion/shadow-cycle.ts`
- `lib/promotion/weight-delta.ts`
- `lib/promotion/gate-bundle.ts`
- `lib/promotion/rollback.ts`
- `bench/corpus-accuracy.ts`
- `bench/latency.ts`
- `bench/safety.ts`
- `tools/advisor-promote.ts` — optional MCP tool for promotion evaluation (may defer)
- `tests/promotion/**`

### Modified
- `lib/scorer/weights-config.ts` (027/003) — harden against unapproved weight changes
