# Mutation response UX payload exposure

## Current Reality

Mutation responses now expose UX payload data produced by post-mutation hooks, including `postMutationHooks` and hint strings. This makes UX guidance available directly in tool responses on successful mutation paths. The finalized follow-up pass also hardened duplicate-save no-op behavior so no false `postMutationHooks` or cache-clearing hints are emitted when caches remain unchanged.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

| Test File | Test Name | Coverage |
|-----------|-----------|----------|
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | `memory_save success response exposes postMutationHooks contract fields and types` | Verifies successful `memory_save` responses include `data.postMutationHooks` with `latencyMs`, cache-clear booleans, and `toolCacheInvalidated` typed as the UX payload contract requires. |
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | `atomicSaveMemory returns post-mutation feedback payload with typed fields for successful saves` | Verifies successful `atomicSaveMemory` responses emit the same typed `postMutationHooks` payload contract. |
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | `atomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status` | Verifies duplicate/no-op atomic saves do not emit `postMutationHooks` when no post-mutation cache work occurs. |

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Mutation response UX payload exposure
- Current reality source: feature_catalog.md
