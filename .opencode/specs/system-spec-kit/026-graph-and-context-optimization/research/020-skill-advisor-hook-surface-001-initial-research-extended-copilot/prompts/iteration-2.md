# Deep-Research Iteration 2 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 2 of 10.
Focus: X2 — Claude UserPromptSubmit exact output semantics. Read .claude/settings*.json + hooks/claude/*.ts + any claude-code reference docs. Capture: stdin JSON shape the hook receives; how output text becomes model-visible context (stdout? specific envelope? JSON key?); what block/allow/deny decisions look like. Produce a concrete adapter skeleton with fixture JSON samples.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-002.md
- delta: deltas/iter-002.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-002.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-002.jsonl` — structured delta


