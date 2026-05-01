# Iteration 003 — Channel, DM, Thread Semantics

Date: 2026-04-09

## Research question
Does Relay's distinction between channels, direct messages, and thread replies expose a collaboration model that Public should prototype instead of relying on generic task delegation alone?

## Hypothesis
Relay's routing model is more precise than Public's current "parallel vs direct" wording and could improve future coordination design.

## Method
Read plugin docs, protocol types, routing code, and thread-name derivation logic; then compared them with Public's orchestrator and parallel-dispatch guidance.

## Evidence
- The plugin exposes channel posts, thread replies, DMs, reactions, inbox checks, channel creation/listing, and agent registration/listing as first-class MCP tools. [SOURCE: external/docs/plugin-claude-code.md:65-87]
- The protocol includes `thread_id`, channel subscribe/unsubscribe messages, and direct `send_message` payload fields for routing metadata. [SOURCE: external/packages/sdk/src/protocol.ts:30-41] [SOURCE: external/packages/sdk/src/protocol.ts:60-88]
- Routing resolves `#channel` delivery, thread-reply broadcast within a workspace, and direct/DM targets with explicit `needs_dm_resolution` fallback. [SOURCE: external/src/routing.rs:68-143]
- Channel delivery is based on normalized channel membership; direct targets are resolved by worker identity. [SOURCE: external/src/routing.rs:145-220]
- Thread display names preserve channel identity for `#channel` threads and derive human-readable DM names from participants when possible. [SOURCE: external/src/main.rs:4982-5023]
- Public's parallel-dispatch asset only decides whether work should stay direct or become parallel exploration; it has no concept of target address types or conversation scopes. [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:17-28] [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:49-72]
- Public's orchestrator likewise defines task formats and agent selection, not message-addressing semantics. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:191-205]

## Analysis
Relay's transport semantics answer a question Public does not yet ask: "What kind of conversation is this?" Channel broadcast, DM targeting, and thread continuation each imply different delivery and visibility rules. Public's current tooling only distinguishes whether work is parallelized or not. If Public adds live coordination, it will need target semantics sooner than it needs full broker complexity, because routing mistakes become UX and safety mistakes immediately.

## Conclusion
confidence: high
finding: Public should not jump straight to a broker, but it should capture Relay's address-type vocabulary. A future transport-aware phase should distinguish channel broadcast, direct handoff, and thread continuation explicitly instead of treating every coordination act as just another delegated task.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md` and a future transport-routing module under `.opencode/skill/system-spec-kit/mcp_server/`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define how spec folders, sessions, or shared spaces map to transport scopes
- **Priority:** should-have (prototype later)

## Counter-evidence sought
Looked for existing Public docs that already distinguish channel-like broadcast from direct agent messaging; found only parallelization and delegation patterns, not address semantics.

## Follow-up questions for next iteration
- How does Relay keep channel delivery scoped to the right workspace?
- Which of these target types are worth adopting first in Public?
- Should thread semantics be modeled at all before message routing exists?
