# Test Results: Composite Scoring & Search (Spec 070 - Part 2)

> **Spec:** 070-memory-ranking
> **Run Date:** 2026-01-24T10:27:13.077Z
> **Duration:** 43ms

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 79 |
| Passed | 79 |
| Failed | 0 |
| Pass Rate | 100.0% |

---

## Test Suites

### PASS - Composite Scoring - DEFAULT_WEIGHTS

**2/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should have correct default weights defined | PASS | 0ms | - |
| should have weights that sum to 1.0 | PASS | 0ms | - |

### PASS - Composite Scoring - calculate_recency_score()

**4/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return ~1.0 for just-updated memories | PASS | 0ms | - |
| should return ~0.5 for 10-day-old memories (decay rate 0.10) | PASS | 0ms | - |
| should return 1.0 for constitutional tier (exempt from decay) | PASS | 0ms | - |
| should apply normal decay for other tiers | PASS | 0ms | - |

### PASS - Composite Scoring - get_tier_boost()

**7/7 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return 1.0 for constitutional tier | PASS | 0ms | - |
| should return 1.0 for critical tier | PASS | 0ms | - |
| should return 0.8 for important tier | PASS | 0ms | - |
| should return 0.5 for normal tier | PASS | 0ms | - |
| should return 0.3 for temporary tier | PASS | 0ms | - |
| should return 0.5 for deprecated tier (implementation quirk: || 0.5 fallback) | PASS | 0ms | - |
| should return 0.5 for unknown tier | PASS | 0ms | - |

### PASS - Composite Scoring - calculate_composite_score()

**6/6 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return score in 0-1 range | PASS | 0ms | - |
| should calculate score using all factors | PASS | 0ms | - |
| should cap score at 1.0 | PASS | 0ms | - |
| should produce equal scores for deprecated and normal tier (implementation quirk) | PASS | 0ms | - |
| should accept custom weights | PASS | 0ms | - |
| should handle missing fields gracefully | PASS | 0ms | - |

### PASS - Composite Scoring - apply_composite_scoring()

**4/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should add composite_score to each result | PASS | 0ms | - |
| should sort results by composite_score descending | PASS | 0ms | - |
| should include _scoring breakdown | PASS | 0ms | - |
| should return empty array for empty input | PASS | 0ms | - |

### PASS - Composite Scoring - get_score_breakdown()

**2/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return detailed factor breakdown | PASS | 0ms | - |
| should have contributions that sum to total | PASS | 0ms | - |

### PASS - RRF Fusion - Constants

**2/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should have DEFAULT_K = 60 | PASS | 0ms | - |
| should have CONVERGENCE_BONUS = 0.1 | PASS | 0ms | - |

### PASS - RRF Fusion - fuse_results()

**10/10 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should combine vector and FTS results | PASS | 0ms | - |
| should add rrf_score to each result | PASS | 0ms | - |
| should mark results with in_vector and in_fts flags | PASS | 0ms | - |
| should apply convergence bonus for dual-method matches | PASS | 0ms | - |
| should calculate correct RRF score formula | PASS | 0ms | - |
| should respect limit parameter | PASS | 0ms | - |
| should include vector_rank and fts_rank | PASS | 0ms | - |
| should sort by rrf_score descending | PASS | 0ms | - |
| should handle empty vector results | PASS | 0ms | - |
| should handle empty FTS results | PASS | 0ms | - |

### PASS - RRF Fusion - fuse_scores_advanced()

**5/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return base score as max of semantic and keyword | PASS | 0ms | - |
| should add convergence bonus when both scores > 0 | PASS | 0ms | - |
| should add original term bonus | PASS | 0ms | - |
| should cap score at 1.0 | PASS | 0ms | - |
| should cap original term bonus at 0.2 | PASS | 0ms | - |

### PASS - RRF Fusion - count_original_term_matches()

**4/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should count terms > 3 chars appearing in content | PASS | 0ms | - |
| should ignore terms <= 3 chars | PASS | 0ms | - |
| should be case insensitive | PASS | 0ms | - |
| should return 0 for no matches | PASS | 0ms | - |

### PASS - Hybrid Search - Module Structure

**5/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should export init function | PASS | 0ms | - |
| should export is_fts_available function | PASS | 0ms | - |
| should export hybrid_search function | PASS | 0ms | - |
| should export search_with_fallback function | PASS | 0ms | - |
| should export legacy camelCase aliases | PASS | 1ms | - |

### PASS - Hybrid Search - is_fts_available() (without DB)

**1/1 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return false when database not initialized | PASS | 0ms | - |

### PASS - Hybrid Search - hybrid_search() (without DB)

**1/1 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return empty array when database not initialized | PASS | 0ms | - |

### PASS - Smart Ranking Integration - Full Pipeline

**3/3 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should integrate folder scoring with composite scoring | PASS | 1ms | - |
| should apply composite scoring to search results | PASS | 0ms | - |
| should combine RRF fusion with composite scoring | PASS | 0ms | - |

### PASS - Smart Ranking Integration - Result Ordering

**2/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should prioritize constitutional tier memories | PASS | 0ms | - |
| should give deprecated same tier_boost as normal (implementation quirk) | PASS | 0ms | - |

### PASS - Smart Ranking Integration - Limit/Offset Behavior

**2/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should respect limit in RRF fusion | PASS | 0ms | - |
| should respect limit in folder scoring | PASS | 0ms | - |

### PASS - Access Tracker - calculate_popularity_score()

**5/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return 0 for 0 accesses | PASS | 0ms | - |
| should return ~0.1 for 1 access | PASS | 0ms | - |
| should return ~0.33 for 10 accesses | PASS | 0ms | - |
| should return ~0.67 for 100 accesses | PASS | 0ms | - |
| should cap at 1.0 for very high access counts | PASS | 0ms | - |

### PASS - Edge Cases - Composite Scoring

**4/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should handle null/undefined similarity | PASS | 0ms | - |
| should handle negative similarity | PASS | 0ms | - |
| should handle similarity > 100 | PASS | 0ms | - |
| should handle missing updated_at by using created_at | PASS | 0ms | - |

### PASS - Edge Cases - RRF Fusion

**4/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should handle both empty result sets | PASS | 0ms | - |
| should handle duplicate IDs in same result set | PASS | 0ms | - |
| should handle custom k parameter | PASS | 0ms | - |
| should preserve original result properties | PASS | 0ms | - |

### PASS - Edge Cases - Importance Tiers

**3/3 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should handle all valid tier names | PASS | 0ms | - |
| should return normal tier config for invalid tier names | PASS | 0ms | - |
| should correctly identify tiers excluded from search | PASS | 0ms | - |

### PASS - Performance Tests

**3/3 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should score 1000 memories in under 50ms | PASS | 3ms | - |
| should fuse 500+500 results in under 50ms | PASS | 1ms | - |
| should compute folder scores for 200 folders in under 20ms | PASS | 2ms | - |

---

## Coverage Summary

| Module | Functions Tested |
|--------|------------------|
| `composite-scoring.js` | calculate_recency_score, get_tier_boost, calculate_composite_score, apply_composite_scoring, get_score_breakdown |
| `rrf-fusion.js` | fuse_results, fuse_scores_advanced, count_original_term_matches |
| `hybrid-search.js` | init, is_fts_available, hybrid_search, search_with_fallback |
| `folder-scoring.js` | compute_folder_scores (integration) |
| `importance-tiers.js` | get_tier_config, is_excluded_from_search |
| `access-tracker.js` | calculate_popularity_score |
