# Iteration 11: `deriveStatus()` Minimal Patch and Live Status Drift

## Focus
Trace the exact `deriveStatus()` behavior and measure the current active-corpus status mismatch before recommending the smallest phase-001 fix.

## Findings
1. `deriveStatus()` still does only one thing after override handling: it reads ranked frontmatter `status` scalars from `implementation-summary.md`, `checklist.md`, `tasks.md`, `plan.md`, and `spec.md`, then falls back to `planned`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510]
2. The active corpus has drifted since iteration 10. On 2026-04-13 there are 360 active `graph-metadata.json` files, and 340 currently store `planned`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Of those 340 planned folders, 282 already contain `implementation-summary.md`, so the phase-001 premise still holds even though the older 259-of-344 number is stale. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. The literal minimal code change is a fallback immediately after the ranked frontmatter lookup: if `implementation-summary.md` exists and no explicit status was found, return `complete`. That keeps the patch inside `deriveStatus()` and matches the child phase scope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/001-fix-status-derivation/spec.md]

## Ruled Out
- Parsing markdown status tables as runtime input.

## Dead Ends
- Assuming the earlier 344-file snapshot still reflected the live corpus.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:346-353`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/001-fix-status-derivation/spec.md`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.82`
- Questions addressed: `FQ-1`
- Questions answered: none yet

## Reflection
- What worked and why: re-running the live counts before making a patch recommendation prevented me from anchoring on stale iteration-10 metrics.
- What did not work and why: treating the earlier corpus size as fixed would have understated the current status problem.
- What I would do differently: pair every follow-on implementation phase with a fresh corpus count before copying numbers from the research snapshot.

## Recommended Next Focus
Check whether the checklist completion script provides a safer secondary completion signal than implementation-summary presence alone.
