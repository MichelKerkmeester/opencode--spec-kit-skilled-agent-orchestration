# Iteration 007

**Run Date:** 2026-04-26
**Dimension:** security
**Focus:** Sandbox + path traversal + network
**Verdict Snapshot:** CONDITIONAL

## Summary

- The packet hardened `code_graph_scan` and `detect_changes` with canonical `realpathSync()` workspace checks, but the new `code_graph_verify` surface does not inherit those same guards. That leaves one direct out-of-workspace indexing path and one direct arbitrary JSON-load path still open on the verifier entry point.
- Resolver hardening is also incomplete. Even when the scan root itself is canonicalized, the tsconfig loader will follow `extends` targets outside the packet root and read them, and the module resolver will probe alias targets outside the root with `statSync()`.
- I did not find a new network path in the reviewed files. Metadata persistence stays parameterized via `better-sqlite3` placeholders, edge-drift math smooths zeroes before `Math.log()`, and the new verifier logger writes to `stderr`, not `stdout`.

## Findings

### P0

- None.

### P1

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:72-78` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:332-407`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:134-142`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1862-1916` — `code_graph_verify` trusts caller-supplied `rootDir` and never applies the `realpathSync()` + workspace-prefix containment that `code_graph_scan` and `detect_changes` now enforce. The handler only does `resolve(args.rootDir ?? process.cwd())`, then passes that path into `ensureCodeGraphReady()`. If the caller sets `allowInlineIndex:true` — which the public schema exposes — the readiness helper will build a default indexer config for that path and `readFileSync()` matching source files under it. That means the new verifier tool can inline-index any readable tree outside the workspace, which defeats the sandbox parity this packet was supposed to establish. Fix: copy the same canonical workspace-boundary guard used in `scan.ts`/`detect-changes.ts` into `handleCodeGraphVerify()` before calling `ensureCodeGraphReady()`, and reject external roots regardless of `allowInlineIndex`.

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:88-96` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:463-508`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-657`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:300-301`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:157-214` — the new `batteryPath` argument is an unrestricted arbitrary-file read surface. The schema advertises `batteryPath` as a free-form string, the handler `resolve()`s it without containment checks, and `loadGoldBattery()` immediately `readFileSync()`s that path. Because the parsed query IDs / categories / expected symbols are reflected back in verifier results, a valid JSON file outside the packet can be exfiltrated through the response. When `persistBaseline:true`, the absolute `batteryPath` and derived result are then stored in `last_gold_verification` and echoed back later by `code_graph_status`, so the leakage becomes persistent. Fix: either remove `batteryPath` from the public tool surface or hard-validate it against a canonical allowlist such as the packet asset directory before reading or persisting it.

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1458-1474`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1500-1506`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1628-1638` — tsconfig resolver loading still allows outside-root traversal after the handler-level `rootDir` check. `resolveTsconfigExtendsPath()` accepts absolute paths and `../` escapes, `loadTsconfigSettings()` follows the first `extends`, and `parseTsconfigFile()` reads the resolved file with no `realpathSync()` containment check back to the scan root or workspace. A malicious repo-local `tsconfig.json` can therefore point `extends` at an external JSON file and make the scan read it during resolver setup. The same resolver path also lets alias targets and absolute import specifiers probe external files via `resolveModuleFile()` / `statSync()` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1550-1592`. Fix: canonicalize every resolved tsconfig / alias candidate and reject anything outside the approved root before `readFileSync()` or `statSync()` touches it.

### P2

- None.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:1-103`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:155-343`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-318`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:17-214`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:1-509`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:61-454`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1226-1655,1855-1931`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:117-130,198-225,287-301,413-475`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts:1-74`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:60-100`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-670`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:1-42`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:1-86`

## Convergence Signals

- The new verifier surface is the main security outlier. `scan` and `detect_changes` both enforce canonical workspace containment; `verify` currently does not.
- I did not find any new outbound network path in the 008 backend resilience changes. The reviewed code only touches filesystem, SQLite, child-process `git rev-parse`, and in-process query dispatch.
- SQL injection risk on the new metadata helpers looks contained: `get/set/clearCodeGraphMetadata()` use bound parameters, and the new persistence writes only `JSON.stringify(...)` payloads through placeholders.
- The new verifier logger does not leak into JSON-RPC stdout. `createLogger()` routes to `console.error`, so the v2-probe warning is a stderr diagnostic, not protocol corruption.
