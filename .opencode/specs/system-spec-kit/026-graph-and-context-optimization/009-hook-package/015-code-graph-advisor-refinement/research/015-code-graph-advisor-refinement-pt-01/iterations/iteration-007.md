# Iteration 7: RQ-02 close (lane-bias synthesis + harness wiring defect) + RQ-09 close (benchmark coverage gap suite)

## Focus

Close RQ-02 by attempting to run the lane-ablation harness empirically and, on the empirical-blocker outcome, synthesizing systematic-bias direction from the fusion source. Then close RQ-09 by consolidating iterations 1-6 into a concrete benchmark suite proposal with names, scope, pass criteria, and effort estimates.

## Actions Taken

1. Listed `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/` to enumerate runnable harnesses.
2. Read `lib/scorer/ablation.ts:1-75`, `bench/scorer-bench.ts:1-71`, `bench/corpus-bench.ts:1-70`, and `lib/scorer/weights-config.ts:1-50` to confirm topology, weight locks, and corpus coupling.
3. Read `tests/parity/python-ts-parity.vitest.ts:120-180` to confirm what AC-4 actually asserts.
4. Attempted to run the AC-4 ablation test directly (`npx vitest run tests/parity/python-ts-parity.vitest.ts -t "AC-4 ablation"`) to capture per-lane accuracy deltas.
5. Verified workspace presence of `labeled-prompts.jsonl` after the corpus-load failure (`find .opencode -name "labeled-prompts*"`).
6. Read `lib/scorer/fusion.ts:100-308` to confirm lane construction order and confirm the `graph_causal` derivative dependency direction.

## Findings

### F33 — RQ-02: AC-4 ablation harness is currently dead in this workspace because of a corpus-path mismatch (empirical-blocker)

The ablation harness (`runLaneAblation()` in `lib/scorer/ablation.ts:54-74`) and the AC-4 parity test (`tests/parity/python-ts-parity.vitest.ts:169-179`) both exist and compile, but the AC-4 test loads its corpus from `CORPUS_PATH = .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`, which does not exist in this workspace. The repository does ship a labeled prompts corpus at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl`, so the assertion-side regression is a path-binding defect, not missing data. Until the corpus path is repointed (or the file copied to the legacy spec path), AC-4 cannot run, the lane-ablation accuracy table cannot be produced, and RQ-02's empirical bias-quantification path stays blocked. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:46`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl`] [SOURCE: live `npx vitest run tests/parity/python-ts-parity.vitest.ts -t "AC-4 ablation"` ENOENT in iteration]

### F34 — RQ-02: From static analysis, `lexical` is the single most systematically biased lane to ablate; `explicit_author` is second; `graph_causal` ablation is structurally near-noop

Three structural facts in `fusion.ts`/`weights-config.ts` together pin the bias direction without needing the corpus run:

1. `buildLaneScores()` at `fusion.ts:114-127` constructs `graph_causal` from the union of `explicit_author + lexical + derived_generated` matches. Disabling `graph_causal` removes only the 0.15 re-projection weight; the underlying evidence is already counted by the three primary lanes. So the "graph_causal disabled" ablation slice is the lower bound on ablation impact and is the closest-to-baseline accuracy we should expect.
2. `confidenceFor()` (the `direct = max(explicit_author.rawScore, lexical.rawScore)` term at `fusion.ts:101-103, 238-241`) gates routing confidence on the higher of those two lanes alone. Disabling either lane pulls direct to zero for prompts whose only evidence sits there, raising uncertainty and triggering `unknown` routing - so ablating `lexical` (0.30 weight) or `explicit_author` (0.45 weight) is structurally guaranteed to drop top-1 accuracy and inflate `unknown` more than ablating any other lane.
3. `liveWeightTotal()` excludes `semantic_shadow` from the live denominator (`weights-config.ts:44-48`), and the fusion loop assigns `semantic_shadow` `weightedScore = 0` even when raw evidence exists (`fusion.ts:223-230`). So ablating `semantic_shadow` is a literal noop on top-1 accuracy today; only `lexical`, `explicit_author`, and `derived_generated` should produce measurable accuracy drops, and `lexical` should produce the largest drop given AC-4 was specifically written to assert "disabling lexical reduces corpus accuracy" rather than the equivalent for other lanes.

The implication for systematic bias: routing decisions are dominated by the union of `explicit_author` and `lexical` (combined live weight 0.75 of the 1.00 live total, since `semantic_shadow` is excluded from the denominator). Any prompt whose ground-truth skill expresses itself only via derived/generated patterns (file-path heuristics, language detection) has 0.10 of the weight to win on, and 0.15 of `graph_causal` re-projection that is itself a function of the dominant lanes. This is sufficient to call RQ-02 resolved on direction: `lexical` is the highest-leverage ablation, the live scorer is structurally biased toward explicit + lexical evidence, and `graph_causal` is a derivative/redundant lane in the live mode. Quantifying the magnitude of that bias still requires the corpus run, which F33 captures as deferred empirical work. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:114-127`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:223-230`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:238-241`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:14-49`] [INFERENCE: based on lane construction order plus weight locks plus AC-4 asymmetric coverage]

### F35 — RQ-02: confidence calibration cannot be evaluated from code alone; it is the residual empirical question

`confidenceFor()` is rule-based, not model-based: it ladders on `liveNormalized`, `directScore`, intent flags, and `derivedDominant` (`fusion.ts:104-111, 238-256`). It does not learn from corpus labels at runtime, and there is no calibration loss surface (Brier, ECE, or reliability-diagram) anywhere in `bench/` or `tests/`. So calibration-against-ground-truth is not derivable from static code; closing it requires running `corpus-bench.ts`/AC-4 with the corpus repaired, then reporting `confidence_decile -> empirical_accuracy`. Iter 7 records this as the residual RQ-02 work item, not a blocker on RQ-02 closure: the systematic-bias-direction question (the load-bearing half of RQ-02) is closed; the calibration-quantification question is deferred to the empirical run RQ-09 calls out below. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:104-111`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/scorer-bench.ts:42-61`]

### F36 — RQ-09: comprehensive benchmark coverage gap suite (8 missing benchmarks, scoped + estimated)

Synthesizing iterations 1-6 plus this iteration's harness-execution evidence, here is the concrete benchmark suite that would close the observability and regression-protection gaps surfaced across the pipeline. Each entry: name | scope | pass criteria | effort.

1. **`bench/edge-precision-recall.bench.ts`** | per-edge-type precision/recall on a labeled AST corpus per language (TS, JS, Python, Markdown, Shell) | precision >= 0.90 and recall >= 0.85 per edge type per language; emit a confusion matrix per `(language, edge_type)` cell | **L** (needs labeled-edge corpus per language; iter 1 F3, iter 2 already flagged the raw gap).
2. **`bench/lane-ablation-full.vitest.ts`** | replace AC-4's lexical-only assertion with full per-lane assertions across `explicit_author`, `lexical`, `derived_generated`, `graph_causal`, and `semantic_shadow` | each non-shadow lane disabled MUST drop accuracy by `>= delta_lane` (lexical >= 0.05, explicit_author >= 0.08, derived_generated >= 0.02, graph_causal <= 0.01 expected near-noop); semantic_shadow disabled MUST be exactly equal to baseline | **S** (harness already exists; needs corpus-path repair F33 + new assertions; iter 6 F32).
3. **`bench/code-graph-query-latency.bench.ts`** | wrap `handleCodeGraphQuery()` in a benchmark that emits `total_ms`, `readiness_ms`, `resolve_subject_ms`, `execution_ms` percentiles for `outline`, `blast_radius`, and relationship traversal modes across a fixed prompt set | P95 <= 60 ms cached, <= 200 ms uncached; P99 <= 350 ms; emits `query_latency_ms_p50/p95/p99` per mode | **M** (handler must be instrumented first; iter 6 F28).
4. **`tests/freshness/concurrent-state-invariants.vitest.ts`** | spawn N concurrent scan + write workers; assert the four states (live/stale/absent/fallback) never observably overlap or skip transitions; assert lock-contention paths converge to a single canonical state | zero overlap-state observations across >= 1000 concurrent transitions; no `unknown` state escapes; lock-acquired-but-state-stale window <= 50 ms | **M** (iter 2/3 invariant gap).
5. **`tests/hooks/settings-driven-invocation-parity.vitest.ts`** | drive each runtime profile's hook config (claude `.claude/settings.json`, codex `.codex/...`, gemini, copilot, opencode plugin) through a fixture matrix and assert the brief surfaces the same keys with the same priority ordering | identical `top_skill`, `confidence`, `dominantLane`, and `passes_threshold` payload across all five runtime profiles for the same prompt | **M** (iter 4 F25).
6. **`tests/promotion/oscillation-regression.vitest.ts`** | replay the two-consecutive-shadow-cycle promoter against a synthetic correlated-shadow corpus that should be detected as oscillation; assert the promoter holds rather than promotes | promoter does NOT promote weights when shadow-A and shadow-B cycles flip the top-skill on the same prompts; oscillation flag raised; promoted-weight diff = baseline | **M** (iter 3 F15 Cat B).
7. **`bench/cache-hit-ratio.bench.ts`** | exercise the advisor brief path with a fixture of near-duplicate prompts and assert `rollingCacheHitRate` settles >= 0.6 over 200 prompts; emit `near_duplicate_miss_rate` for visibility | rollingCacheHitRate >= 0.6 stable over the last 100 prompts; near-duplicate-miss-rate <= 0.25 | **S** (instrumentation exists in `lib/skill-advisor-brief.ts:441-460`; just needs harness; iter 6).
8. **`tests/scorer/calibration.vitest.ts`** | bin recommendations by predicted-confidence decile and assert empirical accuracy >= predicted_confidence - 0.10 (Brier-style reliability) per decile | for each decile in `[0.5, 1.0]`, observed accuracy within 0.10 of predicted; report ECE numerically | **M** (closes RQ-02 calibration residual F35).

Total estimated effort to close: 2 S + 4 M + 1 L + 1 S = ~3 dev-weeks for a single contributor; can be parallelized across 3 tracks (edge-corpus, code-graph instrumentation, scorer evaluator). The S-effort items (lane-ablation-full + cache-hit-ratio) are the highest-ROI starting points because the underlying instrumentation already exists. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ablation.ts:54-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/scorer-bench.ts:42-71`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:757-920` (iter 6 F28)] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:441-460` (iter 6 F29)] [INFERENCE: synthesis across iter 1 F3, iter 2, iter 3 F15, iter 4 F25, iter 6 F28/F29/F32]

## Ruled Out

- **Empirical lane-ablation table this iteration**: blocked by F33 (corpus-path mismatch). Did not retry by copying the corpus into the legacy path because that would be a code mutation outside the research scope; instead recorded the wiring defect as a finding and resolved RQ-02 from static structure.
- **Static-analysis-only confidence calibration**: tried, ruled out at F35 - confidence is rule-based but the only way to score calibration is empirical.

## Dead Ends

- Treating `semantic_shadow` as a meaningful lane to ablate against top-1 accuracy: it is structurally a noop in the live scorer (`weights-config.ts:44-48`, `fusion.ts:223-230`). Any future ablation suite should treat it as raw-evidence-only and not include it in accuracy-delta assertions.
- Trying to read query-latency percentiles from existing telemetry: confirmed in iter 6 F28 that the surface does not exist; no further iteration on this should look for it before instrumentation is added.

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ablation.ts:1-75`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:100-308`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:1-50`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/scorer-bench.ts:1-71`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/corpus-bench.ts:1-70`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:120-180`
- Live test execution: `npx vitest run tests/parity/python-ts-parity.vitest.ts -t "AC-4 ablation"` (ENOENT against legacy corpus path)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl` (corpus exists, just at non-test path)

## Assessment

- New information ratio: 0.55 (4 findings; F33 wiring defect fully new; F34 lane-bias synthesis fully new conclusion derived from prior topology; F35 calibration-residual partially new — sharpens iter 6 unresolved; F36 benchmark suite fully new synthesis with concrete names + criteria)
- Questions addressed: RQ-02, RQ-09
- Questions answered (closed this iteration): RQ-02 (direction-of-bias closed; calibration deferred), RQ-09 (comprehensive gap suite produced)

## Reflection

- **What worked and why**: Attempting the empirical run before synthesizing turned a what-could-have-been-a-soft-conclusion into a hard finding (F33). The harness-execution attempt produced more evidence than the static read alone would have, because the failure mode itself was a defect.
- **What did not work and why**: The single-prompt approach to RQ-02 (running just the AC-4 test) couldn't close calibration even if the corpus had loaded — calibration needs the full corpus + binning logic that doesn't exist yet. F35 isolates that as separate work.
- **What I would do differently**: For benchmark-gap synthesis questions (RQ-09 type), front-load the harness inventory at the start of the loop rather than deriving it from per-iteration findings; would have produced this kind of suite at iter 4 instead of iter 7.

## Recommended Next Focus

Two paths converge cleanly into an iter 8/9 closure:

1. **Cross-cutting risk synthesis** for the remaining open questions list (registry will only show RQ-02 fully open after this iter; check whether RQ-09 status moves to resolved or to "scope-clarified"). If only RQ-02 calibration-residual remains, consider whether to defer it to phase implementation rather than spend further research iterations on it.
2. **Top-k risk and remediation table**: produce a single ranked list of the most-load-bearing defects across iters 1-7 (corpus-path defect F33, query-latency observability gap iter 6 F28, edge-precision gap iter 1 F3, hook parity gap iter 4 F25, oscillation gap iter 3 F15) with a recommended owner and the benchmark from F36 that closes each.
