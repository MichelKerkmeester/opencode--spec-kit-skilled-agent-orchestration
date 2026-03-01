# S2-B3: Folder-Level Relevance Scoring (PI-A1) -- COMPLETE

## Files Created

1. **`.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts`**
   - New module for DocScore folder-level relevance computation
   - 5 exported functions: `isFolderScoringEnabled`, `computeFolderRelevanceScores`, `lookupFolders`, `enrichResultsWithFolderScores`, `twoPhaseRetrieval`

2. **`.opencode/skill/system-spec-kit/mcp_server/tests/t020-folder-relevance.vitest.ts`**
   - 22 tests across 12 describe blocks, all passing

## Test Count: 22

| ID | Test | Status |
|---|---|---|
| T020-01 | FolderScore formula: `(1/sqrt(M+1)) * SUM(scores)` for known inputs | PASS |
| T020-01b | Single result folder computes correctly | PASS |
| T020-02 | Damping factor: 9-result folder vs 1-result folder | PASS |
| T020-03 | Large folder (100 results, low score) does NOT dominate small high-quality folder | PASS |
| T020-04 | Single folder: all results in one folder returns single entry | PASS |
| T020-05a | Empty results array returns empty map | PASS |
| T020-05b | Results with no matching folderMap entries returns empty map | PASS |
| T020-06 | Mixed folders: 3 folders with different sizes and scores | PASS |
| T020-07 | folderRank ordering: rank 1 = highest FolderScore | PASS |
| T020-08a | Feature flag disabled by default | PASS |
| T020-08b | Feature flag enabled when SPECKIT_FOLDER_SCORING=true | PASS |
| T020-08c | Feature flag disabled for "false" | PASS |
| T020-08d | Feature flag disabled for arbitrary string | PASS |
| T020-09 | Two-phase retrieval: filters to top-K folders only | PASS |
| T020-10 | Two-phase K=1: single folder returned | PASS |
| T020-11a | lookupFolders with mock DB returns correct mapping | PASS |
| T020-11b | lookupFolders with empty IDs returns empty map | PASS |
| T020-12 | enrichResults preserves original fields and adds folder metadata | PASS |
| T020-13a | Two-phase with empty results returns empty array | PASS |
| T020-13b | Two-phase with empty folderScores returns empty array | PASS |
| T020-14 | enrichResults with empty input returns empty array | PASS |
| T020-15 | String IDs converted to numbers for folderMap lookup | PASS |

## Decisions Made

1. **Feature flag uses strict equality check** (`=== 'true'`) rather than `isFeatureEnabled()` from rollout-policy. Reason: the task specifies "default: disabled", whereas `isFeatureEnabled()` treats undefined/empty as enabled (default-on pattern). Strict check ensures opt-in behavior.

2. **Separate module from existing `lib/scoring/folder-scoring.ts`**. The existing module computes folder scores based on recency/importance/activity metadata (re-exported from `@spec-kit/shared`). This new module computes search-time DocScore from query result relevance scores -- a fundamentally different computation.

3. **String-to-number ID coercion**. The codebase uses `id: number | string` throughout search results. The `folderMap` uses `Map<number, string>` per the spec. The implementation coerces string IDs to numbers via `Number()` for lookup compatibility.

4. **No `@ts-nocheck` on the implementation file**. The only TS diagnostic is the pre-existing `better-sqlite3` missing type declaration (TS7016), which affects 30+ files in the codebase. The test file uses `@ts-nocheck` consistent with all other test files in the project.

5. **Two-phase retrieval returns empty when folderScores is empty**. This avoids returning unfiltered results when no folder scoring data is available -- safer default behavior.

## Build Verification

- `npx vitest run tests/t020-folder-relevance.vitest.ts` -- 22/22 tests pass
- `npx tsc --noEmit` -- no new errors introduced (only pre-existing TS7016 for better-sqlite3)
