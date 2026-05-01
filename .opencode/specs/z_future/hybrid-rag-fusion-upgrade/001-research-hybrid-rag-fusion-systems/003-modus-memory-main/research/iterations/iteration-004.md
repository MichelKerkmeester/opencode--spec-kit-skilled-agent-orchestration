# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings

### Finding 1: Modus has no first-class session object; a “session” is just process startup plus a disk-backed vault snapshot
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: `main.go` resolves the vault path, creates a few directories, rebuilds the in-memory index, registers tools, and enters the stdio MCP loop. `server.go` only handles `initialize`, `notifications/initialized`, `tools/list`, and `tools/call`; it does not mint session IDs, persist client state, or expose resume/bootstrap/close semantics. By contrast, Public’s `memory_context` resolves trusted server-managed sessions and persists lifecycle state through `session-manager.ts`.
- **Why it matters for us**: Modus’s cross-chat continuity comes from durable files, not session lifecycle management. That is simpler, but it is not a substitute for Public’s explicit session continuity surface (`memory_context`, `session_resume`, `session_bootstrap`, trusted `sessionId`, saved state).
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Live-session maintenance is snapshot-based, so Modus does not really “learn during the current session” without restart
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: `index.Build()` creates an in-memory `Index` and fact store once at startup. During a session, `memory_search` asynchronously calls `ReinforceFact`, while `StoreFact`, `DecayFacts`, `ArchiveStaleFacts`, and `TouchFact` all mutate markdown on disk. But subsequent search still reads the old in-memory snapshot because there is no hot reload, invalidation, or rebuild in the running process.
- **Why it matters for us**: For session lifecycle, this means Modus’s memory state does not evolve coherently inside a live conversation. Public’s model is materially stronger because it treats session continuity and retrieval state as active managed state, not just files that will matter after restart.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: The only session-like metadata is mostly non-operative, and one of its freshness signals is broken
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: Modus projects `session_tag` into `MemFact.SessionTag`, but only while indexing; if missing, `indexer.go` defaults it to `"session-1"`. `StoreFact()` does not write a `session_tag`, and no MCP tool exposes session-scoped filtering or retrieval. Separately, `StoreFact()` writes `created: "now"`, while `recencyBoost()` and `Tier()` expect ISO/date strings, so newly stored facts can miss “hot/warm” treatment and fall back to neutral/cold handling.
- **Why it matters for us**: This is not enough structure to support session creation, session-local recall, or accurate “recent conversation” prioritization. Public already has explicit lifecycle metadata like trusted `sessionId`, `effectiveSessionId`, `resumed`, event counters, `contextSummary`, and `pendingWork`; Modus’s passive metadata is too weak to borrow directly.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Modus has summarization helpers, but no actual end-of-session or resume-summary pipeline wires them in
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: `SummarizeForCloud()` can compress search hits, and `ProduceBriefing()` can generate a five-bucket briefing from ingested items plus active missions. But there are no call sites for either helper in the shipped runtime, and `server.go` simply exits on EOF without any session-finalization hook. Public, by contrast, has cached continuity summaries in `session-resume.ts`, a one-call recovery tool in `session-bootstrap.ts`, and checkpoint generation in `session-manager.ts`.
- **Why it matters for us**: The useful idea is not Modus’s current lifecycle, because there effectively isn’t one. The transferable part is the **shape** of `ProduceBriefing()` as a structured end-of-cycle summary format that Public could test as an alternate session-summary profile.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Modus’s strongest “context survival across sessions” idea is the learnings subsystem, but it is dormant in the shipped binary
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- **What it does**: The learnings subsystem is explicitly designed to persist “console-level” operational lessons across model swaps and format them for prompt injection via `LoadForPrompt()`. But `main.go` never calls `RegisterLearningsTools()`, so none of that cross-model continuity is available from the runtime that users actually launch.
- **Why it matters for us**: This is the clearest Modus-side attempt at continuity beyond raw fact recall: a separate, reusable memory plane for durable operator guidance. Public could consider a similarly explicit “operational learnings” channel, but only if it is truly first-class and not hidden behind unwired code.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Multi-client continuity in Modus is shared-file persistence, not isolated session continuity
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: The README says each AI client starts its own Modus process against the same vault, with index rebuild on startup and “last writer wins” at the file level for concurrent writes. That matches the code architecture: no shared session registry, no per-client isolation, and no recovery contract beyond reopening the vault and rebuilding the snapshot.
- **Why it matters for us**: This is fine for lightweight portability, but it is a poor fit for Public’s richer session semantics, where separate sessions can be trusted, resumed, checkpointed, completed, interrupted, and garbage-collected explicitly.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`

## Assessment
- **New information ratio**: 0.84
- **Questions addressed**: session creation; what counts as a session in Modus; live-session maintenance after recall/write; session-ending behavior; end-of-cycle summarization; cross-model continuity; multi-client continuity; comparison with Public’s explicit session lifecycle
- **Questions answered**: Modus does not implement first-class sessions; continuity across chats comes from persisted markdown plus startup reindex, not resume state; session metadata is mostly passive and partly broken; no session-end summary pipeline is wired; the learnings subsystem is the strongest continuity idea but is dormant; Public already has materially stronger lifecycle primitives

## Reflection
- **What worked**: Treating “session lifecycle” as a code-path question instead of a README question exposed the real pattern quickly: startup, snapshot, file writes, exit. Tracing unused helpers (`ProduceBriefing`, `LoadForPrompt`) was especially useful because it separated intended continuity features from shipped ones.
- **What did not work**: The phase folder did not contain the expected deep-research state files, so I had to use prior iteration artifacts plus direct source tracing instead of reducer-managed state. Broad repo-wide session searches were also noisy until narrowed to runtime entrypoints and fact/index paths.

## Recommended Next Focus
Trace **client-side continuity expectations and ingestion timing**: whether Modus assumes the MCP client or agent prompt is responsible for calling `memory_store`, choosing when to recall, and compensating for the lack of server-side session resume/summarization, and whether any unwired docs/configs reveal an intended lifecycle contract that never made it into runtime.


Total usage est:        1 Premium request
API time spent:         4m 22s
Total session time:     4m 40s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.7m in, 16.9k out, 1.6m cached, 6.7k reasoning (Est. 1 Premium request)
