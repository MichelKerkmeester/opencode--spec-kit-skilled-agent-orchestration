# Fix F18

## Completed work
- Added TSDoc comments for exported declarations and public type re-exports in the assigned partition.
- Replaced catch-body shape casts in file-watcher/job-queue with `instanceof Error`-based narrowing.
- Normalized the remaining raw consolidation catch logging to log narrowed messages.

## Modified files
- `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/learning/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/entity-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/format-helpers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/path-security.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`

## Verification
- Ran `npm run -s typecheck` in `.opencode/skill/system-spec-kit`.
- Result: blocked by a pre-existing repository error in `mcp_server/tests/folder-discovery-integration.vitest.ts:661` (`isCacheStale(specsDir, [specsDir])` argument type mismatch).
