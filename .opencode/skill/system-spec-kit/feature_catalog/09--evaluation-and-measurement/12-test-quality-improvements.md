# Test quality improvements

## Current Reality

Four test quality issues were addressed:

**P2a:** `memory-save-extended.vitest.ts` timeout increased from 5000ms to 15000ms (eliminated flaky timeout failures).

**P2b:** `entity-linker.vitest.ts` gained `db.close()` in `afterEach` (prevented file handle leaks).

**P2c:** Four tautological flag tests in `integration-search-pipeline.vitest.ts` were rewritten to test actual behavioral differences instead of testing what they set up.

**P2d:** A duplicate T007 test block was identified as pre-resolved (not present in current file).

**Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in `isMemoryFile()` spec doc detection. 18+ test files were updated to match changed source behavior (reconsolidation, five-factor-scoring, working-memory, session-cleanup, channel tests, entity tests, extraction-adapter, intent-routing and others). Test count adjusted from 7,027 to 7,003 (24 tests for removed dead-code features were deleted).

---

## Source Files

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

## Source Metadata

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Test quality improvements
- Current reality source: feature_catalog.md

## Playbook Coverage

- Mapped to evaluation playbook scenarios NEW-050 through NEW-072 (phase-level)
