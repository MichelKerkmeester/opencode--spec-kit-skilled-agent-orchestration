# Research Iteration 112: What the External `opencode-lcm` Plugin Does Differently

## Focus

Compare our OpenCode plugin's `messages.transform` implementation with the external `opencode-lcm` reference the packet already studied.

## Findings

1. The external plugin keeps the runtime hook layer very thin. Its `experimental.chat.messages.transform` hook does not fabricate message parts inline in the hook body; it simply delegates to `store.transformMessages(output.messages)`. [SOURCE: `030-opencode-graph-plugin/external/opencode-lcm-master/src/index.ts:311-313`]

2. Inside `store.transformMessages`, the external plugin imports and uses `Part` from `@opencode-ai/sdk`, filters existing synthetic parts, constructs `syntheticParts: Part[]`, and only then pushes them back into `anchor.parts`. In other words, mutation is centralized in a codepath that is typed against the OpenCode SDK contract. [SOURCE: `030-opencode-graph-plugin/external/opencode-lcm-master/src/store.ts:2901-2922`]

3. Our plugin does not currently have that protection boundary. It receives a transport plan from the subprocess bridge and then builds a custom synthetic part object locally inside the plugin runtime itself. There is no imported SDK `Part` type, no shared builder, and no runtime validation step visible in the current code. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:196-210`] [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:326-350`]

4. The operational lesson from `opencode-lcm` is not just "messages.transform can work." The deeper lesson is "if you mutate prompt messages, do it through a schema-aware path that owns dedupe, cleanup, and type-shape fidelity." [INFERENCE: synthesized from `030-opencode-graph-plugin/external/opencode-lcm-master/src/index.ts:311-313` and `030-opencode-graph-plugin/external/opencode-lcm-master/src/store.ts:2898-2922`]

## Recommendation

If we keep message mutation at all, the mutation logic should move behind a schema-aware helper rather than living as an ad hoc object literal in `.opencode/plugins/spec-kit-compact-code-graph.js`. Until that exists, `messages.transform` is the highest-risk hook to keep enabled.

## Ruled Out Directions

- Assuming the external plugin proves our current inline part-builder is safe
- Treating the external plugin's working behavior as evidence that any text-shaped object is acceptable to OpenCode
