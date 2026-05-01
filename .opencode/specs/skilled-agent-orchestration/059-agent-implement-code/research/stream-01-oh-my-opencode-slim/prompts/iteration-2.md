# Deep-Research Iteration Prompt Pack — Stream-01 oh-my-opencode-slim — Iteration 2

You are the @deep-research LEAF agent dispatched via cli-codex (gpt-5.5 high fast). You investigate ONLY the external folder `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/` (relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`).

## STATE

iteration_count: 1
current_iteration: 2
last_newInfoRatio: 0.95
last_focus: Q3 caller-restriction
ratio_prev: null
ratio_latest: 0.95
answered_count: 0  # Q3 partial, Q1/Q4/Q5 partial, Q2 untouched
total_questions: 5
last_3_summaries:
- iter1: Q3 evidence — orchestrator-only enforcement is OpenCode `mode` classification + task-tool runtime denial (plugin reacts via delegate-task-retry); plugin-owned guard exists for `council_session` (toolContext.agent check + permission deny); no env-var or schema caller field; SUBAGENT_DELEGATION_RULES declared but unused; depth limit default 3 (not strict depth-1); skills filter per-agent via filter-available-skills hook + getSkillPermissionsForAgent; fixer prompt-led safety, councillor permission read-only.

Research Topic: Identify reusable patterns from oh-my-opencode-slim multi-agent orchestration plugin that inform the design of a new @code LEAF agent. Focus on (1) skill auto-loading patterns, (2) stack-agnostic detection, (3) caller-restriction enforcement, (4) write-capable safety guarantees, (5) sub-agent dispatch contracts.

Iteration: 2 of 8
Focus Area: **Q2 (stack-agnostic detection — completely open) + Q4 (write-capable safety: apply-patch hook, post-file-tool-nudge, fixer write contract, MCP/permission allowlists) + close-out for Q3 (confirm whether SUBAGENT_DELEGATION_RULES is truly dead or used elsewhere; surface task-tool config wiring)**.

Remaining Key Questions:
- [ ] Q1: Skill auto-loading patterns — partial: per-agent permission filter via hook is known. Outstanding: any stack/file-type/prompt-keyword auto-load? Check installer presets, skill recommendation, codemap skill behavior.
- [ ] Q2: Stack-agnostic detection — UNTOUCHED. Investigate whether plugin probes the workspace (package.json, go.mod, etc.) to infer stack, or relies entirely on the OpenCode host context. Check CLI installer, presets, and skill `codemap`.
- [ ] Q3: Caller-restriction — strong evidence. Outstanding: confirm that `SUBAGENT_DELEGATION_RULES` is unused (or surface its caller) and look for any task-tool config in `src/index.ts` / preset configs that restricts the orchestrator's `task.subagents` allowlist.
- [ ] Q4: Write-capable safety — partial (fixer prompt-led, councillor read-only). Outstanding: hooks `apply-patch`, `post-file-tool-nudge`, `delegate-task-retry`; MCP permission maps; bash/edit/write defaults per agent.
- [ ] Q5: Sub-agent dispatch contracts — partial (council child sessions known). Outstanding: task-session-manager hook, agent task-tool param shape, parentID semantics, council parent-orchestrator vs councillor child contracts.

## STATE FILES (paths relative to repo root)

- Config: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-config.json
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-state.jsonl
- Strategy: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-strategy.md
- Registry: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/findings-registry.json
- Iteration narrative: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/iterations/iteration-2.md
- Delta file: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deltas/iter-2.jsonl

## CONSTRAINTS

- LEAF: Do NOT dispatch sub-agents.
- Target 4-6 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- All citations MUST use file:line format.
- Stay strictly within `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/`.
- Avoid redoing iter-1 work; build on it.

## OUTPUT CONTRACT

Three artifacts (REQUIRED):

1. `iterations/iteration-2.md` — Sections: Focus, Actions Taken, Findings (file:line), Questions Answered, Questions Remaining, Next Focus.
2. Append to state log: `{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"<focus>","graphEvents":[]}` (single-line JSON, terminate with newline, via `echo ... >> path`).
3. `deltas/iter-2.jsonl` — first line same iteration record; then per-event records (findings `f-iter002-NNN`, invariants, ruled_out, observations).

## INVESTIGATION GUIDANCE

Recommended action sequence (4-6 actions):

1. Read `src/cli/`, `src/config/`, and `src/interview/` directories at structure level (Glob first), then read installer entry, preset selection, and any stack-detection probe. Cite anything that reads workspace files like package.json/go.mod/Cargo.toml/etc.
2. Read `src/skills/codemap/` and `src/skills/simplify/` (full SKILL.md or index.ts) — the only two bundled skills. Look for stack/file-type triggers.
3. Read all hooks under `src/hooks/apply-patch/`, `src/hooks/post-file-tool-nudge/`, `src/hooks/delegate-task-retry/`. Extract write-safety guarantees and dispatch-contract shape.
4. Read `src/hooks/task-session-manager/` to extract task dispatch payload + parentID semantics.
5. Grep `SUBAGENT_DELEGATION_RULES` repo-wide (not just src) to confirm dead-code status; cite any use.
6. Read `AGENTS.md`, `docs/skills.md`, `docs/tools.md`, `docs/configuration.md` for documented stack-detection + write-safety policy.

## newInfoRatio HEURISTIC

Estimate ratio based on (NEW distinct findings) / (total findings). Most iter-2 findings should be NEW (different files than iter-1). Expect 0.7-0.9.

Begin investigation now.
