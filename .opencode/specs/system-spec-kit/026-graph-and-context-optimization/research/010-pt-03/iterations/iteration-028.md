# Iteration 28: Remaining Planned Inventory

## Focus
Break down the remaining `planned` packets before doing manual inspection, so the sample hits the right residual cases.

## Findings
1. Only `56` active packets still report `planned`, down from `302` in Wave 1. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. The largest bucket is still genuinely unfinished work: `48` planned packets have an incomplete checklist. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Three planned packets are parent coordination folders with no checklist and no implementation summary, so `planned` remains structurally expected there. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Five planned packets already have a complete checklist, which makes them the key residual bucket to inspect manually. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Assuming that the remaining planned bucket is dominated by stale packets. The raw breakdown shows most of it is still incomplete work.

## Dead Ends
- None. The status TSV split the bucket cleanly once checklist state and implementation-summary presence were added.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:599-629`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.28`
- Questions addressed: `PVQ-2`
- Questions answered: none

## Reflection
- What worked and why: a simple checklist-state split was enough to turn the residual status bucket into a small, inspectable set.
- What did not work and why: planned packets with complete checklists still mix two different cases: stale backfill and missing implementation summaries.
- What I would do differently: capture the “planned with complete checklist” bucket as a first-class dashboard signal instead of deriving it ad hoc in research.

## Recommended Next Focus
Read the sampled planned packets directly and decide which ones are genuinely unfinished versus stale or contract-bound.
