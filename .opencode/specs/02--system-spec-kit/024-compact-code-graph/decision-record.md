# Decision Record: Hybrid Context Injection

## DR-001: Reject Dual-Graph Adoption
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

## DR-002: Hybrid Hook + Tool Architecture
**Decision:** Use Claude Code hooks where available, tool-based fallback for all runtimes
**Date:** 2026-03-29
**Context:** Dual-Graph's hook-based UX (PreCompact context injection) is a genuinely good pattern
**Rationale:**
- Hooks provide guaranteed context injection at lifecycle boundaries
- Only Claude Code supports hooks; Codex/Copilot/Gemini don't
- Our existing Gate 1 + `memory_match_triggers()` already provides tool-based context surfacing
- Hybrid approach: hooks for reliability + tools for universality
**Impact:** 3 hook scripts + CLAUDE.md updates; ~400 lines new code

## DR-003: Direct Import over MCP Call for Hook Scripts
**Decision:** Hook scripts import from compiled dist directly, not via MCP tool calls
**Date:** 2026-03-29
**Context:** Hook scripts must complete in <2 seconds (PreCompact) or <3 seconds (SessionStart)
**Rationale:**
- MCP tool call would require starting a client, connecting, waiting for response
- Direct import from `dist/hooks/memory-surface.js` is instant
- Same compiled code, no network overhead
**Alternatives Considered:** MCP stdio call, HTTP endpoint like Dual-Graph
**Impact:** Simpler implementation, faster execution, tighter coupling to build output

## DR-004: Phase Decomposition
**Decision:** 4 phases, independently deployable
**Date:** 2026-03-29
**Context:** Minimize risk, deliver highest-value feature first
**Rationale:**
- Phase 1 (PreCompact) delivers 80% of the value immediately
- Each phase can be tested and deployed independently
- Parallel execution possible (Phase 4 alongside Phases 2-3)
**Impact:** ~3-4 weeks total, but Phase 1 deployable in 2-3 days

## DR-005: Build Clean-Room Code Graph (Deferred)
**Decision:** Defer code graph channel (tree-sitter) to separate spec folder
**Date:** 2026-03-29
**Context:** Research identified code graph as valuable but separate from hook/compact work
**Rationale:**
- Code graph is a different problem (structural search vs lifecycle hooks)
- Our MCP already has graph channel infrastructure ready
- Better as its own spec folder with dedicated phases
**Impact:** Future spec folder for code graph channel implementation

## DR-006: PreCompact Precompute + SessionStart Inject (Architecture Correction)
**Decision:** PreCompact caches context to file; SessionStart(source=compact) injects it
**Date:** 2026-03-29
**Context:** Iteration 011 discovered PreCompact command hook stdout is NOT injected into model context per Claude Code docs. Only SessionStart and UserPromptSubmit support stdout context injection.
**Rationale:**
- Claude Code hooks reference explicitly states PreCompact has "no event-specific context injection"
- SessionStart has a `source` matcher supporting: `startup`, `resume`, `clear`, `compact`
- `SessionStart(source=compact)` fires immediately after compaction — the correct injection point
**Alternatives Considered:** HTTP hook with local endpoint for PreCompact injection (deferred, adds complexity)
**Impact:** Phase 1 redesigned as two-step: compact-inject.ts (PreCompact) + session-prime.ts (SessionStart)

## DR-007: Pass `profile: "resume"` for Compact Brief Format
**Decision:** All resume paths must pass `profile: "resume"` alongside `mode: "resume"`
**Date:** 2026-03-29
**Context:** Iteration 012 discovered `memory_context({ mode: "resume" })` returns search-style results, not a compact brief. The brief `{ state, nextSteps, blockers }` format requires `profile: "resume"`. Current `/spec_kit:resume` command does NOT pass this.
**Rationale:** Without `profile: "resume"`, hook scripts get verbose search results that don't fit in ≤4000 token budget
**Impact:** All hook scripts + `/spec_kit:resume` command should pass `profile: "resume"`

## DR-008: Separate `session_token_snapshots` Table for Token Tracking
**Decision:** Token tracking uses a new append-only table, not existing `consumption_log`
**Date:** 2026-03-29
**Context:** Iteration 015 analyzed existing telemetry. `consumption_log` records retrieval events (search, context, triggers). Token tracking is a different concern (session-level usage metrics).
**Rationale:**
- Different granularity: per-retrieval vs per-session
- Stop hooks can fire multiple times per session — append-only snapshots are correct
- Resume flows easier to debug with snapshot history
- Keeps retrieval telemetry clean
**Impact:** New `session_token_snapshots` table with indexes on session_id and runtime

## DR-009: Copilot/Gemini Hooks — v1 Policy Suppression, Not Permanent Exclusion
**Decision:** Mark Copilot and Gemini as `disabled_by_scope` in v1, not `unavailable`
**Date:** 2026-03-29
**Context:** Iteration 011 found Copilot CLI has hooks (guardrails focus) and Gemini CLI v0.33.1+ has a first-class hook system. Iteration 015 recommends a two-field runtime model: `runtime` + `hookPolicy`.
**Rationale:** Don't hardcode "no hooks" when hooks exist — use policy to control v1 scope
**Impact:** Runtime detector outputs `hookPolicy: "disabled_by_scope"` for Copilot/Gemini; promotes to `enabled` when adapters are built
