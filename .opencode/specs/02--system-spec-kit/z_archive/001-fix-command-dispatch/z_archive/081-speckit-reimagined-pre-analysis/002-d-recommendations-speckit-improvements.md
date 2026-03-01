> **STATUS: SUPERSEDED** — All recommendations from this pre-analysis have been implemented.
> See spec `089-speckit-reimagined-refinement` for the current audit and remediation plan.
> This document is retained for historical reference only.

---

# Actionable Recommendations: System-Speckit Improvements

## Executive Summary

Analysis of three production memory systems (dotmd, seu-claude, drift Cortex V2) reveals actionable patterns for enhancing system-speckit. Key opportunities include: (1) adopting multi-factor decay with type-specific half-lives from drift Cortex, (2) implementing causal memory graphs from drift for relationship tracking, (3) adding cross-encoder reranking from dotmd for precision, and (4) integrating tool output caching from seu-claude for efficiency. Current system-speckit has solid foundations (FSRS v4, composite scoring, RRF) but lacks memory relationships, adaptive decay rates, and learning from corrections.

---

## Priority Matrix

| Priority | Pattern | Source | Impact | Effort | Risk |
|----------|---------|--------|--------|--------|------|
| P0 | Type-specific half-lives | drift Cortex | High | Low | Low |
| P0 | Tool output caching | seu-claude | High | Low | Low |
| P0 | Session deduplication | drift Cortex | Medium | Low | Low |
| P1 | Causal memory graph | drift Cortex | High | Medium | Medium |
| P1 | Cross-encoder reranking | dotmd | High | Medium | Low |
| P1 | Query expansion/fuzzy matching | dotmd | Medium | Medium | Low |
| P1 | Learning from corrections | drift Cortex | High | Medium | Medium |
| P2 | Hierarchical compression | drift Cortex | Medium | High | Medium |
| P2 | Protocol-based storage | dotmd | Medium | High | Low |

---

## P0: High Impact, Immediate Value

### 1. Type-Specific Half-Lives for Memory Decay

**Source:** drift Cortex V2
**Current State:** Speckit uses 6-tier importance with fixed decay rates per tier (constitutional=1.0, critical=1.0, important=1.0, normal=0.80, temporary=0.60).
**Proposed Change:** Add memory-type-aware half-lives alongside tier-based decay.

**Implementation:**
```javascript
// attention-decay.js enhancement
const HALF_LIVES_DAYS = {
  core: Infinity,        // Never decay (project constants)
  tribal: 365,           // Annual refresh (team conventions)
  procedural: 180,       // Semi-annual (how-to knowledge)
  episodic: 7,           // Weekly (session context)
  reference: 90,         // Quarterly (documentation links)
};

function calculate_type_aware_decay(memory, elapsed_days) {
  const memory_type = memory.memory_type || 'episodic';
  const half_life = HALF_LIVES_DAYS[memory_type] || 30;

  if (half_life === Infinity) return memory.attention_score;

  // Exponential decay using half-life
  const decay_factor = Math.pow(0.5, elapsed_days / half_life);
  return memory.attention_score * decay_factor;
}
```

**Benefits:** More natural decay curves matching actual memory relevance. Procedural knowledge (how to deploy) decays slower than episodic (what happened in session).
**Risks:** Requires `memory_type` field on memories. [Assumes: memory type can be inferred from file path or frontmatter]

---

### 2. Tool Output Caching

**Source:** seu-claude
**Current State:** No caching - every search runs full embedding + ranking pipeline.
**Proposed Change:** Cache expensive operations per task/session.

**Implementation:**
```javascript
// Add to vector-index.js
const tool_output_cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function get_cached_or_compute(cache_key, compute_fn) {
  const cached = tool_output_cache.get(cache_key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result;
  }

  const result = compute_fn();
  tool_output_cache.set(cache_key, {
    result,
    timestamp: Date.now()
  });
  return result;
}

// Usage in search
async function search_with_cache(query, spec_folder, options = {}) {
  const cache_key = `${query}:${spec_folder}:${JSON.stringify(options)}`;
  return get_cached_or_compute(cache_key, () =>
    perform_hybrid_search(query, spec_folder, options)
  );
}
```

**Benefits:** Reduced API calls for embeddings, faster repeated queries, lower costs.
**Risks:** Stale results if memories change mid-session. Mitigate with manual cache invalidation on memory_save.

---

### 3. Session Deduplication Tracking

**Source:** drift Cortex V2
**Current State:** No tracking of which memories have been surfaced in current session.
**Proposed Change:** Track surfaced memories to avoid repetitive retrieval.

**Implementation:**
```javascript
// Add to working-memory.js
const session_surfaced = new Map(); // session_id -> Set of memory_ids

function mark_surfaced(session_id, memory_ids) {
  if (!session_surfaced.has(session_id)) {
    session_surfaced.set(session_id, new Set());
  }
  memory_ids.forEach(id => session_surfaced.get(session_id).add(id));
}

function filter_unsurfaced(session_id, memories) {
  const surfaced = session_surfaced.get(session_id) || new Set();
  return memories.filter(m => !surfaced.has(m.id));
}

// Apply in search results before returning
function search_with_dedup(query, session_id, options) {
  const results = perform_search(query, options);
  const unique = filter_unsurfaced(session_id, results);
  mark_surfaced(session_id, unique.map(m => m.id));
  return unique;
}
```

**Benefits:** Avoids repetitive "You might also want to know..." patterns. Fresher context per turn.
**Risks:** May miss genuinely re-relevant memories. Add `force_resurface` option for explicit recall.

---

## P1: Medium Impact, Strategic Value

### 4. Causal Memory Graph

**Source:** drift Cortex V2 (8 relationship types)
**Current State:** Memories are flat documents with no relationship tracking.
**Proposed Change:** Add lightweight relationship table for memory connections.

**Implementation:**
```javascript
// New table in schema
const MEMORY_RELATIONS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS memory_relations (
    source_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    relation_type TEXT NOT NULL,
    strength REAL DEFAULT 1.0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_id, target_id, relation_type),
    FOREIGN KEY (source_id) REFERENCES memory_index(id),
    FOREIGN KEY (target_id) REFERENCES memory_index(id)
  )
`;

// Relation types from drift (simplified)
const RELATION_TYPES = [
  'DEPENDS_ON',    // A requires B
  'SUPERSEDES',    // A replaces B
  'REFERENCES',    // A mentions B
  'CONFLICTS',     // A contradicts B
];

// Query related memories
function get_related_memories(memory_id, relation_type = null) {
  const where_clause = relation_type
    ? 'AND relation_type = ?'
    : '';
  const params = relation_type
    ? [memory_id, relation_type]
    : [memory_id];

  return db.prepare(`
    SELECT m.*, r.relation_type, r.strength
    FROM memory_index m
    JOIN memory_relations r ON m.id = r.target_id
    WHERE r.source_id = ? ${where_clause}
    ORDER BY r.strength DESC
  `).all(...params);
}
```

**Benefits:** Enables "this decision supersedes that one" queries. Better conflict detection.
**Risks:** Relationship extraction is hard to automate. [Assumes: initial relationships extracted from ANCHOR links or manually specified]

---

### 5. Cross-Encoder Reranking

**Source:** dotmd
**Current State:** RRF combines vector + FTS5 scores, but no semantic reranking.
**Proposed Change:** Add optional cross-encoder pass for top-N results.

**Implementation:**
```javascript
// Add to composite-scoring.js
async function rerank_with_cross_encoder(query, candidates, top_n = 10) {
  // Only rerank top candidates to limit API calls
  const top_candidates = candidates.slice(0, 20);

  const pairs = top_candidates.map(c => ({
    query: query,
    document: c.content || c.summary || c.title
  }));

  // Call reranking endpoint (Voyage rerank-2 or Cohere rerank)
  const scores = await rerank_api_call(pairs);

  // Merge rerank scores with existing composite
  return top_candidates.map((c, i) => ({
    ...c,
    rerank_score: scores[i],
    final_score: c.composite_score * 0.4 + scores[i] * 0.6
  })).sort((a, b) => b.final_score - a.final_score).slice(0, top_n);
}
```

**Benefits:** Significantly improves precision for ambiguous queries. Research shows 10-15% relevance gains.
**Risks:** Added latency (~100-200ms). Cost per query. [Assumes: Voyage or Cohere API available]

---

### 6. Query Expansion with Fuzzy Acronym Matching

**Source:** dotmd
**Current State:** Literal trigger matching in ANCHOR format.
**Proposed Change:** Expand queries with common variations and acronyms.

**Implementation:**
```javascript
// Add to trigger-matcher.js
const ACRONYM_MAP = {
  'PE': ['progressive enhancement', 'pe gating'],
  'FSRS': ['spaced repetition', 'memory scheduling'],
  'RRF': ['reciprocal rank fusion', 'search fusion'],
  'DQI': ['document quality index', 'quality scoring'],
};

function expand_query(query) {
  const terms = query.toLowerCase().split(/\s+/);
  const expanded = [...terms];

  for (const term of terms) {
    // Check acronym expansions
    if (ACRONYM_MAP[term.toUpperCase()]) {
      expanded.push(...ACRONYM_MAP[term.toUpperCase()]);
    }

    // Fuzzy match (Levenshtein distance <= 2)
    for (const [acronym, expansions] of Object.entries(ACRONYM_MAP)) {
      if (levenshtein(term.toUpperCase(), acronym) <= 2) {
        expanded.push(...expansions);
      }
    }
  }

  return [...new Set(expanded)].join(' ');
}
```

**Benefits:** "FSRS" matches "spaced repetition" memories. Typo tolerance.
**Risks:** May reduce precision if expansions too broad. Keep map curated.

---

### 7. Learning from Corrections

**Source:** drift Cortex V2
**Current State:** No feedback loop - same mistakes repeated.
**Proposed Change:** Track when memories are corrected and adjust future scoring.

**Implementation:**
```javascript
// New table
const CORRECTIONS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS memory_corrections (
    id INTEGER PRIMARY KEY,
    original_memory_id INTEGER,
    correction_type TEXT, -- 'superseded', 'deprecated', 'refined'
    new_memory_id INTEGER,
    correction_date TEXT DEFAULT CURRENT_TIMESTAMP,
    pattern TEXT -- What triggered the correction
  )
`;

// Track correction and apply penalty
function record_correction(original_id, new_id, type, pattern) {
  db.prepare(`
    INSERT INTO memory_corrections (original_memory_id, correction_type, new_memory_id, pattern)
    VALUES (?, ?, ?, ?)
  `).run(original_id, type, new_id, pattern);

  // Apply penalty to original memory's stability
  db.prepare(`
    UPDATE memory_index
    SET stability = stability * 0.5,
        importance_tier = CASE WHEN importance_tier != 'constitutional' THEN 'deprecated' ELSE importance_tier END
    WHERE id = ?
  `).run(original_id);
}
```

**Benefits:** System learns from mistakes. Outdated memories naturally fade.
**Risks:** Needs UI/workflow to capture corrections. [Assumes: generate-context.js can detect supersession patterns]

---

## P2: Lower Priority, Future Consideration

### 8. Hierarchical Compression (4 Levels)

**Source:** drift Cortex V2
**Current State:** Full content or summary (2 levels).
**Proposed Change:** Add 4-level compression: full -> detailed -> summary -> title-only.

**Implementation Notes:**
- Requires LLM calls for compression generation
- Store compressed versions in separate columns
- Compression triggers: on create, on access count thresholds
- Token budget allocation per level

**Effort:** High - requires LLM integration for compression.
**Defer Until:** Token budget concerns become measurable bottleneck.

---

### 9. Protocol-Based Storage Abstraction

**Source:** dotmd (VectorStoreProtocol, GraphStoreProtocol)
**Current State:** SQLite-specific implementation throughout.
**Proposed Change:** Abstract storage behind interfaces for future flexibility.

**Implementation Notes:**
- Define `IVectorStore`, `IMetadataStore`, `IGraphStore` interfaces
- Current SQLite implementation becomes default adapter
- Enables future swap to Qdrant, Pinecone, or Neo4j without core changes

**Effort:** High - significant refactoring.
**Defer Until:** Need for non-SQLite storage is validated.

---

## Integration Pathways

**Recommended Sequence:**

```
Phase 1 (Week 1-2): P0 Items
├── Type-specific half-lives → attention-decay.js
├── Tool output caching → vector-index.js
└── Session deduplication → working-memory.js

Phase 2 (Week 3-4): P1 Core
├── Memory relations table → schema migration
├── Cross-encoder reranking → composite-scoring.js
└── Query expansion → trigger-matcher.js

Phase 3 (Week 5-6): P1 Learning
└── Corrections tracking → new module + generate-context.js integration

Phase 4 (Future): P2 Items
├── Hierarchical compression (when token budget is limiting)
└── Storage abstraction (when SQLite limits reached)
```

---

## Migration Considerations

**Breaking Changes:**
- Memory relations table requires schema migration (SCHEMA_VERSION bump to 5)
- Type-specific half-lives requires `memory_type` field population strategy

**Backwards Compatibility:**
- All P0 items are additive - no existing behavior changes
- Cross-encoder reranking is opt-in via `options.rerank = true`
- Query expansion can be toggled via environment variable

**Data Migration:**
```sql
-- Add memory_type column with default
ALTER TABLE memory_index ADD COLUMN memory_type TEXT DEFAULT 'episodic';

-- Infer types from file paths
UPDATE memory_index SET memory_type = 'procedural'
WHERE file_path LIKE '%/references/%';

UPDATE memory_index SET memory_type = 'tribal'
WHERE file_path LIKE '%/decisions/%' OR file_path LIKE '%decision-record%';
```

---

## Implementation Roadmap

| Week | Deliverable | Dependencies | Validation |
|------|-------------|--------------|------------|
| 1 | Type-specific half-lives | None | Unit tests for decay curves |
| 1 | Tool output caching | None | Cache hit/miss metrics |
| 2 | Session deduplication | None | No duplicate memories in session |
| 3 | Memory relations schema | Schema v5 migration | Relations queryable |
| 3 | Query expansion | Acronym map curation | Improved recall metrics |
| 4 | Cross-encoder reranking | Voyage/Cohere API key | A/B precision comparison |
| 5-6 | Corrections tracking | Relations table | Penalties applied correctly |

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cross-encoder API costs | Medium | Medium | Rate limit, cache aggressively, only rerank top-20 |
| Memory type inference errors | Medium | Low | Default to 'episodic', allow manual override |
| Relations graph becomes stale | Medium | Medium | Auto-detect broken links on access |
| Cache invalidation bugs | Low | High | Conservative TTL (5min), invalidate on any write |
| Learning loop creates bias | Low | Medium | Track correction confidence, allow undo |

---

## Appendix: Code Examples

### A. Unified Decay Function (Combines P0.1)

```javascript
function calculate_unified_decay(memory, elapsed_days) {
  // 1. Check tier-based exemptions (constitutional never decay)
  const tier_rate = get_decay_rate(memory.importance_tier);
  if (tier_rate === 1.0) return memory.attention_score;

  // 2. Apply type-specific half-life
  const half_life = HALF_LIVES_DAYS[memory.memory_type || 'episodic'];
  if (half_life === Infinity) return memory.attention_score;

  // 3. Calculate FSRS retrievability
  const retrievability = calculate_retrievability(memory.stability, elapsed_days);

  // 4. Combine: type decay modulates retrievability
  const type_decay = Math.pow(0.5, elapsed_days / half_life);
  return memory.attention_score * retrievability * type_decay;
}
```

### B. Complete Search Pipeline (Combines P0.2, P0.3, P1.5)

```javascript
async function enhanced_search(query, session_id, options = {}) {
  // 1. Check cache first
  const cache_key = `search:${session_id}:${query}`;
  const cached = get_from_cache(cache_key);
  if (cached && !options.bypass_cache) return cached;

  // 2. Expand query
  const expanded_query = options.expand ? expand_query(query) : query;

  // 3. Perform hybrid search (existing RRF)
  let results = await hybrid_search(expanded_query, options);

  // 4. Filter already-surfaced memories
  results = filter_unsurfaced(session_id, results);

  // 5. Optional cross-encoder reranking
  if (options.rerank && results.length > 0) {
    results = await rerank_with_cross_encoder(query, results);
  }

  // 6. Mark as surfaced and cache
  mark_surfaced(session_id, results.map(r => r.id));
  set_cache(cache_key, results, 5 * 60 * 1000);

  return results;
}
```

---

*Document generated: 2025-02-01*
*Research sources: dotmd, seu-claude, drift Cortex V2*
*Applies to: system-speckit v1.x*
