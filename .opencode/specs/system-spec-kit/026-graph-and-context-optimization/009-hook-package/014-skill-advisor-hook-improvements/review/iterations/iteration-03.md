## Iteration 03

### Focus
Review public `advisor_recommend` correctness with explicit `workspaceRoot` and cache reuse.

### Files Audited
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:39-41`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:162-198`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:22-28`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:65-78`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:250-282`

### Findings
- P0 `correctness` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:163`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:174-185`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:22-28`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:70-76`: `advisor_recommend` now accepts explicit `workspaceRoot`, but its cache key never includes that root, only prompt, runtime, thresholds, and the coarse `freshness:generation:lastGenerationBump` source signature. Two repositories with matching freshness state can therefore share a cached recommendation inside one process.
- P1 `correctness` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:187-197`: on a cache hit the handler patches only `workspaceRoot`, `effectiveThresholds`, and `cache.hit`, leaving `recommendations`, `freshness`, and `trustState` from the original workspace untouched. If the cache collides, the response becomes self-contradictory: a new workspace path paired with old-workspace recommendations and freshness metadata.
- P2 `coverage` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:261-279`: the cache isolation test exercises threshold and attribution options only; it never asserts that differing `workspaceRoot` values produce distinct cache keys after packet-014 added explicit workspace selection to the public surface.

### Evidence
```ts
// advisor-recommend.ts
const workspaceRoot = input.workspaceRoot ? resolve(input.workspaceRoot) : findWorkspaceRoot();
const sourceSignature = cacheSourceSignature(status);
const key = advisorPromptCache.makeKey({
  canonicalPrompt: input.prompt.trim(),
  sourceSignature,
  runtime: 'mcp',
  maxTokens: input.options?.topK,
  thresholdConfig: { ... }
});
```

```ts
// prompt-cache.ts
export interface AdvisorPromptCacheKeyParts {
  readonly canonicalPrompt: string;
  readonly sourceSignature: string;
  readonly runtime: string;
  readonly maxTokens?: number;
  readonly thresholdConfig?: AdvisorThresholds;
}
```

### Recommended Fix
- Include resolved `workspaceRoot` in the `advisor_recommend` cache key or replace the coarse handler-local source signature with the workspace-specific freshness source signature already used by `buildSkillAdvisorBrief`, and add a multi-workspace cache isolation test. Target files: `handlers/advisor-recommend.ts`, `lib/prompt-cache.ts`, `tests/handlers/advisor-recommend.vitest.ts`.

### Status
new-territory
