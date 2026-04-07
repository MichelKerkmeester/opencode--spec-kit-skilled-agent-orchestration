# Iteration 15 — New Cross-Phase Patterns

> Patterns spanning 3+ phases that were NOT surfaced by Q-A through Q-F.

## TL;DR
- Four new cross-phase patterns held up after the iter-9 through iter-14 reread.
- The strongest recurring failure mode is not "missing capability"; it is weak uncertainty handling that gets upgraded into crisp labels, scores, and prices.
- Multiple phases validate local mechanics while leaving the claimed user-visible outcome untested.
- Cached/static context surfaces repeatedly arrive before freshness and authority contracts are made explicit.
- After iter-13/14, the expensive work cluster is boundary-contract debt, not missing parser/hook substrate.
- Iter-17 should add these as a new cross-phase section and promote at least the first, second, and fourth into new registry entries.

## Pattern 1 — Precision laundering at the presentation layer

### Span
| Phase | Evidence | Citation |
| 001 | One observed schema-payload delta is extrapolated into `14,000` tokens per turn and `264 million` tokens, even though the same post also carries unreconciled session/turn denominators. | [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:22-24] [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:36-46] |
| 002 | The Go path is explicitly brace-tracking plus regex, but emitted routes are still labeled `confidence: "ast"`. | [SOURCE: 002-codesight/external/src/ast/extract-go.ts:1-7] [SOURCE: 002-codesight/external/src/ast/extract-go.ts:168-196] |
| 003 | `saved` and `net` are rendered from two fixed `25000` constants, then formatted as `~saved` / `~net` operational metrics. | [SOURCE: 003-contextador/external/src/lib/core/stats.ts:26-27] [SOURCE: 003-contextador/external/src/lib/core/stats.ts:75-101] |
| 004 | Export fills in `confidence_score` from hard-coded defaults (`1.0`, `0.5`, `0.2`) whenever the link lacks a real score. | [SOURCE: 004-graphify/external/graphify/export.py:250-275] |
| 005 | Unknown models fall back to Sonnet pricing, unclassified cache creation is priced heuristically, and thinking tokens are estimated from text length. | [SOURCE: 005-claudest/external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py:72-96] [SOURCE: 005-claudest/external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py:492-496] |

### Why it's not Q-A through Q-F
- Closest prior lanes: Q-A and iter-12 Combo 3.
- Distinctness: Q-A audited token-savings honesty, and Combo 3 focused on one trust-vocabulary collision. This pattern is broader: five phases repeatedly turn partial evidence into presentation-grade precision across token counts, provenance labels, confidence scores, and pricing outputs.

### What it implies for Public
- Add an explicit uncertainty contract to every exported metric and label: `exact`, `estimated`, `defaulted`, or `unknown`.
- Ban silent precision upgrades in formatters and dashboards; missing confidence/pricing should stay visibly missing.
- Treat provenance labels and confidence labels as separate axes end-to-end, never as interchangeable scalar polish.

### Falsification test
- This pattern is wrong if the compared systems already preserve uncertainty metadata end-to-end and their renderers never invent stronger labels or scores than the producer emitted.

## Pattern 2 — Outcome claims are validated one seam too early

### Span
| Phase | Evidence | Citation |
| 001 | The safe claim had to be narrowed to upfront payload reduction because there is still no matched first-tool ergonomics benchmark. | [SOURCE: research/iterations/q-a-token-honesty.md:32-38] |
| 002 | The eval harness scores routes/models/components/env/middleware only; blast-radius behavior and token-savings claims remain outside the tested lane. | [SOURCE: 002-codesight/external/src/eval.ts:97-142] [SOURCE: research/iterations/gap-reattempt-iter-10.json:236-247] |
| 003 | The `93%` story still has no paired benchmark against Public's typed stack on frozen tasks; the instrumentation stops at internal counters and arithmetic. | [SOURCE: research/iterations/q-a-token-honesty.md:58-64] |
| 004 | The Graphify hook path is implemented and tested for install/idempotence/uninstall, but iter-10 still found no telemetry or before/after evidence that behavior changes. | [SOURCE: research/iterations/gap-reattempt-iter-10.json:392-418] |
| 005 | The cached-summary fast path is still framed with a falsification plan because the packet has no demonstrated with/without startup benchmark proving the claimed benefit. | [SOURCE: research/iterations/q-a-token-honesty.md:82-90] |

### Why it's not Q-A through Q-F
- Closest prior lane: Q-A.
- Distinctness: Q-A asked whether token claims are honest. This pattern is wider: structural accuracy claims, hook-effect claims, and continuity-speed claims all stop at local mechanical validation instead of the end-to-end user outcome they are used to justify.

### What it implies for Public
- Add seam-level verification harnesses: `baseline vs enabled` runs at the exact boundary where a claim is made.
- Score the claimed user outcome, not just the local mechanism: routing correctness, follow-up count, startup recall quality, or behavior change.
- Treat "implemented + unit-tested" as insufficient for synthesis-level adoption unless the outward claim also has a matching benchmark lane.

### Falsification test
- This pattern is wrong if the relevant phases already contain with/without experiments at the exact claim boundary, not just local parser, installer, or formatter tests.

## Pattern 3 — Durable context is introduced before freshness authority is specified

### Span
| Phase | Evidence | Citation |
| 002 | Generated profiles instruct agents to read `.codesight/CODESIGHT.md` first and use live MCP queries second, creating a static-first authority path without an explicit freshness contract. | [SOURCE: 002-codesight/external/src/generators/ai-config.ts:171-214] [SOURCE: 002-codesight/external/src/generators/ai-config.ts:236-240] |
| 004 | The PreToolUse hook only helps when `graphify-out/graph.json` already exists; iter-12 showed that a fresh graph at session start is a hidden prerequisite, otherwise the hook adds indirection. | [SOURCE: 004-graphify/external/graphify/__main__.py:9-21] [SOURCE: research/iterations/combo-stress-test-iter-12.md:19-25] |
| 005 | The summary fast path is explicitly lossy, startup selection only searches the latest 20 root sessions and first substantive match, and `/clear` handoff expires after 30 seconds. The cache can start warm but wrong. | [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py:251-274] [SOURCE: 005-claudest/external/plugins/claude-memory/hooks/memory-context.py:51-62] [SOURCE: 005-claudest/external/plugins/claude-memory/hooks/memory-context.py:150-160] [SOURCE: 005-claudest/external/plugins/claude-memory/hooks/memory-context.py:218-250] |

### Why it's not Q-A through Q-F
- Closest prior lanes: Q-C and Q-F Combo 1.
- Distinctness: Q-C only marked invalidation/freshness work as a candidate risk, and Q-F stress-tested one specific combo. This pattern is broader and earlier: three different phase designs introduce durable summaries or artifacts before they define freshness, authority, and stale-state handling tightly enough.

### What it implies for Public
- Every durable artifact needs visible authority metadata: producer, timestamp/epoch, scope, and invalidation rule.
- Never ship "read this first" static guidance without a paired stale-state fallback and freshness check.
- Make freshness a first-class contract across startup summaries, graph artifacts, and static context files before adopting more artifact-first UX.

### Falsification test
- This pattern is wrong if these durable surfaces already carry explicit freshness/authority metadata and their consumers reliably reject stale or partial state instead of trusting it by default.

## Pattern 4 — Cost spikes at contract seams, not inside owner surfaces

### Span
| Phase | Evidence | Citation |
| 002 | `Static artifacts as default + MCP as overlay` moved from `M` to `L` once iter-14 accounted for freshness/versioning and prompt-surface consumers. | [SOURCE: research/iterations/cost-reality-iter-14.md:7-8] [SOURCE: research/iterations/cost-reality-iter-14.md:445-446] |
| 003 | `Benchmark-honest token reporting` moved from `S` to `M` because the real work spans token metrics, `consumption_log`, envelopes, and dashboard rollups rather than one small reporting patch. | [SOURCE: research/iterations/cost-reality-iter-14.md:8-8] [SOURCE: research/iterations/cost-reality-iter-14.md:442-442] |
| 004 | The main blockers are contract artifacts, not missing raw substrate: cross-surface confidence schema, shared invalidation ledger, and stable interchange artifact. Evidence-tagging remains speculative until those exist. | [SOURCE: research/iterations/public-infrastructure-iter-13.md:9-9] [SOURCE: research/iterations/cost-reality-iter-14.md:10-10] [SOURCE: research/iterations/cost-reality-iter-14.md:323-330] |
| 005 | `Deterministic summary computation at Stop time` and `4-phase consolidation contract` both re-tiered upward because the expensive work is producer-consumer wiring and workflow contracts; `Dashboard JSON contracts` are mostly packaging over already-shipped telemetry. | [SOURCE: research/iterations/cost-reality-iter-14.md:8-8] [SOURCE: research/iterations/cost-reality-iter-14.md:443-444] [SOURCE: research/iterations/public-infrastructure-iter-13.md:179-179] |

### Why it's not Q-A through Q-F
- Closest prior lane: Q-D adoption sequencing.
- Distinctness: Q-D ordered candidates before iter-13/14 revisited Public's real substrate and effort. This pattern is the newer cross-phase insight: once the substrate was inventoried, the hard work concentrated at boundary contracts and interchange semantics, not at missing parsers, hooks, or DB primitives.

### What it implies for Public
- Plan v2 as a boundary-contract program first: interchange artifact, cross-surface confidence schema, invalidation ledger, and canonical persisted summary artifact.
- Reclassify "small wins" that cross multiple producers/consumers as medium or large by default.
- Prefer candidate bundles that stay inside one owner surface unless the shared contract is funded explicitly.

### Falsification test
- This pattern is wrong if the high-value remaining candidates mostly need new substrate rather than cross-surface contracts, or if later cost evidence shows the boundary work was overestimated.

## Patterns considered but rejected
- Monolithic scan/bootstrap pressure: rejected because Q-C and `F-CROSS-057` already captured it directly.
- Publish token-savings headlines only from frozen, quality-gated tasks: rejected because Q-A and `F-CROSS-055` already own that rule.
- Warm-start memory plus graph-first routing is the top combo: rejected because Q-F and `F-CROSS-060` already established it.
- AGPL/Bun as decisive Contextador gates: rejected because Q-E and `F-CROSS-059` already cover it.
- Public moat inventory: useful, but rejected here because it is a baseline-preservation lens, not a 3+ phase external pattern.

## Recommendations for v2

- Iter-17 should add new finding-registry entries for Pattern 1, Pattern 2, and Pattern 4.
- Iter-17 should add a new `research.md` section after the combo analysis, e.g. `§11 New cross-phase patterns`, then fold the current confidence statement downward.
- Pattern 3 should be integrated into that new section even if it is not promoted to a standalone registry entry; it is a strong design-direction warning for artifact-first UX.
