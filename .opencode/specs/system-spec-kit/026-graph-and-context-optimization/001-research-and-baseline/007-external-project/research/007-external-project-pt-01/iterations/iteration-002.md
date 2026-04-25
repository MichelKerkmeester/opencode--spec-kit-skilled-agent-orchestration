# Iteration 002: Graph Schema, Edge Vocabulary, Confidence, and Persistence

## Focus

Determine whether External Project' graph model and persistence schema offer portable improvements over Public's current Code Graph storage.

## Actions Taken

- Read External Project schema documentation and graph type evidence.
- Read Public Code Graph SQLite schema and structural indexer metadata.
- Compared relationship vocabulary, edge metadata, and index freshness data.

## Findings

- External Project' persistent graph uses separate node tables per label and a single `CodeRelation` relationship table. [SOURCE: external/ARCHITECTURE.md:456]
- External Project relation vocabulary is broader than Public Code Graph's current edge list, including process, route, tool, fetch, and entry-point edges. [SOURCE: external/ARCHITECTURE.md:462]
- External Project' graph relation type includes confidence and reason-style metadata in the shared graph model, enabling tools to distinguish certain relationships from weaker inference. [SOURCE: external/shared/src/graph/types.ts:126]
- Public Code Graph currently stores `code_edges` with source, target, edge type, weight, and JSON metadata, which is flexible but lacks first-class confidence/reason columns. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:86]
- Public Code Graph already has freshness-oriented file metadata, including content hash, mtime, parse health, and parse duration, so External Project' freshness pattern can be adapted without replacing storage. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:55]

## Questions Answered

- Partially answered: External Project' edge vocabulary and metadata are useful, but Public should adapt them into SQLite rather than adopt LadybugDB.

## Questions Remaining

- Which edge types should be promoted first: process/tool/route edges, or confidence/reason metadata on existing CALLS/IMPORTS edges?

## Ruled Out

- Adopting LadybugDB as the immediate Public Code Graph storage layer; Public already has SQLite tooling, handlers, readiness state, and tests.

## Dead Ends

- Treating "more relationship types" as automatically better; relationship types need owner systems and query affordances.

## Sources Consulted

- external/ARCHITECTURE.md:456
- external/ARCHITECTURE.md:462
- external/shared/src/graph/types.ts:126
- .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:55
- .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:86

## Reflection

- What worked and why: Schema comparison made adoption boundaries concrete.
- What did not work and why: Storage-layer enthusiasm is premature without benchmarks.
- What I would do differently: Benchmark query shapes before considering any database migration.

## Recommended Next Focus

Evaluate query, context, and impact APIs as the user-facing layer above graph storage.
