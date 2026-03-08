# Validation signals as retrieval metadata

## Current Reality

Spec document validation metadata integrates into the scoring layer as an additional ranking dimension in Stage 2. Four signal sources contribute: importance tier mapped to a numeric quality score (constitutional=1.0 through deprecated=0.1), the direct `quality_score` database column, `<!-- SPECKIT_LEVEL: N -->` content marker extraction and validation completion markers (`<!-- VALIDATED -->`, `<!-- VALIDATION: PASS -->`).

The combined multiplier is bounded to 0.8-1.2 via a clamping function, composed of quality factor (0.9-1.1), spec level bonus (0-0.06), completion bonus (0-0.04) and checklist bonus (0-0.01). Well-maintained documentation ranks slightly above neglected documentation when both are relevant. No feature flag; always active.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `mcp_server/lib/search/validation-metadata.ts` | Lib | Validation signal metadata |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/retrieval-trace.vitest.ts` | Retrieval trace tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `mcp_server/tests/validation-metadata.vitest.ts` | Validation metadata tests |

## Source Metadata

- Group: Pipeline architecture
- Source feature title: Validation signals as retrieval metadata
- Current reality source: feature_catalog.md
