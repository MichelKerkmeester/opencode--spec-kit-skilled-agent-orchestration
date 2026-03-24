**Pipeline Stages Identified**

1. `ingest`
   - MCP tool calls enter through [`context-server.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L273), then dispatch via [`tools/index.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts) into [`tools/memory-tools.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts) and [`tools/lifecycle-tools.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts).
   - File-based ingest and scan entrypoints are handled in [`handlers/memory-index.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts#L147) and the startup queue wiring in [`context-server.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1008).

2. `process`
   - `memory_save` flows through [`handleMemorySave()`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L542).
   - Governance validation runs at [`memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L633), preflight validation at [`memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L696), then embedding/dedup/enrichment continue inside the same handler.

3. `store`
   - Persisted writes happen from the save/index handlers into the storage API and vector index layers under [`api/storage.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/storage.ts) and the downstream index helpers invoked by `memory-save` / `memory-index`.

4. `index`
   - Batch and single-file indexing are coordinated by [`handleMemoryIndexScan()`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts#L147).
   - Background ingest jobs are wired through [`lib/ops/job-queue.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts) and initialized in [`context-server.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1008).

5. `search`
   - Query handling begins in [`handleMemorySearch()`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L634), then enters the 4-stage pipeline in [`lib/search/pipeline/orchestrator.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts#L47):
   - Stage 1: candidate generation
   - Stage 2: fusion
   - Stage 3: rerank
   - Stage 4: filter/annotate

6. `retrieve`
   - Result formatting, disclosure shaping, and `memory_context` retrieval orchestration happen in [`handlers/memory-search.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts) and [`handlers/memory-context.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts).

**DEAD CODE**

- `SEVERITY: LOW`
  `FILE:` [`lib/search/rsf-fusion.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L7)
  `ISSUE:` Dormant fusion implementation kept for offline/shadow use, not part of the live pipeline.
  `EVIDENCE:` The file itself says it is “not actively used” and preserved for evaluation; production search runs through [`lib/search/pipeline/orchestrator.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts#L47) instead.

- `SEVERITY: LOW`
  `FILE:` [`lib/governance/retention.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts#L41)
  `ISSUE:` `runRetentionSweep()` is implemented but has no production caller.
  `EVIDENCE:` Search found only its definition and tests; no runtime wiring in the server entrypoints or tool handlers.

**DISCONNECTED**

- `SEVERITY: HIGH`
  `FILE:` [`scripts/core/memory-indexer.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L151)
  `ISSUE:` Script-side indexing bypasses the MCP `memory_save` pipeline.
  `EVIDENCE:` The script writes directly through `vectorIndex.indexMemory(...)`, while the MCP save path performs governance validation, preflight, audit/enrichment, and post-insert metadata in [`handlers/memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L633), [`memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L696), and [`memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L815).

- `SEVERITY: HIGH`
  `FILE:` [`scripts/core/workflow.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1667)
  `ISSUE:` Workflow scripts call direct indexing helpers instead of MCP tools, so script-driven ingestion does not traverse the same server pipeline as tool-driven ingestion.
  `EVIDENCE:` `workflow.ts` calls `indexMemory(...)` directly rather than routing through `memory_save` / `memory_index_scan`.

- `SEVERITY: MEDIUM`
  `FILE:` [`lib/governance/retention.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts#L41)
  `ISSUE:` Retention metadata is persisted, but expiry enforcement is not wired into runtime operations.
  `EVIDENCE:` Retention fields are validated and stored in [`handlers/memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L560), [`memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L633), and [`memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L815), but the sweep implementation is not invoked by runtime startup, handlers, or scheduled jobs.

**BROKEN IMPORTS**

- `SEVERITY: NONE`
  `FILE:` MCP server and `system-spec-kit/scripts/`
  `ISSUE:` No broken internal imports found.
  `EVIDENCE:` `npx tsc --noEmit` passed in both `mcp_server` and `scripts`, and a resolver scan found `brokenCount: 0` for internal relative / `@spec-kit/*` imports.

**UNUSED EXPORTS**

- `SEVERITY: LOW`
  `FILE:` [`tools/types.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts#L29)
  `ISSUE:` `parseValidatedArgs` is exported but has no consumer.
  `EVIDENCE:` Repository search found only its definition.

- `SEVERITY: LOW`
  `FILE:` [`lib/ops/file-watcher.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts#L52)
  `ISSUE:` `getWatcherMetrics` and `resetWatcherMetrics` are exported but unused in production code.
  `EVIDENCE:` References were limited to the defining file and tests.

- `SEVERITY: LOW`
  `FILE:` [`lib/parsing/memory-parser.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L920)
  `ISSUE:` Source still contains a CommonJS `module.exports` compatibility block.
  `EVIDENCE:` It is the only live source-level `module.exports` block in the server. It is not broken, but it stands out as legacy export compatibility rather than current module style.

**Feature Flags / Conditional Disable Paths**

- `SEVERITY: MEDIUM`
  `FILE:` [`context-server.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1024)
  `ISSUE:` File-watcher-driven indexing can be disabled.
  `EVIDENCE:` Watcher startup is conditional on `isFileWatcherEnabled()`.

- `SEVERITY: MEDIUM`
  `FILE:` [`handlers/memory-save.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L325)
  `ISSUE:` Save quality enforcement is conditional.
  `EVIDENCE:` The gate only runs when both `isSaveQualityGateEnabled()` and `isQualityGateEnabled()` are true.

- `SEVERITY: LOW`
  `FILE:` [`lib/search/pipeline/stage1-candidate-gen.ts`](#/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L42)
  `ISSUE:` Multiple retrieval enhancements are flag-gated.
  `EVIDENCE:` Candidate expansion, query decomposition, HyDE, surrogate queries, temporal contiguity, and related features are all conditionally enabled.

**SUMMARY**

The core MCP memory pipeline is present end-to-end: tool ingress, validation/processing, storage/indexing, and a 4-stage search/retrieval flow are all wired. Import resolution is healthy, and I did not find broken source imports.

The main pre-release risk is integration inconsistency: the `system-spec-kit` scripts use direct indexing code instead of the MCP `memory_save` pipeline, so script-driven ingestion bypasses governance, preflight checks, audit hooks, and post-insert enrichment. The second meaningful gap is retention: metadata is stored, but the sweep mechanism is not connected to runtime execution. The remaining issues are low-severity dormant or unused exports rather than release blockers.
