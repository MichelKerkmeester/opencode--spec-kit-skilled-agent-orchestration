---
title: "detect_changes preflight (Code Graph)"
description: "Read-only Code Graph handler that maps a unified-diff input to the structural symbols it touches via line-range overlap, refusing to answer when the graph is stale so callers never see a false-safe \"no impact\" result."
---

# detect_changes preflight (Code Graph)

## 1. OVERVIEW

Read-only Code Graph handler that maps a unified-diff input to the structural symbols it touches via line-range overlap, refusing to answer when the graph is stale so callers never see a false-safe "no impact" result.

`detect_changes` is the first Code Graph "change-safety" surface in Public. A reviewer pastes a `git diff`, the handler walks each hunk against the persisted `code_nodes` table, and the response lists every symbol whose source range intersects an added or removed line — with hard refuse semantics on any non-fresh readiness state.

---

## 2. CURRENT REALITY

The handler lives at `mcp_server/code_graph/handlers/detect-changes.ts` and is exported from `mcp_server/code_graph/handlers/index.ts` alongside the existing seven handlers. It accepts `{ diff: string, rootDir?: string }` and returns `{ status, affectedSymbols[], affectedFiles[], blockedReason?, timestamp, readiness }`.

Order of operations is fixed by the P1 safety invariant (pt-02 §12 RISK-03):

1. Canonicalize `rootDir` via `realpathSync` and verify it stays within the workspace (parity with `handlers/scan.ts`).
2. Call `ensureCodeGraphReady(rootDir, { allowInlineIndex: false, allowInlineFullScan: false })`. The read path NEVER triggers a silent reindex; operators choose when scans run.
3. If readiness freshness is anything other than `'fresh'`, return `status: 'blocked'` with a `blockedReason` describing the readiness state — empty `affectedSymbols[]` is forbidden on stale/empty/error.
4. Only after readiness clears does the handler parse the diff (`lib/diff-parser.ts`) and walk hunks against `queryOutline(filePath)` rows.

Symbol attribution uses pure line-range overlap: a hunk `(newStart, newLines)` or `(oldStart, oldLines)` that intersects a node's `[startLine, endLine]` range marks the node affected. Synthetic per-file `module` nodes are excluded so they don't drown per-symbol signal. Diff paths are resolved with `graphDb.resolveSubjectFilePath` so they map to the same canonical paths the indexer persists.

The diff parser is a clean-room minimal unified-diff implementation in `mcp_server/code_graph/lib/diff-parser.ts`. It handles `diff --git`, `--- a/<path>`, `+++ b/<path>`, and `@@ -oldStart[,oldLines] +newStart[,newLines] @@` headers, returning `parse_error` on malformed input. No new npm dependency was added — the parser handles the subset `git diff` emits and clean-room rule ADR-012-001 forbids dragging in upstream `diff` package source forms.

The output preserves the readiness envelope (`canonicalReadiness`, `trustState`) the rest of the code-graph handler family already returns, so consumers can treat detect_changes responses with the same readiness vocabulary as `code_graph_query` and `code_graph_status`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/handlers/detect-changes.ts` | Handler | Read-only preflight; orchestrates readiness probe, diff parse, and overlap attribution |
| `mcp_server/code_graph/lib/diff-parser.ts` | Lib | Custom unified-diff parser (`parseUnifiedDiff`) plus `rangesOverlap` helper |
| `mcp_server/code_graph/handlers/index.ts` | Handler | Registers `handleDetectChanges` alongside the existing seven Code Graph exports |
| `mcp_server/code_graph/lib/ensure-ready.ts` | Lib (existing) | Source of `ensureCodeGraphReady` readiness probe (consumed read-only) |
| `mcp_server/code_graph/lib/readiness-contract.ts` | Lib (existing) | Source of `buildReadinessBlock` envelope shape mirrored in the response |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Lib (existing) | Source of `queryOutline` and `resolveSubjectFilePath` (consumed read-only) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/code_graph/tests/detect-changes.test.ts` | Blocked-on-stale safety invariant, parse_error contract, symbol attribution by line-range overlap, output-shape contract, diff-parser unit cases |

---

## 4. SOURCE METADATA

- Group: Discovery
- Source feature title: detect_changes preflight (Code Graph)
- Phase / sub-phase: `026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes`
- Research basis: pt-02 §4 (Code Graph findings, `detect_changes` row), §11 Packet 1, §12 RISK-03 (false-safe changed-symbol impact)
- Decision record: 012/decision-record.md ADR-012-001 (clean-room), ADR-012-002 (sub-phase split)
- Current reality source: `mcp_server/code_graph/handlers/detect-changes.ts`, `mcp_server/code_graph/lib/diff-parser.ts`
