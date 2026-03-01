# Files Changed: 070-memory-ranking

> **Spec:** Memory & Folder Ranking Improvements  
> **Phases:** Phase 1 (Client-Side) + Phase 2 (Server-Side)  
> **Status:** Phase 2 Complete + Test Suite Added  
> **Date:** 2026-01-16

---

## Summary

| Category | Count |
|----------|-------|
| New Files Created | 4 |
| Files Modified | 6 |
| Spec Folder Files | 12 |
| **Total Files Affected** | **22** |

---

## New Files Created

### Phase 1: Client-Side Ranking

| File | Lines | Purpose |
|------|-------|---------|
| `.opencode/skill/system-spec-kit/scripts/rank-memories.js` | ~571 | Client-side folder scoring script for dashboard |

### Phase 2: Server-Side Ranking

| File | Lines | Purpose |
|------|-------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.js` | 375 | Server-side folder scoring library |

### Test Suite

| File | Lines | Purpose |
|------|-------|---------|
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test/test-folder-scoring.js` | ~550 | Comprehensive test suite for folder-scoring module |
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test-results.md` | ~587 | Test execution results and coverage report |

---

## Files Modified

### MCP Server Files

| File | Changes |
|------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.js` | Added `folderScoring` import; enhanced `handle_memory_stats()` with new parameters |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.js` | Updated `memory_stats` tool schema (line 86) with new parameters |

### Command Files

| File | Changes |
|------|---------|
| `.opencode/command/memory/search.md` | Section 5 rewritten to use server-side scoring with fallback to client-side |

### Spec Folder Files

| File | Changes |
|------|---------|
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/spec.md` | Status updated to "Phase 2 Complete" |
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/checklist.md` | Phase 1, Phase 2, and Integration Tests sections marked complete |
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/decision-record.md` | Added D8 (Constitutional Decay Exemption) |

---

## Full Path Reference

### New Files (Absolute Paths)

```
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/rank-memories.js
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.js
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test/test-folder-scoring.js
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test-results.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/implementation-summary.md
```

### Modified Files (Absolute Paths)

```
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.js
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.js
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/memory/search.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/spec.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/checklist.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/decision-record.md
```

### Spec Folder Contents (Absolute Paths)

```
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/spec.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/plan.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/tasks.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/checklist.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/decision-record.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/research.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/files-changed.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/implementation-summary.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/feature-overview.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test-results.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test/test-folder-scoring.js
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/memory/16-01-26_12-27__memory-ranking.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/memory/16-01-26_14-02__memory-ranking.md
```

---

## Relative Paths (from project root)

### New Files

```
.opencode/skill/system-spec-kit/scripts/rank-memories.js
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.js
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test/test-folder-scoring.js
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test-results.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/implementation-summary.md
```

### Modified Files

```
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.js
.opencode/skill/system-spec-kit/mcp_server/context-server.js
.opencode/command/memory/search.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/spec.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/checklist.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/decision-record.md
```

### Spec Folder

```
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/spec.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/plan.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/tasks.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/checklist.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/decision-record.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/research.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/files-changed.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/implementation-summary.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/feature-overview.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test-results.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test/test-folder-scoring.js
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/memory/16-01-26_12-27__memory-ranking.md
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/memory/16-01-26_14-02__memory-ranking.md
```

---

## New API Parameters Added

The `memory_stats` tool now accepts these new parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `folderRanking` | enum | `'count'` | `'count'` \| `'recency'` \| `'importance'` \| `'composite'` |
| `excludePatterns` | array | `[]` | Regex patterns to exclude folders |
| `includeScores` | boolean | `false` | Include score breakdown in response |
| `includeArchived` | boolean | `false` | Include archived/test/scratch folders |
| `limit` | number | `10` | Maximum folders to return |

---

## Key Functions Added

### folder-scoring.js Exports

| Function | Description |
|----------|-------------|
| `compute_folder_scores(memories, options)` | Main scoring function - computes composite scores for folders |
| `is_archived(folder_path)` | Detect if folder is archived/scratch/test |
| `get_archive_multiplier(folder_path)` | Returns 0.1, 0.2, or 1.0 based on archive status |
| `compute_recency_score(timestamp, tier, decay_rate)` | Recency score with inverse decay formula |
| `compute_single_folder_score(folder_path, folder_memories)` | Score a single folder |
| `simplify_folder_path(full_path)` | Extract leaf folder name with archive marking |
| `find_top_tier(memories)` | Find highest importance tier in a set |
| `find_last_activity(memories)` | Find most recent timestamp |

### Constants

| Constant | Value |
|----------|-------|
| `ARCHIVE_PATTERNS` | 5 regex patterns for archive detection |
| `TIER_WEIGHTS` | constitutional=1.0, critical=0.8, important=0.6, normal=0.4, temporary=0.2, deprecated=0.0 |
| `SCORE_WEIGHTS` | recency=0.40, importance=0.30, activity=0.20, validation=0.10 |
| `DECAY_RATE` | 0.10 (50% score at 10 days) |
| `TIER_ORDER` | Priority order: constitutional → deprecated |

---

## Test Suite Summary

| Metric | Value |
|--------|-------|
| Total Tests | 56 |
| Passed | 56 |
| Failed | 0 |
| Pass Rate | 100% |
| Duration | 8ms |

### Test Suites

| Suite | Tests | Status |
|-------|-------|--------|
| Constants Verification | 6 | ✓ |
| Archive Detection | 7 | ✓ |
| Archive Multiplier | 7 | ✓ |
| Recency Scoring | 8 | ✓ |
| Path Simplification | 5 | ✓ |
| Tier Utilities | 5 | ✓ |
| Single Folder Scoring | 5 | ✓ |
| Compute Folder Scores | 7 | ✓ |
| Integration Tests | 2 | ✓ |
| Edge Cases | 4 | ✓ |

### Run Tests

```bash
node .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/test/test-folder-scoring.js
```
