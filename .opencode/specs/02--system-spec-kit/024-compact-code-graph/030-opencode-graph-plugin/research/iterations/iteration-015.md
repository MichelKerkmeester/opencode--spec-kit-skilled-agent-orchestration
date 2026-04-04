# Research Iteration 015: Dependency-Ordered Roadmap

## Focus

Turn the expanded findings into a dependency-ordered implementation roadmap across the OpenCode adapter and the broader graph/runtime hardening work.

## Findings

### The First Dependency Is A Shared Payload Layer

The true phase-1 prerequisite is not the plugin shell itself. It is a shared compact-context assembly contract that unifies:

- startup brief output
- structural bootstrap output
- compact-merger output
- recovery digests

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47-115`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:209-267`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:106-197`]

Without that, the adapter would either duplicate assembly logic or rely on slower tool orchestration.

### The OpenCode Adapter Should Land Second

The adapter depends on the shared payload/provenance layer, but it does **not** depend on doctor/export/import work. That makes it the fastest path to closing the actual OpenCode gap once the shared payload contract exists. [SOURCE: `.opencode/skill/system-spec-kit/references/config/hook_system.md:48-50`] [SOURCE: `external/opencode-lcm-master/src/store.ts:2876-2924`] [SOURCE: `external/opencode-lcm-master/src/store.ts:3242-3275`]

### Hardening Comes Third And Has Its Own Order

Inside the graph/runtime hardening track, the best order is:

1. workspace/worktree identity and path confinement
2. snapshot export/import and doctor flows
3. preview and retention follow-ons

This mirrors the dependency shape implied by the plugin's snapshot/path code. [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:170-218`] [SOURCE: `external/opencode-lcm-master/src/workspace-path.ts:3-20`] [SOURCE: `external/opencode-lcm-master/src/worktree-key.ts:1-4`]

### Provenance Enrichment Belongs In Phase 1

If provenance waits until later hardening, the adapter would inject payloads without clearly telling the model whether the data is:

- live
- cached
- stale
- imported

So provenance belongs with the shared payload layer, not delayed to graph ops hardening.

## Recommendations

1. First build a shared runtime payload/provenance layer.
2. Second build the thin OpenCode adapter against that shared layer only.
3. Third ship graph/runtime hardening with path/worktree guards before snapshot/doctor, then preview/retention after the contract is stable.

## Duplication Check

This is new relative to earlier packet research because it identifies the dependency chain explicitly:

- shared payload/provenance layer first
- adapter second
- path/worktree guards before snapshot/doctor inside hardening
