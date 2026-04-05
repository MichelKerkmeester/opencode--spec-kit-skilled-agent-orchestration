# Research Iteration 113: The Current Tests Do Not Model the Live Schema Boundary

## Focus

Verify whether the existing plugin tests would have caught the exact invalid-prompt regression seen in OpenCode.

## Findings

1. The current plugin tests mock the bridge and then assert that `experimental.chat.messages.transform` pushes one object into `output.messages[0].parts`. The assertion only checks a few fields: `type: 'text'`, `synthetic: true`, and the plugin metadata marker. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:101-119`]

2. The tests do not import the OpenCode SDK `Part` type, do not validate the final `output.messages` payload against a real `ModelMessage[]` contract, and do not run the mutated output through any host-side schema checker. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:1-170`]

3. Because the test fixture itself accepts any object inside `parts`, a regression where the plugin inserts a structurally invalid part can still produce a green test suite. That is exactly the kind of gap that would let a live OpenCode prompt-schema error escape local verification. [INFERENCE: based on the unconstrained `makeMessage()` fixture and the assertion style in `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:58-65` and `:101-119`]

4. The external reference has a stronger safety story because its mutation path is not just "tested." It is built around SDK-typed `Part[]`, which means compile-time and code-organization pressure are both steering it toward the real contract. [SOURCE: `030-opencode-graph-plugin/external/opencode-lcm-master/src/store.ts:2901-2922`]

## Recommendation

The next verification layer must be stronger than "the test saw one synthetic part." Either:

- validate the transformed messages against the real OpenCode schema, or
- add a smoke harness that runs the plugin against a real OpenCode-compatible message envelope

Without that, `messages.transform` changes will remain much easier to break than `system.transform` or `compaction`.

## Ruled Out Directions

- Treating the current Vitest pass as proof that `messages.transform` is runtime-safe
- Assuming bridge success means prompt-schema success
