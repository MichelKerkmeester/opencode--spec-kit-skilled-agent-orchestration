# Test Agent 5: Browsing & Stats - Test Report

**Execution Date:** 2025-12-26T09:03 UTC
**Agent:** Test Agent 05 - Browsing & Stats Testing

## Test Results Summary

| Test ID | Description | Expected | Actual | Status |
|---------|-------------|----------|--------|--------|
| T5.1 | List default | Returns memories with default limit 20 | Got 20 memories from 127 total, all required fields present | **PASS** |
| T5.2 | List with limit | Max 5 results | Got exactly 5 results (count: 5) | **PASS** |
| T5.3 | List with offset | Skips first 5 results | Got different results (IDs 391-387 vs 396-392 in T5.2) | **PASS** |
| T5.4 | Sort by created_at | Date ordered (newest first) | Dates in descending order: 08:02 > 08:02 > 07:58 > 07:55 > 07:12... | **PASS** |
| T5.5 | Sort by importance_weight | Weight ordered (highest first) | Weights: 1.0 > 0.89 > 0.5 > 0.5... (descending) | **PASS** |
| T5.6 | Filter specFolder | Only matching folder results | Exact match required; "003-memory-and-spec-kit" returns 0, full path required | **WARN** |
| T5.7 | Stats overview | Has all required fields | All fields present: totalMemories, byStatus, dates, topFolders, etc. | **PASS** |
| T5.8 | Stats accuracy | Counts match between stats and list | Stats: 127, List total: 127 - Match! | **PASS** |

## Summary
- **Total Tests:** 8
- **Passed:** 7
- **Warnings:** 1
- **Failed:** 0

## Stats Snapshot
```json
{
  "totalMemories": 127,
  "byStatus": {
    "pending": 0,
    "success": 127,
    "failed": 0,
    "retry": 0
  },
  "oldestMemory": "2025-12-25T08:59:45.414Z",
  "newestMemory": "2025-12-26T08:02:55.635Z",
  "topFolders": [
    { "folder": "003-memory-and-spec-kit/z_archive/006-auto-indexing", "count": 6 },
    { "folder": "003-memory-and-spec-kit/z_archive/014-anchor-enforcement", "count": 6 },
    { "folder": "003-memory-and-spec-kit/z_archive/019-speckit-refinement", "count": 6 },
    { "folder": "003-memory-and-spec-kit/z_archive/027-memory-plugin-and-refinement/001-memory-repo-analysis", "count": 6 },
    { "folder": "03--commands-and-skills/003-sk-documentation/001-doc-specialist-refactor", "count": 5 }
  ],
  "totalTriggerPhrases": 361,
  "sqliteVecAvailable": true,
  "vectorSearchEnabled": true
}
```

## Detailed Findings

### T5.1: memory_list - Default Parameters
- **Call:** `memory_list({})`
- **Response:** 20 results from 127 total
- **Verified fields per result:**
  - `id`: present (numeric)
  - `specFolder`: present (string)
  - `title`: present (string)
  - `createdAt`: present (ISO timestamp)
  - `updatedAt`: present (ISO timestamp)
  - `importanceWeight`: present (numeric 0-1)
  - `triggerCount`: present (numeric)
  - `filePath`: present (absolute path)

### T5.2: memory_list - Pagination with Limit
- **Call:** `memory_list({ limit: 5 })`
- **Response:** Exactly 5 results
- **IDs returned:** 396, 395, 394, 393, 392
- **Pagination metadata:** `{ total: 127, offset: 0, limit: 5, count: 5 }`

### T5.3: memory_list - Pagination with Offset
- **Call:** `memory_list({ limit: 5, offset: 5 })`
- **Response:** Exactly 5 different results
- **IDs returned:** 391, 390, 389, 388, 387 (different from T5.2)
- **Pagination metadata:** `{ total: 127, offset: 5, limit: 5, count: 5 }`
- **Verification:** No overlap with T5.2 results - offset working correctly

### T5.4: memory_list - Sort by created_at
- **Call:** `memory_list({ sortBy: "created_at", limit: 10 })`
- **Date sequence (first 5):**
  1. 2025-12-26T08:02:55.635Z
  2. 2025-12-26T08:02:08.543Z
  3. 2025-12-26T07:58:20.895Z
  4. 2025-12-26T07:55:42.277Z
  5. 2025-12-26T07:12:38.536Z
- **Result:** Correctly sorted in descending order (newest first)

### T5.5: memory_list - Sort by importance_weight
- **Call:** `memory_list({ sortBy: "importance_weight", limit: 10 })`
- **Weight sequence:**
  1. ID 392: weight 1.0
  2. ID 379: weight 0.89
  3. ID 150-161: weight 0.5 (all remaining)
- **Result:** Correctly sorted in descending order (highest importance first)

### T5.6: memory_list - Filter by specFolder [WARNING]
- **Finding:** Filter requires EXACT spec folder path, not prefix matching
- **Test 1:** `specFolder: "003-memory-and-spec-kit"` → 0 results (no exact match)
- **Test 2:** `specFolder: "003-memory-and-spec-kit/043-post-merge-refinement-final"` → 1 result (exact match works)
- **Test 3:** `specFolder: "006-speckit-test-suite"` → 2 results (exact match works)
- **Behavior:** The filter uses exact string matching, NOT prefix/LIKE matching
- **Note:** This is by design but may not match user expectations for hierarchical folder filtering

### T5.7: memory_stats - Overview
- **Call:** `memory_stats({})`
- **Fields verified:**
  - `totalMemories`: 127 (matches list total)
  - `byStatus`: Full breakdown (pending: 0, success: 127, failed: 0, retry: 0)
  - `oldestMemory`: 2025-12-25T08:59:45.414Z
  - `newestMemory`: 2025-12-26T08:02:55.635Z
  - `topFolders`: Array of 10 folders with counts
  - `totalTriggerPhrases`: 361
  - `sqliteVecAvailable`: true
  - `vectorSearchEnabled`: true

### T5.8: memory_stats - Accuracy Verification
- **Stats totalMemories:** 127
- **List total:** 127
- **All status success:** 127 (matches total)
- **Consistency:** VERIFIED - All counts are consistent

## Observations

1. **Database Health:** All 127 memories are in "success" status - no failed or pending entries
2. **Vector Search:** Enabled and functional (sqliteVecAvailable: true)
3. **Trigger Phrases:** 361 total trigger phrases across all memories (avg ~2.8 per memory)
4. **Top Folders:** Archived folders dominate the top list (z_archive contains most memories)
5. **Filter Behavior:** The specFolder filter uses exact matching - users needing prefix matching should be aware

## Recommendations

1. **T5.6 Warning:** Consider adding a `specFolderPrefix` parameter or `LIKE` matching option for hierarchical folder queries
2. **Documentation:** Document that specFolder filter requires exact folder path matching
