# Iteration 001 - Correctness

Focus: correctness. Scope stayed on production plugin code, not spec docs.

Files read:
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`

Verification:
- Scoped vitest command passed for `tests/smart-router-telemetry.vitest.ts` and `tests/spec-kit-skill-advisor-plugin.vitest.ts`.
- Git history checked: `7cead37e6`, `97a318d83`, `874554827`.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F001 | P1 | The native bridge path ignores `thresholdConfidence`. The plugin normalizes the option, sends it in the bridge payload, but `buildNativeBrief()` calls `handleAdvisorRecommend()` with only `topK` and `includeAbstainReasons`. A stricter plugin threshold therefore does not affect native recommendations. | `.opencode/plugins/spec-kit-skill-advisor.js:90`, `.opencode/plugins/spec-kit-skill-advisor.js:292`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:187`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:193` |
| F002 | P2 | The native bridge renders a hard-coded `0.00` second score in the advisor brief. The legacy renderer uses confidence plus uncertainty, so the native path can present uncertainty as zero even though it did not read an uncertainty field. | `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:121`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:135` |

Ruled out:
- No P0 crash path found in prompt extraction, cache-key construction, or JSON parsing in this pass.
