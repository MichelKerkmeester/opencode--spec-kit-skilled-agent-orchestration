# SpecKit Reimagined: Consolidated Analysis & Recommendations

## Executive Summary

This analysis synthesizes findings from 25 parallel agent analyses of 8 pre-analysis documents examining dotmd, seu-claude, drift, and system-speckit architectures. The synthesis identifies **7 P0 items** requiring immediate attention, **12 P1 items** for core enhancement, and provides a unified 10-week implementation roadmap.

**Top 5 Recommendations:**
1. **Session Deduplication** (P0) - 25-35% token savings, 3-4 hours effort
2. **Type-Specific Half-Lives** (P0) - 20% tier differentiation, 2-3 hours effort
3. **Lazy Embedding Model Loading** (P0) - 50-70% faster MCP startup
4. **RRF Search Fusion with BM25** (P1) - 40-50% relevance improvement
5. **Causal Memory Graph** (P1) - Foundation for "why" queries and memory lineage

---

## 1. Architectural Patterns Comparison

### 1.1 Search/Retrieval

| System | Approach | Strength |
|--------|----------|----------|
| **dotmd** | Triple-hybrid: Vector (LanceDB) + BM25 + Graph (LadybugDB) | Most comprehensive discovery |
| **seu-claude** | 70% semantic + 30% keyword OR RRF | Simple, effective baseline |
| **drift** | Intent-based weighting + 10% convergence bonus | Context-aware retrieval |
| **speckit** | Vector + FTS5 + RRF (partial) | Strong foundation, lacks graph |

**Winner: dotmd** - Triple-engine approach with RRF fusion (k=60) and 1.5x graph weight discovers relationships pure vector+keyword misses.

**Recommended for SpecKit:**
```javascript
function rrfFusion(vectorResults, bm25Results, graphResults = [], k = 60, convergenceBonus = 0.10) {
  const weights = { vector: 1.0, bm25: 1.0, graph: 1.5 };
  const scores = new Map();
  const sources = new Map();

  const scoreSet = (results, weight, sourceName) => {
    results.forEach((item, rank) => {
      const rrfScore = weight / (k + rank + 1);
      scores.set(item.id, (scores.get(item.id) || 0) + rrfScore);
      const itemSources = sources.get(item.id) || new Set();
      itemSources.add(sourceName);
      sources.set(item.id, itemSources);
    });
  };

  scoreSet(vectorResults, weights.vector, 'vector');
  scoreSet(bm25Results, weights.bm25, 'bm25');
  if (graphResults.length) scoreSet(graphResults, weights.graph, 'graph');

  // Apply convergence bonus for multi-source results
  for (const [id, itemSources] of sources) {
    if (itemSources.size >= 2) {
      scores.set(id, scores.get(id) * (1 + convergenceBonus));
    }
  }

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score, sources: Array.from(sources.get(id)) }));
}
```

### 1.2 Memory Decay

| System | Algorithm | Key Feature |
|--------|-----------|-------------|
| **dotmd** | None | No decay |
| **seu-claude** | None | No decay |
| **drift** | Multi-factor (5 signals) | temporal × citation × usage × importance × pattern_alignment |
| **speckit** | FSRS v4 | R(t,S) = (1 + 0.235 × t/S)^(-0.5) |

**Winner: Hybrid approach** - Combine FSRS's scientifically-validated temporal decay with drift's multi-factor composition.

**Recommended Formula:**
```javascript
function calculateCompositeScore(memory) {
  // Temporal: FSRS-based decay
  const temporal = Math.pow(1 + 0.235 * (daysSinceAccess / stability), -0.5);

  // Usage boost: capped at 1.5x
  const usage = Math.min(1.5, 1.0 + memory.accessCount * 0.05);

  // Importance anchor
  const importance = { critical: 1.5, high: 1.2, normal: 1.0, low: 0.8 }[memory.importance];

  // Pattern alignment
  const pattern = memory.patternMatch ? 1.2 : 1.0;

  // Citation recency
  const citation = memory.citedRecently ? 1.1 : 1.0;

  return Math.min(1.0, temporal * usage * importance * pattern * citation);
}
```

### 1.3 Session Management

| System | Pattern | Benefit |
|--------|---------|---------|
| **drift** | Session deduplication + continuity | Prevents context pollution |
| **seu-claude** | Immediate SQLite saves | Zero data loss on crash |
| **speckit** | Periodic checkpoints | Recoverable state |

**Winner: drift** for deduplication, **seu-claude** for crash resilience

**Recommended SessionManager:**
```javascript
class SessionManager {
  constructor(db) {
    this.sessions = new Map();
    this.db = db;
  }

  shouldSendMemory(sessionId, memoryId) {
    const session = this.getOrCreateSession(sessionId);
    return !session.sentMemories.has(memoryId);
  }

  markMemorySent(sessionId, memoryId, tokenCount) {
    const session = this.getOrCreateSession(sessionId);
    session.sentMemories.add(memoryId);
    session.tokensSent += tokenCount;
    this.db.saveSession(session); // Immediate persist
  }
}
```

### 1.4 Graph Relationships

| System | Relationship Types | Query Pattern |
|--------|-------------------|---------------|
| **dotmd** | LINKS_TO, CO_OCCURS, MENTIONS | Cypher traversal |
| **drift** | 8 types: caused, enabled, prevented, contradicts, supersedes, supports, derived_from, triggered_by | SQL joins |
| **speckit** | None | No graph support |

**Winner: drift** - Causal relationships better model decision lineage

**Recommended Schema:**
```sql
CREATE TABLE causal_edges (
    id INTEGER PRIMARY KEY,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relation TEXT NOT NULL,  -- supersedes, supports, caused, contradicts, derived_from, enabled
    strength REAL DEFAULT 1.0,
    extracted_at TEXT,
    evidence TEXT
);
CREATE INDEX idx_causal_source ON causal_edges(source_id);
CREATE INDEX idx_causal_target ON causal_edges(target_id);
```

### 1.5 Learning Systems

| System | Approach | Key Mechanism |
|--------|----------|---------------|
| **drift** | Correction capture + feedback loops | Tracks original vs correction, applies 0.5x stability penalty |
| **seu-claude** | TDD automation | Binary pass/fail signals |
| **speckit** | PE (Prediction Error) gating | Validates quality, doesn't learn |

**Winner: drift** - Explicit correction tracking provides richer learning signals

**Recommended Confidence Adjustment:**
```javascript
function adjustConfidence(memory, outcome, correctionType) {
  const outcomeMultiplier = {
    accepted: 1.05,
    modified: 0.95,
    rejected: 0.80
  }[outcome];

  const correctionPenalty = correctionType ? 0.5 : 1.0;

  const newConfidence = memory.confidence
    * outcomeMultiplier
    * correctionPenalty
    * temporalDecay(memory.lastAccessed);

  return Math.max(0.1, Math.min(1.0, newConfidence));
}
```

### 1.6 Token Efficiency

| System | Technique | Savings |
|--------|-----------|---------|
| **speckit** | ANCHOR format | ~93% via section-level retrieval |
| **drift** | 4-level compression | 10 tokens (IDs) to 500+ (full) |
| **dotmd** | Query expansion | Can increase tokens |

**Winner: speckit** - ANCHOR format achieves highest savings

**Enhancement: Add Compression Levels to ANCHOR:**
| Level | Target | Use Case |
|-------|--------|----------|
| `minimal` | ~100 tokens | Quick context check |
| `compact` | ~200 tokens | Resume prior work |
| `standard` | ~400 tokens | Active development |
| `full` | Complete | Deep investigation |

### 1.7 Architecture Patterns

| System | Pattern | Trade-off |
|--------|---------|-----------|
| **seu-claude** | Hexagonal (Ports & Adapters) | Best testability, more scaffolding |
| **dotmd** | Protocol-Based DI | Swappable backends |
| **speckit** | Direct modules | Simple but tight coupling |

**Recommendation:** Adopt targeted protocol abstractions at integration boundaries, not full hexagonal.

**Priority Protocols:**
```typescript
interface IVectorStore {
  search(embedding: number[], topK: number): Promise<SearchResult[]>;
  upsert(id: string, embedding: number[], metadata: object): Promise<void>;
}

interface IEmbeddingProvider {
  embed(text: string): Promise<number[]>;
  batchEmbed(texts: string[]): Promise<number[][]>;
}
```

### 1.8 Tool Organization

| System | Tools | Organization |
|--------|-------|--------------|
| **drift** | 50+ | 7 layers with token budgets |
| **speckit** | 17 | 4 categories (flat) |
| **seu-claude** | 6 | Grouped by function |
| **dotmd** | 3 | Flat |

**Recommendation:** Implement layered tools with progressive disclosure:

| Layer | Name | Budget | Tools |
|-------|------|--------|-------|
| L1 | Orchestration | 2000-4000 | `memory_context` (new unified entry) |
| L2 | Discovery | 200-500 | `memory_match_triggers`, `memory_stats` |
| L3 | Surgical | 200-800 | `memory_validate`, `memory_delete`, `memory_update` |
| L4 | Exploration | 500-1500 | `memory_search`, `memory_list` |
| L5 | Detail | 1000-2000 | `memory_save`, `memory_index_scan` |

---

## 2. System-by-System Analysis

### 2.1 dotmd - Key Patterns

**Strengths to Adopt:**
- Triple-hybrid search (vector + BM25 + graph) with RRF fusion
- Graph weight 1.5x boost for unique discoveries
- Lazy Singleton pattern for ML models
- Protocol-based DI for swappable backends

**Gaps:**
- No memory decay algorithm
- No explicit session management

### 2.2 seu-claude - Key Patterns

**Strengths to Adopt:**
- Hexagonal architecture principles
- Immediate SQLite saves for crash resilience
- CONTINUE_SESSION.md for human-readable recovery
- `recoverState()` + `resetRunningTasks()` pattern

**Gaps:**
- Binary test-based feedback (less nuanced)
- Simpler search (70/30 split)

### 2.3 drift - Key Patterns

**Strengths to Adopt:**
- 9 memory types with type-specific half-lives
- Multi-factor decay composite
- Session deduplication with 8-16x token savings on follow-up
- 8 causal relationship types
- 5-phase consolidation: REPLAY → ABSTRACT → INTEGRATE → PRUNE → STRENGTHEN
- Correction capture and learning

**Gaps:**
- Higher complexity
- Custom storage (maintenance burden)

### 2.4 Winner-per-Category Matrix

| Dimension | Winner | Score | Runner-Up |
|-----------|--------|-------|-----------|
| Search/Retrieval | dotmd | 5/5 | SpecKit |
| Memory Decay | drift | 5/5 | SpecKit |
| Session Management | drift | 4/5 | SpecKit |
| Relationships/Graphs | drift | 5/5 | dotmd |
| Learning Systems | drift | 4/5 | seu-claude |
| Token Efficiency | SpecKit | 5/5 | drift |
| Architecture | SpecKit | 5/5 | seu-claude |
| Tool Organization | SpecKit | 5/5 | N/A |
| Crash Recovery | seu-claude | 4/5 | SpecKit |

---

## 3. Gap Analysis: system-speckit vs Competitors

| Capability | speckit Current | Best-in-Class | Gap Severity |
|------------|-----------------|---------------|--------------|
| Graph traversal | None | dotmd (2-hop + LadybugDB) | **HIGH** |
| Session deduplication | None | drift (hash-based) | **HIGH** |
| Multi-factor decay | FSRS only | drift (5 signals) | **MEDIUM** |
| Type-specific half-lives | None | drift (9 types) | **MEDIUM** |
| Causal relationships | None | drift (8 types) | **MEDIUM** |
| Lazy model loading | None | dotmd (Singleton) | **MEDIUM** |
| Learning from corrections | None | drift (feedback loops) | **LOW** |
| Cross-encoder reranking | None | dotmd | **LOW** |

---

## 4. Prioritized Recommendations

### 4.1 P0 - Highest Priority (MUST)

| Item | Effort | Impact | Rationale |
|------|--------|--------|-----------|
| **Session Deduplication** | 3-4 hours | -50% tokens on follow-up | Consensus across 3/4 docs |
| **Type-Specific Half-Lives** | 2-3 hours | +20% tier accuracy | Config change to existing decay |
| **Lazy Embedding Model Loading** | 4-6 hours | 50-70% faster startup | Blocks MCP cold-start |
| **Recovery Hints in Errors** | 2 hours | Better UX | Zero runtime cost |
| **Usage Boost to Decay** | 4-5 hours | +15% relevance | Frequently-accessed memory recall |
| **Intent-Aware Retrieval** | 6-8 hours | Task-specific weights | Query classification |
| **Tool Output Caching** | 3-4 hours | -60% redundant calls | Session-scoped cache |

**Total P0 Effort:** 24-32 hours (Phase 1)

### 4.2 P1 - Core Priority (SHOULD)

| Item | Effort | Impact | Dependency |
|------|--------|--------|------------|
| **RRF Search Fusion** | 8-10 days | +40-50% relevance | None |
| **Causal Memory Graph** | 15-20 days | "Why" queries | None |
| **Cross-Encoder Reranking** | 7-10 days | Precision boost | RRF |
| **BM25 Hybrid Search** | 7-10 days | Keyword retrieval | RRF |
| **Learning from Corrections** | 10-12 days | Self-improvement | Causal Graph |
| **Crash Recovery Pattern** | 5-7 days | Zero data loss | None |
| **Multi-Factor Decay Composite** | 5 days | +30-40% relevance | Type-Specific Half-Lives |
| **Query Expansion + Fuzzy Match** | 5-7 days | Typo tolerance | BM25 |
| **Standardized Response Structure** | 2-3 days | Consistent UX | None |
| **Layered Tool Organization** | 5-7 days | Progressive disclosure | Response Structure |
| **Protocol Abstractions** | 8-12 hours | Testability | None |
| **Consolidation Pipeline** | 10-15 days | Memory quality | Learning |

### 4.3 P2/P3 - Future (COULD)

| Item | Effort | Priority | Rationale |
|------|--------|----------|-----------|
| Full hexagonal architecture | 16-24 hours | P3 | Over-engineering for current scale |
| Per-layer token budgets | 5-7 days | P2 | After layered tools |
| Graph database (LadybugDB) | 2-3 weeks | P3 | Only if >10K graph nodes |
| Self-correction learning | High | P4 (deferred) | LOW impact, HIGH effort per 002-a |

---

## 5. Implementation Roadmap

### 5.1 Phase 1: Quick Wins (Week 1)

| Day | Item | Effort | Deliverable |
|-----|------|--------|-------------|
| 1 | Session Deduplication | 3-4h | Hash-based duplicate prevention |
| 1-2 | Type-Specific Half-Lives | 2-3h | Config with 9 memory types |
| 2 | Recovery Hints in Errors | 2h | Error catalog with guidance |
| 3 | Tool Output Caching | 3-4h | Session-scoped cache |
| 4-5 | Lazy Model Loading | 4-6h | Deferred embedding init |

**Milestone:** 25-35% token savings + 50-70% faster startup

### 5.2 Phase 2: Core Enhancements (Weeks 2-3)

| Week | Item | Effort | Deliverable |
|------|------|--------|-------------|
| 2 | RRF Search Fusion | 5d | k=60 fusion with convergence bonus |
| 2-3 | BM25 Hybrid Search | 5d | FTS5 + vector combination |
| 3 | Multi-Factor Decay Composite | 3d | 5-factor scoring |
| 3 | Standardized Response Structure | 2d | Envelope: summary, data, hints, meta |

**Milestone:** 40-50% relevance improvement

### 5.3 Phase 3: Strategic (Weeks 4+)

| Week | Item | Effort | Deliverable |
|------|------|--------|-------------|
| 4-5 | Causal Memory Graph | 10d | causal_edges table + relationships |
| 5-6 | Cross-Encoder Reranking | 5d | Top-20 reranking |
| 6-7 | Intent-Aware Retrieval | 5d | Query classifier |
| 7-8 | Learning from Corrections | 7d | Feedback loop |
| 8-10 | Layered Tool Organization | 5d | L1-L5 structure |

**Milestone:** Self-improving memory system with causal lineage

### 5.4 Dependency Graph

```
PHASE 1 (Week 1) - No dependencies
├── Session Deduplication
├── Type-Specific Half-Lives
├── Recovery Hints
├── Tool Output Caching
└── Lazy Model Loading

PHASE 2 (Weeks 2-3)
├── RRF Search Fusion ───────┬──► BM25 Hybrid Search
│                            │
├── Multi-Factor Decay ◄─────┴── Type-Specific Half-Lives (Phase 1)
│
└── Standardized Response ──────► Layered Tools (Phase 3)

PHASE 3 (Weeks 4+)
├── Causal Memory Graph ─────────► Learning from Corrections
│
├── Cross-Encoder Reranking ◄──── RRF + BM25 (Phase 2)
│
└── Intent-Aware Retrieval ◄───── Multi-Factor Decay (Phase 2)
```

---

## 6. Risk Assessment

| ID | Risk | Probability | Impact | Score | Mitigation |
|----|------|-------------|--------|-------|------------|
| R1 | Cross-encoder latency/cost | Medium | Medium | 6 | Optional, limit to 20 candidates, cache |
| R2 | Cache invalidation bugs | Low | High | 6 | Conservative 60s TTL, invalidate on write |
| R3 | **Half-life misconfiguration** | Medium | High | **9** | Document defaults, provide reset command |
| R4 | RRF tuning complexity | Medium | Medium | 6 | Ship with k=60 default |
| R5 | Graph scaling | Medium | Medium | 6 | Index heavily, consider LadybugDB at >10K nodes |
| R6 | Learning system errors/bias | Low | Medium | 3 | Feature flag, allow undo |
| R7 | Session state overhead | Low | Low | 2 | 30min TTL, cap at 100 entries |
| R8 | Breaking changes | Low | Medium | 3 | Version schema, defaults preserve compat |

**Contingency Plans:**
- R3 (half-life): Provide `reset-to-defaults` command, dry-run mode
- R1 (cross-encoder): Disable and fall back to bi-encoder if P95 > 500ms
- R2 (cache): Clear globally, increase logging

---

## 7. Success Metrics & KPIs

| Category | Metric | Baseline | Target | Priority |
|----------|--------|----------|--------|----------|
| **Search Quality** | Relevance (user feedback) | Manual | +40% | P0 |
| **Search Quality** | Intent Match Rate | Baseline | +20% | P1 |
| **Performance** | MCP Startup Time | 2-3s | <500ms | P0 |
| **Performance** | Query Latency (p95) | ~200ms | <150ms | P1 |
| **Performance** | Cache Hit Rate | 0% | 50% | P1 |
| **Token Efficiency** | Tokens Per Search | ~400 | Configurable | P0 |
| **Token Efficiency** | Session Deduplication | 0% | -50% on follow-up | P1 |
| **Memory Quality** | "Why" Query Coverage | 0% | 60% memories linked | P2 |
| **Memory Quality** | Decay Curve Adherence | Untested | Unit test validated | P1 |
| **System Health** | Duplicate Rate in Results | ~20% | <5% | P0 |

---

## 8. Migration Strategy

### Breaking vs Non-Breaking

**Non-Breaking (Safe to Deploy):**
- Add `accessCount` column (nullable, default 0)
- Add lazy loading alongside eager init
- RRF fusion as opt-in parameter
- Cross-encoder via `options.rerank`
- Query expansion via env var

**Breaking (Require Migration):**
- Memory relations table (schema v5)
- Type-specific half-lives (`memory_type` field)
- Remove legacy single-engine search

### Schema Migration

**v4 → v4.1 (Non-Breaking):**
```sql
ALTER TABLE memory_index ADD COLUMN access_count INTEGER DEFAULT 0;
ALTER TABLE memory_index ADD COLUMN last_accessed_at TEXT;
CREATE INDEX idx_memory_access ON memory_index(access_count DESC);
```

**v4.1 → v5 (Breaking):**
```sql
ALTER TABLE memory_index ADD COLUMN memory_type TEXT DEFAULT 'episodic';
UPDATE memory_index SET memory_type = 'procedural' WHERE file_path LIKE '%/references/%';

CREATE TABLE memory_relations (
  id INTEGER PRIMARY KEY,
  source_id INTEGER REFERENCES memory_index(id),
  target_id INTEGER REFERENCES memory_index(id),
  relation_type TEXT NOT NULL,
  weight REAL DEFAULT 1.0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Feature Flag Strategy

```javascript
const FEATURE_FLAGS = {
  ENABLE_RRF_FUSION: process.env.SPECKIT_RRF ?? false,
  ENABLE_USAGE_TRACKING: process.env.SPECKIT_USAGE ?? false,
  ENABLE_TYPE_DECAY: process.env.SPECKIT_TYPE_DECAY ?? false,
  ENABLE_RELATIONS: process.env.SPECKIT_RELATIONS ?? false,
  DISABLE_LEGACY_SEARCH: process.env.SPECKIT_NO_LEGACY ?? false
};
```

---

## 9. Open Questions

| ID | Question | Category | Recommended Default |
|----|----------|----------|---------------------|
| Q1 | How to populate `memory_type` automatically? | Data | Infer from file path + frontmatter fallback |
| Q2 | What RRF k parameter works best? | Tuning | k=60 (industry standard), tune after baseline |
| Q3 | Cross-encoder selection: which provider? | Infra | Configurable; Voyage rerank-2 recommended for code/technical |
| Q4 | Causal extraction: manual or automatic? | Data | Automatic with manual override |
| Q5 | Consolidation threshold: 2+ or 3+ occurrences? | Tuning | 2+ (catch more patterns early) |
| Q6 | Graph database: SQLite relations vs LadybugDB? | Infra | SQLite (simpler, sufficient for current scale) |
| Q7 | Where to source learning training data? | Data | Existing memory files as seed |
| Q8 | Are drift's half-life values appropriate? | Tuning | Test drift defaults first |

**Decision Dependencies:**
- Q6 (database) and Q3 (cross-encoder) must be resolved before implementation
- All others can use defaults and iterate

---

## 10. Additional Features from 081 Analysis (Deep-Dive Extraction)

The following features were identified through careful re-analysis of all 8 source documents. These represent patterns that were missed or under-emphasized in the initial synthesis.

### 10.1 Entity Extraction & NER

**Source:** dotmd (001-a)
**Current in 082:** Not mentioned
**Feature:** GLiNER Named Entity Recognition for automatic entity extraction from memories

```javascript
// Proposed entity extraction on memory save
async function extractEntities(memoryContent) {
  const entities = await gliner.extract(memoryContent, [
    'CONCEPT', 'FILE', 'DECISION', 'PERSON', 'FUNCTION', 'ERROR_TYPE'
  ]);
  return entities.map(e => ({
    type: e.label,
    value: e.text,
    confidence: e.score,
    span: [e.start, e.end]
  }));
}
```

**Impact:** Enables automatic graph population without manual tagging
**Effort:** Medium (requires GLiNER integration)

### 10.2 Length Penalty in Cross-Encoder Reranking

**Source:** 002-b
**Current in 082:** Cross-encoder mentioned but penalty missing
**Feature:** Apply penalty to short content chunks that artificially score high

```javascript
function applyLengthPenalty(results, MIN_LENGTH = 100) {
  return results.map(r => {
    if (r.content.length < MIN_LENGTH) {
      const penalty = 0.8 + 0.2 * (r.content.length / MIN_LENGTH);
      r.rerank_score *= penalty;
    }
    return r;
  });
}
```

**Impact:** Prevents short, low-information results from outranking substantive content
**Effort:** Low (2 hours)

### 10.3 Recovery Hints Error Catalog

**Source:** 002-c
**Current in 082:** Mentioned as item, lacks implementation detail
**Feature:** Complete error-to-hint mapping for self-service recovery

```javascript
const RECOVERY_HINTS = {
  'memory_search': {
    'E041': 'Run memory_index_scan to rebuild vector index',
    'E001': 'Check embedding API key or set SPECKIT_LOCAL_EMBEDDINGS=true',
    'E040': 'Query too long - reduce to < 10000 characters',
    'timeout': 'Increase SPECKIT_SEARCH_TIMEOUT or simplify query'
  },
  'checkpoint_restore': {
    'corrupted': 'Delete checkpoint and recreate: checkpoint_delete("{id}") + checkpoint_create("{name}")',
    'not_found': 'List available checkpoints with checkpoint_list()'
  },
  'memory_save': {
    'duplicate': 'Memory already exists. Use memory_update() for modifications',
    'validation': 'Check ANCHOR format requirements with memory_validate()'
  }
};

function getRecoveryHint(toolName, errorCode) {
  return RECOVERY_HINTS[toolName]?.[errorCode]
    || 'Run memory_health() for diagnostics';
}
```

**Impact:** Reduces user confusion, enables AI self-recovery
**Effort:** Low (3 hours for catalog)

### 10.4 Pre-Flight Quality Gates

**Source:** seu-claude (001-b, 001-c)
**Current in 082:** Not mentioned
**Feature:** Validation checks before expensive operations

```javascript
async function preflight(operation, params) {
  const checks = {
    memory_save: [
      { name: 'anchor_format', fn: validateAnchorFormat },
      { name: 'duplicate_check', fn: checkDuplicates },
      { name: 'token_budget', fn: estimateTokens }
    ],
    memory_search: [
      { name: 'query_length', fn: p => p.query.length < 10000 },
      { name: 'embedding_available', fn: checkEmbeddingProvider }
    ]
  };

  const results = await Promise.all(
    checks[operation]?.map(c => c.fn(params).then(ok => ({ name: c.name, ok }))) || []
  );

  const failures = results.filter(r => !r.ok);
  if (failures.length > 0) {
    return { proceed: false, failures };
  }
  return { proceed: true };
}
```

**Impact:** Catches errors before expensive API calls
**Effort:** Medium (8-10 hours)

### 10.5 CONTINUE_SESSION.md Human-Readable Recovery

**Source:** seu-claude (001-b, 001-c)
**Current in 082:** Briefly mentioned, no implementation
**Feature:** Generate human-readable session state alongside SQLite

```javascript
function generateContinueSessionMd(session) {
  return `# Continue Session: ${session.id}

## Last State
- **Active Task:** ${session.currentTask || 'None'}
- **Last Action:** ${session.lastAction}
- **Timestamp:** ${session.lastUpdated}

## Context Summary
${session.contextSummary || 'No context saved'}

## Pending Work
${session.pendingItems?.map(i => `- [ ] ${i}`).join('\n') || 'None'}

## Resume Command
\`\`\`
memory_search({ query: "session ${session.id}", anchors: ['state'] })
\`\`\`
`;
}
```

**Impact:** Users can understand session state without tooling
**Effort:** Low (2-3 hours)

### 10.6 Incremental Indexing with Content Hash

**Source:** seu-claude (001-b)
**Current in 082:** Not mentioned
**Feature:** Skip re-indexing unchanged files using content hash + mtime

```javascript
async function shouldReindex(filePath, existingRecord) {
  if (!existingRecord) return true;

  const stats = await fs.stat(filePath);
  const content = await fs.readFile(filePath, 'utf-8');
  const contentHash = crypto.createHash('md5').update(content).digest('hex');

  // Skip if both mtime and hash unchanged
  if (existingRecord.mtime === stats.mtimeMs &&
      existingRecord.contentHash === contentHash) {
    return false;
  }

  return true;
}

// On memory_index_scan
async function incrementalScan(folder) {
  const files = await glob(`${folder}/**/*.md`);
  let indexed = 0, skipped = 0;

  for (const file of files) {
    const existing = db.getByPath(file);
    if (await shouldReindex(file, existing)) {
      await indexFile(file);
      indexed++;
    } else {
      skipped++;
    }
  }

  return { indexed, skipped, total: files.length };
}
```

**Impact:** 10-100x faster re-indexing on large codebases
**Effort:** Medium (6-8 hours)

### 10.7 5-Phase Memory Consolidation Engine

**Source:** 002-b, 001-c (drift)
**Current in 082:** Mentioned in passing, no implementation
**Feature:** Complete episodic → semantic consolidation pipeline

```javascript
const CONSOLIDATION_PHASES = [
  {
    name: 'REPLAY',
    fn: selectEpisodicMemories,
    desc: 'Select episodic memories older than 7 days'
  },
  {
    name: 'ABSTRACT',
    fn: extractRecurringPatterns,
    desc: 'Find facts appearing 2+ times across episodes'
  },
  {
    name: 'INTEGRATE',
    fn: mergeIntoSemantic,
    desc: 'Create/update semantic memories from patterns'
  },
  {
    name: 'PRUNE',
    fn: removeRedundantEpisodes,
    desc: 'Archive episodes whose facts are now semantic'
  },
  {
    name: 'STRENGTHEN',
    fn: boostFrequentlyAccessed,
    desc: 'Increase stability of high-access memories'
  }
];

async function runConsolidation(specFolder, options = {}) {
  let state = { specFolder, memories: [], abstractions: [], metrics: {} };

  for (const phase of CONSOLIDATION_PHASES) {
    console.log(`[Consolidation] ${phase.name}: ${phase.desc}`);
    const startTime = Date.now();
    state = await phase.fn(state);
    state.metrics[phase.name] = {
      duration: Date.now() - startTime,
      memoryCount: state.memories.length,
      abstractionCount: state.abstractions.length
    };
  }

  return state.metrics;
}

async function extractRecurringPatterns(state) {
  const facts = new Map(); // fact_text → { count, confidences, episodeIds }

  for (const episode of state.memories) {
    const extracted = await extractFacts(episode.content);
    for (const fact of extracted) {
      const key = normalizeFact(fact);
      if (!facts.has(key)) {
        facts.set(key, { count: 0, confidences: [], episodeIds: [] });
      }
      const entry = facts.get(key);
      entry.count++;
      entry.confidences.push(episode.confidence);
      entry.episodeIds.push(episode.id);
    }
  }

  // Promote facts with 2+ occurrences
  state.abstractions = Array.from(facts.entries())
    .filter(([_, v]) => v.count >= 2)
    .map(([text, v]) => ({
      text,
      confidence: Math.max(...v.confidences),
      sourceEpisodes: v.episodeIds,
      tier: 'important' // Promoted from episodic
    }));

  return state;
}
```

**Impact:** Automatic knowledge distillation, reduced memory bloat
**Effort:** High (20-30 hours for full implementation)

### 10.8 5-State Memory Model

**Source:** drift (001-c)
**Current in 082:** Not mentioned
**Feature:** State machine for memory lifecycle with transition thresholds

```javascript
const MEMORY_STATES = {
  HOT:      { min: 0.80, max: 1.00, action: 'always retrieve' },
  WARM:     { min: 0.25, max: 0.80, action: 'retrieve on match' },
  COLD:     { min: 0.05, max: 0.25, action: 'retrieve if nothing else' },
  DORMANT:  { min: 0.02, max: 0.05, action: 'skip unless explicit' },
  ARCHIVED: { min: 0.00, max: 0.02, action: 'exclude from search' }
};

function getMemoryState(attentionScore) {
  for (const [state, bounds] of Object.entries(MEMORY_STATES)) {
    if (attentionScore >= bounds.min && attentionScore <= bounds.max) {
      return state;
    }
  }
  return 'ARCHIVED';
}

// Filter search results by state
function filterByState(memories, minState = 'COLD') {
  const stateOrder = ['ARCHIVED', 'DORMANT', 'COLD', 'WARM', 'HOT'];
  const minIndex = stateOrder.indexOf(minState);

  return memories.filter(m => {
    const state = getMemoryState(m.attention_score);
    return stateOrder.indexOf(state) >= minIndex;
  });
}
```

**Impact:** Clearer lifecycle management, automatic archival
**Effort:** Low (4-5 hours)

### 10.9 Corrections Tracking Schema

**Source:** 002-d
**Current in 082:** Learning mentioned, schema missing
**Feature:** Database table for tracking memory corrections

```sql
CREATE TABLE memory_corrections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_memory_id INTEGER NOT NULL,
    correction_type TEXT NOT NULL CHECK (
        correction_type IN ('superseded', 'deprecated', 'refined', 'merged')
    ),
    new_memory_id INTEGER,
    correction_date TEXT DEFAULT (datetime('now')),
    correction_reason TEXT,
    pattern_extracted TEXT,  -- Generalizable insight from correction
    applied_penalty REAL DEFAULT 0.5,
    FOREIGN KEY (original_memory_id) REFERENCES memory_index(id),
    FOREIGN KEY (new_memory_id) REFERENCES memory_index(id)
);

CREATE INDEX idx_corrections_original ON memory_corrections(original_memory_id);
CREATE INDEX idx_corrections_date ON memory_corrections(correction_date DESC);
```

```javascript
// Record correction and apply penalties
async function recordCorrection(originalId, newId, type, reason) {
  // 1. Insert correction record
  db.prepare(`
    INSERT INTO memory_corrections (original_memory_id, new_memory_id, correction_type, correction_reason)
    VALUES (?, ?, ?, ?)
  `).run(originalId, newId, type, reason);

  // 2. Apply stability penalty to original (halve stability)
  db.prepare(`
    UPDATE memory_index
    SET stability = stability * 0.5,
        importance_tier = CASE
          WHEN importance_tier = 'constitutional' THEN importance_tier
          ELSE 'deprecated'
        END
    WHERE id = ?
  `).run(originalId);

  // 3. Boost new memory if provided
  if (newId) {
    db.prepare(`
      UPDATE memory_index SET stability = stability * 1.2 WHERE id = ?
    `).run(newId);
  }

  return { corrected: originalId, replacement: newId };
}
```

**Impact:** System learns from mistakes, outdated memories fade
**Effort:** Medium (6-8 hours)

### 10.10 Complete Enhanced Search Pipeline

**Source:** 002-d
**Current in 082:** Components mentioned separately
**Feature:** Unified search function combining all enhancements

```javascript
async function enhancedSearch(query, sessionId, options = {}) {
  const {
    bypassCache = false,
    expand = true,
    rerank = false,
    deduplicate = true,
    minState = 'COLD',
    compression = 'standard',
    limit = 10
  } = options;

  // 1. Cache check
  const cacheKey = `search:${sessionId}:${hash(query + JSON.stringify(options))}`;
  if (!bypassCache) {
    const cached = getFromCache(cacheKey);
    if (cached) return { ...cached, _cached: true };
  }

  // 2. Query expansion (acronyms, synonyms)
  const expandedQuery = expand ? expandQuery(query) : query;

  // 3. Hybrid search (vector + BM25 + optional graph)
  const [vectorResults, bm25Results, graphResults] = await Promise.all([
    vectorSearch(expandedQuery, limit * 3),
    bm25Search(expandedQuery, limit * 3),
    options.includeGraph ? graphSearch(expandedQuery, limit * 2) : []
  ]);

  // 4. RRF fusion with convergence bonus
  let results = rrfFusion(vectorResults, bm25Results, graphResults, {
    k: 60,
    weights: { vector: 1.0, bm25: 1.0, graph: 1.5 },
    convergenceBonus: 0.10
  });

  // 5. Filter by memory state
  results = filterByState(results, minState);

  // 6. Apply multi-factor decay scoring
  results = results.map(r => ({
    ...r,
    compositeScore: calculateCompositeScore(r)
  })).sort((a, b) => b.compositeScore - a.compositeScore);

  // 7. Session deduplication
  if (deduplicate && sessionId) {
    results = filterUnsurfaced(sessionId, results);
  }

  // 8. Cross-encoder reranking (optional)
  if (rerank && results.length > 0) {
    results = await rerankWithCrossEncoder(query, results.slice(0, 20));
    results = applyLengthPenalty(results);
  }

  // 9. Apply compression
  results = results.slice(0, limit).map(r =>
    compressResult(r, COMPRESSION_TIERS[compression])
  );

  // 10. Mark as surfaced and cache
  if (deduplicate && sessionId) {
    markSurfaced(sessionId, results.map(r => r.id));
  }
  setCache(cacheKey, results, 5 * 60 * 1000);

  return {
    results,
    meta: {
      query: expandedQuery,
      resultCount: results.length,
      searchEngines: ['vector', 'bm25', options.includeGraph ? 'graph' : null].filter(Boolean),
      compression,
      sessionId
    }
  };
}
```

**Impact:** Single entrypoint for all search functionality
**Effort:** Medium (10-12 hours to integrate all components)

### 10.11 Fuzzy Acronym Matching with Levenshtein

**Source:** 002-d
**Current in 082:** Query expansion mentioned, fuzzy matching missing
**Feature:** Tolerance for typos in acronyms

```javascript
function levenshtein(a, b) {
  const matrix = Array(b.length + 1).fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,      // insertion
        matrix[j - 1][i] + 1,      // deletion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

const ACRONYM_MAP = {
  'RRF': ['reciprocal rank fusion', 'search fusion'],
  'FSRS': ['spaced repetition', 'memory scheduling', 'decay algorithm'],
  'DQI': ['document quality index', 'quality scoring'],
  'PE': ['progressive enhancement', 'prediction error'],
  'MCP': ['model context protocol', 'mcp server'],
  'ANCHOR': ['anchor format', 'section markers']
};

function expandQueryWithFuzzy(query, maxDistance = 2) {
  const terms = query.toLowerCase().split(/\s+/);
  const expanded = [...terms];

  for (const term of terms) {
    const upperTerm = term.toUpperCase();

    // Exact match
    if (ACRONYM_MAP[upperTerm]) {
      expanded.push(...ACRONYM_MAP[upperTerm]);
      continue;
    }

    // Fuzzy match within distance
    for (const [acronym, expansions] of Object.entries(ACRONYM_MAP)) {
      if (levenshtein(upperTerm, acronym) <= maxDistance) {
        expanded.push(...expansions);
      }
    }
  }

  return [...new Set(expanded)].join(' ');
}
```

**Impact:** "FFRS" matches "FSRS", "RFF" matches "RRF"
**Effort:** Low (3-4 hours)

### 10.12 7-Layer MCP Architecture with Token Budgets

**Source:** drift (001-c)
**Current in 082:** Tool layers mentioned, 7-layer not detailed
**Feature:** Complete layer hierarchy with specific budgets

```javascript
const MCP_LAYERS = {
  L1_ORCHESTRATION: {
    budget: [2000, 4000],
    tools: ['memory_context'],
    desc: 'Unified entry point, routes to other layers'
  },
  L2_RECOVERY: {
    budget: [500, 1000],
    tools: ['checkpoint_restore', 'session_recover'],
    desc: 'State recovery and crash handling'
  },
  L3_DISCOVERY: {
    budget: [200, 500],
    tools: ['memory_match_triggers', 'memory_stats', 'memory_health'],
    desc: 'Quick status checks and trigger matching'
  },
  L4_EXPLORATION: {
    budget: [500, 1500],
    tools: ['memory_search', 'memory_list', 'memory_browse'],
    desc: 'Browse and search memories'
  },
  L5_SURGICAL: {
    budget: [200, 800],
    tools: ['memory_update', 'memory_delete', 'memory_validate'],
    desc: 'Targeted modifications'
  },
  L6_PERSISTENCE: {
    budget: [1000, 2000],
    tools: ['memory_save', 'memory_index_scan', 'checkpoint_create'],
    desc: 'Write operations and indexing'
  },
  L7_ANALYSIS: {
    budget: [2500, 5000],
    tools: ['task_preflight', 'task_postflight', 'consolidation_run'],
    desc: 'Learning, analysis, and consolidation'
  }
};

// Tool description prefix with layer info
function enhanceToolSchema(tool) {
  for (const [layer, config] of Object.entries(MCP_LAYERS)) {
    if (config.tools.includes(tool.name)) {
      tool.description = `[${layer}|${config.budget[0]}-${config.budget[1]}t] ${tool.description}`;
      break;
    }
  }
  return tool;
}
```

**Impact:** AI can select appropriate layer, prevents context overflow
**Effort:** Medium (8-10 hours for full reorganization)

### 10.13 drift-Specific Tools

**Source:** drift (001-c, 001-d)
**Current in 082:** Not mentioned
**Feature:** Specialized tools for context and learning

```javascript
// drift_context: Get relevant context for current task
const DRIFT_CONTEXT = {
  name: 'memory_drift_context',
  description: 'Get contextually relevant memories for current task intent',
  inputSchema: {
    type: 'object',
    properties: {
      intent: {
        type: 'string',
        enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand']
      },
      currentFile: { type: 'string' },
      depth: { type: 'number', default: 2 }
    },
    required: ['intent']
  }
};

// drift_why: Trace decision lineage
const DRIFT_WHY = {
  name: 'memory_drift_why',
  description: 'Trace causal chain explaining why a decision was made',
  inputSchema: {
    type: 'object',
    properties: {
      memoryId: { type: 'string' },
      maxDepth: { type: 'number', default: 3 }
    },
    required: ['memoryId']
  },
  handler: async (args) => {
    const chain = await getCausalChain(args.memoryId, args.maxDepth);
    return {
      memory: await getMemory(args.memoryId),
      causedBy: chain.filter(e => e.relation === 'caused'),
      enabledBy: chain.filter(e => e.relation === 'enabled'),
      supersedes: chain.filter(e => e.relation === 'supersedes')
    };
  }
};

// drift_memory_learn: Record what was learned
const DRIFT_LEARN = {
  name: 'memory_drift_learn',
  description: 'Record a learning from the current session',
  inputSchema: {
    type: 'object',
    properties: {
      learning: { type: 'string' },
      category: {
        type: 'string',
        enum: ['pattern', 'mistake', 'optimization', 'constraint', 'insight']
      },
      confidence: { type: 'number', minimum: 0, maximum: 1 }
    },
    required: ['learning', 'category']
  }
};
```

**Impact:** Richer context retrieval, explicit learning capture
**Effort:** Medium-High (15-20 hours for full implementation)

### 10.14 BM25-WASM Implementation Option

**Source:** 002-c
**Current in 082:** BM25 mentioned, WASM option missing
**Feature:** Use WebAssembly BM25 for performance

```javascript
// Option 1: WASM-based (fastest)
const BM25_WASM = require('bm25-wasm');

class BM25Index {
  constructor() {
    this.index = new BM25_WASM();
    this.idMap = new Map(); // docIndex → memoryId
  }

  addDocument(memoryId, content) {
    const docIndex = this.index.addDocument(content);
    this.idMap.set(docIndex, memoryId);
  }

  search(query, limit = 20) {
    const results = this.index.search(query, limit);
    return results.map(r => ({
      id: this.idMap.get(r.documentIndex),
      score: r.score
    }));
  }
}

// Option 2: Pure JS fallback (slower but no WASM)
class BM25JS {
  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.documents = [];
    this.avgDl = 0;
    this.idf = new Map();
  }

  // ... implementation
}

// Factory with fallback
function createBM25Index() {
  try {
    return new BM25Index(); // WASM
  } catch (e) {
    console.warn('BM25-WASM unavailable, using JS fallback');
    return new BM25JS();
  }
}
```

**Impact:** 5-10x faster BM25 search with WASM
**Effort:** Low (4 hours including fallback)

---

## 11. Updated Priority Matrix (Including Deep-Dive Features)

### New P0 Items (Add to existing)

| Item | Source | Effort | Impact |
|------|--------|--------|--------|
| Length Penalty in Reranking | 002-b | 2h | Better precision |
| Recovery Hints Catalog | 002-c | 3h | Better UX |
| 5-State Memory Model | drift | 4-5h | Clearer lifecycle |

### New P1 Items (Add to existing)

| Item | Source | Effort | Impact |
|------|--------|--------|--------|
| Incremental Indexing (hash+mtime) | seu-claude | 6-8h | 10-100x faster reindex |
| Pre-Flight Quality Gates | seu-claude | 8-10h | Catch errors early |
| CONTINUE_SESSION.md | seu-claude | 2-3h | Human-readable state |
| Corrections Tracking Schema | 002-d | 6-8h | Learning from mistakes |
| Fuzzy Acronym Matching | 002-d | 3-4h | Typo tolerance |
| BM25-WASM Implementation | 002-c | 4h | Faster BM25 |

### New P2 Items (Add to existing)

| Item | Source | Effort | Impact |
|------|--------|--------|--------|
| GLiNER Entity Extraction | dotmd | Medium | Auto graph population |
| 5-Phase Consolidation Engine | drift | 20-30h | Auto knowledge distillation |
| 7-Layer MCP Architecture | drift | 8-10h | Progressive disclosure |
| drift-Specific Tools | drift | 15-20h | Richer context |
| Complete Search Pipeline | 002-d | 10-12h | Unified entrypoint |

---

## Appendix A: Best Code Examples

### A.1 RRF Fusion with Convergence Bonus

```javascript
function rrfFusion(vectorResults, bm25Results, graphResults = [], weights = {}, k = 60, convergenceBonus = 0.10) {
  const { vector: wV = 1.0, bm25: wB = 1.0, graph: wG = 1.5 } = weights;
  const scores = new Map();
  const sources = new Map();

  const scoreSet = (results, weight, sourceName) => {
    results.forEach((item, rank) => {
      const rrfScore = weight / (k + rank + 1);
      scores.set(item.id, (scores.get(item.id) || 0) + rrfScore);
      const itemSources = sources.get(item.id) || new Set();
      itemSources.add(sourceName);
      sources.set(item.id, itemSources);
    });
  };

  scoreSet(vectorResults, wV, 'vector');
  scoreSet(bm25Results, wB, 'bm25');
  if (graphResults.length) scoreSet(graphResults, wG, 'graph');

  for (const [id, itemSources] of sources) {
    if (itemSources.size >= 2) {
      scores.set(id, scores.get(id) * (1 + convergenceBonus));
    }
  }

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score, sources: Array.from(sources.get(id)) }));
}
```

### A.2 Multi-Factor Decay Composite

```javascript
function calculateCompositeScore(memory) {
  const temporal = Math.pow(1 + 0.235 * (daysSinceAccess / stability), -0.5);
  const usage = Math.min(1.5, 1.0 + memory.accessCount * 0.05);
  const importance = { critical: 1.5, high: 1.2, normal: 1.0, low: 0.8 }[memory.importance];
  const pattern = memory.patternMatch ? 1.2 : 1.0;
  const citation = memory.citedRecently ? 1.1 : 1.0;

  return Math.min(1.0, temporal * usage * importance * pattern * citation);
}
```

### A.3 Session Manager with Deduplication

```javascript
class SessionManager {
  constructor(db) {
    this.sessions = new Map();
    this.db = db;
  }

  getOrCreateSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      const recovered = this.db.getSession(sessionId);
      this.sessions.set(sessionId, recovered || {
        id: sessionId,
        startedAt: Date.now(),
        sentMemories: new Set(),
        tokensSent: 0,
        tokensSaved: 0
      });
    }
    return this.sessions.get(sessionId);
  }

  shouldSendMemory(sessionId, memoryId) {
    const session = this.getOrCreateSession(sessionId);
    return !session.sentMemories.has(memoryId);
  }

  markMemorySent(sessionId, memoryId, tokenCount) {
    const session = this.getOrCreateSession(sessionId);
    session.sentMemories.add(memoryId);
    session.tokensSent += tokenCount;
    this.db.saveSession(session);
  }
}
```

### A.4 Lazy Singleton Pattern (from dotmd)

```python
# Python pattern for lazy ML model loading
_embedding_provider: EmbeddingProvider | None = None

def get_embedding_provider() -> EmbeddingProvider:
    global _embedding_provider
    if _embedding_provider is None:
        _embedding_provider = EmbeddingProvider(config)
    return _embedding_provider
```

```javascript
// JavaScript equivalent
let embeddingProvider = null;

async function getEmbeddingProvider() {
  if (!embeddingProvider) {
    embeddingProvider = await initializeEmbeddingProvider(config);
  }
  return embeddingProvider;
}
```

### A.5 Interface-Based DI (from seu-claude)

```typescript
// Storage abstraction for swappable backends
interface IStore<T> {
  save(item: T): Promise<void>;
  get(id: string): Promise<T | null>;
  delete(id: string): Promise<void>;
  query(filter: Partial<T>): Promise<T[]>;
}

interface IVectorStore {
  search(embedding: number[], topK: number): Promise<SearchResult[]>;
  upsert(id: string, embedding: number[], metadata: Record<string, unknown>): Promise<void>;
  delete(id: string): Promise<void>;
}

interface IGraphStore {
  addEdge(source: string, target: string, relation: string, weight?: number): Promise<void>;
  getNeighbors(nodeId: string, maxHops?: number): Promise<string[]>;
  getPath(sourceId: string, targetId: string): Promise<Edge[]>;
}

// Service using dependency injection
class MemoryService {
  constructor(
    private metadataStore: IStore<Memory>,
    private vectorStore: IVectorStore,
    private graphStore: IGraphStore
  ) {}

  async search(query: string, options: SearchOptions): Promise<Memory[]> {
    const embedding = await this.embed(query);
    const vectorResults = await this.vectorStore.search(embedding, options.limit * 2);
    // ... compose with other sources
  }
}
```

### A.6 Unified Decay Function

```javascript
// Combines tier-based, type-specific, and multi-factor decay
function calculateUnifiedDecay(memory, elapsedDays) {
  // 1. Tier-based exemption (constitutional never decays)
  const tierRate = TIER_DECAY_RATES[memory.importance_tier] || 1.0;
  if (tierRate === 1.0 && memory.importance_tier === 'constitutional') {
    return memory.attention_score;
  }

  // 2. Type-specific half-life
  const halfLife = HALF_LIVES_DAYS[memory.memory_type || 'episodic'];
  if (halfLife === Infinity) {
    return memory.attention_score;
  }

  // 3. FSRS retrievability
  const stability = memory.stability || 30;
  const retrievability = Math.pow(1 + 0.235 * (elapsedDays / stability), -0.5);

  // 4. Type decay factor
  const typeDecay = Math.pow(0.5, elapsedDays / halfLife);

  // 5. Usage boost
  const usageBoost = Math.min(1.5, 1.0 + (memory.access_count || 0) * 0.05);

  // 6. Citation recency
  const citationBoost = memory.cited_recently ? 1.1 : 1.0;

  // 7. Pattern alignment
  const patternBoost = memory.pattern_match ? 1.2 : 1.0;

  // Combine all factors
  const composite = memory.attention_score
    * retrievability
    * typeDecay
    * usageBoost
    * citationBoost
    * patternBoost;

  return Math.max(0.01, Math.min(1.0, composite));
}
```

### A.7 Crash Recovery with Interrupted Session Handling

```javascript
// Session state persistence for crash recovery
class SessionStateManager {
  constructor(db) {
    this.db = db;
  }

  async saveState(sessionId, state) {
    await this.db.prepare(`
      INSERT OR REPLACE INTO session_state (session_id, state, updated_at, status)
      VALUES (?, ?, datetime('now'), 'active')
    `).run(sessionId, JSON.stringify(state));
  }

  async recoverState(sessionId) {
    const row = await this.db.prepare(`
      SELECT state, status FROM session_state WHERE session_id = ?
    `).get(sessionId);

    if (!row) return null;

    const state = JSON.parse(row.state);
    state._recovered = row.status === 'interrupted';
    return state;
  }

  async resetInterruptedSessions() {
    const result = await this.db.prepare(`
      UPDATE session_state
      SET status = 'interrupted',
          state = json_set(state, '$.interrupted_at', datetime('now'))
      WHERE status = 'active'
    `).run();

    return result.changes;
  }

  async initializeWithRecovery() {
    const interrupted = await this.resetInterruptedSessions();
    if (interrupted > 0) {
      console.log(`[Recovery] Marked ${interrupted} sessions as interrupted`);
    }
  }
}

// On MCP server startup
const stateManager = new SessionStateManager(db);
await stateManager.initializeWithRecovery();
```

### A.8 Causal Chain Query with Depth Limit

```javascript
async function getCausalChain(memoryId, maxDepth = 3) {
  const chain = [];
  const visited = new Set();

  async function traverse(id, depth, path = []) {
    if (depth > maxDepth || visited.has(id)) return;
    visited.add(id);

    const edges = await db.prepare(`
      SELECT target_id, relation, strength, evidence
      FROM causal_edges
      WHERE source_id = ?
      ORDER BY strength DESC
    `).all(id);

    for (const edge of edges) {
      const newPath = [...path, { from: id, to: edge.target_id, relation: edge.relation }];

      chain.push({
        from: id,
        to: edge.target_id,
        relation: edge.relation,
        strength: edge.strength,
        evidence: edge.evidence,
        depth,
        path: newPath
      });

      await traverse(edge.target_id, depth + 1, newPath);
    }
  }

  await traverse(memoryId, 0);

  // Group by relation type
  return {
    all: chain,
    byCause: chain.filter(e => e.relation === 'caused'),
    byEnabled: chain.filter(e => e.relation === 'enabled'),
    bySupersedes: chain.filter(e => e.relation === 'supersedes'),
    byContradicts: chain.filter(e => e.relation === 'contradicts'),
    byDerivedFrom: chain.filter(e => e.relation === 'derived_from'),
    maxDepthReached: chain.some(e => e.depth === maxDepth)
  };
}
```

### A.9 Compression Tiers Implementation

```javascript
const COMPRESSION_TIERS = {
  minimal: {
    targetTokens: 100,
    fields: ['id', 'title', 'importance_tier'],
    snippetLength: 50,
    includeAnchors: false
  },
  compact: {
    targetTokens: 200,
    fields: ['id', 'title', 'importance_tier', 'summary'],
    snippetLength: 150,
    includeAnchors: ['summary']
  },
  standard: {
    targetTokens: 400,
    fields: ['id', 'title', 'importance_tier', 'summary', 'anchors'],
    snippetLength: 300,
    includeAnchors: ['summary', 'decisions', 'state']
  },
  full: {
    targetTokens: null, // No limit
    fields: null, // All fields
    snippetLength: null, // No truncation
    includeAnchors: true // All anchors
  }
};

function compressResult(memory, tier = 'standard') {
  const config = COMPRESSION_TIERS[tier] || COMPRESSION_TIERS.standard;

  // If full, return as-is
  if (config.fields === null) {
    return memory;
  }

  const compressed = {};

  // Copy allowed fields
  for (const field of config.fields) {
    if (memory[field] !== undefined) {
      if (field === 'summary' && config.snippetLength) {
        compressed[field] = truncate(memory[field], config.snippetLength);
      } else {
        compressed[field] = memory[field];
      }
    }
  }

  // Handle anchors
  if (config.includeAnchors && memory.anchors) {
    if (Array.isArray(config.includeAnchors)) {
      compressed.anchors = {};
      for (const anchor of config.includeAnchors) {
        if (memory.anchors[anchor]) {
          compressed.anchors[anchor] = memory.anchors[anchor];
        }
      }
    } else {
      compressed.anchors = memory.anchors;
    }
  }

  compressed._compression = tier;
  compressed._originalTokens = estimateTokens(memory);
  compressed._compressedTokens = estimateTokens(compressed);

  return compressed;
}

function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
```

---

## Appendix B: Source Attribution

| Document | Location | Key Contributions |
|----------|----------|-------------------|
| 001-a | `081-speckit-reimagined-pre-analysis/001-a-analysis-cross-repository-architecture.md` | Triple-hybrid retrieval, RRF fusion, dotmd patterns |
| 001-b | `081-speckit-reimagined-pre-analysis/001-b-analysis-repository-comparison.md` | 9 memory types, decay models, storage abstractions |
| 001-c | `081-speckit-reimagined-pre-analysis/001-c-analysis-three-system-architecture-review.md` | Core logic flows, consolidation phases, token budgeting |
| 001-d | `081-speckit-reimagined-pre-analysis/001-d-analysis-speckit-architecture-comparison.md` | 9-dimension matrix, design patterns |
| 002-a | `081-speckit-reimagined-pre-analysis/002-a-recommendations-speckit-enhancement.md` | 12 recommendations, 3 phases, effort/impact scores |
| 002-b | `081-speckit-reimagined-pre-analysis/002-b-recommendations-speckit-enhancement.md` | 8 P0-P3 recommendations with code examples |
| 002-c | `081-speckit-reimagined-pre-analysis/002-c-recommendations-speckit-enhancement-roadmap.md` | 4-phase roadmap, risk assessment |
| 002-d | `081-speckit-reimagined-pre-analysis/002-d-recommendations-speckit-improvements.md` | 9-item priority matrix |

---

*Generated by 25-agent parallel analysis synthesis on 2026-02-01*
