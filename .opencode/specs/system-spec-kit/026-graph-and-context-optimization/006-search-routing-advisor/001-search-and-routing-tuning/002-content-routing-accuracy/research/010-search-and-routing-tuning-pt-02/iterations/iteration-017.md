# Iteration 17: Prototype Distribution Beyond The Hotspots

## Focus
Assess whether `routing-prototypes.json` is broadly healthy across all categories, not just balanced by count.

## Findings
1. The library is structurally complete: five examples for each of the eight categories, with labels, tags, and negative hints. That is good enough for coverage, but it overstates health because the distribution is not equally distinctive. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1]
2. The most fragile categories are also the ones whose prototypes borrow the most operational nouns from neighbors. Delivery overlaps with progress around repository and workflow language; handover overlaps with drop, task, and decision around session control, verification, and remaining work. The category-level negative-hint counts reinforce this: every delivery prototype warns against progress, and every task prototype warns against handover. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:3] [INFERENCE: packet-local negative-hint frequency scan over `routing-prototypes.json` run during iteration 17]
3. Some categories are much better anchored. `metadata_only` and `drop` have distinctive field-heavy or wrapper-heavy vocabularies, while `decision` and `research_finding` stay relatively coherent around rationale and evidence language. That supports the earlier observation that the main problem is not global corpus quality but two narrow semantic seams. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:131] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:165]
4. The best near-term prototype work is surgical, not wholesale: refresh 2-3 delivery examples and 1-2 handover examples to emphasize category-specific nouns, then leave the rest of the library stable so the before/after benchmark stays attributable. This aligns with phases `001` and `002` and avoids turning the routing benchmark into a full corpus rewrite. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/001-fix-delivery-progress-confusion/spec.md:10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/002-fix-handover-drop-confusion/spec.md:10]

## Ruled Out
- Rebuilding the entire prototype library as the first remediation step.

## Dead Ends
- Using prototype count balance as a proxy for semantic separation.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:131`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:165`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/001-fix-delivery-progress-confusion/spec.md:10`

## Assessment
- New information ratio: 0.52
- Questions addressed: RQ-10
- Questions answered: RQ-10

## Reflection
- What worked and why: Looking at negative-hint frequencies and category-specific vocabulary clarified that the problem is concentrated, not widespread.
- What did not work and why: Prototype counts initially made the library look healthier than it is.
- What I would do differently: Record semantic overlap metrics alongside category counts whenever the library changes.

## Recommended Next Focus
Audit the router and handler tests against the observed confusion pairs so the implementation phases can add the most valuable missing regressions first.
