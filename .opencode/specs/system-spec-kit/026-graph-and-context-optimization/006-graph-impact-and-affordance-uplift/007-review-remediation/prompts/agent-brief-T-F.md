# Agent Brief — T-F Doc + Label Cleanup

You are an autonomous implementation agent. **No conversation context.**

## Your role

Close 4 P1 + 7 P2 cleanup findings — broken links, conflicting tool counts, INSTALL_GUIDE bug, memory_search cache invalidation, `query.ts` micro-fixes, doc dedup.

Closes: R-007-12, R-007-16, R-007-17, R-007-18, R-007-P2-2, R-007-P2-4, R-007-P2-5, R-007-P2-6, R-007-P2-7, R-007-P2-9, R-007-P2-12.

## Read first

1. `010/007/tasks.md` (T-F section — 11 task IDs)
2. `010/007/spec.md` §3 (Files to Change → T-F row)
3. Per-finding context across `010/{003,005,006}/review/review-report.md`

## Worktree

- Path: `../010-007-F`

## Files you may touch

| File | Findings | Change |
|------|----------|--------|
| `mcp_server/handlers/memory-search.ts` (lines 880, 889, 1188, 1190) + `mcp_server/lib/cache/tool-cache.ts` (lines 56-58) + `mcp_server/lib/storage/causal-edges.ts` (lines 150, 160, 660) | R-007-12 | Include causal-edge generation/version in memory_search cache key, OR invalidate memory_search cache entries on causal-edge mutations |
| `mcp_server/skill-system-spec-kit/INSTALL_GUIDE.md` (line 521) | R-007-16 | After `cd .opencode/skill/system-spec-kit/mcp_server`, change `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py` to `python3 skill_advisor/tests/python/test_skill_advisor.py` |
| `/README.md` (lines 7, 56, 1261, 1301) + `.opencode/skill/system-spec-kit/README.md` (lines 62, 92) | R-007-17 | Pick canonical tool count source; sync all umbrella docs to ONE number; document if deferred handlers count or not |
| `/README.md` (line 1288) + (optionally) `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md` (NEW) | R-007-18 | Either CREATE the file (1-2 page plain-English summary of feature_catalog) OR REMOVE the link |
| `mcp_server/code_graph/lib/structural-indexer.ts` (lines 1407, 1488, 1491, 1513, 1516) | R-007-P2-2 | Wrap `runPhases` call in try/catch/finally so error outcome metric emits |
| `mcp_server/code_graph/handlers/query.ts` (line 859, 897) | R-007-P2-4 | Request `limit + 1` from underlying SQL; use this to detect true overflow (set `partialResult` only when actual overflow, not when result happens to equal limit) |
| `mcp_server/code_graph/handlers/query.ts` (lines 1048-1058) | R-007-P2-5 | In multi-subject blast-radius, preserve resolved seed nodes when a sibling subject fails (don't reset `nodes` to `[]`) |
| `mcp_server/code_graph/handlers/query.ts` (lines 1121, 1135) | R-007-P2-6 | Add stable `failureFallback.code` field; emit warning log + metric so operators can distinguish DB failure from empty blast radius |
| `mcp_server/code_graph/handlers/query.ts` (lines 1229, 1258, 1287, 1315) | R-007-P2-7 | Extract shared outbound/inbound relationship-edge mapper to deduplicate the 4 switch branches |
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` (lines 153-157) + `skill_advisor/scripts/skill_graph_compiler.py` (line 407) | R-007-P2-9 | Add debug counters: `received`, `accepted`, `dropped_unsafe`, `dropped_empty`, `dropped_unknown_skill` |
| `010/006-docs-and-catalogs-rollup/{spec,checklist,implementation-summary}.md` (lines 3, 2, 2 etc.) | R-007-P2-12 | Add explicit alias note ("phase 012 was renumbered to wrapper 010") OR normalize labels |
| `010/007/implementation-summary.md` | — | Record findings closed |

## Files you may NOT touch

- `code_graph/handlers/query.ts` lines 614-615 (T-D's reason/step allowlist territory)
- Test files (T-D + T-E own)
- MCP schemas (T-A + T-C own)
- 010/{001-005} sub-phase implementation-summary.md / checklist.md (T-B owns)
- Other batch territories

## Hard rules

1. **No new features.** All changes are documented bugs/cleanups
2. **`tsc --noEmit` clean** after changes
3. **Existing tests still pass** (no regression)
4. **Cache invalidation must not invalidate too aggressively.** Use causal-edge generation OR target specific cache keys, don't blow the whole cache on every causal-edge write
5. **Pick ONE canonical tool count source.** Don't introduce more conflicting counts. Document briefly in the canonical doc whether deferred handlers count.

## Success criteria

- [ ] All 11 R-007-* task IDs closed with code change + evidence
- [ ] `cd mcp_server && npx --no-install tsc --noEmit` clean
- [ ] Tool counts consistent across all umbrella docs (verified by grep)
- [ ] No broken doc links (verified by grep + ls)
- [ ] INSTALL_GUIDE smoke test path actually runs from the documented cwd

## Output contract

- Commit: `fix(010/007/T-F): doc + label cleanup, query.ts micro-fixes, memory_search cache invalidation`
- Print at end: `EXIT_STATUS=DONE | findings_closed=11 | tsc=clean | tool_count=<N canonical>`
