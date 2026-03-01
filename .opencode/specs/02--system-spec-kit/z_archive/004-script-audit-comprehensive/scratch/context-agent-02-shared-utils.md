# Context Audit C02 - Shared Utilities

- Scope: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/system-spec-kit/shared`
- Alignment target: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/workflows-code--opencode`
- Method: high-value read-only scan focused on utility correctness, contract drift, import/export mismatches, and silent failure modes.
- Exclusion honored: issues attributable only to node_modules relocation were excluded.

## Status

- status: `partial` (high-value pass completed)
- confidence: `0.89`
- tool-call governance: initial scan completed; deeper full-caller trace remains.
- remaining scope estimate: ~10-14 additional reads/greps to fully validate all downstream call-sites for score/similarity semantics and package-entry consumers.

## Findings

### C02-F001 - CRITICAL - Score normalization bug in intent weighting path

- Severity: `critical`
- Category: utility correctness / API contract drift
- Impact: mixed result sources can be mis-ranked because `score` values already normalized to `0..1` are divided by `100`, collapsing their contribution to `0..0.01`.
- Why this matters: intent weighting can systematically under-rank BM25/hybrid/graph results compared to vector results where `similarity` is present.
- Evidence:
  - `mcp_server/handlers/memory-search.ts:397` falls back to `(r.score as number)` when `similarity` is absent.
  - `mcp_server/handlers/memory-search.ts:401` divides `similarityRaw` by `100` unconditionally.
  - `mcp_server/lib/search/hybrid-search.ts:307` normalizes source-group scores to `0..1`.
  - `shared/types.ts:210` defines canonical `SearchResult.score` as normalized relevance score.
- Risk type: silent ranking degradation (no exception thrown).

### C02-F002 - HIGH - Package root export points to embeddings-only entrypoint while shared barrel exposes broader API

- Severity: `high`
- Category: import/export mismatch / API surface drift
- Impact: consumers importing package root (`@spec-kit/shared`) receive `dist/embeddings.js`, not the full barrel (`dist/index.js`), so root-level API contract is narrower than implied by source barrel.
- Evidence:
  - `shared/package.json:5` sets `"main": "dist/embeddings.js"`.
  - `shared/package.json:7` exports `".": "./dist/embeddings.js"`.
  - `shared/index.ts:11` onward exports wide surface (types, retry, path-security, scoring, chunking, trigger extraction).
- Risk type: runtime import surprises and contract confusion for root consumers.

### C02-F003 - MEDIUM - Batch embedding path degrades to nulls on non-429 failures

- Severity: `medium`
- Category: silent failure mode
- Impact: non-429 errors in a batch are converted to `null` results for the full batch, allowing caller flow to continue with degraded data and no structured error propagation.
- Evidence:
  - `shared/embeddings.ts:321` catches batch errors.
  - `shared/embeddings.ts:334-337` maps failed batch to `null` entries.
  - `shared/embeddings.ts:341` appends null batch results into final output.
- Risk type: data quality failure without fail-fast signaling.

### C02-F004 - MEDIUM - Documentation/API contract drift in shared README

- Severity: `medium`
- Category: API contract drift
- Impact: README examples and architecture notes can mislead consumers about build output location and nullable return values.
- Evidence:
  - `shared/README.md:13` states compiled output is produced in-place.
  - `shared/tsconfig.json:6` outputs build artifacts to `./dist`.
  - `shared/README.md:143-145` types embedding result as `Float32Array` (non-null).
  - `shared/embeddings.ts:365` and `shared/embeddings.ts:368` show `generateDocumentEmbedding` can return `null`.
- Risk type: integration mistakes from stale docs.

## Alignment Notes (workflows-code--opencode)

- Naming baseline appears aligned for TypeScript symbols (interfaces/types PascalCase, functions camelCase), matching:
  - `workflows-code--opencode/SKILL.md:277`
  - `workflows-code--opencode/references/typescript/quick_reference.md:125`
  - `workflows-code--opencode/references/typescript/quick_reference.md:128`
- Primary drift observed is contract/semantics, not naming style.

## Recommended Priority

1. P0: fix C02-F001 (ranking correctness regression risk).
2. P1: resolve C02-F002 (package root API clarity).
3. P1: decide fail-fast vs soft-fail contract for C02-F003.
4. P2: sync docs for C02-F004.
