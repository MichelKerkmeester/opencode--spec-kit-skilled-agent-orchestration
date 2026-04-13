# Iteration 001: Static Parser Sweep on Key-File Filtering

## Focus
Reviewed `keepKeyFile()` and `deriveKeyFiles()` to verify the researched predicate and the filter-before-cap placement.

## Findings

### P0

### P1

### P2

## Ruled Out
- Filter-after-cap regression: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:538` still filters before `normalizeUnique(...).slice(0, 20)`.

## Dead Ends
- Static review alone could not confirm corpus-wide zero-noise output.

## Recommended Next Focus
Check the trust-boundary angle, then line up the phase claims with the focused tests.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness
- Novelty justification: The first pass confirmed the predicate shape without surfacing a new defect.
