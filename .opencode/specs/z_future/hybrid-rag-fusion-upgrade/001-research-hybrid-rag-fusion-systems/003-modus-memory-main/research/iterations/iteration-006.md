# Iteration 006: MEMORY HYGIENE

## Focus
MEMORY HYGIENE: Deduplication, upserts, revision tracking, garbage collection, soft deletes, topic key stability.

## Findings

### Finding 1: Modus has no true fact upsert; it appends filename variants and hides duplicates at read time
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:339-375`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:273-316,347-379`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:37-51`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:182-243,245-310`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:927-977`
- **What it does**: `StoreFact()` derives a slug from `subject + "-" + predicate`, then resolves collisions by creating `-2`, `-3`, etc. files instead of updating an existing logical fact. Those duplicates are all indexed into the in-memory fact store. `memory_search` later deduplicates only at response time via `subject|predicate`, so duplication is masked rather than prevented.
- **Why it matters for us**: This is the opposite of hygienic memory mutation. It accumulates duplicate fact files and lets retrieval paper over the problem. Public already has same-path/content-hash dedup plus append-only supersede behavior when content actually changes, so Modus’s write pattern would be a regression.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus mutations do not refresh the live in-memory fact store, so hygiene is stale until restart
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:77-90`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:65-137,307-370`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:273-316,347-364,856-896`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:67-157,163-217,219-254,339-375`
- **What it does**: Modus builds its index once at startup. `memory_store`, `memory_reinforce`, `memory_decay_facts`, and `memory_archive_stale` all rewrite markdown files, but none update `idx.facts` or rebuild the index. Even automatic reinforcement from `memory_search` is just `go v.ReinforceFact(f.ID)`, so the persisted file changes asynchronously while the live search store stays unchanged.
- **Why it matters for us**: This is a major runtime hygiene flaw: dedup state, confidence, archive flags, and freshness are not read-your-writes consistent. Public’s mutation path updates DB state, BM25 state, lineage, and cache invalidation immediately; Modus does not.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Modus archive is only a partial soft-delete and its visibility rules are inconsistent
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:219-254,266-288`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:348-364`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:231-258,866-880`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-31`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:67-140,161-240`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:63-130`
- **What it does**: `ArchiveStaleFacts()` sets `archived=true` and `archived_at`, but `ListFacts()` does not filter archived files, so `memory_facts` still lists them. Only the startup-time fact index marks archived facts inactive for search. The memory tool surface exposes archive, decay, reinforce, and store, but no per-fact delete/update/restore workflow.
- **Why it matters for us**: Modus’s “soft delete” is not a coherent lifecycle state; it is a flag with inconsistent read behavior and no garbage-collection story beyond accumulation on disk. Public already distinguishes archived visibility at query time and offers explicit delete/checkpoint workflows.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Topic-key stability is weak because Modus uses raw strings, not canonical alias-backed identities
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:48-50,147-159`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:52-76,81-111,154-190`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go:18-35,62-99`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go:13-24`; `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:18-64`; `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:248-320`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:86-216`
- **What it does**: Fact lookup keys are just `strings.ToLower(strings.TrimSpace(subject))`; cross-ref keys are lowercased subject/tag/title text; entity resolution tries slug/name matching and finally a substring walk. There is no alias table or canonical subject/topic identifier, so spelling variants fragment neighborhoods.
- **Why it matters for us**: This is the biggest hygiene gap around topic stability. Public already does better on file identity and entity alias normalization, but Modus is a useful warning that exact-string topic keys are brittle. The lesson is worth exploring, but Modus’s implementation is not.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: `vault_write` is a destructive overwrite path with no revision trail, checkpoint, or append-only semantics
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:57-64`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:143-161`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go:10-51`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:138-224`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:94-140,190-239`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:666-776`
- **What it does**: `vault_write` passes arbitrary path/frontmatter/body to `v.Write()`, which directly calls `markdown.Write()`, which directly calls `os.WriteFile()`. That means overwrite-in-place, no revision record, no checkpoint, no mutation ledger, and no logical predecessor/successor relationship.
- **Why it matters for us**: This is a clear memory-hygiene mismatch with Public’s mutation model. Public mutations are transactional and auditable; Modus exposes a generic write primitive that can erase provenance in one call.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Newly stored facts begin with `created: "now"`, which breaks Modus’s own recency and decay heuristics
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:118-143,339-375`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go:134-148`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:53-79,187-228`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:243-257`
- **What it does**: `StoreFact()` writes a literal `created: "now"`. The shared `parseTime()` helper accepts RFC3339/date layouts only, so fresh facts cannot use `created` as a valid decay fallback. `recencyBoost()` and `StalenessWarning()` also fail open when that timestamp is unparseable.
- **Why it matters for us**: This is a concrete hygiene bug, not just a design tradeoff. A newly stored fact begins life outside the system’s own freshness/decay contract. Public’s save path writes machine-readable timestamps and lineage metadata, so Modus offers nothing to adopt here.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`

## Assessment
- **New information ratio**: 0.87
- **Questions addressed**: Modus fact dedup semantics; whether `memory_store` is an upsert; whether mutations refresh the live index; whether archive is coherent across tools; whether Modus has real revision tracking; how stable subject/entity/topic keys are; whether write-side timestamps support its own decay model.
- **Questions answered**: Modus does not implement true upsert for facts; duplicate control is mostly response-time masking; write-side mutations are not read-your-writes consistent; archive is only a partial soft-delete; revision/provenance tracking is largely absent on the generic write path; topic identity is exact-string fragile; freshly stored facts have a timestamp bug that undermines recency and decay.

## Reflection
- **What worked**: Tracing the hygiene path from MCP tool handlers into `vault` helpers, then checking the startup-only index build, made the runtime consistency story much clearer than searching README claims. Comparing each Modus mutation surface against Public’s dedup, lineage, checkpoint, and canonical-path code kept the recommendations concrete.
- **What did not work**: Broad keyword searches across the whole tree were noisy until narrowed to write/mutation entrypoints. The phase packet also lacks active deep-research state files, and the strict spec validation command was permission-blocked in this environment, so this iteration is a direct source-trace rather than a full packet-state update.

## Recommended Next Focus
Trace the **caller contract and write-arbitration boundary** next: whether Modus expects a prompt-side “Librarian” policy layer to decide when to `vault_write` versus `memory_store`, and how much of its claimed dedup/context hygiene is delegated to that policy layer rather than enforced in the server itself.


Total usage est:        1 Premium request
API time spent:         6m 14s
Total session time:     6m 43s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  3.1m in, 19.9k out, 2.9m cached, 9.4k reasoning (Est. 1 Premium request)
