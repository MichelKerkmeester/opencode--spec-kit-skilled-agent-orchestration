> **STATUS: SUPERSEDED** — All recommendations from this pre-analysis have been implemented.
> See spec `089-speckit-reimagined-refinement` for the current audit and remediation plan.
> This document is retained for historical reference only.

---

# Technical Analysis: Cross-Repository Architecture Patterns

> Comprehensive analysis of dotmd, seu-claude, and drift repositories for system-spec-kit improvement

---

## Executive Summary

This analysis examines three AI-assistant context management systems—**dotmd** (hybrid markdown search), **seu-claude** (autonomous developer framework), and **drift** (codebase intelligence platform)—to identify architectural patterns applicable to system-spec-kit enhancement. The repositories represent three distinct philosophies: multi-engine search fusion (dotmd), neuro-symbolic task grounding (seu-claude), and living memory with cognitive decay (drift). Key findings reveal opportunities for implementing Reciprocal Rank Fusion, hierarchical task DAGs, multi-factor decay algorithms, and intent-aware retrieval to significantly improve memory relevance and token efficiency.

---

## 1. Repository Overview

### 1.1 dotmd - Hybrid Markdown Search

**Repository:** github.com/inventivepotter/dotmd
**Architecture:** Python-based MCP server with three-layer storage
**Primary Innovation:** Multi-engine fusion combining vector, keyword, and graph search

**Core Components:**
- **DotMDService**: Facade wrapping vector (LanceDB), graph (LadybugDB), and metadata (SQLite) stores
- **Search Engines**: Semantic (SentenceTransformer), BM25 (rank-bm25), Graph (Cypher traversal)
- **Fusion Layer**: Reciprocal Rank Fusion with configurable engine weights
- **MCP Interface**: FastMCP with stdio transport exposing search/index/status tools

**Storage Architecture:**
```
~/.dotmd/
├── vector.lance/      # 384-dim embeddings (LanceDB)
├── graph.ldb/         # Entity relationships (LadybugDB)
└── metadata.sqlite    # Chunk metadata and stats
```

### 1.2 seu-claude - Autonomous Developer Framework

**Repository:** github.com/jardhel/seu-claude
**Architecture:** TypeScript hexagonal architecture with MCP server
**Primary Innovation:** Neuro-symbolic task grounding preventing LLM drift

**Core Components:**
- **Domain Layer**: Task entity, TaskManager usecase, ITaskStore interface
- **Adapter Layer**: SQLiteTaskStore, TreeSitterAdapter, ProcessSandbox
- **MCP Layer**: 6 tools (analyze_dependency, validate_code, execute_sandbox, manage_task, run_tdd, find_symbol)
- **Search Subsystem**: Hybrid vector+BM25 with 70/30 weighted scoring

**Key Innovation - Stochastic Drift Prevention:**
```typescript
// Task DAG survives crashes, maintains state
interface Task {
  id: string;
  parentId?: string;      // Hierarchical DAG structure
  label: string;
  status: TaskStatus;     // pending | running | completed | failed
  context: {
    toolOutputs: {};      // Cached expensive operations
    metadata: {};
  };
}
```

### 1.3 drift - Codebase Intelligence Platform

**Repository:** github.com/dadbodgeoff/drift
**Architecture:** TypeScript monorepo with Cortex memory engine
**Primary Innovation:** Living memory with cognitive decay and self-correction

**Core Components:**
- **Cortex Engine**: Multi-source retrieval with intent-aware scoring
- **Decay System**: Exponential temporal decay with type-specific half-lives
- **Session Manager**: Token budget management with deduplication
- **Learning System**: Correction extraction from rejected/modified interactions

**Memory Type Taxonomy (9 Types):**

| Type | Half-Life | Description |
|------|-----------|-------------|
| core | Infinity | Never decays - project fundamentals |
| tribal | 365 days | Institutional knowledge |
| procedural | 180 days | How-to knowledge |
| semantic | 90 days | Consolidated understanding |
| episodic | 7 days | Specific interactions |
| pattern_rationale | 180 days | Why patterns exist |
| constraint_override | 90 days | Exception rules |
| decision_context | 180 days | Decision background |
| code_smell | 90 days | Anti-pattern markers |

---

## 2. Architecture Deep Dive

### 2.1 Storage Mechanisms Comparison

| Aspect | dotmd | seu-claude | drift | system-spec-kit |
|--------|-------|------------|-------|-----------------|
| **Primary Storage** | LanceDB + LadybugDB + SQLite | SQLite only | SQLite + sqlite-vec | SQLite + sqlite-vec |
| **Vector Format** | 384-dim (LanceDB) | Not used | Configurable (sqlite-vec) | 768-3072 dim |
| **Graph Support** | LadybugDB (Cypher) | Implicit DAG | Explicit linking | None |
| **Persistence** | File-based | Transaction-based | Transaction-based | Transaction-based |

**Key Insight:** dotmd's three-layer architecture enables optimal storage for each data type, while drift and system-spec-kit share similar sqlite-vec foundations, making drift patterns directly adoptable.

### 2.2 Search & Retrieval Strategies

**dotmd - Reciprocal Rank Fusion (RRF):**
```python
def fuse_results(ranked_lists, k=60, weights=None):
    """
    RRF formula: score = sum(weight_i / (k + rank_i))

    Higher k values dampen top-result influence.
    Weights boost specific engines (e.g., graph: 1.5).
    """
    rrf_scores = {}
    for engine, results in ranked_lists.items():
        w = weights.get(engine, 1.0)
        for rank, (chunk_id, _) in enumerate(results, start=1):
            rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0) + w / (k + rank)
    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
```

**drift - Multi-Source Candidate Gathering:**
```typescript
async gatherCandidates(context: RetrievalContext): Promise<Memory[]> {
  const sources = await Promise.all([
    this.getPatternMemories(context.relevantPatterns),
    this.getConstraintMemories(context.relevantConstraints),
    this.searchByTopic(context.focus),      // Semantic search
    this.getFileMemories(context.recentFiles),
    this.getFunctionMemories(context.callGraphContext),
    this.getSecurityMemories(context.securityContext),
  ]);
  return this.deduplicateAndMerge(sources.flat());
}
```

**seu-claude - Hybrid Weighted Scoring:**
```typescript
// 70% semantic + 30% keyword
finalScore = 0.7 * semanticScore + 0.3 * normalizedBM25Score;

// Alternative: RRF for equal treatment
rrfScore = sum(1 / (k + rank));  // k defaults to 60
```

**Gap Analysis for system-spec-kit:**
- Current: Single-strategy semantic search with FTS5 fallback
- Opportunity: Implement RRF fusion combining trigger matches, semantic scores, and tier weights

### 2.3 Decay & Prioritization Algorithms

**drift - Multi-Factor Decay Calculation:**
```typescript
calculate(memory: Memory): DecayFactors {
  // Base temporal decay (exponential)
  const halfLife = HALF_LIVES[memory.type] || 90;
  const temporalDecay = halfLife === Infinity
    ? 1.0
    : Math.exp(-daysSinceAccess / halfLife);

  // Citation validity (stale references reduce confidence)
  const citationDecay = calculateCitationDecay(memory);

  // Usage boost (frequently accessed memories resist decay)
  const usageBoost = Math.min(1.5, 1.0 + memory.accessCount * 0.05);

  // Importance anchor (critical memories decay slower)
  const importanceAnchor = {
    critical: 1.5, high: 1.2, normal: 1.0, low: 0.8
  }[memory.importance];

  return memory.confidence * temporalDecay * citationDecay
         * usageBoost * importanceAnchor;
}
```

**Comparison with system-spec-kit FSRS:**
| Feature | system-spec-kit | drift | Opportunity |
|---------|-----------------|-------|-------------|
| Base Algorithm | FSRS power-law | Exponential | Both valid, FSRS more researched |
| Type-Specific | 6 tiers (boost only) | 9 types (half-life) | Add type-specific half-lives |
| Usage Tracking | None | Access count boost | Add usage-based boost |
| Citation Validity | None | Hash-based freshness | Add file reference validation |

### 2.4 Session Management Patterns

**drift - Session Context Tracking:**
```typescript
interface SessionContext {
  id: string;
  startedAt: Date;
  loadedMemories: Set<string>;    // Deduplication
  loadedPatterns: Set<string>;
  tokensSent: number;             // Budget tracking
  queriesMade: number;
}

interface SessionStats {
  memoriesLoaded: number;
  uniqueMemoriesLoaded: number;
  tokensSent: number;
  tokensSaved: number;            // From deduplication
  deduplicationEfficiency: number; // Percentage saved
  compressionDistribution: {      // By compression level
    summary: number;
    expanded: number;
    full: number;
  };
}
```

**Gap Analysis:** system-spec-kit lacks session-level deduplication tracking, potentially re-sending the same memories within a conversation.

---

## 3. Core Logic Flows

### 3.1 dotmd Indexing Pipeline

```
File Discovery → Markdown Reading → Structure Extraction
       ↓                                    ↓
   gitignore          Heading hierarchy preserved
   filtering                    ↓
                     Token-Aware Chunking (512 tokens, 50 overlap)
                                ↓
              ┌─────────────────┼─────────────────┐
              ↓                 ↓                 ↓
         Embedding          BM25 Index       Entity Extraction
         (SentenceTransformer)  (rank-bm25)      (GLiNER NER)
              ↓                 ↓                 ↓
         LanceDB            Memory           Graph Edges
         Vector Store       Index            (LadybugDB)
```

### 3.2 seu-claude Task Lifecycle

```
Root Goal Creation (TaskManager.createRootGoal)
              ↓
    Task Decomposition (RecursiveScout)
              ↓
┌─────────────┴─────────────┐
│   For each subtask:       │
│   1. Pre-flight (Gatekeeper) ─── Validation failure? ──► Fix & retry
│   2. Execution (ProcessSandbox)
│   3. Post-flight (HypothesisEngine) ─── Test failure? ──► Mark failed
│   4. Status Update (pending → completed)
└───────────────────────────┘
              ↓
    All subtasks complete? ──► Parent complete
```

### 3.3 drift Retrieval Flow

```
Query Received
      ↓
Intent Classification (add_feature, fix_bug, refactor, security_audit)
      ↓
Multi-Source Gathering (patterns, constraints, topics, files, functions, security)
      ↓
Decay Calculation (temporal × citation × usage × importance × pattern)
      ↓
Relevance Scoring (confidence × importance × recency × access × topic_match)
      ↓
Deduplication (session context tracking)
      ↓
Token Budget Fitting (compress to summary/expanded/full as needed)
      ↓
Response Assembly
```

---

## 4. Design Patterns Identified

### 4.1 Architectural Patterns

| Pattern | Repository | Description | Applicability |
|---------|------------|-------------|---------------|
| **Lazy Singleton** | dotmd | ML models load on first use, not startup | HIGH - Reduce MCP startup time |
| **Hexagonal Architecture** | seu-claude | Ports & Adapters for testability | MEDIUM - Already modular |
| **Protocol-Based DI** | dotmd | Python Protocols for swappable components | HIGH - Enable testing |
| **Strategy Pattern** | seu-claude | LanguageStrategy for multi-language AST | MEDIUM - Memory type strategies |

### 4.2 Data Patterns

| Pattern | Repository | Description | Applicability |
|---------|------------|-------------|---------------|
| **Hierarchical DAG** | seu-claude | Parent-child task relationships | HIGH - Add task tracking |
| **Type-Specific Decay** | drift | Different half-lives per memory type | HIGH - Extend tier system |
| **Multi-Factor Scoring** | drift | Combine temporal, usage, importance | HIGH - Enhance relevance |
| **Token Budgeting** | drift | Compression levels fit context window | HIGH - Already have anchors |

### 4.3 Integration Patterns

| Pattern | Repository | Description | Applicability |
|---------|------------|-------------|---------------|
| **RRF Fusion** | dotmd | Merge ranked lists from multiple engines | HIGH - Combine trigger+semantic |
| **Tool Output Caching** | seu-claude | Cache expensive operations per-task | MEDIUM - Reduce redundant work |
| **Session Deduplication** | drift | Track loaded memories per session | HIGH - Prevent re-sending |
| **Intent-Aware Retrieval** | drift | Weight adjustment by task type | MEDIUM - Context-sensitive scoring |

---

## 5. Technical Dependencies

### 5.1 External Dependencies Comparison

| Category | dotmd | seu-claude | drift |
|----------|-------|------------|-------|
| **Vector Store** | LanceDB | (none) | sqlite-vec |
| **Graph Store** | LadybugDB | (none) | (none) |
| **Embeddings** | SentenceTransformer | (not used) | OpenAI/Ollama |
| **AST Parsing** | (none) | tree-sitter | (none) |
| **NER** | GLiNER | (none) | (none) |
| **MCP SDK** | FastMCP | @modelcontextprotocol/sdk | (none) |

### 5.2 Compatibility with system-spec-kit

| drift Feature | Implementation Effort | Compatibility |
|---------------|----------------------|---------------|
| Multi-factor decay | Low | Extend existing FSRS |
| Session tracking | Medium | Add to context-server.js |
| Compression levels | Low | Leverage existing ANCHOR |
| Intent-aware retrieval | Medium | Add intent parameter to memory_search |

---

## 6. Current Limitations & Constraints

### 6.1 dotmd Limitations
- No decay mechanism (stale content accumulates indefinitely)
- Requires multiple external databases (LanceDB, LadybugDB)
- Python-only, not easily embeddable in Node.js MCP

### 6.2 seu-claude Limitations
- No semantic search (DAG only)
- Single-language focus (TypeScript/JavaScript)
- Heavy AST dependencies (tree-sitter bindings)

### 6.3 drift Limitations
- Complex configuration (half-lives, weights, thresholds)
- Requires tuning for each project
- No MCP server (would need wrapper)

### 6.4 system-spec-kit Gaps (Addressable)
| Gap | Impact | Recommended Solution |
|-----|--------|---------------------|
| No RRF fusion | Lower recall | Implement composite RRF scoring |
| No usage tracking | Stale prioritization | Add access count boost |
| No session deduplication | Token waste | Track loaded memories per session |
| No intent awareness | Generic results | Add task-type weight adjustment |
| No graph discovery | Missing connections | Add entity relationship indexing |

---

## 7. Key Learnings & Interesting Approaches

### 7.1 dotmd Insights
1. **Multi-engine fusion outperforms single-engine** - RRF combines strengths of different retrieval methods
2. **Lazy loading is critical for MCP** - Models should load on first use, not server startup
3. **Graph discovery reveals hidden connections** - Entity relationships surface related content beyond keyword/semantic

### 7.2 seu-claude Insights
1. **Symbolic grounding prevents drift** - Rigid task DAG prevents LLM from losing track
2. **Tool output caching saves significant time** - Don't repeat expensive operations within a task tree
3. **Pre-flight gates catch issues early** - Validate before executing, not after

### 7.3 drift Insights
1. **Type-specific decay reflects real memory** - Episodic memories should fade faster than procedural
2. **Self-correction is powerful** - Learning from rejected interactions improves future relevance
3. **Token budgeting is essential** - Compression levels allow fitting more context in limited windows
4. **Intent matters for retrieval** - Security audits need different memories than feature addition

---

## 8. Synthesis: Optimal Architecture

Based on analysis of all three repositories, an optimal enhancement to system-spec-kit would combine:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENHANCED MEMORY SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  RETRIEVAL PIPELINE (from dotmd)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Trigger   │  │   Semantic  │  │    Tier     │             │
│  │   Matches   │  │   Search    │  │   Weights   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         └────────────────┴────────────────┘                     │
│                          ↓                                       │
│                  RRF FUSION (k=60)                               │
│                          ↓                                       │
│  DECAY LAYER (from drift)                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  finalScore = baseScore                                     ││
│  │              × temporalDecay(halfLife[type])                ││
│  │              × usageBoost(accessCount)                      ││
│  │              × importanceAnchor(tier)                       ││
│  └─────────────────────────────────────────────────────────────┘│
│                          ↓                                       │
│  SESSION LAYER (from drift)                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  • Deduplicate against loadedMemories set                   ││
│  │  • Track tokensSent and tokensSaved                         ││
│  │  • Compress to fit budget (summary → expanded → full)       ││
│  └─────────────────────────────────────────────────────────────┘│
│                          ↓                                       │
│  RESPONSE ASSEMBLY                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Source References

| Repository | Key Files Analyzed | Primary Patterns |
|------------|-------------------|------------------|
| dotmd | mcp_server.py, fusion.py, semantic.py, graph_search.py | RRF, lazy loading, graph discovery |
| seu-claude | TaskManager.ts, Gatekeeper.ts, SQLiteTaskStore.ts | Hexagonal architecture, task DAG, pre-flight gates |
| drift | calculator.ts, engine.ts, manager.ts, half-lives.ts | Multi-factor decay, session tracking, intent-aware retrieval |

**Confidence Level:** HIGH - All patterns verified via primary source code analysis

---

*Document generated: 2026-02-01*
*Analysis methodology: Multi-agent parallel research with orchestrated synthesis*
