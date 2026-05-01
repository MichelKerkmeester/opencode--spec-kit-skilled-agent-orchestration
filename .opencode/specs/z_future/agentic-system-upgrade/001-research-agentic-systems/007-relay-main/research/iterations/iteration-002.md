# Iteration 002 — Callback Contract

Date: 2026-04-09

## Research question
Do Relay's callback and lifecycle-hook surfaces provide a coordination contract that Public's current conductor/executor delegation docs lack?

## Hypothesis
Relay exposes richer state transitions to callers than Public's current "delegate, then validate output" model.

## Method
Read Relay's SDK READMEs and `relay.ts` hook definitions/event wiring, then compared them with Public's Codex, Gemini, and Copilot delegation references plus the top-level orchestrator contract.

## Evidence
- Relay documents event hooks such as `onMessageReceived`, `onAgentIdle`, plus lifecycle hooks on spawn/release. [SOURCE: external/packages/sdk/README.md:38-73]
- The TypeScript facade exposes hooks for message receipt/sending, agent spawn/release/exit/ready, worker output, delivery updates, idle, and channel subscribe/unsubscribe events. [SOURCE: external/packages/sdk/src/relay.ts:349-362]
- `spawnPty()` invokes `onStart`, `onError`, and `onSuccess` around the spawn call itself. [SOURCE: external/packages/sdk/src/relay.ts:560-615]
- Event wiring calls `onMessageReceived`, `onAgentReady`, and channel subscription hooks from broker events. [SOURCE: external/packages/sdk/src/relay.ts:1219-1294]
- The Python SDK mirrors this with `on_message_received`, `on_agent_ready`, `on_agent_exited`, `on_agent_spawned`, `on_worker_output`, and `on_agent_idle`. [SOURCE: external/packages/sdk-py/README.md:150-159]
- Public's Codex delegation reference centers on a stateless conductor/executor loop: the caller decomposes, validates, and re-prompts; each exec is stateless by default. [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:17-22] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:124-132]
- Gemini and Copilot delegation references follow the same conductor/executor pattern without any equivalent runtime callback surface. [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:81-88] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:14-20] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:198-206]

## Analysis
Relay's hook model gives the coordinator structured interception points during transport, not just after the worker finishes. Public's current documentation assumes asynchronous delegation ends in a single synthesized answer or saved artifact, so it never teaches conductors how to react to intermediate lifecycle events. That is fine for current CLI delegation, but it leaves no shared vocabulary for future live collaboration features.

## Conclusion
confidence: high
finding: Relay's biggest immediately transferable idea is not the broker itself but the explicit event contract. Public should teach delegation surfaces to talk about spawn, ready, output, idle, and completion events consistently, even before a transport layer exists.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`, `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a shared event glossary that all three CLI delegation skills can reuse
- **Priority:** must-have (adopt now)

## Counter-evidence sought
Searched the current Public delegation references for hook/callback/event-stream concepts beyond final validation; found only conductor/executor and output-validation guidance.

## Follow-up questions for next iteration
- If Public had an event glossary, what transport targets would those events describe?
- How much of Relay's routing model is necessary before callback language becomes meaningful?
- Should callback names follow Relay's lifecycle names or Public-specific terminology?
