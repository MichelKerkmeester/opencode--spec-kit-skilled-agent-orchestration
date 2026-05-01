# Iteration 034: PERFORMANCE IMPLICATIONS

## Focus
PERFORMANCE IMPLICATIONS: Analyze performance trade-offs of adopted patterns. Search latency, storage growth, indexing overhead, startup time impact.

## Findings

### Finding 1: Exact key lookup is the highest-leverage low-cost latency optimization
- **Source**: Engram `topic_key` index + direct lookup; Public artifact-preserving router [SOURCE: `001-engram-main/external/internal/store/store.go:572-577,1462-1519`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-56,68-71,113-157`]
- **What it does**: Engram keeps `topic_key` on the main table, indexes it, and checks it directly before running FTS when the query looks like a structured key. Public already preserves BM25 for artifact-like queries and trims channel count for simple queries.
- **Why it matters**: A future Public `thread_key` lane would be cheap to store and very fast to query because it can bypass vector, graph, rerank, and community fallback on exact-thread lookups.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Public’s hybrid retrieval is inherently slower than Engram’s FTS path, so routing, cache, and quick-mode are mandatory safeguards
- **Source**: Engram single FTS search; Public sequential hybrid channels, cache/dedup, mode routing, trigger fast-path [SOURCE: `001-engram-main/external/internal/store/store.go:1518-1583`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973-976,994-1111`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450-471,486-520,718-809`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:649-679,700-807,891-927`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156-177,444-505`]
- **What it does**: Engram does direct-key lookup plus one sanitized FTS5 query ordered by `fts.rank`. Public runs vector/FTS/BM25/graph/degree sequentially, may rerank, waits for embeddings on cache miss, dedups across sessions, and routes low-latency cases into `memory_match_triggers` or smaller channel subsets.
- **Why it matters**: Public’s quality wins come from extra stages, so performance depends on not paying full-pipeline cost for every query. The exact-key lane, quick mode, cache hits, and channel routing are not nice-to-haves; they are the cost-control layer.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Deferred embeddings are the right write-latency pressure valve, but they turn write cost into background indexing debt
- **Source**: Public deferred embedding pipeline and deferred row creation; startup catch-up path [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:119-190`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:138-210`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:728-829,1043-1073`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1230-1305`]
- **What it does**: Public can skip immediate embedding generation, create a deferred record, and recover/index later through startup scan or background retry. Engram does not need this because its write path is lexical-only SQLite + FTS.
- **Why it matters**: This is the clearest save-time trade-off in Public: lower p50 save latency now, weaker semantic recall until background recovery catches up later. That trade is worth keeping because the alternative is making every save pay full embedding latency.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 4: Storage growth is the hidden cost of Public’s append-only + chunked lineage model
- **Source**: Engram topic upserts and duplicate counters; Public append-only/chunked save path [SOURCE: `001-engram-main/external/internal/store/store.go:462-467,575-577,948-1068`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:166-229`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:831-905,927-1031`]
- **What it does**: Engram reuses rows for stable topics and increments `revision_count` / `duplicate_count`. Public can create superseding rows, chunk large files into parent + child records, and then add enrichment metadata, causal links, entities, and summaries.
- **Why it matters**: Public’s model is better for provenance and retrieval richness, but it will grow faster on disk and across secondary indexes. The efficient part worth borrowing is narrow thread/session-summary reuse, not a blanket shift to lossy in-place mutation.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 5: Startup cost in Public is already composite, so any recent-session digest must stay bounded and additive
- **Source**: Engram DB open + bounded context formatter; Public composite resume/bootstrap + startup scan [SOURCE: `001-engram-main/external/internal/store/store.go:395-425,1613-1667`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-598`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-217`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1230-1305`]
- **What it does**: Engram startup is mostly SQLite open, pragmas, migrations, then a bounded formatter over recent sessions/prompts/observations. Public startup/resume already composes `memory_context`, graph status, CocoIndex availability, health hints, pending-file recovery, and optional startup indexing.
- **Why it matters**: The continuity win from a recent-session digest is real, but adding unbounded digest work to Public’s boot path would stack CPU, I/O, and token cost on top of an already heavy startup surface.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 6: File-backed context saving only stays practical because Public already pays for aggressive incremental indexing
- **Source**: generate-context file output and incremental scan controls [SOURCE: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:81-88`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:148-205,212-245,367-388,486-505`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1230-1305`]
- **What it does**: `generate-context.js` writes memory files for later indexing instead of doing a direct DB-only save. `memory_index_scan` rate-limits scans, canonical-dedups alias paths, categorizes changed vs unchanged files, and only updates mtimes after successful indexing.
- **Why it matters**: This shifts some save cost out of the interactive path, but it makes scan discipline part of the core performance story. Without incremental categorization and stale-cleanup control, startup scans and maintenance reindexes would get expensive fast.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- `001-engram-main/external/internal/store/store.go:395-425,439-506,572-577,754-805,948-1068,1462-1583,1613-1667`
- `001-engram-main/external/internal/mcp/mcp.go:50-80,121-138`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973-1111`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-56,68-71,113-157`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450-471,486-520,718-809`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:329-635,641-679,700-807,891-927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156-177,444-505`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:119-190`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:138-229`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:728-829,831-905,927-1073`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:148-205,212-245,367-388,486-505`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-598`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-217`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1230-1305`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:81-88`

## Assessment
- **New information ratio**: 0.34
- **Questions addressed**: exact-key lookup cost; hybrid-query latency; write-path latency; storage growth; indexing overhead; startup/resume cost
- **Questions answered**: exact-key lookup cost; hybrid-query latency; write-path latency; storage growth; indexing overhead; startup/resume cost
- **Novelty justification**: Earlier iterations identified which patterns were worth carrying forward; this pass mapped them to concrete hot paths and showed which ones are cheap shortcuts versus expensive pipeline additions.

## Ruled Out
- Replacing Public’s hybrid retrieval with Engram-style FTS-only search, because the latency win would come from dropping semantic and graph recall that Public intentionally depends on.
- Using broad in-place topic/thread upserts for all memory classes, because it reduces storage but conflicts with append-only lineage, supersedence, and causal-history guarantees.
- Making embeddings mandatory and eager on every save or startup, because it would worsen write latency and make boot more brittle around provider readiness.

## Reflection
- **What worked**: tracing Engram’s `Store` hot paths directly against Public’s search/save/startup handlers made the cost trade-offs obvious because both systems expose their real critical paths in a small number of files.
- **What did not work**: CocoIndex and memory-context retrieval were unavailable in this environment, so semantic lookup had to be replaced with direct file-path reads.
- **What I would do differently**: pre-build a tiny symbol-to-line map for the Engram and Spec Kit hot files before the pass to reduce time spent locating exact citation ranges.

## Recommended Next Focus
MEASUREMENT PLAN: define concrete p50/p95 targets and shadow instrumentation for query latency, save latency, pending-embedding backlog, index-scan duration, DB growth, and startup/resume time before implementing thread-key lanes or bounded recent-session digests.


Total usage est:        1 Premium request
API time spent:         4m 59s
Total session time:     5m 27s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  3.1m in, 17.8k out, 2.9m cached, 9.2k reasoning (Est. 1 Premium request)
