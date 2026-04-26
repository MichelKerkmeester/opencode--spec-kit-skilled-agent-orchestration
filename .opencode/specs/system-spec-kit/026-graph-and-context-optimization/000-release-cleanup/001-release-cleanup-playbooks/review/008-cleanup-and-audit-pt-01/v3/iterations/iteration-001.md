# Iteration 1: Correctness closure check on retired memory path entry points

## Focus
This correctness pass verified the current public-entry-point story around retired `memory/*.md` paths across `memory_save`, `memory_index_scan`, create-agent workflows, deep-review/deep-research workflow save hooks, and the `context-server.vitest.ts` runtime harness.

- Closure status:
  - `F001`: **closed in the current runtime** — `memory_save` rejects noncanonical files via `isMemoryFile()`, and spec-document discovery explicitly skips `memory/` directories before `memory_index_scan` builds its input set. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2080-2085] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955-976] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:27-28] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213-215]
  - `NF003`: **closed in the current test harness** — `context-server.vitest.ts` now mocks `discoverMemoryFiles` rather than the removed `findMemoryFiles`, and the shared cleanup still un-mocks modules and restores spies after each test. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1048-1049] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1219-1225]
- Files reviewed:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts`
  - `.opencode/command/create/assets/create_agent_auto.yaml`
  - `.opencode/command/create/assets/create_agent_confirm.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`

## Findings

### P0
- None. This iteration found no active correctness blocker reopening retired `specs/**/memory/*.md` acceptance on the inspected save/index public paths. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2085] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:56-58]

### P1
- None. The active command and review workflow assets inspected here target canonical spec documents or generated support artifacts rather than retired standalone `memory/*.md` outputs. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:573-580] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:660-668] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:862-866] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:994-998] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:643-647] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:821-825]

### P2
- None. The `context-server.vitest.ts` cleanup still restores unrelated runtime mocks after each test while using the current `discoverMemoryFiles` mock surface. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1048-1049] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1219-1225]

## Ruled Out
- Historical `/memory/` literals in `handler-memory-index.vitest.ts` were ruled out as an active regression because they exercise alias-conflict and divergence-reconcile logic over already-indexed rows, not live `memory_save` or `memory_index_scan` discovery inputs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:214-249] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:322-358] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:115-116] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:586-587]
- Active `findMemoryFiles` / `MEMORY_FILE_PATTERN` mocks or callers under live `mcp_server/**` were ruled out. [INFERENCE: Exact identifier search over `.opencode/skill/system-spec-kit/mcp_server/**/*.{ts,js,cjs,mjs,md,json,yaml,yml}` returned no live matches for `findMemoryFiles` or `MEMORY_FILE_PATTERN`, and the current runtime harness mocks `discoverMemoryFiles` instead.] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1048-1049]

## Dead Ends
- Broad `/memory/` literal hunting produces historical alias-reconcile fixtures that look suspicious in isolation, but the inspected handler wiring keeps that surface inside divergence bookkeeping rather than public ingestion. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:397-405] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:586-587]

## Recommended Next Focus
Rotate to **security** and inspect whether the repaired `memory_save` / workflow surfaces still leave any governance, provenance, or retention bypasses now that the retired path cleanup appears correct.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness
- Novelty justification: This pass produced no new findings because the inspected runtime handlers, command assets, and current runtime harness all aligned on rejecting or no longer emitting retired `memory/*.md` public paths, while the remaining legacy literals were ruled out as historical reconciliation coverage.
