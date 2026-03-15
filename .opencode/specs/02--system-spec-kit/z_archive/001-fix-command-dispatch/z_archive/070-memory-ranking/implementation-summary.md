---
title: "Implementation Summary: Memory & Folder Ranking [070-memory-ranking/implementation-summary]"
description: "A composite ranking system for the Spec Kit Memory that replaces simple count-based folder ranking with a multi-factor algorithm prioritizing recency, importance, and activity."
trigger_phrases:
  - "implementation"
  - "summary"
  - "memory"
  - "folder"
  - "ranking"
  - "implementation summary"
  - "070"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Memory & Folder Ranking

> **Spec:** 070-memory-ranking
> **Level:** 3 (Architecture changes)
> **Status:** Phase 2 Complete
> **Date:** 2026-01-16

---

## 1. What Was Built

A composite ranking system for the Spec Kit Memory that replaces simple count-based folder ranking with a multi-factor algorithm prioritizing **recency**, **importance**, and **activity**.

### Key Capabilities

| Capability | Description |
|------------|-------------|
| Composite Scoring | Weighted algorithm: 40% recency + 30% importance + 20% activity + 10% validation |
| Archive Filtering | Automatic detection and deprioritization of archived/test/scratch folders |
| Recency Decay | Time-based score decay with constitutional tier exemption |
| Server-Side Scoring | MCP-integrated scoring with client-side fallback |
| Backward Compatibility | All existing API calls work unchanged |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     memory_stats() API                          │
├─────────────────────────────────────────────────────────────────┤
│  Parameters: folderRanking, excludePatterns, includeScores,     │
│              includeArchived, limit                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  folderRanking='count'  │   │  folderRanking=other    │
│  (Backward Compat)      │   │  (New Scoring)          │
└─────────────────────────┘   └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │   folder-scoring.js     │
                              ├─────────────────────────┤
                              │ compute_folder_scores() │
                              │ compute_recency_score() │
                              │ is_archived()           │
                              │ get_archive_multiplier()│
                              └─────────────────────────┘
```

### Module Boundaries

| Module | Responsibility | Location |
|--------|---------------|----------|
| `folder-scoring.js` | Pure scoring calculations, constants | `mcp_server/lib/scoring/` |
| `memory-crud.js` | API handler, parameter validation | `mcp_server/handlers/` |
| `context-server.js` | MCP tool schema definitions | `mcp_server/` |
| `search.md` | Dashboard display logic | `.opencode/command/memory/` |

---

## 3. Scoring Algorithm

### Composite Formula (Decision D1)

```
folder_score = (
  recency × 0.40 +
  importance × 0.30 +
  activity × 0.20 +
  validation × 0.10
) × archive_multiplier
```

### Recency Decay (Decision D4)

```
recency_score = 1 / (1 + days_since_update × 0.10)
```

| Age | Score |
|-----|-------|
| Today | 1.00 |
| 7 days | 0.59 |
| 30 days | 0.25 |
| 90 days | 0.10 |

**Exception:** Constitutional tier always returns 1.0 (Decision D8)

### Archive Multipliers (Decision D2)

| Pattern | Multiplier |
|---------|------------|
| `z_archive/` | 0.1 |
| `scratch/`, `test-`, `-test/`, `prototype/` | 0.2 |
| Active folders | 1.0 |

### Tier Weights (Decision D7)

| Tier | Weight |
|------|--------|
| constitutional | 1.0 |
| critical | 0.8 |
| important | 0.6 |
| normal | 0.4 |
| temporary | 0.2 |
| deprecated | 0.0 |

---

## 4. API Changes

### New Parameters for `memory_stats()`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `folderRanking` | enum | `'count'` | `'count'` \| `'recency'` \| `'importance'` \| `'composite'` |
| `excludePatterns` | array | `[]` | Regex patterns to exclude folders |
| `includeScores` | boolean | `false` | Include score breakdown in response |
| `includeArchived` | boolean | `false` | Include archived/test/scratch folders |
| `limit` | number | `10` | Maximum folders to return |

### Response Format (composite mode)

```json
{
  "topFolders": [
    {
      "folder": "003-memory/070-ranking",
      "simplified": "070-ranking",
      "count": 3,
      "score": 0.82,
      "recencyScore": 1.0,
      "importanceScore": 0.6,
      "activityScore": 0.6,
      "validationScore": 0.5,
      "lastActivity": "2026-01-16T14:00:00Z",
      "isArchived": false,
      "topTier": "important"
    }
  ],
  "folderRanking": "composite"
}
```

---

## 5. Files Changed

### New Files

| File | Lines | Purpose |
|------|-------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.js` | 375 | Scoring library |
| `.opencode/skill/system-spec-kit/scripts/rank-memories.js` | 571 | Client-side fallback |
| `specs/.../070-memory-ranking/test/test-folder-scoring.js` | 728 | Test suite |

### Modified Files

| File | Changes |
|------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.js` | Added folderScoring import, enhanced handle_memory_stats() |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.js` | Updated memory_stats schema |
| `.opencode/command/memory/search.md` | Dashboard uses composite ranking |

---

## 6. Test Results

```
Total Tests: 56
Passed: 56 (100%)
Failed: 0
Duration: 6ms
```

### Test Suites

| Suite | Tests |
|-------|-------|
| Constants Verification | 6 |
| Archive Detection | 7 |
| Archive Multiplier | 7 |
| Recency Scoring | 8 |
| Path Simplification | 5 |
| Tier Utilities | 5 |
| Single Folder Scoring | 5 |
| Compute Folder Scores | 7 |
| Integration Tests | 2 |
| Edge Cases | 4 |

---

## 7. Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| D1 | Composite weighted scoring | Balances multiple ranking factors |
| D2 | Path-based archive detection | No migration needed, convention-based |
| D3 | Hybrid client/server | Immediate improvement + future performance |
| D4 | 0.10 decay rate | 50% score at 10 days, weekly cadence |
| D5 | Opt-out backward compat | New behavior default, old via parameter |
| D6 | Multiple dashboard sections | Serves different user intents |
| D7 | Linear tier weights | Predictable, each step meaningful |
| D8 | Constitutional decay exempt | Rules never age out |

---

## 8. Performance

| Metric | Requirement | Actual |
|--------|-------------|--------|
| 100 folders scoring | <100ms | 1ms |
| Dashboard render | <500ms | <200ms |
| API response | <300ms | <100ms |

---

## 9. Known Limitations

1. **Validation score** is hardcoded at 0.5 (Phase 3: real user feedback tracking)
2. **Toggle persistence** not implemented (requires session state)
3. **Personalized weights** not implemented (Phase 3)

---

## 10. Usage Examples

### Basic (composite ranking)

```javascript
memory_stats({ folderRanking: 'composite' })
```

### With score breakdown

```javascript
memory_stats({
  folderRanking: 'composite',
  includeScores: true,
  limit: 5
})
```

### Include archived folders

```javascript
memory_stats({
  folderRanking: 'composite',
  includeArchived: true
})
```

### Restore old behavior

```javascript
memory_stats({ folderRanking: 'count' })
```

---

## 11. References

- **Spec:** `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/spec.md`
- **Plan:** `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/plan.md`
- **Decisions:** `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/decision-record.md`
- **Tests:** `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test/test-folder-scoring.js`
