# Deep-Research Iteration 3 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 3 of 10.
Focus: X3 — Copilot userPromptSubmitted model-visible behavior. Read hooks/copilot/*.ts + .copilot/ config if any + Superset 'userPromptSubmitted' wrapper evidence. Determine: does this event actually inject context the model sees, or only a notification for external tooling? If only notification, design a workaround (e.g., prompt-wrapper that prepends advisor brief, or session-prime reinforcement). Output: adapter design + proof or plan-B.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-003.md
- delta: deltas/iter-003.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-003.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-003.jsonl` — structured delta


