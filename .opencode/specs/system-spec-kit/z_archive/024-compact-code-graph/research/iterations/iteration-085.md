# Iteration 85: Codex CLI Session Start Protocol and @context Auto-Trigger Design

## Focus
Read `CODEX.md` and the full `.codex/agents/*.toml` runtime set to determine how Codex CLI currently handles startup context, where code graph tools are mentioned, and what instruction-only changes would force `memory_context()` and `code_graph_status()` to run at session start. The primary design target is `CODEX.md`, with specific TOML additions for the `@context` agent.

## Findings

### 1. Current CODEX.md supports compaction recovery, not true session-start priming
`CODEX.md` currently defines an "After Context Compaction" flow that tells the agent to call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`, review recovered state, re-read the instruction files, and wait. It also contains query-intent routing and an MCP tool list that includes Code Graph tools, but it does not define a mandatory first-turn protocol for brand-new sessions. `code_graph_status()` appears only in the available-tools list, not as a required startup action.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md:5-31]

### 2. Codex has 10 local agents, but several startup-related instructions are still framed around Claude hook semantics
The Codex runtime contains 10 agents: `context`, `debug`, `deep-research`, `deep-review`, `handover`, `orchestrate`, `review`, `speckit`, `ultra-think`, and `write`. Several of these agents still use wording such as "hook-injected context" or "Claude Code SessionStart hook", then fall back to `memory_context(...resume...)` plus `memory_match_triggers()`. That fallback is useful, but it does not create a Codex-native first-turn trigger, so the runtime remains dependent on the agent remembering to do startup recovery.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml:1-6; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/debug.toml:1-6; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/deep-research.toml:1-6,425-429; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/deep-review.toml:1-7,536-538; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/handover.toml:1-7,312-316; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/orchestrate.toml:1-7,831-846; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/review.toml:1-6; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/speckit.toml:1-7,559-561; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/ultra-think.toml:1-6; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/write.toml:1-6]

### 3. `@context` is memory-first and structurally aware, but it does not prime code graph readiness
`@context` already mandates "MEMORY FIRST", runs a default retrieval sequence, and routes structural questions to `code_graph_query` / `code_graph_context`. However, its tool table and default sequence never mention `code_graph_status()`, so the agent can decide to use graph tools without first learning whether the structural index exists or is stale. Because `@context` is the exclusive exploration entry point, this is the sharpest instruction-level insertion point for automatic code graph warmup.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml:29-36,44-56,96-98,108-118,337-343]

### 4. `@deep-research` also lacks a Codex-specific graph warmup step
`@deep-research` includes the same hook-oriented fallback clause as other agents: use hook-injected context if present; otherwise call `memory_context({ mode: "resume", profile: "resume" })` and then `memory_match_triggers()`. It routes structural questions to code graph tools, but it never checks `code_graph_status()` either. This means even the research workflow assumes graph availability implicitly instead of establishing graph readiness explicitly at iteration start.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/deep-research.toml:223,425-429]

### 5. Recommended CODEX.md Session Start Protocol: force memory recovery and graph readiness before substantive work
The cleanest non-hook Codex mechanism is to add a mandatory session-start block to `CODEX.md`, because `CODEX.md` is already the Codex-specific instruction surface for recovery behavior. The protocol should force both required startup calls:

```markdown
## Session Start Protocol (MANDATORY)

On the FIRST assistant turn of every Codex session, before exploring files,
answering architecture questions, or starting implementation:

1. Call `memory_context({ input: "<user request>", mode: "auto" })`.
2. Call `code_graph_status()`.
3. If the request is clearly a resume/continue/previous-work prompt, replace step 1 with:
   `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`.
4. Treat the outputs of steps 1-2 as baseline session context.
5. If `code_graph_status()` reports a usable index, prefer `code_graph_query` /
   `code_graph_context` for structural questions.
6. If the graph is missing or stale, note that immediately and either:
   - run `code_graph_scan({ incremental: true })` before structural work, or
   - fall back to CocoIndex / Glob / Grep until a refresh is justified.

Do NOT skip this protocol unless equivalent context was already injected by a higher-priority mechanism.
```

This design forces the two required calls (`memory_context`, `code_graph_status`) without forcing an expensive graph scan on every session.

[INFERENCE: based on /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md:5-31 and /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml:29-36,96-98,337-343 and /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/deep-research.toml:425-429]

### 6. Recommended `@context` TOML additions: add a first-turn "SESSION PRIME" step and make `code_graph_status()` explicit
The most targeted `context.toml` changes are instructional, not architectural:

1. **Core workflow** -- insert a first-turn session-prime step:

```markdown
1. **SESSION PRIME** → On the first turn of a Codex session, call
   `memory_context({ input: topic, mode: "auto" })`, then `code_graph_status()`
2. **MEMORY FIRST** → Continue with memory/code retrieval using the session-prime outputs
3. **CODEBASE SCAN** → ...
```

2. **Default tool sequence** -- change it from
`memory_match_triggers -> memory_context -> CocoIndex ...`
to:

```markdown
`memory_context(auto/focused)` → `code_graph_status()` → optional `memory_match_triggers`
→ `CocoIndex search` → `code_graph_query` / `code_graph_context` (when structural intent exists)
→ `Glob` → `Grep` → `Read` → conditional `memory_search`
```

3. **New subsection near routing** -- add an explicit first-turn trigger rule:

```markdown
### First-Turn Session Prime (MANDATORY)
If this session does not already include equivalent injected context:
- Call `memory_context({ input: topic, mode: "auto" })`
- Call `code_graph_status()`
- If the prompt names files, symbols, imports, callers, or repository structure,
  prefer immediate structural expansion via `code_graph_context(...)` or `code_graph_query(...)`
- If `code_graph_status()` reports unavailable or stale graph data, note that explicitly before falling back
```

4. **Tool inventory cleanup** -- add `code_graph_status` to the visible tool list so the documented capability scan matches the routing rules that already reference graph tools.

These additions keep startup cost small, make graph freshness observable, and push Codex exploration toward structural context when it is actually available.

[INFERENCE: based on /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml:29-36,44-56,96-98,108-118,337-343]

## Ruled Out
- **Relying on Claude-style SessionStart hooks in Codex** -- several agents mention hook-injected context, but the inspected Codex runtime surface is instruction-file driven, not hook-driven. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md:5-31; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/deep-research.toml:425-429; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/orchestrate.toml:831-846]
- **Forcing `code_graph_scan()` on every session start** -- too aggressive for non-hook startup; `code_graph_status()` should be mandatory, while scan/refresh remains conditional on stale/missing status or a structurally heavy task. [INFERENCE: based on /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md:27-31 and /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml:96-98,337-343]
- **Limiting the change to `@deep-research` only** -- exploration is supposed to route through `@context`, so the main auto-trigger belongs in `CODEX.md` plus `@context`, not only in a specialized research agent. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml:11-15,27-36]

## Dead Ends
- No new dead ends. The key limitation remains structural: Codex lacks Claude-style lifecycle hooks, so startup behavior must be enforced through instruction files and agent workflow text instead of event callbacks. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md:5-31; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/deep-research.toml:425-429]

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md:5-31`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml:1-6,29-36,44-56,96-98,108-118,337-343`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/deep-research.toml:1-6,223,425-429`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/orchestrate.toml:831-846`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/handover.toml:312-316`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/speckit.toml:559-561`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/deep-review.toml:536-538`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/debug.toml:1-6`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/review.toml:1-6`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/write.toml:1-6`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/ultra-think.toml:1-6`

## Assessment
- New information ratio: 0.83
- Questions addressed: current `CODEX.md` startup behavior, current `.codex/agents` inventory, MCP/code graph references across agents, concrete `CODEX.md` session-start protocol, concrete `@context` TOML additions
- Questions answered: `CODEX.md` currently lacks a mandatory session-start graph warmup, Codex agents currently rely on Claude-oriented fallback wording rather than Codex-native priming, and the cleanest enforcement point is `CODEX.md` + `@context`

## Reflection
- What worked and why: Reading `CODEX.md` plus the actual Codex TOML agent files exposed the precise gap between "tool is available" and "tool is automatically primed", which higher-level runtime comparisons blur away.
- What did not work and why: Searching only for "MCP" would have missed the more important pattern. The real gap is not server registration; it is startup choreography and the absence of an explicit Codex-native first-turn prime.
- What I would do differently: In a follow-up pass, inspect the Codex runtime loader (if present) to verify exactly when `CODEX.md` and per-agent `developer_instructions` are merged, which would help decide whether `CODEX.md` or `@context` should carry the strongest wording.

## Recommended Next Focus
Cross-runtime enforcement comparison: verify how the same first-turn `memory_context() + code_graph_status()` contract should be mirrored across `AGENTS.md`, `GEMINI.md`, and `CODEX.md` so non-hook runtimes share one startup rule while Claude keeps hook injection as the fast path.
