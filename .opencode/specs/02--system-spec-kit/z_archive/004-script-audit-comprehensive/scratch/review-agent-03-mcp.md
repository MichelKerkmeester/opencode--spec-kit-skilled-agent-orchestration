# Review Adjudication C03: MCP Server

## Inputs
- **Context audit**: `scratch/context-agent-03-mcp-server.md` (10 findings, 82% confidence)
- **Build verification**: `scratch/build-agent-03-mcp-verify.md` (7 findings verified)

## Adjudication Summary

Two independent passes—one exploratory context scan, one targeted build verification—audited the MCP server (`mcp_server/`). Agreement is high on 5 of 7 cross-checked findings. Two findings were correctly refuted by the build agent with source evidence. Three context-agent findings (C03-F005, C03-F009, C03-F010) were not cross-checked by the build agent; they stand as unverified observations at their original severity.

**Reliability Score: 78 / 100**

| Factor | Score | Justification |
|---|---|---|
| Cross-agent agreement | 5/7 confirmed or likely (71%) | Strong convergence on confirmed items |
| Refutation quality | 2 findings cleanly disproven with code evidence | Raises trust in surviving findings |
| Source verification (reviewer) | Spot-checked 6 source locations; all matched claims | Evidence is traceable |
| Coverage gap | 3 findings unverified by build agent; handler internals unaudited (~15-20 calls remaining per context agent) | Partial coverage lowers ceiling |
| Overall | 78 | High confidence on confirmed items; moderate on unverified |

## Prioritized Findings

### P0 — Blockers (0)

No P0 blockers. The single "Critical" finding (C03-F001) is confirmed but classified P1 because it degrades diagnostics rather than causing data loss, security breach, or hard runtime failure. The error path returns a structured JSON envelope (code E040, recovery hints); the gap is *quality* of diagnostics, not absence of error handling.

### P1 — Required Fixes (3)

**P1-1: Unknown-tool dispatch diagnostics are generic (C03-F001) — CONFIRMED**
- Context agent: Critical. Build agent: **confirmed** with runtime reproduction.
- Reviewer verification: `context-server.ts:139-142` dispatches, falls through to `throw new Error("Unknown tool: ${name}")`, caught at `:198-206` and wrapped via `buildErrorResponse()`. Error code defaults to `E040` (SEARCH_FAILED) — semantically wrong for a dispatch miss. No `requested_tool` or `available_tools` in envelope.
- Evidence: `context-server.ts:139-142`, `lib/errors/core.ts:238`, build-agent reproduction output.
- **Impact**: Operators triaging dispatch failures need manual source inspection; incorrect error code misleads automated monitoring.
- **Action**: Add dedicated `E0XX` code for unknown-tool dispatch; include `requested_tool` and `available_tools` metadata in error envelope.

**P1-2: Embedding readiness race on cold start in lazy mode (C03-F003) — LIKELY**
- Context agent: High. Build agent: **likely** with code trace.
- Reviewer verification: `context-server.ts:473-478` marks embedding ready immediately in lazy mode (no actual model probe). `memory-search.ts:598-604` has a readiness gate but it was already pre-set to `true`.
- Evidence: `context-server.ts:473-478`, `handlers/memory-search.ts:598-604`, `handlers/memory-save.ts:557-569`.
- **Impact**: First embedding-dependent calls after cold start may hit uninitialized model, causing transient failures or silent deferred indexing.
- **Action**: Gate first embedding-dependent call on actual provider-ready probe; don't conflate "lazy mode enabled" with "model ready".

**P1-3: Startup remediation references non-existent rebuild script (C03-F008) — CONFIRMED**
- Context agent: Medium. Build agent: **confirmed** (script path absent).
- Reviewer verification: `startup-checks.ts:37-38` hardcodes `bash scripts/setup/rebuild-native-modules.sh`. Glob for `rebuild-native-modules*` under `mcp_server/` returns zero results.
- Evidence: `startup-checks.ts:37-38`, glob result (no file found).
- **Impact**: Users hitting native module mismatch get a dead-end remediation path. Upgraded to P1 because this is the *only* remediation offered for a critical startup failure scenario.
- **Action**: Guard with `fs.existsSync()` before recommending; provide `npm rebuild` fallback.

### P2 — Suggestions (5)

**P2-1: Auto-surface failure is silent to clients (C03-F006) — CONFIRMED**
- Both agents agree. `context-server.ts:122-127` logs failure; `:192-195` injects context on success only. No `meta.autoSurface.status` flag on failure path.
- Evidence: `context-server.ts:122-127`, `context-server.ts:192-195`.
- Impact: Clients cannot detect degraded context surfacing. Low urgency—feature is supplementary.

**P2-2: Handler-level argument validation is inconsistent (C03-F004) — LIKELY**
- Both agents agree validation is handler-dependent. Entry point does length-only check (`:114-116`). Some handlers (e.g., `memory_search`) do strong local validation; coverage across all 22 tools is unverified.
- Evidence: `context-server.ts:114-116`, `handlers/memory-search.ts:562-564`.
- Impact: Inconsistent error quality per tool. Low urgency—no confirmed runtime failure from this gap.

**P2-3: Packaging/entrypoint robustness (C03-F005) — UNVERIFIED**
- Context agent only (Medium). Not cross-checked by build agent. Generic concern about shebang/permission state.
- Evidence: `package.json:12` (context agent claim only).
- Impact: Theoretical integration risk outside standard npm workflows.

**P2-4: Tool description payloads oversized in source (C03-F009) — UNVERIFIED**
- Context agent only (Medium). Maintainability concern, not a runtime issue.
- Evidence: `tool-schemas.ts:23`, `tool-schemas.ts:47` (context agent claim only).

**P2-5: Import hygiene (C03-F010) — UNVERIFIED**
- Context agent only (Low). Lint enforcement gap.
- Evidence: `context-server.ts:45-62` (context agent claim only).

### Resolved / Dismissed (2)

**DISMISSED: C03-F002 — Schema/dispatch parity gap → NOT REPRODUCIBLE**
- Build agent demonstrated exact 22/22 parity with reproduction script. Test suite also asserts coverage (`tests/context-server.vitest.ts:289-306`).
- Verdict: No current risk. Retain existing test as regression guard.

**DISMISSED: C03-F007 — Shutdown cache cleanup missing → NOT REPRODUCIBLE**
- Build agent identified `toolCache.shutdown()` in all three termination handlers (SIGTERM `:327-336`, SIGINT `:342-351`, uncaughtException `:357-364`).
- Reviewer verification: Confirmed all three paths include `toolCache.shutdown()`.
- Verdict: Cleanup is correctly wired. Original finding was inaccurate.

## Top Actions

1. **Add dedicated unknown-tool error code and dispatcher metadata** — Replace generic `E040` with a dispatch-specific error code; include `requested_tool` and `available_tools` in the error envelope. (P1-1)
2. **Fix embedding readiness semantics in lazy mode** — Gate first embedding-dependent operation on an actual provider-ready probe instead of pre-setting `ready=true` at startup. (P1-2)
3. **Guard rebuild-script remediation with existence check** — Add `fs.existsSync()` before recommending the rebuild script path; provide `npm rebuild` as fallback. (P1-3)
