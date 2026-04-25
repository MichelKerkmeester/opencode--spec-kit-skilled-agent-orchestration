# Agent Brief — T-D Sanitization Hardening

You are an autonomous implementation agent. **No conversation context.**

## Your role

Close 5 P1 + 5 P2 sanitization findings across 7 files. All are localized fixes — no architectural changes.

Closes: R-007-3, R-007-4, R-007-8, R-007-9, R-007-11, R-007-P2-1, R-007-P2-3, R-007-P2-8, R-007-P2-10, R-007-P2-11.

## Read first

1. `010/007/tasks.md` (T-D section — 10 task IDs)
2. `010/007/spec.md` §3 (Files to Change → T-D row)
3. Per-finding context: `010/{002,003,004,005}/review/review-report.md`

## Worktree

- Path: `../010-007-D`

## Files you may touch

| File | Findings | Change |
|------|----------|--------|
| `mcp_server/code_graph/handlers/detect-changes.ts` (lines 122-152, 218-223) | R-007-3 | Canonicalize each candidate diff path; reject anything outside `canonicalRootDir` |
| `mcp_server/code_graph/lib/diff-parser.ts` (lines 179-190) | R-007-4 | Track expected hunk line counts so multi-file diffs don't eat the next file's `---/+++` headers |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` (lines 59, 834-847) | R-007-8, R-007-9 | Decide `conflicts_with` contract (validate-or-serialize); broaden prompt-injection denylist |
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` (lines 59, 153-164) | R-007-9, R-007-P2-9-light | Broaden prompt-injection denylist (TS) — add common variants ("ignore prior instructions", "disregard previous directions", "override system prompt", "system: ", etc.) |
| `mcp_server/formatters/search-results.ts` (lines 235-246, 239-243, 271-275, 348-350, 609-613) | R-007-11, R-007-P2-10, R-007-P2-11 | Reject incomplete explicit `trustBadges` OR merge per-field; sanitize/cap age-label strings to allowlisted grammar; add trace flag for badge derivation |
| `mcp_server/code_graph/lib/phase-runner.ts` (lines 87-89, 174-186) | R-007-P2-1 | Reject duplicate `output` keys same as duplicate phase names |
| `mcp_server/code_graph/lib/code-graph-db.ts` (~line 763) + `code_graph/handlers/query.ts` (lines 614-615) + `code_graph/lib/code-graph-context.ts` (~line 545) | R-007-P2-3 | Allowlist `reason`/`step` strings on read path (single-line, length-cap, non-control-char) — protect against stale/imported metadata |
| `mcp_server/skill_advisor/tests/__shared__/affordance-injection-fixtures.json` (NEW) + `skill_advisor/tests/affordance-normalizer.test.ts` + `skill_advisor/tests/python/test_skill_advisor.py` | R-007-P2-8 | Shared adversarial JSON fixture consumed by both TS and Python tests |
| `010/007/implementation-summary.md` | — | Record findings closed |

## Files you may NOT touch

- `code_graph/handlers/query.ts` outside lines 614-615 (T-F owns rest of query.ts)
- MCP tool schemas (T-A / T-C own)
- Doc files (T-F owns)
- Test files outside the listed test files
- Other batch territories

## Hard rules

1. **Backward compat:** existing valid inputs still pass through unchanged
2. **`tsc --noEmit` clean** after TS changes
3. **Python tests pass** after compiler changes (run `python3 -m pytest skill_advisor/tests/python/test_skill_advisor.py` if accessible)
4. **No silent data loss:** reject paths/tokens explicitly with structured errors, don't drop silently
5. **Allowlists not blocklists** wherever feasible. Blocklists are last resort for prompt-injection patterns where allowlist isn't practical
6. **Trust badge merging:** prefer merge-per-field (non-null fields from caller override matching derived fields, but null/missing fields fall through to derived) over wholesale replace

## Success criteria

- [ ] All 10 R-007-* task IDs closed with code change + test evidence
- [ ] `cd mcp_server && npx --no-install tsc --noEmit` clean
- [ ] `npx --no-install vitest run skill_advisor/tests/affordance-normalizer.test.ts code_graph/tests/detect-changes.test.ts code_graph/tests/phase-runner.test.ts` passes
- [ ] Shared adversarial fixture JSON exists and is referenced by both TS and Python tests

## Output contract

- Commit: `fix(010/007/T-D): sanitization hardening across diff parser, affordances, trust badges, phase runner, edge metadata`
- Print at end: `EXIT_STATUS=DONE | findings_closed=10 | tsc=clean | tests=PASSED/<count>`
