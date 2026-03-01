---
title: "Research: Cognitive Memory Upgrade for Spec Kit [055-cognitive-memory-upgrade/research]"
description: "Request: Analyze claude-cognitive repository for transferable concepts to upgrade Spec Kit Memory, with the constraint that OpenCode does not have hooks."
trigger_phrases:
  - "research"
  - "cognitive"
  - "memory"
  - "upgrade"
  - "for"
  - "055"
importance_tier: "normal"
contextType: "research"
---
# Research: Cognitive Memory Upgrade for Spec Kit

## Metadata
- **Research ID:** 055-cognitive-memory-upgrade
- **Status:** COMPLETE
- **Date:** 2026-01-01
- **Researcher:** Claude (Orchestrator + Research Agents)
- **Source:** https://github.com/GMaN1911/claude-cognitive

---

## Executive Summary

### Investigation Report

**Request:** Analyze claude-cognitive repository for transferable concepts to upgrade Spec Kit Memory, with the constraint that OpenCode does not have hooks.

**Key Findings:**
1. Claude-cognitive is an attention-based working memory system that **fundamentally depends on hooks**
2. The core concepts (decay, tiered injection, co-activation) ARE transferable
3. OpenCode's Gate 1 (`memory_match_triggers`) serves as a "soft hook" equivalent
4. Existing Spec Kit infrastructure (access_count, related_memories columns) is underutilized
5. A phased enhancement approach can achieve similar benefits without hooks

**Recommendation:** Proceed with enhancement. Implement working memory layer using Gate 1 as trigger point. Start with quick wins (use existing columns), then add working memory table and enhanced trigger matching.

### Architecture Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLAUDE-COGNITIVE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Trigger: Hooks (UserPromptSubmit, SessionStart, Stop)                      │
│  Storage: JSON files (.claude/attn_state.json)                              │
│  Scope: Project files (systems/, modules/, integrations/)                   │
│  Injection: stdout → Claude context (automatic)                             │
│  Decay: Per-turn, configurable by category (0.70-0.85)                      │
│  Tiers: HOT (≥0.8) / WARM (0.25-0.8) / COLD (<0.25)                        │
│  Co-activation: Static graph in Python dict                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        SPEC KIT MEMORY (Current)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  Trigger: MCP tool calls (explicit)                                         │
│  Storage: SQLite + sqlite-vec (vector embeddings)                           │
│  Scope: Memory entries (conversation context, decisions)                    │
│  Injection: MCP response → Claude processes (explicit)                      │
│  Decay: Time-based only (decay_half_life_days)                              │
│  Tiers: constitutional/critical/important/normal/temporary/deprecated       │
│  Co-activation: related_memories column (NOT USED)                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        SPEC KIT MEMORY (Proposed)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Trigger: Gate 1 memory_match_triggers (per-message, mandated)              │
│  Storage: SQLite + working_memory table (session-scoped)                    │
│  Scope: Memory entries with attention scores                                │
│  Injection: Tiered MCP response (HOT=full, WARM=summary)                    │
│  Decay: Turn-based + time-based hybrid                                      │
│  Tiers: HOT/WARM/COLD (attention) + importance tiers (priority)             │
│  Co-activation: Auto-populated related_memories with spreading activation   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Quick Reference

| Aspect | Claude-Cognitive | Current Spec Kit | Proposed Enhancement |
|--------|-----------------|------------------|---------------------|
| Hook Dependency | **REQUIRED** | None | None |
| Automatic Decay | ✅ Per-turn | ⚠️ Time-only | ✅ Turn-based |
| Tiered Content | ✅ HOT/WARM/COLD | ❌ All-or-nothing | ✅ Tiered |
| Co-Activation | ✅ Static graph | ❌ Unused column | ✅ Dynamic |
| Session Awareness | ✅ Full | ⚠️ Partial | ✅ Full |
| Vector Search | ❌ Keyword only | ✅ Semantic | ✅ Semantic |
| Importance Tiers | ❌ None | ✅ 6 tiers | ✅ 6 tiers |

---

## Core Architecture Analysis

### Claude-Cognitive: How It Works

**Hook Lifecycle:**
```
SESSION START                      USER PROMPT                        SESSION END
     │                                  │                                  │
     ▼                                  ▼                                  ▼
┌──────────┐                    ┌──────────────┐                    ┌──────────┐
│ pool-    │                    │ context-     │                    │ pool-    │
│ loader.py│                    │ router-v2.py │                    │ extractor│
└──────────┘                    └──────────────┘                    └──────────┘
     │                                  │                                  │
     ▼                                  ▼                                  ▼
Load recent pool            1. Decay all scores              Extract pool blocks
entries by relevance        2. Activate on keywords          from response
                            3. Co-activate related
                            4. Build tiered output
                            5. Print to stdout
```

**Attention Dynamics:**
- Files have attention scores (0.0 - 1.0)
- Scores decay per turn (multiply by 0.70-0.85)
- Keyword mention → score = 1.0 (full activation)
- Related files get +0.35 boost (co-activation)
- HOT (≥0.8): Full file injected
- WARM (0.25-0.8): First 25 lines only
- COLD (<0.25): Not injected

**Example Decay Curve:**
```
Turn 1: User mentions "auth" → score = 1.0 (HOT)
Turn 2: No mention → score = 0.85 (HOT)
Turn 3: No mention → score = 0.72 (WARM)
Turn 4: No mention → score = 0.61 (WARM)
...
Turn 10: No mention → score = 0.22 (COLD - evicted!)
```

### Spec Kit Memory: Current State

**Architecture:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Spec Kit Memory System                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  MCP Server (context-server.js v16.0.0)                             │
│  ├── Vector Index (sqlite-vec, 1024-dim Voyage embeddings)          │
│  ├── Trigger Matcher (<50ms keyword matching)                       │
│  ├── Hybrid Search (Vector + FTS5 with RRF fusion)                  │
│  ├── Checkpoints (gzip compressed state snapshots)                  │
│  ├── Confidence Tracker (validation feedback)                       │
│  └── Importance Tiers (6-tier system)                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Database Schema (Key Tables):**
```sql
-- Main metadata table
memory_index (
  id, spec_folder, file_path, title, trigger_phrases,
  importance_weight, importance_tier, confidence,
  access_count, last_accessed,  -- UNDERUTILIZED
  related_memories,              -- NOT USED
  decay_half_life_days, is_pinned,
  embedding_status, content_hash, ...
)

-- Vector storage
vec_memories (embedding FLOAT[1024])

-- Full-text search
memory_fts (title, trigger_phrases, file_path)
```

**Current Capabilities:**
- ✅ Semantic vector search
- ✅ Trigger phrase matching (<50ms)
- ✅ 6-tier importance system
- ✅ Checkpoints for state snapshots
- ✅ Validation/confidence tracking
- ✅ Time-based decay (passive)

**Current Limitations:**
- ❌ No turn-based decay (only time-based)
- ❌ No tiered content injection (all-or-nothing)
- ❌ related_memories column unused
- ❌ access_count/last_accessed underutilized
- ❌ No session-scoped working memory
- ❌ No automatic context surfacing

---

## Hook Dependency Analysis

### Claude-Cognitive Hook Requirements

| Hook | Script | Purpose | **CRITICAL?** |
|------|--------|---------|---------------|
| `UserPromptSubmit` | context-router-v2.py | Inject context before message | **YES** |
| `UserPromptSubmit` | pool-auto-update.py | Detect completions | **YES** |
| `SessionStart` | pool-loader.py | Load team activity | **YES** |
| `Stop` | pool-extractor.py | Extract pool blocks | **YES** |

**Verdict:** The system's value proposition (automatic, invisible memory) **requires hooks**. Without them, the UX degrades to manual CLI workflows.

### OpenCode's Hook-Free Alternative: Gate 1

**AGENTS.md Gate 1:**
```
GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT BLOCK]
Trigger: EACH new user message
Action:  1a. Call memory_match_triggers(prompt) → Surface relevant context
```

**Key Insight:** Gate 1 is MANDATED to run on every user message. This is effectively a "soft hook" - not automatic like Claude Code hooks, but enforced by AGENTS.md rules.

**What We Can Do:**
1. Enhance `memory_match_triggers` to track session state
2. Apply decay on each call
3. Return tiered content (HOT=full, WARM=summary)
4. Track co-activation relationships

**What We Cannot Do:**
1. Inject context BEFORE the message (no pre-message hook)
2. Process Claude's response (no post-response hook)
3. Guarantee execution (relies on Claude following AGENTS.md)

---

## Transferable Concepts

### Concept 1: Attention-Based Decay

**Claude-Cognitive:**
- Per-turn decay (multiply by 0.70-0.85)
- Configurable by file category
- Natural forgetting of stale context

**Spec Kit Adaptation:**
- Add turn tracking to working memory
- Decay on each `memory_match_triggers` call
- Configurable decay rates per importance tier

**Implementation:**
```javascript
// On each memory_match_triggers call
async function applyDecay(sessionId, decayRate = 0.80) {
  await db.run(`
    UPDATE working_memory 
    SET attention_score = attention_score * ?
    WHERE session_id = ?
  `, [decayRate, sessionId]);
}
```

### Concept 2: Tiered Content Injection

**Claude-Cognitive:**
- HOT (≥0.8): Full file content
- WARM (0.25-0.8): First 25 lines (headers)
- COLD (<0.25): Not injected

**Spec Kit Adaptation:**
- HOT: Full memory content (includeContent: true)
- WARM: Title + summary + trigger phrases
- COLD: Not returned (tracked for reactivation)

**Implementation:**
```javascript
function getTieredContent(memory, tier) {
  switch (tier) {
    case 'HOT':
      return { ...memory, content: memory.fullContent };
    case 'WARM':
      return { 
        ...memory, 
        content: `${memory.title}\n${memory.summary}\nTriggers: ${memory.triggerPhrases}` 
      };
    case 'COLD':
      return null; // Not returned
  }
}
```

### Concept 3: Co-Activation Graph

**Claude-Cognitive:**
- Static Python dict mapping files to related files
- +0.35 boost to related files when primary is activated
- Spreading activation like neural networks

**Spec Kit Adaptation:**
- Auto-populate `related_memories` during indexing
- Use semantic similarity to find related memories
- Apply boost when memory is activated

**Implementation:**
```javascript
// During indexing
async function populateRelatedMemories(memoryId) {
  const similar = await vectorSearch(memoryId, { limit: 5 });
  await db.run(`
    UPDATE memory_index 
    SET related_memories = ?
    WHERE id = ?
  `, [JSON.stringify(similar.map(s => s.id)), memoryId]);
}

// During activation
async function coActivate(sessionId, memoryId, boost = 0.35) {
  const related = await getRelatedMemories(memoryId);
  for (const relId of related) {
    await db.run(`
      UPDATE working_memory 
      SET attention_score = MIN(1.0, attention_score + ?)
      WHERE session_id = ? AND memory_id = ?
    `, [boost, sessionId, relId]);
  }
}
```

### Concept 4: Working Memory Model

**Claude-Cognitive:**
- Session-scoped attention state
- Limited context window (MAX_HOT_FILES = 4, MAX_WARM_FILES = 8)
- Dynamic, not archival

**Spec Kit Adaptation:**
- Add `working_memory` table for session state
- Track attention scores per session
- Enforce limits on HOT/WARM counts

**Schema:**
```sql
CREATE TABLE working_memory (
  session_id TEXT NOT NULL,
  memory_id INTEGER NOT NULL,
  attention_score REAL DEFAULT 0.0,
  last_mentioned_turn INTEGER,
  tier TEXT DEFAULT 'COLD',
  created_at TEXT,
  updated_at TEXT,
  PRIMARY KEY (session_id, memory_id),
  FOREIGN KEY (memory_id) REFERENCES memory_index(id)
);
```

---

## Proposed Architecture

### Three-Layer Memory Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ENHANCED SPEC KIT MEMORY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LAYER 1: WORKING MEMORY (New)                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Session-scoped attention scores                                       │ │
│  │ • Turn-based decay (triggered by memory_match_triggers)                │ │
│  │ • HOT/WARM/COLD tiers for content injection amount                     │ │
│  │ • Co-activation graph (spreading activation)                           │ │
│  │ • Limits: MAX_HOT=5, MAX_WARM=10                                       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                              ▲                                              │
│                              │ Promotes/Demotes                             │
│                              ▼                                              │
│  LAYER 2: EPISODIC MEMORY (Enhanced)                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Current semantic search (vector + FTS5)                              │ │
│  │ • Enhanced trigger matching with session awareness                     │ │
│  │ • Validation/confidence tracking                                       │ │
│  │ • Checkpoints (now include working memory state)                       │ │
│  │ • Auto-populated related_memories                                      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                              ▲                                              │
│                              │ References                                   │
│                              ▼                                              │
│  LAYER 3: SEMANTIC MEMORY (Current)                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Constitutional tier (always surfaces, similarity: 100)               │ │
│  │ • Long-term storage with vector embeddings                             │ │
│  │ • Importance tiers (critical, important, normal, etc.)                 │ │
│  │ • Time-based decay for archival memories                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Enhanced Data Flow

```
User Message
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 1: memory_match_triggers(prompt, session_id, turn_number)              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. DECAY: Apply turn-based decay to all working memory                     │
│     └── attention_score *= decay_rate (0.80 default)                        │
│                                                                             │
│  2. MATCH: Find memories matching trigger phrases                           │
│     └── Fast keyword matching (<50ms)                                       │
│                                                                             │
│  3. ACTIVATE: Set matched memories to score = 1.0                           │
│     └── Update working_memory table                                         │
│                                                                             │
│  4. CO-ACTIVATE: Boost related memories (+0.35)                             │
│     └── Use related_memories column                                         │
│                                                                             │
│  5. CLASSIFY: Assign HOT/WARM/COLD tiers                                    │
│     └── HOT ≥ 0.8, WARM 0.25-0.8, COLD < 0.25                              │
│                                                                             │
│  6. RETURN: Tiered results with appropriate content                         │
│     └── HOT: full content, WARM: summary, COLD: not returned               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
     │
     ▼
Claude receives tiered context automatically via Gate 1
```

### Enhanced MCP Tools

**Modified Tools:**

| Tool | Enhancement |
|------|-------------|
| `memory_match_triggers` | Accept session_id, turn_number; apply decay; return tiered content |
| `memory_search` | Update access_count/last_accessed; boost working memory |
| `memory_save` | Auto-populate related_memories during indexing |
| `checkpoint_create` | Include working_memory state in snapshot |
| `checkpoint_restore` | Restore working_memory state |

**New Tools:**

| Tool | Purpose |
|------|---------|
| `memory_working_status` | Show current working memory state (HOT/WARM/COLD counts) |
| `memory_working_activate` | Manually activate a memory (score = 1.0) |
| `memory_working_clear` | Clear working memory for session |

---

## Implementation Roadmap

### Phase 0.5: Quick Wins (1-2 days)

**Goal:** Use existing infrastructure better

1. **Use access_count/last_accessed columns**
   - Update on every memory access
   - Boost recently accessed in search ranking
   - No schema changes needed

2. **Add summary field**
   - Generate during indexing (first 100 chars or extracted)
   - Return for WARM-tier results
   - Single column addition

3. **Basic co-activation in search**
   - When returning results, include related memories
   - Use existing related_memories column
   - Populate manually or via similarity

**Deliverables:**
- [ ] Update memory_search to track access
- [ ] Add summary column to memory_index
- [ ] Modify indexing to generate summaries
- [ ] Include related memories in search results

### Phase 1: Working Memory Foundation (3-5 days)

**Goal:** Add session-scoped attention tracking

1. **Add working_memory table**
   ```sql
   CREATE TABLE working_memory (
     session_id TEXT NOT NULL,
     memory_id INTEGER NOT NULL,
     attention_score REAL DEFAULT 0.0,
     last_mentioned_turn INTEGER,
     tier TEXT DEFAULT 'COLD',
     created_at TEXT,
     updated_at TEXT,
     PRIMARY KEY (session_id, memory_id)
   );
   ```

2. **Session tracking**
   - Generate session_id on first memory operation
   - Pass session_id in tool calls
   - Track turn count within session

3. **Basic decay mechanics**
   - Decay on each memory_match_triggers call
   - Configurable decay rate (default 0.80)
   - Tier classification (HOT/WARM/COLD)

**Deliverables:**
- [ ] Create working_memory table
- [ ] Add session_id parameter to tools
- [ ] Implement decay function
- [ ] Implement tier classification

### Phase 2: Enhanced Trigger Matching (3-5 days)

**Goal:** Make Gate 1 powerful

1. **Session-aware trigger matching**
   - Accept session_id, turn_number parameters
   - Initialize working memory for new sessions
   - Track turn progression

2. **Turn-based decay**
   - Apply decay before matching
   - Different rates by importance tier
   - Pinned memories exempt

3. **Tiered content responses**
   - HOT: Full content (includeContent: true equivalent)
   - WARM: Title + summary + triggers
   - COLD: Not returned

**Deliverables:**
- [ ] Modify memory_match_triggers signature
- [ ] Implement turn-based decay
- [ ] Implement tiered content generation
- [ ] Update response format

### Phase 3: Co-Activation Graph (2-3 days)

**Goal:** Spreading activation

1. **Auto-populate related_memories**
   - During indexing, find semantically similar memories
   - Store top 5 related memory IDs
   - Update on re-indexing

2. **Spreading activation**
   - When memory activated, boost related (+0.35)
   - Cap at 1.0
   - Track activation source

3. **Boost mechanics**
   - Co-activation boost configurable
   - Decay applies to boosted memories too
   - Prevent runaway activation

**Deliverables:**
- [ ] Implement similarity-based relationship detection
- [ ] Add co-activation to trigger matching
- [ ] Add boost tracking
- [ ] Test spreading activation

### Phase 4: Polish & Integration (2-3 days)

**Goal:** Production-ready

1. **AGENTS.md updates**
   - Document new parameters for Gate 1
   - Update tool reference
   - Add working memory section

2. **Command updates**
   - `/memory:status` - Show working memory state
   - `/memory:activate` - Manual activation
   - Update existing commands

3. **Documentation**
   - Update SKILL.md
   - Add migration guide
   - Performance benchmarks

**Deliverables:**
- [ ] Update AGENTS.md
- [ ] Add new commands
- [ ] Update SKILL.md
- [ ] Write migration guide
- [ ] Performance testing

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance degradation | Medium | High | Benchmark each phase; optimize SQL |
| Session state corruption | Low | High | Transaction-based updates; checkpoints |
| Backward compatibility break | Medium | Medium | Feature flags; gradual rollout |
| Gate 1 not reliably called | Medium | High | Make it valuable; add fallback commands |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Complexity increase | High | Medium | Incremental implementation; good docs |
| User confusion | Medium | Medium | Clear documentation; sensible defaults |
| Debugging difficulty | Medium | Medium | Add memory_working_status tool |

### Mitigation Strategies

1. **Feature Flags**
   - `ENABLE_WORKING_MEMORY=true/false`
   - `ENABLE_CO_ACTIVATION=true/false`
   - Allow gradual rollout

2. **Backward Compatibility**
   - Existing tools work unchanged if no session_id passed
   - New features are additive
   - No breaking changes to existing memories

3. **Performance Monitoring**
   - Log timing for decay operations
   - Alert if trigger matching exceeds 100ms
   - Benchmark before/after each phase

---

## Success Metrics

### Quantitative

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Relevant context surfaced | ~60% | ~85% | User validation feedback |
| Token efficiency | Baseline | +30% | WARM tier usage |
| Trigger match latency | <50ms | <100ms | Performance logs |
| Memory reactivation rate | N/A | >20% | Co-activation triggers |

### Qualitative

- [ ] Context feels more "alive" and responsive
- [ ] Less manual memory searching needed
- [ ] Related context appears without explicit request
- [ ] Stale context naturally fades

---

## Appendix

### A. Claude-Cognitive Key Files

| File | LOC | Purpose |
|------|-----|---------|
| `context-router-v2.py` | ~500 | Core attention engine |
| `pool-auto-update.py` | ~200 | Implicit signal detection |
| `pool-loader.py` | ~200 | Session start injection |
| `history.py` | ~200 | History viewer |

### B. Spec Kit Memory Key Files

| File | Purpose |
|------|---------|
| `mcp_server/context-server.js` | Main MCP server |
| `mcp_server/lib/vector-index.js` | Vector storage |
| `mcp_server/lib/trigger-matcher.js` | Fast phrase matching |
| `mcp_server/lib/hybrid-search.js` | Vector + FTS5 fusion |
| `scripts/generate-context.js` | Memory file generation |

### C. Database Schema Changes

**New Table:**
```sql
CREATE TABLE working_memory (
  session_id TEXT NOT NULL,
  memory_id INTEGER NOT NULL,
  attention_score REAL DEFAULT 0.0,
  last_mentioned_turn INTEGER,
  tier TEXT DEFAULT 'COLD',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (session_id, memory_id),
  FOREIGN KEY (memory_id) REFERENCES memory_index(id)
);

CREATE INDEX idx_working_session ON working_memory(session_id);
CREATE INDEX idx_working_tier ON working_memory(tier);
```

**Column Addition:**
```sql
ALTER TABLE memory_index ADD COLUMN summary TEXT;
```

### D. Configuration Options

```javascript
const WORKING_MEMORY_CONFIG = {
  // Decay settings
  defaultDecayRate: 0.80,
  decayRateByTier: {
    constitutional: 1.0,  // No decay
    critical: 0.95,
    important: 0.90,
    normal: 0.80,
    temporary: 0.60,
    deprecated: 0.50
  },
  
  // Tier thresholds
  hotThreshold: 0.8,
  warmThreshold: 0.25,
  
  // Limits
  maxHotMemories: 5,
  maxWarmMemories: 10,
  
  // Co-activation
  coActivationBoost: 0.35,
  maxRelatedMemories: 5,
  
  // Session
  sessionTimeoutMinutes: 120
};
```

### E. References

- [Claude-Cognitive Repository](https://github.com/GMaN1911/claude-cognitive)
- [Spec Kit Memory SKILL.md](.opencode/skill/system-spec-kit/SKILL.md)
- [AGENTS.md Section 6: Tool System](AGENTS.md)
- [MCP Server Implementation](.opencode/skill/system-spec-kit/mcp_server/)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-01 | Initial research complete |
