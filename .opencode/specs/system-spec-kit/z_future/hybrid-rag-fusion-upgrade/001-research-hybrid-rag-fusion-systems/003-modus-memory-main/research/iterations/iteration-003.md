# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

## Findings

### Finding 1: Modus exposes a very thin MCP transport: stdio JSON-RPC with only `initialize`, `tools/list`, and `tools/call`
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **What it does**: `Server.Run()` reads newline-delimited JSON from stdin and `handle()` only recognizes `initialize`, `notifications/initialized`, `tools/list`, and `tools/call`. The binary starts this server directly from `main.go` after building the in-memory index and registering tools. There is no inbound HTTP listener, no resource/prompt surface, no session bootstrap tool, and no orchestration layer comparable to Public’s `memory_context`, `session_bootstrap`, `code_graph_query`, or `code_graph_context`.
- **Why it matters for us**: This is a portability win for a single-purpose local binary, but it is a surface-area downgrade relative to Public’s retrieval/orchestration server. It is useful as a minimal transport reference, not as a model for Public’s primary MCP surface.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus has hidden profile separation in code, but the shipped binary hard-wires a single 11-tool profile
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
- **What it does**: `RegisterVaultTools()` defines a much larger tool family (`atlas_*`, `qm_*`, `distill_status`, plus memory/vault tools). `RegisterMemoryTools()` first calls `RegisterVaultTools()` and then destructively deletes every tool not in its 11-tool allowlist. `RegisterLearningsTools()` defines a separate `modus_learnings_*` family, but `main.go` never wires it. Separately, `docs/librarian.md` recommends a 6-tool “librarian” subset in agent config, but that subset is documentation-only, not a negotiated runtime profile.
- **Why it matters for us**: The codebase clearly wants multiple role-specific surfaces, but the implementation is manual, non-discoverable, and not caller-selectable. Public could benefit from explicit tool-profile projections, but Modus’s current approach is too brittle to copy directly.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: The only real API endpoints are outbound sidecar calls to the local Librarian model, not Modus-owned service endpoints
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- **What it does**: Modus hard-codes `http://127.0.0.1:8090` as the Librarian endpoint, probes `/health` with `/v1/models` fallback, and posts chat requests to `/v1/chat/completions`. `ExpandQuery()`, `RankResults()`, `ExtractFacts()`, `ClassifyIntent()`, and `ProduceBriefing()` all run through this local OpenAI-compatible sidecar, but none are exposed as MCP tools themselves. MCP callers only see higher-level tools whose behavior changes if `librarian.Available()` returns true.
- **Why it matters for us**: The useful pattern is “optional local lexical-expansion/rerank sidecar,” not the hard-coded localhost contract. Public could prototype an internal expander/reranker channel, but should keep it capability-checked, configurable, and traceable rather than ambient and endpoint-bound.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Tool registration and argument validation are loose enough that adopting Modus’s MCP schema pattern would weaken Public
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- **What it does**: Modus stores `InputSchema` as generic `interface{}` and passes raw `map[string]interface{}` into handlers. Validation is decentralized and uneven: many handlers use loose type assertions and defaults, while filesystem safety is enforced mostly by `vault.safePath()` on read/write/list operations. Public, by contrast, has centralized schema definitions, strict Zod validation, explicit `additionalProperties: false`, safe path validators, and governance/session fields baked into tool schemas.
- **Why it matters for us**: This is a material safety and operability gap. Public’s current tool layer is already stronger on input validation, scope governance, and explicit contracts; replacing it with Modus’s pattern would be regression, not simplification.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Modus search tools hide side effects and capability changes behind ambient conditions rather than explicit flags
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **What it does**: `vault_search` silently switches to librarian-expanded multi-query retrieval when the sidecar is reachable, otherwise falls back to direct search. `memory_search` silently spawns async `ReinforceFact()` calls for every returned fact. There are no per-call controls for disabling reinforcement, forcing plain lexical search, asking for provenance, selecting a presentation profile, or scoping session behavior. Public exposes those controls explicitly through `trackAccess`, `includeTrace`, `profile`, `sessionId`, intent routing, and governed scope fields.
- **Why it matters for us**: Search-as-read with hidden write side effects is risky for operators and harder to reason about in evaluations. Public’s explicit opt-in `trackAccess` model is materially safer and easier to benchmark than Modus’s always-on recall reinforcement.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Modus’s CLI is a real second operator surface, separate from MCP, and that split is one of the cleaner parts of the design
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- **What it does**: The binary has a tiny command surface: `version`, `health`, `doctor`, and `import khoj`, with `--vault` or `MODUS_VAULT_DIR` selecting the vault. `doctor` performs structural diagnostics over markdown files and `import khoj` handles migration into vault folders. This is separate from the MCP tool plane and clearly aimed at human operators or one-shot maintenance tasks.
- **Why it matters for us**: Public already has rich MCP health/status/index tools, but a thin human-facing CLI wrapper for common operator flows—health, validate, reindex, diagnose—could improve ergonomics for local maintenance and CI without changing core retrieval architecture.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`

## Assessment
- **New information ratio**: 0.87
- **Questions addressed**: MCP transport shape; CLI command surface; outbound API endpoints; tool registration mechanics; runtime profile separation; discoverability of hidden tools; validation strictness; implicit search side effects; comparison with Public’s orchestration/governance surface
- **Questions answered**: Modus only implements a minimal stdio MCP core; the shipped binary hard-wires the 11-tool memory profile; broader vault and learnings profiles exist in source but are not runtime-selectable; the only actual HTTP/API endpoints are outbound Librarian sidecar calls; tool contracts are looser than Public’s; Public already has the richer, safer, more explicit operator/retrieval surface

## Reflection
- **What worked**: Tracing `cmd/modus-memory/main.go` into `RegisterMemoryTools()` and then back out through `server.go` exposed the real runtime surface quickly. Comparing that to `tool-schemas.ts` made the contrast with Public’s explicit orchestration, governance, and profile controls very clear.
- **What did not work**: Searching for inbound HTTP APIs mostly surfaced a stale `CallTool` comment about HTTP reuse; there is no implemented HTTP server to analyze. The README and librarian docs describe multiple role shapes, but source code shows those are only partially realized.

## Recommended Next Focus
Trace **runtime freshness and mutation semantics across tool calls**: whether `memory_store`, `vault_write`, `memory_reinforce`, and decay/archive operations ever invalidate or rebuild the in-memory BM25/fact/cross-ref state, how long the read-your-write gap lasts in practice, and whether any CLI path repairs stale MCP-visible state.


Total usage est:        1 Premium request
API time spent:         3m 8s
Total session time:     3m 26s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  840.3k in, 12.1k out, 703.0k cached, 4.4k reasoning (Est. 1 Premium
 request)
