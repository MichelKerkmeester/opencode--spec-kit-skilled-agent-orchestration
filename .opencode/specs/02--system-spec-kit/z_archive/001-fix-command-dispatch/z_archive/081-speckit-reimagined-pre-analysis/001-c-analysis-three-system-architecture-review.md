> **STATUS: SUPERSEDED** — All recommendations from this pre-analysis have been implemented.
> See spec `089-speckit-reimagined-refinement` for the current audit and remediation plan.
> This document is retained for historical reference only.

---

# Technical Analysis: Three AI Memory Systems for system-speckit Enhancement

> **Research Date:** 2026-02-01
> **Systems Analyzed:** dotmd, seu-claude, drift
> **Purpose:** Extract actionable patterns for system-speckit improvement

---

## Executive Summary

This analysis examines three open-source AI context management systems to identify patterns applicable to system-speckit. Each system solves the fundamental problem of AI context preservation differently:

| System | Primary Innovation | Architecture | Scale |
|--------|-------------------|--------------|-------|
| **dotmd** | Triple-hybrid retrieval (semantic + BM25 + graph) | Minimal Python/FastMCP | 3 search engines |
| **seu-claude** | Crash-resilient Task DAG with state recovery | Hexagonal TypeScript | 9 MCP tools |
| **drift** | Self-correcting Cortex memory with confidence decay | Monorepo with Rust core | 50+ MCP tools |

**Key Finding:** system-speckit already implements state-of-the-art FSRS-based memory decay (validated on 100M+ reviews), but can benefit from patterns in graph relationships, crash recovery, and learning-from-corrections.

---

## 1. dotmd Architecture Analysis

### 1.1 System Overview

dotmd is a Python-based markdown knowledgebase search tool combining three retrieval strategies with Reciprocal Rank Fusion (RRF). It runs entirely locally with no API dependencies.

**Repository:** https://github.com/inventivepotter/dotmd

### 1.2 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         ENTRY POINTS                                  │
│   cli.py (Click)  │  mcp_server.py (FastMCP)  │  api/server.py       │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      DotMDService (Facade)                            │
├──────────────────────────────────────────────────────────────────────┤
│  IndexingPipeline  │  Search Engines  │  Query Pipeline               │
│  - FileDiscovery   │  - Semantic      │  - QueryExpander             │
│  - Chunking        │  - BM25          │  - RRF Fusion                │
│  - Embedding       │  - Graph         │  - CrossEncoder Reranker     │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         STORAGE LAYER                                 │
│  LanceDB (vectors)  │  LadybugDB (graph)  │  SQLite (metadata)       │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.3 Core Data Flow

**Indexing Pipeline:**
1. `discover_files()` → Scan for .md files, extract metadata
2. `chunk_file()` → Sentence-aware splitting with 50-token overlap
3. `encode_batch()` → BAAI/bge-small-en-v1.5 embeddings (384-dim)
4. `Extraction Phase` → Structural + NER (GLiNER) + KeyTerms
5. `graph_store.add_*()` → File/Section/Entity nodes + relationships

**Search Pipeline:**
1. `QueryExpander.expand()` → Fuzzy acronym matching
2. Parallel engine execution (semantic, BM25, graph)
3. `fuse_results()` → RRF with k=60, graph_weight=1.5
4. `Reranker.rerank()` → CrossEncoder with length penalty

### 1.4 Key Design Patterns

| Pattern | Implementation | Value |
|---------|----------------|-------|
| **Lazy Singleton** | `_service: DotMDService | None` | Model loads once on first request |
| **Protocol Abstractions** | `VectorStoreProtocol`, `GraphStoreProtocol` | Runtime-checkable interfaces |
| **RRF Fusion** | `score = Σ(weight_i / (k + rank_i))` | Score-agnostic multi-engine merging |
| **Facade Pattern** | `DotMDService` | Single API hiding all internals |

### 1.5 Unique Innovation: Triple Hybrid Search

```python
# RRF Fusion Core (search/fusion.py:58-78)
def fuse_results(ranked_lists, k=60, engine_weights=None):
    weights = engine_weights or {}
    rrf_scores: dict[str, float] = {}

    for engine, results in ranked_lists.items():
        w = weights.get(engine, 1.0)
        for rank_0, (chunk_id, _score) in enumerate(results):
            rank = rank_0 + 1  # 1-based
            rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0.0) + w / (k + rank)

    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
```

**Why This Matters:** RRF eliminates score normalization problems when combining different search engines. The graph engine (weighted 1.5x) surfaces entity-mediated discoveries not found by keyword or semantic search alone.

### 1.6 Strengths & Limitations

**Strengths:**
- Zero ongoing cost (local models)
- Entity-mediated discovery via graph traversal
- Heading hierarchy preserved in chunks
- Clean protocol-based architecture

**Limitations:**
- Single database connection constraint
- No incremental updates (full re-index required)
- Markdown only (no other formats)

---

## 2. seu-claude Architecture Analysis

### 2.1 System Overview

seu-claude implements a Hexagonal (Ports & Adapters) Neuro-Symbolic Architecture designed to solve "Stochastic Drift" - the tendency for LLMs to lose context across multi-step autonomous tasks.

**Repository:** https://github.com/jardhel/seu-claude

### 2.2 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                      MCP PROTOCOL LAYER                               │
│   SeuClaudeServer  │  ToolHandler  │  Schema Validation (Zod)        │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       DOMAIN CORE (Pure Logic)                        │
├──────────────────────────────────────────────────────────────────────┤
│  TaskManager       │  RecursiveScout   │  Gatekeeper                 │
│  - Task DAG        │  - AST Parsing    │  - ESLint                   │
│  - Tool Cache      │  - Dep Graphs     │  - TypeScript               │
│  - State Recovery  │  - Symbol Track   │  - Validators               │
├──────────────────────────────────────────────────────────────────────┤
│  HypothesisEngine  │  PORTS (Interfaces)                             │
│  - RED/GREEN/TDD   │  ITaskStore, ISandbox, IGatekeeper              │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        ADAPTERS LAYER                                 │
│  SQLiteStore  │  TreeSitterAdapter  │  ProcessSandbox  │  ESLint     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.3 Core Innovation: Persistent Task DAG

The Task DAG survives process crashes via SQLite persistence:

```typescript
// TaskManager with crash recovery
class TaskManager {
  recoverState(): Promise<void> {
    // Rebuild in-memory DAG from SQLite
    const tasks = this.db.prepare('SELECT * FROM tasks').all();
    // Reconstruct parent-child relationships
  }

  resetRunningTasks(): void {
    // Mark interrupted tasks as failed
    this.db.prepare(`
      UPDATE tasks SET status = 'failed'
      WHERE status = 'running'
    `).run();
  }

  cacheToolOutput(taskId: string, toolName: string, output: any): void {
    // Prevent re-running expensive operations
  }
}
```

**Crash Recovery Flow:**
1. Process crashes mid-task
2. On restart: `recoverState()` rebuilds DAG from SQLite
3. `resetRunningTasks()` marks interrupted tasks as failed
4. Claude resumes from last known good state with cached outputs

### 2.4 Key Design Patterns

| Pattern | Implementation | Value |
|---------|----------------|-------|
| **Hexagonal Architecture** | Domain ←→ Ports ←→ Adapters | Test domain without external deps |
| **Dependency Inversion** | `TaskManager(store: ITaskStore)` | Swappable backends |
| **Strategy Pattern** | `ILanguageParser` with TS/Python/JS | Multi-language AST |
| **Repository Pattern** | `ITaskStore.save/get/delete` | Abstract persistence |

### 2.5 9 MCP Tools

| Tool | Purpose | Domain Component |
|------|---------|------------------|
| `index_codebase` | Index with AST + embeddings | Vector Store |
| `search_codebase` | Semantic/keyword/hybrid search | Search Engine |
| `analyze_dependency` | Build dependency graphs | RecursiveScout |
| `validate_code` | ESLint + TypeScript checks | Gatekeeper |
| `execute_sandbox` | Isolated command execution | ProcessSandbox |
| `manage_task` | Task DAG CRUD operations | TaskManager |
| `run_tdd` | RED/GREEN/REFACTOR cycles | HypothesisEngine |

### 2.6 Strengths & Limitations

**Strengths:**
- Crash resilience (SQLite-backed state)
- AST-based accurate code understanding
- Tool output caching prevents redundant work
- Isolated process execution with timeouts

**Limitations:**
- No Docker sandbox (process isolation only)
- Single-threaded parsing
- Heavy dependencies (HuggingFace, LanceDB)

---

## 3. drift Architecture Analysis

### 3.1 System Overview

Drift is a codebase pattern detection system that scans codebases, identifies architectural patterns, and provides context to AI assistants via a sophisticated "Cortex" memory system with confidence decay.

**Repository:** https://github.com/dadbodgeoff/drift

### 3.2 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         ENTRY LAYERS                                  │
│   CLI (70+ cmds)  │  MCP Server (50+ tools)  │  VS Code Extension    │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        CORE PACKAGE                                   │
│  Scanner  │  Parsers (Tree-sitter)  │  Analyzers  │  Pattern Store   │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      CORTEX MEMORY SYSTEM                             │
│  Embeddings  │  Retrieval Engine  │  5-Phase Consolidation           │
│  (Local/     │  (Intent-aware     │  (REPLAY → ABSTRACT →            │
│   OpenAI/    │   Ranking)         │   INTEGRATE → PRUNE →            │
│   Ollama)    │                    │   STRENGTHEN)                    │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    NATIVE LAYER (Rust)                                │
│  drift-core (~234μs/file)  │  drift-napi (Node.js bindings)          │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.3 Core Innovation: Cortex Memory with Confidence Decay

**9 Memory Types with Decay:**
| Type | Decay | Purpose |
|------|-------|---------|
| Core | Permanent | Project identity |
| Tribal | 365 days | Institutional knowledge |
| Procedural | 180 days | How-to documentation |
| Semantic | 90 days | Consolidated knowledge |
| Episodic | 7 days | Interaction history |
| PatternRationale | 180 days | Reasoning behind patterns |
| ConstraintOverride | 90 days | Approved exceptions |
| DecisionContext | 180 days | Architecture decisions |
| CodeSmell | 90 days | Anti-patterns to avoid |

**Confidence Calculation:**
```
Confidence = (frequency * 0.3) + (feedback_ratio * 0.4) +
             (temporal_decay * 0.1) + (source_reliability * 0.2)
```

**Learning from Corrections:**
1. Analyze what went wrong via code diffs
2. Categorize into 10 correction types
3. Extract generalizable principles
4. Create new memories from insights
5. Calibrate confidence based on evidence

### 3.4 Seven-Layer MCP Tool Architecture

| Layer | Purpose | Token Budget | Example Tools |
|-------|---------|--------------|---------------|
| L1 Orchestration | Intent-aware synthesis | 2000-4000 | `drift_context` |
| L2 Discovery | Quick status checks | 200-500 | `drift_status`, `drift_capabilities` |
| L3 Surgical | Precise lookups | 200-800 | `drift_signature`, `drift_callers` |
| L4 Exploration | Paginated browsing | 500-1500 | `drift_patterns_list` |
| L5 Detail | Complete information | 1000-2000 | `drift_pattern_get` |
| L6 Analysis | Complex computation | 1500-3000 | `drift_test_topology` |
| L7 Generation | AI-assisted validation | 2000-4000 | `drift_suggest_changes` |

**Token Efficiency:** This layered approach allows AI to start with high-level context and drill down only when needed, dramatically reducing token usage.

### 3.5 Unique Tools

- **`drift_context`**: "Tell me what you want to do, I'll give you everything" - intent-aware context synthesis
- **`drift_why`**: Causal narrative explaining why something exists
- **`drift_memory_learn`**: Process corrections through learning pipeline
- **`drift_memory_predict`**: Anticipate needed memories for context

### 3.6 Strengths & Limitations

**Strengths:**
- Privacy-first (all local processing)
- Token-aware progressive disclosure
- Self-correcting memory system
- Native Rust performance (~4,200 files/sec)
- 101+ pattern detectors across 15 categories

**Limitations:**
- High complexity (11 packages)
- Setup overhead (5+ minutes for full MCP)
- Enterprise features gated (BSL license)
- Heavy memory for large codebases

---

## 4. Cross-System Pattern Analysis

### 4.1 Context Preservation Comparison

| Aspect | dotmd | seu-claude | drift | system-speckit |
|--------|-------|------------|-------|----------------|
| **Storage** | LanceDB + SQLite + Graph | SQLite | SQLite + Files | SQLite |
| **Retrieval** | RRF Fusion | Hybrid search | Intent-aware | Hybrid + RRF |
| **Decay** | None | None | 9-type decay | FSRS 5-state |
| **Prioritization** | Graph weight boost | Recency | Confidence score | 6-tier importance |
| **Token Efficiency** | Heading context | Output caching | Layer budgets | ANCHOR format |
| **Crash Recovery** | None | Full DAG | Checkpoint | Checkpoint |

### 4.2 Search Architecture Comparison

| System | Semantic | Keyword | Graph | Fusion |
|--------|----------|---------|-------|--------|
| **dotmd** | BGE embeddings | BM25 | LadybugDB | RRF (k=60) |
| **seu-claude** | HuggingFace | Basic | None | Priority-based |
| **drift** | Multi-provider | BM25 | None | Intent-weighted |
| **system-speckit** | Voyage/OpenAI/HF | FTS5 | None | RRF + convergence bonus |

### 4.3 MCP Server Pattern Comparison

| Aspect | dotmd | seu-claude | drift | system-speckit |
|--------|-------|------------|-------|----------------|
| **Tool Count** | 4 | 9 | 50+ | 17+ |
| **Init Pattern** | Lazy singleton | Lazy + warmup | Async warmup | Background scan |
| **Caching** | None | Tool output | Project-scoped | None |
| **Error Pattern** | Return messages | isError flag | Hints + suggestions | Error codes |
| **State** | Global service | Per-request | Store per project | Shared database |

---

## 5. Key Learnings Summary

### 5.1 Architecture Patterns Worth Adopting

1. **Graph-Based Relationships (dotmd)**: Entity-mediated discovery surfaces related content not found by keyword/semantic alone
2. **Crash Recovery Pattern (seu-claude)**: `recoverState()` + `resetRunningTasks()` for session resilience
3. **Layered Tool Architecture (drift)**: Token budgets per layer prevent context overflow
4. **Tool Output Caching (seu-claude)**: Prevents redundant expensive operations
5. **Learning from Corrections (drift)**: Adaptive memory strength based on feedback

### 5.2 Patterns Already Strong in system-speckit

1. **FSRS Power-Law Decay**: R(t,S) = (1 + 0.235 × t/S)^(-0.5) - most rigorous model found
2. **6-Tier Importance System**: constitutional/critical/important/normal/temporary/deprecated
3. **ANCHOR Format**: ~93% token savings via section-level retrieval
4. **RRF with Convergence Bonus**: 10% boost for results in both vector + FTS5
5. **Constitutional Memory**: Always-surface rules with TTL caching

### 5.3 Technical Dependencies Comparison

| Dependency | dotmd | seu-claude | drift |
|------------|-------|------------|-------|
| **Runtime** | Python 3.12+ | Node 20+ | Node 18+ |
| **Embeddings** | sentence-transformers | @huggingface/transformers | Multi-provider |
| **Vector Store** | LanceDB | LanceDB | SQLite |
| **AST Parser** | N/A | tree-sitter | tree-sitter |
| **MCP SDK** | FastMCP | @modelcontextprotocol/sdk | @modelcontextprotocol/sdk |

---

## 6. Evidence Quality Assessment

| Finding | Evidence Grade | Source |
|---------|----------------|--------|
| RRF Fusion algorithm | A | dotmd/search/fusion.py:58-95 |
| Task DAG crash recovery | A | seu-claude documentation + code |
| Cortex memory types | A | drift/packages/cortex |
| Layered tool architecture | A | drift/packages/mcp |
| FSRS decay comparison | A | system-speckit + external validation |

---

## Conclusion

All three systems address AI context preservation with distinct approaches:

- **dotmd** excels at search quality through triple-hybrid retrieval
- **seu-claude** excels at resilience through persistent state
- **drift** excels at adaptability through learning memory

system-speckit already has strong foundations (FSRS decay, 6-tier importance, ANCHOR format). The primary opportunities lie in adopting:
1. Graph-based relationship tracking from dotmd
2. Crash recovery patterns from seu-claude
3. Learning-from-corrections from drift

See the accompanying recommendations document for specific implementation guidance.
