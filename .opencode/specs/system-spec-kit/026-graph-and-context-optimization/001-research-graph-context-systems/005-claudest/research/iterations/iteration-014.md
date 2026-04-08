# Iteration 14: forced-degrade FTS verification matrix

## Focus
Turn the FTS portability lane into a testable matrix. The question here is not whether fallback is a good idea in general, but which exact failure modes Public can prove today and which ones still require schema work. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]

## Findings
- Current tests cover only the happy path and the "table missing" gate. `sqlite-fts.vitest.ts` proves `isFts5Available()` table detection, BM25 scoring, archive filtering, empty-query handling, and sort order, but it does not exercise compile-level or runtime forced-degrade scenarios. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145]
- The first required forced-degrade case is "table missing," because that is the only absence the current helper can truly observe. That case already exists in test form and should be preserved as the lowest-risk baseline when the helper grows. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:65-68]
- The second and third cases belong to runtime failures, not schema assertions: `no such module: fts5` and `unable to use function bm25`. Those failures currently collapse to `[]` inside `fts5Bm25Search()`, which means the next packet should add explicit degrade metadata instead of silently depending on empty-result semantics. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:91-145]
- The fourth case is compile-probe miss, but that is only meaningful after the helper grows beyond `sqlite_master` probing. This test belongs in the packet as a fake capability-helper branch, not as a schema fixture. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-135]
- `fts4_match` must stay out of the default matrix. Public does not create an alternate FTS4 table today, so testing it as a live execution tier would blur design intent with unimplemented schema. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]

## Ruled Out
- Adding an FTS4 happy-path test to "prove portability." That would validate a lane the current schema does not support. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]

## Dead Ends
- No new dead-end path occurred. The correction was simply distinguishing helper-branch tests from schema-backed execution tests. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`

## Reflection
- What worked and why: using the existing test file as the anchor kept the matrix grounded in real Public seams instead of abstract portability claims. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:60-145]
- What did not work and why: the earlier shorthand implicitly mixed backend-selection tests with schema-provisioning tests, which is how the phantom FTS4 lane kept slipping into scope. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382-2412]
- What I would do next: lock the bounded producer metadata patch for analytics so the second adoption lane has equally crisp acceptance gates. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:194-257]

## Recommended Next Focus
Translate the Stop-hook analytics gap into a metadata-only producer patch that preserves the current `session-stop.ts` boundary. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-33]
