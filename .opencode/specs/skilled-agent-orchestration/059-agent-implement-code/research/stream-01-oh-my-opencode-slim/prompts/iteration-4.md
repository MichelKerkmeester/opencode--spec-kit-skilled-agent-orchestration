# Deep-Research Iteration Prompt Pack — Stream-01 oh-my-opencode-slim — Iteration 4

You are the @deep-research LEAF agent dispatched via cli-codex (gpt-5.5 high fast). Investigate ONLY `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/` (relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`).

## STATE

iteration_count: 3
current_iteration: 4
last_newInfoRatio: 0.78
ratios_so_far: [0.95, 0.86, 0.78]
rolling_avg(last 3): 0.86
answered: Q1 ✓, Q2 ✓, Q3 ✓, Q4 ✓, Q5 mostly (boundary cited)
coverage: 4-4.5/5 ≈ 0.85
last_3_summaries:
- iter1 (Q3): mode + permission + council_session toolContext.agent guard; SUBAGENT_DELEGATION_RULES dead.
- iter2 (Q2/Q4): no plugin stack detection; codemap is the agentic pattern; apply-patch root-guard + verification + EOL preservation; agent-mcps allowlist; task dispatch shape.
- iter3 (Q1/Q5/Q4 close): filter-available-skills runs per-call with sessionAgentMap; getSkillPermissionsForAgent expansion (recommended + custom + permission-only + allowedAgents-driven); CouncilManager uses client.session.create directly (NOT task tool) with parentID + tools.task=false; multiplexer panes parent-child; default file-tool perms inherit OpenCode/user defaults.

Research Topic: Identify reusable patterns from oh-my-opencode-slim that inform design of a new @code LEAF agent.

Iteration: 4 of 8
Focus Area: **Final-pass closure for synthesis. Three goals**:
1. **Tests as contract evidence**: read 1-2 representative tests for council manager / agent registry / depth tracker / filter-available-skills hook. Tests often pin the behavior we want to copy. Cite specific test invariants.
2. **AGENTS.md / docs/skills.md / docs/quick-reference.md cross-check**: extract documented contracts to confirm or contradict the in-code findings. Cite documented invariants relevant to @code LEAF design.
3. **Capture any pattern not yet covered**: e.g., how do agents register in OpenCode (`getAgentConfigs` return shape), how does the orchestrator preset compose, what hooks does `index.ts` register at startup. One fresh sweep to ensure nothing important is missing for synthesis.

This is the LAST evidence-gathering iteration before synthesis (Phase 3). Make every action count toward synthesis-ready evidence.

Remaining Key Questions:
- [x] Q1: Skill auto-loading — RESOLVED. Slim does install-time recommendation + runtime visibility filtering. No semantic auto-loading.
- [x] Q2: Stack-agnostic detection — RESOLVED. No detector; codemap is the agentic pattern.
- [x] Q3: Caller-restriction — RESOLVED. Mode + permission + council_session.toolContext.agent + retry-hook reaction.
- [x] Q4: Write-capable safety — RESOLVED. apply-patch root-guard + verification + nudge + agent-mcps + fixer prompt.
- [~] Q5: Sub-agent dispatch — MOSTLY RESOLVED. Outstanding minor: confirm whether tests pin the dispatch invariants we want to copy.

## STATE FILES (paths relative to repo root)

- Iteration narrative: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/iterations/iteration-4.md
- Delta file: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deltas/iter-4.jsonl
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-state.jsonl

## CONSTRAINTS

- LEAF: Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 10 tool calls.
- Write ALL findings to files. file:line citations REQUIRED.
- Stay in `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/`.

## OUTPUT CONTRACT

1. `iterations/iteration-4.md` — Sections: Focus, Actions Taken, Findings (file:line), Questions Answered, Questions Remaining, Next Focus.
2. Append to state log: `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"<focus>","graphEvents":[]}`. Single-line JSON via echo+>>.
3. `deltas/iter-4.jsonl` — first line same iteration record; then per-event records (`f-iter004-NNN`, etc.).

## INVESTIGATION GUIDANCE

Recommended action sequence (3-5 actions):

1. Read `src/agents/index.test.ts` (start at top, scan for relevant `it(...)` blocks on registry/permission/mode classification). Cite test names that pin invariants we want to copy.
2. Read `src/utils/subagent-depth.test.ts` if it exists (or grep for it). Otherwise pick `src/agents/council.test.ts` or `src/agents/councillor.test.ts` for caller-restriction tests.
3. Read `AGENTS.md` (full or relevant sections) and `docs/quick-reference.md` and `docs/council.md`. Extract 5-10 cited invariants relevant to @code LEAF.
4. Read `src/index.ts` startup wiring (the parts not yet read in iter-1/2/3) — focus on which hooks register at startup and their order.
5. If time: spot-check `src/agents/orchestrator.ts` for any final design lessons (the orchestrator is the canonical caller of restricted agents — what does it look like?).

newInfoRatio expectation: 0.4-0.7 (this is a closure pass; some overlap with prior iterations is expected).

Begin investigation now.
