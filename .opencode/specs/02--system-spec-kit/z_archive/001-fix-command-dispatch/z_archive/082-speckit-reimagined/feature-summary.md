# SpecKit Reimagined: Feature Summary

> **33 features** organized by functional area with current vs. future state analysis and impact assessment.

---

## Overview

> **[AUDIT 2026-02-01]:** Feature status corrected based on codebase analysis during 082 documentation review. The 081 pre-analysis research did not verify existing implementations before marking these as gaps requiring new development. Actual codebase review confirmed these capabilities already exist:
> - **RRF Fusion:** Implemented in search infrastructure
> - **FSRS Decay:** Implemented in decay/scoring module
> - **Composite Scoring:** Implemented in ranking system
> - **5-State Lifecycle:** Implemented in state management
> 
> This significantly reduces new implementation effort. See `081-speckit-reimagined-pre-analysis/` for original research and this spec folder's `memory/` for the analysis that identified these corrections.

This document provides a detailed breakdown of every feature in the SpecKit Reimagined specification. Each feature includes:
- **What it does** - The functionality being implemented
- **Current state** - How SpecKit works today (or lacks capability)
- **Future state** - What changes after implementation
- **Impact** - Systems, files, and behaviors affected

---

## CATEGORY A: SEARCH & RETRIEVAL

### Feature 1: RRF Search Fusion

**What it does:**
Reciprocal Rank Fusion (RRF) combines results from multiple search engines (vector, BM25, graph) into a unified ranked list. Uses the formula `score = weight / (k + rank + 1)` with k=60 as the fusion constant. Results appearing in multiple engines receive a 10% convergence bonus.

**Current state:**
SpecKit has `mcp_server/lib/search/rrf-fusion.js` with k=60 and 10% convergence bonus already implemented. However, it's not fully integrated into the search pipeline - vector and FTS5 results are combined but graph traversal is not yet included in the fusion.

**Future state:**
Triple-hybrid search with weighted fusion. Vector (1.0x), BM25 (1.0x), and Graph (1.5x) results merge via RRF. Cross-source results get 10% boost. Single ranked output regardless of which engine found what.

**Impact:**
- `mcp_server/lib/search/vector-index.js` - Major rewrite
- `mcp_server/lib/search/composite-scoring.js` - New fusion logic
- All `memory_search` calls - Different ranking behavior
- **KPI:** +40-50% relevance improvement

---

### Feature 2: BM25 Hybrid Search

**What it does:**
Adds proper BM25 (Best Match 25) keyword scoring alongside vector search. BM25 excels at exact term matching, acronyms, and technical identifiers that semantic search misses.

**Current state:**
FTS5 is used but not with proper BM25 weighting. Keyword matches are not optimally scored. Technical terms like "FSRS" or "RRF" may not surface correctly.

**Future state:**
True BM25 scoring with configurable k1 (1.5) and b (0.75) parameters. Option for WASM-accelerated implementation (5-10x faster) with pure JS fallback. Feeds into RRF fusion pipeline.

**Impact:**
- `mcp_server/lib/search/bm25-index.js` - New file
- Schema changes for BM25 index storage
- Optional WASM dependency
- **KPI:** Better keyword/acronym retrieval

---

### Feature 3: Cross-Encoder Reranking

**What it does:**
After initial retrieval, sends top-20 candidates to a cross-encoder model for precision reranking. Cross-encoders see query+document pairs together, enabling deeper semantic matching. Supports multiple providers (e.g., Voyage rerank-2, Cohere, or local models).

**Current state:**
No reranking. Initial retrieval order is final. Bi-encoder (embedding) similarity is the only semantic signal.

**Future state:**
Optional two-stage retrieval: fast initial search → precise cross-encoder rerank. Includes length penalty (short content <100 chars gets 0.8-1.0x penalty) to prevent low-information snippets from ranking artificially high.

**Impact:**
- New API dependency (configurable cross-encoder provider)
- Added latency (P95 must stay <500ms or auto-disable)
- `options.rerank` parameter on search
- **Risk:** R1 - latency/cost concerns, mitigated by optional flag

---

### Feature 4: Query Expansion with Fuzzy Matching

**What it does:**
Automatically expands queries with synonyms and catches typos via Levenshtein distance. "FFRS" matches "FSRS", "RFF" matches "RRF". Includes acronym-to-expansion mapping.

**Current state:**
Exact matching only. Typos in technical terms cause search failures. No synonym expansion.

**Future state:**
Acronym map (FSRS → "spaced repetition", RRF → "search fusion", etc.) with fuzzy lookup (Levenshtein distance ≤2). Query "FFRS decay" expands to include "spaced repetition memory scheduling".

**Impact:**
- `mcp_server/lib/search/query-expansion.js` - New file
- Configurable acronym map
- Slight query processing overhead
- **Benefit:** Dramatically better UX for typos

---

### Feature 5: Intent-Aware Retrieval

**What it does:**
Classifies query intent (add_feature, fix_bug, refactor, security_audit, understand) and applies task-specific search weights. A "fix_bug" query weights error-related memories higher than architectural decisions.

**Current state:**
All queries treated identically. No task context influences search. Debug sessions surface the same memories as feature planning.

**Future state:**
Query classification routes to intent-specific weight profiles. Intent can be auto-detected from query phrasing or explicitly specified via parameter.

**Impact:**
- New intent classifier (rule-based or ML)
- `intent` parameter on search tools
- Different results for same query with different intents
- **KPI:** +20% intent match rate

---

### Feature 6: Graph-Enhanced Search

**What it does:**
Includes results from causal graph traversal in search fusion. Memories connected via "caused", "supersedes", or "supports" relationships surface even without direct semantic match.

**Current state:**
No graph. Memories are isolated documents. "Why did we choose X?" queries cannot trace decision lineage.

**Future state:**
Graph traversal finds related memories. Query "session management decision" finds the original decision AND all memories it superseded or that support it. Graph results weighted 1.5x in RRF.

**Impact:**
- Requires Feature 18 (Causal Memory Graph) first
- `includeGraph` parameter on search
- Discovers non-obvious relationships
- **KPI:** 60% memories with causal links

---

## CATEGORY B: MEMORY DECAY & LIFECYCLE

### Feature 7: Type-Specific Half-Lives

**What it does:**
Different memory types decay at different rates. Procedural knowledge (how-to) decays slowly (90+ days). Episodic memories (what happened) decay quickly (7-14 days). Constitutional rules never decay.

**Current state:**
All memories use identical FSRS decay curve. A one-time debug session and a core architectural principle decay identically.

**Future state:**
9 memory types with distinct half-lives:
| Type | Half-Life | Example |
|------|-----------|---------|
| constitutional | ∞ | "Never edit without reading first" |
| procedural | 90+ days | "How to deploy to production" |
| semantic | 60 days | "RRF stands for Reciprocal Rank Fusion" |
| episodic | 14 days | "Fixed bug XYZ on Tuesday" |
| working | 1 day | "Currently debugging auth flow" |

**Impact:**
- `memory_type` column in schema (breaking change in v5)
- Auto-inference from file path + frontmatter
- `mcp_server/lib/cognitive/tier-classifier.js` changes
- **Risk:** R3 - misconfiguration, mitigated by reset command

---

### Feature 8: Multi-Factor Decay Composite

**What it does:**
Decay score is computed from 5 factors multiplied together, not just time elapsed:
1. **Temporal** - FSRS formula based on stability
2. **Usage** - Access count boost (capped at 1.5x)
3. **Importance** - Tier anchor (critical=1.5x, high=1.2x)
4. **Pattern** - Alignment with current task (+20%)
5. **Citation** - Recently cited boost (+10%)

**Current state:**
SpecKit has `mcp_server/lib/scoring/composite-scoring.js` with 6 factors already implemented (temporal, usage, importance, recency, validation, co-activation). However, usage tracking columns (`access_count`, `last_accessed_at`) are not yet in the schema, limiting some factors.

**Future state:**
Composite score: `temporal × usage × importance × pattern × citation`. A frequently-accessed procedural memory stays relevant longer than a one-time episodic note.

**Impact:**
- `access_count`, `last_accessed_at` columns (v4.1)
- `mcp_server/lib/cognitive/attention-decay.js` rewrite
- Every search recalculates scores
- **KPI:** +30-40% relevance improvement

---

### Feature 9: 5-State Memory Model

**What it does:**
Formalizes memory lifecycle into discrete states with threshold-based transitions:
| State | Attention Score | Behavior |
|-------|----------------|----------|
| HOT | 0.80-1.00 | Always retrieve |
| WARM | 0.25-0.80 | Retrieve on match |
| COLD | 0.05-0.25 | Retrieve if nothing else |
| DORMANT | 0.02-0.05 | Skip unless explicit |
| ARCHIVED | 0.00-0.02 | Exclude from search |

**Current state:**
SpecKit has `mcp_server/lib/cognitive/tier-classifier.js` with 5 states (HOT/WARM/COLD/DORMANT/ARCHIVED) already implemented. State filtering in search is partially implemented but not fully exposed via tool parameters.

**Future state:**
Clear lifecycle management. ARCHIVED memories are automatically excluded from search. DORMANT requires explicit request. Enables automatic cleanup without deletion.

**Impact:**
- New `state` computed column or view
- Search filters by state
- Potential storage savings (archived can be compressed)
- **Benefit:** Cleaner search results, automatic lifecycle

---

### Feature 10: Usage Boost to Decay

**What it does:**
Tracks how often each memory is accessed and boosts frequently-used memories' scores. Access count × 0.05, capped at 1.5x total boost.

**Current state:**
No access tracking. A memory accessed 100 times has identical priority to one never accessed.

**Future state:**
`access_count` incremented on each retrieval. Score boosted proportionally. Frequently-used memories resist decay naturally.

**Impact:**
- `access_count` column (v4.1 migration)
- Every search updates accessed memories
- Slight write overhead per search
- **KPI:** +15% relevance for active content

---

## CATEGORY C: SESSION MANAGEMENT

### Feature 11: Session Deduplication

**What it does:**
Tracks which memories have been surfaced in the current session. Prevents re-sending the same memory multiple times. Uses hash-based Set for O(1) lookup.

**Current state:**
No session awareness. Same memory surfaces repeatedly if it matches the query. Follow-up questions waste tokens on already-seen content.

**Future state:**
SessionManager tracks `sentMemories` Set per session. `shouldSendMemory(sessionId, memoryId)` returns false if already surfaced. Token savings: 25-50% on follow-up queries.

**Impact:**
- `mcp_server/lib/storage/sessions.js` - New file
- Session ID tracking throughout search pipeline
- State persisted to SQLite for crash recovery
- **KPI:** -50% tokens on follow-up queries

---

### Feature 12: Tool Output Caching

**What it does:**
Caches search results per session with 60-second TTL. Identical queries return cached results instantly. Cache invalidated on any write operation.

**Current state:**
Every search executes full pipeline. Repeated queries (common during debugging) waste compute and API calls.

**Future state:**
Session-scoped cache with conservative TTL. Cache key: `search:${sessionId}:${hash(query + options)}`. Write-through invalidation on memory_save, memory_update.

**Impact:**
- In-memory cache (Map with TTL)
- `_cached: true` flag in cached responses
- -60% redundant API calls
- **Risk:** R2 - stale results, mitigated by short TTL

---

### Feature 13: Crash Recovery Pattern

**What it does:**
Immediate SQLite saves after every state change. On MCP startup, detects interrupted sessions and marks them for recovery. Enables zero data loss on crash.

**Current state:**
Periodic checkpoints. Data between checkpoints can be lost on crash.

**Future state:**
`SessionStateManager` with immediate persist. On startup: `resetInterruptedSessions()` marks active sessions as interrupted. `recoverState(sessionId)` returns session with `_recovered: true` flag.

**Impact:**
- `session_state` table
- Write on every state change (slight overhead)
- Guaranteed recoverability
- **NFR:** Zero data loss on crash

---

### Feature 14: CONTINUE_SESSION.md Generation

**What it does:**
Generates human-readable markdown file with session state. Enables manual recovery without tooling. Contains: active task, last action, context summary, pending work, resume command.

**Current state:**
Session state only in SQLite. Humans cannot inspect or understand session state without database tools.

**Future state:**
Auto-generated `CONTINUE_SESSION.md` alongside SQLite state. Human-readable format. Contains exact resume command for convenience.

**Impact:**
- File written on session save
- Human debugging capability
- Complements SQLite state (not replacement)
- **Benefit:** Users can understand/share session state

---

## CATEGORY D: GRAPH & RELATIONSHIPS

### Feature 15: Causal Memory Graph

**What it does:**
Stores relationships between memories in `causal_edges` table. 6 relationship types: caused, enabled, supersedes, contradicts, derived_from, supports. Enables "why" queries and decision lineage tracing.

**Current state:**
No graph. Memories are isolated documents. Cannot answer "why was this decision made?" or "what superseded this?"

**Future state:**
```sql
CREATE TABLE causal_edges (
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relation TEXT NOT NULL,  -- caused, enabled, supersedes, etc.
  strength REAL DEFAULT 1.0,
  evidence TEXT
);
```
Graph traversal up to 3 hops. `memory_drift_why(id)` traces causal chain.

**Impact:**
- New table (schema v5 breaking change)
- Graph extraction (auto or manual)
- Search includes graph results (1.5x weight)
- **KPI:** 60% memories with causal links

---

### Feature 16: Corrections Tracking Schema

**What it does:**
Records when memories are corrected (superseded, deprecated, refined, merged). Applies 0.5x stability penalty to corrected memories. Tracks pattern extracted from correction for learning.

**Current state:**
No correction tracking. Outdated memories don't fade faster. No learning from mistakes.

**Future state:**
```sql
CREATE TABLE memory_corrections (
  original_memory_id INTEGER NOT NULL,
  correction_type TEXT NOT NULL,  -- superseded, deprecated, refined, merged
  new_memory_id INTEGER,
  pattern_extracted TEXT,  -- Generalizable insight
  applied_penalty REAL DEFAULT 0.5
);
```
Corrected memories get halved stability. Learning system extracts patterns.

**Impact:**
- New table
- `memory_correct()` tool
- Faster decay of outdated content
- Foundation for learning system

---

### Feature 17: Learning from Corrections

**What it does:**
Captures correction patterns and adjusts confidence scores. When memory is accepted: +5%. Modified: -5%. Rejected: -20%. Correction type adds additional 0.5x penalty.

**Current state:**
No learning. System doesn't improve from feedback. Same mistakes can recur.

**Future state:**
Feedback loop: outcome (accepted/modified/rejected) × correction penalty × temporal decay = new confidence. Patterns extracted from corrections inform future scoring.

**Impact:**
- Requires Feature 16 (Corrections Tracking) first
- `adjustConfidence()` function
- Self-improving relevance over time
- **Risk:** R6 - bias amplification, mitigated by feature flag

---

### Feature 18: Memory Consolidation Pipeline

**What it does:**
5-phase process to distill episodic memories into semantic knowledge:
1. **REPLAY** - Select episodic memories older than 7 days
2. **ABSTRACT** - Find facts appearing 2+ times across episodes
3. **INTEGRATE** - Create/update semantic memories from patterns
4. **PRUNE** - Archive episodes whose facts are now semantic
5. **STRENGTHEN** - Boost frequently-accessed memories

**Current state:**
No consolidation. All memories remain as created. Storage grows unbounded. No pattern extraction.

**Future state:**
Periodic consolidation (manual or scheduled). Episodic → semantic promotion. Automatic archival of redundant episodes. Storage efficiency through abstraction.

**Impact:**
- `consolidation_run` tool
- Background process capability
- Storage reduction
- Higher-quality semantic memories

---

## CATEGORY E: PERFORMANCE & EFFICIENCY

### Feature 19: Lazy Embedding Model Loading

**What it does:**
Defers embedding model initialization until first use. Lazy Singleton pattern: `getEmbeddingProvider()` initializes on first call, returns cached instance thereafter.

**Current state:**
Eager initialization on MCP startup. Embedding model loaded before any tool is called. Startup time: 2-3 seconds.

**Future state:**
No model loading on startup. First search triggers initialization (one-time 2-3s delay). Subsequent calls instant. Startup time: <500ms.

**Impact:**
- `mcp_server/server.js` initialization rewrite
- First-search latency spike (acceptable)
- Massive startup improvement
- **KPI:** <500ms MCP startup (50-70% faster)

---

### Feature 20: Incremental Indexing

**What it does:**
Tracks content hash + mtime for each indexed file. On re-index, skips unchanged files. Only processes files where hash OR mtime changed.

**Current state:**
Full re-index every time. All files processed regardless of changes. Slow for large codebases.

**Future state:**
```javascript
if (existingRecord.mtime === stats.mtimeMs &&
    existingRecord.contentHash === contentHash) {
  return false; // Skip
}
```
10-100x faster re-indexing on large codebases.

**Impact:**
- `content_hash`, `mtime` columns
- `memory_index_scan` returns `{ indexed, skipped, total }`
- Dramatic speed improvement for re-indexing
- **Benefit:** Makes regular re-indexing practical

---

### Feature 21: BM25-WASM Implementation

**What it does:**
Uses WebAssembly-compiled BM25 for 5-10x faster keyword search. Falls back to pure JavaScript if WASM unavailable.

**Current state:**
FTS5 only. No optimized BM25 implementation.

**Future state:**
```javascript
function createBM25Index() {
  try {
    return new BM25Index(); // WASM
  } catch (e) {
    return new BM25JS();    // Fallback
  }
}
```
Automatic selection of fastest available implementation.

**Impact:**
- Optional WASM dependency
- Faster search on large memory sets
- Graceful degradation
- **Effort:** Low (4 hours including fallback)

---

### Feature 22: Compression Tiers

**What it does:**
4 compression levels for search results:
| Level | Tokens | Fields | Use Case |
|-------|--------|--------|----------|
| minimal | ~100 | id, title, tier | Quick context check |
| compact | ~200 | + summary | Resume prior work |
| standard | ~400 | + anchors | Active development |
| full | Complete | All | Deep investigation |

**Current state:**
Full content always returned. No compression options. Token waste on simple lookups.

**Future state:**
`compression` parameter on search. Results include `_compression`, `_originalTokens`, `_compressedTokens` metadata. Configurable per query.

**Impact:**
- `compressResult()` function
- `compression` parameter on all search tools
- Significant token savings for quick lookups
- **KPI:** Configurable tokens per search

---

## CATEGORY F: USER EXPERIENCE & RECOVERY

### Feature 23: Recovery Hints in Errors

**What it does:**
Every error includes actionable recovery guidance. Error catalog maps error codes to specific recovery commands.

**Current state:**
Generic error messages. Users must figure out recovery steps themselves.

**Future state:**
```javascript
RECOVERY_HINTS = {
  'memory_search': {
    'E041': 'Run memory_index_scan to rebuild vector index',
    'E001': 'Check embedding API key or set SPECKIT_LOCAL_EMBEDDINGS=true',
    'timeout': 'Increase SPECKIT_SEARCH_TIMEOUT or simplify query'
  }
}
```
Every error includes next step.

**Impact:**
- Error handler enhancement
- Recovery hint lookup
- Zero runtime cost (strings only)
- **Benefit:** Self-service recovery, AI self-healing

---

### Feature 24: Recovery Hints Catalog

**What it does:**
Comprehensive mapping of all error codes to recovery actions. Covers: memory_search, checkpoint_restore, memory_save, and all other tools.

**Current state:**
Ad-hoc error messages. No systematic coverage.

**Future state:**
Complete catalog covering every error code. Default fallback: "Run memory_health() for diagnostics". Enables AI agents to self-recover.

**Impact:**
- Documentation effort
- `errors.js` enhancement
- Better UX for all error scenarios
- **Effort:** Low (3 hours for catalog)

---

### Feature 25: Pre-Flight Quality Gates

**What it does:**
Validation checks before expensive operations. Catches errors before API calls or database writes.

**Current state:**
Errors caught during execution. Wasted API calls on invalid input.

**Future state:**
```javascript
preflight('memory_save', params) → {
  checks: [
    { name: 'anchor_format', ok: true },
    { name: 'duplicate_check', ok: false, reason: 'Memory exists' },
    { name: 'token_budget', ok: true }
  ],
  proceed: false
}
```
Fail fast before expensive operations.

**Impact:**
- Pre-flight check framework
- Per-operation check definitions
- Faster error feedback
- **Benefit:** Reduced API waste, better UX

---

### Feature 26: Standardized Response Structure

**What it does:**
All tool responses use consistent envelope format:
```javascript
{
  summary: "Found 5 memories matching 'auth flow'",
  data: [...],
  hints: ["Consider adding 'session' for more specific results"],
  meta: { timing: 45, cached: false, compression: 'standard' }
}
```

**Current state:**
Inconsistent response formats across tools. Some return arrays, some objects. No hints or metadata.

**Future state:**
Uniform envelope for all tools. Always includes summary (human-readable), data (payload), hints (suggestions), meta (diagnostics).

**Impact:**
- All tool handlers refactored
- Consistent parsing for AI agents
- Better debugging via meta
- **Benefit:** Predictable API contract

---

## CATEGORY G: ARCHITECTURE & ORGANIZATION

### Feature 27: Layered Tool Organization

**What it does:**
Reorganizes 17+ tools into 5 layers with token budgets:
| Layer | Budget | Tools | Purpose |
|-------|--------|-------|---------|
| L1 | 2000-4000 | memory_context | Unified entry |
| L2 | 200-500 | match_triggers, stats | Discovery |
| L3 | 200-800 | validate, delete, update | Surgical |
| L4 | 500-1500 | search, list | Exploration |
| L5 | 1000-2000 | save, index_scan | Persistence |

**Current state:**
Flat 4-category organization. No token budget guidance. AI agents don't know which tools are "expensive".

**Future state:**
Tool descriptions prefixed with `[L3|200-800t]`. AI can select appropriate layer. Progressive disclosure from orchestration to detail.

**Impact:**
- Tool schema restructuring
- Description format changes
- AI routing guidance
- **Benefit:** Smarter tool selection by AI

---

### Feature 28: Protocol Abstractions

**What it does:**
Defines interfaces for swappable backends:
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

**Current state:**
Direct module imports. Tight coupling to specific implementations. Difficult to test or swap backends.

**Future state:**
Targeted protocol abstractions at integration boundaries. Enables: mock implementations for testing, alternative backends (local vs API embeddings), future LadybugDB migration.

**Impact:**
- Interface definitions
- Constructor injection pattern
- Better testability
- **Benefit:** Flexibility without full hexagonal overhead

---

### Feature 29: 7-Layer MCP Architecture

**What it does:**
Extends layered tools to full 7-layer hierarchy:
1. Orchestration (unified entry)
2. Recovery (crash handling)
3. Discovery (status checks)
4. Exploration (search/browse)
5. Surgical (targeted edits)
6. Persistence (writes)
7. Analysis (learning/consolidation)

**Current state:**
Flat organization. No recovery layer. No analysis layer.

**Future state:**
Complete layer hierarchy with token budgets per layer. AI agents guided to appropriate layer for task type.

**Impact:**
- Full tool reorganization
- New tools for recovery and analysis
- **Effort:** Medium (8-10 hours)

---

### Feature 30: Feature Flag Strategy

**What it does:**
Environment variable flags for gradual rollout:
```javascript
FEATURE_FLAGS = {
  ENABLE_RRF_FUSION: process.env.SPECKIT_RRF ?? false,
  ENABLE_USAGE_TRACKING: process.env.SPECKIT_USAGE ?? false,
  ENABLE_TYPE_DECAY: process.env.SPECKIT_TYPE_DECAY ?? false,
  ENABLE_RELATIONS: process.env.SPECKIT_RELATIONS ?? false,
  DISABLE_LEGACY_SEARCH: process.env.SPECKIT_NO_LEGACY ?? false
}
```

**Current state:**
All-or-nothing deployments. No gradual rollout capability.

**Future state:**
Each major feature behind flag. Enable incrementally. Disable if issues arise. Safe migration path.

**Impact:**
- Flag checking throughout codebase
- Enables A/B testing
- Safer deployments
- **Risk mitigation:** Easy rollback

---

## CATEGORY H: SPECIALIZED TOOLS

### Feature 31: memory_drift_context

**What it does:**
Single tool for getting contextually relevant memories based on current task intent. Replaces manual search + filtering.

**Current state:**
Manual search with intent guessing. No task-specific context retrieval.

**Future state:**
```javascript
memory_drift_context({
  intent: 'fix_bug',
  currentFile: 'auth.js',
  depth: 2
})
```
Returns memories relevant to debugging auth.js, weighted for bug-fixing context.

**Impact:**
- New MCP tool
- Intent-aware retrieval
- Higher-quality context

---

### Feature 32: memory_drift_why

**What it does:**
Traces causal chain for a memory. Answers "why was this decision made?" by traversing causal edges.

**Current state:**
No decision tracing. Cannot answer "why" queries.

**Future state:**
```javascript
memory_drift_why({ memoryId: 'abc123', maxDepth: 3 })
→ {
  memory: {...},
  causedBy: [...],
  enabledBy: [...],
  supersedes: [...]
}
```
Up to 3-hop traversal with grouped results.

**Impact:**
- Requires Feature 15 (Causal Graph) first
- New MCP tool
- Enables decision archaeology

---

### Feature 33: memory_drift_learn

**What it does:**
Explicitly records learnings from current session. Categories: pattern, mistake, optimization, constraint, insight.

**Current state:**
Implicit learning only. No explicit "I learned X" capture.

**Future state:**
```javascript
memory_drift_learn({
  learning: "RRF with k=60 works well for code search",
  category: 'optimization',
  confidence: 0.85
})
```
Creates high-confidence memory with learning metadata.

**Impact:**
- New MCP tool
- Explicit knowledge capture
- Feeds into consolidation pipeline

---

## Summary: Impact by System

| System | Features Affected | Key Changes |
|--------|-------------------|-------------|
| **Search** | 1-6 | RRF fusion, BM25, cross-encoder, query expansion, intent, graph |
| **Decay** | 7-10 | Type-specific, multi-factor, 5-state, usage boost |
| **Session** | 11-14 | Deduplication, caching, crash recovery, CONTINUE_SESSION |
| **Graph** | 15-18 | Causal edges, corrections, learning, consolidation |
| **Performance** | 19-22 | Lazy loading, incremental index, BM25-WASM, compression |
| **UX** | 23-26 | Recovery hints, pre-flight, standardized responses |
| **Architecture** | 27-30 | Layered tools, protocols, 7-layer, feature flags |
| **Specialized** | 31-33 | drift_context, drift_why, drift_learn |

---

## Summary: Current vs Future State

| Dimension | Current | Future | Improvement |
|-----------|---------|--------|-------------|
| Search relevance | Vector + FTS5 | Triple-hybrid RRF | +40-50% |
| MCP startup | 2-3s | <500ms | 50-70% faster |
| Token usage (follow-up) | Full repeat | Session dedup | -50% |
| "Why" queries | Impossible | Causal graph | 60% coverage |
| Decay model | FSRS only | 5-factor composite | +30-40% relevance |
| Error recovery | Manual | Self-service hints | Zero frustration |
| Re-indexing | Full scan | Incremental | 10-100x faster |
| Tool organization | Flat | 7-layer hierarchy | Smart AI routing |

---

*Generated 2026-02-01 as part of Level 3+ spec documentation*
