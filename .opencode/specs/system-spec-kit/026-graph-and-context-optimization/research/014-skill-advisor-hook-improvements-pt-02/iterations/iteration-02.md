## Iteration 02

### Focus

This round drilled into threshold surfaces and recommendation-quality drift. I compared the shared brief producer, the OpenCode plugin defaults, and both branches of the bridge helper to determine whether threshold behavior is truly centralized or still route-dependent.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-01.md`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`

### Findings

- The OpenCode plugin still defaults `thresholdConfidence` to `0.7`, while the shared brief path defaults to `0.8` confidence and `0.35` uncertainty, so OpenCode starts from a looser threshold baseline than the shared hook contract [.opencode/plugins/spec-kit-skill-advisor.js:27-29] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:120-135] [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:151-155].
- The bridge helper applies `thresholdConfidence` only in its legacy/shared-brief fallback path; the native branch calls `handleAdvisorRecommend()` with `topK` and `includeAbstainReasons` only, so the configured threshold is silently ignored whenever native routing is available [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:189-200] [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:227-241].
- Because the OpenCode plugin serializes `thresholdConfidence` into the bridge payload on every call, operators can believe they are tuning prompt-time behavior even though the dominant native branch does not actually consume that field [.opencode/plugins/spec-kit-skill-advisor.js:306-319] [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:191-197].

### Evidence

> const DEFAULT_THRESHOLD_CONFIDENCE = 0.7;
> const DEFAULT_MAX_TOKENS = 80;
> const DEFAULT_BRIDGE_TIMEOUT_MS = 1000; [.opencode/plugins/spec-kit-skill-advisor.js:28-30]

> const confidenceThreshold = thresholdConfig?.confidenceThreshold ?? 0.8;
> const uncertaintyThreshold = thresholdConfig?.uncertaintyThreshold ?? 0.35;
> return recommendations.filter((recommendation) => { [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:124-126]

> const handlerResponse = await modules.handleAdvisorRecommend({
>   prompt: input.prompt,
>   options: {
>     topK: 3,
>     includeAbstainReasons: true,
>   },
> }); [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:191-197]

> const result = await buildSkillAdvisorBrief(input.prompt, {
>   workspaceRoot: input.workspaceRoot,
>   runtime: 'codex',
>   maxTokens,
>   thresholdConfig: {
>     confidenceThreshold: threshold(input.thresholdConfidence), [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:231-236]

### Negative Knowledge

- I did not find evidence that the shared `buildSkillAdvisorBrief()` path itself drifted from the documented `0.8/0.35` defaults; the mismatch is route-specific.
- This round did not show CF-019 regressing in the shared path; the drift is about which threshold config reaches which runtime branch.

### New Questions

#### Threshold Drift

- Does any public MCP tool expose the effective prompt-time threshold after these route splits?
- Are aggregate validator thresholds directly comparable to prompt-time route thresholds?

#### Cross-Runtime Parity

- Does OpenCode also diverge from the shared renderer, or only from threshold plumbing?
- Is Codex still the only other runtime with a bespoke fast path?

#### Tool Surface

- Can operators even observe this route split from `advisor_status` or `advisor_recommend` metadata today?

### Status

new-territory
