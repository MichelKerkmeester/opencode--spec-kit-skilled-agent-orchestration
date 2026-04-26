---
title: "Resource Map"
description: "Lean, scannable catalog of every file path analyzed, created, updated, or cited during the deep-review synthesis for packet 008-code-graph-backend-resilience."
trigger_phrases:
  - "resource map"
  - "path catalog"
  - "files touched"
  - "paths analyzed"
  - "paths updated"
importance_tier: "normal"
contextType: "general"
---
# Resource Map

## Summary

- **Total references**: 54
- **By category**: Documents=1, Skills=22, Specs=21, Tests=8, Config=2
- **Missing on disk**: 0
- **Scope**: Files analyzed or created for the iteration-010 synthesis and final deep-review outputs for packet `008-code-graph-backend-resilience`
- **Generated**: 2026-04-26T00:00:00+02:00

## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Analyzed | OK | Deep-review workflow contract used during synthesis |

## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/sk-deep-review/SKILL.md` | Analyzed | OK | Primary deep-review workflow guidance |
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Analyzed | OK | Template used to shape this resource map |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts` | Cited | OK | Detect-changes readiness blocking behavior |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts` | Cited | OK | Handler export surface |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Cited | OK | `code_graph_query` transport contract |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Cited | OK | Scan freshness, baseline persistence, and verification trigger behavior |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Cited | OK | Drift summary and persisted-status reporting |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` | Cited | OK | Verify entry point, `rootDir`, and `batteryPath` handling |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` | Cited | OK | Freshness predicate and metadata persistence helpers |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts` | Cited | OK | PSI/JSD/share-drift helpers |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Cited | OK | Readiness state, verification gate, and self-heal observability |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts` | Cited | OK | Gold battery execution and result shaping |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` | Cited | OK | Graph edge/result contracts |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | Cited | OK | Resolver, parser-fallback, edge-weight, and barrel-resolution logic |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts` | Cited | OK | Import/export capture extraction |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts` | Cited | OK | Tool dispatch surface for verify/query |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/index.ts` | Cited | OK | Tool export surface |
| `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` | Cited | OK | Layer-definition coupling evidence touched by maintainability review |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts` | Cited | OK | Real-world inline type-only import example |
| `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts` | Cited | OK | Canonical path guard reference used for security comparison |
| `.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts` | Cited | OK | Verifier warning logging path |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Cited | OK | Public MCP schema and verify-surface naming |

## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/code-graph-gold-queries.json` | Cited | OK | Gold battery asset referenced by verifier review |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-008.md` | Cited | OK | Hash-predicate design source |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-009.md` | Cited | OK | Resolver and type-only edge design source |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-010.md` | Cited | OK | Drift/baseline design source |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-011.md` | Cited | OK | Detect-changes hard-block design source |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-012.md` | Cited | OK | Final packet roadmap and verifier contract source |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/checklist.md` | Cited | OK | Traceability evidence target |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/implementation-summary.md` | Cited | OK | Known limitations and implementation claims |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/plan.md` | Cited | OK | Packet plan and stream definitions |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deep-review-config.json` | Analyzed | OK | Iteration count, dimensions, and executor configuration |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deep-review-state.jsonl` | Updated | OK | Review state log with final synthesis entry |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deep-review-strategy.md` | Analyzed | OK | Review plan and per-iteration focus map |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-001.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-002.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-003.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-004.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-005.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-006.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-007.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-008.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-009.json` | Analyzed | OK | Prior iteration count summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/deltas/iteration-010.json` | Created | OK | Final synthesis delta |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-001.md` | Analyzed | OK | Prior correctness review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-002.md` | Analyzed | OK | Prior correctness review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-003.md` | Analyzed | OK | Prior correctness review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-004.md` | Analyzed | OK | Prior correctness review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-005.md` | Analyzed | OK | Prior correctness review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-006.md` | Analyzed | OK | Prior correctness review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-007.md` | Analyzed | OK | Prior security review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-008.md` | Analyzed | OK | Prior traceability review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-009.md` | Analyzed | OK | Prior maintainability review input |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/iterations/iteration-010.md` | Created | OK | Final synthesis iteration |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/review-report.md` | Created | OK | Final nine-section review report |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/resource-map.md` | Created | OK | Final path-and-role ledger |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md` | Cited | OK | Packet requirements and acceptance scenarios |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/tasks.md` | Cited | OK | Task-to-stream mapping and closeout claims |

## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Cited | OK | Freshness, resolver, type-only, and baseline-related evidence |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Cited | OK | Outline-query behavior referenced by verifier/traceability review |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Cited | OK | Incremental scan and verification-trigger evidence |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts` | Cited | OK | Status/readiness regression evidence |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts` | Cited | OK | Verify handler and verifier-library regression evidence |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts` | Cited | OK | Detect-changes blocking and observability evidence |
| `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts` | Cited | OK | Freshness regression coverage reviewed for hash-predicate evidence |
| `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts` | Cited | OK | ReadyResult and self-heal branch evidence |

## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` | Cited | OK | Resolver settings and nested-extends evidence |
| `.opencode/skill/system-spec-kit/tsconfig.json` | Cited | OK | Parent tsconfig inheritance evidence |
