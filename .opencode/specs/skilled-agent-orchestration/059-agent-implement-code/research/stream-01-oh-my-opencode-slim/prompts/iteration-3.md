# Deep-Research Iteration Prompt Pack — Stream-01 oh-my-opencode-slim — Iteration 3

You are the @deep-research LEAF agent dispatched via cli-codex (gpt-5.5 high fast). Investigate ONLY `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/` (relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`).

## STATE

iteration_count: 2
current_iteration: 3
last_newInfoRatio: 0.86
last_focus: Q2 stack-agnostic + Q4 write-safety + Q3 close-out
ratio_prev: 0.95
ratio_latest: 0.86
ratios_so_far: [0.95, 0.86]
answered_count: 3/5 (Q2 done, Q3 mostly closed, Q4 mostly closed; Q1 + Q5 partial)
total_questions: 5
last_3_summaries:
- iter1 (Q3-focused): mode classification + permission deny + council_session toolContext.agent guard; SUBAGENT_DELEGATION_RULES dead; depth limit 3; per-agent skill filter via hook; fixer prompt-led safety; councillor read-only.
- iter2 (Q2/Q4/Q3 close): no plugin-level stack detection (CLI's package.json reads are about plugin location only); codemap is the reusable stack-agnostic pattern (glob/hash/diff workflow); apply-patch hook = root/worktree path guard + parsed-patch verification + EOL preservation; post-file-tool-nudge = prompt reminder only; agent-mcps allowlist; task dispatch shape `{description, prompt, subagent_type, task_id?}`; task-session-manager runs only when sessionAgentMap = orchestrator.

Research Topic: Identify reusable patterns from oh-my-opencode-slim that inform design of a new @code LEAF agent.

Iteration: 3 of 8
Focus Area: **Q1 (skill auto-loading: deeper read of filter-available-skills + getSkillPermissionsForAgent + skill recommendation surfaces) + Q5 (council child-session dispatch contract: CouncilManager + multiplexer/session-manager.ts) + opportunistic Q4 closure (default file-tool permissions for non-fixer agents)**.

Remaining Key Questions:
- [ ] Q1: Skill auto-loading — confirm full picture: triggers (per-agent, file-type, prompt-keyword, `<load_skills>` tag in task call?), recommendation surfaces, install-time vs runtime selection.
- [x] Q2: stack-agnostic detection — RESOLVED (no detector; codemap is the agentic pattern).
- [x] Q3: caller-restriction — RESOLVED (mode classification + permission deny + council_session.toolContext.agent guard + retry-hook reaction).
- [x] Q4: write-capable safety — MOSTLY RESOLVED (apply-patch root-guard + verification + nudge + per-agent MCP allowlist + fixer prompt). Outstanding: default `bash`/`edit`/`write` permission inheritance.
- [ ] Q5: Sub-agent dispatch — partial. Outstanding: council child-session creation (CouncilManager) details, multiplexer parent-child cleanup, parentID lifecycle, exact `task` payload subagent_type validation rules.

## STATE FILES (paths relative to repo root)

- Iteration narrative: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/iterations/iteration-3.md
- Delta file: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deltas/iter-3.jsonl
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-state.jsonl

## CONSTRAINTS

- LEAF: Do NOT dispatch sub-agents.
- Target 4-6 research actions. Max 12 tool calls.
- Write ALL findings to files. file:line citations REQUIRED.
- Stay in `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/`.
- Avoid redoing iter-1/2 reads. Build on what's known.

## OUTPUT CONTRACT

Three artifacts (REQUIRED):

1. `iterations/iteration-3.md` — Sections: Focus, Actions Taken, Findings (file:line), Questions Answered, Questions Remaining, Next Focus.
2. Append to state log: `{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"<focus>","graphEvents":[]}`. Single-line JSON via echo+>>.
3. `deltas/iter-3.jsonl` — first line same iteration record; then per-event records (`f-iter003-NNN`, etc.).

## INVESTIGATION GUIDANCE

Recommended action sequence (4-6 actions):

1. Read `src/hooks/filter-available-skills/index.ts` (full) + `src/cli/skills.ts` (full) — extract skill auto-loading triggers + permission expansion.
2. Read `src/council/council-manager.ts` end-to-end — extract dispatch payload to councillors (parentID, agent, model, prompt, tools.task=false).
3. Read `src/multiplexer/session-manager.ts` and `src/multiplexer/factory.ts` — extract parent-child session lifecycle and cleanup.
4. Read `src/index.ts` (only sections relevant to permissions/wiring not yet read) — extract default file-tool permission inheritance for non-fixer agents.
5. Grep for `load_skills` repo-wide — confirm whether `<load_skills>` task arg is plugin-handled or OpenCode-handled.
6. If time: read `docs/council.md`, `docs/skills.md`, `docs/session-management.md` to confirm documented contracts.

## newInfoRatio HEURISTIC

Iter-3 should produce mostly NEW findings (different files than iter-1/2). Expect 0.6-0.85.

Begin investigation now.
