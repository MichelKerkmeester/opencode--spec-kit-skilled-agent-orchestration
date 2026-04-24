# Deep-Research Iteration 8 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 8 of 10.
Focus: X8 — Multi-session / concurrent race conditions. Two Claude sessions in same workspace — cache interaction. Issues: (1) session A triggers skill-graph recompute; session B reads half-written graph; (2) shared session-state file write race; (3) process-level cache vs disk cache divergence. Design locking strategy + read-consistent snapshotting. Output: concurrency design + test scenario list.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-008.md
- delta: deltas/iter-008.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-008.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-008.jsonl` — structured delta


