# Iteration 2 — Security

## Dimension

Security. Focus areas: cache corruption recovery, SIGTERM/SIGKILL behavior, MCP error envelopes, compat shim trust boundaries, plugin loader surface, stale/unavailable output guarantees, and authority boundaries.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/generation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`

## Findings — P0

None.

## Findings — P1

**DR-008-D2-P1-001: `skill_graph_scan` is a public MCP maintenance tool with no caller-authority check, so any caller that can invoke MCP tools can reindex and publish the skill graph generation.**

Evidence: the tool schema exposes `skill_graph_scan` as an L7 maintenance tool with only an optional `skillsRoot` argument and no authority/session/token field (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:673-681`). The central dispatch path validates schemas and calls the matching dispatcher, but it does not gate `skill_graph_scan` on caller trust (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:919-930`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1009-1013`; `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:97-108`). The skill graph dispatcher routes the tool directly to `handleSkillGraphScan()` (`.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:51-55`). The handler resolves a caller-supplied `skillsRoot`, only checks that it stays under `cwd`, then calls `indexSkillMetadata()` and publishes a live generation (`.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:29-48`).

Impact: this crosses the authority-token/session-id boundary in S7. A read-capable external MCP caller can trigger a mutable reindex and generation bump without going through a trusted daemon, CLI command, or lease-owned rebuild path. Under a compromised in-workspace skill source, the caller can also make attacker-controlled metadata authoritative for later advisor scoring. This is distinct from DR-008-D1-P1-001: the prior finding covers unavailable fail-open recommendation output; this one covers who is allowed to mutate graph authority in the first place.

Concrete fix: either remove `skill_graph_scan` from the public MCP tool list or require an explicit trusted caller context before dispatch. A robust fix would thread `callerContext` into maintenance tools and reject scan/rebuild calls unless the caller is a trusted local command/daemon owner, then add regression tests for untrusted rejection and trusted success.

## Findings — P2

**DR-008-D2-P2-001: SQLite corruption recovery is implemented as an isolated helper, but the live DB open/query paths do not proactively quick-check or invoke it.**

`initDb()` opens `skill-graph.sqlite`, enables WAL/foreign keys, creates schema, and returns the DB, but it does not run `PRAGMA quick_check` or call the recovery helper (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:181-201`). `rebuildFromSource()` can detect corruption with `checkSqliteIntegrity()` and rebuild after renaming/removing the corrupt DB (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts:31-56`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts:58-87`), but repository search found references only in its own module and tests, not in the live handlers/daemon. So corrupted/truncated SQLite is detected on failed DB operations, not proactively recovered by the authoritative daemon path.

**DR-008-D2-P2-002: The corruption rebuild helper is not concurrency-safe as written.**

`rebuildFromSource()` checks integrity, derives a timestamp suffix, then renames or removes the DB before calling the provided indexer (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts:61-87`). There is no generation lock, daemon lease, SQLite busy retry, or compare-and-swap guard around the corruption check and rename/remove window. Two recovery attempts can both observe corruption, race the same DB path, and one can fall into the remove path while the other is rebuilding. The normal watcher has busy retry for SQLite writes (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:111-123`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:407-413`), but the corruption rebuild helper does not reuse that boundary.

**DR-008-D2-P2-003: Several MCP/plugin diagnostic paths expose absolute filesystem paths or caller-controlled path details.**

The scan handler returns the resolved absolute `skillsRoot` on success and includes both the rejected absolute path and workspace `cwd` on escape rejection (`.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:30-37`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:50-52`). `advisor_status` returns raw caught error messages in `errors` (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:151-172`), and the generation lock failure message embeds the full lock path (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:87-88`). The plugin status tool also exposes `node_binary` and absolute `bridge_path` (`.opencode/plugins/spec-kit-skill-advisor.js:670-672`). I did not find prompt text leaking into these envelopes; the issue is filesystem/process detail leakage.

## Traceability Checks

| Protocol | Result | Notes |
|----------|--------|-------|
| S1 cache corruption recovery boundaries | partial | Integrity/rebuild helper exists, but live DB open/query paths do not call it and concurrent rebuild is not guarded. |
| S2 SIGKILL/SIGTERM paths | pass | Daemon SIGTERM calls `shutdown()`, publishes unavailable, closes watcher, and releases lease (`lifecycle.ts:72-107`); plugin subprocess timeout resolves after SIGTERM/SIGKILL via `close`/`error` handlers (`spec-kit-skill-advisor.js:400-475`). |
| S3 MCP error handling leak surface | partial | Prompt text was not found in error envelopes, but absolute/caller-controlled filesystem path details are exposed in scan/status/plugin diagnostics. |
| S4 compat shim trust boundaries | pass | Python fallback loads JSON/SQLite data with parsers, not dynamic code execution from graph metadata; daemon probe uses status freshness/PID evidence rather than a lock file alone (`daemon-probe.ts:48-63`, `skill_advisor.py:602-715`). |
| S5 plugin loader surface | pass | Bridge path is a static URL-relative import; cache key hashes prompt/options/source signature/workspace with SHA-256 (`spec-kit-skill-advisor.js:37-41`, `spec-kit-skill-advisor.js:157-170`). |
| S6 daemon authoritative output guarantees | pass | Direct MCP stale output includes `warnings`, and the brief renderer carries `Advisor: stale` to model-visible output (`advisor-recommend.ts:204-220`, `render.ts:111-158`). |
| S7 authority-token/session-id boundary | fail | `skill_graph_scan` is publicly listed and dispatched without a trusted-caller check before mutable reindex/generation publication. |

## Claim Adjudication Packets

### DR-008-D2-P1-001

- **Claim:** An external caller with MCP tool access can trigger skill graph reindex/generation publication without authority-token or trusted-session validation.
- **Hunter evidence:** `skill_graph_scan` is listed as a public tool with no auth field (`tool-schemas.ts:673-681`), central dispatch validates schema then dispatches (`context-server.ts:919-930`, `context-server.ts:1009-1013`; `tools/index.ts:97-108`), and the scan handler performs `indexSkillMetadata()` plus `publishSkillGraphGeneration()` after only a workspace path guard (`scan.ts:29-48`).
- **Skeptic check:** The scan path does prevent directory escape outside `cwd`, so this is not an arbitrary filesystem traversal finding. The issue is narrower: graph-authority mutation is available through the same MCP call surface as read tools.
- **Referee verdict:** Valid P1. This is a privilege-boundary failure for a mutable maintenance operation and should block release-readiness until the scan/rebuild surface is trusted-caller gated or removed from public MCP exposure.

## Verdict

CONDITIONAL for D2. No P0s found. One new P1 blocks security sign-off: the public MCP scan surface can mutate graph authority without caller trust. The SIGTERM/SIGKILL paths, static plugin loader path, prompt-safe label rendering, Python parser behavior, stale warning propagation, and daemon-probe stale-lock semantics had positive evidence. Remaining P2s should be fixed or explicitly accepted as operational hardening debt.

## Next Dimension

Traceability. Focus on spec/code/checklist alignment after the security pass: verify file-line evidence, path spelling, public tool authority claims, and stale/unavailable contract wording against shipped code.
