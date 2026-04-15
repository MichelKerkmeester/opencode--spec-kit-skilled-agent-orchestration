---
iteration: 4
dimension: "Follow-up API integrity"
focus: "Verify refreshGraphMetadata, reindexSpecDocs, and runEnrichmentBackfill are real implementations and re-exported publicly"
timestamp: "2026-04-15T08:48:10Z"
runtime: "cli-copilot --effort high"
status: "clean"
findings:
  P0: 0
  P1: 0
  P2: 0
---

# Iteration 004

## Findings

No P1 or P2 findings. All three follow-up APIs are implemented and publicly re-exported.

## Ruled-out directions explored

- **`refreshGraphMetadata(specFolder)` is real.** The API wrapper resolves the spec-folder path, then calls the graph parser helper that loads existing metadata, derives fresh metadata, merges it, and writes `graph-metadata.json`. This is not a stub or no-op. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:66-98] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:979-1005]
- **`reindexSpecDocs(specFolder)` is real.** The API wrapper delegates to `runMemoryIndexScan()` with `includeSpecDocs: true`, and the scan handler indexes files by routing each file through `indexMemoryFile()`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:100-109] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:138-143] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:149-171]
- **`runEnrichmentBackfill(specFolder)` is real.** The wrapper temporarily sets `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED=true`, reuses `runMemoryIndexScan()`, and then restores the prior env state. Because the post-insert wrapper branches on that flag, this backfill path re-enters real enrichment logic instead of silently doing ordinary reindex work. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:111-128] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:56-58] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:206-225]
- **Public barrel export is present.** `api/index.ts` re-exports all three follow-up APIs from `./indexing.js`, so callers do not need to reach into internals. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/api/index.ts:33-42]

## Evidence summary

- No stub, TODO, throw-only wrapper, or silent no-op surfaced in the follow-up API surface.
- All three functions route into existing runtime logic rather than duplicating or bypassing it.
- Public re-exports are present and consistent with the workflow-side imports.

## Novelty justification

This iteration added new signal by confirming the packet’s replacement follow-up surfaces are real operational APIs, which narrows the remaining review risk to correctness and classification rather than missing implementation.
