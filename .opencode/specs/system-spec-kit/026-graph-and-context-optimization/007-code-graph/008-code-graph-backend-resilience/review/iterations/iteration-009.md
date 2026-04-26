# Iteration 009

**Run Date:** 2026-04-26
**Dimension:** maintainability
**Focus:** Naming, abstractions, dead code, compat, and verifier contract hygiene
**Verdict Snapshot:** CONDITIONAL

## Summary

- The reviewed implementation mostly stays within existing module style. I did not find dead imports/exports on the touched implementation surface, and the new optional config fields keep legacy behavior by default because weights, resolver settings, and readiness options all fall back to the pre-008 paths.
- `computeEdgeShare()`, `computePSI()`, and `computeJSD()` are pure exported helpers in `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts:26-74`, so they are testable in isolation. The maintainability debt is concentrated in the verification surface, not the drift math helpers.
- Two issues remain: the verifier now depends on an untyped, duplicated `code_graph_query` wire contract, and the verify-side API/schema naming is already drifting enough that downstream code needs compatibility shims.

## Findings

### P0

- None.

### P1

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:234-330,344-361` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1111-1131` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts:167-248,279-303` — The verifier duplicates the `code_graph_query` transport contract instead of sharing a typed boundary. `parseOutlinePayload()` re-parses the MCP envelope by hand, `executeBattery()` accepts `query: (args: any) => Promise<any>`, and the tests only validate that hand-rolled mocked payload shape. That means a future `handleCodeGraphQuery()` response refactor can break verification at runtime without any compiler help, and without an integration test that exercises the real query handler output. Fix: extract a shared typed outline/query payload adapter from the query layer and have `executeBattery()` depend on that typed return value instead of `any` plus ad hoc JSON parsing.

### P2

- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:564-566,640-654`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:26-33,88-100`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:51-58,450-453`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:125-128`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts:182-183,306-321` — The new verify API uses inconsistent terminology and field casing. `persistBaseline` means “persist edge-distribution baseline” on `code_graph_scan`, but on `code_graph_verify` it means “save the latest verification result.” `VerifyResult` also publishes both `overall_pass_rate` and `overallPassRate`, while `edge_focus_pass_rate` only has the snake_case form, so `ensure-ready` already carries a compatibility shim for mixed spellings. None of this breaks current behavior, but it increases cognitive load for every future caller and makes the persisted verification schema harder to evolve cleanly. Fix: rename the verify-side flag to something specific like `persistVerification` or `persistResult`, normalize `VerifyResult` to one casing scheme, and keep any temporary aliases at the handler boundary instead of in the core result type.

## Files Reviewed

- The packet text says “17 modified files,” but the live implementation diff currently resolves to 16 implementation modules plus tests/docs. This review covered the full implementation surface and the verifier-focused tests guarding it.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:102-110,257-264`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:1-9`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1040-1447`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:1-317`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:1-229`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:1-112`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:117-130,216-223,284-301,410-475`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts:1-74`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:33-39,103-140,343-442`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:1-509`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:15-27,90-97`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:43-63,73-80,156-169,735-778,916-1128,1391-1859,1913-1927`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:26-33,301-307,364-482,626-697`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:1-78`
- `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:103-117`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:558-657,941`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts:1-324`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:1-239`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:126,594,685-716`

## Convergence Signals

- Naming and comment style are mostly aligned with adjacent code. I did not find a broad clarity problem or unearned abstraction wave outside the verifier surface.
- The new drift helpers are a good maintainability move: they isolate math from handlers and are pure enough for direct unit tests if the packet adds them later.
- Backwards-compat defaults are mostly safe. `edgeWeights`, `tsconfigPath`, `baseUrl`, `pathAliases`, `verify`, and scan-side `persistBaseline` all preserve existing caller behavior when omitted.
- The remaining maintainability risk is concentrated in verification contracts: one issue is internal coupling to `handleCodeGraphQuery()`'s JSON envelope, the other is outward-facing naming/schema drift.
