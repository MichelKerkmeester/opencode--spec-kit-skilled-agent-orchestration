---
title: "Plan: Memory & Folder Ranking Implementation [070-memory-ranking/plan]"
description: "Phase 1: Quick Wins (No MCP changes)"
trigger_phrases:
  - "plan"
  - "memory"
  - "folder"
  - "ranking"
  - "implementation"
  - "070"
importance_tier: "important"
contextType: "decision"
---
# Plan: Memory & Folder Ranking Implementation

> **Spec:** `070-memory-ranking`  
> **Approach:** 3-phase implementation (quick wins → MCP changes → advanced)  
> **Estimated LOC:** 600-800

---

## 1. Implementation Strategy

### Phase Overview

```
Phase 1: Quick Wins (No MCP changes)
├── Client-side filtering of archived folders
├── Recency score computation in dashboard
├── Improved folder display format
└── Multiple dashboard sections

Phase 2: MCP Enhancements
├── New API parameters for ranking control
├── Access tracking schema
├── Server-side folder scoring
└── Enhanced memory_stats() response

Phase 3: Advanced Ranking (Future)
├── Contextual ranking based on current work
├── Learning from user behavior
├── Personalized ranking weights
└── Folder categories/tags
```

---

## 2. Phase 1: Quick Wins

**Timeline:** Immediate  
**Risk:** Low  
**Dependencies:** None

### 2.1 Archive Folder Filtering

```javascript
// Detection patterns
const ARCHIVE_PATTERNS = [
  /z_archive\//,
  /\/scratch\//,
  /\/test-/,
  /-test\//,
];

function isArchived(folderPath) {
  return ARCHIVE_PATTERNS.some(pattern => pattern.test(folderPath));
}

// Filter in dashboard display
const activeFolders = topFolders.filter(f => !isArchived(f.folder));
```

### 2.2 Recency Score Computation

```javascript
function computeRecencyScore(updatedAt, decayRate = 0.1) {
  const daysSince = (Date.now() - new Date(updatedAt)) / (1000 * 60 * 60 * 24);
  return 1 / (1 + daysSince * decayRate);
  // decayRate 0.1 = ~60% retention at 7 days, ~50% at 10 days
  // Formula: score = 1/(1 + days × rate)
}

function computeFolderScore(folder, memories) {
  const folderMemories = memories.filter(m => m.specFolder === folder);
  
  // Recency: best score from any memory in folder
  const recencyScore = Math.max(...folderMemories.map(m => 
    computeRecencyScore(m.updatedAt)
  ));
  
  // Activity: capped at 5 memories
  const activityScore = Math.min(1, folderMemories.length / 5);
  
  // Importance: weighted average of tiers
  const tierWeights = {
    constitutional: 1.0,
    critical: 0.8,
    important: 0.6,
    normal: 0.4,
    temporary: 0.2,
    deprecated: 0.0
  };
  const importanceScore = folderMemories.reduce((sum, m) => 
    sum + (tierWeights[m.importanceTier] || 0.4), 0
  ) / folderMemories.length;
  
  // Composite with weights
  return (
    recencyScore * 0.40 +
    activityScore * 0.20 +
    importanceScore * 0.30 +
    0.5 * 0.10  // default validation score
  );
}
```

### 2.3 Folder Path Simplification

```javascript
function simplifyFolderPath(fullPath) {
  // Extract leaf folder name with number prefix
  // "005-anobel.com/012-form-input-components" → "012-form-input-components"
  const parts = fullPath.split('/');
  return parts[parts.length - 1];
}

function formatFolderDisplay(folder, score, lastUpdate) {
  const simplified = simplifyFolderPath(folder);
  const timeAgo = formatRelativeTime(lastUpdate);
  return `${simplified} (score: ${(score * 100).toFixed(0)}%, last: ${timeAgo})`;
}
```

### 2.4 Dashboard Sections

Replace single "TOP FOLDERS" with multiple sections:

| Section | Source | Limit |
|---------|--------|-------|
| CONSTITUTIONAL | Filter by tier | 3 |
| RECENTLY ACTIVE | Sort by recency score | 3 |
| HIGH IMPORTANCE | Filter critical/important | 3 |
| RECENT MEMORIES | Sort by updatedAt | 5 |

---

## 3. Phase 2: MCP Enhancements

**Timeline:** After Phase 1 validation  
**Risk:** Medium (requires MCP changes)  
**Dependencies:** MCP server access

### 3.1 New API Parameters

**Enhanced `memory_stats()`:**
```typescript
interface MemoryStatsParams {
  // Existing
  // (none currently)
  
  // New parameters
  folderRanking?: 'count' | 'recency' | 'importance' | 'composite';
  excludePatterns?: string[];  // regex patterns to exclude
  includeScores?: boolean;     // return score breakdown
}

interface FolderStats {
  folder: string;
  count: number;
  // New fields
  score?: number;
  recencyScore?: number;
  importanceScore?: number;
  activityScore?: number;
  lastActivity?: string;
  isArchived?: boolean;
}
```

### 3.2 Access Tracking Schema

```sql
-- New table for tracking memory access
CREATE TABLE IF NOT EXISTS memory_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memory_id INTEGER NOT NULL,
  access_type TEXT NOT NULL,  -- 'search_result', 'direct_load', 'trigger_match'
  accessed_at TEXT NOT NULL,  -- ISO timestamp
  was_selected INTEGER,       -- 1 if user viewed, 0 if just appeared in results
  session_id TEXT,
  FOREIGN KEY (memory_id) REFERENCES memories(id)
);

CREATE INDEX idx_memory_access_memory ON memory_access(memory_id);
CREATE INDEX idx_memory_access_time ON memory_access(accessed_at);

-- Add access count to memories table
ALTER TABLE memories ADD COLUMN access_count INTEGER DEFAULT 0;
ALTER TABLE memories ADD COLUMN last_accessed TEXT;
```

### 3.3 Server-Side Folder Scoring

Move scoring computation to MCP server for:
- Better performance (computed once, cached)
- Consistent ranking across clients
- Access to full database for complex queries

```sql
-- Materialized view for folder scores (updated on memory changes)
CREATE VIEW folder_scores AS
SELECT 
  specFolder as folder,
  COUNT(*) as memory_count,
  MAX(updatedAt) as last_activity,
  AVG(CASE importanceTier
    WHEN 'constitutional' THEN 1.0
    WHEN 'critical' THEN 0.8
    WHEN 'important' THEN 0.6
    WHEN 'normal' THEN 0.4
    WHEN 'temporary' THEN 0.2
    ELSE 0.0
  END) as avg_importance,
  CASE 
    WHEN specFolder LIKE '%z_archive%' THEN 1
    WHEN specFolder LIKE '%/scratch/%' THEN 1
    ELSE 0
  END as is_archived
FROM memories
WHERE status = 'success'
GROUP BY specFolder;
```

---

## 4. Phase 3: Advanced Ranking (Future)

### 4.1 Contextual Ranking

Boost memories/folders related to current work:

```javascript
function getContextualBoost(memory, currentContext) {
  let boost = 0;
  
  // Same spec folder
  if (memory.specFolder === currentContext.specFolder) {
    boost += 0.20;
  }
  
  // Same category (e.g., both in "005-anobel.com/")
  if (getCategory(memory.specFolder) === getCategory(currentContext.specFolder)) {
    boost += 0.10;
  }
  
  // Trigger phrase overlap
  const overlapRatio = computeTriggerOverlap(memory.triggers, currentContext.keywords);
  boost += overlapRatio * 0.15;
  
  return boost;
}
```

### 4.2 Learning from User Behavior

Track which memories users actually view after search:

```javascript
// On memory load after search
function recordMemorySelection(memoryId, searchQuery, resultPosition) {
  // Insert into memory_access with was_selected = 1
  // Use for future ranking improvements
}

// Compute click-through rate
function computeCTR(memoryId, timeWindow = '30d') {
  // appearances in search results vs actual loads
  return loads / appearances;
}
```

### 4.3 Personalized Weights

Allow users to customize ranking formula:

```yaml
# .opencode/config/memory-preferences.yaml
ranking:
  weights:
    recency: 0.50      # user prefers recency
    importance: 0.20
    activity: 0.20
    validation: 0.10
  
  filters:
    excludeArchived: true
    excludePatterns:
      - "test-"
      - "scratch/"
    
  display:
    maxFoldersPerSection: 5
    showScores: true
```

---

## 5. Migration Path

### Backward Compatibility

| API | Current | With Changes |
|-----|---------|--------------|
| `memory_stats()` | Works | Works (new params optional) |
| `memory_search()` | Works | Works (enhanced ranking internal) |
| `memory_list()` | Works | Works (new fields optional) |

### Rollout Strategy

1. **Phase 1:** Deploy client-side changes only
2. **Validate:** Confirm improved UX, gather feedback
3. **Phase 2:** Deploy MCP changes with feature flag
4. **Migrate:** Enable new ranking by default
5. **Phase 3:** Gradual rollout of advanced features

---

## 6. Files to Modify

| Phase | File | Change Type |
|-------|------|-------------|
| 1 | `.opencode/command/memory-search.md` | Dashboard display logic |
| 1 | `.opencode/command/memory-database.md` | Folder filtering |
| 2 | MCP Server (external) | API parameters, schema |
| 2 | `.opencode/command/memory-search.md` | Use new API params |
| 3 | `.opencode/config/memory-preferences.yaml` | New config file |
| 3 | MCP Server (external) | Contextual/learning logic |

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance regression | Medium | Profile before/after, cache scores |
| Ranking feels wrong | High | Make weights configurable, A/B test |
| MCP breaking changes | High | Version API, backward compat |
| Over-engineering | Medium | Start with Phase 1, validate value |
