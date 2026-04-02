# Review Iteration 040
## Dimension: D4 Maintainability
## Focus: overall architecture coherence post-v2 remediation
## New Findings
### [P2] F043 - Parser backend contracts are duplicated across sibling modules instead of living in the shared type layer
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:19-38`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:17-34`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:47-66`
- Evidence: `ParserAdapter` and the parser-facing `RawCapture` shape are defined separately in both `tree-sitter-parser.ts` and `structural-indexer.ts`, while the canonical shared graph contracts already live in `indexer-types.ts`. The duplicate `capturesToNodes()` implementation in `tree-sitter-parser.ts:468-509` also mirrors `structural-indexer.ts:666-710`, which means parser backends now have more than one owner for the same internal contract and conversion logic.
- Fix: Move parser backend contracts into a shared internal types/helpers module under `lib/code-graph/` (for example `parser-types.ts` or extend `indexer-types.ts`), export one canonical `ParserAdapter`/`RawCapture`, and consolidate the shared capture-to-node transform so regex and tree-sitter backends consume the same contract.

### [P2] F044 - `SPECKIT_PARSER` is a live runtime switch with no discoverable config surface outside implementation/spec artifacts
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:4-7,623-644`; `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:1-168`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:4-13`
- Evidence: `getParser()` branches on `process.env.SPECKIT_PARSER` at runtime, but repo search only finds the flag in `structural-indexer.ts` and spec/review documents; it is absent from the checked-in config/capability flag surfaces and absent from top-level docs. By contrast, other rollout flags have a discoverable home in `lib/config/capability-flags.ts`, so the parser selector currently behaves like a hidden implementation knob rather than part of a coherent runtime configuration model.
- Fix: Either promote `SPECKIT_PARSER` into the project's canonical config/feature-flag surface with docs and validation, or demote it to an internal/testing-only switch and stop treating it as a user-facing runtime configuration mechanism.

## Architecture Assessment
The code-graph subsystem is materially healthier after the v2 remediation: the main dispatch chain is coherent, the tool family is still cleanly segmented (`tools/code-graph-tools.ts` -> `handlers/code-graph/index.ts` -> handler modules), and the context server delegates to that stack in the same way it does for the other tool families. From a top-level layering perspective, the barrel, dispatcher, handler index, and context-server integration all still line up, which is a good sign this remediation wave did not break the system's primary composition pattern.

That said, the new modules are not equally integrated. `tree-sitter-parser.ts` is genuinely on the live path through `structural-indexer.getParser()` and is therefore part of the real backend architecture, but it brings its own duplicate local contracts and mirrored conversion logic instead of plugging into a single shared parser seam. `query-intent-classifier.ts`, by contrast, still looks like architectural spillover: it is exported from the code-graph barrel, but the live routing path continues to use the older search-side classifier/router stack (`lib/search/query-classifier.ts`, `lib/search/query-router.ts`), so the new classifier remains parallel architecture rather than integrated architecture.

Error handling is mixed but mostly predictable. The handler family consistently returns JSON envelopes with `status: 'ok' | 'error'`, and the code-graph tool dispatcher adds lightweight required-field checks before forwarding. However, this family still does not participate in the stronger centralized schema-validation pattern used by `context-tools.ts` and `memory-tools.ts`, so it remains a notable outlier in the broader MCP server architecture. That inconsistency is already a known drift signal from earlier iterations, and it still weakens the "one tool family, one validation contract" story.

The biggest maintainability concern now is architectural ownership. The subsystem no longer looks broken, but it does look split-brained in a few places: parser contracts live in two modules, parser-node conversion logic has two owners, runtime parser selection is governed by an undocumented env var, and intent routing has two separate classifier concepts in adjacent domains. None of those individually look catastrophic, but together they are clear signs of architectural drift rather than a fully converged design. So the subsystem is coherent enough to operate, but not yet coherent enough to feel fully settled.

## Convergence Summary
Of the original 33 findings, the remediation work and later verification passes fixed the large majority. Iterations 034-036 verified 24 fixes across all ranges. The main original findings still active at the end of the prior convergence work were F001, F002 (partial), F010 (partial), F020 (partial), F022 (partial), F029, F030 (partial), F031, and F033.

Iterations 031-040 added post-v2 findings in the new code: F030-F034 in the tree-sitter backend review, F035-F038 in the new query-intent classifier review, F039-F040 for dead surface / missing dedicated coverage, F041-F042 for additional parser edge cases, and F043-F044 for duplicated parser contracts and undiscoverable parser configuration. The original remediation substantially improved the old architecture, but the new modules introduced a fresh maintainability tail that kept full convergence from landing cleanly.

Net assessment: the subsystem is no longer showing broad architectural failure, but it is still carrying localized drift in its new extension seams. The remaining issues are now mostly about ownership boundaries, integration completeness, and configuration discoverability rather than large-scale wiring defects.

## Iteration Summary
- New findings: 2 P2
- Verified fixes: 0
- Remaining active: 10
