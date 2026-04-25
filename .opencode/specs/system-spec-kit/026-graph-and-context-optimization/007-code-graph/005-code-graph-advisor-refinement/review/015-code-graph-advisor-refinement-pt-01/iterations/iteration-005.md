# Iteration 005

## Focus

Test infrastructure, benchmark harness depth, and cross-PR interactions:

- PR 8 Vitest benchmark include and default CI/test behavior.
- PR 8/9/10 benchmark fixture quality, cleanup, env handling, and failure mode.
- PR 9 query-latency baseline tolerances.
- PR 5 metric cardinality recheck against the actual 17 definitions and skill-label cross product.
- PR 4 context/query test assertion tightness after PR 5 metrics emission.
- Adversarial validation of R4-P1-001 and R4-P1-002.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.baseline.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`

Validation run:

- `./mcp_server/node_modules/.bin/vitest run mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts --config mcp_server/vitest.config.ts`: 5 files passed, 31 tests passed.
- Direct `npx vitest ...` failed in this shell with `vitest: command not found`; the package-local binary exists at `mcp_server/node_modules/.bin/vitest`.

## Findings

### P0

None.

### P1

#### R5-P1-001 - Benchmark files are now on the default test path and one parse fixture depends on untracked build output

Dimension: correctness. PR source: PR-8 / PR-10.

`vitest.config.ts` includes `mcp_server/skill-advisor/bench/**/*.bench.ts` in the shared include list at `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:17-22`. The MCP server default test script is `npm run test:core && npm run test:file-watcher`, and `test:core` is plain `vitest run --exclude tests/file-watcher.vitest.ts` at `.opencode/skill/system-spec-kit/mcp_server/package.json:24-25`. So the benchmark suites are not opt-in; they run in the normal package test path and any CI job that calls `npm test`, `npm run test:core`, `npm run check:full`, or the root `test:root` workspace route.

That default inclusion interacts badly with the parse-latency bench fixture list. `code-graph-parse-latency.bench.ts` asserts every fixture path exists at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts:64-67`, and one of those fixtures is `.opencode/skill/system-spec-kit/mcp_server/dist/startup-checks.js` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts:36-38`. The local file exists, which is why the focused run passed, but `git ls-files` for that path returned no tracked file. A clean checkout that runs tests before building `mcp_server/dist` can fail on the fixture existence assertion.

Impact: PR-8's Vitest config change is not minimal for a bench harness. It converts benchmark files into regular tests, adds their wall-clock work to default CI, and makes clean-checkout success depend on generated dist artifacts being present before the test step. If coverage is enabled with this shared config, benchmark files are also in the test run and can skew coverage collection toward harness code.

Reproduce: from a clean checkout without generated `mcp_server/dist/startup-checks.js`, run `npm run test:core --workspace=@spec-kit/mcp-server` or `./mcp_server/node_modules/.bin/vitest run --config mcp_server/vitest.config.ts`; the parse-latency bench reaches its fixture-existence assertion and fails before measuring parse latency.

Fix: remove `mcp_server/skill-advisor/bench/**/*.bench.ts` from the default include and add an explicit `bench:*` script/config, or make the parse fixture source-only by replacing the `dist/startup-checks.js` fixture with a tracked JavaScript source fixture. If benches must stay in default tests, exclude generated `dist` fixtures and document the expected CI build order.

#### R5-P1-002 - Benchmark suites force `SPECKIT_METRICS_ENABLED=true` and do not restore the prior environment

Dimension: correctness. PR source: PR-8 / PR-9 / PR-10.

The parse-latency bench sets `process.env.SPECKIT_METRICS_ENABLED = 'true'` in `beforeAll` and resets only the collector at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts:59-62`; there is no `afterAll` restoring the previous env value. The query-latency harness does the same inside exported `runQueryLatencyBench()` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:101-103`, and its `finally` cleans the DB/temp directory but not the env at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:153-157`. The hook signal/noise bench resets the collector in `afterAll` but still leaves the env override in place at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts:61-66`.

Impact: these benchmark files are now in the default shared Vitest include, and they mutate the process-level feature gate that PR 5 relies on for silent-by-default metrics. The focused run passed, but the harness still creates order-sensitive risk for any later test in the same worker/import graph that expects metrics to remain disabled unless it opted in. This is especially sharp for `runQueryLatencyBench()`, which is exported and can be called by non-bench tests while leaving the env flipped after return.

Reproduce: add a regular Vitest test after importing or invoking `runQueryLatencyBench()` that asserts `isSpeckitMetricsEnabled()` reflects the pre-test env. It will observe the benchmark's forced `true` unless the caller manually restores `process.env.SPECKIT_METRICS_ENABLED`.

Fix: snapshot the prior env value in every bench, restore or delete it in `afterAll`/`finally`, and keep `speckitMetrics.reset()` paired with env restoration. Prefer `vi.stubEnv` plus `vi.unstubAllEnvs` if this project standardizes on Vitest env stubbing.

### P2

#### R5-P2-001 - The signal/noise bench only asserts signal presence and manually emits the metric it claims to verify

Dimension: maintainability. PR source: PR-10.

`hook-brief-signal-noise.bench.ts` defines "signal" as a non-empty rendered string at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts:52-58`, then only builds passing recommendations and asserts `signals > 0` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts:75-81`. It does not include a noisy/null case for non-live freshness, no passing recommendations, sanitization rejection, or excessive token cap behavior. It also manually increments `spec_kit.advisor.recommendation_emitted_total` inside the bench at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts:82-84`, so the final counter assertion proves the bench wrote the counter, not that `renderAdvisorBrief()` or the production advisor path emitted it.

Impact: the bench can pass even if the renderer stops rejecting noise or if the production recommendation-emission metric is disconnected from brief rendering. This is not a runtime blocker, but it weakens PR-10's stated signal/noise coverage and can give false confidence during later hook tuning.

Reproduce: change `renderAdvisorBrief()` so a noisy non-live renderable still returns text, or remove production recommendation emission outside this bench. The current bench can still pass because it checks only positive cases and emits the counter itself.

Fix: add negative fixtures for each documented noise boundary and assert `renderAdvisorBrief()` returns `null`. If the metric contract is part of the benchmark, drive the production scoring/rendering path that emits the metric, or rename this assertion to make clear it verifies collector shape only.

## Baseline and Cardinality Checks

PR 9 baseline tolerance: the stated concern that `p50_pct=50%` lets a 10x regression slip is not supported by the current comparison. The code computes `((observed - base) / base) * 100` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:96-98` and fails when the p50 delta is greater than `50` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:146-150`. With a `50ms` p50 baseline at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.baseline.json:6-11`, a 10x p50 regression to 500ms is a 900 percent delta and fails. The real weakness remains R2-P1-002: setup errors are converted into skipped passing reports at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:153-168`.

PR 5 cardinality: the metric namespace currently defines 17 `spec_kit.*` metrics, not the 16 described in the section comment, at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:502-542`. If runtime and freshness labels are closed to 5 runtimes and 4 trust states, the fixed-label portion is about 126 series, plus roughly `6 * skill_count` from `lane_contribution` and `primary_intent_bonus_applied_total`. With about 50 skills, that is around 426 series; with 200 skills, around 1,326 series. That does not exceed 9,000 by itself. The budget breaks at roughly 1,479 distinct skill IDs, or sooner if env-derived `runtime`/`freshness_state` remain unbounded as described by R1-P1-003. There is still no runtime guard: the collector directly keys labels in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:578-590` and only reports `metricsUniqueSeriesCount` in snapshots at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:626-649`.

## Cross-PR Test Breakage

The two PR-4 test file updates compile and pass in the focused run. The context-handler readiness-crash assertion is tight: it now checks raw freshness `error`, canonical readiness `missing`, and trust state `unavailable` at `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:150-173`. The query-handler test is also tight: it expects the full error response, readiness block, and no query continuation at `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:143-175`.

I did not find evidence that PR 5's metrics emission broke these tests. They mock handler dependencies, do not enable `SPECKIT_METRICS_ENABLED`, and passed together with all three bench files. The residual risk is R5-P1-002: default benches can leave the env gate enabled for other tests if the worker/import order exposes shared process state.

## Adversarial Validation of Iteration-4 Findings

- R4-P1-001 upheld but narrowed. The "200+ skills blows 9000 series" version is too strong; with closed runtime labels, 200 skills is still around 1,326 series. The finding remains valid because `skill_id` is unbounded repo metadata, the collector does not enforce declared label policies, and no runtime cardinality guard rejects or buckets high-cardinality labels.
- R4-P1-002 upheld. The command strings avoid direct user interpolation, but they still resolve the hook target through ambient `git rev-parse --show-toplevel || pwd` and unqualified `node`. I did not find a counterexample in the reviewed files that anchors execution to the trusted settings-file directory.
- R1-P1-003 upheld. Env-derived `runtime` and `freshness_state` still flow from `process.env.SPECKIT_RUNTIME` and `process.env.SPECKIT_ADVISOR_FRESHNESS` in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:320-322`; structural indexing still emits env-derived runtime at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1418-1423`.
- R2-P1-002 upheld. The query benchmark's baseline comparison itself is one-sided and catches large p50 regressions, but harness setup exceptions still become skipped passing reports.

## Verdict-So-Far

Conditional. No P0 found in iteration 5. New count: 2 P1 + 1 P2. Open count becomes 13 P1 + 3 P2 if none of the prior findings have been remediated. The new findings are harness-quality findings, not product-runtime blockers, but R5-P1-001 can break clean CI if default tests run before generated dist artifacts exist.

## Coverage Map

| PR | Coverage | Result |
|---|---|---|
| PR 4 | Context/query handler tests and assertions after metrics PR | No new breakage; focused run passed |
| PR 5 | Cardinality math and env/skill label guard recheck | R1-P1-003 upheld; R4-P1-001 upheld but narrowed |
| PR 8 | Vitest bench include and parse bench fixtures/env | R5-P1-001, R5-P1-002 |
| PR 9 | Query latency harness, baseline, temp DB cleanup, fail-soft behavior | R2-P1-002 upheld; baseline math clarified |
| PR 10 | Hook brief signal/noise bench and metric assertion | R5-P1-002, R5-P2-001 |

Dimensions covered this iteration: correctness, security, traceability, maintainability.

## Next Focus

Iteration 6 should inspect build/dist drift for hook entrypoints and generated artifacts, then verify whether `dist/hooks/claude/*.js` behavior matches TypeScript sources and the settings contract. It should also confirm whether the CI workflow runs `npm test` before or after `npm run build`, because that determines whether R5-P1-001 is a deterministic clean-checkout failure or a fragile-order risk.
