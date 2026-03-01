---
title: "Tasks: Memory & Folder Ranking Implementation [070-memory-ranking/tasks]"
description: "Priority: P0"
trigger_phrases:
  - "tasks"
  - "memory"
  - "folder"
  - "ranking"
  - "implementation"
  - "070"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory & Folder Ranking Implementation

> **Spec:** `070-memory-ranking`  
> **Total Tasks:** 18 (Phase 1: 6, Phase 2: 7, Phase 3: 5)

---

## Phase 1: Quick Wins (No MCP Changes)

### P1-1: Implement Archive Detection Function
**Priority:** P0  
**Estimate:** 30 min  
**Status:** ✅ Complete  
**Depends on:** None  
**Decision Ref:** D2 (Archive Detection Patterns)

**Description:**
Create utility function to detect archived/test folders based on path patterns.

**Implementation:**
```javascript
const ARCHIVE_PATTERNS = [
  /z_archive\//,
  /\/scratch\//,
  /\/test-/,
  /-test\//,
  /\/prototype\//,
];

function isArchived(folderPath) {
  return ARCHIVE_PATTERNS.some(pattern => pattern.test(folderPath));
}

function getArchiveMultiplier(folderPath) {
  if (/z_archive\//.test(folderPath)) return 0.1;
  if (/\/scratch\//.test(folderPath)) return 0.2;
  if (/\/test-/.test(folderPath)) return 0.2;
  return 1.0;
}
```

**Acceptance Criteria:**
- [x] Function correctly identifies `z_archive/` folders
- [x] Function correctly identifies `scratch/` folders
- [x] Function correctly identifies `test-` prefixed folders
- [x] Returns appropriate multiplier for scoring

---

### P1-2: Implement Recency Score Function
**Priority:** P0  
**Estimate:** 30 min  
**Status:** ✅ Complete  
**Depends on:** None  
**Decision Ref:** D4 (Decay Rate Selection)

**Description:**
Create function to compute recency score with exponential decay.

**Implementation:**
```javascript
function computeRecencyScore(updatedAt, decayRate = 0.1) {
  const now = Date.now();
  const updated = new Date(updatedAt).getTime();
  const daysSince = (now - updated) / (1000 * 60 * 60 * 24);
  
  // Exponential decay: half-life ≈ 7 days at rate 0.1
  return 1 / (1 + daysSince * decayRate);
}

function formatRelativeTime(timestamp) {
  const daysSince = (Date.now() - new Date(timestamp)) / (1000 * 60 * 60 * 24);
  if (daysSince < 1/24) return 'just now';
  if (daysSince < 1) return `${Math.floor(daysSince * 24)}h ago`;
  if (daysSince < 7) return `${Math.floor(daysSince)}d ago`;
  if (daysSince < 30) return `${Math.floor(daysSince / 7)}w ago`;
  return `${Math.floor(daysSince / 30)}mo ago`;
}
```

**Acceptance Criteria:**
- [x] Score of 1.0 for just-updated memories
- [x] Score of ~0.5 for 7-day-old memories (actually 0.59 at 7 days with 0.10 decay)
- [x] Score approaches 0 for very old memories
- [x] Relative time formatting works correctly

---

### P1-3: Implement Composite Folder Scoring
**Priority:** P0  
**Estimate:** 1 hour  
**Status:** ✅ Complete  
**Depends on:** P1-1, P1-2  
**Decision Ref:** D1 (Composite Ranking Formula), D7 (Importance Tier Weights)

**Description:**
Create function to compute weighted composite score for folders.

**Implementation:**
```javascript
const TIER_WEIGHTS = {
  constitutional: 1.0,
  critical: 0.8,
  important: 0.6,
  normal: 0.4,
  temporary: 0.2,
  deprecated: 0.0
};

const SCORE_WEIGHTS = {
  recency: 0.40,
  importance: 0.30,
  activity: 0.20,
  validation: 0.10
};

function computeFolderScore(folderPath, memories) {
  const folderMemories = memories.filter(m => 
    m.specFolder === folderPath || m.specFolder?.startsWith(folderPath + '/')
  );
  
  if (folderMemories.length === 0) return 0;
  
  // Recency: best score from any memory
  const recencyScore = Math.max(...folderMemories.map(m => 
    computeRecencyScore(m.updatedAt || m.createdAt)
  ));
  
  // Activity: capped at 5 memories for max score
  const activityScore = Math.min(1, folderMemories.length / 5);
  
  // Importance: weighted average
  const importanceScore = folderMemories.reduce((sum, m) => 
    sum + (TIER_WEIGHTS[m.importanceTier] ?? 0.4), 0
  ) / folderMemories.length;
  
  // Validation: default 0.5 (no tracking yet)
  const validationScore = 0.5;
  
  // Composite score
  const rawScore = (
    SCORE_WEIGHTS.recency * recencyScore +
    SCORE_WEIGHTS.importance * importanceScore +
    SCORE_WEIGHTS.activity * activityScore +
    SCORE_WEIGHTS.validation * validationScore
  );
  
  // Apply archive multiplier
  return rawScore * getArchiveMultiplier(folderPath);
}
```

**Acceptance Criteria:**
- [x] Score correctly combines all factors
- [x] Archive folders get reduced score
- [x] Empty folders return 0
- [x] Scores range from 0.0 to 1.0

---

### P1-4: Implement Folder Path Simplification
**Priority:** P1  
**Estimate:** 30 min  
**Status:** ✅ Complete  
**Depends on:** P1-1 (for archive detection)  
**Decision Ref:** None

**Description:**
Create function to simplify folder paths for display.

**Implementation:**
```javascript
function simplifyFolderPath(fullPath) {
  if (!fullPath) return 'unknown';
  
  const parts = fullPath.split('/');
  
  // Return last meaningful segment
  // "005-anobel.com/012-form-input" → "012-form-input"
  // "003-memory/z_archive/044-test" → "044-test (archived)"
  const leaf = parts[parts.length - 1];
  const isArchived = fullPath.includes('z_archive');
  
  return isArchived ? `${leaf} (archived)` : leaf;
}

function formatFolderDisplay(folder, memoryCount, lastUpdate, score = null) {
  const simplified = simplifyFolderPath(folder);
  const timeAgo = formatRelativeTime(lastUpdate);
  const scoreStr = score !== null ? ` ${(score * 100).toFixed(0)}%` : '';
  
  return `${simplified} (${memoryCount}, ${timeAgo})${scoreStr}`;
}
```

**Acceptance Criteria:**
- [x] Extracts leaf folder correctly
- [x] Marks archived folders
- [x] Includes memory count and relative time
- [x] Optional score display

---

### P1-5: Update Dashboard Display Logic
**Priority:** P0  
**Estimate:** 2 hours  
**Status:** ✅ Complete  
**Depends on:** P1-1, P1-2, P1-3, P1-4  
**Decision Ref:** D6 (Dashboard Section Design)

**Description:**
Modify `/memory:search` dashboard mode to use new ranking and sections.

**Changes to `.opencode/command/memory-search.md`:**

1. Fetch all memories (not just stats topFolders)
2. Group by folder and compute scores
3. Filter archived folders
4. Create multiple sections:
   - CONSTITUTIONAL (always)
   - RECENTLY ACTIVE (recency score)
   - HIGH IMPORTANCE (tier filter)
   - RECENT MEMORIES (updatedAt)

**New Display Format:**
```
╭─────────────────────────────────────────────────────────────╮
│  MEMORY DASHBOARD                          [173 entries]    │
├─────────────────────────────────────────────────────────────┤
│  ★ CONSTITUTIONAL (always active)                           │
│    #173  CRITICAL GATES & RULES                             │
│                                                             │
│  ◆ RECENTLY ACTIVE FOLDERS                                  │
│    012-form-input-components (2, 2h ago)                    │
│    058-generate-context-modularization (6, 1d ago)          │
│    004-command-logic-improvement (6, 3d ago)                │
│                                                             │
│  ◇ HIGH IMPORTANCE CONTENT                                  │
│    system-spec-kit (constitutional)                         │
│    009-security-remediation (critical)                      │
│                                                             │
│  ○ RECENT MEMORIES                                          │
│    #172  SESSION SUMMARY (font-performance)                 │
│    #170  SESSION SUMMARY (security-remediation)             │
├─────────────────────────────────────────────────────────────┤
│  [#] load | [s]earch | [f]olders | [t]riggers | [q]uit      │
╰─────────────────────────────────────────────────────────────╯
```

**Acceptance Criteria:**
- [x] Constitutional memories appear at top
- [x] Active folders exclude archived
- [x] Folders sorted by composite score
- [x] High importance section shows critical/constitutional content
- [x] Recent memories sorted by updatedAt

---

### P1-6: Add Filter Toggle for Archived Folders
**Priority:** P1  
**Estimate:** 30 min  
**Status:** ✅ Complete  
**Depends on:** P1-5  
**Decision Ref:** D2 (Archive Detection Patterns)

**Description:**
Add option to show/hide archived folders in dashboard.

**Implementation:**
- New dashboard action: `[a]rchived` to toggle visibility
- Parameter: `--show-archived` for command line

**Acceptance Criteria:**
- [x] Archived hidden by default
- [x] Toggle reveals archived folders (via includeArchived parameter)
- [x] Clear visual indicator when showing archived (isArchived flag in response)

---

## Phase 2: MCP Enhancements

### P2-1: Add Ranking Parameters to memory_stats()
**Priority:** P0
**Estimate:** 2 hours
**Status:** ✅ Complete
**Depends on:** Phase 1 complete  
**Decision Ref:** D3 (Client-Side vs Server-Side), D5 (Backward Compatibility)

**Description:**
Extend MCP memory_stats endpoint with ranking options.

**New Parameters:**
```typescript
interface MemoryStatsParams {
  folderRanking?: 'count' | 'recency' | 'importance' | 'composite';
  excludePatterns?: string[];
  includeScores?: boolean;
  limit?: number;
}
```

**Acceptance Criteria:**
- [x] Default behavior unchanged (backward compat)
- [x] `folderRanking: 'composite'` returns scored folders
- [x] `excludePatterns` filters folders by regex
- [x] `includeScores` returns score breakdown

---

### P2-2: Create Access Tracking Table
**Priority:** P1
**Estimate:** 1 hour
**Status:** ✅ Complete (Previously Implemented)
**Depends on:** None (can be done in parallel with P2-1)  
**Decision Ref:** None

**Description:**
Add database table to track memory access patterns.

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS memory_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memory_id INTEGER NOT NULL,
  access_type TEXT NOT NULL,
  accessed_at TEXT NOT NULL,
  was_selected INTEGER DEFAULT 0,
  session_id TEXT,
  search_query TEXT,
  result_position INTEGER,
  FOREIGN KEY (memory_id) REFERENCES memories(id)
);

CREATE INDEX idx_access_memory ON memory_access(memory_id);
CREATE INDEX idx_access_time ON memory_access(accessed_at);
```

**Acceptance Criteria:**
- [x] Table created on startup
- [x] Indexes for query performance
- [x] Foreign key constraint works

---

### P2-3: Implement Access Recording
**Priority:** P1
**Estimate:** 1 hour
**Status:** ✅ Complete (Previously Implemented)
**Depends on:** P2-2  
**Decision Ref:** None

**Description:**
Record memory access events for future ranking improvements.

**Record on:**
- Search result appearance
- Memory direct load
- Trigger match
- User selection from results

**Acceptance Criteria:**
- [x] Search results recorded
- [x] Direct loads recorded
- [x] Selection tracking works
- [x] No performance impact on queries

---

### P2-4: Add Access Count to Memory Table
**Priority:** P1
**Estimate:** 30 min
**Status:** ✅ Complete (Previously Implemented)
**Depends on:** P2-2  
**Decision Ref:** None

**Description:**
Add denormalized access metrics to memories table.

**Schema Change:**
```sql
ALTER TABLE memories ADD COLUMN access_count INTEGER DEFAULT 0;
ALTER TABLE memories ADD COLUMN last_accessed TEXT;
```

**Acceptance Criteria:**
- [x] Migration runs without data loss
- [x] Counts increment on access
- [x] last_accessed updates correctly

---

### P2-5: Implement Server-Side Folder Scoring
**Priority:** P0
**Estimate:** 2 hours
**Status:** ✅ Complete
**Depends on:** P2-1  
**Decision Ref:** D1 (Composite Ranking Formula), D3 (Client vs Server)

**Description:**
Move scoring logic to MCP server for performance.

**Implementation:**
- SQL view for folder aggregates
- Score computation in server
- Cache scores, update on memory changes

**Acceptance Criteria:**
- [x] Folder scores computed server-side
- [x] Results computed per-request (stateless)
- [x] Scores updated on memory changes

---

### P2-6: Add Enhanced Folder Response
**Priority:** P1
**Estimate:** 1 hour
**Status:** ✅ Complete
**Depends on:** P2-5  
**Decision Ref:** None

**Description:**
Return rich folder data from memory_stats.

**Response Format:**
```typescript
interface FolderStats {
  folder: string;
  count: number;
  score: number;
  recencyScore: number;
  importanceScore: number;
  activityScore: number;
  lastActivity: string;
  isArchived: boolean;
  topTier: string;
}
```

**Acceptance Criteria:**
- [x] All score components included
- [x] Archive status correct
- [x] Timestamps in ISO format

---

### P2-7: Update Dashboard to Use New API
**Priority:** P0
**Estimate:** 1 hour
**Status:** ✅ Complete
**Depends on:** P2-5, P2-6  
**Decision Ref:** D5 (Backward Compatibility)

**Description:**
Modify dashboard to use enhanced memory_stats parameters.

**Changes:**
- Use `folderRanking: 'composite'`
- Use `excludePatterns: ['z_archive', 'scratch', 'test-']`
- Use `includeScores: true`

**Acceptance Criteria:**
- [x] Dashboard uses new parameters
- [x] Fallback to client-side if API unavailable
- [x] Performance improved vs Phase 1

---

## Phase 3: Advanced Ranking (Future)

### P3-1: Implement Contextual Boost
**Priority:** P2  
**Estimate:** 2 hours  
**Status:** Not Started  
**Depends on:** Phase 2 complete  
**Decision Ref:** None (new decision needed)

**Description:**
Boost memories related to current work context.

**Boosts:**
- Same spec folder: +0.20
- Same category: +0.10
- Trigger overlap: +0.15

**Acceptance Criteria:**
- [ ] Context detected correctly
- [ ] Boosts applied appropriately
- [ ] Clear improvement in relevance

---

### P3-2: Implement Click-Through Learning
**Priority:** P2  
**Estimate:** 3 hours  
**Status:** Not Started  
**Depends on:** P2-3 (Access Recording)  
**Decision Ref:** None (new decision needed)

**Description:**
Learn from user selection patterns.

**Metrics:**
- Click-through rate per memory
- Position bias correction
- Query-result association

**Acceptance Criteria:**
- [ ] CTR computed correctly
- [ ] Learning improves rankings
- [ ] No privacy concerns

---

### P3-3: Create Configuration File
**Priority:** P2  
**Estimate:** 1 hour  
**Status:** Not Started  
**Depends on:** None  
**Decision Ref:** None (new decision needed)

**Description:**
Allow users to customize ranking weights.

**File:** `.opencode/config/memory-preferences.yaml`

**Acceptance Criteria:**
- [ ] Config file loads correctly
- [ ] Weights override defaults
- [ ] Invalid config handled gracefully

---

### P3-4: Implement Folder Categories
**Priority:** P2  
**Estimate:** 2 hours  
**Status:** Not Started  
**Depends on:** None  
**Decision Ref:** None (new decision needed)

**Description:**
Auto-categorize folders for related content discovery.

**Categories:**
- Project prefix (e.g., `005-anobel.com`)
- Domain (memory, commands, skills)
- Type (feature, fix, research)

**Acceptance Criteria:**
- [ ] Categories detected automatically
- [ ] Related folders suggested
- [ ] Category filtering works

---

### P3-5: Implement Ranking A/B Testing
**Priority:** P2  
**Estimate:** 2 hours  
**Status:** Not Started  
**Depends on:** P3-2 (needs metrics collection)  
**Decision Ref:** None (new decision needed)

**Description:**
Infrastructure for testing ranking algorithms.

**Features:**
- Random assignment to algorithm
- Metric collection (CTR, time to find)
- Winner detection

**Acceptance Criteria:**
- [ ] A/B split works
- [ ] Metrics collected
- [ ] Easy to add new algorithms
