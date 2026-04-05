# Research Iteration 001: Plugin Architecture and Memory Injection Path

## Focus

Identify the real injection surfaces in `opencode-lcm` and verify whether "memory injection" means search-only, compaction-only, or prompt-time transforms.

## Findings

1. The plugin is a full OpenCode lifecycle adapter. It registers an event sink, a tool surface, a chat-message transform, a chat-system transform, and a compaction hook. [SOURCE: `external/opencode-lcm-master/src/index.ts:8-220`]
2. The README matches the source: the plugin archives old conversation state outside the prompt, then re-inserts selected context later through OpenCode transforms. [SOURCE: `external/opencode-lcm-master/README.md:55-77`]
3. The memory-injection path is split in two:
   - `experimental.chat.messages.transform` injects synthetic `retrieved-context` and `archive-summary` text parts into the current anchor message. [SOURCE: `external/opencode-lcm-master/src/store.ts:2876-2924`]
   - `experimental.session.compacting` appends a compact resume note to compaction context without replacing the compaction prompt. [SOURCE: `external/opencode-lcm-master/src/index.ts:14-220`] [SOURCE: `external/opencode-lcm-master/src/store.ts:2859-2874`]
4. The plugin also emits a system-level hint so the model knows an external archive exists and which tools to call only when needed. [SOURCE: `external/opencode-lcm-master/src/store.ts:2926-2935`]

## Why It Matters For Packet 024

This is the strongest reusable idea in the plugin: it does not try to dump the entire archive back into context. It injects a compact working-set summary at the exact OpenCode runtime boundary where prompt assembly happens.

That lines up with packet 024's existing "store rich, serve compact" direction for graph context rather than conflicting with it. [SOURCE: `research/research.md:31-43`]

## Open Question After This Iteration

Does the plugin's storage/search backend contain reusable ideas, or is only the OpenCode injection shell worth copying?
