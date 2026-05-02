I’m mapping the CRUD/save pipeline first, then I’ll cross-check it for failure modes, atomicity, duplication, and validation gaps. After that I’ll synthesize the findings into a structured audit.

● Review Audit CRUD save handlers
  └ Agent started in background with agent_id: crud-save-audit. You can use read_...

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/1941b772-4343-413a-b4a8-5ca614126381/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 8 lines...

● Search (grep)
  │ "^export\s+(?:async\s+)?(?:function|const|class|type|interface)\s+" in
  │ {memory-crud*.ts,save/*.ts} (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ No matches found

● Count target file lines (shell)
  │ wc -l '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts'
  │ '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts'
  │ '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts'
  │ '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts'
  │ '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts' …
  └ 33 lines...

I’ve got the file map; next I’m reading the shared types/helpers and the entrypoints first so the larger handlers are easier to reason about. Then I’ll walk the mutation flows end-to-end.

● Read memory-crud.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
  └ 48 lines read

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts
  └ 47 lines read

● Read memory-crud-types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
  └ 116 lines read

● Read db-helpers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts
  └ 93 lines read

● Read memory-crud-utils.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
  └ 74 lines read

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts
  └ 155 lines read

● Search (grep)
  │ "^(async\s+function|function|const\s+\w+\s*=|export\s+\{|export\s+type|export\s+interface|type\s
  │ +\w+\s*=|interface\s+\w+)" in {memory-crud*.ts,save/*.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ No matches found

● Read memory-crud-list.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
  └ 187 lines read

● Read memory-crud-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
  └ 287 lines read

● Read memory-crud-update.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
  └ 295 lines read

● Read create-record.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
  └ 248 lines read

● Read memory-crud-stats.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
  └ 329 lines read

● Read dedup.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts
  └ 265 lines read

● Read pe-orchestration.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts
  └ 179 lines read

● Read embedding-pipeline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
  └ 203 lines read

● Read post-insert.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
  └ 127 lines read

● Read reconsolidation-bridge.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
  └ 221 lines read

● Read memory-crud-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
  └ L241:480 (240 lines read)

● Read memory-crud-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
  └ L481:647 (167 lines read)

● Read memory-crud-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
  └ L1:240 (239 lines read)

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ 379 lines read

I’ve finished the helper layer and most handler bodies. I’m doing one last pass on the save orchestration call sites now, mainly to verify whether the helper assumptions actually hold in the end-to-end flow.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ 1 line read

● Search (grep)
  │ "buildIndexResult|buildSaveResponse|createMemoryRecord|generateOrCacheEmbedding|evaluateAndApply
  │ PeDecision|runReconsolidationIfEnabled|runPostInsertEnrichment|checkExistingRow|checkContentHash
  │ Dedup" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 32 lines found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L450:700 (251 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L980:1060 (81 lines read)

● Search (grep)
  │ "catch \(|catch\s*\{|createMCPErrorResponse\(|return buildSaveResponse|return
  │ buildIndexResult|return createMCPErrorResponse"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 7 lines found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1060:1205 (146 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1:140 (140 lines read)

● Read (Review agent — Audit CRUD save handlers)
  └ idle

## Findings

### High severity

- `save/pe-orchestration.ts:101-122` marks an existing memory as superseded **before** the new record is created. If the later create/enrichment path fails, the old row stays deprecated with no replacement. That is the biggest atomicity gap in the save pipeline.

- `memory-crud-utils.ts:43-64` swallows ledger failures, but delete/update/save code treats ledger writes as part of the mutation story. Result: DB mutations can commit successfully while audit history silently disappears.

- `memory-crud-delete.ts:68-75` and `memory-crud-update.ts:41-78` still throw raw errors for validation/refresh problems, unlike `memory-crud-list.ts`, `memory-crud-stats.ts`, and `memory-crud-health.ts`, which consistently return MCP envelopes. Error formatting is not uniform across CRUD.

- `memory-crud-health.ts:320-359` logs many DB read failures and then continues with defaulted values. Health can report a normal “success” payload even when core diagnostics were incomplete.

- `save/db-helpers.ts:53-57` always injects `review_count = 0` when the caller omits that field. For a generic metadata helper, that is a dangerous hidden side effect and can clobber review state.

### Medium severity

- `memory-crud-update.ts:83-87,140-149,193-225` allows no-op updates and does not runtime-validate `title`/`triggerPhrases`. `{ id }` can still produce history, ledger, hooks, and a success response.

- `save/embedding-pipeline.ts:111-126,150-166` computes the cache key from normalized raw content, but the actual embedding input is weighted/reformatted text. Cache correctness can drift when weighting logic changes. Also `128-137` has no async-mode cache lookup guard, so DB cache failures abort async saves instead of degrading cleanly.

- `save/dedup.ts:14-16,162-264` excludes `pending` rows from content-hash dedup. Deferred/async saves can therefore admit duplicates that a completed save would reject.

- `save/post-insert.ts:71-123` runs enrichment as best-effort, outside the core insert transaction, and `runEntityLinking(database)` appears global rather than incremental. That is both a partial-state risk and a likely per-save scalability hotspot.

- `save/reconsolidation-bridge.ts:58-67,67-166,210-214` treats reconsolidation errors as “warn and continue,” even though reconsolidation is supplied mutating callbacks. If reconsolidation partially mutates state before throwing, normal save can run afterward and double-apply intent.

### Lower severity / simplification

- `memory-crud-stats.ts:78-95,186-195` documents `excludePatterns` as regex patterns, but implementation is case-folded substring matching. That is a correctness/documentation mismatch.

- `memory-crud-list.ts:47-53,92,108-110` silently falls back on invalid `sortBy`, and `limit: 0` becomes the default because of `rawLimit || 20`. Validation is weaker than the other CRUD handlers.

- `save/create-record.ts:45-91` and `save/dedup.ts:31-35` duplicate scope normalization / same-path matching logic. This should be one shared helper.

- `save/create-record.ts:216-225` indexes BM25 with `parsed.content` only, while `memory-crud-update.ts:157-169` rebuilds BM25 from title + content + triggers + file path. Search indexing semantics differ by write path.

- `save/response-builder.ts:152-161,242-370` mixes response formatting with side effects: retry scheduling, mutation hooks, and consolidation. It works, but it makes failures harder to reason about and complicates testing.

## File-by-file notes

- `memory-crud.ts`: barrel only; legacy snake_case aliases (`31-48`) are harmless but duplicated surface / likely future dead code.

- `memory-crud-delete.ts`: main issues are raw throws, ambiguous `id` vs `specFolder` precedence, and per-memory bulk-delete work.

- `memory-crud-health.ts`: strongest issue is partial DB failure being reported as success; auto-repair is intentionally best-effort, not atomic.

- `memory-crud-list.ts`: mostly clean; weaknesses are silent fallback behavior and the extra count query.

- `memory-crud-stats.ts`: main concerns are regex-vs-substring mismatch and full-table scoring loads.

- `memory-crud-update.ts`: no-op update acceptance and incomplete runtime validation stand out.

- `memory-crud-utils.ts`: “safe” helpers hide failures that probably should be surfaced.

- `memory-crud-types.ts` and `save/types.ts`: too stringly-typed; they force repeated runtime validation and allow impossible states.

- `save/index.ts`: barrel only; no substantive issue beyond export-surface duplication.

- `save/create-record.ts`, `save/db-helpers.ts`, `save/dedup.ts`, `save/embedding-pipeline.ts`, `save/pe-orchestration.ts`, `save/post-insert.ts`, `save/reconsolidation-bridge.ts`, `save/response-builder.ts`: these contain the material pipeline risks above.

