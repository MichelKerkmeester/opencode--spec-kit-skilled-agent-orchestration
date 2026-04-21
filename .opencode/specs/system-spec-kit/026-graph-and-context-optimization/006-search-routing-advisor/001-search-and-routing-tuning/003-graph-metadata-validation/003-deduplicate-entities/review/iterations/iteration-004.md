# Iteration 004 - Maintainability

## Scope

Reviewed the generated graph metadata for durability and future search hygiene.

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| F003 | P2 | The packet's own `graph-metadata.json` stores both `.opencode/skill/system-spec-kit/.../graph-metadata-parser.ts` and `mcp_server/lib/graph/graph-metadata-parser.ts` as separate `key_files`, plus the same mixed-format pair for the schema test. The parser dedupes raw strings, not equivalent resolved references. | `graph-metadata.json:33-41`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938-942` |
| F004 | P2 | The entity list includes low-signal key phrases `a` and `the`. `deriveEntities()` consumes raw `extractEntities()` output and applies only its local `shouldKeepEntityName()` filter, so it bypasses the extractor's broader denylist/length filter. | `graph-metadata.json:137-146`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:897-908`; `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:139-149` |

## Delta

New findings: P0 0, P1 0, P2 2. New findings ratio: 0.25.
