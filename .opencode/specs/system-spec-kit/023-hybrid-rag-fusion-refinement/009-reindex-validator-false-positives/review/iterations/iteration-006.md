# Iteration 006 - Performance Review

Scope: performance review of the reindex/backfill/context-type migration changes, with emphasis on forced batch reindex behavior, duplicate-row cleanup, CHECK-constraint expansion, regex overhead, and `--include-archive` backfill scale.

## P0

None.

## P1

### P1-1 - Forced reindex still executes the expensive indexing path for unchanged files and can recreate large duplicate churn

- File: `mcp_server/handlers/memory-index.ts`, `mcp_server/handlers/save/dedup.ts`, `mcp_server/handlers/memory-save.ts`, `mcp_server/handlers/save/create-record.ts`, `mcp_server/lib/search/vector-index-mutations.ts`
- Line: `memory-index.ts:367-406`, `dedup.ts:182-239`, `242-307`, `memory-save.ts:728-805`, `927-981`, `create-record.ts:166-177`, `180-250`, `vector-index-mutations.ts:194-253`
- Evidence:
  - The scan handler disables the incremental fast path whenever `force` is set, then still sends every file through `indexSingleFile(...)`; `warn-only` only changes `qualityGateMode`, not whether the file is skipped. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:367-406`]
  - Both same-path unchanged detection and content-hash duplicate detection explicitly short-circuit only when `!force`, so forced scans bypass the cheap exits that normally avoid rework. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:182-239`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:242-307`]
  - The save pipeline performs embedding-cache lookup / generation before the write transaction, and because the duplicate guards above are disabled under `force`, unchanged files still reach that stage. On a cache miss they will regenerate embeddings even though content is unchanged. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:728-805`]
  - The write path then enters an immediate transaction and, for same-path existing files, routes through append-only lineage logic. That ultimately forces `vector-index` into the `INSERT` path instead of the in-place `UPDATE` path when `appendOnly` is true. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:927-981`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:166-177`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:180-250`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:194-253`]
  - The spec/checklist explicitly records the downstream effect of this churn: force reindex accumulated 13,211 duplicate rows that later had to be deleted. [SOURCE: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/spec.md:104-106`; `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/checklist.md:39-40`]
- Impact:
  - `warn-only` does not materially improve forced reindex throughput; it mostly removes validation rejection, not the work done per file.
  - For a 1,201-file forced scan, unchanged files still pay parse/validate/cache-lookup costs, may pay provider embedding costs on cache miss, and still incur DB write churn. That makes runtime close to a full rewrite and explains the large dedup cleanup afterward.
- Recommendation:
  - Split "force validation semantics" from "force rewrite semantics." A forced scan that wants `warn-only` should still be able to keep the unchanged/content-hash short-circuits for byte-identical files.
  - Move the cheapest unchanged test (mtime/content-hash/canonical-path) ahead of embedding generation and ahead of append-only lineage insertion, so unchanged files can be counted as revalidated without re-embedding and re-inserting.

## P2

### P2-1 - The validator's per-file spec-folder work is dominated by repeated filesystem I/O, not the regex itself

- File: `scripts/lib/validate-memory-quality.ts`
- Line: `482-515`, `524-555`, `624-637`, `706-733`, `829-846`
- Evidence:
  - The new fallback regex for missing `spec_folder` is a single non-nested match against `filePath`; by itself it is cheap. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:624-637`]
  - The heavier part is the follow-on work done on every validation call: resolving candidate spec-folder paths by walking parent directories and calling `fs.statSync`, scanning child phase folders with `fs.readdirSync`, and re-reading `spec.md` once for `related_specs` and again for `trigger_phrases`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:482-515`; `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:524-555`; `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:706-733`; `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:829-846`]
- Impact:
  - The regex itself is unlikely to be the bottleneck across 1,200 files; the uncached filesystem discovery around it is the more likely source of validator overhead during large reindex runs.
  - This is probably still secondary to the forced-save churn above, but it creates avoidable repeated disk work for files that share the same spec folder.
- Recommendation:
  - Cache resolved spec-folder metadata per `specFolder` during a batch scan: resolved absolute path, allowed-spec ID set, and parsed `trigger_phrases`.
  - Keep the regex fallback, but avoid repeated `statSync` / `readdirSync` / `readFileSync(spec.md)` for every file in the same folder.

## Checked Items / Non-findings

### 1. DB dedup query

- I did not find the exact `DELETE FROM memory_index WHERE id NOT IN (SELECT MAX(id) FROM memory_index GROUP BY file_path)` statement in the reviewed source files; only the spec/checklist mention the cleanup. [SOURCE: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/spec.md:105-106`; `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/checklist.md:39-40`]
- Performance-wise, the table does have an index on `file_path`, so a one-off 14k-row dedup grouped by that column is not alarming on its own. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1929-1930`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2375`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:178`]
- I cannot verify from committed code whether that cleanup was wrapped in an explicit transaction, because the operation itself is not present in the reviewed implementation.

### 2. CHECK-constraint expansion to include `planning`

- No performance finding.
- In the reviewed code, adding `'planning'` appears in table-creation / rebuild DDL, not as a standalone `ALTER TABLE ... ADD CONSTRAINT` on an existing SQLite table. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2254`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:137`]
- The normal upgrade path shown in this file adds the `context_type` column without rebuilding the table, so this change does not introduce a new per-row validation sweep on already-upgraded databases. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1656-1659`]

### 3. Template backfill over 2,383 files with `--include-archive`

- No severity finding for the reviewed scale.
- The CLI is a synchronous maintenance script that discovers targets, deduplicates them, then processes files serially with one read/build/write pass per file. [SOURCE: `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:236-303`; `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:343-395`; `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:487-571`]
- That is not especially sophisticated, but for a one-off maintenance pass over ~2.4k markdown files it looks operationally acceptable. The more important cost center in this phase is the forced reindex behavior above, not the backfill script.
