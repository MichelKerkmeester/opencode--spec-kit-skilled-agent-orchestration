# Iteration 009 - Risk Register

## Focus Questions

V10

## Tools Used

- Review of renderer, prompt policy, subprocess, freshness, validation playbook, and plugin pattern

## Sources Queried

- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md`
- `.opencode/plugins/spec-kit-compact-code-graph.js`

## Findings

- Prompt injection risk is meaningfully mitigated at the renderer boundary because rendered output is derived from typed recommendation fields and sanitized labels, not prompt text, reason text, stdout, or stderr. (sourceStrength: primary)
- Stale graph risk is partially mitigated by `getAdvisorFreshness()` and stale badges, but the assistant may still over-trust `Advisor: stale`. Plugin UX should preserve the freshness state visibly and avoid hiding stale behind a generic success status. (sourceStrength: primary)
- Hook latency risk is bounded by subprocess timeout, HMAC prompt cache, timing tests, and fail-open behavior. However, cold-cache subprocess latency remains a possible interactive-loop cost and needs real p95 measurement in OpenCode. (sourceStrength: primary)
- Plugin host risk: direct import of MCP server code into OpenCode can fail due Node ABI/native module mismatch. The bridge-process pattern is the preferred mitigation. (sourceStrength: primary)
- Opt-out risk is well addressed by the existing `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` flag and should be duplicated in plugin configuration. (sourceStrength: primary)
- Blind-following risk remains behavioral: the brief says `use`, not `consider`, and no test can force assistant judgment. Mitigation is prompt-contract wording, low-confidence no-op behavior, and adversarial/ambiguous fixture tests. (sourceStrength: moderate)

## Novelty Justification

This pass consolidated technical, security, latency, and human-behavior risks into implementable mitigations.

## New Info Ratio

0.49

## Next Iteration Focus

Convert measurement into decision calls by V-question.
