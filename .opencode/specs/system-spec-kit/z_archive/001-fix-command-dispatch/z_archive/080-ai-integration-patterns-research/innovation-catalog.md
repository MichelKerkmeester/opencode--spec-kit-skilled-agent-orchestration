# Innovation Catalog: Unique Approaches from dotmd, seu-claude, and Drift

**Research ID:** innovation-catalog-three-repos
**Date:** 2026-02-01
**Status:** Complete

---

## Executive Summary

This catalog identifies **truly innovative patterns** from three AI-powered development tools that go beyond standard implementations. Each innovation is evaluated for:
- Why it is valuable
- How it could adapt to system-speckit
- Implementation approach

**Key Finding:** The most valuable innovations cluster around three themes:
1. **Adaptive Learning** (Drift's confidence decay and causal learning)
2. **Multi-Signal Fusion** (dotmd's RRF, seu-claude's multi-factor ranking)
3. **Resilient State** (seu-claude's crash-resistant task DAG)

---

## Table of Contents

1. [Drift Innovations](#1-drift-innovations)
2. [dotmd Innovations](#2-dotmd-innovations)
3. [seu-claude Innovations](#3-seu-claude-innovations)
4. [Cross-Cutting Patterns](#4-cross-cutting-patterns)
5. [Adaptation Strategies](#5-adaptation-strategies)
6. [Implementation Roadmap](#6-implementation-roadmap)

---

## 1. Drift Innovations

### 1.1 Confidence Decay Algorithm (UNIQUE)

**What It Is:**
A weighted scoring system where knowledge confidence naturally degrades over time unless reinforced by usage and feedback.

```javascript
// Drift's confidence formula
confidence = (
  usageScore * 0.30 +           // Capped at 10 uses
  feedbackScore * 0.40 +         // (confirmations - rejections) / total
  ageDecay * 0.10 +              // exp(-age / 365) - exponential decay
  sourceReliability * 0.20       // Trust weight of original source
);
```

**Why It Is Innovative:**
- Most systems treat memories as static with fixed relevance
- This mimics human memory: frequently accessed = stronger, unused = fades
- Creates self-cleaning knowledge bases without manual curation

**Value Proposition:**
- Stale knowledge auto-demotes
- Frequently validated knowledge strengthens
- No manual memory pruning needed

**Adaptation for system-speckit:**

```javascript
// Enhanced memory scoring with decay
function calculateMemoryScore(memory) {
  const daysSinceCreation = (Date.now() - memory.createdAt) / (24 * 60 * 60 * 1000);
  const daysSinceAccess = (Date.now() - memory.lastAccessed) / (24 * 60 * 60 * 1000);

  // Exponential decay with half-life of 30 days
  const ageDecay = Math.exp(-daysSinceAccess * Math.log(2) / 30);

  // Access frequency boost (capped at 10 accesses)
  const accessBoost = Math.min(memory.accessCount / 10, 1);

  // Combined score
  return (
    memory.baseScore * 0.50 +
    ageDecay * 0.30 +
    accessBoost * 0.20
  );
}
```

**Implementation Effort:** 1-2 days
**Impact:** High - automatic relevance management

---

### 1.2 Causal Learning Pipeline (HIGHLY UNIQUE)

**What It Is:**
When a user corrects AI behavior, the system doesn't just store the correction - it extracts the underlying *principle* and stores that.

```
Input: "Use bcrypt instead of MD5"
       ↓
Analysis: Compares original vs corrected
       ↓
Categorization: "security"
       ↓
Principle Extraction: "Always use modern cryptographic hashing for passwords"
       ↓
Memory Creation: Tribal knowledge with severity "critical"
```

**Why It Is Innovative:**
- Standard systems store corrections literally
- This extracts generalizable principles
- Creates transferable knowledge that applies to similar situations

**Value Proposition:**
- One correction teaches many situations
- Builds organizational "tribal knowledge" automatically
- Reduces repeated mistakes across contexts

**Adaptation for system-speckit:**

```javascript
// Causal learning integration
interface LearnedPrinciple {
  id: string;
  original: string;           // What the AI did
  correction: string;         // What user wanted
  principle: string;          // Extracted generalizable rule
  category: 'security' | 'performance' | 'style' | 'pattern' | 'architecture';
  severity: 'critical' | 'important' | 'preference';
  confidence: number;
  specFolder?: string;        // If learned during specific spec work
  applications: number;       // Times this principle was applied
}

async function learnFromCorrection(original, correction, context) {
  // 1. Analyze difference
  const diff = analyzeCorrection(original, correction);

  // 2. Categorize
  const category = classifyCorrection(diff);

  // 3. Extract principle (could use LLM)
  const principle = await extractPrinciple(original, correction, context);

  // 4. Store as special memory type
  await createPrincipleMemory({
    ...principle,
    confidence: 0.6,  // Initial confidence, grows with validation
  });
}
```

**Implementation Effort:** 3-4 days (requires LLM integration for principle extraction)
**Impact:** Very High - transforms corrections into reusable knowledge

---

### 1.3 Seven-Layer Tool Architecture (INNOVATIVE)

**What It Is:**
MCP tools organized in layers by token budget and specificity:

| Layer | Token Budget | Purpose | Example Tools |
|-------|-------------|---------|---------------|
| 1 | 1000-2000 | Orchestration | drift_context, drift_package_context |
| 2 | 500-1000 | Discovery | drift_status, drift_capabilities |
| 3 | 200-500 | Surgical | drift_signature, drift_callers |
| 4 | 500-1500 | Exploration | drift_patterns_list, drift_security_summary |
| 5 | 1000-2000 | Detail | drift_pattern_get, drift_impact_analysis |
| 6 | 2000-4000 | Analysis | drift_test_topology, drift_coupling |
| 7 | Variable | Generation | drift_suggest_changes, drift_validate_change |

**Why It Is Innovative:**
- Most tool sets are flat (all tools equal)
- This creates a hierarchy for progressive disclosure
- AI can choose precision level based on context window budget

**Value Proposition:**
- Token-aware tool selection
- Progressive detail retrieval (start coarse, drill down)
- Predictable context consumption

**Adaptation for system-speckit:**

```javascript
// Tool layer metadata
const TOOL_LAYERS = {
  'memory_search': { layer: 2, avgTokens: 800, purpose: 'discovery' },
  'memory_get': { layer: 5, avgTokens: 1500, purpose: 'detail' },
  'memory_match_triggers': { layer: 1, avgTokens: 200, purpose: 'orchestration' },
};

// Tool recommendation based on context budget
function recommendTool(intent, remainingTokenBudget) {
  const eligibleTools = Object.entries(TOOL_LAYERS)
    .filter(([_, meta]) => meta.avgTokens <= remainingTokenBudget * 0.3)
    .sort((a, b) => a[1].layer - b[1].layer);

  return eligibleTools[0];  // Return lowest layer that fits
}
```

**Implementation Effort:** 0.5 day (mostly documentation/metadata)
**Impact:** Medium - better tool selection guidance

---

### 1.4 Session-Aware Deduplication (PRACTICAL INNOVATION)

**What It Is:**
Memory retrieval tracks what has been retrieved in the current session and avoids re-retrieving the same content.

**Why It Is Innovative:**
- Prevents "memory echo" where same context keeps appearing
- Respects context window real estate
- Enables progressive drilling (get new info each query)

**Value Proposition:**
- No wasted tokens on duplicate content
- Natural conversation progression
- Better use of limited context window

**Adaptation for system-speckit:**

```javascript
// Session-aware retrieval
class SessionAwareSearch {
  private retrievedIds: Set<string> = new Set();

  async search(query, options) {
    const results = await this.vectorIndex.search(query, options.limit * 2);

    // Filter out already-retrieved memories
    const newResults = results.filter(r => !this.retrievedIds.has(r.id));

    // Track newly retrieved
    newResults.slice(0, options.limit).forEach(r => this.retrievedIds.add(r.id));

    return newResults.slice(0, options.limit);
  }

  resetSession() {
    this.retrievedIds.clear();
  }
}
```

**Implementation Effort:** 0.5 day
**Impact:** Medium - cleaner context management

---

### 1.5 Compression Tiers for Memory Retrieval (UNIQUE)

**What It Is:**
Four levels of memory compression, selectable per query:

| Tier | Output | Use Case |
|------|--------|----------|
| 0 | IDs only | Existence check, counting |
| 1 | Titles + scores | List/browse |
| 2 | Titles + summaries | Understanding |
| 3 | Full content | Deep reading |

**Why It Is Innovative:**
- Most retrieval is all-or-nothing
- This enables graduated information disclosure
- AI can check existence cheaply, then retrieve fully

**Value Proposition:**
- Token-efficient exploratory queries
- Multi-pass retrieval strategies
- Budget-aware context building

**Adaptation for system-speckit:**

```javascript
// Add compression option to memory_search
interface SearchOptions {
  query: string;
  limit?: number;
  compression?: 0 | 1 | 2 | 3;  // New field
  anchors?: string[];
}

function formatResults(memories, compression) {
  switch (compression) {
    case 0: return memories.map(m => ({ id: m.id }));
    case 1: return memories.map(m => ({ id: m.id, title: m.title, score: m.score }));
    case 2: return memories.map(m => ({ id: m.id, title: m.title, summary: m.summary, score: m.score }));
    case 3: return memories;  // Full content
  }
}
```

**Implementation Effort:** 0.5 day
**Impact:** Medium-High - significant token savings for exploratory queries

---

### 1.6 Intent-Aware Retrieval (INNOVATIVE)

**What It Is:**
Search queries include explicit intent context:

```bash
drift similar --intent api_endpoint --description "POST endpoint for user registration"
```

**Why It Is Innovative:**
- Standard search uses just the query text
- This adds structured intent metadata
- Results are filtered/boosted by intent match

**Value Proposition:**
- More relevant results for structured tasks
- Separates "what" from "for what purpose"
- Enables intent-specific ranking

**Adaptation for system-speckit:**

```javascript
// Intent-aware memory search
const INTENT_TYPES = [
  'debugging',      // Looking for error context
  'implementation', // Looking for patterns to copy
  'review',         // Looking for decisions/rationale
  'planning',       // Looking for scope/constraints
  'continuation',   // Looking for session state
];

interface IntentAwareSearch {
  query: string;
  intent: typeof INTENT_TYPES[number];
  context?: string;
}

function adjustScoreByIntent(memory, intent) {
  // Boost memories that match intent
  const intentBoosts = {
    debugging: ['error', 'fix', 'bug', 'issue'],
    implementation: ['pattern', 'code', 'example', 'how'],
    review: ['decision', 'why', 'rationale', 'choice'],
    planning: ['scope', 'constraint', 'requirement', 'goal'],
    continuation: ['state', 'progress', 'next', 'session'],
  };

  const keywords = intentBoosts[intent];
  const matchCount = keywords.filter(k => memory.content.toLowerCase().includes(k)).length;
  return matchCount * 0.1;  // Boost per match
}
```

**Implementation Effort:** 1 day
**Impact:** Medium - better result relevance for specific tasks

---

## 2. dotmd Innovations

### 2.1 Reciprocal Rank Fusion (RRF) for Multi-Engine Merging (PROVEN)

**What It Is:**
A score-agnostic method to merge results from different search engines:

```python
# RRF formula
# score = sum(weight_i / (k + rank_i))
# where rank_i is 1-based position in each engine's result list

def fuse_results(ranked_lists, k=60, weights=None):
    weights = weights or {}
    rrf_scores = {}

    for engine, results in ranked_lists.items():
        w = weights.get(engine, 1.0)
        for rank_0, (chunk_id, _score) in enumerate(results):
            rank = rank_0 + 1  # 1-based
            rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0.0) + w / (k + rank)

    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
```

**Why It Is Innovative:**
- Score normalization is hard (different scales, meanings)
- RRF sidesteps this by using only rank positions
- Robust to outlier scores, no learned weights needed

**Value Proposition:**
- Combine semantic + keyword + graph without score calibration
- k=60 dampens top-ranked dominance
- Works even when adding new engines

**Adaptation for system-speckit:**

```javascript
// RRF for memory search fusion
function reciprocalRankFusion(rankedLists, k = 60, weights = {}) {
  const rrfScores = new Map();

  for (const [engine, results] of Object.entries(rankedLists)) {
    const w = weights[engine] || 1.0;
    results.forEach((result, index) => {
      const rank = index + 1;
      const currentScore = rrfScores.get(result.id) || 0;
      rrfScores.set(result.id, currentScore + w / (k + rank));
    });
  }

  return Array.from(rrfScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));
}

// Usage: Combine vector search with BM25 and trigger matching
const fused = reciprocalRankFusion({
  semantic: semanticResults,
  keyword: bm25Results,
  triggers: triggerMatchResults,
}, 60, { triggers: 1.5 });  // Boost trigger matches
```

**Implementation Effort:** 1 day
**Impact:** High - principled multi-signal fusion

---

### 2.2 Heading Hierarchy Tracking for Context (PRACTICAL)

**What It Is:**
Maintains a stack of parent headings when chunking markdown, prepending path to each chunk:

```python
# Chunk text becomes:
# "Overview > Architecture > Storage Layer\n\n[actual content]"
```

**Why It Is Innovative:**
- Standard chunking loses document structure
- This preserves hierarchical context in embeddings
- Enables better semantic understanding of where content fits

**Value Proposition:**
- Chunks carry structural context
- Better retrieval for "find the X under Y" queries
- Aids result presentation with breadcrumb paths

**Adaptation for system-speckit:**

```javascript
// Add heading path to memory chunks
function parseMarkdownWithHierarchy(content) {
  const sections = [];
  const hierarchy = ['', '', '', '', '', '', ''];  // Levels 1-6

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let lastEnd = 0;

  for (const match of content.matchAll(headingRegex)) {
    const level = match[1].length;
    const heading = match[2];
    const offset = match.index;

    // Save previous section
    if (offset > lastEnd) {
      sections.push({
        hierarchy: hierarchy.slice(1, level + 1).filter(Boolean),
        content: content.slice(lastEnd, offset),
      });
    }

    // Update hierarchy
    hierarchy[level] = heading;
    for (let i = level + 1; i <= 6; i++) hierarchy[i] = '';

    lastEnd = offset;
  }

  return sections;
}
```

**Implementation Effort:** 0.5 day
**Impact:** Medium - better chunk context

---

### 2.3 Query-Aware Snippet Extraction (PRACTICAL)

**What It Is:**
Find the window of text with maximum query term overlap for display:

```python
def extract_best_snippet(text, query, length=300):
    query_tokens = set(re.findall(r"\w+", query.lower()))

    best_score = -1
    best_start = 0

    for start in range(0, len(text) - length, 50):  # Slide by 50 chars
        window = text[start:start + length].lower()
        score = sum(1 for t in query_tokens if t in window)

        if score > best_score:
            best_score = score
            best_start = start

    snippet = text[best_start:best_start + length]
    prefix = "..." if best_start > 0 else ""
    suffix = "..." if best_start + length < len(text) else ""

    return prefix + snippet + suffix
```

**Why It Is Innovative:**
- Default snippets often miss the relevant part
- This ensures snippet contains query-relevant content
- Better user experience for search results

**Value Proposition:**
- Relevant snippets in search results
- Helps user/AI quickly assess relevance
- Works across document types

**Adaptation for system-speckit:**

```javascript
// Add to memory search result formatting
function extractBestSnippet(text, query, length = 300, step = 50) {
  if (text.length <= length) return text;

  const queryTokens = new Set(query.toLowerCase().match(/\w+/g) || []);

  let bestScore = -1;
  let bestStart = 0;

  for (let start = 0; start < text.length - length; start += step) {
    const window = text.slice(start, start + length).toLowerCase();
    const score = Array.from(queryTokens).filter(t => window.includes(t)).length;

    if (score > bestScore) {
      bestScore = score;
      bestStart = start;
    }
  }

  const snippet = text.slice(bestStart, bestStart + length);
  const prefix = bestStart > 0 ? '...' : '';
  const suffix = bestStart + length < text.length ? '...' : '';

  return prefix + snippet + suffix;
}
```

**Implementation Effort:** 0.5 day
**Impact:** Low-Medium - better UX for search results

---

### 2.4 Lazy Singleton Model Loading (PROVEN PATTERN)

**What It Is:**
ML models load on first use, not at import time, and persist as singletons:

```python
class SemanticSearchEngine:
    def __init__(self, model_name):
        self._model = None  # Not loaded yet
        self._model_name = model_name

    def _load_model(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self._model_name)
        return self._model

    def search(self, query, top_k=10):
        model = self._load_model()  # Load on first use
        embedding = model.encode(query)
        return self._vector_store.search(embedding, top_k)
```

**Why It Is Innovative:**
- Not unique, but well-implemented
- Eliminates cold-start penalty on imports
- Enables fast startup even with heavy models

**Value Proposition:**
- Fast CLI/MCP server startup
- Models loaded only when needed
- Single instance across requests

**Adaptation for system-speckit:**

Already partially implemented in system-speckit. Verify singleton pattern is used consistently.

**Implementation Effort:** 0.5 day (verification and consistency)
**Impact:** Low - likely already implemented

---

### 2.5 Protocol-Based Abstractions for Swappable Backends (ARCHITECTURAL)

**What It Is:**
Python Protocol classes define interfaces for storage backends:

```python
@runtime_checkable
class VectorStoreProtocol(Protocol):
    def add_chunks(self, chunks: list[Chunk], embeddings: list[list[float]]) -> None: ...
    def search(self, query_embedding: list[float], top_k: int = 10) -> list[tuple[str, float]]: ...
    def delete_all(self) -> None: ...
```

**Why It Is Innovative:**
- Enables swapping LanceDB for Qdrant, FAISS, etc.
- Static type checking works
- Runtime isinstance() checks work too

**Value Proposition:**
- Backend flexibility without code changes
- Better testing (mock implementations)
- Future-proof against vendor lock-in

**Adaptation for system-speckit:**

```javascript
// Define interfaces for swappable backends
interface VectorIndexInterface {
  add(chunks: MemoryChunk[], embeddings: Float32Array[]): Promise<void>;
  search(queryEmbedding: Float32Array, topK: number): Promise<SearchResult[]>;
  delete(ids: string[]): Promise<void>;
  clear(): Promise<void>;
}

// Current LanceDB implementation
class LanceDBVectorIndex implements VectorIndexInterface { ... }

// Future alternative
class SQLiteVSS implements VectorIndexInterface { ... }
```

**Implementation Effort:** 1-2 days (interface definition, refactoring)
**Impact:** Medium - architectural improvement

---

## 3. seu-claude Innovations

### 3.1 Crash-Resistant Task DAG (UNIQUE)

**What It Is:**
Persistent task graph stored in SQLite that survives process crashes:

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  parentId TEXT,
  label TEXT NOT NULL,
  status TEXT NOT NULL,  -- pending | running | completed | failed
  context TEXT NOT NULL DEFAULT '{}',  -- JSON blob with toolOutputs
  createdAt INTEGER,
  updatedAt INTEGER
);
```

**Why It Is Innovative:**
- Most agents lose state on crash
- This enables exact resume from failure point
- Tool outputs cached per-task prevent re-execution

**Value Proposition:**
- Crash-proof autonomous execution
- No lost work from interruptions
- Auditable execution history

**Adaptation for system-speckit:**

```javascript
// Add task persistence to spec folder operations
interface SpecTask {
  id: string;
  specFolder: string;
  parentId: string | null;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  context: {
    toolOutputs?: Record<string, { output: unknown; cachedAt: number }>;
    checklistItems?: string[];
    errorDetails?: string;
  };
  createdAt: number;
  updatedAt: number;
}

// Recovery on startup
async function recoverSpecTasks(db) {
  // Mark any 'running' tasks as 'failed' (process was interrupted)
  await db.run(`
    UPDATE spec_tasks
    SET status = 'failed',
        context = json_set(context, '$.errorDetails', 'Process interrupted')
    WHERE status = 'running'
  `);
}
```

**Implementation Effort:** 2-3 days
**Impact:** High - enables reliable long-running operations

---

### 3.2 Tool Output Caching Per-Task (PRACTICAL)

**What It Is:**
Expensive tool outputs are cached in the task context, keyed by tool name:

```typescript
async cacheToolOutput(taskId: string, toolName: string, output: unknown) {
  const task = await this.store.get(taskId);
  const toolOutputs = task.context.toolOutputs || {};
  toolOutputs[toolName] = { output, cachedAt: Date.now() };
  task.context = { ...task.context, toolOutputs };
  await this.store.save(task);
}

async getToolOutput(taskId: string, toolName: string) {
  const task = await this.store.get(taskId);
  return task.context.toolOutputs?.[toolName]?.output ?? null;
}
```

**Why It Is Innovative:**
- Prevents re-running expensive operations on retry
- Cached with timestamp for staleness checking
- Per-task isolation prevents cross-contamination

**Value Proposition:**
- Faster retries after failures
- Consistent results within a task
- Reduced API/compute costs

**Adaptation for system-speckit:**

```javascript
// Add to generate-context.js or checkpoint system
class ToolOutputCache {
  constructor(specFolder) {
    this.cachePath = path.join(specFolder, 'scratch', '.tool-cache.json');
  }

  async get(toolName, argsHash) {
    const cache = await this.load();
    const entry = cache[`${toolName}:${argsHash}`];
    if (!entry) return null;

    // Check staleness (1 hour default)
    if (Date.now() - entry.cachedAt > 60 * 60 * 1000) {
      return null;
    }
    return entry.output;
  }

  async set(toolName, argsHash, output) {
    const cache = await this.load();
    cache[`${toolName}:${argsHash}`] = { output, cachedAt: Date.now() };
    await this.save(cache);
  }
}
```

**Implementation Effort:** 1 day
**Impact:** Medium - efficiency improvement

---

### 3.3 AST-Based Code Chunking (STRUCTURAL)

**What It Is:**
Uses Tree-sitter to parse code into semantic units (functions, classes, methods) rather than line-based or token-based chunking:

```typescript
// Chunk types from AST
const typeMap = {
  function_declaration: 'function',
  function_definition: 'function',
  method_definition: 'method',
  class_declaration: 'class',
  interface_declaration: 'interface',
  type_alias_declaration: 'type',
  // ... 20+ mappings
};
```

**Why It Is Innovative:**
- Line-based chunking breaks mid-function
- Token-based chunking ignores structure
- AST-based respects code semantics

**Value Proposition:**
- Semantically complete chunks
- Better embeddings (full context)
- Type-aware search and filtering

**Adaptation for system-speckit:**

Less relevant for markdown memories, but useful for code examples in memories.

**Implementation Effort:** N/A (not directly applicable)
**Impact:** Low for system-speckit

---

### 3.4 TDD Workflow Engine (UNIQUE)

**What It Is:**
Automated RED -> GREEN -> REFACTOR cycle execution:

```typescript
interface TDDResult {
  phase: 'RED' | 'GREEN' | 'REFACTOR';
  testsPassed: boolean;
  testOutput: string;
  duration: number;
}

async runTDDCycle(testCode: string, implementation: string): Promise<TDDResult>
```

**Why It Is Innovative:**
- Forces verification before integration
- Structured feedback on which phase failed
- Sandbox execution for safety

**Value Proposition:**
- Every code change validated
- Clear failure diagnostics
- Prevents untested deployments

**Adaptation for system-speckit:**

Could adapt for validation workflows:

```javascript
// Spec folder validation cycle
const VALIDATION_PHASES = ['PARSE', 'VALIDATE', 'VERIFY'];

async function runValidationCycle(specFolder) {
  // PARSE: Can we parse spec.md, plan.md, checklist.md?
  // VALIDATE: Do references resolve? Are required fields present?
  // VERIFY: Do file paths exist? Are code snippets valid?
}
```

**Implementation Effort:** 2 days
**Impact:** Medium - quality assurance

---

### 3.5 Multi-Factor Ranking with Git Recency (INNOVATIVE)

**What It Is:**
Ranking incorporates multiple signals beyond similarity:

```typescript
interface RankingWeights {
  semantic: 0.5,        // Vector similarity
  keyword: 0.2,         // BM25 keyword match
  gitRecency: 0.1,      // Recent modifications boosted
  exportBoost: 0.1,     // Public/exported symbols boosted
  entryPointBoost: 0.1, // index.ts, main.ts boosted
}

// Git recency decay
// score = e^(-days * ln(2) / halfLife)
// Returns 1.0 for today, 0.5 for halfLife days ago
```

**Why It Is Innovative:**
- Pure similarity misses important context
- Recently modified = likely more relevant
- Entry points more important than internals

**Value Proposition:**
- Fresher content ranked higher
- Important files boosted
- Configurable weight tuning

**Adaptation for system-speckit:**

```javascript
// Enhanced memory ranking
interface MemoryRankingWeights {
  semantic: 0.50,
  keyword: 0.15,
  recency: 0.15,       // Based on memory creation/update time
  accessFreq: 0.10,    // How often retrieved
  anchorMatch: 0.10,   // Boost if matches requested anchors
}

function computeRecencyScore(lastModified, halfLife = 14) {
  const daysSince = (Date.now() - lastModified) / (24 * 60 * 60 * 1000);
  return Math.exp(-daysSince * Math.log(2) / halfLife);
}
```

**Implementation Effort:** 1 day
**Impact:** Medium-High - better relevance

---

### 3.6 Token Analytics for ROI Tracking (PRACTICAL)

**What It Is:**
Tracks token consumption and savings from semantic search:

```typescript
interface QueryRecord {
  timestamp: number;
  query: string;
  queryTokens: number;
  resultsTokens: number;
  naiveTokens: number;    // Cost to read whole files
  tokensSaved: number;    // naiveTokens - resultsTokens
}
```

**Why It Is Innovative:**
- Quantifies value of semantic search
- Enables optimization decisions
- ROI tracking for stakeholders

**Value Proposition:**
- Prove semantic search saves tokens
- Identify optimization opportunities
- Budget management

**Adaptation for system-speckit:**

```javascript
// Add token tracking to memory_search
class TokenAnalytics {
  private records: QueryRecord[] = [];

  trackQuery(query, results, options) {
    const queryTokens = estimateTokens(query);
    const resultsTokens = results.reduce((sum, r) => sum + estimateTokens(r.content), 0);

    // Naive cost: reading all memories matching anchors/spec folder
    const naiveTokens = this.estimateNaiveCost(options);

    this.records.push({
      timestamp: Date.now(),
      query,
      queryTokens,
      resultsTokens,
      naiveTokens,
      tokensSaved: naiveTokens - resultsTokens,
    });
  }

  getStats() {
    const total = this.records.length;
    const totalSaved = this.records.reduce((sum, r) => sum + r.tokensSaved, 0);
    return { total, totalSaved, avgSaved: totalSaved / total };
  }
}
```

**Implementation Effort:** 1 day
**Impact:** Medium - visibility into efficiency

---

## 4. Cross-Cutting Patterns

### 4.1 Hybrid Search (All Three)

All three projects implement hybrid search combining multiple retrieval methods:

| Project | Methods Combined | Fusion Approach |
|---------|-----------------|-----------------|
| dotmd | Semantic + BM25 + Graph | RRF |
| seu-claude | Semantic + BM25 + Fuzzy | Weighted sum or RRF |
| Drift | Semantic + Pattern DB | Layered retrieval |

**Pattern:** Never rely on single retrieval method. Combine complementary approaches.

**Recommendation for system-speckit:**
1. Add BM25 for exact term matching
2. Use RRF for fusion (no weight tuning needed)
3. Keep trigger matching as third signal

---

### 4.2 Local-First Architecture (All Three)

All three projects prioritize local execution:

| Project | Local Components |
|---------|-----------------|
| dotmd | LanceDB, LadybugDB, SQLite, sentence-transformers |
| seu-claude | LanceDB, SQLite, Transformers.js |
| Drift | Local pattern DB, local analysis |

**Pattern:** Avoid network dependencies for core functionality.

**Current status:** system-speckit already local-first.

---

### 4.3 MCP as Primary Interface (All Three)

All three expose functionality through MCP:

| Project | MCP Tools |
|---------|----------|
| dotmd | search, index, status |
| seu-claude | 9 tools (index, search, xrefs, symbols, etc.) |
| Drift | 50+ tools in 7 layers |

**Pattern:** MCP enables tool-use by AI without custom integrations.

**Current status:** system-speckit already MCP-based.

---

### 4.4 Graceful Degradation (dotmd, seu-claude)

Both handle missing components gracefully:

```python
# dotmd: BM25 index not found
if not self._index_path.exists():
    logger.warning("BM25 index not found; searches return empty results.")
    return  # No exception, just empty results
```

**Pattern:** Log warnings, return empty results, continue operation.

**Recommendation:** Audit system-speckit error handling for graceful degradation.

---

## 5. Adaptation Strategies

### 5.1 High-Impact, Low-Effort

| Innovation | Source | Effort | Impact | Priority |
|-----------|--------|--------|--------|----------|
| Compression Tiers | Drift | 0.5d | Medium-High | P0 |
| Session Deduplication | Drift | 0.5d | Medium | P0 |
| Query-Aware Snippets | dotmd | 0.5d | Low-Medium | P1 |
| RRF Fusion | dotmd | 1d | High | P0 |

### 5.2 High-Impact, Medium-Effort

| Innovation | Source | Effort | Impact | Priority |
|-----------|--------|--------|--------|----------|
| Confidence Decay | Drift | 1-2d | High | P1 |
| Intent-Aware Retrieval | Drift | 1d | Medium | P2 |
| Multi-Factor Ranking | seu-claude | 1d | Medium-High | P1 |
| Token Analytics | seu-claude | 1d | Medium | P2 |

### 5.3 High-Impact, High-Effort

| Innovation | Source | Effort | Impact | Priority |
|-----------|--------|--------|--------|----------|
| Causal Learning Pipeline | Drift | 3-4d | Very High | P2 |
| Crash-Resistant Task DAG | seu-claude | 2-3d | High | P1 |
| BM25 Hybrid Search | dotmd/seu-claude | 2d | High | P0 |

---

## 6. Implementation Roadmap

### Phase 1: Quick Wins (Week 1)

1. **Compression Tiers** (0.5d)
   - Add `compression` option to memory_search
   - 4 levels: IDs only, titles, summaries, full

2. **Session Deduplication** (0.5d)
   - Track retrieved memory IDs per session
   - Filter from subsequent results

3. **RRF Fusion** (1d)
   - Implement RRF algorithm
   - Fuse semantic + trigger matching

4. **Query-Aware Snippets** (0.5d)
   - Add best-snippet extraction to search results

### Phase 2: Core Enhancements (Week 2-3)

5. **BM25 Hybrid Search** (2d)
   - Implement BM25 index for memories
   - Integrate with RRF fusion

6. **Confidence Decay** (1-2d)
   - Add access tracking to memories
   - Implement decay formula
   - Integrate into ranking

7. **Multi-Factor Ranking** (1d)
   - Add recency and access frequency signals
   - Configurable weights

8. **Crash-Resistant State** (2-3d)
   - SQLite table for active operations
   - Recovery on startup

### Phase 3: Advanced Features (Week 4+)

9. **Causal Learning Pipeline** (3-4d)
   - Correction detection
   - Principle extraction (LLM)
   - Tribal knowledge memory type

10. **Token Analytics** (1d)
    - Track query/result token counts
    - Calculate savings vs naive retrieval
    - Reporting endpoint

11. **Intent-Aware Retrieval** (1d)
    - Intent classification
    - Intent-based score boosting

---

## Summary

### Most Valuable Innovations

1. **Causal Learning** (Drift) - Transforms corrections into reusable principles
2. **Confidence Decay** (Drift) - Self-cleaning knowledge with natural obsolescence
3. **RRF Fusion** (dotmd) - Principled multi-engine result merging
4. **Crash-Resistant Task DAG** (seu-claude) - Reliable long-running operations
5. **Compression Tiers** (Drift) - Token-efficient progressive disclosure

### Implementation Priority

```
Week 1: Quick Wins
├── Compression Tiers
├── Session Deduplication
├── RRF Fusion
└── Query-Aware Snippets

Week 2-3: Core Enhancements
├── BM25 Hybrid Search
├── Confidence Decay
├── Multi-Factor Ranking
└── Crash-Resistant State

Week 4+: Advanced Features
├── Causal Learning Pipeline
├── Token Analytics
└── Intent-Aware Retrieval
```

### Key Takeaways

1. **Adaptive > Static**: Memory systems should evolve based on usage, not just storage
2. **Fusion > Single Method**: Combine retrieval approaches for robust results
3. **Resilience > Speed**: Crash-proof state enables reliable autonomous operations
4. **Efficiency > Completeness**: Token budgets matter; support graduated disclosure

---

## Sources

All findings derived from:
- GitHub repository analysis via WebFetch
- Prior research documents in specs/research-dotmd-implementation/
- Prior research documents in specs/research__seu-claude-memory-patterns/
- Drift wiki documentation

Evidence grades:
- A: Direct code/documentation citation
- B: Inferred from multiple sources
- C: Single source, not cross-verified
