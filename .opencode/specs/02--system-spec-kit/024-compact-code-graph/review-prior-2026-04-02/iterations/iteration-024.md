# Iteration 024: D2 Security Memory-Context Handler Dive

## Focus

Fresh D2 security dive on the `memory_context` handler path: input validation, live MCP schema enforcement, error leakage, authorization/session boundaries, and whether a crafted `input` string can reach code execution. Required target files reviewed in this pass were `handlers/memory-context.ts`, `tool-schemas.ts`, and `context-server.ts`; I also traced the live dispatcher and session/error helpers needed to confirm runtime behavior.

## Findings

No net-new security findings were added in this pass.

## Verified Healthy / Narrowed Non-Findings

### `memory_context` is still schema-validated on the live tool path

- `tool-schemas.ts` still publishes a strict `memory_context` contract with `additionalProperties: false`, bounded enums, and bounded numeric ranges.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-43]
- The live dispatcher path for this tool is not the unchecked code-graph route from `F010`. `tools/index.ts` still sends `memory_context` calls into `context-tools.ts`, and `context-tools.ts` still invokes `validateToolArgs('memory_context', args)` before `handleMemoryContext(...)` runs.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/index.ts:27-34][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:14-17]
- `context-server.ts` still performs only the generic length precheck before dispatch, but for `memory_context` that generic handoff lands in the validating context dispatcher rather than the unchecked code-graph dispatcher.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:314-318][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/index.ts:27-34][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:14-17]
- **Conclusion:** `F010` remains scoped to the `code_graph_*` / `ccc_*` family. I did **not** confirm a new schema-bypass issue for `memory_context` itself in the current runtime path.

### Session reuse is corroboration-bound, not a fresh `memory_context` auth bypass

- `handleMemoryContext(...)` still derives session lifecycle through `resolveSessionLifecycle(...)` and rejects session-scope errors before strategy execution continues.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1041-1059]
- `resolveSessionLifecycle(...)` still delegates trust decisions to `sessionManager.resolveTrustedSession(...)` instead of blindly trusting the caller-provided `sessionId`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:724-764]
- `resolveTrustedSession(...)` still rejects unknown session IDs, rejects uncorroborated identities, and rejects tenant/user/agent scope mismatches before it allows reuse of a server-managed session.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:401-427]
- **Conclusion:** this slice still lacks transport-layer authentication by itself, but I did **not** find a new handler-local session hijack where guessing a `sessionId` is enough to resume arbitrary memory state.

### Crafted `input` text does not expose a code-execution sink in the reviewed handler path

- After the basic non-empty-string check, `handleMemoryContext(...)` still trims `input`, logs telemetry, resolves mode, and routes the text into retrieval strategies.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1011-1024][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1120-1137][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1163-1169]
- `executeStrategy(...)` still only dispatches to `handleMemoryMatchTriggers(...)` or `handleMemorySearch(...)`; there is no `eval`, shell spawn, or process-execution primitive in the reviewed `memory_context` handler slice.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:872-891]
- `maybeDiscoverSpecFolder(...)` still only passes the trimmed text into folder-discovery helpers and logs failure messages; it does not execute the input.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:851-869]
- **Conclusion:** I did **not** find a reviewed-path route from `memory_context.input` to code execution.

### Previously observed error-message leakage remains active, but it is not new in iteration 024

- `handleMemoryContext(...)` still reflects raw exception text into error envelopes on DB-check failure (`Database state check failed: ${message}`) and strategy-execution failure (`toErrorMessage(error)`).[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:984-996][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1163-1185]
- Strategy-layer failures are still returned with `upstream: strategyError.details`, and `createMCPErrorResponse(...)` still serializes the provided `error` string plus `details` object directly into the MCP envelope.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1188-1205][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:220-247][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:304-306]
- This matches the earlier review-state observation that `memory_context` can expose raw internal error text/details to callers; I did not re-log it as a new finding here.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/review/deep-research-state.jsonl:13]

## Summary

- New findings: **none**
- `memory_context` schema enforcement on the live path: **confirmed healthy / narrowed**
- Session-scope corroboration: **confirmed healthy / narrowed**
- Crafted-input-to-code-execution path: **ruled out in the reviewed slice**
- Raw internal error-text/details echo: **still present, but previously observed rather than new**
- Recommended next focus: none for discovery. Remediation should stay on the already-confirmed D2 blockers (`F009`, `F010`) plus sanitizing `memory_context` / `code_graph_context` error envelopes if the packet wants to retire the earlier leakage observation.
