# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: classify the Engram ideas into **2 adopt-now**, **4 prototype-later**, **1 new-feature-needed**, and **2 reject**. Executive summary: keep Public’s stronger trust, scope, hybrid retrieval, and spec-folder authority; borrow only the lighter ergonomics around tool surfacing, deterministic recent-context formatting, and optional thread/timeline affordances.

## Findings

### Finding 1: Agent-safe tool-profile bundles are worth borrowing, but only as wrapper-level bundles over Public’s existing layers
- **Source**: `external/internal/mcp/mcp.go:50-166`, `external/docs/ARCHITECTURE.md:52-71`, `mcp_server/context-server.ts:755-807`
- **What it does**: Engram defines `ProfileAgent` and `ProfileAdmin`, expands them through `ResolveTools()`, gates registration with `shouldRegister()`, and documents eager core tools vs deferred tools. Public currently publishes key tools in server instructions, but not a comparable profile resolver.
- **Why it matters for us**: This is a real usability win for agent-agnostic integrations because it reduces tool clutter without changing storage semantics. The safe port is profile-aware surfacing, not a new authority model underneath.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Public should add a deterministic recent-session digest inside bootstrap/resume
- **Source**: `external/internal/mcp/mcp.go:375-395`, `external/internal/store/store.go:1613-1667`, `mcp_server/handlers/session-resume.ts:400-435`, `mcp_server/handlers/session-bootstrap.ts:163-205`
- **What it does**: Engram’s `mem_context` is a fixed formatter over recent sessions, prompts, and observations. Public’s `session_resume` and `session_bootstrap` are richer, but heavier composite flows.
- **Why it matters for us**: Engram’s formatter is weaker overall, but more predictable. A cheap recent-session digest inside Public’s existing resume/bootstrap path would improve startup clarity without sacrificing graph/CocoIndex/status data.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: Stable topic threads are useful, but only as explicit thread metadata plus explicit exact lookup
- **Source**: `external/internal/mcp/mcp.go:302-324`, `external/internal/store/store.go:948-1069`, `external/internal/store/store.go:1462-1519`, `external/internal/store/store.go:3201-3312`, `scripts/dist/memory/generate-context.js:85-95`, `scripts/dist/memory/generate-context.js:338-340`, `mcp_server/handlers/save/markdown-evidence-builder.ts:95-175`
- **What it does**: Engram’s `topic_key` flow upserts evolving observations, increments `revision_count`, and gives slash-form exact matches a direct lookup path ahead of FTS ranking. Public’s durable save path is spec-folder/markdown/JSON centered and does not expose a first-class thread key lane.
- **Why it matters for us**: There is product value in stable threads for long-lived decisions, bug lines, and repeated refinements. But the safe port is an explicit `thread_key` or similar metadata field plus opt-in exact lookup, not an implicit ranking override.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: The cheapest immediate guardrail is to keep Public’s fail-closed trusted-session policy
- **Source**: `external/internal/mcp/mcp.go:728-730`, `external/internal/mcp/mcp.go:867-869`, `external/internal/mcp/mcp.go:1046-1048`, `external/internal/mcp/mcp.go:1114-1117`, `mcp_server/lib/session/session-manager.ts:385-430`, `mcp_server/handlers/memory-context.ts:1221-1238`, `mcp_server/handlers/memory-triggers.ts:207-227`
- **What it does**: Engram’s save/prompt/session-summary handlers call `CreateSession()` opportunistically and do not enforce trusted identity the way Public does. Public validates caller-supplied session IDs against server-managed identity before allowing reuse.
- **Why it matters for us**: This is the easiest place to regress. Public’s session identity also gates dedup, working memory, and recovery, so copying Engram’s permissive auto-create behavior would weaken multiple subsystems at once.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Direct `mem_session_start` / `mem_session_end` should stay off Public’s main roadmap
- **Source**: `external/internal/mcp/mcp.go:515-562`, `external/internal/store/store.go:754-804`, `mcp_server/handlers/session-resume.ts:479-488`, `mcp_server/handlers/session-bootstrap.ts:168-205`
- **What it does**: Engram exposes first-class lifecycle tools backed by session rows and treats missing-session end as effectively harmless. Public already treats `session_resume` / `session_bootstrap` as the trusted continuity surface.
- **Why it matters for us**: Adding a second first-class lifecycle authority would create split ownership between explicit open/close calls and current bootstrap/resume logic. That would make recovery harder to reason about, not easier.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Passive capture is valuable only as a governed, transactional side lane
- **Source**: `external/internal/mcp/mcp.go:565-595`, `external/internal/store/store.go:3411-3536`, `scripts/dist/memory/generate-context.js:85-95`, `scripts/dist/memory/generate-context.js:338-340`, `mcp_server/lib/enrichment/passive-enrichment.ts:151-209`, `mcp_server/lib/governance/scope-governance.ts:218-247`
- **What it does**: Engram extracts the last matching “Key Learnings” section, filters bullet/numbered items, dedupes by normalized hash, and saves each item in a loop through `AddObservation()`. Public’s current passive enrichment is non-durable, while durable ingest expects provenance/governance.
- **Why it matters for us**: This is a real gap for subagent closeout and long-task extraction. But Engram’s implementation is too light on provenance and too non-atomic for Public; if we build it, it should be transactional or explicitly resumable and clearly lower-trust than `generate-context`.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 7: Borrow Engram’s hygiene ideas selectively, but do not adopt project-merge as a primary repair model
- **Source**: `external/internal/store/store.go:1860-1908`, `external/internal/store/store.go:1988-2051`, `external/internal/store/store.go:2455-2475`, `external/internal/store/store.go:3174-3195`, `mcp_server/lib/storage/checkpoints.ts:63-139`, `mcp_server/handlers/memory-bulk-delete.ts:141-220`
- **What it does**: Engram normalizes project names, warns on similar names, skip-acks non-enrolled sync backlog, maintains lease/backoff state for sync, and can merge projects in a single transaction. Public already has checkpointed mutation safety and richer repair expectations.
- **Why it matters for us**: The portable parts are alias warnings and derived-state repair patterns for sidecars/queues. The non-portable part is destructive project-level merge as an authority fix, which is too coarse for Public’s audit, checkpoint, and provenance expectations.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 8: Engram’s lexical FTS stack is a useful baseline, but not a replacement for Public’s retrieval architecture
- **Source**: `external/internal/store/store.go:1462-1584`, `external/internal/store/store.go:3382-3391`, `external/docs/ARCHITECTURE.md:74-117`, `mcp_server/handlers/memory-search.ts:1023-1037`, `mcp_server/lib/search/progressive-disclosure.ts:345-444`, `mcp_server/context-server.ts:755-807`, `mcp_server/handlers/memory-triggers.ts:207-327`
- **What it does**: Engram uses direct topic-key matches, `sanitizeFTS()`, and `fts.rank` over a single memory-oriented surface. Public already combines hybrid retrieval, scoped continuation, trigger hygiene, and explicit routing to CocoIndex and code graph tools.
- **Why it matters for us**: Engram’s search is easier to reason about, but it would be a downgrade as a replacement model. Public should import the hardening mindset and exact-key idea, not collapse back to lexical-only ranking.
- **Recommendation**: reject
- **Impact**: high

### Finding 9: Chronology-around-hit is still a worthwhile retrieval affordance
- **Source**: `external/internal/mcp/mcp.go:416-457`, `external/docs/ARCHITECTURE.md:74-82`, `mcp_server/lib/search/progressive-disclosure.ts:345-444`, `mcp_server/handlers/memory-search.ts:1023-1037`
- **What it does**: Engram’s `mem_timeline` gives chronological context around one observation after search. Public’s progressive disclosure is page/cursor based rather than “show me the surrounding session for result X.”
- **Why it matters for us**: This is a focused UX improvement that complements, rather than replaces, current cursor pagination. It would pair well with session continuity and exact-thread lookup if added later.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `AGENTS.md`
- `external/AGENTS.md`
- `external/internal/mcp/mcp.go`
- `external/internal/store/store.go`
- `external/docs/ARCHITECTURE.md`
- `external/README.md`
- `research/iterations/iteration-009.md`
- `research/iterations/iteration-010.md`
- `research/iterations/iteration-017.md`
- `research/iterations/iteration-018.md`
- `research/iterations/iteration-019.md`
- `mcp_server/context-server.ts`
- `mcp_server/handlers/memory-context.ts`
- `mcp_server/handlers/memory-search.ts`
- `mcp_server/handlers/memory-triggers.ts`
- `mcp_server/handlers/session-resume.ts`
- `mcp_server/handlers/session-bootstrap.ts`
- `mcp_server/lib/session/session-manager.ts`
- `mcp_server/lib/enrichment/passive-enrichment.ts`
- `mcp_server/lib/governance/scope-governance.ts`
- `mcp_server/handlers/save/markdown-evidence-builder.ts`
- `scripts/dist/memory/generate-context.js`
- `mcp_server/lib/storage/checkpoints.ts`
- `mcp_server/handlers/memory-bulk-delete.ts`

## Assessment
- New information ratio: 0.38
- Questions addressed: Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10
- Questions answered: Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10

## Reflection
- What worked: tracing `internal/mcp/mcp.go` into `internal/store/store.go`, then mapping each Engram pattern against Public’s trust, save, routing, and repair surfaces produced much firmer classifications than architecture prose alone.
- What did not work: CocoIndex was blocked on this external tree, so the pass fell back to `rg` plus direct source reads; the phase folder also does not currently contain a canonical `research/research.md`, so this iteration stayed synthesis-only instead of phase-doc consolidation.

## Recommended Next Focus
1. Phase A: implement the low-risk wins first — explicit “no silent session auto-create” guardrails and a deterministic recent-session digest inside bootstrap/resume.
2. Phase B: prototype `thread_key` plus explicit exact lookup and optional chronology-around-hit.
3. Phase C: design a governed passive-capture lane with provenance, reviewability, and transactional/per-item status semantics.
4. Phase D: add alias-warning / derived-state repair ideas only where they fit existing checkpoint and audit expectations.


Total usage est:        1 Premium request
API time spent:         3m 52s
Total session time:     4m 10s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.4m in, 16.0k out, 1.2m cached, 8.1k reasoning (Est. 1 Premium request)
