# Strategy: end-user-scope-default for code graph indexing

<!-- ANCHOR:key-questions -->
## Key Questions
1. Where does the scope decision live today? (scanner.ts, exclude-rules.ts)
2. Right flag surface (env var / capability-flags.ts / opencode.json / API param)?
3. Right default (end-user-only with skill opt-in)?
4. Precise default exclude path list?
5. Migration path for existing graphs?
6. Consumer impact (advisor / skill_graph / hooks / blast_radius / CocoIndex)?
7. Adjacent systems needing same treatment?
8. Performance delta?
9. Backward compat for current spec-kit maintainers?
10. Workflow invariance (ADR-005) check?
<!-- /ANCHOR:key-questions -->

<!-- ANCHOR:answered-questions -->
## Answered Questions
- Q1: Scope decision lives in two layers: `code_graph/lib/indexer-types.ts` for default include/exclude globs and `lib/utils/index-scope.ts` as the walker-level guard, called from `code_graph/lib/structural-indexer.ts`.
- Q2: Primary flag surface should be a default-off environment variable read by scanner configuration, plus a per-call boolean override added to the strict `code_graph_scan` schema for one-off old-behavior scans.
- Q3: Default should be end-user-only; skill internals should appear only when env or per-call opt-in is active.
- Q4: Current default excludes are `node_modules`, `dist`, `.git`, `vendor`, `external`, `z_future`, `z_archive`, and `mcp-coco-index/mcp_server`; `.opencode/skill` is not broadly excluded today.
- Q5: Migration should require an explicit full `code_graph_scan` after a scope-version warning, because only the full scan handler prunes tracked files that still exist but are no longer candidates.
- Q6: Advisor and skill graph are low-risk consumers because they scan skill metadata into `skill-graph.sqlite`; code graph query/context/status need migration messaging, and blast-radius results for skill internals disappear by default.
- Q7: Adjacent code graph read/status surfaces need messaging only; CocoIndex is separate and should be a follow-up because it uses its own binary and index directory.
- Q8: Current live DB impact is large: 1,571/1,619 tracked files, 34,274/34,850 nodes, and 15,573/16,530 edges are under `.opencode/skill` or touch nodes there.
- Q9: Backward compatibility is explicit opt-in: maintainers set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or pass `includeSkills:true`, then run a full scan to rebuild with skill internals included.
- Q10: Workflow invariance is preserved by keeping Gate 3, spec levels, and public conversation text unchanged; implementation wording should use concrete code graph scope language only.
<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## What Worked
- Iteration 1: Exact path discovery with `find` and targeted `rg` found the live code graph package after shorthand packet paths missed.
- Iteration 2: Comparing schema, handler interface, env helpers, and runtime config separated durable defaults from one-off scan overrides.
- Iteration 3: Side-by-side reading of prune and readiness paths exposed the need for a scope-version warning rather than relying on freshness checks.
- Iteration 4: Direct SQLite measurement gave stronger performance evidence than filesystem counts alone.
- Iteration 5: Reading ADR-005 directly prevented a vocabulary leak and clarified that compatibility should preserve workflow text, not old noisy results.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed
- Iteration 1: Literal reads of `mcp_server/lib/code_graph/scanner.ts` and `mcp_server/lib/code_graph/exclude-rules.ts` failed because those files do not exist in this workspace.
- Iteration 2: Inline gate renderers are documentation renderers, not runtime flag models.
- Iteration 3: Consumer risk initially looked advisor-heavy by name, but implementation evidence showed advisor and skill graph use separate metadata storage.
- Iteration 4: Filesystem candidate counts did not match live DB distribution closely enough to stand alone; they are only supporting evidence.
- Iteration 5: Preserving old defaults is incompatible with the measured graph pollution, so backward compatibility must be opt-in.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches
(populated per iteration)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled-Out Directions
- Updating only `IndexerConfig.excludeGlobs` is insufficient; the shared walker guard would still need to agree with the default scope.
- Using `opencode.json` as the sole flag source is ruled out because library scans and tests must not depend on one runtime config file.
- Relying on incremental scans for migration is ruled out; existing skill files still exist on disk, so incremental cleanup will not delete them.
- Broadly excluding runtime directories outside `.opencode/skill` is ruled out for the first change; local evidence shows negligible source-file impact there.
- Preserving old default skill indexing is ruled out; it fails the packet goal and keeps current query pollution.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus
All 10 research questions answered. Proceed to synthesis, resource map, continuity update, and ADR finalization.
<!-- /ANCHOR:next-focus -->
