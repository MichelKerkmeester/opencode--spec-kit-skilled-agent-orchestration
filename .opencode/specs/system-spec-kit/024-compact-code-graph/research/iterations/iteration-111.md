# Research Iteration 111: Local Fault Isolation for the OpenCode Invalid-Prompt Regression

## Focus

Identify which live hook surface most likely causes the OpenCode error:

`Invalid prompt: The messages do not match the ModelMessage[] schema.`

## Findings

1. The local OpenCode plugin uses three mutating hook surfaces, but only one of them edits the `messages` payload directly. `experimental.chat.system.transform` appends a plain string to `output.system`, and `experimental.session.compacting` appends a plain string to `output.context`. Only `experimental.chat.messages.transform` reaches into `output.messages`, locates the last anchor message, and pushes a custom object into `anchor.parts`. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:303-374`]

2. The synthetic part builder is an untyped object literal created in the plugin itself. It adds fields like `id`, `sessionID`, `messageID`, `type`, `text`, `synthetic`, and `metadata`, but there is no local evidence that this object is validated against OpenCode's actual runtime `Part` schema before it is inserted. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:196-210`] [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:345-350`]

3. The runtime error text explicitly names the top-level prompt messages schema, not the bridge payload or compaction context shape. That lines up much more closely with the local `messages.transform` mutation seam than with the subprocess bridge or the string-only `system` / `compaction` surfaces. [INFERENCE: based on the live OpenCode error text supplied by the user plus the hook surface boundaries in `.opencode/plugins/spec-kit-compact-code-graph.js:303-374`]

4. The most likely immediate root cause is therefore not "OpenCode plugins are broken" or "the bridge still fails." It is that our plugin is mutating `output.messages` with a part object that the live OpenCode runtime rejects during final prompt assembly. [INFERENCE: synthesized from findings 1-3]

## Recommendation

Treat `experimental.chat.messages.transform` as the primary fault boundary. The fastest proving step is to disable or bypass that hook temporarily while leaving `system.transform` and `session.compacting` intact. If the invalid-prompt error disappears and the startup digest becomes stable again, the schema problem is effectively confirmed.

## Ruled Out Directions

- Re-opening the old `better-sqlite3` / native-module ABI diagnosis as the primary cause
- Treating `system.transform` or `session.compacting` as the most likely schema source before testing `messages.transform`
