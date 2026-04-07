# Iteration 14 — Per-iter report

## Method
- Cross-referenced `research/iterations/q-d-adoption-sequencing.md` P0/P1 candidates against real `.opencode/` implementation surfaces.
- Counted likely new files, modified files, schema impact, hooks, tests, deps, docs, and integration points.
- Reused iter-13 blockers as adoption gates, then corrected iter-7 sizes only when Public's actual code made the old estimate implausible.
- Recommendation pass deduped R1-R8 against the same candidate set, then reviewed R9/R10 separately.
- Combo pass incorporated iter-12 stress-test verdicts before assigning effort.

## Sizing accuracy

### P0/P1 candidates only
| Iter-7 tier | Accurate | Under-sized | Over-sized | Speculative |
|---|---:|---:|---:|---:|
| S | 8 | 3 | 0 | 0 |
| M | 4 | 2 | 1 | 1 |
| L | 0 | 0 | 0 | 0 |

### Recommendation-only addenda
| Group | Accurate | Under-sized | Over-sized | Speculative |
|---|---:|---:|---:|---:|
| R9-R10 not already covered above | 1 | 0 | 0 | 1 |
| Killer combos | 2 | 0 | 0 | 1 |

## Top mis-sizing surprises
- `Static artifacts as default + MCP as overlay` was materially under-sized. Public already has agent docs, command assets, startup payloads, and transport contracts, so a freshness-safe “static first” layer is architectural, not a small packaging tweak.
- `Runtime FTS capability cascade` was over-sized. Public already ships `memory_fts`, `isFts5Available()`, and a dedicated FTS5 Vitest file, so the remaining work is capability probing and fallback shaping.
- `Benchmark-honest token reporting` was under-sized because the real path crosses telemetry schema, formatter math, envelope metadata, and dashboard publication.
- `Deterministic summary computation at Stop time` was under-sized even though `session_state.context_summary` already exists; the missing work is producer wiring from Stop hook into the shipped session state and startup consumers.
- `Evidence-tagging contract + confidence_score` is not a clean local `M`. The cross-surface contract depends on CocoIndex behavior that is not locally implemented in this checkout.

## Reality-corrected sequencing signal
- Keep as fast wins: graph-first hook, F1 detector harness, `.mcp.json` scaffold, hot-file ranking, AST/regex confidence hardening.
- Reclassify as real medium tracks: honest token reporting, Stop-time summaries, 4-phase consolidation contract, pricing/cache normalization.
- Demote from near-term implementation: static-artifact-first overlay and two-layer cache invalidation.
- Remove from implementation shortlist until redesigned: evidence-tagging cross-surface confidence contract and combo 3 / R10 structural packaging.

## Handoff to iter-15
- Iter-15 should look for pattern clusters behind the under-sized items: “cross-surface trust contract,” “telemetry-to-publication pipeline,” and “startup summary producer/consumer split.”
- The roadmap refresh should explicitly distinguish “substrate already shipped” from “coordination contract missing.” Iter-14 showed Public is rich in primitives but still missing a few shared contracts.
- Combo language should now inherit the corrected costs: Combo 1 and Combo 2 remain viable; Combo 3 should stay falsified/speculative unless the trust axes are separated first.
