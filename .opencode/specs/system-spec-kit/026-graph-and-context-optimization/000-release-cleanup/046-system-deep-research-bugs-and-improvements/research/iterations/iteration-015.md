# Iteration 015 — C5: Test suite reliability and flake patterns

## Focus
I audited unit and stress tests under `.opencode/skill/system-spec-kit/mcp_server/` for hidden dependencies on process environment, wall-clock timing, current working directory, and external filesystem state. The pass focused on places where those dependencies can leak across tests or turn CI host noise into false failures.

## Actions Taken
- Enumerated relevant test files with `rg --files .opencode/skill/system-spec-kit/mcp_server`.
- Searched test and stress directories for `process.env`, `Date.now()`, `new Date()`, `setTimeout`, `performance.now`, `tmpdir`, `process.cwd()`, hard-coded `/tmp`, and fixture path patterns.
- Read candidate slices from `tests/memory-save-pipeline-enforcement.vitest.ts`, `tests/envelope.vitest.ts`, `stress_test/session/gate-d-benchmark-session-resume.vitest.ts`, `stress_test/session/gate-d-resume-perf.vitest.ts`, `stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`, `tests/hybrid-search-flags.vitest.ts`, `tests/feature-eval-query-intelligence.vitest.ts`, `tests/runtime-detection.vitest.ts`, and `skill_advisor/tests/daemon-freshness-foundation.vitest.ts`.
- Checked `vitest.config.ts`, `vitest.stress.config.ts`, and `tests/_support/vitest-setup.ts` for suite-level isolation or cleanup helpers.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-015-C5-01 | P1 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts:15` | `REPO_ROOT` is hard-coded to one developer checkout path, and teardown calls `process.chdir(REPO_ROOT)` at `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts:122-124`. CI or another clone path can fail teardown even when the test body passed. | Capture `const originalCwd = process.cwd()` before changing directories, restore that value in `afterEach`/`afterAll`, and avoid developer-specific absolute paths. |
| F-015-C5-02 | P2 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts:176-195` | The stress test asserts absolute latency budgets from `performance.now()` over 80 live calls, with `p50 < 300ms` and `p95 < 500ms`. This makes the result depend on CI machine load, filesystem latency, and scheduler pauses rather than only resume-ladder correctness. | Split correctness from benchmarking: keep source-selection assertions in CI, but gate percentile budgets behind an explicit benchmark env flag or emit them as telemetry without failing ordinary CI. |
| F-015-C5-03 | P2 | `.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:305-319` | Unit tests sleep with real timers and assert elapsed wall-clock latency. Related cases at `.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:332-356` repeat the same pattern. They add avoidable delay and can be affected by timer/fake-timer leakage from neighboring tests. | Replace real sleeps with deterministic injected `startTime` values or use `vi.useFakeTimers()`/`vi.setSystemTime()` locally with cleanup in `afterEach`. |
| F-015-C5-04 | P1 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts:141-152` | The env opt-out test sets `process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED = '1'` but the file only deletes env flags in `beforeEach` at `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts:68-74`. If this test is the last test in the file, the disabled flag can remain for later files in the same worker/process configuration. | Add an `afterEach` that restores a captured env snapshot or wrap env mutation in a helper with `try/finally`. Prefer shared env sandbox helpers for all feature-flag tests. |
| F-015-C5-05 | P2 | `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts:58-76` | `beforeEach` deletes `SPECKIT_MMR`, then the second test sets `process.env.SPECKIT_MMR = 'false'` without an `afterEach` restore. This is order-sensitive and can leak when Vitest isolation changes or when files share a worker. | Restore the previous value in `afterEach`, or use the same snapshot pattern already present in `.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:41-60`. |
| F-015-C5-06 | P2 | `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:33-35` | The fixture root is anchored under `process.cwd()/tmp-test-fixtures/...`, and reset/teardown delete that real workspace path at `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:272-274` and `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:325-326`. A crash leaves repo-local state, and concurrent runs in the same checkout can collide. | Move fixture roots to `fs.mkdtempSync(path.join(os.tmpdir(), ...))`, store the generated path per test/file, and clean it in `afterEach`/`afterAll`. |

## Questions Answered
- Which mcp_server tests rely on mutable `process.env` and where do restores exist or not exist?
- Which tests use wall-clock timing (`Date.now`, `setTimeout`, `performance.now`) as assertions rather than controlled inputs?
- Which fixtures depend on external filesystem state, real checkout paths, or shared temp naming?
- Are there positive patterns to reuse? Yes: `feature-eval-query-intelligence.vitest.ts` snapshots env in `beforeEach` and restores it in `afterEach`; `runtime-detection.vitest.ts` restores env and cwd; `daemon-freshness-foundation.vitest.ts` uses fake timers with `vi.useRealTimers()` cleanup.

## Questions Remaining
- A full follow-on could quantify how many files mutate env without `afterEach` by adding a lint/test utility, then migrating remaining feature-flag tests mechanically.
- The stress suite needs a policy decision: should performance thresholds ever fail CI, or should they be benchmark-only telemetry?

## Next Focus
Follow up on a shared test harness for env, cwd, timers, and temp directories so individual tests stop hand-rolling partial cleanup.
