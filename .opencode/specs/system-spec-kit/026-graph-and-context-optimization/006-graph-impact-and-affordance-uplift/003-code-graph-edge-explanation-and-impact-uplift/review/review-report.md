---
title: "Deep Review — 003-code-graph-edge-explanation-and-impact-uplift"
description: "7-iteration scoped review with P0/P1/P2 findings."
generated_by: cli-codex gpt-5.5 high fast
generated_at: 2026-04-25T13:19:08Z
iteration_count: 7
---

# Deep Review — 003-code-graph-edge-explanation-and-impact-uplift

## Findings by Iteration

### Iteration 1 — Correctness

- P2 — `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:859`: `computeBlastRadius` slices `affectedFiles` to `limit` before deciding whether the result is partial, then `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:897` emits `failureFallback.reason = "limit_reached"` whenever the sliced length is `>= limit`. A result with exactly `limit` affected files is reported as fallback/truncated even when no row was omitted. Track the pre-slice total or request `limit + 1` before slicing.

- P2 — `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1048`: the unresolved-subject fallback preserves prior `sourceFiles`, but `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1050` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1058` return empty `nodes` / `partialResult.nodes`. In multi-subject mode, a later unresolved subject can erase already-resolved seed nodes from the structured partial result. Include seed nodes for resolved sources in this fallback path.

### Iteration 2 — Security & Privacy

- P2 — `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:763`: persisted edge metadata is parsed back from SQLite without validation, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:614` / `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:615` emit `reason` and `step` directly. The current writer uses fixed strings at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:91`, but stale/imported/hand-edited DB rows can still put arbitrary text into JSON and the context text brief at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:545`. Add an allowlist or single-line sanitizer on the read path.

### Iteration 3 — Integration

- P1 — `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:29` adds `minConfidence` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1024` consumes it, satisfying spec R-003-4 in handler code. The public strict Zod schema omits it at `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:452`, and strict mode is the default at `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:27`; the JSON tool schema also omits it at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:573`, and the allowed-parameter ledger omits it at `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:669`. Real MCP callers will get an unknown-parameter failure before the handler sees the new feature. Add `minConfidence` to all tool schema surfaces and extend `tool-input-schema.vitest.ts`.

### Iteration 4 — Performance

- P2 — `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:739` selects every cross-file `IMPORTS` edge for `minConfidence > 0`, then `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:758` parses/filter metadata in process before BFS starts at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:818`. Large graphs pay whole-graph import-edge cost for every blast-radius query. Prefer frontier-scoped DB lookups, cached adjacency with confidence, or a bounded `limit + 1` traversal strategy.

- P2 — `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:245` re-ranks ambiguous subjects by calling `relationshipEdgeCount` for every candidate; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:211` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:216` perform per-candidate edge queries. This is acceptable for small ambiguity sets, but names shared across many generated wrappers become an N+1 hot path. Batch edge counts by candidate IDs.

### Iteration 5 — Maintainability

- P2 — `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1229`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1258`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1287`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1315` duplicate relationship-edge response construction across four switch branches. The new metadata fields had to be threaded through each branch, which raises the chance of future drift. Extract shared outbound/inbound relationship mappers.

### Iteration 6 — Observability

- P2 — `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1121` catches blast-radius computation failures and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1135` converts them into a successful `status: "ok"` payload with `failureFallback`. That is a reasonable user contract, but there is no log, metric, fallback code, or error class for operators to distinguish DB/metadata failures from legitimate empty blast radius. Emit a warning/metric and use a stable `failureFallback.code`.

### Iteration 7 — Evolution

- P1 — verification is still blocked. The checklist leaves strict validation and code-graph Vitest unchecked at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/003-code-graph-edge-explanation-and-impact-uplift/checklist.md:30` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/003-code-graph-edge-explanation-and-impact-uplift/checklist.md:31`; the implementation summary repeats that local `vitest`, `tsc`, and `validate.sh --strict` are blocked at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/003-code-graph-edge-explanation-and-impact-uplift/implementation-summary.md:61`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/003-code-graph-edge-explanation-and-impact-uplift/implementation-summary.md:62`, and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/003-code-graph-edge-explanation-and-impact-uplift/implementation-summary.md:63`. Before the next packet depends on this work, restore dependencies and run the strict validator, targeted Vitest suite, and typecheck.

## Severity Roll-Up

| Severity | Count |
|---|---:|
| P0 | 0 |
| P1 | 2 |
| P2 | 7 |

## Top 3 Recommendations

1. Add `minConfidence` to the public MCP schemas, allowed-parameter list, tool definition, and schema tests so the implemented feature is actually callable.
2. Restore local Node dependencies and run `validate.sh --strict`, targeted code-graph Vitest tests, and typecheck before allowing a dependent packet to proceed.
3. Harden edge metadata read paths with an allowlist/sanitizer for `reason` and `step`, then refactor relationship-edge response mapping to keep future metadata fields from drifting.

## Convergence

- Iterations completed: 7/7
- New-info ratio per iteration: [it1: 1.00, it2: 0.33, it3: 0.25, it4: 0.40, it5: 0.17, it6: 0.14, it7: 0.13]
- Final state: ALL_FINDINGS_DOCUMENTED
