# Iteration 005

**Run Date:** 2026-04-26
**Dimension:** correctness
**Focus:** Verifier library + handler + MCP wiring
**Verdict Snapshot:** CONDITIONAL

## Summary

- The MCP wiring is intact on the reviewed path: `code_graph_verify` is registered in `tool-schemas.ts`, exported from `handlers/index.ts`, dispatched by `code-graph-tools.ts`, and `handleCodeGraphVerify()` keeps the read-only default by calling `ensureCodeGraphReady(..., { allowInlineIndex:false, allowInlineFullScan:false })` before any probe execution.
- `executeBattery()` contains query-level failures instead of crashing the whole battery. A thrown `handleCodeGraphQuery()` call or malformed/empty outline payload is caught, recorded as an `error` probe, and the loop continues unless `failFast === true`.
- Two required correctness fixes remain: symbol matching is case-insensitive even though the indexed languages are not, and the persisted per-query failure payload drops source/query context that the packet said downstream consumers would need.

## Findings

### P0

- None.

### P1

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:226-227` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:377-395` — verifier symbol matching is case-insensitive because both discovered symbols and expected symbols are normalized with `toLowerCase()` before comparison. That is the wrong contract for JS/TS identifiers and fully-qualified names, which are case-sensitive. A regression from `handleVerify` to `handleverify` would still pass the gold battery, so the verifier can miss real API/name drift instead of flagging it. Fix: compare exact `name` / `fqName` strings by default, or make case-folding an explicit opt-in rather than the hard-coded behavior.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:36-49` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:298-325` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:98-104` — failed probe records are under-specified before persistence. `ProbeResult` only retains `queryId`, `category`, `probe`, `matchedSymbols`, `missingSymbols`, `status`, and `reason`, so `handleCodeGraphVerify()` persists a result that omits the original `query`, `expected_top_K_symbols`, and `source_file:line` context called for by the iteration-012 partial-failure contract. That makes `last_gold_verification` harder to consume from `code_graph_status` or self-heal surfaces because a downstream reader cannot tell which battery row failed without reopening the asset file. Fix: include the original query metadata in each probe result, ideally preserving the battery field names (`id`, `query`, `expected_top_K_symbols`, `source_file:line`).

### P2

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:205-213` — unsupported v2 probe warnings are emitted once per query row, not once per battery load. The spec only requires “warning + ignore” behavior for pre-adapter v2 entries; under a mixed battery, the current implementation will spam identical warnings linearly with query count and bury the first actionable signal. Fix: emit a single battery-level warning that summarizes the affected query IDs or count.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/code-graph-gold-queries.json:1-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-012.md:28-46,61-64`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:103-104,136,204`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/implementation-summary.md:68,155`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:1-460`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:1-112`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-655,944`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:4-11`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:1-91`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:219-223,287-301`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:281-288`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts:99-323`

## Convergence Signals

- `loadGoldBattery()` does enforce the basic v1 battery envelope on the current asset: `schema_version === 1`, `pass_policy` object present with numeric floors, and `queries[]` entries must carry non-empty `id`, `category`, `query`, and `expected_top_K_symbols`.
- The read-only verify contract is implemented correctly on the handler path. Stale readiness returns `{ status: "blocked", readiness }`, `allowInlineIndex` defaults to `false`, and verification is only persisted when `persistBaseline === true`.
- `executeBattery()` does not let one bad probe abort the whole run by accident. A thrown query handler call or malformed JSON-in-text outline response is converted into a per-query `error` record and only stops the loop when `failFast` is explicitly enabled.
- I found no regression coverage for the case-sensitive match contract, the partial-failure payload shape, or the “warn once per battery” behavior. The existing verifier tests cover valid-schema load, blocked/ok handler responses, and optional persistence, but not those three edges.
