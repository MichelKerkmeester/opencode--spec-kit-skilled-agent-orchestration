# Implementation Review Report — 013

## Summary

- Iterations run: 10
- Stop reason: converged after iteration 10 (`newInfoRatio < 0.05` on iterations 9 and 10)
- Total findings: P0=0, P1=5, P2=5
- Overall verdict: the code-path changes are directionally correct, but this packet is not review-clean because it still has unresolved correctness/completeness issues in query ranking, context seed handling, partial-output accounting, incremental scan semantics, and packet-local evidence integrity.

## Methodology

- Read the packet inputs in the requested order: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `resource-map.md`, then the implementation files named in `Files Changed`.
- Audited the modified handler/lib/test surfaces directly with line-level reads.
- Checked the packet tree to verify whether the claimed `applied/T-*.md` evidence exists at the packet path.
- Used a ten-iteration loop with one focused review angle per pass, then collapsed duplicates into a single findings registry.

## Key Findings

### P0

- None.

### P1

- `F-001` `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:45`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:134`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:218`
Evidence: ambiguity resolution only ranks the first 10 SQL matches before `pickOperationAwareCandidate()` runs.
Recommended fix: re-rank the full ambiguous match set and add a `>10` collision regression.
Target files: `query.ts`, `code-graph-query-handler.vitest.ts`

- `F-002` `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:169`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:199`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:184`
Evidence: CocoIndex fidelity survives only when callers send `seed.file`; `seed.filePath` falls through the generic seed path and drops provider-specific metadata.
Recommended fix: treat `filePath` as equivalent to `file` for CocoIndex seeds and add a regression for that public input shape.
Target files: `context.ts`, `code-graph-context-handler.vitest.ts`

- `F-003` `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:116`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:171`
Evidence: deadline handling increments `omittedAnchors` by one and breaks, so the new `partialOutput` metadata undercounts skipped anchors.
Recommended fix: count all remaining anchors when the deadline trips and add a multi-anchor regression.
Target files: `code-graph-context.ts`, `code-graph-context-handler.vitest.ts`

- `F-004` `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1366`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:207`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:240`
Evidence: fresh files are filtered before `handleCodeGraphScan()` sees them, so no-op incrementals report `filesSkipped: 0`; the same code path also clears the persisted edge-enrichment summary even when no new graph state was written.
Recommended fix: separate pre-parse skip accounting from persistence results and only clear summaries when a replacement graph state is actually persisted.
Target files: `structural-indexer.ts`, `scan.ts`, `code-graph-scan.vitest.ts`

- `F-005` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md:28`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/checklist.md:36`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md:100`
Evidence: the packet claims packet-local `applied/T-*.md` evidence, but those files are not present under this packet path.
Recommended fix: restore the missing evidence reports or rewrite the closeout/checklist/resource-map references to evidence that actually exists in this packet.
Target files: `implementation-summary.md`, `checklist.md`, `resource-map.md`

### P2

- `F-006` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md:67`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md:164`
Evidence: startup parity is claimed across Claude/Gemini/Copilot/Codex, but the packet's direct test inventory only records Claude and Codex startup regressions.
Recommended fix: add Gemini and Copilot startup regressions, or narrow the closeout language to the runtimes with direct test evidence.
Target files: runtime startup tests plus packet closeout docs

- `F-007` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/tasks.md:74`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md:57`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md:144`
Evidence: `implementation-summary.md` omits `hooks/codex/session-start.ts` from `Files Changed` even though T011 and the resource map both treat it as part of the implementation blast radius.
Recommended fix: add the missing Codex adapter row to `Files Changed`.
Target files: `implementation-summary.md`

- `F-008` `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:337`
Evidence: ambiguity tests cover only two candidates, leaving the truncated candidate-window behavior from `F-001` unproven.
Recommended fix: add a stress regression with more than 10 matching symbols.
Target files: `code-graph-query-handler.vitest.ts`

- `F-009` `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:145`
Evidence: the new partial-output tests cover a single-anchor deadline case only, so the multi-anchor undercount from `F-003` is not guarded.
Recommended fix: add a multi-anchor timeout regression.
Target files: `code-graph-context-handler.vitest.ts`

- `F-010` `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:147`
Evidence: scan tests mock `indexFiles()` as if fresh files still flow into the handler, which diverges from the real `skipFreshFiles` behavior in `structural-indexer.ts`.
Recommended fix: add a regression with `indexFiles()` returning `[]` for a no-op incremental scan and assert summary preservation / skipped accounting.
Target files: `code-graph-scan.vitest.ts`

## Regression Risk Assessment

- High: `F-001` can still return the wrong implementation node for ambiguous CALLS/import queries in larger workspaces, which undermines the packet's main correctness claim.
- High: `F-004` can silently degrade operator trust by clearing the persisted enrichment summary on no-op incremental scans while also underreporting skipped work.
- Medium: `F-002` and `F-003` affect the reliability of new contract metadata rather than the base handler execution path, but they erode the value of the packet's new context features.
- Medium: `F-005` through `F-007` make the packet harder to audit and replay, which is risky for downstream tooling that depends on packet-local evidence.

## Test Coverage Gaps

- No direct startup-parity regression is recorded for Gemini or Copilot even though both adapters were changed.
- Query ambiguity coverage does not extend past two candidates, so the new hard-cap interaction is untested.
- Context partial-output coverage does not include multiple anchors under deadline pressure.
- Scan coverage does not exercise the real no-op incremental path where `indexFiles()` returns no stale files.

## Cross-Runtime Consistency Checks

- Claude and Codex both expose the startup payload contract directly in packet-local tests.
- Gemini and Copilot adapters were read and appear structurally aligned, but the packet lacks direct regression coverage for them.
- The Codex adapter itself is present in the resource map yet missing from `implementation-summary.md`'s changed-file inventory, which weakens the packet's runtime parity story.

## Recommended Follow-Up Fixes

1. Fix `F-004` first: preserve persisted enrichment summaries across no-op incrementals and report skipped files accurately.
2. Fix `F-001` next: remove or compensate for the 10-candidate truncation in ambiguity resolution and add a large-ambiguity regression.
3. Fix `F-002` and `F-003` together: complete the new context contract by accepting `filePath` CocoIndex seeds and correcting `omittedAnchors`.
4. Restore or replace the missing `applied/T-*.md` evidence so the packet becomes audit-ready.
5. Add Gemini/Copilot startup regressions and repair the changed-file inventory drift in `implementation-summary.md`.

## Convergence Report

- Threshold: `newInfoRatio < 0.05` for two consecutive iterations
- Sequence: `0.78, 0.46, 0.31, 0.27, 0.18, 0.15, 0.08, 0.06, 0.04, 0.03`
- Interpretation: the loop kept finding new implementation defects through iteration 7, then shifted into negative-knowledge confirmation. Iterations 9 and 10 produced only already-known issues, so the review converged at the maximum planned depth.

## References

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
