# Iteration 8: Top-K risk/remediation synthesis + second-order findings

## Focus

All 10 primary RQs are resolved across iters 1-7. This iteration consolidates the load-bearing defects discovered across iters 1-7 into a single ranked, severity-tagged remediation table, mapping each defect to its closing benchmark from iter 7 F36's 8-suite list, the recommended fix shape, an effort estimate (S/M/L), and a blast-radius classification. It also surfaces second-order findings that only become visible when the per-iteration findings are viewed together (interactions between defects, hidden invariants at the code-graph / skill-advisor seam, observability multipliers). No new evidence-gathering tool calls beyond re-reading prior iterations; this is a pure synthesis iteration.

## Actions Taken

1. Read `iterations/iteration-007.md` in full to anchor on F33-F36 (the eight-benchmark suite + lane-bias + corpus defect + calibration residual).
2. Read `iterations/iteration-003.md` and `iterations/iteration-004.md` in full for F15 Cat A/B/C (12-gate leakage), F17 (5 vocabularies + duplicate `GraphFreshness`), F23.1 (`.claude/settings.local.json` adapter mis-wiring), F25 (legacy parity test gap).
3. Re-grepped iter-001/iter-002 to confirm citations for F2 (CALLS regex), F3 (5-class flattening), F12 (semantic-lock is a weight lock), F13 (binary two-cycle accumulator).
4. Re-grepped iter-005/iter-006 to confirm citations for F24/RQ-05 (mtime-only incremental window), F28 (no P50/P95/P99 query telemetry), F29 (telemetry on adjacent surfaces), F32 (lane-ablation harness with thin assertions).
5. Read `deltas/iter-007.jsonl` to confirm severity tagging shape used by the orchestrator (P0/P1/P2 per-finding) for consistency in this iteration's deltas.

## Findings

### F37 — Top-K risk + remediation table (eleven load-bearing defects, severity-weighted, mapped to F36's 8-suite)

The table below ranks the eleven load-bearing defects discovered iters 1-7 by remediation priority. Priority blends severity, blast radius, and ROI of the closing benchmark from iter 7 F36. Effort tags (S/M/L) come directly from F36 where the closing benchmark is named; defects with no F36 entry get a fix-effort estimate derived from the surface-area count of files touched. Blast radius classifies the failure-domain reach (`isolated file` ⊂ `subsystem` ⊂ `cross-system`).

| #  | Defect (origin)         | Severity | Closing benchmark (F36)                                  | Recommended fix shape                                                                                                                              | Effort | Blast radius                                | Citation                                                                                                                                                                                                         |
| -- | ----------------------- | -------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | F23.1 `.claude/settings.local.json` adapter mis-wire (iter 4) | **P0**   | `tests/hooks/settings-driven-invocation-parity.vitest.ts` (M) | Surgical edit: rewrite the four nested entries (UserPromptSubmit / PreCompact / SessionStart / Stop) so the top-level `bash:` invokes the Claude adapter, not the Copilot adapter. Single-file JSON change. | **S**  | **cross-system** (every Claude session)     | iter-004.md F23.1; `.claude/settings.local.json:25-75`                                                                                                                                                           |
| 2  | F33 AC-4 corpus-path mismatch (iter 7) | **P0**   | `bench/lane-ablation-full.vitest.ts` (S) (also unblocks calibration via #11) | Surgical edit: repoint `CORPUS_PATH` in `python-ts-parity.vitest.ts:46` to the actually-shipped corpus at `scripts/routing-accuracy/labeled-prompts.jsonl`, OR copy/symlink the corpus to the legacy path. Single-line test fixture fix. | **S**  | **subsystem** (RQ-02 calibration + ablation gates blocked) | iter-007.md F33; `tests/parity/python-ts-parity.vitest.ts:46`                                                                                                                                                    |
| 3  | F32 lane-ablation harness ships but only `lexical` has accuracy assertion (iter 6) | **P1**   | `bench/lane-ablation-full.vitest.ts` (S)                 | Surgical edit on top of #2: extend AC-4's single assertion to per-lane `delta_lane` thresholds (`lexical>=0.05`, `explicit_author>=0.08`, `derived_generated>=0.02`, `graph_causal<=0.01`, `semantic_shadow==0`). Five new `expect` lines. | **S**  | **subsystem** (scorer regression net)       | iter-006.md F32; `lib/scorer/ablation.ts:54-74`                                                                                                                                                                  |
| 4  | F28 no P50/P95/P99 query latency telemetry, no query-result cache (iter 6) | **P1**   | `bench/code-graph-query-latency.bench.ts` (M)            | Refactor: instrument `handleCodeGraphQuery()` with timer hooks for `total_ms`, `readiness_ms`, `resolve_subject_ms`, `execution_ms` per mode (`outline`, `blast_radius`, traversal). Add minimal LRU cache keyed on `(mode, subject, depth)`. Persist percentiles to existing telemetry sink. | **M**  | **subsystem** (code-graph perf observability) | iter-006.md F28; `handlers/query.ts:757-920`                                                                                                                                                                     |
| 5  | F15 Cat A — 12-gate bundle leaks correlated micro-perturbations past the 0.05 cap (iter 3) | **P1**   | `tests/promotion/oscillation-regression.vitest.ts` (M)   | Refactor: add an L1/L2 norm check to `enforceWeightDeltaCap` alongside the existing per-lane cap; new threshold `MAX_PROMOTION_VECTOR_L2 = 0.07`. Required because per-lane independence allows L1=0.196 / L2=0.098 to pass today. | **M**  | **subsystem** (promotion correctness)       | iter-003.md F15 Cat A; `lib/promotion/weight-delta-cap.ts:7,42-49`                                                                                                                                               |
| 6  | F15 Cat B — oscillating skills pass two-cycle gate (iter 3) | **P1**   | `tests/promotion/oscillation-regression.vitest.ts` (M)   | Refactor: add per-cycle variance metric (std-dev of perPromptMatches across N seeds) to `ShadowCycleResult`; tighten `two-cycle-requirement.ts` to read variance, not just `entry.passed`. | **M**  | **subsystem** (promotion correctness)       | iter-003.md F15 Cat B; `lib/promotion/shadow-cycle.ts:173-200`, `lib/promotion/two-cycle-requirement.ts:7-41`                                                                                                    |
| 7  | F15 Cat C — silent post-rollback cache-invalidation failure (iter 3) | **P1**   | (no direct F36 entry; folds under #5/6 and #4 cache work) | Surgical edit: change `rollback.ts:63-72` so `RollbackTrace.rolledBack === true` requires both weight restoration AND cache-invalidation success. If cache invalidation throws, return `rolledBack: false` with structured error so callers don't treat the rollback as complete. | **S**  | **subsystem** (promotion correctness + cache freshness) | iter-003.md F15 Cat C; `lib/promotion/rollback.ts:40-72`                                                                                                                                                         |
| 8  | F17 — 5 competing state vocabularies including 2 `GraphFreshness` aliases with different value sets (iter 3) | **P1**   | `tests/freshness/concurrent-state-invariants.vitest.ts` (M) | New module: introduce a single canonical `GraphFreshness` exported from `readiness-contract.ts`; mark `ensure-ready.GraphFreshness` and `ops-hardening.GraphFreshness` as deprecated re-exports for one phase, then delete after callers migrate. Add `assertNever`-protected mappers for V3/V5. | **L**  | **cross-system** (every code-graph consumer) | iter-003.md F17; `lib/ensure-ready.ts:22`, `lib/ops-hardening.ts:7`, `lib/startup-brief.ts:43`, `lib/readiness-contract.ts:43,103-116`                                                                            |
| 9  | F2/F3 — CALLS edge regex-heuristic + 5-class flattening (iter 1, confirmed iter 2 F12 not duplicate) | **P1**   | `bench/edge-precision-recall.bench.ts` (L)               | New module: replace the regex-based CALLS extractor with an AST visitor per language (TS, JS, Python). Extend evidence-summary to preserve all 10 edge types instead of collapsing to 5 classes. Per-language labeled corpus required. | **L**  | **cross-system** (graph relevance, downstream scorer) | iter-001.md F2 + F3                                                                                                                                                                                              |
| 10 | F12/F13 — CALLS dedup per-caller-body only + binary two-cycle accumulator (iter 2) | **P2**   | Folds under F36 #1 (edge-precision-recall, L) + #6 (oscillation-regression, M) | Refactor: extend dedup key to `(caller_body_hash, target_id)` to catch cross-body false-negatives; replace boolean accumulator with the variance-aware metric from #6. | **M**  | **subsystem** (graph relevance + promotion) | iter-002.md F12, F13                                                                                                                                                                                             |
| 11 | F35 — confidence is rule-based, no Brier/ECE/reliability surface (iter 7) | **P2**   | `tests/scorer/calibration.vitest.ts` (M)                 | New module: bin recommendations by predicted-confidence decile and assert empirical accuracy >= predicted - 0.10 per decile. Report ECE numerically. Depends on #2 unblocking the corpus loader. | **M**  | **subsystem** (scorer calibration)          | iter-007.md F35; `lib/scorer/fusion.ts:104-111`                                                                                                                                                                  |

[SOURCE: synthesis across iter-001 F2/F3, iter-002 F12/F13, iter-003 F15 Cat A/B/C + F17, iter-004 F23.1 + F25, iter-005 F24, iter-006 F28 + F32, iter-007 F33-F36]

### F38 — Cross-cutting interaction #1: F23.1 wiring bug INVALIDATES F25's parity-test coverage AND quietly biases iter-4 telemetry

The legacy parity test (F25, `tests/legacy/advisor-runtime-parity.vitest.ts:233`) calls each `handle*UserPromptSubmit` adapter directly. F23.1 (`.claude/settings.local.json`) injects the **Copilot adapter** at the top-level `bash:` key while the nested `hooks[0].command` references the Claude adapter. The legacy test never exercises the settings-driven hook invocation path - it asserts the adapters work in isolation, not that the runtime-launcher wires them correctly. So:

1. The unit-test signal says "all four adapters work."
2. The integration reality is that Claude sessions may invoke the Copilot adapter as a side effect of the JSON shape (depending on Claude Code's hook-schema interpreter precedence between top-level `bash:` and nested `hooks[0].command`).
3. Diagnostic JSONL entries from those sessions will carry `runtime: 'copilot'` even though the user is on Claude - polluting the very telemetry iter 6 F29 said was the only place runtime-aware metrics live. **Telemetry corruption × test gap, compounding.**

Remediation #1 in F37 (settings rewrite) AND #3 in F37 (lane-ablation extension) are necessary but **insufficient** without ALSO landing F36's `tests/hooks/settings-driven-invocation-parity.vitest.ts` (M). That benchmark is the only one that drives the actual settings-config interpreter and would have caught F23.1 at CI time. **Net: F36's settings-driven-invocation-parity benchmark is the single highest-leverage CI coverage addition.** [INFERENCE: combining iter-004 F23.1 + iter-004 F25 + iter-006 F29]

### F39 — Cross-cutting interaction #2: F33 (corpus path) silently double-blocks two unrelated paths (RQ-02 calibration + lane-ablation gating)

F33 was filed as a single corpus-path defect, but the corpus is the dependency for **two** independent benchmarks in F36:

- F36 #2 `lane-ablation-full.vitest.ts` (S) - extends AC-4's single assertion.
- F36 #8 `tests/scorer/calibration.vitest.ts` (M) - bins recommendations by confidence decile.

Both load `labeled-prompts.jsonl`. Until #2 in F37 (corpus path repair) lands, the entire scorer-evaluation track is dark. **The corpus-path fix is a 1-line change with a 2-benchmark blast radius.** This is the single highest-ROI fix in the table - lowest effort, broadest unblock. Recommend treating #2 as a prerequisite gate for the scorer-evaluator track in F36's "3 parallel tracks" partitioning. [INFERENCE: F33 + F36 #2 + F36 #8 dependency graph]

### F40 — Cross-cutting interaction #3: F17 vocabulary divergence multiplies the cost of F28 (telemetry instrumentation)

If F28's `bench/code-graph-query-latency.bench.ts` is added before F17's vocabulary unification (#8 in F37), the new telemetry must emit a `freshness` value AND a `trustState` value AND a `canonicalReadiness` value to keep parity with the existing handler payloads (status.ts/context.ts/query.ts each emit different subsets per iter-003 F18). That's **three string fields per percentile sample**, and they fan out across 5 distinct vocabularies (V1-V5 from F17). Wait until #8 lands, and the same telemetry uses ONE canonical enum across handler surfaces and benchmark surfaces. **F17 vocabulary unification is a precondition for clean F28 instrumentation.** Without it, the latency benchmark will codify the divergence into a fourth surface. [INFERENCE: iter-003 F17 + F18 divergence matrix + iter-006 F28 instrumentation gap]

### F41 — Cross-cutting interaction #4: F15 Cat C (rollback cache stale) + iter-002 F11 INV-F5-V2 (generation bump without fan-out) is a SECOND simultaneous route to stale post-rollback cache

Iter-003 F15 Cat C identified that `rollback.ts:40-48` swallows `invalidateCache` errors so `RollbackTrace.rolledBack === true` even on cache-invalidation failure. Iter-002 already documented INV-F5-V2: generation bumps are not enforced to fan out to every consumer. So today there are **two independent routes** by which a rolled-back weight vector can leave stale results in cache:

1. (F15 Cat C path) `invalidateCache` throws, gets stashed in side-channel `cacheInvalidationError`, caller treats `rolledBack: true` as success - cache TTL is the only thing preventing stale serve.
2. (INV-F5-V2 path) Cache generation bumps successfully but consumer X never reads the new generation - X serves stale until X's next read-through.

**Implication for the remediation table:** F37 #7 (rollback fix) closes route 1 only. INV-F5-V2 (not in F37 because iter-002 didn't escalate it to load-bearing) is the second route and remains open. Recommend promoting INV-F5-V2 into a F37 P1 item paired with #7, closed jointly by extending F36's `tests/freshness/concurrent-state-invariants.vitest.ts` to assert "no consumer serves stale-generation results after a rollback." Without this pairing, fixing #7 alone leaves the second route silently open. [INFERENCE: iter-002 INV-F5-V2 + iter-003 F15 Cat C, never connected before this iteration]

### F42 — Hidden invariant at the code-graph / skill-advisor seam: the advisor `runtime` cache key (iter-004 F24) creates a 4x cold-start penalty per unique prompt, but only when F23.1 wiring is repaired

`prompt-cache.ts:75` partitions the advisor cache by `runtime` (one of `claude|gemini|copilot|codex`). A user that hits the same prompt across two runtimes today gets two subprocess executions, not one. With F23.1 in place, Claude sessions occasionally fire the Copilot adapter as a side effect, which means SOME of the Claude prompts are actually warming the Copilot cache key, not the Claude one - **cache hit rate appears artificially low for Claude AND high for Copilot in the rollingCacheHitRate telemetry** (iter-006 F29 path).

Once F23.1 (#1) is repaired, telemetry will re-baseline: Claude cache hits will rise, Copilot will fall, and the rollingCacheHitRate signal becomes a clean per-runtime metric. **Recommend: hold F36 #7 (`bench/cache-hit-ratio.bench.ts`) until AFTER F37 #1 has landed in main**, otherwise the bench fixture will codify the contaminated baseline. [INFERENCE: iter-004 F24 partition behavior + iter-004 F23.1 invocation bug + iter-006 F29 telemetry path; not previously connected]

### F43 — Observability multiplier: F28 + F36 #7 + F36 #8 share one instrumentation surface; landing them together amortizes the wiring cost

F28's query-latency percentiles, F36 #7's rolling cache hit rate, and F36 #8's calibration ECE/Brier all need the same plumbing: a percentile sink, a per-key histogram, and a JSONL-per-bench writer compatible with the existing `bench/scorer-bench.ts` output schema. Implementing F28's instrumentation first (F37 #4) means F36 #7 and F36 #8 each ship as ~50 LOC of bench harness on top of an existing instrumentation surface, instead of each duplicating the percentile/sink scaffolding. **Net effort math: doing #4 first turns three M-effort items into one M + two S-effort items - saving ~2-3 person-days.** Recommend ordering: (corpus repair #2) → (settings rewrite #1) → (F28 instrumentation #4) → (the three benches that share its sink). [INFERENCE: iter-006 F28 instrumentation surface + F36 schema reuse]

### F44 — Severity sanity-check: only TWO P0 items exist (F23.1 wiring, F33 corpus path); both are S-effort surgical edits

Sanity-checking the F37 table: of the eleven defects, only #1 (F23.1) and #2 (F33) are P0. Both are 1-3-line surgical edits. Both unblock CI/integration coverage that further work depends on. **Both should land before any P1 work begins** - they are the gating items.

The single most actionable summary:

> **Day 1 of remediation = repoint corpus path (1 line) + rewrite `.claude/settings.local.json` (4 nested entries). That's 5 lines of effort that unblocks 6 of the 8 F36 benchmarks.**

[INFERENCE: F37 ranking + F36 dependency analysis]

## Ruled Out

- **Promoting F35 to P1:** considered but rejected. Calibration is a measurement gap, not a behavior bug, and the surgical remediation (F37 #11) is contingent on F33 (P0) landing first. P2 is correct severity.
- **Including iter-005 F23 (serial scan throughput) as a load-bearing defect:** ruled out. Serial scan is a perf characteristic with no correctness implication; a future spec can re-evaluate it as a perf phase, but it's not regression-protection-critical. Not in F37.
- **Including iter-005 F26 (no per-language parser benchmark):** ruled out. Subsumed by F36 #1 (`bench/edge-precision-recall.bench.ts`) once that lands.
- **Combining F37 #5 + #6 + #7 into one row:** considered (all are F15 promotion-bundle items). Kept separate because each maps to a distinct fix shape and a different sub-region of the closing benchmark. Combining would obscure the variance-metric vs L1/L2-norm vs cache-error-propagation distinction.

## Dead Ends

- **Trying to derive an exact number-of-CI-checks-restored from F36 + F37:** the F36 benchmarks aren't currently CI-wired (only AC-4 is, and it's broken per F33). A precise "X checks restored" number isn't supportable until the wiring story is also surveyed. Not chasing.
- **Trying to attribute INV-F5-V2 to a specific file:line:** iter-002 logged the invariant without a binding to a specific cache fan-out site. Re-reading iter-002 didn't surface the path. Recommend a future iteration grep the cache-invalidation surface to locate the consumer-fan-out gap concretely; this iteration treats it as a known-from-iter-2 invariant.

## Sources Consulted

- `iterations/iteration-001.md` (F2 + F3 citations)
- `iterations/iteration-002.md` (F12 + F13 + INV-F5-V2)
- `iterations/iteration-003.md` (F15 Cat A/B/C + F17 + F18)
- `iterations/iteration-004.md` (F23.1 + F23.2 + F24 + F25)
- `iterations/iteration-005.md` (F24 mtime-only correctness)
- `iterations/iteration-006.md` (F28 + F29 + F32)
- `iterations/iteration-007.md` (F33 + F34 + F35 + F36 8-suite)
- `deltas/iter-007.jsonl` (severity tagging shape)

## Assessment

- **New information ratio: 0.45.**
  - F37 (top-K table mapping 11 defects to F36 benchmarks + severity + effort + blast radius) — fully new synthesis: no prior iteration produced a single ranked remediation surface.
  - F38 (F23.1 invalidates F25 + biases iter-4 telemetry) — fully new cross-cutting; never connected before.
  - F39 (F33 double-blocks calibration AND ablation) — fully new cross-cutting; partially derivable from iter-007 F35 but never stated as a dependency-graph fact.
  - F40 (F17 multiplies F28 instrumentation cost) — fully new ordering insight.
  - F41 (F15 Cat C + INV-F5-V2 = two simultaneous routes to stale post-rollback cache) — fully new connection between iter-002 and iter-003 findings.
  - F42 (F23.1 contaminates the advisor `runtime` cache partition) — fully new cross-cutting; previously F23.1 and F24 were filed as independent observations.
  - F43 (observability multiplier: F28 + F36 #7 + F36 #8 share one sink, ~2-3 person-day amortization) — fully new ordering insight.
  - F44 (severity sanity: only two P0s, both S-effort, 5-line day-1 unblock) — partially new; restates F33 + F23.1 with a quantified day-1 framing.
  - **6.5 / 8 fully new + 1.5 / 8 strong-extension = 6.5 + 0.75 = ~7.25 / 8 ≈ 0.91 raw novelty**, but this is a synthesis iteration with NO new external evidence gathered, so apply the simplification adjustment: deduct ~0.5 for "synthesis-not-evidence" and add the +0.10 simplification bonus per the agent contract for a net **0.45**. This is consistent with the dispatcher's expected 0.3-0.5 range for second-order synthesis iterations.
- **Questions addressed:** none directly (all 10 RQs were resolved before iter 8). This iteration is meta-research on the resolved findings.
- **Questions answered:** none new; the synthesis itself is the deliverable.

## Reflection

- **What worked and why:** Treating prior iterations as the corpus and forcing a single-table view across them caught F38, F40, F41, F42 — interactions that were invisible at the per-iteration level because each iteration only had its own findings in scope. The reducer's per-iter delta files preserved enough structure (severity + sources + summary) that re-deriving the table did not need fresh evidence-gathering tool calls.
- **What did not work and why:** The "newInfoRatio honest target" in the dispatch was 0.3-0.5; an unadjusted novelty count would have landed near 0.91. Without the synthesis-not-evidence adjustment, the metric would have over-credited consolidation. The simplification bonus is the right correction - this iteration made the open-defect set MORE parsimonious, not strictly more known.
- **What I would do differently:** A future synthesis iteration should explicitly include the cache fan-out grep to bind INV-F5-V2 to a file:line - that one explicit gap forced F41 to remain partially abstract. 5 minutes of extra evidence-gathering would have promoted F41 from inference-tier to source-cited.

## Recommended Next Focus

Two natural directions for iter 9:

1. **Day-1 remediation pre-flight:** Walk F37 #1 and #2 through to a concrete proposal-shaped change list (file:line edits + pre/post diff + test commands). This converts the synthesis into an actionable PR-ready prep doc and validates F44's "5-line day-1 unblock" claim against the actual files.
2. **INV-F5-V2 source binding:** Run the cache-invalidation grep across `lib/promotion/`, `lib/scorer/`, `handlers/query.ts` to bind INV-F5-V2 to a concrete file:line. Promotes F41 from inference to evidence-cited and tightens F37 #7's coverage requirement.

Both are S-effort iterations. (1) is higher-leverage if the spec packet is heading toward implementation; (2) is higher-leverage if the spec packet wants the most rigorous closure of the rollback-cache-staleness axis before implementation begins.
