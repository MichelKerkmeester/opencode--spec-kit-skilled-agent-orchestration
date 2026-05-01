# Iteration 039: CROSS-PHASE SYNTHESIS

## Focus
CROSS-PHASE SYNTHESIS: Compare findings across all 5 external systems (Engram, Mex, Modus, Mnemosyne, MemPalace). What do 3+ systems agree on? Where do they diverge?

## Findings
### Finding 1: Four external systems and Spec Kit converge on scoped, role-separated memory surfaces, while Mex diverges into a scaffold-router control plane
- **Source**: Engram MCP profile/tool registration, Mex scaffold router flow, Modus/Mnemosyne/MemPalace tool surfaces, and Spec Kit MCP schemas [SOURCE: `001-engram-main/external/internal/mcp/mcp.go:38-65`; `001-engram-main/external/internal/mcp/mcp.go:375-395`; `001-engram-main/external/internal/mcp/mcp.go:460-595`; `002-mex-main/external/README.md:178-216`; `003-modus-memory-main/external/README.md:191-207`; `004-opencode-mnemosyne-main/external/README.md:37-59`; `004-opencode-mnemosyne-main/external/src/index.ts:95-203`; `005-mempalace/external/mempalace/mcp_server.py:7-18`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:210-220`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-269`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`]
- **What it does**: Engram separates agent/admin tools and keeps explicit `mem_context` and session/save surfaces; Mnemosyne splits project/global/core recall-store-delete; MemPalace splits status/taxonomy/search/write tools; Spec Kit separates `memory_context`, `memory_search`, `memory_match_triggers`, `memory_health`, and session bootstrap/resume. Mex is the outlier: it pushes most control-plane behavior into `CLAUDE.md` -> `ROUTER.md` -> context/pattern scaffold files plus CLI verbs instead of a live memory MCP surface.
- **Why it matters**: The strongest cross-system agreement is separation of responsibilities, not "one smarter search tool." For Public, that validates keeping explicit retrieval, continuity, maintenance, and graph authorities, with any future convenience wrapper staying a thin facade over those authorities rather than a second control plane.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Four systems agree startup continuity should be cheap and layered, but they disagree on the carrier
- **Source**: Engram bounded context/session tools, Mex bootstrap routing, Mnemosyne compaction hook, MemPalace wake-up layers, and Public resume/bootstrap routing [SOURCE: `001-engram-main/external/internal/mcp/mcp.go:375-395`; `001-engram-main/external/internal/mcp/mcp.go:460-562`; `001-engram-main/external/internal/store/store.go:1613-1667`; `002-mex-main/external/README.md:178-216`; `004-opencode-mnemosyne-main/external/README.md:47-60`; `004-opencode-mnemosyne-main/external/README.md:80-87`; `004-opencode-mnemosyne-main/external/src/index.ts:208-220`; `005-mempalace/external/mempalace/layers.py:3-16`; `005-mempalace/external/mempalace/layers.py:76-85`; `005-mempalace/external/mempalace/layers.py:185-214`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-124`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163-205`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`]
- **What it does**: Engram composes recent sessions, prompts, and observations into a bounded `mem_context`; Mex keeps the always-loaded bootstrap tiny and routes deeper context on demand; Mnemosyne injects memory instructions at compaction time; MemPalace formalizes L0/L1 wake-up plus L2/L3 retrieval; Public already chooses between quick trigger matches, deep search, resume mode, and `session_bootstrap` next actions.
- **Why it matters**: The transferable pattern is layered warm-up discipline at startup and compaction boundaries, not any single bootstrap format. Public should keep `memory_context` and `session_bootstrap` as the authorities and treat any recent-session digest or action-card addition as a bounded additive layer.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Five systems agree durable memory needs an explicit hygiene or repair lane
- **Source**: Engram stats/merge/session tools, Mex drift check/sync, Modus doctor scan, Mnemosyne delete semantics, MemPalace WAL/invalidation, and Public health/save contracts [SOURCE: `001-engram-main/external/internal/mcp/mcp.go:399-412`; `001-engram-main/external/internal/mcp/mcp.go:598-620`; `001-engram-main/external/internal/store/store.go:1588-1608`; `002-mex-main/external/README.md:72-113`; `003-modus-memory-main/external/cmd/modus-memory/doctor.go:13-31`; `003-modus-memory-main/external/cmd/modus-memory/doctor.go:42-60`; `003-modus-memory-main/external/cmd/modus-memory/doctor.go:63-83`; `003-modus-memory-main/external/cmd/modus-memory/doctor.go:108-158`; `004-opencode-mnemosyne-main/external/src/index.ts:193-202`; `005-mempalace/external/mempalace/mcp_server.py:70-100`; `005-mempalace/external/mempalace/mcp_server.py:169-176`; `005-mempalace/external/mempalace/knowledge_graph.py:180-192`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-269`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-468`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1273-1389`]
- **What it does**: Engram pairs save/search with stats and project-merge curation; Mex treats drift detection and targeted sync as first-class maintenance; Modus ships a doctor pass for missing fields, duplicates, and contradictions; Mnemosyne gives explicit delete semantics for contradicted entries; MemPalace logs all writes and invalidates stale facts; Spec Kit already keeps `memory_health` and `memory_save` distinct, with confirmation and dry-run semantics.
- **Why it matters**: This is the clearest five-system consensus after scoped APIs: memory is not just store+recall. Public should keep hygiene advisory, operator-visible, and separate from ranking so integrity or doctor surfaces improve trust without becoming a second retrieval authority.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 4: Relationship awareness is a four-system pattern, but the systems diverge sharply on how much graph they want
- **Source**: Engram topic-key exact lookup, Mex scaffold edges, Modus crossrefs, MemPalace temporal KG, and Public causal/code-graph planes [SOURCE: `001-engram-main/external/internal/store/store.go:1474-1515`; `002-mex-main/external/README.md:78-80`; `002-mex-main/external/README.md:189-216`; `003-modus-memory-main/external/internal/index/crossref.go:9-15`; `003-modus-memory-main/external/internal/index/crossref.go:41-56`; `003-modus-memory-main/external/internal/index/crossref.go:154-213`; `005-mempalace/external/mempalace/knowledge_graph.py:5-16`; `005-mempalace/external/mempalace/knowledge_graph.py:61-88`; `005-mempalace/external/mempalace/knowledge_graph.py:121-178`; `005-mempalace/external/mempalace/knowledge_graph.py:196-214`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:483-500`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-665`]
- **What it does**: Engram stabilizes evolving threads with `topic_key` exact lookup rather than a graph; Mex uses scaffold edges and indexes for navigational structure; Modus builds adjacency from subjects/tags/entities without introducing a graph store; MemPalace builds a temporal entity-relation graph with typed edges; Spec Kit already splits causal memory links from the structural code graph.
- **Why it matters**: The consensus is that isolated records are not enough, but there is no shared graph architecture. Public should keep relation planes explicit and bounded: causal links for decision lineage, code graph for structure, lexical integrity for drift, and any exact-handle/thread lane as a lightweight complement rather than a universal graph.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

### Finding 5: The deepest divergence is the source of truth itself, which rules out wholesale adoption of any single external system
- **Source**: Engram storage model, Mex scaffold authority, Modus markdown vault and operational learnings, Mnemosyne local hybrid store, MemPalace verbatim ChromaDB + taxonomy/KG, and Public tool surface [SOURCE: `001-engram-main/external/README.md:25-33`; `001-engram-main/external/README.md:58-69`; `001-engram-main/external/internal/store/store.go:1462-1583`; `002-mex-main/external/README.md:72-87`; `002-mex-main/external/README.md:178-216`; `003-modus-memory-main/external/README.md:27-31`; `003-modus-memory-main/external/README.md:53-58`; `003-modus-memory-main/external/README.md:191-207`; `003-modus-memory-main/external/internal/learnings/learnings.go:1-10`; `003-modus-memory-main/external/internal/learnings/learnings.go:66-155`; `004-opencode-mnemosyne-main/external/README.md:80-87`; `004-opencode-mnemosyne-main/external/src/index.ts:34-75`; `004-opencode-mnemosyne-main/external/src/index.ts:78-90`; `004-opencode-mnemosyne-main/external/src/index.ts:95-203`; `005-mempalace/external/README.md:13-21`; `005-mempalace/external/README.md:113-169`; `005-mempalace/external/README.md:190-205`; `005-mempalace/external/mempalace/searcher.py:21-52`; `005-mempalace/external/mempalace/searcher.py:93-152`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-269`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:483-500`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-665`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`]
- **What it does**: Engram is a SQLite+FTS5 observation store; Mex is a markdown scaffold/router; Modus is a markdown vault with BM25/FSRS/crossrefs and operational learnings; Mnemosyne is a local hybrid document store wrapped as a plugin; MemPalace is verbatim ChromaDB plus taxonomy and temporal KG layers; Spec Kit is already a governed hybrid memory stack with separate causal and code-intelligence planes.
- **Why it matters**: The five systems do **not** converge on one persistence model, one authoring surface, or one write authority. Public should selectively import patterns—layered continuity hints, advisory integrity/doctor flows, bounded exact-handle ideas, and thin ergonomic facades—while rejecting backend swaps.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- `001-engram-main/external/README.md:25-33`
- `001-engram-main/external/README.md:58-69`
- `001-engram-main/external/internal/mcp/mcp.go:38-65`
- `001-engram-main/external/internal/mcp/mcp.go:375-395`
- `001-engram-main/external/internal/mcp/mcp.go:399-412`
- `001-engram-main/external/internal/mcp/mcp.go:460-620`
- `001-engram-main/external/internal/store/store.go:1474-1583`
- `001-engram-main/external/internal/store/store.go:1588-1667`
- `002-mex-main/external/README.md:72-113`
- `002-mex-main/external/README.md:178-216`
- `003-modus-memory-main/external/README.md:27-31`
- `003-modus-memory-main/external/README.md:53-58`
- `003-modus-memory-main/external/README.md:191-207`
- `003-modus-memory-main/external/cmd/modus-memory/doctor.go:13-31`
- `003-modus-memory-main/external/cmd/modus-memory/doctor.go:42-60`
- `003-modus-memory-main/external/cmd/modus-memory/doctor.go:63-83`
- `003-modus-memory-main/external/cmd/modus-memory/doctor.go:108-158`
- `003-modus-memory-main/external/internal/index/crossref.go:9-15`
- `003-modus-memory-main/external/internal/index/crossref.go:41-56`
- `003-modus-memory-main/external/internal/index/crossref.go:154-213`
- `003-modus-memory-main/external/internal/learnings/learnings.go:1-10`
- `003-modus-memory-main/external/internal/learnings/learnings.go:66-155`
- `004-opencode-mnemosyne-main/external/README.md:37-87`
- `004-opencode-mnemosyne-main/external/src/index.ts:34-75`
- `004-opencode-mnemosyne-main/external/src/index.ts:78-90`
- `004-opencode-mnemosyne-main/external/src/index.ts:95-220`
- `005-mempalace/external/README.md:13-21`
- `005-mempalace/external/README.md:113-169`
- `005-mempalace/external/README.md:190-205`
- `005-mempalace/external/mempalace/mcp_server.py:7-18`
- `005-mempalace/external/mempalace/mcp_server.py:70-100`
- `005-mempalace/external/mempalace/mcp_server.py:169-176`
- `005-mempalace/external/mempalace/layers.py:3-16`
- `005-mempalace/external/mempalace/layers.py:76-85`
- `005-mempalace/external/mempalace/layers.py:185-214`
- `005-mempalace/external/mempalace/knowledge_graph.py:5-16`
- `005-mempalace/external/mempalace/knowledge_graph.py:61-88`
- `005-mempalace/external/mempalace/knowledge_graph.py:121-214`
- `005-mempalace/external/mempalace/searcher.py:21-52`
- `005-mempalace/external/mempalace/searcher.py:93-152`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:210-220`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-269`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:483-500`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-665`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-468`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1273-1389`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-124`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163-205`

## Assessment
- New information ratio: 0.18
- Questions addressed: [what 3+ systems independently agree on, where the external systems disagree at the architecture level, which agreements map cleanly onto Spec Kit, which divergences block any wholesale transplant]
- Questions answered: [the strongest agreements are scoped tool surfaces, low-token layered continuity, and explicit hygiene/repair lanes; relationship layers matter but are not consensus-standardized; the deepest divergence is still the underlying source of truth and write authority model]
- Novelty justification: This is the first Engram-packet pass that turns all five external systems into one source-backed import contract, separating reusable consensus from structural disagreement instead of leaving that comparison distributed across phase-local packets.

## Ruled Out
- Picking one external system as the new north-star backend, because every comparison keeps some ideas while rejecting the underlying authority model.
- Folding integrity, doctor, or contradiction signals directly into retrieval ranking, because all five systems separate maintenance from at least one retrieval or storage boundary.
- Replacing `session_bootstrap` / `memory_context` with a router-first markdown bootstrap, because Public already has a richer orchestration authority than Mex-style scaffold routing.
- Collapsing topic threads, lexical edges, causal links, and structural code graph data into one universal graph surface, because the cross-phase evidence supports multiple bounded relation planes instead.

## Reflection
- What worked: Comparing the systems at the boundary they expose to agents—tool contract, continuity contract, hygiene contract, and relation contract—made agreement and divergence much clearer than replaying each phase narratively.
- What did not work: The Engram packet still lacks canonical reducer-owned deep-research state files, and the strict `validate.sh` pass was blocked in this runtime by a permission boundary rather than a packet-level validation result.
- What I would do differently: Start a cross-system comparison matrix much earlier in the run so the final iterations can close or rank rows directly instead of reconstructing the comparison from late-stage packets.

## Recommended Next Focus
Iteration 040 should convert this cross-phase contract into the final execution matrix:
1. freeze the cross-system `adopt now / prototype later / reject` table,
2. rank the adopt-now items into a single Q1/Q2 implementation order for Public,
3. choose which one workflow-specific NEW FEATURE candidate advances first,
4. bind every promoted item to budgets, ownership, and validation thresholds.
```


Changes   +0 -0
Requests  1 Premium (12m 26s)
Tokens    ↑ 2.0m • ↓ 58.4k • 1.7m (cached) • 12.4k (reasoning)
