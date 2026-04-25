# Iteration 002

## Focus

Second-pass review covering PRs not reviewed in iteration 1, plus adversarial self-check on the three carried P1 findings:

- PR 1 corpus path repair for parity/bench tests.
- PR 6 cache invalidation listener registration scope and duplicate-listener guard.
- PR 7 Claude settings parity test shape and runtime skip behavior.
- PRs 8, 9, and 10 benchmark files for obvious gate/fixture/loop bugs.
- Cross-PR interaction between PR 4 vocabulary unification and PR 5 metrics labels.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/cache/listener-uniqueness.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts`
- `.claude/settings.local.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/scorer-bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.baseline.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`

Validation/evidence checks:

- `stat` confirms the repaired corpus exists at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl`.
- `stat` confirms the legacy spec-subfolder corpus path is missing.
- `stat` confirms `code-graph-query-latency.baseline.json` exists.
- Targeted source reads were used instead of running broad suites; this iteration is a read-only review and did not execute the bench suite.

## Findings

### P0

None.

### P1

#### R2-P1-001 - PR-1 corpus repair missed a live legacy parity test and the requested export contract

Dimension: correctness. PR source: PR-1.

The new corpus path exists, and `python-ts-parity.vitest.ts` now resolves it through `SPECKIT_BENCH_CORPUS_PATH` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:40-41`. However, that constant is a local `const`, not an exported constant. More importantly, another test file still points at the old spec-subfolder corpus path: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts:27-33`. A direct `stat` of that old path returns `No such file or directory`.

Impact: the PR-1 fix is incomplete relative to the iteration contract: not all test references moved off the dead corpus path, and the named constant is not exported for reuse. Running the legacy parity suite still fails before exercising scorer behavior.

Reproduce: run `stat` on `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`; it is missing. Then inspect `tests/legacy/advisor-corpus-parity.vitest.ts:27-33`.

Fix: export a single shared corpus-path constant or helper, repoint the legacy parity test to it, and run both parity suites.

#### R2-P1-002 - PR-9 query-latency bench fail-softs missing baselines and internal bench errors as passing skips

Dimension: correctness. PR source: PR-9.

`runQueryLatencyBench()` catches every thrown error and returns `skip(...)` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:153-154`. The test then treats any skipped report as success at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:164-168`. This catch-all includes not just environment-dependent DB init failures, but also missing baseline JSON, malformed baseline JSON, fixture seeding defects, and sample extraction regressions. For example, the explicit baseline check at `:125-127` is inside the catch-all.

Impact: the PR-9 release gate can pass while the benchmark never validates the baseline or emits samples. That defeats the planned delta-vs-baseline assertion and can hide exactly the regressions PR-9 is meant to catch.

Reproduce: temporarily rename `code-graph-query-latency.baseline.json` and run the PR-9 bench test. The baseline lookup throws, `runQueryLatencyBench()` returns `skipped: true, passed: true`, and the test accepts the skip.

Fix: fail on invariant failures such as missing/malformed baseline, zero samples, or extraction errors. Reserve skip behavior for narrowly identified optional environment failures, and include a machine-readable skip reason class.

#### R2-P1-003 - PR-5 query-latency freshness metric maps `recent` structural context to `absent`

Dimension: correctness. PR sources: PR-4 / PR-5 cross-PR interaction.

`computeFreshness()` returns four local staleness values: `fresh`, `recent`, `stale`, and `unknown` at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:263-272`. PR-5 then maps that value into the PR-4 trust vocabulary for `spec_kit.graph.query_latency_ms` at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:175-177`, but only handles `fresh`, `stale`, and `unknown` explicitly. The remaining `recent` branch falls through to `absent`.

Impact: a graph indexed 5 minutes to 1 hour ago is reported in metrics as `freshness_state=absent`, even though the graph exists and is merely recent. This is a cross-PR vocabulary drift: the label uses the unified PR-4 vocabulary strings, but the mapping gives one valid source state the wrong semantic bucket.

Reproduce: set a code graph file row with `indexed_at` between 5 and 60 minutes old, enable `SPECKIT_METRICS_ENABLED=true`, call `buildContext()`, and inspect `speckitMetrics.snapshot().histograms`; `spec_kit.graph.query_latency_ms` is emitted with `freshness_state=absent`.

Fix: decide whether `recent` should normalize to `live` or `stale` for metric purposes and map it explicitly. Do not use `absent` unless the graph scope has no data.

### P2

None new.

## Non-Findings / Coverage Notes

- PR 6: `skill-advisor-brief.ts` registers `onCacheInvalidation(() => advisorPromptCache.clear())` at module-init scope before exported request helpers. `listener-uniqueness.vitest.ts` clears listeners, imports the module, fires invalidation, and asserts exactly one `clear()` call; duplicate listener registration would produce multiple calls and fail the test.
- PR 7: `settings-driven-invocation-parity.vitest.ts` uses `describe.skipIf(!isClaudeCodeRuntime())`, with Claude detection via `CLAUDE_CODE === '1'` or `CLAUDE_SESSION_ID`. Inside the guarded suite it asserts the nested matcher-group shape, `matcher` string, nested single-element `hooks[]`, no top-level `bash`, command type, command path, and Stop async timeout floor.
- PR 8: parse-latency bench fixtures are explicit repo paths across TypeScript, JavaScript, Python, and bash, and each path is checked with `existsSync` before parsing. The sample loop is bounded by `SAMPLE_COUNT = 20`.
- PR 10: hook-brief signal/noise bench uses the closed `ADVISOR_RUNTIME_VALUES` runtime list and bounded runtime loops. No infinite loop or missing fixture path was obvious in static review.

## Adversarial Self-Check on Iteration 1 P1s

- R1-P1-001 upheld. `startup-brief.ts` still maps `freshness === 'error'` to `graphState = 'missing'` at `:245-246`, then derives `sharedPayload.provenance.trustState` through `trustStateFromGraphState(graph.graphState)` at `:330`. The code comment and user-visible text acknowledge unavailable/probe-crashed semantics, but the transported trust state still collapses through `missing`.
- R1-P1-002 upheld. There is research-registry evidence that a doc scrub grep was planned or previously reported, including claims that promotion doc references returned zero matches. That does not falsify the carried finding because the plan still names `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` in the PR-3 delete target list, and the file remains on disk.
- R1-P1-003 upheld. The collector still stores caller-provided label maps directly in `incrementCounter`, `setGauge`, and `recordHistogram`; `fusion.ts` still emits `process.env.SPECKIT_RUNTIME` and `process.env.SPECKIT_ADVISOR_FRESHNESS` as metric labels; `structural-indexer.ts` still emits `process.env.SPECKIT_RUNTIME` as `runtime`. Closed enum constants exist, but they are not enforced on these production emission paths.

## Verdict-So-Far

Conditional. No P0 blocker found in iteration 2, but three new P1s were added and all three carried P1s were upheld. Open count is now 6 P1 + 1 P2.

## Coverage Map

| PR | Coverage | Result |
|---|---|---|
| PR 1 | New corpus path, legacy parity path, export contract | R2-P1-001 |
| PR 4 | Cross-check against startup trust-state and metric vocabulary | R1-P1-001 upheld; R2-P1-003 |
| PR 5 | Metrics label vocabulary and env label self-check | R1-P1-003 upheld; R2-P1-003 |
| PR 6 | Listener registration site and uniqueness test | No new finding |
| PR 7 | Nested Claude settings parity test and non-Claude skip | No new finding |
| PR 8 | Parse-latency bench fixtures and loop bounds | No new finding |
| PR 9 | Query-latency bench baseline/sample gate | R2-P1-002 |
| PR 10 | Hook-brief bench runtime fixture and loop bounds | No new finding |

Dimensions covered this iteration: correctness, security, traceability, maintainability.

## Next Focus

Iteration 3 should review package scripts and CI inclusion for the new/removed bench files, then check whether R2-P1-001's legacy parity suite is part of the default `vitest` include path or only an explicit/manual target.
