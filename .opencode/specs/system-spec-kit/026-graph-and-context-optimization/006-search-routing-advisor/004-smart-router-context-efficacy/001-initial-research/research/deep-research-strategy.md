# Deep Research Strategy: Smart-Router Context-Load Efficacy

## Topic

Investigate whether the Phase 020 skill-advisor hook surface effectively reduces AI-assistant context load. Secondary: design OpenCode plugin packaging for the advisor hook using the code-graph OpenCode plugin as reference pattern.

## Research Questions (V1-V10)

| ID | Question | Success Criterion |
|----|----------|-------------------|
| V1 | Baseline: context load without hook | Quantified tokens/files/latency |
| V2 | With-hook: advisor brief steering efficacy | Per-prompt hit/miss data |
| V3 | Savings quantification | Delta table tokens/latency |
| V4 | Miss-rate: AI override on low-confidence | Override rate + override quality |
| V5 | Adversarial: prompt-poisoning, metalinguistic, ambiguity | Regression fixtures + behaviors |
| V6 | Cross-runtime: Claude/Gemini/Copilot/Codex | Per-runtime delta |
| V7 | Runtime behavior: skip SKILL.md when high-confidence? | Read-pattern measurement |
| V8 | OpenCode plugin architecture | Plugin shape spec |
| V9 | Plugin design proposal | Manifest + hooks + install flow |
| V10 | Risks | Risk register with mitigations |

## Known Context

- Phase 020 shipped the advisor hook surface across 4 runtimes (commits 47b805f7b → 54043c171 on main)
- Reference doc: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- 200-prompt corpus: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- Advisor ranker: `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- Advisor types: `mcp_server/lib/skill-advisor/` (freshness, brief, render, metrics)
- Hook adapters: `mcp_server/hooks/{claude,gemini,copilot,codex}/user-prompt-submit.ts`

## Stop Conditions

- Rolling 3-iter newInfoRatio < 0.05 across all V1-V10
- All V1-V10 answered with evidence
- 20 iterations completed

## Max Iterations

20

## Convergence Threshold

0.05
