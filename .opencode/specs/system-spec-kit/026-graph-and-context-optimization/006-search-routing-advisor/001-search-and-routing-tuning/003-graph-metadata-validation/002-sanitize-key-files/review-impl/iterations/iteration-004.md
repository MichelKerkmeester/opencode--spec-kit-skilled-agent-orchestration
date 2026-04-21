# Iteration 004 - Testing

## Scope

- Dimension: testing
- Files audited:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Adjacent boundary test checked:
  - `.opencode/skill/system-spec-kit/mcp_server/tests/path-boundary.vitest.ts`
- Verification:
  - `../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default` PASS, 22 tests
  - Git history for parser and packet test checked

## Findings

### P1-TEST-001 [P1] Sanitizer coverage is mostly helper-level and misses the production bypass paths

- File: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:386`
- Additional evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:237`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:929`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:293`
- Evidence: The frozen noise-class test directly calls `graphMetadataParserTestables.keepKeyFile(...)`, while the production flow is `deriveKeyFiles()` extracting, filtering, resolving, and capping. The only legacy migration test feeds clean `Key Files: spec.md, plan.md`, so it cannot catch the legacy sanitizer bypass from iteration 003.
- Impact: The suite can pass while the shipping parser still accepts polluted legacy `Key Files:` values or traversal-shaped references once they move through the full extraction/resolution path. This is a critical-path coverage gap because the phase’s purpose is sanitizing the actual `derived.key_files` surface.
- Recommendation: Add end-to-end assertions that `deriveGraphMetadata()` drops noisy implementation-summary references from `derived.key_files`, rejects interior `..` segments, and that `validateGraphMetadataContent()` sanitizes or rejects noisy legacy `Key Files:` entries.

## Ruled Out

- `path-boundary.vitest.ts` does cover absolute path rejection end-to-end, but not interior traversal or legacy migration.
- `graph-metadata-schema.vitest.ts` covers nonexistent references, but nonexistent references are filtered by resolution and do not prove the sanitizer rejects malformed references before they reach consumers.

## Churn

- New findings this iteration: P0=0, P1=1, P2=0
- Severity-weighted new findings ratio: 0.25
