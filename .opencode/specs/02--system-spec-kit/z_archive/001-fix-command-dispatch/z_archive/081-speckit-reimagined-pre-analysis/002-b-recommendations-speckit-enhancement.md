> **STATUS: SUPERSEDED** — All recommendations from this pre-analysis have been implemented.
> See spec `089-speckit-reimagined-refinement` for the current audit and remediation plan.
> This document is retained for historical reference only.

---

# Actionable Recommendations: system-speckit Enhancement

> **Executive Summary:** Prioritized recommendations for enhancing system-speckit based on analysis of dotmd, seu-claude, and drift repositories. Organized by implementation complexity and expected impact.

---

## 1. Priority Matrix

| Priority | Enhancement | Effort | Impact | Source |
|----------|-------------|--------|--------|--------|
| **P0** | Intent-aware retrieval | Low | High | drift |
| **P0** | Session deduplication | Medium | High | drift |
| **P1** | Standardized response structure | Low | Medium | drift |
| **P1** | Causal memory relationships | High | High | drift |
| **P2** | Cross-encoder reranking | Medium | Medium | dotmd |
| **P2** | Memory consolidation engine | High | Medium | drift |
| **P3** | Graph-seeded discovery | High | Medium | dotmd |
| **P3** | Tool output caching | Medium | Low | seu-claude |

---

## 2. P0: Intent-Aware Retrieval

### 2.1 Problem Statement

Current `memory_search` treats all queries equally. However, different tasks (debugging vs feature implementation) should prioritize different memory types.

### 2.2 Implementation Strategy

**Add `intent` parameter to `memory_search`:**

```javascript
// lib/scoring/intent-weighting.js
const INTENT_WEIGHTS = {
  add_feature: {
    importance: { procedural: 1.5, pattern_rationale: 1.3 },
    context_type: { implementation: 1.3, research: 0.8 }
  },
  fix_bug: {
    importance: { critical: 1.5, deprecated: 1.3 },  // Known issues
    context_type: { debugging: 1.5, decision: 0.8 }
  },
  refactor: {
    importance: { important: 1.3 },
    context_type: { decision: 1.5, implementation: 1.2 }
  },
  security_audit: {
    importance: { constitutional: 2.0, critical: 1.5 },
    context_type: { security: 2.0 }
  },
  understand_code: {
    importance: { important: 1.3 },
    context_type: { research: 1.5, decision: 1.3 }
  }
};

function apply_intent_weighting(results, intent) {
  if (!intent || !INTENT_WEIGHTS[intent]) return results;

  const weights = INTENT_WEIGHTS[intent];
  return results.map(r => ({
    ...r,
    score: r.score * (weights.importance[r.importance_tier] || 1.0)
                   * (weights.context_type[r.context_type] || 1.0)
  }));
}
```

**Tool schema update:**
```javascript
{
  name: "memory_search",
  inputSchema: {
    properties: {
      query: { type: "string" },
      intent: {
        type: "string",
        enum: ["add_feature", "fix_bug", "refactor", "security_audit", "understand_code"],
        description: "Task intent for weight adjustment"
      }
      // ... existing properties
    }
  }
}
```

**Effort:** 4-8 hours
**Files Modified:** `handlers/memory-search.js`, `lib/scoring/composite-scoring.js`

---

## 3. P0: Session Deduplication

### 3.1 Problem Statement

Same memories are sent multiple times in a conversation, wasting tokens. Drift reports 8-16x token savings with deduplication.

### 3.2 Implementation Strategy

**Extend working_memory table:**
```sql
ALTER TABLE working_memory ADD COLUMN sent_at TEXT;
ALTER TABLE working_memory ADD COLUMN tokens_sent INTEGER DEFAULT 0;
```

**Session tracking in search handler:**
```javascript
// lib/cognitive/session-dedup.js
function should_send_full_content(sessionId, memoryId, estimatedTokens) {
  const stmt = db.prepare(`
    SELECT sent_at, tokens_sent FROM working_memory
    WHERE session_id = ? AND memory_id = ?
  `);
  const existing = stmt.get(sessionId, memoryId);

  if (existing?.sent_at) {
    // Already sent - return summary only
    return { sendFull: false, reason: 'already_sent' };
  }

  // Mark as sent
  db.prepare(`
    UPDATE working_memory SET sent_at = datetime('now'), tokens_sent = ?
    WHERE session_id = ? AND memory_id = ?
  `).run(estimatedTokens, sessionId, memoryId);

  return { sendFull: true };
}

// In search results formatting
function format_with_dedup(memories, sessionId) {
  return memories.map(m => {
    const { sendFull } = should_send_full_content(sessionId, m.id, m.token_count);
    return sendFull ? m : { ...m, content: m.summary, deduped: true };
  });
}
```

**Effort:** 8-16 hours
**Files Modified:** `handlers/memory-search.js`, `lib/cognitive/working-memory.js`, schema migration

---

## 4. P1: Standardized Response Structure

### 4.1 Problem Statement

MCP tool responses have inconsistent structures, making AI parsing unpredictable.

### 4.2 Implementation Strategy

**Create response wrapper:**
```javascript
// lib/response-format.js
function format_response(data, options = {}) {
  return {
    summary: options.summary || generate_summary(data),
    data: data,
    pagination: options.pagination || null,
    hints: {
      nextActions: options.nextActions || [],
      relatedTools: options.relatedTools || [],
      warnings: options.warnings || []
    },
    meta: {
      requestId: options.requestId || crypto.randomUUID(),
      durationMs: options.startTime ? Date.now() - options.startTime : null,
      cached: options.cached || false,
      tokenEstimate: estimate_tokens(data)
    }
  };
}

// Usage in handlers
const startTime = Date.now();
const results = await perform_search(query);
return format_response(results, {
  startTime,
  summary: `Found ${results.length} memories matching "${query}"`,
  relatedTools: results.length > 10 ? ['memory_list'] : [],
  warnings: results.some(r => r.importance_tier === 'deprecated')
    ? ['Some results are marked deprecated']
    : []
});
```

**Effort:** 4-8 hours
**Files Modified:** All handlers, new `lib/response-format.js`

---

## 5. P1: Causal Memory Relationships

### 5.1 Problem Statement

Memories are isolated documents. Users cannot trace "why" a decision was made or how knowledge evolved.

### 5.2 Implementation Strategy

**New database table:**
```sql
CREATE TABLE causal_edges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER NOT NULL,
  target_id INTEGER NOT NULL,
  relation TEXT NOT NULL CHECK (relation IN (
    'caused', 'enabled', 'prevented', 'supersedes', 'supports', 'contradicts', 'derived_from'
  )),
  strength REAL DEFAULT 1.0,
  created_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,  -- 'user', 'system', 'inference'
  FOREIGN KEY (source_id) REFERENCES memory_index(id),
  FOREIGN KEY (target_id) REFERENCES memory_index(id)
);

CREATE INDEX idx_causal_source ON causal_edges(source_id);
CREATE INDEX idx_causal_target ON causal_edges(target_id);
```

**New MCP tool:**
```javascript
{
  name: "memory_link",
  description: "Create causal relationship between memories",
  inputSchema: {
    properties: {
      source_id: { type: "integer" },
      target_id: { type: "integer" },
      relation: {
        type: "string",
        enum: ["caused", "enabled", "prevented", "supersedes", "supports", "contradicts", "derived_from"]
      }
    },
    required: ["source_id", "target_id", "relation"]
  }
}
```

**Causal chain query:**
```javascript
// handlers/memory-causal.js
async function get_causal_chain(memoryId, maxDepth = 3) {
  const chain = [];
  const visited = new Set();

  async function traverse(id, depth) {
    if (depth > maxDepth || visited.has(id)) return;
    visited.add(id);

    const edges = db.prepare(`
      SELECT target_id, relation, strength
      FROM causal_edges WHERE source_id = ?
    `).all(id);

    for (const edge of edges) {
      chain.push({ from: id, to: edge.target_id, relation: edge.relation });
      await traverse(edge.target_id, depth + 1);
    }
  }

  await traverse(memoryId, 0);
  return chain;
}
```

**Effort:** 24-40 hours
**Files Modified:** Schema migration, new `handlers/memory-causal.js`, `memory_search` enhancement

---

## 6. P2: Cross-Encoder Reranking

### 6.1 Problem Statement

First-stage retrieval (vector similarity) may miss nuanced relevance. Cross-encoders provide higher precision but are slower.

### 6.2 Implementation Strategy

**Add optional reranking to search:**
```javascript
// lib/search/reranker.js
const { pipeline } = require('@xenova/transformers');

let reranker = null;

async function load_reranker() {
  if (!reranker) {
    reranker = await pipeline('text-classification', 'Xenova/ms-marco-MiniLM-L-6-v2');
  }
  return reranker;
}

async function rerank_results(query, results, topK = 10) {
  const model = await load_reranker();

  // Score each result against query
  const scored = await Promise.all(results.map(async r => {
    const score = await model(`${query} [SEP] ${r.content}`);
    return { ...r, rerank_score: score[0].score };
  }));

  // Apply length penalty for short chunks
  const MIN_LENGTH = 100;
  scored.forEach(r => {
    if (r.content.length < MIN_LENGTH) {
      const penalty = 0.8 + 0.2 * (r.content.length / MIN_LENGTH);
      r.rerank_score *= penalty;
    }
  });

  return scored
    .sort((a, b) => b.rerank_score - a.rerank_score)
    .slice(0, topK);
}
```

**Enable via parameter:**
```javascript
memory_search({
  query: "authentication flow",
  rerank: true,  // Enable cross-encoder reranking
  limit: 10
});
```

**Effort:** 16-24 hours
**Files Modified:** `handlers/memory-search.js`, new `lib/search/reranker.js`

---

## 7. P2: Memory Consolidation Engine

### 7.1 Problem Statement

Episodic memories (session summaries) accumulate without structure. Patterns remain undiscovered.

### 7.2 Implementation Strategy

**Scheduled consolidation (5 phases):**
```javascript
// lib/consolidation/engine.js
async function consolidate(specFolder, options = {}) {
  const phases = [
    { name: 'replay', fn: selectEpisodicMemories },
    { name: 'abstraction', fn: extractRecurringPatterns },
    { name: 'integration', fn: mergeIntoSemantic },
    { name: 'pruning', fn: removeRedundantEpisodes },
    { name: 'strengthening', fn: boostFrequentlyAccessed }
  ];

  let state = { specFolder, memories: [], abstractions: [] };

  for (const phase of phases) {
    state = await phase.fn(state);
    if (options.verbose) {
      console.log(`[Consolidation] ${phase.name}: ${JSON.stringify(state.metrics)}`);
    }
  }

  return state.metrics;
}

// Phase 2: Extract patterns appearing 2+ times
async function extractRecurringPatterns(state) {
  const facts = new Map();  // fact_text → { count, confidences, episodeIds }

  for (const episode of state.memories) {
    const extracted = await extract_facts(episode.content);
    for (const fact of extracted) {
      const key = normalize_fact(fact);
      if (!facts.has(key)) {
        facts.set(key, { count: 0, confidences: [], episodeIds: [] });
      }
      const entry = facts.get(key);
      entry.count++;
      entry.confidences.push(episode.confidence);
      entry.episodeIds.push(episode.id);
    }
  }

  // Keep facts with 2+ occurrences
  state.abstractions = Array.from(facts.entries())
    .filter(([_, v]) => v.count >= 2)
    .map(([text, v]) => ({
      text,
      confidence: Math.max(...v.confidences),
      sourceEpisodes: v.episodeIds
    }));

  return state;
}
```

**Effort:** 40+ hours
**Files Modified:** New `lib/consolidation/` module, scheduling integration

---

## 8. Implementation Roadmap

### Phase 1: Quick Wins (Week 1-2)
- [ ] Intent-aware retrieval (P0)
- [ ] Standardized response structure (P1)

### Phase 2: Token Optimization (Week 3-4)
- [ ] Session deduplication (P0)
- [ ] Compression level parameter

### Phase 3: Relationship Layer (Week 5-8)
- [ ] Causal memory relationships schema (P1)
- [ ] memory_link tool
- [ ] Causal chain queries

### Phase 4: Advanced Features (Week 9+)
- [ ] Cross-encoder reranking (P2)
- [ ] Consolidation engine (P2)
- [ ] Graph-seeded discovery (P3)

---

## 9. Risk Considerations

| Risk | Mitigation |
|------|------------|
| Cross-encoder latency | Make reranking optional, limit pool size (20 candidates) |
| Causal graph complexity | Start with manual links, add inference later |
| Consolidation false positives | Require 3+ occurrences initially, tune threshold |
| Session state overhead | TTL-based cleanup, cap working memory entries |

---

## 10. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Tokens per search (with dedup) | - | -50% on follow-up queries |
| Search relevance (intent-aware) | Baseline | +20% for task-specific queries |
| "Why" query coverage | 0% | 60% of memories linked |
| Consolidation ratio | N/A | 5:1 (episodes:abstractions) |

---

## 11. Code Examples: Priority Implementations

### 11.1 Intent-Aware Retrieval (Complete)

```javascript
// Add to handlers/memory-search.js
const INTENT_WEIGHTS = {
  add_feature: { procedural: 1.5, research: 0.8 },
  fix_bug: { deprecated: 1.5, debugging: 1.3 },
  refactor: { decision: 1.5, important: 1.3 },
  security_audit: { constitutional: 2.0, critical: 1.5 },
  understand_code: { research: 1.5, decision: 1.3 }
};

function apply_intent_boost(row, intent) {
  if (!intent || !INTENT_WEIGHTS[intent]) return 1.0;
  const weights = INTENT_WEIGHTS[intent];
  return (weights[row.context_type] || 1.0) * (weights[row.importance_tier] || 1.0);
}

// In composite scoring
score = base_score * apply_intent_boost(row, options.intent);
```

### 11.2 Session Deduplication (Complete)

```javascript
// Add to lib/cognitive/session-tracker.js
class SessionTracker {
  constructor(db) {
    this.db = db;
    this.sentMemories = new Map();  // sessionId → Set<memoryId>
  }

  markSent(sessionId, memoryId, tokenCount) {
    if (!this.sentMemories.has(sessionId)) {
      this.sentMemories.set(sessionId, new Set());
    }
    this.sentMemories.get(sessionId).add(memoryId);

    this.db.prepare(`
      UPDATE working_memory
      SET sent_at = datetime('now'), tokens_sent = ?
      WHERE session_id = ? AND memory_id = ?
    `).run(tokenCount, sessionId, memoryId);
  }

  wasSent(sessionId, memoryId) {
    return this.sentMemories.get(sessionId)?.has(memoryId) || false;
  }

  formatWithDedup(memories, sessionId) {
    return memories.map(m => {
      if (this.wasSent(sessionId, m.id)) {
        return { id: m.id, title: m.title, summary: m.summary, deduped: true };
      }
      this.markSent(sessionId, m.id, m.token_estimate);
      return m;
    });
  }
}
```

---

**Document Metadata:**
- **Created:** 2026-02-01
- **Based On:** Analysis of dotmd, seu-claude, drift repositories
- **Word Count:** ~1,400
