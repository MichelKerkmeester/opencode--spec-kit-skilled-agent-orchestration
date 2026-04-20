---
title: "027/003 — Tasks"
description: "Task breakdown for native advisor core + parity harness."
importance_tier: "high"
contextType: "implementation"
---
# 027/003 Tasks

## T001 — Scaffold
- [x] Packet files written

## T002 — Read research + predecessor outputs
- [ ] research.md §6 + §13.4 + Y2/Y3
- [ ] 027/001 + 027/002 implementation-summaries
- [ ] iter files 016-020, 022, 050-053, 057-058

## T003 — File migration (P0)
- [ ] Move 11 files from `mcp_server/lib/skill-advisor/` → `mcp_server/skill-advisor/lib/`
- [ ] Update all imports
- [ ] Existing 65-test suite still green

## T004 — Weights config (P0)
- [ ] `lib/scorer/weights-config.ts` with Zod schema
- [ ] Named constants: 0.45 / 0.30 / 0.15 / 0.10 / 0.00

## T005 — Per-lane scorers (P0)
- [ ] `lib/scorer/lanes/explicit.ts`
- [ ] `lib/scorer/lanes/lexical.ts`
- [ ] `lib/scorer/lanes/graph-causal.ts`
- [ ] `lib/scorer/lanes/derived.ts`
- [ ] `lib/scorer/lanes/semantic-shadow.ts`

## T006 — Projection + fusion (P0)
- [ ] `lib/scorer/projection.ts`
- [ ] `lib/scorer/fusion.ts` (analytical, capped, attributed)

## T007 — Ambiguity + attribution (P1)
- [ ] `lib/scorer/ambiguity.ts`
- [ ] `lib/scorer/attribution.ts`

## T008 — Ablation protocol (P0)
- [ ] `lib/scorer/ablation.ts`
- [ ] CLI entry point for per-lane disable

## T009 — Parity harness (P0)
- [ ] `tests/parity/python-ts-parity.vitest.ts`
- [ ] 200-prompt corpus + regression fixtures loaded
- [ ] Exact per-prompt top-1 + pass-threshold match

## T010 — Bench (P1)
- [ ] `bench/scorer-bench.ts`
- [ ] Cache-hit ≤50ms, uncached ≤60ms

## T011 — Integration with 002 fixtures (P0)
- [ ] Lifecycle fixtures consumed in parity harness

## T012 — Verify
- [ ] Full suite green
- [ ] Parity green (200/200)
- [ ] Bench meets gates
- [ ] Mark checklist.md [x]

## T013 — Commit + push
