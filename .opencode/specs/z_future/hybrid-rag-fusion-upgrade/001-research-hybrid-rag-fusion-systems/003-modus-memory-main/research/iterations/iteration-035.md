# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

## Findings

### Finding 1: Public must keep tool-routing authority split; Modus-style helpers cannot become a new universal search lane
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:21-58,75-101`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-50,638-718`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-124,157-167`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:143-156` [SOURCE: paths above]
- **What it does**: Modus collapses lexical search, optional librarian expansion, and connected-doc hints into a small set of vault tools. Public explicitly documents a split authority model instead: `memory_context`/`memory_search` own memory retrieval, CocoIndex is the preferred semantic code-search surface, and `code_graph_query`/`code_graph_context` own structural expansion, with `code_graph_context` accepting CocoIndex seeds directly.
- **Why it matters**: Any adopted Modus pattern that broadens lexical recall or appends related docs is only safe if it stays inside the memory lane. If it starts answering code-search or structural questions, it conflicts with existing routing guidance and duplicates higher-authority tools.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 2: Modus adjacency maps fit Public only as a low-authority appendix, not as a replacement for code-graph or causal graph
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:26-31,41-112,154-214`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:75-101,901-924`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:61-106`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:167-193` [SOURCE: paths above]
- **What it does**: Modus builds an in-memory adjacency index from subject, tag, and entity matches, weights matches as subject=3, entity=2, tag=1, and surfaces the result as a post-search appendix or `vault_connected`. Public’s code graph returns AST-backed structural payloads with freshness and trust metadata; causal-memory links represent decision lineage, not loose topical relatedness.
- **Why it matters**: A connected-doc appendix can improve recall and navigation for memory results, but it should never be treated as evidence equivalent to code-graph edges or causal links, and it should not feed canonical ranking ahead of higher-trust structural channels.
- **Recommendation**: **prototype later**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 3: `memory_review` is structurally compatible because Public already has the FSRS primitives and the right write boundary
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,65-72,197-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165-169,297-315`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:885-897` [SOURCE: paths above]
- **What it does**: Public already exposes the underlying FSRS review math: graded constants (`AGAIN/HARD/GOOD/EASY`), `processReview()`, retrievability calculation, and `nextReviewDate`. Search-time strengthening is already explicit opt-in via `trackAccess: false` by default. The public mutation surface adjacent to this today is `memory_validate`, which records only boolean usefulness feedback. Modus shows the missing control-plane layer: an explicit reinforcement tool on top of review state.
- **Why it matters**: This adds operator control without colliding with CocoIndex, code-graph, or session bootstrap. A first-class `memory_review` tool fits Public’s current architecture better than implicit reinforcement because it preserves the existing read/write boundary while exposing the review semantics already implemented internally.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 4: Default write-on-read reinforcement is incompatible with Public’s cache, dedup, and MCP-read semantics
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:273-317`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751-769,1071-1143`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:840-845,1194-1202` [SOURCE: paths above]
- **What it does**: Modus treats every returned memory fact as a successful recall and fires `ReinforceFact()` asynchronously from `memory_search`. Public’s search path is built around cacheable responses, post-cache session deduplication, and explicit opt-in testing effects; its strengthening path is guarded behind `trackAccess` specifically to avoid unintended write side-effects on read-only searches.
- **Why it matters**: If Public adopted Modus’s default write-on-read behavior, cache hits, deduped responses, and repeated lookups would all become semantically ambiguous mutation events. That weakens the MCP contract that search is observational unless the caller explicitly opts into access tracking or uses a mutation tool.
- **Recommendation**: **reject**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 5: Librarian-style lexical expansion is only compatible as a weak-result recovery path beneath `memory_search`
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:280-299,343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:812-861`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-50,638-718`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4-15,106-117` [SOURCE: paths above]
- **What it does**: Modus runs librarian expansion as the default pre-search behavior for `memory_search`. Public already has a bounded recovery pattern: community fallback only runs on weak or global results, and the broader system keeps memory retrieval, semantic code search, structural graph lookup, and session recovery as separate surfaces with separate status contracts.
- **Why it matters**: Lexical expansion is not structurally blocked, but its only safe place is as a weak-result fallback inside `memory_search` after the canonical memory pipeline underperforms. Making it a universal preprocessor would interfere with session/bootstrap predictability and risk stealing queries that should route to CocoIndex or `code_graph_query`.
- **Recommendation**: **prototype later**
- **Impact**: **medium**
- **Source strength**: **primary**

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:21-58,75-101,273-317,343,885-924`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-39`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:26-31,41-112,154-214`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:277-285`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-50,165-169,297-315,638-718,740-757`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751-769,812-861,1071-1143`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-845,1194-1202`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,65-72,197-215`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:61-106`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-124,157-193`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4-15,106-117`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:143-156`

## Assessment
- New information ratio: **0.18**
- Questions addressed: how Modus-style routing interacts with CocoIndex authority; whether adjacency hints overlap or conflict with code-graph and causal links; whether explicit review or implicit write-on-read better fits Public’s MCP contract; where lexical expansion can exist without breaking session/bootstrap behavior.
- Questions answered: Public should preserve explicit routing authority across memory/CocoIndex/code-graph tools; connected-doc adjacency is compatible only as a low-authority appendix; `memory_review` fits the current stack cleanly; default write-on-read reinforcement conflicts with cache/dedup semantics and should stay rejected; lexical expansion is only viable as a weak-result fallback inside `memory_search`.
- Novelty justification: Earlier iterations ranked candidate features; this pass converts them into stack-level compatibility rules by tracing the live authority boundaries between memory tools, CocoIndex, code graph, and composite session/bootstrap surfaces.

## Ruled Out
- Letting a Modus-style lexical helper answer code-search questions, because Public already assigns that authority to CocoIndex and `code_graph_query`.
- Treating connected-doc adjacency as equivalent to code-graph or causal evidence, because Modus weights topic overlap while Public graph tools carry structural trust and freshness metadata.
- Making write-on-read reinforcement the default policy for Public, because cached and deduplicated search responses would become mutation events.
- Adding a new monolithic “vault” MCP lane that bundles memory, code-search, and graph behavior, because it would duplicate existing tool boundaries instead of complementing them.

## Reflection
- What worked: comparing tool-schema authority, handler routing, and search-side side effects across both systems exposed the real conflict points much faster than abstract architectural comparison.
- What did not work: live CocoIndex semantic search calls were unavailable in this run, so I could not validate these boundaries through the semantic tool itself and instead relied on handler/tool-schema code plus session-bootstrap contracts.
- What I would do differently: in a runnable follow-up, pair this source analysis with a small routing playbook that exercises memory-only, code-semantic, structural, and resume flows to confirm the proposed overlays do not leak across tool boundaries.

## Recommended Next Focus
Translate the compatible items into concrete integration contracts: `memory_review` API first, then a connected-doc appendix shape that is explicitly non-authoritative, and finally a weak-result lexical fallback design that is hard-gated to `memory_search` and never intercepts CocoIndex, code-graph, or bootstrap flows.


Total usage est:        1 Premium request
API time spent:         5m 13s
Total session time:     5m 32s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.6m in, 17.9k out, 1.5m cached, 7.0k reasoning (Est. 1 Premium request)
