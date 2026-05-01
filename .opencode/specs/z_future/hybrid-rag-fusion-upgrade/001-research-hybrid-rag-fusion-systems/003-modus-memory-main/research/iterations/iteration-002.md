# Iteration 002: CORE DATA MODEL

## Focus
CORE DATA MODEL: Examine the storage layer - schemas, data structures, persistence, indexing, database design.

## Findings

### Finding 1: Modus has no durable search index; it rebuilds the entire retrieval model from markdown on startup
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- **What it does**: `Index` is just RAM state: `docs`, `bm25Engine`, `queryCache`, `factStore`, `crossIndex`, and a `meta` map keyed by path. `Build()` rescans markdown, projects it into `document` structs, then rebuilds BM25 postings, cross refs, and in-memory fact indexes; `Open()` ignores the supplied `indexPath` and simply rebuilds from `~/modus/vault` or `MODUS_VAULT_DIR`.
- **Why it matters for us**: This is simpler than our SQLite-backed model, but it means no persistent index state, no schema migration layer for retrieval data, and no incremental durability for derived structures. For Public, this would be a storage downgrade, not a simplification win.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: The authoritative schema is loose YAML frontmatter plus body; indexed structs are only lossy projections
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- **What it does**: `Document` stores `Frontmatter map[string]interface{}` and `Body`; getters are lightweight (`GetFloat` only handles numeric YAML types, not strings), and writes just serialize the map back out. Searchable `document` structs flatten only selected fields (`Path`, `Source`, `Subject`, `Title`, `Tags`, `Body`, `Predicate`, `Confidence`, `Importance`, `Kind`, `Created`, `Triage`) while keeping the raw map on the side.
- **Why it matters for us**: This is excellent for human-editable, git-friendly storage, but schema discipline is mostly conventional, not enforced. The most plausible use for Public is as an interchange/export layer, not as a replacement for typed persistent storage.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Modus has an immediate consistency split between file writes and searchable state
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- **What it does**: `vault_write`, `memory_store`, and `ReinforceFact` mutate markdown files directly. But `vault_search`, `vault_connected`, and `memory_search` only read the prebuilt in-memory `Index`, `factStore`, and `crossIndex`. Meanwhile `vault_list` and `memory_facts` rescan disk live, so they can see writes the search path cannot.
- **Why it matters for us**: This is a real storage-model weakness, not just a UX wrinkle: the system is not read-your-write consistent across tools. A newly stored fact can be listable but not searchable, and reinforced files can persist updated FSRS metadata while search still uses stale RAM copies. Public’s persisted DB plus consumer rebind path is materially safer.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: FSRS state is persisted directly in markdown fact files, but the active fact-search model ignores most of it
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- **What it does**: `DecayFacts()` and `ReinforceFact()` write `confidence`, `stability`, `difficulty`, `last_accessed`, `access_count`, `last_decayed`, and archival flags into fact frontmatter. But `MemFact` only materializes a smaller subset, and `factStore.search()` ranks on term overlap, a small confidence bonus, and created-date recency; it does not use stored stability, difficulty, or access history.
- **Why it matters for us**: Modus’s files carry cognitively meaningful state, but its query-time model only partially consumes that state. The useful lesson for Public is not to copy the thinner fact model, but to consider exposing our own persisted FSRS state more transparently when that helps operators reason about memory freshness.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Identity is path-derived, not stable, so renames are semantic changes
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- **What it does**: Search hits and facts are identified by relative path; `MemFact.ID` is the relative markdown path, dedup uses `Path`, and `memory_reinforce` takes a path. New facts are slugged from `subject-predicate` and collision-suffixed. There is no Modus-side equivalent of Public’s `memory_lineage` + `active_memory_projection` stable logical identity model.
- **Why it matters for us**: This is fine for a small personal vault, but path-based identity makes renames and moves double as identity changes, which weakens continuity for reinforcement history, links, and long-lived references. Public’s lineage tables are substantially stronger for evolving memories.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Public already has the richer persisted storage graph; Modus is a portability reference, not a schema upgrade
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **What it does**: Public persists a unified `memory_index` row with provenance, governance scope, FSRS fields, chunking, quality, and `content_text`, then derives `memory_fts`, `vec_memories`, `causal_edges`, `memory_summaries`, `memory_entities`, `entity_catalog`, `memory_lineage`, and `active_memory_projection`. DB consumers can rebind when the backing SQLite handle changes, and FSRS strengthening on retrieval is opt-in via `trackAccess`.
- **Why it matters for us**: The storage-layer gap is architectural, not incremental. Modus’s value is in transparent file-native ergonomics and understandable portability, but its underlying persistence model is much weaker than what Public already has.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`

## Assessment
- **New information ratio**: 0.88
- **Questions addressed**: source-of-truth layout; schema shape; persistence model; fact storage; FSRS field persistence; write/search consistency; identity model; comparison to Public’s DB design
- **Questions answered**: Modus has no durable retrieval DB; markdown frontmatter is the real schema; live writes and searchable state diverge after mutation; persisted FSRS state is only partially consumed by fact search; identity is path-based; Public already has a much richer persisted storage model

## Reflection
- **What worked**: Starting from `indexer.go`, `vault.go`, and `vault/facts.go` exposed the real storage model quickly, and comparing that directly against `vector-index-schema.ts` made the “portable snapshot vs persistent unified schema” difference unambiguous.
- **What did not work**: Broad repo-wide grep was too noisy for this question; the useful path was targeted source reads. I also did not validate any runtime freshness or performance claims dynamically, so storage conclusions here are code-backed but still static-analysis-backed.

## Recommended Next Focus
Trace **runtime freshness and mutation semantics** next: whether any write path triggers rebuild or cache invalidation, how long write-to-search consistency gaps persist in practice, and how the librarian/ranking layer behaves when the underlying in-memory snapshot is stale.


Total usage est:        1 Premium request
API time spent:         4m 34s
Total session time:     4m 54s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 17.4k out, 1.1m cached, 9.9k reasoning (Est. 1 Premium request)
