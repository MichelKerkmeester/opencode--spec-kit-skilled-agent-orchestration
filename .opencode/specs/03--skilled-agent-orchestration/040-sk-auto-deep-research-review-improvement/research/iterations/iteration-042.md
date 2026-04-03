# Iteration 042
## Focus
Orchestrator bootstrap parity across Codex/OpenCode/Claude/Gemini.

## Questions Evaluated
- Is first-turn bootstrap via `@context-prime` consistently documented?
- Are runtime path conventions and orchestration constraints aligned?

## Evidence
- `.codex/agents/orchestrate.toml:12,26`
- `.opencode/agent/orchestrate.md:20`
- `.claude/agents/orchestrate.md:1-26`
- `.gemini/agents/orchestrate.md:1-26`

## Analysis
Codex/OpenCode explicitly include first-turn context-prime bootstrap guidance. Claude/Gemini variants retain orchestration body logic but do not mirror the same bootstrap framing in equivalent positions.

## Findings
- Runtime mirrors are close but not contract-identical.
- Bootstrapping differences can alter first-turn behavior assumptions and operator expectations.

## Compatibility Impact
Cross-runtime sessions can diverge on initial context quality.

## Next Focus
Inspect Gemini orchestrator declared tool surface versus described dispatch responsibilities.

