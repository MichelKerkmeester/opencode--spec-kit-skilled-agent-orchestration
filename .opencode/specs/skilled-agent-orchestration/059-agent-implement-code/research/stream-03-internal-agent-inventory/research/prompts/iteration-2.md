# Deep-Research Iteration 2 - Stream 03 Internal Agent Inventory

## STATE

Iteration 2 of 8. Iteration 1 answered Q3 (caller-restriction) with high confidence: NO machine-readable frontmatter field, NO harness validator. Caller restriction is convention-only at present. Iteration 1 newInfoRatio = 0.86.

Research Topic: Inventory existing internal `.opencode/agent/*` ecosystem and harness governance for design of `.opencode/agent/code.md`.

Iteration: 2 of 8
Focus Area: Q4 write-capable safety guarantees - how existing write-capable agents bound their writes.

Remaining Key Questions:
- Q1 (open): Skill auto-loading patterns
- Q2 (open): Stack-agnostic detection in sk-code
- Q4 (open): Write-capable safety guarantees - THIS ITERATION
- Q5 (open): Sub-agent dispatch contracts and depth/nesting rules

Last 3 Iterations Summary:
- Iter 1: Q3 caller-restriction inventory found NO harness-level mechanism. Convention-only via prose, workflow ownership, tool permissions, NDP-prompt instructions. ratio=0.86. (.opencode/agent/orchestrate.md:42, AGENTS.md:223,329, cli-opencode/SKILL.md:296)

## STATE FILES

All paths are relative to the repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- Config: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-config.json
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-state.jsonl
- Strategy: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-strategy.md
- Registry: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/findings-registry.json
- Write iteration narrative to: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/iterations/iteration-002.md
- Write per-iteration delta file to: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deltas/iter-002.jsonl

## CONSTRAINTS

- LEAF agent. NO sub-agent dispatch. Max 12 tool calls.
- Write ALL findings to files. Cite file:line everywhere.
- Read prior iteration narrative `iterations/iteration-001.md` first to avoid re-doing the inventory.

## TASK FOR THIS ITERATION

Focus Q4: Write-capable safety guarantees. The packet's decision-record D3 already proposes `task: deny` for `@code`. We need to know what BOUNDS write-capable agents beyond raw permission grants.

1. Read `.opencode/agent/write.md` end-to-end. This is the closest analog to the proposed `@code`. Extract:
   - Frontmatter (permissions, allowed_paths if any, leaf/task fields)
   - Body sections: scope rules, write boundaries, escalation rules, file-path allowlists/blocklists, validation hooks
2. Read `.opencode/agent/debug.md` end-to-end. It has exclusive write access to `debug-delegation.md` (per AGENTS.md). Find:
   - How is "exclusive write access for debug-delegation.md" expressed? Frontmatter? Body? AGENTS.md only?
3. Read `.opencode/agent/deep-research.md` end-to-end. It has exclusive write access to `research/research.md`. Find:
   - Same questions as @debug
4. Read `.opencode/agent/improve-agent.md` and `.opencode/agent/improve-prompt.md` for additional write-bound patterns (orchestrator-only journal emissions, proposal-only rules).
5. Search for any post-write validation hook: `bash .../validate.sh`, `Distributed Governance Rule` enforcement at write time, scope-lock implementations. Look in `.opencode/skill/system-spec-kit/scripts/` and `.opencode/skill/system-spec-kit/shared/`.
6. Search for any "scope-lock" / "spec.md scope is FROZEN" enforcement code, not just CLAUDE.md prose.
7. Note especially: AGENTS.md §5 "Distributed Governance Rule" — does it specify allowed_paths or just templates?

Goal: produce a clear list of write-bounding patterns we can adopt for `@code`. Are they enforced by harness? Workflow? Prose only? Use exact file:line citations.

## OUTPUT CONTRACT

Same as iteration 1: three artifacts at the iteration-002.md / state-log append / deltas/iter-002.jsonl paths.

newInfoRatio expectation: 0.55-0.75 (still significant new content, but partially overlaps with iter 1's Q3 frontmatter inventory).

The state-log iteration record MUST use exact form:
```json
{"type":"iteration","run":2,"iteration":2,"status":"complete","focus":"...","findingsCount":<n>,"newInfoRatio":<0..1>,"keyQuestions":["q4","q5","q1","q2"],"answeredQuestions":[<list of 'q4' if confident>],"ruledOut":[],"focusTrack":"write-safety","toolsUsed":[...],"sourcesQueried":[...],"timestamp":"<ISO>","durationMs":<ms>,"graphEvents":[...]}
```

Append to state log via `printf '%s\n' '<json>' >> <state-log-path>`.

In iteration-002.md, structure must include `## Focus`, `## Actions Taken`, `## Findings` (cited), `## Questions Answered`, `## Questions Remaining`, `## Sources Consulted`, `## Reflection` (with `What worked`/`What did not work`/`What I would do differently` labels), `## Recommended Next Focus`. Optional `## Ruled Out` and `## Dead Ends`.

Begin now.
