---
title: "Deep Research Report — 007-relay-main"
description: "20-iteration research of Agent Relay for system-spec-kit improvement, simplification, and refactor opportunities. 17 actionable findings, 3 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 007-relay-main

## 1. Executive Summary
- External repo studied: Agent Relay bundled under `external/`; focus areas extended in Phase 2 from transport adoption into deeper architecture, simplification, and UX comparisons against `system-spec-kit`.
- Iterations executed: 20 of 20
- Stop reason: max_iterations
- Total actionable findings: 17
- Must-have: 6 | Should-have: 8 | Nice-to-have: 3 | Rejected: 3
- Phase 2 refactor/pivot verdicts: REFACTOR 3 | PIVOT 1 | SIMPLIFY 4 | KEEP 2
- Top 5 combined opportunities for system-spec-kit:
  - Refactor `deep-research` and `deep-review` onto one shared deep-loop kernel.
  - Pivot the memory architecture to separate lightweight continuity from durable semantic memory.
  - Rebalance validation around scenario-first workflow contracts with rules as supporting diagnostics.
  - Replace hand-maintained provider parity docs with a single-source provider registry plus generated shared surfaces.
  - Generate machine-readable markdown mirrors from a canonical documentation source instead of maintaining repeated prose by hand.
- Highest-confidence non-goals:
  - Do not replace Public's Task-tool orchestration with a full Relay broker. [SOURCE: phase-research-prompt.md:21-33] [SOURCE: phase-research-prompt.md:41-51]
  - Do not discard the Level 1/2/3+ spec lifecycle.
  - Do not replace specialized deep loops with Relay's full generic workflow DSL.
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
- Description: Relay's provider-first spawn surface makes transport defaults and constraints explicit. Public already supports multiple providers, but the capability model is still split across separate narratives. [SOURCE: external/packages/sdk/README.md:107-143] [SOURCE: external/packages/sdk/src/client.ts:85-91] [SOURCE: external/packages/sdk/src/client.ts:326-377] [SOURCE: external/packages/sdk/src/relay.ts:434-437] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:62-89] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:60-79] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:57-79]

#### Finding F-006 — Adopt Team / Fan-Out / Pipeline as Public Coordination Shapes
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md`, `.opencode/command/spec_kit/deep-research.md`
- Priority: must-have | adopt now
- Description: Relay exposes three reusable coordination shapes that already map onto Public workflows. Public performs these patterns implicitly; naming them would sharpen prompts, docs, and future automation. [SOURCE: external/README.md:70-85] [SOURCE: external/docs/plugin-claude-code.md:27-53] [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:21-27] [SOURCE: .opencode/command/spec_kit/deep-research.md:117-154]

#### Finding F-007 — Bring Evidence-Based Completion into Deep Research
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: should-have | adopt now
- Description: Relay's completion pipeline explicitly orders deterministic verification, owner decision, and evidence-based completion. Public already values evidence, but the deep-research contract does not yet state this ladder clearly. [SOURCE: external/packages/sdk/src/workflows/README.md:210-254] [SOURCE: external/packages/sdk/src/workflows/README.md:731-740] [SOURCE: external/packages/sdk/src/workflows/builder.ts:325-365] [SOURCE: .opencode/command/spec_kit/deep-research.md:117-154]

#### Finding F-008 — Keep Delivery and Idle States on the Roadmap, Not in the First Cut
- Origin iteration: `iteration-008.md`
- system-spec-kit target: future live-coordination module under `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: nice-to-have | prototype later
- Description: Relay's delivery-state and idle-state model would be useful later, but Public should first adopt simpler wins such as readiness vocabulary, coordination taxonomy, and evidence-based completion. [SOURCE: external/packages/sdk/README.md:146-150] [SOURCE: external/packages/sdk/src/relay.ts:160-160] [SOURCE: external/packages/sdk/src/relay.ts:1166-1228] [SOURCE: external/packages/sdk/src/relay.ts:1296-1342]

#### Finding F-009 — Add a Cross-Surface Parity Rubric
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`, and the broader `system-spec-kit` documentation contract
- Priority: should-have | adopt now
- Description: Relay's TypeScript and Python docs preserve the same mental model across runtimes. Public's three delegation references would benefit from the same parity discipline. [SOURCE: external/packages/sdk/README.md:31-150] [SOURCE: external/packages/sdk-py/README.md:32-159] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:17-22] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:14-20]

### Phase 2 — Refactor, Simplification, Architecture, and UX

#### Finding F-010 — Refactor Deep Research and Deep Review onto One Loop Kernel
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, `.opencode/skill/sk-deep-research/`, `.opencode/skill/sk-deep-review/`
- Priority: should-have | prototype later
- Description: Relay's reusable workflow primitives expose duplicated loop machinery in Public's separate deep-research and deep-review stacks. Public should keep distinct commands and domain contracts, but stop maintaining two parallel lifecycle engines. [SOURCE: external/packages/sdk/src/workflows/README.md:70-77] [SOURCE: external/packages/sdk/src/workflows/README.md:210-254] [SOURCE: external/packages/sdk/src/workflows/README.md:530-537] [SOURCE: external/packages/sdk/src/workflows/builder.ts:94-129] [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:47-65] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-186] [SOURCE: .opencode/command/spec_kit/deep-review.md:162-228] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137-222] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:155-285]

#### Finding F-011 — Pivot to Two-Lane State: Continuity vs Durable Memory
- Origin iteration: `iteration-012.md`
- system-spec-kit target: memory save/index design, deep-loop state packets, handover/continuation surfaces
- Priority: must-have | prototype later
- Description: Relay keeps reconnect continuity, agent continuity, and workspace mapping intentionally lightweight. Public should preserve its durable memory system, but narrow it to durable semantic recall and add a distinct lightweight continuity lane for loop recovery and session resumability. [SOURCE: external/src/replay_buffer.rs:1-14] [SOURCE: external/src/replay_buffer.rs:23-95] [SOURCE: external/packages/sdk/src/transport.ts:5-9] [SOURCE: external/packages/sdk/src/transport.ts:97-159] [SOURCE: external/tests/continuity.rs:40-81] [SOURCE: external/tests/continuity.rs:152-196] [SOURCE: external/packages/sdk/src/relay.ts:440-498] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-125] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-172] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:8-24]

#### Finding F-012 — Add Explicit Resume / Start-From Semantics to Deep Loops
- Origin iteration: `iteration-013.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, deep-loop reducer/runner implementation
- Priority: should-have | adopt now
- Description: Relay makes resume and partial restart explicit through `resume`, `startFrom`, and `previousRunId`. Public already externalizes enough state to support this, but the recovery surface is still implicit and inconsistent. [SOURCE: external/packages/sdk/src/workflows/run.ts:10-30] [SOURCE: external/packages/sdk/src/workflows/run.ts:82-92] [SOURCE: external/packages/sdk/src/workflows/builder.ts:230-239] [SOURCE: external/packages/sdk/src/workflows/README.md:530-537] [SOURCE: external/packages/sdk/src/workflows/cli.ts:327-344] [SOURCE: external/packages/sdk/src/workflows/cli.ts:348-407] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-186] [SOURCE: .opencode/command/spec_kit/deep-review.md:162-228] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:257-285]

#### Finding F-013 — Internalize the Gate Machinery Behind Simpler User Modes
- Origin iteration: `iteration-014.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/agent/orchestrate.md`, command entrypoints that restate gate doctrine
- Priority: should-have | adopt now
- Description: Relay's UX is mode-first and verb-first. Public should preserve its safeguards, but stop teaching Gate 1/2/3 as such a front-door operator model. [SOURCE: external/docs/introduction.md:2-6] [SOURCE: external/docs/introduction.md:67-89] [SOURCE: external/src/cli/bootstrap.test.ts:68-125] [SOURCE: AGENTS.md:159-229] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-69] [SOURCE: .opencode/agent/orchestrate.md:49-60]

#### Finding F-014 — Rebalance Validation Around Scenario-First Contracts
- Origin iteration: `iteration-015.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, memory-quality pipeline, deep-loop verification contracts, command validation strategy
- Priority: must-have | prototype later
- Description: Relay validates what operators actually experience through CLI, workflow, and delivery scenarios. Public's rule-heavy validation remains useful, but it should support a smaller set of first-class end-to-end validation stories. [SOURCE: external/tests/integration/broker/cli-spawn.test.ts:1-20] [SOURCE: external/tests/integration/broker/cli-spawn.test.ts:38-87] [SOURCE: external/tests/integration/broker/cli-spawn.test.ts:271-333] [SOURCE: external/tests/integration/broker/workflow-templates.test.ts:41-104] [SOURCE: external/tests/integration/broker/workflow-templates.test.ts:316-447] [SOURCE: external/src/cli/bootstrap.test.ts:68-125] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:7-18] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-172] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:33-78]

#### Finding F-015 — Create a Single-Source Provider Registry and Generate Shared Surfaces
- Origin iteration: `iteration-016.md`
- system-spec-kit target: the three CLI delegation references plus shared docs/config generation tooling
- Priority: must-have | adopt now
- Description: Phase 1 asked for a provider-capability matrix. Phase 2 adds the structural recommendation: generate that shared surface from a canonical provider registry instead of hand-maintaining three parallel explanations. [SOURCE: external/packages/sdk/src/cli-registry.ts:1-12] [SOURCE: external/packages/sdk/src/cli-registry.ts:18-31] [SOURCE: external/packages/sdk/src/cli-registry.ts:41-49] [SOURCE: external/packages/sdk/src/cli-registry.ts:53-160] [SOURCE: external/package.json:88-145] [SOURCE: external/package.json:147-157] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:62-132] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:60-111] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:57-155]

#### Finding F-016 — Simplify the External Operator Surface to a Few Top-Level Modes
- Origin iteration: `iteration-017.md`
- system-spec-kit target: top-level docs and command surfaces that introduce orchestration, delegation, and packet workflows
- Priority: nice-to-have | adopt now
- Description: Public should keep its specialist agents internally, but compress the front-door mental model so operators first see a few clear task modes rather than the full implementation topology. [SOURCE: external/docs/introduction.md:2-6] [SOURCE: external/docs/introduction.md:67-89] [SOURCE: .opencode/agent/orchestrate.md:91-118] [SOURCE: .opencode/agent/orchestrate.md:152-183] [SOURCE: AGENTS.md:150-155]

#### Finding F-017 — Generate Machine-Readable Markdown Mirrors from One Canonical Source
- Origin iteration: `iteration-020.md`
- system-spec-kit target: command docs, provider delegation references, and the documentation-generation/tooling contract
- Priority: should-have | adopt now
- Description: Relay treats machine-readable markdown as a deliberate output of its documentation system. Public should pilot the same approach for one doc family to reduce copy drift across commands and provider references. [SOURCE: external/docs/introduction.md:91-97] [SOURCE: external/src/cli/bootstrap.test.ts:68-125] [SOURCE: .opencode/command/spec_kit/deep-research.md:7-31] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-247] [SOURCE: .opencode/command/spec_kit/deep-review.md:7-33] [SOURCE: .opencode/command/spec_kit/deep-review.md:162-286] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:12-29]

## 4. Rejected Recommendations

### Rejection R-001 — Do Not Replace Task-Tool Orchestration with a Full Broker Now
- Origin iteration: `iteration-010.md`
- Rationale: Relay is transport-first while phase 002 owns deterministic orchestration, replay, and enforcement. Replacing Public's existing orchestrator with a Relay-style broker would duplicate strengths Public already has. [SOURCE: phase-research-prompt.md:21-33] [SOURCE: phase-research-prompt.md:41-51] [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:95-106]

### Rejection R-002 — Do Not Pivot Away from the Level 1/2/3+ Lifecycle
- Origin iteration: `iteration-018.md`
- Rationale: Relay's simpler UX is a useful presentation model, but it does not prove Public's graduated documentation lifecycle is wrong. The right move is to simplify level exposure, not to remove levels. [SOURCE: external/docs/introduction.md:2-6] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-74] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:173-206] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:300-324] [SOURCE: AGENTS.md:233-252]

### Rejection R-003 — Do Not Replace Specialized Deep Loops with Relay's Full Generic Workflow DSL
- Origin iteration: `iteration-019.md`
- Rationale: A shared loop kernel is desirable, but Relay's broader swarm-workflow engine is more general than Public needs. Public should extract shared mechanics, not replace domain-specific research/review products with a general DSL. [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:47-64] [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:67-164] [SOURCE: external/packages/sdk/src/workflows/state.ts:1-7] [SOURCE: external/packages/sdk/src/workflows/state.ts:42-54] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179-222] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:216-285]

## 5. Refactor / Pivot Recommendations

### Wave A — Adopt Now (Documentation and Command Surface)
- **F-015 / iteration-016**: build a canonical provider registry and generate shared capability surfaces into Codex/Gemini/Copilot docs.
- **F-013 / iteration-014**: keep gate protections, but move more of the gate model behind simpler operator-facing modes and prompts.
- **F-012 / iteration-013**: expose `resume`, `start-from`, and prior-run reuse semantics directly on deep-loop commands.
- **F-017 / iteration-020**: pilot machine-readable markdown mirrors from one canonical doc source.
- Fold in Phase 1 transport-ready doc wins at the same time:
  - **F-006** shared coordination-mode taxonomy
  - **F-005** provider-capability normalization
  - **F-007** evidence-based completion ladder

### Wave B — Architecture Spikes
- **F-010 / iteration-011**: refactor `deep-research` and `deep-review` onto one deep-loop kernel while keeping domain-specific wrappers.
- **F-011 / iteration-012**: pivot to a two-lane model where continuity artifacts are lightweight and durable memory stays curated/indexed.
- **F-014 / iteration-015**: redesign validation around a small scenario-first contract suite with rules as supporting diagnostics.

### Wave C — UX Simplification Without Core Lifecycle Pivots
- **F-016 / iteration-017**: compress the external operator surface into a few top-level modes.
- **R-002 / iteration-018**: keep the level system internally; simplify the explanation, not the lifecycle.

## 6. Updated Priority Queue

### Priority 1 — High-Leverage, Low-Regret Contract Work
1. `F-015` single-source provider registry + generated parity surfaces
2. `F-006` shared coordination taxonomy (`team`, `fan-out`, `pipeline`)
3. `F-005` provider-capability normalization
4. `F-007` explicit evidence-based completion ladder
5. `F-017` machine-readable markdown mirror pilot

### Priority 2 — Recovery and UX Improvements
1. `F-012` explicit resume/start-from semantics for deep loops
2. `F-013` internalize gate machinery behind simpler user modes
3. `F-016` simplify the operator front door

### Priority 3 — Architectural Design Spikes
1. `F-010` shared deep-loop kernel
2. `F-011` continuity lane versus durable-memory lane
3. `F-014` scenario-first validation refactor

### Priority 4 — Roadmap / Later Runtime Work
1. `F-001` readiness handshake for future live transport
2. `F-003` channel/DM/thread address semantics
3. `F-004` spec/session-scoped future live coordination
4. `F-008` delivery-state and idle-state tracking

## 7. Cross-Phase Implications
- Phase 002 should remain the owner of deterministic orchestration, replay, journals, and enforcement. Relay-inspired work in phase 007 should plug into that control plane, not replace it. [SOURCE: phase-research-prompt.md:21-33] [SOURCE: phase-research-prompt.md:138-147]
- Phase 005 remains the owner of repo/worktree execution patterns. Relay's strongest value here is transport coordination, not filesystem isolation strategy. [SOURCE: phase-research-prompt.md:28-31] [SOURCE: phase-research-prompt.md:138-147]
- Phase 009 memory work should absorb the two-lane-state conclusion carefully: durable memory remains valuable, but runtime continuity should likely become a lighter sibling system rather than more memory complexity.
- Command/documentation follow-on packets can safely adopt the doc-contract improvements (`F-015`, `F-006`, `F-005`, `F-007`, `F-017`) before any runtime transport experiment exists.

## 8. Recommended Next Step
Plan two follow-on packets, in this order:

1. **Doc and command contract wave**
   - implement `F-015`, `F-006`, `F-005`, `F-007`, and a small `F-017` mirror pilot
   - keep scope to docs, shared metadata, and command/help surfaces
   - explicitly simplify the operator-facing narrative per `F-013` and `F-016`

2. **Architecture spike wave**
   - design `F-010`, `F-011`, and `F-014`
   - define non-goals up front:
     - no broker replacement (`R-001`)
     - no level-system removal (`R-002`)
     - no generic Relay DSL replacement of specialized deep loops (`R-003`)

This sequence gives Public the highest-value clarity and maintainability wins first, while reserving the bigger refactors for targeted design packets rather than ad hoc churn.
