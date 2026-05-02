# Research Iteration 016: Future Packet and Workstream Decomposition

## Focus

Turn the expanded findings into future packet/phased workstream boundaries that avoid transport/storage conflation, contract drift, and sibling-scope overlap.

## Findings

### The Follow-On Work Should Split Into Three Packets, Not One

The expanded findings now map cleanly to three concern sets:

1. OpenCode transport delivery
2. code-graph operations hardening
3. memory archive durability

The current packet already succeeded by splitting hook startup, hookless bootstrap, and startup-highlight quality into separate sibling slices, so this is consistent with recent packet history. [SOURCE: `../spec.md:368-372`] [SOURCE: `../026-session-start-injection-debug/spec.md:79-81`] [SOURCE: `../026-session-start-injection-debug/spec.md:179-182`]

### Packet A Should Stay Transport-Only

The shared structural bootstrap contract already exists across:

- `auto-prime`
- `session_bootstrap`
- `session_resume`
- `session_health`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:209-267`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:65-79`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:475-486`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:120-141`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:120-143`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:90-137`]

So the OpenCode packet should wrap that contract, not redefine it.

### Graph Ops Should Become A Public `code_graph_*` Extension

The graph handler family is already a coherent public surface. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:7-17`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9-45`]

That makes:

- `code_graph_doctor`
- `code_graph_export`
- `code_graph_import`

better fits for a dedicated graph-ops packet than a runtime-private bootstrap packet.

### Memory Archive Durability Should Move Outside Packet 024

The parent packet already ruled out collapsing archive/session memory into the structural graph track. [SOURCE: `research/research.md:138-153`] [SOURCE: `research/research.md:466-499`] [SOURCE: `../decision-record.md:119-130`]

So the memory-backend upgrades from this study should be moved to a separate track rather than kept inside packet 024.

### Inside Graph Ops, The Order Should Be Narrow

The graph-ops packet itself should stage:

1. `doctor`
2. path/worktree primitives
3. snapshot export/import/rehome
4. metadata previews and retention/pinning

This avoids the over-port failure modes already identified and matches the plugin's dependency shape. [SOURCE: `external/opencode-lcm-master/src/workspace-path.ts:3-20`] [SOURCE: `external/opencode-lcm-master/src/worktree-key.ts:1-5`] [SOURCE: `external/opencode-lcm-master/src/store-retention.ts:43-152`] [SOURCE: `external/opencode-lcm-master/src/preview-providers.ts:143-280`]

## Recommendations

1. **Packet A under 024:** OpenCode transport adapter only.
2. **Packet B under 024:** public code-graph operations family extension.
3. **Packet C outside 024:** memory archive durability and storage-layer upgrades.

Keep Packet A as a consumer of shared `session_*` / auto-prime contracts, Packet B as a `code_graph_*` extension, and Packet C outside the structural graph track.

## Duplication Check

This is new relative to earlier packet research because it adds:

- the 3-packet boundary map
- the answer that export/import should live with `code_graph_*` ops
- the decision to move archive durability out of packet 024
- the internal graph-ops order of `doctor -> path/worktree -> snapshot/rehome -> preview/retention`
