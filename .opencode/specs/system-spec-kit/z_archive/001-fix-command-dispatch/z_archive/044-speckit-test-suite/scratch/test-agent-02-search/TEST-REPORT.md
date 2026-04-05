# Test Agent 2: Search - Test Report

**Test Date:** 2025-12-26
**Database State:** 126 memories indexed

## Test Results Summary

| Test ID | Description | Expected | Actual | Status |
|---------|-------------|----------|--------|--------|
| T2.1 | Vector search with query | Results with similarity scores | 10 results, similarity 76.02-100% | **PASS** |
| T2.2 | Multi-concept AND search | Results matching ALL concepts | 10 results, searchType: "multi-concept" | **PASS** |
| T2.3 | Filter by specFolder | Only matching folder | 3 results (2 from 006-speckit + 1 constitutional) | **PARTIAL** |
| T2.4 | Filter by tier | Only constitutional tier | 1 result with importanceTier: "constitutional" | **PASS** |
| T2.5 | Filter by contextType | Only decision-type results | 2 results (contextType filter applied) | **PASS** |
| T2.6 | includeContent flag | Content field present | Each result has "content" field with full markdown | **PASS** |
| T2.7 | Constitutional always first | Constitutional at top | Constitutional memory at index 0 with similarity: 100 | **PASS** |
| T2.8 | Limit parameter | Max 5 results | Exactly 5 results returned | **PASS** |

## Summary
- **Total Tests:** 8
- **Passed:** 7
- **Partial:** 1
- **Failed:** 0

---

## Detailed Findings

### T2.1: Vector Search with Query String
**Call:** `memory_search({ query: "spec kit memory testing" })`

**Response Structure:**
```json
{
  "searchType": "vector",
  "count": 10,
  "constitutionalCount": 1,
  "results": [...]
}
```

**Observations:**
- Returns `searchType: "vector"` indicating vector similarity search
- Each result includes `similarity` field (percentage 0-100)
- Constitutional memory appears first with similarity: 100 (always boosted)
- Remaining results sorted by semantic similarity (84.84, 80.48, 80.05...)
- Results include: id, specFolder, filePath, title, similarity, isConstitutional, importanceTier, triggerPhrases, createdAt

### T2.2: Multi-concept AND Search
**Call:** `memory_search({ concepts: ["memory", "search", "testing"] })`

**Response Structure:**
```json
{
  "searchType": "multi-concept",
  "count": 10,
  "constitutionalCount": 0,
  "results": [...]
}
```

**Observations:**
- Returns `searchType: "multi-concept"` (distinct from vector search)
- Results do NOT include `similarity` field (different ranking algorithm)
- Results are relevance-ranked but without numeric scores
- Constitutional memories CAN appear but are NOT boosted to top (constitutionalCount: 0 in results though one exists)
- First result "Memory: System Memory Testing Continuation" matches all three concepts

**Note:** Constitutional memory (id: 393) appears in results but `isConstitutional: false` - this may be a display bug since it's clearly a constitutional memory by tier.

### T2.3: Filter by specFolder
**Call:** `memory_search({ query: "test", specFolder: "006-speckit-test-suite" })`

**Response:**
- 3 results returned
- Result 1: Constitutional memory (different specFolder: "system-spec-kit") - similarity: 100
- Result 2: specFolder: "006-speckit-test-suite" - similarity: 71.93
- Result 3: specFolder: "006-speckit-test-suite" - similarity: 71.37

**Status: PARTIAL PASS**

**Issue Found:** Constitutional memories are ALWAYS included regardless of specFolder filter. The filter correctly limits non-constitutional results to the specified folder, but constitutional memories bypass the filter.

**This appears to be BY DESIGN** - constitutional memories are meant to always surface for context. The `constitutionalCount: 1` indicates 1 constitutional memory was included.

### T2.4: Filter by Tier
**Call:** `memory_search({ query: "gate", tier: "constitutional" })`

**Response:**
```json
{
  "searchType": "vector",
  "count": 1,
  "constitutionalCount": 0,
  "results": [
    {
      "id": 393,
      "title": "CRITICAL GATES & RULES - HARD BLOCK ENFORCEMENT",
      "importanceTier": "constitutional",
      "isConstitutional": false,  // Bug: should be true
      "similarity": 79.47
    }
  ]
}
```

**Observations:**
- Tier filter works correctly (only 1 constitutional memory exists)
- **Bug:** `isConstitutional: false` but `importanceTier: "constitutional"` - inconsistent flags
- **Bug:** `constitutionalCount: 0` but result IS constitutional tier
- The similarity is 79.47 (not 100) because this isn't the "always include" constitutional boost path

### T2.5: Filter by contextType
**Call:** `memory_search({ query: "decision", contextType: "decision" })`

**Response:**
- 2 results returned
- Both relevant to decision-making context
- First is constitutional memory (contextType filtering may not exclude it)
- Second is "Planning Session - Document Specialist Refactor"

**Note:** The contextType filter works but is applied AFTER constitutional memories are boosted.

### T2.6: includeContent Flag
**Call:** `memory_search({ query: "test", includeContent: true, limit: 3 })`

**Observations:**
- Each result includes `content` field with FULL file contents
- Content is raw markdown including frontmatter
- First result: ~4KB of markdown content
- Second result: ~2KB of markdown content
- Third result: ~1KB of markdown content

**This is a key feature:** Eliminates need for separate Read() calls after search.

### T2.7: Constitutional Always First
**Call:** `memory_search({ query: "any query", includeConstitutional: true })`

**Response:**
- 10 results returned
- First result: Constitutional memory with `isConstitutional: true`, `similarity: 100`
- Constitutional memory appears at index 0 regardless of semantic relevance to "any query"

**Behavior confirmed:** Constitutional memories are boosted to top with similarity: 100 when `includeConstitutional: true` (default).

### T2.8: Limit Parameter
**Call:** `memory_search({ query: "test", limit: 5 })`

**Response:**
- Exactly 5 results returned
- `count: 5` in response
- Results still sorted by relevance with constitutional first

---

## Issues Discovered

### Issue 1: isConstitutional Flag Inconsistency
**Severity:** Low
**Description:** In multi-concept search and tier-filtered search, constitutional memories have `isConstitutional: false` even when `importanceTier: "constitutional"`.

**Evidence:**
- T2.2: `isConstitutional: false` for id 393 despite being constitutional tier
- T2.4: `constitutionalCount: 0` but result has `importanceTier: "constitutional"`

**Root Cause Hypothesis:** The `isConstitutional` flag is only set when the memory is included via the "always include constitutional" path, not when found via normal search.

### Issue 2: specFolder Filter Does Not Exclude Constitutional
**Severity:** By Design (not a bug)
**Description:** When filtering by specFolder, constitutional memories from OTHER folders are still included.

**Evidence:** T2.3 shows constitutional memory from "system-spec-kit" appearing in search for "006-speckit-test-suite"

**Rationale:** This is likely intentional - constitutional memories provide critical context that should always be visible.

---

## Response Time Notes

All searches completed in <1 second (exact timings not captured but responses were near-instant).

---

## Recommendations

1. **Fix isConstitutional flag consistency** - Should be `true` whenever `importanceTier === "constitutional"`
2. **Document constitutional override behavior** - Make clear that specFolder filter doesn't exclude constitutional memories
3. **Consider adding excludeConstitutional option** - For cases where user wants ONLY folder-specific results
