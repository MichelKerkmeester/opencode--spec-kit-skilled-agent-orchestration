# Code-Graph Staleness Model

## Source Basis

This model synthesizes iteration 2's threshold candidates with iteration 7's confidence-floor findings. The live implementation already distinguishes empty graphs, Git HEAD drift, deleted tracked files, stale file counts, inline indexing permissions, and freshness/trust-state mappings; the per-file predicate is still mtime-only even though content hashes are stored. [SOURCE: `research/iterations/iteration-002.md:3-25`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:102-187`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-424`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73-124`]

## States and Actions

| State | Observable conditions | Trust surface | Action mapping |
|---|---|---|---|
| `fresh` | `freshness:"fresh"`, `canonicalReadiness:"ready"`, `trustState:"live"`, non-empty node/file counts, no stale tracked files, no deleted tracked files, Git HEAD unchanged, current schema version, and gold-query pass floors satisfied. | Structural answers can be trusted as live. | Answer structural queries. Run the gold battery after full scans or scanner/exclude changes. |
| `soft-stale` | 1-50 existing tracked files are stale; deleted tracked files are present but existing files are otherwise fresh; `lastScanAt` older than 8 hours with no hard-stale signal; or gold-query warning bucket is below target but no critical expected symbol is missing. | Graph exists, but some answers are probable rather than confirmed. | Auto-trigger selective re-scan only on mutation-allowed paths; otherwise tell the operator to run `code_graph_scan` before impact/diff answers. |
| `hard-stale` | Graph is `empty` or `error`; `trustState` is `absent` or `unavailable`; Git HEAD changed; stale files exceed 50; stale-file ratio exceeds 3-5% in large workspaces; `lastScanAt`/`lastPersistedAt` is missing or older than 24 hours; schema is not current; latest scan completed with no persisted graph data; overall gold-query pass rate is below 90%; any edge-focus pass rate is below 80%; or an expected critical symbol is missing after a scan. | Graph is unreliable for structural decisions. | Tell the user: "your graph is unreliable, do a full re-scan." Block `detect_changes`-style false-safe answers until a full scan and verification pass succeed. |

## Confidence-Floor Signaling

The doctor command should surface the full-rescan warning whenever any hard-stale condition is observed. The strongest hard signals are the ones already represented by the readiness contract: `empty` maps to `canonicalReadiness:"missing"` and `trustState:"absent"`, while `error` maps to `canonicalReadiness:"missing"` and `trustState:"unavailable"`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73-124`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:18-38`]

The second hard class is workload drift: more than 50 stale files already switches readiness from selective reindex to full scan, and Git HEAD drift forces full reindex both in readiness and explicit scan handling. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:118-186`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:174-186`]

The third hard class is post-scan confidence failure: a full scan that leaves `lastPersistedAt` null, has no persisted graph rows, or fails the gold query floors is not trustworthy even if the scan command exits. Iteration 4 defines the 28-query battery; iteration 6 adds pass-rate and drift floors of 90% overall, 80% per edge-focus bucket, 30% relative edge-share drift, 5 percentage-point absolute edge-share drift, PSI >= 0.10 warning, PSI >= 0.25 review, and JSD >= 0.10 warning. [SOURCE: `research/iterations/iteration-004.md:59-354`; `research/iterations/iteration-006.md:29-58`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:247-284`]

## Self-Healing Boundary

Partial self-healing is allowed only for `soft-stale` states with a bounded set of existing tracked files, workspace-contained paths, no Git HEAD drift, no schema/corruption/error signal, and stale count <= 50. The current readiness helper already implements that shape through `selective_reindex`, a 10-second auto-index timeout, and caller-controlled `allowInlineIndex` / `allowInlineFullScan` flags. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:38-51`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:290-367`]

Full self-healing should not happen silently on read-only surfaces. `detect_changes` explicitly disables inline indexing and full scans, then blocks unless freshness is exactly `fresh`; this is the model for safety-sensitive impact tools. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]
