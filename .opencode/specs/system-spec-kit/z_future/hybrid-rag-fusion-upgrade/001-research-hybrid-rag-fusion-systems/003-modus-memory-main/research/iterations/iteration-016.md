# Iteration 016: EDGE CASES & FAILURE MODES

## Focus
EDGE CASES & FAILURE MODES: How does this system handle errors, corruption, migration, scaling? Lessons for us.

## Findings

### Finding 1: **Modus’s “degraded mode” is not actually survivable**
- **Source**: `external/cmd/modus-memory/main.go:77-90`; `external/internal/mcp/vault.go:21-53,273-317,915-917`; `external/internal/vault/facts.go:290-337`
- **What it does**: Startup logs `index build failed` and claims it can continue, but `main.go` still calls `idx.DocCount()` even when `index.Build()` returned `nil, err`. The MCP layer also assumes an index exists: `memory_search` calls `v.Index.SearchFacts(...)` directly, while only the lower-level `Vault.SearchFacts()` method contains a no-index fallback. `vault_connected` also just returns `"Index not loaded."` rather than recovering.
- **Why it matters for us**: This is a brittle failure contract: one bad scan can turn “start degraded” into a startup panic or nil-deref path. Public is already stricter here: DB refresh/rebind is mutexed, refuses empty-db drift, and returns explicit degraded/error responses instead of pretending recovery succeeded.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 2: **Parser corruption is silently normalized instead of surfaced**
- **Source**: `external/internal/markdown/parser.go:98-159,161-186`; `external/cmd/modus-memory/doctor.go:33-106`
- **What it does**: If YAML frontmatter fails to parse, `Parse()` silently treats the frontmatter block as body text and returns success. `ScanDir()` also suppresses filesystem walk errors and parse failures (`return nil // skip errors`, `return nil // skip unparseable files`). Then `doctor` operates on that already-sanitized view, so malformed frontmatter is reduced to softer symptoms like “documents without frontmatter” or missing fact fields rather than a hard corruption report.
- **Why it matters for us**: Modus optimizes for “keep indexing something,” but the cost is silent data quality loss and weaker operator trust. Public’s `memory_save` path is materially safer: preflight, dry-run, validation, and atomic save all give us a better place to reject malformed state before it becomes indexed ambiguity.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 3: **The plain-file write and migration path is non-atomic, partial, and lossy**
- **Source**: `external/internal/markdown/writer.go:10-52`; `external/cmd/modus-memory/import_khoj.go:48-58,64-77,94-97,131-133,181-223,236-280,345-369`
- **What it does**: Core writes go straight to the final path with `os.WriteFile`; Khoj import uses `os.Create` directly, continues after per-file failures, skips already-existing files, truncates imported context over 2000 chars, deduplicates context by the first 200 chars, and falls back to `time.Now()` when timestamps cannot be parsed. There is no temp-file promotion, rollback, checkpoint, manifest, or resume journal.
- **Why it matters for us**: This is fine for a lightweight local tool, but it is the wrong mutation model for governed or high-value memory. Public already has the stronger pattern: checkpointed bulk operations, rollback-aware atomic saves, and post-insert cleanup when metadata application fails. If we ever add importer workflows or operator batch jobs, they should follow Public’s mutation model, not Modus’s write-through importer.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 4: **A timestamp edge case can disable the intended memory lifecycle**
- **Source**: `external/internal/vault/facts.go:118-157,339-375`; `external/internal/index/facts.go:53-79,187-229`; `external/cmd/modus-memory/import_khoj.go:266-280`
- **What it does**: `StoreFact()` writes `created: "now"` as a literal string. But recency boosting, tier labeling, staleness warnings, and decay all expect parseable dates or RFC3339 timestamps. That means newly stored facts can miss age-aware behavior until some later successful recall writes `last_accessed`. Separately, Khoj import converts bad timestamps to the current wall clock, which silently rewrites chronology.
- **Why it matters for us**: This is a good example of how lightweight markdown persistence can quietly undermine lifecycle logic if timestamps are not normalized at write time. Public should keep lifecycle timestamps machine-parseable and validation-gated at ingest; our current preflight/save architecture already gives us the right enforcement point.
- **Recommendation**: **reject**
- **Impact**: **medium**

### Finding 5: **Scaling is “rebuild everything in memory,” with a few latent concurrency footguns**
- **Source**: `external/internal/index/indexer.go:65-149,307-371`; `external/internal/index/bm25.go:103-181`; `external/internal/index/cache.go:27-119`; `external/internal/mcp/server.go:88-111`; `external/internal/mcp/vault.go:311-317`
- **What it does**: Every build/open rescans markdown, reparses documents, rebuilds BM25, cross-refs, and the fact store entirely in RAM. Prefix fallback linearly scans the full term map. `memory_search` launches a goroutine per returned fact for asynchronous reinforcement writes. The cache uses `RWMutex`, but `get()` mutates `hits` while holding only `RLock`, which is unsafe if request handling ever becomes concurrent. The current stdio loop is serial, so that race is partly masked today.
- **Why it matters for us**: Modus’s architecture is intentionally simple, but it does not transfer well to Public’s larger, longer-lived memory surface. Public’s incremental DB-backed indexing, guarded rebind path, and post-restore rebuild hooks are the right direction; the Modus lesson is mostly where the scaling cliffs are, not a backend we should copy.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 6: **The strongest transferable pattern here is the operator-facing “doctor,” not Modus’s repair depth**
- **Source**: `external/cmd/modus-memory/doctor.go:13-241`; `external/cmd/modus-memory/main.go:130-147`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222-499`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-520`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:43-180`
- **What it does**: Modus gives operators a very readable `health`/`doctor` surface: counts, contradictions, duplicates, empty docs, directory distribution. But it is mostly advisory; it does not pair diagnosis with durable rollback or strong repair flows. Public already has deeper repair machinery—auto-repair for FTS drift, orphan-edge cleanup, restore barriers, checkpoint restore index rebuilds—but the surface is more technical and less “single-screen triage.”
- **Why it matters for us**: The net-new idea is not Modus’s recovery engine; it is the usability of a compact operator diagnostic surface. Public could benefit from a friendlier “doctor summary” layered over existing `memory_health`, checkpoints, and mutation ledgers.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **medium**

## Sources Consulted
- `external/cmd/modus-memory/main.go`
- `external/cmd/modus-memory/doctor.go`
- `external/cmd/modus-memory/import_khoj.go`
- `external/internal/index/indexer.go`
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/facts.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/internal/markdown/json.go`
- `external/internal/librarian/client.go`
- `external/internal/librarian/search.go`
- `external/internal/mcp/server.go`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/vault/prs.go`
- `external/internal/vault/trust.go`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`

## Assessment
- New information ratio: **0.86**
- Questions addressed: whether Modus really survives index/build failure; how malformed markdown is handled; whether migration/import is resumable or rollback-safe; whether lifecycle timestamps can corrupt decay behavior; what scaling/concurrency cliffs exist; whether health tooling is diagnostic or reparative.
- Questions answered: Modus is **much more best-effort than durable**. It prefers silent fallback, partial progress, and operator cleanup over transactional guarantees. Public already has stronger recovery primitives; the main missing transfer is a more humane **doctor-style summary surface**, not Modus’s storage/mutation model.

## Reflection
- What worked: Tracing failure paths from `main.go` into `index.Build`, then following parser behavior into `doctor`, exposed where marketing-friendly “it just keeps working” turns into silent loss or startup fragility. Comparing those paths directly against Public’s atomic save, checkpoint, and health handlers made the tradeoff very clear.
- What did not work: README and migration copy overstate recovery. Static analysis can validate that diagnostics exist and that writes are non-atomic, but it cannot prove the advertised performance numbers or how often the latent cache race would manifest in practice.

## Recommended Next Focus
Study a system with a **real resumable ingest/repair journal or maintenance queue**—something that combines operator-visible triage with durable rollback/retry—so the next iteration can test how Public should expose batch recovery workflows without inheriting Modus’s silent-fallback behavior.


Total usage est:        1 Premium request
API time spent:         4m 5s
Total session time:     4m 23s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.4m in, 16.1k out, 1.3m cached, 8.0k reasoning (Est. 1 Premium request)
