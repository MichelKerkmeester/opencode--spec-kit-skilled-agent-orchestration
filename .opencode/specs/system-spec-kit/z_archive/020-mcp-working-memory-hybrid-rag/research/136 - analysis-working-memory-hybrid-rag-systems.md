# 136 - Technical Analysis: Working Memory + Hybrid Graph/Vector RAG Systems

> **Note (2026-02-19):** Source code references in this document point to `scratch/opencode-working-memory/` and `scratch/graphrag-hybrid/` repositories that were removed after analysis per CHK-051 (scratch cleanup). Line references are historical and no longer resolvable in the repository. The analysis findings remain valid — algorithms were ported to TypeScript per ADR-001.

## Executive Summary

**UX Goal**: Improve agent session continuity and reduce cognitive friction during multi-step workflows through contextually aware, pressure-responsive memory retrieval.

**Automation Goal**: Eliminate manual memory management via automatic extraction, decay-based pruning, and pressure-triggered policy switching.

This research analyzes two complementary systems: `opencode-working-memory` (session cognition + pressure control) and `graphrag-hybrid` (dual-store retrieval with Neo4j + Qdrant).

**`opencode-working-memory`** excels at automated session continuity:
- Auto-extraction from tool outputs (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1629-1633`)
- Event-driven relevance decay (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:893-902`)
- Pressure-adaptive response (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1414-1427`)
- Zero-config prompt augmentation (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1494-1566`)

**`graphrag-hybrid`** excels at retrieval quality:
- Semantic + structural fusion (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/query_engine.py:148-172`)
- Neighbor context expansion (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/query_engine.py:154`)
- Weighted blending prevents source domination (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/query_engine.py:148`)

**Target System Foundation**: Spec Kit Memory MCP already has hybrid retrieval (vector + FTS + BM25 + RRF), session-aware working memory table, and layered architecture (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:687-732`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:287`).

**Gap Identified**: Strong infrastructure but missing cognitive automation — no auto-extraction, no pressure policies, working memory not integrated into ranking.

**Strategic Opportunity**: Add session-cognitive automation layer on existing infrastructure (surgical enhancement, not replacement).

**Risk Profile**: Config drift, duplicated scoring, cross-language burden. **Mitigation**: TypeScript-first, strict contracts, bounded boosts.

[Assumes: TARGET_SYSTEM is Spec Kit Memory MCP (`.opencode/skill/system-spec-kit/mcp_server`), goal is UX improvement via automation without replacing 7-layer architecture.]

---

## 1) Architecture Overview

### 1.1 `opencode-working-memory`: Zero-Touch Session Management

**Four-Tier Architecture** (62KB TypeScript, `.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts`):

1. **Core Blocks** — `goal`, `progress`, `context` with fixed char limits (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:21-37`)
   - *UX Impact*: Agent always knows task context after 50+ tool calls without manual context-loading commands
   - *Behavior*: Blocks update via `updateGoal()`, `updateProgress()` hooks triggered by tool completions
   - *Char limits*: Goal (500 chars), Progress (800 chars), Context (1500 chars) — prevents token bloat
   - *Constraint*: Fixed-size blocks cannot expand for complex multi-step tasks with >3 parallel goals
   
2. **Slotted Memory** — High-salience queues (error, decision) + decaying pool (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:73-114`)
   - *Automation UX*: FIFO management, no manual tagging (5 decision + 5 error + 20 pool)
   - *Prioritization*: Error slot = guaranteed inclusion (no decay), decision slot = 0.9 initial score, pool = 0.5 initial score
   - *Friction Point*: Capacity limits mean old decisions evicted even if still relevant. No user control over retention.
   - *Evidence*: Sweep logic (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:132-145`) removes lowest-scoring pool items when capacity exceeded
   
3. **Smart Pruning** — Tool-class-aware summarization (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:608-683`)
   - *UX*: Long outputs condensed automatically (e.g., grep results → "Found 15 matches in 3 files")
   - *Tool classes*: `file_read` → first/last 500 chars, `execute_command` → stdout summary, `grep` → match count + files
   - *Limitation*: Hardcoded summarization rules don't adapt to task type. Multi-file refactoring loses intermediate state.
   
4. **Pressure Response** — Three-level gates (safe/moderate/high) (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1239-1427`)
   - *UX*: Graceful degradation, no abrupt "context exceeded" failures
   - *Thresholds*: Safe (<60%), Moderate (60-80%), High (>80%) based on `(tokenUsage / tokenBudget)`
   - *Actions*: Moderate = condense blocks + warning message, High = critical-only + suggest compaction
   - *Automation Gap*: No retry/fallback logic. If high pressure persists, agent remains degraded until user intervenes.

**Key Innovation**: Hook-driven middleware — behavior improves without task logic changes. System transforms messages via `system.transform` hook (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1494-1566`) injecting working memory into every agent prompt automatically.

### 1.2 `graphrag-hybrid`: Relationship-Aware Retrieval

**Three-Layer Architecture** (Python, 10 modules):

1. **Ingest** — Markdown → nodes, embeddings, relationships (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/processors/document_processor.py:40-108`)
   - *Process*: Parse headers as nodes → generate embeddings (384-dim) → extract relationships via heuristics (capitalized terms = entities)
   - *Relationship rules*: Sequential sections = `NEXT` edge, shared entities = `RELATED_TO` edge
   - *Limitation*: Heuristic extraction misses implicit relationships. "Authentication" and "auth module" treated as distinct.
   
2. **Storage** — Neo4j (graph) + Qdrant (vectors) (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/database/neo4j_manager.py:11-96`)
   - *Neo4j*: Stores nodes (sections) + edges (`RELATED_TO`, `CAUSED`, `NEXT`, `SUPPORTS`) with properties (weight, context)
   - *Qdrant*: Stores 384-dim embeddings with metadata (file_path, section_id, text_preview)
   - *Sync constraint*: Two databases must stay consistent. Delete operation requires 2-phase commit (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/database/neo4j_manager.py:75-96`). Partial failures leave orphaned data.
   
3. **Query** — Semantic seed + graph expansion, weighted fusion (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/query_engine.py:11-194`)
   - *Phase 1*: Qdrant semantic search (top-20 by cosine similarity)
   - *Phase 2*: For each result, Neo4j traverses 1-2 hops via edges
   - *Phase 3*: Weighted blend `final_score = semantic_score * 0.7 + graph_score * 0.3` (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/query_engine.py:148`)
   - *Latency*: Vector search ~30ms, graph traversal ~5-10ms per result → total ~50-200ms for 20 results

**UX Benefit**: "Show related docs" surfaces connections via graph edges even without keyword match. Query "authentication flow" returns "session management" via `RELATED_TO` edge.

**UX Friction**: High operational overhead (Docker, 2 DBs, ~4GB RAM, PyTorch) — unsuitable for client-side deployment. Setup requires `docker-compose up`, Neo4j config, Qdrant collection creation. Deployment complexity limits adoption for lightweight tools.

**Dependency Chain**: Python 3.10+ → transformers → torch (~1.5GB) → sentence-transformers → Neo4j driver → Qdrant client. Cold start = ~15 seconds for model loading.

### 1.3 Target System: Strong Foundation, Missing Automation

**Existing Strengths**:
- **Unified orchestration** via `memory_context` modes (auto/quick/deep/focused/resume) (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:328-446`)
  - `auto`: Intent detection → optimal mode selection
  - `quick`: Trigger-only matching (fast, low token)
  - `deep`: Full hybrid search + contiguity
  - `focused`: Intent-optimized retrieval
  - `resume`: Session recovery with anchored content
  
- **Hybrid stack**: vector + FTS + BM25 with fallback chain (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:215-462`)
  - Tries vector (vec0 extension) → falls back to FTS (SQLite FTS5) → falls back to BM25 (custom tokenizer)
  - RRF fusion blends all three sources to prevent single-method dominance
  
- **RRF fusion** with source-aware weighting (`.opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts:128-187`)
  - Reciprocal Rank Fusion: `score = sum(1 / (k + rank_i))` where k=60 (tuned constant)
  - Source normalization prevents BM25 scores (0-100 range) from drowning out vector scores (0-1 range)
  
- **Working memory table** (max 7 items, attention scoring) (`.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts:42-73`)
  - Schema: `session_id`, `memory_id`, `attention_score`, `last_focused`, `added_at`
  - Time-based decay: `newScore = oldScore * pow(0.95, minutesElapsed)` — BUT not used in ranking
  - Capacity enforcement: LRU eviction when >7 items

**Critical Gaps** (UX Friction Points):

| Gap | User Pain | System Behavior | Solution from `opencode-working-memory` |
|-----|-----------|-----------------|----------------------------------------|
| No auto-extraction | Manual `/memory:save` calls after every important output | User forgets → context lost → repeated explanations | Hook-based extraction (`:1629`) after tool completions |
| No pressure policies | Normal retrieval mode at 90% context usage | Abrupt "context exceeded" error mid-task | Pressure gates (`:1419-1427`) switch to lighter modes |
| Working memory unused | Session attention scores computed but ignored | Recent relevant work ranked below old docs | Event-based decay in ranking (`:893-905`) boosts recent items |
| Manual resume | Explicit `/memory:continue` or context-loading query | Break between sessions → agent forgets task state | Auto system prompt injection (`:1494-1566`) at turn start |

**Automation Behavior Gap Analysis**:

1. **Extraction Gap**: Target has `generate-context.js` script for manual memory saves. User must recognize "this is important" and run script. Friction = cognitive overhead + command recall. `opencode-working-memory` extracts automatically based on tool class (Read spec.md = high salience, Bash git commit = decision slot).

2. **Pressure Gap**: Target `memory_context` mode routing is static (user-specified or auto-detected from query). No dynamic adjustment based on context pressure. At 85% token usage, system still tries `deep` mode if query suggests comprehensive search, leading to hard limit failures.

3. **Ranking Gap**: Working memory exists as table but doesn't influence `memory_search` scoring. Recent session items have same weight as 6-month-old docs. User sees stale results first, manually scrolls for recent work.

4. **Resume Gap**: Session recovery requires explicit query ("what were we doing?") or `/memory:continue` command. User must remember to invoke. `opencode-working-memory` injects working memory into every system prompt automatically via hook, making session state always-present.

**Assessment**: Target architecture more mature than either source (7-layer MCP with robust error handling, TypeScript strict mode, comprehensive test suite). Opportunity is surgical enhancement (add cognitive automation layer), not replacement. Existing infrastructure (hybrid search, RRF, working memory table, mode routing) provides perfect anchor points.

---

## 2) Core Flows and Integration

### 2.1 Automation Flow: Tool → Extract → Memory → Rank

**`opencode-working-memory` Flow**:
```
Tool execution → [Hook: tool.execute.after] → Pattern extraction 
  (errors→error slot, decisions→decision slot, reads→pool) → Insert with decay scoring
  → Next turn: auto-included in context
```

**UX Impact**: Zero user commands. Extraction invisible. Event-counter decay (not wall-clock) survives pause/resume cycles.

**Implementation Detail**: Hook registered at plugin init (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1629-1633`). Each tool completion triggers `extractMemory()` which:
1. Matches tool name against extraction rules (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:632-683`)
2. Applies tool-specific summarization (e.g., `file_read` → first/last 500 chars)
3. Computes initial relevance score based on slot type (error=1.0, decision=0.9, pool=0.5)
4. Inserts into appropriate slot with `eventCounter` = current turn number
5. Triggers sweep if capacity exceeded

**Friction Point**: No user control over extraction rules. If tool output doesn't match predefined patterns (e.g., custom CLI tool), extraction fails silently with no user notification.

### 2.2 Pressure Flow: Adaptive Performance

```
Agent turn start → [Hook: system.transform] → Query token counts → Compute pressure
  → Safe (<60%): full memory | Moderate (60-80%): condensed + warning 
  → High (>80%): critical-only + suggest compaction
```

**UX Impact**: Agent slows gracefully, never hits hard limits abruptly. Check runs once/turn (~10ms overhead).

**Implementation Detail**: `system.transform` hook (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1494-1566`) intercepts system message before LLM call:
1. Query current token usage from MCP server stats
2. Calculate pressure ratio: `usage / budget`
3. Select policy tier (safe/moderate/high)
4. Apply transformations:
   - Moderate: Condense `progress` block (full→summary), add warning banner
   - High: Include only `goal` + error slot, prepend "CRITICAL PRESSURE" message, suggest `/compact`
5. Return transformed message

**Limitation**: No automatic recovery. If pressure remains high after policy activation, agent stays degraded until user manually compacts or closes context. No retry with lighter queries.

### 2.3 GraphRAG Flow: Semantic Seed + Graph Expansion

```
Query → Qdrant semantic search (top-20) → Neo4j neighbor lookup (1-2 hops)
  → Weighted blend (semantic*0.7 + graph*0.3) → Return top-K
```

**UX Impact**: Related docs surface via `RELATED_TO`, `CAUSED`, `NEXT` edges. Latency = vector_search + (num_results × graph_hop) ~50-200ms.

**Implementation Detail** (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/query_engine.py:128-172`):
1. **Semantic phase**: Qdrant cosine similarity search → 20 results with scores 0.6-0.95
2. **Graph phase**: For each result, Cypher query `MATCH (n)-[r:RELATED_TO|CAUSED|SUPPORTS]-(m) WHERE n.id = $id RETURN m, r.weight`
3. **Scoring**: 
   - Semantic score = cosine similarity (normalized 0-1)
   - Graph score = `sum(edge.weight * (1 / hop_distance))` for neighbors (0-1 range)
   - Blend: `0.7 * semantic + 0.3 * graph`
4. **Deduplication**: Neighbors already in semantic results get score boost instead of duplicate entry

**Scalability Warning**: All-pairs `RELATED_TO` edges = O(N²) per category (100 docs → 4,950 edges). Query time grows linearly with result count. At 1000 docs, 2-hop traversal touches ~500K edges, causing 2-5 second latencies.

**Constraint**: Graph expansion requires Neo4j. SQLite alternative (causal_edges table) lacks efficient graph traversal (no recursive CTEs with depth limits in SQLite <3.8.3).

### 2.4 Target Integration Points

Three anchor points for automation without disruption:

1. **Post-search boost** — Add session-attention multiplier in `memory-search.ts:433-476` after RRF fusion
   - Insert point: After `applyIntentWeighting()`, before final sort
   - Logic: Query `working_memory` table for session matches, compute `attentionScore * 0.15`, apply as bounded multiplier (max +0.20)
   - Benefit: Recent session items float to top without disrupting base semantic ranking
   
2. **Pressure policy** — Override mode in `memory-context.ts:181-404` based on token usage
   - Insert point: After intent detection, before mode execution
   - Logic: Query MCP stats for `tokenUsage/tokenBudget`, if >0.8 force `quick` mode, if >0.6 force `focused` mode
   - Benefit: Automatic graceful degradation, no code changes in mode implementations
   
3. **Extraction hook** — Mirror `tool.execute.after` pattern to update working_memory table
   - Insert point: MCP tool execution completion callback
   - Logic: Match tool name against extraction rules, compute salience score, insert into `working_memory` with current `eventCounter`
   - Benefit: Zero user commands, automatic session context building

**Integration Constraint**: Target uses MCP protocol (TypeScript), `opencode-working-memory` uses Claude Desktop SDK hooks (also TypeScript). Hook names differ but concepts map 1:1. Need adapter layer to translate SDK hooks → MCP lifecycle events.

---

## 3) Design Patterns Worth Adopting

**Pattern 1: Tiered Memory** — Guaranteed slots + decaying pool (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:73-114`)
- *Target mapping*: Add `priority_tier` column to working_memory table

**Pattern 2: Event-Based Decay** — Interaction distance not wall-clock (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:893-905`)
```typescript
decayedScore = baseScore * Math.pow(0.85, eventDistance) + (mentions * 0.5)  // NOTE: Spec adopts 0.05 (bounded)
```
- *Target mapping*: Replace time-based decay (`.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts:298-316`) with event-counter

**Pattern 3: Progressive Pressure** — Adaptive thresholds not binary (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1419-1427`)
- *Target mapping*: Use ratio (tokenUsage/budget) to select mode: >0.8→quick, 0.6-0.8→focused, <0.6→deep

**Pattern 4: Weighted Fusion** — Semantic + graph (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/query_engine.py:148`)
- *Target mapping*: Add causal-edge boost as bounded modifier to existing RRF (max +0.20)

**Pattern 5: Bounded Boost** — Prevent score instability
```typescript
sessionBoost = min(0.20, attentionScore*0.15 + causalHops*0.05)
finalScore = result.score * (1 + sessionBoost)  // result.score = FusionResult.score from rrf-fusion.ts
```

---

## 4) Dependencies and Operational Complexity

### Comparison

| System | Runtime | Storage | Deps | Ops Complexity (1-10) | UX Trade-off |
|--------|---------|---------|------|-----------------------|--------------|
| `opencode-working-memory` | Node.js, JSON files | <10KB/session | sqlite3 shell | **2/10** | Lightweight, fast, but shell injection risk |
| `graphrag-hybrid` | Python, Docker | ~10MB/1K docs | Neo4j, Qdrant, PyTorch, transformers (~4GB) | **8/10** | Rich retrieval, high deployment friction |
| Target (Spec Kit MCP) | TypeScript, SQLite+vec | Embedded | None external | **3/10** | Best balance |

### Adoption Decision Matrix

| Capability | Source | Dependency Cost | Target Strategy |
|------------|--------|-----------------|-----------------|
| Session attention | `opencode-working-memory` | JSON → use DB | ✅ Adopt (TypeScript) |
| Event-based decay | `opencode-working-memory` | Pure logic | ✅ Adopt |
| Pressure handling | `opencode-working-memory` | SQLite query | ✅ Adopt |
| Graph expansion | `graphrag-hybrid` | Neo4j service | ❌ Reject (use causal_edges table) |
| Semantic search | `graphrag-hybrid` | Qdrant + PyTorch | ❌ Reject (use vec0 extension) |

**Principle**: **Logic YES, Infrastructure NO** — Port algorithms in TypeScript, avoid service dependencies.

---

## 5) Limitations and Anti-Patterns

### Config Drift (Seen in Both Systems)

**`opencode-working-memory`**: Docs claim sweep at 500 events, runtime = 100 (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/docs/architecture.md:267`, `.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:132`)

**`graphrag-hybrid`**: Config defines `neo4j.user`, manager reads `neo4j.username` (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/config.py:24`, `.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/database/neo4j_manager.py:18`)

**Impact**: Silent failures, empty results, ranking anomalies with no error messages.

**Root Cause**: Constants hardcoded in multiple locations without single source of truth. Documentation updated separately from code. No runtime validation.

**UX Manifestation**: User reports "search returns nothing" or "pressure policy not working." Debug logs show config mismatch but error never surfaced to user. Requires source code inspection to diagnose.

**Target Prevention**: 
- Zod schemas + startup validation + contract tests. Fail loudly at init, not silently at query time.
- Single config source: `configs/cognitive.ts` exports typed constants (`.opencode/skill/system-spec-kit/mcp_server/configs/`)
- Generated docs: Extract config tables from TypeScript source (automation, not manual sync)
- Contract tests: Assert config consumer/producer agreement in integration tests

**Example Target Contract** (proposed):
```typescript
// configs/cognitive.ts
import { z } from 'zod';

export const WorkingMemoryConfigSchema = z.object({
  maxCapacity: z.number().int().min(1).max(20).default(7),
  decayRate: z.number().min(0).max(1).default(0.85),
  sweepThreshold: z.number().int().min(10).default(100)
});

export const workingMemoryConfig = WorkingMemoryConfigSchema.parse(
  process.env.SPECKIT_WORKING_MEMORY_CONFIG 
    ? JSON.parse(process.env.SPECKIT_WORKING_MEMORY_CONFIG) 
    : {}
);
```

Startup validation throws immediately if config malformed, preventing silent drift.

### Duplicated Scoring Logic

**`opencode-working-memory`**: Three separate scoring functions — pool relevance (`:893`), mention boost (`:902`), decay calculation (`:905`) — with no shared base class or interface.

**Impact**: Inconsistent behavior. Pool items decay exponentially, decision items decay linearly, error items don't decay. No single source of truth for "what is a score?"

**UX Friction**: User observes error from 2 hours ago still present, but decision from 30 minutes ago evicted. Behavior feels arbitrary because it IS arbitrary — different decay rules per slot.

**Target Prevention**: Unified `ScoreCalculator` interface with pluggable strategies (exponential decay, linear decay, no decay). All scoring paths use same interface, different config.

### Other Risks

- **Type Safety**: `opencode-working-memory` disables strict mode (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/tsconfig.json:10-12`) → maintain strict in target. Strict mode prevents implicit any, null reference errors, and unsafe casts.

- **SQL Injection**: String interpolation (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1333`) → use parameterized queries. Example: `SELECT * FROM memory WHERE content LIKE '%${query}%'` vulnerable to injection. User query `'; DROP TABLE memory; --` executes arbitrary SQL.

- **Query Bugs**: `graphrag-hybrid` ignores `context_size` param (`.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/database/neo4j_manager.py:252-258`) → integration tests needed. Function signature includes `context_size` but Cypher query uses hardcoded `LIMIT 20`. Changing param has no effect, causing confusion.

- **Score Instability**: Target has multiple scoring layers (vector, FTS, BM25, RRF, intent weighting) → bound new boosts (max 0.20), A/B test. Adding session-attention boost without cap could cause recent irrelevant items to outrank older highly-relevant docs. Example: Recent grep for "test" scores higher than 6-month-old comprehensive architecture doc about core feature.

---

## 6) Key Learnings for Target

1. **Separate Layers**: Session cognition (working memory) ≠ retrieval cognition (long-term search). Keep composable.

2. **Pressure = First-Class Concern**: Drive retrieval depth, not just UI warnings. Map to existing `memory_context` modes.

3. **Explicit Normalization**: Target already does this well (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:287`) — maintain discipline.

4. **Config as Code**: Single source of truth, Zod validation, fail-fast. Learn from drift failures.

5. **Event Distance > Wall-Clock**: Session continuity across pauses requires interaction-based decay.

6. **Bounded Capacity**: Hard limits prevent runaway growth. System self-regulates (max 7 working memory).

7. **Automation > Config**: Zero-config defaults. `opencode-working-memory` succeeds because it "just works."

8. **Observability = Trust**: Rich metadata (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:446-463`) builds user confidence.

---

## 7) Code Examples

### Event-Based Decay (Portable)
```typescript
// Source: .opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:893-905
function calculatePoolScore(item, currentEventCounter) {
  const eventsElapsed = currentEventCounter - (item.lastEventCounter ?? 0);
  const decayedScore = item.relevanceScore * Math.pow(0.85, eventsElapsed);
  const mentionBoost = item.mentions * 0.5; // NOTE: Spec adopts 0.05 (10x smaller, intentionally bounded — see spec.md REQ-006)
  return Math.max(0, decayedScore + mentionBoost);
}
```

### Weighted Fusion (Concept)
```python
# Source: .opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/src/query_engine.py:148
final_score = semantic_score * 0.7 + graph_score * 0.3
```

### Target Integration Hook
```typescript
// .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:687
const hybridResults = await hybridSearch.searchWithFallback(query, queryEmbedding, {
  limit, specFolder, includeArchived
});
// Add session-attention boost here (post-RRF, pre-format)
```

---

## Closing Assessment

**Complementary Systems at Different Maturity**:
- `opencode-working-memory`: Strong operational automation, weak type safety, config drift
- `graphrag-hybrid`: Conceptually strong retrieval, heavy ops burden, config inconsistencies
- Target (Spec Kit MCP): Best architecture foundation, missing automation layer

**Highest-Value Strategy**: Selective pattern adoption (TypeScript reimplementation) on existing infrastructure, NOT wholesale migration or external services.

**Success Criteria**: Deterministic behavior, incremental rollout, TypeScript-only maintainability.

[Assumes: Priority = UX automation + stable behavior over adding Python/Docker dependencies.]
