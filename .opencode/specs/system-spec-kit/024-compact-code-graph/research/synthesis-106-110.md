# Research Synthesis: Iterations 106-110 — Hookless Context Priming Optimization

## Scope

Five iterations investigating how to optimize the two hookless priming mechanisms (@context-prime agent delegation and MCP first-call auto-priming) across all runtimes (OpenCode, Claude Code, Codex CLI, Gemini CLI).

## Key Findings

### 1. Priming Reliability Hierarchy (Iteration 106)

The system has a clear reliability ordering that should be explicitly documented:

| Rank | Mechanism | Reliability | Timing |
|------|-----------|-------------|--------|
| 1 | Runtime hooks (Claude, Gemini) | Deterministic | Pre-LLM |
| 2 | MCP server instructions (`buildServerInstructions`) | Deterministic | Pre-LLM (connection time) |
| 3 | MCP first-call auto-priming (`primeSessionIfNeeded`) | Deterministic | Post-first-tool-call |
| 4 | Agent delegation (`@context-prime`) | Probabilistic | Post-first-message |

Orchestrator delegation to `@context-prime` is medium-reliable inside OpenCode, zero outside OpenCode, and should be reframed as best-effort UX bootstrap rather than mandatory correctness gate.

### 2. The Two Mechanisms Are Complementary, Not Competing (Iteration 107)

The overlap is partial: both check graph status and CocoIndex, but only agent priming does memory resume and only MCP priming does constitutional memory injection and session-primed state management.

**Recommended design:** Keep MCP auto-priming as universal ambient safety net. Slim `@context-prime` from 4 calls to 2: `session_resume()` + `session_health()`. Do not suppress server priming for bootstrap tools.

### 3. Minimum Viable Prime Is Already Implemented (Iteration 108)

Cold-start latency is dominated by `memory_context(resume)` -- the other 3 calls in the bootstrap are nearly free. The existing `primeSessionIfNeeded()` already provides a sub-50ms minimum viable prime with graph freshness, CocoIndex availability, and recommended next calls.

**Two-tier design:**
- **Tier 1 (default):** Passive auto-prime only (already exists, <50ms)
- **Tier 2 (resume):** Single `session_resume()` call (only when actually resuming work)

Key insight: **do not pay the resume-retrieval tax unless the user is actually resuming work.** This matches what Cursor, Aider, and other tools do.

### 4. Gemini Is the Cross-Runtime Reliability Gap (Iteration 109)

Gemini has hook implementations in the repo but runtime detection classifies it as `tool_fallback`. This is the single largest cross-runtime risk. Resolution is blocking for any cross-runtime reliability claim.

A subtle hole exists: `primeSessionIfNeeded()` only runs on `CallToolRequest`, not `ListToolsRequest`. If a runtime starts with tool listing, auto-priming never fires.

### 5. Enriched Server Instructions Are the Highest-Leverage Improvement (Iteration 110)

`buildServerInstructions()` is the only truly pre-LLM surface available without hooks. Currently it only reports memory counts and search channels. Adding a compact session recovery digest (last spec folder, last task, graph freshness, recommended first action) at ~150-400 tokens would give every runtime pre-LLM startup steering at connection time.

This is the closest hookless systems can get to Claude Code's SessionStart hook.

## Consolidated Recommendations

### Immediate (35-75 LOC)
1. Reframe `@context-prime` as best-effort, not mandatory
2. Change `@context-prime` default path from 4 calls to: `session_resume()` + optional `session_health()`
3. Add urgency-aware bootstrap: skip blocking prime for urgent first messages

### Near-term (160-340 LOC)
4. Enrich `buildServerInstructions()` with session recovery digest (last spec folder, task, graph freshness, recommended action)
5. Extract shared snapshot helpers so startup instructions, PrimePackage, and session_health use the same freshness definitions
6. Strengthen tool descriptions for `memory_context`, `session_resume`, `session_health` with recovery affordances

### Medium-term (260-500 LOC)
7. Create `session_bootstrap()` composite tool that returns memory + graph + CocoIndex + health in one call
8. Add `session_resume({ minimal: true })` with reduced anchors/limit for lightweight recovery
9. Add bootstrap telemetry (bootstrap_source, duration_ms, completeness)

### Prerequisite
10. **Resolve Gemini hook/detection mismatch** before claiming cross-runtime reliability

## Architecture Summary

```
Session Start
    |
    +--- [Pre-LLM Layer]
    |    +-- Runtime hooks (Claude SessionStart, Gemini extensions)
    |    +-- MCP server instructions (buildServerInstructions + recovery digest)
    |
    +--- [First-Action Layer]
    |    +-- MCP auto-priming (primeSessionIfNeeded on first tool call)
    |    +-- Constitutional memory injection
    |
    +--- [Explicit Recovery Layer]
    |    +-- session_resume() / session_bootstrap() (when resuming work)
    |    +-- @context-prime agent (best-effort UX, OpenCode only)
    |
    +--- [Diagnostic Layer]
         +-- session_health() (mid-session quality check)
```

## Total Estimated Effort

| Tier | LOC Range | Value |
|------|-----------|-------|
| Docs/prompt-only optimization | 35-75 | High ROI |
| Core universal improvement (Phase 1-3) | 160-340 | Highest leverage |
| Full cleanup with new tools/tests | 400-750 | Complete solution |
| Per-runtime hook adoption | +80-200 each | Runtime-specific parity |
