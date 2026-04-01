# Research Iteration 109: Cross-Runtime Reliability Testing Plan

## Current State

The repo already has three priming surfaces, but they are not equally verified across runtimes.

| Runtime | Intended primary priming path | Verified repo surface | Current confidence |
|---|---|---|---|
| OpenCode / Copilot profile | `@context-prime` via orchestrator, plus MCP first-call auto-priming | `.opencode/agent/orchestrate.md:18-20`, `.opencode/agent/context-prime.md:32-42`, `opencode.json:10-58` | Medium |
| Claude Code | Hook-based priming, with manual fallback | `.claude/CLAUDE.md:5-24`, `.claude/settings.local.json:5-39`, hook tests under `mcp_server/tests/` | High |
| Codex CLI | Session Start Protocol / `session_resume()`, plus MCP first-call auto-priming | `CODEX.md:14-47`, `.codex/config.toml:5-39` | High |
| Gemini CLI | Docs and hook scripts exist, but runtime classification still says tool fallback | `GEMINI.md:69-76,388-395`, `mcp_server/hooks/gemini/*.ts`, but `runtime-detection.ts:37-40` and `cross-runtime-fallback.vitest.ts:51-54,92-99` classify Gemini as `disabled_by_scope/tool_fallback` | Low |

Two hookless mechanisms are real and implemented:

1. Instruction/agent bootstrap.
OpenCode/Copilot delegates first turn to `@context-prime`, which does `memory_context` + `code_graph_status` + `ccc_status` + `session_health` and returns a compact Prime Package (`.opencode/agent/context-prime.md:34-41`).

2. MCP auto-priming on first tool call.
`primeSessionIfNeeded()` runs before tool dispatch, sets `sessionPrimed`, and injects constitutional memories, code-graph status, and a `primePackage` with `specFolder`, `currentTask`, graph freshness, CocoIndex availability, and recommended next calls (`hooks/memory-surface.ts:315-420`, `context-server.ts:707-715,530-565`).

Cross-runtime fallback primitives also exist:
`session_resume()` returns memory + code graph + CocoIndex + hints (`handlers/session-resume.ts:45-127`), and `session_health()` reports priming status, graph freshness, inactivity, and hints (`handlers/session-health.ts:50-136`).

The main inconsistency is Gemini:
the repo contains Gemini hook implementations and manual playbooks, but runtime detection and fallback tests still treat Gemini as hookless/tool-fallback-first (`runtime-detection.ts:37-54`, `cross-runtime-fallback.vitest.ts:38-55`). There is also no checked-in `.gemini/` runtime directory in the current tree, so Gemini hook integration is not repository-verifiable the same way Claude is.

## Analysis

The reliability question breaks into four separate concerns:

1. Can the runtime discover the priming path?
This is a static conformance problem: docs, config, agent files, and runtime detection must agree.

2. Does the priming path execute?
This is a contract/integration problem: hooks must emit the right payload shape, orchestrators must delegate, and `primeSessionIfNeeded()` must attach metadata on first tool use.

3. Does the runtime degrade safely when priming fails?
This is a failure-mode problem: timeouts, missing DB, missing agent, weak first-call hints, and missing MCP must not block the session.

4. Can we prove priming actually reached the model?
This is the largest gap today. `session_health()` knows whether the server thinks the session is primed, but it does not confirm delivery to the client/runtime. Hook JSON output and MCP envelope metadata exist, but there is no unified "delivery confirmed" signal.

### Failure mode review

| Failure mode | Current behavior | Gap |
|---|---|---|
| MCP server not running | All memory/context tools fail; hookless priming collapses; hook scripts can still print minimal text if coded to do so | No cross-runtime "stateless mode" probe or explicit health status for MCP unavailable |
| DB not initialized | `getConstitutionalMemories()` returns empty; code graph may error; `session_resume()` degrades with hints (`handlers/session-resume.ts:69-73,100-103`) | Need explicit tests for empty DB + first-call auto-prime |
| Agent not found | OpenCode orchestrator bootstrap can fail if `@context-prime` is unavailable | No verified fallback test from orchestrator failure to `session_resume()` |
| Tool timeout / large DB | Hook code uses timeout wrappers; `@context-prime` says return partial results and never block session start (`context-prime.md:41,170-173`) | No explicit timeout matrix for hookless first-call priming or composite resume |
| First call not memory-related | `primePackage` is derived only from args like `input/query/prompt/specFolder`; weak first calls produce `null` task/spec and recommend `memory_context(...)` (`memory-surface.ts:320-360`) | Need deterministic tests for "context-free first call" |
| Instructions not followed | Codex/OpenCode/Gemini tool-fallback path depends on the model obeying Session Start Protocol docs | No end-to-end runtime smoke tests proving actual first-turn behavior |

### Important design observations

OpenCode/Copilot has a layered fallback stack:
orchestrator bootstrap first, MCP auto-prime second, explicit `session_resume()` third. That is good for resilience, but only if agent-failure fallback is tested.

Claude is the most coherent runtime today:
docs, hook registration, and hook tests align.

Codex is coherent for hookless use:
docs and config agree, and `session_resume()` provides a deterministic single-call recovery path.

Gemini is split across two truths:
docs and hook scripts imply hooks are supported, while runtime detection and fallback tests treat it as tool-fallback-only. This is the main cross-runtime reliability risk because it can create a false green in research while the runtime itself still follows the degraded path.

There is also a subtle first-turn hole:
`primeSessionIfNeeded()` only runs on `CallToolRequest`, not `ListToolsRequest` (`context-server.ts:665-675`). If a runtime begins by listing tools and the model never makes a real tool call, auto-priming never occurs. That should either be documented as expected or covered by a higher-level bootstrap probe.

## Proposals

### 1. Adopt a three-layer test strategy

#### Layer A: Static conformance tests
Goal: prove that each runtime's checked-in docs/config reference the correct priming path.

Required assertions:
- OpenCode/Copilot:
  - orchestrator says "first turn or after `/clear`, delegate to `@context-prime`"
  - `@context-prime` requires `memory_context`, `code_graph_status`, `ccc_status`, `session_health`
  - `opencode.json` wires Spec Kit Memory and CocoIndex
- Claude:
  - `.claude/CLAUDE.md` says hook-aware recovery
  - `.claude/settings.local.json` registers `SessionStart`, `PreCompact`, `Stop`
- Codex:
  - `CODEX.md` documents Session Start Protocol and `session_resume()`
  - `.codex/config.toml` wires the same MCP servers and has no hook claims
- Gemini:
  - `GEMINI.md` claims must match runtime detection policy
  - if Gemini hooks are intended, there must be a checked-in runtime config/integration artifact; otherwise docs must say tool-fallback-first

This layer should fail CI on Gemini drift.

#### Layer B: Contract and handler tests
Goal: verify the priming contracts independent of any real CLI runtime.

Required tests:
- `primeSessionIfNeeded()` on first tool call produces:
  - `sessionPrimed: true`
  - `primedTool`
  - `primePackage`
  - envelope hints via `injectSessionPrimeHints()`
- repeated calls do not re-prime
- context-free first call produces `recommendedCalls` including `memory_context(...)`
- DB unavailable / graph unavailable still returns valid degraded payload where possible
- `session_resume()` returns partial success with hints when memory or graph fails
- `session_health()` transitions correctly across `not_primed`, `warning`, `stale`, and `ok`

#### Layer C: Runtime smoke tests
Goal: verify real runtime behavior, including instruction-following and hook delivery.

These must be per-runtime, because the delivery transport differs.

### 2. Verify priming differently per runtime

#### OpenCode / Copilot profile
Primary verification:
- cold start through orchestrator path
- assert first-turn delegation to `@context-prime`
- assert Prime Package contains spec/task/graph/CocoIndex info

Backup verification:
- make a first non-memory tool call and inspect MCP envelope metadata for `meta.sessionPriming`
- call `session_health()` immediately after and confirm `primingStatus=primed`

Failure verification:
- remove or rename `@context-prime` fixture
- confirm orchestrator degrades to explicit `session_resume()` or at least emits a deterministic fallback recommendation instead of silently losing context

#### Claude Code
Primary verification:
- SessionStart hook emits injected context
- PreCompact caches compact payload
- next recovery event injects cached compact payload
- Stop hook records token tracking

Backup verification:
- disable hooks and confirm root recovery protocol still works with `session_resume()` or `memory_context + code_graph_status`

Failure verification:
- stale compact cache
- malformed stdin
- hook timeout
- missing state file

#### Codex CLI
Primary verification:
- first-turn Session Start Protocol: `session_resume()` or `memory_context + code_graph_status`
- follow-up `session_health()` reports primed or at least healthy degraded status

Backup verification:
- skip explicit resume and make first non-memory tool call
- assert MCP auto-prime injects Prime Package

Failure verification:
- MCP unavailable
- DB unavailable
- first call with no context-bearing args

#### Gemini CLI
Treat as two modes until the inconsistency is resolved.

Hook mode verification:
- `session-prime.ts` emits `hookSpecificOutput.additionalContext`
- `compact-inject.ts` performs one-shot injection
- stale cache is rejected
- resume/clear/startup sources route correctly

Tool-fallback verification:
- same as Codex/OpenCode hookless protocol
- `session_resume()` remains the deterministic probe

Do not claim Gemini hook reliability cross-runtime until runtime detection, docs, and actual runtime config agree.

### 3. Add a priming health model, not just a boolean

Extend `session_health()` from "primed/not_primed" to a transport-aware health report.

Recommended fields:
- `runtime`
- `expectedPrimingMode`: `hooks | orchestrator | tool_fallback`
- `observedPrimingMode`: `hooks | orchestrator | auto_prime | manual_resume | unknown`
- `primingStatus`: `not_attempted | primed | degraded | failed`
- `deliveryConfirmed`: boolean
- `lastPrimeAt`
- `lastPrimeLatencyMs`
- `lastPrimeFailureReason`
- `mcpAvailable`
- `memoryDbReady`
- `codeGraphFreshness`
- `cocoIndexAvailable`
- `agentBootstrapAvailable`
- `recommendedFallback`

Health semantics:
- `ok`: priming completed and delivery is confirmed
- `warning`: priming worked via fallback, or graph/db is degraded
- `stale`: no priming yet, or long inactivity
- `failed`: priming attempted and all fallbacks unavailable

### 4. Build a concrete scenario matrix

Minimum scenarios for each runtime:

1. Cold start, all systems healthy
2. Cold start, empty DB
3. Cold start, stale code graph
4. First call is a non-memory tool with context args
5. First call is a non-memory tool with no context args
6. MCP server unavailable
7. Runtime-specific primary transport unavailable
8. Recovery after `/clear`
9. Recovery after compaction/compression
10. Long-delay timeout / partial results
11. Re-entry after idle session
12. Delivery confirmation check

Runtime-specific additions:
- OpenCode: missing `@context-prime`
- Claude: hooks disabled
- Gemini: hook mode vs tool-fallback mode must both be exercised
- Codex: instruction-following smoke, since there is no native hook enforcement

## Recommendation

Use `session_resume()` as the canonical cross-runtime verification probe, and treat all other priming paths as transport-specific accelerators.

Why:
- it is explicit and deterministic
- it already composes memory, code graph, and CocoIndex
- it degrades with hints instead of failing closed
- it is testable the same way on all four runtimes

Then layer runtime-specific checks on top:
- OpenCode/Copilot should prove orchestrator delegation to `@context-prime`
- Claude should prove hook injection
- Codex should prove first-turn protocol adherence
- Gemini should be treated as tool-fallback-first until the repo resolves the current hook/detection mismatch

The single highest-priority fix is to reconcile Gemini's truth table.
Right now the codebase simultaneously says:
"Gemini has hooks" and "Gemini is disabled_by_scope/tool_fallback."
Cross-runtime reliability cannot be claimed while those two statements coexist.

The second priority is delivery confirmation.
Today the server can know it primed, but not definitively that the runtime consumed the priming payload. Without that, health remains inferred rather than proven.

## Implementation Plan

1. Add static conformance tests for runtime files.
Assert that docs, config, agent definitions, and runtime detection agree for OpenCode/Copilot, Claude, Codex, and Gemini.

2. Add automated MCP priming tests.
Cover:
- first non-memory tool call primes once
- context-free first call yields fallback recommendations
- empty DB / graph-unavailable degraded prime package
- repeated calls do not re-prime
- `ListTools` does not prime, and that behavior is either accepted or fixed

3. Add/expand hook contract tests.
Claude already has useful hook coverage; mirror that for Gemini with real Vitest suites around:
- startup/resume/clear routing
- `hookSpecificOutput.additionalContext`
- compact one-shot injection
- stale cache rejection
- malformed stdin and timeout behavior

4. Add OpenCode orchestrator smoke tests.
Validate that first turn delegates to `@context-prime`, and that missing-agent failure degrades to `session_resume()` rather than silent context loss.

5. Add Codex and Gemini tool-fallback smoke tests.
Use a small scripted harness to simulate first-turn behavior and confirm:
- explicit `session_resume()` works
- first non-memory tool call still auto-primes
- `session_health()` reports the correct degraded/healthy state

6. Extend `session_health()`.
Implement the richer priming-health schema so tests can assert transport, delivery, fallback, and failure reason directly.

7. Resolve Gemini policy mismatch before declaring readiness.
Choose one of two outcomes:
- wire Gemini as a real hook-enabled runtime and check in the runtime integration/config, or
- document it as tool-fallback-first and keep hook scripts as optional/manual capability until integrated

8. Gate release readiness on a runtime matrix.
Require passing results for:
- OpenCode/Copilot: orchestrator + auto-prime
- Claude: hooks + fallback
- Codex: tool-fallback + auto-prime
- Gemini: whichever mode is declared canonical after step 7

Only after that matrix is green should hookless priming be considered cross-runtime reliable.
