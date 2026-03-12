Verdict: **WARN**

**Function Count + Categories**
Source: [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)

- Exported `is*` functions: **24** (expected 24)  
  Evidence: `export function is...` declarations at lines 15, 23, 31, 39, 47, 55, 65, 73, 81, 89, 101, 110, 121, 130, 140, 148, 156, 164, 173, 178, 186, 195, 205, 214.
- Category split: **19 / 4 / 1** (expected default-ON / opt-in-OFF / deprecated)

| Category | Count | Functions |
|---|---:|---|
| Default-ON | 19 | `isMMREnabled`(15), `isTRMEnabled`(23), `isMultiQueryEnabled`(31), `isCrossEncoderEnabled`(39), `isSearchFallbackEnabled`(47), `isFolderDiscoveryEnabled`(55), `isDocscoreAggregationEnabled`(65), `isSaveQualityGateEnabled`(73), `isNegativeFeedbackEnabled`(89), `isEmbeddingExpansionEnabled`(110), `isConsolidationEnabled`(121), `isEncodingIntentEnabled`(130), `isGraphSignalsEnabled`(140), `isCommunityDetectionEnabled`(148), `isMemorySummariesEnabled`(156), `isAutoEntitiesEnabled`(164), `isEntityLinkingEnabled`(173), `isDegreeBoostEnabled`(178), `isContextHeadersEnabled`(186) |
| Opt-in / OFF by default | 4 | `isReconsolidationEnabled`(81), `isFileWatcherEnabled`(195), `isLocalRerankerEnabled`(205), `isQualityLoopEnabled`(214) |
| Deprecated | 1 | `isPipelineV2Enabled`(101) |

**Required Checks**
- `isPipelineV2Enabled()` is deprecated and always `true`: [search-flags.ts:97](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:97), [search-flags.ts:102](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:102).
- `isFeatureEnabled` semantics verified: missing/undefined env is enabled; only `'false'` or `'0'` disables: [rollout-policy.ts:37](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:37), [rollout-policy.ts:39](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:39).
- `isInShadowPeriod` is module-private (not exported): [learned-feedback.ts:414](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:414).

**Findings (by severity)**

Critical
1. None.

Major
1. Percentage rollout is bypassed when no identity is passed, so `1..99` rollout effectively does not gate these flag checks.  
Evidence: [rollout-policy.ts:45](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:45) (returns `true` when identity missing), plus callers without identity such as [search-flags.ts:197](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:197) and [search-flags.ts:207](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:207). This conflicts with comments claiming rollout policy is honored: [search-flags.ts:193](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:193), [search-flags.ts:203](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:203).

2. `SPECKIT_ROLLOUT_PERCENT` parsing is permissive (`parseInt`), allowing malformed inputs to silently coerce (e.g., `1e2` -> `1`, `50abc` -> `50`).  
Evidence: [rollout-policy.ts:13](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:13), [rollout-policy.ts:18](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:18).

3. Flag-disable semantics are inconsistent across modules: learned-feedback does not trim whitespace and ignores `'0'` as disable.  
Evidence: [learned-feedback.ts:167](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:167) vs canonical policy [rollout-policy.ts:37](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:37), [rollout-policy.ts:39](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:39).

Minor
1. Test coverage misses key governance edge cases (`'0'`, whitespace, mixed-case disable values, malformed rollout percent, no-identity with partial rollout).  
Evidence: current tests focus on basic unset/true/false/0-or-100 paths in [rollout-policy.vitest.ts:41](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:41), [rollout-policy.vitest.ts:54](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:54), [rollout-policy.vitest.ts:62](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:62), [rollout-policy.vitest.ts:72](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:72).

Cosmetic
1. `graph-flags` JSDoc says opt-out with `'false'`, but runtime also treats `'0'` as disabled via shared helper.  
Evidence: [graph-flags.ts:9](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:9) vs [rollout-policy.ts:39](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:39).

**sk-code--opencode Alignment**
- Strong alignment on naming/clarity/testability basics: module headers, boolean `is*` naming, explicit return types in reviewed files.
- Main drift is **behavior consistency** across flag parsers (central helper vs local custom parsing).

**Residual Risk / Test Gaps**
- Could not execute Vitest in this sandbox due temp-dir write denial (`EPERM mkdir .../ssr`), so runtime verification is static-only.
- Highest residual risk is rollout misconfiguration behavior under partial rollout and malformed env values.