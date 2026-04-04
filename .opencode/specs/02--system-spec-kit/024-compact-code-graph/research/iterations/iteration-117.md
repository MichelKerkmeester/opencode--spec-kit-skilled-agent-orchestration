# Research Iteration 117: A Safer OpenCode Pattern Already Exists in the Archived Working-Memory Plugin

## Focus

Look for another in-repo OpenCode plugin pattern that handled `experimental.chat.messages.transform` more conservatively than the current packet-030 plugin.

## Findings

1. The archived working-memory plugin in this repo also uses `experimental.chat.messages.transform`, but it does not append brand-new synthetic text parts. Instead it walks existing `msg.parts`, finds compacted `tool` parts, and mutates `part.state.output` in place after retrieving cached tool output. [SOURCE: `z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1657-1693`]

2. That older pattern is still risky in its own way, but it is materially different from the current packet-030 approach. It operates on existing host-created part objects rather than inventing a new part envelope locally. [SOURCE: `z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1666-1689`]

3. This gives us a practical design clue: if OpenCode is strict about the outer message/part schema, then mutating a known-safe existing part may be much more robust than appending a new synthetic part from an unverified literal builder. [INFERENCE: based on the contrast between the archived pattern and `.opencode/plugins/spec-kit-compact-code-graph.js:196-210,345-350`]

## Recommendation

If packet 030 needs current-turn enrichment inside `messages.transform`, the lower-risk direction is:

- first try no `messages.transform` at all
- if reintroduction is necessary, prefer mutation of existing host-owned parts or another officially supported surface over ad hoc synthetic part creation

## Ruled Out Directions

- Assuming the only two choices are "keep synthetic parts" or "abandon message-time context entirely"
