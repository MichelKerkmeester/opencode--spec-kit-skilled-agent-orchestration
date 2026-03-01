> **STATUS: SUPERSEDED** — All recommendations from this pre-analysis have been implemented.
> See spec `089-speckit-reimagined-refinement` for the current audit and remediation plan.
> This document is retained for historical reference only.

---

# Technical Analysis: Memory System Architecture Comparison

## Executive Summary

This analysis examines four AI memory systems: dotmd (hybrid search pioneer), seu-claude (task orchestration focus), drift Cortex V2 (sophisticated decay modeling), and the current system-speckit (production MCP server). Each system addresses the fundamental challenge of maintaining relevant context across AI sessions while managing token budgets.

**Key findings:**

1. **Hybrid search is universal** - All systems combine semantic and keyword search, with dotmd adding graph traversal as a third dimension.
2. **Decay modeling varies dramatically** - From simple FSRS in system-speckit to drift's multi-factor confidence decay with 5 configurable half-lives.
3. **Token efficiency is critical** - Drift's 7-layer architecture and speckit's ANCHOR format both achieve ~90%+ token savings through hierarchical compression.
4. **Crash recovery matters** - seu-claude's immediate SQLite saves and drift's session deduplication prevent context loss.
5. **Learning systems are emerging** - Drift's correction capture and principle extraction represent the next evolution beyond static retrieval.

The analysis reveals opportunities to enhance system-speckit with multi-factor decay, causal memory graphs, and automated learning extraction while maintaining its production-proven MCP architecture.

---

## 1. Architecture Comparison Matrix

| Dimension | dotmd | seu-claude | drift (Cortex V2) | system-speckit |
|-----------|-------|------------|-------------------|----------------|
| **Primary Focus** | Hybrid search | Task orchestration | Memory decay/learning | Context preservation |
| **Search Engines** | 3 (semantic, keyword, graph) | 2 (semantic, BM25) | Semantic + graph | 2 (vector, FTS5) |
| **Fusion Method** | Reciprocal Rank Fusion | 70/30 weighted | Multi-factor scoring | RRF hybrid |
| **Storage Backend** | LanceDB + LadybugDB | SQLite | Custom | SQLite + sqlite-vec |
| **Decay Model** | None explicit | None | Multi-factor (5 components) | FSRS v4 (5-state) |
| **Memory Types** | 4 node types | Task-centric | 9 types | 6 tiers |
| **Token Optimization** | Query expansion | Tool caching | 7-layer compression | ANCHOR format |
| **Crash Recovery** | Protocol abstractions | Immediate saves | Session deduplication | Checkpoint system |
| **Learning System** | Graph relationships | TDD automation | Correction capture | Prediction error gating |
| **MCP Tools** | N/A | N/A | 7-layer architecture | 17 tools, 4 categories |
| **Codebase Size** | Medium | Medium | Large (71 skills) | Large (32+ modules) |

---

## 2. System Architectures Overview

### 2.1 dotmd Architecture

dotmd implements a **three-engine hybrid search** system that combines semantic understanding, keyword matching, and graph traversal.

**Core Components:**

```
Query Input
    |
    v
+-------------------+     +-------------------+     +-------------------+
| Semantic Engine   |     | Keyword Engine    |     | Graph Engine      |
| (LanceDB vectors) |     | (BM25 scoring)    |     | (LadybugDB)       |
+-------------------+     +-------------------+     +-------------------+
    |                         |                         |
    v                         v                         v
+---------------------------------------------------------------+
|                 Reciprocal Rank Fusion (RRF)                  |
|            score = sum(weight / (k + rank))                   |
+---------------------------------------------------------------+
    |
    v
+-------------------+
| Cross-Encoder     |
| Reranking         |
| (length penalty)  |
+-------------------+
```

**Key Design Decisions:**

- **Protocol-based storage** via `VectorStoreProtocol` and `GraphStoreProtocol` enables backend swapping
- **Knowledge graph** with typed nodes (File, Section, Entity, Tag) and edges (LINKS_TO, CO_OCCURS, MENTIONS)
- **Query expansion** with fuzzy acronym matching handles terminology variations
- **RRF fusion** with configurable k parameter (typically 60) prevents any single engine from dominating

**Strengths:** Graph traversal enables relationship-based retrieval that pure vector search misses. Cross-encoder reranking improves precision for ambiguous queries.

### 2.2 seu-claude Architecture

seu-claude implements a **hexagonal (Ports & Adapters) architecture** with a focus on task orchestration and crash resilience.

**Core Components:**

```
+------------------+
|   Domain Core    |  <-- Pure business logic
+------------------+
        |
+------------------+     +------------------+
|   Port: Task     |     |   Port: AST      |
|   Repository     |     |   Parser         |
+------------------+     +------------------+
        |                        |
+------------------+     +------------------+
| Adapter: SQLite  |     | Adapter: Tree-   |
| Persistence      |     | sitter Strategy  |
+------------------+     +------------------+
```

**Key Design Decisions:**

- **Persistent Task DAG** in SQLite with immediate saves after every state change
- **Tool output caching** stores expensive operation results in JSON blobs per task
- **Tree-sitter AST parsing** with strategy pattern for multi-language support (JavaScript, TypeScript, Python, etc.)
- **Hybrid search** at 70% semantic / 30% BM25 ratio
- **TDD automation** enforces RED-GREEN-REFACTOR cycle
- **Quality gates** (ESLint + TypeScript) must pass before task completion
- **CONTINUE_SESSION.md** documents enable session resumption

**Strengths:** Crash recovery via immediate SQLite saves means zero context loss on interruption. Dependency inversion enables testing and backend swapping.

### 2.3 drift Cortex V2 Architecture

drift Cortex V2 implements the most sophisticated **memory decay and learning system** analyzed.

**Multi-Factor Confidence Decay:**

```javascript
// Composite confidence calculation
confidence = base_confidence
  * temporal_decay(half_life)      // exponential decay
  * citation_validity_decay        // source freshness
  * usage_boost                    // log10(accessCount + 1) * 0.2
  * importance_anchor              // critical=2.0, high=1.5, normal=1.0
  * pattern_alignment_boost        // 1.3x for linked patterns
```

**9 Memory Types:**
1. `core` - Fundamental system knowledge
2. `tribal` - Team/project conventions
3. `procedural` - How-to instructions
4. `semantic` - Factual knowledge
5. `episodic` - Session-specific events
6. `pattern_rationale` - Why patterns exist
7. `constraint_override` - Exception rules
8. `decision_context` - Decision reasoning
9. `code_smell` - Anti-pattern warnings

**Causal Memory Graph (8 relationship types):**
- `caused`, `enabled`, `prevented`, `contradicts`
- `supersedes`, `supports`, `derived_from`, `triggered_by`

**7-Layer MCP Tool Architecture:**
Each layer has token budgets, enabling progressive detail disclosure from "IDs Only" to "Full Detail" (4 compression levels).

**Learning System:**
- Captures corrections when AI makes errors
- Extracts principles from successful interactions
- Updates memory graph with new relationships

**Strengths:** Multi-factor decay models real-world memory behavior. Causal graph enables reasoning about why memories matter. Learning system improves over time.

### 2.4 Current system-speckit Architecture

system-speckit is a **production MCP server** with 17 tools across 4 categories.

**Tool Categories:**
1. **Search** - `memory_search`, `memory_match_triggers`
2. **CRUD** - `memory_save`, `memory_update`, `memory_delete`
3. **Checkpoints** - `checkpoint_create`, `checkpoint_restore`
4. **Session Learning** - Prediction error gating, deduplication

**FSRS v4 Decay (5-State Model):**
```
HOT (24h) --> WARM (7d) --> COLD (30d) --> DORMANT (90d) --> ARCHIVED
```

**6-Tier Importance System:**
1. `constitutional` - Core system rules (never decay)
2. `critical` - Breaking changes, blockers
3. `important` - Key decisions, patterns
4. `normal` - Standard memories
5. `low` - Minor notes
6. `deprecated` - Scheduled for removal

**Composite Scoring (6 factors):**
```javascript
score = weighted_sum(
  similarity,      // Vector distance
  importance,      // Tier boost
  retrievability,  // FSRS state
  recency,         // Time decay
  popularity,      // Access count
  tier_boost       // Constitutional override
)
```

**ANCHOR Format:**
```markdown
<!-- ANCHOR_EXAMPLE: decisions -->
Key decisions made in this session...
<!-- /ANCHOR -->
```
Enables section-level retrieval with ~93% token savings.

**Strengths:** Production-proven with 32+ lib modules. ANCHOR format dramatically reduces token usage. Checkpoint system enables reliable session resumption.

---

## 3. Core Pattern Analysis

### 3.1 Memory Decay Mechanisms

| System | Decay Model | Complexity | Configurability |
|--------|-------------|------------|-----------------|
| dotmd | None explicit | Low | N/A |
| seu-claude | None | Low | N/A |
| drift | Multi-factor (5 components) | High | Per-memory-type half-lives |
| speckit | FSRS v4 (5-state) | Medium | State transition thresholds |

**Drift's Multi-Factor Approach (recommended for adoption):**

The drift system models memory decay as a product of independent factors:

1. **Temporal decay** - Exponential with configurable half-life per memory type
2. **Citation validity** - Sources become stale over time
3. **Usage boost** - Frequently accessed memories decay slower
4. **Importance anchor** - Critical memories resist decay
5. **Pattern alignment** - Memories linked to active patterns get boosted

This is more sophisticated than system-speckit's FSRS model, which treats decay as a single-dimension state machine.

### 3.2 Hybrid Search Strategies

All four systems implement hybrid search, but with different architectures:

| System | Semantic | Keyword | Graph | Fusion |
|--------|----------|---------|-------|--------|
| dotmd | LanceDB vectors | BM25 | LadybugDB | RRF |
| seu-claude | Embeddings | BM25 | None | 70/30 weighted |
| drift | Embeddings | None explicit | Causal graph | Multi-factor |
| speckit | sqlite-vec | FTS5 | None | RRF |

**Key Insight:** dotmd's three-engine approach with graph traversal finds relationships that pure vector+keyword search misses. system-speckit could benefit from adding a relationship layer.

### 3.3 Storage Abstractions

**Protocol Pattern (dotmd):**
```python
class VectorStoreProtocol(Protocol):
    def add(self, documents: List[Document]) -> None: ...
    def search(self, query: str, k: int) -> List[SearchResult]: ...
```

**Hexagonal Pattern (seu-claude):**
```
Domain Core <-- Port Interface <-- Adapter Implementation
```

**Direct SQLite (speckit, seu-claude):**
Both use SQLite directly, but seu-claude wraps it in adapters while speckit uses it more directly through lib modules.

**Recommendation:** Adopt protocol abstractions to enable backend swapping without changing search logic.

### 3.4 Integration Patterns

**MCP Tool Architecture (speckit, drift):**
- speckit: 17 tools, 4 categories
- drift: 7-layer architecture with token budgets

**Session Continuation:**
- seu-claude: CONTINUE_SESSION.md documents
- speckit: Checkpoint system with restore
- drift: Session deduplication

**Learning Integration:**
- drift: Correction capture, principle extraction
- speckit: Prediction error gating (deduplication)

---

## 4. Design Pattern Comparison

### 4.1 Protocol/Interface Patterns

| Pattern | Used By | Benefit |
|---------|---------|---------|
| Protocol/ABC | dotmd | Type-safe backend swapping |
| Ports & Adapters | seu-claude | Testability, dependency inversion |
| Direct modules | speckit | Simplicity, performance |
| Strategy pattern | seu-claude (AST) | Multi-language support |

**Recommendation:** speckit's direct module approach is simpler but harder to test. Consider adopting interface protocols for the search layer.

### 4.2 Caching and Performance

**Tool Output Caching (seu-claude):**
```javascript
// Per-task JSON blob stores expensive operation results
task.cache = {
  "file_read:/path/to/file": { content: "...", timestamp: ... },
  "search:query": { results: [...], timestamp: ... }
}
```
Prevents duplicate expensive operations within a task.

**Hierarchical Compression (drift):**
4 levels from "IDs Only" to "Full Detail" with token budgets per layer.

**ANCHOR Format (speckit):**
Section-level retrieval achieves ~93% token savings by loading only relevant anchors.

### 4.3 Error Recovery and Crash Resistance

**Immediate Saves (seu-claude):**
Every state change triggers SQLite write. Zero data loss on crash.

**Checkpoint System (speckit):**
Explicit checkpoint creation with restore capability.

**Session Deduplication (drift):**
Prevents duplicate processing when sessions restart.

**Recommendation:** Adopt seu-claude's immediate-save pattern for critical state changes.

### 4.4 Token Efficiency Strategies

| Strategy | System | Token Savings |
|----------|--------|---------------|
| ANCHOR format | speckit | ~93% |
| 7-layer compression | drift | Variable by layer |
| Query expansion | dotmd | N/A (increases precision) |
| Hierarchical loading | drift | 4 levels |

**Recommendation:** Combine ANCHOR format with drift's hierarchical compression for progressive disclosure.

---

## 5. Unique Innovations

### From dotmd:
- **Three-engine hybrid search** - Graph traversal as a third dimension
- **Fuzzy acronym matching** - Query expansion for terminology variations
- **Cross-encoder reranking** - Precision improvement for ambiguous queries

### From seu-claude:
- **Hexagonal architecture** - Clean separation of concerns
- **Tree-sitter strategy pattern** - Extensible multi-language AST parsing
- **TDD automation** - Enforced RED-GREEN-REFACTOR cycle
- **Quality gates** - ESLint + TypeScript must pass before completion

### From drift (Cortex V2):
- **Multi-factor confidence decay** - 5 independent decay components
- **Causal memory graph** - 8 relationship types for reasoning
- **Learning system** - Correction capture and principle extraction
- **71 curated implementation skills** - Domain expertise library
- **9 memory types** - Fine-grained categorization

### From system-speckit:
- **ANCHOR format** - Section-level retrieval with ~93% token savings
- **6-tier importance** - Constitutional memories never decay
- **Prediction error gating** - Prevents duplicate memories
- **17 MCP tools** - Production-ready interface

---

## 6. Technical Dependencies

| System | Core Dependencies | Database | Embeddings |
|--------|-------------------|----------|------------|
| dotmd | Python, LanceDB, LadybugDB | LanceDB + LadybugDB | Provider-agnostic |
| seu-claude | Node.js, tree-sitter | SQLite | Model-specific |
| drift | Node.js | Custom | Model-specific |
| speckit | Node.js | SQLite + sqlite-vec | OpenAI/configurable |

**Common Requirements:**
- Vector embedding generation (OpenAI, local models, etc.)
- SQLite for persistence (3 of 4 systems)
- Node.js runtime (3 of 4 systems)

---

## 7. Limitations and Constraints

### dotmd Limitations:
- No explicit decay model (all memories equal over time)
- Graph database adds operational complexity
- Cross-encoder reranking has latency cost

### seu-claude Limitations:
- Task-centric model may not fit all workflows
- 70/30 search ratio is fixed, not adaptive
- No explicit memory categorization

### drift Cortex V2 Limitations:
- High complexity (71 skills, 9 memory types)
- Custom storage may limit integrations
- Learning system requires training data

### system-speckit Limitations:
- No causal relationship graph
- Single-dimension decay (FSRS states)
- No automated learning extraction
- No graph traversal in search

---

## 8. Key Learnings

### Immediate Adoption Candidates for system-speckit:

1. **Multi-factor decay** (from drift)
   - Add usage boost: `log10(accessCount + 1) * 0.2`
   - Add importance anchor: critical=2.0, high=1.5, normal=1.0
   - Make half-lives configurable per memory type

2. **Immediate saves** (from seu-claude)
   - SQLite write on every critical state change
   - Prevents context loss on crash

3. **Protocol abstractions** (from dotmd)
   - `SearchProtocol`, `StorageProtocol` interfaces
   - Enable backend swapping without logic changes

4. **Relationship layer** (from drift)
   - Add causal edges: `caused`, `supersedes`, `supports`
   - Enable graph-aware retrieval

### Medium-Term Enhancements:

5. **Learning system** (from drift)
   - Capture corrections when AI is corrected
   - Extract principles from successful patterns
   - Update memory graph with new relationships

6. **Graph search engine** (from dotmd)
   - Add LadybugDB or similar for relationship traversal
   - Three-way hybrid: vector + FTS5 + graph

7. **Quality gates** (from seu-claude)
   - Validation must pass before completion claims
   - Automated TDD cycle integration

### Architecture Principles Confirmed:

- **Hybrid search is essential** - All production systems combine multiple search strategies
- **Token efficiency is critical** - 90%+ savings possible with proper compression
- **Crash recovery matters** - Immediate saves prevent context loss
- **Decay modeling is nuanced** - Multi-factor models beat single-dimension state machines
- **Learning is the frontier** - Systems that learn from corrections will outperform static retrieval

---

## References

**Source Files Analyzed:**

- dotmd: Hybrid search implementation, RRF fusion, protocol abstractions
- seu-claude: Hexagonal architecture, Task DAG, tree-sitter strategies
- drift: Cortex V2 decay model, causal graph, learning system
- system-speckit: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/system-spec-kit/`
  - MCP server: `mcp_server/` (17 tools, 32+ lib modules)
  - Scripts: `scripts/` (48 JS scripts)
  - FSRS implementation: `mcp_server/lib/cognitive/attention-decay.js`
  - Composite scoring: `mcp_server/lib/scoring/composite-scoring.js`
  - ANCHOR format: `mcp_server/lib/parsing/memory-parser.js`

**Research Conducted:** February 2026
