# Iteration 007 - Robustness

## Scope

- Dimension: robustness
- Files audited:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Verification:
  - `../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default` PASS, 22 tests
  - Git history for parser and packet test checked

## Findings

### P2-ROB-002 [P2] Graph metadata writer leaves temp files behind on rename failure

- File: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1148`
- Additional evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1149`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:540`
- Evidence: `writeGraphMetadataFile()` writes a unique temp file and immediately renames it, but there is no `try/finally` cleanup after the temp write succeeds. The existing test covers interleaved temp-name uniqueness, not failure cleanup.
- Impact: A transient `renameSync` failure leaves stale `graph-metadata.json.tmp-*` files in spec folders. This is not a correctness blocker, but it can make repeated backfill failures noisier and harder to diagnose.
- Recommendation: Track whether the temp file was created and remove it in a catch/finally block when rename fails, while preserving the original thrown error.

## Ruled Out

- Same-directory temp files avoid cross-device rename failures in normal operation.
- The unique suffix prevents temp-path collision; this finding is specifically about cleanup after a failed write sequence.

## Churn

- New findings this iteration: P0=0, P1=0, P2=1
- Severity-weighted new findings ratio: 0.05
