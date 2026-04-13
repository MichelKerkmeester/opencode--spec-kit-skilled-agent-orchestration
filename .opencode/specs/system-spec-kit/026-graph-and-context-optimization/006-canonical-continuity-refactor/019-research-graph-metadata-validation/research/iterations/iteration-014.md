# Iteration 14: Bare Non-Canonical Filename Filtering for `key_files`

## Focus
Measure the structural rule that phase 002 is most likely to need: drop unresolved bare filenames unless they are canonical packet docs.

## Findings
1. Once packet-local docs are allowlisted, rejecting unresolved bare filenames removes 1,402 missing `key_files` across 298 specs. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Combining that structural rule with the earlier explicit junk-token regex removes 1,489 of the 2,195 current misses (67.8%) across 276 specs. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. The dominant removable examples are `validate.sh`, `generate-context.js`, `workflow.ts`, `context-server.ts`, `_memory.continuity`, and similar unresolved bare references. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. The safest placement is inside `deriveKeyFiles()` before `normalizeUnique(...)`, while still appending `docs.map((doc) => doc.relativePath)` afterward so canonical packet docs always survive. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/002-sanitize-key-files/spec.md]

## Ruled Out
- Continuing to treat bare unresolved filenames as acceptable because they “look like files.”

## Dead Ends
- Trying to solve this only with more regexes instead of a structural path-shape rule.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/002-sanitize-key-files/spec.md`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.66`
- Questions addressed: `FQ-2`
- Questions answered: `FQ-2`

## Reflection
- What worked and why: resolving paths against the owning spec folder finally separated real packet-local docs from unresolved bare tokens.
- What did not work and why: the earlier narrow filter would have left most of the noise in place.
- What I would do differently: start all future `key_files` investigations with a spec-relative resolution pass.

## Recommended Next Focus
Quantify how many current entity slots are wasted by name collisions before deciding exactly where the de-duplication check belongs.
