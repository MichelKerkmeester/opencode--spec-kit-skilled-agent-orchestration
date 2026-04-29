# Code Graph Handlers

MCP tool handlers for the structural code graph system.

Code graph handlers can enrich recovery, but they do not own packet continuity. For Spec Kit packet work, `/spec_kit:resume` remains canonical and recovery still flows through `handover.md`, then `_memory.continuity`, then the remaining spec docs.

## Handlers

| File | MCP Tool | Purpose |
|------|----------|---------|
| `scan.ts` | `code_graph_scan` | Index workspace files, build structural graph |
| `query.ts` | `code_graph_query` | Run structural relationship reads (`outline`, `calls_*`, `imports_*`, `blast_radius`) with shared readiness/trust metadata, explicit blocked-read payloads when a full scan is required, and warnings for ambiguous subjects or dangling edges |
| `status.ts` | `code_graph_status` | Probe freshness plus totals, persistence metadata, parse health, readiness/trust fields, and `graphQualitySummary` so operators can inspect graph provenance instead of relying on counts alone |
| `context.ts` | `code_graph_context` | Build LLM-oriented graph neighborhoods from manual, graph, or CocoIndex seeds; successful responses include anchors, graph context, and `metadata.partialOutput`, while full-scan-required reads return an explicit blocked payload with `requiredAction: "code_graph_scan"` |
| `verify.ts` | `code_graph_verify` | Run graph verification checks against indexed state |
| `detect-changes.ts` | `detect_changes` | Map unified diffs to affected symbols only when graph readiness is fresh |
| `ccc-status.ts` | `ccc_status` | Report CocoIndex bridge availability and index state |
| `ccc-reindex.ts` | `ccc_reindex` | Trigger CocoIndex incremental or full reindexing |
| `ccc-feedback.ts` | `ccc_feedback` | Submit operator feedback for CocoIndex search results |
| `index.ts` | (barrel) | Re-exports all handlers |

## Surface Notes

- `query.ts` and `context.ts` both use read-path readiness gating and the shared readiness contract from `../lib/readiness-contract.ts`.
- `status.ts` is a non-mutating freshness probe: it reports current readiness/trust state but does not perform inline indexing.
- `context.ts` preserves seed provenance across `manual`, `graph`, and `cocoindex` inputs so returned anchors can keep caller-visible source labels.
- `detect-changes.ts` refuses stale graphs before parsing diff content, so preflight results are false-safe rather than silently incomplete.

## Dispatch

Registered via `tools/code-graph-tools.ts`, included in `ALL_DISPATCHERS` array in `tools/index.ts`.

## Related

- Library: `../lib/` (core implementation)
- Schemas: `tool-schemas.ts` (L8: Code Graph definitions)
