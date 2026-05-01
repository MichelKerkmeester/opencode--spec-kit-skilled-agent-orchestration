# Deep-Research Iteration Prompt Pack — Stream-02 Iteration 4

## STATE

state_summary:
- Iterations completed: 3 / 8
- Resolved questions: 3 (Q3, Q4, Q5)
- Open questions: 2 (Q1, Q2)
- Last newInfoRatio: 0.74 (insight)
- Rolling avg (last 3): 0.79
- Convergence score: still rising; stop signals not yet met.

Research Topic: Identify reusable patterns from opencode-swarm-main that inform a new `@code` LEAF agent for `.opencode/agent/`.

Iteration: 4 of 8

Focus Area: **Q1 — skill auto-loading patterns.** How do swarm worker agents pick up skills/contexts based on architect dispatch? Possible mechanisms: prompt-injected skill catalog, knowledge/cache subsystem, runtime skill loader, agent-mode-specific skills, scope-based skill selection, file-based skill auto-detection. Look in:

1. `src/knowledge/` — subsystem name suggests skill/context loading
2. `src/agents/architect.ts` — search for "skill", "knowledge", "context", "load" near and after dispatch points
3. `src/agents/coder.ts` — does the worker prompt reference loaded skills?
4. `src/context/` if it exists — context assembly likely happens here
5. `src/hooks/` for any `*-loader`, `*-cache`, `*-context` hook
6. `src/commands/` for any skill-related command (`skills.ts`, `knowledge.ts`)
7. The delegation envelope's `technicalContext` field (per Q5 iter-3 finding) — is this where skills land?

Treat "skill" liberally: in opencode-swarm the analogue may be called knowledge, capability, role expertise, or scope. The question is: at dispatch time, what extra context lands inside the worker beyond the static prompt + envelope?

Remaining Key Questions:
- Q1: skill auto-loading patterns (THIS ITERATION)
- Q2: stack-agnostic detection

Last 3 Iterations Summary:
- Iter 1 (Q3): RESOLVED. Architect-only Task permission via `getAgentConfigs` (`src/agents/index.ts:651`); suffix classifier `_architect` (with overmatch caveat, `architect-permission.adversarial.test.ts:123`); tool whitelist (`src/config/constants.ts:48`); coder no-delegation prompt (`src/agents/coder.ts:3`); delegation envelope validation (`src/hooks/delegation-gate.ts:238`).
- Iter 2 (Q4): RESOLVED multi-layered. `declare_scope` seeds scope (`src/tools/declare-scope.ts:337-343`, with explicit Bash bypass warning); `scope-guard.ts:8-136` blocks Edit/Write/Patch outside scope (Bash/interpreter NOT in WRITE_TOOL_NAMES — known gap at `:20-24`); `guardrails.ts:2072+` enforces role authority and `:3325+` per-role allowed-prefix rules; `diff-scope.ts:1-133` is post-hoc advisory; coder recovery format (`coder.ts:111-125`).
- Iter 3 (Q5): RESOLVED. Dispatch is OpenCode `Task` tool with structured prompt text (NOT a typed queue or repo-owned worker SDK call). `DelegationEnvelope` (`src/types/delegation.ts:6`) carries `taskId`, `targetAgent`, `action` (string, unconstrained), `commandType`, `files`, `acceptanceCriteria`, `technicalContext`. Validation (`src/hooks/delegation-gate.ts:238`) blocks `slash_command` delegation + invalid targets. Workflow advancement is hook-driven (`delegation-gate.ts:830-858`) not return-envelope-driven. `parallel/dispatcher/` exists (`parallel-dispatcher.ts`) but defaults to no-op (`maxConcurrentTasks=1`); council parallel dispatch is prompt-instructed (`architect.ts:1522-1548`). No depth/generation field in envelope — depth is enforced by Task permission only.

## STATE FILES

All paths relative to repo root.

- Config / State Log / Strategy / Registry: in `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/`
- Write iteration narrative to: `iterations/iteration-004.md`
- Write per-iteration delta file to: `deltas/iter-004.jsonl`

## EXTERNAL SOURCE

`.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`. Read-only.

Specific entrypoints to check this iteration:
- `src/knowledge/` (list dir, read top-level entrypoints)
- `src/context/` if it exists (probe `ls`)
- `src/agents/architect.ts` text search: `loadSkill`, `skill`, `knowledge`, `context`, `loadContext`, `assembleContext`, `getKnowledge`
- `src/agents/coder.ts` text search: `skill`, `knowledge`, `context`
- `src/hooks/` look for any `*context*`, `*knowledge*`, `*skill*`, `*loader*` files
- `src/commands/` look for `skills.ts`, `knowledge.ts`, `context.ts`
- `src/types/delegation.ts` review `technicalContext` field shape

## CONSTRAINTS

- LEAF. No sub-agent dispatch.
- 3-5 actions, max 12 tool calls.
- Citations `path:line` relative to external folder.
- Stay focused on Q1.
- If swarm has no analogue to "skills" at all, that itself is a finding (rule it out, capture as observation).

## OUTPUT CONTRACT

Same shape: iteration-004.md narrative, JSONL append to state log, deltas/iter-004.jsonl.

Begin now.
