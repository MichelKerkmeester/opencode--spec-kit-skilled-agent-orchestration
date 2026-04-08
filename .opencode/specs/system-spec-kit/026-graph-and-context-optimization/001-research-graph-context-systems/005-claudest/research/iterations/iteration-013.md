# Iteration 13: FTS capability helper contract and caller migration plan

## Focus
Pin the smallest accurate helper contract Public should add before borrowing more of Claudest's recall portability pattern. The goal is not another abstract "support FTS fallback" statement; it is identifying the exact helper boundary and the exact duplicate probes it replaces. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:48-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478]

## Findings
- Public already has the query primitive but not the capability contract. `fts5Bm25Search()` owns the weighted MATCH plus BM25 query and swallows runtime failures to `[]`, while `isFts5Available()` only checks whether `memory_fts` exists in `sqlite_master`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:48-145]
- The same table-existence probe is duplicated in two consumers. `hybrid-search.ts` carries `isFtsAvailable()` and `graph-search-fn.ts` carries `isFtsTableAvailable()`, so the current portability story is spread across three files with slightly different semantics. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:63-109]
- Public still provisions only `memory_fts USING fts5`, so the safe helper contract cannot promise an FTS4 execution lane today. Any helper that reports `fts4_match` as a live backend would be overstating current schema reality. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]
- The smallest safe helper is therefore a lexical capability descriptor, not another search wrapper: `{ compileSupport, tablePresent, bm25Usable, backend, degradeReason }`, returned from one shared location in `sqlite-fts.ts` and consumed by both lexical and graph search paths before they branch. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:48-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:63-109]
- Caller migration should be narrow. `hybrid-search.ts` and `graph-search-fn.ts` should stop probing `sqlite_master` directly and instead receive typed backend information from the helper; no other search callers need to move in the first packet. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:454-478] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:102-109]
- The packet boundary is now explicit: first packet = helper + caller migration + backend metadata + degrade tests. Schema expansion for a real FTS4 lane is a separate, opt-in stretch. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]

## Ruled Out
- Treating the helper as a broad rewrite of the whole search stack. The current evidence supports a narrow capability contract plus caller migration, not a lexical subsystem rewrite. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478]

## Dead Ends
- No new dead-end path occurred. The main correction was shrinking the vague "port Claudest fallback" story into one concrete helper contract and two concrete caller migrations. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`

## Reflection
- What worked and why: reading the three Public search files together made the duplication boundary obvious, which is exactly what the next packet needs. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145]
- What did not work and why: the earlier shorthand blurred "query primitive" and "capability helper" into one idea, which hid the narrower change Public can safely land first. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:423-478]
- What I would do next: write the forced-degrade verification matrix against this helper contract before drafting packet tasks. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145]

## Recommended Next Focus
Define the forced-degrade matrix that proves the helper is accurate without promising an FTS4 execution lane Public does not yet provision. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]
