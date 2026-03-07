# Schema and type contract synchronization

## Current Reality

Phase 014 aligned runtime validation and TypeScript contracts for the new mutation-safety behavior. Tool schemas and types were updated together so added parameters and output metadata remain consistent across handler logic, schema validation, and tool typing. The finalized follow-up closures specifically synced required `confirmName` enforcement and the updated mutation response metadata contract across all layers.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/types.ts` | Handler | Type definitions |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Tool input schema tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Schema and type contract synchronization
- Current reality source: feature_catalog.md
