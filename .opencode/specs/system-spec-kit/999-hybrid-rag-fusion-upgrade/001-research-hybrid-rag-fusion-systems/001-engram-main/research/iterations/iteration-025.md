# Iteration 025: MULTI-AGENT MEMORY SAFETY

## Focus
MULTI-AGENT MEMORY SAFETY: How does this system handle concurrent agent access, merge conflicts, project isolation, and shared vs private memory scoping?

## Findings
### Finding 1: Engram’s concurrency safety is storage-level, not identity-level
- **Source**: `001-engram-main/external/internal/store/store.go:403-418`; `001-engram-main/external/internal/store/store.go:1988-2033`; `001-engram-main/external/internal/store/store.go:2560-2570`
- **What it does**: Engram enables SQLite `WAL` and `busy_timeout`, wraps writes in transactions via `withTx()`, and uses `AcquireSyncLease()` / `ReleaseSyncLease()` to serialize ownership of a sync target. That makes local multi-process writes and background sync coordination reasonably safe.
- **Why it matters**: This is good protection against concurrent writers stepping on each other at the DB/sync-worker layer, but it does not authenticate which agent is allowed to reuse which session or memory scope.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram’s durable scoping model is only `project` vs `personal`
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:187-192`; `001-engram-main/external/internal/mcp/mcp.go:253-258`; `001-engram-main/external/internal/mcp/mcp.go:385-390`; `001-engram-main/external/internal/store/store.go:959-976`; `001-engram-main/external/internal/store/store.go:3166-3171`
- **What it does**: MCP tools expose scope as `project` or `personal`, and `normalizeScope()` collapses everything except explicit `personal` back to `project`. Observation upserts and searches are then keyed by normalized project plus that flat scope.
- **Why it matters**: For solo or lightly coordinated agents, this is simple and predictable. For real shared/private memory safety, it is too coarse: there is no tenant, user, agent, session, or shared-space boundary.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Engram’s “merge” story is project-alias repair, not collaborative conflict resolution
- **Source**: `001-engram-main/external/internal/store/store.go:2455-2500`; `001-engram-main/external/internal/store/store.go:3174-3218`; `001-engram-main/external/internal/mcp/mcp.go:602-619`; `001-engram-main/external/internal/mcp/mcp.go:694-724`; `001-engram-main/external/internal/mcp/mcp.go:1140-1171`; `001-engram-main/external/internal/store/store_test.go:4281-4393`
- **What it does**: Engram normalizes project names on read/write, warns about similar project names, and offers admin-only `mem_merge_projects` to atomically collapse aliases like `Engram` and `engram-memory` into one canonical project.
- **Why it matters**: This is a useful hygiene mechanism for namespace drift, but it is not a semantic merge protocol for concurrent agents editing shared memory. It repairs labeling mistakes after the fact.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Spec Kit Memory already has a stronger session-safety model than Engram
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307-435`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1221-1238`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450-470`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1071-1143`
- **What it does**: Public rejects caller-supplied `sessionId` values unless they match a server-managed session with corroborated identity, returns `E_SESSION_SCOPE` on mismatches, and performs per-session retrieval deduplication plus atomic “mark sent” tracking.
- **Why it matters**: This directly addresses a multi-agent safety problem Engram does not solve: preventing one caller from reusing another caller’s continuity lane and preventing repeated re-surfacing within the same session.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public already has real shared/private collaboration governance; Engram does not
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:158-165`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:177-193`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:218-280`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:456-493`; `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:135-175`; `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:507-719`; `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:144-257`
- **What it does**: Public supports normalized tenant/user/agent/session/shared-space scope, deny-by-default shared-space membership, rollout and kill-switch controls, role-gated access, governance audit trails, and conflict recording with strategies like `append_version` and `manual_merge`, recorded under an `IMMEDIATE` transaction to avoid racey conflict counts.
- **Why it matters**: This is the correct layer for multi-agent shared vs private memory safety. Compared with Engram’s flat `project/personal` model, Public already has the stronger architecture for collaboration boundaries and conflict accountability.
- **Recommendation**: adopt now
- **Impact**: high

## Assessment
- New information ratio: 0.48
- Fallback note: CocoIndex was unavailable for this external path in-session, so this pass used targeted grep plus direct file reads.

## Recommended Next Focus
Trace true multi-writer remote-sync safety: compare Engram’s `sync_mutations` + lease model with Public’s governance, checkpoint, and shared-conflict surfaces to decide whether Public needs a first-class sync reconciliation layer.


Total usage est:        1 Premium request
API time spent:         3m 7s
Total session time:     3m 27s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.6m in, 12.3k out, 1.5m cached, 4.9k reasoning (Est. 1 Premium request)
