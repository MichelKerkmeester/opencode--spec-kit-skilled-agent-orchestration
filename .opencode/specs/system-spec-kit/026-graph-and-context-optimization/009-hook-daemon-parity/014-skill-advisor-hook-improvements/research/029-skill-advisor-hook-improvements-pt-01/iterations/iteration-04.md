## Iteration 04

### Focus
Codex-specific brief-building behavior and whether it still matches the shared runtime contract.

### Findings
- Codex has a native fast path that bypasses `buildSkillAdvisorBrief()` whenever freshness is `live` or `stale`, instead scoring directly through `scoreAdvisorPrompt()`. Citation: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:191`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:231`.
- That fast path skips the shared prompt policy, shared prompt cache, deleted-skill suppression, shared payload construction, and shared failure classification that every other runtime gets through `buildSkillAdvisorBrief()`. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:339`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:384`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:413`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:441`.
- Codex fallback wrapper does use `buildSkillAdvisorBrief()`, which means Codex behavior changes depending on whether native hooks are available instead of only changing transport. Citation: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:157`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:178`.
- The Codex hook also has a hard-coded timeout fallback brief (`Advisor: stale (cold-start timeout)`), which has no equivalent shared-path rendering contract and can therefore surface a qualitatively different operator experience. Citation: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:171`.

### New Questions
- Should Codex native mode call the shared brief builder and only optimize transport, not logic?
- If the fast path stays, which shared invariants must be duplicated explicitly to preserve parity?
- Are there regression tests covering short casual prompts on Codex native mode versus Claude/Gemini shared mode?
- Should the timeout fallback brief include generation/trust hints or fail open to `{}` instead?

### Status
new-territory
