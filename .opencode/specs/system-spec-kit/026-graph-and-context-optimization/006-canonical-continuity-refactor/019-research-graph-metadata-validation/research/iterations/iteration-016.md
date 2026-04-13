# Iteration 16: Exact Basename-De-Dupe Insertion Point and Canonical Preference

## Focus
Translate the live collision metrics into a concrete patch shape for phase 003.

## Findings
1. The first essential check belongs in the key-files loop before `entities.set(filePath, ...)`, because duplicate-name rows are already created there. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:421-428]
2. The extracted-entity loop also needs the same guard before `entities.set(normalizedName, ...)`, otherwise doc-extracted entities can still collide with file-derived basenames. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:430-442]
3. If phase 003 adds the check only to the extracted-entity loop, the canonical `spec.md` / full-path `spec.md` duplicates remain. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. The child phase's “keep the canonical entry, drop the duplicate” requirement implies a simple preference rule: preserve the first accepted basename and skip later collisions. That is safe as long as `deriveKeyFiles()` continues to append canonical packet docs deliberately. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/003-deduplicate-entities/spec.md] [INFERENCE: from current key-file ordering and phase scope]

## Ruled Out
- Adding the basename check only for extracted entities.

## Dead Ends
- Trying to solve canonical preference inside the schema instead of inside `deriveEntities()`.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/003-deduplicate-entities/spec.md`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.54`
- Questions addressed: `FQ-3`
- Questions answered: `FQ-3`

## Reflection
- What worked and why: looking at the two `entities.set(...)` callsites directly made the patch placement unambiguous.
- What did not work and why: reasoning only from the packet spec would have missed that key-file collisions happen before any extracted entities are considered.
- What I would do differently: inspect the first write-site earlier whenever a packet is about de-duplication rather than late-stage cleanup.

## Recommended Next Focus
Re-check the live corpus for legacy text files before recommending any active-branch normalization work.
