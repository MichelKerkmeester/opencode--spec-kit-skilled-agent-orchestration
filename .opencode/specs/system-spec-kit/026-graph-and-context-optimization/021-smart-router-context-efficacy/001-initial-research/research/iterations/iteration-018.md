# Iteration 018 - Follow-Up Measurement Plan

## Focus Questions

V3, V4, V6, V7

## Tools Used

- Test-plan synthesis
- Measurement gap analysis

## Sources Queried

- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts`

## Findings

- Measurement follow-up should replay the 200-prompt corpus in an instrumented harness that logs: prompt id, expected skill, advisor top-1, confidence, uncertainty, brief bytes, skill files read, bytes read, first-tool latency, and whether assistant overrode advisor. (sourceStrength: moderate)
- Cross-runtime follow-up should run the same prompt subset in Claude, Gemini, Copilot, Codex, and OpenCode plugin mode, collecting hook output and transcript read patterns. (sourceStrength: moderate)
- The harness should distinguish model-visible injected context from tool-read context. Otherwise "brief saved tokens" and "assistant still read SKILL.md" will be mixed together. (sourceStrength: moderate)
- V4 override should be judged by task outcome and routing correctness, not only whether the advisor label matched corpus `skill_top_1`. Some corpus labels may be stale relative to current skill graph. (sourceStrength: moderate)
- Regression gates for plugin adoption: no prompt leakage, fail-open on bridge errors, no injection into tool-bearing message anchors, cache-hit p95 under 60 ms, and correct no-op behavior for disabled flag. (sourceStrength: moderate)

## Novelty Justification

This pass generated the concrete empirical measurement follow-up needed after the design packet.

## New Info Ratio

0.12

## Next Iteration Focus

Finalize OpenCode plugin recommendation.
