# Iteration 005 - Correctness

## Scope

- Dimension: correctness
- Files audited:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Verification:
  - `../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default` PASS, 22 tests
  - Git history for parser and packet test checked

## Findings

### P1-CORR-002 [P1] Canonical packet docs can still be evicted by the key-file cap

- File: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938`
- Additional evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:32`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:516`
- Evidence: `deriveKeyFiles()` appends `docs.map((doc) => doc.relativePath)` after referenced paths, then resolves and slices the full list to 20. With 20 or more valid implementation references, canonical docs appended after the references fall past the cap. The existing 30-reference fixture checks entity count, not that canonical docs remain in `derived.key_files`.
- Impact: Packet-local docs are supposed to remain visible in graph metadata even after filtering noisy references. The current ordering can hide `spec.md`, `tasks.md`, or `implementation-summary.md` in large implementation packets, degrading the packet surface that search/routing consumes.
- Recommendation: Reserve slots for canonical docs, append them after the capped non-canonical set, or score canonical docs ahead of implementation references before the final cap.

## Ruled Out

- Canonical docs are collected only if they exist, so missing docs are not the issue.
- The issue is not dedupe: `normalizeUnique()` preserves order, so the references preceding docs are what cause eviction.

## Churn

- New findings this iteration: P0=0, P1=1, P2=0
- Severity-weighted new findings ratio: 0.20
