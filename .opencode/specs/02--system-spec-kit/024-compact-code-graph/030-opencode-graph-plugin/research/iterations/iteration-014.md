# Research Iteration 014: Over-Port Failure Modes and Hidden Costs

## Focus

Use `opencode-lcm` to identify failure modes, regressions, anti-patterns, and hidden costs if we over-port plugin archive patterns into the current memory/code-graph runtime.

## Findings

### We Could Accidentally Create Competing Recovery Authorities

The current runtime already has:

- a compact hook cache (`pendingCompactPrime`)
- durable tool-based recovery via `session_resume` / `session_bootstrap`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:299-317`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44-75`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:59-143`]

If we add LCM-style persisted resume snapshots on top, we risk three conflicting truths about the same session.

### We Could End Up With Two Snapshot Planes

`opencode-lcm` snapshot export/import is session/worktree-oriented. [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:148-218`]

The live runtime already has scoped checkpoint snapshots keyed by spec folder and governance scope. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:423-535`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1419-1529`]

Over-porting both models would create overlapping restore and repair semantics.

### Lexical Worktree Keys Could Weaken Current Path Safety

The plugin normalizes worktree identity as a lowercased path string. [SOURCE: `external/opencode-lcm-master/src/worktree-key.ts:1-4`]

Our current graph safety depends on canonical realpath-based enforcement. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:65-95`]

Copying the lexical worktree key straight into the graph runtime could alias symlink/case variants.

### Inline Archive Maintenance Would Hurt Hook Latency

Packet 024 deliberately chose:

- precompute at compaction
- inject at session start
- fast direct imports in hooks

[SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:50-59`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:83-92`]

Over-porting summary DAG maintenance or archive repair into prompt-time hooks would reverse that tradeoff.

### Archive-Style Path Redaction Can Break Structural Anchors

LCM privacy can redact paths and exclude whole tool outputs. [SOURCE: `external/opencode-lcm-master/src/privacy.ts:81-123`]

That is safe for archive storage, but dangerous if copied into the shared graph/runtime core where structural context depends on concrete anchors. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:40-56`]

## Recommendations

1. Keep the adapter retrieval-only in v1.
2. Treat portability as an extension of the current checkpoint model, not a second snapshot product.
3. Derive any new worktree identity from canonical realpaths, not lowercased lexical paths.
4. Keep archive summarization, repair, and import reindexing off prompt-time hooks.
5. Port privacy rules narrowly so secrets are redacted without breaking file/symbol anchors.

## Duplication Check

This is new relative to earlier packet research because it identifies five concrete over-port failure modes:

- competing recovery authorities
- duplicate snapshot planes
- weaker worktree identity than current path safety
- hook-latency regression from inline archive maintenance
- anchor loss from archive-style path redaction
