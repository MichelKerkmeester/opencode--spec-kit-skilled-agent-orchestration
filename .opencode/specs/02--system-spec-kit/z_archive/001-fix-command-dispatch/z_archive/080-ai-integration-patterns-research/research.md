---
title: "AI Integration Patterns Research [080-ai-integration-patterns-research/research]"
description: "Extract patterns for AI assistant integration, prompt management, and context optimization from three open-source repositories to inform improvements to the system-spec-kit MCP."
trigger_phrases:
  - "integration"
  - "patterns"
  - "research"
  - "080"
importance_tier: "normal"
contextType: "research"
---
# AI Integration Patterns Research

## Metadata

| Field | Value |
|-------|-------|
| Research ID | AI-PATTERNS-001 |
| Status | COMPLETE |
| Date | 2026-02-01 |
| Repositories Analyzed | dotmd, seu-claude, drift |
| Researcher | @research agent (Opus 4.5) |

---

## 1. Investigation Report

### 1.1 Research Objective
Extract patterns for AI assistant integration, prompt management, and context optimization from three open-source repositories to inform improvements to the system-spec-kit MCP.

### 1.2 Repositories Analyzed

| Repository | Description | Key Patterns |
|------------|-------------|--------------|
| [dotmd](https://github.com/inventivepotter/dotmd) | Markdown knowledgebase with hybrid search | RRF fusion, lazy singleton, query expansion |
| [seu-claude](https://github.com/jardhel/seu-claude) | Hexagonal codebase RAG MCP server | Task DAG, AST parsing, TDD automation |
| [drift](https://github.com/dadbodgeoff/drift) | Codebase pattern detection with Cortex memory | Intent-aware retrieval, decay algorithms, compression levels |

### 1.3 Key Findings Summary

1. **Context Window Optimization**: All three use hierarchical compression and token budgeting
2. **Prompt Engineering**: Structured tool definitions with Zod/JSON schemas
3. **Tool Integration**: MCP protocol with lazy initialization and singleton patterns
4. **Response Processing**: Structured responses with scoring and ranking
5. **Session Management**: SQLite-based persistence with decay algorithms

---

## 2. Executive Overview

### 2.1 Architecture Comparison

```
dotmd                    seu-claude                drift
  |                         |                        |
  v                         v                        v
Hybrid Search           Hexagonal/Ports          Memory Types
(Semantic+BM25+Graph)   (Domain+Adapters)        (9 types, decay)
  |                         |                        |
  v                         v                        v
RRF Fusion              Task DAG                 Intent Weighting
  |                         |                        |
  v                         v                        v
Cross-Encoder           Process Sandbox          Token Budget
Reranking               Execution                Compression
```

### 2.2 Maturity Assessment

| Capability | dotmd | seu-claude | drift | spec-kit MCP |
|------------|-------|------------|-------|--------------|
| Context Compression | Medium | Low | **High** | Medium |
| Decay Algorithms | None | None | **High** | Medium (FSRS) |
| Tool Definitions | Basic | **High** | **High** | Medium |
| Session Persistence | Basic | **High** | **High** | Medium |
| Intent-Aware Retrieval | None | None | **High** | None |

---

## 3. Core Architecture Patterns

### 3.1 Pattern: Lazy Singleton Service

**Source:** dotmd/mcp_server.py
**Grade:** A (verified code)

```python
# dotmd pattern: Lazy singleton prevents repeated ML model loading
_service: DotMDService | None = None

def _get_service() -> DotMDService:
    global _service
    if _service is None:
        _service = DotMDService(Settings())
        _service.warmup()  # Load ML models once
    return _service
```

**Benefits:**
- ML models load once at first request
- Zero startup cost if tools unused
- Memory efficient across requests

**Recommendation for spec-kit:** Already implemented via module-level state. Verify warmup pattern for vector index.

---

### 3.2 Pattern: Hexagonal Architecture (Ports & Adapters)

**Source:** seu-claude architecture
**Grade:** A (documented pattern)

```
┌─────────────────────────────────────────────┐
│                MCP Protocol                  │
│        (Tool definitions, handlers)          │
├─────────────────────────────────────────────┤
│              Domain Layer                    │
│   TaskManager | RecursiveScout | Gatekeeper  │
├─────────────────────────────────────────────┤
│             Adapters Layer                   │
│     SQLite | Tree-sitter | ProcessSandbox    │
└─────────────────────────────────────────────┘
```

**Benefits:**
- Clean separation of concerns
- Testable domain logic
- Swappable adapters

**Recommendation for spec-kit:** Consider adopting for lib/ reorganization. Current flat structure could benefit from explicit ports/adapters.

---

### 3.3 Pattern: Nine Memory Types with Differentiated Decay

**Source:** drift Cortex v2
**Grade:** A (documented + code verified)

| Memory Type | Half-Life | Purpose |
|-------------|-----------|---------|
| Core | Infinite | Project identity |
| Tribal | 365 days | Institutional knowledge |
| Procedural | 180 days | How-to processes |
| Semantic | 90 days | Consolidated summaries |
| Episodic | 7 days | Raw interactions |
| Pattern Rationale | 180 days | Why patterns exist |
| Constraint Override | 90 days | Approved exceptions |
| Decision Context | 180 days | Architectural decisions |
| Code Smell | 90 days | Anti-patterns |

**Comparison with spec-kit:**
- spec-kit uses importance tiers (constitutional, critical, important, normal, temporary, deprecated)
- drift uses purpose-based types
- Both valid approaches; drift is more semantic

**Recommendation:** Consider mapping spec-kit tiers to drift-style purpose types for clearer user mental model.

---

## 4. Context Window Optimization

### 4.1 Pattern: Hierarchical Compression Levels

**Source:** drift/packages/cortex/src/retrieval/compression.ts
**Grade:** A (verified code)

```typescript
// drift pattern: Three compression levels
export interface CompressionResult {
  summary: string;        // ~20 tokens
  expanded: string;       // ~100 tokens
  full: string;          // Complete memory (variable)
  summaryTokens: number;
  expandedTokens: number;
  fullTokens: number;
}

class HierarchicalCompressor {
  compress(memory: Memory): CompressionResult {
    return {
      summary: this.generateSummary(memory),      // One-liner
      expanded: this.generateExpanded(memory),   // Summary + key fields
      full: JSON.stringify(memory),              // Complete
    };
  }
}
```

**Usage Pattern:**
- Level 0: IDs only (~50 tokens) - for listing
- Level 1: Summaries (~200 tokens) - for context
- Level 2: Summaries + examples (~500 tokens) - for detailed work
- Level 3: Complete (~1000+ tokens) - for full context

**Recommendation for spec-kit:** Implement similar compression levels for `memory_search` results. Currently returns full content always.

---

### 4.2 Pattern: Token Budget Management

**Source:** drift/packages/cortex/src/retrieval/budget.ts + engine.ts
**Grade:** A (verified code)

```typescript
// drift pattern: Fit memories to token budget
export class TokenBudgetManager {
  fitToBudget(
    ranked: RankedMemory[],
    maxTokens: number
  ): CompressedMemory[] {
    const result: CompressedMemory[] = [];
    let tokensUsed = 0;

    for (const item of ranked) {
      // Try to fit at highest compression level first
      for (const level of ['full', 'expanded', 'summary']) {
        const tokens = this.getTokensAt(item, level);
        if (tokensUsed + tokens <= maxTokens) {
          result.push({ ...item, level, tokens });
          tokensUsed += tokens;
          break;
        }
      }
    }
    return result;
  }
}
```

**Key Insight:** High-priority memories get full content, lower-priority get compressed versions. This maximizes information density within context window limits.

**Recommendation for spec-kit:** Add `maxTokens` parameter to `memory_search` and implement budget-aware result compression.

---

### 4.3 Pattern: Markdown Chunking with Overlap

**Source:** dotmd/backend/src/dotmd/ingestion/chunker.py
**Grade:** A (verified code)

```python
# dotmd pattern: Sentence-boundary chunking with overlap
def _split_with_overlap(text: str, max_tokens: int, overlap_tokens: int) -> list[str]:
    sentences = split_sentences(text)
    pieces: list[str] = []
    current_sentences: list[str] = []
    current_tokens: int = 0

    for sentence in sentences:
        sent_tokens = estimate_tokens(sentence)

        if current_sentences and current_tokens + sent_tokens > max_tokens:
            pieces.append(" ".join(current_sentences))

            # Build overlap from tail of current_sentences
            overlap_sents: list[str] = []
            overlap_tok = 0
            for s in reversed(current_sentences):
                s_tok = estimate_tokens(s)
                if overlap_tok + s_tok > overlap_tokens and overlap_sents:
                    break
                overlap_sents.insert(0, s)
                overlap_tok += s_tok

            current_sentences = overlap_sents
            current_tokens = overlap_tok

        current_sentences.append(sentence)
        current_tokens += sent_tokens

    return pieces
```

**Key Insight:** Overlap ensures context continuity between chunks. Sentence-boundary splitting preserves semantic units.

**Recommendation for spec-kit:** Current memory parser could benefit from similar overlap handling for long memories.

---

## 5. Prompt Engineering Patterns

### 5.1 Pattern: Zod Schema Tool Definitions

**Source:** seu-claude/src/mcp/tools.ts
**Grade:** A (verified code)

```typescript
// seu-claude pattern: Zod schemas for runtime validation
import { z } from 'zod';

export const AnalyzeDependencyInput = z.object({
  entryPoints: z.array(z.string()).describe('File paths to analyze'),
  maxDepth: z.number().optional().describe('Maximum dependency depth'),
  includeNodeModules: z.boolean().optional().describe('Include node_modules'),
});

// Tool definition with JSON Schema output
export const TOOL_DEFINITIONS = [
  {
    name: 'analyze_dependency',
    description: 'Analyze code dependencies and build import graph. ' +
                 'Returns dependency tree, circular dependencies, and symbol locations.',
    inputSchema: {
      type: 'object',
      properties: {
        entryPoints: {
          type: 'array',
          items: { type: 'string' },
          description: 'File paths to start analysis from',
        },
        // ...
      },
      required: ['entryPoints'],
    },
  },
];
```

**Benefits:**
- Runtime validation before execution
- Auto-generated JSON Schema for MCP
- Self-documenting APIs

**Recommendation for spec-kit:** Current tool definitions are inline. Consider extracting to schema files for reusability.

---

### 5.2 Pattern: Intent-Aware Tool Descriptions

**Source:** drift Cortex retrieval
**Grade:** A (documented)

```typescript
// drift pattern: Intent types for retrieval context
export type Intent =
  | 'add_feature'    // Prioritizes pattern rationales, procedural knowledge
  | 'fix_bug'        // Emphasizes code smells, tribal knowledge, error patterns
  | 'refactor'       // Focuses on structural patterns, coupling
  | 'security_audit' // Highlights security patterns, constraint overrides
  | 'understand_code'// Centers on decision context, pattern rationales
  | 'add_test';      // Retrieves test patterns, coverage requirements
```

**Key Insight:** Different development tasks require different memory prioritization. Intent-aware retrieval surfaces the most relevant context.

**Recommendation for spec-kit:** Add optional `intent` parameter to `memory_search` for context-aware prioritization.

---

### 5.3 Pattern: Causal Narrative Retrieval

**Source:** drift Cortex wiki
**Grade:** B (documented, not code verified)

```
drift_why tool: Retrieves causal narrative for a topic

Memory interconnect types:
- derived_from: One memory created based on another
- supersedes: Memory replaces outdated knowledge
- supports: Memory provides evidence
- contradicts: Identifies conflicts
- related_to: General associations
```

**Key Insight:** Memories form a knowledge graph with causal relationships, enabling "why" queries that explain reasoning chains.

**Recommendation for spec-kit:** Consider adding relationship tracking between memories for explainable context chains.

---

## 6. Tool Integration Patterns

### 6.1 Pattern: FastMCP Decorator-Based Tools

**Source:** dotmd/mcp_server.py
**Grade:** A (verified code)

```python
# dotmd pattern: Decorator-based tool registration
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("dotmd", instructions="Search and index a markdown knowledgebase.")

@mcp.tool()
def search(
    query: str,
    top_k: int = 10,
    mode: str = "hybrid",
    rerank: bool = True,
) -> list[dict]:
    """Search the indexed markdown knowledgebase.

    Args:
        query: Natural-language search query.
        top_k: Maximum number of results to return.
        mode: Search strategy - "semantic", "bm25", "graph", or "hybrid".
        rerank: Whether to rerank results with a cross-encoder.
    """
    service = _get_service()
    results = service.search(query, top_k=top_k, mode=mode, rerank=rerank)
    return [
        {
            "chunk_id": r.chunk_id,
            "file_path": str(r.file_path),
            "heading": r.heading_path,
            "snippet": r.snippet,
            "score": r.fused_score,
            "matched_engines": r.matched_engines,
        }
        for r in results
    ]
```

**Benefits:**
- Clean, Pythonic API
- Automatic type inference from signature
- Docstring becomes tool description

**Recommendation for spec-kit:** Current implementation uses manual schema. FastMCP approach is cleaner if migrating to Python.

---

### 6.2 Pattern: Switch-Based Tool Handler

**Source:** seu-claude/src/mcp/handler.ts
**Grade:** A (verified code)

```typescript
// seu-claude pattern: Centralized handler with switch dispatch
export class ToolHandler {
  private projectRoot: string;
  private dataDir: string;
  private taskManager: TaskManager | null = null;

  async handleTool(name: ToolName, args: Record<string, unknown>): Promise<unknown> {
    switch (name) {
      case 'analyze_dependency':
        return this.analyzeDependency(args);
      case 'validate_code':
        return this.validateCode(args);
      case 'execute_sandbox':
        return this.executeSandbox(args);
      case 'manage_task':
        return this.manageTask(args);
      case 'run_tdd':
        return this.runTDD(args);
      case 'find_symbol':
        return this.findSymbol(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  // Individual method implementations...
}
```

**Benefits:**
- Type-safe tool routing
- Centralized error handling
- Easy to add new tools

**Comparison with spec-kit:** spec-kit uses similar switch pattern in server.js. Validated as good practice.

---

### 6.3 Pattern: Task DAG for Persistent State

**Source:** seu-claude/src/core/usecases/TaskManager.ts
**Grade:** A (verified code)

```typescript
// seu-claude pattern: Hierarchical task DAG with SQLite persistence
export class TaskManager {
  constructor(private store: ITaskStore) {}

  async createRootGoal(label: string): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      label,
      status: 'pending',
      context: { toolOutputs: {}, metadata: {} },
    };
    await this.store.save(task);
    return task;
  }

  async spawnSubtask(parentId: string, label: string): Promise<Task> {
    const parent = await this.store.get(parentId);
    if (!parent) throw new Error(`Parent task not found: ${parentId}`);

    const task: Task = {
      id: crypto.randomUUID(),
      parentId,
      label,
      status: 'pending',
      context: { toolOutputs: {}, metadata: {} },
    };
    await this.store.save(task);
    return task;
  }

  // Tool output caching to prevent duplicate work
  async cacheToolOutput(taskId: string, toolName: string, output: unknown): Promise<void> {
    const task = await this.store.get(taskId);
    task.context.toolOutputs[toolName] = { output, cachedAt: Date.now() };
    await this.store.save(task);
  }
}
```

**Key Features:**
- Parent-child task relationships
- Tool output caching per task
- State recovery after restart

**Recommendation for spec-kit:** Consider task-based context for multi-step workflows. Current session-based approach loses hierarchy.

---

## 7. Response Processing Patterns

### 7.1 Pattern: Reciprocal Rank Fusion (RRF)

**Source:** dotmd/backend/src/dotmd/search/fusion.py
**Grade:** A (verified code)

```python
# dotmd pattern: RRF for multi-engine result fusion
def fuse_results(
    ranked_lists: dict[str, list[tuple[str, float]]],
    k: int = 60,
    engine_weights: dict[str, float] | None = None,
) -> list[tuple[str, float]]:
    """Merge multiple ranked lists using Reciprocal Rank Fusion.

    RRF Formula: score(d) = sum(1 / (k + rank(d))) across all lists
    """
    fused_scores: dict[str, float] = {}

    for engine, ranked_list in ranked_lists.items():
        weight = engine_weights.get(engine, 1.0) if engine_weights else 1.0

        for rank, (chunk_id, _) in enumerate(ranked_list, start=1):
            if chunk_id not in fused_scores:
                fused_scores[chunk_id] = 0.0
            # RRF contribution: weight / (k + rank)
            fused_scores[chunk_id] += weight / (k + rank)

    return sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
```

**Key Insight:** RRF is simple, effective, and doesn't require normalized scores. Works well with heterogeneous ranking sources.

**Comparison with spec-kit:** spec-kit uses weighted composite scoring. Consider adding RRF as alternative fusion method.

---

### 7.2 Pattern: Query-Aware Snippet Extraction

**Source:** dotmd/backend/src/dotmd/search/fusion.py
**Grade:** A (verified code)

```python
# dotmd pattern: Find best snippet window based on query term overlap
def _extract_best_snippet(text: str, query: str, length: int = 300) -> str:
    if len(text) <= length:
        return text

    query_tokens = set(re.findall(r"\w+", query.lower()))

    # Score each window position
    words = text.split()
    best_score = -1
    best_start = 0

    for i, start in enumerate(word_starts):
        end = start + length
        window = text[start:end].lower()
        score = sum(1 for t in query_tokens if t in window)

        if score > best_score:
            best_score = score
            best_start = start

    snippet_text = text[best_start:best_start + length]

    # Add ellipsis indicators
    prefix = "..." if best_start > 0 else ""
    suffix = "..." if best_start + length < len(text) else ""

    return prefix + snippet_text + suffix
```

**Key Insight:** Shows the most relevant portion of a long document based on query term overlap.

**Recommendation for spec-kit:** Implement similar snippet extraction for long memory content in search results.

---

### 7.3 Pattern: Multi-Factor Decay Calculation

**Source:** drift/packages/cortex/src/decay/calculator.ts
**Grade:** A (verified code)

```typescript
// drift pattern: Multi-factor confidence decay
export class DecayCalculator {
  calculate(memory: Memory): DecayFactors {
    // 1. Base temporal decay (exponential)
    const daysSinceAccess = this.daysSince(memory.lastAccessed);
    const halfLife = HALF_LIVES[memory.type] || 90;
    const temporalDecay = halfLife === Infinity
      ? 1.0
      : Math.exp(-daysSinceAccess / halfLife);

    // 2. Citation validity decay
    const citationDecay = this.calculateCitationDecay(memory);

    // 3. Usage boost (frequently used memories resist decay)
    const usageBoost = calculateUsageBoost(memory.accessCount);

    // 4. Importance anchor (critical memories decay slower)
    const importanceAnchor = calculateImportanceAnchor(memory.importance);

    // 5. Pattern alignment boost
    const patternBoost = calculatePatternBoost(memory.linkedPatterns);

    // Final confidence
    const finalConfidence = Math.min(1.0,
      memory.confidence *
      temporalDecay *
      citationDecay *
      usageBoost *
      importanceAnchor *
      patternBoost
    );

    return { temporalDecay, citationDecay, usageBoost, importanceAnchor, patternBoost, finalConfidence };
  }
}
```

**Comparison with spec-kit:**
- spec-kit uses FSRS power-law decay (`R = (1 + FACTOR * t/S)^DECAY`)
- drift uses multi-factor approach with usage/importance boosters
- Both are valid; drift's approach is more comprehensive

**Recommendation for spec-kit:** Add usage boost and importance anchor to existing FSRS-based decay for better resistance to decay for frequently-accessed memories.

---

## 8. Session Management Patterns

### 8.1 Pattern: Session-Based Deduplication

**Source:** drift Cortex wiki
**Grade:** B (documented)

```
Pattern: Track sent memories per session
- Prevents redundant context transmission
- Reduces token usage by ~30%
- Enables efficient incremental updates
```

**Key Insight:** Once a memory is sent in a session, it doesn't need to be resent unless it changes.

**Recommendation for spec-kit:** Add session tracking to avoid resending same context in long conversations.

---

### 8.2 Pattern: Automatic Consolidation

**Source:** drift Cortex wiki
**Grade:** B (documented)

```
Pattern: Consolidate episodic memories into semantic knowledge

Rule: 3+ related episodic memories (7-day half-life)
  -> Automatically consolidate into semantic knowledge (90-day half-life)

Benefits:
- Reduces storage
- Preserves patterns
- Self-organizing knowledge
```

**Recommendation for spec-kit:** Consider similar consolidation for repeated memory patterns.

---

### 8.3 Pattern: SQLite State with Recovery

**Source:** seu-claude TaskManager + drift Cortex
**Grade:** A (verified code patterns)

Both repositories use SQLite for state persistence with these common patterns:
- In-memory + disk hybrid (fast reads, durable writes)
- Prepared statements for performance
- Transactional updates for consistency
- Recovery from process restart

**Comparison with spec-kit:** spec-kit already uses SQLite (better-sqlite3). Pattern alignment is good.

---

## 9. Recommendations for system-spec-kit MCP

### 9.1 High Priority (Recommended)

| Recommendation | Source | Effort | Impact |
|----------------|--------|--------|--------|
| Add hierarchical compression to memory_search results | drift | Medium | High |
| Implement token budget management for retrieval | drift | Medium | High |
| Add intent parameter for context-aware prioritization | drift | Low | Medium |
| Extract tool schemas to separate files | seu-claude | Low | Medium |

### 9.2 Medium Priority (Consider)

| Recommendation | Source | Effort | Impact |
|----------------|--------|--------|--------|
| Add usage boost to decay calculation | drift | Low | Medium |
| Implement query-aware snippet extraction | dotmd | Medium | Medium |
| Add session deduplication tracking | drift | Medium | Medium |
| Consider RRF as alternative fusion method | dotmd | Medium | Low |

### 9.3 Future Exploration

| Recommendation | Source | Effort | Impact |
|----------------|--------|--------|--------|
| Causal relationship tracking between memories | drift | High | High |
| Automatic memory consolidation | drift | High | Medium |
| Purpose-based memory types (vs tier-based) | drift | High | Medium |
| Hexagonal architecture refactor | seu-claude | High | Medium |

---

## 10. Anti-Patterns to Avoid

### 10.1 Per-Request Index Loading

**Source:** dotmd AGENTS.md warning
**Grade:** A (explicit guidance)

> "Never reload indexes per-request. BM25, vector, and graph indexes must be loaded once at startup"

**Impact:** Performance degradation from repeated model/index loading.

**spec-kit Status:** Already following this pattern with lazy singleton initialization.

---

### 10.2 Static AGENTS.md Instead of Dynamic Memory

**Source:** drift Cortex wiki
**Grade:** B (documented)

> "Static AGENTS.md gets outdated immediately while Cortex maintains confidence through active usage tracking"

**Recommendation:** Consider dynamic memory for frequently-changing context vs static file references.

---

### 10.3 Untyped Tool Parameters

**Source:** seu-claude pattern (counter-example)
**Grade:** A (verified good practice)

Untyped parameters lead to:
- Runtime errors from malformed inputs
- Poor error messages
- No auto-completion for users

**spec-kit Status:** Current tools have explicit parameter validation. Maintain this practice.

---

## 11. Code Examples Summary

### 11.1 Token Budget Implementation (Recommended)

```javascript
// Proposed for spec-kit: Token-aware memory retrieval
function fitToBudget(rankedMemories, maxTokens) {
  const result = [];
  let tokensUsed = 0;

  for (const memory of rankedMemories) {
    // Try compression levels: full -> expanded -> summary
    for (const level of ['full', 'expanded', 'summary']) {
      const compressed = compressMemory(memory, level);
      if (tokensUsed + compressed.tokens <= maxTokens) {
        result.push({ ...memory, content: compressed.text, level });
        tokensUsed += compressed.tokens;
        break;
      }
    }
  }

  return { memories: result, tokensUsed, remaining: maxTokens - tokensUsed };
}
```

### 11.2 Intent-Aware Weight Adjustment (Recommended)

```javascript
// Proposed for spec-kit: Intent-based weight modifiers
const INTENT_WEIGHTS = {
  add_feature: {
    procedural: 1.5, pattern_rationale: 1.3, tribal: 1.0
  },
  fix_bug: {
    code_smell: 1.5, tribal: 1.3, episodic: 1.2
  },
  refactor: {
    pattern_rationale: 1.5, decision_context: 1.3, semantic: 1.2
  },
  understand_code: {
    decision_context: 1.5, pattern_rationale: 1.3, semantic: 1.2
  },
};

function applyIntentWeighting(score, memoryType, intent) {
  const weights = INTENT_WEIGHTS[intent] || {};
  return score * (weights[memoryType] || 1.0);
}
```

---

## 12. Appendix: Evidence Citations

### A.1 Primary Sources (Grade A)

| Source | Location | Pattern |
|--------|----------|---------|
| dotmd MCP server | `backend/src/dotmd/mcp_server.py` | Lazy singleton |
| dotmd chunker | `backend/src/dotmd/ingestion/chunker.py` | Overlap chunking |
| dotmd fusion | `backend/src/dotmd/search/fusion.py` | RRF, snippets |
| seu-claude tools | `src/mcp/tools.ts` | Zod schemas |
| seu-claude handler | `src/mcp/handler.ts` | Switch dispatch |
| seu-claude TaskManager | `src/core/usecases/TaskManager.ts` | DAG persistence |
| drift compression | `packages/cortex/src/retrieval/compression.ts` | Hierarchical levels |
| drift decay | `packages/cortex/src/decay/calculator.ts` | Multi-factor decay |
| drift retrieval | `packages/cortex/src/retrieval/engine.ts` | Intent-aware |

### A.2 Secondary Sources (Grade B)

| Source | Location | Pattern |
|--------|----------|---------|
| drift Cortex wiki | `wiki/Cortex-V2-Overview.md` | Memory types, consolidation |
| dotmd README | `README.md` | Architecture overview |
| seu-claude README | `README.md` | Hexagonal architecture |

### A.3 Comparison with spec-kit

| File | Purpose | Comparable External |
|------|---------|---------------------|
| `attention-decay.js` | FSRS decay | drift decay/calculator.ts |
| `composite-scoring.js` | Weighted ranking | drift retrieval/scoring.ts |
| `working-memory.js` | Session state | seu-claude TaskManager |
| `vector-index.js` | Semantic search | dotmd search/semantic.py |

---

## 13. Changelog

| Date | Change |
|------|--------|
| 2026-02-01 | Initial research completed |
