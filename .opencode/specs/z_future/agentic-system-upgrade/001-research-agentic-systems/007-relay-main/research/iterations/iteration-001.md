# Iteration 001 — Ready-State Handshake

Date: 2026-04-09

## Research question
Does Relay's `worker_ready` handshake create a real coordination guarantee beyond spawn success, and should `system-spec-kit` adopt an equivalent readiness concept?

## Hypothesis
Relay separates process creation from message-safe readiness, and that distinction is missing from Public's current delegation guidance.

## Method
Read the Relay quickstart, protocol, SDK readiness implementation, and broker event emission; then compared them with Public's orchestrator and bootstrap/resume surfaces.

## Evidence
- Relay's quickstart spawns two workers, then explicitly waits on `waitForAgentReady()` before the first `sendMessage()`. [SOURCE: external/README.md:34-67]
- The protocol defines `worker_ready` as both a broker event and a worker-to-broker message type. [SOURCE: external/packages/sdk/src/protocol.ts:298-314] [SOURCE: external/packages/sdk/src/protocol.ts:403-406]
- `waitForAgentReady()` subscribes to broker events and resolves only when a matching `worker_ready` arrives; otherwise it times out. [SOURCE: external/packages/sdk/src/relay.ts:889-940]
- The broker emits `worker_ready` only after it has optionally queued the initial task and captured runtime/provider/model metadata. [SOURCE: external/src/main.rs:3323-3358]
- Public's orchestrator is defined around decomposition, Task-tool dispatch, evaluation, and synthesis; it does not define a transport-level ready state between delegated agents. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:51-60]
- Public's bootstrap path is about session recovery and structural context, not live peer readiness. [SOURCE: .opencode/agent/context-prime.md:34-39] [SOURCE: .opencode/agent/context-prime.md:57-66]

## Analysis
Relay treats "spawned" and "ready to receive coordination messages" as separate lifecycle points. That matters because its agents can talk to each other asynchronously, and a coordinator needs a positive signal before routing work into that transport. Public's current model does not need this distinction for ordinary Task-tool delegation because each delegated task is effectively fire-and-return. If Public ever adds realtime inter-agent messaging, though, skipping a ready gate would make first-message delivery nondeterministic.

## Conclusion
confidence: high
finding: Relay's readiness handshake is a transport guarantee, not just a convenience API. Public should not retrofit it into every existing delegation path, but it should reserve a named readiness concept for any future live coordination surface so "spawned" and "message-safe" do not collapse into one ambiguous state.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md` and a future transport module under `.opencode/skill/system-spec-kit/mcp_server/`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define whether readiness is broker-level, worker-level, or first-message-level in a future phase-007 transport design
- **Priority:** should-have (prototype later)

## Counter-evidence sought
Looked for a comparable ready-state contract in Public's orchestrator, bootstrap, and resume docs; none was documented beyond session/bootstrap readiness.

## Follow-up questions for next iteration
- Which Relay callback surfaces consume readiness once it exists?
- Does Relay also distinguish message-ready from merely worker-ready?
- Can Public adopt the vocabulary first in docs before any runtime work exists?
