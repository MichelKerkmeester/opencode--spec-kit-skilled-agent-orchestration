# Changelog: 024/024-hookless-priming-optimization

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 024-hookless-priming-optimization — 2026-04-01

When an AI session starts without startup-hook support or when startup surfacing is otherwise unavailable, the system previously needed four separate tool calls just to figure out where you left off -- slow, fragile, and easy to skip entirely. This phase collapsed that into a streamlined two-call bootstrap, added a single composite tool that returns everything in one shot, and made the whole process smart enough to get out of the way when you need an urgent fix. All 10 planned items were delivered with 9,241 tests passing.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/024-hookless-priming-optimization/`

---

## Architecture (3)

Three structural changes that underpin the faster bootstrap path.

### Shared session snapshot helper

**Problem:** Session state -- which spec folder you were working in, whether the code graph was up to date, whether semantic search was available -- was computed independently in multiple places. Each place used slightly different logic, so two parts of the system could disagree about whether your session was healthy.

**Fix:** Created a single `getSessionSnapshot()` function (about 95 lines) that all callers share. It aggregates spec folder, graph freshness, CocoIndex (semantic code search) availability, quality score, and priming status into one read-only object. Every component that needs session state now reads from the same source of truth.

### Composite `session_bootstrap` tool

**Problem:** Hookless runtimes (those without automatic lifecycle hooks) needed multiple sequential tool calls to recover session state on startup. Each call consumed tokens (the units of text AI models can process) and a network round trip, making the startup experience slow and token-heavy.

**Fix:** Added a single composite tool called `session_bootstrap` (about 100 lines) that internally calls `session_resume(minimal)` plus `session_health()` and merges the results with deduplicated hints. One call now replaces what used to take two or three separate calls.

### Minimal mode for `session_resume`

**Problem:** Full session resume loads the complete memory context -- every saved memory, prior work summary, and constitutional rule. This is overkill when all you need is a quick orientation: is the code graph fresh? Is semantic search running? What was I working on?

**Fix:** Added a `minimal: true` option to `session_resume`. When enabled, it skips the heavy memory loading and returns only graph status, code search availability, and session health. This gives lightweight recovery for the cases where full context is unnecessary, saving significant tokens and latency.

---

## New Features (3)

Three capabilities that make hookless sessions smarter.

### Server instructions now include recovery context

**Problem:** When an AI session started, the MCP server instructions (the initial guidance the server sends to the AI) contained no information about prior work. The AI had no idea what you were working on until you explicitly told it or called a recovery tool.

**Fix:** `buildServerInstructions()` now appends a "Session Recovery" section with the last spec folder, code graph freshness, session quality score, and a recommended next action (like "call session_resume()" or "run code_graph_scan"). AI assistants can orient themselves before the user even types their first message.

### Bootstrap telemetry

**Problem:** There was no way to know how sessions were being primed across different runtimes. Were users relying on hooks? On the auto-prime feature? On the `@context-prime` agent? Or were they just skipping priming entirely? Without data, it was impossible to optimize the paths that mattered most.

**Fix:** Added `recordBootstrapEvent()` tracking that records the source (hooks, MCP auto-prime, manual agent, or user-initiated), duration, and completeness for each session bootstrap. This enables future analysis of which priming paths actually get used and how they perform.

### Urgency-aware bootstrap skipping

**Problem:** The priming agent would block on startup even when the user's first message was clearly urgent -- "fix this error", "bug in production", "deploy is broken". Forcing the user to wait through a full bootstrap before they could get help was exactly the wrong behavior for time-sensitive situations.

**Fix:** Added urgency detection to the `@context-prime` agent: if the first message looks time-sensitive, the agent skips blocking priming and lets background auto-prime handle recovery. Gets you to work faster when speed matters most, without losing the benefit of priming for normal sessions.

---

## Bug Fixes (1)

### Gemini hook detection mismatch

**Problem:** Gemini's runtime detection was hardcoded to always return `disabled_by_scope`, even when `.gemini/settings.json` had hooks properly configured. This meant the system always treated Gemini as a hookless runtime, never giving it the benefit of hook-based priming even when hooks were available.

**Fix:** Changed detection to dynamically read the Gemini settings file and check for `hooks`/`hooksConfig` blocks. Gemini now correctly reports its actual hook capability, which means it can use the hook-based priming path when hooks are configured.

---

## Commands (3)

Three changes to how agent workflows handle priming.

### Slimmed @context-prime agent from 4 calls to 2

**Problem:** The priming agent made four separate tool calls on startup (memory context, code graph status, code search status, session health), making the startup sequence slow and consuming roughly twice as many tokens as necessary.

**Fix:** Rewritten to use just `session_resume()` + `session_health()` -- two calls instead of four. The composite tools handle the internal merging. Cuts priming overhead roughly in half.

### Reframed priming as best-effort

**Problem:** The orchestrator agent (the top-level coordinator that manages multi-agent workflows) treated session bootstrap as mandatory. If priming failed or timed out, it blocked the entire workflow. If the user needed immediate attention, they still had to wait for priming to complete.

**Fix:** Updated `orchestrate.md` to mark priming as "best-effort -- skip if user message is urgent or time-sensitive". Removes a bottleneck without losing the benefit for normal sessions.

### Improved tool descriptions for discoverability

**Problem:** Tool descriptions for `memory_context`, `session_health`, and `session_resume` did not indicate when to call them. AI assistants had to be explicitly told which tool to use, rather than being able to self-select based on the description.

**Fix:** Added clear guidance to each tool's description: "Call this on session start", "Use for session recovery", "Check before long tasks". Helps AI assistants self-select the right tools without needing explicit instruction from the user.

---

## Testing (1)

### Test suite updated for new tool

**Problem:** The existing test suite asserted a fixed count of 42 MCP tools. Adding `session_bootstrap` as the 43rd tool would cause test failures even though nothing was broken.

**Fix:** Tool count assertions updated from 42 to 43 across `context-server.vitest.ts` and `review-fixes.vitest.ts`. Gemini detection tests updated for the new dynamic detection. Session resume mocks updated for `recordBootstrapEvent`. Modularization limits extended for changed modules. All 9,241 tests pass.

---

<details>
<summary>Files Changed (24 total)</summary>

### Source (13 files)

| File | Changes |
|------|---------|
| `mcp_server/lib/code-graph/runtime-detection.ts` | Dynamic Gemini hook detection from settings.json |
| `mcp_server/lib/session/session-snapshot.ts` | New shared helper: `getSessionSnapshot()` (~95 lines) |
| `mcp_server/lib/session/context-metrics.ts` | Bootstrap telemetry: `recordBootstrapEvent()` and types |
| `mcp_server/context-server.ts` | Session recovery digest in `buildServerInstructions()` |
| `mcp_server/handlers/session-resume.ts` | `minimal` mode + bootstrap telemetry wiring |
| `mcp_server/handlers/session-bootstrap.ts` | New composite tool handler (~100 lines) |
| `mcp_server/handlers/index.ts` | Lazy-loader wiring for `handleSessionBootstrap` |
| `mcp_server/tool-schemas.ts` | Enhanced descriptions + `session_bootstrap` registration |
| `mcp_server/schemas/tool-input-schemas.ts` | `minimal` param + `session_bootstrap` schema |
| `mcp_server/tools/types.ts` | `SessionBootstrapArgs` type + `minimal` on resume args |
| `mcp_server/tools/lifecycle-tools.ts` | `session_bootstrap` in TOOL_NAMES and dispatch |
| `mcp_server/lib/architecture/layer-definitions.ts` | `session_bootstrap` added to L1 Orchestration layer |
| `mcp_server/hooks/memory-surface.ts` | Bootstrap telemetry in `primeSessionIfNeeded()` |

### Agent Files (5 files)

| File | Changes |
|------|---------|
| `.opencode/agent/context-prime.md` | 2-step workflow, urgency detection, updated tool table |
| `.claude/agents/context-prime.md` | Runtime copy of above |
| `.codex/agents/context-prime.md` | Runtime copy of above |
| `.agents/agents/context-prime.md` | Runtime copy of above |
| `.opencode/agent/orchestrate.md` | Best-effort delegation language |

### Tests (6 files)

| File | Changes |
|------|---------|
| `tests/context-server.vitest.ts` | Tool count 42 → 43 |
| `tests/review-fixes.vitest.ts` | Tool count 42 → 43 |
| `tests/session-resume.vitest.ts` | Mock updated for `recordBootstrapEvent` |
| `tests/cross-runtime-fallback.vitest.ts` | Gemini detection test updated |
| `tests/fixtures/runtime-fixtures.ts` | Gemini fixture: `hookPolicy: 'unavailable'` |
| `tests/modularization.vitest.ts` | Extended limits for changed modules |

</details>

---

---

## Deep Review Fixes (2026-04-01)

### Code Fixes
- **session_resume(minimal) telemetry guard** -- skips recordBootstrapEvent when minimal=true
- **session_bootstrap tracking restored** -- removed from recordToolCall exclusion (only session_health excluded)
- **Minimal response includes sessionQuality** -- added computeQualityScore().level
- **Gemini null guard** -- explicit null check before typeof === 'object' in runtime-detection
- **currentTask from metrics** -- session-snapshot reads from metrics instead of hardcoding null
- **Deduplicated bootstrap telemetry** -- session_bootstrap is sole recorder

## Upgrade

No migration required. The new `session_bootstrap` tool is additive. Existing `session_resume` calls continue to work unchanged -- the `minimal` parameter defaults to `false`. Agent file updates are backward-compatible.
