## Iteration 03

### Focus

This iteration compared renderer and build-path parity instead of only threshold values. The main question was whether the public docs are right that runtimes share one build-and-render contract, or whether OpenCode and Codex still preserve bespoke prompt-time logic that can change what users see.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-01.md`
- `iteration-02.md`
- `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`

### Findings

- OpenCode native mode does not use the shared `renderAdvisorBrief()` renderer; it uses a local `renderNativeBrief()` helper, so prompt-boundary behavior is no longer centrally defined for that runtime [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:112-143] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:100-138].
- The shared renderer surfaces ambiguity when the top two candidates are within `0.05` and the token cap allows expansion, but the OpenCode native renderer only reports the top recommendation, so an ambiguous route can look decisive in OpenCode while appearing ambiguous elsewhere [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:123-131] [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:123-142].
- Codex still has a separate native fast path that bypasses prompt policy, prompt-cache invalidation, deleted-skill cache suppression, and shared-payload construction before falling back to the shared builder only when the native probe fails [.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180-241] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:339-467].

### Evidence

> function renderNativeBrief(data, maxTokens) {
>   if (!data || (data.freshness !== 'live' && data.freshness !== 'stale')) {
>     return null;
>   }
>   const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
>   const top = recommendations[0]; [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:112-117]

> if (tokenCap > DEFAULT_TOKEN_CAP && second && isAmbiguous(recommendations)) {
>   return capText(
>     `Advisor: ${result.freshness}; ambiguous: ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} vs ${secondLabel} ${formatScore(second.confidence)}/${formatScore(second.uncertainty)} pass.`,
>     Math.min(tokenCap, AMBIGUOUS_TOKEN_CAP),
>   );
> } [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:123-131]

> const nativeResult = await buildNativeCodexAdvisorBrief(prompt, options);
> if (nativeResult) {
>   return nativeResult;
> }
>
> return buildSkillAdvisorBrief(prompt, { [.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:231-236]

### Negative Knowledge

- I did not find equivalent bespoke renderers in the Claude, Gemini, or Copilot hook adapters during this pass.
- The renderer divergence is not merely a formatting nit: it changes whether ambiguity is surfaced to the model at all.

### New Questions

#### Runtime Parity

- Which runtimes stay fully inside the shared builder and renderer?
- Does OpenCode native mode also miss shared-payload or deleted-skill protections beyond ambiguity handling?

#### Recommendation Quality

- Are there public surfaces that reveal when prompt-time ambiguity was collapsed away?
- Can operators observe which runtime path produced a brief today?

#### MCP Surface

- Do `advisor_status` or `advisor_recommend` expose enough metadata to audit these route splits without code inspection?

### Status

new-territory
