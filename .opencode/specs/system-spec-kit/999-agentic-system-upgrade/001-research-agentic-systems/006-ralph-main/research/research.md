---
title: "Deep Research Report — 006-ralph-main"
description: "30-iteration research of Ralph for system-spec-kit improvement across architecture, UX, agentic orchestration, commands, and skills. 25 actionable findings, 5 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 006-ralph-main

## 1. Executive Summary
- External repo: Ralph, a minimal Bash-driven autonomous coding loop that repeatedly spawns fresh Amp or Claude Code instances and carries state through `prd.json`, `progress.txt`, and git history. Across all three phases, the strongest lesson is not "become Ralph," but "make workflow boundaries clearer and the default operator path much smaller." [SOURCE: external/README.md:5-6] [SOURCE: external/README.md:88-145] [SOURCE: external/README.md:165-188]
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Total actionable findings: 25
- Must-have: 6 | Should-have: 14 | Nice-to-have: 5 | Rejected: 5
- Top combined adoption opportunities for `system-spec-kit`:
  - Refactor continuity into two layers: a lightweight execution bridge for the next autonomous run plus the existing semantic/archive layer. [SOURCE: external/prompt.md:18-48] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]
  - Make per-task executable acceptance evidence the primary completion contract, with packet validation narrowed to integrity and safety. [SOURCE: external/skills/ralph/SKILL.md:83-116] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-403] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100]
  - Narrow the default operator surface so normal users see a small lifecycle path, not the full command, memory, agent, and skill taxonomy. [SOURCE: external/README.md:88-130] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187]
  - Merge routine memory behavior into the spec workflow and keep management/admin memory surfaces advanced. [SOURCE: external/README.md:132-145] [SOURCE: .opencode/command/memory/manage.md:72-140]
  - Redesign the visible gate contract around one hard ask plus a fast default path, keeping more machinery implicit. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-87] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:5-30]
  - Expose a guided front door that chooses between lightweight and governed lanes instead of making operators assemble the lifecycle manually. [SOURCE: external/README.md:88-130] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187]

## 2. What Phase 1 Established
- Ralph's strongest already-adopted pattern is fresh-context iteration with externalized state; `system-spec-kit` already uses that in deep research and should reuse the principle deliberately elsewhere. [SOURCE: external/ralph.sh:84-107] [SOURCE: .opencode/agent/deep-research.md:24-29]
- The most direct Phase 1 improvements were execution-sized task planning, one-task-per-run discipline, git lineage enrichment for memory saves, a progress-log concept, and a promotion checkpoint for durable learnings. [SOURCE: external/skills/ralph/SKILL.md:46-126] [SOURCE: external/prompt.md:10-17] [SOURCE: external/prompt.md:50-74]
- Phase 1 rejected replacing semantic memory with Ralph's minimal continuity model and rejected literal adoption of Ralph's branch-rotation archive logic for deep research. [SOURCE: external/README.md:165-168] [SOURCE: external/ralph.sh:42-73] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-18]

## 3. What Phase 2 Added
- Phase 2 widened the lens from "what should we copy?" to "what should we simplify, refactor, or keep?" by comparing Ralph's omissions with `system-spec-kit`'s larger memory, validation, agent, and UX surfaces. [SOURCE: external/README.md:132-145] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]
- The strongest Phase 2 signal is architectural separation: Ralph sharply separates execution-bridge state from long-term truth, while `system-spec-kit` currently asks archival surfaces to do too much next-iteration work. [SOURCE: external/.gitignore:1-7] [SOURCE: external/prompt.md:18-48] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:29-74]
- The second major Phase 2 signal is simplification pressure: agent-role count, validation layers, command taxonomy, and lifecycle docs all appear broader than many narrow autonomous workflows actually need. [SOURCE: .opencode/agent/orchestrate.md:95-107] [SOURCE: .opencode/command/spec_kit/resume.md:37-141] [SOURCE: .opencode/command/memory/manage.md:48-99]

## 4. Phase 3 — UX, Agentic System & Skills Analysis
- Phase 3 confirms that the deepest current problem is operator-facing surface area. Commands, memory workflows, agent roles, skill routing, and gates are each defensible in isolation, but they accumulate into a default UX that feels like an operating system rather than a guided workflow. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-617] [SOURCE: .opencode/agent/orchestrate.md:95-107]
- Ralph's strongest UX advantage is obviousness: tiny front-door surface, one legible workflow, and very little operator-visible taxonomy. `system-spec-kit` should import that discipline without discarding the governed stack that supports deeper work. [SOURCE: external/README.md:88-145] [SOURCE: external/.claude-plugin/plugin.json:2-9]
- The key Phase 3 synthesis is "hide more, delete selectively, merge aggressively, and keep only the complexity that serves deep or governed workflows." That means shrinking the visible command map, merging lifecycle and continuity surfaces, simplifying skill routing, and redesigning the visible gate contract. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-87] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:5-30]
- Phase 3 also produced two important keep-signals: do not replace spec folders/levels with Ralph's PRD-only artifact model, and do not replace deep research/review LEAF loops with Ralph's simpler shell runner. Those are precisely the places where `system-spec-kit`'s extra structure is justified. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/agent/deep-research.md:121-205] [SOURCE: .opencode/agent/deep-review.md:124-236]

## 5. External Repo Map

### Structure
- `external/ralph.sh` — the full orchestration loop: argument parsing, archive/reset logic, fresh tool spawn, completion sentinel, max-iteration stop. [SOURCE: external/ralph.sh:7-35] [SOURCE: external/ralph.sh:42-113]
- `external/prompt.md` and `external/CLAUDE.md` — tool-specific execution contracts that encode the loop's real behavior. [SOURCE: external/prompt.md:7-17] [SOURCE: external/CLAUDE.md:7-16]
- `external/prd.json.example` — the minimal ordered state machine for task selection and completion. [SOURCE: external/prd.json.example:1-17]
- `external/skills/ralph/SKILL.md` and `external/skills/prd/SKILL.md` — the true design center: story sizing, ordering, acceptance criteria, clarifying questions, and archiving rules. [SOURCE: external/skills/ralph/SKILL.md:46-126] [SOURCE: external/skills/prd/SKILL.md:24-55] [SOURCE: external/skills/prd/SKILL.md:69-92]
- `external/.claude-plugin/` and `external/flowchart/` — evidence that Ralph also optimizes packaging and operator explanation, not just loop runtime. [SOURCE: external/.claude-plugin/plugin.json:2-9] [SOURCE: external/README.md:147-159] [SOURCE: external/flowchart/src/App.tsx:37-50]
- `external/.gitignore` — evidence that run-state is intentionally local and non-authoritative. [SOURCE: external/.gitignore:1-7]

### Main Pattern
Ralph is intentionally narrow: one tiny orchestrator, one verified story per run, tiny bridge artifacts, and strong reliance on project-native checks. Its most important lesson for `system-spec-kit` is not replacement but boundary clarity. [SOURCE: external/README.md:122-130] [SOURCE: external/README.md:165-188] [SOURCE: external/ralph.sh:90-113]

## 6. Findings Registry

### Phase 1 Findings

### Finding F-001 — Encode One-Window Task Sizing
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- Priority: must-have
- Description: Ralph's most valuable pattern is upstream, not runtime-level: every story must fit in one context window, must be dependency-ordered, and must carry verifiable acceptance criteria. `system-spec-kit` currently asks for tasks and effort estimates, but not for execution-sized tasks. Adding that rule would make existing implementation workflows more reliable without introducing new infrastructure. [SOURCE: external/skills/ralph/SKILL.md:46-126] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:91-123]
- Evidence: [SOURCE: external/skills/ralph/SKILL.md:46-76] [SOURCE: external/skills/prd/SKILL.md:69-92] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:34-71]

### Finding F-002 — Enforce One Task Per Implementation Run
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/command/spec_kit/implement.md`
- Priority: must-have
- Description: Ralph duplicates its single-story rule at runtime, not just in planning. `/spec_kit:implement` should do the same by explicitly restricting an autonomous run to one verified task or story at a time. This would reduce silent scope growth and make checkpoints, handovers, and retries cleaner. [SOURCE: external/prompt.md:10-17] [SOURCE: .opencode/command/spec_kit/implement.md:171-201]
- Evidence: [SOURCE: external/skills/ralph/SKILL.md:46-63] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:34-71]

### Finding F-003 — Surface Fresh-Context Iteration as a Reusable Pattern
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: should-have
- Description: `system-spec-kit` already uses Ralph's "fresh run plus externalized state" pattern inside deep research, but it is encoded as workflow internals rather than documented as a reusable design principle. Making that pattern explicit would help future autonomous workflows stay simple and restartable. [SOURCE: external/ralph.sh:84-107] [SOURCE: .opencode/agent/deep-research.md:24-29] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:294-320]
- Evidence: [SOURCE: external/README.md:163-169] [SOURCE: .opencode/agent/deep-research.md:50-60]

### Finding F-004 — Enrich Memory Saves With Git Lineage
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- Priority: should-have
- Description: Ralph uses git as a lightweight audit trail. `system-spec-kit` should not replace semantic memory with git, but it should include small git references such as branch and HEAD commit in generated memory artifacts so recovered context can be mapped back to code history faster. [SOURCE: external/README.md:165-168] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124]
- Evidence: [SOURCE: external/prompt.md:13-17] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:15-22]

### Finding F-005 — Add a Lightweight Append-only Progress Artifact
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/templates/progress-log.md`
- Priority: should-have
- Description: Ralph's `progress.txt` fills a useful middle layer between full handovers and raw commits. `system-spec-kit` would benefit from an append-only progress artifact that captures "what changed, what mattered, what to remember next time" across long autonomous runs. [SOURCE: external/prompt.md:18-48] [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:42-77]
- Evidence: [SOURCE: external/README.md:129-141] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_handover_full.yaml:41-53]

### Finding F-006 — Add a Guidance-Promotion Checkpoint
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/agent/deep-research.md`
- Priority: should-have
- Description: Ralph treats reusable learnings as something to promote into an always-read file immediately. `system-spec-kit` already has better destination surfaces, especially constitutional guidance, but lacks an explicit "promote to memory/reference/constitutional" decision after each iteration. Adding that checkpoint would make important research findings easier to operationalize. [SOURCE: external/prompt.md:50-74] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-68]
- Evidence: [SOURCE: external/CLAUDE.md:47-71] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:83-89]

### Finding F-007 — Prototype a Thin Shell Wrapper, Not a New Runtime
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/spec/fresh-loop.sh`
- Priority: nice-to-have
- Description: Ralph shows the ergonomic value of a tiny visible wrapper around an autonomous loop. `system-spec-kit` should only copy that idea as a thin shell over existing validated commands, not as a replacement for the current Markdown/YAML/lineage stack. [SOURCE: external/ralph.sh:7-35] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-174]
- Evidence: [SOURCE: external/README.md:122-145] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:96-207]

### Finding F-008 — Document Ralph as a Complementary Overlay
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: nice-to-have
- Description: The safest synthesis is to present Ralph-style execution as a complement to current `system-spec-kit` capabilities: use it to sharpen task sizing, restart clarity, and lightweight run control, but not to replace semantic memory or lifecycle governance. A short user-facing note would help future packet work stay consistent with that boundary. [SOURCE: phase-research-prompt.md:19-29] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-129]
- Evidence: [SOURCE: external/README.md:163-169] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-154]

### Phase 2 Findings

### Finding F-009 — Separate Documentation Depth From Execution Grain
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- Priority: should-have
- Description: Ralph does not invalidate Level 1/2/3+ documentation. It shows that documentation depth and autonomous execution grain are separate decisions. `system-spec-kit` should keep the level model, but explicitly state that task sizing rules, not level escalation, determine what one autonomous run should attempt. [SOURCE: external/README.md:90-130] [SOURCE: external/skills/ralph/SKILL.md:46-64] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:60-73]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:19-26] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:793-800]

### Finding F-010 — Refactor Continuity Into Bridge vs Archive Layers
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`
- Priority: must-have
- Description: `system-spec-kit` should add a first-class lightweight execution bridge for the next autonomous run instead of asking archival memory and handover surfaces to carry all continuity responsibilities. Keep semantic memory; refactor the boundary around it. [SOURCE: external/prompt.md:18-48] [SOURCE: external/.gitignore:1-7] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:29-74] [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:42-77]

### Finding F-011 — Simplify Narrow Workflow Agent Roles
- Origin iteration: `iteration-013.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Description: Ralph suggests that some `system-spec-kit` role specialization is compensating for workflow-local protocol that could live in command/YAML assets instead. Keep strong capability boundaries, but simplify the long-lived role taxonomy for narrow loops. [SOURCE: external/ralph.sh:7-35] [SOURCE: external/.claude-plugin/plugin.json:2-9] [SOURCE: .opencode/agent/orchestrate.md:95-107]
- Evidence: [SOURCE: .opencode/agent/orchestrate.md:160-177] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-174]

### Finding F-012 — Make Task Evidence the Primary Validation Contract
- Origin iteration: `iteration-014.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Priority: must-have
- Description: The validation center of gravity should move from ever-larger packet checklists toward per-task executable acceptance evidence, with packet validation retained for integrity and safety. Ralph is strict about proof, but its proof stays attached to the story. [SOURCE: external/skills/ralph/SKILL.md:83-116] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-403] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100]
- Evidence: [SOURCE: .opencode/command/spec_kit/implement.md:171-187] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:35-71]

### Finding F-013 — Narrow the Default Operator Path
- Origin iteration: `iteration-015.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: should-have
- Description: `system-spec-kit`'s default operator UX should expose one recommended entrypoint per lifecycle phase and demote memory/admin branches to advanced use. Ralph's biggest UX win is obviousness. [SOURCE: external/README.md:90-130] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-187] [SOURCE: .opencode/command/spec_kit/resume.md:37-141]
- Evidence: [SOURCE: .opencode/command/memory/search.md:53-100] [SOURCE: .opencode/command/memory/manage.md:48-99]

### Finding F-014 — Prototype an Ephemeral Run-State Overlay
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`
- Priority: nice-to-have
- Description: Ralph's gitignored run-state files show a low-risk pattern for loop-local continuity. `system-spec-kit` can adopt that idea as a non-authoritative overlay in `scratch/` or equivalent, feeding richer archival artifacts later. [SOURCE: external/.gitignore:1-7] [SOURCE: external/ralph.sh:42-80]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:20-27] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:173-239]

### Finding F-015 — Use Runtime-Aware Task Sizing
- Origin iteration: `iteration-018.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- Priority: should-have
- Description: The durable rule is not "one context window" but "one independently verifiable unit sized for the weakest supported runtime or explicit handoff behavior." Ralph's own docs show why that phrasing is more stable. [SOURCE: external/skills/ralph/SKILL.md:46-64] [SOURCE: external/README.md:76-86]
- Evidence: [SOURCE: external/skills/prd/SKILL.md:69-92] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:35-71]

### Finding F-016 — Add a Visual Lifecycle Explainer
- Origin iteration: `iteration-019.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: nice-to-have
- Description: Ralph's interactive flowchart is a real UX asset. `system-spec-kit` should add a lifecycle explainer so onboarding is not entirely prose- and checklist-based. [SOURCE: external/README.md:147-159] [SOURCE: external/flowchart/src/App.tsx:37-50]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:15-32] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187]

### Finding F-017 — Expose a Lightweight Workflow Lane
- Origin iteration: `iteration-020.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: should-have
- Description: Phase 2's clearest architecture conclusion is that `system-spec-kit` should expose a lightweight loop lane for narrow execution and keep the current governed lane for knowledge-heavy or high-governance work. This is the cleanest way to absorb Ralph's strengths without discarding current advantages. [SOURCE: external/README.md:132-145] [SOURCE: external/README.md:165-168] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]
- Evidence: [SOURCE: .opencode/command/memory/manage.md:48-99] [SOURCE: .opencode/command/spec_kit/resume.md:37-141]

### Phase 3 Findings

### Finding F-018 — Simplify the Visible Command Map
- Origin iteration: `iteration-021.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: should-have
- Description: `system-spec-kit` should stop presenting the full command taxonomy as the default operator surface. The quick reference should foreground a small recommended lifecycle path and demote advanced commands to a secondary map. [SOURCE: external/README.md:54-86] [SOURCE: external/README.md:88-145] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-130]
- Evidence: [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/resume.md:29-141]

### Finding F-019 — Merge the Visible Lifecycle Front Door
- Origin iteration: `iteration-022.md`
- system-spec-kit target: `.opencode/command/spec_kit/plan.md`
- Priority: should-have
- Description: `plan`, `implement`, and `complete` should remain valid internal stages, but most operators should experience them through one guided front door rather than as three sibling starting choices. [SOURCE: external/README.md:88-130] [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/implement.md:35-120]
- Evidence: [SOURCE: .opencode/command/spec_kit/complete.md:1-4] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-130]

### Finding F-020 — Pull Routine Memory Into the Spec Workflow
- Origin iteration: `iteration-023.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: must-have
- Description: Routine memory save and recovery behavior should feel like part of the spec lifecycle, not like a peer command family. Keep `manage` and `learn` available, but push them into advanced/admin territory. [SOURCE: external/README.md:132-145] [SOURCE: external/README.md:163-168] [SOURCE: .opencode/command/memory/manage.md:72-140]
- Evidence: [SOURCE: .opencode/command/memory/save.md:7-47] [SOURCE: .opencode/command/memory/search.md:53-91] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-589]

### Finding F-021 — Merge Bootstrap, Retrieval, and Continuity Defaults
- Origin iteration: `iteration-025.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Description: `context`, `context-prime`, and `handover` reflect useful internal distinctions, but the default operator-facing model should collapse them into one continuity capability and keep deeper specialization mostly internal. [SOURCE: .opencode/agent/orchestrate.md:95-107] [SOURCE: .opencode/agent/context-prime.md:22-45] [SOURCE: .opencode/agent/handover.md:176-224]
- Evidence: [SOURCE: external/.claude-plugin/plugin.json:2-9] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:21-30]

### Finding F-022 — Make Skill Routing More Implicit
- Origin iteration: `iteration-027.md`
- system-spec-kit target: `.opencode/skill/scripts/skill_advisor.py`
- Priority: should-have
- Description: The skill system should keep specialized knowledge bundles, but common implementation, review, and documentation flows should not require heavy visible Gate 2 ceremony. Skill routing should behave more like an internal default and less like a mandatory operator ritual. [SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16] [SOURCE: .opencode/skill/scripts/skill_advisor.py:83-260] [SOURCE: external/.claude-plugin/plugin.json:2-9]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-617] [SOURCE: external/skills/prd/SKILL.md:15-20]

### Finding F-023 — Add One Coding Front Door
- Origin iteration: `iteration-028.md`
- system-spec-kit target: `.opencode/skill/sk-code-opencode/SKILL.md`
- Priority: nice-to-have
- Description: The repo should expose one coding front door that internally routes to the right standards overlay, rather than asking operators to reason about multiple peer `sk-code-*` surfaces. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-617] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:1-80] [SOURCE: external/.claude-plugin/plugin.json:2-9]
- Evidence: [SOURCE: .opencode/skill/sk-code-web/SKILL.md:1-80] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:1-80]

### Finding F-024 — Redesign the Visible Gate Contract
- Origin iteration: `iteration-029.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- Priority: must-have
- Description: Gate 3 should remain a clear explicit boundary for file-modifying work, but Gate 1 and most Gate 2 logic should move toward implicit defaults and escalation paths. The operator-facing contract should feel lighter even if the internal safety machinery remains rich. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-87] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:5-30] [SOURCE: external/README.md:88-145]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:812-842] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js:83-168]

### Finding F-025 — Add a Guided "Start Work" Front Door
- Origin iteration: `iteration-030.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: should-have
- Description: The repo should add a guided front door that chooses between lightweight and governed lanes, provisions only the needed artifacts, and drives the lifecycle on the operator's behalf while keeping `/spec_kit:resume` as the recovery bridge. [SOURCE: external/README.md:88-130] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:741-804] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:21-45]
- Evidence: [SOURCE: .opencode/command/spec_kit/resume.md:200-223] [SOURCE: .opencode/command/spec_kit/handover.md:195-224]

## 7. Rejected Recommendations

### Rejection R-001 — Do Not Replace Spec Kit Memory With Ralph's Minimal Continuity Model
- Origin iteration: `iteration-002.md`
- Rationale: Ralph's restart model works because its state is intentionally tiny. `system-spec-kit` must preserve richer semantic retrieval, checkpoints, constitutional rules, and handover continuity across broader workflows. Replacing that stack with git plus progress plus PRD state would be a regression. [SOURCE: external/README.md:163-169] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

### Rejection R-002 — Do Not Add `.last-branch` Rotation to Deep Research
- Origin iteration: `iteration-007.md`
- Rationale: Ralph's branch-based archive model solves a simpler contamination problem than `system-spec-kit`'s lineage-aware, phase-aware workflows. Deep research already has archive roots, restart/fork states, and completed-session handling; a second branch-local mechanism would duplicate state. [SOURCE: external/ralph.sh:42-73] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-176]

### Rejection R-003 — Do Not Simplify Deep Loops Toward Ralph's Thin Failure Model
- Origin iteration: `iteration-017.md`
- Rationale: Ralph's failure handling is intentionally thin and relies on manual inspection of `prd.json`, `progress.txt`, and git history. `system-spec-kit`'s richer status taxonomy and recovery behaviors are doing real work that should not be discarded. [SOURCE: external/ralph.sh:90-113] [SOURCE: external/README.md:209-221] [SOURCE: .opencode/agent/deep-research.md:167-199]

### Rejection R-004 — Do Not Replace Spec Folders With Ralph's Minimal Artifact Set
- Origin iteration: `iteration-024.md`
- Rationale: Ralph's PRD-and-stories model is great for narrow loops, but it does not prove that governed, multi-phase work should abandon progressive documentation levels. The right move is gentler onboarding, not removal of the spec-folder model. [SOURCE: external/prd.json.example:2-17] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: external/README.md:170-188]

### Rejection R-005 — Do Not Replace LEAF Deep Loops With Ralph's Shell Runner
- Origin iteration: `iteration-026.md`
- Rationale: Deep research and deep review need append-only evidence state, convergence logic, and progressive synthesis. Ralph's thinner loop is the wrong model for that workflow class. [SOURCE: external/ralph.sh:84-113] [SOURCE: .opencode/agent/deep-research.md:121-205] [SOURCE: .opencode/agent/deep-review.md:124-236]

## 8. Recommendation Themes

### KEEP — Preserve the deeper structures that serve governed or deep-loop work
- Recommendation: Keep the Level 1/2/3+ model and the LEAF deep-loop architecture, but explain them more clearly and stop surfacing their internal mechanics too early. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73] [SOURCE: .opencode/agent/deep-research.md:121-205]

### REFACTOR — Split continuity into execution-bridge and archival-memory layers
- Recommendation: Add a lightweight phase-local run-state artifact for the next autonomous run, and keep Spec Kit Memory as the durable retrieval/archive layer. [SOURCE: external/prompt.md:18-48] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:29-74]

### SIMPLIFY — Shrink the default visible surface
- Recommendation: Narrow the command map, reduce operator-visible skill routing, and keep more complexity internal until the workflow actually needs it. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187] [SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16]

### MERGE — Collapse adjacent lifecycle and continuity concepts
- Recommendation: Merge routine memory behavior into the spec workflow and collapse bootstrap, retrieval, and handover into a smaller continuity model for default usage. [SOURCE: .opencode/command/memory/save.md:7-47] [SOURCE: .opencode/agent/context-prime.md:22-45] [SOURCE: .opencode/agent/handover.md:176-224]

### PIVOT — Expose two lanes instead of one implicitly heavy operator model
- Recommendation: Define a lightweight loop lane for narrow linear execution and keep the current governed lane for retrieval-heavy, multi-phase, or high-governance work. [SOURCE: external/README.md:132-145] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

### REDESIGN — Rebuild the front door and visible gate contract
- Recommendation: Keep the internal safety and continuity machinery, but redesign the operator path around one guided start flow, one hard scope question, and much lighter visible ceremony. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-87] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:5-30]

## 9. Priority Queue
1. Redesign the default operator path around a guided "start work" front door and a smaller visible command map.
2. Pull routine memory save/recovery behavior under the spec lifecycle and demote memory management to advanced use.
3. Refactor continuity into an execution bridge plus archival memory.
4. Make per-task executable acceptance evidence the main validation contract.
5. Merge bootstrap, retrieval, and continuation into a smaller default continuity model.
6. Make Gate 1 and most of Gate 2 more implicit while keeping Gate 3 explicit for file-modifying work.
7. Add one coding front door after the broader surface simplification settles.
8. Add visual lifecycle/onboarding docs once the simplified architecture is stable.

## 10. Cross-Phase Implications
- This research track should still stay differentiated from the sibling deterministic-runtime work. Ralph remains the best external model for lightweight loop architecture and operator-surface reduction, not for deterministic replay or full runtime governance. [SOURCE: phase-research-prompt.md:19-29]
- The practical consequence is architectural: Ralph-derived work should land as overlays on current commands, templates, and recovery surfaces, or as a lightweight lane beside the governed lane, not as a competing third runtime model. [SOURCE: external/README.md:132-145] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-174]
- Phase 3 sharpens the UX consequence: `system-spec-kit` should aggressively simplify what users see without throwing away the deeper machinery that matters for research, review, governance, and recovery. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:741-804] [SOURCE: .opencode/agent/deep-review.md:124-236]

## 11. Recommended Next Step
Prototype the new front door first. Design one guided "start work" flow that chooses a lightweight or governed lane, keeps Gate 3 explicit, embeds routine memory behavior, and hands off into planning or implementation without making the user manually assemble the lifecycle. Then update continuity artifacts and task validation contracts behind that new operator path. [SOURCE: external/README.md:88-130] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187] [SOURCE: .opencode/command/spec_kit/implement.md:171-205]
