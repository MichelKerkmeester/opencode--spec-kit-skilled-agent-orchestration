# Deep-Research Iteration Prompt Pack — Stream-02 Iteration 1

## STATE

state_summary:
- Packet: stream-02 — opencode-swarm-main architect-led swarm patterns
- Iterations completed: 0 / 8
- Open questions: 5 (Q1..Q5, all unanswered)
- Last newInfoRatio: n/a (first iteration)
- Convergence score: 0.00 (not started)

Research Topic: Identify reusable patterns from the opencode-swarm-main architect-led swarm framework that inform the design of a new `@code` LEAF agent for our `.opencode/agent/` inventory. Focus on (1) skill auto-loading patterns, (2) stack-agnostic detection, (3) caller-restriction enforcement (highest priority), (4) write-capable safety guarantees, (5) sub-agent dispatch contracts.

Iteration: 1 of 8

Focus Area: **Q3 — caller-restriction enforcement.** Inspect how the architect agent dispatches workers and what HARNESS-LEVEL mechanism (env vars, dispatch protocol fields, frontmatter, runtime guards, permission checks) ensures workers can ONLY be invoked by the architect, not directly by the user or other workers. Start with `src/agents/architect.ts`, `src/agents/architect-permission.adversarial.test.ts`, `src/agents/coder.ts`, and `src/agents/index.ts` — the adversarial test name strongly suggests there is an enforced permission boundary.

Remaining Key Questions:
- Q1: skill auto-loading patterns (how workers pick up skill/context based on dispatch)
- Q2: stack-agnostic detection (does swarm assume a stack, or do workers detect/probe?)
- Q3: caller-restriction enforcement (HIGHEST PRIORITY — find the concrete mechanism)
- Q4: write-capable safety guarantees (scope-drift / overwrite prevention)
- Q5: sub-agent dispatch contracts (architect→worker payload structure, depth bounds, response contract)

Last 3 Iterations Summary: none (first iteration).

## STATE FILES

All paths are relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- Config: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deltas/iter-001.jsonl`

## EXTERNAL SOURCE

The codebase to investigate is at `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`. Treat that folder as READ-ONLY external research material. ALL file:line citations in your findings must come from there.

Key entrypoints to start with for this iteration:
- `src/agents/architect.ts` (2038 lines — the architect coordinator)
- `src/agents/architect-permission.adversarial.test.ts` (260 lines — adversarial tests of permission enforcement)
- `src/agents/coder.ts` (235 lines — a worker; relevant to caller-restriction surface area)
- `src/agents/index.ts` (agent registry / dispatch surface)
- `src/parallel/` (any per-worker dispatch wrappers)
- `src/hooks/` (any hook-level enforcement)
- `src/council/` (council protocol may carry caller-restriction primitives)

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total this iteration.
- Write ALL findings to files. Do not hold in context.
- Stay focused on Q3 this iteration; touch other questions only if directly load-bearing for Q3.
- Citations MUST be `path:line` format with the path relative to `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/` (e.g. `src/agents/architect.ts:412`).

## OUTPUT CONTRACT

You MUST produce THREE artifacts.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/iterations/iteration-001.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. Each finding must include a file:line citation.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"caller-restriction enforcement","questionsAnsweredThisIter":["Q3"|...],"keyFindingsCount":<int>}
```

Append via single-line JSON with newline terminator. Do NOT pretty-print.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deltas/iter-001.jsonl`. Contents: one `{"type":"iteration",...}` record (same as state-log append) plus per-event records:

```json
{"type":"finding","id":"f-iter001-001","question":"Q3","severity":"P0|P1|P2","label":"...","citation":"src/agents/architect.ts:NNN","iteration":1}
{"type":"observation","id":"obs-iter001-001","label":"...","iteration":1}
```

All three artifacts are REQUIRED. If any is missing or malformed the iteration will be re-run.

Begin now.
