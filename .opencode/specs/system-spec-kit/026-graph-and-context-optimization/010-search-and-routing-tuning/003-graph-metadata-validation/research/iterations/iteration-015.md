# Iteration 15: Live Duplicate-Entity Slot Measurement

## Focus
Re-measure entity duplication on the current 360-file corpus and translate the earlier 2,020-duplicate headline into current slot pressure.

## Findings
1. `deriveEntities()` seeds entities from `key_files` using the full `filePath` as the map key, but stores only the basename in `.name`. That design allows duplicates whenever two different paths share the same basename. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446]
2. The active corpus currently stores 5,674 entity rows. 794 of those are redundant duplicate-name slots spread across 234 folders. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. 349 folders already hit the 16-entity cap, so removing duplicate-name rows would free meaningful headroom even before any extraction-quality improvements land. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. The representative collisions are exactly the kind phase 003 describes: `spec.md` plus `.opencode/specs/.../spec.md`, `plan.md` plus `.opencode/specs/.../plan.md`, and similar canonical-doc basename clashes. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Assuming the duplicate problem lives only in extracted text entities.

## Dead Ends
- Reusing the older 2,020-duplicate number without checking the current metadata set.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.60`
- Questions addressed: `FQ-3`
- Questions answered: none yet

## Reflection
- What worked and why: switching from folder-count headlines to slot counts made the actual cap pressure obvious.
- What did not work and why: the earlier duplicate metric did not tell me how much of the 16-slot budget was being wasted right now.
- What I would do differently: measure both duplicate count and cap pressure together from the start.

## Recommended Next Focus
Trace the exact callsites so phase 003 can patch the right insertion point on the first try.
