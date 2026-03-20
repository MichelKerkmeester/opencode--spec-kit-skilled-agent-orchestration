**Q14 Result**
The Claude-only contamination exception is **not present as a raw hardcoded check anymore** in `contamination-filter.ts`; it is now capability-driven.

1. Exact code in `contamination-filter.ts` (Claude-specific check status)
- There is **no** `=== 'claude-code-capture'` check in this file.
- Current logic is generic capability-based in [contamination-filter.ts:110](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:110):

```ts
const sourceCapabilities = options?.sourceCapabilities ?? getSourceCapabilities(options?.captureSource);
if (entry.label === 'tool title with path' && sourceCapabilities.toolTitleWithPathExpected) {
  return 'low';
}
```

2. How capabilities are defined per CLI
- Defined in [source-capabilities.ts:13](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:13).
- Key point: only `claude-code-capture` has `toolTitleWithPathExpected: true` at [source-capabilities.ts:26](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:26).
- `opencode/codex/copilot/gemini` are `false` at [source-capabilities.ts:20](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:20), [source-capabilities.ts:32](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:32), [source-capabilities.ts:38](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:38), [source-capabilities.ts:44](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:44).

3. Where `source-capabilities` is used vs direct source-name checks
- Uses `source-capabilities`:
1. [contamination-filter.ts:11](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:11), [contamination-filter.ts:110](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:110)
2. [workflow.ts:86](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:86), [workflow.ts:1422](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1422), [workflow.ts:2158](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2158)
3. [validate-memory-quality.ts:15](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:15), [validate-memory-quality.ts:398](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:398)

- Still direct source-name checks (non-contamination-policy areas):
1. Source detection/dispatch in [data-loader.ts:239](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:239), [data-loader.ts:283](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:283), [data-loader.ts:330](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:330), [data-loader.ts:359](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:359)
2. File-source checks in [workflow.ts:1156](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1156), [task-enrichment.ts:27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:27), [collect-session-data.ts:355](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:355)

4. Verdict
- For the specific Claude-only contamination exception: **migration complete** (old raw Claude conditional removed from contamination filter).
- For full codebase source-name abstraction: **partial** (direct source-name checks still exist in loader and other non-contamination paths).

5. Remaining hardcoded source checks (if considering full migration)
1. Native source aliasing/env inference/switch dispatch: [data-loader.ts:239](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:239), [data-loader.ts:283](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:283), [data-loader.ts:330](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:330)
2. Explicit Claude dispatch case: [data-loader.ts:359](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:359)
3. File-source equality checks: [workflow.ts:1156](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1156), [task-enrichment.ts:27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:27), [collect-session-data.ts:355](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:355)
