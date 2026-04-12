# Iteration 008 — Delivery and Idle States

Date: 2026-04-09

## Research question
Should Public prototype explicit delivery-state and idle-state tracking for future live coordination instead of waiting for final outputs only?

## Hypothesis
Relay's delivery-state and idle-state model would be useful later, but the value is lower than ready-state and mode taxonomy.

## Method
Read Relay's README feature list plus `relay.ts` delivery-state and idle/event handling, then compared them with Public's current bootstrap and orchestration docs.

## Evidence
- Relay advertises idle detection and message-delivery state tracking as first-class SDK features. [SOURCE: external/packages/sdk/README.md:146-150]
- The SDK defines delivery states `queued`, `injected`, `active`, `verified`, and `failed`. [SOURCE: external/packages/sdk/src/relay.ts:160-160]
- Relay keeps a separate `messageReadyAgents` set, marks agents message-ready when inbound relay traffic is observed, and resolves delivery-state updates from broker events. [SOURCE: external/packages/sdk/src/relay.ts:396-396] [SOURCE: external/packages/sdk/src/relay.ts:1166-1228] [SOURCE: external/packages/sdk/src/relay.ts:1296-1342]
- `Agent` handles expose `waitForIdle()`, and the facade exposes `onAgentIdle`. [SOURCE: external/packages/sdk/src/relay.ts:257-257] [SOURCE: external/packages/sdk/src/relay.ts:360-360]
- Public's bootstrap path focuses on startup health and context recovery, not transport progression or idle/output states. [SOURCE: .opencode/agent/context-prime.md:34-39] [SOURCE: .opencode/agent/context-prime.md:118-145]
- Public's orchestrator evaluates outputs after delegation and prefers focused execution, but it has no state machine for deliveries in flight. [SOURCE: .opencode/agent/orchestrate.md:51-60] [SOURCE: .opencode/agent/orchestrate.md:266-268]

## Analysis
Delivery-state tracking is valuable once messages are a first-class unit of coordination. Right now Public mostly cares about task decomposition and artifact delivery, so importing this state machine immediately would be premature. Still, Relay shows that ready-state alone is not enough; once live messaging exists, "queued" versus "verified" matters operationally and diagnostically.

## Conclusion
confidence: medium
finding: Public should keep delivery and idle states on the prototype roadmap, but after adopting simpler wins like coordination-shape naming and completion-evidence rules. This is an enabling runtime pattern, not the first design move.

## Adoption recommendation for system-spec-kit
- **Target file or module:** future live-coordination module under `.opencode/skill/system-spec-kit/mcp_server/`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** establish whether Public will ever expose message-level coordination to users or only use it internally
- **Priority:** nice-to-have (prototype later)

## Counter-evidence sought
Looked for present-day Public workflows that already need message-state introspection; none were documented in the current orchestration and bootstrap surfaces.

## Follow-up questions for next iteration
- Does Relay's parity story carry this state model consistently across SDKs?
- Can Public borrow the documentation pattern without adopting the runtime state machine yet?
- Which state names are essential versus optional for an initial prototype?
