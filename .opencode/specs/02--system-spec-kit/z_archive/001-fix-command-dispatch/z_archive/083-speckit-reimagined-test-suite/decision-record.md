---
title: "Decision Record: Spec Kit Memory Test Suite Architecture [083-speckit-reimagined-test-suite/decision-record]"
description: "The Spec Kit Memory MCP server requires a comprehensive test suite covering unit, integration, and end-to-end tests. The test framework selection affects developer experience, C..."
trigger_phrases:
  - "decision"
  - "record"
  - "spec"
  - "kit"
  - "memory"
  - "decision record"
  - "083"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Spec Kit Memory Test Suite Architecture

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Test Framework Selection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead |
| **Complexity Score Impact** | +10 (Foundation decision) |

---

### Context

The Spec Kit Memory MCP server requires a comprehensive test suite covering unit, integration, and end-to-end tests. The test framework selection affects developer experience, CI/CD integration, and long-term maintainability. Existing tests in the codebase use Jest, creating a consistency consideration.

### Constraints
- Must support async/await patterns extensively used in the codebase
- Should integrate seamlessly with existing CI/CD pipeline
- Must support mocking of external APIs (Voyage AI, Cohere)
- Should provide clear, readable test output
- Need fast test execution for developer feedback loop

---

### Decision

**Summary**: Use Jest with sqlite3-in-memory for test isolation.

**Details**: Jest will be the primary test runner with its built-in assertion library, mocking capabilities, and coverage reporting. SQLite will be configured to use in-memory databases for each test file, ensuring complete isolation. The `--runInBand` flag will be available for debugging sequential execution.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Jest** | Existing codebase consistency, excellent mocking, snapshot testing, parallel execution | Slower than Vitest, larger footprint | 9/10 |
| Vitest | Faster execution, ESM-native, Jest-compatible API | Would require migration, less mature ecosystem | 7/10 |
| Mocha + Chai | Flexible, long history, many plugins | Requires additional setup for mocking, coverage | 6/10 |
| TAP | Simple, UNIX philosophy, streaming output | Less IDE integration, manual setup needed | 5/10 |

**Why Chosen**: Jest provides consistency with existing tests in the codebase, eliminating the cognitive overhead of maintaining two test frameworks. Its built-in mocking, coverage, and snapshot testing capabilities reduce configuration complexity. The parallel execution model aligns well with our test isolation strategy.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Test suite is required for quality assurance and regression prevention |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives evaluated with trade-offs |
| 3 | **Sufficient?** | PASS | Jest covers all testing needs without additional tools |
| 4 | **Fits Goal?** | PASS | Directly enables quality gates for the MCP server |
| 5 | **Open Horizons?** | PASS | Jest is actively maintained, Vitest migration path exists |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Consistent tooling across all project tests
- Built-in mocking reduces external dependencies
- Parallel test execution speeds CI feedback
- Excellent VS Code integration for debugging

**Negative**:
- Slightly slower than Vitest - Mitigation: Acceptable for our test volume; can migrate later if needed

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Jest deprecation | Medium | Vitest provides drop-in migration path |
| Performance degradation with test growth | Low | Test sharding available for CI |

---

### Implementation

**Affected Systems**:
- `package.json` (test scripts, dependencies)
- `jest.config.js` (configuration)
- All `*.test.js` files

**Rollback**: Replace Jest with Vitest using compatibility mode; minimal code changes required.

---

---

## ADR-002: Test Isolation Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead |
| **Complexity Score Impact** | +15 (Reliability dimension) |

---

### Context

Database-dependent tests can suffer from test pollution, where one test's data affects another. This leads to flaky tests, order-dependent failures, and difficult debugging. The isolation strategy determines test reliability and parallelization capability.

### Constraints
- Tests must be deterministic and repeatable
- Must support Jest's parallel execution model
- Should minimize test setup/teardown overhead
- SQLite is the production database (no containerization needed)
- CI environment has limited resources

---

### Decision

**Summary**: Each test file gets a fresh in-memory SQLite database instance.

**Details**: Before each test file runs, a new `:memory:` SQLite database is created and initialized with the schema. The database instance is passed to the components under test via dependency injection. After the test file completes, the database is automatically garbage collected.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fresh instance per file** | Complete isolation, parallel-safe, fast | Slightly more memory, schema init per file | 9/10 |
| Shared instance with cleanup | Less memory, faster schema init | Risk of pollution, harder to parallelize | 6/10 |
| Docker containers | Production-like, complete isolation | Slow startup, complex CI setup, overkill for SQLite | 4/10 |
| Transaction rollback | Very fast, minimal overhead | Complex for nested transactions, some SQLite limitations | 7/10 |

**Why Chosen**: Fresh in-memory instances provide the strongest isolation guarantee while leveraging SQLite's lightweight nature. The memory overhead is negligible (each empty database is ~1KB), and schema initialization is fast (~10ms). This approach naturally supports Jest's parallel execution without coordination.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Test reliability requires isolation |
| 2 | **Beyond Local Maxima?** | PASS | Four isolation strategies evaluated |
| 3 | **Sufficient?** | PASS | Provides complete isolation without over-engineering |
| 4 | **Fits Goal?** | PASS | Directly addresses test flakiness risk |
| 5 | **Open Horizons?** | PASS | Can migrate to transaction rollback if performance becomes critical |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Zero test pollution possible
- Tests can run in any order
- Full parallelization support
- No cleanup code needed

**Negative**:
- Schema initialized per file (~10ms overhead) - Mitigation: Acceptable overhead; schema is small
- More memory usage - Mitigation: In-memory databases are tiny; GC handles cleanup

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Memory pressure with many test files | Low | SQLite in-memory is efficient; monitor CI memory |
| Schema drift between production and tests | Medium | Single schema source file used by both |

---

### Implementation

**Affected Systems**:
- Test setup utilities (`test-helpers.js`)
- All integration tests
- CI configuration (memory limits)

**Rollback**: Add shared instance mode with `beforeEach` cleanup if memory becomes an issue.

---

---

## ADR-003: Mock vs Real Provider Testing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead, DevOps |
| **Complexity Score Impact** | +20 (External dependency dimension) |

---

### Context

The Spec Kit Memory MCP server integrates with external embedding providers (Voyage AI, Cohere, OpenAI) for vector search functionality. Testing these integrations presents trade-offs between test speed, reliability, and realism. CI environments need fast, deterministic tests while local development benefits from real provider testing.

### Constraints
- CI pipeline must complete in under 5 minutes
- External API calls cost money and have rate limits
- Provider APIs may have downtime affecting test reliability
- Local development needs fast feedback
- Some edge cases only manifest with real embeddings

---

### Decision

**Summary**: Mock external APIs (Voyage, Cohere, OpenAI) in CI; support real provider testing locally with environment flags.

**Details**: All external embedding API calls will be mocked in the default test configuration. Mock responses will be pre-computed from real API calls to ensure realistic vector dimensions and formats. An environment variable `USE_REAL_PROVIDERS=true` will enable real API testing locally for integration verification.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mock external, real local option** | Fast CI, realistic local testing, deterministic | Mock drift possible, maintenance overhead | 8/10 |
| All mocks | Fastest, most deterministic, no API costs | May miss real integration issues | 6/10 |
| All real | Most realistic, catches integration issues | Slow, flaky, costly, rate limits | 4/10 |
| VCR recording | Realistic responses, fast playback | Complex setup, recording management | 7/10 |

**Why Chosen**: This hybrid approach balances CI speed with integration confidence. Mocks provide determinism for automated testing while the real provider option allows developers to verify actual API behavior. VCR recording was considered but adds complexity without significant benefit for our use case.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | External dependencies require testing strategy |
| 2 | **Beyond Local Maxima?** | PASS | Four strategies evaluated |
| 3 | **Sufficient?** | PASS | Covers CI and local needs without over-engineering |
| 4 | **Fits Goal?** | PASS | Enables both fast CI and thorough local testing |
| 5 | **Open Horizons?** | PASS | Can add VCR later if mock drift becomes problematic |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Sub-second embedding tests in CI
- No API costs during automated testing
- Deterministic test results
- Real provider testing available when needed

**Negative**:
- Mocks may drift from real API responses - Mitigation: Periodic real provider test runs; mock refresh schedule
- Two testing modes to maintain - Mitigation: Environment flag keeps it simple

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Mock responses outdated | Medium | Quarterly mock refresh from real API calls |
| Real provider tests forgotten | Low | Document in CONTRIBUTING.md; pre-release checklist |
| API key exposure in tests | High | Never commit keys; use environment variables only |

---

### Implementation

**Affected Systems**:
- Embedding provider modules (`providers/voyage.js`, `providers/openai.js`, `providers/cohere.js`)
- Test fixtures (`__mocks__/`, `fixtures/`)
- CI configuration (ensure `USE_REAL_PROVIDERS` is not set)
- `.env.example` (document test-related variables)

**Rollback**: Remove environment flag; use mocks exclusively.

---

---

## ADR-004: Coverage Thresholds

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead, Product Lead |
| **Complexity Score Impact** | +5 (Quality gate dimension) |

---

### Context

Code coverage thresholds establish minimum quality gates for the test suite. Too high thresholds create maintenance burden and incentivize gaming metrics. Too low thresholds provide insufficient protection. Different test levels (unit, integration, e2e) have different optimal coverage targets.

### Constraints
- Must not create false sense of security
- Should not incentivize low-value tests just for coverage
- Must be achievable with reasonable effort
- Should account for diminishing returns at high coverage levels
- Different components have different testability characteristics

---

### Decision

**Summary**: Set coverage thresholds at 80% unit, 70% integration, 50% e2e.

**Details**: Jest coverage will be configured with per-level thresholds. Unit tests target 80% line and branch coverage. Integration tests target 70% coverage of module interactions. End-to-end tests target 50% coverage of user-facing workflows. Coverage reports will be generated in CI and PRs failing thresholds will be blocked.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **80/70/50 tiered** | Balanced, acknowledges test type differences | Requires configuration per test type | 8/10 |
| 90%+ strict | Maximum coverage, catches more bugs | Diminishing returns, maintenance burden, gaming incentive | 5/10 |
| 60% relaxed | Easy to achieve, low overhead | Insufficient quality gate, allows regressions | 4/10 |
| No thresholds | Maximum flexibility | No quality gate, coverage can silently decline | 3/10 |

**Why Chosen**: The tiered approach acknowledges that unit tests should be comprehensive while integration and e2e tests have higher setup costs and diminishing returns. 80% unit coverage catches most logic errors while leaving room for hard-to-test edge cases. The lower integration and e2e thresholds focus testing effort on critical paths.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Quality gates prevent regression |
| 2 | **Beyond Local Maxima?** | PASS | Four threshold strategies evaluated |
| 3 | **Sufficient?** | PASS | Tiered approach matches test type characteristics |
| 4 | **Fits Goal?** | PASS | Enables quality without excessive burden |
| 5 | **Open Horizons?** | PASS | Thresholds can be adjusted based on experience |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Clear quality gates for PRs
- Prevents coverage regression
- Acknowledges different test type values
- Achievable targets reduce developer friction

**Negative**:
- May still incentivize some low-value tests - Mitigation: Code review emphasis on test quality, not just coverage

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Coverage gaming | Medium | Review test quality, not just metrics |
| Thresholds too low for critical paths | Low | Can set higher thresholds for specific directories |

---

### Implementation

**Affected Systems**:
- `jest.config.js` (coverageThreshold configuration)
- CI pipeline (coverage checks)
- PR merge requirements

**Rollback**: Lower or remove thresholds if they become counterproductive.

---

---

## ADR-005: Test Data Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead |
| **Complexity Score Impact** | +10 (Maintainability dimension) |

---

### Context

Tests require realistic data for meaningful assertions. The strategy for creating and managing test data affects test maintainability, readability, and reliability. Options range from static fixtures to dynamic factories.

### Constraints
- Test data must be self-contained and reproducible
- Should support variations for different test scenarios
- Must not couple tests to specific database state
- Should be easy to understand when reading tests
- Vector embeddings require consistent dimensions (1024 for Voyage, 1536 for OpenAI)

---

### Decision

**Summary**: Use factory functions for test fixtures with sensible defaults and override capabilities.

**Details**: Each entity type (Memory, Checkpoint, Session) will have a factory function that generates valid test data with randomized unique identifiers. Factories accept override parameters for specific test scenarios. Default values will be realistic and cover common cases.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Factory functions** | Flexible, self-documenting, variation support | Requires factory maintenance | 9/10 |
| Static JSON fixtures | Simple, no code needed | Rigid, hard to vary, can become stale | 5/10 |
| Database seeds | Realistic data distribution | Couples tests to seed state, hard to vary | 4/10 |
| Builder pattern | Maximum flexibility, fluent API | Overkill for our data complexity | 7/10 |

**Why Chosen**: Factory functions provide the best balance of flexibility and simplicity. Tests can create data inline with specific overrides, making test intent clear. Factories encapsulate valid data structure, reducing test fragility when schemas evolve.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Tests require data; strategy needed |
| 2 | **Beyond Local Maxima?** | PASS | Four data strategies evaluated |
| 3 | **Sufficient?** | PASS | Factories cover all current needs |
| 4 | **Fits Goal?** | PASS | Enables readable, maintainable tests |
| 5 | **Open Horizons?** | PASS | Can add builder pattern if complexity grows |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Tests are self-documenting (data created where used)
- Easy to create variations for edge cases
- Schema changes only require factory updates
- No external fixture files to manage

**Negative**:
- Factories must be maintained - Mitigation: Single source of truth for each entity type

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Factory drift from real data | Low | Use same validation as production |
| Test data unrealistic | Low | Base defaults on real examples |

---

### Implementation

**Affected Systems**:
- `tests/fixtures/factories.js` (factory functions)
- All test files (import and use factories)

**Rollback**: Add static fixtures alongside factories if needed for specific scenarios.

---

---

## ADR-006: Test Directory Structure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead |
| **Complexity Score Impact** | +5 (Organization dimension) |

---

### Context

Test file organization affects discoverability, maintenance, and the ability to run subsets of tests. The structure should align with the source code organization while supporting different test types.

### Constraints
- Must support running unit, integration, and e2e tests separately
- Should make it easy to find tests for a given source file
- Must work with Jest's default test discovery
- Should scale as the codebase grows

---

### Decision

**Summary**: Co-locate unit tests with source files; separate directories for integration and e2e tests.

**Details**: Unit tests will be placed alongside source files with `.test.js` suffix (e.g., `lib/search/hybrid-search.js` has `lib/search/hybrid-search.test.js`). Integration tests will live in `tests/integration/`. End-to-end tests will live in `tests/e2e/`. Shared test utilities will live in `tests/helpers/`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Co-locate unit, separate int/e2e** | Easy to find unit tests, clear separation by type | Mixed test types in different locations | 8/10 |
| All tests in `__tests__/` | All tests in one place | Disconnected from source, deep nesting | 6/10 |
| All tests co-located | Maximum proximity | Hard to separate test types, cluttered | 5/10 |
| Mirrored `tests/` structure | Clear separation | Duplication of paths, harder to navigate | 6/10 |

**Why Chosen**: Unit tests benefit most from co-location (changed source file → run adjacent test). Integration and e2e tests span multiple modules, making co-location less meaningful. This hybrid approach optimizes for the common workflow.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Organization needed for maintainability |
| 2 | **Beyond Local Maxima?** | PASS | Four structures evaluated |
| 3 | **Sufficient?** | PASS | Supports all test types and workflows |
| 4 | **Fits Goal?** | PASS | Enables easy test discovery and execution |
| 5 | **Open Horizons?** | PASS | Structure can evolve with codebase |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Unit tests immediately visible when editing source
- Easy to run tests by type (`jest tests/integration`)
- Shared utilities centralized

**Negative**:
- Two conventions to remember - Mitigation: Document in CONTRIBUTING.md

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Confusion about which convention to use | Low | Clear documentation and PR review |

---

### Implementation

**Affected Systems**:
- Directory structure
- `jest.config.js` (testMatch patterns)
- CONTRIBUTING.md (testing guidelines)

**Rollback**: Migrate all tests to `__tests__/` if co-location proves problematic.

---

---

## ADR-007: Async Test Patterns

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead |
| **Complexity Score Impact** | +10 (Reliability dimension) |

---

### Context

The Spec Kit Memory codebase is heavily async (database operations, embedding API calls, file I/O). Async tests can be tricky to write correctly, leading to false positives (tests pass but async code fails) or timing-dependent flakiness.

### Constraints
- Must catch async errors reliably
- Should avoid timing-dependent tests
- Must support both Promise and callback patterns
- Should provide clear error messages on failure

---

### Decision

**Summary**: Use async/await exclusively; enforce with ESLint rule; ban done() callbacks.

**Details**: All async tests will use async/await syntax. The ESLint rule `jest/no-done-callback` will be enabled to catch callback-style tests. Tests will use `expect.assertions(n)` for tests with multiple async paths to ensure all assertions run.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **async/await only** | Consistent, readable, catches errors | Requires discipline | 9/10 |
| Allow both async and callbacks | Flexibility | Inconsistent, easy to miss errors | 5/10 |
| Promise.then chains | Works, no async/await needed | Verbose, harder to read | 4/10 |

**Why Chosen**: async/await provides the clearest syntax and automatically catches rejected promises. The ESLint rule enforcement eliminates the common pitfall of forgetting to return a promise or call done(). This consistency makes tests easier to write, read, and debug.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Async code requires async testing strategy |
| 2 | **Beyond Local Maxima?** | PASS | Three patterns evaluated |
| 3 | **Sufficient?** | PASS | async/await handles all our async patterns |
| 4 | **Fits Goal?** | PASS | Reduces false positives and flakiness |
| 5 | **Open Horizons?** | PASS | Standard pattern, widely supported |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Async errors always caught
- Consistent test structure
- Easier to debug failures
- Linting catches mistakes early

**Negative**:
- Legacy callback-style code needs wrapping - Mitigation: promisify utilities available

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Forgotten await | Medium | ESLint rule `@typescript-eslint/no-floating-promises` if using TS |
| Infinite hanging tests | Low | Jest timeout configuration (default 5s) |

---

### Implementation

**Affected Systems**:
- `.eslintrc.js` (jest rules)
- All test files (use async/await)
- `jest.config.js` (timeout configuration)

**Rollback**: Disable ESLint rule if blocking legitimate patterns.

---

---

## ADR-008: Error Scenario Testing Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead |
| **Complexity Score Impact** | +15 (Robustness dimension) |

---

### Context

The MCP server must handle various error scenarios gracefully: database failures, API errors, malformed input, resource exhaustion. Testing these scenarios ensures the system degrades gracefully and provides useful error messages.

### Constraints
- Must test error paths without breaking test isolation
- Should cover MCP protocol error responses
- Must verify error messages are actionable
- Should not rely on actual system failures (disk full, network down)

---

### Decision

**Summary**: Use Jest's mock capabilities to inject failures; test both error detection and error response format.

**Details**: Error scenarios will be tested by mocking dependencies to throw specific errors. Tests will verify both that errors are caught and that the MCP response format is correct (error field, proper status codes). A dedicated `tests/errors/` directory will contain error scenario integration tests.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mock-based error injection** | Controlled, deterministic, fast | May miss real error scenarios | 8/10 |
| Chaos engineering (real failures) | Realistic | Complex setup, slow, hard to reproduce | 5/10 |
| Error code exhaustive testing | Complete coverage | Maintenance burden, many rarely-triggered paths | 6/10 |

**Why Chosen**: Mock-based error injection provides the best balance of control and coverage. We can simulate specific error conditions precisely and verify the system's response. Real chaos engineering is overkill for a local MCP server and would complicate CI.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Error handling is critical for reliability |
| 2 | **Beyond Local Maxima?** | PASS | Three strategies evaluated |
| 3 | **Sufficient?** | PASS | Mock injection covers key error paths |
| 4 | **Fits Goal?** | PASS | Verifies graceful degradation |
| 5 | **Open Horizons?** | PASS | Can add chaos testing later if needed |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Deterministic error testing
- Can test rare error conditions
- Fast execution
- Verifies error response format

**Negative**:
- May miss emergent error behaviors - Mitigation: Monitor production errors; add tests for observed failures

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Mock doesn't match real error | Medium | Base mocks on observed real errors |
| Error path coverage gaps | Low | Track error path coverage separately |

---

### Implementation

**Affected Systems**:
- Error handling modules
- MCP protocol response formatting
- `tests/errors/` directory
- Mock utilities for common failure modes

**Rollback**: N/A - error testing is additive.

---

---

## ADR-009: Snapshot Testing Policy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead |
| **Complexity Score Impact** | +5 (Maintainability dimension) |

---

### Context

Jest provides snapshot testing for comparing complex outputs against saved baselines. While useful for UI testing, snapshot tests can be problematic for data structures (frequent updates, unclear failures). A policy is needed to guide appropriate snapshot test usage.

### Constraints
- Snapshot tests should not become approval rubber-stamps
- Must provide value beyond regular assertions
- Should not create excessive Git churn
- Must be maintainable by developers who didn't write them

---

### Decision

**Summary**: Use snapshots only for MCP protocol response structures; require inline snapshots for small outputs.

**Details**: Snapshot testing will be permitted for verifying MCP JSON-RPC response structures where the exact format matters. Inline snapshots (`.toMatchInlineSnapshot()`) are required for outputs under 20 lines. External snapshot files are permitted only for larger structures. Snapshots of volatile data (timestamps, random IDs) must use property matchers.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Limited policy with inline preference** | Balanced, readable, maintainable | Requires judgment calls | 8/10 |
| Allow all snapshots | Easy to write, catches regressions | Brittle, rubber-stamp updates, unclear failures | 4/10 |
| Ban all snapshots | Forces explicit assertions | Verbose for complex structures | 6/10 |

**Why Chosen**: Snapshots are genuinely useful for verifying protocol response structures where the exact JSON format matters. The inline snapshot preference keeps expectations visible in the test file. Property matchers handle volatile data elegantly.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Protocol response format verification needed |
| 2 | **Beyond Local Maxima?** | PASS | Three policies evaluated |
| 3 | **Sufficient?** | PASS | Policy covers legitimate use cases |
| 4 | **Fits Goal?** | PASS | Enables useful snapshots while preventing abuse |
| 5 | **Open Horizons?** | PASS | Can adjust policy based on experience |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Protocol response format verified automatically
- Inline snapshots are self-documenting
- Volatile data handled properly

**Negative**:
- Judgment required for when to use snapshots - Mitigation: Code review, policy documentation

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Snapshot abuse | Low | PR review, ESLint rule for external snapshots |
| Snapshot churn | Low | Property matchers for volatile data |

---

### Implementation

**Affected Systems**:
- Test style guide (CONTRIBUTING.md)
- PR review checklist
- ESLint plugin for snapshot rules (optional)

**Rollback**: Remove or restrict snapshot tests if they become problematic.

---

---

## ADR-010: Test Performance Benchmarks

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead, DevOps |
| **Complexity Score Impact** | +10 (CI/CD dimension) |

---

### Context

Test suite execution time directly impacts developer productivity and CI costs. Slow tests discourage running tests frequently. Performance benchmarks ensure the test suite remains fast as it grows.

### Constraints
- Total CI test time should be under 5 minutes
- Individual unit tests should complete in under 100ms
- Integration tests may take up to 1 second each
- E2E tests may take up to 5 seconds each
- Developers should be able to run relevant tests in under 30 seconds locally

---

### Decision

**Summary**: Set performance budgets: 5-minute total CI, 100ms unit, 1s integration, 5s e2e; monitor with CI timing reports.

**Details**: Jest will be configured to report test timing. CI will fail if total time exceeds 5 minutes. Individual slow tests (>100ms unit, >1s integration) will be flagged in CI output for investigation. A quarterly review will identify optimization opportunities.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Budgets with monitoring** | Catches degradation early, enforces limits | Requires monitoring setup | 8/10 |
| No performance tracking | Simple | Suite can silently slow down | 3/10 |
| Strict per-test limits | Prevents any slow tests | May be too rigid, blocks legitimate slow tests | 6/10 |

**Why Chosen**: Performance budgets with monitoring provide early warning of degradation while allowing flexibility for legitimately slower tests. The quarterly review process ensures continuous optimization without creating daily friction.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fast tests enable developer productivity |
| 2 | **Beyond Local Maxima?** | PASS | Three approaches evaluated |
| 3 | **Sufficient?** | PASS | Budgets and monitoring cover needs |
| 4 | **Fits Goal?** | PASS | Maintains fast feedback loop |
| 5 | **Open Horizons?** | PASS | Budgets can be adjusted as suite grows |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Fast feedback loop maintained
- Slow tests identified early
- CI costs controlled

**Negative**:
- May need to optimize or skip slow tests - Mitigation: Use `--testPathIgnorePatterns` for slow tests in quick runs

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Budget too tight | Low | Budgets based on current performance with 2x headroom |
| Slow test creep | Medium | Quarterly review, CI flagging |

---

### Implementation

**Affected Systems**:
- `jest.config.js` (reporters, timeout)
- CI pipeline (timing checks, reporting)
- Quarterly review calendar item

**Rollback**: Remove timing checks if they create false failures.

---

---

## ADR-011: Embedding Vector Handling in Tests

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, Test Lead |
| **Complexity Score Impact** | +15 (Domain-specific dimension) |

---

### Context

Spec Kit Memory uses vector embeddings (1024-dimensional for Voyage, 1536 for OpenAI) for semantic search. Tests involving embeddings must handle these large vectors efficiently while maintaining meaningful assertions about similarity and search results.

### Constraints
- Cannot store full 1024/1536-dimensional vectors in test fixtures (too large)
- Need to test similarity calculations meaningfully
- Must verify embedding provider integration works
- Search relevance testing requires controlled vector relationships

---

### Decision

**Summary**: Use pre-computed embeddings for known test phrases; generate deterministic pseudo-embeddings for isolation tests.

**Details**: A set of 20 canonical test phrases will have their real embeddings pre-computed and stored in fixtures. These enable realistic similarity testing. For isolation tests not requiring semantic meaning, deterministic pseudo-embeddings will be generated from input hashes (consistent but not semantically meaningful).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hybrid: real for semantic, pseudo for isolation** | Meaningful similarity tests, fast isolation tests | Two embedding sources to maintain | 9/10 |
| All real embeddings | Most realistic | Slow, API-dependent, large fixtures | 5/10 |
| All pseudo-embeddings | Fast, deterministic | Can't test real similarity | 4/10 |
| Reduced dimensionality | Smaller fixtures | Loses precision, harder to debug | 6/10 |

**Why Chosen**: The hybrid approach allows meaningful semantic tests (verifying that similar content actually has high cosine similarity) while keeping isolation tests fast and deterministic. The canonical phrase set is small enough to pre-compute once and commit.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Embedding handling is core to the system |
| 2 | **Beyond Local Maxima?** | PASS | Four strategies evaluated |
| 3 | **Sufficient?** | PASS | Covers semantic and isolation testing needs |
| 4 | **Fits Goal?** | PASS | Enables meaningful similarity testing |
| 5 | **Open Horizons?** | PASS | Can expand canonical set as needed |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Meaningful similarity assertions possible
- Fast isolation tests
- Deterministic pseudo-embeddings for debugging

**Negative**:
- Two embedding generation paths - Mitigation: Clear documentation on when to use each

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Canonical embeddings become stale | Low | Include embedding model version in fixtures |
| Pseudo-embeddings mask bugs | Medium | Use real embeddings for similarity-critical tests |

---

### Implementation

**Affected Systems**:
- `tests/fixtures/embeddings/` (canonical phrase embeddings)
- `tests/helpers/pseudo-embedding.js` (deterministic generator)
- Similarity test files

**Rollback**: Switch to all pseudo-embeddings if fixture management becomes problematic.

---

---

## ADR-012: CI Integration and Reporting

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Team, DevOps Lead |
| **Complexity Score Impact** | +10 (Infrastructure dimension) |

---

### Context

The test suite must integrate with CI/CD pipelines to provide automated quality gates. The integration should provide clear feedback on failures, track coverage trends, and support parallel execution for speed.

### Constraints
- Must work with GitHub Actions (primary CI)
- Should provide actionable failure information
- Coverage reports should be accessible and trackable
- Should support test sharding for parallelization
- Must not add excessive CI minutes cost

---

### Decision

**Summary**: GitHub Actions workflow with Jest JUnit reporter, Codecov coverage uploads, and optional test sharding.

**Details**: The CI workflow will run Jest with JUnit XML output for GitHub's test summary integration. Coverage reports will be uploaded to Codecov for trend tracking and PR annotations. Test sharding will be available via matrix strategy for when the suite grows large enough to benefit.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **GitHub Actions + Codecov** | Native integration, good UX, trend tracking | Codecov dependency | 8/10 |
| GitHub Actions only | No external deps | No coverage trends, basic reporting | 6/10 |
| CircleCI | Powerful, good test splitting | Different ecosystem, migration cost | 5/10 |
| Self-hosted runner | Full control, no minutes limit | Maintenance burden, infrastructure cost | 4/10 |

**Why Chosen**: GitHub Actions is already in use for the project. The JUnit reporter provides excellent test failure display in PRs. Codecov is free for open source and provides valuable coverage trend visualization without significant lock-in.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | CI integration required for quality gates |
| 2 | **Beyond Local Maxima?** | PASS | Four options evaluated |
| 3 | **Sufficient?** | PASS | Covers reporting, coverage, and scaling needs |
| 4 | **Fits Goal?** | PASS | Provides automated quality enforcement |
| 5 | **Open Horizons?** | PASS | Can switch coverage tool if needed |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Clear test failure display in PRs
- Coverage trends tracked over time
- PR coverage annotations help reviewers
- Sharding available when needed

**Negative**:
- Codecov dependency - Mitigation: Coverage data also stored as artifacts; can switch tools

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Codecov outage | Low | Tests still run; coverage artifact backup |
| CI minutes exhaustion | Low | Monitor usage; optimize slow tests |

---

### Implementation

**Affected Systems**:
- `.github/workflows/test.yml` (CI workflow)
- `jest.config.js` (JUnit reporter configuration)
- `codecov.yml` (coverage configuration)

**Rollback**: Remove Codecov integration; use artifact-only coverage reports.

---

---

## ADR Index

| ADR | Title | Status | Date | Deciders |
|-----|-------|--------|------|----------|
| ADR-001 | Test Framework Selection | Accepted | 2026-02-01 | Architecture Team, Test Lead |
| ADR-002 | Test Isolation Strategy | Accepted | 2026-02-01 | Architecture Team, Test Lead |
| ADR-003 | Mock vs Real Provider Testing | Accepted | 2026-02-01 | Architecture Team, Test Lead, DevOps |
| ADR-004 | Coverage Thresholds | Accepted | 2026-02-01 | Architecture Team, Test Lead, Product Lead |
| ADR-005 | Test Data Strategy | Accepted | 2026-02-01 | Architecture Team, Test Lead |
| ADR-006 | Test Directory Structure | Accepted | 2026-02-01 | Architecture Team, Test Lead |
| ADR-007 | Async Test Patterns | Accepted | 2026-02-01 | Architecture Team, Test Lead |
| ADR-008 | Error Scenario Testing Strategy | Accepted | 2026-02-01 | Architecture Team, Test Lead |
| ADR-009 | Snapshot Testing Policy | Accepted | 2026-02-01 | Architecture Team, Test Lead |
| ADR-010 | Test Performance Benchmarks | Accepted | 2026-02-01 | Architecture Team, Test Lead, DevOps |
| ADR-011 | Embedding Vector Handling in Tests | Accepted | 2026-02-01 | Architecture Team, Test Lead |
| ADR-012 | CI Integration and Reporting | Accepted | 2026-02-01 | Architecture Team, DevOps Lead |

---

## Session Decision Log

> **Purpose**: Track all gate decisions made during this session for audit trail and learning.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| 18:30 | Framework Selection | PASS | HIGH | 0.10 | Jest consistency with existing codebase |
| 18:30 | Isolation Strategy | PASS | HIGH | 0.15 | In-memory SQLite is lightweight and deterministic |
| 18:30 | Provider Testing | PASS | HIGH | 0.20 | Hybrid approach balances speed and realism |
| 18:30 | Coverage Thresholds | PASS | MEDIUM | 0.25 | Industry standard thresholds with tier adjustment |

**Log Instructions**:
- Record each gate decision as it occurs during the session
- Include both PASS and BLOCK decisions for completeness
- Link to relevant ADR if decision resulted in new architecture record

---

<!--
Level 3+ Decision Record
Document significant technical decisions
One ADR per major decision
Includes Session Decision Log for audit trail
12 ADRs covering test suite architecture
-->
