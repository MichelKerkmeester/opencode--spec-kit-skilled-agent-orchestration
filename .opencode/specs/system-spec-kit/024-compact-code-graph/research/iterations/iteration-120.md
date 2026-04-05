# Research Iteration 120: Segment 9 Final Synthesis — OpenCode Prompt-Schema Regression

## Final Judgment

The highest-confidence explanation for the current OpenCode behavior is:

1. the subprocess bridge/bootstrap problem has already been separated correctly
2. packet 030's live failure now sits in `experimental.chat.messages.transform`
3. the plugin likely inserts a synthetic part shape that OpenCode rejects during final `ModelMessage[]` prompt validation
4. that single fault can explain both the persistent invalid-prompt error and the apparently unreliable startup-hook visibility

## Supporting Evidence

- Local plugin mutates `output.messages` by pushing a synthetic object literal into `anchor.parts`. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:196-210`] [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:326-350`]
- External `opencode-lcm` also mutates `messages`, but does so through a centralized store path typed against `Part[]` from `@opencode-ai/sdk`. [SOURCE: `030-opencode-graph-plugin/external/opencode-lcm-master/src/index.ts:311-313`] [SOURCE: `030-opencode-graph-plugin/external/opencode-lcm-master/src/store.ts:2901-2922`]
- Our current tests do not validate the real runtime schema boundary. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:101-119`]
- An older archived plugin in this repo used `messages.transform` more conservatively by mutating existing tool-part state in place. [SOURCE: `z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1657-1693`]

## Best Next Action

For packet 030, the best immediate implementation sequence is:

1. disable `experimental.chat.messages.transform`
2. keep `experimental.chat.system.transform` and `experimental.session.compacting`
3. restart OpenCode and verify that:
   - the invalid prompt error disappears
   - the startup digest is visible again
4. only then decide whether to reintroduce bounded current-turn context through a safer mutation strategy

## Secondary Recommendations

- Add a runtime-contract test for transformed `messages`
- If `messages.transform` returns later, prefer mutation of existing host-owned parts or a true SDK-aligned builder over the current inline object literal
- Add per-hook diagnostics to the status tool so users can distinguish "hook did not run" from "hook ran but the final prompt was rejected"

## Ruled Out Directions

- Undoing the subprocess bridge
- Treating the invalid prompt and startup visibility as independent bugs before isolating `messages.transform`
- Assuming `opencode-lcm` proves the current packet-030 object shape is already valid
