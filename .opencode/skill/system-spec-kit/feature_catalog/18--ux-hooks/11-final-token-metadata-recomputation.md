# Final token metadata recomputation

## Current Reality

Phase 014 now recomputes final token metadata after `appendAutoSurfaceHints(...)` adds the last response-envelope content and before token-budget enforcement evaluates the payload. This keeps `meta.tokenCount` aligned with the finalized envelope that callers actually receive.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

| Test File | Test Name | Coverage |
|-----------|-----------|----------|
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | `appendAutoSurfaceHints injects hints and sets tokenCount from the final serialized envelope JSON` | Verifies `appendAutoSurfaceHints` drives final token metadata recomputation by using `syncEnvelopeTokenCount` and `serializeEnvelopeWithTokenCount` on the final envelope payload. |

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Final token metadata recomputation
- Current reality source: feature_catalog.md
