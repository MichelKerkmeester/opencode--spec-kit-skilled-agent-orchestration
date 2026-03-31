# Iteration 009: D4 Maintainability

## Findings

No P0 issues found.

### [P1] Seed resolution suppresses graph-DB failures instead of propagating them
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:83-127`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:131-165`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:168-239`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:48-63`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:74-118`
- **Issue**: All three resolver entry points catch database failures and silently synthesize low-confidence file anchors (`<unknown>` or bare file anchors) instead of returning a typed failure. `buildContext()` then treats those placeholders as successfully resolved anchors, so higher layers lose the ability to distinguish "graph DB unavailable" from "seed legitimately did not match anything." That makes the code-graph stack much harder to debug and turns operational failures into normal-looking empty responses.
- **Evidence**: `resolveManualSeed()`, `resolveGraphSeed()`, and `resolveSeed()` each swallow errors and return placeholder `ArtifactRef` objects. `buildContext()` only falls back when `resolvedAnchors.length === 0`; placeholder refs still count as resolved anchors, so the normal neighborhood/outline flow continues with no structured error channel.
- **Fix**: Return a typed resolution result that can represent `error` separately from `exact/enclosing/file_anchor`, or throw a typed resolver error and let `buildContext()` decide whether to degrade to fallback or surface a real failure.

### [P2] `extractEdges()` still owns a dead `TESTED_BY` pass that can never fire from `parseFile()`
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:315-340`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:371-373`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:448-469`
- **Issue**: The single-file extraction path still contains a cross-file `TESTED_BY` heuristic, but `parseFile()` only ever passes one file's nodes into `extractEdges()`. That means the in-function `TESTED_BY` block is inert today, while `indexFiles()` separately implements the real cross-file pass later. The relationship rule now has two owners, one dead and one live, which raises follow-on change cost and makes the extraction pipeline harder to reason about.
- **Evidence**: `extractEdges()` groups only the current `nodes` array by `filePath` and tries to discover a sibling `testedPath`; with `parseFile()` calling it per file, that sibling group can never exist there. `indexFiles()` then repeats the same `TESTED_BY` heuristic after all parse results are collected, which is the only branch that can actually produce cross-file edges.
- **Fix**: Remove the inert `TESTED_BY` block from `extractEdges()` and keep the heuristic in one post-pass helper, or refactor both call sites to share a single explicit cross-file edge synthesizer.

### [P2] `excludeGlobs` is exposed end-to-end but ignored by the actual file walker
- **File**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:623-631`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:35-39`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:393-424`
- **Issue**: The public scan contract advertises `excludeGlobs`, and the handler merges those values into `IndexerConfig`, but `findFiles()` never reads its `excludeGlobs` argument. That leaves a dead configuration knob in the public API: maintainers and operators can request exclusions, yet the structural indexer will still walk everything except the hardcoded directory skips.
- **Evidence**: `code_graph_scan` publishes `excludeGlobs`; `handleCodeGraphScan()` forwards them into `config.excludeGlobs`; `findFiles()` receives that parameter but only checks `node_modules`, `dist`, and `.git` by name before pushing files into `results`.
- **Fix**: Either implement real glob exclusion in `findFiles()` or remove `excludeGlobs` from the public and internal contracts until the walker honors it.

## Notes

- `code-graph-context.ts` still exposes unused `input` and `includeTrace` knobs, but I did not promote that as a separate finding because it overlaps the larger pattern here: the library layer is advertising a broader contract than it currently honors.
- `runtime-detection.ts` and `index.ts` look more like partially orphaned surfaces than immediate defect sources in this slice. I did not find a stronger maintainability issue there than the library-contract drift already captured above.
- Targeted verification stayed green: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts` passed with 3 files / 44 tests.

## Summary

- P0: 0 findings
- P1: 1 finding
- P2: 2 findings
- newFindingsRatio: 1.00
- Recommended next focus: Iteration 010 should do convergence and cleanup prioritization around public contract ownership in the code-graph stack, especially resolver failure signaling, dead extraction branches, and API knobs that are documented but not honored.
