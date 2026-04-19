# Deep-Research Iteration 9 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 9 of 10.
Focus: X9 — NFKC sanitization interaction (phase 019/003). Does advisor brief text need sanitization before model sees it? Advisor output is JSON from a trusted local binary — but the brief TEXT is constructed from skill names + confidence + freshness strings. Read phase 019/003 research (if accessible): shared/unicode-normalization.ts canonicalFold. Determine: is brief-generation a trust boundary? What's the minimal sanitization? Output: sanitization decision + rationale + test fixture.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-009.md
- delta: deltas/iter-009.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-009.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-009.jsonl` — structured delta


