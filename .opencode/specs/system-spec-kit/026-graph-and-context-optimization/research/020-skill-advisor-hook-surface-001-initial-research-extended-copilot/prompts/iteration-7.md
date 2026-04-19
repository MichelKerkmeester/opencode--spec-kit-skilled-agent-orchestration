# Deep-Research Iteration 7 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 7 of 10.
Focus: X7 — Migration semantics. When a skill is added/removed/renamed mid-session, how does the cached advisor brief stay valid? Design: (a) source-signature-based invalidation (already in wave-1) triggers re-compute; (b) explicit per-skill invalidation on SKILL.md mtime change; (c) graceful degradation when a cached brief references a now-deleted skill. Corner cases: skill renamed (same content, new name), skill metadata changed (same name, new importance_tier). Output: migration contract.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-007.md
- delta: deltas/iter-007.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-007.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-007.jsonl` — structured delta


