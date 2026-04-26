# Iteration 10 - Edge-Weight Tuning Surface + Drift Detection Implementation

## Summary

Q13A-Q13E are answered. The current `IndexerConfig` is a small scan-shape contract: root directory, include/exclude globs, max file size, and supported languages only. It is built through `getDefaultConfig(rootDir)` and then, only in the explicit scan handler, request args can replace `includeGlobs` and append `excludeGlobs`; auto-index paths in `ensure-ready.ts` use defaults with no request-level override. There is no file/env config loader for edge weights in the reviewed code.

The edge weights are emitted as inline literals inside `extractEdges()` and `finalizeIndexResults()`. A minimal implementation should introduce exported default weights in `indexer-types.ts`, resolve per-edge overrides into a complete `Record<EdgeType, number>`, thread that resolved map into edge emission, and keep `metadata.confidence` equal to the selected weight unless a future calibration layer explicitly separates the two.

Drift detection should be dependency-free TypeScript. The lowest-risk persistence path is `code_graph_metadata`: it already stores JSON string values with timestamps, and status already returns graph health, `edgesByType`, and `graphQualitySummary`. Persist a baseline snapshot under a new metadata key, compute current edge shares from DB counts, run PSI + Jensen-Shannon divergence against the baseline, and surface the latest report in `code_graph_status`. A new MCP tool can come later for manual baseline reset/import/export; it is not required for v1 drift visibility.

## Current Config Schema

The current interface is defined at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80`:

```ts
export interface IndexerConfig {
  rootDir: string;
  includeGlobs: string[];
  excludeGlobs: string[];
  maxFileSizeBytes: number;
  languages: SupportedLanguage[];
}
```

Defaults are produced by `getDefaultConfig(rootDir)` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:112-120`: it sets the language globs, default excludes, `maxFileSizeBytes: 102_400`, and `languages: ['javascript', 'typescript', 'python', 'bash']`.

Resolution order today:

1. `code_graph_scan` chooses `args.rootDir ?? process.cwd()` and resolves/canonicalizes the path at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:127-170`.
2. It calls `getDefaultConfig(resolvedRootDir)` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:170`.
3. `args.includeGlobs` replaces the default include list at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:171`.
4. `args.excludeGlobs` appends to the default exclude list at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:172`.
5. The final config goes into `indexFiles(config, { skipFreshFiles: effectiveIncremental })` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:186`.
6. Auto-index uses `getDefaultConfig(rootDir)` directly for full scans and selective reindexing at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:333-356`.

No reviewed path loads `IndexerConfig` from a config file or env vars. The only env-adjacent parser choice is `SPECKIT_PARSER`, which affects parser backend, not indexer config or weights, at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:782-784`.

## Weight Production Points

| Edge type | Producer | Current value | Patch point |
|---|---|---:|---|
| `CONTAINS` | `extractEdges()` class -> method loop | `1.0` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:895-905` |
| `IMPORTS` | `extractEdges()` import node -> same-file target | `1.0` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:909-918` |
| `EXPORTS` | `extractEdges()` exported symbol -> export capture | `1.0` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:922-930` |
| `EXTENDS` | `extractEdges()` class -> parent class | `0.95` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:935-944` |
| `IMPLEMENTS` | `extractEdges()` class -> interface/type/import | `0.95` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:950-960` |
| `CALLS` | `extractEdges()` callable regex body scan | `0.8` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:967-993` |
| `DECORATES` | `extractEdges()` decorator symbol -> decorated symbol | `0.9` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1000-1016` |
| `OVERRIDES` | `extractEdges()` method -> parent class method | `0.9` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1022-1038` |
| `TYPE_OF` | `extractEdges()` symbol -> referenced type symbol | `0.85` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1048-1065` |
| `TESTED_BY` | `finalizeIndexResults()` test-file heuristic | `0.6` | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1357-1375` |

The metadata mirror is centralized in `buildEdgeMetadata(confidence, detectorProvenance, evidenceClass)`, but callers pass the same hard-coded literal used as `CodeEdge.weight`; see `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:86-105`.

Two parser producers call `extractEdges()` without any config surface: regex parse at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:690-716`, and tree-sitter parse at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:650-653`. The file-path rewrite step only remaps IDs and preserves existing weights at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:786-802`.

Persisted edges receive explicit weights in `replaceEdges()` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:358-375`; the schema default `weight REAL DEFAULT 1.0` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:86-92` is not the effective source for normal inserts.

## Proposed Config Extension

Add a named default table and config fields in `indexer-types.ts`:

```ts
export type EdgeWeightOverrides = Partial<Record<EdgeType, number>>;

export const DEFAULT_EDGE_WEIGHTS: Readonly<Record<EdgeType, number>> = {
  CONTAINS: 1.0,
  IMPORTS: 1.0,
  EXPORTS: 1.0,
  EXTENDS: 0.95,
  IMPLEMENTS: 0.95,
  CALLS: 0.8,
  DECORATES: 0.9,
  OVERRIDES: 0.9,
  TYPE_OF: 0.85,
  TESTED_BY: 0.6,
};

export interface EdgeDriftConfig {
  enabled: boolean;
  baselineMetadataKey: string;
  minTotalEdges: number;
  psiWarnThreshold: number;
  psiReviewThreshold: number;
  jsdWarnThreshold: number;
  smoothingEpsilon: number;
}

export interface IndexerConfig {
  rootDir: string;
  includeGlobs: string[];
  excludeGlobs: string[];
  maxFileSizeBytes: number;
  languages: SupportedLanguage[];
  edgeWeights: Readonly<Record<EdgeType, number>>;
  edgeWeightOverrides?: EdgeWeightOverrides;
  edgeDrift: EdgeDriftConfig;
}
```

Default values:

```ts
edgeWeights: DEFAULT_EDGE_WEIGHTS,
edgeWeightOverrides: {},
edgeDrift: {
  enabled: true,
  baselineMetadataKey: 'edge_distribution_baseline',
  minTotalEdges: 100,
  psiWarnThreshold: 0.10,
  psiReviewThreshold: 0.25,
  jsdWarnThreshold: 0.10,
  smoothingEpsilon: 1e-12,
}
```

Add a resolver helper so override validation is central:

```ts
export function resolveEdgeWeights(
  overrides: EdgeWeightOverrides = {},
): Readonly<Record<EdgeType, number>>;
```

Validation should reject non-finite values and values outside `[0, 1]`. Resolution order should be `DEFAULT_EDGE_WEIGHTS` -> config file/env later if introduced -> explicit scan args later if exposed. For the first patch, only programmatic overrides need to exist; the MCP schema can remain unchanged until there is a clear operator-facing need.

## Drift Computation Module

Add a no-dependency module, likely `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts`.

Suggested types and functions:

```ts
import type { EdgeType } from './indexer-types.js';

export interface EdgeDistributionSnapshot {
  version: 1;
  createdAt: string;
  rootDir?: string;
  gitHead?: string | null;
  totalEdges: number;
  counts: Partial<Record<EdgeType, number>>;
  shares: Partial<Record<EdgeType, number>>;
}

export interface EdgeDriftThresholds {
  minTotalEdges: number;
  psiWarnThreshold: number;
  psiReviewThreshold: number;
  jsdWarnThreshold: number;
  smoothingEpsilon: number;
}

export interface EdgeDriftReport {
  status: 'unavailable' | 'stable' | 'warning' | 'review';
  reason?: string;
  baseline: EdgeDistributionSnapshot | null;
  current: EdgeDistributionSnapshot;
  psi: number | null;
  jsd: number | null;
  perEdgeType: Array<{
    edgeType: EdgeType;
    baselineShare: number;
    currentShare: number;
    absoluteDelta: number;
    relativeDelta: number | null;
  }>;
}

export function buildEdgeDistributionSnapshot(
  counts: Partial<Record<EdgeType, number>>,
  options?: { createdAt?: string; rootDir?: string; gitHead?: string | null },
): EdgeDistributionSnapshot;

export function populationStabilityIndex(
  baselineShares: Partial<Record<EdgeType, number>>,
  currentShares: Partial<Record<EdgeType, number>>,
  epsilon?: number,
): number;

export function jensenShannonDivergence(
  baselineShares: Partial<Record<EdgeType, number>>,
  currentShares: Partial<Record<EdgeType, number>>,
  epsilon?: number,
): number;

export function compareEdgeDistributionDrift(
  baseline: EdgeDistributionSnapshot | null,
  current: EdgeDistributionSnapshot,
  thresholds: EdgeDriftThresholds,
): EdgeDriftReport;
```

PSI formula: for every edge type in the union of baseline/current keys, smooth each share with epsilon, renormalize, then sum `(current - baseline) * Math.log(current / baseline)`. JSD formula: compute midpoint `m = (p + q) / 2`, then `0.5 * KL(p || m) + 0.5 * KL(q || m)` and optionally normalize by `Math.log(2)` so the score fits `[0, 1]`.

Cost analysis:

- Let `k` be the number of edge classes. Current `EdgeType` has 10 values at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-16`.
- Snapshot construction from `edgesByType` is `O(k)` time and `O(k)` memory.
- PSI and JSD are both `O(k)` time and `O(k)` memory if implemented over a key union.
- DB aggregation for current counts can reuse `getStats().edgesByType`, which already does `SELECT edge_type, COUNT(*) ... GROUP BY edge_type` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:671-695`.
- No external npm package is needed; all math uses `Math.log` and basic numeric guards.

## Baseline Persistence

Use `code_graph_metadata` first. The table is already generic key/value JSON storage with timestamps at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:99-103`, and migrations recreate it defensively at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:130-139`.

Current metadata helpers are private at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-204`, with exported typed wrappers for git head, detector provenance, and graph-edge enrichment at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:211-269`. Follow that pattern:

```ts
export function getEdgeDistributionBaseline(
  key = 'edge_distribution_baseline',
): EdgeDistributionSnapshot | null;

export function setEdgeDistributionBaseline(
  snapshot: EdgeDistributionSnapshot,
  key = 'edge_distribution_baseline',
): void;

export function getLastEdgeDriftReport(): EdgeDriftReport | null;

export function setLastEdgeDriftReport(report: EdgeDriftReport): void;
```

Baseline establishment policy:

- If no baseline exists and a full scan persisted edges, write the first baseline snapshot.
- On later scans, compute current snapshot and drift report; persist `last_edge_drift_report`.
- Do not automatically replace the baseline on warning/review drift. That would erase the signal.
- Allow a future manual reset operation to replace the baseline after operator approval.

This is better than a separate JSON file for v1 because the code graph DB already owns graph health metadata and `status.ts` already reads from that source. A JSON file would add path-resolution, atomic write, stale-file, and workspace portability concerns. A dedicated SQL table is more queryable, but too much schema for one low-cardinality snapshot; the generic metadata table is enough.

## Surface Decision

Use a `status.ts` extension for v1, plus scan-time persistence.

Why status wins:

- `code_graph_status` already returns the health payload and `edgesByType` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`.
- `getStats()` already computes `edgesByType` and `graphQualitySummary` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:671-716`.
- The scan handler already persists graph-quality metadata after indexing at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:230-262`, so adding baseline/report persistence there fits the existing lifecycle.
- Tool registration changes are non-trivial: a new MCP tool would need `TOOL_NAMES` and dispatch wiring at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:19-29` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:58-96`, schema exposure in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:554-647`, and Zod validation in `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445-450`.

Trade-off: status extension makes drift visible but does not give operators a command to reset or export baselines. That is acceptable for the first implementation. Add `code_graph_drift` later if manual baseline management becomes a real workflow.

Suggested status field:

```json
{
  "graphQualitySummary": {
    "detectorProvenanceSummary": "...",
    "graphEdgeEnrichmentSummary": "...",
    "edgeDistributionDrift": {
      "status": "stable|warning|review|unavailable",
      "psi": 0.03,
      "jsd": 0.01,
      "baselineCreatedAt": "2026-04-25T19:55:05Z",
      "currentTotalEdges": 1234,
      "topDeltas": []
    }
  }
}
```

## Patch Surface List

Minimum patch surface:

1. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-16` - keep `EdgeType` as the key union for default weights.
2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80` - extend `IndexerConfig` with `edgeWeights`, `edgeWeightOverrides`, and `edgeDrift`.
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:112-120` - add `DEFAULT_EDGE_WEIGHTS`, drift defaults, and `resolveEdgeWeights()` to `getDefaultConfig()`.
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-1071` - add an `edgeWeights` parameter to `extractEdges()` and replace every inline weight/confidence literal with `edgeWeights[edgeType]`.
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:690-716` - thread default/resolved weights through the regex parser call site, or move edge extraction out of parser adapters so `indexFiles()` can supply config.
6. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:650-653` - thread default/resolved weights through the tree-sitter call site.
7. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1357-1381` - change `finalizeIndexResults()` to receive resolved weights and use `edgeWeights.TESTED_BY`.
8. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1472-1478` - pass config weights into the finalize phase.
9. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-269` - add public typed baseline/report metadata wrappers beside existing graph-quality metadata functions.
10. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:671-716` - include `edgeDistributionDrift` in `graphQualitySummary` or expose a dedicated getter used by status.
11. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:230-262` - after persistence, build current distribution, initialize baseline if absent, compute and store latest drift report.
12. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62` - surface drift under `graphQualitySummary.edgeDistributionDrift`.
13. `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:73-80` - extend default-config tests to assert default weight and drift config.
14. `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` or a new drift test file - verify baseline initialization, stable comparison, warning/review thresholds, and malformed metadata fallback.

## Files Reviewed

- `research/iterations/iteration-006.md:1-117`
- `research/deltas/iteration-009.json:1-58`
- `research/deltas/iteration-012.json:1-65`
- `research/deep-research-state.jsonl:1-14`
- `.opencode/skill/sk-deep-research/SKILL.md:1-220`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:1-120`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:60-105`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:680-716`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:780-820`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:850-1085`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1338-1388`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1400-1535`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:640-660`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:80-130`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:180-270`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:330-390`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:660-725`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:190-245`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:320-370`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:1-288`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:1-77`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:1-11`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:1-97`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:70-111`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:554-647`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445-450`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:65-90`

## Convergence Signals

- newFindingsRatio: 0.42
- research_questions_answered: ["Q13A", "Q13B", "Q13C", "Q13D", "Q13E"]
- dimensionsCovered: ["current-config-schema", "override-resolution-order", "weight-producer-patch-points", "baseline-persistence", "dependency-free-psi-jsd-runtime", "status-surface-decision", "minimum-patch-surface"]
- novelty justification: This iteration turns iteration 6's drift idea into a concrete implementation surface: exact config extension types, resolved defaults, drift function signatures, metadata persistence wrappers, status payload shape, and a file-by-file patch list.
- remaining gaps: The implementation phase still needs a final decision on whether parser adapters should accept edge-weight config directly or whether edge extraction should be hoisted so `indexFiles()` owns all configured edge emission. Manual baseline reset UX is intentionally deferred.
