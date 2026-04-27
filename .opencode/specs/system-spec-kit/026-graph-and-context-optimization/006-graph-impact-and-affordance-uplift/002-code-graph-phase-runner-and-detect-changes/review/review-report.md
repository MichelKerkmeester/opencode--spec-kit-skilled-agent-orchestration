---
title: "Deep Review — 002-code-graph-phase-runner-and-detect-changes"
description: "7-iteration scoped review with P0/P1/P2 findings."
generated_by: cli-codex gpt-5.5 high fast
generated_at: 2026-04-25T13:19:18Z
iteration_count: 7
---

# Deep Review — 002-code-graph-phase-runner-and-detect-changes

## Findings by Iteration

### Iteration 1 — Correctness

- **P1 — `parseUnifiedDiff` appears to fail its own adjacent multi-file unified-diff fixture.** The parser sets `inHunkBody = true` after a hunk header and then treats any subsequent line beginning with ` `, `+`, `-`, or `\` as body content until a different leading character appears (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:179`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:184`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:190`). The unit fixture for multi-file diffs places `--- a/bar.ts` and `+++ b/bar.ts` immediately after the prior hunk body (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:302`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:309`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:310`), so those headers are consumed as deletion/addition body lines and the next `@@` is attached to the previous file. Fix by tracking expected hunk body line counts, or by treating file headers as section starts once the declared hunk counts are satisfied.

### Iteration 2 — Security & Privacy

- **P1 — Diff paths can escape `rootDir` after root canonicalization succeeds.** `rootDir` is checked against the workspace (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:151`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:152`), but `resolveCandidatePath` accepts absolute diff paths and resolves relative paths without verifying the result remains under `canonicalRootDir` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:122`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:124`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:125`). That unchecked path is then sent through `resolveSubjectFilePath` and `queryOutline` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:218`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:223`). A crafted diff with `+++ /absolute/path` or `+++ b/../outside.ts` can therefore probe indexed symbols outside the requested repository. Fix by canonicalizing each candidate and rejecting any candidate outside `canonicalRootDir`.

### Iteration 3 — Integration

- **P1 — `detect_changes` is exported as a handler but is not registered as an MCP tool.** The spec requires handler registration with proper schema (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/spec.md:98`), and `handlers/index.ts` only exports the function (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:11`). The actual code-graph dispatcher does not import `handleDetectChanges` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:5`), its `TOOL_NAMES` set excludes any detect-changes name (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:19`), and the switch has no detect-changes case (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:58`). The MCP-visible schemas list only scan/query/status/context in this section (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:554`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:556`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:589`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:595`). Result: external clients cannot call the new preflight despite the feature being marked shipped. Fix by adding a tool name, schema, validator entry, and dispatcher case, or by changing the spec/checklist to state explicitly that this packet only adds an internal handler.

### Iteration 4 — Performance

- **P2 — Hunk-to-symbol attribution is O(files x hunks x nodes) with no range prefilter.** For every parsed file, the handler loads all outline nodes (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:223`) and then loops every hunk over every node (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:226`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:230`). This is acceptable for small files, but a generated or large source file with many hunks can make `detect_changes` expensive on the read path. Fix by sorting nodes by range and advancing through hunks, or by adding a per-file interval lookup if this handler becomes user-facing.

### Iteration 5 — Maintainability

- **P2 — Custom output keys can collide silently.** Duplicate phase names are rejected (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:73`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:75`), but duplicate `output` keys are inserted into a `Map` with last-writer-wins semantics (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:87`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:89`). `runPhases` repeats that map construction and resolves dependency inputs through it (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:174`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:183`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:186`). This makes dependency resolution ambiguous when two phases publish the same output key. Fix by rejecting duplicate output keys the same way duplicate phase names are rejected.

### Iteration 6 — Observability

- **P2 — Scan error metrics are modeled but never emitted.** `buildIndexPhases` accepts a `scanOutcomeRef` that can be `'success' | 'error'` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1407`), and `emit-metrics` records the histogram using that value (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1488`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1491`). `indexFiles` initializes the value to success, calls `runPhases`, and has no catch/finally to set error when an earlier phase fails (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1513`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1516`). Since `emit-metrics` only runs after `finalize`, failures before that phase produce no error histogram at all. Fix with an outer try/catch/finally around `runPhases`, or move failure metric recording outside the phase DAG.

### Iteration 7 — Evolution

- **P1 — The packet marks verification complete while canonical tests and validation are still operator-pending.** The checklist marks the existing code-graph suite as passed (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/checklist.md:21`) and marks `validate.sh --strict` passed (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/checklist.md:35`). The implementation summary says the targeted vitest, broader code-graph vitest, `tsc --noEmit`, and strict spec validation are all operator-pending (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/implementation-summary.md:121`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/implementation-summary.md:126`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/implementation-summary.md:128`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/implementation-summary.md:148`). This weakens the handoff to 003 because at least one reviewed parser test appears likely to fail. Fix by unchecking or relabeling these items until the commands run, then paste actual command evidence.

## Severity Roll-Up

| Severity | Count |
|---|---:|
| P0 | 0 |
| P1 | 4 |
| P2 | 3 |

## Top 3 Recommendations

1. Wire `detect_changes` into the real MCP tool surface: tool schema, Zod/runtime validator allow-list, `TOOL_NAMES`, and dispatcher case.
2. Harden `detect_changes` path handling so every parsed diff path is canonicalized and proven under `canonicalRootDir` before any DB lookup.
3. Fix the unified-diff parser hunk-boundary logic, then run the targeted vitest files plus `tsc --noEmit` and update checklist evidence with real command output.

## Convergence

- Iterations completed: 7/7
- New-info ratio per iteration: [it1: 1.00, it2: 0.50, it3: 0.33, it4: 0.25, it5: 0.20, it6: 0.17, it7: 0.25]
- Final state: ALL_FINDINGS_DOCUMENTED
