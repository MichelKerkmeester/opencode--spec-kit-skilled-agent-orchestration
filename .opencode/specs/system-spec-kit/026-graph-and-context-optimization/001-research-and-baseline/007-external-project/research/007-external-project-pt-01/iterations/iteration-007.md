# Iteration 007: Spec Kit Memory Causal Graph Fit and Boundaries

## Focus

Identify which External Project graph ideas can improve Spec Kit Memory's causal graph without turning memory into a duplicate code index.

## Actions Taken

- Read Public causal edge storage and causal boost scoring.
- Compared memory relations with External Project code relations and process flows.
- Defined system ownership boundaries.

## Findings

- Spec Kit Memory causal edges already have a decision-lineage vocabulary: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, and `supports`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18]
- Memory causal traversal is intentionally bounded: default depth 3 in causal chain storage and max 2 hops in causal boost, with small boost caps. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:42] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:21]
- Causal boost has intent-aware edge priority, which is conceptually similar to External Project confidence/reason metadata but applied to memory retrieval rather than code graph traversal. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:59]
- External Project process and relation metadata can improve Memory by becoming evidence links from decisions/specs to Code Graph entities, not by importing CodeRelation rows into memory. [SOURCE: external/ARCHITECTURE.md:462]
- Best boundary: Code Graph owns code relationships and impact traversal; Memory owns "why this spec/decision matters" and can cite Code Graph evidence snapshots with provenance and freshness.

## Questions Answered

- Which External Project concepts can improve Spec Kit Memory's causal graph without turning memory into a duplicate code index?

## Questions Remaining

- The exact schema for a memory-to-code-evidence link: causal edge extension, separate evidence table, or graph metadata reference.

## Ruled Out

- Mirroring External Project `CodeRelation` directly into `causal_edges`; it would collapse decision lineage and structural code dependencies into one overloaded graph.

## Dead Ends

- Making Memory responsible for source-code freshness. Memory should record freshness metadata from Code Graph, not compute it.

## Sources Consulted

- .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:42
- .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:21
- .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:59
- external/ARCHITECTURE.md:462

## Reflection

- What worked and why: Owner-boundary analysis prevented the research from turning every graph into one graph.
- What did not work and why: Direct edge vocabulary mapping is too blunt.
- What I would do differently: Design memory evidence links after Code Graph exposes stable entity IDs.

## Recommended Next Focus

Map External Project tool/resource affordances to Skill Graph and Skill Advisor.
