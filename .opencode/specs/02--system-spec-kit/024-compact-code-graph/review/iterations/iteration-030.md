# Iteration 030: D4 Maintainability Final Convergence

## Focus

Final D4 convergence pass on naming consistency, barrel exports, dead-code checks, and pattern consistency across `hooks/claude/*.ts`, `hooks/index.ts`, `tools/index.ts`, `lib/code-graph/index.ts`, `handlers/code-graph/index.ts`, and their live integration points in `context-server.ts` and `code-graph-tools.ts`.

## Findings

No P0 or P1 issues found.

### [P2] F032 - `session-prime.ts` duplicates the shared pressure-budget helper and the two copies have already drifted

- `hooks/claude/shared.ts` exports `calculatePressureAdjustedBudget(...)` as the reusable hook helper for context-window pressure handling.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:91-102]
- The live SessionStart path does not use that helper. `session-prime.ts` keeps a private `calculatePressureBudget(...)` and calls that local function before writing hook output.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:26-35][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:206-209]
- The two implementations have already drifted in behavior at extreme pressure: the shared helper returns `Math.max(200, Math.floor(baseBudget * 0.2))` above 90% usage, while the live SessionStart helper hard-codes `200` for the same branch.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:97-100][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:30-35]
- The current regression surface reinforces the split ownership instead of the live contract. `edge-cases.vitest.ts` only imports and asserts `calculatePressureAdjustedBudget(...)` from `shared.ts`; it does not import or execute `session-prime.ts`'s private helper.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:58-89]
- **Impact:** pressure-budget tuning now has two maintainers inside the Claude hook slice, and the tested shared helper is not the helper used by the live SessionStart entrypoint. Future threshold changes can silently diverge between the documented/shared hook utility and the runtime path users actually hit.
- **Fix:** delete the private `calculatePressureBudget(...)` helper and route `session-prime.ts` through `calculatePressureAdjustedBudget(input.context_window_tokens, input.context_window_max, budget)` so pressure handling has one owner and one test surface.

## Verified Healthy

- `hooks/index.ts` still matches the live import surface used by `context-server.ts`; I did not confirm a new missing-export or unused-export defect in the reviewed hook barrel.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18][SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:47-57]
- `tools/index.ts` still keeps `codeGraphTools` in `ALL_DISPATCHERS`, and `dispatchTool()` still routes through `TOOL_NAMES.has(name)` before calling `handleTool(...)`; I did not confirm a new export-layer defect in the tool barrel during this pass.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/index.ts:12-33]
- `handlers/code-graph/index.ts` still exports the same handler set that `tools/code-graph-tools.ts` imports, so no new missing-barrel issue was confirmed on that integration surface.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/index.ts:4-10][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:5-13]
- `lib/code-graph/index.ts` still re-exports the currently reviewed core code-graph modules (`indexer-types`, `structural-indexer`, `code-graph-db`, `seed-resolver`, `code-graph-context`, `budget-allocator`, `working-set-tracker`, `compact-merger`). I did not confirm a new live missing-export defect from the current direct-import pattern around this barrel.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:4-11]

## Summary

- P0: 0 findings
- P1: 0 findings
- P2: 1 finding (`F032`)
- newFindingsRatio: 0.07
- Final convergence note: the final D4 barrel/export sweep did not uncover a new missing-export or dead-dispatcher problem, but it did find one more duplicate-ownership code smell inside the live Claude hook slice. The 30-iteration review is now complete; remaining work is remediation and verification reruns, not further discovery.
