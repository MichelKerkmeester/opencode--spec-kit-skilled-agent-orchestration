# F27 fix report

## Scope
- Searched `.opencode/skill/system-spec-kit/mcp_server/lib/**/*.ts` for non-null assertions matching `!.` and `!;`.
- Limited code changes to `lib/` TypeScript files.

## Fix summary
- Refactored several assertion sites to use explicit local variables or guards instead of non-null assertions.
- Added `AI-SAFETY` justification comments above remaining assertions where prior control flow guarantees the value is present.
- Preserved pre-existing justified assertions that already had safety comments.

## Updated files
- `lib/cognitive/archival-manager.ts`
- `lib/eval/channel-attribution.ts`
- `lib/eval/k-value-analysis.ts`
- `lib/eval/shadow-scoring.ts`
- `lib/graph/community-detection.ts`
- `lib/graph/graph-signals.ts`
- `lib/learning/corrections.ts`
- `lib/ops/job-queue.ts`
- `lib/parsing/trigger-matcher.ts`
- `lib/providers/retry-manager.ts`
- `lib/scoring/interference-scoring.ts`
- `lib/search/entity-linker.ts`
- `lib/search/rsf-fusion.ts`
- `lib/search/spec-folder-hierarchy.ts`

## Remaining non-null assertions
Remaining assertions are intentional because they already had an inline justification comment or now have an `AI-SAFETY` comment directly above them:
- `lib/cognitive/archival-manager.ts`
- `lib/cognitive/co-activation.ts`
- `lib/eval/reporting-dashboard.ts`
- `lib/learning/corrections.ts`
- `lib/manage/pagerank.ts`
- `lib/ops/job-queue.ts`
- `lib/search/hybrid-search.ts`
- `lib/storage/index-refresh.ts`

## Verification
- Re-ran `rg -n -C 1 '!\\.|!;' lib/**/*.ts` to inspect the remaining assertion sites and confirm they are justified.
- Attempts to run repository validation commands from the shell were blocked by the environment with `Permission denied and could not request permission from user`, so automated test/typecheck verification could not be completed in this session.
