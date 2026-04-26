# Iteration 004

**Run Date:** 2026-04-26
**Dimension:** correctness
**Focus:** Edge-weight config + drift detection math
**Verdict Snapshot:** CONDITIONAL

## Summary

- `DEFAULT_EDGE_WEIGHTS` matches the prior hard-coded table exactly, and both edge-building sites resolve overrides with `{ ...DEFAULT_EDGE_WEIGHTS, ...edgeWeights }` before emitting edges.
- The PSI and JSD implementations are mathematically correct for the reviewed contract: both operate over the full edge-type union, smooth zero buckets with epsilon, and stay finite when an edge type exists in only one distribution.
- Two correctness gaps remain in the drift surface. `share_drift` reports absolute deltas instead of the requested `current_share - baseline_share` signed deltas, and the missing/malformed-baseline path silently reports zero drift instead of “baseline unavailable.”

## Findings

### P0

- None.

### P1

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-67` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:281-288` — missing or malformed baseline metadata is silently reported as “no drift,” and malformed metadata becomes sticky. `getPersistedEdgeDistributionBaseline()` returns `null` on JSON parse failure, then `buildEdgeDriftSummary()` falls back to `baselineShare = currentShare`, which forces `psi = 0`, `jsd = 0`, `share_drift = 0`, and `flagged = false`. At the same time, scan persistence only checks whether the raw metadata key exists, so a malformed `edge_distribution_baseline` string blocks automatic reseeding on future clean full scans unless `persistBaseline === true` is passed explicitly. That hides corrupted baseline state and suppresses drift alerts. Fix: distinguish “baseline absent/invalid” from “baseline equals current” in status, and in scan gate on successfully parsed baseline content rather than raw key presence.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:56-64` with `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:143` — `share_drift` loses direction because every per-edge delta is wrapped in `Math.abs(...)`. The packet’s drift contract and this iteration’s focus define share drift as `current_share - baseline_share`, with the absolute value only used for thresholding. Returning only magnitudes makes the surfaced summary unable to tell whether, for example, `IMPORTS` increased or decreased versus baseline, which undermines the tuning/diagnostic surface even though `flagged` still works. Fix: store signed deltas in `share_drift`, and apply `Math.abs(...)` only when computing `maxShareDrift` for the threshold check.

### P2

- None.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:100-109,143,192`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/implementation-summary.md:64,123,142`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-010.md:61-77,125,127-150,194-200`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:18-29,87-95,133-140`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:914-925,962-965,979-982,993-995,1006-1009,1022-1025,1055-1058,1658-1666,1742-1745`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts:1-74`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:143-152,281-289,308-317`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:24-77`

## Convergence Signals

- `DEFAULT_EDGE_WEIGHTS` is backward-compatible with the 007 iter-010 design table: `CONTAINS/IMPORTS/EXPORTS=1.0`, `EXTENDS/IMPLEMENTS=0.95`, `DECORATES/OVERRIDES=0.9`, `TYPE_OF=0.85`, `CALLS=0.8`, `TESTED_BY=0.6`.
- PSI and JSD are implemented correctly for new/missing edge types: `buildEdgeDistribution()` zero-fills the full enum and `normalizeWithSmoothing()` adds epsilon before renormalizing, so `computePSI()` and `computeJSD()` stay finite even when one side lacks an edge type entirely.
- Baseline rotation is not happening on every healthy full scan. Once a valid baseline exists, scan only rotates it when `persistBaseline === true`; the bug is the malformed-baseline path, where raw-key presence prevents automatic repair.
- I found no direct drift-helper test coverage under `code_graph/tests/` for `edgeWeights`, `computePSI`, `computeJSD`, or `edge_distribution_baseline`, so both findings above appear unpinned by CI today.
