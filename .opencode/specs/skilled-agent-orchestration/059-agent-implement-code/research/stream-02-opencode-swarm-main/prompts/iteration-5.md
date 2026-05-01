# Deep-Research Iteration Prompt Pack — Stream-02 Iteration 5

## STATE

state_summary:
- Iterations completed: 4 / 8
- Resolved questions: 4 (Q1, Q3, Q4, Q5)
- Open questions: 1 (Q2)
- Last newInfoRatio: 0.72 (insight)
- Rolling avg (last 3): 0.75
- Convergence score: rising; if Q2 resolves cleanly we should hit stop signals.

Research Topic: Identify reusable patterns from opencode-swarm-main that inform a new `@code` LEAF agent for `.opencode/agent/`.

Iteration: 5 of 8

Focus Area: **Q2 — stack-agnostic detection.** Does the swarm assume a particular stack (TS/JS, Go, Python, etc.) or do workers detect/probe the project they are operating on? Look for:

1. Marker-file readers (e.g., presence of `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `next.config.*`, `wrangler.toml`)
2. Auto-detection logic in `src/lang/` (the dir name strongly suggests language detection)
3. Stack-specific assumptions in `src/agents/coder.ts`, `src/agents/test-engineer.ts`, build/test/lint commands
4. Configuration knobs in `src/config/` schema for declaring stack
5. Coder/architect prompt — does it bake in TS/Node patterns, or is it stack-neutral?
6. Any `detect`, `probe`, `marker`, `framework`, or `stack` keyword across `src/`

Treat this as both a discovery and a "rule out" question: if swarm baked in TS-only assumptions, that's a finding (architectural pattern: pick a stack at framework boundaries, not in the worker). If it has explicit detection, capture the mechanism with citations.

Remaining Key Questions:
- Q2: stack-agnostic detection (THIS ITERATION)

Last 3 Iterations Summary:
- Iter 2 (Q4): RESOLVED. `declare_scope` → `scope-guard.ts` (Edit/Write/Patch only) + `guardrails.ts` role authority + `diff-scope.ts` post-hoc warning + coder STOP/BLOCKED/NEED protocol. Bash bypass is a documented gap.
- Iter 3 (Q5): RESOLVED. Dispatch is OpenCode `Task` tool + structured prompt; `DelegationEnvelope` carries `taskId/targetAgent/action/commandType/files/acceptanceCriteria/technicalContext`; depth bounded by Task permission only (no envelope generation/depth field); workflow advance is hook-driven not return-envelope-driven; `parallel/dispatcher/` mostly no-op by default.
- Iter 4 (Q1): RESOLVED — no literal skill auto-loader. Knowledge subsystem (`src/knowledge/`), context filter (`src/context/role-filter.ts`), `technicalContext` is unstructured string. Pattern: orchestrator declares context explicitly + hook-injected scope-keyed knowledge + role filter. `/swarm knowledge` is operational management, not dispatch-time loader.

## STATE FILES

All paths relative to repo root.

- Config / State Log / Strategy / Registry: in `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/`
- Write iteration narrative to: `iterations/iteration-005.md`
- Write per-iteration delta file to: `deltas/iter-005.jsonl`

## EXTERNAL SOURCE

`.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`. Read-only.

Hot leads:
- `src/lang/` — list dir, read entrypoints, this is the strongest signal
- `src/config/schema.ts` — search for `language`, `stack`, `framework`, `runtime`, `targetLanguage`
- `src/agents/coder.ts` — re-read with stack-detection lens; check whether commands like `bun`, `npm`, `pytest`, `go test` are mentioned
- `src/agents/test-engineer.ts` — same lens
- `src/cli/` — root entrypoint may probe project markers
- `package.json` of swarm itself (path `package.json` at swarm root) — see if it self-bundles language detection deps
- Any test files in `src/lang/` or `src/__tests__/`

## CONSTRAINTS

- LEAF. No sub-agent dispatch.
- 3-5 actions, max 12 tool calls.
- Citations `path:line` relative to external folder.
- Stay focused on Q2.

## OUTPUT CONTRACT

Same shape: iteration-005.md narrative, JSONL append to state log, deltas/iter-005.jsonl.

Begin now.
