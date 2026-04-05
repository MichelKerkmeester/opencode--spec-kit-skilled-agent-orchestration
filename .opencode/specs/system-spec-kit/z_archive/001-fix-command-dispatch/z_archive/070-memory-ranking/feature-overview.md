# Memory Ranking Feature

> **Spec:** 070-memory-ranking  
> **Status:** Complete  
> **Date:** 2026-01-16

---

## What This Feature Does

Improves how the memory system ranks and displays folders. Instead of showing folders by simple file count, the system now uses a smart ranking algorithm that prioritizes **recent**, **important**, and **active** folders.

---

## Before vs After

### Before (Count-Based Ranking)

```
TOP FOLDERS:
1. z_archive/044-speckit-test-suite  (7 memories)
2. z_archive/old-project             (6 memories)  
3. 004-command-logic                 (6 memories)
4. scratch/debug-session             (5 memories)
5. 070-memory-ranking                (3 memories)  ← Your active work is buried!
```

**Problems:**
- Archived folders clutter the top
- Test/scratch folders appear prominently
- Recent work gets buried under old folders with more files
- No distinction between important and trivial content

### After (Composite Ranking)

```
TOP FOLDERS:
1. 070-memory-ranking     (3 memories, updated today)     ← Active work first!
2. 004-command-logic      (6 memories, updated 2 days ago)
3. 058-generate-context   (4 memories, updated 5 days ago)

ARCHIVED (hidden by default):
  - z_archive/044-speckit-test-suite (7 memories)
  - scratch/debug-session (5 memories)
```

**Improvements:**
- Recent work appears first
- Archived/test folders hidden by default
- Important content (constitutional, critical) ranks higher
- Active folders with recent edits surface to top

---

## How Ranking Works

### Composite Score Formula

Each folder gets a score from 0.0 to 1.0:

```
Score = (Recency × 0.40) + (Importance × 0.30) + (Activity × 0.20) + (Validation × 0.10)
```

| Component | Weight | What It Measures |
|-----------|--------|------------------|
| Recency | 40% | How recently the folder was updated |
| Importance | 30% | Tier of memories (constitutional > critical > normal) |
| Activity | 20% | Number of memories (capped at 5) |
| Validation | 10% | User feedback on usefulness |

### Archive Penalties

Archived folders get their score multiplied down:

| Folder Type | Multiplier | Example |
|-------------|------------|---------|
| `z_archive/` | × 0.1 | Old completed work |
| `scratch/` | × 0.2 | Temporary debug files |
| `test-*` | × 0.2 | Test suites |
| `prototype/` | × 0.2 | Experimental work |
| Active folders | × 1.0 | No penalty |

### Recency Decay

Older folders gradually lose recency points:

| Age | Recency Score |
|-----|---------------|
| Today | 1.0 |
| 7 days | 0.59 |
| 10 days | 0.50 |
| 30 days | 0.25 |
| 90 days | 0.10 |

**Exception:** Constitutional tier memories are exempt from decay (always 1.0).

---

## New API Options

The `memory_stats` tool now accepts these parameters:

```javascript
memory_stats({
  folderRanking: 'composite',  // 'count' | 'recency' | 'importance' | 'composite'
  includeArchived: false,      // Show archived folders?
  includeScores: true,         // Return score breakdown?
  excludePatterns: ['test'],   // Hide folders matching patterns
  limit: 10                    // Max folders to return
})
```

### Example Response (with scores)

```json
{
  "topFolders": [
    {
      "folder": "003-memory/070-memory-ranking",
      "simplified": "070-memory-ranking",
      "count": 3,
      "score": 0.82,
      "recencyScore": 1.0,
      "importanceScore": 0.6,
      "activityScore": 0.6,
      "isArchived": false,
      "topTier": "important"
    }
  ]
}
```

---

## Files Changed

| File | Change |
|------|--------|
| `folder-scoring.js` | **NEW** - 373-line scoring library |
| `memory-crud.js` | Enhanced `memory_stats` with new parameters |
| `context-server.js` | Updated API schema |
| `search.md` | Dashboard uses composite ranking |

---

## Test Results

```
Total Tests: 56
Passed: 56 ✓
Failed: 0
Duration: 8ms
```

Run tests:
```bash
node .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test/test-folder-scoring.js
```

---

## Quick Reference

| Want to... | Use |
|------------|-----|
| See recent folders first | `folderRanking: 'composite'` (default behavior now) |
| See archived folders | `includeArchived: true` |
| See score breakdown | `includeScores: true` |
| Hide specific folders | `excludePatterns: ['pattern']` |
| Limit results | `limit: 5` |
| Use old count-based ranking | `folderRanking: 'count'` |
