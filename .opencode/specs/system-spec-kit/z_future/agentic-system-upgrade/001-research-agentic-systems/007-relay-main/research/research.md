---
title: "Deep Research [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/007-relay-main/research]"
description: "30-iteration research of Agent Relay for system-spec-kit improvement, simplification, refactor, and UX redesign opportunities. 26 actionable findings, 4 rejected."
trigger_phrases:
  - "deep"
  - "research"
  - "007"
  - "relay"
importance_tier: "important"
contextType: "research"
---
# Deep Research Report — 007-relay-main

## 1. Executive Summary
- External repo studied: Agent Relay bundled under `external/`; Phase 1 covered adoption patterns, Phase 2 tested refactor/pivot candidates, and Phase 3 compared operator UX, command surfaces, agent roles, skills, and automation ceremony against `system-spec-kit`.
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Total actionable findings: 26
- Must-have: 10 | Should-have: 12 | Nice-to-have: 4 | Rejected: 4
- Phase 2 refactor/pivot verdicts: REFACTOR 3 | PIVOT 1 | SIMPLIFY 4 | KEEP 2
- Phase 3 UX verdicts: SIMPLIFY 2 | ADD 1 | MERGE 4 | KEEP 1 | REDESIGN 2
- Top 5 combined opportunities for system-spec-kit:
  - Collapse the visible lifecycle front door into fewer operator modes while keeping internal phase boundaries.
  - Add one unified context and knowledge front door across resume, search, and save workflows.
  - Merge the visible bootstrap, retrieval, and continuation story instead of teaching separate context roles.
  - Merge the visible code-skill family and demote explicit Gate 2 routing ceremony to an internal/default behavior.
  - Keep LEAF deep loops, but refactor them and adjacent command shells onto a shared lifecycle engine.
- Highest-confidence non-goals:
  - Do not replace Public's Task-tool orchestration with a full Relay broker. [SOURCE: phase-research-prompt.md:21-33] [SOURCE: phase-research-prompt.md:41-51]
  - Do not discard the Level 1/2/3+ spec lifecycle. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-74] [SOURCE: AGENTS.md:233-252]
  - Do not replace LEAF deep-loop plus externalized state with hidden in-memory continuity. [SOURCE: .opencode/agent/deep-research.md:22-60] [SOURCE: .opencode/agent/deep-review.md:21-57]
  - Do not replace specialized deep loops with Relay's full generic workflow DSL. [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:47-64] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:216-285]
- Execution note: CocoIndex semantic search timed out against this repo snapshot during the research process, so the phase relied on targeted file reads and exact line-numbered evidence instead. [SOURCE: phase-research-prompt.md:132-134]

## 2. External Repo Map
- Top-level docs: `README.md`, `ARCHITECTURE.md`, `docs/introduction.md`, `docs/plugin-claude-code.md`
- Transport/runtime surfaces:
  - `packages/sdk/src/relay.ts`
  - `packages/sdk/src/transport.ts`
  - `packages/sdk/src/protocol.ts`
  - `src/main.rs`, `src/routing.rs`, `src/spawner.rs`, `src/replay_buffer.rs`, `src/config.rs`
- Workflow surfaces:
  - `packages/sdk/src/workflows/README.md`
  - `packages/sdk/src/workflows/builder.ts`
  - `packages/sdk/src/workflows/coordinator.ts`
  - `packages/sdk/src/workflows/run.ts`
  - `packages/sdk/src/workflows/cli.ts`
  - `packages/sdk/src/workflows/state.ts`
  - `packages/sdk-py/README.md`
- Documentation/runtime maintenance surfaces:
  - `packages/sdk/src/cli-registry.ts`
  - `package.json`
  - `tests/integration/broker/*.test.ts`
  - `src/cli/bootstrap.test.ts`
- Key repo pattern:

```text
Operator surface
  -> simple modes + verbs (orchestrate / communicate / team / fan-out / pipeline)
    -> reusable workflow and transport primitives
      -> small continuity + replay artifacts
        -> integration tests that prove lived behavior
```

- The external repo stays strongest where Public is currently weakest: transport semantics, lightweight continuity, reusable workflow primitives, and mode-first operator UX. Public stays stronger in spec governance, packet lifecycle, and durable memory quality controls.

## 3. Findings Registry

### Phase 1 — Transport and Coordination Adoption

#### Finding F-001 — Ready-State Handshake Before Messaging
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md` and a future transport module under `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: should-have | prototype later
- Description: Relay separates spawn success from transport readiness through `worker_ready` and `waitForAgentReady()`. Public does not need that split today for ordinary delegation, but any future live coordination surface should reserve the concept early. [SOURCE: external/README.md:34-67] [SOURCE: external/packages/sdk/src/relay.ts:889-940] [SOURCE: external/src/main.rs:3323-3358] [SOURCE: .opencode/agent/orchestrate.md:24-36]

#### Finding F-002 — Add a Shared Event Glossary Across Delegation Surfaces
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- Priority: must-have | adopt now
- Description: Relay's event contract names spawn, ready, output, idle, delivery, and subscription changes explicitly. Public's current delegation docs would become clearer immediately if they shared a common event vocabulary even before any transport runtime exists. [SOURCE: external/packages/sdk/README.md:38-73] [SOURCE: external/packages/sdk/src/relay.ts:349-362] [SOURCE: external/packages/sdk/src/relay.ts:1219-1294] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:124-132] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:81-88] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:198-206]

#### Finding F-003 — Define Address Types: Channel, DM, Thread
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md` and a future transport-routing module under `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: should-have | prototype later
- Description: Relay treats channel broadcast, direct targeting, and thread continuation as different routing problems. Public currently distinguishes direct versus parallel execution, but not conversation scope. [SOURCE: external/docs/plugin-claude-code.md:65-87] [SOURCE: external/packages/sdk/src/protocol.ts:30-41] [SOURCE: external/src/routing.rs:68-220] [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:17-28]

#### Finding F-004 — Scope Future Live Coordination to the Active Spec/Session
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/resume.md`, `.opencode/agent/context-prime.md`, and a future coordination/session module under `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: nice-to-have | prototype later
- Description: Relay's workspace-aware routing suggests a safety principle worth borrowing: future live coordination in Public should default to the active spec/session scope and only widen deliberately. [SOURCE: external/ARCHITECTURE.md:274-283] [SOURCE: external/src/spawner.rs:226-256] [SOURCE: external/src/routing.rs:58-89] [SOURCE: .opencode/command/spec_kit/resume.md:250-260] [SOURCE: .opencode/agent/context-prime.md:118-145]

#### Finding F-005 — Normalize Provider Capability and Transport Docs
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- Priority: must-have | adopt now