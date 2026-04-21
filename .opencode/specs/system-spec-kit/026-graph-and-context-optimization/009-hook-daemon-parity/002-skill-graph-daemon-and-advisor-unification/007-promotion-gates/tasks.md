---
title: "027/006 — Tasks"
description: "Task breakdown for shadow-cycle + promotion gates."
importance_tier: "high"
contextType: "implementation"
---
# 027/006 Tasks

## T001 — Scaffold
- [x] Packet files written

## T002 — Read research + predecessors
- [ ] research.md §6 C6/C8 + §13.4 G5/G6
- [ ] 027/003 + 027/004 implementation-summaries
- [ ] iter files 021, 023, 054-055

## T003 — Shadow-cycle harness (P0)
- [ ] `lib/promotion/shadow-cycle.ts`
- [ ] Replay corpus + regression fixtures without live state mutation
- [ ] Unit tests verifying no side effects

## T004 — Weight-delta cap (P0)
- [ ] `lib/promotion/weight-delta.ts`
- [ ] Reject proposals > 0.05 per promotion

## T005 — Bench harnesses (P0)
- [ ] `bench/corpus-accuracy.ts` — full + holdout top-1
- [ ] `bench/latency.ts` — cache-hit + uncached p95
- [ ] `bench/safety.ts` — gold-none false-fire count

## T006 — Gate evaluator (P0)
- [ ] `lib/promotion/gates.ts` — all 7 criteria
- [ ] Unit tests: pass / fail per criterion

## T007 — Rollback (P1)
- [ ] `lib/promotion/rollback.ts`
- [ ] On regression: revert weights cleanly

## T008 — Semantic lock (P0)
- [ ] Harden 027/003 `weights-config` to reject unapproved semantic weight raise

## T009 — CLI + tests
- [ ] `tools/advisor-promote.ts` (optional — may defer)
- [ ] `tests/promotion/**` full suite

## T010 — Verify
- [ ] Focused suite green
- [ ] TS build clean
- [ ] Simulated promotion: pass case works, 4 fail cases correctly rejected
- [ ] Semantic weight raise blocked at config load
- [ ] Mark checklist.md [x]

## T011 — Commit + push
