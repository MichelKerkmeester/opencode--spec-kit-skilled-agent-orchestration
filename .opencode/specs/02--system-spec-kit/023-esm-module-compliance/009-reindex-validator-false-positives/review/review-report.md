---
title: "Deep Review Report: Spec 009 Reindex Validator + contextType Migration Fixes"
description: "10-iteration deep review of 13 bug fixes for frontmatter indexing, contextType migration, validator false positives, and DB dedup."
trigger_phrases: ["review report", "009 reindex review", "deep review 009"]
importance_tier: "important"
contextType: "research"
---
# Deep Review Report: Spec 009 Bug Fixes

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **hasAdvisories** | true |
| **Iterations** | 10 |
| **Stop Reason** | max_iterations |
| **P0 Findings** | 0 |
| **P1 Findings** | 8 (unique, after dedup) |
| **P2 Findings** | 5 |
| **Dimensions Covered** | 7/7 |

## 2. Verdict Rationale

**CONDITIONAL** — No blockers (P0=0), but 8 P1 findings require attention before the fixes can be considered fully hardened. The core bug fixes are correct and working, but the migration left inconsistencies in test suites, backward compatibility paths, and documentation claims. None block the v3.1.5.0 release, but should be tracked for remediation.

## 3. P0 Findings

None.

## 4. P1 Findings (Deduplicated)

### P1-1: Parser test suite still encodes old CONTEXT_TYPE_MAP contract
- **Source**: Iteration 002
- **Files**: `mcp_server/tests/memory-parser-extended.vitest.ts`
- **Issue**: Tests still expect `planning→decision` and `bug→discovery` mappings. Running the suite fails on 3 assertions.
- **Impact**: Tests are red. Future changes may regress without noticing.
- **Recommendation**: Update test expectations to match new mappings.

### P1-2: Fallback regex misses single-level spec paths
- **Source**: Iteration 001
- **Files**: `scripts/lib/validate-memory-quality.ts`
- **Issue**: Regex `/[/\\]specs[/\\](.+?[/\\](?:\d{3}-[^/\\]+))/` requires at least `track/NNN-name` nesting. Single-level paths like `specs/001-feature/` don't match.
- **Impact**: Files in single-level spec folders still get `current_spec: unknown` during reindex.
- **Recommendation**: Adjust regex to also match `specs/NNN-name/` without requiring a parent track.

### P1-3: Six contextType mapping locations don't share a single source of truth
- **Source**: Iterations 005, 009
- **Files**: 6 files across scripts/ and mcp_server/
- **Issue**: The same contextType mapping is duplicated in 6 places. The next change requires synchronized edits.
- **Impact**: Future maintenance risk. One missed location creates silent retrieval/decay regressions.
- **Recommendation**: Extract a shared `CONTEXT_TYPE_CANONICAL_MAP` constant importable by all consumers.

### P1-4: Force reindex bypasses dedup, can recreate duplicate churn
- **Source**: Iteration 006
- **Files**: `mcp_server/handlers/save/dedup.ts`
- **Issue**: `force=true` skips both `checkExistingRow` and `checkContentHashDedup`. Each force reindex creates new rows for unchanged files.
- **Impact**: DB grows unbounded with duplicates on repeated force reindexes.
- **Recommendation**: Even with force, check content hash to skip truly unchanged files.

### P1-5: CHECK constraint not applied to existing databases during upgrade
- **Source**: Iteration 003
- **Files**: `mcp_server/lib/search/vector-index-schema.ts`
- **Issue**: The CHECK constraint update only applies to new databases. Existing databases that were created with the old constraint still reject `'planning'` if the table wasn't rebuilt.
- **Impact**: Users upgrading without a full database rebuild hit constraint violations.
- **Recommendation**: Add a schema migration step that detects and updates the CHECK constraint on existing databases.

### P1-6: Missing test coverage for filePath fallback and V12 skip
- **Source**: Iteration 008
- **Files**: `scripts/tests/validate-memory-quality.vitest.ts`
- **Issue**: No tests pass `{ filePath }` to `validateMemoryQualityContent`. The exact reindex path that motivated the fix has no regression test.
- **Impact**: The fix can regress without a failing test.
- **Recommendation**: Add tests with filePath option for V8 fallback and V12 skip behavior.

### P1-7: Documentation claims "0 decision remaining" but consolidated docs still contain embedded frontmatter
- **Source**: Iteration 004
- **Files**: Spec 009 checklist.md, spec.md
- **Issue**: The "0 decision" claim checks only frontmatter in first 20 lines. Some consolidated spec docs embed historical frontmatter blocks deeper in their content.
- **Impact**: Documentation is technically inaccurate. Minor — the embedded blocks are historical content, not active frontmatter.
- **Recommendation**: Narrow the claim to "0 in active frontmatter" or scan full file content.

### P1-8: Legacy `decision`/`discovery` values still pass DB CHECK constraint
- **Source**: Iteration 009
- **Files**: `mcp_server/lib/search/vector-index-schema.ts`
- **Issue**: CHECK constraint includes both old and new values for backward compat. Any code path that bypasses the parser normalization can still store `'decision'`.
- **Impact**: Low — all known save paths go through the parser. But the DB boundary doesn't enforce the canonical set.
- **Recommendation**: Remove `'decision'`/`'discovery'` from CHECK constraint after confirming no direct SQL writes exist.

## 5. P2 Findings (Advisories)

### P2-1: V12 spec-doc skip misses `description.json`
- **Source**: Iteration 001
- **Recommendation**: Add to the known filename list if it should be indexed.

### P2-2: Migration/dedup counts not traceable to committed evidence
- **Source**: Iteration 004
- **Recommendation**: DB operations were ephemeral. Accept as documented best-effort.

### P2-3: Validator per-file filesystem I/O for spec.md reads
- **Source**: Iteration 006
- **Recommendation**: Cache spec.md trigger phrases per spec folder during batch scan.

### P2-4: No shared spec-doc filename registry
- **Source**: Iteration 005
- **Recommendation**: Consolidate `SPEC_DOC_BASENAMES` and `SPEC_DOCUMENT_FILENAMES` into one imported set.

### P2-5: save-quality-gate log message still hardcodes `context_type=decision`
- **Source**: Iteration 009
- **Recommendation**: Update log string to use the actual matched value.

## 6. Dimension Coverage

| Dimension | Iterations | Status |
|-----------|-----------|--------|
| Correctness | 001, 002 | Covered — 5 findings |
| Security | 003 | Covered — 1 finding |
| Traceability | 004 | Covered — 2 findings |
| Maintainability | 005 | Covered — 1 finding |
| Performance | 006 | Covered — 2 findings |
| Reliability | 007 | Covered — 0 new findings |
| Completeness | 008 | Covered — 1 finding |
| Cross-cutting | 009 | Covered — 2 findings |
| Adversarial | 010 | Covered — validated prior findings |

## 7. Convergence

New findings decreased across iterations. By iteration 007 (reliability), no new findings were discovered. Iterations 008-009 found consistency and completeness gaps. Iteration 010 validated all prior findings.

## 8. Recommendation

**Release v3.1.5.0 stands.** The 13 bug fixes are correct and working. The 8 P1 findings are improvement opportunities, not release blockers. Track them for the next patch:
- P1-1 (test fix) and P1-6 (add tests) — quick wins
- P1-3 (shared constant) — moderate refactor
- P1-4 (force reindex dedup) — prevents future DB bloat
- P1-5 (schema migration) — needed for clean upgrades

## 9. Files Reviewed

10 iterations, 14 source files + 41 templates audited across all 7 dimensions. Full iteration files at `review/iterations/iteration-001.md` through `iteration-010.md`.
