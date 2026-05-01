# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

## Findings

### Finding 1: Engram's profile split is compatible only as a delivery-layer bundle, not as a contraction of Public's broader MCP surface
- **Source**: Engram profile allowlists and deferred/eager registration [SOURCE: `001-engram-main/external/internal/mcp/mcp.go:38-167`; `001-engram-main/external/internal/mcp/mcp.go:399-619`]; Public MCP tool surface and routing hints [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-720`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:784-809`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:983-987`]
- **What it does**: Engram separates agent-facing and admin-facing tools, then reinforces that split with eager/deferred instructions. Public already exposes a larger orchestrated surface: `session_resume`, `session_bootstrap`, `code_graph_query`, `code_graph_context`, and CocoIndex maintenance/status tools alongside memory tools.
- **Why it matters**: The reusable idea is packaging and discoverability, not feature reduction. A literal Engram-style allowlist would make Public easier to learn, but it could also hide the structural and semantic tools that give Public its edge over a memory-only MCP server.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 2: Engram-style session lifecycle is compatible only as an additive digest inside `session_resume` and `session_bootstrap`
- **Source**: Engram context/session tools and formatter [SOURCE: `001-engram-main/external/internal/mcp/mcp.go:375-395`; `001-engram-main/external/internal/mcp/mcp.go:460-595`; `001-engram-main/external/internal/store/store.go:1613-1667`]; Public composite resume/bootstrap payloads [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400-597`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163-250`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`]
- **What it does**: Engram exposes recent sessions, prompts, and observations through `mem_context`, plus explicit lifecycle tools like `mem_session_start`, `mem_session_end`, and `mem_session_summary`. Public already composes memory, code-graph state, CocoIndex availability, structural trust, and transport guidance into `session_resume` and `session_bootstrap`.
- **Why it matters**: A bounded recent-session digest is still worth borrowing, but only if it stays subordinate to Public's existing authority surfaces. A parallel Engram-style lifecycle front door would create conflicting startup instructions and duplicate the system that already fuses recovery across memory, graph, and semantic search.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: An exact thread-key lane is highly compatible, but only as a fast path ahead of Public's hybrid and structural routers
- **Source**: Engram topic-key indexing and direct lookup before FTS [SOURCE: `001-engram-main/external/internal/store/store.go:572-577`; `001-engram-main/external/internal/store/store.go:1462-1583`]; Public hybrid channel router and structural routing nudges [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-72`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:113-163`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:251-259`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:292-323`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:794-799`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-664`]
- **What it does**: Engram checks exact `topic_key` matches first when the query looks key-like, then falls back to FTS. Public already routes queries across vector/FTS/BM25/graph/degree channels and separately nudges structural questions toward `code_graph_query` and semantic concept exploration toward CocoIndex-backed flows.
- **Why it matters**: A future `thread_key` lookup can be a cheap compatibility win because it trims work for exact artifacts, stable threads, and session-summary lookups. The conflict appears only if that lexical fast path expands too far and starts capturing questions that should go to CocoIndex or code-graph instead.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 4: Engram's runtime setup ergonomics fit Public well, but adapters must stay thin because Public already centralizes transport and recovery logic
- **Source**: Engram one-command runtime setup and thin plugin behavior [SOURCE: `001-engram-main/external/README.md:45-58`; `001-engram-main/external/docs/AGENT-SETUP.md:27-35`; `001-engram-main/external/docs/AGENT-SETUP.md:69-82`; `001-engram-main/external/docs/AGENT-SETUP.md:111-123`; `001-engram-main/external/docs/AGENT-SETUP.md:147-158`; `001-engram-main/external/docs/PLUGINS.md:13-57`]; Public server instructions and transport plan [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741-811`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:558-596`]
- **What it does**: Engram productizes installation with runtime-specific `setup` commands that write MCP registration, protocol instructions, and compaction-recovery prompts. Public already has the right core pieces: dynamic server instructions, structural bootstrap guidance, tool-routing hints, and an OpenCode transport plan emitted from `session_resume`.
- **Why it matters**: This is the cleanest compatibility improvement for Public's MCP stack. The right move is to export the existing Public recovery/routing contract through one-command runtime setup, not to fork those semantics into per-runtime plugins or introduce a daemon-centric architecture.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 5: Engram's literal `mem_context`-first compaction recovery pattern should be rejected for Public's multi-tool stack
- **Source**: Engram plugin recovery flow [SOURCE: `001-engram-main/external/docs/PLUGINS.md:31-57`; `001-engram-main/external/docs/PLUGINS.md:102-119`]; Public structural bootstrap and routing contract [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:251-259`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:317-323`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:783-809`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:983-987`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194-209`]
- **What it does**: Engram tells agents to recover from compaction by calling `mem_context` and then continuing under the memory protocol. Public's recovery path is intentionally broader: `session_bootstrap` and `session_resume` expose structural readiness, graph freshness, CocoIndex availability, and explicit routing to `code_graph_query` or semantic search.
- **Why it matters**: Copying Engram's recovery text literally would flatten Public's richer retrieval stack back into memory-only recovery. That would make startup continuity simpler, but wrong: agents could recover memory and still miss stale graph state, absent CocoIndex, or the need to route structural questions away from Grep.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- `001-engram-main/external/internal/mcp/mcp.go:38-167`
- `001-engram-main/external/internal/mcp/mcp.go:375-395`
- `001-engram-main/external/internal/mcp/mcp.go:399-619`
- `001-engram-main/external/internal/store/store.go:572-577`
- `001-engram-main/external/internal/store/store.go:1462-1583`
- `001-engram-main/external/internal/store/store.go:1613-1667`
- `001-engram-main/external/README.md:45-58`
- `001-engram-main/external/docs/AGENT-SETUP.md:27-35`
- `001-engram-main/external/docs/AGENT-SETUP.md:69-82`
- `001-engram-main/external/docs/AGENT-SETUP.md:111-123`
- `001-engram-main/external/docs/AGENT-SETUP.md:147-158`
- `001-engram-main/external/docs/PLUGINS.md:13-57`
- `001-engram-main/external/docs/PLUGINS.md:102-119`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-72`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:113-163`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:641-930`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163-250`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400-597`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:209-323`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741-811`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:983-987`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-720`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`

## Assessment
- **New information ratio**: 0.43
- **Questions addressed**: tool-profile compatibility; session-lifecycle compatibility; exact-key/thread-key fit with hybrid routing; runtime setup fit with MCP stack; compaction conflict with code-graph and CocoIndex recovery
- **Questions answered**: where Engram bundles map cleanly onto Public; where literal Engram patterns would conflict with `session_bootstrap` authority; how exact-key search can complement hybrid routing; how runtime setup should wrap existing transport/recovery logic; which recovery pattern to reject outright
- **Novelty justification**: Earlier iterations ranked patterns in isolation; this pass established the concrete compatibility boundary between Engram's memory-only MCP ergonomics and Public's existing semantic, structural, and orchestration layers.

## Ruled Out
- Literal agent/admin tool reduction that hides `code_graph_query`, `code_graph_context`, or CocoIndex maintenance behind a memory-only profile, because that would erase core routing surfaces Public already depends on.
- A second independent `mem_context`-style startup authority parallel to `session_resume` / `session_bootstrap`, because it would create contradictory recovery paths and trust semantics.
- Copying Engram's post-compaction instruction verbatim ("call `mem_context` and continue"), because Public needs composite recovery that checks graph freshness and semantic-search readiness before routing follow-up work.

## Reflection
- **What worked**: Comparing Engram's MCP registration and plugin docs directly against Public's `session_resume`, `session_bootstrap`, `context-server`, and tool schemas made the compatibility boundary obvious because all routing authority is encoded in a few high-signal files.
- **What did not work**: CocoIndex semantic code search was unavailable in this environment (`Permission denied and could not request permission from user`), so the comparison had to fall back to direct source reads and targeted grep instead of live semantic traversal.
- **What I would do differently**: Build a compact crosswalk table first — Engram tool/profile/setup concept on one side, Public orchestration/semantic/structural surface on the other — to speed up future conflict-analysis passes.

## Recommended Next Focus
IMPLEMENTATION COMPATIBILITY PLAN: define the minimal delivery-layer changes that can ship without authority drift — profile-aware packaging, additive recent-session digest fields, exact-thread-key routing gates, and one-command runtime setup that exports Public's existing bootstrap/routing contract unchanged.


Total usage est:        1 Premium request
API time spent:         4m 30s
Total session time:     4m 49s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.0m in, 20.1k out, 954.1k cached, 7.4k reasoning (Est. 1 Premium request)
