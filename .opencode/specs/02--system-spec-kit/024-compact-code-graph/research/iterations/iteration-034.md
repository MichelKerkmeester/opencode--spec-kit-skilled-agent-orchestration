# Iteration 034: End-to-End Flow Trace

## Focus

Trace the current end-to-end compaction-context injection flow across the live MCP server entrypoint, hook helper modules, public `api/` surface, and adjacent retrieval-formatting modules. The requested path `.opencode/skill/system-spec-kit/mcp_server/lib/context-server.ts` does not exist in the current tree; the live entrypoint is `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1-6`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-13`]

## Findings

1. The live PreCompact-style compaction path is currently an in-band MCP pre-dispatch hook, not an implemented external Claude hook script. The runtime chain starts at `context-server.ts` `CallToolRequestSchema`, checks whether the incoming call is `memory_context` with `mode === 'resume'`, extracts a context hint, and routes that hint through `autoSurfaceAtCompaction(contextHint)` before the tool handler runs. `autoSurfaceAtCompaction()` only trims/validates the string and delegates to `autoSurfaceMemories(sessionContext.trim(), 4000, 'compaction')`. `autoSurfaceMemories()` then calls `getConstitutionalMemories()`, `triggerMatcher.matchTriggerPhrases(contextHint, 5)`, enriches constitutional hits with retrieval directives, and finally passes the assembled payload through `enforceAutoSurfaceTokenBudget(...)`. The returned value is either `null` or an `AutoSurfaceResult` object; nothing in this chain writes cache files or produces human-readable hook text by itself. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-356`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:188-228`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-317`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:978-1009`]

2. The exact return shape of `autoSurfaceAtCompaction()` is raw hook metadata, not a rendered compact brief. `AutoSurfaceResult` contains `constitutional`, `triggered`, `surfaced_at`, and `latencyMs`; each triggered item uses `{ memory_id, spec_folder, title, matched_phrases }`. The compaction hook shares the same 4,000-token boundary as tool-dispatch surfacing and is explicitly tested to stay within that estimate. This means an external hook script must still perform its own rendering if it wants readable stdout or cache-file text. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:26-36`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:52-55`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:136-186`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:503-530`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:538-626`]

3. After the tool handler returns, `context-server.ts` decorates the outer MCP envelope with the surfaced compaction payload rather than flattening it into the main response body. `appendAutoSurfaceHints(result, autoSurfacedContext)` adds a human-readable hint line plus `meta.autoSurface = { constitutionalCount, triggeredCount, surfaced_at, latencyMs }`, and the server separately writes the full raw payload to `meta.autoSurfacedContext`. The final caller-visible transport is therefore still a normal `MCPResponse` whose `content[0].text` is a JSON envelope; the surfaced compaction context lives in envelope metadata, not as direct top-level stdout text. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:373-399`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-104`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:30-35`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:264-282`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1044-1090`]

4. The current repo does not yet contain the external `PreCompact` and `SessionStart(source=compact)` hook scripts described by the packet; those paths are still spec-level design. Phase 1 defines the intended flow as `compact-precompute.js` reading transcript tail, calling `autoSurfaceAtCompaction(context)`, writing `.claude/compact-context-cache.json`, and emitting no stdout, followed by `compact-inject.js` reading that cache, emitting cached context to stdout, and deleting the cache after injection. Phase 2 refines the same SessionStart-side behavior into a shared `session-prime.ts` that reads pending compact state, outputs cached context for `source=compact`, and falls back to `memory_context({ mode: "resume", profile: "resume" })` for resume-style recovery. There is also an important packet-level mismatch: Phase 1's fallback text omits `profile: "resume"`, but DR-007 and Phase 2 say every resume path must pass it. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:17-31`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:35-49`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:50-66`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:29-53`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:58-74`]

5. The exact data flow from the memory database to final context output has two parallel branches:

   ```text
   Branch A: compaction auto-surface metadata
   memory_index DB
   -> getConstitutionalMemories(): SELECT constitutional rows from memory_index
   -> triggerMatcher.loadTriggerCache(): SELECT trigger_phrases rows from memory_index
   -> matchTriggerPhrases(contextHint, 5)
   -> autoSurfaceMemories()
   -> autoSurfaceAtCompaction()
   -> context-server appendAutoSurfaceHints()
   -> outer MCP envelope meta.autoSurface + meta.autoSurfacedContext

   Branch B: nested resume retrieval payload
   memory_context tool call
   -> handleMemoryContext()
   -> executeResumeStrategy()
   -> handleMemorySearch()
   -> formatSearchResults()
   -> createMCPSuccessResponse(memory_search envelope)
   -> applyProfileToEnvelope('resume')
   -> createMCPResponse(memory_context outer envelope)
   -> context-server metadata decoration
   -> final MCPResponse content[0].text
   ```

   In Branch A, constitutional rows come directly from `memory_index` via SQL in `getConstitutionalMemories()`, while trigger matches come from a cached loader query over `memory_index` in `trigger-matcher.ts`. In Branch B, the search pipeline formats result rows into a `memory_search` envelope, then the resume profile rewrites that inner envelope into `{ state, nextSteps, blockers, topResult }`, and only after that does `handleMemoryContext()` wrap the nested search envelope in the outer `memory_context` response. Recovery payloads from `recovery-payload.ts` can appear on the search side when results are empty or weak, but they are not part of `autoSurfaceAtCompaction()` itself. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:90-124`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:195-223`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:176-195`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337-440`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621-692`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:688-717`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1215-1280`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784-835`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1066-1084`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:394-427`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:593-680`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:356-370`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:447-498`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:179-224`]

6. `api/` is a stable script-facing surface, but it does not currently expose the compaction hook helpers. The package export map only exposes `"." -> ./dist/context-server.js`, `"./api"`, and `"./api/*"`. `api/README.md` further says external consumers should prefer `@spec-kit/mcp-server/api` or `@spec-kit/mcp-server/api/<module>` and avoid direct imports from `lib/`, `handlers/`, or `core/` unless there is a deliberate exception. Because there is no `./hooks` export, a hook script that wants `autoSurfaceAtCompaction()` cannot get it through the public package API today; it must either import a relative compiled file under `dist/hooks/` or fall back to an MCP tool call. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-13`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/api/README.md:22-24`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/api/README.md:49-53`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:11-117`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:27-36`]

7. The exact import-path guidance splits into two valid buckets:

   - Public package API for ordinary external scripts:
     - `@spec-kit/mcp-server/api`
     - `@spec-kit/mcp-server/api/indexing`
     - `@spec-kit/mcp-server/api/search`
     - `@spec-kit/mcp-server/api/providers`
     - `@spec-kit/mcp-server/api/storage`
   - Direct relative compiled-hook imports for compaction hook scripts, because hooks are not package-exported:
     - from planned `mcp_server/scripts/hooks/compact-precompute.js` or `compact-inject.js`: `../../dist/hooks/memory-surface.js` or `../../dist/hooks/index.js`
     - from planned higher-level `scripts/hooks/claude/session-prime.ts`: `../../../mcp_server/dist/hooks/memory-surface.js`

   Importing `@spec-kit/mcp-server` itself is not the right hook-helper surface because that resolves to `dist/context-server.js`, which is the stdio MCP server entrypoint. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-18`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/api/README.md:51-53`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/index.d.ts:1-4`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/memory-surface.d.ts:20-65`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:35-48`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:29-53`]

8. The practical function-level answer is therefore:
   - PreCompact direct-import path: `autoSurfaceAtCompaction(sessionContext, options?)`
   - Optional helper if the script wants to mine structured stdin instead of transcript text: `extractContextHint(args)`
   - SessionStart(compact) cache-read path: no current exported helper exists for cache I/O or text rendering; those parts must be implemented in the hook script itself
   - Resume fallback path: use `memory_context({ mode: "resume", profile: "resume" })` via the MCP tool contract, because there is no public hook-safe export for `handleMemoryContext()` in `api/`

   In other words, the hook scripts can import the auto-surface primitive directly, but not the whole `memory_context` orchestration contract through the public JS API. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:67-84`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-317`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/api/README.md:24-25`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:10-17`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:45-48`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:69-74`]

9. `recovery-payload.ts` and `dynamic-token-budget.ts` sit downstream of retrieval, not inside the compaction hook helper. `buildRecoveryPayload()` and `shouldTriggerRecovery()` are only referenced by `formatSearchResults()` to attach search-recovery metadata when result sets are empty, low-confidence, or partial. `getDynamicTokenBudget()` is imported by `hybrid-search.ts`, where it computes a tier-aware advisory budget and stores that fact in stage metadata; the module header explicitly says it does not enforce truncation by itself. Neither module is called from `memory-surface.ts` or `context-server.ts`'s `autoSurfaceAtCompaction()` branch, so compaction surfacing currently uses the fixed `COMPACTION_TOKEN_BUDGET = 4000` path instead of query-tier-aware budgeting or recovery-payload logic. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:5-9`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:54-90`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:40-44`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1028-1043`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:394-427`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:593-680`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:52-55`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-317`]

10. The dependency graph between the live modules is:

    ```text
    context-server.ts
    ├─ hooks/index.ts
    │  ├─ hooks/memory-surface.ts
    │  │  ├─ lib/search/vector-index.ts
    │  │  ├─ lib/parsing/trigger-matcher.ts
    │  │  │  └─ lib/search/vector-index.ts
    │  │  └─ lib/search/retrieval-directives.ts
    │  └─ hooks/response-hints.ts
    ├─ tools/index.ts
    │  └─ tools/context-tools.ts
    │     └─ handlers/memory-context.ts
    │        ├─ handlers/memory-search.ts
    │        │  ├─ formatters/search-results.ts
    │        │  │  └─ lib/search/recovery-payload.ts
    │        │  └─ lib/response/profile-formatters.ts
    │        └─ lib/response/envelope.ts
    └─ lib/architecture/layer-definitions.ts

    hybrid-search.ts
    └─ lib/search/dynamic-token-budget.ts
    ```

    The important architectural consequence is that the compaction hook helper and the nested resume retrieval payload only meet again at `context-server.ts`, where the outer response envelope is finalized. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:20-117`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:15-35`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:10-17`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:15-39`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784-835`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:394-680`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1-44`] 

11. The main error boundaries are already layered and mostly non-fatal:
    - `getConstitutionalMemories()` catches DB/SQL failures and returns `[]` with a warning. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:97-124`]
    - `trigger-matcher` cache load failures degrade to `[]` and store degraded-state metadata instead of throwing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:346-440`]
    - `autoSurfaceMemories()` catches surfacing failures and returns `null`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:224-228`]
    - `context-server.ts` treats auto-surface failures as non-fatal and continues the tool call. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:334-355`]
    - `handleMemoryContext()` has hard envelopes for database-state failure (`E_INTERNAL`), untrusted session scope (`E_SESSION_SCOPE`), and strategy execution failure (`E_STRATEGY`). [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:984-997`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1041-1059`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1163-1185`]
    - `appendAutoSurfaceHints()` swallows parse/shape failures and leaves the original response untouched. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-110`]
    - `enforceTokenBudget()` and `enforceAutoSurfaceTokenBudget()` truncate or drop payloads rather than emitting malformed JSON. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:136-186`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:286-543`]
    - Planned external hook scripts add additional failure points not yet implemented in code: stdin parse, transcript-tail read, cache write/read/delete, and stdout contamination. The stdout rule is especially strict because MCP transport must keep stdout clean; any diagnostics belong on stderr. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:43-49`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:58-66`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:4-6`] [SOURCE: `.opencode/skill/system-spec-kit/references/config/environment_variables.md:401-403`]

## Evidence

### A. Live compaction pre-dispatch trace

```text
CallToolRequest(memory_context, mode='resume')
-> context-server extracts contextHint
-> autoSurfaceAtCompaction(contextHint)
-> autoSurfaceMemories(contextHint, 4000, 'compaction')
-> getConstitutionalMemories() + matchTriggerPhrases(contextHint, 5)
-> appendAutoSurfaceHints()
-> meta.autoSurfacedContext on final MCP envelope
```

Key proof points: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-399`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:188-317`

### B. Planned external hook flow from the packet

```text
PreCompact
-> read transcript tail
-> autoSurfaceAtCompaction(context)
-> write .claude/compact-context-cache.json
-> no stdout

SessionStart(source=compact)
-> read .claude/compact-context-cache.json
-> emit cached context to stdout
-> delete cache
-> fallback to memory_context(..., profile:'resume') when cache missing
```

Key proof points: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:17-31`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:33-53`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:58-74`

### C. Public API vs direct-hook import boundary

```text
Package exports:
  "." -> "./dist/context-server.js"
  "./api" -> "./dist/api/index.js"
  "./api/*" -> "./dist/api/*.js"

No "./hooks" export exists.
```

Key proof points: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-13`, `.opencode/skill/system-spec-kit/mcp_server/api/README.md:49-53`, `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/index.d.ts:1-4`

## New Information Ratio (0.0-1.0)

0.78

## Novelty Justification

Prior iterations had already identified the broad idea of "PreCompact precompute, SessionStart inject," but this pass adds implementation-level precision that was still missing:

- the exact live runtime seam is the `memory_context(mode:'resume')` pre-dispatch branch in `context-server.ts`, not an already-existing external Claude hook script;
- `autoSurfaceAtCompaction()` returns raw metadata only, so cache persistence and human-readable rendering still need to be built externally;
- `api/` is a real public contract, but it does not expose compaction hooks, which forces a deliberate choice between relative `dist/hooks` imports and MCP fallback;
- `recovery-payload.ts` and `dynamic-token-budget.ts` are adjacent retrieval features, not part of the current compaction-helper chain;
- the packet currently contains a concrete spec inconsistency around the missing `profile: "resume"` in the Phase 1 fallback.

That combination materially sharpens the implementation plan because it separates what already exists from what still has to be built.

## Recommendations for Implementation

1. Add a small public `api/hooks.ts` export if hook scripts are expected to import compaction helpers as supported runtime consumers. Right now the packet wants direct import, but the package export map does not make that a first-class contract. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-13`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/api/README.md:49-53`]

2. Treat `autoSurfaceAtCompaction()` as a retrieval primitive only. Build a separate hook-side renderer that converts `AutoSurfaceResult` into compact human text for stdout and cache storage, instead of assuming the hook helper already returns a ready-to-inject brief. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:26-36`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-317`]

3. Normalize the packet’s SessionStart fallback contract to `memory_context({ mode: "resume", profile: "resume" })` everywhere. The decision record and Phase 2 already require that; Phase 1 should be brought into line before implementation starts. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:58-66`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:45-48`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:69-74`]

4. Keep the failure behavior asymmetric on purpose:
   - PreCompact should degrade to “no cache written” without stdout noise.
   - SessionStart(compact) should prefer cache, then fall back to profiled `memory_context`, and only then emit a minimal constitutional-safe message if both fail.
   - All diagnostics should go to stderr, never stdout. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:43-49`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:58-66`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:4-6`] [SOURCE: `.opencode/skill/system-spec-kit/references/config/environment_variables.md:401-403`]

5. Document the two-layer output model in the implementation notes: compaction auto-surface lives in outer envelope metadata, while the resume brief lives inside the nested `memory_search` envelope. That distinction matters for both hook rendering and debugging. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:393-399`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1247-1280`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:356-370`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:447-498`]
