# Iteration 002 - Security

## Inputs Read

- Prior iteration: `iteration-001.md`
- Registry: `deep-review-impl-findings-registry.json`
- Code: `cross-encoder.ts`, scoped cross-encoder tests

## Verification

- Vitest: PASS, 2 files, 61 tests.
- Git history checked: latest relevant commits `4e60c007fa`, `22c1c33a94`, `d8ea31810c`.

## Findings

### DRI-F005 - P2 Security

The reranker cache uses a simple signed 32-bit rolling hash and then stores only the hash-derived key. There is no collision validation against the original provider/query/document-id tuple before returning cached results.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:259`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:265`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:435`

Impact: a collision can produce a false cache hit and return another query's rerank order. This is lower severity because the cache is process-local and bounded, but the lookup has no secondary equality check.

## Convergence

New finding ratio: 0.25. Continue.
