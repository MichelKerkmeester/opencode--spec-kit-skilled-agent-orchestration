# Deep-Research Iteration Prompt Pack — Stream-02 Iteration 3

## STATE

state_summary:
- Iterations completed: 2 / 8
- Resolved questions: 2 (Q3, Q4)
- Open questions: 3 (Q1, Q2, Q5)
- Last newInfoRatio: 0.78 (insight)
- Rolling avg newInfoRatio (last 2): 0.82
- Convergence score: still low (only 2 of 8 iterations).

Research Topic: Identify reusable patterns from opencode-swarm-main that inform a new `@code` LEAF agent for `.opencode/agent/`.

Iteration: 3 of 8

Focus Area: **Q5 — sub-agent dispatch contracts.** Iter 1 surfaced `DelegationEnvelope` (`src/types/delegation.ts:6`) with fields `taskId`, `targetAgent`, `action`, `commandType`, `files`, `acceptanceCriteria`, `technicalContext`. Iter 2 surfaced `delegation-gate.ts` validates target+command type and blocks `slash_command` delegation. Now go deeper:

1. **Payload completeness**: full schema of `DelegationEnvelope` and any sibling types. What does `commandType` enumerate? What does `action` enumerate? Is there a response/result envelope?
2. **Dispatch invocation**: how does the architect ACTUALLY hand off to a worker? Is it via the `Task` tool with a stringified envelope, a SDK call, or a queue? Find the call site(s).
3. **Depth bounds**: can a worker dispatch another worker? We know the SDK config blocks it (no permission.task on subagents) — is there ALSO a runtime depth-counter or generation field in the envelope? Look in `delegation-gate.ts`, `architect.ts`, and `parallel/`.
4. **Response contract**: when a worker finishes, what shape does it return? Does the architect get structured output or just text? Look for response types, `taskId` echoing, completion hooks.
5. **Concurrency**: anything in `src/parallel/` about concurrent worker fan-out? Bounded worker pools? Rate limits?

Remaining Key Questions:
- Q1: skill auto-loading patterns
- Q2: stack-agnostic detection
- Q5: sub-agent dispatch contracts (THIS ITERATION)

Last 3 Iterations Summary:
- Iter 1 (Q3 caller-restriction): RESOLVED. Architect-only Task permission via `getAgentConfigs` in `src/agents/index.ts:651`. Suffix classifier `name === "architect" || name.endsWith("_architect")` (with overmatch caveat per `architect-permission.adversarial.test.ts:123`). Tool whitelist `src/config/constants.ts:48` reinforces. Coder prompt forbids delegation (`src/agents/coder.ts:3`). Delegation envelope validation `src/hooks/delegation-gate.ts:238`.
- Iter 2 (Q4 write-safety): RESOLVED multi-layered. `declare_scope` tool seeds scope; `scope-guard.ts` blocks Edit/Write/Patch outside declared scope (per-tool-name allowlist in WRITE_TOOL_NAMES at `src/hooks/scope-guard.ts:20`); `guardrails.ts` enforces role authority (`src/hooks/guardrails.ts:2072+`, `:3325+`); `diff-scope.ts` is post-hoc advisory (`:107`); coder recovery protocol BLOCKED/NEED format (`src/agents/coder.ts:111-125`). KNOWN GAP: Bash/interpreter writes bypass scope-guard (`src/hooks/scope-guard.ts:20-24`, `src/scope/scope-persistence.ts:26-30`, `src/tools/declare-scope.ts:337-343`). Mismatch: prompt says missing scope blocks all writes; tests show no-scope falls through scope-guard early-return (`src/hooks/scope-guard.test.ts:108-132`).

## STATE FILES

All paths relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- Config: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/iterations/iteration-003.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deltas/iter-003.jsonl`

## EXTERNAL SOURCE

External codebase: `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`. Read-only.

Hot leads:
- `src/types/delegation.ts` (full read)
- `src/hooks/delegation-gate.ts` (full read — esp. validation rules)
- `src/agents/architect.ts` — search for `delegateToCoder`, `Task`, `subagent`, `run_task`, dispatch invocation
- `src/parallel/` — list, read main files
- `src/types/` — list other related types (e.g., `result.ts`, `response.ts`)
- `src/agents/index.ts` near 651 and after — what wires the dispatch surface

## CONSTRAINTS

- LEAF. No sub-agent dispatch.
- 3-5 actions, max 12 tool calls.
- Citations `path:line` relative to external folder.
- Stay focused on Q5.

## OUTPUT CONTRACT

THREE artifacts required (same shape as iter 1 and 2):
1. `iterations/iteration-003.md` — narrative.
2. APPEND `{"type":"iteration","iteration":3,...}` to state log.
3. `deltas/iter-003.jsonl` — iteration record + per-finding records.

Begin now.
