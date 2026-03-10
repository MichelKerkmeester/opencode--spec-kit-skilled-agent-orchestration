## F-01: Memory browser (memory_list)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE. Documented page size defaults (20) and max (100) match implementation: `Math.max(1, Math.min(rawLimit || 20, 100))` (`mcp_server/handlers/memory-crud-list.ts:43`). Sort column validation (`created_at`, `updated_at`, `importance_weight`) at line 58-60 matches documented sort options. Filter by `specFolder` WHERE clause at lines 70-73 confirmed. `parent_id IS NULL` chunk exclusion at line 67 confirmed. Pagination hints at lines 108-113 confirmed.
- **Test Gaps:** 1. Listed test file `mcp_server/tests/retry.vitest.ts` does not exist (`feature_catalog/03--discovery/01-memory-browser-memorylist.md:233`). 2. No handler-level test validates edge cases: offset exceeding total count hint (line 111-112), empty specFolder string behavior, or invalid sortBy fallback to `created_at` (line 58-60).
- **Playbook Coverage:** EX-018
- **Recommended Fixes:** 1. Remove stale `retry.vitest.ts` from the feature table, or add the missing test file. 2. Add handler-level tests for offset-beyond-total hint and sortBy fallback path.

## F-02: System statistics (memory_stats)
- **Status:** WARN
- **Code Issues:** 1. Summary text uses `topFolders.length` instead of `totalSpecFolders` (`mcp_server/handlers/memory-crud-stats.ts:229`): when `safeLimit < totalSpecFolders`, the summary reads e.g. "10 folders" instead of the actual total, which may mislead callers about system scale. `totalSpecFolders` is correctly set at line 137 (count mode) and line 216 (scoring mode) but not used in the summary string.
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE. Four ranking strategies (`count`, `recency`, `importance`, `composite`) are validated at line 49-52 and match documented behavior. `excludePatterns` regex construction with error tolerance at lines 120-134 confirmed. Scoring fallback on `computeFolderScores` failure at lines 168-189 confirmed. `fs.statSync` for DB size at lines 101-108 with non-fatal catch confirmed. Tier breakdown aggregation at lines 78-83 confirmed.
- **Test Gaps:** 1. Listed test file `mcp_server/tests/retry.vitest.ts` does not exist (`feature_catalog/03--discovery/02-system-statistics-memorystats.md:235`). 2. No test validates the scoring fallback path triggered by `computeFolderScores` throwing (`mcp_server/handlers/memory-crud-stats.ts:168-189`). 3. No test asserts that `totalSpecFolders` differs from `topFolders.length` when limit truncation occurs.
- **Playbook Coverage:** EX-019
- **Recommended Fixes:** 1. Remove stale `retry.vitest.ts` from the feature table, or add the missing test file. 2. Fix summary string to use `totalSpecFolders` instead of `topFolders.length` for accurate folder count. 3. Add tests for scoring fallback path and limit truncation behavior.

## F-03: Health diagnostics (memory_health)
- **Status:** WARN
- **Code Issues:** 1. `requestId` (generated at line 206) is only included in the `E_SCHEMA_MISSING` error response details (`mcp_server/handlers/memory-crud-health.ts:269`), not in other error paths or the success response. This limits incident correlation for non-schema errors. 2. The `sanitizeErrorForHint` function strips all absolute paths including project-relative ones (`mcp_server/handlers/memory-crud-health.ts:30`), which could make debugging harder when a legitimate project-relative path would help diagnosis.
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE. Two report modes (`full`, `divergent_aliases`) are validated at lines 216-218 and match documentation. FTS5 consistency check comparing `memory_index` vs `memory_fts` counts at lines 350-393 confirmed. `autoRepair` with FTS rebuild at lines 360-384 and orphaned edge cleanup at lines 397-411 confirmed. Alias conflict detection via `summarizeAliasConflicts` at line 258 and divergent alias grouping via `getDivergentAliasGroups` at line 259 confirmed. `SERVER_VERSION` read from package.json at lines 58-78 confirmed.
- **Test Gaps:** 1. Listed test file `mcp_server/tests/retry.vitest.ts` does not exist (`feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:235`). 2. No handler-level test validates the `divergent_aliases` report mode end-to-end, including the `getDivergentAliasGroups` bucketing logic at lines 130-196. 3. No test validates the `autoRepair` orphaned-edge cleanup path at lines 397-411. 4. No test validates the `E_SCHEMA_MISSING` error path with `requestId` inclusion at lines 263-271.
- **Playbook Coverage:** EX-020
- **Recommended Fixes:** 1. Remove stale `retry.vitest.ts` from the feature table, or add the missing test file. 2. Include `requestId` in all error responses, not just `E_SCHEMA_MISSING`. 3. Add handler-level tests for divergent alias report mode, autoRepair orphan cleanup path, and schema-missing error path.
