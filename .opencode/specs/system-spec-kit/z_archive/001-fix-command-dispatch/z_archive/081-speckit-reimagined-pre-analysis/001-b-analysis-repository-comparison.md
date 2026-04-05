> **STATUS: SUPERSEDED** — All recommendations from this pre-analysis have been implemented.
> See spec `089-speckit-reimagined-refinement` for the current audit and remediation plan.
> This document is retained for historical reference only.

---

# Technical Analysis: Repository Comparison for system-speckit Enhancement

> **Executive Summary:** Analysis of three AI-focused repositories (dotmd, seu-claude, drift) to identify architectural patterns, memory systems, and integration mechanisms that could enhance system-speckit's capabilities.

---

## 1. Overview of Analyzed Systems

### 1.1 Repository Summary

| Repository | Primary Purpose | Language | Key Innovation |
|------------|-----------------|----------|----------------|
| **dotmd** | Markdown knowledgebase search | Python 3.12 | Hybrid search (semantic + BM25 + graph) with RRF fusion |
| **seu-claude** | Autonomous developer framework | TypeScript | Hexagonal architecture with task DAG and tool output caching |
| **drift** | Codebase pattern detection | TypeScript + Rust | Cortex V2 memory with 9 types, causal graphs, and consolidation |
| **system-speckit** (current) | Semantic memory for AI assistants | JavaScript | FSRS decay, 5-state model, prediction error gating |

### 1.2 Architectural Paradigms

**dotmd** follows a **clean layered architecture** with protocol-based abstractions:
```
CLI / MCP / REST API
        ↓
  DotMDService (Facade)
        ↓
  Ingestion | Search | Extraction
        ↓
  Storage Layer (Protocols)
```
[SOURCE: https://github.com/inventivepotter/dotmd]

**seu-claude** implements **Hexagonal Architecture** (Ports & Adapters):
```
MCP Protocol Layer
        ↓
   Domain Core (TaskManager, RecursiveScout, Gatekeeper, HypothesisEngine)
        ↓
   Adapters (SQLiteTaskStore, TreeSitterAdapter, ProcessSandbox)
```
[SOURCE: https://github.com/jardhel/seu-claude]

**drift** uses a **hybrid TypeScript/Rust architecture** with 7-layer MCP:
```
Rust Core (drift-core, drift-napi)
        ↓
TypeScript Packages (ai, cli, core, cortex, detectors, lsp, mcp, vscode)
```
[SOURCE: https://github.com/dadbodgeoff/drift]

---

## 2. Memory and Context Systems

### 2.1 Memory Type Comparison

| System | Memory Types | Decay Model | Persistence |
|--------|--------------|-------------|-------------|
| **dotmd** | Chunks only | None (static) | LanceDB vectors + LadybugDB graph + SQLite metadata |
| **seu-claude** | Tasks + Tool outputs | None (persistent) | SQLite with hierarchical DAG |
| **drift** | 9 types (core→episodic) | Half-life decay per type | SQLite + sqlite-vss vectors |
| **system-speckit** | 6 tiers (constitutional→deprecated) | FSRS power-law decay | SQLite + sqlite-vec vectors |

### 2.2 Drift's 9 Memory Types

Drift introduces a sophisticated categorization that maps memory longevity to knowledge type:

| Type | Half-Life | Purpose |
|------|-----------|---------|
| `core` | ∞ (never) | Project identity, mission-critical rules |
| `tribal` | 365 days | Institutional wisdom ("We tried X, it broke") |
| `procedural` | 180 days | Implementation guides, how-to knowledge |
| `semantic` | 90 days | Consolidated understanding, facts |
| `episodic` | 7 days | Raw interaction records |
| `pattern_rationale` | 180 days | Why patterns exist |
| `constraint_override` | 90 days | Approved exceptions to rules |
| `decision_context` | 180 days | ADR background information |
| `code_smell` | 90 days | Known anti-patterns |

[SOURCE: drift/wiki/Cortex-V2-Overview.md]

**Comparison with system-speckit:** The current 6-tier importance system (`constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated`) focuses on **importance** rather than **knowledge type**. Drift's model could inform content-type-specific decay rates.

### 2.3 Decay Algorithms

**FSRS (system-speckit):**
```
R(t, S) = (1 + 0.235 × t/S)^(-0.5)
where: t = elapsed days, S = stability (days)
```
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.js]

**Half-life decay (drift):**
```
confidence × e^(-t × ln(2) / half_life)
```
[SOURCE: drift/wiki/Cortex-V2-Overview.md]

**Key Difference:** FSRS is research-validated against 100M+ Anki flashcard reviews, while drift's model is inspired by biological memory. system-speckit's choice is more scientifically grounded.

### 2.4 State Classification

**system-speckit's 5-State Model:**
| State | Retrievability | Content Returned |
|-------|----------------|------------------|
| HOT | ≥ 0.80 | Full content |
| WARM | 0.25-0.80 | Summary only |
| COLD | 0.05-0.25 | None |
| DORMANT | 0.02-0.05 | None |
| ARCHIVED | < 0.02 or 90+ days | None |

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.js]

**Drift's Compression Levels:**
| Level | Tokens | Content |
|-------|--------|---------|
| 0 | ~10 | IDs only |
| 1 | ~50 | One-liner summary |
| 2 | ~200 | Summary + examples |
| 3 | ~500+ | Full detail |

[SOURCE: drift/wiki/Cortex-Token-Efficiency.md]

**Observation:** Drift's compression is user-selectable, while system-speckit's is retrievability-driven. Both approaches have merit; combining them could offer both automatic and manual control.

---

## 3. Search and Retrieval

### 3.1 Search Architecture Comparison

| System | Vector Search | Keyword Search | Fusion Method |
|--------|---------------|----------------|---------------|
| **dotmd** | LanceDB (bge-small) | BM25 (rank-bm25) | RRF (k=60) + cross-encoder reranking |
| **seu-claude** | LanceDB (bge/nomic) | BM25 | 70% vector + 30% BM25 or RRF |
| **drift** | sqlite-vss | Not specified | Intent-based weighting |
| **system-speckit** | sqlite-vec | FTS5 | RRF (k=60) |

### 3.2 dotmd's Hybrid Search Pipeline

```
Query → Expand Acronyms → [Semantic, BM25, Graph] → RRF Fusion → Rerank → Results
```

**Key Innovations:**
1. **Acronym Expansion:** Automatically builds acronym dictionary during indexing
2. **Graph-Seeded Discovery:** Uses semantic/BM25 hits as seeds for 2-hop graph traversal
3. **Length Penalty in Reranking:** Downranks short, keyword-dense but content-poor chunks

```python
# Length penalty from dotmd reranker
if len(text) < min_length:
    penalty = 0.8 + 0.2 * (len(text) / min_length)
    scores[i] *= penalty
```
[SOURCE: dotmd/backend/src/dotmd/search/reranker.py]

### 3.3 Reciprocal Rank Fusion (RRF)

All three external systems use RRF for result fusion:

```
RRF_score = Σ (weight_i / (k + rank_i))
where k = 60 (standard constant)
```

**Drift's Convergence Bonus:** 10% boost for results found by both vector and keyword search.

**system-speckit's Implementation:** Already uses RRF in `lib/search/rrf-fusion.js` with O(1) Map lookups (HIGH-005 fix).

### 3.4 Intent-Aware Retrieval (drift)

Drift adjusts memory ranking weights based on declared task intent:

| Intent | Priority Memories |
|--------|-------------------|
| `add_feature` | procedural +50%, pattern_rationale +30% |
| `fix_bug` | code_smell +50%, tribal +30% |
| `refactor` | pattern_rationale +50%, decision_context +50% |
| `security_audit` | tribal +100%, code_smell +80% |

[SOURCE: drift/wiki/Cortex-V2-Overview.md]

**[Assumes: system-speckit could benefit from similar intent-based weight adjustments]**

---

## 4. Graph and Relationship Patterns

### 4.1 dotmd's Knowledge Graph

**Schema:**
```
Nodes: File, Section, Entity, Tag
Edges: FILE_SECTION, SECTION_ENTITY, ENTITY_ENTITY (co-occurrence), etc.
```

**Graph Search Strategy:**
1. Seed with semantic/BM25 top hits
2. Walk 2 hops via entity relationships
3. Aggregate scores, exclude seeds to avoid double-counting
4. Boost graph weight (1.5x) in RRF for unique discoveries

[SOURCE: dotmd/backend/src/dotmd/search/graph_search.py]

### 4.2 Drift's Causal Memory Graphs

**Relationship Types:**
| Type | Meaning |
|------|---------|
| `caused` | A led to B's creation |
| `enabled` | A made B possible |
| `prevented` | A blocked B |
| `supersedes` | A replaces B |
| `supports` | A provides evidence for B |
| `derived_from` | A is extracted from B |

**Example Chain:**
```
Security Audit (Jan 2024) → caused → bcrypt Adoption → derived_from → Password Hash Pattern
```

**Narrative Generation:** Drift can generate human-readable explanations:
> "The login endpoint uses bcrypt for password hashing. This pattern was derived from the team's decision to adopt bcrypt, which was caused by the security audit conducted in January 2024."

[SOURCE: drift/wiki/Cortex-Causal-Graphs.md]

**[Assumes: system-speckit's memories are currently isolated; adding causal links would enable "why" queries and decision traceability]**

---

## 5. Consolidation and Maintenance

### 5.1 Drift's Sleep-Inspired Consolidation

Five-phase process inspired by biological memory:

1. **Replay Phase:** Select eligible episodic memories
2. **Abstraction Phase:** Extract recurring patterns (facts appearing 2+ times)
3. **Integration Phase:** Merge with existing semantic storage
4. **Pruning Phase:** Remove redundant episodes
5. **Strengthening Phase:** Amplify frequently-accessed memories

```typescript
// Abstraction: extract facts from episode groups
const facts = this.collectFacts(group);
return facts
  .filter(f => f.occurrences >= 2)
  .map(f => ({
    topic: group.focus,
    knowledge: f.content,
    confidence: Math.max(...f.confidences),
    supportingEpisodes: f.episodeIds,
  }));
```
[SOURCE: drift/wiki/Cortex-V2-Overview.md]

### 5.2 seu-claude's Crash Recovery

```typescript
// Mark interrupted tasks as failed on startup
async resetRunningTasks(): Promise<number> {
  const running = await this.getRunningTasks();
  for (const task of running) {
    await this.updateStatus(task.id, 'failed', { failReason: 'Process interrupted' });
  }
  return running.length;
}
```
[SOURCE: seu-claude/src/core/usecases/TaskManager.ts]

**[Assumes: system-speckit could benefit from similar recovery patterns for interrupted operations]**

---

## 6. MCP Integration Patterns

### 6.1 Tool Architecture Comparison

| System | Tool Count | Organization |
|--------|------------|--------------|
| **dotmd** | 3 | Flat (search, index, status) |
| **seu-claude** | 6 | Grouped (analyze, validate, execute, manage, run_tdd, find) |
| **drift** | 45+ | 7-layer hierarchy |
| **system-speckit** | 17 | Flat (search, CRUD, checkpoints, learning, system) |

### 6.2 Drift's 7-Layer MCP Architecture

| Layer | Purpose | Token Budget |
|-------|---------|--------------|
| 1. Orchestration | Intent → curated context | 1000-4000 |
| 2. Discovery | Quick health checks | 200-1000 |
| 3. Surgical | Ultra-focused lookups | 200-800 |
| 4. Exploration | Paginated browsing | 500-2000 |
| 5. Detail | Deep dives | 500-3000 |
| 6. Analysis | Complex computation | 1000-4000 |
| 7. Generation | AI-assisted output | 500-3000 |

**Key Insight:** The orchestration layer (`drift_context`) delivers a complete context package in one call, reducing the number of tool invocations:

```typescript
interface ContextPackage {
  relevantPatterns: PatternMatch[];
  suggestedFiles: FileRisk[];
  guidance: { keyInsights, commonMistakes, decisionPoints };
  warnings: Warning[];
  constraints: Constraint[];
  deeperDive: ToolSuggestion[];  // "If you need more, call these"
}
```
[SOURCE: drift/wiki/MCP-Architecture.md]

### 6.3 Standardized Response Structure (drift)

Every response includes:
```typescript
{
  summary: string;        // AI can stop here if sufficient
  data: T;               // Actual payload
  pagination?: {...};    // For large results
  hints?: {
    nextActions: string[];
    relatedTools: string[];
    warnings: string[];
  };
  meta: {
    requestId: string;
    durationMs: number;
    cached: boolean;
    tokenEstimate: number;
  }
}
```

**[Assumes: system-speckit's varied response structures could be standardized for consistency]**

---

## 7. Performance Patterns

### 7.1 Lazy Loading

**dotmd Pattern:**
```python
class SemanticSearchEngine:
    def __init__(self, ...):
        self._model: SentenceTransformer | None = None

    def _load_model(self) -> SentenceTransformer:
        if self._model is None:
            logger.info("Loading SentenceTransformer model...")
            self._model = SentenceTransformer(self._model_name)
        return self._model
```
[SOURCE: dotmd/backend/src/dotmd/search/semantic.py]

**system-speckit:** Already implements lazy loading for embeddings with 60s warmup timeout.

### 7.2 Incremental Indexing (seu-claude)

```typescript
// Track files by content hash + mtime for change detection
interface FileIndexEntry {
  path: string;
  contentHash: string;
  mtime: number;
  indexed: boolean;
}

// Only re-index changed files
const changed = files.filter(f =>
  !index[f.path] ||
  index[f.path].contentHash !== computeHash(f.content)
);
```
[SOURCE: seu-claude/src/indexer/file-index.ts]

### 7.3 Session Deduplication (drift)

```typescript
interface SessionContext {
  loadedMemories: Set<string>;
  tokensSent: number;
}

// Skip already-sent memories
if (this.loadedMemories.has(memoryId)) {
  return null;  // Don't re-send
}
```

**Token Savings:**
| Scenario | Without Dedup | With Dedup | Reduction |
|----------|--------------|------------|-----------|
| Follow-up query | 8000 tokens | 500 tokens | 16x |

[SOURCE: drift/wiki/Cortex-Token-Efficiency.md]

---

## 8. Key Technical Insights

### 8.1 Protocol-Based Abstractions (dotmd)

```python
@runtime_checkable
class VectorStoreProtocol(Protocol):
    def add_chunks(self, chunks: list[Chunk], embeddings: list[list[float]]) -> None: ...
    def search(self, query_embedding: list[float], top_k: int) -> list[tuple[str, float]]: ...
    def delete_all(self) -> None: ...
```

**Benefit:** Enables swappable storage backends without changing consumers.

### 8.2 Tool Output Caching (seu-claude)

```typescript
interface Task {
  context: Record<string, any>;  // Stores tool outputs
}

// Cache expensive operation result
await taskManager.cacheToolOutput(taskId, 'analyze_dependency', graphResult);

// Retrieve before re-running
const cached = await taskManager.getToolOutput(taskId, 'analyze_dependency');
if (cached) return cached;  // Skip expensive operation
```

**Benefit:** Prevents "stochastic drift" by remembering what was already done.

### 8.3 Heading Hierarchy in Chunks (dotmd)

```python
# Prepend heading path to chunk text
section_text = " > ".join(current_hierarchy) + "\n\n" + body
```

**Benefit:** Queries like "deployment principles" match chunks under "Deployment > Principles" heading.

---

## 9. Summary of Findings

| Area | dotmd | seu-claude | drift | system-speckit |
|------|-------|------------|-------|----------------|
| **Search** | Hybrid + graph + reranking | Hybrid + RRF | Intent-weighted | Hybrid + RRF |
| **Memory Types** | Single (chunks) | Tasks + outputs | 9 types | 6 tiers |
| **Decay** | None | None | Half-life per type | FSRS |
| **Relationships** | Graph (entity co-occurrence) | DAG (task hierarchy) | Causal graphs | None |
| **Consolidation** | None | None | 5-phase sleep model | None |
| **MCP Tools** | 3 | 6 | 45+ (7 layers) | 17 |

**Strongest Patterns for Adoption:**
1. Intent-aware retrieval weighting (drift)
2. Causal memory relationships (drift)
3. Graph-seeded discovery (dotmd)
4. Tool output caching (seu-claude)
5. Session deduplication (drift)
6. Cross-encoder reranking (dotmd)
7. Consolidation engine (drift)

---

**Document Metadata:**
- **Created:** 2026-02-01
- **Sources:** dotmd, seu-claude, drift repositories; system-speckit codebase
- **Word Count:** ~2,800
