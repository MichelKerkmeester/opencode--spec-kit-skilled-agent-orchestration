# Build Agent 02 Verification - Shared Utils (Read-only)

- Mode: build-verification agent (read-only), no source edits.
- Input artifact reviewed: `scratch/context-agent-02-shared-utils.md`.
- Noise filter: no top finding depended on node_modules relocation-only changes.

## Validation Outcome

- status: `partial`
- confidence: `0.93`
- validated_count: `3`
- confirmed_count: `3`

## Confirmed Findings (Top Severity)

### C02-F001 - CONFIRMED (critical)

- Reproduced score-path mismatch in intent weighting:
  - `mcp_server/handlers/memory-search.ts:397` uses fallback `r.score` when `r.similarity` absent.
  - `mcp_server/handlers/memory-search.ts:401` always applies `/ 100` normalization.
  - Hybrid score semantics are already normalized `0..1` per source comments and logic:
    - `mcp_server/lib/search/hybrid-search.ts:33-45`
    - `mcp_server/lib/search/hybrid-search.ts:307`
  - Canonical shared contract defines `SearchResult.score` as normalized `0..1`:
    - `shared/types.ts:202-210`
- Conclusion: when `similarity` is absent and `score` is already `0..1`, dividing by 100 collapses contribution to `0..0.01`.

### C02-F002 - CONFIRMED (high)

- Reproduced package root export narrowing:
  - `shared/package.json:5` sets `"main": "dist/embeddings.js"`.
  - `shared/package.json:7` exports `".": "./dist/embeddings.js"`.
  - Barrel file exports broader surface from multiple modules:
    - `shared/index.ts:11-120` (types + embeddings; file continues beyond this range).
- Conclusion: root package entrypoint does not expose full barrel API implied by `shared/index.ts`.

### C02-F003 - CONFIRMED (medium)

- Reproduced soft-fail behavior in batch embedding path:
  - `shared/embeddings.ts:321-337` catches batch errors and on non-429 (or exhausted retries) sets batch to `null` entries.
  - `shared/embeddings.ts:341` appends null batch outputs into overall result array.
- Conclusion: batch flow degrades to null vectors instead of fail-fast error propagation.

## Notes

- C02-F004 was not re-validated in this pass due to top-severity-first prioritization.
- Optional consumer-impact check for C02-F002: no current `@spec-kit/shared` root imports found under this repo scan (`*.ts`), so impact is contract-risk rather than confirmed active breakage.
