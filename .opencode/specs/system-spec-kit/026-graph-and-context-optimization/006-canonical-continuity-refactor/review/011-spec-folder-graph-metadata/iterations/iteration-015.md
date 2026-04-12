# Iteration 15: Parser correctness recheck on graph-metadata derivation

## Focus
Post-remediation validation of the graph-metadata parser, schema, and backfill flow with emphasis on whether the parser correctness issue actually cleared. I re-read the referenced extraction paths and compared them against the current on-disk `graph-metadata.json` output.

## Findings

### P0
- None.

### P1
- None.

### P2
- None new.

## Ruled Out
- The graph README and config/schema docs now reflect the graph-metadata rollout correctly, so there is no remaining documentation drift in the requested support surfaces — `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:67-89`, `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:41-42`
- The schema/manual-derived split still looks correct; the open concern is output cleanliness rather than contract shape — `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:32-54`

## Dead Ends
- The newline sanitization change did not resolve the older basename-noise issue because `extractReferencedFilePaths()` still accepts any file-like backticked token verbatim, and the current packet output still contains mixed fully qualified and basename-only entries such as `causal-links-processor.ts`, `stage1-candidate-gen.ts`, and `validate.sh` — `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-335`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:421-446`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:58-177`

## Recommended Next Focus
If this packet is reopened, normalize or filter basename-only file references before they reach `key_files` and derived entities, then regenerate the packet artifact to prove the noise is gone.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness, traceability, maintainability
- Novelty justification: The recheck confirmed the parser remediation only addressed multiline entity text; it did not introduce a new defect or clear the prior basename-noise advisory.
