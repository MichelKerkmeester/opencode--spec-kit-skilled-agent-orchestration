# Research Iteration 006: Specific Upgrade Paths For Existing Graph Logic And Hooks

## Focus

Turn the broader comparison into concrete recommendations for our existing code-graph system logic, hook behavior, and operational tooling.

## Findings

### 1. Add A `code_graph_doctor` Surface

Best next operational upgrade: add a graph-focused doctor tool that checks and optionally repairs:

- orphaned `code_edges`
- `code_files` rows pointing to deleted files
- parse-health drift
- stale metadata / git-head mismatch
- snapshot/import schema mismatch in future export flows

Why this matters:

- today, `code_graph_status` reports health but does not repair it [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9-47`]
- `ensureCodeGraphReady()` repairs freshness through reindexing, but not deeper integrity issues [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:93-166`]
- LCM shows that an explicit doctor surface makes operational trust much higher. [SOURCE: `external/opencode-lcm-master/src/store.ts:1369-1605`]

### 2. Add Snapshot Export/Import For Graph-Adjacent Runtime State

The second major upgrade should be a portable snapshot surface for at least:

- compacted session briefs
- startup/recovery summaries
- future graph-side caches or working sets
- optionally the code-graph DB itself or a curated graph excerpt format

LCM's snapshot implementation is valuable not because we need its schema, but because it proves three useful behaviors:

1. export/import as first-class operations
2. merge vs replace safety
3. worktree-aware rehome logic

[SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:148-260`]

### 3. Strengthen Startup/Resume Provenance

Current startup and bootstrap output is compact and good, but still mostly says:

- graph counts
- top highlights
- last scan age
- last session summary
- recommended action

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47-115`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:204-260`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:118-155`]

The next improvement should be provenance-rich recovery signals:

- whether the recovery payload is live, cached, stale, or imported
- age of the last compact brief
- active worktree/branch identity
- top working-set files/symbols rather than only global graph highlights

This would make startup/recovery context feel more trustworthy without making it much larger.

### 4. Adopt Workspace-Safe Paths And Worktree Identity Everywhere New

If we add any export/import or artifact-preview surface, we should explicitly port two safety patterns:

- workspace-bounded path resolution [SOURCE: `external/opencode-lcm-master/src/workspace-path.ts:3-20`]
- normalized worktree keys [SOURCE: `external/opencode-lcm-master/src/worktree-key.ts:1-4`]

Our current hook-state hashing by cwd is helpful, but it is not a replacement for explicit worktree identity in portable workflows. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:32-45`]

### 5. Add Metadata-Only Preview Support For Non-Text Artifacts

If compaction or future graph/session snapshots ever reference binary artifacts, generated files, or attachments, we should not store or inject raw blobs by default.

Instead, use lightweight preview metadata:

- fingerprint / size
- byte signature
- image dimensions
- PDF page estimates
- ZIP entry counts

[SOURCE: `external/opencode-lcm-master/src/preview-providers.ts:143-260`]

This would be especially useful for:

- artifact-heavy research sessions
- generated diagrams or exports
- debugging sessions that touch non-text build outputs

### 6. Keep Our Current Budgeting And Dedupe Model

One thing we should **not** replace is the current compact-merge model. Our floor-plus-overflow budgeter and file-level deduplication already match the right design instinct for compaction payloads. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:106-197`]

The external plugin strengthens the case for improving the **operational shell** around that merger, not for discarding the merger itself.

## Convergence

This pass added real new information, but it stayed in the "operational hardening" lane rather than opening a new architectural direction. Convergence reached again: the best next steps are now specific enough to become follow-on implementation work.
