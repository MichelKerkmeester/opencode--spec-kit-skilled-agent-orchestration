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
