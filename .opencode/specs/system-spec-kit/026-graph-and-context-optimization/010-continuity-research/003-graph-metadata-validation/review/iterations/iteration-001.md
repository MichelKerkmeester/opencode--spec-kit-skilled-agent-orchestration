# Iteration 001: Parser Sanitization Sweep

## Focus
Reviewed `keepKeyFile()`, the current schema tests, and emitted 003 packet metadata to verify whether the shipped `key_files` sanitization really removed command-like noise.

## Findings

### P0

### P1
- **F001**: Command-shaped `key_files` still survive sanitization and are re-emitted as entity paths — `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:367` — `keepKeyFile()` rejects `node ...` and several other prefixes but still allows `cd ... && npx vitest ...` strings because they look path-like; those strings are already persisted in 003 packet metadata and `deriveEntities()` seeds them back into `entities.path` from `key_files`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:367] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:520] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/001-fix-status-derivation/graph-metadata.json:38] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/003-deduplicate-entities/graph-metadata.json:85] [INFERENCE: corpus scan found 59 command-shaped key_files and 42 command-shaped entities.path values]

```json
{"type":"claim-adjudication","findingId":"F001","claim":"The graph-metadata parser still accepts shell-command strings as key_files and re-emits them into entities.path.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:367",".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:520",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/001-fix-status-derivation/graph-metadata.json:38",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/003-deduplicate-entities/graph-metadata.json:85"],"counterevidenceSought":"Reviewed the keepKeyFile test file and checked whether the leak was limited to stale pre-backfill files.","alternativeExplanation":"This could have been stale output from older metadata generations, but the reviewed 003 packet files already contain the leak and the current predicate still admits the same shape.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Show refreshed 003 packet metadata without command-shaped key_files or entity paths while the current predicate remains unchanged."}
```

### P2

## Ruled Out
- Trigger phrase overflow: the reviewed packet outputs did not exceed the 12-item cap.

## Dead Ends
- The focused parser test only proves a narrow set of prefixes; it does not cover the `cd ... && ...` form that the emitted metadata still shows.

## Recommended Next Focus
Inspect the entity canonical-path preference to see whether the dedup logic also misattributes packet-doc entities when filenames collide.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: The first pass surfaced one concrete parser defect with direct 003-packet evidence instead of only theoretical concern.
