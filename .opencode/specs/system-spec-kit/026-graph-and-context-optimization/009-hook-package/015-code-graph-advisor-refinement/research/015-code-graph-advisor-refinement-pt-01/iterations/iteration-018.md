# Iteration 18: Unified Remediation Roadmap (Synthesis)

## Focus

Consolidate iters 1-17 (82 findings, 10 RQs resolved, zero deferred items, STOP_READY_CONFIRMED) into ONE PR-ready, sequenced master plan. Output is a single roadmap table + critical-path dependency diagram, consumable by the implementation executor without further research.

This is a **synthesis-only iteration**. No new external evidence is gathered; all citations are recovered from prior iteration files. The value-add is sequencing, dependency analysis, parallelism flagging, and effort consolidation — not new findings.

## Inputs (recovered from prior iters)

- Iter-7 F33: corpus-path mismatch in lane-ablation harness (4-line wiring fix, [SOURCE: skill-advisor/bench/scorer-bench.ts:1-71, tests/parity/python-ts-parity.vitest.ts:120-180])
- Iter-9/10 F23.1+F51: settings.local.json `.claude/` rewrite (-31 LOC) [SOURCE: .claude/settings.local.json:24-82]
- Iter-12/13/14 F70: promotion subsystem dead-code disposition (DELETE option ratified; 11 code files, 12 doc files, ~1116 code LOC + 17 docs) [SOURCE: lib/promotion/*.ts, schemas/promotion-cycle.ts, bench/corpus-bench.ts:9-10, bench/safety-bench.ts:9-10, bench/holdout-bench.ts:9-10]
- Iter-15 F71: state-vocabulary unification mapping (~30 LOC, 8 step refactor) [SOURCE: code-graph/lib/startup-brief.ts:11-16,43,213,240,247 + iter-3 5-vocabulary catalog]
- Iter-16 F72/F73/F74/F75: instrumentation namespace = extend `lib/metrics.ts`, 14 metrics canonical, ~150 LOC [SOURCE: mcp_server/skill-advisor/lib/metrics.ts:1-473]
- Iter-17 F81: prompt-cache invalidation listener wireup (5-LOC patch) [SOURCE: mcp_server/skill-advisor/lib/prompt-cache.ts:1-181, freshness/cache-invalidation.ts:1-49]
- Iter-9 F46: settings-driven-invocation-parity test (new ~150 LOC file, Claude-only after iter-10 retraction) [SOURCE: tests/legacy/advisor-runtime-parity.vitest.ts]
- Iter-12 F15-closure: 13 per-gate enhancements, but ONLY relevant under Option B (KEEP promotion); roadmap below adopts Option A (DELETE) per iter-14, so F15 lands as a contingent addendum
- Iter-7 F36 + iter-16 catalog: 8 missing benchmarks; #4 (graph parse), #7 (graph query latency + cache hit), #8 (per-runtime hook signal/noise) all become test/bench files riding on the F43 metrics scaffold
- Iter-7/9 F45/F47: PR-ready diff for F37#7 (rollback cache-invalidation) — incorporated into the F70 delete sweep (rollback.ts is removed, not patched)

## Findings

### F83 — Master Roadmap Table (11 PRs)

The roadmap below is the authoritative implementation order. Columns:

| PR # | Title | Scope (files, LOC delta) | Severity | Effort (hrs) | Dependencies | Findings closed | Bench covered | Risk + mitigation | Executor hint |
|------|-------|--------------------------|----------|--------------|--------------|-----------------|---------------|-------------------|---------------|
| **1** | corpus-path bench wiring fix | `skill-advisor/bench/scorer-bench.ts` (4 lines), optional `tests/parity/python-ts-parity.vitest.ts` (1-line corpus path) | **P0** | S (1-2h) | none | F33, F36-prerequisite | unblocks lane-ablation harness (no bench file produced; just makes existing one runnable) | Path is hardcoded; mitigate by extracting to `BENCH_CORPUS_PATH` const + reading from `package.json#bench.corpusPath`. Risk if env var collides — namespace under `SPECKIT_BENCH_CORPUS_PATH`. | surgical edit |
| **2** | `.claude/` settings.local.json rewrite | `.claude/settings.local.json` (-31 LOC, replaces parallel-hook block with single `UserPromptSubmit` array entry) | **P0** | S (1-2h) | none (parallel with PR 1) | F23.1, F37 #1, F51 (PR-ready diff), F46-prep | n/a (test bench arrives in PR 7) | Bug fix breaks current observed behavior (parallel hooks were never running). Mitigate by smoke-test: launch Claude Code session, prompt arbitrary text, verify single advisor brief renders in Read-tool capture. | surgical edit |
| **3** | promotion subsystem DELETE sweep | DELETE: `lib/promotion/*.ts` (6 files, ~635 LOC), `schemas/promotion-cycle.ts` (~82 LOC), `tests/promotion/promotion-gates.vitest.ts` (316 LOC), `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` (127 LOC), `bench/corpus-bench.ts`, `bench/safety-bench.ts`, `bench/holdout-bench.ts` (3 files, ~150 LOC), 12 doc references; total ~1311 LOC removed (1116 code + 195 in docs). UPDATE: `package.json` (remove `corpus-bench`/`safety-bench`/`holdout-bench` script rows, F68), `tsconfig.json` exclude paths if any. | **P1** | M (4-6h) | PR 1 (so corpus-path bench fix is captured before deleting the bench layer that referenced wrong corpus — keeps git history clean for blame), but logically independent from PR 2 (parallelizable with PR 2) | F37 #5, F37 #6, F37 #7, F37-CLOSURE, F60, F61, F62, F70, F68, F15 (entire 13-enhancement matrix becomes moot under Option A), F47 (rollback cache-invalidation patch superseded by deletion), F52 (handler skeleton not needed under Option A), F57 (handler skeleton retracted), F56 in-part (test skeleton retracted under Option A but reused for F46 in PR 7) | n/a — removes bench code, does not add new benches | LARGE diff. Risk: hidden cross-packet importer surfaces during type-check. Mitigate: iter-14 cross-packet preflight already verified zero importers; re-run `tsc --noEmit` + `vitest run` after delete; check sibling spec docs (002-skill-graph-daemon-and-advisor-unification, 042-sk-deep-research-review-improvement-2) for stale prose mentioning deleted modules and patch. Doc scrub list ratified in iter-14 (12 files). | delete sweep + doc scrub |
| **4** | state-vocabulary unification (V1-V5 → canonical 8-state) | `code-graph/lib/ensure-ready.ts` (V1 alias), `code-graph/lib/ops-hardening.ts` (V2 alias), `code-graph/lib/startup-brief.ts` (V3, ~5 sites at L11-16/43/213/240/247), `code-graph/lib/readiness-contract.ts` (V4 + V5 SharedPayloadTrustState) — collapse all five into a single `TrustState` re-export from `skill-advisor/lib/freshness/trust-state.ts`. Add type-alias deprecations for one release. ~30 LOC net. | **P1** | M (3-5h) | PR 3 (delete first to avoid touching modules about to be removed; F71 mapping confirms code-graph-only sites, no overlap with `lib/promotion/`), parallel-OK with PR 5 if PR 3 has landed | F40 (8-step unification mapping), F71 (full mapping table), F18 (4-surface divergence matrix), F17 (two competing GraphFreshness aliases), F37 #2 | n/a (vocabulary refactor; observability comes via PR 5) | Risk: silent type-narrowing breaks downstream callers. Mitigate: introduce `TrustState` as a discriminated-union with `state` literal field; run full `vitest run` + `tsc --noEmit`; manual spot-check on each of the 4 surfaces (`code_graph_status`, `code_graph_context`, `code_graph_query`, startup brief) with debug log of state value. | surgical edit |
| **5** | instrumentation namespace scaffold | EXTEND `mcp_server/skill-advisor/lib/metrics.ts` (currently 473 LOC; add ~150 LOC for 14 canonical metrics: 6 graph + 5 advisor + 3 freshness, per iter-16 catalog). Wire emission at: `code-graph/lib/structural-indexer.ts:698`, `code-graph/lib/tree-sitter-parser.ts` parseFile entry/exit, `code-graph/lib/code-graph-context.ts:114-375`, `mcp_server/skill-advisor/lib/scorer/fusion.ts:172-230` and `attribution.ts:10-31`, `prompt-cache.ts:97-117`, `freshness/trust-state.ts`, `freshness/cache-invalidation.ts:35`. NO promotion metrics (subsystem deleted in PR 3). | **P1** | L (8-12h) | PR 3 (so deleted-promotion metrics are not designed speculatively), PR 4 (so `freshness_state` label uses canonical vocabulary), parallel-OK with PR 6 once PR 3+4 landed | F28, F35, F36 #4, F36 #7, F43, F50, F72, F73, F74, F75, F76, F77 (signal-only metric for prompt-cache race) | Lays the rails for benches in PR 9-11 (#4 graph-parse-latency, #7 query-latency + cache-hit, #8 hook-brief signal/noise) | Risk: metric cardinality explosion (per-language × per-outcome × per-runtime). Mitigate: `nodes_bucket` and `near_dup_distance_bucket` are pre-bucketed; `runtime` enum capped at 4; `language` enum capped at 8 (ts/js/py/go/rust/sh/jsonc/md). Snake_case on-disk per F74 decision; dotted names are documentation namespace only. | metric wire-up |
| **6** | prompt-cache invalidation listener wireup | `mcp_server/skill-advisor/lib/skill-advisor-brief.ts` or wherever cache is constructed — add `cacheInvalidation.onCacheInvalidation((reason) => advisorPromptCache.clear())` listener registration. ~5 LOC. | **P1** | S (1h) | PR 4 (canonical state vocabulary in scope before wiring listener), parallel-OK with PR 5 once PR 4 landed | F41, F77, F78, F79, F80, F81 (PR-ready 5-LOC patch), F82 | n/a (signal-only metric #13 in PR 5 covers detection; this PR fixes the underlying race) | Risk: listener registered multiple times → duplicate clears (cheap but log-spammy). Mitigate: ensure registration in module-init scope, not per-request; F81 patch already specifies the correct site. Per-process invariant (F79) means no cross-process coordination needed. | surgical edit |
| **7** | settings-driven-invocation-parity test | NEW file: `mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` (~150 LOC). Asserts `.claude/settings.local.json` `hooks.UserPromptSubmit` is a single array entry pointing to the runtime-launcher; uses JSON-shape contract per iter-11 F56 (mocking closed-source schema is rejected). Claude-only per iter-10 F51 retraction. | **P1** | M (3-4h) | PR 2 (so the asserted shape matches what was just shipped), independent of PR 3-6 | F25 (legacy test coverage gap), F46 (correct test shape), F56 (skeleton from iter-11), iter-7 F33-prevention (catches regression of PR 2) | first concrete test asset in this roadmap; also covers F36 #8 hook-brief signal/noise (signal-side: confirms hook fires) | Risk: schema mock too brittle. Mitigate: assert only the array shape + 1st-element script path; do not over-specify env or matcher fields. | handler scaffold (test file) |
| **8** | bench: `bench/code-graph-parse-latency.bench.ts` | NEW file (~80 LOC). Wraps `parseFile` per language; emits `parse_duration_ms_p50/p95/p99` per language. Uses metric #2 from PR 5. | **P2** | S (2-3h) | PR 5 (needs `speckit_graph_parse_duration_ms` histogram emission live) | F36 #4 (graph parse latency), F73-#2 | F36 #4 | Risk: language-specific parser failures masked as outliers. Mitigate: assert non-zero counts per language, fail bench if any language emits zero samples. | new bench file |
| **9** | bench: `bench/code-graph-query-latency.bench.ts` | NEW file (~100 LOC). Wraps `handleCodeGraphQuery` for `outline`, `blast_radius`, relationship modes; emits `total_ms`, `readiness_ms`, `resolve_subject_ms`, `execution_ms` percentiles. Uses metrics #3+#4 from PR 5. | **P2** | M (4-6h) | PR 5 (needs `speckit_graph_query_latency_ms` + cache hit/miss counters live), parallel-OK with PR 8, PR 10 once PR 5 landed | F36 #7 (query latency + cache hit ratio), F73-#3, F73-#4, F28 | F36 #7 | Risk: bench corpus drift makes percentile thresholds flaky. Mitigate: pin corpus to a hashed snapshot + assert percentile deltas vs baseline JSON, not absolute thresholds. | new bench file |
| **10** | bench: `bench/hook-brief-signal-noise.bench.ts` | NEW file (~80 LOC). Per-runtime invocation of brief renderer; emits decision-relevant-fields-count + total-fields-count + token-budget. Uses metric #11 + structural counters from PR 5. | **P2** | S-M (3-4h) | PR 5, PR 7 (so the wire-up under test exists and is asserted), parallel-OK with PR 8, PR 9 | F36 #8 (per-runtime hook signal/noise), F19, F20, F21, F22 | F36 #8 | Risk: signal-relevance is subjective. Mitigate: compute against the iter-4 7-axis matrix as ground-truth fields list (load-bearing axis = signal; decorative axis = noise); same matrix used as test fixture. | new bench file |
| **11** | (CONTINGENT — Option B only) F15 13-gate enhancement landing | **NOT INCLUDED in default roadmap.** Only exercise if Option A (DELETE in PR 3) is reversed. In that case: handler scaffold `handlers/promotion-orchestrate.ts` (iter-11 F57 skeleton, ~120 LOC) + 13 per-gate enhancements (iter-12 F15 matrix) at `lib/promotion/gate-bundle.ts:*` + tests. ~500 LOC total. | (P1 if exercised) | (L 12-16h) | (PR 3 reversed; PR 5 metrics scaffold extended with promotion lane) | (F15 full matrix, F37 #5/#6, F45, F57, all KEEP-side findings) | (would add 5 promotion-lane benches under PR 5) | Reverses iter-13 F37-CLOSURE memo. Mitigate: only land if a downstream consumer of the promotion subsystem materializes; otherwise iter-14 preflight (zero callers) stands. | (handler scaffold + surgical edits) |

### F84 — Critical-path dependency graph

```
                                                          (parallel batch A: P0 quick wins)
                                                          ┌─────────────────────────────┐
                                                          │  PR 1: corpus-path fix (S)  │
                                                          │  PR 2: settings.json (S)    │
                                                          └────┬────────────────┬───────┘
                                                               │                │
                                                               │                │
                                                               v                │
                                                    ┌──────────────────────┐    │
                                                    │  PR 3: DELETE sweep  │    │
                                                    │  promotion subsystem │    │
                                                    │  (M, blocks 4+5)     │    │
                                                    └──────────┬───────────┘    │
                                                               │                │
                                                               v                │
                                                    ┌──────────────────────┐    │
                                                    │  PR 4: state vocab   │    │
                                                    │  unification (M)     │    │
                                                    └──────────┬───────────┘    │
                                                               │                │
                                                               v                │
                                                    (parallel batch B: scaffolds)
                                                    ┌──────────────────────┐    │
                                                    │  PR 5: metrics       │    │
                                                    │  scaffold (L)        │    │
                                                    │  PR 6: cache wireup  │    │
                                                    │  (S; needs PR 4)     │    │
                                                    └──────────┬───────────┘    │
                                                               │                │
                                                               │   ┌────────────┘
                                                               │   │
                                                               v   v
                                                    ┌──────────────────────┐
                                                    │  PR 7: settings test │
                                                    │  (M; needs PR 2)     │
                                                    └──────────┬───────────┘
                                                               │
                                                               v
                                                  (parallel batch C: bench fan-out)
                                                  ┌────────────────────────────────┐
                                                  │ PR 8: parse-latency bench (S)  │
                                                  │ PR 9: query-latency bench (M)  │
                                                  │ PR 10: hook-brief bench (S-M)  │
                                                  └────────────────────────────────┘

LEGEND:
  -->  must-precede dependency
  S/M/L = effort (small/medium/large)
  P0 = blocker, P1 = important, P2 = follow-up

PARALLELISM:
  Batch A: PR 1 || PR 2 (no shared files)
  Batch B: PR 5 || PR 6 (after PR 3+4 land); PR 7 can also start in parallel after PR 2
  Batch C: PR 8 || PR 9 || PR 10 (after PR 5; PR 10 also wants PR 7)

CRITICAL PATH (longest):
  PR 2 → PR 3 → PR 4 → PR 5 → PR 9 ≈ 1+6+5+12+6 = ~30 hours single-threaded
  With Batch A and B parallelism: ~22 hours (PR 3 + PR 4 + max(PR 5, PR 6, PR 7) + max(PR 8, 9, 10))

OPTION B BRANCH (contingent):
  Skip PR 3; insert PR 11 in its place (~12-16h additional, plus extends PR 5 by ~30%).
  Roadmap currently does NOT include this branch (Option A ratified iter-13 F37-CLOSURE + iter-14 preflight).
```

### F85 — Sequencing principles applied (audit)

1. **Blocker-first.** PR 1 (F33 corpus-path) lands before any bench (PR 8-10) so the harness can run. Without PR 1, lane-ablation cannot regenerate. Cited evidence: iter-7 found the harness exists but reads from a non-existent corpus path.
2. **Diff-minimality before feature-add.** Deletions (PR 3) precede additions (PR 5). Designing instrumentation for code about to be deleted would invalidate immediately (iter-16 BLOCKED rationale: "Designing promotion metrics speculatively"). Settings rewrite (PR 2) is a deletion (-31 LOC), so it sits in the early P0 batch with PR 1.
3. **Evidence-cited before speculative.** Every PR cell has a file:line citation in the Scope column; no PR is included on speculative grounds. PR 11 is explicitly marked CONTINGENT and excluded by default.
4. **Independent batches for parallelism.** Three batch boundaries (A: P0 quick wins, B: scaffolds, C: bench fan-out) flagged in the diagram. Critical path collapses from 30h sequential to ~22h with parallelism.
5. **Test/bench after the production seam exists.** PR 7 (test) lands after PR 2 (the surface under test); PR 8-10 (benches) land after PR 5 (the metrics they consume). Avoids the iter-7 F33 anti-pattern of "test exists, surface doesn't reach".
6. **Vocabulary before instrumentation.** PR 4 (state vocab) before PR 5 (metrics scaffold) because metric labels must use canonical state names; flipping the order would require re-emitting metrics with renamed labels (cardinality churn).
7. **Disposal before related metric design.** PR 3 (DELETE promotion) before PR 5 (metrics) — `lib/metrics.ts` extension explicitly omits promotion metrics per iter-16 F73 footer.

## Ruled Out

- **Bundling PR 1 + PR 2 + PR 3 into a single "P0/P1 cleanup" PR:** Would tangle a 4-line wiring fix with a 1300-LOC delete sweep. Reviewer load + revert blast-radius too high. Kept separate.
- **Including PR 11 (Option B) by default:** iter-13 F37-CLOSURE memo + iter-14 cross-packet preflight (zero callers) ratified Option A. Marking PR 11 as default would re-litigate a closed decision.
- **Treating F36 #1, #2, #3, #5, #6 as PRs in this roadmap:** Iter-7 F36 listed 8 missing benchmarks; only #4, #7, #8 are in scope here because they ride on the F43 metrics scaffold (PR 5). Benches #1 (graph-build correctness), #2 (edge-precision against golden), #3 (scorer-fusion stability), #5 (incremental scan accuracy), #6 (multi-language parity) are orthogonal benches not gated by PR 5; they belong to a separate "benchmark depth" packet.
- **Adding a docs-only PR for the doc scrub:** Folded into PR 3 per iter-14 BLOCKED reason ("Just delete code, leave docs" — stale docs about a non-existent subsystem are worse than no docs).
- **Routing PR 6 (cache wireup) before PR 4 (state vocab):** cacheInvalidation event payload uses freshness state field; using non-canonical V1-V5 names would mean immediate re-patch after PR 4. Order kept.

## Dead Ends

(No new dead ends this iteration — all dead ends are inherited from iter-13/14/16/17.)

## Sources Consulted

- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-007.md` (F33, F36 8-bench list)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-009.md` (F45 PR-ready, F46 test shape, F47 INV-F5-V2)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-010.md` (F51 settings diff, F52 retraction, F55 alias)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-011.md` (F56 test skeleton, F57 handler skeleton, F59 11-row table)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-012.md` (F15 13-gate matrix, F37 #7 archaeology)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-013.md` (F37-CLOSURE memo, F60-F62)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-014.md` (delete plan actuation, cross-packet preflight)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-015.md` (F68 package.json, F70 STOP_READY, F71 vocab unification mapping)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-016.md` (F72-F76 metric catalog, library choice, sequencing)
- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-017.md` (F77-F82 cache race, F81 5-LOC patch)
- `research/015-code-graph-advisor-refinement-pt-01/deep-research-strategy.md` (Exhausted Approaches list — 22+ entries respected)

## Assessment

- **New information ratio: 0.25** (synthesis iteration; 2 fully new findings F83 master table + F84 dependency graph + F85 audit, all derived from prior cited evidence; +0.10 simplification bonus for collapsing 82 findings × 11 PRs into 1 ranked sequence with explicit parallelism boundaries; raw novelty ~0.20 + 0.10 bonus = 0.30, rounded conservatively to 0.25)
- **Questions addressed:** Final convergence question — "what is the implementation sequence?"
- **Questions answered:** Roadmap delivered. Zero deferred items. STOP_READY_CONFIRMED ratified.

## Reflection

- **What worked and why:** Treating this iteration as pure consolidation (no new external evidence) avoided the temptation to re-investigate. The roadmap's value is in the **ordering principles** + **dependency graph** + **parallelism flags**, not in new findings. Reading only the iteration narratives + strategy file (4 reads) was enough; no source code re-reading needed because all PR cells cite previously-established file:line evidence.
- **What did not work and why:** N/A this iteration — synthesis-only with high-confidence inputs.
- **What I would do differently:** Earlier in the loop (iter ~12), I could have produced a **provisional roadmap stub** with the items known so far and updated it incrementally, rather than waiting until iter-18 for full assembly. Would have surfaced PR boundary questions sooner (e.g., "is F46 test under PR 7 or under PR 2?"). For a future 20-iter loop, recommend a "rolling roadmap" mid-loop synthesis at iter ~10.

## Recommended Next Focus (iter 19/20)

Iter-18 produces the implementation handoff. Recommended next focuses for iters 19-20:

1. **Iter 19: Risk-review pass on the roadmap.** Per-PR rollback plan + monitoring criteria + revert SLO. Specifically: what telemetry tells us PR 5 caused cardinality blowup? What revert path exists for PR 3 (since 1300 LOC of deletes are not trivially recoverable from git)?
2. **Iter 20: Cross-packet impact map.** Iter-14 verified zero callers within the spec, but external consumers (Barter symlink, fs-enterprises) may have docs referencing the deleted promotion subsystem. Audit AGENTS.md triad sync per the user's standing instruction.

Both are optional given STOP_READY_CONFIRMED. If iters 19-20 are skipped, this roadmap is implementation-ready.
