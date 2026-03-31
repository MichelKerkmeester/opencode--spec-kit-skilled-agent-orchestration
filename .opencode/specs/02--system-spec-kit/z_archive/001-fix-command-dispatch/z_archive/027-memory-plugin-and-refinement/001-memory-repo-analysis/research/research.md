---
title: "...-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/001-memory-repo-analysis/research]"
description: "Complete research documentation analyzing our semantic memory system (system-memory v11.2.0) against roampal-core's innovative features, with prioritized recommendations for sys..."
trigger_phrases:
  - "feature"
  - "research"
  - "memory"
  - "system"
  - "analysis"
  - "001"
importance_tier: "normal"
contextType: "research"
---
# Feature Research: Memory System Analysis & Roampal Comparison - Comprehensive Technical Investigation

Complete research documentation analyzing our semantic memory system (system-memory v11.2.0) against roampal-core's innovative features, with prioritized recommendations for system improvements.

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. EXECUTIVE SUMMARY

### Top-Level Findings

This research analyzes two AI memory systems: our **system-memory v11.2.0** (SQLite + semantic search) and **roampal-core** (ChromaDB + hook-based injection). While our system excels in structured tier management and checkpoint capabilities, roampal-core offers compelling innovations in outcome-based learning, automatic context injection, and Knowledge Graph routing that could significantly improve our memory system's effectiveness.

### Top 5 Recommendations

| # | Recommendation | Priority | Impact | Effort |
|---|----------------|----------|--------|--------|
| **R1** | Implement Outcome-Based Learning | HIGH | Memories self-improve based on actual usefulness | Medium |
| **R2** | Add Hook-Based Context Injection | HIGH | Seamless context recovery without user action | High |
| **R3** | Implement Knowledge Graph Routing | MEDIUM | Smarter search routing based on concept→success patterns | Medium-High |
| **R4** | Add Automatic Tier Promotion | MEDIUM | Score-based promotion flow reduces manual curation | Medium |
| **R5** | Add Session "Working" Collection | LOW | Ephemeral session context with auto-cleanup | Low |

### Key Insight

The fundamental difference: **roampal-core's hooks inject context BEFORE the AI sees the message**, while our system requires manual `/memory:search` invocation. This creates a seamless "AI that remembers" experience vs our "AI that can be told to remember" approach.

---

## 2. METADATA

- **Research ID**: RESEARCH-015
- **Feature/Spec**: Memory System Enhancement Analysis
- **Status**: Completed
- **Date Started**: 2025-12-17
- **Date Completed**: 2025-12-17
- **Researcher(s)**: AI Agent (Claude)
- **Reviewers**: TBD
- **Last Updated**: 2025-12-17

**Related Documents**:
- Spec: [spec.md](./spec.md)
- Checklist: [checklist.md](./checklist.md)

---

## 3. OUR SYSTEM ARCHITECTURE (system-memory v11.2.0)

### 3.1 Core Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **MCP Server** | `.opencode/skills/system-memory/mcp_server/semantic-memory.js` | Handles all memory operations via MCP protocol |
| **Database** | `.opencode/skills/system-memory/database/memory-index.sqlite` | SQLite with sqlite-vec for vector operations |
| **Main Script** | `.opencode/skills/system-memory/scripts/generate-context.js` | Context generation from JSON input |
| **Config** | `opencode.json` → `mcp.semantic_memory` | Server configuration |

### 3.2 MCP Tools (14 Total)

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `memory_search` | Semantic vector search | query, specFolder, tier, contextType, concepts |
| `memory_load` | Load memory by spec folder/anchor | specFolder, anchorId, memoryId |
| `memory_match_triggers` | Fast trigger phrase matching (<50ms) | prompt |
| `memory_list` | Browse memories with pagination | specFolder, limit, offset |
| `memory_update` | Update importance/metadata | id, importanceTier, triggerPhrases |
| `memory_delete` | Delete by ID or spec folder | id OR specFolder, confirm |
| `memory_stats` | System statistics | - |
| `memory_validate` | Record validation feedback | id, wasUseful |
| `memory_save` | Index single memory file | filePath, force |
| `memory_index_scan` | Bulk scan and index workspace | specFolder, force |
| `checkpoint_create` | Save memory state snapshot | name, specFolder, metadata |
| `checkpoint_list` | List checkpoints | limit, specFolder |
| `checkpoint_restore` | Restore from checkpoint | name, clearExisting |
| `checkpoint_delete` | Delete checkpoint | name |

### 3.3 Six-Tier Importance System

| Tier | Boost | Decay | Auto-Delete | Use Case |
|------|-------|-------|-------------|----------|
| `constitutional` | 3.0x | None | Never | Always surfaced (~500 tokens max), system rules |
| `critical` | 2.0x | None | Never | Architecture decisions, breaking changes |
| `important` | 1.5x | None | Never | Key implementations, major features |
| `normal` | 1.0x | 90-day half-life | No | Standard development context |
| `temporary` | 0.5x | 90-day half-life | 7 days | Debug sessions, experiments |
| `deprecated` | 0.0x | N/A | No (manual) | Excluded from search, accessible via memory_load |

**Constitutional Tier Special Behavior**: Always included at top of search results regardless of query, capped at ~500 tokens to prevent context bloat.

### 3.4 Search Pipeline

```
Query → [Vector Search] → Top 20
      → [FTS5 Search]   → Top 20
      → [RRF Fusion]    → Combined ranking
      → [Tier Boost]    → Apply importance multipliers
      → [Decay Applied] → 90-day half-life scoring
      → Final Results
```

**Hybrid Search Components**:
1. **Vector Search**: Nomic embeddings (768-dim) for semantic similarity
2. **FTS5 Search**: SQLite full-text search for exact keyword matching
3. **RRF (Reciprocal Rank Fusion)**: Combines both result sets

**Decay Formula**: `decay_factor = 0.5 ^ (days_since_access / 90)`

| Days Since Access | Decay Factor |
|-------------------|--------------|
| 0 | 1.00 |
| 30 | 0.79 |
| 90 | 0.50 |
| 180 | 0.25 |

**Decay Bypass**: Critical tier, historical keywords ("original", "initial"), or `useDecay: false` parameter.

### 3.5 Context Saving Workflow

```
USER triggers save (keyword or command)
        ↓
DETECT spec folder (70% alignment threshold)
        ↓
AI ANALYZES conversation and extracts:
    ├─ Session summary (what was accomplished)
    ├─ Key decisions (choices + rationale)
    ├─ Files modified (actual paths)
    └─ Trigger phrases (5-10 keywords)
        ↓
AI CONSTRUCTS JSON with extracted data
        ↓
AI WRITES JSON to /tmp/save-context-data.json
        ↓
AI EXECUTES: node generate-context.js /tmp/save-context-data.json
        ↓
SCRIPT generates 300+ line markdown with anchors
        ↓
SCRIPT creates vector embeddings for semantic search
        ↓
SCRIPT extracts trigger phrases for fast matching
```

**Key Limitation**: Context saving requires **manual trigger** via keywords ("save context", "document this") or `/memory:save` command.

### 3.6 Confidence-Based Promotion

Memories with **90%+ accuracy** after **5+ validations** are automatically promoted to `critical` tier.

```typescript
// Validate memory accuracy
memory_validate({ id: 123, wasUseful: true })  // Increases confidence
memory_validate({ id: 123, wasUseful: false }) // Decreases confidence
```

**Current Limitation**: Only binary feedback (useful/not useful), no granular outcome scoring.

### 3.7 Anchor-Based Retrieval

Memory files include anchors for section-specific loading (93% token savings):

```html
<!-- ANCHOR:decision-jwt-049 -->
Decision content here...
<!-- /ANCHOR:decision-jwt-049 -->
```

**Anchor ID Pattern**: `[context-type]-[keywords]-[spec-number]`
- Context types: `implementation`, `decision`, `research`, `discovery`, `general`

---

## 4. ROAMPAL-CORE ARCHITECTURE

### 4.1 Hook-Based Context Injection (Key Innovation)

**The Magic**: Before Claude sees the user's message, roampal automatically injects relevant context + scoring prompt.

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER SENDS MESSAGE                                        │
│    ↓                                                         │
│ 2. HOOK: UserPromptSubmit (calls /api/hooks/get-context)    │
│    - Checks if assistant COMPLETED last response             │
│    - If completed AND previous exchange unscored:            │
│      → Injects scoring prompt with previous exchange         │
│    - KG-ROUTED UNIFIED SEARCH across all 5 collections      │
│    ↓                                                         │
│ 3. LLM SEES (auto-injected):                                │
│    <roampal-score-required>                                  │
│    Previous: User asked "..." You answered "..."             │
│    Call score_response(outcome="...") FIRST                  │
│    </roampal-score-required>                                 │
│                                                              │
│    ═══ KNOWN CONTEXT ═══                                     │
│    • User preference: Python                                 │
│    ═══ END CONTEXT ═══                                       │
│                                                              │
│    Original user message                                     │
│    ↓                                                         │
│ 4. LLM calls score_response(outcome) then responds           │
│    ↓                                                         │
│ 5. HOOK: Stop (stores exchange, enforces scoring)           │
└─────────────────────────────────────────────────────────────┘
```

**User Experience**:
- User sees: `Help me fix this auth bug`
- AI sees: Context + scoring prompt + user message
- User never has to say "remember when..." - it's automatic

### 4.2 Outcome-Based Learning System

**Score Outcomes** (granular, not binary):

| Outcome | Score Delta | When to Use |
|---------|-------------|-------------|
| `worked` | +0.20 | User satisfied, says thanks, moves on to new topic |
| `partial` | +0.05 | Lukewarm response, "kind of", "I guess" |
| `failed` | -0.30 | User corrects AI, says "no", "that's wrong" |
| `unknown` | 0 | No clear signal |

**Time-Weighted Scoring**:
```python
time_weight = 1.0 / (1 + age_days / 30)  # Decay over month
score_delta = base_delta * time_weight
```

Recent memories get stronger score updates than older ones.

**Soft Enforcement**: Hook prompts LLM to call `score_response()` FIRST, logs warning if not called. No hard blocking.

### 4.3 Five Memory Collections

| Collection | Purpose | Scorable | Decay |
|------------|---------|----------|-------|
| `books` | Uploaded reference docs (.txt, .md, .pdf) | No | Never |
| `working` | Current session context | Yes | Session-based |
| `history` | Past conversations | Yes | Score-based |
| `patterns` | Proven solutions (promoted from history) | Yes | Never |
| `memory_bank` | Permanent user facts (identity, preferences, goals) | No | Never |

**Key Insight**: `memory_bank` stores persistent user facts that don't need scoring (identity doesn't "work" or "fail"), while `working`/`history`/`patterns` evolve based on outcomes.

### 4.4 Promotion Flow (Score-Based)

```
working → history → patterns
   ↓         ↓         ↓
 score     score     score ≥ 0.8
 < 0.2:    ≥ 0.7     AND uses ≥ 3
 deleted   AND       = PATTERN
           uses ≥ 2
           = promote

 Age > 24h without promotion = deleted
```

**Automatic Cleanup**:
- Score < 0.2 → Deleted (bad advice removed)
- Age > 24h without promotion → Deleted (stale context purged)

**Automatic Promotion**:
- Score ≥ 0.7 AND uses ≥ 2 → Promote to history
- Score ≥ 0.8 AND uses ≥ 3 → Promote to patterns (proven solutions)

### 4.5 Knowledge Graphs

```
knowledge_graph.json
├── routing_patterns      # concept → best_collection
├── success_rates         # collection → success_rate
├── failure_patterns      # concept → failure_reasons
├── problem_categories    # problem_type → preferred_collections
├── problem_solutions     # problem_signature → [solution_ids]
├── solution_patterns     # pattern_hash → {problem, solution, success_rate}
└── context_action_effectiveness  # (context, action, collection) → stats
```

**How KGs Improve Search**:
1. **Routing KG**: Directs searches to collections that worked for similar concepts
2. **Action KG**: Tracks which tools work in which contexts
3. **Content KG**: Links entities to memory_bank facts for fast lookup

**Example**: Query about "JWT authentication" → Routing KG knows `patterns` collection has 92% success rate for auth topics → prioritize patterns results.

### 4.6 MCP Tools (7 Total)

| Tool | Description |
|------|-------------|
| `get_context_insights` | Get user profile + relevant memories (caches doc_ids for scoring) |
| `search_memory` | Search across memory collections |
| `add_to_memory_bank` | Store permanent user facts |
| `update_memory` | Update existing memories |
| `archive_memory` | Archive outdated memories |
| `score_response` | **SOFT ENFORCED** - Score previous exchange |
| `record_response` | **OPTIONAL** - Store key takeaways |

---

## 5. GAP ANALYSIS

### 5.1 Feature Comparison Table

| Feature | Our System (v11.2.0) | Roampal-Core | Gap | Priority |
|---------|---------------------|--------------|-----|----------|
| **Context Injection** | Manual (`/memory:search`) | Automatic (hooks) | User must remember to search | **HIGH** |
| **Outcome Learning** | Binary validation only | 4-level scoring (worked/failed/partial/unknown) | No granular feedback loop | **HIGH** |
| **Hook Integration** | No hooks | UserPromptSubmit + Stop hooks | No automatic prompt enhancement | **HIGH** |
| **Knowledge Graphs** | None | 7 KG types for routing | No concept→collection learning | **MEDIUM** |
| **Automatic Promotion** | Confidence-based (90% threshold) | Score + use-based (0.7+, 2+ uses) | Less dynamic promotion | **MEDIUM** |
| **Session Working Memory** | None | `working` collection with session decay | No ephemeral context | **LOW** |
| **Time-Weighted Scoring** | Decay only (90-day half-life) | Active time weighting on score updates | Decay affects all equally | **LOW** |
| **Collections** | Single unified store | 5 specialized collections | Less granular organization | **LOW** |
| **Tier System** | 6 tiers with boosts | 5 collections with implicit tiers | Ours is more sophisticated | ✅ Better |
| **Checkpoints** | Full checkpoint system | None | Ours has better state management | ✅ Better |
| **Anchor Retrieval** | Section-specific loading | No anchors | Ours has better token efficiency | ✅ Better |
| **Hybrid Search** | Vector + FTS5 + RRF | Vector only (ChromaDB) | Ours has more search modes | ✅ Better |
| **Constitutional Tier** | Always-surfaced critical rules | No equivalent | Ours has system rules enforcement | ✅ Better |

### 5.2 Critical Gaps (Must Address)

#### GAP-001: No Automatic Context Injection
- **Current**: AI must be told to search memory or user must invoke `/memory:search`
- **Impact**: Context recovery is opt-in, not automatic
- **User Experience**: "Why doesn't Claude remember our last conversation?"
- **Root Cause**: No hook integration in OpenCode

#### GAP-002: No Outcome-Based Learning
- **Current**: Only `wasUseful: true/false` validation
- **Impact**: Bad memories persist without demotion, good memories don't get promoted naturally
- **User Experience**: Same unhelpful context keeps surfacing
- **Root Cause**: Binary validation doesn't capture outcome nuance

### 5.3 Important Gaps (Should Address)

#### GAP-003: No Knowledge Graph Routing
- **Current**: Pure vector similarity for all searches
- **Impact**: No learning about which concepts work best with which contexts
- **User Experience**: Search quality doesn't improve over time

#### GAP-004: Limited Automatic Promotion
- **Current**: Only promotes to `critical` at 90% confidence after 5 validations
- **Impact**: Most memories stay at `normal` tier forever
- **User Experience**: Proven solutions don't automatically surface higher

### 5.4 Nice-to-Have Gaps

#### GAP-005: No Session Working Memory
- **Current**: All memories are persistent
- **Impact**: Ephemeral session context mixed with long-term knowledge
- **User Experience**: Irrelevant session details pollute search results

#### GAP-006: No Time-Weighted Scoring
- **Current**: Decay affects retrieval ranking, not score updates
- **Impact**: Old and new memories get same validation weight
- **User Experience**: Recent corrections have same impact as old validations

---

## 6. PRIORITIZED RECOMMENDATIONS

### HIGH PRIORITY

#### R1: Implement Outcome-Based Learning

**Current State**: Only `memory_validate({ id, wasUseful: true/false })` for binary feedback.

**Proposed Change**: Extend to 4-level scoring:
```typescript
memory_score({ 
  id: number,
  outcome: "worked" | "failed" | "partial" | "unknown",
  related?: string[]  // Optional: only score specific doc_ids
})
```

**Score Deltas**:
| Outcome | Score Delta |
|---------|-------------|
| `worked` | +0.20 |
| `partial` | +0.05 |
| `failed` | -0.30 |
| `unknown` | 0 |

**Schema Changes**:
```sql
ALTER TABLE memories ADD COLUMN outcome_score REAL DEFAULT 0.5;
ALTER TABLE memories ADD COLUMN outcome_count INTEGER DEFAULT 0;
ALTER TABLE memories ADD COLUMN last_outcome TEXT;
```

**Promotion Logic**:
- Score < 0.2 AND outcome_count ≥ 3 → Mark as `deprecated`
- Score ≥ 0.7 AND outcome_count ≥ 2 → Promote to `important`
- Score ≥ 0.9 AND outcome_count ≥ 5 → Promote to `critical`

**Impact**: Bad memories get demoted/excluded, good ones surface higher
**Effort**: Medium (extend `memory_validate`, add new columns, add promotion logic)
**Feasibility**: HIGH - fits existing SQLite architecture
**Risk**: Low - backward compatible, doesn't break existing validation

---

#### R2: Add Hook-Based Context Injection

**Current State**: Manual `/memory:search` or AI must remember to search.

**Proposed Change**: Implement hooks that inject context before AI processes user message.

**Architecture**:
```
User Message → [UserPromptSubmit Hook] → Enhanced Message → AI
                      ↓
              1. Search recent memories
              2. Search relevant context
              3. Inject as prefix
              4. (Optional) Add scoring prompt
```

**OpenCode Hook Integration** (requires OpenCode support):
```json
{
  "hooks": {
    "UserPromptSubmit": ["node", ".opencode/skills/system-memory/hooks/inject-context.js"],
    "Stop": ["node", ".opencode/skills/system-memory/hooks/store-exchange.js"]
  }
}
```

**Injected Context Format**:
```
═══ KNOWN CONTEXT (from memory) ═══
• [decision-049] JWT refresh pattern: Use rotating tokens
• [implementation-122] API rate limiting: 100 req/min
═══ END CONTEXT ═══

[Original user message]
```

**Impact**: Seamless context recovery, no user action needed
**Effort**: High (requires hook system in OpenCode, new script files)
**Feasibility**: MEDIUM - depends on OpenCode hook support
**Risk**: Medium - needs OpenCode platform changes
**Dependency**: OpenCode must support hooks (currently not available)

---

### MEDIUM PRIORITY

#### R3: Implement Knowledge Graph for Routing

**Current State**: Vector similarity only for all searches.

**Proposed Change**: Track concept→collection effectiveness and route queries accordingly.

**KG Structure** (new SQLite table):
```sql
CREATE TABLE routing_patterns (
  id INTEGER PRIMARY KEY,
  concept TEXT NOT NULL,
  spec_folder TEXT,
  context_type TEXT,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  success_rate REAL GENERATED ALWAYS AS 
    (CAST(success_count AS REAL) / NULLIF(success_count + failure_count, 0)) STORED,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Integration**:
1. On search, extract concepts from query
2. Query routing_patterns for concept→context_type mappings
3. Boost results from contexts with high success rates
4. On `memory_score()`, update routing_patterns

**Impact**: Smarter routing, search quality improves over time
**Effort**: Medium-High (new table, extraction logic, routing logic)
**Feasibility**: HIGH - pure SQLite addition
**Risk**: Low - additive, doesn't change core search

---

#### R4: Add Automatic Tier Promotion

**Current State**: Manual tier assignment, confidence-based promotion to critical only.

**Proposed Change**: Score-based automatic promotion flow:

```
normal → important → critical
   ↓         ↓
 score     score ≥ 0.7
 < 0.3:    AND uses ≥ 2
 demote    = promote
 to temp   
```

**Logic**:
```javascript
function evaluatePromotion(memory) {
  if (memory.outcome_score < 0.3 && memory.outcome_count >= 3) {
    return { action: 'demote', targetTier: 'temporary' };
  }
  if (memory.outcome_score >= 0.7 && memory.outcome_count >= 2) {
    if (memory.importance_tier === 'normal') {
      return { action: 'promote', targetTier: 'important' };
    }
  }
  if (memory.outcome_score >= 0.9 && memory.outcome_count >= 5) {
    if (memory.importance_tier === 'important') {
      return { action: 'promote', targetTier: 'critical' };
    }
  }
  return { action: 'none' };
}
```

**Impact**: Self-improving memory without manual curation
**Effort**: Medium (scoring infrastructure from R1 + promotion logic)
**Feasibility**: HIGH
**Risk**: Low - can be tuned via thresholds
**Dependency**: Requires R1 (Outcome-Based Learning)

---

### LOWER PRIORITY

#### R5: Add Session "Working" Collection

**Current State**: All memories are persistent in single store.

**Proposed Change**: Add ephemeral session context with auto-cleanup.

**Schema**:
```sql
CREATE TABLE working_memory (
  id INTEGER PRIMARY KEY,
  session_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding BLOB,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT DEFAULT (datetime('now', '+24 hours'))
);
```

**Behavior**:
- Auto-expires after 24 hours or session end
- Can be promoted to permanent storage on high score
- Separate from main memory table for clean separation

**Impact**: Cleaner separation of session vs persistent context
**Effort**: Low (new table, expiration logic)
**Feasibility**: HIGH
**Risk**: Very low - isolated feature

---

#### R6: Implement Time-Weighted Scoring

**Current State**: Decay affects retrieval only, not score updates.

**Proposed Change**: Recent validations have more impact than old ones.

**Formula**:
```javascript
function calculateScoreDelta(baseDelta, daysOld) {
  const timeWeight = 1.0 / (1 + daysOld / 30);
  return baseDelta * timeWeight;
}
```

**Example**:
- Memory validated today with `worked`: +0.20 × 1.0 = +0.20
- Memory validated 30 days ago with `worked`: +0.20 × 0.5 = +0.10
- Memory validated 60 days ago with `worked`: +0.20 × 0.33 = +0.07

**Impact**: Recent corrections have more immediate effect
**Effort**: Low (formula change in scoring logic)
**Feasibility**: HIGH
**Risk**: Very low - tunable parameter

---

## 7. IMPLEMENTATION ROADMAP

### Phase 1: Outcome Learning (Weeks 1-2) ⭐ RECOMMENDED FIRST

**Why First**: Foundation for all other improvements. R3 and R4 depend on this.

**Tasks**:
1. Add `outcome_score`, `outcome_count`, `last_outcome` columns to memories table
2. Create `memory_score()` MCP tool with 4-level outcomes
3. Implement score delta calculation
4. Add automatic demotion for low-score memories
5. Update `memory_search` to factor in outcome_score
6. Write tests and documentation

**Deliverables**:
- Extended schema
- New `memory_score` tool
- Updated `memory_search` with score weighting
- Documentation updates

### Phase 2: Knowledge Graph Integration (Weeks 3-4)

**Prerequisites**: Phase 1 complete

**Tasks**:
1. Create `routing_patterns` table
2. Implement concept extraction from queries
3. Build routing logic for search prioritization
4. Connect `memory_score` outcomes to routing updates
5. Add `memory_stats` KG section

**Deliverables**:
- Routing patterns table and indexes
- Concept extraction module
- Enhanced search with KG routing
- Stats display for routing effectiveness

### Phase 3: Automatic Promotion (Week 5)

**Prerequisites**: Phase 1 complete

**Tasks**:
1. Implement `evaluatePromotion()` logic
2. Add promotion check to `memory_score` flow
3. Create promotion log for tracking
4. Add promotion thresholds to config

**Deliverables**:
- Automatic promotion system
- Promotion history log
- Configurable thresholds

### Phase 4: Hook Integration (Future - Dependent on OpenCode)

**Prerequisites**: OpenCode hook support

**Tasks**:
1. Create `inject-context.js` hook script
2. Create `store-exchange.js` hook script
3. Implement context injection formatting
4. Add scoring prompt injection
5. Update OpenCode configuration

**Deliverables**:
- Hook scripts
- OpenCode config template
- Documentation

---

## 8. TECHNICAL FEASIBILITY ASSESSMENT

### R1: Outcome-Based Learning

| Aspect | Assessment |
|--------|------------|
| **Architecture Compatibility** | ✅ HIGH - Extends existing validation pattern |
| **SQLite Schema Changes** | 3 new columns, backward compatible |
| **MCP Tool Changes** | New `memory_score` tool, minimal change to `memory_validate` |
| **Breaking Changes Risk** | LOW - Additive only |
| **Testing Requirements** | Unit tests for scoring logic, integration tests for promotion |

### R2: Hook-Based Context Injection

| Aspect | Assessment |
|--------|------------|
| **Architecture Compatibility** | ⚠️ MEDIUM - Requires OpenCode platform changes |
| **SQLite Schema Changes** | None |
| **MCP Tool Changes** | New hook scripts (outside MCP) |
| **Breaking Changes Risk** | LOW - Separate from core system |
| **Testing Requirements** | E2E tests in OpenCode environment |
| **External Dependency** | OpenCode must implement hook system |

### R3: Knowledge Graph Routing

| Aspect | Assessment |
|--------|------------|
| **Architecture Compatibility** | ✅ HIGH - New table, no existing changes |
| **SQLite Schema Changes** | 1 new table with indexes |
| **MCP Tool Changes** | Modify `memory_search` routing, new stats section |
| **Breaking Changes Risk** | LOW - Additive enhancement |
| **Testing Requirements** | Unit tests for routing, performance tests |

### R4: Automatic Tier Promotion

| Aspect | Assessment |
|--------|------------|
| **Architecture Compatibility** | ✅ HIGH - Uses existing tier system |
| **SQLite Schema Changes** | None (uses R1 columns) |
| **MCP Tool Changes** | Add promotion check to `memory_score` |
| **Breaking Changes Risk** | LOW - Optional feature |
| **Testing Requirements** | Unit tests for promotion logic |
| **Dependency** | Requires R1 |

### R5: Session Working Collection

| Aspect | Assessment |
|--------|------------|
| **Architecture Compatibility** | ✅ HIGH - New isolated table |
| **SQLite Schema Changes** | 1 new table |
| **MCP Tool Changes** | New tools for working memory |
| **Breaking Changes Risk** | VERY LOW - Completely isolated |
| **Testing Requirements** | Unit tests, expiration tests |

### R6: Time-Weighted Scoring

| Aspect | Assessment |
|--------|------------|
| **Architecture Compatibility** | ✅ HIGH - Formula change only |
| **SQLite Schema Changes** | None |
| **MCP Tool Changes** | Modify score calculation |
| **Breaking Changes Risk** | VERY LOW - Tunable |
| **Testing Requirements** | Unit tests for formula |

---

## 9. SOURCES & CITATIONS

### Our System Documentation
- **SKILL.md**: `.opencode/skills/system-memory/SKILL.md` - Primary reference for system-memory v11.2.0
- **MCP Server**: `.opencode/skills/system-memory/mcp_server/semantic-memory.js`
- **Database Schema**: `.opencode/skills/system-memory/database/memory-index.sqlite`
- **Generation Script**: `.opencode/skills/system-memory/scripts/generate-context.js`

### Roampal-Core Documentation
- **Repository**: https://github.com/roampal-ai/roampal-core
- **README.md**: https://github.com/roampal-ai/roampal-core/blob/main/README.md
- **ARCHITECTURE.md**: https://raw.githubusercontent.com/roampal-ai/roampal-core/main/ARCHITECTURE.md
- **License**: Apache-2.0

### Key Roampal-Core Source Files (Referenced)
- `roampal/backend/modules/memory/scoring_service.py` - Wilson score calculation
- `roampal/backend/modules/memory/outcome_service.py` - Score updates from outcomes
- `roampal/backend/modules/memory/promotion_service.py` - Promotion/demotion logic
- `roampal/hooks/user_prompt_submit_hook.py` - Context injection
- `roampal/hooks/stop_hook.py` - Exchange storage and enforcement

---

## 10. APPENDIX

### Glossary

- **Constitutional Tier**: Highest importance tier in our system, always surfaced regardless of query
- **Decay**: Reduction in retrieval score based on time since last access
- **Hook**: External script that runs before/after AI processes messages
- **Knowledge Graph (KG)**: Data structure tracking concept→outcome patterns
- **MCP**: Model Context Protocol - standard for AI tool integration
- **Outcome Scoring**: Rating of whether AI advice worked, failed, or was partial
- **Promotion**: Moving a memory to a higher importance tier
- **RRF (Reciprocal Rank Fusion)**: Algorithm combining multiple ranked result sets
- **Soft Enforcement**: Prompting LLM to do something without blocking
- **Wilson Score**: Statistical method for ranking with confidence intervals

### Related Spec Folders
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive` - Parent memory system specs
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/014-anchor-enforcement` - Anchor format requirements
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/018-generate-context-fix` - Context generation improvements

---

## CHANGELOG & UPDATES

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-17 | 1.0.0 | Initial research completed | AI Agent |

### Recent Updates
- 2025-12-17: Completed comprehensive analysis of both systems
- 2025-12-17: Generated prioritized recommendations with implementation roadmap
- 2025-12-17: Added technical feasibility assessment for each recommendation
