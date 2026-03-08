# Fix F19

## Scope
- Added missing JSDoc/TSDoc comments to exported declarations in the assigned mcp_server files only.
- Preserved runtime logic, imports, and exports.

## Updated files
- `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts`: MemoryIndexScanArgs, initializeIndexingRuntime, warmEmbeddingModel, runMemoryIndexScan, closeIndexingRuntime
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`: COGNITIVE_CONFIG
- `.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts`: detectNodeVersionMismatch
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`: ToolDefinition
- `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts`: ContextArgs, SearchArgs, TriggerArgs, DeleteArgs, UpdateArgs, ListArgs, StatsArgs, HealthArgs, MemoryValidateArgs, SaveArgs, ScanArgs, CheckpointCreateArgs, CheckpointListArgs, CheckpointRestoreArgs, CheckpointDeleteArgs, PreflightArgs, PostflightArgs, LearningHistoryArgs, DriftWhyArgs, CausalLinkArgs, CausalStatsArgs, CausalUnlinkArgs, BulkDeleteArgs, EvalRunAblationArgs, EvalReportingDashboardArgs, IngestStartArgs, IngestStatusArgs, IngestCancelArgs
- `.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts`: safeJsonParse, safeJsonStringify, safeJsonParseTyped

## Validation
- `npm run -s typecheck` in `.opencode/skill/system-spec-kit` exited with code 2.
- Result: Typecheck still fails due to a pre-existing issue unrelated to these comment-only changes:

```text
mcp_server/tests/folder-discovery-integration.vitest.ts(661,25): error TS2345: Argument of type 'string' is not assignable to parameter of type 'DescriptionCache'.
```
