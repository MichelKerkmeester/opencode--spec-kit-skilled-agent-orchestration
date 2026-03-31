# Iteration 027: D1 Correctness Convergence Sweep

## Focus

Convergence D1 sweep over the remaining lightly reviewed TypeScript files in `lib/code-graph/` and `hooks/`: `runtime-detection.ts`, `code-graph-context.ts`, `index.ts`, `mutation-feedback.ts`, and `response-hints.ts`. This pass checks whether any still hide live correctness defects rather than only previously logged contract drift.

## Verified Healthy / No New D1 Findings

- `hooks/mutation-feedback.ts` still preserves the live post-mutation hook result fields faithfully in both the returned `data` object and the human-readable hints. This sweep did not uncover a dropped field, inverted boolean, or other new correctness defect there.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts:6-59]
- `hooks/response-hints.ts` still owns the already-tracked duplicate token-count synchronization surface (`F019`), but this narrower D1 pass did not find a second correctness failure in the helper itself: it still guards on JSON text input, preserves existing hints, updates `meta.autoSurface`, and reserializes the final envelope with a synchronized `tokenCount` that the current hook UX tests still assert against the final JSON.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:30-57][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-113][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:63-130]
- `runtime-detection.ts` still exposes the same small environment-heuristic helper surface already covered by the direct runtime-detection and cross-runtime-fallback tests. This pass did not confirm a new live D1 contract break in that file.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:18-54][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:20-65][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:11-120]
- `lib/code-graph/index.ts` remains only a barrel re-export surface in the reviewed slice; this pass did not uncover a new correctness defect there.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:1-12]

## New Findings

### [P1] F033 - `code_graph_context` still advertises trace metadata via `includeTrace`, but the live builder never emits any trace payload

- **Finding:** The public `code_graph_context` contract still advertises `includeTrace` as "Include resolution trace metadata", and Phase 010 still documents/checks that trace metadata is included when the flag is true.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:660-691][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec.md:117-125][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/checklist.md:36-41]
- **Evidence:** The handler still forwards `includeTrace` into `ContextArgs` exactly as if the flag were implemented.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:47-57]
- **Evidence:** `ContextArgs` still includes `includeTrace`, but `ContextResult` has no trace field at all, and `buildContext()` never branches on `args.includeTrace` or attaches any trace metadata to the returned payload. The returned shape is always only `queryMode`, `resolvedAnchors`, `graphContext`, `textBrief`, `combinedSummary`, `nextActions`, and aggregate `metadata`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:14-39][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:47-118]
- **Impact:** Callers can set `includeTrace: true` and still never receive the resolution/debug metadata promised by the shipped tool schema and Phase 010 packet. That is a live public-contract failure, not just an internal maintainability smell: trace-dependent debugging and audit workflows get silently incomplete output.
- **Fix:** Either implement a real trace payload when `includeTrace` is true (for example seed-resolution decisions, fallback reasons, deadline truncation, and anchor-expansion diagnostics), or remove / uncheck the `includeTrace` contract from the schema and Phase 010 docs until the runtime actually supports it.
- **Severity:** P1

## Not Promoted This Pass

- `code-graph-context.ts` still also carries the older unused `input` knob, but I did not split that into a second finding here. The higher-signal live defect is the checked-and-advertised `includeTrace` contract that remains a shipped no-op.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:14-23][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:47-118]

## Summary

- New findings delta: **+0 P0, +1 P1, +0 P2** (`F033`).
- `runtime-detection.ts`, `mutation-feedback.ts`, `response-hints.ts`, and the `lib/code-graph/index.ts` barrel did not yield an additional D1 defect in this convergence sweep.
- The remaining new correctness signal in the under-reviewed slice is contract-level but live: `code_graph_context` still forwards `includeTrace` through the handler boundary while the library implementation never returns any trace metadata.
