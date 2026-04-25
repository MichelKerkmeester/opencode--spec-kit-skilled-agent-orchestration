# Iteration 37: Status, Trigger, and Freshness Revalidation

## Focus
Re-check the status distribution, trigger-cap compliance, and freshness signals after the normalization map and packet closeout work landed.

## Findings
1. Status normalization is now clean at the stored-metadata level: the active distribution is `226` `complete`, `90` `in_progress`, `49` `planned`, and `0` outlier values. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:103-125] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Trigger-cap enforcement held across the full active corpus: `0` packets exceed the intended 12-trigger ceiling and the maximum stored trigger count is exactly `12`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:692-704] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Freshness lag is also clean under the packet's current heuristic: `0` stored `last_save_at` values are older than the newest mtime among the packet's current `source_docs`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Four packets still store `planned` while `implementation-summary.md` exists on disk, but the drift is now traceable to explicit frontmatter status choices rather than normalization or stale-backfill noise: the three `018-research-content-routing-accuracy` child phases keep `status: planned` in `spec.md`, `plan.md`, and `checklist.md`, and the `006-canonical-continuity-refactor` root still carries explicit `planned` status in multiple canonical docs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/001-fix-delivery-progress-confusion/checklist.md:3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/checklist.md:12] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. Two packets still sit in a contract-bound edge case: `skilled-agent-orchestration/041-sk-recursive-agent-loop/010-sk-agent-improver-self-test-fixes` and `011-sk-agent-improver-advisor-readme-sync` have fully checked checklists but no `implementation-summary.md`, so they remain `planned` under the current parser rules. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Treating the remaining `planned` values as a normalization regression. The stored values are canonical; the residual ambiguity is now about packet-document authoring and contract semantics.

## Dead Ends
- None. The status and trigger signals converged cleanly once the live scan was separated from explicit frontmatter intent.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:103-125`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:655-704`
- Live 2026-04-13 bash + jq scan over `.opencode/specs/`

## Assessment
- New information ratio: `0.06`
- Questions addressed: `RVQ-2`
- Questions answered: `RVQ-2`

## Reflection
- What worked and why: comparing stored status buckets against on-disk canonical docs made it possible to separate parser regressions from explicit doc intent.
- What did not work and why: the packet-local freshness heuristic cannot detect packets where `implementation-summary.md` exists on disk but is not treated as a completion signal because the docs still declare `planned`.
- What I would do differently: if this corpus ever needs an operational status KPI, add a second audit view for `implementation-summary.md present + explicit planned status` so intentional versus stale cases stay visible.

## Recommended Next Focus
Re-check entity precision under the scoped canonical-path matcher, then decide whether anything materially new remains or whether the loop has converged into implementation-only hygiene.
