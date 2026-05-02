# C8 Test Coverage & Quality Audit

Scope: first-party tests and test configuration under `.opencode/skill/system-spec-kit/`, including `mcp_server/tests`, `scripts/tests`, `shared/*.test.ts`, and Vitest/package configuration.

Command snapshot:
- Requested raw count: `find .opencode/skill/system-spec-kit -name '*.test.ts' -o -name '*.spec.ts' | wc -l` => `161`
- First-party count excluding `node_modules`: `.test.ts`/`.spec.ts` => `2`
- First-party count excluding `node_modules`: `.vitest.ts` => `332`
- `__tests__/` directories found: none
- Checked-in Vitest config: `mcp_server/vitest.config.ts`

Method note: coverage-gap analysis used config inspection, exact-match search, import-map heuristics, and a real `npm run typecheck` run. Import-map results were treated as directional and only promoted to findings when reinforced by config or exact search evidence.

### C8-001: Root test pipeline omits large first-party test surfaces
Severity: High
Category: Coverage Gap
Location: package.json:19
Description: The root workspace test entrypoint does not execute the `scripts` workspace suite or any `shared` workspace test command. As a result, large parts of the first-party test inventory are outside the default verification path.
Evidence: `package.json:19-23` defines root `test` as `test:cli`, `test:embeddings`, and `test:mcp`. `scripts/package.json:13` defines a separate `vitest run` command that is not called from root. `shared/package.json:1-14` has no test script at all. First-party inventory shows `332` `.vitest.ts` files but root `npm test` only delegates to the `mcp_server` workspace plus two smoke checks.
Impact: Regressions in `scripts/*` and `shared/*` can bypass the default test gate even when those packages are changed.
Recommended Fix: Make root `npm test` include the `scripts` workspace test command and add a runner-backed `shared` test command, or explicitly document and enforce a multi-workspace verification command in CI.

### C8-002: Test naming and runner coverage are inconsistent enough to hide suites
Severity: High
Category: Test Organization
Location: mcp_server/vitest.config.ts:15
Description: The only checked-in Vitest config includes only `tests/**/*.vitest.ts`, but the repository also contains first-party `.test.ts` and `.vitest.js` files plus compiled test output under `dist/tests`. This makes the on-disk inventory diverge from what the runner actually executes.
Evidence: `mcp_server/vitest.config.ts:15` uses `include: ['tests/**/*.vitest.ts']`. First-party counts show only `2` `.test.ts`/`.spec.ts` files but `332` `.vitest.ts` files outside `node_modules`. `shared/parsing/quality-extractors.test.ts:1` and `shared/parsing/spec-doc-health.test.ts:4` use `.test.ts`. `scripts/tests/progressive-validation.vitest.js:1` and `scripts/tests/tree-thinning.vitest.js:1` are checked-in compiled JS tests. `mcp_server/dist/tests/*` is also populated with compiled test artifacts.
Impact: Audit counts are misleading, some real tests are never runner-discovered, and compiled artifacts inflate the apparent test surface.
Recommended Fix: Standardize on one first-party test extension, expand/exclude Vitest patterns intentionally, and stop checking compiled test artifacts into source test directories.

### C8-003: Current test suite does not typecheck because a test still assumes an old error-envelope shape
Severity: High
Category: Stale Tests
Location: mcp_server/tests/shared-memory-handlers.vitest.ts:129
Description: The current test code dereferences `envelope.data.details.reason` as if `details` were always present, but the typed envelope contract marks `details` optional. `npm run typecheck` fails on this test file in multiple places.
Evidence: `npm run typecheck` exits with code `2` and reports errors at `shared-memory-handlers.vitest.ts:129,179,191,205,227`. The failing lines all read `envelope.data.details.reason`. `mcp_server/lib/response/envelope.ts:78` defines `details?: Record<string, unknown>;`.
Impact: The suite is not in a releasable state, and the test no longer matches the current response typing contract.
Recommended Fix: Update these assertions to narrow `details` safely via a helper/assertion guard, or assert through a typed error-envelope helper that reflects the current API.

### C8-004: Many “deferred” suites are placeholders or static source-string checks, not executable behavior tests
Severity: High
Category: Test Quality
Location: mcp_server/tests/interfaces.vitest.ts:477
Description: A meaningful slice of the suite is labeled deferred and currently provides weak coverage. Some tests are literal no-ops, while others only regex-match source files instead of exercising behavior.
Evidence: `interfaces.vitest.ts:479-493` contains four tests that only do `expect(true).toBe(true)`. `search-archival.vitest.ts:22-58` checks exported names and signatures by reading source text from disk instead of calling code. Exact-match search found `45` deferred test blocks across `mcp_server/tests`.
Impact: These tests can stay green while the real runtime behavior regresses, creating false confidence around DB-backed and integration-heavy areas.
Recommended Fix: Replace placeholder assertions with runnable fixture-backed tests, or mark them `it.skip`/`describe.skip` until a DB harness exists so the suite does not overstate its real coverage.

### C8-005: Error-path tests in `handler-memory-search` only prove “something failed”
Severity: Medium
Category: Missing Assertion Types
Location: mcp_server/tests/handler-memory-search.vitest.ts:45
Description: The validation tests check truthiness of either an error field or `result.isError`, and one test accepts either thrown errors or error responses. They do not verify a stable contract such as exact error code, message, or payload shape.
Evidence: `handler-memory-search.vitest.ts:49`, `:60`, `:72`, and `:79` use `toBeTruthy()` on `getEnvelopeError(payload) || result.isError`. `handler-memory-search.vitest.ts:53-64` explicitly treats both throw and non-throw behavior as success.
Impact: Contract drift in error envelopes, error codes, or throw-vs-return behavior will not be caught by these tests.
Recommended Fix: Assert the exact error mode expected for each case and verify concrete fields such as `code`, `error`, and `details.reason`.

### C8-006: Event-loop race assertions depend on real scheduling jitter
Severity: Medium
Category: Flaky Patterns
Location: mcp_server/tests/context-server.vitest.ts:703
Description: Several callback-order tests depend on real `setTimeout(0)` flushes and a 25 ms timeout race to prove non-blocking behavior.
Evidence: `context-server.vitest.ts:703`, `:736`, `:774`, and `:780` wait on `setTimeout(resolve, 0)`. `context-server.vitest.ts:768-773` uses `Promise.race()` with a 25 ms timeout to determine whether a response remained non-blocking.
Impact: CI load, slower machines, or timer jitter can make these tests intermittently fail even when the implementation is unchanged.
Recommended Fix: Use fake timers or explicit deferred promises under direct test control instead of real clock-based event-loop polling.

### C8-007: Folder-discovery tests mix correctness checks with hard wall-clock performance thresholds
Severity: Medium
Category: Flaky Patterns
Location: mcp_server/tests/folder-discovery-integration.vitest.ts:80
Description: This suite uses real-time scheduling for concurrency and hard performance ceilings for correctness tests.
Evidence: `folder-discovery-integration.vitest.ts:80-89` computes a delay from `Date.now()` and schedules concurrent writes with `setTimeout`. `folder-discovery-integration.vitest.ts:923-942` synchronizes child processes on a shared future timestamp. `folder-discovery-integration.vitest.ts:895-900` asserts `<5ms`, and `:969-975` asserts `<2s` for a 500-folder scan.
Impact: Results vary by host performance and scheduler behavior, making these tests noisy in CI and on developer machines.
Recommended Fix: Split benchmark expectations from correctness tests, use fake clocks for concurrency orchestration, and move hard latency budgets to a dedicated benchmark lane.

### C8-008: High-value module groups still have no direct test coverage
Severity: Medium
Category: Coverage Gap
Location: mcp_server/api/index.ts:1
Description: Several public or boundary-heavy module groups have no direct first-party tests importing them, even though they define important integration surfaces.
Evidence: Import-map analysis found `168` first-party source files with no direct test imports. Uncovered groups include `mcp_server/api/{eval,index,indexing,providers,search,storage}.ts`, `shared/embeddings/providers/{hf-local,openai,voyage}.ts`, and multiple `scripts/memory/*` commands. Exact search found no direct imports of `shared/embeddings/providers/*` in first-party tests. For `mcp_server/tools/*`, the only direct behavioral import is `memory-tools`; `modularization.vitest.ts:70-90` mentions `context-tools`, `causal-tools`, `checkpoint-tools`, and `lifecycle-tools` only as dist file paths for line-count checks.
Impact: Boundary code for APIs, provider adapters, and command entrypoints can regress without targeted tests that exercise their real contracts.
Recommended Fix: Prioritize direct tests for public API wrappers, provider adapters, and CLI/memory entrypoints before expanding lower-level internal coverage.

### C8-009: Shared parsing tests exist, but they are effectively manual scripts outside the workspace test lifecycle
Severity: Medium
Category: Test Organization
Location: shared/parsing/spec-doc-health.test.ts:4
Description: The two shared parsing tests are top-level script files with custom assertion helpers and manual execution instructions instead of runner-managed suites.
Evidence: `shared/parsing/spec-doc-health.test.ts:4` says `Run: npx ts-node shared/parsing/spec-doc-health.test.ts`. `shared/parsing/quality-extractors.test.ts:3-25` and `spec-doc-health.test.ts:11-30` define ad hoc assertion helpers and log `PASS` messages directly. `shared/package.json:1-14` does not define a test command.
Impact: Useful edge-case tests exist but are easy to forget, do not participate in the normal test pipeline, and are hidden by the current Vitest include pattern.
Recommended Fix: Convert these tests to a runner-backed suite in a covered workspace or add a `shared` test command and wire it into root verification.

### C8-010: Some tests assert unrelated sanity checks instead of the behavior under test
Severity: Low
Category: Test Quality
Location: mcp_server/tests/consumption-logger.vitest.ts:591
Description: A few tests contain assertions that are technically true but do not validate the target behavior in a meaningful way.
Evidence: `consumption-logger.vitest.ts:591-603` records a fixed `latency_ms` value, but also asserts `after - before >= 0`, which is always true and unrelated to persistence behavior. The test’s meaningful contract is already the DB assertion on `row.latency_ms`.
Impact: These assertions add noise, make failures less targeted, and can hide where the real value of the test lies.
Recommended Fix: Remove non-diagnostic sanity assertions and keep only behavior-specific checks that would fail for an actual regression.

Additional observation:
- No confirmed first-party tests were found making live `fetch`/Axios/HTTP calls without mocks. The network-adjacent references found in this audit were endpoint string assertions or mocked provider seams, not obvious live network integration tests.
