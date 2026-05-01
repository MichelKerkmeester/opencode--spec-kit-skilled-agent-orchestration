# Deep-Research Iteration 4 - Stream 03 Internal Agent Inventory

## STATE

Iteration 4 of 8. Q3, Q4, Q5 answered. Two open: Q1 (skill auto-loading) and Q2 (sk-code stack detection).

Iteration: 4 of 8
Focus Area: Q1 skill auto-loading patterns - how do agents pick up skills, is there a frontmatter field, what does the skill-advisor hook do?

Remaining Key Questions:
- Q1 (open): Skill auto-loading patterns - THIS ITERATION
- Q2 (open): Stack-agnostic detection in sk-code

Last 3 Iterations Summary:
- Iter 1 (Q3): No machine caller-restriction. Convention only. ratio=0.86.
- Iter 2 (Q4): Write-safety = workflow/prose/script convention; no allowed_paths frontmatter or runtime allowlist. ratio=0.72.
- Iter 3 (Q5): permission.task is the per-agent Task-tool boundary (likely consumed by external OpenCode runtime); single-hop depth + caller discipline + agent_config.leaf_only enforced by orchestrator/YAML/prompt contracts, not local validators. ratio=~0.6.

## STATE FILES

All paths are relative to repo root.

- Config: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-config.json
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-state.jsonl
- Strategy: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-strategy.md
- Registry: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/findings-registry.json
- Iteration narrative path: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/iterations/iteration-004.md
- Per-iteration delta path: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deltas/iter-004.jsonl

## CONSTRAINTS

- LEAF agent. NO sub-agent dispatch. Max 12 tool calls.
- Read iter 1-3 narratives first to avoid duplicate inventory and to anchor in prior findings.

## TASK FOR THIS ITERATION

Focus Q1 — Skill auto-loading:

1. Read `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` end-to-end. Capture the exact mechanism: when does it fire, what does it produce (e.g. compact skill recommendation on prompt entry), where does the brief surface (Gate 2 in AGENTS.md), is it agent-scoped or global?
2. Search `.opencode/agent/*.md` frontmatter for fields that name skills to auto-load. Probable keys to look for: `skills:`, `skill:`, `auto_skills:`, `loaded_skills:`, `requires:`, `uses:`, `dependencies:`, `routes:`. Capture every relevant frontmatter line per agent.
3. Inspect `.opencode/agent/orchestrate.md` body for skill-routing prose: does it tell the orchestrator to "invoke skill-advisor first"? Look for the phrase "skill_advisor" / "skill-advisor" / "skill routing".
4. Inspect `.opencode/agent/improve-agent.md` and `.opencode/agent/improve-prompt.md` — they reference `sk-improve-agent` and `sk-improve-prompt` respectively. How is the binding expressed?
5. Inspect `.opencode/skill/sk-code/SKILL.md` — `sk-code` is a "smart-routing umbrella skill". When invoked, does it auto-load other sk-code-* sub-skills? Find the routing/detection logic.
6. Search runtime code (mcp_server, plugin) for any "auto_load_skills" / "preload_skills" / agent-skill-binding patterns. Use grep + a CocoIndex semantic search if needed.
7. Cross-reference with the AGENTS.md "GATE 2: SKILL ROUTING" rule — what's it actually look like at runtime?

Goal: clear answer to "How does an agent (current or future @code) declare it needs sk-code? Is it just prose in the body that says 'invoke sk-code Skill', or is there a frontmatter field that auto-loads it on entry?"

## OUTPUT CONTRACT

Same as iter 1-3. Three artifacts. State-log JSONL append format:
```json
{"type":"iteration","run":4,"iteration":4,"status":"complete","focus":"...","findingsCount":<n>,"newInfoRatio":<0..1>,"keyQuestions":["q1","q2"],"answeredQuestions":[<list including 'q1' if confident>],"ruledOut":[],"focusTrack":"skill-loading","toolsUsed":[...],"sourcesQueried":[...],"timestamp":"<ISO>","durationMs":<ms>,"graphEvents":[...]}
```

newInfoRatio expectation: 0.45-0.65 (some overlap with prior frontmatter inventory; some new on the hook mechanism).

iteration-004.md headings: `# Iteration 4: <title>`, `## Focus`, `## Actions Taken`, `## Findings`, `## Questions Answered`, `## Questions Remaining`, `## Sources Consulted`, `## Reflection` with three labeled sub-bullets (`What worked and why`, `What did not work and why`, `What I would do differently`), `## Recommended Next Focus`. Optional `## Ruled Out` / `## Dead Ends`.

Begin now.
