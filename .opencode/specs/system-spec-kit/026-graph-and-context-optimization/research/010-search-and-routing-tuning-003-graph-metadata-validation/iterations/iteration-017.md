# Iteration 17: Legacy Normalization Safety and Active-Corpus Drift

## Focus
Determine whether phase 004 is still a live implementation need and, if not, what future-proof backfill guard would keep the migration safe.

## Findings
1. The parser still supports plaintext fallback through `parseLegacyGraphMetadataContent(...)`, so the compatibility path remains real in code even if the current corpus no longer uses it. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:82-160]
2. The active corpus now has zero legacy text `graph-metadata.json` files, and the same is true across all `.opencode/specs/`, including archive folders. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. `backfill-graph-metadata.ts` currently refreshes every spec folder; it has no flag to rewrite only legacy-format files. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177]
4. The safest future-proof batch path is a guardable flag such as `--rewrite-legacy-only` that rewrites only files whose raw content fails JSON parsing but still loads through the fallback path. On today's branch that flag would be a clean no-op. [INFERENCE: from the current parser plus backfill flow]

## Ruled Out
- Unconditional whole-tree backfill as the safest migration behavior.

## Dead Ends
- Assuming the earlier 35-file legacy count still reflected the active branch.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:82-160`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/004-normalize-legacy-files/spec.md`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.50`
- Questions addressed: `FQ-4`
- Questions answered: `FQ-4`

## Reflection
- What worked and why: re-running the legacy scan before writing guidance prevented a stale migration problem from becoming an unnecessary implementation phase.
- What did not work and why: trusting the old discovery snapshot would have over-scoped the follow-on work.
- What I would do differently: add a current-state check at the top of every normalization phase before treating it as mandatory.

## Recommended Next Focus
Trace the trigger-phrase cap path so the final follow-on recommendation can explain why the contract drift exists at all.
