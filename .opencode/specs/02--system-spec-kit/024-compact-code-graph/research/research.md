---
title: "Deep Research Report: Compact Code Graph — Complete Findings [02--system-spec-kit/024-compact-code-graph/research]"
description: "This research addresses two interconnected problems"
trigger_phrases:
  - "deep"
  - "research"
  - "report"
  - "compact"
  - "code"
  - "024"
importance_tier: "normal"
contextType: "research"
---
# Deep Research Report: Compact Code Graph — Complete Findings

> **55 iterations across 5 segments** | 40 GPT-5.4 agent iterations (segments 3-5) | ~8,400 lines of research

---

## Part I: Executive Summary

### Two Parallel Tracks

This research addresses two interconnected problems:

1. **Context Compaction** (Segments 1-3): How to automatically preserve and restore critical context when AI coding sessions are compacted. Solution: Hybrid hook+tool architecture using Claude Code lifecycle hooks.

2. **Code Graph** (Segments 1, 4): How to add structural code understanding to improve AI context selection, compaction quality, and recovery speed. Solution: Clean-room code graph channel using tree-sitter, integrated into the existing MCP search pipeline.

### Top-Level Recommendations

| Decision | Recommendation | Evidence |
|----------|---------------|----------|
| Dual-Graph (Codex-CLI-Compact) | **REJECT** — proprietary core, CLAUDE.md conflicts | Iterations 1-10 |
| Hook architecture | **BUILD** — PreCompact + SessionStart + Stop hooks | Iterations 11-20 |
| Code graph approach | **BUILD** — tree-sitter + SQLite, "store rich, serve compact" | Iterations 31-45 |
| Code graph storage | **SQLite** — separate `code-graph.sqlite`, not graph DB | Iteration 40 |
| Context representation | **Three-tier** — repo map → skeleton → full code | Iterations 36, 39 |
| Graph for compaction | **Projection** — structural working set, not raw graph dump | Iteration 45 |
| CocoIndex integration | **USE** — existing semantic layer, complements structural code graph | Iterations 036-045 + CocoIndex skill analysis |
| CocoIndex ↔ Code Graph bridge | **BUILD** — file-range seeds, 1-hop expansion, reverse semantic augmentation | Iterations 046-055 |
| Token budget allocation | **FLOORS + OVERFLOW** — constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800 | Iteration 049 |

### Immediate Quick Win
Fix `/spec_kit:resume` to pass `profile: "resume"` — verified defect in all 4 YAML blocks causing search-style output instead of compact recovery brief (Iteration 029).

---

## Part II: Hook + Tool Architecture (Segments 2-3, Iterations 11-35)

### Architecture Overview

```
User/Session Event ──→ Runtime-Specific Adapter
                       ├── Claude: hooks (PreCompact, SessionStart, Stop)
                       └── Codex/Copilot/Gemini: Gate docs + wrapper prompts
                                    │
                                    ▼
                       Shared Context Orchestrator
                       ├── memory_match_triggers(prompt)
                       └── memory_context(mode:"resume", profile:"resume")
                                    │
                                    ▼
                       Spec Kit Memory MCP Server
                       ├── autoSurfaceAtCompaction()
                       └── autoSurfaceAtToolDispatch()
```

### Core API Contracts

**autoSurfaceAtCompaction()** (Iteration 016):
- Signature: `async (sessionContext: string, options?: { enableCompactionHook?: boolean }) → AutoSurfaceResult | null`
- Returns: `{ constitutional: ConstitutionalMemory[], triggered: [...], surfaced_at, latencyMs }`
- Budget: 4000 tokens via `enforceAutoSurfaceTokenBudget()`
- Truncation order: triggered first → constitutional last (preserves newest constitutional longest)
- Error handling: degrade-not-fail — returns `null` on any failure

**memory_context Resume Flow** (Iteration 017):
- Resume brief lives in **inner** `memory_search` envelope, NOT outer `memory_context` envelope
- `ResumeProfile = { state, nextSteps, blockers, topResult }` — `topResult` is part of the real contract
- Three token budget layers:
  - Resume retrieval: **1200** tokens
  - memory_context layer: **2000** tokens
  - Compaction auto-surface: **4000** tokens
- `SPECKIT_AUTO_RESUME` only gates post-search working-memory injection

### Claude Code Hook Schemas (Iteration 018)

| Hook | Key stdin Fields | stdout Behavior |
|------|-----------------|----------------|
| **PreCompact** | `session_id`, `transcript_path`, `trigger` (auto\|manual), `custom_instructions` | **NOT injected** — precompute only |
| **SessionStart** | `source` (startup\|resume\|clear\|compact), `model`, `agent_type` | **Injected** — plain text or `additionalContext` |
| **Stop** | `stop_hook_active`, `last_assistant_message`, `permission_mode` | Supports `async: true` |

- Matcher: regex on event-specific fields (e.g., `source` for SessionStart)
- Timeouts: 600s (command), 30s (prompt), 60s (agent), 1.5s (SessionEnd)
- Error: exit 0 = success, exit 2 = blocking error, other = non-blocking
- Settings merge: **hooks are additive** across scopes (Iteration 023)

### Transcript Parsing (Iteration 019)

Based on analysis of **640 local transcript files** and **12,209 assistant lines**:

- Token usage at: `assistant.message.usage` (NOT root level)
- Model at: `assistant.message.model`
- Core usage fields: `input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`
- Root record types: `assistant`, `user`, `system`, `progress`, `queue-operation`, `file-history-snapshot`, `last-prompt`, `custom-title`, `agent-name`, `pr-link`
- `tool_use` and `tool_result` are inner `message.content[]` types, NOT root types
- 30-min session: **median 1.65MB, 486 lines**
- Parser: byte-offset `createReadStream({ start: offset })`, manual buffer splitting

### Session Bridging (Iteration 020)

- Claude's `session_id` **MUST NOT** be passed to Spec Kit as `sessionId` — trust boundary
- Bridge: local mapping `claudeSessionId → effectiveSessionId`
- Mint via `memory_context` on first contact, reuse `effectiveSessionId` thereafter
- State: `os.tmpdir()/speckit-claude-hooks/sessions/<sha256(claudeSessionId)>/`
- Recovery: if hook state lost, mint new session, fall back to semantic resume

### Cross-Runtime Support

| Runtime | Hook Events | Context Injection | v1 Policy |
|---------|-----------|------------------|-----------|
| **Claude Code** | 25 events, 4 handler types | Full: `additionalContext` on SessionStart | Full hooks |
| **Copilot CLI** | 8 events, command + prompt only | Limited: `prompt` on sessionStart only | Tool fallback |
| **Gemini CLI** | Hooks v0.33.1+ | Limited | Tool fallback |
| **Codex CLI** | None confirmed | None | Tool fallback |

### Agent & Command Audit (Iterations 028-030)

- **30 agent files** across 3 populated runtimes (`.codex/agents/` empty)
- Recovery concentrated in 4 families: `@orchestrate`, `@handover`, `@speckit`, `@context`
- Existing Context Package branch is best insertion point for hook-awareness
- `/spec_kit:resume` missing `profile: "resume"` in **all 4 YAML blocks**
- `/memory:save` has **no Stop-hook dedup guard** — double-save risk
- All 5 gaps from iteration 012 still open (`.claude/CLAUDE.md` absent, `CODEX.md` absent)

### Implementation Readiness

| Phase | Name | Score | MVP LOC | Status |
|-------|------|:-----:|--------:|--------|
| 001 | PreCompact Hook | 4/5 | 155-195 | Ready |
| 002 | SessionStart Priming | 4/5 | 150-200 | Ready |
| 003 | Stop Hook + Tokens | 4/5 | 220-270 | Ready |
| 004 | Cross-Runtime Fallback | 3/5 | 50-160 | Partial |
| 005 | Command/Agent Alignment | 3/5 | 180-270 | Partial |
| 006 | Documentation | 2/5 | 350-530 | Blocked on 1-5 |
| 007 | Testing & Validation | 3/5 | 580-850 | Partial |

**MVP (Phases 1+2 + minimal 4 + resume fix): 735-1,025 LOC**
**Full (all phases): 1,685-2,475 LOC**

---

## Part III: Code Graph — Comprehensive Research (Segment 4, Iterations 36-45)

### 1. Industry Landscape (Iteration 036)

How leading AI coding tools handle code context:

| Tool | Strategy | Structure Signal | Budget |
|------|----------|-----------------|--------|
| **Cursor** | File embeddings + rules + working set | Implicit via retrieval | 200K normal, 1M max mode |
| **Continue.dev** | Agentic tool-first + optional RAG | AST chunking optional | ~50 retrieve, rerank to 10 |
| **Sourcegraph Cody** | Hybrid search + code graph + `symf` + agentic | **Explicit code graph** | Not public |
| **Aider** | Repo-map (tree-sitter tags + graph ranking) | **Structural-first** | Default 1K tokens |
| **GitHub Copilot** | Layered prompt assembly + embeddings | Indirect via indexing | Not public |
| **Windsurf** | RAG context engine + memories/rules | Retrieval-driven | Not public |

**Key insight**: No successful tool uses a single technique. The state of the art is **hybrid retrieval with structural awareness** — embeddings for recall, structure for precision.

### 2. Code Graph Types (Iteration 037)

Ten graph families, ordered by construction cost:

| Cost | Graph Type | Best For |
|------|-----------|----------|
| **Lowest** | AST, Import graph, Symbol table | Syntax editing, navigation, file scoping |
| **Low** | Dependency graph, Class hierarchy | Architecture, module relationships |
| **Moderate** | Approximate call graph | Impact analysis, caller/callee expansion |
| **High** | Precise call graph, CFG, DFG | Semantic analysis, bug finding |
| **Highest** | PDG, Code Property Graph (CPG) | Vulnerability analysis, slicing |

**For AI coding assistants**: The highest-payoff layers are import/dependency graph, call graph, and symbol/type graph — NOT full PDG/CPG.

**Academic foundation**: GraphCodeBERT (2021) explicitly chose DFG over full AST because "data flow is a semantic structure that avoids the deep hierarchy of AST."

**Architecture principle**: "Store rich, serve compact" — persist full graph facts, project compact summaries for the model.

### 3. tree-sitter Deep Dive (Iteration 038)

**Why it's fast**: Incremental parsing reuses old tree structure. `tree.edit()` + reparse = structural sharing. `changed_ranges()` narrows downstream work to actual syntax changes.

**Query system**: S-expression pattern matchers with captures (`@name`), predicates (`#eq?`, `#match?`), and operators (alternation, quantification, anchoring).

**Extraction queries for our index** (JS/TS example):
```scheme
[(function_declaration name: (identifier) @name)
 (class_declaration name: (identifier) @name)] @definition.function

(import_statement source: (string) @name) @definition.import
(export_statement) @definition.export
(interface_declaration name: (type_identifier) @name) @definition.interface
```

**Standardized capture vocabulary**:
`@definition.function`, `@definition.method`, `@definition.class`, `@definition.interface`, `@definition.type`, `@definition.enum`, `@definition.import`, `@definition.export`, `@reference.call`, `@reference.include`, `@name`

**Limitations**: Syntax only — no symbol resolution, type inference, or module resolution. Grammar quality varies by language. Error recovery produces `ERROR`/`MISSING` nodes — index them but mark confidence.

### 4. Compact Code Representations (Iteration 039)

**Three-tier progressive disclosure**:

| Tier | Content | Tokens | When |
|------|---------|--------|------|
| **A** | Repository map: file paths + ranked symbols + signatures + imports | 1K-4K | Always — orientation |
| **B** | Skeletonized expansions: signatures + docstrings + `...` bodies | 2K-8K | Shortlisted files |
| **C** | Full code bodies | Unlimited | Active edit/debug set only |

**Compression ratios** (from research):
- Signature-only: removes most body tokens, preserves API meaning
- Caller-summary context: **81% token reduction** with improved quality (Su et al.)
- LLMLingua: up to **20x compression** with limited performance loss
- LongLLMLingua: **4x fewer tokens** with improved accuracy

**Formatting for LLMs**: Use structured sections (XML-like tags), not undifferentiated blobs:
```xml
<repository_map>... compact symbol map ...</repository_map>
<candidate_symbols>... 3-8 summaries ...</candidate_symbols>
<expanded_code>... 1-2 full bodies ...</expanded_code>
```

### 5. Storage Architecture (Iteration 040)

**Recommendation: SQLite** — not Neo4j or Dgraph.

**Schema**:
```sql
code_files(id, path, language, content_hash, mtime)
code_nodes(id, file_id, kind, stable_key, display_name, fq_name,
           start_line, start_col, end_line, end_col, exported)
code_edges(src_id, dst_id, kind, ord, file_id, line, col)
```

**Edge vocabulary**: `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `REFERENCES`

**Hot queries** (no recursion needed):
```sql
-- What does this function call?
SELECT callee.* FROM code_edges e JOIN code_nodes callee ON callee.id = e.dst_id
WHERE e.src_id = ?1 AND e.kind = 'CALLS';

-- What calls this function?
SELECT caller.* FROM code_edges e JOIN code_nodes caller ON caller.id = e.src_id
WHERE e.dst_id = ?1 AND e.kind = 'CALLS';
```

**Size estimate** (~500 file TS/JS project): 5K-25K nodes, 20K-150K edges, 10-80 MB on disk.

**Separate database**: Use `code-graph.sqlite` alongside existing memory DB — different lifecycle, rebuild cadence, and write patterns.

### 6. Incremental Updates (Iteration 041)

**Hybrid freshness architecture**:
- **Hot path**: Incremental per-file on save via tree-sitter `edit + reparse(oldTree) + changed_ranges()`
- **Warm path**: Background project catch-up on branch switch, pull, dependency change
- **Cold path**: Full rebuild on demand, corruption recovery, grammar/schema change

**File watching**: chokidar for local dev + git-based reconciliation for startup/manual refresh.

**Invalidation classes** (different scopes):
- Body-only edits: invalidate local refs/call edges only
- Declaration/API edits: invalidate defs/refs/relations + schedule dependents
- Import/module edits: invalidate dependency edges + all dependent files

**Cache stack**: content hash guard → per-file parse tree → extracted symbols/refs → reverse edge indexes → durable on-disk snapshot.

### 7. Code-Aware RAG (Iteration 042)

**Our system assessment**: Architecturally aligned with modern hybrid RAG (`vector + FTS5 + BM25 + graph + degree`), but current `graph` channel is causal-memory, not code-structure. **Not yet a full code-aware RAG pipeline.**

**Missing pieces for state of the art**:
- Symbol-level structural chunking (function-level, not file-level)
- Code-specific embeddings or dual-index retrieval
- Code-doc link modeling
- Graph expansion around symbol seeds
- Query-intent routing for code tasks
- Repository-level benchmark evaluation

**Best pattern**: Hybrid seed retrieval + graph expansion — embeddings find candidates, graph recovers structural neighborhood.

**Chunking**: Function-level as default, with class/file headers as lightweight parent context.

### 8. Open-Source Tools Survey (Iteration 043)

**Recommended stack for our MCP server**:

| Role | Tool | License | Why |
|------|------|---------|-----|
| **Parser foundation** | tree-sitter | MIT | Multi-language, incremental, embeddable |
| **Query layer** | ast-grep | MIT | Structural search on top of tree-sitter |
| **TS/JS enrichment** | ts-morph | MIT | Deep TypeScript compiler API access |
| **JS/TS dependencies** | dependency-cruiser | MIT | Battle-tested file dependency extraction |
| **Python enrichment** | Pyright | Permissive | Type analysis for Python nodes |

**Not recommended for core**: Semgrep (LGPL, CLI-first), CodeQL (license-sensitive), Sourcetrail (archived), Neo4j/Dgraph (unnecessary for our scale).

### 9. MCP Tool API Design (Iteration 044)

**Four tools** mirroring the existing server taxonomy:

| Tool | Layer | Purpose |
|------|-------|---------|
| `code_graph_scan` | L7 (maintenance) | Build, refresh, or repair the index |
| `code_graph_query` | L2/L3 (focused) | Exact structural query for symbols/edges |
| `code_graph_context` | L1 (orchestration) | LLM-oriented compact graph neighborhood |
| `code_graph_status` | L7 (maintenance) | Freshness, coverage, errors |

**Query operations** (following LSP vocabulary):
`outline`, `symbols`, `entry_points`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `inherits_from`, `inherited_by`, `implements`, `implemented_by`, `definitions`, `references`, `dependency_path`

**Integration**: Keep code graph as separate tool surface in MVP. Future: add `code_graph` as 6th retrieval channel alongside existing `vector`, `fts5`, `bm25`, `graph`, `degree`.

### 10. Code Graph for Compaction (Iteration 045)

**Three context types** (keep separate in storage and scoring):

| Type | Content | Source |
|------|---------|--------|
| **Structural** | Files, symbols, imports, callers, callees, tests | Code graph |
| **Semantic** | Conceptual similarity, natural-language relevance | Embeddings, memory search |
| **Session** | User goal, files touched, tools used, failures, decisions | Transcript, working memory |

**Compaction pipeline with code graph**:
```
session transcript + working-set tracker
  → active files/symbols
  → code graph expansion (imports, callers, tests)
  → semantic + memory retrieval
  → compaction scorer
  → compact structural brief (≤4000 tokens)
  → cache on PreCompact
  → inject on SessionStart(source=compact)
```

**Working set preservation order** (after compaction):
1. Active files and symbols (edited, read, mentioned)
2. Dependency neighbors (imports, callers, callees, parent classes)
3. Verification surface (failing tests, pending checks)
4. Session intent anchors (task, blockers, next step, decisions)
5. Stable cross-session rules (constitutional memory, conventions)

**Strongest relevance signals**: Recency > explicit mention > graph proximity > verification coupling > semantic similarity.

---

## Part IV: Unified Architecture Vision

### v1 Implementation Plan

```
┌─────────────────────────────────────────────┐
│              Claude Code Hooks              │
│  PreCompact → cache    SessionStart → inject│
│  Stop → save + tokens                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Spec Kit Memory MCP Server          │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Memory  │  │  Code    │  │ CocoIndex │  │
│  │ Search  │  │  Graph   │  │ Code MCP  │  │
│  │ Hybrid  │  │(struct.) │  │(semantic) │  │
│  └────┬────┘  └────┬─────┘  └─────┬─────┘  │
│       │            │              │          │
│       └────────────┼──────────────┘          │
│                    ▼                         │
│       Context Orchestrator + Intent Router   │
│       memory_context + code_graph_context    │
│       + cocoindex_code search                │
│                    │                         │
│                    ▼                         │
│          Budget Enforcement                  │
│          (4000 token compaction budget)       │
└─────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              Storage Layer                  │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Memory DB   │  │ code-graph.sqlite    │  │
│  │ (existing)  │  │ code_files           │  │
│  │             │  │ code_nodes           │  │
│  │             │  │ code_edges           │  │
│  └─────────────┘  └──────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ CocoIndex (.cocoindex_code/)         │   │
│  │ Vector embeddings (external MCP)     │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Implementation Order

1. **Immediate**: Fix `/spec_kit:resume` `profile: "resume"` (1 hour)
2. **Phase 1+2**: Hook scripts (PreCompact + SessionStart) with hook-state bridge (1 week)
3. **Phase 4**: `.claude/CLAUDE.md` + CLAUDE.md compaction section (2 days)
4. **Phase 008**: tree-sitter structural indexer for JS/TS/Python/Shell (3-4 days)
5. **Phase 009**: SQLite storage + code_graph_scan/query/status tools (2-3 days)
6. **Phase 010**: code_graph_context + CocoIndex bridge — seed normalization, reverse semantic augmentation (3-4 days)
7. **Phase 011**: Working-set tracking + 3-source compaction merge — budget allocator with floors + overflow (2-3 days)
8. **Phase 3**: Stop hook + token tracking (1 week)
9. **Phase 5-7**: Agent/command alignment, documentation, testing (2 weeks)

---

## Part V: Convergence Report

| Segment | Iterations | Focus | newInfoRatio Range |
|---------|-----------|-------|--------------------|
| 1 | 001-010 | Dual-Graph evaluation | 0.15-0.95 |
| 2 | 011-015 | Hook architecture design | 0.44-0.88 |
| 3 | 016-035 | Implementation research (GPT-5.4) | 0.41-0.90 |
| 4 | 036-045 | Code graph research (GPT-5.4) | 0.73-0.88 |
| 5 | 046-055 | CocoIndex + Code Graph integration | 0.49-0.76 |

**Total**: 55 iterations, ~8,400 lines across iteration files.

**Method**: Segments 1-2 mixed orchestrator + codex agents. Segments 3-5 all GPT-5.4 agents via `codex exec -m gpt-5.4 -c model_reasoning_effort="high" --full-auto`, dispatched in parallel waves.

---

## Appendix: Iteration Index

| Iter | Lines | Focus |
|------|------:|-------|
| 001-010 | ~5K | Dual-Graph evaluation → REJECTED |
| 011-015 | ~5K | Hook+tool architecture design |
| 016 | 71 | autoSurfaceAtCompaction API |
| 017 | 166 | memory_context resume flow |
| 018 | 102 | Claude hooks stdin/stdout schemas |
| 019 | 333 | Transcript JSONL format (640 files analyzed) |
| 020 | 43 | Hook-state design patterns |
| 021 | 42 | Vitest test framework patterns |
| 022 | — | Query router & hybrid search (pending) |
| 023 | 300 | Settings merge strategy |
| 024 | 96 | Token budget & truncation |
| 025 | 49 | Recovery payload format |
| 026 | 192 | Copilot CLI hooks API |
| 027 | 102 | Gemini CLI hooks API |
| 028 | 46 | Agent compaction audit (30 files) |
| 029 | 131 | Command compaction audit (52 files) |
| 030 | 117 | CLAUDE.md/CODEX.md recovery gaps |
| 031 | 204 | tree-sitter npm evaluation |
| 032 | 98 | aider repo-map analysis |
| 033 | 48 | CocoIndex integration options |
| 034 | 184 | End-to-end flow trace |
| 035 | 76 | Implementation readiness assessment |
| 036 | 171 | AI coding tools context strategies |
| 037 | 190 | Code graph representations for AI |
| 038 | 290 | tree-sitter deep dive (queries, parsing) |
| 039 | 295 | Compact code representations for LLMs |
| 040 | 187 | SQLite vs graph databases |
| 041 | 88 | Incremental code graph updates |
| 042 | 137 | Code-aware RAG pipelines |
| 043 | 307 | Open-source code graph tools survey |
| 044 | 414 | Code graph MCP tool API design |
| 045 | 265 | Code graph for context compaction synthesis |
| 046 | 284 | CocoIndex ↔ Code Graph bridge design |
| 047 | 70 | tree-sitter ↔ CocoIndex chunk alignment |
| 048 | 275 | Query-intent router for code queries |
| 049 | 213 | Token budget allocation across 3 sources |
| 050 | 572 | Compact repo map generation |
| 051 | 134 | Incremental index coordination |
| 052 | 301 | Compaction 3-source merge strategy |
| 053 | 192 | Session working set tracking |
| 054 | 549 | code_graph_context API with CocoIndex seeds |
| 055 | 282 | Implementation readiness assessment |

---

## Part VI: CocoIndex Integration Impact

### What CocoIndex Already Covers

CocoIndex Code is deployed as an MCP server providing semantic code search via vector embeddings:
- **Embedding models**: voyage-code-3 (API) or all-MiniLM-L6-v2 (local)
- **28+ languages** supported (JS, TS, Python, Shell, Go, Rust, etc.)
- **Function-level chunking** with incremental index updates
- **MCP tool**: single `search` endpoint for AI agent integration
- **Cross-runtime**: works across all AI runtimes (Claude, Codex, Copilot, Gemini) via MCP

### Revised Recommendations

| Original Recommendation | Status | Rationale |
|---|---|---|
| Build semantic index for code recall | **DROP** | CocoIndex already provides this |
| Choose code embedding model | **DROP** | CocoIndex uses voyage-code-3 / all-MiniLM-L6-v2 |
| Implement code chunking for embeddings | **DROP** | CocoIndex handles function-level chunking |
| Dual-index retrieval (code + text) | **DROP** | Already exists: CocoIndex (code) + Memory DB (text) |
| tree-sitter + SQLite structural graph | **KEEP** | Structural relationships CocoIndex can't provide |
| code_graph_query / code_graph_context MCP tools | **KEEP** | Structural query API, not semantic |
| Incremental graph updates (chokidar + git) | **KEEP** | Graph-specific, independent of CocoIndex |
| Compact representations (repo maps, skeletons) | **KEEP** | Output format, not retrieval method |
| All hook architecture (phases 001-007) | **KEEP** | Completely orthogonal to code graph |
| All compaction/resume fixes | **KEEP** | Orthogonal |
| Code graph API accepts CocoIndex results as seeds | **MODIFY** | Structural expansion of semantic hits |
| Reranking uses graph edges for CocoIndex results | **MODIFY** | Structurally connected results rank higher |
| Query-intent routing for code tasks | **MODIFY** | Route structural → code_graph, semantic → CocoIndex |
| CocoIndex ↔ Code Graph bridge | **ADD** | Bidirectional enrichment between systems |

### Query-Intent Routing

| Query Intent | Primary Source | Secondary |
|---|---|---|
| "Find code related to X" | CocoIndex (semantic) | Code graph (expand neighbors) |
| "What calls this function?" | Code graph (structural) | — |
| "What imports this file?" | Code graph (structural) | — |
| "How does retry logic work?" | CocoIndex (semantic) | Code graph (trace call chain) |
| "What changed recently?" | Memory (session) | Code graph (impact analysis) |
| "Show file structure/outline" | Code graph (structural) | — |

### Revised Compaction Pipeline

```
PreCompact pipeline (enriched with CocoIndex):
  1. Session working set (transcript analysis)
  2. CocoIndex: semantic neighbors of active symbols  ← EXISTING MCP
  3. Code graph: structural neighbors (imports, callers, tests)  ← NEW
  4. Memory: constitutional + triggered memories  ← EXISTING
  → Merge + budget enforce (4000 tokens) → Cache

SessionStart(source=compact):
  → Inject cached brief (structural + semantic + session context)
```

### Bottom Line

CocoIndex covering semantic search means the code graph can be **purely structural** and much simpler. No embeddings, no chunking, no vector search in the code graph at all. It becomes a lightweight relationship index that answers "what connects to what" while CocoIndex answers "what resembles what." The two complement each other without overlap.

### Segment 5 Key Findings (Iterations 046-055)

**Bridge Design** (iter 046): `code_graph_context` accepts file-range seeds directly from CocoIndex. Execution is parallel-then-sequential: Stage A (parallel semantic + graph bootstrap) → Stage B (cross-expansion) → Stage C (late fusion). Latency budget: <2s for PreCompact.

**Chunk Alignment** (iter 047): CocoIndex uses structure-aware character chunking (~1000 chars), not true AST function-level splitting. Seed-to-node resolution: exact symbol → enclosing symbol → file anchor.

**Intent Router** (iter 048): New top-level router separate from existing `query-router.ts`. Routes structural→code_graph, semantic→CocoIndex, session→Memory. MVP: keyword heuristics with telemetry.

**Token Budget** (iter 049): Floors + overflow pool model. Constitutional 700, Graph 1200, CocoIndex 900, Triggered 400, Overflow 800. When a source is empty, its floor redistributes to overflow. Priority: constitutional > graph > CocoIndex > triggered.

**Repo Maps** (iter 050): Query-ranked dynamic maps using typed graph edges + CocoIndex relevance scores. Improves on aider's flat reference counting.

**Index Coordination** (iter 051): Independent refresh cycles for CocoIndex and Code Graph. Freshness state exposed in API. No shared event bus needed for v1.

**Merge Strategy** (iter 052): Constitutional → graph → CocoIndex → triggered. Structured output sections. File-level deduplication.

**Working Set** (iter 053): Track touched files/symbols during session. 1-hop structural expansion of edited symbols. Feeds compaction priority ranking.

**API Design** (iter 054): Three query modes — neighborhood (expand around seeds), outline (structural overview), impact (reverse dependency). Seed types: CocoIndexSeed, ManualSeed, GraphSeed. Normalized to ArtifactRef internally.

**Readiness** (iter 055): Phase 008-011 specs defined. Graph MVP ~850-1,200 LOC. Integrates into existing MCP server. Readiness scores: indexer 4/5, storage 4/5, bridge 3/5, compaction merge 3/5.
