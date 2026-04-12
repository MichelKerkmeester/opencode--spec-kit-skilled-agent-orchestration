# Iteration 009: COMPARISON - LIFECYCLE

## Focus
COMPARISON - LIFECYCLE: Compare session/state management against our memory_context, generate-context.js, session bootstrap.

## Findings
### Finding 1: Modus boots a vault process, not a resumable session lifecycle
- **Source**: `external/cmd/modus-memory/main.go:30-94,96-105`; `external/internal/mcp/memory.go:7-39`; `external/internal/mcp/server.go:114-198`; `external/internal/mcp/vault.go:219-227`
- **What it does**: Modus resolves one vault root from flag/env/default, creates core directories, builds one in-memory index, registers 11 tools, and starts a stdio MCP loop. Its MCP initialize path only announces the tool surface, and its only built-in lifecycle/status tool is `vault_status`, which returns vault counts rather than any session/task recovery contract.
- **Why it matters for us**: Modus is process-and-vault scoped; Public is session-and-task scoped. Modus has no real analogue for `memory_context`, `session_resume`, or `session_bootstrap`.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus’s only session field is decorative, not an enforced partition
- **Source**: `external/internal/index/indexer.go:344-363`; `external/internal/index/facts.go:10-21,37-50,88-145`; `external/internal/vault/facts.go:339-376`
- **What it does**: Indexed facts may carry `session_tag`, defaulting to `session-1` when absent, but the fact store indexes only subject/predicate/value and scores only term overlap, confidence, and recency. `memory_store` does not write `session_tag` at all.
- **Why it matters for us**: There is no true session boundary in retrieval or storage. Public already does far more by threading `sessionId` through retrieval, dedup, and continuity logic.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Public’s trusted session lifecycle is a real control plane; Modus has no equivalent
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821-860,1221-1292,1352-1415,1434-1445`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385-435,1020-1076`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325-365`; `external/internal/mcp/server.go:114-198`; `external/internal/mcp/memory.go:7-39`
- **What it does**: Public resolves only server-managed session IDs, rejects mismatched callers, persists `session_state` with `spec_folder` and `current_task`, tracks inferred mode, and can inject attended working-memory items into resumed prompt context. Modus exposes no session token, no identity binding, and no resumed prompt-context surface.
- **Why it matters for us**: Public’s continuity model is explicit and guarded; Modus’s continuity is implicit in whatever markdown already exists in the vault.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Public’s resume/bootstrap path is compositional and fail-closed; Modus only offers raw vault health
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-332,400-597`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-126,163-350`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:104-167`; `external/internal/mcp/vault.go:219-227`; `external/internal/mcp/server.go:114-198`
- **What it does**: `session_resume` composes `memory_context(resume)`, code-graph status, CocoIndex availability, structural context, and cached continuity only when summary text, transcript identity, freshness, and scope all validate. `session_bootstrap` adds health, hints, and next actions. Modus has no comparable resume packet or cached-summary validator; `vault_status` is just counts.
- **Why it matters for us**: Public is already materially ahead on recovery lifecycle. Modus does not contribute a reusable bootstrap pattern here.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Modus’s write lifecycle is immediate markdown mutation, but it is not same-session freshness-safe
- **Source**: `external/internal/vault/vault.go:57-65,114-121`; `external/internal/vault/facts.go:339-376`; `external/internal/mcp/vault.go:143-162,347-379`; `external/internal/index/indexer.go:66-149,288-304,307-371`; `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:51-84,344-387,393-571`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:780-783,1066-1070,1852-2105`
- **What it does**: In Modus, `vault_write` and `memory_store` write markdown directly, but the searchable index is built at startup and queried in memory with no post-write refresh in the write path. Public’s `generate-context` flow is structured-input, path-validated, atomically written, post-reviewed, and immediately indexed.
- **Why it matters for us**: This is a lifecycle correctness gap, not just a style difference. Modus is simpler, but same-process writes can lag behind search until rebuild/restart. Public’s heavier save pipeline is justified for authoritative memory artifacts.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Modus treats recall as an implicit global write; Public’s two-timescale lifecycle is safer
- **Source**: `external/internal/mcp/vault.go:273-317,885-897`; `external/internal/vault/facts.go:160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:4-11,27-41,325-365`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:783-807,1434-1445`
- **What it does**: Modus `memory_search` asynchronously reinforces every returned fact, mutating confidence, stability, difficulty, `last_accessed`, and `access_count` on read. Public intentionally separates ephemeral session attention from long-term memory decay: resume retrieval disables long-term decay, while working-memory attention drives bounded prompt-context injection.
- **Why it matters for us**: The transferable idea is that recall events matter, but Modus implements that as implicit global mutation. For Public, any equivalent should be explicit and scoped.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `external/cmd/modus-memory/main.go`
- `external/internal/mcp/server.go`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/index/indexer.go`
- `external/internal/index/facts.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`

## Assessment
- New information ratio: 0.78
- Questions addressed: actual lifecycle boundary in Modus; whether session metadata is real or decorative; whether Modus has any bootstrap/resume analogue; write/search freshness coupling; recall-as-write behavior vs Public’s session attention model.
- Questions answered: Modus is vault-scoped rather than session-scoped; `session_tag` is not an enforced retrieval boundary; Modus has no equivalent to `session_resume` or `session_bootstrap`; direct markdown writes are not paired with live index refresh; Public’s explicit save and resume machinery is materially stronger; the only transferable lifecycle idea is “recall events matter,” but only with explicit scoping.

## Reflection
- What worked: Tracing the lifecycle from `main.go` into the MCP registry and then following the write/search paths exposed the real boundary quickly. Comparing that directly to Public’s `memory_context` -> `session_resume` -> `session_bootstrap` chain, plus `generate-context`’s workflow, made the differences concrete.
- What did not work: Broad searches for `session` inside Modus produced many near-misses (`session_tag`, mission `state/`, import context) that initially looked richer than they really are. The current phase packet also still lacks the newer deep-research reducer state files, so the comparison had to stay iteration-local.

## Recommended Next Focus
Investigate a system that combines **actor-scoped session continuity, explicit save workflows, and live post-write index freshness**, so the next comparison can separate “local markdown simplicity” from a genuinely strong lifecycle/control plane.


Total usage est:        1 Premium request
API time spent:         5m 33s
Total session time:     5m 59s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.9m in, 20.1k out, 2.8m cached, 8.3k reasoning (Est. 1 Premium request)
