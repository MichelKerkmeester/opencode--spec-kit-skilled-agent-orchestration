---
title: "Deep Research Report — 002-babysitter-main"
description: "30-iteration research of Babysitter for system-spec-kit improvement opportunities. 27 actionable findings, 3 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 002-babysitter-main

## 1. Executive Summary
- External repo: Babysitter (`https://github.com/a5c-ai/babysitter`), a TypeScript/Node.js process-as-code orchestration system with replayable runs, append-only journals, manifest-driven harness integration, executable methodologies, session-state helpers, structured runtime errors, deterministic replay tests, and layered compression. [SOURCE: external/README.md:319-430] [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-14] [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:8-133]
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Total actionable findings: 27
- Must-have: 8 | Should-have: 16 | Nice-to-have: 3 | Rejected: 3
- Phase 3 UX verdicts: SIMPLIFY=1 | ADD=1 | MERGE=5 | KEEP=1 | REDESIGN=2
- Phase 1 mostly identified adoption opportunities. Phase 2 broadened the lens and found that Babysitter's strongest signal is architectural: several `system-spec-kit` subsystems appear to be over-composed around classification, conversational gating, and duplicated workflow machinery rather than around executable workflow state. Phase 3 sharpened that result at the operator layer: the biggest UX problem is not missing capability, but a fragmented front door spread across too many commands, skills, continuity surfaces, and hand-maintained rule documents. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:114-170] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-10]
- Top combined opportunities for `system-spec-kit`:
- Turn documented gates into runtime-owned policy and approval checkpoints, with project policy stored once and enforced during execution. [SOURCE: external/README.md:186-239] [SOURCE: external/README.md:319-376] [SOURCE: AGENTS.md:159-229]
- Split lightweight session continuity from curated durable memory so operational capture is cheap and indexed memory remains deliberate. [SOURCE: external/packages/sdk/src/session/parse.ts:13-21] [SOURCE: external/packages/sdk/src/session/write.ts:14-58] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124]
- Replace level-first operator classification with workflow profiles and starter-packet scaffolding that attach artifacts to actual workflow intent. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:114-170] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73]
- Normalize multi-runtime resolution through a runtime manifest and reduce mirror drift across agent/runtime surfaces. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-14] [SOURCE: AGENTS.md:277-288] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74]
- Collapse deep research and deep review onto one iteration engine before adding more lifecycle features. [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:294-390]
- Merge public lifecycle, continuity, and skill surfaces so operators navigate fewer top-level concepts. [SOURCE: AGENTS.md:138-155] [SOURCE: .opencode/command/spec_kit/resume.md:29-41] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:11-31]
- Keep the deep-loop evidence layer, but generate more operator guidance from runtime-owned policy instead of hand-maintained instruction sprawl. [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:237-242]

## 2. External Repo Map
- `packages/sdk/src/runtime/` owns run creation, iteration orchestration, replay, process context, and runtime exceptions. [SOURCE: external/packages/sdk/src/runtime/createRun.ts:12-94] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:38-224] [SOURCE: external/packages/sdk/src/runtime/processContext.ts:46-147] [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:8-470]
- `packages/sdk/src/storage/` plus `runtime/replay/` provide append-only journal persistence, cache validation, and recovery. [SOURCE: external/packages/sdk/src/storage/journal.ts:27-49] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:48-160]
- `packages/sdk/src/session/` keeps operational continuity small and explicit with atomic writes, timestamps, and fast-loop detection. [SOURCE: external/packages/sdk/src/session/parse.ts:13-21] [SOURCE: external/packages/sdk/src/session/write.ts:14-58] [SOURCE: external/packages/sdk/src/session/write.ts:153-189]
- `packages/sdk/src/harness/`, plugin manifests, and hooks define runtime-local integration points for commands, hooks, and skills. [SOURCE: external/packages/sdk/src/harness/discovery.ts:49-126] [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-14] [SOURCE: external/plugins/babysitter-codex/hooks.json:1-36]
- `library/methodologies/` packages workflows as executable processes and state machines rather than prose-only guidance. [SOURCE: external/library/methodologies/state-machine-orchestration.js:13-21] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:14-250]
- Runtime tests focus on deterministic replay and corruption recovery, not just schema preservation. [SOURCE: external/packages/sdk/src/runtime/__tests__/deterministicHarness.test.ts:26-82] [SOURCE: external/packages/sdk/src/runtime/replay/__tests__/stateCache.test.ts:35-156]
- Compression is a runtime-layer subsystem with configurable prompt/output/context reduction, not a workflow-layer feature. [SOURCE: external/README.md:395-425] [SOURCE: external/packages/sdk/src/compression/config.ts:7-82] [SOURCE: external/packages/sdk/src/compression/density-filter.ts:45-89]

```text
Babysitter
├── Runtime authority
│   ├── createRun / orchestrateIteration
│   ├── processContext
│   ├── structured exceptions
│   └── replay + state cache
├── Persistence
│   ├── append-only journal
│   └── lightweight session state
├── Integration boundary
│   ├── harness discovery
│   ├── plugin manifests
│   └── lifecycle hooks
├── Methodology library
│   ├── generic state machine
│   └── spec-kit process pack
└── Runtime services
    ├── deterministic replay tests
    └── compression layers
```

## 3. Findings Registry

### Phase 1 Carry-Forward Findings

### Finding F-001 — Add A Checksummed Event Journal For Research Workflows
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, new helper under `.opencode/skill/system-spec-kit/scripts/core/`
- Priority: should-have
- Description: Babysitter persists ordered, checksummed journal events and validates replay order. `system-spec-kit` should add a comparable append-only event journal for deep research and deep review so failures and resumes are auditable beyond today's narrative JSONL. [SOURCE: external/packages/sdk/src/storage/journal.ts:27-49] [SOURCE: external/packages/sdk/src/runtime/replay/effectIndex.ts:107-147] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-180]

### Finding F-002 — Pair Cached Summaries With Journal-Head State
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- Priority: should-have
- Description: `session_resume` already validates transcript freshness well, but Babysitter shows a stronger replay safety pattern: trust cached state only when it matches the journal head. A journal-head snapshot would make crash recovery and workflow restarts more deterministic. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-299] [SOURCE: external/packages/sdk/src/runtime/replay/createReplayEngine.ts:95-129] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:70-79]

### Finding F-003 — Turn Constitutional Gates Into Runtime Gates
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- Priority: must-have
- Description: Babysitter's runtime is authoritative and refuses to continue until allowed next actions exist. `system-spec-kit` should move its highest-risk gate rules from documentation-first guidance toward machine-enforced runtime state. [SOURCE: external/README.md:319-376] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:106-114] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-69]

### Finding F-004 — Preserve Approval Semantics In Auto Mode
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- Priority: should-have
- Description: Babysitter auto-passes breakpoints in non-interactive mode but still records that policy decision. `system-spec-kit` should preserve equivalent audit semantics so auto mode means "approved under policy" rather than "no approval existed." [SOURCE: external/packages/sdk/src/runtime/intrinsics/breakpoint.ts:43-55] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:9-15] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:204-227]

### Finding F-005 — Add Pending-Action Queues To Research/Review Workflows
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/agent/deep-research.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- Priority: should-have
- Description: Babysitter models unresolved work as structured `nextActions`. `system-spec-kit` should add a pending-action registry so blocked or partially parallel research runs become easier to resume safely. [SOURCE: external/packages/sdk/src/runtime/intrinsics/parallel.ts:19-38] [SOURCE: external/packages/sdk/src/tasks/batching.ts:31-47] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-293]

### Finding F-006 — Pilot Executable Methodology Packs
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/` and future workflow-pack modules under `.opencode/skill/system-spec-kit/`
- Priority: nice-to-have
- Description: Babysitter packages workflows as executable state machines, including a Spec Kit variant. `system-spec-kit` should consider a small executable-pack layer for repeatable workflows, but only after the more urgent runtime-enforcement and architecture work lands. [SOURCE: external/library/methodologies/state-machine-orchestration.js:11-21] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-236] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:14-108]

### Finding F-007 — Normalize Multi-Harness Resolution Through A Manifest
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, new runtime-manifest helper
- Priority: must-have
- Description: Babysitter's plugin manifests and harness registry define a cleaner multi-runtime contract than `system-spec-kit`'s current mix of directory rules and hardcoded paths. This matters immediately because current deep-research workflows hardcode a Claude agent path while repo-level routing says the active runtime directory must vary by harness. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: external/packages/sdk/src/harness/discovery.ts:49-126] [SOURCE: AGENTS.md:277-288] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74]

### Finding F-008 — Prototype A Headless Internal Runner
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/`, `.opencode/command/spec_kit/`
- Priority: should-have
- Description: Babysitter treats unattended execution as a native runtime capability. `system-spec-kit` should consider a small internal runner for deep research and packet validation so overnight or CI-style flows share the same workflow contract as interactive runs. [SOURCE: external/README.md:148-164] [SOURCE: external/packages/sdk/src/harness/discovery.ts:209-237] [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:90-118]

### Finding F-009 — Expand To Lifecycle Hooks, Not Just Response/Mutation Hooks
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/hooks/`, `.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`, `.opencode/command/spec_kit/assets/*.yaml`
- Priority: should-have
- Description: Babysitter emits first-class lifecycle hooks from runtime execution. If `system-spec-kit` leans further into deterministic workflow control, it should expose lifecycle hooks for init, iteration, approval, convergence, synthesis, and save, not only memory and mutation cleanup hooks. [SOURCE: external/packages/sdk/src/runtime/createRun.ts:73-94] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:57-68] [SOURCE: external/packages/sdk/src/hooks/types.ts:7-22] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-25]

### Phase 2 Findings

### Finding F-010 — Replace Level Tiers With Workflow Profiles
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Priority: should-have
- Description: Babysitter's executable phases suggest that artifact requirements should follow workflow intent, not a mostly size-shaped Level 1/2/3/3+ taxonomy. `system-spec-kit` should pivot toward workflow profiles such as `baseline`, `verified`, `architectural`, and `governed`, with levels becoming compatibility metadata rather than the front-door abstraction. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:114-170] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:776-804]

### Finding F-011 — Turn Gates Into Persistent Runtime Policy
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/command/spec_kit/`
- Priority: must-have
- Description: Babysitter's UX suggests `system-spec-kit` should simplify Gate 1/2/3 into project-scoped policy plus runtime checkpoints. Capture defaults once, then enforce approvals and stop conditions during execution instead of making turn-zero questioning the primary control plane. [SOURCE: external/README.md:182-239] [SOURCE: external/README.md:319-376] [SOURCE: AGENTS.md:165-229]

### Finding F-012 — Split Session Capture From Durable Memory
- Origin iteration: `iteration-013.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts`
- Priority: must-have
- Description: Babysitter keeps operational session state intentionally small. `system-spec-kit` should pivot to a two-lane memory model: lightweight operational continuity artifacts for resume/handover, and curated durable memories for semantic indexing, metadata enrichment, and heavy quality rules. [SOURCE: external/packages/sdk/src/session/parse.ts:13-21] [SOURCE: external/packages/sdk/src/session/write.ts:14-58] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-174]

### Finding F-013 — Replace Parallel Loop Stacks With One Iteration Engine
- Origin iteration: `iteration-014.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/skill/system-spec-kit/scripts/tests/`
- Priority: should-have
- Description: Deep research and deep review currently duplicate lifecycle machinery, mirrors, reducers, and parity-test burden. Babysitter's runtime suggests `system-spec-kit` should refactor those flows onto one generic iteration engine with mode-specific schemas, reducers, and report templates layered on top. [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:294-390]

### Finding F-014 — Shrink Universal Validation Into Workflow-Owned Checks
- Origin iteration: `iteration-015.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/command/spec_kit/assets/`
- Priority: should-have
- Description: Babysitter's processes validate readiness inside the workflow phase that knows what "ready" means. `system-spec-kit` should keep a thin global structural validator, then move workflow-specific quality rules into command-owned gate logic. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:98-108] [SOURCE: external/library/methodologies/state-machine-orchestration.js:134-156] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-96] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:200-244]

### Finding F-015 — Keep Specialist Agents, Reduce Mirror Tax
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/agent/`, runtime mirror directories, `.opencode/skill/system-spec-kit/scripts/tests/`
- Priority: should-have
- Description: Babysitter does not prove that `system-spec-kit` should collapse its specialist agent taxonomy. It instead suggests centralizing or generating runtime mirrors from one machine-readable contract so policy-rich specialist roles can remain without hand-maintained duplication. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-14] [SOURCE: .opencode/agent/orchestrate.md:95-183] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:35-100]

### Finding F-016 — Adopt A Structured Error Taxonomy
- Origin iteration: `iteration-017.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/mcp_server/`
- Priority: should-have
- Description: Babysitter treats operator-facing diagnostics as part of the runtime contract. `system-spec-kit` should add shared error categories, hints, and remediation steps across shell commands and MCP handlers instead of relying on command-local failure semantics. [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:8-470] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:572-585] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:504-524]

### Finding F-017 — Add Deterministic Workflow Simulation Tests
- Origin iteration: `iteration-018.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/tests/`, `.opencode/command/spec_kit/assets/`
- Priority: should-have
- Description: Babysitter's tests show that deterministic replay, interruption/resume, and state-repair behavior deserve first-class runtime tests. `system-spec-kit` should add seeded workflow simulation tests alongside its existing schema and parity coverage. [SOURCE: external/packages/sdk/src/runtime/__tests__/deterministicHarness.test.ts:26-82] [SOURCE: external/packages/sdk/src/runtime/replay/__tests__/stateCache.test.ts:35-156] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:225-258]

### Finding F-018 — Add A Lightweight Timing Guard To Long Loops
- Origin iteration: `iteration-019.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/skill/sk-deep-research/`
- Priority: nice-to-have
- Description: Babysitter's session-state helpers include fast-loop detection. `system-spec-kit` should consider a small iteration-cadence safeguard for unattended loops so shallow accidental spins do not consume the entire budget unnoticed. [SOURCE: external/packages/sdk/src/session/write.ts:153-189] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-169] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277]

### Phase 3 Findings

### Finding F-019 — Merge Lifecycle Entry Commands Into One Canonical Surface
- Origin iteration: `iteration-021.md`
- system-spec-kit target: `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/complete.md`, `.opencode/command/spec_kit/assets/`
- Priority: must-have
- Description: `system-spec-kit` should merge its public planning, implementation, and completion entry points into one canonical lifecycle surface with internal phase controls. The current three-command split duplicates setup and increases operator friction. [SOURCE: .opencode/command/spec_kit/plan.md:31-45] [SOURCE: .opencode/command/spec_kit/implement.md:77-125] [SOURCE: .opencode/command/spec_kit/complete.md:81-150] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/harnessCreateRun.ts:113-141]

### Finding F-020 — Fold Routine Memory Behavior Into The Lifecycle Surface
- Origin iteration: `iteration-022.md`
- system-spec-kit target: `.opencode/command/spec_kit/`, `.opencode/command/memory/`, `.opencode/skill/system-spec-kit/`
- Priority: should-have
- Description: ordinary memory capture and recall should feel like part of the main workflow, not like a parallel command family. Keep explicit `/memory:*` surfaces for advanced admin and inspection work, but integrate routine memory behavior into lifecycle flows. [SOURCE: .opencode/command/memory/save.md:1-29] [SOURCE: .opencode/command/memory/search.md:1-34] [SOURCE: AGENTS.md:138-155]

### Finding F-021 — Replace Level-First Spec UX With Starter Packets And Lazy Expansion
- Origin iteration: `iteration-023.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Priority: should-have
- Description: the public spec-folder UX should start from a minimal starter packet and expand artifacts only when workflow risk justifies it. Levels can remain compatibility metadata, but they should not be the primary mental model for operators. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:776-804] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-96]

### Finding F-022 — Merge `@context-prime` Into The Continuity Stack
- Origin iteration: `iteration-024.md`
- system-spec-kit target: `.opencode/agent/context-prime.md`, `.opencode/agent/context.md`, `.opencode/command/spec_kit/resume.md`
- Priority: should-have
- Description: bootstrap and deep retrieval should be modes of one continuity system instead of separate public concepts. Keep the lightweight fast path, but stop presenting `@context-prime` as its own operator-facing product. [SOURCE: .opencode/agent/context-prime.md:22-45] [SOURCE: .opencode/agent/context.md:25-53] [SOURCE: .opencode/command/spec_kit/resume.md:29-41]

### Finding F-023 — Merge Handover Into The Same Continuity Surface
- Origin iteration: `iteration-026.md`
- system-spec-kit target: `.opencode/command/spec_kit/resume.md`, `.opencode/command/spec_kit/handover.md`, `.opencode/agent/context-prime.md`, `.opencode/agent/handover.md`
- Priority: should-have
- Description: handover artifacts should remain available, but they should be emitted from the continuity stack rather than from a separate top-level command and agent family. [SOURCE: .opencode/command/spec_kit/resume.md:73-141] [SOURCE: .opencode/command/spec_kit/handover.md:34-48] [SOURCE: .opencode/agent/handover.md:40-47] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/resume.md:2-8]

### Finding F-024 — Consolidate The Public Skill Surface
- Origin iteration: `iteration-027.md`
- system-spec-kit target: `.opencode/skill/`, `AGENTS.md`, `.opencode/command/spec_kit/`, `.opencode/skill/scripts/skill_advisor.py`
- Priority: must-have
- Description: `system-spec-kit` should expose fewer first-class public skills. Keep the existing specialized guidance as internal overlays or packaging units, but present a smaller canonical set to operators. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-13] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-48] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:21-59] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-60] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-4]

### Finding F-025 — Demote `skill_advisor.py` To Fallback Routing
- Origin iteration: `iteration-028.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/skill/scripts/skill_advisor.py`
- Priority: must-have
- Description: keep the advisor, but stop making it a mandatory gate on every non-trivial task. Use it when intent is ambiguous; direct-route when the command or request already makes the correct surface obvious. [SOURCE: AGENTS.md:174-179] [SOURCE: .opencode/skill/scripts/skill_advisor.py:67-90] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-260] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/call.md:2-7]

### Finding F-026 — Generate Operator Guidance From Machine-Readable Policy
- Origin iteration: `iteration-029.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/command/spec_kit/`, `.opencode/skill/system-spec-kit/constitutional/`, YAML workflow assets, generated-instructions layer
- Priority: must-have
- Description: the system should stop hand-maintaining so much duplicated behavior prose. Define one machine-readable policy/runtime source, then generate harness-facing guidance from it. [SOURCE: AGENTS.md:159-252] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-13] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-10] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:237-242]

### Finding F-027 — Add Execution Profiles For Recurring Work
- Origin iteration: `iteration-030.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/command/spec_kit/`, `.opencode/skill/system-spec-kit/`, profile/config helpers
- Priority: nice-to-have
- Description: after the front door is simplified, add execution profiles and stored user/project defaults so recurring work does not repeatedly pay the same gate and setup cost. [SOURCE: AGENTS.md:159-229] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:32-59] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:160-201]

## 4. Phase 3 — UX, Agentic System & Skills Analysis

Phase 3 confirmed that `system-spec-kit`'s UX problem is mostly one of front-door fragmentation, not missing capability. Babysitter repeatedly shows a smaller public surface around a strong runtime core: fewer lifecycle commands, one primary continuity model, one main orchestration skill, and generated instructions instead of a large manually layered rule stack. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-10] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:11-31]

### Phase 3 verdict summary
- `MERGE`: 5
- `SIMPLIFY`: 1
- `ADD`: 1
- `KEEP`: 1
- `REDESIGN`: 2

### What to delete first
- Separate lifecycle entry points for planning, implementation, and completion. [SOURCE: AGENTS.md:138-155]
- Separate public continuity products for bootstrap, resume, and handover. [SOURCE: .opencode/command/spec_kit/resume.md:29-41] [SOURCE: .opencode/command/spec_kit/handover.md:34-48]
- Mandatory skill-advisor ceremony on obvious routes. [SOURCE: AGENTS.md:174-179]
- Excessive public skill fragmentation that exposes internal taxonomy to operators. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-48] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:21-59] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-60]
- Hand-maintained policy duplication across AGENTS, command prose, and supporting rule surfaces. [SOURCE: AGENTS.md:159-252]

### What to keep
- The inspectable evidence trail for deep loops: iteration files, JSONL state, dashboards, and synthesis outputs remain valuable and should not be removed in the name of UX simplification. [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-review.md:45-57]

### What to add later
- Execution profiles and stored defaults are worthwhile, but only after the lifecycle, continuity, routing, and policy surfaces are simplified first. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:160-201]

## 5. Rejected Recommendations

### Rejected R-001 — Do Not Copy Babysitter's Full Plugin Marketplace Into system-spec-kit
- Origin iteration: `iteration-008.md`
- Rationale: Babysitter's marketplace solves multi-product plugin distribution. `system-spec-kit` should borrow the manifest boundary, not the installer and marketplace surface. [SOURCE: external/README.md:168-178] [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: AGENTS.md:277-288]

### Rejected R-002 — Do Not Import Babysitter's Compression Stack Whole
- Origin iteration: `iteration-020.md`
- Rationale: Babysitter's four-layer compression stack is a runtime-shell concern. `system-spec-kit` is a workflow and governance layer across multiple runtimes, so importing the full compression subsystem would add architectural weight in the wrong place. Borrow metrics or interfaces later if needed, but do not import the subsystem wholesale. [SOURCE: external/README.md:395-425] [SOURCE: external/packages/sdk/src/compression/config.ts:7-82] [SOURCE: .opencode/agent/orchestrate.md:621-724]

### Rejected R-003 — Do Not Delete Packet-Local Loop Artifacts
- Origin iteration: `iteration-025.md`
- Rationale: deep-loop iteration files, dashboards, and JSONL state are not the main UX problem. Babysitter also keeps its run events and journals highly inspectable. Simplify the wrapper surface, not the evidence trail. [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-review.md:45-57] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:205-229]

## 6. Verdict Recommendations

| Verdict | Finding IDs | Summary |
|---------|-------------|---------|
| `PIVOT` | `F-010`, `F-012` | Move from level-first thinking to workflow profiles, and split operational session continuity from durable indexed memory. |
| `SIMPLIFY` | `F-011`, `F-014`, `F-025` | Reduce turn-zero gate ritual by storing policy once and enforcing it at runtime; reduce the universal validator to structural integrity; demote mandatory advisor routing on obvious paths. |
| `REFACTOR` | `F-013` | Replace parallel deep-research and deep-review loop stacks with one generic iteration engine plus mode descriptors. |
| `MERGE` | `F-019`, `F-020`, `F-022`, `F-023`, `F-024` | Collapse fragmented lifecycle, memory, continuity, and public skill surfaces into fewer canonical entry points. |
| `REDESIGN` | `F-021`, `F-026` | Redesign spec-folder UX around starter packets and lazy expansion; redesign operator guidance around machine-readable policy and generated instructions. |
| `ADD` | `F-027` | Add execution profiles only after the front door is simplified. |
| `KEEP` | `F-015`, `R-002`, `R-003` | Preserve specialist roles and inspectable evidence layers, but centralize mirrors and keep compression/runtime concerns out of the workflow layer. |

### Architectural throughline
- Babysitter's main lesson is not "copy these features." It is "put authority in executable workflow state." The more `system-spec-kit` can express profiles, approvals, readiness, resumability, and operator defaults in runtime state instead of in overlaid classifications and mirrored assets, the less incidental framework machinery it has to maintain. [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235] [SOURCE: external/README.md:319-376]
- Phase 2 shifted the recommendation stack from additive feature work toward simplification and refactoring. Phase 3 sharpens that further: the next gains come from deleting front-door fragmentation while preserving the strong evidence layer underneath. Runtime-enforced gates, a cleaner memory split, workflow profiles, canonical lifecycle and continuity surfaces, smaller public skill sets, and generated operator guidance all reinforce each other. They are not independent tweaks. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:114-170] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:237-242]

## 7. Updated Priority Queue

### Immediate queue
1. `F-003` + `F-011` + `F-026`: introduce project-scoped operator policy plus runtime-enforced approvals, and define a machine-readable policy source that can generate harness-facing guidance.
2. `F-019` + `F-020`: merge lifecycle entry points and fold routine memory behavior into the canonical workflow surface.
3. `F-024` + `F-025`: consolidate the public skill set and make advisor routing conditional instead of mandatory on obvious paths.
4. `F-012` + `F-022` + `F-023`: split session continuity from durable memory promotion while collapsing bootstrap, resume, and handover into one continuity model.
5. `F-013`: extract one shared iteration engine under deep research and deep review.
6. `F-007`: add a runtime manifest/resolver so harness- and runtime-specific roots stop being hardcoded.

### Follow-on queue
1. `F-021` + `F-010`: redesign level-first packet creation into workflow profiles plus starter packets with lazy artifact expansion.
2. `F-014`: move workflow-specific semantic validation out of the universal validator.
3. `F-016`: normalize operator-facing errors across shell and MCP surfaces.
4. `F-017`: build deterministic workflow simulation tests that can prove resume and repair behavior.
5. `F-002` + `F-001`: add journal-head snapshots and then append-only event journals for long-running workflows.
6. `F-015`: centralize specialist-agent contracts and generate runtime mirrors from metadata.
7. `F-004`, `F-005`, `F-009`, `F-008`, `F-018`, `F-027`, `F-006`: layer in approval audit records, pending-action queues, lifecycle hooks, headless runner support, iteration timing guards, execution profiles, and executable methodology packs as the runtime gets more authoritative.

### Explicit non-priorities
- `R-001`: do not build a Babysitter-style plugin marketplace inside `system-spec-kit`.
- `R-002`: do not import Babysitter's compression subsystem wholesale.
- `R-003`: do not delete packet-local deep-loop artifacts in the name of simplification.

## 8. Cross-Phase Implications
- `002-babysitter-main` should now be treated as the main research source for workflow authority, runtime policy, replayability, resumability, manifest-driven runtime binding, and operator-surface simplification opportunities in the core Spec Kit architecture. [SOURCE: external/README.md:319-391] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235]
- `007-relay-main` should continue to own transport and inter-runtime relay questions. The Babysitter-derived manifest recommendation is about local runtime resolution and execution authority, not about message buses or relay transport. [SOURCE: external/packages/sdk/src/harness/discovery.ts:1-15] [SOURCE: external/packages/sdk/src/harness/discovery.ts:49-126]
- The packet now gives a coherent order of operations for follow-on work: first runtime-owned policy and canonical public surfaces, then memory and iteration refactors, and only then additive UX layers such as execution profiles. Several high-value next steps are now "delete or merge machinery" rather than "add another subsystem." [SOURCE: AGENTS.md:159-250] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73]

## 9. Recommended Next Step
Open the next implementation packet around one narrow proving ground: a canonical operator front door for one workflow family, ideally deep research or general lifecycle work. That prototype should combine four linked hypotheses at once: runtime-owned operator policy, one canonical lifecycle and continuity entry surface, conditional skill routing instead of mandatory Gate 2 ceremony, and generated harness-facing guidance from one machine-readable source. If that works, the repo will have a credible path into the bigger memory-split, workflow-profile, and iteration-engine refactors without changing everything at once. [SOURCE: external/README.md:186-239] [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-14] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:237-242]
