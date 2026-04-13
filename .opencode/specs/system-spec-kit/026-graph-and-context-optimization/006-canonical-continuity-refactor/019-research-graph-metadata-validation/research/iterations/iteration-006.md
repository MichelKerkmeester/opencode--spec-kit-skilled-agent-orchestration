# Iteration 6: Entity Quality and Duplicate Noise

## Focus
Answer RQ-5 and part of RQ-7 by analyzing how `derived.entities` are built and where they become noisy.

## Findings
1. `deriveEntities()` first seeds entities from every `key_files` entry using `path.basename(filePath)`, then adds up to six extracted doc entities per source doc, and finally truncates the combined list to 16 items. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446]
2. The corpus contains 2,020 basename-only duplicate entities across 270 folders, which means 78.49% of folders carry at least one duplicate basename alongside a canonical-path entry. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Entity-cap pressure is extreme: 291 folders hit the 16-entity ceiling, so any later extracted entities are silently dropped. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Representative malformed names still leak through in stored metadata, including newline-bearing entities like `Problem Statement\\nThe Global Shared` and command-derived names like `skill_advisor.py \"...\" --threshold 0.8`. [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:95-120] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Assuming newline normalization in the parser is enough to prevent malformed entity names.

## Dead Ends
- Treating duplicate basenames as harmless cosmetic noise.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446`
- `.opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:95-120`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.7`
- Questions addressed: `RQ-5`, `RQ-7`
- Questions answered: `RQ-5`

## Reflection
- What worked and why: Reading the insertion order in `deriveEntities()` explained both duplication and saturation.
- What did not work and why: Entity quality cannot be evaluated independently from key-file quality because the first stage seeds the entity map directly from key files.
- What I would do differently: Recommend a pre-entity sanitization pass rather than trying to dedupe only after insertion.

## Recommended Next Focus
Cross-check derived status values against real packet docs and implementation summaries.
