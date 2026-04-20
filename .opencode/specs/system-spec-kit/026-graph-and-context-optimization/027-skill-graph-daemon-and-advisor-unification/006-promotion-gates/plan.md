---
title: "027/006 — Plan"
description: "Phased plan for shadow-cycle + promotion gates."
importance_tier: "high"
contextType: "implementation"
---
# Plan: 027/006

## Phases

1. **Contract** — read research.md §6 C6/C8 + §13.4 G5/G6 + iters 021, 023, 054-055.
2. **Shadow-cycle harness** — `lib/promotion/shadow-cycle.ts` replays corpus without live mutation.
3. **Weight-delta cap** — `lib/promotion/weight-delta.ts`; reject proposals > 0.05.
4. **Bench harnesses** — `bench/corpus-accuracy.ts`, `bench/latency.ts`, `bench/safety.ts`.
5. **Gate evaluator** — `lib/promotion/gates.ts` with all 7 criteria.
6. **Rollback** — `lib/promotion/rollback.ts` on regression.
7. **Semantic lock** — ensure `weights-config` from 027/003 rejects semantic weight >0.00 without approval.
8. **CLI entry + tests** — `tools/advisor-promote.ts` (optional) + full test suite under `tests/promotion/`.
9. **Verify** — shadow cycles run clean; simulated promotion attempts hit + miss gate correctly.

## Dispatch

Can run in parallel with 027/005 finalization after 027/003 + 027/004 land.

## Verification

- Shadow cycle replays without state mutation (audit log)
- Weight delta >0.05 rejected
- Gate passes on simulated-good promotion
- Gate fails on each of 4 regression scenarios (corpus, safety, latency, parity)
- Semantic weight raise blocked at config load
- Full vitest suite + TS build green

## Risk mitigations

- **R5** semantic stays shadow-only; only bounded learned/adaptive live first
- **R6** exact parity preservation required at every gate
- **R9** full corpus + holdout + safety + latency + explicit/ambiguous/`UNKNOWN` slices all measured
