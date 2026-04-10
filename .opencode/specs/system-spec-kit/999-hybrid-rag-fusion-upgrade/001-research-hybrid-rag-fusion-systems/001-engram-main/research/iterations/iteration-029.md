# Iteration 029: ARCHITECTURE DECISION RECORD

## Focus
ARCHITECTURE DECISION RECORD: Document the key architectural decisions this system made and why. Which decisions should we adopt and which should we reject?

## Findings
### Finding 1: Agent/admin tool profile split is worth copying only as a delivery-layer bundle
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:38-80,121-138,160-167,169-210,375-619`
- **What it does**: Engram defines `ProfileAgent` and `ProfileAdmin`, resolves them through `ResolveTools()`, filters registration with `shouldRegister()`, and pairs that split with explicit core versus deferred tool guidance.
- **Why it matters**: Public's memory surface is broader and more capable than Engram's, so the win here is safer packaging and discoverability, not feature reduction.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Explicit session lifecycle plus durable session summaries is Engram's strongest architecture decision
- **Source**: `001-engram-main/external/internal/store/store.go:754-858,1613-1667`; `001-engram-main/external/internal/mcp/mcp.go:375-395,460-562`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:76-99,111-149`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:1-120`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:1-127,163-220`
- **What it does**: Engram persists sessions as first-class records, closes them with summaries, and formats recent sessions, prompts, and observations into startup context through `mem_session_start`, `mem_session_end`, `mem_session_summary`, and `mem_context`.
- **Why it matters**: Public already has stronger recovery machinery than Engram, but it lacks an equally thin lifecycle front door. We should adopt the ergonomics lesson without replacing `session_bootstrap`, `session_resume`, or trusted session handling.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Stable topic families are valuable, but Engram's raw upsert model is too lossy for Public
- **Source**: `001-engram-main/external/internal/store/store.go:948-1068,3201-3278`; `001-engram-main/external/internal/mcp/mcp.go:302-324`; `001-engram-main/external/docs/ARCHITECTURE.md:86-117`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:92-178`
- **What it does**: Engram uses `topic_key` families such as `architecture/`, `bug/`, and `decision/`, suggests keys from heuristics, and upserts later saves onto the latest matching observation while incrementing `revision_count`.
- **Why it matters**: The stable-thread idea is strong for evolving ADRs and research threads, but Public's markdown evidence and `generate-context.js` flow are richer than Engram's overwrite-first storage model.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Hygiene metadata should become a first-class operator scorecard in Public
- **Source**: `001-engram-main/external/internal/store/store.go:948-1068,1588-1608`; `001-engram-main/external/docs/ARCHITECTURE.md:86-95`
- **What it does**: Engram tracks `revision_count`, `duplicate_count`, `last_seen_at`, and `deleted_at` directly on observations and keeps soft-deleted rows out of normal search and context.
- **Why it matters**: Public already has better retrieval-quality signals than Engram, but it does not expose churn and hygiene as explicitly. We should add these as observability metrics, not as replacements for `quality_score`, validation, or ablation-based evaluation.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 5: Exact-key lexical shortcuts should be adopted, but Engram's lexical-first search model should not
- **Source**: `001-engram-main/external/internal/store/store.go:1462-1584,3382-3391`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-56,113-164`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-120`
- **What it does**: Engram checks direct `topic_key` matches before FTS5 when the query contains `/`, sanitizes FTS input with `sanitizeFTS()`, and then orders by `fts.rank`.
- **Why it matters**: Public should import the exact-handle lane for future thread keys and artifact names, but Engram's broader FTS-first retrieval would be a downgrade from Public's semantic-first hybrid architecture.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Engram's coarse `project` versus `personal` scope model should be rejected for Public
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:187-192,253-258,385-390`; `001-engram-main/external/internal/store/store.go:959-976,3166-3171`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-120`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:357-435`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:104-116,207-227`
- **What it does**: Engram normalizes scope to a flat `project` or `personal` boundary and keys saves and searches by normalized project plus that scope.
- **Why it matters**: Public already carries `tenantId`, `userId`, `agentId`, `sharedSpaceId`, and trusted `effectiveSessionId` enforcement. Collapsing that model to Engram's scope would weaken shared/private safety and auditability.
- **Recommendation**: reject
- **Impact**: high

### Finding 7: One-command runtime packaging is a real DX win we should adopt selectively
- **Source**: `001-engram-main/external/README.md:23-58`; `001-engram-main/external/docs/ARCHITECTURE.md:16-48`
- **What it does**: Engram packages one local memory backend behind MCP stdio and one-command runtime setup across multiple agent environments.
- **Why it matters**: Public should copy the setup/bootstrap packaging lesson so continuity and recovery are easier to install, but it should not collapse its broader memory, graph, and governance architecture into Engram's simpler product shape.
- **Recommendation**: adopt now
- **Impact**: medium

## Assessment
- New information ratio: 0.42

## Recommended Next Focus
Consolidate the accepted, proposed, rejected, and new-feature decisions into the final `research/research.md` synthesis, create `implementation-summary.md`, rerun strict validation in a write-enabled runtime, and save final phase context with `generate-context.js`.


Total usage est:        1 Premium request
API time spent:         12m 44s
Total session time:     13m 9s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.0m in, 57.7k out, 1.9m cached, 17.3k reasoning (Est. 1 Premium request)
