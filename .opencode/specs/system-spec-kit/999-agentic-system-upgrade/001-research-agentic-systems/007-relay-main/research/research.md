---
title: "Deep Research Report — 007-relay-main"
description: "10-iteration research of Agent Relay for system-spec-kit improvement opportunities. 9 actionable findings, 1 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 007-relay-main

## 1. Executive Summary
- External repo: Agent Relay bundled under `external/`; purpose: realtime agent-to-agent messaging, multi-provider spawning, broker-mediated delivery, and plugin-driven coordination. Public URL was not verified from the bundled snapshot.
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 9
- Must-have: 3 | Should-have: 4 | Nice-to-have: 2 | Rejected: 1
- Top 3 adoption opportunities for system-spec-kit:
  - Adopt a shared coordination-mode taxonomy (`team`, `fan-out`, `pipeline`) across orchestration docs.
  - Normalize provider capability and transport expectations across `cli-codex`, `cli-gemini`, and `cli-copilot`.
  - Add an explicit completion-decision ladder for deep-research workflows: verification, owner decision, then evidence.
- Execution note: CocoIndex semantic search timed out on this repo snapshot, so this phase used targeted `rg` plus line-numbered file reads instead. [SOURCE: phase-research-prompt.md:132-134]

## 2. External Repo Map
- Top-level docs: `README.md`, `ARCHITECTURE.md`, `docs/plugin-claude-code.md`, `A2A_TRANSPORT_SPEC.md`
- SDK surfaces:
  - TypeScript: `packages/sdk/README.md`, `packages/sdk/src/client.ts`, `packages/sdk/src/relay.ts`, `packages/sdk/src/protocol.ts`
  - Python: `packages/sdk-py/README.md`
  - Workflow engine: `packages/sdk/src/workflows/README.md`, `builder.ts`, `coordinator.ts`
- Broker/runtime surfaces: `src/main.rs`, `src/routing.rs`, `src/spawner.rs`, `src/pty.rs`
- Key architectural pattern:

```text
Caller
  -> AgentRelay / AgentRelayClient
    -> broker startup + connect
      -> provider-specific spawn
        -> worker_ready
          -> sendMessage / channel post / DM / thread reply
            -> routing plan + workspace filter
              -> inbound relay event
                -> SDK callback / hook
```

- The repo is transport-first. It distinguishes PTY/headless runtime, workspace isolation, channel membership, DMs, thread replies, and plugin command modes rather than acting as a full repo-aware orchestrator. [SOURCE: external/ARCHITECTURE.md:274-309] [SOURCE: external/docs/plugin-claude-code.md:65-87]

## 3. Findings Registry

### Finding F-001 — Ready-State Handshake Before Messaging
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md` and a future transport module under `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: should-have | prototype later
- Description: Relay separates "spawned" from "message-safe" via `worker_ready` and `waitForAgentReady()`. Public's current Task-tool orchestration has no need for that split today, but any future live coordination should reserve the concept up front. [SOURCE: external/README.md:34-67] [SOURCE: external/packages/sdk/src/relay.ts:889-940] [SOURCE: external/src/main.rs:3323-3358] [SOURCE: .opencode/agent/orchestrate.md:24-36]

### Finding F-002 — Add a Shared Event Glossary Across Delegation Surfaces
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- Priority: must-have | adopt now
- Description: Relay documents and implements a rich event contract for message receipt, spawn/release, ready, output, idle, and channel changes. Public's delegation docs currently stop at conductor/executor plus output validation. A shared event glossary would make the current docs clearer now and future transport work less fragmented later. [SOURCE: external/packages/sdk/README.md:38-73] [SOURCE: external/packages/sdk/src/relay.ts:349-362] [SOURCE: external/packages/sdk/src/relay.ts:1219-1294] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:124-132] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:81-88] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:198-206]

### Finding F-003 — Define Address Types: Channel, DM, Thread
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md` and a future transport-routing module under `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: should-have | prototype later
- Description: Relay treats broadcast channels, direct targets, and thread replies as distinct routing cases. Public's docs currently distinguish direct execution from parallelization, but not conversation scope. If live coordination is added, the address model should arrive before broker complexity. [SOURCE: external/docs/plugin-claude-code.md:65-87] [SOURCE: external/packages/sdk/src/protocol.ts:30-41] [SOURCE: external/src/routing.rs:68-220] [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:17-28]

### Finding F-004 — Scope Future Live Coordination to the Active Spec/Session
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/resume.md`, `.opencode/agent/context-prime.md`, and a future coordination/session module under `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: nice-to-have | prototype later
- Description: Relay's workspace-aware routing and worker env injection show a safety pattern worth reusing: future live coordination in Public should default to the active spec/session scope and only widen deliberately. Public does not need Relay's exact workspace implementation, but it can borrow the containment principle. [SOURCE: external/ARCHITECTURE.md:274-283] [SOURCE: external/src/spawner.rs:226-256] [SOURCE: external/src/routing.rs:58-89] [SOURCE: .opencode/command/spec_kit/resume.md:250-260] [SOURCE: .opencode/agent/context-prime.md:118-145]

### Finding F-005 — Normalize Provider Capability and Transport Docs
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- Priority: must-have | adopt now
- Description: Relay's provider-first spawn surface makes transport defaults and constraints explicit. Public already has multiple providers, but the capability model is split across separate narratives. A shared provider-capability matrix would immediately improve clarity and reduce drift. [SOURCE: external/packages/sdk/README.md:107-143] [SOURCE: external/packages/sdk/src/client.ts:85-91] [SOURCE: external/packages/sdk/src/client.ts:326-377] [SOURCE: external/packages/sdk/src/relay.ts:434-437] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:62-89] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:60-79] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:57-79]

### Finding F-006 — Adopt Team / Fan-Out / Pipeline as Public Coordination Shapes
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md`, `.opencode/command/spec_kit/deep-research.md`
- Priority: must-have | adopt now
- Description: Relay exposes three reusable coordination shapes that map directly onto Public's current workflows: team-led decomposition, parallel fan-out, and sequential pipeline. Public already performs these patterns implicitly; naming them would improve prompts, docs, and future automation. [SOURCE: external/README.md:70-85] [SOURCE: external/docs/plugin-claude-code.md:27-53] [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:21-27] [SOURCE: .opencode/command/spec_kit/deep-research.md:117-154]

### Finding F-007 — Bring Evidence-Based Completion into Deep Research
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: should-have | adopt now
- Description: Relay's workflow runner explicitly orders completion signals as verification, owner decision, then evidence. Public's deep-research loop already values evidence, but the command contract does not yet document this ladder. Adding it would strengthen research closeout without requiring a transport runtime. [SOURCE: external/packages/sdk/src/workflows/README.md:210-254] [SOURCE: external/packages/sdk/src/workflows/README.md:731-740] [SOURCE: external/packages/sdk/src/workflows/builder.ts:325-365] [SOURCE: .opencode/command/spec_kit/deep-research.md:117-154]

### Finding F-008 — Keep Delivery and Idle States on the Roadmap, Not in the First Cut
- Origin iteration: `iteration-008.md`
- system-spec-kit target: future live-coordination module under `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: nice-to-have | prototype later
- Description: Relay tracks delivery states (`queued`, `injected`, `active`, `verified`, `failed`) and idle status, which would be valuable if Public adopts live messaging later. The pattern is useful, but it should follow simpler wins like taxonomy, readiness vocabulary, and evidence rules. [SOURCE: external/packages/sdk/README.md:146-150] [SOURCE: external/packages/sdk/src/relay.ts:160-160] [SOURCE: external/packages/sdk/src/relay.ts:1166-1228] [SOURCE: external/packages/sdk/src/relay.ts:1296-1342]

### Finding F-009 — Add a Cross-Surface Parity Rubric
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`, and the broader `system-spec-kit` documentation contract
- Priority: should-have | adopt now
- Description: Relay's TypeScript and Python docs keep the same mental model across runtimes even when the syntax differs. Public's three delegation references could benefit from the same parity discipline so conductors do not have to relearn each surface independently. [SOURCE: external/packages/sdk/README.md:31-150] [SOURCE: external/packages/sdk-py/README.md:32-159] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:17-22] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:14-20]

## 4. Rejected Recommendations

### Rejection R-001 — Do Not Replace Task-Tool Orchestration with a Full Broker Now
- Origin iteration: `iteration-010.md`
- Rationale: The phase brief explicitly assigns deterministic orchestration to phase 002 and positions Relay as a transport-first system. Public's orchestrator is already the single accountable control plane with strong nesting and safety rules. Replacing it with a broker would duplicate existing strengths and collapse phase boundaries. [SOURCE: phase-research-prompt.md:21-33] [SOURCE: phase-research-prompt.md:41-51] [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:95-106]

## 5. Cross-Phase Implications
- Phase 002 should remain the owner of deterministic replay, journals, enforcement, and any "system of record" orchestration logic. Relay-style transport ideas should plug into that control plane, not replace it. [SOURCE: phase-research-prompt.md:21-33] [SOURCE: phase-research-prompt.md:138-147]
- Phase 005 remains the right place for worktree-heavy execution and repo-isolation patterns. Relay's value here is transport between agents, not filesystem execution strategy. [SOURCE: phase-research-prompt.md:28-31] [SOURCE: phase-research-prompt.md:138-147]
- The safest first implementation wave is documentation-contract work in current files, followed by a small transport prototype packet only if the team still wants live coordination after the doc-level improvements land.

## 6. Recommended Next Step
Plan a follow-on packet for **Finding F-006 plus F-005 plus F-007** as one documentation-contract wave:
- add a shared coordination taxonomy (`team`, `fan-out`, `pipeline`) to `.opencode/agent/orchestrate.md`, `parallel_dispatch_config.md`, and `deep-research.md`
- add a shared provider-capability matrix to the three CLI delegation references
- add an explicit completion ladder to `deep-research.md`

This sequence is the best first move because it is high leverage, low-risk, phase-007-correct, and useful even if no transport runtime is built.
