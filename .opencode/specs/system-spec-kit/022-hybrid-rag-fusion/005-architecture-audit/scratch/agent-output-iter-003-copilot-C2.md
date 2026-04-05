● skill(sk-code-review)

I’m gathering the handler and hook surfaces first, plus the review standards context, then I’ll synthesize findings against consistency, wiring, typing, validation, logging, and UX.

● Read quick_reference.md
  │ .agents/skills/sk-code-review/references/quick_reference.md
  └ 151 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code-review/references/security_checklist.md
  └ 206 lines read

● skill(sk-code-opencode)

● Create session plan file (shell)
  │ mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/526c6c0a-fa2e-4130-ab3a-5a10f83131d6' && cat
  │ >
  │ '/Users/michelkerkmeester/.copilot/session-state/526c6c0a-fa2e-4130-ab3a-5a10f83131d6/plan.md'
  │ <<'EOF'…
  └ 12 lines...

I’ve loaded the review baseline and OpenCode overlay. Next I’m mapping the actual handler/hook implementation paths and spinning up a parallel audit pass so I can cross-check conclusions instead of relying on one read.

● Review Audit MCP handlers
  └ Agent started in background with agent_id: mcp-handler-audit. You can use rea...

● Search (grep)
  │ "register|hook|before|after|onSuccess|onError|memory_search|memory_context|memory_match_triggers
  │ |memory_save|memory_ingest|memory_bulk_delete|memory_index" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/hooks)
  └ 38 lines found

● Search (grep)
  │ "create[A-Za-z]+Handler|export (async )?function|fire|hook|logger|console\.|safeParse|parse\(|z\
  │ .object|resultToToolResponse|toolResponse|callTool|withHooks|before|after|onSuccess|onError" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 5 lines found

● Read (Review agent — Audit MCP handlers)
  └ Running

● Count target file lines (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && wc -l
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts …
  └ 28 lines...

The large handler files are big enough that I’m switching to structural slices: shared types/utils and hooks in full, then targeted handler sections around schemas, exported handlers, and catch/return paths.

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts
  └ 18 lines read

● Read handler-utils.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts
  └ 71 lines read

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/types.ts
  └ 26 lines read

● Search (grep)
  │ "export (async )?function|export const|catch \(|throw new
  │ Error|logger\.|safeParse\(|parse\(|z\.object|return
  │ \{|toolResponse|responseHints|mutationFeedback|hook"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 89 lines found

● Search (grep)
  │ "export (async )?function|export const|catch \(|throw new
  │ Error|logger\.|safeParse\(|parse\(|z\.object|return
  │ \{|toolResponse|responseHints|mutationFeedback|hook"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
  └ 59 lines found

● Read response-hints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts
  └ 113 lines read

● Search (grep)
  │ "export (async )?function|export const|catch \(|throw new
  │ Error|logger\.|safeParse\(|parse\(|z\.object|return
  │ \{|toolResponse|responseHints|mutationFeedback|hook"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 63 lines found

● Read mutation-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts
  └ 61 lines read

● Read memory-surface.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "export (async )?function|export const|catch \(|throw new
  │ Error|logger\.|safeParse\(|parse\(|z\.object|return
  │ \{|toolResponse|responseHints|mutationFeedback|hook"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 138 lines found

● Search (grep)
  │ "export (async )?function|export const|catch \(|throw new
  │ Error|logger\.|safeParse\(|parse\(|z\.object|return
  │ \{|toolResponse|responseHints|mutationFeedback|hook"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 5 lines found

● Read memory-surface.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
  └ L221:336 (116 lines read)

● Search (grep)
  │ "export (async )?function [A-Za-z0-9_]+|export const [A-Za-z0-9_]+|export \{"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 11 lines found

● Search (grep)
  │ "export (async )?function [A-Za-z0-9_]+|export const [A-Za-z0-9_]+|export \{"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 11 lines found

● Search (grep)
  │ "export (async )?function [A-Za-z0-9_]+|export const [A-Za-z0-9_]+|export \{"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 15 lines found

● Search (grep)
  │ "export (async )?function [A-Za-z0-9_]+|export const [A-Za-z0-9_]+|export \{"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
  └ 11 lines found

● Search (grep)
  │ "export (async )?function [A-Za-z0-9_]+|export const [A-Za-z0-9_]+|export \{"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 11 lines found

● Search (grep)
  │ "appendAutoSurfaceHints|buildMutationHookFeedback|runPostMutationHooks|autoSurfaceMemories|autoS
  │ urfaceAtToolDispatch|syncEnvelopeTokenCount|serializeEnvelopeWithTokenCount" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 5 lines found

● Search (grep)
  │ "function handleMemoryMatchTriggers|const handleMemoryMatchTriggers|async function
  │ handleMemoryMatchTriggers"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
  └ 5 lines found

● Search (grep)
  │ "function handleMemoryIndexAlias|const handleMemoryIndexAlias|async function
  │ handleMemoryIndexAlias|function handleMemoryIndexDiscovery|const
  │ handleMemoryIndexDiscovery|async function handleMemoryIndexDiscovery" in memory-index-*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ No matches found

● Search (grep)
  │ "function handleMemoryBulkDelete|const handleMemoryBulkDelete|async function
  │ handleMemoryBulkDelete"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts)
  └ 5 lines found

● Search (grep)
  │ "function handleMemorySave|const handleMemorySave|async function handleMemorySave"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 5 lines found

● Search (grep)
  │ "function handleMemoryIndexScan|const handleMemoryIndexScan|async function
  │ handleMemoryIndexScan" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 5 lines found

● Search (grep)
  │ "function handleMemoryIngest|const handleMemoryIngest|async function handleMemoryIngest"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts)
  └ 17 lines found

● Search (grep)
  │ "function handleMemoryContext|const handleMemoryContext|async function handleMemoryContext"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 5 lines found

● Search (grep)
  │ "function handleMemorySearch|const handleMemorySearch|async function handleMemorySearch"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 5 lines found

● Read memory-bulk-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
  └ 285 lines read

● Read memory-index-discovery.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
  └ 197 lines read

● Read memory-ingest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
  └ 332 lines read

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1:220 (220 lines read)

● Read memory-index-alias.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
  └ 333 lines read

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:220 (219 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1:220 (220 lines read)

● Read memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  └ L1:220 (220 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L1:220 (220 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L728:1040 (313 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L147:620 (474 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1041:1239 (199 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L547:944 (398 lines read)

● Read memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  └ L175:486 (312 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L706:1234 (528 lines read)

● Search (grep)
  │ "createMCPErrorResponse\(|throw new Error\(|throw new preflight\.PreflightError"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 40 lines found

● Search (grep)
  │ "createMCPErrorResponse\(|throw new Error\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 5 lines found

● Search (grep)
  │ "buildMutationHookFeedback" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 127 lines found

● Search (grep)
  │ "appendAutoSurfaceHints" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ No matches found

● Search (grep)
  │ "runPostMutationHooks" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 108 lines found

● Search (grep)
  │ "autoSurfaceMemories|autoSurfaceAtToolDispatch|autoSurfaceAtCompaction|extractContextHint" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

One thing stands out already: the response-hint and memory-surface hooks exist, but I haven’t found them attached inside the audited handlers yet. I’m now verifying whether that’s a real wiring gap or handled elsewhere.

● Read mutation-hooks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
  └ 106 lines read

● Search (grep)
  │ "appendAutoSurfaceHints|autoSurfaceAtToolDispatch|autoSurfaceAtCompaction|autoSurfaceMemories"
  │ in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 8 files found

● Search (grep)
  │ "handleMemoryBulkDelete|handleMemoryIngestStart|handleMemoryIngestStatus|handleMemoryIngestCance
  │ l|handleMemorySave|handleMemoryIndexScan|handleMemoryContext|handleMemoryMatchTriggers|handleMem
  │ orySearch" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "appendAutoSurfaceHints|autoSurfaceAtToolDispatch|autoSurfaceAtCompaction|autoSurfaceMemories"
  │ in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read (Review agent — Audit MCP handlers)
  └ Running

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "autoSurfaceAtToolDispatch|appendAutoSurfaceHints|syncEnvelopeTokenCount|serializeEnvelopeWithTo
  │ kenCount|buildMutationHookFeedback"
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 51 lines found

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L280:410 (131 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/index.ts
  └ L1:220 (35 lines read)

● Search (grep)
  │ "try \{|catch \(|buildErrorResponse|dispatchTool\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tools)
  └ 5 lines found

● Read memory-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
  └ L1:260 (57 lines read)

● Search (grep)
  │ "safeParse|parse\(|createMCPErrorResponse|try \{|catch
  │ \(|handleMemorySearch\(|handleMemoryContext\(|handleMemoryMatchTriggers\(|handleMemoryIndexScan\
  │ (|handleMemorySave\(|handleMemoryIngestStart\(|handleMemoryBulkDelete\("
  │ (.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts)
  └ 13 lines found

● Read context-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts
  └ L1:240 (18 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/types.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "memory_context|memory_index_scan|memory_ingest_start|memory_ingest_status|memory_ingest_cancel|
  │ validateToolArgs" (.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts)
  └ 16 lines found

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts
  └ L1:260 (40 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "validateToolArgs\(|zod|schema"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 47 lines found

● Search (grep)
  │ "export function buildErrorResponse|function buildErrorResponse|const buildErrorResponse" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 7 lines found

● Read core.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts
  └ L220:360 (102 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1235:1310 (76 lines read)

● Search (grep)
  │ "handleMemoryIngestStart|handleMemoryIngestStatus|handleMemoryIngestCancel" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "throw new Error\(|createMCPErrorResponse\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts)
  └ 35 lines found

● Search (grep)
  │ "memory_ingest_start|memory_ingest_status|memory_ingest_cancel" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tools)
  └ 15 lines found

● Search (grep)
  │ "throw new Error\(|createMCPErrorResponse\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts)
  └ 31 lines found

● Search (grep)
  │ "memory_index_scan" in *.ts (.opencode/skill/system-spec-kit/mcp_server/tools)
  └ 11 lines found

I found a concrete contract mismatch now: some handlers support governance/scope fields, but the Zod schemas on the dispatch boundary appear not to admit them. I’m checking whether that affects just `memory_save` or also `memory_search` and related lifecycle tools.

● Search (grep)
  │ "tenantId|userId|agentId|sharedSpaceId|provenanceSource|provenanceActor|governedAt|retentionPoli
  │ cy|deleteAfter" (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 21 lines found

● Search (grep)
  │ "export interface SearchArgs|export interface SaveArgs|export interface IngestStartArgs|export
  │ interface IngestStatusArgs|export interface IngestCancelArgs"
  │ (.opencode/skill/system-spec-kit/mcp_server/tools/types.ts)
  └ 48 lines found

● Search (grep)
  │ "const memorySaveSchema|const memorySearchSchema|const memoryIndexScanSchema|const
  │ memoryIngestStartSchema|const memoryIngestStatusSchema|const memoryIngestCancelSchema"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 78 lines found

● Search (grep)
  │ "interface SearchArgs|interface SaveArgs|interface ContextArgs" in memory-*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 27 lines found

● Read (Review agent — Audit MCP handlers)
  └ Running

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ L220:320 (101 lines read)

● Search (grep)
  │ "buildSaveResponse|runPostMutationHooks|buildMutationHookFeedback|return createMCP"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts)
  └ 63 lines found

● Read (Review agent — Audit MCP handlers)
  └ idle

## Audit Summary

I verified the listed handlers/hooks, and checked hook attachment against `mcp_server/context-server.ts` because that is where the audited hook surface is actually fired.

Overall: success envelopes are mostly consistent, hooks are wired, and thrown errors do reach MCP responses. The main weakness is **error-contract inconsistency**: some handlers return structured MCP errors, while others still throw raw `Error` and get downgraded by the global wrapper.

No hook-wiring defect stood out. Missing-validation risk is generally low in this scope because dispatch-time Zod validation and path guards are already doing most of the work.

## Findings

### P1 — Raw handler errors are reaching MCP, but with the wrong contract

**Evidence**

- `handlers/memory-save.ts:729-847` throws raw `Error` for missing `filePath`, governance denial, shared-space denial, and invalid file class.
- `handlers/memory-bulk-delete.ts:48-80, 129-142` throws raw `Error` for validation/safety failures.
- `handlers/memory-ingest.ts:135-152, 249-250, 278-279` throws raw `Error` for invalid `paths` / missing `jobId`.
- The global catch is in `context-server.ts:398-405`.
- Uncoded errors are normalized by `lib/errors/core.ts:261-287`, which falls back to a generic code path.

**Why it matters**

Errors do reach the client, but expected validation/policy failures lose tool-specific `code`, `details`, and recovery shape. That makes `memory_save`, `memory_bulk_delete`, and `memory_ingest_*` behave differently from `memory_search`, `memory_context`, and `memory_match_triggers`, which return structured MCP errors directly.

### P2 — `memory_index_scan` fires mutation hooks but suppresses their result from the MCP response

**Evidence**

- Hook is fired in `handlers/memory-index.ts:264-269` and again via `:539-546`.
- The returned `MutationHookResult` is discarded; only warning logs survive.
- The reusable response formatter exists in `hooks/mutation-feedback.ts:6-58`.
- Compare with `handlers/memory-bulk-delete.ts:228-255`, which surfaces hook outcomes in `hints` and `data`.

**Why it matters**

Hook wiring is present, but scan operators cannot see cache invalidation failures or counts in the tool response. This is a handler-consistency and UX gap, not a firing gap.

### P2 — `memory_context` underreports result IDs for trigger-shaped results

**Evidence**

- Consumption logging uses only `r.id` at `handlers/memory-context.ts:873-876`.
- Eval logging correctly handles `r.id ?? r.memoryId` at `:903-906`.

**Why it matters**

Context flows backed by trigger results can lose IDs in consumption telemetry, which makes ops diagnostics disagree with eval diagnostics.

### P2 — Spec-document discovery silently drops unreadable directories

**Evidence**

- `handlers/memory-index-discovery.ts:60-97`, especially `:94-96`, swallows directory read failures with no log.

**Why it matters**

`memory_index_scan` can return partial discovery with no operator signal that filesystem access degraded the result.

