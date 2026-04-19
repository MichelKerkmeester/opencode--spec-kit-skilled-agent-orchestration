# Iteration 1: Corpus Inventory and Runtime Baseline

## Focus
Count the live `graph-metadata.json` corpus and read the schema, parser, and backfill code before making quality claims.

## Findings
1. The live corpus contains 344 `graph-metadata.json` files, not the older 515-plus expectation in the packet brief. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. The schema requires `packet_id`, `spec_folder`, `parent_id`, `children_ids`, `manual`, and `derived`, but runtime compatibility depends on parser behavior rather than schema alone. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:1-44] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:172-218]
3. `deriveGraphMetadata()` rebuilds `trigger_phrases`, `key_topics`, `status`, `key_files`, `entities`, timestamps, `parent_id`, and `children_ids` from current packet docs and directory structure while preserving `manual` relationships from existing metadata. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-560]
4. Backfill already treats ambiguous status, thin source docs, prose-only relationship hints, and short summaries as review flags, which means quality issues are expected at rollout time rather than fully prevented up front. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:111-136]

## Ruled Out
- Using the packet brief's 515-plus estimate as the current corpus baseline.

## Dead Ends
- None yet.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `1.0`
- Questions addressed: `RQ-7`, `RQ-8`
- Questions answered: none

## Reflection
- What worked and why: Reading the derivation code first made later scan anomalies easier to interpret.
- What did not work and why: The packet brief corpus estimate was stale relative to the current checkout.
- What I would do differently: Separate runtime-loadable files from raw JSON files before calling anything invalid.

## Recommended Next Focus
Measure how much of the corpus is native JSON versus legacy-compatible text, then establish distribution baselines.
