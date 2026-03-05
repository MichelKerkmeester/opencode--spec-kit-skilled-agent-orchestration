# Tech Debt: test-memory-quality-lane.js Environment Dependency

**Date:** 2026-02-23
**Severity:** Low
**File:** `.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js`
**Also documented in:** `implementation-summary.md` (Known Limitations section)

## Problem

`test-memory-quality-lane.js` expects benchmark fixtures under the active phase's scratch path. This creates fragile coupling between the test script and the phase folder state:

- The script assumes a specific directory structure exists at runtime
- If the phase folder is archived, moved, or the scratch directory is cleaned, the test breaks
- The test is not self-contained and cannot run in isolation

## Impact

- Test will fail in environments where the phase scratch path doesn't exist
- Cannot be included in CI/CD without environment setup
- Future phase folders won't automatically provide the expected fixtures

## Suggested Fix

Refactor to use self-contained test fixtures bundled alongside the test file, or parameterize the fixture path via an environment variable with a sensible default fallback.

## Priority

P2 - Not blocking any current work. Track for future cleanup when the test infrastructure is next modified.
