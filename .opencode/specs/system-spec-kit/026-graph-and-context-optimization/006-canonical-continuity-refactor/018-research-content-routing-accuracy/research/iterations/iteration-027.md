# Iteration 27: Compact Replay Caveat And Residual Error Shape

## Focus
Probe the missing compact-variant portion of the earlier corpus, quantify the residual short-fragment risk, and separate diagnostic value from strict before-after comparability.

## Findings
1. The packet preserves the earlier corpus counts but not the exact compact-variant generator. That means the old `132`-sample baseline is only partially reproducible from current artifacts. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/research/iterations/iteration-005.md:7] [INFERENCE: packet-local artifact inspection]
2. A best-effort `132`-sample replay using the preserved full prototypes, preserved first-sentence variants, and reconstructed compact clauses lands at `86.36%` accuracy. That replay is diagnostic, not apples-to-apples comparable to the old `87.88%` baseline. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48] [INFERENCE: packet-local reconstructed 132-sample replay over dist/lib/routing/content-router.js]
3. The reconstructed compact errors are refusal-heavy rather than seam-heavy: `narrative_delivery -> refusal` (`4`), `research_finding -> refusal` (`3`), and `metadata_only -> refusal` (`3`) lead the list. [INFERENCE: packet-local reconstructed 132-sample replay over dist/lib/routing/content-router.js]
4. The reconstructed replay still supports the main post-implementation conclusion: the old delivery/progress and handover/drop seams are no longer the dominant source of error. The remaining fragility lives in ultra-short fragments that shed too much category-defining context. [INFERENCE: packet-local reconstructed 132-sample replay over dist/lib/routing/content-router.js]
5. The right answer to "did accuracy improve?" is therefore split. Yes, materially, on the preserved and reproducible part of the old corpus; no firm full-corpus statement is possible without recovering the original compact-generator logic. [INFERENCE: synthesis across preserved and reconstructed replays]

## Ruled Out
- Treating the reconstructed compact replay as a strict substitute for the earlier 132-sample benchmark.

## Dead Ends
- Trying to infer the exact earlier compact-variant generator from the current packet state alone.

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/research/iterations/iteration-005.md:7`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48`

## Assessment
- New information ratio: 0.39
- Questions addressed: RQ-12
- Questions answered: RQ-12

## Reflection
- What worked and why: Explicitly splitting preserved versus reconstructed evidence kept the benchmark claims defensible.
- What did not work and why: The compact-only replay is too sensitive to reconstruction choices to serve as a hard before-after metric.
- What I would do differently: If the team cares about compact-fragment robustness, preserve the compact corpus as first-class packet artifacts after the next tuning pass.

## Recommended Next Focus
Trace the always-on Tier 3 path from `memory-save.ts` into the router and confirm that "wired by default" still fail-opens exactly the way the docs claim.
