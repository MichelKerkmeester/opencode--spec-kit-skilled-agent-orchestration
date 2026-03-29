# Iteration 008 — Hybrid Architecture: Code Graph + Semantic Embeddings

**Focus:** Could a code graph layer complement our existing semantic embeddings?
**Status:** complete
**newInfoRatio:** 0.45
**Novelty:** Confirmed code graph and semantic embeddings are complementary — our existing graph search infrastructure provides the extension point.

---

## Findings

### 1. Complementarity Analysis

| Capability | Semantic Embeddings (Current) | Code Graph (Proposed) | Combined Value |
|------------|------------------------------|----------------------|----------------|
| "Find code related to authentication" | Strong (conceptual similarity) | Weak (needs keywords) | Embeddings lead |
| "What imports auth.ts?" | Weak (no structural awareness) | Strong (import graph) | Graph leads |
| "Files related to this function" | Medium (semantic proximity) | Strong (call graph) | Graph leads |
| "Prior decisions about auth" | Strong (memory search) | None | Embeddings only |
| "What changed in last session" | Strong (session tracking) | Medium (activity log) | Embeddings lead |
| "Dependency chain for this module" | None | Strong (import traversal) | Graph only |

**Conclusion: They are COMPLEMENTARY, not redundant.**
- Embeddings excel at: conceptual queries, natural language, cross-session memory
- Code graph excels at: structural queries, dependencies, call chains, import paths

### 2. Existing Extension Point

Our MCP server already has graph search infrastructure:

```typescript
// context-server.ts, line 77
import { createUnifiedGraphSearchFn } from './lib/search/graph-search-fn';
// context-server.ts, line 88
import { isGraphUnifiedEnabled } from './lib/search/graph-flags';
```

This means adding a code graph is architecturally natural — it slots into the existing "graph channel" of our hybrid search pipeline.

### 3. Five-Channel Hybrid Search (Current + Proposed)

| Channel | Current Status | Source |
|---------|---------------|--------|
| **Vector** | Active | Embedding similarity |
| **FTS5** | Active | Full-text search |
| **BM25** | Active | Term frequency ranking |
| **Graph** | Infrastructure exists, needs data source | Causal graph only |
| **Degree** | Active | Node connectivity scoring |
| **Code Graph** (NEW) | NOT YET | AST-based file/function/import graph |

### 4. Proposed Architecture

```
Code Graph Data Pipeline:
  tree-sitter parse → AST extraction → Graph construction → SQLite storage
                                                                   ↓
Hybrid Search Pipeline:                                    Code Graph Channel
  Query → [Vector, FTS5, BM25, Graph, Degree, Code Graph] → RRF Fusion → Ranked Results
```

Integration steps:
1. Add `tree-sitter` npm packages for target languages
2. Create `lib/search/code-graph-builder.ts` — AST → graph construction
3. Create `lib/search/code-graph-store.ts` — SQLite table for code graph
4. Create `lib/search/code-graph-channel.ts` — Search channel implementation
5. Register as new channel in `hybrid-search.ts`
6. Add feature flag via `graph-flags.ts`

### 5. Value Assessment

| Metric | Without Code Graph | With Code Graph |
|--------|-------------------|-----------------|
| Structural queries | Cannot answer | "What imports X?" works |
| Dependency awareness | None | Full import/export tracking |
| Context pre-loading | CocoIndex only | CocoIndex + structural ranking |
| Session token usage | Current baseline | Estimated 15-25% improvement |
| Integration effort | N/A | 2-4 weeks |

### 6. Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| tree-sitter complexity | Medium | Start with JS/TS only, expand incrementally |
| SQLite schema changes | Low | New table, doesn't affect existing |
| Search quality regression | Low | Feature flag, A/B testing via ablation |
| Maintenance burden | Medium | tree-sitter grammars are well-maintained |

---

## Dead Ends
- Considered embedding code structure (AST as text → embeddings): too lossy
- Considered LSP integration: too heavy, per-language overhead

## Sources
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:77-88] — graph search infrastructure
- [SOURCE: .opencode/skill/system-spec-kit/shared/README.md] — five-channel retrieval pipeline
- [SOURCE: iteration-002.md] — hybrid search architecture details
