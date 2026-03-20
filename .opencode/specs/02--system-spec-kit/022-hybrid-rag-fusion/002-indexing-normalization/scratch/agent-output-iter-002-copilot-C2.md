● skill(system-spec-kit)

I’m mapping the pipeline end-to-end first, then I’ll trace edge cases like stale entries, alias collisions, and incremental scan failure modes against the actual implementation.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/31664489-0f0e-4eb4-bb03-3aa210ad5c9a/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read the five target files plus any tightly coupled helpers they directly invoke for dedup,…
  └ 8 lines...

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

I’ve got the high-level context; next I’m drilling into the exact control flow and edge cases in the five source files so the findings are anchored to line-level evidence rather than inferred behavior.

● Search (grep)
  │ "canonical|dedup|alias|mtime|incremental|rename|move|delete|stale|symlink|realpath|normalize|fro
  │ ntmatter|tier|inline marker|marker|stat\(|lstat\(|readdir|scan|content_hash" in
  │ {handlers/memory-index.ts,handlers/memory-index-discovery.ts,handlers/memory-index-alias.ts,lib/
  │ parsing/memory-parser.ts,lib/utils/canonical-path.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Read memory-index-discovery.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
  └ 197 lines read

● Read memory-index-alias.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
  └ 333 lines read

● Read canonical-path.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts
  └ 64 lines read

● Explore Analyzing memory pipeline
  │ Search for concurrency-related code in memory-save (shell)
  │   │ grep -n "transaction\|lock\|race\|concurrent\|atomic\|TOCTOU"
  │   │ /Users/michelkerkmeester/MEGA/Development/Opencode\
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | head -20
  │   └ 21 lines...
  └ Search for file deletion/rename handling (shell)
      │ grep -n "DELETE\|stale\|rename\|move" /Users/michelkerkmeester/MEGA/Development/Opencode\
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts |
      head
      │ -15
      └ 13 lines...

I found one likely auxiliary helper outside the five requested files that the scan handler relies on, so I’m spot-checking the critical paths directly in source now to confirm the explore pass before I synthesize the final findings.

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L520:620 (101 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L1:260 (259 lines read)

● Search (grep)
  │ "resolveImportanceTier|importance_tier|importanceTier|\[CONSTITUTIONAL\]|\[CRITICAL\]|\[IMPORTAN
  │ T\]|getDefaultTierForDocumentType|frontmatter|documentType"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts)
  └ 26 lines found

● Search (grep)
  │ "getCanonicalPathKey|dedupDuplicatesSkipped|categorizeFilesForIndexing|listStaleIndexedPaths|del
  │ eteStaleIndexedRecords|handleMemoryIndexScan|processBatches|indexSingleFile|aliasConflicts|runDi
  │ vergenceReconcileHooks" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 32 lines found

● Search (grep)
  │ "export function categorizeFilesForIndexing|function shouldReindex|listStaleIndexedPaths|canonic
  │ al_file_path|file_mtime_ms|MTIME_FAST_PATH_MS|embedding_status|statSync|exists" in
  │ **/incremental-index.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 39 lines found

I’ve confirmed the dedup and tiering code paths directly. I’m doing one last pass through the incremental-index helper and the save-side lock path so I can separate real races from mitigated ones.

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L260:647 (388 lines read)

● Read incremental-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
  └ L1:420 (420 lines read)

● Search (grep)
  │ "recordDivergenceReconcileHook|shouldRetry|escalation|reconcile" in mutation-ledger.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage)
  └ 21 lines found

● Search (grep)
  │ "withSpecFolderLock|SPEC_FOLDER_LOCKS|indexMemoryFile|canonical_file_path|realpathSync|file_mtim
  │ e_ms" in memory-save.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 14 lines found

I confirmed there is a save-side per-spec-folder lock, but the scan handler itself doesn’t take that lock. I’m reading the exact `indexMemoryFile()` call path now to verify whether scan work inherits the save lock indirectly.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L660:860 (201 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L110:180 (71 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L470:560 (91 lines read)

I’ve confirmed the scan path inherits the save-side spec-folder mutex indirectly through `indexMemoryFile()`. One final read on the parser’s document-type resolution will let me tighten the tier-precedence answer and avoid overstating what counts as “frontmatter.”

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L160:280 (120 lines read)

● Search (grep)
  │ "function extractDocumentType|getDefaultTierForDocumentType|document_type|spec\.md|plan\.md|deci
  │ sion-record|implementation-summary|handover" in
  │ {lib/parsing/memory-parser.ts,lib/scoring/importance-tiers.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

I’ve verified the parser does infer document type purely from filename/path context. I’m grabbing the default-tier mapping itself so the precedence answer can be precise about what the final fallback actually is.

● Read importance-tiers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
  └ L200:245 (30 lines read)

● Search (grep)
  │ "export function getDefaultTierForDocumentType|case 'spec'|case 'plan'|case
  │ 'decision_record'|case 'constitutional'|case 'tasks'|case 'checklist'|case
  │ 'implementation_summary'|case 'research'|case 'handover'"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts)
  └ 1 line found

I’ve validated the hot spots already, but because you explicitly asked for a deep-dive on the parser too, I’m reading the remaining parser sections so the final findings are based on the full file rather than just the tier-related slice.

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L1:159 (159 lines read)

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L280:519 (240 lines read)

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L620:969 (350 lines read)

I’m down to one uncertainty that matters for the race analysis: whether `processBatches()` fans out concurrently or just chunks sequentially. I’m checking that helper so I don’t overstate the concurrency risk.

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/utils/index.ts
  └ 59 lines read

● Search (grep)
  │ "async function processBatches|function processBatches|export .*processBatches"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 1 line found

That helper lives in the batch processor module, so I’m reading it directly. If it’s sequential, the race risk is mostly cross-scan and delete-vs-save; if it’s parallel, the intra-scan contention story changes.

● Read batch-processor.ts
  │ .opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts
  └ L1:220 (175 lines read)

I confirmed `processBatches()` does run files concurrently within each batch (`Promise.all` with batch size 5 by default), so I’m checking one last save-side dedup helper: whether a canonical-path match updates the stored `file_path` or leaves the old path behind after a move.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L180:340 (161 lines read)

● Search (grep)
  │ "function checkExistingRow|checkExistingRow\(|canonicalFilePath|file_path =|UPDATE
  │ memory_index|existing row" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 7 lines found

I found the call site but not the helper body in the previous slice, so I’m opening the section where `checkExistingRow()` is defined. That should tell us whether a path move collapses onto the existing row or leaves stale aliases behind.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L340:470 (131 lines read)

● Search (grep)
  │ "function checkExistingRow|const checkExistingRow|checkExistingRow ="
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ No matches found

The helper isn’t in the slice I opened, so I’m searching a bit wider in the file for the canonical-path query/update logic itself. Once I have that, I can close the loop on rename/move behavior confidently.

● Search (grep)
  │ "canonicalFilePath|canonical_file_path|content_hash|SELECT .*memory_index|UPDATE
  │ .*memory_index|duplicate|reinforced|unchanged"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 17 lines found

I found the actual insert/update zone around the canonical-path query, so I’m opening that block directly. This should settle whether a moved file updates the existing row or inserts a second row keyed to the same canonical path.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L560:660 (101 lines read)

The persistence path checks for an existing record just before insert, so I’m reading that lookup helper. If it matches by canonical path and updates status without rewriting `file_path`, that’s the key detail for moved-file behavior.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L860:960 (100 lines read)

● Search (grep)
  │ "function findSamePathExistingMemory|const
  │ findSamePathExistingMemory|findSamePathExistingMemory\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 1 line found

That lookup helper isn’t local to the slice I opened, so I’m searching the whole MCP server. If it lives in shared storage code, that’s actually a useful signal about how path identity is centralized.

● Search (grep)
  │ "findSamePathExistingMemory" (.opencode/skill/system-spec-kit/mcp_server)
  └ 8 lines found

The path lookup is centralized in `handlers/save/create-record.ts`, so I’m reading just that helper. This is the last dependency I need for a reliable answer on move/rename and duplicate-row behavior.

● Read create-record.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
  └ L1:140 (140 lines read)

I’ve got the existence check, and now I’m opening the insert/update branch immediately below it. If it always calls `vectorIndex.indexMemory()` with the new path, that means move handling is append-oriented rather than path-rewriting.

● Read create-record.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
  └ L120:240 (121 lines read)

Deep-dive complete. No code changes.

- `PIPELINE-001` `MEDIUM` Canonical dedup in `memory-index.ts` merges `findMemoryFiles()`, `findConstitutionalFiles()`, and `findSpecDocuments()`, then drops duplicates by `getCanonicalPathKey()` (`memory-index.ts:189-220`). The key is `realpathSync()` with `path.resolve()` fallback, so existing symlink/dot-segment aliases collapse (`canonical-path.ts:24-29`). Discovery also dedups roots/files internally (`memory-parser.ts:838-917`, `memory-index-discovery.ts:50-117`).

- `PIPELINE-002` `LOW` Tier precedence is deterministic in code but weakly documented. Actual order is: uncommented `importance_tier`/`importanceTier` match anywhere in content, then inline markers (`[CONSTITUTIONAL]`, etc.), then `fallbackTier`, then document-type default, then `normal` (`memory-parser.ts:543-579`). So it is **not** a strict frontmatter parser.

- `PIPELINE-003` `MEDIUM` Scan concurrency is partially mitigated, not eliminated. `processBatches()` runs concurrent `Promise.all` batches (`batch-processor.ts:116-150`). `indexMemoryFile()` parses before the per-spec-folder lock is acquired (`memory-save.ts:674-700`, lock at `memory-save.ts:493-518`), leaving a pre-lock TOCTOU window. There is also no global scan mutex; `setLastScanTime()` happens only at the end (`memory-index.ts:167-185`, `588`).

- `PIPELINE-004` `MEDIUM` Rename/move behavior is eventual-cleanup, not atomic relocation. Incremental scan marks stale rows only when neither stored `file_path` nor `canonical_file_path` exists and the canonical path was not rediscovered (`incremental-index.ts:262-309`). Ordinary moves therefore create a new path identity and leave the old row until the next scan deletes it (`memory-index.ts:366-370`, `223-261`).

- `PIPELINE-005` `MEDIUM` Incremental indexing is mtime-fast-path only: `<1000ms` absolute delta skips reindex unless embedding is `pending/failed` (`incremental-index.ts:19`, `145-172`). `content_hash` is stored but not consulted during categorization, so coarse mtimes, preserved mtimes, or sub-second edits can miss content changes.

- `PIPELINE-006` `LOW-MEDIUM` Alias conflict detection is intentionally narrow. It only normalizes `.opencode/specs/` ↔ `specs/` textual variants on parent rows (`memory-index-alias.ts:97-113`, `199-219`). It misses broader alias forms (other symlink roots, relative/absolute variants, non-spec aliases). `runDivergenceReconcileHooks()` schedules ledger retries/escalations only; it does not merge or mutate conflicting rows (`memory-index-alias.ts:265-333`).


Total usage est:        1 Premium request
API time spent:         5m 31s
Total session time:     6m 4s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.8m in, 11.6k out, 1.7m cached (Est. 1 Premium request)
 claude-haiku-4.5         518.5k in, 8.5k out, 464.1k cached (Est. 0 Premium requests)
