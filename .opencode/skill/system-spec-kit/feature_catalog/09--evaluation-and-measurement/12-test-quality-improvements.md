# Test quality improvements

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)
- [6. PLAYBOOK COVERAGE](#6--playbook-coverage)

## 1. OVERVIEW
Covers four targeted test quality fixes (timeout hardening, handle leak prevention, tautological test rewrites and duplicate removal) plus 18+ test file updates for changed source behavior.

## 2. CURRENT REALITY
Four test quality issues were addressed:

**P2a:** `memory-save-extended.vitest.ts` timeout increased from 5000ms to 15000ms (eliminated flaky timeout failures).

**P2b:** `entity-linker.vitest.ts` gained `db.close()` in `afterEach` (prevented file handle leaks).

**P2c:** Four tautological flag tests in `integration-search-pipeline.vitest.ts` were rewritten to test actual behavioral differences instead of testing what they set up.

**P2d:** A duplicate T007 test block was identified as pre-resolved (not present in current file).

**Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in `isMemoryFile()` spec doc detection. 18+ test files were updated to match changed source behavior (reconsolidation, five-factor-scoring, working-memory, session-cleanup, channel tests, entity tests, extraction-adapter, intent-routing and others). Test count adjusted from 7,027 to 7,003 (24 tests for removed dead-code features were deleted).

---

## 3. IN SIMPLE TERMS
Tests are supposed to catch bugs, but some of these tests had their own problems. A few would pass even when the thing they tested was broken, others would leak resources and some were testing the wrong thing entirely. This round of fixes made the tests themselves more trustworthy, because a test suite you cannot trust is worse than no tests at all.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Added `/z_archive/` exclusion in `isMemoryFile()` during test-alignment fixes |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-save-extended.vitest.ts` | Timeout hardening (5000ms -> 15000ms) |
| `mcp_server/tests/entity-linker.vitest.ts` | Added `db.close()` in `afterEach` to prevent handle leaks |
| `mcp_server/tests/integration-search-pipeline.vitest.ts` | Reworked flag tests to validate behavior deltas |

## 5. SOURCE METADATA
- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Test quality improvements
- Current reality source: feature_catalog.md

## 6. PLAYBOOK COVERAGE
- Mapped to manual testing playbook scenario NEW-072

