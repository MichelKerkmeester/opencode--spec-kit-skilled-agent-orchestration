# Iteration 003 - Robustness

## Scope

- Dimension: robustness
- Files audited:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Verification:
  - `../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default` PASS, 22 tests
  - Git history for parser and packet test checked

## Findings

### P1-ROB-001 [P1] Legacy graph-metadata migration bypasses the new key-file sanitizer

- File: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:293`
- Additional evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:350`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:225`
- Evidence: The current derivation path filters implementation-summary and fallback references through `keepKeyFile()`, but the legacy fallback path stores `Key Files:` with only `parseDelimitedValues(...)`. `validateGraphMetadataContent()` calls that fallback when current-schema parsing fails, then returns migrated metadata.
- Impact: Any legacy line-based `graph-metadata.json` that already contains command-like or MIME-like key-file entries can still load as a migrated `GraphMetadata` object with polluted `derived.key_files`. That is a live parser path, not a docs-only drift issue, and it weakens the guarantee that graph metadata key files are sanitized.
- Recommendation: Run legacy `key files` values through the same `keepKeyFile()` predicate and, where a spec folder context is available, the same resolution/normalization rules before accepting migrated metadata.

## Ruled Out

- The primary `deriveGraphMetadata()` path does filter extracted references before resolving them.
- The existing legacy test covers successful migration but only with clean `spec.md, plan.md` values, so it does not disprove this bypass.

## Churn

- New findings this iteration: P0=0, P1=1, P2=0
- Severity-weighted new findings ratio: 0.33
