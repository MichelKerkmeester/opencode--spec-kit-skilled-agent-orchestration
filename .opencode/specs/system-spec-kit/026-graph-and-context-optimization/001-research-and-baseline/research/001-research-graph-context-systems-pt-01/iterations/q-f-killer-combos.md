# Q-F — Killer-Combo Analysis

> Iteration 7 of master consolidation. Cross-phase synthesis #6 of 6.
> Top 3 multi-system combinations that exceed single-system adoption value.

## TL;DR
- 3 combos surfaced; their killer-scores are `9/10`, `8/10`, and `8/10`.
- The winning pattern is not "import a monolith." The best combos compress one handoff point and then steer work back into Public's existing split surfaces. [SOURCE: research/iterations/iteration-6.md:38-42] [SOURCE: research/iterations/q-c-composition-risk.md:14-16]
- Because Q-E found `0` source-portable systems in this checkout, every combo below is framed as a clean reimplementation plan, not as direct source lift; none depends on AGPL Contextador code. [SOURCE: research/iterations/q-e-license-runtime.md:11-11] [SOURCE: research/iterations/q-e-license-runtime.md:66-69]

## Combo 1 — Pair cached startup memory with graph-first routing

**Components:** Candidate 21 `Deterministic summary computation at Stop time` (phase 005, Q-C `low`, Q-E `mixed`) + Candidate 20 `Cached context_summary SessionStart fast path` (phase 005, Q-C `low`, Q-E `mixed`) + Candidate 12 `Graph-first PreToolUse hook` (phase 004, Q-C `low`, Q-E `mixed`)

**Synergy hypothesis:** Stop-time summary production turns session close into a cheap producer step, SessionStart fast path consumes that summary instead of replaying raw history, and the graph-first hook then steers the first live follow-up toward `code_graph_query` or CocoIndex instead of raw grep. The multiplier is that the session both starts warm and stays on the right substrate, which cuts two different token sinks in one flow. [SOURCE: research/iterations/q-c-composition-risk.md:33-33] [SOURCE: research/iterations/q-c-composition-risk.md:41-42] [SOURCE: research/iterations/iteration-6.md:38-42]

**Why this beats either component alone:** The cached summary alone still leaves the model to rediscover which surface to query first. The hook alone still starts from a cold or partially reconstructed session. Together they reduce startup payload and first-query wandering on the same task path. [SOURCE: research/iterations/q-a-token-honesty.md:11-14] [SOURCE: research/iterations/q-a-token-honesty.md:117-125]

**Evidence:** Q-A already treated Claudest's cached summary path as the most measurement-mature savings vector in the set, while Q-C treated both the SessionStart fast path and Graphify's hook as low-risk fast wins, and the iter-6 handoff explicitly named the combined pattern as the strongest early combo signal. [SOURCE: research/iterations/q-a-token-honesty.md:11-14] [SOURCE: research/iterations/q-c-composition-risk.md:15-16] [SOURCE: research/iterations/iteration-6.md:39-42]

**Measurement plan (Q-A grounded):** Freeze a corpus of resume/startup tasks plus one structural follow-up and one semantic follow-up per session. For each run, log session-start cost, retrieval query cost, latency, follow-up query count, and answer pass rate using the Q-A methodology's split reporting rules; compare baseline, summary-only, hook-only, and combined runs. [SOURCE: research/iterations/q-a-token-honesty.md:106-125]

**Effort:** M

**Prerequisites (from Q-D):** P0 Candidate 21; P0 Candidate 9; P1 Candidate 20; P1 Candidate 12.

**Composition risk (combo-level):** low

**Killer-quality score:** 9/10 — it improves both cold-start continuity and first-query routing without challenging Public's split topology.

## Combo 2 — Make savings auditable before you scale them

**Components:** Candidate 10 `Benchmark-honest token reporting` (phase 003, Q-C `low`, Q-E `concept-transfer-only`) + Candidate 24 `Per-tier pricing and cache normalization` (phase 005, Q-C `med`, Q-E `mixed`) + Candidate 26 `Dashboard JSON contracts` (phase 005, Q-C `low`, Q-E `mixed`)

**Synergy hypothesis:** The rubric from Contextador prevents inflated labels, Claudest's pricing normalization makes producer and consumer costs comparable, and the dashboard contracts give Public a stable surface for publishing medians, p90s, and failure modes. Together they convert scattered internal counters into an auditable measurement system that can govern later adoption decisions. [SOURCE: research/iterations/q-c-composition-risk.md:31-31] [SOURCE: research/iterations/q-c-composition-risk.md:45-47] [SOURCE: research/iterations/q-a-token-honesty.md:115-125]

**Why this beats either component alone:** A rubric without normalized cost fields cannot prove anything; normalized cost fields without a publication contract stay internal and drift-prone. The dashboard without honest labels would simply make synthetic numbers look more official. [SOURCE: research/iterations/q-a-token-honesty.md:113-125] [SOURCE: research/iterations/q-a-token-honesty.md:127-134]

**Evidence:** Q-A's recommended Public methodology already demanded separate units, answer-quality gates, and provider-counted token authority; Q-C separately scored the reporting rubric, per-tier normalization, and dashboard contracts as clean or moderate fits inside Spec Kit Memory rather than topology-breaking additions. [SOURCE: research/iterations/q-a-token-honesty.md:104-125] [SOURCE: research/iterations/q-c-composition-risk.md:31-31] [SOURCE: research/iterations/q-c-composition-risk.md:45-47]

**Measurement plan (Q-A grounded):** Use the combo to instrument a frozen task corpus covering session-start, semantic, structural, and mixed tasks. Publish only medians/p90s for prompt tokens, returned tokens, latency, cache-read/write mix, follow-up queries, and pass rate once provider-counted totals and reproducible scoring are available. [SOURCE: research/iterations/q-a-token-honesty.md:117-125]

**Effort:** M

**Prerequisites (from Q-D):** P0 Candidate 10; P0 Candidate 21; P1 Candidate 24; P2 Candidate 26.

**Composition risk (combo-level):** med

**Killer-quality score:** 8/10 — this is the combo that makes later savings claims believable instead of merely impressive-sounding.

## Combo 3 — Expose trustworthy structural context as reusable projections

**Components:** Candidate 2 `AST-first / regex-fallback / confidence labels` (phase 002, Q-C `low`, Q-E `mixed`) + Candidate 11 `Evidence-tagging contract + confidence_score` (phase 004, Q-C `med`, Q-E `mixed`) + Candidate 4 `Static artifacts as default + MCP as overlay` (phase 002, Q-C `med`, Q-E `mixed`)

**Synergy hypothesis:** CodeSight's detector discipline makes provenance explicit at extraction time, Graphify's evidence tiers carry that honesty into consumer-facing responses, and the static-artifact-plus-overlay pattern packages those trustworthy structures into durable briefs with live precision follow-up. The combined result is a reusable structural context layer that is both portable and inspectable. [SOURCE: research/iterations/q-c-composition-risk.md:23-25] [SOURCE: research/iterations/q-c-composition-risk.md:32-32] [SOURCE: 002-codesight/research/research.md:471-475] [SOURCE: 004-graphify/research/research.md:560-560]

**Why this beats either component alone:** Confidence labels without packaging stay hidden inside one detector. Static artifacts without provenance become overconfident summaries that invite bad follow-up behavior. Evidence tags become far more valuable once they flow into both the durable artifact and the live overlay path. [SOURCE: research/iterations/q-a-token-honesty.md:13-14] [SOURCE: research/cross-phase-matrix.md:40-47]

**Evidence:** The capability matrix already showed that Public's strength is structural and semantic query, not static packaging; Q-C then singled out CodeSight's confidence discipline and packaging split plus Graphify's evidence tagging as additive patterns that can sit beside, rather than replace, Public's owners. [SOURCE: research/cross-phase-matrix.md:12-18] [SOURCE: research/iterations/q-c-composition-risk.md:23-25] [SOURCE: research/iterations/q-c-composition-risk.md:32-32]

**Measurement plan (Q-A grounded):** Freeze structural troubleshooting tasks and compare baseline vs combined runs on retrieval query cost, final answer cost, follow-up query count, and answer pass rate. The success condition is not just fewer tokens but fewer clarifying hops before a correct structural answer. [SOURCE: research/iterations/q-a-token-honesty.md:106-125]

**Effort:** M

**Prerequisites (from Q-D):** P0 Candidate 2; P0 Candidate 3; P0 Candidate 15; P1 Candidate 11; P1 Candidate 4.

**Composition risk (combo-level):** med

**Killer-quality score:** 8/10 — it turns provenance-aware structural extraction into something humans and tools can both consume without collapsing Public's split.

## Combos considered but rejected

- `Single-canonical ScanResult` + `bootstrap layering` + `rebuild policy`: rejected because it recreates the exact monolithic pressure Q-C marked as the main architecture risk. [SOURCE: research/iterations/q-c-composition-risk.md:14-16] [SOURCE: research/iterations/iteration-6.md:40-42]
- `FTS cascade` + `search/browse separation`: useful, but still mostly additive inside one lane and not clearly more valuable than adopting the better search path alone. [SOURCE: research/iterations/q-c-composition-risk.md:40-40] [SOURCE: research/iterations/q-c-composition-risk.md:49-49]
- `Graph-first hook` + `CLAUDE.md companion`: good steering pair, but the companion section is mainly an amplifier for the hook, not a distinct multiplier. [SOURCE: research/iterations/q-c-composition-risk.md:33-35]
- `Stable JSON artifact` + `Leiden clustering` + `rebuild policy`: promising long-term, but still too speculative and coordination-heavy for a top-3 recommendation. [SOURCE: research/iterations/q-c-composition-risk.md:37-39] [SOURCE: research/iterations/iteration-6.md:40-42]

## Cross-cutting observation

The top combos all respect the same pattern: add leverage at a handoff point, not by replacing Public's architecture. Combo 1 compresses session-start and then routes the first live question correctly; Combo 2 makes later savings claims governable before rollout; Combo 3 makes structural outputs more trustworthy and reusable without inventing a fourth retrieval owner. The multiplier comes from bounded adapters reinforcing existing surfaces, not from importing a monolithic scan or bootstrap facade. [SOURCE: research/iterations/q-c-composition-risk.md:14-16] [SOURCE: research/iterations/iteration-6.md:38-42]
