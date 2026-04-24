# Deep-Research Iteration 6 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 6 of 10.
Focus: X6 — Full observability + telemetry design. Metrics schema (counter/gauge/histogram names, dimensions), structured log format per hook invocation (JSON? key=value?), alarm thresholds (fail-open rate > 1%/hr, latency p99 > 500ms, cache hit rate < 30%), session_health integration (new advisor_hook_health section?). Output: concrete metrics + log + alarm catalog.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-006.md
- delta: deltas/iter-006.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-006.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-006.jsonl` — structured delta


