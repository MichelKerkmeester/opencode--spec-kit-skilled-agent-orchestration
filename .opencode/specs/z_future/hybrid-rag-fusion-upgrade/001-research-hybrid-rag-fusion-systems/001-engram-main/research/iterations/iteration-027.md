# Iteration 027: DEVELOPER EXPERIENCE

## Focus
DEVELOPER EXPERIENCE: How easy is this system to set up, configure, debug, and maintain? What DX patterns should we steal for our memory system?

## Findings
### Finding 1: One-command runtime setup is Engram’s strongest DX advantage
- **Source**: `001-engram-main/external/README.md:35-58`; `001-engram-main/external/docs/AGENT-SETUP.md:27-36,111-122,147-158`
- **What it does**: Engram turns per-runtime integration into a productized install surface. The README gives one-line setup commands for Claude Code, OpenCode, Gemini CLI, Codex, and VS Code, while `engram setup opencode`, `engram setup gemini-cli`, and `engram setup codex` write the MCP registration plus the runtime-specific instruction files those clients need for compaction recovery and memory protocol loading.
- **Why it matters**: Public already has the underlying recovery and context machinery (`session_bootstrap`, `session_resume`, `session_health`, `memory_context`), but its setup story is comparatively fragmented across MCP tools, plugins, code-graph, CocoIndex, and `generate-context.js`. The DX lesson is to add a single setup/export layer per runtime that installs the right bootstrap instructions and default recovery path on top of the existing system.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Engram keeps runtime adapters thin and pushes memory semantics into the core product
- **Source**: `001-engram-main/external/docs/PLUGINS.md:13-37,48-57,76-120`
- **What it does**: The OpenCode and Claude plugins are transport adapters, not alternate memory engines. They auto-start the server, ensure sessions, inject the memory protocol, and wire compaction/session hooks, but the actual memory model still lives in the core store and MCP tools.
- **Why it matters**: This is the right maintenance shape for Public too. Public already has transport-owned recovery guidance in `session_bootstrap` and `session_resume`; the pattern to steal is thin, runtime-specific packaging around shared memory surfaces rather than duplicating continuity logic in every plugin or client integration.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Tool profiles plus explicit eager/deferred guidance make the MCP surface easier to learn
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:7-13,50-79,121-138,169-210,375-579`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:230-239,733-756`
- **What it does**: Engram explicitly separates `agent` versus `admin` tool profiles, supports `--tools=agent` or `--tools=admin`, and embeds server instructions that say which tools are core and always-in-context versus deferred. The tool descriptions themselves also teach usage patterns, including when to search, when to save, and when to close a session.
- **Why it matters**: Public exposes a much broader surface that includes orchestration, discovery, health, resume, graph, and indexing tools. That power is valuable, but it is harder to discover. Engram’s DX pattern worth stealing is not feature reduction; it is shipping an agent-safe profile or beginner bundle with opinionated guidance layered on top of the full Spec Kit Memory surface.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Engram’s direct session-summary and passive-capture tools are ergonomically simpler than Public’s save pipeline
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:460-579`; `.opencode/skill/system-spec-kit/scripts/README.md:104-118`; `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67`
- **What it does**: Engram exposes first-class MCP tools for end-of-session summaries and passive learning extraction, both with explicit schemas and usage guidance in the tool descriptions. Public’s current memory-save rule routes through `generate-context.js`, and even the internal loader guidance tells the agent to write structured JSON to `/tmp/save-context-data.json` before invoking the script.
- **Why it matters**: Public’s structured save path is safer and richer, but it is noticeably less ergonomic. The DX pattern to steal is a friendlier front door: a high-level session-summary or passive-capture surface that compiles down to `generate-context.js` internally, so the robust save contract stays intact without making every caller manage temp JSON files.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 5: Engram is unusually explicit about degraded modes, platform caveats, and debugging paths
- **Source**: `001-engram-main/external/docs/AGENT-SETUP.md:45-61,84-103`; `001-engram-main/external/docs/INSTALLATION.md:73-97,147-159`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:784-788`
- **What it does**: Engram repeatedly documents the fallback path: plugin versus bare MCP, Windows hook caveats, antivirus false positives, exact config-file locations, and when a user should choose the manual route instead of the full integration. Public already has stronger health and recovery machinery, and `context-server.ts` does emit structural bootstrap guidance, but the operational story is spread across more subsystems and documents.
- **Why it matters**: Debuggability is not only about runtime checks; it is also about reducing uncertainty during setup and recovery. Public should steal Engram’s habit of packaging the happy path and the fallback path together, ideally with a single setup/doctor document or command that points to `session_bootstrap`, `session_health`, `memory_health`, graph status, and CocoIndex status in one place.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Public should reject Engram’s hidden HTTP sidecar dependency as a DX model
- **Source**: `001-engram-main/external/docs/AGENT-SETUP.md:33-43`; `001-engram-main/external/docs/PLUGINS.md:22-35,102-113`
- **What it does**: Engram’s plugin-enhanced experience is not purely MCP stdio. For OpenCode and Claude plugin flows, the richer session-management path depends on an HTTP server process being available so the plugin can create sessions, import chunks, and inject continuity state.
- **Why it matters**: That requirement is acceptable in Engram because the product is intentionally centered around one binary and one local DB, but it is the wrong DX direction for Public. Public should keep strengthening transport-owned bootstrap and read-only health/status surfaces instead of introducing an extra daemon requirement just to make continuity work.
- **Recommendation**: reject
- **Impact**: high

## Assessment
- New information ratio: 0.53
- Fallback note: CocoIndex/semantic search was permission-blocked for this external path in-session, so this pass used targeted grep plus direct file reads.
- Packet note: writeback to the phase folder was permission-blocked, so this iteration is returned inline only.

## Recommended Next Focus
Compare Engram’s explicit session-summary/passive-capture ergonomics against Public’s current save contract and decide whether Public should add a profile-aware setup command plus a friendlier session-end save wrapper without weakening the existing structured memory pipeline.


Total usage est:        1 Premium request
API time spent:         5m 3s
Total session time:     5m 25s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.1m in, 16.3k out, 1.0m cached, 8.5k reasoning (Est. 1 Premium request)
 gpt-5.4-mini             159.4k in, 10.6k out, 142.8k cached, 3.3k reasoning (Est. 0 Premium
 requests)
