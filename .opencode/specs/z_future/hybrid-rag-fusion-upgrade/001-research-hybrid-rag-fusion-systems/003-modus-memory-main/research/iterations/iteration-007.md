# Iteration 007: AGENT INTEGRATION

## Focus
AGENT INTEGRATION: Agent-agnostic patterns, passive capture, multi-agent safety, project scoping.

## Findings

### Finding 1: Modus’s “single Librarian / sole writer” model is documentation-only; the shipped MCP server does not enforce it
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:211-230`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:45-60,107-145,179-185`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83-88`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-38`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:143-162,343,379,856-897`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go:149-188`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1100-1183,1458-1493`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:218-281,456-493`
- **What it does**: README/docs say the Librarian is the only model allowed to write, but the actual server starts by registering the default 11-tool memory surface, including `vault_write`, `memory_store`, `memory_reinforce`, and `memory_decay_facts`. MCP `tools/call` passes only an argument map to handlers; there is no caller identity, role check, or write broker. By contrast, Public’s save path validates governed ingest, enforces scope, checks shared-space membership, and audits allow/deny decisions.
- **Why it matters for us**: The useful idea here is **write mediation**, not Modus’s implementation. In source, “single writer” is a prompt convention, so any connected client can mutate persistent state directly. Public already has the harder part: actual scope/governance enforcement.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: In Modus, search is a write-side effect, so one agent’s recall mutates shared memory for every other agent
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:273-317,343,885-897`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:296-300,454-457`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-533,771-802,1304-1320`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:83-116,145-181`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:157-199,205-258`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:962-973`
- **What it does**: `memory_search` merges fact hits, then asynchronously calls `go v.ReinforceFact(f.ID)` for every returned fact. In other words, retrieval is treated as a successful FSRS review and writes back `confidence`, `stability`, `difficulty`, `last_accessed`, and `access_count`. README explicitly frames the same vault as shared across multiple agents/clients. Public takes the opposite posture by default: `trackAccess` is opt-in, and passive query/citation/follow-on signals are shadow logging rather than guaranteed write-side mutation.
- **Why it matters for us**: For multi-agent memory, “read == write” is dangerous unless actor identity, audit, and scope are first-class. Modus’s pattern turns any retrieval agent into a global state mutator. That is especially weak given the earlier runtime-consistency bug: the write happens, but live search state does not refresh.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Modus’s only real project boundary is the vault root; inside a vault, everything is global
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:32-40,60-90,96-106`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:20-45,74-121`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:65-136,160-220`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:298-324`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:175-215,500-533,719-748`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:95-135`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:158-166,456-493`
- **What it does**: Modus lets you pick one vault directory via `--vault`/`MODUS_VAULT_DIR`, and `safePath()` prevents path traversal outside that root. But after that, indexing/search/listing are vault-wide: `Build()` scans all markdown under the vault, and search has no project/spec/user/agent/session/shared-space parameters. README confirms that team use relies on filesystem access control rather than built-in scope boundaries. Public already carries spec-folder routing plus tenant/user/agent/session/shared-space scope fields through save and search.
- **Why it matters for us**: The coarse “one vault per project” pattern is operationally simple, but it is much weaker than Public’s in-process scoping. Modus is a reminder that filesystem-root isolation is useful as a deployment boundary, not as sufficient retrieval governance.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Passive capture is mostly aspirational in source; the shipped server depends on explicit memory tool use
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83-88`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-38`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:119-160,181-258`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:11-220`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:157-199,205-258`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:962-973`
- **What it does**: The repo contains helper primitives for summarization, fact extraction, intent classification, briefing generation, and a separate learnings toolset, but the shipped entrypoint only exposes the stripped 11-tool memory surface. There is no default pipeline that observes agent work, extracts facts, and saves them automatically. Public already has passive query-flow, citation, and follow-on-tool telemetry channels even when no explicit save occurs.
- **Why it matters for us**: Modus should not be treated as evidence that passive capture is solved. In source, passive capture is mostly a design direction, not a live ingestion path.
- **Recommendation**: reject
- **Impact**: medium

### Finding 5: Modus’s dormant `learnings` subsystem is the strongest agent-agnostic idea in this repo
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:1-155,157-208,229-277,299-320`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:11-220`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83-88`
- **What it does**: Modus separates **operational learnings** from user facts: learnings are domain-tagged (`search`, `triage`, `code`, etc.), typed (`mistake`, `pattern`, `decision`, `correction`), severity-scored, prompt-renderable via `LoadForPrompt()`, and reinforce/deprecate over time. The subsystem is explicitly model-neutral (“accessible to every cartridge”), but the main server never registers these tools.
- **Why it matters for us**: This is a useful pattern for Public: keep user/project memory separate from cross-agent operating lessons, and make the latter easy to inject into system prompts. The good part is the partitioning model, not the current Modus wiring.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Modus has a good optional-sidecar shape for agent integration, but the implementation is hard-wired and the README overstates what ships
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:1-33,35-119`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:15-52`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-53,280-317`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:211-231,316-317`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:16-29,107-145`
- **What it does**: Retrieval enrichment is optional: if the Librarian is reachable, Modus expands queries through a local OpenAI-compatible HTTP endpoint at `http://127.0.0.1:8090`; if not, search falls back to direct BM25. That separation of “reasoner” vs “local retriever/rewriter” is sound. But the implementation is hard-coded to one localhost endpoint with one request shape, while README says search needs no LLM calls and uses a “local synonym map,” which is not what the source does.
- **Why it matters for us**: The pattern worth borrowing is **optional local query-rewrite sidecar with fail-open fallback**, not the hard-coded provider contract. Public already has richer internal routing; if we add agent-side query rewriting, it should be provider-pluggable and explicitly optional.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`

## Assessment
- **New information ratio**: 0.86
- **Questions addressed**: whether Modus really enforces a single-writer agent pattern; whether recall is a passive read or a state mutation; what the actual scope boundary is in multi-agent use; whether passive capture exists in shipped code; whether there is any reusable agent-neutral memory partition; whether the Librarian sidecar is truly agent-agnostic.
- **Questions answered**: Modus’s single-writer model is not enforced; shared-agent recall mutates global memory by default; vault-root selection is its only real project boundary; passive capture is mostly not implemented in the shipped server; the dormant learnings subsystem is the best reusable agent-neutral idea; the Librarian sidecar pattern is useful, but its current implementation is rigid and partially misdescribed in docs.

## Reflection
- **What worked**: Following the runtime entrypoint first (`main.go` -> `RegisterMemoryTools` -> concrete handlers) made the agent-integration story much clearer than reading the Librarian docs in isolation. Comparing the shipped Modus surface directly against Public’s scope/governance and passive-feedback code kept the analysis grounded in actual operational guarantees rather than architecture rhetoric.
- **What did not work**: The repo contains many adjacent concepts (missions, trust, distillation, learnings), but most are not part of the default 11-tool server, so broad searches initially overstated what actually ships. README claims around “sole writer” and “no LLM calls on the search path” also required careful source-first correction.

## Recommended Next Focus
Investigate a system that **actually enforces** delegated writes and actor-scoped memory boundaries, so the next comparison can separate the good “Librarian/broker” idea from prompt-only policy.


Total usage est:        1 Premium request
API time spent:         5m 28s
Total session time:     5m 53s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  3.0m in, 18.8k out, 2.8m cached, 8.8k reasoning (Est. 1 Premium request)
