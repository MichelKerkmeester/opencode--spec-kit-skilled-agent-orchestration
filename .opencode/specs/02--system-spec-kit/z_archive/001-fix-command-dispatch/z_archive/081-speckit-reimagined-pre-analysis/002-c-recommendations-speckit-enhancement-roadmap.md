> **STATUS: SUPERSEDED** — All recommendations from this pre-analysis have been implemented.
> See spec `089-speckit-reimagined-refinement` for the current audit and remediation plan.
> This document is retained for historical reference only.

---

# Actionable Recommendations: system-speckit Enhancement Roadmap

> **Research Date:** 2026-02-01
> **Based On:** Analysis of dotmd, seu-claude, drift
> **Target:** system-speckit MCP server and memory system

---

## Executive Summary

This document provides prioritized, actionable recommendations for enhancing system-speckit based on analysis of three external AI memory systems. Recommendations are organized by implementation effort and impact, with specific code patterns and migration strategies.

**[Assumes: system-speckit already has FSRS decay, 6-tier importance, ANCHOR format, RRF fusion]**

---

## 1. Priority Matrix

### P0: Quick Wins (Week 1)

| Recommendation | Source | Effort | Impact | Details |
|----------------|--------|--------|--------|---------|
| Add recovery hints to errors | drift | Low | High | See §2.1 |
| Session deduplication | drift | Low | Medium | See §2.2 |
| Compression tiers for output | drift | Low | Medium | See §2.3 |

### P1: Core Enhancements (Week 2-3)

| Recommendation | Source | Effort | Impact | Details |
|----------------|--------|--------|--------|---------|
| Tool output caching | seu-claude | Medium | High | See §3.1 |
| BM25 hybrid search | dotmd | Medium | High | See §3.2 |
| Crash recovery pattern | seu-claude | Medium | High | See §3.3 |
| Layered tool organization | drift | Medium | Medium | See §3.4 |

### P2: Advanced Features (Week 4+)

| Recommendation | Source | Effort | Impact | Details |
|----------------|--------|--------|--------|---------|
| Graph-based relationships | dotmd | High | High | See §4.1 |
| Learning from corrections | drift | High | High | See §4.2 |
| Query expansion | dotmd | Medium | Medium | See §4.3 |

---

## 2. P0 Implementations (Quick Wins)

### 2.1 Add Recovery Hints to Errors

**Current State:**
```javascript
return {
  content: [{ type: 'text', text: JSON.stringify({
    error: error.message,
    code: error.code
  }) }],
  isError: true
};
```

**Recommended Implementation:**
```javascript
// Add to context-server.js
const RECOVERY_HINTS = {
  'memory_search': {
    'E041': 'Run memory_index_scan to rebuild vector index',
    'E001': 'Check VOYAGE_API_KEY or use local embeddings',
    'E040': 'Verify query length < 10000 characters'
  },
  'checkpoint_restore': {
    'corrupted': 'Delete checkpoint and recreate: checkpoint_delete + checkpoint_create',
    'not_found': 'List available checkpoints: checkpoint_list'
  }
};

function getRecoveryHint(toolName, error) {
  return RECOVERY_HINTS[toolName]?.[error.code] || 'Try memory_health for diagnostics';
}

// In error handler
return {
  content: [{ type: 'text', text: JSON.stringify({
    error: error.message,
    code: error.code,
    hint: getRecoveryHint(name, error),
    suggestedTool: getSuggestedNextTool(name, error)
  }) }],
  isError: true
};
```

**Value:** Users (and AI) can self-recover from common errors without external documentation.

---

### 2.2 Session Deduplication

**Problem:** Same memory can surface multiple times in a conversation, wasting tokens.

**Implementation:**
```javascript
// Add to memory-triggers.js or new file: session-dedup.js
const sessionSeenIds = new Map(); // sessionId -> Set<memoryId>

function deduplicateResults(results, sessionId) {
  if (!sessionId) return results;

  const seen = sessionSeenIds.get(sessionId) || new Set();
  const filtered = results.filter(r => !seen.has(r.id));

  // Track what we're returning
  filtered.forEach(r => seen.add(r.id));
  sessionSeenIds.set(sessionId, seen);

  return filtered;
}

// Cleanup on session end
function clearSessionDedup(sessionId) {
  sessionSeenIds.delete(sessionId);
}
```

**Value:** Prevents memory echo in conversations, reduces token waste.

---

### 2.3 Compression Tiers for Output

**Inspiration from drift:** Four levels of detail selectable per query.

**Implementation:**
```javascript
// Add compression parameter to memory_search
const COMPRESSION_TIERS = {
  minimal: {  // ~100 tokens per result
    fields: ['id', 'title', 'importance_tier'],
    snippetLength: 50
  },
  compact: {  // ~200 tokens per result
    fields: ['id', 'title', 'importance_tier', 'summary'],
    snippetLength: 150
  },
  standard: { // ~400 tokens per result (current default)
    fields: ['id', 'title', 'importance_tier', 'summary', 'anchors'],
    snippetLength: 300
  },
  full: {     // Complete content
    fields: null, // All fields
    snippetLength: null // No truncation
  }
};

// In memory_search handler
const tier = COMPRESSION_TIERS[args.compression || 'standard'];
const results = await memory_search(args);
return results.map(r => compressResult(r, tier));
```

**Value:** AI can request minimal results for broad searches, full for deep dives.

---

## 3. P1 Implementations (Core Enhancements)

### 3.1 Tool Output Caching

**Pattern from seu-claude:** Cache expensive operation results per task.

**Implementation:**
```javascript
// New file: lib/cache/tool-cache.js
const toolCache = new Map();
const CACHE_TTL_MS = 60000; // 1 minute
const CACHEABLE_TOOLS = new Set([
  'memory_search',
  'memory_list',
  'checkpoint_list',
  'memory_stats'
]);

function getCacheKey(name, args) {
  const safeArgs = { ...args };
  delete safeArgs.sessionId; // Don't cache per-session
  return `${name}:${JSON.stringify(safeArgs)}`;
}

async function cachedToolCall(name, args, handler) {
  if (!CACHEABLE_TOOLS.has(name)) {
    return handler(args);
  }

  const key = getCacheKey(name, args);
  const cached = toolCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { ...cached.result, _cached: true };
  }

  const result = await handler(args);
  toolCache.set(key, { result, timestamp: Date.now() });
  return result;
}

// Invalidation on writes
function invalidateCache(pattern) {
  for (const key of toolCache.keys()) {
    if (key.startsWith(pattern)) {
      toolCache.delete(key);
    }
  }
}
```

**Value:** 50-80% reduction in redundant search operations during multi-turn conversations.

---

### 3.2 Add BM25 Hybrid Search

**Pattern from dotmd:** Combine semantic + BM25 + optional graph with RRF.

**Current:** system-speckit uses vector + FTS5 with RRF.

**Enhancement:** Add proper BM25 scoring alongside FTS5:

```javascript
// Add to lib/search/bm25-search.js
const { BM25 } = require('bm25-wasm'); // Or implement in JS

let bm25Index = null;

function buildBM25Index(documents) {
  bm25Index = new BM25();
  documents.forEach((doc, idx) => {
    bm25Index.addDocument(doc.content, idx);
  });
}

function bm25Search(query, limit = 20) {
  if (!bm25Index) return [];
  return bm25Index.search(query, limit).map(r => ({
    id: r.documentId,
    score: r.score
  }));
}

// In hybrid search
const results = {
  semantic: await vectorSearch(query, limit * 2),
  bm25: bm25Search(query, limit * 2),
  fts5: fts5Search(query, limit * 2) // Keep existing
};

return rrfFusion(results, { k: 60, weights: { semantic: 1.0, bm25: 1.0, fts5: 0.8 } });
```

**Value:** BM25 better handles exact keyword matches that semantic search misses.

---

### 3.3 Crash Recovery Pattern

**Pattern from seu-claude:** State survives process crashes with explicit recovery.

**Implementation:**
```javascript
// Add to lib/storage/session-state.js
const db = require('../database');

function saveSessionState(sessionId, state) {
  db.prepare(`
    INSERT OR REPLACE INTO session_state (session_id, state, updated_at)
    VALUES (?, ?, datetime('now'))
  `).run(sessionId, JSON.stringify(state));
}

function recoverSessionState(sessionId) {
  const row = db.prepare(`
    SELECT state FROM session_state WHERE session_id = ?
  `).get(sessionId);
  return row ? JSON.parse(row.state) : null;
}

function resetInterruptedSessions() {
  // Mark sessions that were 'active' as 'interrupted'
  const result = db.prepare(`
    UPDATE session_state
    SET state = json_set(state, '$.status', 'interrupted')
    WHERE json_extract(state, '$.status') = 'active'
  `).run();
  return result.changes;
}

// On server startup
function initializeWithRecovery() {
  const interrupted = resetInterruptedSessions();
  if (interrupted > 0) {
    console.log(`Recovered ${interrupted} interrupted sessions`);
  }
}
```

**Value:** Multi-turn workflows survive crashes; users can resume from last state.

---

### 3.4 Layered Tool Organization

**Pattern from drift:** Token budgets per layer, progressive disclosure.

**Implementation:** Reorganize 17+ tools into layers:

```javascript
const TOOL_LAYERS = {
  discovery: {
    tools: ['memory_health', 'memory_stats'],
    tokenBudget: 500,
    description: 'Quick status checks'
  },
  exploration: {
    tools: ['memory_list', 'memory_search', 'memory_match_triggers'],
    tokenBudget: 1500,
    description: 'Browse and search memories'
  },
  detail: {
    tools: ['checkpoint_list', 'checkpoint_get'],
    tokenBudget: 2000,
    description: 'Detailed information retrieval'
  },
  mutation: {
    tools: ['memory_save', 'memory_update', 'memory_delete', 'memory_index_scan'],
    tokenBudget: 1000,
    description: 'Write operations'
  },
  analysis: {
    tools: ['task_preflight', 'task_postflight', 'memory_get_learning_history'],
    tokenBudget: 2500,
    description: 'Session learning and analysis'
  }
};

// Update tool descriptions to indicate layer
function enhanceToolDescription(tool) {
  const layer = Object.entries(TOOL_LAYERS)
    .find(([_, l]) => l.tools.includes(tool.name));
  if (layer) {
    tool.description = `[${layer[0].toUpperCase()}] ${tool.description}`;
  }
  return tool;
}
```

**Value:** AI can make informed tool selection; prevents context overflow.

---

## 4. P2 Implementations (Advanced Features)

### 4.1 Graph-Based Relationships

**Pattern from dotmd:** Entity nodes + relationship edges for discovery.

**Schema Extension:**
```sql
-- Add to database schema
CREATE TABLE memory_entities (
  id INTEGER PRIMARY KEY,
  memory_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,  -- 'concept', 'file', 'decision', 'person'
  entity_value TEXT NOT NULL,
  FOREIGN KEY (memory_id) REFERENCES memories(id)
);

CREATE TABLE memory_relationships (
  id INTEGER PRIMARY KEY,
  source_memory_id TEXT NOT NULL,
  target_memory_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL, -- 'MENTIONS', 'DEPENDS_ON', 'SUPERSEDES', 'CO_OCCURS'
  weight REAL DEFAULT 1.0,
  FOREIGN KEY (source_memory_id) REFERENCES memories(id),
  FOREIGN KEY (target_memory_id) REFERENCES memories(id)
);

CREATE INDEX idx_entity_value ON memory_entities(entity_value);
CREATE INDEX idx_relationship_source ON memory_relationships(source_memory_id);
```

**Graph Search Implementation:**
```javascript
// lib/search/graph-search.js
function graphSearch(seedMemoryIds, maxHops = 2) {
  const discovered = new Set();
  let frontier = new Set(seedMemoryIds);

  for (let hop = 0; hop < maxHops; hop++) {
    const nextFrontier = new Set();
    for (const id of frontier) {
      const neighbors = db.prepare(`
        SELECT target_memory_id, weight
        FROM memory_relationships
        WHERE source_memory_id = ?
      `).all(id);

      neighbors.forEach(n => {
        if (!discovered.has(n.target_memory_id) && !seedMemoryIds.includes(n.target_memory_id)) {
          nextFrontier.add(n.target_memory_id);
          discovered.add(n.target_memory_id);
        }
      });
    }
    frontier = nextFrontier;
  }

  return Array.from(discovered);
}
```

**Value:** Surface related memories not found by keyword/semantic search.

---

### 4.2 Learning from Corrections

**Pattern from drift:** Extract generalizable principles from feedback.

**Implementation:**
```javascript
// lib/learning/correction-processor.js
const CORRECTION_TYPES = [
  'security', 'performance', 'style', 'architecture', 'naming',
  'error_handling', 'testing', 'documentation', 'api_design', 'data_handling'
];

async function processCorrection(originalMemoryId, correctionText, feedbackType) {
  // 1. Analyze what changed
  const original = await getMemory(originalMemoryId);
  const diff = analyzeDiff(original.content, correctionText);

  // 2. Categorize the correction
  const category = classifyCorrection(diff, feedbackType);

  // 3. Extract generalizable principle
  const principle = await extractPrinciple(diff, category);

  // 4. Create or update memory
  if (principle.isGeneralizable) {
    await memory_save({
      content: principle.text,
      importance_tier: 'important',
      metadata: {
        source: 'correction_learning',
        original_memory: originalMemoryId,
        correction_type: category
      }
    });
  }

  // 5. Adjust original memory confidence
  await adjustConfidence(originalMemoryId, -0.1);

  return { principle, category };
}
```

**Value:** Memory system evolves based on actual usage; reduces repeated mistakes.

---

### 4.3 Query Expansion

**Pattern from dotmd:** Expand queries with synonyms/related terms before search.

**Implementation:**
```javascript
// lib/search/query-expander.js
const acronymDb = new Map(); // Loaded from indexed content

function expandQuery(query) {
  const expansions = [];

  // 1. Acronym expansion (fuzzy match)
  const words = query.split(/\s+/);
  for (const word of words) {
    const expanded = acronymDb.get(word.toUpperCase());
    if (expanded) {
      expansions.push(expanded);
    }
  }

  // 2. Synonym expansion (could use embeddings for similarity)
  // Simple version: common technical synonyms
  const synonyms = {
    'auth': ['authentication', 'authorization', 'login'],
    'db': ['database', 'data store', 'persistence'],
    'api': ['endpoint', 'interface', 'service']
  };
  for (const [abbrev, syns] of Object.entries(synonyms)) {
    if (query.toLowerCase().includes(abbrev)) {
      expansions.push(...syns);
    }
  }

  // Return expanded query
  return expansions.length > 0
    ? `${query} ${expansions.join(' ')}`
    : query;
}
```

**Value:** Improved recall for queries using abbreviations or synonyms.

---

## 5. Implementation Roadmap

### Week 1: Quick Wins
- [ ] Add recovery hints to all error responses
- [ ] Implement session deduplication
- [ ] Add compression tiers parameter

### Week 2: Core Caching
- [ ] Implement tool output cache
- [ ] Add cache invalidation on writes
- [ ] Add `_cached` flag to responses

### Week 3: Search Enhancement
- [ ] Add BM25 search alongside FTS5
- [ ] Update RRF fusion with 3-engine weights
- [ ] Implement crash recovery pattern

### Week 4: Organization
- [ ] Reorganize tools into layers
- [ ] Update tool descriptions with layer prefixes
- [ ] Document token budgets

### Week 5-6: Graph System
- [ ] Add entity/relationship tables
- [ ] Implement entity extraction on save
- [ ] Add graph search to hybrid pipeline

### Week 7-8: Learning System
- [ ] Implement correction processor
- [ ] Add feedback endpoint
- [ ] Connect to confidence adjustment

---

## 6. Risk Considerations

| Risk | Mitigation |
|------|------------|
| Cache invalidation complexity | Start with conservative TTL (60s), tune based on usage |
| Graph database scaling | Index heavily, consider LadybugDB if SQLite insufficient |
| Learning system errors | Gate behind feature flag, require high confidence threshold |
| Breaking API changes | Version all new parameters with defaults to maintain compatibility |

---

## 7. Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Redundant searches | Unknown | -50% | Cache hit rate |
| Error recovery time | Manual | Self-service | Hint usage tracking |
| Token efficiency | ~400/result | Configurable | Compression tier adoption |
| Related memory discovery | Keyword only | +30% via graph | A/B test recall |

---

## Conclusion

system-speckit has a strong foundation with FSRS decay, 6-tier importance, and ANCHOR format. The recommended enhancements focus on:

1. **Immediate UX improvements** (recovery hints, deduplication)
2. **Performance optimization** (caching, BM25)
3. **Resilience** (crash recovery)
4. **Advanced discovery** (graph relationships, learning)

Start with P0 quick wins to demonstrate value, then proceed through P1/P2 based on usage patterns and feedback.

---

## References

- dotmd: https://github.com/inventivepotter/dotmd
- seu-claude: https://github.com/jardhel/seu-claude
- drift: https://github.com/dadbodgeoff/drift
- system-speckit: `.opencode/skill/system-spec-kit/`
