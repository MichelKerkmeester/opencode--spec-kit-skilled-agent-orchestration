---
title: "Deep Research [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/research]"
description: "30-iteration research of Ralph for system-spec-kit improvement across architecture, UX, agentic orchestration, commands, and skills. 25 actionable findings, 5 rejected."
trigger_phrases:
  - "deep"
  - "research"
  - "006"
  - "ralph"
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