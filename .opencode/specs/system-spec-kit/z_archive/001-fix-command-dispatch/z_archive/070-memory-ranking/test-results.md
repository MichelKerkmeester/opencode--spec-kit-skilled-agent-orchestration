# Test Results: Folder Scoring Module

> **Spec:** 070-memory-ranking
> **Run Date:** 2026-01-16T14:41:00.490Z
> **Duration:** 8ms

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 61 |
| Passed | 61 |
| Failed | 0 |
| Pass Rate | 100.0% |

---

## Test Suites

### ✓ Constants Verification

**6/6 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| ARCHIVE_PATTERNS should have 5 regex patterns | ✓ | 0ms | - |
| TIER_WEIGHTS should have 6 tiers with correct values | ✓ | 0ms | - |
| SCORE_WEIGHTS should sum to 1.0 | ✓ | 0ms | - |
| SCORE_WEIGHTS should have correct individual values | ✓ | 0ms | - |
| DECAY_RATE should be 0.10 | ✓ | 0ms | - |
| TIER_ORDER should list all 6 tiers in priority order | ✓ | 0ms | - |

### ✓ Archive Detection - is_archived()

**7/7 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should detect z_archive folders | ✓ | 0ms | - |
| should detect scratch folders | ✓ | 0ms | - |
| should detect test- prefixed subfolders | ✓ | 0ms | - |
| should detect -test suffixed folders | ✓ | 0ms | - |
| should detect prototype folders | ✓ | 0ms | - |
| should return false for normal paths | ✓ | 0ms | - |
| should handle null/empty gracefully | ✓ | 0ms | - |

### ✓ Archive Multiplier - get_archive_multiplier()

**7/7 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return 0.1 for z_archive folders | ✓ | 0ms | - |
| should return 0.2 for scratch folders | ✓ | 0ms | - |
| should return 0.2 for test- prefixed folders | ✓ | 0ms | - |
| should return 0.2 for -test suffixed folders | ✓ | 0ms | - |
| should return 0.2 for prototype folders | ✓ | 0ms | - |
| should return 1.0 for normal folders | ✓ | 0ms | - |
| should return 1.0 for null/empty | ✓ | 0ms | - |

### ✓ Recency Scoring - compute_recency_score()

**8/8 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return ~1.0 for just-updated memories | ✓ | 0ms | - |
| should return ~0.588 for 7-day-old memories | ✓ | 0ms | - |
| should return 0.5 for 10-day-old memories | ✓ | 0ms | - |
| should return ~0.25 for 30-day-old memories | ✓ | 0ms | - |
| should return ~0.1 for 90-day-old memories | ✓ | 1ms | - |
| should return 0.5 fallback for invalid timestamps | ✓ | 0ms | - |
| should return 1.0 for future timestamps | ✓ | 0ms | - |
| should return 1.0 for constitutional tier (exempt from decay) | ✓ | 0ms | - |

### ✓ Path Simplification - simplify_folder_path()

**5/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should extract leaf folder from full path | ✓ | 0ms | - |
| should mark archived folders with suffix | ✓ | 0ms | - |
| should handle empty/null gracefully | ✓ | 0ms | - |
| should handle single segment paths | ✓ | 0ms | - |
| should handle trailing slashes | ✓ | 0ms | - |

### ✓ Tier Utilities

**5/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| find_top_tier should return highest tier from mixed memories | ✓ | 0ms | - |
| find_top_tier should return constitutional if present | ✓ | 0ms | - |
| find_top_tier should return normal for empty array | ✓ | 0ms | - |
| find_last_activity should return most recent timestamp | ✓ | 0ms | - |
| find_last_activity should return current time for empty | ✓ | 0ms | - |

### ✓ Single Folder Scoring - compute_single_folder_score()

**5/5 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return zeros for empty folder | ✓ | 0ms | - |
| should compute score for single memory | ✓ | 0ms | - |
| should cap activity score at 1.0 for 5+ memories | ✓ | 0ms | - |
| should apply archive multiplier | ✓ | 0ms | - |
| should weight importance by tier | ✓ | 0ms | - |

### ✓ Compute Folder Scores - compute_folder_scores()

**7/7 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should return empty array for empty input | ✓ | 0ms | - |
| should group and score multiple folders | ✓ | 0ms | - |
| should filter archived folders by default | ✓ | 0ms | - |
| should include archived when includeArchived=true | ✓ | 0ms | - |
| should respect excludePatterns | ✓ | 0ms | - |
| should respect limit parameter | ✓ | 0ms | - |
| should sort by score descending | ✓ | 0ms | - |

### ✓ Integration Tests

**2/2 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should handle realistic memory dataset | ✓ | 0ms | - |
| should complete scoring in under 100ms for 100 folders | ✓ | 2ms | - |

### ✓ Edge Cases

**9/9 passed**

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| should handle memories with snake_case field names | ✓ | 0ms | - |
| should handle mixed case field names | ✓ | 0ms | - |
| should handle missing tier gracefully | ✓ | 0ms | - |
| should handle unicode in folder names | ✓ | 0ms | - |
| should support custom decay_rate parameter | ✓ | 0ms | - |
| should handle unknown tier names by using normal weight | ✓ | 0ms | - |
| should handle invalid limit values gracefully | ✓ | 0ms | - |
| should handle invalid excludePattern regex strings gracefully | ✓ | 1ms | - |
| should handle extremely long folder paths | ✓ | 0ms | - |

---

## Test Coverage

| Function | Tested |
|----------|--------|
| `compute_folder_scores()` | ✓ |
| `is_archived()` | ✓ |
| `get_archive_multiplier()` | ✓ |
| `compute_recency_score()` | ✓ |
| `compute_single_folder_score()` | ✓ |
| `simplify_folder_path()` | ✓ |
| `find_top_tier()` | ✓ |
| `find_last_activity()` | ✓ |

---

## Raw Results (JSON)

```json
{
  "startTime": "2026-01-16T14:41:00.490Z",
  "endTime": "2026-01-16T14:41:00.498Z",
  "duration": 8,
  "summary": {
    "total": 61,
    "passed": 61,
    "failed": 0,
    "skipped": 0
  },
  "suites": [
    {
      "name": "Constants Verification",
      "tests": [
        {
          "name": "ARCHIVE_PATTERNS should have 5 regex patterns",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "TIER_WEIGHTS should have 6 tiers with correct values",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "SCORE_WEIGHTS should sum to 1.0",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "SCORE_WEIGHTS should have correct individual values",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "DECAY_RATE should be 0.10",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "TIER_ORDER should list all 6 tiers in priority order",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 6,
      "failed": 0
    },
    {
      "name": "Archive Detection - is_archived()",
      "tests": [
        {
          "name": "should detect z_archive folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should detect scratch folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should detect test- prefixed subfolders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should detect -test suffixed folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should detect prototype folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return false for normal paths",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle null/empty gracefully",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 7,
      "failed": 0
    },
    {
      "name": "Archive Multiplier - get_archive_multiplier()",
      "tests": [
        {
          "name": "should return 0.1 for z_archive folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 0.2 for scratch folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 0.2 for test- prefixed folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 0.2 for -test suffixed folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 0.2 for prototype folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 1.0 for normal folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 1.0 for null/empty",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 7,
      "failed": 0
    },
    {
      "name": "Recency Scoring - compute_recency_score()",
      "tests": [
        {
          "name": "should return ~1.0 for just-updated memories",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return ~0.588 for 7-day-old memories",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 0.5 for 10-day-old memories",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return ~0.25 for 30-day-old memories",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return ~0.1 for 90-day-old memories",
          "status": "passed",
          "error": null,
          "duration": 1
        },
        {
          "name": "should return 0.5 fallback for invalid timestamps",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 1.0 for future timestamps",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should return 1.0 for constitutional tier (exempt from decay)",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 8,
      "failed": 0
    },
    {
      "name": "Path Simplification - simplify_folder_path()",
      "tests": [
        {
          "name": "should extract leaf folder from full path",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should mark archived folders with suffix",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle empty/null gracefully",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle single segment paths",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle trailing slashes",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 5,
      "failed": 0
    },
    {
      "name": "Tier Utilities",
      "tests": [
        {
          "name": "find_top_tier should return highest tier from mixed memories",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "find_top_tier should return constitutional if present",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "find_top_tier should return normal for empty array",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "find_last_activity should return most recent timestamp",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "find_last_activity should return current time for empty",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 5,
      "failed": 0
    },
    {
      "name": "Single Folder Scoring - compute_single_folder_score()",
      "tests": [
        {
          "name": "should return zeros for empty folder",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should compute score for single memory",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should cap activity score at 1.0 for 5+ memories",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should apply archive multiplier",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should weight importance by tier",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 5,
      "failed": 0
    },
    {
      "name": "Compute Folder Scores - compute_folder_scores()",
      "tests": [
        {
          "name": "should return empty array for empty input",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should group and score multiple folders",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should filter archived folders by default",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should include archived when includeArchived=true",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should respect excludePatterns",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should respect limit parameter",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should sort by score descending",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 7,
      "failed": 0
    },
    {
      "name": "Integration Tests",
      "tests": [
        {
          "name": "should handle realistic memory dataset",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should complete scoring in under 100ms for 100 folders",
          "status": "passed",
          "error": null,
          "duration": 2
        }
      ],
      "passed": 2,
      "failed": 0
    },
    {
      "name": "Edge Cases",
      "tests": [
        {
          "name": "should handle memories with snake_case field names",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle mixed case field names",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle missing tier gracefully",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle unicode in folder names",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should support custom decay_rate parameter",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle unknown tier names by using normal weight",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle invalid limit values gracefully",
          "status": "passed",
          "error": null,
          "duration": 0
        },
        {
          "name": "should handle invalid excludePattern regex strings gracefully",
          "status": "passed",
          "error": null,
          "duration": 1
        },
        {
          "name": "should handle extremely long folder paths",
          "status": "passed",
          "error": null,
          "duration": 0
        }
      ],
      "passed": 9,
      "failed": 0
    }
  ]
}
```