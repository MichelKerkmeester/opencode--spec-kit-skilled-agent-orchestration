---
title: "Deep Research Report — 007-relay-main"
description: "30-iteration research of Agent Relay for system-spec-kit improvement, simplification, refactor, and UX redesign opportunities. 26 actionable findings, 4 rejected."
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

### Phase 3 — UX, Agentic System & Skills Analysis

#### Finding F-018 — Merge the Visible Lifecycle Front Door
- Origin iteration: `iteration-021.md`
- system-spec-kit target: `.opencode/command/spec_kit/README.txt`, `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/complete.md`
- Priority: must-have | adopt now
- Description: Public's current `plan -> implement -> complete` split encodes real lifecycle boundaries, but the visible operator surface is too fragmented. Relay reaches similar outcomes through a smaller front door of slash commands plus natural-language orchestration. Public should keep lifecycle stages internally while merging the primary user-facing entry modes. [SOURCE: .opencode/command/spec_kit/README.txt:43-63] [SOURCE: .opencode/command/spec_kit/README.txt:121-145] [SOURCE: .opencode/command/spec_kit/plan.md:173-221] [SOURCE: .opencode/command/spec_kit/implement.md:173-225] [SOURCE: .opencode/command/spec_kit/complete.md:175-228] [SOURCE: external/docs/plugin-claude-code.md:1-87] [SOURCE: external/packages/sdk/README.md:11-74]

#### Finding F-019 — Add a Unified Context Concierge
- Origin iteration: `iteration-022.md`
- system-spec-kit target: `.opencode/command/spec_kit/resume.md`, `.opencode/command/memory/README.txt`, `.opencode/skill/system-spec-kit/SKILL.md`
- Priority: should-have | adopt now
- Description: Public currently teaches `/spec_kit:resume` and `/memory:*` as parallel systems, with discovery and ownership spread across separate docs. Relay's operator surface instead routes people through a smaller number of entry points while capabilities stay underneath. Public should add one context concierge that can route to resume, search, save, or manage without making the user pre-classify the request. [SOURCE: .opencode/command/spec_kit/resume.md:250-294] [SOURCE: .opencode/command/spec_kit/resume.md:404-423] [SOURCE: .opencode/command/memory/README.txt:58-66] [SOURCE: .opencode/command/memory/README.txt:225-320] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-566] [SOURCE: external/docs/plugin-claude-code.md:27-53] [SOURCE: external/packages/sdk/README.md:31-74]

#### Finding F-020 — Hide CORE + ADDENDUM Template Ceremony from Operators
- Origin iteration: `iteration-023.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/templates/README.md`, `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/references/templates/template_guide.md`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Priority: nice-to-have | prototype later
- Description: The Level 1/2/3+ lifecycle remains a valid governance tool, but the current template architecture, copy instructions, and validator rule names expose too much internal machinery to routine operators. Relay's documentation creates fewer mental branches before work starts. Public should preserve the structure while hiding more of the template taxonomy and validation jargon behind clearer front-door helpers. [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:30-85] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:131-237] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:714-748] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:500-524] [SOURCE: external/docs/introduction.md:2-6]

#### Finding F-021 — Merge Bootstrap, Retrieval, and Continuation into One Visible Story
- Origin iteration: `iteration-024.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/agent/context-prime.md`, `.opencode/agent/context.md`, `.opencode/agent/handover.md`
- Priority: should-have | adopt now
- Description: Public's internal permission model may justify separate bootstrap, retrieval, and continuation agents, but the visible operator story is too split. Relay exposes a smaller number of lifecycle concepts while preserving deeper mechanics underneath. Public should merge the operator-facing narrative for context-prime, context, and handover into one coherent context lifecycle surface. [SOURCE: .opencode/agent/orchestrate.md:169-183] [SOURCE: .opencode/agent/orchestrate.md:408-417] [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context-prime.md:57-66] [SOURCE: .opencode/agent/context.md:25-32] [SOURCE: .opencode/agent/context.md:127-168] [SOURCE: .opencode/agent/handover.md:22-47] [SOURCE: external/packages/sdk-py/README.md:28-83]

#### Finding F-022 — Merge the Visible Code-Skill Family
- Origin iteration: `iteration-026.md`
- system-spec-kit target: `.opencode/skill/sk-code-opencode/`, `.opencode/skill/sk-code-web/`, `.opencode/skill/sk-code-full-stack/`, `.opencode/skill/sk-code-review/`
- Priority: must-have | adopt now
- Description: Public's skill family encodes useful specialization, but the visible coding surface is overly fragmented. Relay packages operator capability as a smaller set of workflow primitives and lets implementation detail live underneath. Public should keep overlays and standards internally while presenting one coding workflow front door instead of several peer `sk-code-*` choices. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:10-48] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:61-68] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:495-505] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:10-15] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:41-60] [SOURCE: .opencode/skill/sk-code-review/SKILL.md:10-12] [SOURCE: .opencode/skill/sk-code-review/SKILL.md:47-68] [SOURCE: external/packages/sdk/src/workflows/README.md:1-27]

#### Finding F-023 — Demote Gate 2 Skill-Advisor Ceremony
- Origin iteration: `iteration-027.md`
- system-spec-kit target: `AGENTS.md`, `CLAUDE.md`, `.opencode/skill/scripts/skill_advisor.py`, skill onboarding docs
- Priority: must-have | adopt now
- Description: Skill routing remains useful, but requiring operators to understand and repeatedly trigger Gate 2 adds unnecessary ceremony. Relay's UX reaches orchestration outcomes with less front-door doctrine. Public should keep routing logic, but make it a default internal behavior or ambiguity fallback rather than a taught mandatory ritual. [SOURCE: AGENTS.md:181-224] [SOURCE: CLAUDE.md:107-170] [SOURCE: .opencode/skill/scripts/skill_advisor.py:6-17] [SOURCE: .opencode/skill/scripts/skill_advisor.py:67-80] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-219] [SOURCE: external/docs/introduction.md:2-6] [SOURCE: external/docs/plugin-claude-code.md:27-53]

#### Finding F-024 — Redesign the Operator Contract Around One Authority
- Origin iteration: `iteration-028.md`
- system-spec-kit target: `AGENTS.md`, `CLAUDE.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- Priority: must-have | adopt now
- Description: Public's operator contract is fragmented across AGENTS, CLAUDE, constitutional gate docs, and hook references, and some rules are inconsistent across those surfaces. Relay presents a lighter operator surface and keeps lower-level mechanics less exposed. Public should redesign this layer so one authoritative contract defines operator behavior and supporting docs elaborate rather than compete. [SOURCE: AGENTS.md:159-224] [SOURCE: AGENTS.md:321-378] [SOURCE: CLAUDE.md:107-170] [SOURCE: CLAUDE.md:293-350] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-68] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:3-16] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:48-54] [SOURCE: external/docs/introduction.md:67-89]

#### Finding F-025 — Redesign the End-to-End Feature Journey Around Lead Mode Plus Escalation
- Origin iteration: `iteration-029.md`
- system-spec-kit target: Gate flow, command front door, spec creation flow, completion flow, memory save flow
- Priority: should-have | adopt now
- Description: Public's current end-to-end journey asks the operator to cross several command and policy boundaries before completion. Relay's workflow builder and plugin surfaces suggest a simpler pattern: one lead mode that drives progress, with explicit escalation only when ambiguity or risk appears. Public should redesign the front door around that principle instead of keeping a command ladder as the default user journey. [SOURCE: AGENTS.md:181-224] [SOURCE: .opencode/command/spec_kit/plan.md:173-221] [SOURCE: .opencode/command/spec_kit/implement.md:173-225] [SOURCE: .opencode/command/spec_kit/complete.md:175-337] [SOURCE: .opencode/command/memory/README.txt:58-66] [SOURCE: external/packages/sdk/src/workflows/README.md:70-121] [SOURCE: external/packages/sdk/src/workflows/builder.ts:134-239]

#### Finding F-026 — Merge Per-Command YAML Assets into a Shared Lifecycle Engine
- Origin iteration: `iteration-030.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/*.yaml`, `.opencode/command/spec_kit/*.md`, deep-loop command internals
- Priority: should-have | prototype later
- Description: Public currently uses many YAML assets to drive adjacent lifecycle commands. Relay shows a different trade-off: one reusable workflow runner with shared state and thin entry shells. Public should keep command-specific intent, but reduce YAML sprawl by extracting a common lifecycle engine that powers plan, implement, complete, and future deep-loop shells. [SOURCE: .opencode/command/spec_kit/README.txt:83-111] [SOURCE: .opencode/command/spec_kit/README.txt:166-183] [SOURCE: .opencode/command/spec_kit/complete.md:311-337] [SOURCE: external/packages/sdk/src/workflows/README.md:125-140] [SOURCE: external/packages/sdk/src/workflows/README.md:539-551] [SOURCE: external/packages/sdk/src/workflows/builder.ts:134-239]

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

### Rejection R-004 — Do Not Replace the LEAF Deep-Loop + Externalized State Model
- Origin iteration: `iteration-025.md`
- Rationale: Relay also persists run and step state; its simplification is about shared workflow machinery, not about hiding all recovery structure in memory. Public should reduce artifact sprawl and improve packaging, but keep the LEAF single-iteration pattern plus explicit externalized state boundary for deep research and deep review. [SOURCE: .opencode/agent/deep-research.md:22-60] [SOURCE: .opencode/agent/deep-review.md:21-57] [SOURCE: external/packages/sdk/src/workflows/README.md:524-551] [SOURCE: external/packages/sdk/src/workflows/builder.ts:224-239] [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:1-7]

## 5. Phase 3 — UX, Agentic System & Skills Analysis
- Command UX:
  - Public currently exposes 8 `spec_kit` commands, 4 `memory` commands, and 15 YAML assets for the lifecycle surface, while Relay reaches similar coordination outcomes with 3 plugin-facing slash commands plus natural-language entry and one shared workflow runner. [SOURCE: .opencode/command/spec_kit/README.txt:43-63] [SOURCE: .opencode/command/memory/README.txt:58-66] [SOURCE: .opencode/command/spec_kit/README.txt:83-111] [SOURCE: external/docs/plugin-claude-code.md:1-87] [SOURCE: external/packages/sdk/src/workflows/README.md:125-140]
  - The strongest Phase 3 command recommendation is not to delete lifecycle stages, but to merge the visible front door and route more of the branching internally. This is `F-018`, supported by `F-019` and `F-026`.
- Template and spec-folder UX:
  - Spec folders remain a strength because Relay does not offer an equivalent governance lifecycle. The friction comes from exposing too much of the internal template architecture, level taxonomy, and validator rule naming up front. [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:30-85] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:714-748] [SOURCE: external/docs/introduction.md:2-6]
  - Phase 3 therefore keeps the Level 1/2/3+ model, but recommends hiding more of the ceremony from normal operators (`F-020`, bounded by `R-002`).
- Sub-agent architecture:
  - Relay proves that a smaller visible lifecycle can sit on top of richer internals. Public's separate `context-prime`, `context`, and `handover` roles may stay internally, but should become one visible context lifecycle story for operators. [SOURCE: .opencode/agent/orchestrate.md:169-183] [SOURCE: .opencode/agent/context.md:127-168] [SOURCE: .opencode/agent/handover.md:22-47] [SOURCE: external/packages/sdk-py/README.md:28-83]
  - The LEAF deep-loop pattern remains valid and should be kept (`R-004`), while command and artifact packaging around it should be simplified.
- Skills system:
  - Public's specialization is useful, but the visible `sk-code-*` family and taught Gate 2 routing impose too much cognitive branching. The recommended move is one visible coding workflow surface, with routing and overlays handled mostly underneath. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:10-48] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:41-60] [SOURCE: .opencode/skill/scripts/skill_advisor.py:67-80] [SOURCE: external/packages/sdk/src/workflows/README.md:1-27]
  - This produces a combined Phase 3 direction of `F-022` plus `F-023`, not wholesale skill removal.
- Automation and integration UX:
  - The biggest Phase 3 structural gap is the operator contract itself. AGENTS, CLAUDE, constitutional rule docs, and hook docs together create a powerful but overly exposed and partly inconsistent front door. [SOURCE: AGENTS.md:181-224] [SOURCE: AGENTS.md:321-378] [SOURCE: CLAUDE.md:129-150] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-68]
  - The system should be redesigned around one authoritative operator contract (`F-024`) that owns policy, while supporting docs explain implementation details instead of restating core doctrine.
- End-to-end workflow friction:
  - A normal Public feature journey currently crosses spec binding, skill routing, command transitions, validation, memory save, and optional handover as separate steps. Relay's workflow tooling suggests a lead-mode pattern with escalation when ambiguity appears, which better matches how operators actually want to work. [SOURCE: .opencode/command/spec_kit/plan.md:173-221] [SOURCE: .opencode/command/spec_kit/complete.md:311-337] [SOURCE: external/packages/sdk/src/workflows/README.md:70-121] [SOURCE: external/packages/sdk/src/workflows/builder.ts:134-239]
  - The best next UX move is therefore a redesign of the end-to-end feature journey (`F-025`) rather than another layer of front-door instructions.

## 6. Updated Priority Queue

### Priority 1 — Operator UX Simplification
1. `F-018` merge the visible lifecycle front door
2. `F-023` demote explicit Gate 2 skill-advisor ceremony
3. `F-019` add a unified context concierge
4. `F-024` redesign the operator contract around one authority

### Priority 2 — Consolidation Work
1. `F-021` merge the visible bootstrap, retrieval, and continuation story
2. `F-022` merge the visible code-skill family
3. `F-026` move per-command YAML assets toward a shared lifecycle engine

### Priority 3 — Keep and Refactor Deep-Loop Internals
1. `F-010` shared deep-loop kernel
2. `F-012` explicit resume/start-from semantics for deep loops
3. `R-004` keep the LEAF plus externalized-state boundary while simplifying artifact packaging

### Priority 4 — Later Runtime and Transport Ideas
1. `F-001` readiness handshake for future live transport
2. `F-003` channel/DM/thread address semantics
3. `F-004` spec/session-scoped future live coordination
4. `F-008` delivery-state and idle-state tracking

## 7. Cross-Phase Implications
- Phase 002 should remain the owner of deterministic orchestration, replay, journals, and enforcement. Relay-inspired work in phase 007 should plug into that control plane, not replace it. [SOURCE: phase-research-prompt.md:21-33] [SOURCE: phase-research-prompt.md:138-147]
- Phase 005 remains the owner of repo/worktree execution patterns. Relay's strongest value here is transport coordination, not filesystem isolation strategy. [SOURCE: phase-research-prompt.md:28-31] [SOURCE: phase-research-prompt.md:138-147]
- Phase 009 memory work should absorb the two-lane-state conclusion carefully: durable memory remains valuable, but runtime continuity should likely become a lighter sibling system rather than more memory complexity.
- The next command/doc packets should combine earlier doc-contract improvements (`F-015`, `F-006`, `F-005`, `F-007`, `F-017`) with the new UX work (`F-018`, `F-019`, `F-023`, `F-024`) instead of treating them as unrelated streams.
- Any lifecycle-engine refactor should respect the architectural boundaries set by `R-003` and `R-004`: shared mechanics yes, generic workflow replacement no, hidden continuity-only recovery no.

## 8. Recommended Next Step
Plan three follow-on packets, in this order:

1. **Operator UX packet**
   - implement `F-018`, `F-019`, `F-023`, and `F-024`
   - merge the front door, add the context concierge, and collapse the operator contract to one authority

2. **Skill and agent consolidation packet**
   - implement `F-021`, `F-022`, and `F-023`
   - merge the visible context/context-prime/handover story and collapse the visible code-skill family

3. **Lifecycle engine packet**
   - implement `F-010`, `F-012`, and `F-026`
   - keep the explicit non-goals up front:
     - no broker replacement (`R-001`)
     - no level-system removal (`R-002`)
     - no generic Relay DSL replacement of specialized deep loops (`R-003`)
     - no replacement of LEAF plus externalized state with hidden continuity (`R-004`)

This sequence puts the highest-friction operator issues first, then consolidates the visible capability surface, and only after that refactors lifecycle machinery under the preserved deep-loop boundaries.
