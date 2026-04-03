# Research Iteration 005: Broader Code Graph and Hook-System Comparison

## Focus

Check whether `opencode-lcm` suggests improvements for our other existing code-graph logic, hook-state handling, compaction flow, and operational tooling beyond the original packet-024 adapter recommendation.

## Findings

### Current Stack Already Has Strong Compact-Context Building Blocks

Our current runtime already has several strong pieces that should be preserved:

1. **Compact startup brief**
   - `buildStartupBrief()` already emits a compact graph outline plus lightweight session continuity. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47-115`]
2. **Shared structural bootstrap contract**
   - `buildStructuralBootstrapContract()` already keeps structural context bounded and reusable across `session_bootstrap`, `session_resume`, and `session_health`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:28-39`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:204-260`]
3. **Hook-based startup injection**
   - `session-prime.ts` already injects structural context, session continuity, and stale-graph warnings into hook-capable runtimes. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:99-155`]
4. **Budget-aware compaction merge**
   - `mergeCompactBrief()` already does source budgeting, truncation, and cross-section file deduplication. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:106-197`]

So the new opportunity is **not** to replace these components. It is to make the surrounding graph/runtime operations more durable and more portable.

### LCM Suggests Missing Operational Capabilities Around The Graph Runtime

The strongest new ideas are operational rather than retrieval-centric:

1. **Portable snapshots with worktree-aware import**
   - `opencode-lcm` can export/import store snapshots and optionally rehome imported sessions to the current worktree. [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:148-218`]
2. **Workspace-bounded file resolution**
   - `resolveWorkspacePath()` rejects paths that escape the workspace. [SOURCE: `external/opencode-lcm-master/src/workspace-path.ts:3-20`]
3. **Normalized worktree identity**
   - `normalizeWorktreeKey()` creates a stable key for cross-worktree operations. [SOURCE: `external/opencode-lcm-master/src/worktree-key.ts:1-4`]
4. **Retention with pins and orphan cleanup**
   - retention candidates skip pinned sessions, respect lineage, and prune orphan blobs. [SOURCE: `external/opencode-lcm-master/src/store-retention.ts:43-152`]
5. **Metadata-only preview providers**
   - preview providers extract fingerprints, byte peeks, image dimensions, PDF page estimates, and ZIP entry counts without dumping raw binary content into summaries. [SOURCE: `external/opencode-lcm-master/src/preview-providers.ts:143-260`]

### Current Code Graph Surfaces Are Still Narrow By Comparison

Our graph MCP surface currently exposes only:

- `code_graph_scan`
- `code_graph_query`
- `code_graph_status`
- `code_graph_context`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:5-13`]

`code_graph_status` reports health and counts, but it does not expose repair, export/import, or retention controls. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9-47`]

`ensureCodeGraphReady()` handles empty graphs, git-head drift, file-mtime drift, deleted tracked files, and auto-reindexing, but it is still fundamentally an index-freshness helper rather than a full integrity-management surface. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:93-166`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:207-260`]

### Hook State Is Durable Enough For One Session, But Not Portable

Our hook state is intentionally lightweight:

- tempdir-scoped
- keyed by hashed cwd + session id
- stores last spec folder, session summary, and cached compact prime
- cleaned up by age

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:14-30`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:67-103`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:178-198`]

That is a good runtime cache model, but it is not enough for:

- worktree handoff
- portable resume packets
- deliberate archive/pin behavior
- import/export between environments

## Interim Recommendation

The external plugin gives us a second design target:

1. keep the current compact graph/context runtime surfaces
2. add **operational durability** around them
3. prioritize doctor/export/import/path-safety/preview support over any attempt to clone the plugin's whole archive backend
