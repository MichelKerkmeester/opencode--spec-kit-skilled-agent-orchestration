---
title: "Decision Record: Hybrid Context Injection [02--system-spec-kit/024-compact-code-graph/decision-record]"
description: "Decision: Do NOT adopt Dual-Graph (Codex-CLI-Compact) as a dependency"
trigger_phrases:
  - "decision"
  - "record"
  - "hybrid"
  - "context"
  - "injection"
  - "decision record"
  - "024"
  - "compact"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: Hybrid Context Injection
Decision record anchor for structured retrieval.
<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## DR-000: Template Compliance Shim
Template compliance shim section. Legacy phase content continues below.

<!-- SPECKIT_TEMPLATE_SHIM_END -->

### DR-001: Reject Dual-Graph Adoption
**Decision:** Do NOT adopt Dual-Graph (Codex-CLI-Compact) as a dependency
**Date:** 2026-03-29
**Context:** Deep research (10 iterations) evaluated Dual-Graph for upgrading our memory system
**Rationale:**
- Core engine (graperoot) is proprietary, Cython-compiled, no audit capability
- CLAUDE.md auto-generation would overwrite our 300+ line framework
- Workflow collision: `graph_continue` first vs our Gate system
- Telemetry: machine ID + platform heartbeat with no opt-out
- Single-maintainer project, low community (214 stars)
**Alternatives Considered:** Install standalone, extract logic, enhance CocoIndex
**Impact:** No proprietary dependencies added; pursue clean-room approach instead

### DR-002: Hybrid Hook + Tool Architecture
**Decision:** Use Claude Code hooks where available, tool-based fallback for all runtimes
**Date:** 2026-03-29
**Context:** Dual-Graph's hook-based UX (PreCompact context injection) is a genuinely good pattern
**Rationale:**
- Hooks provide guaranteed context injection at lifecycle boundaries
- Only Claude Code supports hooks; Codex/Copilot/Gemini don't
- Our existing Gate 1 + `memory_match_triggers()` already provides tool-based context surfacing
- Hybrid approach: hooks for reliability + tools for universality
**Impact:** 3 hook scripts + CLAUDE.md updates; ~400 lines new code

### DR-003: Direct Import over MCP Call for Hook Scripts
**Decision:** Hook scripts import from compiled dist directly, not via MCP tool calls
**Date:** 2026-03-29
**Context:** Hook scripts must complete in <2 seconds (PreCompact) or <3 seconds (SessionStart)
**Rationale:**
- MCP tool call would require starting a client, connecting, waiting for response
- Direct import from `dist/hooks/memory-surface.js` is instant
- Same compiled code, no network overhead
**Alternatives Considered:** MCP stdio call, HTTP endpoint like Dual-Graph
**Impact:** Simpler implementation, faster execution, tighter coupling to build output

### DR-004: Phase Decomposition (Superseded)
**Decision:** ~~4 phases, independently deployable~~ → Expanded to 16 phases (12 v1 + 4 v2 remediation)
**Date:** 2026-03-29 (original) | 2026-03-31 (superseded by DR-011, DR-016)
**Context:** Originally 4 phases; expanded to 12 during v1 implementation, then to 16 with v2 remediation phases 013-016.
**Rationale:**
- Phase 1 (PreCompact) delivers 80% of the value immediately
- Each phase can be tested and deployed independently
- Parallel execution possible (Phase 4 alongside Phases 2-3)
- v2 phases 013-016 address 45 issues found by 95 research + 30 review iterations
**Impact:** ~3-4 weeks total for v1; v2 remediation adds ~2 weeks. See DR-011 for scope revision, DR-016 for expanded review.
**Status:** SUPERSEDED — see DR-011 for 12-phase expansion, DR-016 for 16-phase expansion

### DR-005: Build Clean-Room Code Graph (Deferred)
**Decision:** Defer code graph channel (tree-sitter) to separate spec folder
**Date:** 2026-03-29
**Context:** Research identified code graph as valuable but separate from hook/compact work
**Rationale:**
- Code graph is a different problem (structural search vs lifecycle hooks)
- Our MCP already has graph channel infrastructure ready
- Better as its own spec folder with dedicated phases
**Impact:** Future spec folder for code graph channel implementation

### DR-006: PreCompact Precompute + SessionStart Inject (Architecture Correction)
**Decision:** PreCompact caches context to file; SessionStart(source=compact) injects it
**Date:** 2026-03-29
**Context:** Iteration 011 discovered PreCompact command hook stdout is NOT injected into model context per Claude Code docs. Only SessionStart and UserPromptSubmit support stdout context injection.
**Rationale:**
- Claude Code hooks reference explicitly states PreCompact has "no event-specific context injection"
- SessionStart has a `source` matcher supporting: `startup`, `resume`, `clear`, `compact`
- `SessionStart(source=compact)` fires immediately after compaction — the correct injection point
**Alternatives Considered:** HTTP hook with local endpoint for PreCompact injection (deferred, adds complexity)
**Impact:** Phase 1 redesigned as two-step: compact-inject.ts (PreCompact) + session-prime.ts (SessionStart)

### DR-007: Pass `profile: "resume"` for Compact Brief Format
**Decision:** All resume paths must pass `profile: "resume"` alongside `mode: "resume"`
**Date:** 2026-03-29
**Context:** Iteration 012 discovered `memory_context({ mode: "resume" })` returns search-style results, not a compact brief. The brief `{ state, nextSteps, blockers }` format requires `profile: "resume"`. At the time of discovery, `/spec_kit:resume` did not pass this and needed follow-through.
**Rationale:** Without `profile: "resume"`, hook scripts get verbose search results that don't fit in ≤4000 token budget
**Impact:** All hook scripts + `/spec_kit:resume` command should pass `profile: "resume"`

### DR-008: Separate `session_token_snapshots` Table for Token Tracking
**Decision:** Token tracking uses a new append-only table, not existing `consumption_log`
**Date:** 2026-03-29
**Context:** Iteration 015 analyzed existing telemetry. `consumption_log` records retrieval events (search, context, triggers). Token tracking is a different concern (session-level usage metrics).
**Rationale:**
- Different granularity: per-retrieval vs per-session
- Stop hooks can fire multiple times per session — append-only snapshots are correct
- Resume flows easier to debug with snapshot history
- Keeps retrieval telemetry clean
**Impact:** New `session_token_snapshots` table with indexes on session_id and runtime

### DR-009: Copilot/Gemini Hooks — v1 Policy Suppression, Not Permanent Exclusion
**Decision:** Mark Copilot and Gemini as `disabled_by_scope` in v1, not `unavailable`
**Date:** 2026-03-29
**Context:** Iteration 011 found Copilot CLI has hooks (guardrails focus) and Gemini CLI v0.33.1+ has a first-class hook system. Iteration 015 recommends a two-field runtime model: `runtime` + `hookPolicy`.
**Rationale:** Don't hardcode "no hooks" when hooks exist — use policy to control v1 scope
**Impact:** Runtime detector outputs `hookPolicy: "disabled_by_scope"` for Copilot/Gemini; promotes to `enabled` when adapters are built

### DR-010: CocoIndex as Complementary Semantic Layer
**Decision:** Use CocoIndex for all semantic code search; code graph handles structural relationships only
**Date:** 2026-03-30
**Context:** Research iterations 036-045 designed a code graph covering both structural and semantic capabilities. Analysis revealed CocoIndex (already deployed) provides semantic search via vector embeddings, 28+ languages, function-level chunking, and an MCP `search` tool.
**Rationale:**
- CocoIndex covers: embedding generation, vector similarity, code chunking, incremental index updates
- Code graph should NOT duplicate: no embeddings, no chunking, no vector search needed
- Clean separation: CocoIndex = "what resembles what", Code Graph = "what connects to what"
- Code graph becomes purely structural: tree-sitter parsing, SQLite storage, import/call/hierarchy edges
- Complementary enrichment: CocoIndex seeds → code graph structural expansion → richer context
**Alternatives Considered:** Build semantic search into code graph (rejected: duplicates CocoIndex), replace CocoIndex with code graph embeddings (rejected: CocoIndex already deployed and working)
**Impact:** Code graph implementation is significantly simpler — no embedding model selection, no chunking strategy, no vector index needed

### DR-011: Code Graph Research Scope Revised
**Decision:** Code graph research and architecture design stays in spec folder 024-compact-code-graph; implementation as phases 008+
**Date:** 2026-03-30
**Context:** DR-005 deferred code graph to a separate spec folder. However, 10 deep research iterations (036-045) were completed within this spec folder, producing a complete architecture design including SQLite schema, tree-sitter query patterns, MCP tool API design, incremental update strategy, and CocoIndex integration.
**Rationale:**
- Folder name is `024-compact-code-graph` — code graph is in the name
- Research is already embedded in this spec's `research/` directory
- Unified architecture vision (Part IV of research.md) integrates hooks + code graph + CocoIndex
- Splitting would orphan research from implementation
- Implementation phases (008+) naturally extend the existing 001-007 hook phases
**Alternatives Considered:** Create separate spec folder for code graph (rejected: orphans research, breaks unified architecture)
**Impact:** DR-005's "separate spec folder" decision is superseded; code graph phases extend this spec folder

### DR-012: Token Budget Allocation — Floors + Overflow Pool
**Decision:** Split the 4000-token compaction budget across 3 sources using reserved floors with a shared overflow pool
**Date:** 2026-03-30
**Context:** Research iteration 049 analyzed the current fixed 4000-token budget (100% to Memory) and designed a multi-source allocation strategy. The budget must now serve Memory, CocoIndex, and Code Graph without wasting tokens when a source is empty.
**Rationale:**
- Fixed splits waste budget when a source has nothing; pure pooling risks starving high-priority sources
- Floors + overflow gives minimum guarantees with dynamic redistribution
- Compaction allocation: constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800
- SessionStart allocation: constitutional 500, graph 700, CocoIndex 400, triggered 200, overflow 200
- Priority order: constitutional > code graph > CocoIndex > triggered
- When a source returns nothing, its floor flows to the overflow pool
**Alternatives Considered:** Fixed per-source splits (rejected: wastes budget), pure pooled allocation (rejected: starves constitutional), dynamic tier-based (rejected: adds complexity without clear benefit for v1)
**Impact:** Enables 3-source compaction while preserving constitutional-first semantics; allocator must be observable (per-source tokens requested/granted/dropped)

### DR-013: endLine Fix via Brace-Counting Heuristic (Not Tree-Sitter Yet)
**Decision:** Fix the endLine bug in Phase 013 using regex brace-counting, not tree-sitter
**Date:** 2026-03-31
**Context:** Research iterations 056, 060, 076 confirmed the structural-indexer.ts always sets endLine = startLine, breaking CALLS edge detection for multi-line functions. Tree-sitter WASM would also fix this but requires Phase 015 (larger migration).
**Rationale:**
- Brace-counting heuristic is 60-80 LOC, low risk, zero dependencies
- Tree-sitter is 200-315 LOC, HIGH risk, requires WASM grammar bundles
- Fix now with heuristic, upgrade to tree-sitter later via adapter interface
- Python uses indentation-based detection, Bash uses marker-based (fi/done/esac)
- Verified: zero existing tests depend on broken endLine behavior (iteration 073)
**Alternatives Considered:** Wait for tree-sitter (rejected: P0 bug blocks graph utility), AST-based parsing without tree-sitter (rejected: no Node.js AST parser for all 4 languages)
**Impact:** Unblocks CALLS edge detection, fixes contentHash, enables enclosing-symbol resolution. Phase A prerequisite for all subsequent phases.

### DR-014: Tree-Sitter WASM with Regex Fallback (Adapter Pattern)
**Decision:** Implement tree-sitter WASM in Phase 015 with permanent regex fallback via adapter interface
**Date:** 2026-03-31
**Context:** Research iterations 060, 066, 073 designed a 4-phase migration from regex to tree-sitter. The ParseResult interface is already parser-agnostic. Bundle size revised to ~1.5MB (JS ~200KB, TS ~500KB, Python ~150KB, Bash ~100KB, core ~300KB).
**Rationale:**
- 99% parse accuracy vs ~70% with regex
- Enables 3 new edge types (DECORATES, OVERRIDES, TYPE_OF) only possible with AST
- Adapter interface means extractEdges() needs zero changes
- Regex stays as permanent fallback for environments where WASM fails
- Migration path: C1 (adapter) → C2 (tree-sitter impl) → C3 (flip default) → C4 (remove regex, optional)
**Alternatives Considered:** Native tree-sitter bindings (rejected: portability issues), LSP-based parsing (rejected: per-language server overhead)
**Impact:** Major accuracy improvement; enables richer graph relationships; ~1.5MB bundle size addition

### DR-015: MCP First-Call Priming as Universal Session Detection
**Decision:** Implement session detection via MCP tool first-call tracking, not hook-dependent mechanisms
**Date:** 2026-03-31
**Context:** Research iterations 057, 062, 065 designed a "T1.5" universal mechanism. Hook-based session detection only works on Claude Code. Non-hook runtimes (OpenCode, Codex CLI, Copilot CLI, Gemini CLI) need a different approach. The `resolveTrustedSession()` function already detects new sessions via `trusted:false + requestedSessionId:null`.
**Rationale:**
- Works on ALL 5 runtimes without any hook support
- Detects first MCP tool call in a session → triggers context loading
- Achieves ~85-90% parity with Claude Code hooks
- Latency: <250ms for priming (within tool call budget)
- No external dependencies — uses existing session management infrastructure
**Alternatives Considered:** Instruction-file-only triggers (rejected: unreliable, AI may skip), custom MCP lifecycle events (rejected: not supported by MCP protocol), file-watcher daemon (rejected: heavy, platform-dependent)
**Impact:** Makes code graph and context preservation work automatically on all runtimes; biggest UX improvement for cross-runtime support

### DR-016: Expanded Review Scope — 30 Iterations, 45 Remediation Items
**Decision:** Expand v2 remediation from 26 to 45 items based on 30-iteration deep review
**Date:** 2026-03-31
**Context:** Initial remediation plan was based on 10-iteration Codex CLI review (verdict: FAIL, 10 P1). A second 20-iteration review via Copilot CLI (GPT-5.4) re-verified all original findings and explored previously unexamined code areas (DB safety, session aliasing, transaction atomicity, test coverage, dead code).
**Rationale:**
- All 19 original findings from Phase 1 (iters 1-10) were CONFIRMED by Phase 2 (iters 11-18)
- Phase 2 fresh dives (iters 19-25) found 8 new issues in previously unexamined code
- Phase 2 convergence (iters 26-30) found 4 more issues before approaching saturation
- 7 new P1 findings: F021 (DB init), F022 (hook bypass), F023 (migration guard), F024 (transaction atomicity), F026 (maxDepth leak), F027 (session aliasing), F028 (file permissions), F033 (includeTrace ghost)
- 12 new P2 findings across dead code, config mismatches, test coverage, duplicated logic
- 4 partially-covered findings widened in scope (F010: all tool args, F020: sessionState bypass, F008: method nodes, F009: injection fencing)
- Verdict upgraded from FAIL to CONDITIONAL (0 P0, 16 P1, 16 P2)
**Alternatives Considered:** Keep 26-item scope (rejected: misses 7 P1 blockers), create Phase 017 for new findings (rejected: findings naturally fit existing phases)
**Impact:** Phases 013-016 expanded from 26 to 45 items. LOC estimate: 911-1,317 (up from 711-1,037). Phase 013 grows most (8→15 items) due to DB safety findings.

### DR-017: Startup Highlights Retention with Quality Gates
**Decision:** Retain the startup highlights section but gate it behind quality improvements: (1) fix deduplication via GROUP BY on display fields, (2) add path exclusion filters for vendored/test code, (3) replace outgoing-call-count with incoming-call-count heuristic, (4) add per-file diversity limits. If highlights remain low-value after fixes, remove the section entirely.
**Date:** 2026-04-02
**Context:** Deep review (2026-04-02) found that queryStartupHighlights() produced low-signal output: duplicate entries (GROUP BY bug), vendored/test code domination (no path filtering), wrong heuristic (outgoing calls instead of incoming), and no spec traceability for the highlights section. Review verdict: CONDITIONAL with P1=3 P2=4.
**Rationale:**
- The hook infrastructure is sound and the token cost (~100 of 2000) is low
- The problem is signal quality, not architecture
- Fixing the query is less disruptive than removing the section
- The session continuity and stale-index detection sections are confirmed valuable and unaffected
**Status:** Implemented (Phase 028, 2026-04-02). All 4 quality gates applied: dedup, path exclusion, incoming-call heuristic, diversity limits. Live output verified — 5/5 project symbols, 0 duplicates, 0 vendored/test.

### Context
Decision context and constraints are captured from the active phase deliverables.

### Consequences
This decision keeps packet behavior aligned with runtime truth and validation policy.

<!-- ANCHOR:adr-001 -->
ADR index anchor for structured retrieval.
<!-- /ANCHOR:adr-001 -->
