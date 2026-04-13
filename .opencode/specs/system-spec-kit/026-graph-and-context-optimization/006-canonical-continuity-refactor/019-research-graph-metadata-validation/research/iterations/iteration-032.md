# Iteration 32: Global Entity Quality After De-Dup

## Focus
Measure the full active-corpus entity output after the basename de-duplication phase landed.

## Findings
1. The active corpus now stores `5,796` entity rows across `363` folders with at least one entity, averaging `15.97` entities per populated folder. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Duplicate-name noise is gone: duplicate rows fell from `2,020` to `0`, and duplicate-affected folders fell from `270` to `0`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/research.md] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Only three suspicious names remain in the full active corpus: one `python` token and two `README.md / ARCHITECTURE.md` composites. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Entity-cap pressure is now the main entity-quality problem: `360` of `364` active folders still hit the 16-entity cap. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Equating zero duplicate rows with healthy entity prioritization. The cap-saturation result makes that false.

## Dead Ends
- None. The global entity table answered the de-duplication question directly.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:474-559`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.12`
- Questions addressed: `PVQ-4`
- Questions answered: none

## Reflection
- What worked and why: the post-dedup entity table is much easier to reason about because the old canonical-path collision noise is gone.
- What did not work and why: the average entity count alone hides how close almost every packet still sits to the 16-entity ceiling.
- What I would do differently: track both average entity count and cap-hit rate in the same dashboard view from the start.

## Recommended Next Focus
Inspect the tiny surviving anomaly set manually and pair it with a random sample so the next improvement phase can target the real precision defects, not duplicate suppression.
