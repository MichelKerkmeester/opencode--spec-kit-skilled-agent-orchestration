# Iteration 003 — Feature Comparison: Dual-Graph vs Spec Kit Memory

**Focus:** Side-by-side comparison of approaches, tools, and capabilities
**Status:** complete
**newInfoRatio:** 0.70
**Novelty:** Direct comparison reveals systems are complementary, not competitive — they solve fundamentally different problems.

---

## Findings

### 1. Core Approach Comparison

| Dimension | Dual-Graph | Spec Kit Memory |
|-----------|-----------|-----------------|
| **Core Concept** | Static code graph (files, functions, imports) | Semantic memory with vector embeddings |
| **What it indexes** | Code structure & relationships | Conversation context & decisions |
| **When it runs** | Pre-session scan, then per-query ranking | Continuous — save/search across sessions |
| **Search method** | Graph traversal + file ranking | Hybrid: vector + BM25 + graph + causal |
| **Data format** | JSON files (info_graph.json) | SQLite with embedding vectors |
| **Primary value** | Token reduction via smart file pre-loading | Cross-session context preservation |
| **Language** | Python (proprietary graperoot) | TypeScript (open source) |
| **Protocol** | MCP (HTTP transport) | MCP (stdio transport) |

### 2. Tool Surface Area

| Category | Dual-Graph (~7 tools) | Spec Kit Memory (33 tools) |
|----------|----------------------|--------------------------|
| **Context retrieval** | graph_continue, graph_read | memory_context, memory_search, memory_quick_search |
| **Scanning** | graph_scan | memory_index_scan, memory_ingest_* |
| **Memory persistence** | graph_add_memory (15-word max) | memory_save (full context documents) |
| **Edit tracking** | graph_register_edit | Handled via spec folder lifecycle |
| **Session management** | Implicit (chat_action_graph) | Explicit: session IDs, dedup, working memory |
| **Analytics** | count_tokens, get_session_stats | eval_*, memory_drift_why, memory_causal_* |
| **Checkpoints** | None | checkpoint_create/list/restore/delete |
| **Multi-tenant** | None | shared_space_*, membership management |
| **Health/Ops** | None | memory_health, memory_stats, memory_validate |

### 3. What Each System Does Better

**Dual-Graph excels at:**
- Pre-loading relevant code files (structural context)
- Import relationship awareness
- Token budget management (per-file + per-turn limits)
- Zero-configuration project scanning
- Confidence-based retrieval limits

**Spec Kit Memory excels at:**
- Cross-session context preservation
- Intent-aware retrieval (7 intent types)
- Causal relationship tracking
- Constitutional memories (always-surface rules)
- Session deduplication (~50% token savings on follow-ups)
- Multi-tenant/shared memory spaces
- Ablation studies and evaluation dashboards
- Checkpoint/restore for state management

### 4. Overlap Analysis
| Capability | Dual-Graph | Spec Kit Memory | Overlap? |
|------------|-----------|-----------------|----------|
| Code structure awareness | Strong | None | No overlap |
| Semantic search | None | Strong (vector) | No overlap |
| Session memory | Basic (JSON file) | Advanced (working memory + decay) | Partial |
| Decision persistence | Basic (15-word entries) | Full documents with metadata | Minimal |
| Token tracking | Dashboard | Token budget enforcement | Complementary |
| Multi-session | Context-store.json | SQLite + embeddings | Different approach |

### 5. Key Insight: Different Problem Domains
- **Dual-Graph** solves: "Which files should the AI read for THIS query?"
- **Spec Kit Memory** solves: "What did we learn in PREVIOUS sessions that's relevant?"
- These are **orthogonal problems** — both could coexist without conflict

---

## Dead Ends
- Tried to find feature overlap for direct replacement — systems are too different
- Token counting approaches are complementary, not competitive

## Sources
- [SOURCE: iteration-001.md] — Dual-Graph architecture
- [SOURCE: iteration-002.md] — Spec Kit Memory architecture
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts]
