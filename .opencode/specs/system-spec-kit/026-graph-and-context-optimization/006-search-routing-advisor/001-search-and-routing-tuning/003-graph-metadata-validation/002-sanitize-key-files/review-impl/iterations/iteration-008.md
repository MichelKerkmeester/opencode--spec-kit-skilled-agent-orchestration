# Iteration 008 - Testing

## Scope

- Dimension: testing
- Files audited:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Verification:
  - `../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default` PASS, 22 tests
  - Git history for parser and packet test checked

## Findings

### P1-TEST-002 [P1] No test locks canonical-doc survival when key_files hits the cap

- File: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:514`
- Additional evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:521`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942`
- Evidence: The suite has a 30-reference fixture, but it only asserts the entity cap and runtime-name filtering. It never asserts `metadata.derived.key_files` contains canonical docs after many valid implementation references.
- Impact: The exact cap-ordering bug from `P1-CORR-002` can regress silently because the only high-volume fixture does not inspect the capped `key_files` output.
- Recommendation: Add a high-volume `deriveGraphMetadata()` test that materializes more than 20 implementation references and asserts canonical docs such as `spec.md`, `tasks.md`, and `implementation-summary.md` remain in `derived.key_files`.

## Ruled Out

- Existing assertions do check cross-track key files and nonexistent references, but neither covers the cap boundary for canonical packet docs.

## Churn

- New findings this iteration: P0=0, P1=1, P2=0
- Severity-weighted new findings ratio: 0.17
