# Review Iteration 038
## Dimension: D4 Maintainability
## Focus: new module test coverage, dead code, import hygiene
## New Findings
### [P2] F039 - `tree-sitter-parser` lacks dedicated backend/lifecycle coverage
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:513-605`
- Evidence: No dedicated `tests/**/*tree-sitter*` file exists. The only coverage is indirect through `tests/code-graph-indexer.vitest.ts:76-145`, which calls `parseFile()` via `structural-indexer`, not `TreeSitterParser.init/loadLanguage/loadAllLanguages/isReady` or its error paths. The parser-selection branch in `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:623-644` is also env-gated by `SPECKIT_PARSER`, but there are no tests for the regex fallback branch or tree-sitter initialization failure handling.
- Fix: Add dedicated tests for `TreeSitterParser` lifecycle/error paths and for `getParser()` branch selection (`SPECKIT_PARSER=treesitter|regex`, init failure fallback, grammar-not-loaded behavior).

### [P2] F040 - `query-intent-classifier` is exported but currently unused and untested
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8-162`
- Evidence: Repo-wide usage search only finds the module itself plus its barrel re-export in `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:13`; nothing in `lib/` or `tests/` imports or calls `classifyQueryIntent()`. The similarly named test file `tests/query-classifier.vitest.ts:7-18` targets `../lib/search/query-classifier`, not this new code-graph module, so the current export is dead surface area.
- Fix: Either integrate `classifyQueryIntent()` into the code-graph/query routing path and add dedicated tests, or remove the unused module and barrel export until that integration is ready.

## Remediation Verification
(N/A)

## Iteration Summary
- New findings: P2 x2
- Verified fixes: 0
- Remaining active: 2
