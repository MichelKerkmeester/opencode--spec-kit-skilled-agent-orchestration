# Iteration 5: RQ-05 close (scan throughput + incremental accuracy) + RQ-06 groundwork (query latency/cache)

## Focus

Close RQ-05 from source by tracing the full scan path, per-file parser path, and
freshness/persistence logic. Start RQ-06 by checking whether `code_graph_query`
has any latency instrumentation or cache layer, and if so how cache keys are
formed.

## Actions Taken

1. Re-read prior continuity in `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-004.md`.
2. Read the scan driver in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`.
3. Read the tree-sitter backend in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts`.
4. Read persistence + freshness logic in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`.
5. Read scan result accounting in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`.
6. Grepped `code-graph` for `bench|benchmark|perf|latency|cache|query` and confirmed there is no `code-graph/bench/` harness in this tree; the only query-path files present are `handlers/query.ts`, `lib/query-intent-classifier.ts`, and `lib/ensure-ready.ts`.
7. Read `code_graph_query` handler and the DB query helpers it calls.

## Findings

### F23 — RQ-05: scan throughput is serial and single-threaded, with one-file-at-a-time parse/persist

`indexFiles()` builds a candidate file list, then iterates it with a plain
`for ... of`, reads each file synchronously via `readFileSync`, awaits
`parseFile()`, and pushes the result before moving on to the next file. There is
no worker pool, chunking, or per-language parallel lane in the scan driver. The
default config limits the corpus to JS/TS/Python/Bash-family files and skips any
file above 102,400 bytes, so the source-defined ceiling is "serial throughput
over files <=100 KB" rather than a measured per-language files/sec budget.

Sources:
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1368-1414`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1057-1079`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:113-120`

### F24 — RQ-05: incremental skip correctness is still mtime-only; stored content hashes do not protect against same-mtime content changes

The DB schema stores both `content_hash` and `file_mtime_ms`, but
`isFileStale()` only loads `file_mtime_ms` and compares it to the current on-disk
mtime. `indexFiles()` uses that boolean to skip pre-parse work. Result:
incremental reindexing will false-negative if file bytes change while mtime is
preserved or forged, because no read or hash recomputation occurs on the fresh
path. `ensureFreshFiles()` uses the same stored-mtime comparison, so the same
blind spot applies to the readiness detector.

Sources:
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:55-66`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:380-388`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:396-424`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1397-1402`

### F25 — RQ-05: partial-persist correctness was hardened; failed structural writes stay stale and retryable

Persistence now stages `file_mtime_ms=0`, writes nodes and edges, then performs a
final `upsertFile()` with the real mtime. The DB contract explicitly documents
this as a way to keep `isFileStale()` returning `true` until structural rows have
landed. In `indexWithTimeout()`, persistence failures are swallowed as
best-effort and the comment confirms the file remains stale for the next retry.
So incremental correctness improved for partial persistence, but not for the
same-mtime content-change case above.

Sources:
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:284-303`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:183-218`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:221-242`

### F26 — RQ-05: the code records per-file parse duration, but there is no per-language benchmark harness or hard per-file timeout

Both parser backends stamp `parseDurationMs` per file, and the scan handler
reports only whole-scan `durationMs`. There is no built-in aggregation by
language, percentile summary, or benchmark runner under `code-graph/bench/` in
this checkout. The only timeout guard is `AUTO_INDEX_TIMEOUT_MS = 10_000` inside
`ensure-ready`, which applies to auto-indexing on the read path. Explicit
`code_graph_scan` calls do not impose a per-file timeout or a whole-scan timeout
in the handler itself.

Sources:
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:622-676`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:673-724`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:41-45`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:183-200`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:127-131`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:247-255`

### F27 — RQ-06 groundwork: there is no query-result cache; the only cache-like layer is a 5s readiness debounce keyed only by workspace/options

`handleCodeGraphQuery()` always calls `ensureCodeGraphReady()`, then resolves the
subject and executes live DB lookups. Relationship queries call
`graphDb.queryEdgesFrom()` / `queryEdgesTo()`, which run SQL every time and then
do per-edge node lookups (`SELECT * FROM code_nodes WHERE symbol_id = ?`) during
mapping. The only cache in this path is `readinessDebounce`, a 5-second
in-memory map keyed by `{ rootDir, allowInlineIndex, allowInlineFullScan }`.
That key excludes operation, subject, edge type, depth, limit, or any normalized
query text, so near-duplicate prompts do not miss a query cache because no query
cache exists; they only share the readiness precheck if they hit the same
workspace + option tuple within five seconds.

Sources:
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:757-771`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:899-920`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:942-1101`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:534-570`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:255-293`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:264-274`

## Questions Answered

- **RQ-05 resolved:** The current scan path is serial, capped to files <=100 KB,
  instrumented with per-file parse times but not benchmarked per language, and
  incremental correctness still has an mtime-only false-negative window. Partial
  persistence is protected by the staged-`mtime=0` write pattern.

## Questions Remaining

- **RQ-06:** There is still no measured P50/P95/P99 query latency from source
  alone. The next step is to find whether any tests, fixtures, or runtime logs
  capture query durations, or else conclude that percentile telemetry is absent.
- **RQ-06:** Cache-hit ratio cannot be computed from code_graph_query as written,
  because the query path has no result cache and emits no hit/miss counters.
- **RQ-09 spillover:** Benchmark coverage remains thin. This iteration confirmed
  instrumentation points, but not an end-to-end benchmark harness.

## Next Focus

Stay on RQ-06. Inspect tests and any adjacent context/query utilities for
latency assertions, result memoization, or telemetry. If none exist, close
RQ-06 as "no percentile instrumentation / no query-result cache" and separate
readiness-debounce behavior from actual query execution cost.
