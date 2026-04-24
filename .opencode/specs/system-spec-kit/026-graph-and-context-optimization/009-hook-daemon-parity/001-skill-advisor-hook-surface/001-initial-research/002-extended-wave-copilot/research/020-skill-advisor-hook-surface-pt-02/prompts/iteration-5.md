# Deep-Research Iteration 5 — 020 Extended Wave (cli-copilot)

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.
**Context**: Wave 2 — build on wave 1 (cli-codex convergence); DO NOT re-answer wave-1 Q1-Q10. Wave-1 research.md at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`.

## STATE

Iteration: 5 of 10.
Focus: X5 — Adversarial advisor / prompt injection attack surface. Can user prompt poison advisor brief the model trusts? Attack vectors: (a) crafted prompt that causes advisor to recommend wrong skill; (b) crafted prompt that escapes advisor sanitization and injects instructions into the brief; (c) timing attacks. Read skill_advisor.py sanitization logic + existing trigger-phrase-sanitizer.ts (phase 019/003). Output: attack surface table + mitigations. Cross-reference phase 019/003 P0/P1 findings.

## STATE FILES

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`:
- config: deep-research-config.json
- state log: deep-research-state.jsonl (APPEND canonical `"type":"iteration"` record)
- strategy: deep-research-strategy.md
- registry: findings-registry.json
- iter narrative: iterations/iteration-005.md
- delta: deltas/iter-005.jsonl

## CONSTRAINTS

Soft 9 / hard 13 tool calls. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-005.md` — narrative
2. Canonical JSONL state-log record (`"type":"iteration"` EXACTLY)
3. `deltas/iter-005.jsonl` — structured delta


