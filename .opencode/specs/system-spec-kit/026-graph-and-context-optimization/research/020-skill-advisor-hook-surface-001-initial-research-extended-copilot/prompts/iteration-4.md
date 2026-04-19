# Deep-Research Iteration 4 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 4 of 10.
Focus: X4 — Codex PreToolUse/PostToolUse payload + blocking semantics. For future enforcement-mode advisor (block model from writing without Gate 3 spec folder match, etc.). Read Codex docs + codex_hooks config format. Determine: hook input schema, decision vocabulary (allow/block/deny), idempotency, observability. Output: enforcement contract draft — NOT required for 020 MVP but blocks 021+ design.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-004.md
- delta: deltas/iter-004.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-004.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-004.jsonl` — structured delta


