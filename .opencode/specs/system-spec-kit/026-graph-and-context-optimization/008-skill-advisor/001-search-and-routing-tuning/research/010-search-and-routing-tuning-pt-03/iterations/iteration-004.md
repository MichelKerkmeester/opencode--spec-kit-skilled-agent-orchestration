# Iteration 4: Children IDs and Cycle Detection

## Focus
Answer RQ-2 and RQ-3 by validating `children_ids` against actual child directories and checking the resolved dependency graph for cycles.

## Findings
1. `children_ids` are derived by enumerating direct numeric child directories and serializing them as specs-root-relative paths, not as paths relative to the current folder on disk. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:388-393]
2. Once the scan used that same path base, all 290 declared child links resolved correctly. Ghost-child rate: 0.0%. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:6-12]
3. The dependency graph contains no cycles, but that result is mostly a reflection of graph sparsity because only four `depends_on` edges currently exist. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Using `dirname/$child` checks against `children_ids` values.

## Dead Ends
- The first shell prototype that treated every child id as a folder-local relative path.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:388-393`
- `.opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:6-12`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.8`
- Questions addressed: `RQ-2`, `RQ-3`
- Questions answered: `RQ-2`, `RQ-3`

## Reflection
- What worked and why: Aligning scan logic with stored path semantics eliminated false positives immediately.
- What did not work and why: The naive shell pattern from the packet prompt overcounted ghosts because it mixed path bases.
- What I would do differently: Put a path-normalization note in the final report so future audits do not repeat the same mistake.

## Recommended Next Focus
Measure how often `key_files` actually resolve to files and classify the dominant miss patterns.
