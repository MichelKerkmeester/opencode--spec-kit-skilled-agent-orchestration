# Agent Brief — T-C Public API Surface Gaps

You are an autonomous implementation agent. **No conversation context.**

## Your role

Expose two implemented-but-unreachable features through the public MCP/advisor API:
1. `minConfidence` parameter for `code_graph_query` (handler accepts it; schema rejects it as unknown)
2. `affordances` input for advisor recommend (scorer accepts it; advisor input schema has no field)

Closes R-007-6 and R-007-10.

## Read first

1. `010/007/tasks.md` (T-C section)
2. `010/007/spec.md` §3 (Files to Change → T-C)
3. **Reports for full context:**
   - `010/003/review/review-report.md` Iter 3 (minConfidence drift)
   - `010/004/review/review-report.md` Iter 3 (affordances not exposed)

## Worktree

- Path: `../010-007-C`

## Files you may touch

| File | Action | Why |
|------|--------|-----|
| `mcp_server/schemas/tool-input-schemas.ts` (lines ~452, ~669) | MODIFY | Add `minConfidence: number().min(0).max(1).optional()` to query schema; add to allowed-parameter ledger |
| `mcp_server/tool-schemas.ts` (~line 573) | MODIFY | Add `minConfidence` to JSON schema for `code_graph_query` tool |
| `mcp_server/schemas/__tests__/tool-input-schema.vitest.ts` | MODIFY | Add test exercising `minConfidence` accept/reject paths |
| `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` (~line 24) | MODIFY (Option PUBLIC) — add `affordances` field, OR (Option DEFER) — add doc comment marking compile-time-only |
| `mcp_server/skill_advisor/handlers/advisor-recommend.ts` (~line 202) | MODIFY (Option PUBLIC only) — wire `options.affordances` from input |
| `010/007/implementation-summary.md` | MODIFY — record decision + closure |

## Files you may NOT touch

- `code_graph/handlers/query.ts` (handler logic already done)
- Test files outside the schema test
- Doc files (T-F owns)
- Other batch territories

## Hard rules

1. **Backward compat:** existing callers without `minConfidence` / `affordances` still work
2. **Validation must be tight.** `minConfidence` ∈ [0, 1]. `affordances` is array of structured objects (reuse the `AffordanceInput` type from `affordance-normalizer.ts`)
3. **`tsc --noEmit` clean** after changes
4. **Decision document for `affordances`:** record in implementation-summary.md whether you chose PUBLIC (full wiring) or DEFER (mark compile-time-only with explicit rationale)

## Success criteria

- [ ] R-007-6 `minConfidence` exposed end-to-end (handler → Zod → JSON schema → ledger → test)
- [ ] R-007-10 affordances PUBLIC-or-DEFER decision recorded + implemented
- [ ] `cd mcp_server && npx --no-install tsc --noEmit` clean
- [ ] `npx --no-install vitest run schemas/__tests__/tool-input-schema.vitest.ts` passes

## Output contract

- Commit: `feat(010/007/T-C): expose minConfidence + affordances on public MCP/advisor API`
- Print at end: `EXIT_STATUS=DONE | minConfidence=WIRED | affordances=<PUBLIC|DEFER>`
