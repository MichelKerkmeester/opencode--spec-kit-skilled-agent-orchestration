---
title: "Deep Research Report — 001-agent-lightning-main"
description: "30-iteration research of Agent Lightning for system-spec-kit improvement, including architecture, UX, agent-system, command, skill, and workflow recommendations. 24 actionable findings, 6 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 001-agent-lightning-main

## 1. Executive Summary
- External repo: Agent Lightning, a Microsoft Research framework that keeps agent runtimes in place while optimizing them through tracing, stores, algorithms, tutorials, and runnable examples rather than through a large operator-governance surface. [SOURCE: external/README.md:20-23] [SOURCE: external/README.md:63-67]
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Combined actionable findings: 24
- Combined totals: Must-have 6 | Should-have 15 | Nice-to-have 3 | Rejected 6
- Phase 3 totals: Must-have 3 | Should-have 5 | Nice-to-have 1 | Rejected 1
- Phase 3 UX verdicts: SIMPLIFY 2 | ADD 1 | MERGE 3 | KEEP 2 | REDESIGN 2
- Highest-confidence next moves after Phase 3:
  - Redesign the lifecycle front door around a guided default flow plus oneclick-style presets, instead of expecting most users to reason explicitly about `plan`, `implement`, and `complete`. [SOURCE: .opencode/command/spec_kit/plan.md:31-44] [SOURCE: .opencode/command/spec_kit/complete.md:32-45] [SOURCE: external/examples/tinker/hello.py:22-29] [SOURCE: external/examples/tinker/hello.py:154-185]
  - Merge everyday memory UX into lifecycle commands so `resume`, `complete`, and `handover` own routine context behavior while `/memory:*` stays advanced. [SOURCE: .opencode/command/memory/search.md:53-106] [SOURCE: .opencode/command/memory/manage.md:33-65] [SOURCE: .opencode/command/spec_kit/resume.md:258-304]
  - Collapse named agents and overlapping skills into capability bundles, then make Gate 2 routing largely implicit. [SOURCE: .opencode/agent/orchestrate.md:97-106] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:15-40] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:15-40] [SOURCE: AGENTS.md:175-179]
  - Compress the operator contract into a slim top-level workflow guide and move hook/runtime detail into appendix-grade docs. [SOURCE: CLAUDE.md:109-168] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:1-50] [SOURCE: external/AGENTS.md:3-16]

Phase 1 established that Agent Lightning offers real value at the RL-specific layer: richer evaluator payloads, stronger loop metrics, better adapter boundaries, and useful attempt-state vocabulary. Phase 2 widened the question from "what should Public adopt?" to "what parts of Public are overbuilt, misfactored, or aimed at the wrong UX?" Phase 3 narrowed that further to the operator-facing system itself: commands, template levels, skills, agent roles, gate machinery, hook surfaces, and end-to-end workflow friction.

The synthesis outcome is not a product pivot toward Agent Lightning's runtime model. It is a UX and topology simplification plan for `system-spec-kit`. Keep the mission-specific core: spec folders, file-first memory, explicit scope binding, packet-local loop state, and validator-backed governance. Simplify the operator-visible edges: too many lifecycle commands, too many agent and skill identities, too much exposed routing ceremony, too much duplicated master-doc and hook detail, and too little quickstart guidance.

This phase again attempted CocoIndex first for broader semantic discovery, but both MCP and direct `ccc` searches timed out on the operator-surface queries in this checkout. The fallback was line-numbered direct reads plus exact search. That was sufficient because the Phase 3 questions centered on command contracts, role topology, docs structure, and workflow presentation rather than on hidden implementation branches.

## 2. Research Expansion In Phase 2

Phase 2 intentionally moved beyond the Phase 1 adoption lens. The expanded research focused on:
- Refactor questions about where `system-spec-kit` is overcomplicated or misfactored
- Pivot questions about whether Gate 1/2/3, Level 1/2/3+, and the command/tool surface are the right product shape
- Simplification questions about user-visible ceremony, role taxonomy, and capability sprawl
- Architecture questions about deep-loop runtime state, validator structure, and memory boundaries
- UX questions about documentation navigation and the difference between internal authoring models and public/operator-facing surfaces

The external signals that mattered most in Phase 2 were:
- Compact public entrypoints
- Audience-based documentation
- Standard-tool validation
- Explicit runtime readiness and error handling
- Optional capability grouping
- The absence of repo-local governance machinery equivalent to Public's packets, constitutional memory, and conversational gates

## 3. Phase 3 — UX, Agentic System & Skills Analysis

Phase 3 covered all six mandated angles and converted the comparative work into operator-surface guidance:
- **Command UX (021-023):** Agent Lightning's smaller feel comes from tutorials, examples, and quickstart paths more than from the literal existence of a single CLI. Public should reject a single-binary pivot, but it should redesign the lifecycle front door, demote internal YAML/lifecycle detail, and merge everyday memory behavior into lifecycle commands. [SOURCE: external/docs/reference/cli.md:15-26] [SOURCE: external/examples/README.md:1-18] [SOURCE: .opencode/command/spec_kit/plan.md:13-17] [SOURCE: .opencode/command/spec_kit/complete.md:13-17] [SOURCE: .opencode/command/memory/search.md:53-106]
- **Template and spec-folder UX (024):** The Level 1/2/3+ model is still useful for authors and validators, but it is too literal as a first-contact UX. Public should keep the structure internally and simplify how it is explained and how validator output is phrased. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:15-24] [SOURCE: .opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md:15-39] [SOURCE: external/docs/index.md:14-19]
- **Sub-agent architecture (025-026):** Public has too many named first-class roles, but its packet-local append-only state model for deep research and deep review remains strong. Merge the role topology, not the loop-state architecture. [SOURCE: .opencode/agent/orchestrate.md:97-106] [SOURCE: .opencode/agent/context.md:27-31] [SOURCE: .opencode/agent/deep-research.md:53-57] [SOURCE: .opencode/agent/deep-review.md:45-68]
- **Skills system (027-028):** The default routing surface is too fragmented across overlapping code skills and specialist meta-skills. Keep the expertise, but package it as fewer default capability packs and make Gate 2 routing mostly implicit. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:15-40] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:15-43] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:15-40] [SOURCE: AGENTS.md:175-179]
- **Automation and integration UX (029):** Public's runtime sophistication is real, but too much of its hook, gate, and fallback machinery is exposed in the operator contract. Slim the top layer and keep hook/runtime detail as appendix material. [SOURCE: CLAUDE.md:109-168] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:736-770] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:1-50]
- **End-to-end workflow friction (030):** Agent Lightning reaches a productive path faster through install docs, examples, and oneclick flows. Public should add safe presets for common jobs while keeping the full advanced matrix available. [SOURCE: external/README.md:31-45] [SOURCE: external/docs/index.md:14-19] [SOURCE: external/examples/tinker/hello.py:22-29] [SOURCE: external/examples/tinker/hello.py:154-185]

The most important Phase 3 conclusion is that Public's complexity problem is largely one of exposure, not underlying mission. The architecture already contains strong safety and continuity behaviors. The next wave should focus on hiding more of that machinery behind guided defaults, presets, bundles, and cleaner docs boundaries.

## 4. External Repo Map

### Structure
- `agentlightning/` — adapters, execution stack, training loop, tracer, reward logic, store, utilities, and CLI surfaces [SOURCE: external/AGENTS.md:3-9]
- `docs/` — task-oriented docs organized as quickstart, how-to, deep dive, and references [SOURCE: external/docs/index.md:14-19]
- `examples/` — runnable examples with Included Files sections and CI-backed catalog coverage [SOURCE: external/examples/README.md:1-18] [SOURCE: external/examples/claude_code/README.md:33-47]
- `tests/` — mirrored runtime coverage with markers and real-object preference [SOURCE: external/AGENTS.md:27-31]

### Core Architecture
- Agent Lightning keeps agents in their native runtime and captures execution through tracer or emit helpers. [SOURCE: external/README.md:20-23]
- `LightningStore` coordinates rollout lifecycle, attempts, spans, and resources. [SOURCE: external/README.md:63-67]
- Adapters bridge raw traces into downstream payloads rather than coupling algorithms directly to raw spans. [SOURCE: external/docs/how-to/train-first-agent.md:149-187]
- The public CLI stays small even though the runtime is broad. [SOURCE: external/pyproject.toml:50-51] [SOURCE: external/docs/reference/cli.md:15-26]

### Public Comparison Map
- `AGENTS.md` — mandatory gates, spec-folder binding, workflow matrix, and agent routing
- `.opencode/agent/orchestrate.md` — named-agent taxonomy, delegation rules, and depth constraints
- `.opencode/agent/deep-research.md` — iteration contract, JSONL state model, and reducer ownership
- `.opencode/command/spec_kit/deep-research.md` — loop manager setup, YAML handoff, memory integration, and error handling
- `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` — Level 1/2/3+ lifecycle and phase overlay
- `.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md` — structural validator contract
- `.opencode/skill/system-spec-kit/references/config/hook_system.md` — hook lifecycle and fallback surfaces

## 5. Findings Registry — Phase 1

### Finding F-001 — Backend-Agnostic Tracer Contract
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Action: prototype later
- Description: Agent Lightning demonstrates a narrow trace seam that could eventually wrap existing Public workflows without rewriting prompt contracts. [SOURCE: external/agentlightning/tracer/base.py:27-39] [SOURCE: .opencode/agent/orchestrate.md:24-36]

### Finding F-002 — Attempt Lifecycle For Long-Running Loops
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: should-have
- Action: prototype later
- Description: Public should borrow a smaller execution-state vocabulary from Agent Lightning's attempt lifecycle rather than its full store/control plane. [SOURCE: external/docs/deep-dive/store.md:22-72] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-155]

### Finding F-003 — Structured Evaluator Payloads
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- Priority: should-have
- Action: prototype later
- Description: Reward-as-span patterns justify an optional structured evaluator payload that can later be reduced into current confidence and validation machinery. [SOURCE: external/agentlightning/emitter/reward.py:148-210] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297-316]

### Finding F-004 — Reducer Adapter Boundary
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Action: prototype later
- Description: Public should formalize a stable normalization seam between raw deep-loop artifacts and reducer-owned outputs. [SOURCE: external/agentlightning/adapter/base.py:13-20] [SOURCE: .opencode/agent/deep-research.md:159-165]

### Finding F-005 — Component Registry As Future Guardrail
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: nice-to-have
- Action: prototype later
- Description: A small component registry becomes useful only if Public grows multiple loop backends or evaluator implementations. [SOURCE: external/agentlightning/trainer/trainer.py:36-58] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:64-89]

### Finding F-006 — Stable Agent-Role Labeling For Targeted Evaluation
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Action: prototype later
- Description: Public should project stable delegated-role labels into machine-owned artifacts if it wants future targeted evaluation without new orchestration machinery. [SOURCE: external/agentlightning/adapter/triplet.py:317-359] [SOURCE: .opencode/agent/orchestrate.md:95-117]

### Finding F-008 — Richer Loop Metrics And Dashboards
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: must-have
- Action: adopt now
- Description: Operational metrics such as liveness, source diversity, blocked approaches, and duration are the highest-confidence, lowest-risk adoption from this repo. [SOURCE: external/agentlightning/store/base.py:75-101] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:59-112]

## 6. Findings Registry — Phase 2

### Finding F-009 — Smaller Operator Front Door
- Origin iteration: `iteration-011.md`
- system-spec-kit target: operator-facing command/docs surface
- Priority: should-have
- Action: simplify
- Description: Public should stop exposing so much internal topology directly to operators. A smaller front door plus progressive disclosure would better match the external repo's UX strengths. [SOURCE: external/agentlightning/cli/__init__.py:12-31] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:95-140]

### Finding F-010 — Composable Validation Architecture
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `scripts/spec/validate.sh`
- Priority: must-have
- Action: refactor
- Description: Keep strict validation, but decompose it into explicit validator categories behind a compatibility wrapper instead of continuing to centralize so much behavior in one script. [SOURCE: external/AGENTS.md:11-16] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:611-633]

### Finding F-011 — Deep-Loop Runtime State Machine
- Origin iteration: `iteration-013.md`
- system-spec-kit target: deep-loop runtime and reducer state
- Priority: should-have
- Action: refactor
- Description: Public should add explicit readiness, blocked, recovery, and finalization state to deep-loop runtime coordination, not just historical JSONL summaries. [SOURCE: external/agentlightning/utils/server_launcher.py:73-84] [SOURCE: .opencode/agent/deep-research.md:167-200]

### Finding F-012 — Gate 1/2 Should Become Runtime Defaults
- Origin iteration: `iteration-014.md`
- system-spec-kit target: gate model and runtime enforcement
- Priority: must-have
- Action: pivot
- Description: Keep Gate 3 explicit because it binds scope and documentation, but move Gate 1 and routine Gate 2 behavior behind runtime enforcement so operators see decisions, not ceremonies. [SOURCE: external/AGENTS.md:11-16] [SOURCE: AGENTS.md:159-186]

### Finding F-013 — Separate Authoring Levels From Reader Navigation
- Origin iteration: `iteration-015.md`
- system-spec-kit target: template/publishing architecture
- Priority: nice-to-have
- Action: keep current internal model, add public docs layer
- Description: Public should keep Level 1/2/3+ for authoring and coordination, but publish operator-facing guidance in audience-based categories like quickstart/how-to/reference. [SOURCE: external/docs/index.md:14-19] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73]

### Finding F-014 — Simplify Agent Architecture Around Capabilities
- Origin iteration: `iteration-017.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Action: simplify
- Description: Public's named-agent taxonomy is starting to encode workflow history as permanent topology; it should be rationalized around a smaller set of capability classes. [SOURCE: external/AGENTS.md:3-9] [SOURCE: .opencode/agent/orchestrate.md:97-106]

### Finding F-015 — Capability Profiles For Tool And Command Exposure
- Origin iteration: `iteration-018.md`
- system-spec-kit target: command/tool exposure model
- Priority: should-have
- Action: refactor
- Description: The system should define clearer `core` versus advanced capability profiles so users do not need to hold the whole 43-tool surface in mind by default. [SOURCE: external/pyproject.toml:30-49] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:95-140]

### Finding F-016 — Keep Core Governance, Simplify The Edges
- Origin iteration: `iteration-020.md`
- system-spec-kit target: overall product direction
- Priority: should-have
- Action: keep core architecture, simplify edges
- Description: Agent Lightning validates that Public's mission is different enough to justify spec folders, file-first memory, and explicit scope binding. The right move is selective simplification, not wholesale imitation. [SOURCE: external/AGENTS.md:3-16] [SOURCE: AGENTS.md:159-186]

## 7. Findings Registry — Phase 3

### Finding F-017 — Redesign Lifecycle Front Door
- Origin iteration: `iteration-022.md`
- system-spec-kit target: `.opencode/command/spec_kit/{plan,implement,complete}.md` and YAML workflow ownership model
- Priority: must-have
- Action: redesign
- Description: Public should stop making most operators reason explicitly about `plan`, `implement`, and `complete` as separate first-class states. Keep the internals, but expose one primary guided flow with advanced variants. [SOURCE: .opencode/command/spec_kit/plan.md:13-17] [SOURCE: .opencode/command/spec_kit/complete.md:13-17] [SOURCE: external/docs/how-to/train-first-agent.md:181-187] [SOURCE: external/examples/tinker/hello.py:22-29]

### Finding F-018 — Merge Everyday Memory UX Into Lifecycle Paths
- Origin iteration: `iteration-023.md`
- system-spec-kit target: `/memory:*` versus `/spec_kit:*` operator surface
- Priority: should-have
- Action: merge
- Description: Routine memory behavior should surface through `resume`, `complete`, `handover`, and research flows, while `/memory:*` remains the advanced retrieval, admin, and governance layer. [SOURCE: .opencode/command/memory/search.md:53-106] [SOURCE: .opencode/command/memory/manage.md:33-65] [SOURCE: .opencode/command/spec_kit/resume.md:258-304]

### Finding F-019 — Keep Levels Internal, Simplify Validation UX
- Origin iteration: `iteration-024.md`
- system-spec-kit target: template and validator UX layer
- Priority: nice-to-have
- Action: simplify
- Description: The level system and strict validator contracts are still valuable, but their language and exposure should be simplified for operators who are not authoring templates. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:15-24] [SOURCE: .opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md:15-39] [SOURCE: external/docs/index.md:14-19]

### Finding F-020 — Capability Bundles Over Named Agent Sprawl
- Origin iteration: `iteration-025.md`
- system-spec-kit target: agent taxonomy and orchestrator routing model
- Priority: must-have
- Action: merge
- Description: Most named agents should become capability bundles or presets layered over a smaller core taxonomy, with only genuinely exclusive roles remaining first-class. [SOURCE: .opencode/agent/orchestrate.md:97-106] [SOURCE: .opencode/agent/context.md:27-31] [SOURCE: external/AGENTS.md:3-9]

### Finding F-021 — Keep Externalized Loop State
- Origin iteration: `iteration-026.md`
- system-spec-kit target: deep-loop architecture
- Priority: should-have
- Action: keep
- Description: Public should keep packet-local JSONL and iteration artifacts for deep research and deep review. The simplification opportunity is around surrounding session roles, not around the loop-state model itself. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/agent/deep-research.md:53-57] [SOURCE: .opencode/agent/deep-review.md:45-68] [SOURCE: external/examples/claude_code/README.md:108-112]

### Finding F-022 — Consolidate Skills Into Capability Packs
- Origin iteration: `iteration-027.md`
- system-spec-kit target: skill packaging and routing surface
- Priority: should-have
- Action: merge
- Description: Public should keep its expertise, but package the default skill surface into fewer capability packs and push niche meta-skills into explicit opt-in territory. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:15-40] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:15-43] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:15-40] [SOURCE: external/examples/README.md:1-18]

### Finding F-023 — Make Gate 2 Skill Routing Implicit
- Origin iteration: `iteration-028.md`
- system-spec-kit target: Gate 2 and skill-routing UX
- Priority: must-have
- Action: simplify
- Description: Skill routing should remain policy, but become mostly invisible. Surface it only when routing is ambiguous, conflicting, or user-overridden. [SOURCE: AGENTS.md:175-179] [SOURCE: CLAUDE.md:123-130] [SOURCE: .opencode/skill/scripts/skill_advisor.py:8-10] [SOURCE: .opencode/skill/scripts/skill_advisor.py:1252-1253]

### Finding F-024 — Compress The Operator Contract
- Origin iteration: `iteration-029.md`
- system-spec-kit target: `CLAUDE.md`, `AGENTS.md`, constitutional summaries, and hook-doc boundary
- Priority: should-have
- Action: redesign
- Description: Public's top-level operator contract should be much slimmer, while hook lifecycles, runtime fallback details, and duplicated gate material move to appendix-grade docs. [SOURCE: CLAUDE.md:109-168] [SOURCE: AGENTS.md:161-222] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:736-770] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:1-50]

### Finding F-025 — Add Guided Oneclick Workflow Presets
- Origin iteration: `iteration-030.md`
- system-spec-kit target: top-level workflow entrypoints and quickstart docs
- Priority: should-have
- Action: add
- Description: Public should add preset-driven starts for common jobs so routine work begins with safe defaults and only escalates into the full advanced matrix when needed. [SOURCE: .opencode/command/spec_kit/plan.md:31-44] [SOURCE: .opencode/command/spec_kit/complete.md:32-45] [SOURCE: external/README.md:31-45] [SOURCE: external/examples/tinker/hello.py:154-185]

## 8. Rejected Recommendations

### Rejection R-001 — Merge Execution Wrappers Into The Existing Hook System
- Origin iteration: `iteration-007.md`
- Rationale: execution observability and session-context hooks are different layers and should remain separate. [SOURCE: external/examples/claude_code/README.md:5-12] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:3-6]

### Rejection R-002 — Store-Backed Resource Snapshots For Templates
- Origin iteration: `iteration-009.md`
- Rationale: Public's templates are canonical documentation contracts, not tunable runtime resource snapshots. [SOURCE: external/agentlightning/types/resources.py:146-204] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:27-34]

### Rejection R-003 — Generic Loop-Architecture Adoption In This Phase
- Origin iteration: `iteration-010.md`
- Rationale: generic multi-agent loop redesign belongs with phase 005, not this RL-specific research packet. [SOURCE: external/docs/deep-dive/birds-eye-view.md:368-372] [SOURCE: .opencode/agent/orchestrate.md:24-36]

### Rejection R-004 — Store-Centric Memory Pivot
- Origin iteration: `iteration-016.md`
- Rationale: Public's file-first memory architecture remains better suited to auditability and spec-folder-local context. [SOURCE: external/agentlightning/store/base.py:104-124] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27]

### Rejection R-005 — Reflective CLI Config For Core Workflows
- Origin iteration: `iteration-019.md`
- Rationale: Agent Lightning's own caveats show that reflective config generation is too brittle for high-governance operator commands. [SOURCE: external/agentlightning/config.py:3-7] [SOURCE: external/tests/test_config.py:5-10]

### Rejection R-006 — Replace Slash Commands With A Single Binary Front Door
- Origin iteration: `iteration-021.md`
- Rationale: Public's problem is discovery, not transport. A single binary would not solve the real lifecycle, memory, and governance friction. [SOURCE: external/pyproject.toml:50-51] [SOURCE: external/docs/reference/cli.md:15-26] [SOURCE: .opencode/command/spec_kit/plan.md:2-4] [SOURCE: .opencode/command/memory/search.md:2-4]

## 9. Recommendation Matrix

| Recommendation | Finding | Verdict | Priority | Why It Matters |
|---|---|---|---|---|
| Add richer loop metrics and dashboard signals | F-008 | ADD | must-have | Best low-risk adoption from the external repo; improves every later loop refactor |
| Redesign the lifecycle front door | F-017 | REDESIGN | must-have | Most operators should start one guided flow, not choose among multiple lifecycle contracts |
| Merge everyday memory UX into lifecycle commands | F-018 | MERGE | should-have | Keeps memory power while removing the sense of a second parallel product |
| Simplify level and validator language | F-019 | SIMPLIFY | nice-to-have | Keeps governance but reduces cognitive load and validator hostility |
| Collapse named agents into capability bundles | F-020 | MERGE | must-have | Shrinks orchestration topology and makes the system easier to explain |
| Keep externalized deep-loop packet state | F-021 | KEEP | should-have | Preserves append-only auditability and packet-local iteration history |
| Consolidate skills into capability packs | F-022 | MERGE | should-have | Smaller default routing surface with optional specialist add-ons |
| Make Gate 2 routing implicit | F-023 | SIMPLIFY | must-have | Preserves specialized guidance without forcing routing ceremony into the user flow |
| Compress the operator contract and move hook detail outward | F-024 | REDESIGN | should-have | Lets hooks and runtime sophistication exist without dominating first-contact UX |
| Add guided oneclick workflow presets | F-025 | ADD | should-have | Gives routine jobs safe defaults and faster time to momentum |
| Keep core governance while simplifying only the edges | F-016 | KEEP | should-have | Prevents a false pivot that would erase Public's real differentiation |

## 10. Priority Queue

1. **Redesign the lifecycle front door** around one primary guided flow plus quickstart presets (`F-017`, `F-025`). This is the clearest Phase 3 UX win.
2. **Move Gate 2 and more of Gate 1 behind runtime defaults** while compressing the operator contract (`F-012`, `F-023`, `F-024`).
3. **Merge the parallel surfaces** that currently fragment the system: everyday memory into lifecycle flows, named agents into capability bundles, and overlapping skills into packs (`F-018`, `F-020`, `F-022`).
4. **Keep strengthening deep loops without replacing their core state model** by combining richer metrics, richer runtime state, and the current packet-local artifacts (`F-008`, `F-011`, `F-021`).
5. **Refactor validation implementation while simplifying validator language** so strictness survives but feels less monolithic and less hostile (`F-010`, `F-019`).
6. **Preserve the mission-specific core**: file-first memory, spec folders, explicit scope binding, and append-only research/review artifacts (`F-016`, `R-004`, `R-006`).
7. **Stage RL-specific future work after UX cleanup**: structured evaluator payloads and stable role labels remain worthwhile, but not before the front-door and routing simplifications land (`F-003`, `F-006`).

## 11. Combined Recommendation Summary

### Adopt Now
- Richer loop metrics and dashboard signals (`F-008`)

### Prototype / Refactor Next
- Lifecycle front-door redesign and quickstart presets (`F-017`, `F-025`)
- Everyday memory UX merged into lifecycle commands (`F-018`)
- Capability bundles for agents and capability packs for skills (`F-020`, `F-022`)
- Gate 1/2 runtime-default pivot and implicit skill routing (`F-012`, `F-023`)
- Validation architecture decomposition plus validator-language simplification (`F-010`, `F-019`)
- Deep-loop runtime-state refinement around the current externalized state model (`F-011`, `F-021`)
- Structured evaluator payloads and stable role labeling (`F-003`, `F-006`)

### Keep Current Direction
- Slash-command transport instead of a single binary front door (`R-006` boundary)
- Internal Level 1/2/3+ authoring model, with better reader-facing language (`F-019`)
- Externalized deep-loop packet state (`F-021`)
- File-first memory architecture (`R-004`)
- Core spec-folder, scope-binding, and governance mission (`F-016`)

### Reject
- Hook-system merge with execution wrappers (`R-001`)
- Template/resource snapshot pivot (`R-002`)
- Generic loop redesign in this phase (`R-003`)
- Reflective CLI config for core operator flows (`R-005`)
- Single-binary CLI collapse for Public's operator surface (`R-006`)

## 12. Follow-On Packet Suggestions

- **Lifecycle front door packet:** redefine the primary operator path, demote advanced lifecycle variants, and add safe presets for common jobs.
- **Memory UX merge packet:** move routine context operations into `resume`, `complete`, `handover`, and deep-loop flows while retaining advanced `/memory:*` tools.
- **Capability topology packet:** collapse named agents and overlapping skills into bundles/packs without losing prompt overlays or file-ownership rules.
- **Operator contract compression packet:** split top-level workflow guidance from runtime appendices covering hooks, fallbacks, and internals.
- **Validation architecture packet:** decompose `validate.sh` behind a compatibility wrapper and redesign validator output for operator readability.
