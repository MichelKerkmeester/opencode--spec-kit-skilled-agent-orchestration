# Research Iteration 106: Orchestrator Delegation Reliability for @context-prime

## Current State

`@context-prime` is a read-only bootstrap subagent designed to recover memory context, assess code-graph/CocoIndex health, score session health, and return a Prime Package. It is explicitly optimized for fast, best-effort execution: under 30 seconds, and if a tool fails it skips that step and reports it as unavailable. [SOURCE: `.opencode/agent/context-prime.md`]

The OpenCode orchestrator instructs itself to delegate to `@context-prime` "on the first user turn or after /clear" before proceeding with the user request. This is structurally feasible because `@orchestrate` allows single-hop delegation and `@context-prime` is exactly one hop away. [SOURCE: `.opencode/agent/orchestrate.md:18-20`]

However, this mechanism exists only in OpenCode/Copilot. Claude Code, Codex CLI, and Gemini CLI do not use the orchestrator; they instead have inline Session Start Protocols in their runtime instruction files. Separately, the MCP server already has first-call auto-priming, which is server-side and hookless.

## Analysis

### 1. Does delegation actually fire on first turn?

**Answer: only probabilistically, not deterministically.**

Within OpenCode, the instruction to delegate exists, but it is still an agent prompt rule, not a runtime-enforced lifecycle hook. That means first-turn delegation depends on:

- the orchestrator actually being the active top-level agent,
- the model following the bootstrap instruction before acting,
- no higher-priority heuristic deciding to answer immediately,
- no prompt dilution from the user's request or surrounding system instructions.

So the current reliability is **medium inside OpenCode, zero outside OpenCode, and lower than MCP/server-side priming or true runtime hooks**.

The strongest evidence against "guaranteed firing" is that nothing in the provided material indicates an engine-level event like `onSessionStart` or `beforeFirstTurn`; it is an instruction embedded in an LLM-controlled workflow. By contrast, MCP first-call auto-priming happens when the tool is invoked, independent of whether the agent "remembers" to bootstrap.

### 2. What are the main failure modes?

The delegation path can miss or degrade in several ways:

- **Instruction noncompliance:** the orchestrator may skip delegation and answer directly.
- **Urgency override:** a highly actionable first message may cause the orchestrator to jump into execution.
- **Latency aversion:** a full prime adds startup delay, especially if multiple MCP/tool checks are involved.
- **Best-effort degradation:** `@context-prime` is allowed to skip failed calls, so even when it fires, the Prime Package may be partial.
- **No-orchestrator path:** OpenCode may sometimes proceed through direct tool use or other routing, bypassing orchestrator bootstrap entirely.

### 3. What if the user's first message is urgent?

This is where the current wording is weakest.

The orchestrator says to delegate first, *before* proceeding. That makes priming effectively **blocking by default**. For urgent first-turn requests, that is risky:

- it adds avoidable latency,
- it may delay a time-sensitive action that does not need full context,
- it can create a worse user experience if the user asked for an immediate fix, check, or command.

Because `@context-prime` is read-only and advisory, blocking on it is a UX choice, not a correctness requirement. Correctness is already better covered by MCP first-call auto-priming, which primes at the tool layer once real work begins.

So for urgent first messages, **blocking delegation is likely the wrong default**.

### 4. Can priming be non-blocking?

**Yes architecturally, but not in the current orchestrator wording.**

Right now the instruction says: delegate first, then proceed. That implies a synchronous dependency.

But the system already has two properties that make non-blocking priming viable:

- `@context-prime` is read-only and produces advisory context, not mutations.
- MCP first-call auto-priming already covers the correctness-critical "make session state available before tool work" path.

That means OpenCode could safely shift `@context-prime` from **required preflight** to **best-effort sidecar**:

- urgent path: proceed immediately, rely on MCP auto-priming for correctness,
- normal path: run a fast prime first or in parallel,
- background path: attach the Prime Package once available.

### 5. Comparison with Claude Code hooks

Claude Code hooks are stronger because they sit **outside model deliberation**. A hook-based bootstrap is closer to deterministic infrastructure:

- it fires at a defined lifecycle point,
- it is not subject to prompt drift,
- it does not depend on agent obedience,
- it can be measured and enforced centrally.

By comparison, orchestrator delegation to `@context-prime` is a **soft policy**. It is useful for portability in hookless environments, but it is inherently less reliable.

So the ordering is roughly:

- **Highest reliability:** runtime hook
- **Next highest:** server-side MCP first-call auto-priming
- **Lower:** orchestrator prompt-level delegation to `@context-prime`

This does not make `@context-prime` useless; it just means it should not be the sole reliability mechanism.

## Proposals

### Proposal 1: Reframe `@context-prime` as best-effort UX bootstrap, not mandatory correctness gate
**Effect:** High reliability gain, low implementation risk
**Why:** MCP first-call auto-priming already covers correctness better than prompt-level delegation.
**Change:** Update orchestrator instructions from "delegate before proceeding" to "delegate when latency budget allows; otherwise proceed and rely on MCP auto-priming."
**Estimated LOC:** 10-20 LOC prompt/doc change

### Proposal 2: Add urgency-aware bootstrap policy
**Effect:** High UX gain
**Why:** Urgent first-turn requests should not wait for a full prime.
**Policy:**
- If first message is urgent/action-oriented, do minimal or no blocking prime.
- If normal exploratory request, run `@context-prime` first.
- If `/clear`, prefer prime unless the user explicitly asks to skip it.
**Estimated LOC:** 20-40 LOC prompt logic, 40-80 LOC if implemented with structured classifier/routing support

### Proposal 3: Collapse context-prime startup to `session_resume()` fast path
**Effect:** Medium reliability and latency gain
**Why:** The agent spec already notes `session_resume` as an alternative to steps 1-3. Making that the default reduces tool-call count and surface area for partial failure.
**Change:** Prefer one-call resume, then optionally call `session_health` only if needed.
**Estimated LOC:** 5-15 LOC in agent prompt; 0 LOC if server support already exists and is stable

### Proposal 4: Make `@context-prime` non-blocking when orchestration runtime supports async/background subagents
**Effect:** High UX gain, moderate engineering cost
**Why:** User gets immediate action while Prime Package arrives shortly after.
**Change:** Spawn `@context-prime` in background on first turn; continue handling request; merge Prime Package when returned.
**Estimated LOC:** 60-120 LOC runtime/plumbing, plus 10-20 LOC prompt updates

### Proposal 5: Add explicit bootstrap state/telemetry
**Effect:** High observability gain
**Why:** Today reliability is hard to measure.
**Change:** Track fields like:
- `bootstrap_attempted`
- `bootstrap_source` (`context-prime`, `mcp-auto-prime`, `hook`)
- `bootstrap_blocking`
- `bootstrap_duration_ms`
- `bootstrap_completeness`
**Estimated LOC:** 40-90 LOC depending on where telemetry is recorded

### Proposal 6: Require machine-readable Prime Package output
**Effect:** Medium composability gain
**Why:** Structured output makes it easier for orchestrator/runtime to consume partial results safely.
**Suggested fields:** `resumed`, `memory_ok`, `graph_ok`, `ccc_ok`, `session_health`, `degraded`, `notes`.
**Estimated LOC:** 15-30 LOC prompt/output contract; 30-60 LOC if parser validation is added

## Recommendation

Treat orchestrator delegation to `@context-prime` as **helpful but not reliable enough to be the primary priming guarantee**.

The dependable hookless strategy should be:

- **Primary correctness layer:** MCP first-call auto-priming
- **Secondary UX/context layer:** `@context-prime`
- **Best possible environments:** runtime hooks, where available

In practical terms:

- For normal first-turn requests, keep `@context-prime`, but make it fast-path and preferably `session_resume()`-first.
- For urgent first-turn requests, do **not** block on `@context-prime`; rely on MCP auto-priming and optionally run `@context-prime` in the background.
- For system design and docs, describe `@context-prime` as **best-effort bootstrap** rather than guaranteed session initialization.

This gives better latency, clearer guarantees, and less confusion about what actually ensures state availability.

## Implementation Plan

1. Update `.opencode/agent/orchestrate.md` so first-turn bootstrap is **latency-aware**, not unconditional.
   Estimated change: 10-20 LOC.

2. Update `.opencode/agent/context-prime.md` to make `session_resume()` the default fast path, with deeper checks only when budget allows.
   Estimated change: 5-15 LOC.

3. Introduce a simple urgency rule in orchestrator guidance:
   - urgent/action request -> skip blocking prime,
   - exploratory/context-heavy request -> run prime first.
   Estimated change: 20-40 LOC.

4. Add bootstrap telemetry so the team can measure actual first-turn delegation rate versus MCP auto-prime coverage.
   Estimated change: 40-90 LOC.

5. If runtime supports it, implement background `@context-prime` dispatch and Prime Package merge.
   Estimated change: 60-120 LOC.

6. Update docs to state the reliability hierarchy explicitly:
   `hooks > MCP auto-prime > orchestrator delegation`.
   Estimated change: 10-20 LOC.

**Total estimated effort:**
- **Minimal prompt-only optimization:** 35-75 LOC
- **Prompt + telemetry:** 75-165 LOC
- **Full non-blocking implementation:** 135-285 LOC
