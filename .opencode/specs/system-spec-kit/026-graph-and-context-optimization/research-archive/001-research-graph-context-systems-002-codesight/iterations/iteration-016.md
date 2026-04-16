# Iteration 16 — MCP server request lifecycle and cache semantics

## Summary
Codesight's MCP server is intentionally thin: raw JSON-RPC over stdio, a single in-memory cache per project root, and text-only tool outputs. That simplicity is part of its appeal, but it also creates several important behavior boundaries: query tools mutate `.codesight/` on cache miss, argument schemas are descriptive rather than enforced, and error handling mixes JSON-RPC protocol errors with in-band text errors.

## Files Read
- `external/src/mcp-server.ts:35-85`
- `external/src/mcp-server.ts:89-288`
- `external/src/mcp-server.ts:292-398`
- `external/src/mcp-server.ts:402-534`

## Findings

### Finding 1 — The cache is one global `ScanResult` per resolved root
- Source: `external/src/mcp-server.ts:41-49`, `external/src/mcp-server.ts:283-287`
- What it does: `cachedResult` and `cachedRoot` are module-level globals. If the requested directory resolves to the same root, all tools reuse the same cached scan until `codesight_refresh` clears both values.
- Why it matters for Code_Environment/Public: This is good enough for a single-session assistant, but not for multi-root or concurrent work. The design assumes one active project context at a time.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: MCP cache model
- Risk/cost: low

### Finding 2 — Query tools write `.codesight/` as a cold-scan side effect
- Source: `external/src/mcp-server.ts:45-85`, `external/src/mcp-server.ts:89-95`
- What it does: `getScanResult()` always calls `writeOutput(tempResult, resolve(root, ".codesight"))` before caching, even for tools like `codesight_get_routes` or `codesight_get_env`. `codesight_scan` then calls `writeOutput(...)` again with final token stats.
- Why it matters for Code_Environment/Public: The MCP interface is not read-only in practice. Querying the server can mutate repo files on disk, which is a major contract choice for any assistant integration.
- Evidence type: source-confirmed
- Recommendation: reject
- Affected area: MCP tool contract
- Risk/cost: high

### Finding 3 — Tool payloads are human-readable text, not structured objects
- Source: `external/src/mcp-server.ts:98-281`, `external/src/mcp-server.ts:443-448`
- What it does: every tool returns a string that is wrapped as `content: [{ type: "text", text: result }]`. Routes, schema, blast radius, env vars, hot files, and summary are all formatted prose or markdown-like text.
- Why it matters for Code_Environment/Public: This is great for direct assistant consumption and poor for composability. If Public wants downstream automation or richer agent orchestration, it should prefer structured JSON or dual text+JSON responses.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: MCP surface design
- Risk/cost: medium

### Finding 4 — Error handling is inconsistent across protocol and tool layers
- Source: `external/src/mcp-server.ts:450-467`, `external/src/mcp-server.ts:471-526`
- What it does: unknown tool names and unknown methods use JSON-RPC `error` envelopes, while handler failures return `result.content` text with `isError: true`. Parse failures become `-32700` errors pushed on the protocol stream.
- Why it matters for Code_Environment/Public: Clients must understand two failure shapes. That is survivable, but it weakens machine-readability and testability.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: runtime error design
- Risk/cost: low

### Finding 5 — Transport handling is minimal but correct enough for single-threaded use
- Source: `external/src/mcp-server.ts:480-534`
- What it does: `startMCPServer()` buffers stdin, parses `Content-Length` headers, queues JSON-RPC requests, and processes them serially through `processQueue()`.
- Why it matters for Code_Environment/Public: This is a solid small-server baseline. It proves you can ship a useful assistant MCP without dependencies, but it also shows where richer lifecycle support (`shutdown`, cancellation, structured diagnostics) has been intentionally omitted.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: MCP transport
- Risk/cost: low

## Recommended Next Focus
Stay on the assistant-integration surface and inspect `ai-config.ts`, which appears to be Codesight's highest-value idea and one of its riskiest write behaviors.

## Metrics
- newInfoRatio: 0.78
- findingsCount: 5
- focus: "iteration 16: MCP server request lifecycle and cache semantics"
- status: insight
