# Deep-Research Iteration Prompt Pack — Stream-02 Iteration 2

## STATE

state_summary:
- Packet: stream-02 — opencode-swarm-main architect-led swarm patterns
- Iterations completed: 1 / 8
- Open questions: 4 (Q1, Q2, Q4, Q5)
- Resolved questions: 1 (Q3 — caller-restriction is enforced via generated OpenCode SDK config: architects = primary + permission.task=allow; workers = subagent without task; classifier is suffix-based on `_architect`)
- Last newInfoRatio: 0.86 (insight)
- Convergence score: low (only one iteration done)

Research Topic: Identify reusable patterns from the opencode-swarm-main architect-led swarm framework that inform the design of a new `@code` LEAF agent for our `.opencode/agent/` inventory.

Iteration: 2 of 8

Focus Area: **Q4 — write-capable safety guarantees.** Iter 1 surfaced two adjacent surfaces worth focused inspection: (a) `declare_scope` + scope-guard pattern referenced in `src/agents/architect.ts:1186` and the architect-to-coder dispatch protocol, and (b) the write-blocked protocol referenced in `src/agents/coder.ts:111` (no shell redirection, no interpreter writes). Find the concrete enforcement: scope declaration shape, allowed-paths config, the hook(s) that block out-of-scope writes, and the coder write-blocked recovery protocol. Pull file:line citations from `src/hooks/`, `src/agents/coder.ts`, `src/agents/architect.ts`, and any `scope-guard` / `diff-scope` modules.

Remaining Key Questions:
- Q1: skill auto-loading patterns (how workers pick up skill/context based on dispatch)
- Q2: stack-agnostic detection (does swarm assume a stack, or do workers detect/probe?)
- Q4: write-capable safety guarantees (THIS ITERATION)
- Q5: sub-agent dispatch contracts (architect→worker payload structure, depth bounds, response contract)

Last 3 Iterations Summary:
- Iter 1 (Q3 caller-restriction): Resolved. Architect-only Task permission via generated OpenCode SDK config (`src/agents/index.ts:651`). Adversarial test asserts default workers lack task permission (`src/agents/architect-permission.adversarial.test.ts:43`). Suffix-based classifier (`name === "architect" || name.endsWith("_architect")`) overmatches `_architect`/`__architect`/`not_an_architect` — explicit caveat for our @code agent name. Tool whitelist in `src/config/constants.ts:48` reinforces but does not replace the boundary. `declare_scope`-required architect prompt (`src/agents/architect.ts:1186`) and coder no-delegation prompt (`src/agents/coder.ts:3`) are role-discipline reinforcers. Delegation envelope validation (`src/hooks/delegation-gate.ts:238`) constrains target+command type but is post-authorization.

## STATE FILES

All paths are relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- Config: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/iterations/iteration-002.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deltas/iter-002.jsonl`

## EXTERNAL SOURCE

External codebase: `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`. Read-only.

Hot leads for this iteration:
- `src/hooks/` — list, then read scope-guard / diff-scope / write-gate hooks
- `src/agents/architect.ts` — search for `declare_scope`, `scope`, `diff` near and after line 1186
- `src/agents/coder.ts` — read full file, especially write-blocked protocol around line 111
- `src/types/delegation.ts` — does the envelope carry an allowed-paths field?
- Any test files matching `*scope*`, `*write*`, or `*diff*scope*`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch.
- 3-5 research actions, max 12 tool calls.
- Write ALL findings to files. Citations `path:line` relative to the external folder.
- Stay focused on Q4. Touch other questions only if directly load-bearing.

## OUTPUT CONTRACT

Same as iter 1. THREE artifacts:
1. `iterations/iteration-002.md` — narrative with Focus, Actions Taken, Findings (file:line cites), Questions Answered, Questions Remaining, Next Focus.
2. APPEND `{"type":"iteration","iteration":2,...}` line to `deep-research-state.jsonl`.
3. `deltas/iter-002.jsonl` — iteration record + per-finding/observation records.

Begin now.
