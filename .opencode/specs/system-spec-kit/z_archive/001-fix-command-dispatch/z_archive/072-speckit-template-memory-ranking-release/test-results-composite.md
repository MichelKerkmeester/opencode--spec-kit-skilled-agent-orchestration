# Test Results: Composite Scoring & Search (Spec 070 - Part 2)

> **Spec:** 070-memory-ranking
> **Run Date:** 2026-03-08T20:21:49.967Z
> **Duration:** 40ms

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 79 |
| Passed | 0 |
| Failed | 79 |
| Pass Rate | 0.0% |

---

## Test Suites

### FAIL - Composite Scoring - DEFAULT_WEIGHTS

**0/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should have correct default weights defined | FAIL | 10ms | Cannot read properties of undefined (reading 'DEFAULT_WEIGHT |
| should have weights that sum to 1.0 | FAIL | 0ms | Cannot read properties of undefined (reading 'DEFAULT_WEIGHT |

### FAIL - Composite Scoring - calculate_recency_score()

**0/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return ~1.0 for just-updated memories | FAIL | 1ms | Cannot read properties of undefined (reading 'calculate_rece |
| should return ~0.5 for 10-day-old memories (decay rate 0.10) | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_rece |
| should return 1.0 for constitutional tier (exempt from decay) | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_rece |
| should apply normal decay for other tiers | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_rece |

### FAIL - Composite Scoring - get_tier_boost()

**0/7 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return 1.0 for constitutional tier | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_boost |
| should return 1.0 for critical tier | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_boost |
| should return 0.8 for important tier | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_boost |
| should return 0.5 for normal tier | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_boost |
| should return 0.3 for temporary tier | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_boost |
| should return 0.5 for deprecated tier (implementation quirk: || 0.5 fallback) | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_boost |
| should return 0.5 for unknown tier | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_boost |

### FAIL - Composite Scoring - calculate_composite_score()

**0/6 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return score in 0-1 range | FAIL | 1ms | Cannot read properties of undefined (reading 'calculate_comp |
| should calculate score using all factors | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |
| should cap score at 1.0 | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |
| should produce equal scores for deprecated and normal tier (implementation quirk) | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |
| should accept custom weights | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |
| should handle missing fields gracefully | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |

### FAIL - Composite Scoring - apply_composite_scoring()

**0/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should add composite_score to each result | FAIL | 0ms | Cannot read properties of undefined (reading 'apply_composit |
| should sort results by composite_score descending | FAIL | 0ms | Cannot read properties of undefined (reading 'apply_composit |
| should include _scoring breakdown | FAIL | 0ms | Cannot read properties of undefined (reading 'apply_composit |
| should return empty array for empty input | FAIL | 0ms | Cannot read properties of undefined (reading 'apply_composit |

### FAIL - Composite Scoring - get_score_breakdown()

**0/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return detailed factor breakdown | FAIL | 0ms | Cannot read properties of undefined (reading 'get_score_brea |
| should have contributions that sum to total | FAIL | 0ms | Cannot read properties of undefined (reading 'get_score_brea |

### FAIL - RRF Fusion - Constants

**0/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should have DEFAULT_K = 60 | FAIL | 1ms | Cannot read properties of undefined (reading 'DEFAULT_K') |
| should have CONVERGENCE_BONUS = 0.1 | FAIL | 0ms | Cannot read properties of undefined (reading 'CONVERGENCE_BO |

### FAIL - RRF Fusion - fuse_results()

**0/10 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should combine vector and FTS results | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should add rrf_score to each result | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should mark results with in_vector and in_fts flags | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should apply convergence bonus for dual-method matches | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should calculate correct RRF score formula | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should respect limit parameter | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should include vector_rank and fts_rank | FAIL | 1ms | Cannot read properties of undefined (reading 'fuse_results') |
| should sort by rrf_score descending | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should handle empty vector results | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should handle empty FTS results | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |

### FAIL - RRF Fusion - fuse_scores_advanced()

**0/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return base score as max of semantic and keyword | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_scores_ad |
| should add convergence bonus when both scores > 0 | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_scores_ad |
| should add original term bonus | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_scores_ad |
| should cap score at 1.0 | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_scores_ad |
| should cap original term bonus at 0.2 | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_scores_ad |

### FAIL - RRF Fusion - count_original_term_matches()

**0/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should count terms > 3 chars appearing in content | FAIL | 1ms | Cannot read properties of undefined (reading 'count_original |
| should ignore terms <= 3 chars | FAIL | 0ms | Cannot read properties of undefined (reading 'count_original |
| should be case insensitive | FAIL | 1ms | Cannot read properties of undefined (reading 'count_original |
| should return 0 for no matches | FAIL | 0ms | Cannot read properties of undefined (reading 'count_original |

### FAIL - Hybrid Search - Module Structure

**0/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should export init function | FAIL | 0ms | Cannot read properties of undefined (reading 'init') |
| should export is_fts_available function | FAIL | 10ms | Cannot read properties of undefined (reading 'is_fts_availab |
| should export hybrid_search function | FAIL | 0ms | Cannot read properties of undefined (reading 'hybrid_search' |
| should export search_with_fallback function | FAIL | 0ms | Cannot read properties of undefined (reading 'search_with_fa |
| should export legacy camelCase aliases | FAIL | 0ms | Cannot read properties of undefined (reading 'isFtsAvailable |

### FAIL - Hybrid Search - is_fts_available() (without DB)

**0/1 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return false when database not initialized | FAIL | 0ms | Cannot read properties of undefined (reading 'is_fts_availab |

### FAIL - Hybrid Search - hybrid_search() (without DB)

**0/1 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return empty array when database not initialized | FAIL | 2ms | Cannot read properties of undefined (reading 'hybrid_search' |

### FAIL - Smart Ranking Integration - Full Pipeline

**0/3 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should integrate folder scoring with composite scoring | FAIL | 1ms | Cannot read properties of undefined (reading 'compute_folder |
| should apply composite scoring to search results | FAIL | 0ms | Cannot read properties of undefined (reading 'apply_composit |
| should combine RRF fusion with composite scoring | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |

### FAIL - Smart Ranking Integration - Result Ordering

**0/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should prioritize constitutional tier memories | FAIL | 0ms | Cannot read properties of undefined (reading 'apply_composit |
| should give deprecated same tier_boost as normal (implementation quirk) | FAIL | 0ms | Cannot read properties of undefined (reading 'apply_composit |

### FAIL - Smart Ranking Integration - Limit/Offset Behavior

**0/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should respect limit in RRF fusion | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should respect limit in folder scoring | FAIL | 0ms | Cannot read properties of undefined (reading 'compute_folder |

### FAIL - Access Tracker - calculate_popularity_score()

**0/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return 0 for 0 accesses | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_popu |
| should return ~0.1 for 1 access | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_popu |
| should return ~0.33 for 10 accesses | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_popu |
| should return ~0.67 for 100 accesses | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_popu |
| should cap at 1.0 for very high access counts | FAIL | 1ms | Cannot read properties of undefined (reading 'calculate_popu |

### FAIL - Edge Cases - Composite Scoring

**0/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should handle null/undefined similarity | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |
| should handle negative similarity | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |
| should handle similarity > 100 | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |
| should handle missing updated_at by using created_at | FAIL | 0ms | Cannot read properties of undefined (reading 'calculate_comp |

### FAIL - Edge Cases - RRF Fusion

**0/4 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should handle both empty result sets | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should handle duplicate IDs in same result set | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should handle custom k parameter | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |
| should preserve original result properties | FAIL | 0ms | Cannot read properties of undefined (reading 'fuse_results') |

### FAIL - Edge Cases - Importance Tiers

**0/3 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should handle all valid tier names | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_confi |
| should return normal tier config for invalid tier names | FAIL | 0ms | Cannot read properties of undefined (reading 'get_tier_confi |
| should correctly identify tiers excluded from search | FAIL | 0ms | Cannot read properties of undefined (reading 'is_excluded_fr |

### FAIL - Performance Tests

**0/3 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should score 1000 memories in under 50ms | FAIL | 1ms | Cannot read properties of undefined (reading 'apply_composit |
| should fuse 500+500 results in under 50ms | FAIL | 1ms | Cannot read properties of undefined (reading 'fuse_results') |
| should compute folder scores for 200 folders in under 20ms | FAIL | 1ms | Cannot read properties of undefined (reading 'compute_folder |

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
