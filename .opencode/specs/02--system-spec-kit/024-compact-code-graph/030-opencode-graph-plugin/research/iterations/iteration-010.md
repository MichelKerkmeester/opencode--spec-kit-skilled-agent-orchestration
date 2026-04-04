# Research Iteration 010: Retention, Deduplication, Privacy, and Preview Handling

## Focus

Use `opencode-lcm` to refine how retention, pinning, blob deduplication, privacy filtering, and metadata-only previews could improve Spec Kit Memory and the broader compact code graph runtime together.

## Findings

### Retention Is More Useful When It Is Lineage-Aware

`opencode-lcm` retention is not flat TTL pruning. It targets:

- unpinned sessions
- leaf sessions only
- explicit orphan blobs

[SOURCE: `external/opencode-lcm-master/src/store-retention.ts:43-73`] [SOURCE: `external/opencode-lcm-master/src/store-retention.ts:96-152`]

That is more specific than the earlier generic "pin-aware retention" takeaway.

### Blob Dedupe Is Safer After Redaction

The plugin hashes **redacted** content, stores full payloads in `artifact_blobs`, and supports backfill from legacy inline content. [SOURCE: `external/opencode-lcm-master/src/store-artifacts.ts:124-145`] [SOURCE: `external/opencode-lcm-master/src/store-artifacts.ts:286-307`] [SOURCE: `external/opencode-lcm-master/src/store.ts:4125-4147`]

That gives a concrete pattern:

- redact first
- hash second
- preview inline
- externalize full bodies
- backfill older rows later

### Privacy And Preview Should Be Coupled At Ingest Time

The plugin does:

- tool/file exclusion before previewing
- workspace-bounded preview resolution
- metadata-only previews
- redaction before storage

[SOURCE: `external/opencode-lcm-master/src/privacy.ts:67-123`] [SOURCE: `external/opencode-lcm-master/src/store-artifacts.ts:329-405`] [SOURCE: `external/opencode-lcm-master/src/preview-providers.ts:44-55`] [SOURCE: `external/opencode-lcm-master/src/preview-providers.ts:143-298`] [SOURCE: `external/opencode-lcm-master/src/workspace-path.ts:3-20`]

That is safer than "store first, sanitize later."

### Our Memory Layer And Graph Runtime Are Uneven Here

Spec Kit Memory already has:

- archival and pinning semantics [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:371-405`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:502-555`]
- tiered recall [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156-169`]

But the graph/runtime side is still mostly:

- tempdir hook-state cleanup
- stale-cache rejection
- render-time file dedup

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:30-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:56-64`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:107-170`]

## Recommendations

1. Add a shared retention contract for graph/runtime artifacts with `pinned`, `pin_reason`, and worktree-aware prune reports.
2. Introduce a sanitized blob tier for large recovery payloads, graph/session snapshots, and artifact evidence.
3. Reuse a common privacy compiler for future graph/runtime previews.
4. Keep retrieval and compact-merger design; port the operational mechanics around it.

## Duplication Check

This is new relative to earlier packet research because it adds mechanism detail:

- leaf-only pruning
- pin metadata surviving snapshot flows
- hash-after-redaction dedupe with backfill
- privacy-filtered workspace-bounded previews
- the sharper comparison between mature memory archival semantics and still-ephemeral graph/runtime state
