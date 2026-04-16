# Iteration 23 - security - server_core

## Dispatcher
- iteration: 23 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:48:17.391Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
- .opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts
- .opencode/skill/system-spec-kit/mcp_server/tools/types.ts
- .opencode/skill/system-spec-kit/mcp_server/tools/index.ts
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts
- .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### P1-SEC-01: `skill_graph_scan` can traverse outside the workspace because the skill-graph dispatch path never applies the runtime schema/safe-path guard
- **Evidence:** `context-server` explicitly relies on each dispatcher to run Zod validation before work starts, but the request handler only does length checks and then calls `dispatchTool(name, args)` directly (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882-885`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:962-965`, `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:29-36`). `memory-tools` honors that contract with `validateToolArgs(...)` on every routed tool (`.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:76-106`), while `skill-graph-tools` does not call `validateToolArgs` at all and forwards raw args straight into handlers (`.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:51-67`). The public tool contract advertises a bounded schema for `skill_graph_scan`/`skill_graph_query` (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:625-653`), but those tools are missing from the runtime `TOOL_SCHEMAS` / `ALLOWED_PARAMETERS` maps (`.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:408-447`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:449-482`). That matters because `handleSkillGraphScan()` resolves caller-controlled `skillsRoot` against `process.cwd()` and recursively reads every `graph-metadata.json` beneath it with no workspace-boundary check (`.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:24-33`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:320-345`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:455-462`). By contrast, the analogous `code_graph_scan` handler canonicalizes the path and rejects roots outside the workspace (`.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:128-164`).
- **Impact:** An MCP caller can point `skill_graph_scan` at `../../...` or an absolute path and make the server enumerate and ingest skill-graph metadata outside the repository boundary. That expands the server's filesystem read surface beyond the advertised workspace scope and persists external absolute paths into the SQLite graph for later status/validation passes.

```json
{
  "claim": "The skill-graph tool path bypasses runtime schema validation, so skill_graph_scan accepts a caller-controlled root outside the workspace and recursively reads graph-metadata.json files there.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/context-server.ts:882-885",
    ".opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:51-67",
    ".opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:408-447",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:24-33",
    ".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:320-345"
  ],
  "counterevidenceSought": "I looked for an outer server-side validation/clamping layer or a workspace-boundary check inside skill_graph_scan comparable to code_graph_scan and did not find one.",
  "alternativeExplanation": "This could be an intentional design to let trusted operators index non-workspace skill catalogs, but that intent is not documented in the public tool description or enforced behind a privileged path.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if the product explicitly allows arbitrary external scan roots for trusted callers and documents that skill_graph_scan is not workspace-scoped."
}
```

### P2 Findings
- **P2-TEST-01:** The validation gap above was easy to ship because there is no dedicated schema/dispatcher coverage for `skill_graph_*`. The only assertions I found are tool-registration checks in `context-server.vitest.ts` (`.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:192-195`, `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:301`), while analogous direct coverage exists only for `memory_quick_search` runtime schema enforcement and dispatch (`.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:381-392`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:41-64`). A regression test that rejects out-of-workspace `skillsRoot` or unknown `skill_graph_query` params would have caught this.

## Traceability Checks
- `memory_quick_search` matches its intended contract: it validates input, preserves governed scope fields, applies the documented default search flags, and relabels the response envelope so callers can distinguish the shortcut from raw `memory_search` (`.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79-96`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:41-64`).
- The skill-graph implementation diverges from the server contract expressed in `context-server.ts`: the server comment says dispatch modules perform per-tool Zod validation, but `skill-graph-tools.ts` is the exception, so the runtime behavior is looser than the public tool schema advertised for `skill_graph_scan` and `skill_graph_query` (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882-885`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:625-653`, `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:51-67`).

## Confirmed-Clean Surfaces
- **`memory-tools.ts`:** All routed memory tools pass through `validateToolArgs(...)` before `parseArgs(...)`, so unknown keys, bad types, and unsafe path strings are stopped at the shared Zod boundary instead of leaking into handlers (`.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:76-106`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:52-61`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:550-572`).
- **Skill-graph query SQL path:** The underlying relationship queries use prepared statements throughout, so I did not find SQL-injection exposure in `skill_graph_query` itself (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts:108-189`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:48-145`).

## Next Focus
- Iteration 24 should stay on server-core security and review the analogous `code-graph-tools.ts` / `handlers/code-graph/*` dispatch path for the same schema-enforcement mismatch, especially where filesystem roots or external binary calls are accepted.
