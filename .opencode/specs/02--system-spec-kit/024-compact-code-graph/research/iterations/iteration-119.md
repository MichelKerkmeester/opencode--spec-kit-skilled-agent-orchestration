# Research Iteration 119: The Missing Verification Layer Is Runtime-Schema Validation

## Focus

Define the minimum additional verification needed so packet-030 plugin work stops relying on loose mocks.

## Findings

1. Current tests prove the bridge is called, cache behavior works, and a synthetic object is pushed once. They do not prove the transformed output survives real OpenCode prompt validation. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:74-165`]

2. The highest-value regression test is not "more metadata assertions." It is a contract test that rejects invalid message shapes before they ever reach a live OpenCode session. [INFERENCE: based on the gap identified in iteration 113]

3. A strong verification ladder for this plugin now looks like:
   - unit tests for bridge/cache behavior
   - shape validation for transformed `messages`
   - one real OpenCode smoke test after restart

4. Without that middle layer, packet 030 will keep being vulnerable to "passes Vitest, fails live host schema" regressions whenever `messages.transform` changes. [INFERENCE: synthesized from `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:101-119` and the live failure]

## Recommendation

Add a dedicated runtime-contract test before re-enabling any nontrivial `messages.transform` behavior. The exact test mechanism can vary, but packet 030 should not rely on hand-wavy shape assumptions anymore.

## Ruled Out Directions

- Treating a successful startup digest test as sufficient proof that the plugin's message mutation is valid
- Reintroducing synthetic message parts without adding any stronger verification layer
