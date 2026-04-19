# Iteration 18: Test Coverage Gaps And Untested Edges

## Focus
Determine which routing categories and failure modes do not have meaningful regression coverage today.

## Findings
1. `content-router.vitest.ts` has a happy-path test for every category, plus a handful of Tier3 contract tests and one `routeAs` override test. That is enough to prove the API shape, but not enough to guard the measured confusion pairs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48]
2. The main measured failures are untested. There is no regression case where delivery text contains implementation verbs and sequencing language in the same chunk, and there is no natural-routing case where handover text coexists with `git diff`, resume commands, or recovery-style phrasing. The only drop-oriented regression today is a transcript wrapper sample and the explicit override-against-drop case. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:65] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:182] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:395]
3. Several categories also lack adversarial tests entirely. `decision`, `research_finding`, `metadata_only`, and `task_update` each have direct positive-path tests but no negative or ambiguity tests that prove they beat close neighbors. That matters because earlier iterations already found spillover between progress and research, and between research and metadata. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:76] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:122] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:167]
4. The save-handler tests currently prove only explicit `routeAs` routing, not natural routing. `handler-memory-save.vitest.ts` routes canonical saves into the target summary and task docs by forcing `routeAs`, so phase `003` still needs handler-level coverage that a naturally ambiguous atomic save can reach Tier3 and fall back safely when the classifier is unavailable. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1076] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1119]

## Ruled Out
- Treating the current test suite as sufficient because every category already has one positive-path assertion.

## Dead Ends
- Looking only at router tests and ignoring the handler path where Tier3 would actually be wired.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:182`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:395`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1076`

## Assessment
- New information ratio: 0.61
- Questions addressed: RQ-11
- Questions answered: RQ-11

## Reflection
- What worked and why: Reading router and handler tests side by side exposed the gap between contract coverage and save-path coverage.
- What did not work and why: Category happy-path tests created a false sense of completeness because the fragile boundary cases live outside those samples.
- What I would do differently: Start the testing audit by mapping real error clusters to missing assertions, not by counting total tests.

## Recommended Next Focus
Translate the research into concrete implementation guidance for phases `001`, `002`, and `003`, with exact code locations and test additions.
