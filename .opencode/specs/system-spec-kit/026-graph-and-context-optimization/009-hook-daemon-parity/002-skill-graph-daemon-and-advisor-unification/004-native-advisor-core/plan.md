---
title: "...text-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core/plan]"
description: "Phased implementation plan for native advisor core + parity harness."
trigger_phrases:
  - "text"
  - "optimization"
  - "009"
  - "hook"
  - "daemon"
  - "plan"
  - "004"
  - "native"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Plan: 027/003

## Phases

1. **Contract** — read research.md §6 + §13.4 + Y2/Y3. Inventory `mcp_server/lib/skill-advisor/*.ts` vs target `mcp_server/skill-advisor/lib/`.
2. **File migration** — move 11 lib/skill-advisor/*.ts files to new location; update imports; existing 65-test suite must stay green.
3. **Weights config** — `lib/scorer/weights-config.ts` + Zod schema.
4. **Per-lane scorers** — implement 5 lanes as separate modules.
5. **Projection + fusion** — `projection.ts` + `fusion.ts` (analytical, capped, attributed).
6. **Ambiguity + attribution** — top-2-within-0.05 rule + lane attribution in brief metadata.
7. **Ablation protocol** — `ablation.ts` + CLI entry point.
8. **Parity harness** — `tests/parity/python-ts-parity.vitest.ts` vs 200-prompt corpus + regression fixtures.
9. **Bench** — `bench/scorer-bench.ts` cache-hit + uncached p95.
10. **Integration with 002 fixtures** — lifecycle fixtures consumed in parity harness.
11. **Verify** — full suite + bench + parity green.

## Dispatch

Single `/spec_kit:implement :auto` after 027/001 + 027/002 both land.

## Verification

- Migration verify: 65-test baseline still passes after file moves
- Parity: 200/200 per-prompt top-1 + pass-threshold agreement
- Bench: cache-hit ≤50ms, uncached deterministic ≤60ms
- Ablation: each lane disable measurably changes corpus accuracy
- TS build clean

## Risk mitigations

- **R3** trust-lane separation honored in fusion
- **R5** semantic-shadow weight locked at 0.00
- **R6** parity harness as gate before promotion
- **R9** lifecycle fixtures in parity coverage
