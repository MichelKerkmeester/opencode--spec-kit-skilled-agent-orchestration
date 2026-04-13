# Iteration 26: Post-Implementation Corpus Rescan

## Focus
Re-scan the active `.opencode/specs/` corpus after phases `001`-`003` and doc-alignment phase `005` landed, while keeping the original “exclude `z_archive`” boundary so the eight original research questions can be compared directly.

## Findings
1. The active comparison corpus now contains `364` `graph-metadata.json` files, up from the original `344`. The full tree now has `540` metadata files including archive. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Relationship integrity is still clean: `4` declared `depends_on` edges resolve, `0` break, and `tsort` still reports `0` cycles. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. `children_ids` remain structurally correct: `309` child links resolve and `0` ghost children were found. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Status and freshness now look materially healthier: `218` folders are `complete`, `89` `in_progress`, `56` `planned`, `1` `in-progress`, and only `3` folders have `last_save_at` older than a current source-doc mtime. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Re-using the earlier 344-file totals without a fresh active-corpus count. The scan universe changed again after backfill.

## Dead Ends
- None. The bash + jq rescan produced stable tables once the earlier per-entity jq fan-out was removed.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:102-120`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:562-667`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.42`
- Questions addressed: `PVQ-1`
- Questions answered: none

## Reflection
- What worked and why: locking the scan boundary to “exclude `z_archive`” kept the new corpus counts comparable to Wave 1.
- What did not work and why: the first shell prototype spent too much time spawning `jq` per entity and had to be rewritten into coarser-grained passes.
- What I would do differently: build the aggregated TSV tables first instead of trying to finish sampling in the same long-running shell pass.

## Recommended Next Focus
Turn the raw rescan into before/after deltas against the original eight research questions, then separate parser wins from stale-metadata lag.
