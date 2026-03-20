# 018 — Memory Save Quality: Root Cause Fixes

## Problem

After Sprint 1 implementation (6 P0/P1 pipeline fixes), a `/memory:save` produced a memory file scoring 88/100 but with 10 structural quality issues. Manual review traced them to systemic bugs in the `generate-context.js` backend: redundant decision rendering, wrong session status, false-positive blocker detection, generic filler patterns, noisy trigger phrases, file path contamination, and over-aggressive tree thinning.

## Scope

8 backend code fixes in the generate-context script extractors — no template changes.

| # | Issue | Root Cause | Severity |
|---|-------|-----------|----------|
| 1 | Decision CONTEXT = RATIONALE = CHOSEN | Single `rationale` variable assigned to all 3 fields | Medium |
| 2 | Session status "IN_PROGRESS 23%" when complete | `nextSteps` consumed by normalizer, losing top-level field | Medium |
| 3 | B6 decision text shown as "Blocker" | `extractBlockers()` matches "error"/"problem"/"failed" too broadly | Medium |
| 4 | Generic "Common Patterns" filler | `extractCodePatterns()` keyword matching too generic | Low |
| 5 | Noisy trigger phrases | `filterTechStopWords()` too permissive, relaxed mode bypasses filter | Low |
| 6 | key_files contain embedded descriptions | Separator parsing only handles ` - ` (hyphen) | Low |
| 7 | All 10 files merged into `(merged-small-files)` | `memoryThinThreshold: 300` too aggressive | Low |
| 8 | Only 1 conversation message captured | JSON mode doesn't synthesize from structured data | Low |

## Out of Scope

- Template changes
- New extractors
- Pipeline stage modifications
- MCP server changes

## Success Criteria

- All 8 root causes fixed
- 106 existing tests pass with zero regressions
- Golden test updated for intentional behavior change (Fix 5)
- Two independent ultra-think reviews pass all fixes
