# Iteration 29 - traceability - handlers

## Dispatcher
- iteration: 29 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:11:16.547Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/post-insert-deferred.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. `session_resume(minimal)` does not honor its published minimal-mode contract. The public schema says minimal mode should omit the full memory payload, but the handler still runs the resume ladder and returns the full `memory` object plus the `memory-resume` payload section (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:710-718`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:425-429`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:493-500`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:553-566`). The regression test suite now locks in that drift by asserting ladder-backed memory is still present in minimal mode (`.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:204-218`).

```json
{
  "claim": "session_resume(minimal=true) still returns the full memory resume surface even though the published tool contract says minimal mode omits that payload.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:710-718",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:425-429",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:493-500",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:553-566",
    ".opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:204-218"
  ],
  "counterevidenceSought": "Checked whether minimal mode conditionally skipped buildResumeLadder() or suppressed the memory payload; the only minimal-specific branch adds sessionQuality and skips bootstrap telemetry.",
  "alternativeExplanation": "The schema text may be stale after a refactor from memory_context-heavy resume to ladder-backed resume, but the exported tool contract still promises no full memory payload.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if a reviewed compatibility layer explicitly documents that minimal mode intentionally retains ladder-backed memory and the tool description is corrected in the same release."
}
```

2. `memory_save` planner follow-up actions advertise internal API names as if they were invocable MCP tools. The planner response model and builder surface `refreshGraphMetadata`, `reindexSpecDocs`, and `runEnrichmentBackfill` in the `tool` field (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:61-66`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1629-1676`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:327-365`), but those names only exist as internal follow-up APIs in `api/indexing.ts` while the published MCP registry exposes `memory_save` and `memory_index_scan` instead (`.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:95-129`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:216-218`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:489-491`). Tests assert those opaque names in the user-facing planner payload, so the mismatch is currently codified rather than accidental (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts:49-87`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts:120-139`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1213-1229`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1583-1593`).

```json
{
  "claim": "memory_save planner responses emit follow-up action `tool` names that are not exposed as MCP tools, so external callers cannot execute the advertised follow-ups from the planner payload alone.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:61-66",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1629-1676",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:327-365",
    ".opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:95-129",
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:216-218",
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:489-491",
    ".opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts:49-87",
    ".opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts:120-139",
    ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1213-1229",
    ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1583-1593"
  ],
  "counterevidenceSought": "Checked whether those follow-up names were also registered in the MCP tool schema or routed through the public tool catalog; only the internal indexing API exports them, while the MCP registry publishes memory_save and memory_index_scan.",
  "alternativeExplanation": "A host-specific orchestrator may translate these strings into internal API calls, but this handler emits them over MCP in a field explicitly named `tool` with no translation or capability metadata attached.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade if an adjacent reviewed runtime layer deterministically maps refreshGraphMetadata/reindexSpecDocs/runEnrichmentBackfill into callable actions before planner responses reach agents."
}
```

### P2 Findings
- `session_bootstrap` silently converts malformed child payloads into `{}` and still reports the composite bootstrap as `"full"` unless the sub-handler throws. `extractData()` swallows JSON parse failures (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:71-80`), both child responses trust that fallback (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:191-204`), and completeness telemetry only checks for `.error` fields (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230-231`). Current tests only exercise well-formed JSON child mocks, so this envelope-drift path is not covered (`.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:3-124`; `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts:14-93`).

## Traceability Checks
- `session_resume` minimal mode is out of sync with the published tool description and the current test suite now codifies the drift instead of catching it.
- The suggested review target `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts` is absent from the current tree; no live implementation surface exists there to audit.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts` stays traceable: the module is still a pure response-builder layer, preserves planner route metadata, and does not hide side effects behind validation helpers.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`, and `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/index.ts` still line up with the published skill-graph query/scan shapes: supported enums, family validation set, clamp ranges, default scan root, and error-envelope behavior match `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:625-654`.

## Next Focus
- If iteration 30 stays on traceability, inspect the runtime/transport layer that consumes planner follow-up actions to confirm whether any hidden dispatcher translates the camelCase follow-up API names into invocable actions before they reach agents.
