# Deep Research: Codex-CLI-Compact (Dual-Graph) Evaluation

## 1. Executive Summary

**Recommendation: Do NOT adopt Dual-Graph. Build a clean-room code graph channel using tree-sitter within our existing Spec Kit Memory MCP architecture.**

Dual-Graph (marketed as Codex-CLI-Compact) is a context optimization engine that builds a semantic code graph to reduce AI token consumption by 30-45%. While it solves a real problem, its proprietary core engine (graperoot), CLAUDE.md conflicts, workflow incompatibilities, security/privacy concerns, and poor architectural fit make it unsuitable for our multi-skill, multi-agent repository. Our existing MCP server already has the infrastructure (hybrid search pipeline with graph channel) to add code graph functionality natively.

---

## 2. Research Topic

Evaluate whether Codex-CLI-Compact (Dual-Graph) can upgrade our Spec Kit Memory MCP system, whether we should install and use it directly, and how well it fits our multi-skill, multi-agent repo context with system-spec-kit.

---

## 3. Key Findings

### 3.1 What Dual-Graph Is
- Context optimization engine reducing token consumption by 30-45%
- Three-stage pipeline: graph construction → context injection → session memory
- Builds semantic graph of codebase: files, functions, classes, import relationships
- Exposes graph through MCP server (7 tools)
- **Core engine "graperoot" is PROPRIETARY** (Cython-compiled, distributed via PyPI)
- Open-source portion limited to: bash launchers, benchmarks, dashboard, install scripts
- [SOURCE: https://github.com/kunal12203/Codex-CLI-Compact]

### 3.2 What Our System Already Does
- Spec Kit Memory MCP server: 33 tools across 7 layers (L1 orchestration → L7 maintenance)
- Hybrid search: vector embeddings + FTS5 + BM25 + graph + degree channels
- Cognitive layers: working memory, attention decay, co-activation, archival
- Constitutional memories, causal relationships, shared spaces
- Cross-session context preservation with intent-aware routing
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/]

### 3.3 Systems Are Complementary, Not Competitive
- **Dual-Graph solves:** "Which files should the AI read for THIS query?" (structural context)
- **Spec Kit Memory solves:** "What did we learn in PREVIOUS sessions?" (semantic memory)
- These are orthogonal problems — both could theoretically coexist

### 3.4 Integration Is Not Viable
- Cannot extract graperoot logic (proprietary, Cython-compiled, legally risky)
- PyPI metadata confirms: License = Proprietary, Cython classifier present
- Even if inspectable, direct porting would create maintenance dependency on opaque upstream
- [SOURCE: https://pypi.org/project/graperoot/ — v3.8.92, March 2026]

### 3.5 Standalone Installation Has Critical Blockers
- **CLAUDE.md overwrite** (BLOCKER): Dual-Graph auto-generates CLAUDE.md with its own workflow rules, destroying our 300+ line framework
- **Workflow collision** (BLOCKER): Dual-Graph mandates `graph_continue` first; our system mandates Gate 1 → Gate 2 → Gate 3
- **Telemetry concerns**: Creates identity.json, sends machine ID + platform heartbeat
- **Supply chain risk**: curl-pipe-bash install with no checksum verification

### 3.6 Our Architecture Already Supports Code Graph Extension
- `query-router.ts` routes to 5 channels: vector, fts, bm25, graph, degree
- Existing `graph` channel is for causal memory graph, not code graph
- Adding a 6th code graph channel is architecturally natural
- `structure-aware-chunker.ts` shows existing AST parsing patterns
- Feature catalog already documents AST-level retrieval as planned capability
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/]

---

## 4. Decision Matrix

| Option | Effort | Risk | Fit Score | Verdict |
|--------|--------|------|-----------|---------|
| A. Install Dual-Graph standalone | Low | CRITICAL | 2/10 | REJECTED |
| B. Extract graperoot logic | N/A | BLOCKED | 0/10 | REJECTED |
| C. Build clean-room code graph | 2-4 weeks | Low | 9/10 | RECOMMENDED |
| D. Enhance CocoIndex Code | 1-2 weeks | Low | 7/10 | Alternative |
| E. Skip entirely | None | None | 5/10 | Acceptable |

---

## 5. Recommended Path: Clean-Room Code Graph Channel

### Why This Approach
1. Our MCP server already has the search pipeline infrastructure
2. tree-sitter provides production-grade multi-language AST parsing
3. Clean-room avoids all proprietary/vendor/security risks
4. Code graph + semantic embeddings = better retrieval than either alone
5. Incremental approach: start JS/TS, expand to Python/Shell

### Implementation Phases

**Phase 1: Proof of Concept (1 week)**
- Add `tree-sitter` + `tree-sitter-typescript` npm packages
- Build minimal AST parser: files, functions, classes, imports
- Store in SQLite table `code_nodes` + `code_edges`
- Test with our JS/TS codebase

**Phase 2: Search Integration (1 week)**
- Create `code-graph-channel.ts` search channel
- Register as 6th channel in `hybrid-search.ts`
- Add feature flag via `graph-flags.ts`
- A/B test via ablation infrastructure

**Phase 3: Multi-Language + Polish (1-2 weeks)**
- Add Python, Shell, JSON tree-sitter grammars
- Optimize for large codebases
- Add MCP tools: `code_graph_scan`, `code_graph_query`
- Performance benchmarking

### What to Learn from Dual-Graph
- Session activity tracking (boost files recently read/edited)
- Confidence-based retrieval limits
- Per-turn token budgets for context injection

---

## 6. Detailed Comparison

| Dimension | Dual-Graph | Spec Kit Memory | Winner |
|-----------|-----------|-----------------|--------|
| Core approach | Static code graph | Semantic embeddings + hybrid search | Ours (more versatile) |
| Tool surface | ~7 tools | 33 tools (7 layers) | Ours (10x broader) |
| Search method | Graph traversal | Vector + FTS5 + BM25 + Graph + Degree | Ours (5-channel fusion) |
| Memory model | JSON files | SQLite + embeddings | Ours (more robust) |
| Session continuity | Basic (chat_action_graph) | Working memory + attention decay + dedup | Ours (more sophisticated) |
| Multi-tenant | None | Shared spaces + membership | Ours (unique capability) |
| Code structure | Strong (import graph) | None (gap) | Theirs (our gap to fill) |
| Cross-session | Basic (context-store.json) | Full (constitutional memories, causal) | Ours |
| Token optimization | Dashboard + per-turn limits | Token budget enforcement | Comparable |
| Privacy | Telemetry + identity tracking | No telemetry | Ours |
| Open source | Launchers only (core proprietary) | Full source | Ours |
| Architecture fit | Flat project model | Multi-skill, multi-agent aware | Ours |

---

## 7. Risk Analysis

| Risk | Severity | Recommendation |
|------|----------|---------------|
| Proprietary dependency (graperoot) | HIGH | Avoid — build clean-room |
| CLAUDE.md overwrite | CRITICAL | Do not install standalone |
| Supply chain (curl-pipe-bash) | HIGH | Do not use install script |
| Telemetry/privacy | MEDIUM | Avoid entirely |
| Single maintainer project | HIGH | Do not depend on |
| Workflow collision (gates) | CRITICAL | Incompatible with our framework |

---

## 8. Open-Source Alternatives Assessed

| Tool | Our Fit | Notes |
|------|---------|-------|
| **tree-sitter** | 9/10 | Best: multi-language AST, used by GitHub/aider |
| **aider repo-map** | 8/10 | Proven approach, Apache 2.0, uses tree-sitter |
| **dependency-cruiser** | 5/10 | Good for JS/TS import graphs only |
| **ts-morph** | 5/10 | TypeScript-only but deep analysis |
| **ast-grep** | 7/10 | Multi-language AST search |
| **universal-ctags** | 6/10 | Wide language support, symbol index |

---

## 9. Answers to Research Questions

| # | Question | Answer | Evidence |
|---|----------|--------|----------|
| Q1 | What is Dual-Graph's architecture? | Semantic code graph via proprietary graperoot, exposed through MCP. Three-stage: graph construction → context injection → session memory. | Iteration 1 |
| Q2 | How does it compare to our system? | Different problem domains. Complementary, not competitive. Our system is 10x broader (33 vs 7 tools). | Iterations 2-3 |
| Q3 | Can we extract its logic? | No. Proprietary license, Cython-compiled, legally risky. Clean-room reimplementation is the viable path. | Iteration 4 |
| Q4 | Should we install standalone? | No. CLAUDE.md conflict (BLOCKER), workflow collision (BLOCKER), vendor lock-in, telemetry. | Iterations 5, 9 |
| Q5 | Does it fit our multi-skill architecture? | Poor fit (2/10). Flat scanning model mismatches our hierarchical skill/spec/agent architecture. | Iteration 6 |

---

## 10. Negative Knowledge (Ruled Out)

- Cannot extract graperoot — proprietary, Cython-compiled
- Cannot install standalone — CLAUDE.md overwrite destroys our framework
- Cannot use graperoot as a dependency — vendor lock-in, single maintainer
- LSP-based approach too complex — per-language server overhead
- Pure embedding approach insufficient for structural queries — need explicit graph

---

## 11. Open Questions

- What is the actual performance improvement of adding a code graph channel to our hybrid search?
- How does tree-sitter handle our specific codebase size (~500+ files)?
- Should code graph be an MCP tool or a background indexer?
- Integration with CocoIndex Code — should they share the same index?

---

## 12. Related Work

- **aider** (paul-gauthier/aider): Open-source AI coding assistant with repo-map feature using tree-sitter
- **Dual-Graph** (kunal12203/Codex-CLI-Compact): The evaluated tool
- **CocoIndex Code** (.opencode/skill/mcp-coco-index/): Our existing semantic code search
- **Spec Kit Memory** (.opencode/skill/system-spec-kit/mcp_server/): Our memory MCP system

---

## 13. Methodology

- 10 iterations of deep research
- Data sources: GitHub API, WebFetch (README, CLAUDE.md, CODEX.md, install.sh, dashboard), PyPI, local codebase analysis
- 3 codex GPT-5.4 agents dispatched in parallel (Wave 1)
- Codex agents contributed: iteration 002 (MCP architecture, 11KB), iteration 004 (integration feasibility with PyPI analysis)
- Convergence detected at iteration 9 (newInfoRatio: 0.35, declining trend)

---

## 14. Convergence Report

- **Stop reason:** All questions answered + convergence (declining newInfoRatio)
- **Total iterations:** 10
- **Questions answered:** 5/5
- **newInfoRatio trend:** 0.95 → 0.88 → 0.70 → 0.78 → 0.50 → 0.40 → 0.55 → 0.45 → 0.35 → 0.15
- **Convergence threshold:** 0.05
- **Last 3 ratios:** 0.45 → 0.35 → 0.15 (declining)

---

## 15. Next Steps

1. `/spec_kit:plan` — Plan the clean-room code graph channel implementation
2. Create spec folder for code graph implementation (Level 3)
3. Evaluate tree-sitter TypeScript integration
4. Benchmark CocoIndex Code performance as baseline

---

## 16. Acknowledgements

Research conducted using deep research loop protocol with GPT-5.4 (codex exec) agents for parallel analysis. Codex agents produced high-quality iterations 002 and 004 with deep codebase analysis and PyPI research.

---

## 17. Appendix: File Inventory

| File | Size | Source |
|------|------|--------|
| iteration-001.md | 5.3KB | Orchestrator (Claude) |
| iteration-002.md | 11.2KB | Codex GPT-5.4 agent |
| iteration-003.md | 4.0KB | Orchestrator (Claude) |
| iteration-004.md | ~8KB | Codex GPT-5.4 agent |
| iteration-005.md | ~5KB | Orchestrator (Claude) |
| iteration-006.md | ~4KB | Orchestrator (Claude) |
| iteration-007.md | ~5KB | Orchestrator (Claude) |
| iteration-008.md | ~4KB | Orchestrator (Claude) |
| iteration-009.md | ~5KB | Orchestrator (Claude) |
| iteration-010.md | ~3KB | Orchestrator (Claude) |
