# Deep-Research Iteration 1 — 020 Skill-Advisor Hook Surface

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target folder `026/research/020-skill-advisor-hook-surface-001-initial-research/`. All writes pre-authorized. Proceed WITHOUT asking.

**Autonomous context**: 10-iteration run. No confirmation gates. Produce 3 artifacts and exit.

## STATE

STATE SUMMARY:
Iteration: 1 of 10
Questions: 0/10 answered | Last focus: none
Research Topic: Cross-runtime skill-advisor hook surface architecture. Mirror the code-graph `buildStartupBrief()` pattern for advisor. Investigate hook trigger availability per runtime + empirical cache/TTL + freshness semantics + context-budget tradeoffs + fail-open contract + cross-runtime snapshot strategy.

Focus Area (iter 1): **Enumerate existing hook trigger points per runtime.** Read:
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/*.ts` (session-prime, compact-inject, session-stop, claude-transcript, hook-state, shared)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts` + `index.ts` + `mutation-feedback.ts` + `response-hints.ts` + `shared-provenance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md` if it exists

Output: **file × trigger-event × runtime matrix** that shows which hook points fire on which runtime. Map Claude's trigger events (SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PreCompact, SessionStop, Notification, Stop) against Gemini's + Copilot's equivalents. Identify gaps — specifically, which runtimes lack a per-prompt hook equivalent to Claude's UserPromptSubmit (Q1 from parent 020 §12).

Also read `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` as the pattern-reuse reference per parent ADR-002.

Remaining Key Questions: see `../deep-research-strategy.md §Key Questions` (Q1-Q10, 10 total).

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-state.jsonl` (APPEND with `"type":"iteration"` EXACTLY)
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-strategy.md`
- Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/findings-registry.json`
- Iter narrative: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-001.md`
- Per-iter delta: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deltas/iter-001.jsonl`

## CONSTRAINTS

- LEAF agent. Soft cap 9 tool calls, hard max 13.
- Iter 1 focus: enumeration only. No architecture proposals yet.
- REQUIRED canonical JSONL record with `"type":"iteration"` EXACTLY (not `"iteration_delta"`).
- REQUIRED per-iteration delta file at `deltas/iter-001.jsonl`.
- Review target (per-runtime hook files): READ-ONLY.

## OUTPUT CONTRACT

1. `iterations/iteration-001.md` — narrative with Focus, Actions, Enumeration Results (file × trigger-event × runtime matrix), Questions Answered (even partial), Next Focus, Ruled Out (if any).

2. Canonical JSONL iteration record APPENDED to state log. Schema:
   ```
   {"type":"iteration","iteration":1,"newInfoRatio":0.90,"status":"in_progress","focus":"enumerate hook trigger points per runtime","findingsCount":0,"keyQuestions":10,"answeredQuestions":N,"timestamp":"2026-04-19T...","durationMs":NNN,"graphEvents":[]}
   ```
   Single-line JSON with newline. MUST land in the state log FILE.

3. `deltas/iter-001.jsonl` — one `{"type":"iteration",...}` record + per-event records (observations about each hook file, any ruled-out directions, graph events if applicable).

All three artifacts REQUIRED. Missing or type-drift fails the validator.
