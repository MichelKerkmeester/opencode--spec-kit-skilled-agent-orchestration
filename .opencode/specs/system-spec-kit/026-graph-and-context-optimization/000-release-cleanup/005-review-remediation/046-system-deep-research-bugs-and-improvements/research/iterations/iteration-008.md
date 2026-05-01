# Iteration 008 — B3: Memory MCP round-trip integrity

## Focus
Audited the `memory_save -> memory_index_scan -> memory_search -> memory_context` path for round-trip integrity, with emphasis on whether saved content becomes searchable, whether `_memory.continuity` is parsed from frontmatter correctly, and whether causal links survive indexing.

## Actions Taken
- Enumerated the memory MCP entry points under `.opencode/skill/system-spec-kit/mcp_server/handlers/`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/`, and `.opencode/skill/system-spec-kit/mcp_server/tools/`.
- Read the main save handler flow in `handlers/memory-save.ts`, including `handleMemorySave`, `indexMemoryFile`, `processPreparedMemory`, canonical routed saves, and `atomicSaveMemory`.
- Read `lib/parsing/memory-parser.ts` for frontmatter, trigger phrase, content, and causal-link extraction.
- Read `handlers/save/create-record.ts` and `handlers/save/response-builder.ts` to trace persistence into `memory_index`, BM25, metadata, mutation hooks, and response surfaces.
- Read `handlers/memory-index.ts` for scan discovery, incremental categorization, scan indexing, stale deletion, and post-scan invalidation.
- Read `handlers/memory-search.ts` and `handlers/memory-context.ts` to trace search cache invalidation assumptions and context strategy delegation.
- Read `lib/continuity/thin-continuity-record.ts` and `lib/resume/resume-ladder.ts` to verify `_memory.continuity` frontmatter parsing and resume-mode source selection.
- Read `handlers/causal-links-processor.ts` and `lib/storage/causal-edges.ts` to verify causal edge creation outcomes.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-008-B3-01 | P1 | `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:872` | `extractCausalLinks()` claims to extract `causal_links`, but the actual regex only matches `causalLinks:` at `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:882`. The save workflow preserves both snake_case and camelCase inputs (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1301`), so a saved markdown/frontmatter block that uses the snake_case key silently produces `hasCausalLinks=false` and no post-insert causal edge work. | Accept both `causalLinks` and `causal_links` in `extractCausalLinks()`, preferably through a shared YAML/frontmatter parser instead of a regex. Add a regression fixture for snake_case-only causal links. |
| F-008-B3-02 | P1 | `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:405` | `processCausalLinks()` increments `result.inserted` immediately after calling `causalEdges.insertEdge()`, but `insertEdge()` can return `null` without throwing for normal non-insert cases such as no DB, self-loop, auto edge cap, or relation window cap (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:263`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:274`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:283`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:340`). The save response can therefore report causal links as inserted when no edge exists, which breaks round-trip integrity diagnostics. | Capture the return value from `insertEdge()`, increment `inserted` only for a real row id, and record null returns as skipped or errors with a reason. Add tests for self-loop and edge-cap cases. |

## Questions Answered
- Does saved content become searchable? For canonical spec docs, yes: `handleMemorySave()` validates and calls `indexMemoryFile()` (`memory-save.ts:3060`), `createMemoryRecord()` persists to `memory_index`/vector or deferred index plus BM25 (`save/create-record.ts:310`), and successful responses run post-mutation invalidation (`save/response-builder.ts:552`). `memory_index_scan()` also indexes discovered spec docs and graph metadata (`memory-index.ts:263`) and invalidates caches after index/update/stale-delete (`memory-index.ts:647`).
- Are continuity blocks parsed correctly from frontmatter? The direct parser path is sound for current `_memory.continuity`: `readThinContinuityRecord()` extracts frontmatter and selects `_memory.continuity` (`thin-continuity-record.ts:812`), validates the required compact fields (`thin-continuity-record.ts:852`), and resume mode reads packet-local docs directly via `buildResumeLadder()` (`memory-context.ts:1032`) instead of relying on search.
- Are causal links preserved across saves? Partially. CamelCase `causalLinks:` can be parsed and post-insert enrichment runs `processCausalLinks()` (`save/post-insert.ts:300`), but snake_case declarations are dropped and failed inserts are misreported.

## Questions Remaining
- Whether the rendered `generate-context.js` markdown currently emits `causalLinks:`, `causal_links:`, or both in all save modes should be checked in a follow-on packet against the compiled script/template output.
- Search freshness under async embedding provider outage deserves a targeted pass: this iteration verified BM25/deferred-path intent, not runtime behavior with an unavailable provider.

## Next Focus
Follow-on work should audit the generated-context rendering path and its compiled `dist/` output to confirm the saved causal-link key shape matches the MCP parser contract.
