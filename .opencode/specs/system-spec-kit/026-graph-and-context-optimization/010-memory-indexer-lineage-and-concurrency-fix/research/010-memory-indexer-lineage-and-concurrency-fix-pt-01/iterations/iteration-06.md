## Iteration 06

### Focus
Batch execution and scan propagation: verify that the restored scan path still carries the scan-only guard across real batches.

### Findings
- `processBatches()` still executes each batch with `Promise.all(...)`, so scan items inside one batch can run concurrently; B2 did not turn the scanner into a sequential loop. (`.opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts:113-155`)
- The scan handler passes `fromScan: true` directly in the per-file callback used by `processBatches()`, so the propagation is attached at the batch worker boundary rather than in an outer wrapper. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:412-422`)
- The targeted scan regression proves propagation across a five-file packet: every mocked `indexMemoryFile()` call receives `fromScan === true`, `transactionalRecheckCalls` stays zero, and the result envelope shows `failed = 0` at the normal `BATCH_SIZE`. (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:579-705`)
- The complementary non-scan regression confirms that ordinary `indexSingleFile()` calls still omit the flag and still trip the `candidate_changed` guard, which sharply limits the bypass to explicit scan-originated calls. (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:707-740`)

### New Questions
- Is the bypass truly limited to scan-originated callers at the API surface, or only by convention?
- Are there scoped/governed variants of the same batch test?
- How does lineage-state respond if an incorrect predecessor is still attempted despite these batch protections?
- Is there any remaining packet-local evidence that the live acceptance run behaved differently from the unit harness?

### Status
converging
