---
title: Test Quality Checklist
description: Test adequacy, coverage quality, and anti-pattern detection checklist for identifying unreliable or misleading test suites.
---

# Test Quality Checklist

Test adequacy, coverage quality, and anti-pattern detection checklist for identifying unreliable or misleading test suites.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provide a systematic pass for test defects that reduce confidence in code correctness or mask regressions.

### Core Principle

Tests that cannot fail are worse than no tests. They create false confidence and hide real defects.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:coverage-quality -->
## 2. COVERAGE QUALITY

Flag:
- Test functions that execute code paths without any assertions (assertion-free execution).
- Test suites covering only happy-path scenarios with no error or edge case validation.
- Changed behavior that lacks a corresponding test update or addition.
- New public API surface introduced without any test coverage.
- Snapshot or golden-file tests that auto-pass because the baseline was never updated after behavior changes.

Review prompts:
- "Does every test function contain at least one meaningful assertion?"
- "Are failure modes and boundary conditions tested alongside the happy path?"
- "Do the tests cover the behavior that actually changed in this diff?"

Severity guidance:
- P0 for assertion-free test functions (silently passing tests that verify nothing).
- P1 for changed behavior with no corresponding test update.
- P2 for missing edge case coverage on low-risk paths.
<!-- /ANCHOR:coverage-quality -->

---

<!-- ANCHOR:test-structure -->
## 3. TEST STRUCTURE AND CLARITY

Flag:
- Test functions missing clear Arrange/Act/Assert separation.
- Test names that do not describe the scenario or expected outcome.
- Magic values in test data without comments explaining their significance.
- Multiple unrelated assertions in a single test function.
- Test setup that obscures the behavior under test.

Review prompts:
- "Can a reader determine what this test validates from the name alone?"
- "Is the test data traceable to a specific requirement or edge case?"
- "Would a failure message from this test pinpoint the broken behavior?"

Severity guidance:
- P2 default for structural clarity issues.
- P1 if poor structure makes regression detection unreliable (for example, a multi-assertion test where early failures mask later ones).
<!-- /ANCHOR:test-structure -->

---

<!-- ANCHOR:test-independence -->
## 4. TEST INDEPENDENCE AND RELIABILITY

Flag:
- Tests that depend on execution order or results from prior tests.
- Shared mutable state between test functions without proper reset.
- Tests that rely on wall-clock timing, network availability, or filesystem state.
- Missing cleanup or teardown for resources created during test setup.
- Tests that pass in isolation but fail when run with the full suite (or vice versa).

Review prompts:
- "Can each test run independently in any order and produce the same result?"
- "Does the test rely on external state that could change between runs?"
- "Is shared state properly isolated or reset between test functions?"

Severity guidance:
- P1 for flaky tests or tests with execution-order dependencies.
- P2 for missing teardown or cleanup that does not yet cause observed failures.
<!-- /ANCHOR:test-independence -->

---

<!-- ANCHOR:test-smells -->
## 5. TEST SMELL DETECTION

Flag:
- Tests tightly coupled to implementation details (breaking on safe refactors).
- Over-mocking that replaces the system under test with stubs, testing mock behavior instead of real behavior.
- Conditional logic (if/else, try/catch) inside test functions that creates untested branches.
- Catch blocks inside tests that swallow assertion failures and convert them to passing results.
- Copy-paste duplication across test functions without shared helpers or parameterized tests.

Review prompts:
- "Would a safe refactor (rename, extract method) break this test without changing behavior?"
- "Is this test verifying real system behavior or just mock wiring?"
- "Does any catch block inside a test risk swallowing an assertion error?"

Severity guidance:
- P0 for catch blocks that swallow assertion failures (tests that cannot fail).
- P1 for over-mocking that makes the test unable to detect real defects.
- P2 for implementation coupling or copy-paste duplication.
<!-- /ANCHOR:test-smells -->

---

<!-- ANCHOR:test-pyramid -->
## 6. TEST PYRAMID AWARENESS

Flag:
- Unit tests that require database, network, or filesystem access (should be integration tests).
- End-to-end tests for logic that can be validated at the unit level.
- New external service calls or integrations introduced without integration test coverage.
- Test suite dominated by one level (all unit, all E2E) with no balance.

Review prompts:
- "Is this test at the right level of the test pyramid for what it validates?"
- "Does a new external dependency have at least one integration-level test?"
- "Could this slow integration test be replaced by a faster unit test?"

Severity guidance:
- P2 default for test-level misplacement.
- P1 when wrong test level creates a confidence gap (for example, unit-testing an integration boundary without any integration test).
<!-- /ANCHOR:test-pyramid -->

---

<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- [quick_reference.md](./quick_reference.md) - Baseline review flow and severity output contract.
- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness, performance, KISS, and DRY checks.
- [security_checklist.md](./security_checklist.md) - Security, authz, abuse, and privacy risk checks.
- [solid_checklist.md](./solid_checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture risk prompts.

Overlay portability: pair this baseline with stack-specific test guidance from `sk-code-opencode`, `sk-code-web`, or `sk-code-full-stack`.
<!-- /ANCHOR:related-resources -->
