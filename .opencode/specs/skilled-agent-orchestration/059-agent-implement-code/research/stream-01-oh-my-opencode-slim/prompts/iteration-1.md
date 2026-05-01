# Deep-Research Iteration Prompt Pack — Stream-01 oh-my-opencode-slim — Iteration 1

You are the @deep-research LEAF agent dispatched via cli-codex (gpt-5.5 high fast). You investigate ONLY the external folder `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/` (relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`). Do not investigate other parts of the repo.

## STATE

iteration_count: 0
current_iteration: 1
last_newInfoRatio: null
last_focus: (none)
ratio_prev: null
ratio_latest: null
answered_count: 0
total_questions: 5
last_3_summaries: (none — first iteration)

Research Topic: Identify reusable patterns from oh-my-opencode-slim multi-agent orchestration plugin that inform the design of a new @code LEAF agent for our .opencode/agent/ inventory. Focus on (1) skill auto-loading patterns, (2) stack-agnostic detection, (3) caller-restriction enforcement (HIGHEST PRIORITY), (4) write-capable safety guarantees, (5) sub-agent dispatch contracts.

Iteration: 1 of 8
Focus Area: **Q3 — Caller-restriction enforcement**. This is the highest-priority unknown. Surface ANY harness-level mechanism (env vars, context markers, hooks, dispatch protocol fields, frontmatter rules) that enforces "callable only by orchestrator". Find the concrete mechanism, not just policy text.

Remaining Key Questions:
- [ ] Q1: Skill auto-loading patterns — how do agents auto-load skills based on context (stack, prompt, file types)?
- [ ] Q2: Stack-agnostic detection — does the plugin detect or assume a stack? If yes, how (marker files, runtime probes, frontmatter)?
- [ ] Q3: Caller-restriction enforcement — concrete mechanism enforcing "callable only by orchestrator". HIGHEST PRIORITY.
- [ ] Q4: Write-capable safety guarantees — how do write-capable LEAF agents guard against scope drift / unauthorized writes?
- [ ] Q5: Sub-agent dispatch contracts — nested dispatch handling, depth-1 / `task: deny` equivalent, dispatch payload shape.

## PRIMARY ENTRY POINTS (start here)

- `src/agents/index.ts` — agent registry (~430 lines; comment at line 429 hints at "callable both as primary and ..." caller-mode distinctions)
- `src/agents/orchestrator.ts` — orchestrator agent (likely the only one allowed to dispatch others)
- `src/agents/council.ts`, `src/agents/councillor.ts` — multi-caller agents
- `src/hooks/filter-available-skills/` — skill-gating hook (relevant for Q1 + Q3)
- `src/hooks/delegate-task-retry/` — dispatch-related hook (relevant for Q5)
- `oh-my-opencode-slim.schema.json` — schema may declare caller/dispatcher fields
- `AGENTS.md`, `docs/skills.md`, `docs/tools.md` — documented restriction policy

## STATE FILES

All paths relative to repo root.

- Config: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-config.json
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-state.jsonl
- Strategy: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-strategy.md
- Registry: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/findings-registry.json
- Write iteration narrative to: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/iterations/iteration-1.md
- Write per-iteration delta file to: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deltas/iter-1.jsonl

## CONSTRAINTS

- LEAF: Do NOT dispatch sub-agents.
- Target 4-6 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- All citations MUST use file:line format (e.g. `src/agents/orchestrator.ts:42-58`).
- Stay strictly within the external folder `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/`.

## OUTPUT CONTRACT

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at `iterations/iteration-1.md`. Sections: Focus, Actions Taken, Findings (with file:line), Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** appended to `deep-research-state.jsonl`. Use `"type":"iteration"` EXACTLY.
```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"Q3 caller-restriction","graphEvents":[]}
```
Append via `echo '<single-line-json>' >> <state_log_path>` — do NOT pretty-print.

3. **Per-iteration delta file** at `deltas/iter-1.jsonl`. One line per record. First line = the same `{"type":"iteration",...}`. Then per-event records: findings (one per finding with id `f-iter001-NNN`, severity, label, citation), invariants, observations, ruled_out directions, etc.

All three artifacts REQUIRED.

## INVESTIGATION GUIDANCE FOR THIS ITERATION

Recommended action sequence (4-6 actions):

1. Read `oh-my-opencode-slim.schema.json` to identify any `caller`, `restricted_to`, `dispatcher`, `task`, or sibling fields. Cite the schema definitions.
2. Read `src/agents/index.ts` (full file, ~430+ lines) to map the agent registry. Look for capability gating, dispatch wiring, mode flags.
3. Read `src/agents/orchestrator.ts` end-to-end — likely THE caller of restricted agents.
4. Glob `src/agents/*.ts` (excluding tests) and grep for: `caller`, `dispatcher`, `restricted`, `mode`, `subagent`, `task:` to surface any gating.
5. Read `src/hooks/filter-available-skills/` (likely 1-3 files) — likely how skills are auto-loaded per agent.
6. If time remains: read `AGENTS.md` and `docs/skills.md` for documented contract.

Focus 80% effort on Q3 evidence. Capture a few opportunistic hits for Q1, Q4, Q5 if surfaced naturally.

## newInfoRatio HEURISTIC

For iteration 1 newInfoRatio is essentially 1.0 minus duplicate findings (very few duplicates expected). Estimate 0.85-1.0 if you produce 5+ distinct findings, 0.5-0.85 if 2-4, lower if you find only 0-1.

Begin investigation now.
