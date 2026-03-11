# Verify-fix-verify memory quality loop

## Current Reality

The quality loop is opt-in. When `SPECKIT_QUALITY_LOOP` is unset or not equal to `true`, the runtime still computes a quality score but the save passes without retries or rejection. When the flag is enabled, the save pipeline runs an initial quality evaluation and then up to 2 immediate auto-fix retries by default (`maxRetries=2`). Auto-fixes can re-extract trigger phrases from headings/title, normalize unclosed anchors, and trim content to the shared token budget.

`attempts` reports the actual number of evaluations used, not the configured ceiling. If a retry applies no fixes, the loop breaks early, so a case with `maxRetries=5` can still reject after only 2 total attempts (1 initial evaluation + 1 no-op retry). The rejection reason also reports the actual auto-fix attempt count.

When fixes improve the score past the threshold, the handler returns `fixedContent` so `memory-save.ts` can persist the mutated content and recompute the content hash. When the loop rejects a save, `indexMemoryFile()` returns `status: 'rejected'` without continuing to storage. `atomicSaveMemory()` treats that rejected status as a non-retry rollback path: it restores the previous file or deletes the newly written file immediately.

The `CHARS_PER_TOKEN` ratio defaults to `4` and is shared with `preflight.ts` through `MCP_CHARS_PER_TOKEN` so both save-time checks use the same token estimate.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality scoring, retry loop, auto-fix logic, and actual-attempt reporting |
| `mcp_server/handlers/memory-save.ts` | Handler | Save-path integration, rejected status handling, and fixed-content persistence |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/quality-loop.vitest.ts` | Attempt counting, retry behavior, and rejection semantics |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Rejected-save rollback semantics in atomic save flow |

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Verify-fix-verify memory quality loop
- Current reality source: feature_catalog.md
