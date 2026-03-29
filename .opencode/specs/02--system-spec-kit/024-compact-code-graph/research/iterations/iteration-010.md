# Iteration 010 — Final Recommendation Synthesis

**Focus:** Synthesize all findings into actionable recommendation
**Status:** complete
**newInfoRatio:** 0.15
**Novelty:** Synthesis iteration — all new information comes from cross-iteration pattern recognition, not new evidence.

---

## Executive Summary

After 9 iterations analyzing Dual-Graph (Codex-CLI-Compact) against our Spec Kit Memory MCP system, the recommendation is clear: **Do NOT adopt Dual-Graph. Instead, build a clean-room code graph channel using tree-sitter within our existing MCP architecture.**

Dual-Graph solves a real problem (intelligent code file pre-loading) but its proprietary core (graperoot), CLAUDE.md conflicts, workflow incompatibilities, and security/privacy concerns make it unsuitable for our multi-skill, multi-agent architecture. The good news: our MCP server already has the infrastructure to add code graph functionality — the `graph` channel and hybrid search pipeline just need a structural code data source.

## Decision Matrix

| Option | Pros | Cons | Effort | Risk | Fit Score |
|--------|------|------|--------|------|-----------|
| **A. Install Dual-Graph standalone** | Quick setup, proven metrics | CLAUDE.md overwrite, workflow conflicts, proprietary core, telemetry, vendor lock-in | Low (days) | CRITICAL | 2/10 |
| **B. Extract graperoot logic** | Direct reuse | Proprietary license, Cython/compiled, legally risky | N/A | BLOCKED | 0/10 |
| **C. Build clean-room code graph** | Full control, integrates with existing hybrid search, no vendor risk | Development effort, needs tree-sitter expertise | Medium (2-4 weeks) | Low | 9/10 |
| **D. Enhance CocoIndex Code** | Builds on existing, already MCP-integrated | Different approach (embeddings vs graph), limited structural awareness | Medium (1-2 weeks) | Low | 7/10 |
| **E. Skip entirely** | Zero effort | Miss code graph benefits | None | None | 5/10 |

## Recommended Path: Option C — Build Clean-Room Code Graph Channel

### Rationale
1. Our MCP server already has `graph-search-fn.ts` (causal graph) and `query-router.ts` routing to 5 channels — adding a 6th code graph channel is architecturally natural
2. tree-sitter provides production-grade multi-language AST parsing (used by GitHub, aider, Neovim)
3. Our shared package already has AST-aware patterns (`structure-aware-chunker.ts`)
4. Clean-room implementation avoids all Dual-Graph risks (proprietary, telemetry, lock-in)
5. Code graph and semantic embeddings are complementary (structure + semantics = better retrieval)

### Implementation Roadmap

**Phase 1: Proof of Concept (1 week)**
- Add `tree-sitter` and `tree-sitter-typescript` npm packages
- Build minimal AST parser extracting: files, functions, classes, imports
- Store in new SQLite table `code_nodes` + `code_edges`
- Test with our own codebase (JS/TS files only)

**Phase 2: Search Integration (1 week)**
- Create `code-graph-channel.ts` implementing the search channel interface
- Register as 6th channel in `hybrid-search.ts`
- Add feature flag via `graph-flags.ts`
- A/B test via existing ablation infrastructure

**Phase 3: Multi-Language + Polish (1-2 weeks)**
- Add tree-sitter grammars for Python, Shell, JSON
- Optimize graph construction for large codebases
- Add MCP tools: `code_graph_scan`, `code_graph_query`
- Performance benchmarking

### What to Learn from Dual-Graph
- **Session activity tracking** (which files read/edited → boost relevance)
- **Confidence-based retrieval limits** (high confidence = stop, low = allow more searching)
- **Per-turn token budgets** (limit context injection to prevent context window waste)
- **CONTEXT.md pattern** (persist key decisions across sessions — our memory system already does this better)

## Answers to Research Questions

| Question | Answer | Confidence |
|----------|--------|------------|
| Q1: What is Dual-Graph's architecture? | Semantic code graph via proprietary graperoot, exposed through MCP | HIGH (iteration 1) |
| Q2: How does it compare to our system? | Different problem domains — complementary, not competitive | HIGH (iterations 2-3) |
| Q3: Can we extract its logic? | No — proprietary, Cython-compiled, legally risky | HIGH (iteration 4) |
| Q4: Should we install standalone? | No — CLAUDE.md conflict, workflow collision, vendor lock-in | HIGH (iterations 5, 9) |
| Q5: Does it fit our multi-skill architecture? | Poor fit — flat scanning model mismatches our hierarchical structure | HIGH (iteration 6) |

## Sources
All iteration files (001-009)
