# Iteration 29: Tier 3 Prompt And Fail-Open Verification

## Focus
Verify the new always-on Tier 3 path with routing-only tests: natural routing, metadata-driven `packet_kind`, `save_mode`, and the fail-open fallback when transport throws.

## Findings
1. A targeted routing-only Vitest run passed `7/7`, covering the new delivery/handover boundary assertions plus the natural Tier 3 and fail-open handler checks. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:76] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:133] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:503] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1239] [INFERENCE: targeted `npx vitest run ... -t ...` execution]
2. Natural canonical saves now reach Tier 3 with `PACKET_KIND: feature` and `SAVE_MODE: natural` in the prompt body, matching the handler's new `saveMode` labeling. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1239] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1206]
3. Research-root packets derive `PACKET_KIND: research` from spec frontmatter rather than pure path shape, which confirms the metadata-first packet-kind logic is live. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1294] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:870]
4. Explicit `routeAs` saves against a child phase emit `PACKET_KIND: phase` and `SAVE_MODE: route-as`, which proves the prompt body distinguishes operator-forced routes from natural classification. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1347] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1207]
5. When Tier 3 transport throws, the handler still succeeds via natural Tier 2 routing and writes the note to the expected canonical target. That behavior matches the code-level fail-open contract from iteration 28. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1401] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:569] [INFERENCE: targeted `npx vitest run ... -t ...` execution]

## Ruled Out
- Treating the routing-only Tier 3 tests as redundant now that the handler wiring exists in code.

## Dead Ends
- Using the full handler suite as the primary signal for this question when unrelated atomic-save failure-injection tests still fail elsewhere in the file.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:76`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:133`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:503`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1239`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1401`

## Assessment
- New information ratio: 0.31
- Questions addressed: RQ-13
- Questions answered: RQ-13

## Reflection
- What worked and why: Narrowing the test run to the routing assertions answered the packet question without repo-wide test noise.
- What did not work and why: The broader handler suite mixes routing work with separate atomic-save rollback and concurrency scenarios.
- What I would do differently: Keep the routing-only command alongside this packet so future verification runs do not accidentally widen into unrelated handler failures.

## Recommended Next Focus
Cross-check the three canonical docs against the shipped router behavior and note any wording that overstates what the code actually guarantees.
