# Iteration 029: Response envelope and MCP protocol

## Findings

### [P1] Response profiles silently discard non-results payload fields, including in `debug` mode
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts`

**Issue** `applyProfileToEnvelope()` rebuilds formatter input from `data.results` plus top-level `summary`, `hints`, and `meta`, then replaces `envelope.data` with the formatted payload. Any original `data` fields outside `results` are dropped without notification. That is especially problematic for pagination or continuation fields such as `count`, `cursor`, query metadata, or trace payloads, and it directly contradicts the `debug` profile's "full trace, no omission" contract.

**Evidence** `profile-formatters.ts:446-463` extracts only `data.results` into `formatterInput`. `profile-formatters.ts:468-475` then replaces the original `envelope.data` wholesale with `formatted.data`. The file-level contract says `debug` is "full trace, no omission" at `profile-formatters.ts:13-16`, but `formatDebug()` can only preserve `results`, `summary`, `hints`, `meta`, and `rest` from `formatterInput` at `profile-formatters.ts:361-375`, and `formatterInput` never receives the original extra `data` fields in the first place.

**Fix** Pass the full original `data` object into the formatter layer and make each profile explicitly preserve or announce dropped fields. For `debug`, return the original `data` unchanged and attach diagnostics alongside it instead of reconstructing a subset.

### [P1] Server-side exception responses bypass the standard envelope factory and lose required metadata guarantees
**File** `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`

**Issue** The top-level `CallToolRequestSchema` catch path manually serializes `buildErrorResponse()` into a text content item instead of routing through the response helpers in `lib/response/envelope.ts`. That bypass means the standardized response metadata path is not applied to tool-level failures, so required envelope metadata such as `tokenCount` and `cacheHit` is no longer guaranteed on error responses.

**Evidence** `context-server.ts:411-418` returns a manual `{ content, isError }` object and never calls the response wrapper helpers. In contrast, `envelope.ts:16-24` defines `ResponseMeta` with required `tool`, `tokenCount`, and `cacheHit` fields, and `envelope.ts:199-233,243-285` shows the canonical error-response path that would build an error envelope and wrap it consistently for MCP. The manual catch branch skips that factory entirely.

**Fix** Route server-thrown tool errors through `createMCPErrorResponse()` or a shared helper that computes the same standardized metadata before serialization. If `buildErrorResponse()` must remain in the path, normalize its output through the envelope factory before returning it to the MCP transport.

### [P2] Base envelope `tokenCount` undercounts the actual MCP payload that clients receive
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts`

**Issue** `createResponse()` estimates tokens from `JSON.stringify(data)` only, but `wrapForMCP()` sends the fully serialized envelope text to the client. Large `summary`, `hints`, or metadata additions are therefore invisible to `meta.tokenCount` unless some later caller re-synchronizes the count. That makes the core envelope contract internally inconsistent and can hide oversize responses from any caller that uses these helpers directly.

**Evidence** `envelope.ts:140-142` computes `tokenCount` from `dataString = JSON.stringify(data)`. `envelope.ts:247-250` then serializes the full envelope object into the MCP text content item. The module README advertises token awareness for the response envelope itself at `README.md:32-58`, not just the `data` subobject.

**Fix** Compute `tokenCount` from the final serialized envelope text, or centralize serialization in one helper that produces both the text payload and its exact token count. If partial counting is intentional, rename the field to something like `dataTokenCount` so callers do not treat it as total response size.

### [P2] `autoSurfacedContext` creates a second, out-of-envelope response contract at the MCP result top level
**File** `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`

**Issue** Successful responses are mutated after dispatch to add `autoSurfacedContext` as a top-level property on the MCP result object, even though the response module standardizes the tool payload inside the serialized envelope text. This creates two parallel response contracts: one inside `content[0].text` and another on the outer result object. Clients that only parse the envelope will never see the surfaced context, while strict consumers of the outer result shape may reject or ignore the non-standard field.

**Evidence** `context-server.ts:347-350` appends hints into the envelope and then separately assigns `result.autoSurfacedContext = autoSurfacedContext`. The same file explicitly allows arbitrary top-level fields on tool results via `ToolCallResponse` at `context-server.ts:144-147`. By contrast, the response wrapper in `envelope.ts:243-253` standardizes responses as `{ content, isError }`, with the actual tool payload serialized inside the text item.

**Fix** Move auto-surfacing diagnostics into the serialized envelope, preferably under `meta` or a well-defined `data.autoSurfacedContext` field, or use a standard MCP side channel such as `structuredContent` if the data must remain machine-readable outside the text envelope.

## Summary

The main protocol risks are contract drift rather than outright transport breakage: profile formatting silently drops envelope fields, server-thrown errors bypass the canonical metadata factory, base token accounting is computed against the wrong object, and auto-surfaced context leaks outside the standardized envelope. I did not find a direct text-content type mismatch in the reviewed wrappers, but these four issues are enough to make MCP responses inconsistent across success, profile-shaped, and failure paths.
