---
title: "Deep Research Report — 002-babysitter-main"
description: "10-iteration research of Babysitter for system-spec-kit improvement opportunities. 9 actionable findings, 1 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 002-babysitter-main

## 1. Executive Summary
- External repo: Babysitter (`https://github.com/a5c-ai/babysitter`), a TypeScript/Node.js process-as-code orchestration system with event-sourced journals, replayable runs, harness adapters, plugin bundles, and layered compression. [SOURCE: external/README.md:319-397] [SOURCE: external/plugins/babysitter-opencode/plugin.json:11-14]
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 9
- Must-have: 2 | Should-have: 6 | Nice-to-have: 1 | Rejected: 1
- Top 3 adoption opportunities for system-spec-kit:
- Add runtime-enforced gate states for high-risk `spec_kit` workflows instead of leaving enforcement primarily at the documentation layer. [SOURCE: external/README.md:319-376] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-69]
- Introduce a runtime manifest/resolver so multi-harness workflows stop hardcoding runtime-specific agent paths. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: AGENTS.md:277-288] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74]
- Add a checksummed event journal for deep research and deep review so resumptions and failures become auditable at the phase-step level. [SOURCE: external/packages/sdk/src/storage/journal.ts:27-49] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-180]

## 2. External Repo Map
- `packages/sdk/src/runtime/` owns run creation, iteration orchestration, replay, breakpoints, parallel dispatch, and the live process context. [SOURCE: external/packages/sdk/src/runtime/createRun.ts:12-94] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:38-170] [SOURCE: external/packages/sdk/src/runtime/processContext.ts:46-147]
- `packages/sdk/src/storage/` owns append-only journal persistence and the state-cache files that replay rebuilds from disk. [SOURCE: external/packages/sdk/src/storage/journal.ts:27-49] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:48-160]
- `packages/sdk/src/harness/` abstracts installed harnesses and caller harnesses, while plugin bundles declare harness-local roots for hooks, commands, and skills. [SOURCE: external/packages/sdk/src/harness/discovery.ts:1-15] [SOURCE: external/packages/sdk/src/harness/discovery.ts:49-126] [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10]
- `packages/sdk/src/hooks/` exposes lifecycle hooks as a first-class runtime system. [SOURCE: external/packages/sdk/src/hooks/types.ts:7-22] [SOURCE: external/packages/sdk/src/hooks/types.ts:46-115]
- `packages/sdk/src/compression/` plus README-level compression docs show a four-layer context-discipline stack rather than a single summarization pass. [SOURCE: external/README.md:395-430] [SOURCE: external/packages/sdk/src/compression/config.ts:7-47] [SOURCE: external/packages/sdk/src/compression/density-filter.ts:45-89]
- `library/methodologies/` packages reusable workflows as executable processes, not just methodology prose. [SOURCE: external/library/methodologies/state-machine-orchestration.js:11-21] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:14-108]

```text
Babysitter
├── Runtime authority
│   ├── createRun
│   ├── orchestrateIteration
│   ├── processContext
│   └── replay/stateCache
├── Append-only storage
│   └── journal + run state
├── Hook and harness boundary
│   ├── lifecycle hooks
│   ├── harness discovery
│   └── plugin manifests
├── Methodology library
│   └── executable process packs
└── Compression layers
    └── prompt, output, sdk context, library cache
```

## 3. Findings Registry

### Finding F-001 — Add A Checksummed Event Journal For Research Workflows
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, new helper under `.opencode/skill/system-spec-kit/scripts/core/`
- Priority: should-have
- Description: Babysitter persists each event as its own checksummed JSON record and validates ordering during replay; `system-spec-kit` deep research currently persists config plus JSONL summaries only. A small append-only event journal would make deep research and deep review failure recovery much more auditable without replacing the current narrative state files. [SOURCE: external/packages/sdk/src/storage/journal.ts:27-49] [SOURCE: external/packages/sdk/src/runtime/replay/effectIndex.ts:107-147] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-180]
- Evidence: `RUN_CREATED` is written under lock before hooks, each journal event gets sequence, ULID, and checksum, and the replay layer rejects order drift. [SOURCE: external/packages/sdk/src/runtime/createRun.ts:41-94] [SOURCE: external/packages/sdk/src/storage/journal.ts:27-49]

### Finding F-002 — Pair Cached Summaries With Journal-Head State
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- Priority: should-have
- Description: `session_resume` already does strong transcript-identity and freshness validation, but Babysitter adds a different protection: replay cache is trusted only when its journal head matches the underlying journal. A journal-head snapshot for long-running packet workflows would complement current cached summaries and reduce ambiguity after crashes or partial workflow restarts. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-299] [SOURCE: external/packages/sdk/src/runtime/replay/createReplayEngine.ts:95-129] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:70-79]
- Evidence: Babysitter rebuilds missing, corrupt, or mismatched state caches immediately and records why. [SOURCE: external/packages/sdk/src/runtime/replay/createReplayEngine.ts:95-129] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:140-160]

### Finding F-003 — Turn Constitutional Gates Into Runtime Gates
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- Priority: must-have
- Description: Babysitter's strongest differentiator is that process code is the authority and the runtime returns `waiting` until an allowed next action exists. `system-spec-kit` has good gate content, but it is still mostly documented and surfaced rather than mechanically enforced. High-risk workflows should move toward a machine-readable gate-state contract. [SOURCE: external/README.md:319-376] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:106-114] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-69]
- Evidence: the process context exposes only approved intrinsics, and unresolved effects terminate the iteration with explicit `nextActions`. [SOURCE: external/packages/sdk/src/runtime/processContext.ts:57-75] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:217-224]

### Finding F-004 — Preserve Approval Semantics In Auto Mode
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- Priority: should-have
- Description: Babysitter auto-approves breakpoints in non-interactive mode but still emits an audit record. `system-spec-kit` should do the same so auto mode means "gate auto-passed under policy" rather than "no gate existed." [SOURCE: external/packages/sdk/src/runtime/intrinsics/breakpoint.ts:43-55] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:9-15] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:204-227]
- Evidence: breakpoint strategies are explicit types, and confirm mode already models approvals directly. [SOURCE: external/packages/sdk/src/runtime/types.ts:11-27] [SOURCE: .opencode/command/spec_kit/deep-research.md:156-162]

### Finding F-005 — Add Pending-Action Queues To Research/Review Workflows
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/agent/deep-research.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- Priority: should-have
- Description: Babysitter models unresolved work as structured `nextActions`, with deduped summaries and group hints for parallel batches. `system-spec-kit` currently records convergence state and narrative next focus, but not a queue of resumable outstanding actions. Adding a small pending-action registry would make blocked research runs easier to resume safely. [SOURCE: external/packages/sdk/src/runtime/intrinsics/parallel.ts:19-38] [SOURCE: external/packages/sdk/src/tasks/batching.ts:31-47] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-293]
- Evidence: current deep-research iteration state has no pending-action schema beyond the freeform JSONL record. [SOURCE: .opencode/agent/deep-research.md:167-199]

### Finding F-006 — Pilot Executable Methodology Packs
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/` and future workflow-pack modules under `.opencode/skill/system-spec-kit/`
- Priority: nice-to-have
- Description: Babysitter's methodology library packages workflows as executable state machines and task graphs, including a Spec Kit variant. `system-spec-kit` should consider a small executable-pack layer for a few repeatable workflows, but only after the more urgent runtime-enforcement work lands. [SOURCE: external/library/methodologies/state-machine-orchestration.js:11-21] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-236] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:14-108] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:90-118]
- Evidence: Babysitter's Spec Kit methodology includes both task decomposition and review breakpoints, showing that behavior and governance can live together in one reusable asset. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:144-170] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:198-250]

### Finding F-007 — Normalize Multi-Harness Resolution Through A Manifest
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, new runtime-manifest helper
- Priority: must-have
- Description: Babysitter's plugin manifests and harness registry provide a stronger multi-runtime contract than `system-spec-kit`'s current mix of directory rules and hardcoded paths. This matters immediately because the deep-research YAML still hardcodes a Claude path while the repo-level routing rule says runtime directories must vary by active harness. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: external/packages/sdk/src/harness/discovery.ts:49-126] [SOURCE: AGENTS.md:277-288] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74]
- Evidence: the same hardcoded Claude agent path appears in both auto and confirm deep-research workflows. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:66-74]

### Finding F-008 — Prototype A Headless Internal Runner
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/`, `.opencode/command/spec_kit/`
- Priority: should-have
- Description: Babysitter's internal harness shows that unattended orchestration becomes more reliable when it shares the same runtime contract as interactive runs. `system-spec-kit` already has strong scripts, but not a unified headless runner. A small internal runner for deep research and packet validation would materially help overnight and CI-style workflows. [SOURCE: external/README.md:148-164] [SOURCE: external/packages/sdk/src/harness/discovery.ts:209-237] [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:25-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:90-118]
- Evidence: Babysitter models headless execution as a capability, not a side script. [SOURCE: external/packages/sdk/src/harness/types.ts:17-29] [SOURCE: external/packages/sdk/src/harness/types.ts:76-90]

### Finding F-009 — Expand To Lifecycle Hooks, Not Just Response/Mutation Hooks
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/hooks/`, `.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`, `.opencode/command/spec_kit/assets/*.yaml`
- Priority: should-have
- Description: Babysitter emits runtime lifecycle hooks from the execution path itself, while `system-spec-kit`'s current hook surface is centered on memory auto-surface, response hints, and post-mutation cache cleanup. If `system-spec-kit` adopts more deterministic workflow execution, it should also expose first-class command lifecycle hooks for init, iteration, approval, convergence, synthesis, and save. [SOURCE: external/packages/sdk/src/runtime/createRun.ts:73-94] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:57-68] [SOURCE: external/packages/sdk/src/hooks/types.ts:7-22] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-25]
- Evidence: mutation hooks today are narrowly post-write invalidation logic, not a general lifecycle event system. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-105]

## 4. Rejected Recommendations

### Rejected R-001 — Do Not Copy Babysitter's Full Plugin Marketplace Into system-spec-kit
- Origin iteration: `iteration-008.md`
- Rationale: Babysitter's marketplace solves multi-product plugin distribution, while `system-spec-kit` currently ships repo-native workflows, references, and scripts together. Importing a full installer/marketplace layer now would widen the operational surface before the more urgent deterministic workflow gaps are addressed. Borrow the manifest boundary, not the marketplace itself. [SOURCE: external/README.md:168-178] [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:90-118] [SOURCE: AGENTS.md:277-288]

## 5. Cross-Phase Implications
- Babysitter should remain the research program's source for process authority, journals, replay, gates, pending work, and lifecycle hooks. Those are all orchestration-control concerns. [SOURCE: external/README.md:319-391] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:106-114]
- `007-relay-main` should continue to own transport, relay, and message-handoff questions. Babysitter's harness layer discovers and invokes host tools, but the repo's main architectural value is not transport; it is deterministic process enforcement layered on top of whatever harness is present. [SOURCE: external/packages/sdk/src/harness/discovery.ts:1-15] [SOURCE: external/packages/sdk/src/harness/discovery.ts:49-126] [SOURCE: external/README.md:319-391]
- The runtime-manifest recommendation overlaps lightly with relay research because both touch multi-runtime integration, but the Babysitter-derived recommendation is specifically about local resolution of agent/hook roots and capabilities, not about inter-agent transport or message buses. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: AGENTS.md:277-288]

## 6. Recommended Next Step
Plan the runtime-manifest and runtime-enforced gate work first, in that order. The manifest layer is the cleanest near-term fix because it addresses a live path-hardcoding inconsistency in the deep-research workflows; the runtime-enforced gate work is the highest strategic payoff because it turns `system-spec-kit`'s strongest ideas into mechanically provable workflow control. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74] [SOURCE: AGENTS.md:277-288] [SOURCE: external/README.md:319-376]
