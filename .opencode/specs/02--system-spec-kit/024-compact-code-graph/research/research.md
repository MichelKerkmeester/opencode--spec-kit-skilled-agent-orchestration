---
title: "Deep Research Report: Compact Code Graph — Complete Findings [02--system-spec-kit/024-compact-code-graph/research]"
description: "This research addresses two interconnected problems"
iterations: 95
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

> **95 iterations across 7 segments** | final synthesis updated through Segment 7 verification via Copilot CLI (GPT-5.4)

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
| 6 | 056-075 | Feature improvements + UX | 0.10-0.80 |
| 7 | 076-095 | Verification + cross-runtime deepening (GPT-5.4 via Copilot CLI) | 0.18-0.83* |

**Total**: 95 iterations across 7 segments, with the program now extended by Segment 7 verification and truth-sync work.

**Method**: Segments 1-2 mixed orchestrator + codex agents. Segments 3-5 GPT-5.4 agents via `codex exec -m gpt-5.4 -c model_reasoning_effort="high" --full-auto`, dispatched in parallel waves. Segment 6 used Claude Opus deep-research iterations. Segment 7 used GPT-5.4 via Copilot CLI for verification, runtime deep dives, and review revalidation.

*Segment 7 local artifacts available at final synthesis time span iterations `076-089`, `091`, and the canonical `deep-research-state.jsonl`; standalone markdown files for `090`, `092`, `093`, and `094` were not present in the working tree, so their outputs are reconstructed in Part XI from the available evidence.*

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

### Segment 6 Key Findings (Iterations 056-059)

**Feature Improvements** (iter 056): Comprehensive implementation-gap analysis of all four subsystems:

| Subsystem | Critical Finding | Priority |
|-----------|-----------------|----------|
| Code Graph Parser | **endLine bug**: Regex parser sets `endLine = startLine` for all captures, making CALLS edge detection non-functional (only scans declaration line, not function body) | P0 |
| Code Graph Edge Types | 3 missing: DECORATES (decorator→target), OVERRIDES (subclass method→parent method), TYPE_OF (typed symbol→type definition) | P1 |
| Code Graph Query API | 5 missing operations: `extends_from/to`, `implements`, `tested_by/tests`, `contains/contained_by`, `search` | P2 |
| Code Graph SymbolKind | `variable`, `parameter` defined but never emitted; `decorator`, `property`, `constant`, `namespace`, `generator` missing | P2 |
| Budget Allocator | Needs adaptive weighting by query intent (structural→more graph, semantic→more CocoIndex), usage-based learning, dynamic overflow proportional to context budget, source-quality scoring | P2 |
| 3-Source Merger | Needs cross-source dedup by content hash, relevance decay by traversal depth, interleaved ranking by score, conflict flagging between sources | P2 |
| Hook System | Needs incremental graph refresh on Stop hook, pre-compaction graph snapshot, hook-based CocoIndex re-index trigger, cross-runtime parity patterns | P1 |

Key fix: **tree-sitter WASM migration** (web-tree-sitter + language grammars) resolves the endLine bug and enables accurate CALLS detection, DECORATES/OVERRIDES extraction, and proper nesting awareness. Dual-mode parser (tree-sitter primary, regex fallback) preserves backward compatibility. ~1.5MB additional WASM files (revised down from initial 8-15MB estimate: core ~300KB + 4 grammars ~1.2MB). The `parseFile()` interface is parser-agnostic -- `extractEdges()` and all downstream consumers (code-graph-db, code-graph-context, code-graph-query) need zero changes. Concrete S-expression queries designed for CALLS (`call_expression` + `member_expression`), IMPORTS (`import_statement` + `named_imports`), DECORATES (`decorator` + `decorated_definition`), OVERRIDES (`override_modifier` + name-match heuristic).

**Q13 Deep Dive** (iter 060): Implementation-ready detail from direct source code analysis:

1. **endLine bug confirmed in source** (`structural-indexer.ts`): Every parser (`parseJsTs`, `parsePython`, `parseBash`) sets `endLine: lineNum` (same as `startLine`). In `extractEdges()`, CALLS detection uses `contentLines.slice(caller.startLine - 1, caller.endLine)` which yields a 1-line slice (declaration only). Secondary bug: `capturesToNodes()` generates `contentHash` from the same 1-line slice, breaking incremental change detection (body changes are invisible). **Fix**: Brace-counting `estimateEndLine()` for JS/TS, indentation-based end detection for Python.

2. **Missing edge type regex designs**: DECORATES uses `@(\w+)` lookahead pattern with pending-decorator buffer (confidence 0.85). OVERRIDES uses either name-match across EXTENDS chain (confidence 0.7) or TypeScript `override` keyword detection (confidence 0.95). TYPE_OF scans typed variable declarations, return types, and parameter annotations (confidence 0.85). All require `EdgeType` union update in `indexer-types.ts`.

3. **Tree-sitter WASM 4-phase migration**: Phase 1 (immediate, ~50 LOC): brace-counting endLine fix. Phase 2 (~200 LOC): optional tree-sitter behind `SPECKIT_TREE_SITTER=true` flag with `web-tree-sitter` + 4 grammar packages (`tree-sitter-javascript`, `tree-sitter-typescript`, `tree-sitter-python`, `tree-sitter-bash`). Phase 3 (~30 LOC): tree-sitter default, regex fallback. Phase 4 (-170 LOC): remove regex parsers. Revised tradeoffs: ~1.5MB total WASM bundle (core ~300KB + JS ~200KB + TS ~500KB + Python ~150KB + Bash ~100KB), ~50-200ms init, 99% parse accuracy vs ~70% regex. Adapter pattern: both parsers return `ParseResult`, tree-sitter auto-fallback to regex on failure.

4. **Budget allocator 5 improvements**: (a) Intent-aware priority reordering (structural queries prefer codeGraph, semantic prefer cocoIndex). (b) Proportional overflow distribution with weighted shares instead of greedy first-come. (c) Minimum-floor protection during trim (never trim below 50% of floor). (d) Allocation metrics telemetry (demandRatio, overflowUtilization, dropRate). (e) Dynamic source registry pattern for future sources.

5. **Ghost SymbolKinds**: `variable`, `module`, `parameter` are defined in the type but have no extraction regex. The type system promises more than the parser delivers.

**Automatic AI Utilization** (iter 057): Three-tier auto-enrichment architecture for code graph + CocoIndex without explicit tool calls:

| Tier | Trigger | Mechanism | Latency | Budget |
|------|---------|-----------|---------|--------|
| T1: Session lifecycle | SessionStart / Compaction | Background incremental code_graph_scan + ccc_reindex; preload working set neighborhoods | Zero (background) | 300-500 tokens graph, 200-400 CocoIndex |
| T2: Tool dispatch | AI calls Read/Edit/Write/Grep | Extract file_path from toolArgs, inject file outline + imports from code graph | <100ms | 200-400 tokens per enrichment |
| T3: Query-aware | memory_context/memory_search runs | Graph neighborhood expansion alongside semantic results; intent-based routing | Shares main budget | Via 3-source allocator (floors + overflow) |

Key patterns:
- **Extends proven memory-surface.ts architecture**: `autoSurfaceAtToolDispatch` already intercepts every non-memory tool call; code graph enrichment runs in parallel alongside memory auto-surface.
- **GRAPH_AWARE_TOOLS set prevents recursion**: Same pattern as MEMORY_AWARE_TOOLS — skip auto-enrichment for code_graph_* and ccc_* tools.
- **Session working set preloading**: session-prime.ts already tracks `workingSet`; feed to code_graph_context in "neighborhood" mode on session restart.
- **Lazy per-file staleness checks via `ensureFreshFiles()`** (iter 067): On `code_graph_query`/`code_graph_context` call, extract touched file paths from results, run two-tier staleness check: (1) mtime fast-path comparing `statSync().mtimeMs` against stored `code_files.file_mtime_ms` (~1ms/file), (2) content hash verification only when mtime differs (~5-20ms/file). Hybrid sync/async reindex: <=2 stale files reindexed synchronously, 3-10 files deferred to async with `freshness.reindexInProgress: true` flag, >10 files triggers nextAction suggesting full scan. Requires `ALTER TABLE code_files ADD COLUMN file_mtime_ms INTEGER` schema extension (mirrors memory system's `memory_index.file_mtime_ms` pattern). CocoIndex coordination: code graph stores `lastStaleDetectedAt` timestamp; `ccc_status` checks it and triggers `ccc_reindex({ full: false })` if recent. Session-start batch: first MCP call triggers parallel `handleCodeGraphScan({ incremental: true })` + `cccReindex({ full: false })` via `resolveTrustedSession` session detection.
- **Non-hook runtimes get Tier 2+3 automatically**: MCP server intercepts tool calls regardless of runtime. Only Tier 1 (session lifecycle) requires hooks, with instruction-file fallback.
- **Pressure-aware budget scaling**: Reuses session-prime.ts pressure calculator — reduce enrichment budget when context window filling up.

**Implementation Deep Dive** (iter 061): Source code analysis reveals critical implementation constraints and concrete integration points:

- **Interception point is context-server.ts:325-352, NOT tools/index.ts**: `dispatchTool` is a pure pass-through scanner with no middleware. All auto-enrichment must wire into the pre-dispatch block in `context-server.ts` alongside existing memory auto-surface.
- **MEMORY_AWARE_TOOLS has inverted double-check pattern**: Outer block in context-server.ts checks the set first; inner `autoSurfaceAtToolDispatch` checks again defensively. GRAPH_AWARE_TOOLS must follow the same pattern inside the generic dispatch path, not in the outer block.
- **Dedicated `extractFilePathHint(args)` needed**: Existing `extractContextHint` returns first match from `['input', 'query', 'prompt', 'specFolder', 'filePath']` which prioritizes query strings over file paths. Graph enrichment needs a file-path-specific extractor checking `['file_path', 'filePath', 'path', 'subject']` with path-shape validation.
- **250ms latency budget requires `Promise.allSettled` parallel execution**: Memory and graph auto-surface must run concurrently. Per-enrichment timeout of 150ms via `Promise.race` caps worst-case latency. Configurable via `SPECKIT_GRAPH_ENRICH_TIMEOUT`.
- **Direct handler call bypasses recursive auto-surface**: Calling `handleCodeGraphQuery` directly from the enrichment function (not through `dispatchTool`) avoids triggering the auto-surface interceptor, making GRAPH_AWARE_TOOLS a safety net rather than primary guard.
- **Hook process.exit(0) blocks background scan**: session-prime.ts calls `process.exit(0)` in finally block, killing any background work. Auto-refresh scan must be triggered in the long-lived MCP server process, not the short-lived hook script. Implementation: hook writes a "scan-requested" flag to hook state; MCP server checks flag on next tool call.
- **Working set data available but not leveraged**: session-prime.ts renders workingSet as text list but never feeds it to code_graph_query for structural preloading. Adding 3 lines to `handleStartup` injects file outlines for the top 5 recently-active files.
- **Envelope injection via `meta.graphContext`**: Same pattern as `appendAutoSurfaceHints` injecting `meta.autoSurface`. `syncEnvelopeTokenCount` automatically accounts for added graph context in token budget.

**Non-Hook Runtime UX** (iter 058): Four-tier fallback architecture for context preservation across runtimes:

| Tier | Mechanism | Runtimes | Quality |
|------|-----------|----------|---------|
| T1: Lifecycle hooks | PreCompact + SessionStart + Stop (3-source merge) | Claude Code only | Best (automatic) |
| T1.5: MCP first-call priming | Server detects first call in session, enriches response with recovery context | All runtimes (proposed) | Very good (transparent) |
| T2: Instruction-file triggers | CODEX.md / CLAUDE.md force memory_context() at session start | Codex CLI, Copilot, Gemini | Good (AI compliance dependent) |
| T3: Command-based recovery | `/spec_kit:resume` full recovery workflow | All runtimes | Good (manual trigger) |
| T4: Gate 1 automatic | CLAUDE.md Gate 1 forces memory_match_triggers() each message | All runtimes | Basic (triggered context only) |

Key findings:
- **CODEX.md already implements T2**: Explicit compaction recovery instructions with `memory_context({ mode: "resume" })` as first action.
- **Agent definitions are cross-runtime identical**: `.opencode/agent/`, `.codex/agents/`, `.claude/agents/` all declare same MCP server access (`spec_kit_memory`, `cocoindex_code`) with same workflow.
- **MCP servers cannot detect session start natively**: They are stateless request handlers. Enhancement: track last-call timestamp per session; if gap > threshold, treat next call as session restart.
- **`/spec_kit:resume` is the universal manual fallback**: 4-5 step workflow using only MCP tools (no hooks), works identically on all runtimes.
- **Unified hook abstraction layer ruled out**: Runtime hook APIs are fundamentally incompatible (Claude: stdin/stdout JSON, Copilot: .github/hooks/*.json, Gemini: different event system).

**MCP First-Call Priming Design** (iter 062): Concrete mechanism for T1.5 universal context injection:

- **Session detection primitive already exists**: `resolveTrustedSession()` in session-manager.ts returns `trusted: false` + `requestedSessionId: null` for all non-hook callers -- this is the universal "new session" signal.
- **TTL-based logical session detection**: Process-level `FirstCallTracker` singleton maintains a Map of identity hashes to first-call timestamps. Gap > 30min (matching SESSION_CONFIG.sessionTtlMinutes) = new session. False positives are harmless (additive context).
- **Interceptor layer, not mode modification**: Priming wraps existing handlers in tools/index.ts dispatch layer. Does NOT modify resolveEffectiveMode() pipeline. Priming context is appended to response envelope as `sessionPriming` field.
- **Per-tool priming behavior**: memory tools get full recovery hints (interrupted sessions, last spec folder, graph freshness); code graph tools get index freshness warnings; CocoIndex tools get availability status.
- **Token budget**: Priming tokens are additive (outside main tool budget) but capped at 300 tokens for non-memory tools, 800 for memory tools.
- **CODEX.md gap identified**: No instruction-level trigger for code_graph_status() on session start. Enhancement: add `code_graph_status()` to "Context Retrieval Primitives" as third cross-runtime primitive alongside memory_match_triggers and memory_context.

**OpenCode-Specific Integration Design** (iter 065): OpenCode is the primary non-hook runtime. Deep analysis of its agent system (.opencode/agent/), command structure (.opencode/command/spec_kit/), and MCP registration (opencode.json) reveals a 4-tier integration strategy:

- **OpenCode has NO native hook system**: Extension points are limited to MCP server registration, agent markdown definitions, and YAML command workflows.
- **@context agent is the universal enrichment gateway**: Its 3-layer retrieval sequence is the ideal injection point -- add code_graph_context as Layer 1.5 between Memory and Codebase layers.
- **Resume command is the session-start proxy**: `/spec_kit:resume` implements 4-step session recovery; adding Step 1b (index freshness check) provides index refresh on every session resume.

| Tier | Mechanism | Where to Change | Effort | Parity |
|------|-----------|----------------|--------|--------|
| A: Agent instruction triggers | Add code_graph_context to @context retrieval | .opencode/agent/context.md | Low | Auto graph enrichment |
| B: Resume command enhancement | Add index freshness step to resume | spec_kit_resume_auto.yaml | Low | Session start refresh |
| C: CLAUDE.md universal instruction | Add auto-enrichment section | Root CLAUDE.md | Low | Index staleness check |
| D: MCP first-call priming | Server-side session detection + auto-refresh | context-server.ts | Medium | Background preloading |

Tiers A-D together achieve ~90% feature parity with Claude Code hooks. The 10% gap is latency: hooks run before first AI response; MCP first-call priming adds 1-3s to first tool call.

**CocoIndex Utilization Improvements** (iter 059): Five improvement areas for better CocoIndex integration:

1. **Smarter seed resolution** (seed-resolver.ts):
   - Add "near-exact" tier: `ABS(start_line - ?) <= 3` between exact and enclosing, confidence 0.95
   - Add fuzzy name matching for manual seeds: `LIKE` fallback after exact `=` fails
   - Propagate CocoIndex similarity score into ArtifactRef confidence (currently discarded)

2. **Automatic re-indexing triggers** (3 trigger points):
   - Branch switch: detect `.git/HEAD` changes, trigger incremental `ccc index` + `code_graph_scan`
   - Session start: auto-check `ccc status` during SessionStart hook, reindex if stale
   - Debounced file save: 30s debounce window, incremental reindex of changed files

3. **Query intent router improvements**:
   - Keyword pre-classification: "who calls X" -> Code Graph impact; "find code that does X" -> CocoIndex search
   - Confidence-based fallback: low CocoIndex similarity (<0.3) -> fall back to code graph; file_anchor resolution -> suggest CocoIndex
   - Dual-query for ambiguous intents: execute both searches in parallel, merge via compact-merger

4. **Hybrid query patterns** (3 new patterns):
   - Structural expansion of semantic results: CocoIndex -> resolve seeds -> expand neighborhood automatically
   - Semantic enrichment of structural results: Code graph call chain -> CocoIndex finds similar non-connected code
   - Working set warm-up: code graph hot files + CocoIndex adjacent code on session start

5. **Underutilized CocoIndex features**:
   - Language/path filters not passed through from code graph metadata to CocoIndex searches
   - `refresh_index` session tracking needed (concurrent true requests cause ComponentContext errors)
   - `ccc_feedback` tool available but never called -- implicit positive feedback after AI uses results

---

## Part VII: Consolidation — Prioritized Implementation Backlog (Iteration 064)

### Contradiction Analysis

No fundamental contradictions between segments 4-5 and segment 6. Seven refinements identified:
- **endLine bug** elevates CALLS edge extraction from "improvable" to "non-functional" (P0 fix)
- **Tool dispatch insertion point** corrected from dispatchTool to context-server.ts pre-dispatch block
- **Session detection** corrected from "impossible for MCP servers" to "achievable via resolveTrustedSession()"
- **Index coordination** shifted from "fully independent" to "minimal shared trigger coordination"
- **Cross-runtime readiness** elevated from 3/5 to ~4/5 with MCP first-call priming design
- **Seed resolution** deepened: CocoIndex scores are discarded at integration seam, needs near-exact tier
- **Budget allocator** expanded with 5 specific production improvements

### Prioritized Backlog (Impact-to-Effort Ratio)

| Priority | Item | Impact | Effort | Depends On |
|---|---|---|---|---|
| **P0-1** | Fix endLine bug (brace-counting heuristic) | 10/10 | ~50-80 LOC | Nothing |
| **P0-2** | Fix `/spec_kit:resume` profile:"resume" | 8/10 | ~4 LOC | Nothing |
| **P1-1** | MCP first-call priming (T1.5 universal) | 9/10 | ~150-200 LOC | resolveTrustedSession() |
| **P1-2** | Tool-dispatch auto-enrichment (Tier 2) | 9/10 | ~120-180 LOC | endLine fix |
| **P1-3** | Near-exact seed resolution + score propagation | 7/10 | ~60-80 LOC | seed-resolver.ts |
| **P1-4** | DECORATES + OVERRIDES + TYPE_OF edges | 7/10 | ~120-160 LOC | endLine fix |
| **P2-1** | Auto-reindex triggers (3 triggers) | 6/10 | ~100-150 LOC | scan/reindex APIs |
| **P2-2** | Budget allocator improvements (2 of 5) | 6/10 | ~80-120 LOC | budget-allocator.ts |
| **P2-3** | Query-intent pre-classification | 6/10 | ~60-100 LOC | Intent router |
| **P2-4** | Session lifecycle preloading (Tier 1) | 7/10 | ~150-200 LOC | Hook system |
| **P2-5** | Missing SymbolKinds | 4/10 | ~40-60 LOC | endLine fix |
| **P2-6** | Missing query API operations | 5/10 | ~100-150 LOC/op | Schema |
| **P3-1** | Instruction-file updates (CODEX.md etc.) | 4/10 | ~20-40 LOC | Nothing |
| **P3-2** | ccc_feedback implicit positive feedback | 3/10 | ~30-50 LOC | ccc_feedback API |
| **P3-3** | Hybrid query patterns (3 patterns) | 5/10 | ~200-300 LOC | Seeds + router + indexes |
| **P3-4** | Tree-sitter WASM migration (phases 2-4) | 8/10 | ~400-600 LOC | Phase 1 brace-fix |
| **P3-5** | Min-floor trim protection + telemetry | 3/10 | ~40-60 LOC | Allocator works |
| **P3-6** | Dynamic source registry | 2/10 | ~60-80 LOC | Allocator exists |

### Gaps Identified

| Gap | Severity | Status |
|---|---|---|
| Testing strategy for auto-enrichment | Medium | Addressed (iteration 069) -- 6 new test files, 40 test cases designed |
| Performance benchmarks for 3-source merge | Low | Theoretical only |
| Error recovery for failed auto-enrichment | Medium | Degrade-not-fail principle stated but no concrete paths |
| Migration path phases 2-4 detail | Medium | Sketch-level |
| CocoIndex availability graceful degradation | Low | Partial |

### Modified Prior Conclusions

1. MVP scope: 850-1,200 LOC + ~50-80 LOC critical bugfix = **900-1,280 LOC**
2. Index coordination: "no shared event bus" refined to "minimal shared trigger mechanism"
3. Cross-runtime readiness: elevated 3/5 to ~4/5 with first-call priming
4. Auto-surface insertion point: context-server.ts, not tool handler layer
5. CocoIndex/Code Graph independence: true at index level, tightly integrated at query level

---

## Part VIII: Implementation Phasing Roadmap (Iteration 068)

### Phase Overview

The prioritized backlog (Part VII) maps into 4 implementation phases, 11 sub-phases, with a total net delta of 654-932 LOC.

| Phase | Focus | Net LOC | Risk | Sessions |
|-------|-------|---------|------|----------|
| **A** | P0 endLine fix | +60-80 | Low | 1-2 |
| **B** | Auto-enrichment (B1 stale-on-read, B2 first-call priming, B3 GRAPH_AWARE_TOOLS) | +291-389 | Medium | 5-8 |
| **C** | Tree-sitter WASM (C1 adapter, C2 parser, C3 new edges, C4 regex removal) | +200-315 net | High | 7-10 |
| **D** | Cross-runtime UX (D1 agent instructions, D2 resume command, D3 instruction files) | +100-168 | Low | 3 |

### Critical Path

```
A (endLine fix) --> B1 (stale-on-read) --> B2/B3 (parallel) --> D (cross-runtime)
A (endLine fix) --> C1 (adapter) --> C2 (WASM) --> C3 (edges) --> C4 (cleanup)
```

### Phase A: P0 Critical Fixes (60-80 LOC, LOW risk)

Primary target: `structural-indexer.ts` (473 lines). Add brace-counting endLine detection to `parseJsTs()` (+25-35 LOC helper + 10 LOC call sites), indentation-based to `parsePython()` (+15-20 LOC), brace-counting to `parseBash()` (+10 LOC). No other files need changes -- `extractEdges()` and `capturesToNodes()` already use `endLine` correctly.

### Phase B: Auto-Enrichment Infrastructure (291-389 LOC, MEDIUM risk)

Three sub-phases with internal dependency ordering (B1 before B2/B3):

- **B1 Stale-on-read** (76-104 LOC): Add `ensureFreshFiles()` to `code-graph-db.ts`, `file_mtime_ms` schema column, mtime fast-path. Modify `handlers/code-graph/query.ts` and `context.ts` to call it.
- **B2 First-call priming** (110-150 LOC): Add `FirstCallTracker` singleton to `hooks/memory-surface.ts`, priming payload in `handlers/memory-context.ts`, `getQuickSummary()` in `code-graph-context.ts`.
- **B3 GRAPH_AWARE_TOOLS** (105-135 LOC): Add interceptor to `hooks/memory-surface.ts` (follows existing `MEMORY_AWARE_TOOLS` pattern), `getFileContext()` in `code-graph-context.ts`.

### Phase C: Tree-Sitter WASM Migration (320-465 new, -120-150 removed, HIGH risk)

- **C1 Adapter** (40-60 LOC): Extract `ParseResult` interface in `structural-indexer.ts`.
- **C2 WASM Parser** (200-280 LOC): New file `tree-sitter-parser.ts`, add `web-tree-sitter` + 4 grammar packages (~1.5MB). Cold start risk (50-200ms); mitigate with lazy init.
- **C3 New Edge Types** (83-125 LOC): Add DECORATES, OVERRIDES, TYPE_OF extraction in `structural-indexer.ts` + enum updates in `indexer-types.ts`.
- **C4 Regex Removal** (-120-150 LOC): Remove `parseJsTs()`, `parsePython()`, `parseBash()` after extensive testing.

### Phase D: Cross-Runtime UX (100-168 LOC, LOW risk)

- **D1 Agent instructions** (50-70 LOC): Update 4 agent definition files (`.opencode/agent/context.md`, `.claude/agents/context.md`, `.codex/agents/context.toml`, `.agents/agents/context.md`) with Layer 1.5 code_graph_context.
- **D2 Resume command** (20-30 LOC): Add index freshness step to both `spec_kit_resume_auto.yaml` and `spec_kit_resume_confirm.yaml`.
- **D3 Instruction files** (30-48 LOC): Update CLAUDE.md, CODEX.md, SKILL.md with code graph references.

Rollout: start with OpenCode (primary runtime), mirror to Claude, then Codex/Copilot. Each runtime independent.

---

## Part IX: Error Recovery and Graceful Degradation (Iteration 071)

### Current Error Handling Posture

The existing codebase uses a **"never-block" guarantee** in hooks: `main().catch(log).finally(exit(0))`. This ensures hook failures never block the Claude Code session, but at the cost of invisible error reporting (stderr-only).

Three concrete gaps identified:

| Gap | Severity | Location | Impact |
|-----|----------|----------|--------|
| `initDb()` has no try/catch | P0 | code-graph-db.ts:71-80 | Corrupt/locked DB crashes MCP server |
| No `SQLITE_BUSY` handling | P1 | code-graph-db.ts (all queries) | Write contention throws unhandled exception |
| `getRecoveryApproach()` unwired | P2 | runtime-detection.ts:52-54 | Designed degradation signals never consumed |

### Graceful Degradation Cascade (4 Levels)

| Level | Name | Sources Available | Trigger | Action |
|-------|------|-------------------|---------|--------|
| 0 | Full | Code Graph + CocoIndex + Memory | Default | 3-source merge |
| 1 | Graph-down | CocoIndex + Memory | `initDb()` throws or `getStats()` null | Skip codeGraph in MergeInput, log warning |
| 2 | Graph+Coco-down | Memory only | CocoIndex binary missing AND graph unavailable | Constitutional + triggered memories only |
| 3 | All-down | Bare session recovery | MCP server unreachable | Instruction-file prompts (CLAUDE.md, CODEX.md) |

Implementation: A `DegradationLevel` enum (0-3) computed once per session via `computeDegradationLevel()` that probes each source. Passed into `mergeCompactBrief` to reallocate token budgets (e.g., Level 1 moves code graph's 1200-token floor to CocoIndex and memory). Estimated: ~60 LOC.

### DB Auto-Rebuild Strategy

The code graph DB is **fully reconstructable** from source files (unlike the memory index which contains user-authored content). Auto-rebuild design:

1. **In `initDb()`**: Wrap `new Database()` + `db.exec(SCHEMA_SQL)` in try/catch
2. **On `SQLITE_CORRUPT` / `SQLITE_NOTADB` / `SQLITE_CANTOPEN`**: Rename corrupt file to `code-graph.sqlite.corrupt.{timestamp}`, create fresh DB, set `needsFullRescan` flag
3. **On next `code_graph_scan`**: Check flag, run full rescan instead of incremental
4. **For `SQLITE_BUSY`**: Add `db.pragma('busy_timeout = 3000')` for automatic retry on write contention
5. Continue at Level 1 degradation until rescan completes

Estimated: ~50 LOC (40 in initDb + 10 in scan handler).

### Existing Patterns to Extend

- **compact-inject.ts**: Already demonstrates 2-tier source fallback (merged -> legacy). Extend to per-source try/catch within the merge pipeline.
- **session-prime.ts**: Already demonstrates dynamic import guard for optional code graph dependency. Extend to all optional sources.
- **shared.ts `withTimeout()`**: Already provides timeout-with-fallback. Extend to wrap individual source queries in the budget allocator.

---

## Part X: Final Synthesis -- Complete Research Program Summary (95 Iterations)

> **95 iterations across 7 segments** | Segment 7 adds verification and cross-runtime truth-sync via Copilot CLI (GPT-5.4)

### Executive Summary

This research program evaluated, designed, specified, and then revalidated a comprehensive upgrade to the Spec Kit Memory MCP system's context preservation and code understanding capabilities. The program spanned 95 iterations across 7 segments, using four execution modes (orchestrator-driven research, parallel GPT-5.4 Codex agents, Claude Opus deep-research iterations, and GPT-5.4 verification passes via Copilot CLI).

**Key decisions:**
1. **REJECT** Codex-CLI-Compact (Dual-Graph) -- proprietary graperoot core, CLAUDE.md conflicts, workflow collisions
2. **BUILD** hybrid hook+tool context injection architecture for Claude Code (PreCompact + SessionStart + Stop)
3. **BUILD** clean-room structural code graph using tree-sitter + SQLite, integrated into existing MCP search pipeline
4. **USE** CocoIndex as complementary semantic layer -- no overlap with structural code graph
5. **BUILD** 4-tier cross-runtime fallback for non-hook CLI runtimes (hooks -> MCP priming -> instruction files -> Gate 1)
6. **FIX** critical endLine bug that renders normal multi-line `CALLS` extraction severely degraded (P0, zero dependencies)
7. **VERIFY BEFORE IMPLEMENTING** -- Segment 7 showed that several auto-enrichment and runtime-parity ideas are still design work, not shipped behavior, until explicitly implemented

### Segment 6 Summary (Iterations 56-75, Feature Improvements + UX)

Segment 6 investigated four research questions with Claude Opus deep-research iterations:

**Q13 -- Feature Improvements** (iterations 056, 060, 066):
- P0 bug: `endLine = startLine` in all 3 parsers makes CALLS edge detection scan only declaration lines, not function bodies. Secondary bug: `contentHash` computed from 1-line slice, breaking change detection.
- Fix: brace-counting `estimateEndLine()` for JS/TS/Bash (~50-80 LOC), indentation-based for Python
- 3 missing edge types: DECORATES (decorator->target), OVERRIDES (subclass->parent method), TYPE_OF (symbol->type)
- tree-sitter WASM 4-phase migration: brace-fix (immediate) -> optional WASM (flag-gated) -> WASM default -> regex removal. Revised bundle: ~1.5MB (not 8-15MB). Parser-agnostic `ParseResult` interface means zero changes to downstream consumers.
- Budget allocator: 5 improvements (intent-aware priority, proportional overflow, min-floor protection, metrics telemetry, dynamic source registry)

**Q14 -- Automatic AI Utilization** (iterations 057, 061):
- 3-tier auto-enrichment: T1 session lifecycle (background preloading), T2 tool dispatch (file-path-aware injection via GRAPH_AWARE_TOOLS interceptor), T3 query-aware (graph expansion alongside semantic results via 3-source allocator)
- Interception point: `context-server.ts:325-352` pre-dispatch block (NOT `dispatchTool`)
- `GRAPH_AWARE_TOOLS` follows proven `MEMORY_AWARE_TOOLS` pattern with inverted set logic
- 250ms latency budget requires `Promise.allSettled` parallel execution with 150ms per-enrichment timeout
- Non-hook runtimes get T2+T3 automatically (MCP server intercepts regardless of runtime)

**Q15 -- Non-Hook Runtime UX** (iterations 058, 062, 065):
- 4-tier fallback: T1 hooks (Claude only), T1.5 MCP first-call priming (universal, proposed), T2 instruction-file triggers (CODEX.md etc.), T3 command-based (`/spec_kit:resume`), T4 Gate 1 auto
- MCP first-call priming: `resolveTrustedSession()` returns `trusted:false + requestedSessionId:null` for all non-hook callers = universal "new session" signal. TTL-based `FirstCallTracker` singleton with 30min gap detection.
- OpenCode 4-tier integration: A (agent instruction triggers), B (resume command enhancement), C (CLAUDE.md universal instruction), D (MCP first-call priming). Tiers A-D achieve ~90% parity with Claude Code hooks.

**Q16 -- CocoIndex Utilization** (iterations 059, 063):
- Near-exact seed resolution tier: `ABS(start_line - ?) <= 3` between exact and enclosing (confidence 0.95)
- CocoIndex score propagation: similarity scores currently discarded at integration seam; blend into ArtifactRef confidence
- 3 auto-reindex triggers: branch switch (.git/HEAD), session start (ccc_status), debounced file save (30s)
- 3 hybrid query patterns: structural expansion of semantic results, semantic enrichment of structural results, working set warm-up
- Underutilized features: language filters, refresh_index management, ccc_feedback implicit positive feedback

### Prioritized Implementation Roadmap

From consolidation iteration 064 and phasing iteration 068:

| Phase | Focus | LOC (net) | Risk | Sessions | Key Files |
|-------|-------|-----------|------|----------|-----------|
| **A** | P0 endLine fix | +60-80 | Low | 1-2 | structural-indexer.ts |
| **B1** | Stale-on-read | +76-104 | Low | 1-2 | code-graph-db.ts, handlers/ |
| **B2** | MCP first-call priming | +110-150 | Med | 2-3 | memory-surface.ts, memory-context.ts |
| **B3** | GRAPH_AWARE_TOOLS | +105-135 | Med | 2-3 | memory-surface.ts, code-graph-context.ts |
| **C1** | Parser adapter | +40-60 | Low | 1 | structural-indexer.ts |
| **C2** | Tree-sitter WASM | +200-280 | High | 3-5 | NEW: tree-sitter-parser.ts |
| **C3** | New edge types | +83-125 | Med | 2-3 | structural-indexer.ts, indexer-types.ts |
| **C4** | Regex removal | -120-150 | Med | 1 | structural-indexer.ts |
| **D1** | Agent instructions | +50-70 | Low | 1 | 4 agent definition files |
| **D2** | Resume command | +20-30 | Low | 1 | 2 YAML workflow files |
| **D3** | Instruction files | +30-48 | Low | 1 | CLAUDE.md, CODEX.md, SKILL.md |
| **TOTAL** | | **+654-932** | | **16-26** | |

Critical path: `A -> B1 -> B2/B3 (parallel) -> D` and `A -> C1 -> C2 -> C3 -> C4`

### Performance Constraints (Iteration 070)

| Resource | Budget | Measured/Estimated | Headroom |
|----------|--------|-------------------|----------|
| Hook timeout | 1800ms hard cap | 1-50ms current usage | ~1750ms |
| SQLite 1-hop expansion | 400ms deadline | 1-9ms typical | ~391ms |
| Token estimation accuracy | +/-25% | chars/4 heuristic | Acceptable for rough budgeting |
| CocoIndex MCP roundtrip | N/A (not in hook path) | 100-500ms | Must be tool-dispatch-time only |
| Tree-sitter per-file parse | <50ms target | 5-50ms (size dependent) | Meets target; cold start 50-200ms |
| Staleness check (20 files) | <5ms | ~2ms | Negligible |

### Error Recovery Design (Iteration 071)

**Current state**: Hooks use "never-block" pattern (`main().catch().finally(exit(0))`). Three gaps: no `initDb()` try/catch, no `SQLITE_BUSY` retry, `getRecoveryApproach()` unwired.

**Designed 4-level degradation cascade**:
- Level 0 (full): Code Graph + CocoIndex + Memory
- Level 1 (graph-down): CocoIndex + Memory (code graph DB unavailable)
- Level 2 (graph+coco-down): Memory only (both unavailable)
- Level 3 (all-down): Instruction-file prompts (CLAUDE.md, CODEX.md)

**DB auto-rebuild**: Code graph DB is fully reconstructable from source via `code_graph_scan`. On corruption: rename corrupt file, create fresh DB, set `needsFullRescan` flag. `SQLITE_BUSY`: add `busy_timeout = 3000` pragma. Estimated: ~50 LOC.

### Testing Strategy Summary (Iteration 069)

6 new test files designed, ~40 test cases:
- `structural-indexer.test.ts`: endLine correctness, multi-language, edge cases (strings with braces, template literals)
- `edge-extraction.test.ts`: DECORATES, OVERRIDES, TYPE_OF extraction with fixture files
- `auto-enrichment.test.ts`: GRAPH_AWARE_TOOLS interceptor, file path extraction, parallel execution, recursion prevention
- `stale-on-read.test.ts`: mtime fast-path, content hash fallback, sync vs async threshold, schema migration
- `cross-runtime.test.ts`: Runtime detection simulation, fallback tier verification, instruction file parsing
- `integration.test.ts`: Full pipeline E2E (scan -> query -> context -> enrich)

Follows established patterns: inline content strings, direct module imports, `vi.stubEnv()` save/restore.

### Cross-Runtime UX Comparison (Iterations 058, 062, 065)

| Capability | Claude Code | OpenCode | Codex CLI | Copilot CLI | Gemini CLI |
|------------|:-----------:|:--------:|:---------:|:-----------:|:----------:|
| Lifecycle hooks | Full (25 events) | None | None | Limited (8 events) | Limited |
| Auto context injection | SessionStart | MCP priming (proposed) | MCP priming | MCP priming | MCP priming |
| Compaction recovery | PreCompact cache + inject | Instruction-file trigger | CODEX.md trigger | Instruction-file | Instruction-file |
| Token tracking | Stop hook | None (future) | None | None | None |
| Session detection | Hook session_id | resolveTrustedSession | resolveTrustedSession | resolveTrustedSession | resolveTrustedSession |
| Code graph auto-enrich | T1+T2+T3 (all tiers) | T2+T3 (tool dispatch) | T2+T3 | T2+T3 | T2+T3 |
| Parity estimate | 100% | ~90% | ~85% | ~80% | ~75% |

Universal mechanism across all runtimes: MCP first-call priming (T1.5) detects new sessions via `resolveTrustedSession()` and injects recovery context + graph freshness summary on first tool call.

### Open Items and Recommended Next Steps

1. **Immediate** (before implementation): Fix `/spec_kit:resume` `profile: "resume"` defect in all 4 YAML blocks (~4 LOC)
2. **Phase A**: Implement endLine brace-counting fix (60-80 LOC, zero dependencies, 1-2 sessions)
3. **Phase B**: Build auto-enrichment infrastructure (291-389 LOC, 5-8 sessions)
4. **Phase C**: Tree-sitter WASM migration (320-465 new LOC, 7-10 sessions, highest risk)
5. **Phase D**: Cross-runtime instruction updates (100-168 LOC, 3 sessions, lowest risk)
6. **Deferred**: Performance benchmarks on real workload, error telemetry observability, Phases 5-7 of original hook architecture (810-1,650 LOC)

### Convergence Report

| Segment | Iterations | newInfoRatio Range | Final |
|---------|-----------|-------------------|-------|
| 1 | 001-010 | 0.15-0.95 | Converged (all 5 questions answered) |
| 2 | 011-015 | 0.44-0.88 | Converged (architecture designed) |
| 3 | 016-035 | 0.41-0.90 | Converged (implementation-ready) |
| 4 | 036-045 | 0.73-0.88 | Converged (code graph specified) |
| 5 | 046-055 | 0.49-0.76 | Converged (integration designed) |
| 6 | 056-075 | 0.10-0.80 | Converged (implementation phased) |
| 7 | 076-095 | 0.18-0.83* | Verification complete; design claims truth-synced against live code |

All 16 research questions remain answered. Segment 7 converted the remaining uncertainty into a concrete verification and hardening backlog. The program is ready for implementation, but only with truth-sync and P1 hardening at the front of the queue.

*Segment 7 range is derived from the locally available verification artifacts plus this final synthesis iteration; standalone markdown files for `090`, `092`, `093`, and `094` were not present in the final-synthesis workspace.*

---

## Part XI: Segment 7 -- Verification via Copilot CLI (GPT-5.4)

> **Segment 7 scope:** 20 planned verification iterations via `copilot -p` (GPT-5.4, high reasoning) across 5 waves of 4. The local workspace used for this final synthesis contains direct artifacts for iterations `076-089` and `091` plus the canonical `deep-research-state.jsonl`; standalone markdown files for `090`, `092`, `093`, and `094` were not present, so the scorecard, roadmap, and parity outputs below are reconstructed from the available segment evidence rather than quoted from absent files.

### Executive Summary

Segment 7 changed the program from design expansion into source-level truth-sync. The verification tranche:
- **confirmed** the core structural and hook-state correctness issues from Segment 6;
- **modified** several claims that had drifted from "design proposal" into "sounds implemented";
- **refuted** one reviewed P1 and a smaller set of stale runtime assumptions.

Confirmed items included the still-live `endLine` range collapse, the missing edge and symbol coverage, the pre-dispatch interception seam in `context-server.ts`, the need for instruction-led startup recovery outside Claude hooks, and multiple active review findings around stale compact recovery, surrogate stop-time auto-save, seed-identity stripping, and unvalidated scan roots.

Modified items included the exact wording of the `CALLS` failure mode (severely degraded, not universal zero), Phase B ownership (`context-server.ts` is mandatory and `code-graph-db.ts` belongs to stale-on-read/B1 rather than the minimal Phase A fix), and the status of the performance and auto-enrichment work (useful design budgets, but not yet live measured pipeline behavior). Several Q14/Q16 items -- `GRAPH_AWARE_TOOLS`, first-call priming, near-exact seed resolution, auto-reindex triggers, and hybrid query execution -- were reaffirmed as **recommended future work**, not shipped behavior.

Refuted items were smaller but important: the reviewed P1-3 stop-hook recursion finding does not match current code, Copilot startup behavior is instruction-file-driven rather than agent-profile-driven, and upstream Gemini can no longer be treated as simply "hookless."

### Updated Implementation Roadmap

| Order | Workstream | Verification outcome | Recommended scope |
|---|---|---|---|
| **0** | Truth-sync + boundary hardening | New precondition surfaced by Segment 7 | Centralize and actually enforce tool arg validation, workspace-bound `rootDir`, sanitize MCP error text, and reopen overstated phase/checklist claims |
| **1** | Hook/cache correctness | Still release-blocking | Fix `pendingCompactPrime` lifecycle, save-failure signaling, stale `cachedAt` reuse, and stop-time surrogate auto-save |
| **2** | Structural graph correctness | Still foundational | Land the `endLine` fix, preserve seed identity through the public handler, initialize DB safely on first scan, and keep JS/TS method coverage on the near path |
| **3** | Budget integrity + stale-on-read | Promote ahead of feature growth | Remove allocator ceiling assumptions, suppress zero-budget sections, budget `sessionState`, then add stale-on-read once DB init is reliable |
| **4** | Cross-runtime startup protocol | Still worth doing, but docs/workflows first | Standardize a runtime-neutral Session Start Protocol across `AGENTS.md`/`CLAUDE.md`, `CODEX.md`, `GEMINI.md`, OpenCode agents, and resume workflows |
| **5** | Auto-enrichment features | Keep as post-hardening work | First-call priming, `GRAPH_AWARE_TOOLS`, auto-reindex triggers, and hybrid query patterns remain design-only until the earlier correctness/security work lands |
| **6** | Tree-sitter / richer edges | Still attractive, not first | Parser adapter, WASM migration, `DECORATES`/`OVERRIDES`/`TYPE_OF`, and regex retirement |

**Roadmap change from Segment 6:** the earlier 4-phase build plan remains structurally useful, but Segment 7 moves correctness, security, and truth-sync work **ahead of** richer automation. The first executable slice now starts with hardening and verification cleanup rather than jumping straight to transparent auto-enrichment.

### Cross-Runtime UX Parity Matrix

| Runtime | Primary startup surface | Hook reality | Recommended session-start pattern | Practical parity |
|---|---|---|---|---|
| **Claude Code** | `SessionStart` / `PreCompact` / `Stop` hooks | Full hook lifecycle | Keep hook-driven recovery, but harden stale-cache, provenance, and stop-save behavior | **100% ceiling / current leader** |
| **OpenCode** | `AGENTS.md`, `.opencode/agent/*.md`, `spec_kit_resume_auto.yaml` | No native hooks | Add reusable Session Start Protocol + `code_graph_status()` in the earliest context-loading step; keep graph expansion query-driven | **~90%** |
| **Codex CLI** | `CODEX.md`, `.codex/agents/context.toml` | No native hooks | Force first-turn `memory_context(...)` + `code_graph_status()` via instructions; do not rely on hook-style implicit warmup | **~85%** |
| **Copilot CLI** | `AGENTS.md`, `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md` | Instruction-first in this repo; optional agent profiles are not the startup contract | Put global startup priming in shared instruction files; gate graph work on structural intent and freshness, not every turn | **~80%** |
| **Gemini CLI** | `GEMINI.md`, `.gemini/settings.json` | Upstream hooks exist, but repo parity is not wired today | Support instruction-first parity now; optionally add Gemini-native hooks later for near-Claude behavior | **~75% instruction-only / ~88% with hooks** |

### Revised P1 Verification Status

| Bucket | Count | Notes |
|---|---:|---|
| **Confirmed active** | **6** | P1-1, P1-2, P1-4, P1-5, P1-6, and P1-10 remained live in the locally available verification set |
| **False positive** | **1** | P1-3 did not match current `session-stop.ts` behavior |
| **Not recoverable as local standalone artifacts** | **3** | The expected remaining wave-4 and scorecard artifacts were not present as standalone markdown files in the final-synthesis workspace |

This tally is intentionally conservative: it reflects only the Segment 7 verification evidence present locally (`076-089`, `091`, and `deep-research-state.jsonl`) rather than inventing results for missing standalone artifacts.

### Final Recommendations

1. Treat Segment 6 auto-enrichment and cross-runtime material as a **validated design backlog**, not as shipped behavior.
2. Start implementation with **truth-sync + P1 hardening**: hook cache lifecycle, stale reuse, validation boundaries, budget integrity, and error sanitization.
3. Keep the **endLine / range / seed-identity** fixes near the front of the queue because they unblock both correctness and future structural retrieval quality.
4. Standardize a **Session Start Protocol** across Claude/OpenCode/Codex/Copilot/Gemini docs before attempting transparent priming features.
5. Re-run deep review and a shorter verification wave after remediation; Segment 7 showed that design claims drift unless they are periodically revalidated against live code.

---

## Appendix: Full Iteration Index (Updated)

| Iter | Lines | Focus |
|------|------:|-------|
| 001-010 | ~5K | Dual-Graph evaluation: REJECTED |
| 011-015 | ~5K | Hook+tool architecture design |
| 016 | 71 | autoSurfaceAtCompaction API |
| 017 | 166 | memory_context resume flow |
| 018 | 102 | Claude hooks stdin/stdout schemas |
| 019 | 333 | Transcript JSONL format (640 files analyzed) |
| 020 | 43 | Hook-state design patterns |
| 021 | 42 | Vitest test framework patterns |
| 022 | -- | Query router and hybrid search (pending) |
| 023 | 300 | Settings merge strategy |
| 024 | 96 | Token budget and truncation |
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
| 046 | 284 | CocoIndex-Code Graph bridge design |
| 047 | 70 | tree-sitter-CocoIndex chunk alignment |
| 048 | 275 | Query-intent router for code queries |
| 049 | 213 | Token budget allocation across 3 sources |
| 050 | 572 | Compact repo map generation |
| 051 | 134 | Incremental index coordination |
| 052 | 301 | Compaction 3-source merge strategy |
| 053 | 192 | Session working set tracking |
| 054 | 549 | code_graph_context API with CocoIndex seeds |
| 055 | 282 | Implementation readiness assessment |
| 056 | ~280 | Feature improvements: endLine bug, edge types, SymbolKinds, budget allocator, merger |
| 057 | ~260 | Automatic AI utilization: 3-tier auto-enrichment architecture |
| 058 | ~250 | Non-hook CLI runtime UX: 4-tier fallback architecture |
| 059 | ~200 | CocoIndex utilization: seed resolution, auto-reindex, hybrid queries |
| 060 | ~320 | Q13 deep dive: endLine source trace, regex designs, tree-sitter migration, allocator |
| 061 | ~300 | Q14 deep dive: auto-enrichment interceptor architecture from source code |
| 062 | ~280 | Q15 deep dive: MCP first-call priming with session detection |
| 063 | ~260 | Q16 deep dive: seed resolution chain, auto-reindex, hybrid queries |
| 064 | ~350 | CONSOLIDATION: contradiction analysis, prioritized 18-item backlog |
| 065 | ~280 | OpenCode-specific: agent architecture, MCP registration, 4-tier integration |
| 066 | ~300 | Tree-sitter WASM: regex parser analysis, S-expression queries, adapter design |
| 067 | ~280 | Auto-indexing: stale-on-read, mtime fast-path, per-file granularity |
| 068 | ~275 | IMPLEMENTATION PHASING: 4 phases, 11 sub-phases, 654-932 LOC |
| 069 | ~260 | Testing strategy: 6 test files, 40 test cases |
| 070 | ~250 | Performance analysis: 1800ms budget, SQLite <10ms, CocoIndex 100-500ms |
| 071 | ~240 | Error recovery: 4-level degradation, DB auto-rebuild |
| 072-074 | -- | Skipped (convergence achieved) |
| 075 | ~120 | FINAL SYNTHESIS: complete program summary and convergence report |
| 076 | 78 | Q13 verification: endLine, edge coverage, ghost SymbolKinds, allocator limits |
| 077 | 94 | Q14 verification: pre-dispatch seam confirmed; graph auto-enrichment still design-only |
| 078-083 | -- | JSONL-only verification passes: runtime UX, Q16 design-vs-shipped status, phasing, tests, performance, and error recovery |
| 084 | 183 | OpenCode Session Start Protocol, agent insertion map, and resume injection point |
| 085-087 | -- | JSONL-only runtime deep dives: Codex, Copilot, and Gemini startup/parity surfaces |
| 088 | 64 | Review P1 1-3 verification -- P1-3 became false positive |
| 089 | 123 | Review P1 4-6 verification -- all three remained active |
| 090 | -- | Expected review-wave artifact not present locally at final synthesis time |
| 091 | 109 | Review P1-10 plus key P2 verification |
| 092-094 | -- | Expected verification scorecard, updated roadmap, and parity-matrix artifacts not present locally; reconstructed in Part XI from the available Segment 7 evidence |
| 095 | -- | FINAL SYNTHESIS: Segment 7 verification summary, updated roadmap, parity matrix, and revised P1 tally |
