# Iteration 34: Health Score and Stale-Metadata Review

## Focus
Turn the Wave 4 findings into one heuristic health score and inspect the remaining freshness and normalization anomalies that still keep the corpus from looking fully clean.

## Findings
1. Structural integrity now scores as fully healthy: `0` broken dependencies, `0` cycles, and `0` ghost children. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Status fidelity and freshness still have a small residual pocket: three doc-alignment packets are stale-complete and one packet still stores `in-progress` instead of `in_progress`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/graph-metadata.json:27-40] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/005-doc-surface-alignment/graph-metadata.json:29-37] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/004-doc-surface-alignment/graph-metadata.json:29-35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/005-doc-surface-alignment/graph-metadata.json:29-37]
3. `key_files` quality scores well but not cleanly enough to be considered done: the active resolve rate is `81.25%`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Entity quality is better than key-files on duplicate suppression but worse on density: duplicate rows are `0`, yet `360/364` active folders still hit the 16-entity cap. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. A simple weighted scorecard (`30%` structure, `25%` status/freshness, `25%` key-files, `20%` entities) lands the corpus at `89/100`. [SOURCE: Wave 4 synthesis over corpus metrics on 2026-04-13]

## Ruled Out
- Treating the remaining stale packets as proof that the new parser logic failed. The packet docs show these are refresh lag cases, not broad derivation failure.

## Dead Ends
- None. The scorecard stayed stable once the stale-complete and normalization anomalies were separated from the larger “planned” bucket.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:102-120`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/graph-metadata.json`
- Wave 4 corpus tables from the 2026-04-13 bash + jq scan

## Assessment
- New information ratio: `0.08`
- Questions addressed: `PVQ-5`
- Questions answered: none

## Reflection
- What worked and why: a coarse heuristic score was enough to summarize progress without pretending the repo already has a native health metric for this surface.
- What did not work and why: the first draft of the score overvalued zero duplicate rows and under-penalized near-universal entity-cap saturation.
- What I would do differently: carry a separate “cap pressure” subscore for both `key_files` and `entities` in future waves.

## Recommended Next Focus
Use the scorecard to define one explicit maintenance pass and one explicit next-phase target, then stop the loop rather than spinning up another discovery-only round.
