---
title: "Test quality improvements"
description: "Covers four targeted test quality fixes (timeout hardening, handle leak prevention, tautological test rewrites and duplicate removal) plus a specific test-alignment cleanup in `memory-parser.ts`."
---

# Test quality improvements

## 1. OVERVIEW

Covers four targeted test quality fixes (timeout hardening, handle leak prevention, tautological test rewrites and duplicate removal) plus a specific test-alignment cleanup in `memory-parser.ts`.

Tests are supposed to catch bugs, but some of these tests had their own problems. A few would pass even when the thing they tested was broken, others would leak resources and some were testing the wrong thing entirely. This round of fixes made the tests themselves more trustworthy, because a test suite you cannot trust is worse than no tests at all.

---

## 2. CURRENT REALITY

Four test quality issues were addressed:

**P2a:** `memory-save-extended.vitest.ts` timeout increased from 5000ms to 15000ms (eliminated flaky timeout failures).

**P2b:** `entity-linker.vitest.ts` gained `db.close()` in `afterEach` (prevented file handle leaks).

**P2c:** Four tautological flag tests in `integration-search-pipeline.vitest.ts` were rewritten to test actual behavioral differences instead of testing what they set up.

**P2d:** A duplicate T007 test block was identified as pre-resolved (not present in current file).

**Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in `isMemoryFile()` spec doc detection during the same test-alignment work.

---

## 3. SOURCE FILES

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

---

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Test quality improvements
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 072
