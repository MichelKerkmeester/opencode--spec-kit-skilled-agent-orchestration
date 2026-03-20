● skill(sk-deep-research)

I’m loading the existing research context and the save-path code together so I can trace the full pipeline end-to-end before reporting issues.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ "**/deep-research-*" in .opencode
  └ 33 files found

● Search (glob)
  │ "**/*hybrid-rag-fusion*"
  └ 1 file found

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/f3e1dd0a-3d65-4481-8053-e82450367056/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Load prior deep-research/spec context for hybrid-rag-fusion save pipeline.…
  └ 8 lines...

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 9/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus: save
  │ pipeline robustness. Read source files, trace data flows, find bugs, dead code, architecture
  │ issues. Report with file:line citations." --threshold 0.8
  └ 59 lines...

I found the likely research epic and I’m now reading its state plus the search/persistence entry points in parallel to map the save path before judging issues.

● Read deep-research-strategy.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/scratch/dee
  │ p-research-strategy.md
  └ 1 line read

● Search (glob)
  │ "**/*.{ts,js}" in .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 56 files found

● Read deep-research-state.jsonl
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/scratch/dee
  │ p-research-state.jsonl
  └ 24 lines read

● Search (grep)
  │ "save|persist|ingest|write|upsert|index|store" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Search (grep)
  │ "memory_save|save\(|upsert|insert|writeFile|appendFile|indexMemory|index.*memory" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● search save pipeline robustness for hybrid rag fusion search pipeline in mcp_server lib search pe…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I’ve got the research state. Next I’m narrowing from “anything save-like” to the concrete call chain from `memory_save`/ingest entry points into storage and vector index mutations.

● Search (glob)
  │ "**/*memory*save*.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ 6 files found

● Search (glob)
  │ "**/*index*memory*.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ No matches found

● Search (grep)
  │ "memory_save|tool.*save|save
  │ memory|indexMemory|index_memory|indexFile|vector.*upsert|upsertMemory" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "INSERT INTO memory_index|UPDATE memory_index|DELETE FROM memory_index|INSERT INTO
  │ memory_chunks|UPDATE memory_chunks|DELETE FROM memory_chunks|INSERT INTO bm25|INSERT INTO
  │ fts|vector_index" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Explore Map save pipeline
  │ Find feature flag functions (shell)
  │   │ grep -n "export function\|export const" "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" | head -50
  │   └ 26 lines...
  └ Create summary reference (shell)
      │ cat > /tmp/pipeline_summary.txt << 'EOF'
      │ === SAVE/INDEXING PIPELINE FOR MEMORY INGESTION ===
      │
      │ PRIMARY ENTRY POINTS (Tools):
      │ 1. tools/memory-tools.ts:handleTool() → memory_save tool dispatch…
      └ Permission denied and could not request permission from user

I’ve got a coarse map from the explorer. Now I’m spot-checking the concrete functions and suspicious branches directly so the findings are grounded in the source, not just the map.

● Search (grep)
  │ "export async function handleMemorySave|async function processPreparedMemory|async function
  │ atomicSaveMemory|function prepareParsedMemoryForIndexing|withSpecFolderLock|indexMemoryFile"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 93 lines found

● Search (grep)
  │ "export async function createMemoryRecord|bm25Index|indexMemoryDeferred|indexMemory\(|recordHist
  │ ory|recordLineageTransition|importance_tier = 'deprecated'"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
  └ 64 lines found

● Search (grep)
  │ "function handleTool|case 'memory_save'|handleMemorySave"
  │ (.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts)
  └ 19 lines found

● Search (grep)
  │ "export async function indexMemory|export async function indexMemoryDeferred|INSERT INTO
  │ vec_memories|UPDATE memory_index|DELETE FROM vec_memories|update_memory"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts)
  └ 107 lines found

● Search (grep)
  │ "class BM25Index|addDocument|isBm25Enabled|CREATE VIRTUAL TABLE|memory_fts|INSERT INTO
  │ memory_fts|DELETE FROM memory_fts"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts)
  └ 49 lines found

● Search (grep)
  │ "class TransactionManager|atomicWriteFile|beginTransaction|commitTransaction|rollbackTransaction
  │ |pending" (.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts)
  └ 5 lines found

I’m reading the hot sections now: the atomic save wrapper, the record-creation path, and the transaction manager. That should surface whether the robustness claims really hold.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1036:1165 (130 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L674:780 (107 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L450:570 (121 lines read)

● Read vector-index-mutations.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
  └ L130:320 (191 lines read)

● Read create-record.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
  └ L120:260 (129 lines read)

● Read transaction-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
  └ L1:260 (260 lines read)

● Read bm25-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
  └ L1:310 (310 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L570:673 (104 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1165:1235 (71 lines read)

● Read transaction-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
  └ L260:460 (163 lines read)

● Read embedding-pipeline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
  └ L1:260 (203 lines read)

● Read post-insert.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
  └ L1:220 (127 lines read)

● Search (grep)
  │ "fixedContent|qualityLoopResult\.fixedContent|persistQualityLoopContent"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 61 lines found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L780:1035 (256 lines read)

● Search (grep)
  │ "persistQualityLoopContent && qualityLoopResult.passed && qualityLoopResult.fixedContent"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 17 lines found

● Search (grep)
  │ "atomicSaveMemory\(|atomic_save_memory|executeAtomicSave\(|handleMemorySave\(|atomic_save" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "recoverAllPendingFiles|recoverPendingFile|getPendingPath\(|dbCommitted" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I ruled out one suspected bug: the quality-loop content is written back through `parsed.content`, which gets replaced earlier. I’m now checking the remaining robustness gaps around split entry points and recovery wiring.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L393:446 (54 lines read)

● Search (grep)
  │ "buildSaveResponse\(|createMCPSuccessResponse\(|createMCPErrorResponse\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 17 lines found

● Search (grep)
  │ "sharedSpaceId|governance|tenantId|userId|agentId|sessionId|retentionPolicy"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 97 lines found

● Search (grep)
  │ "atomicSaveMemory\(|atomic_save_memory|executeAtomicSave\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "recoverAllPendingFiles\(|recoverPendingFile\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 131 lines found

I’ve confirmed startup recovery exists. The remaining question is whether the atomic-save path is actually wired into production or sitting beside the main tool path as a second, divergent codepath.

● Search (grep)
  │ "createAppendOnlyMemoryRecord|recordLineageVersion|findSamePathExistingMemory"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 39 lines found

● Search (grep)
  │ "\bexecuteAtomicSave\b" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 71 lines found

● Search (grep)
  │ "\bhandleMemorySave\b" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "\batomicSaveMemory\b" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’m tightening the search to non-test callers now. If `atomicSaveMemory` isn’t used outside tests/exports, that’s a meaningful architecture smell by itself.

● Search (grep)
  │ "\bexecuteAtomicSave\b" (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ No matches found

● Search (grep)
  │ "\batomicSaveMemory\b" in *.ts (.opencode/skill/system-spec-kit/mcp_server/tools)
  └ No matches found

● Search (grep)
  │ "\bexecuteAtomicSave\b" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 5 lines found

● Search (grep)
  │ "\batomicSaveMemory\b" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 23 lines found

● Search (grep)
  │ "rebuildFromDatabase\(|getIndex\(\)|isBm25Enabled\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed `atomicSaveMemory` has no production caller under `handlers/` or `tools/`; it’s only exported. I’m checking whether BM25 rebuild is at least wired on startup, since that changes whether its weak consistency is acceptable or risky.

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L430:520 (91 lines read)

● Search (grep)
  │ "bm25Index\.getIndex\(|isBm25Enabled\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ No matches found

● Search (grep)
  │ "related_memories|CREATE_LINKED|recordSharedConflict|governance"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
  └ 9 lines found

● Search (grep)
  │ "bm25Index\.getIndex\(|getIndex\(\)\.rebuildFromDatabase|isBm25Enabled\("
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 17 lines found

● Search (grep)
  │ "rebuildFromDatabase\(" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 71 lines found

I found a likely governance gap: the row is inserted first and governance fields are patched later, which leaves a crash window and may skip updates on duplicate/unchanged results. I’m reading the dedup helpers to verify that path.

● Read dedup.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts
  └ L1:280 (265 lines read)

● Search (grep)
  │ "tenantId|userId|agentId|sessionId|sharedSpaceId"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
  └ 34 lines found

● Search (grep)
  │ "scope|tenantId|sharedSpaceId|duplicate|unchanged"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts)
  └ 114 lines found

● Search (glob)
  │ "**/*dedup*.ts" in .opencode/skill/system-spec-kit/mcp_server/handlers/save
  └ 1 file found

I have two solid robustness findings already: weak startup recovery probing and post-insert governance patching. I’m checking one more suspicious area—whether save writes lineage twice or whether those are intentionally separate tables.

● Read lineage-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
  └ L1:320 (320 lines read)

● Search (grep)
  │ "function recordLineageTransition|function
  │ recordLineageVersion|createAppendOnlyMemoryRecord|CREATE TABLE.*lineage|INSERT INTO .*lineage"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
  └ 47 lines found

● Search (grep)
  │ "recordLineageVersion\(|recordLineageTransition\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 76 lines found

● Read lineage-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
  └ L470:620 (151 lines read)

● Read lineage-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
  └ L1078:1112 (34 lines read)

● Search (grep)
  │ "UNIQUE|PRIMARY KEY|memory_lineage"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 5 lines found

I’ve got three meaningful issues. I’m doing one last pass on BM25 failure handling, because if live queries depend on the in-memory index, a swallowed add failure becomes a real availability gap.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L680:780 (101 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L900:915 (15 lines read)

● Search (grep)
  │ "bm25Index\.getIndex\(\)|\.search\(|ENABLE_BM25|bm25"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 116 lines found

● Search (grep)
  │ "catch \(bm25_err|BM25 indexing failed"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
  └ 11 lines found

I’ve got the code-level findings. I’m doing a quick coverage check against the save tests so I can separate “bug” from “known and already guarded.”

● Search (glob)
  │ "**/*transaction-manager*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 3 files found

● Search (glob)
  │ "**/*memory-save*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 5 files found

● Search (grep)
  │ "governance|tenantId|sharedSpaceId|unchanged|duplicate|retentionPolicy|atomicSaveMemory|recoverP
  │ endingFile|isCommittedInDb|pending" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

I’m narrowing the test scan to the exact edge cases I found, rather than reading the full suite. That should tell us whether these are uncovered regressions or already-known tradeoffs.

● Search (grep)
  │ "retentionPolicy|sharedSpaceId|tenantId|governance"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts)
  └ No matches found

● Search (grep)
  │ "atomicSaveMemory|executeAtomicSave"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts)
  └ 55 lines found

● Search (grep)
  │ "stale pending|no committed DB row|isCommittedInDb|recoverPendingFile|older|newer"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts)
  └ 97 lines found

● Search (grep)
  │ "unchanged|duplicate"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts)
  └ 5 lines found

I’m running the save/recovery test slices now. Mostly I want to confirm the current suite passes and see whether it exercises the edge cases I found.

● Run save/recovery tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/handler-memory-save.vitest.ts tests/transaction-manager-recovery.vitest.ts
  │ --reporter=verbose
  └ 147 lines...

✗ Memory stored testing practices
  └ Save pipeline regressions in mcp_server are covered by Vitest files handler-memo…

Iteration 9 findings on save-pipeline robustness:

- **Startup recovery can promote stale `_pending` files.** Recovery treats any row with the same `file_path` as “committed” (`context-server.ts:470-477`), then renames the pending file if it is newer (`transaction-manager.ts:343-361`). But same-path content changes use append-only versioning (`memory-save.ts:611-628`), so an older committed row can make an uncommitted pending write look valid.

- **Governance is post-insert, not atomic with save.** `handleMemorySave` indexes first (`memory-save.ts:970-975`) and only then patches governance/audit metadata in a second transaction (`memory-save.ts:977-1017`). The record-creation path itself does not write governance fields (`create-record.ts:137-186`), so a crash in between leaves a committed row without its scope metadata.

- **Unchanged/duplicate saves ignore governance/retention changes.** Dedup only checks content/quality metadata (`dedup.ts:67-87,146-157,248-260`). `handleMemorySave` applies governance metadata only when status is not `unchanged`/`duplicate` (`memory-save.ts:977-981`), so re-saving identical content with new retention/shared-space args is silently skipped.

- **There are two divergent save paths.** MCP dispatch routes `memory_save` only to `handleMemorySave` (`tools/memory-tools.ts:43-47`). `atomicSaveMemory` is a separate exported path (`memory-save.ts:1036-1227`) and even references `executeAtomicSave` only in commentary, while the helper itself lives separately (`transaction-manager.ts:203-255`). That split is architecture drift / near-dead code risk.

- **BM25 consistency is best-effort.** Save swallows `bm25.addDocument` failures and proceeds (`create-record.ts:216-225`), but hybrid search actively uses the in-memory BM25 channel (`hybrid-search.ts:269-299,636-642`). Repair happens on startup rebuild (`context-server.ts:904-913`), so live lexical recall can degrade until restart.

I also verified a suspected bug was **not** real: quality-loop fixed content is propagated through `parsed.content` before persistence (`memory-save.ts:403-412,606-607`). Targeted tests passed: `handler-memory-save.vitest.ts` and `transaction-manager-recovery.vitest.ts`.

