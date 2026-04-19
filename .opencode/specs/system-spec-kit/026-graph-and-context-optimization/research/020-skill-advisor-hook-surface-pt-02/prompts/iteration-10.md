# Deep-Research Iteration 10 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 10 of 10.
Focus: X10 — SYNTHESIS. Write research-extended.md consolidating wave-1 + wave-2 findings. Structure: (1) Executive summary (wave-1 recap + wave-2 deltas); (2) Refined cluster decomposition (any changes to 002-009 scope from wave-2?); (3) New findings by angle (X1-X9); (4) Wave-1 vs Wave-2 convergence/divergence table; (5) Final open questions (should be near zero at this point); (6) Handoff contract. Set status:"converged" in state-log record.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-010.md
- delta: deltas/iter-010.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-010.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-010.jsonl` — structured delta

For synthesis iter 10: also write `research-extended.md` at top of artifact folder with full wave-1+wave-2 consolidation.
