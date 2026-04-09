---
title: "Deep Research Report — 006-ralph-main"
description: "10-iteration research of Ralph for system-spec-kit improvement opportunities. 8 actionable findings, 2 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 006-ralph-main

## 1. Executive Summary
- External repo: Ralph, a minimal Bash-driven autonomous coding loop that repeatedly spawns fresh Amp or Claude Code instances and carries state through `prd.json`, `progress.txt`, and git history. [SOURCE: external/README.md:5-6] [SOURCE: external/README.md:122-145]
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 8
- Must-have: 2 | Should-have: 4 | Nice-to-have: 2 | Rejected: 2
- Top 3 adoption opportunities for `system-spec-kit`:
  - Add one-context-window task sizing and verifiable acceptance-criteria rules to template guidance and tasks workflow. [SOURCE: external/skills/ralph/SKILL.md:46-126] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:91-123]
  - Enforce one-task-per-run discipline in `/spec_kit:implement`, not just in plan docs. [SOURCE: external/prompt.md:10-17] [SOURCE: .opencode/command/spec_kit/implement.md:171-201]
  - Enrich current memory saves with lightweight git lineage and add a compact append-only progress layer for long autonomous runs. [SOURCE: external/README.md:165-168] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124]

## 2. External Repo Map

### Structure
- `external/ralph.sh` — the full orchestration loop: argument parsing, archive/reset logic, fresh tool spawn, completion sentinel, max-iteration stop. [SOURCE: external/ralph.sh:7-35] [SOURCE: external/ralph.sh:42-113]
- `external/prompt.md` and `external/CLAUDE.md` — per-iteration execution contracts for Amp and Claude Code. [SOURCE: external/prompt.md:7-17] [SOURCE: external/CLAUDE.md:7-16]
- `external/prd.json.example` — the minimal state machine for ordered stories and `passes` tracking. [SOURCE: external/prd.json.example:1-17]
- `external/skills/ralph/SKILL.md` — rules for story sizing, dependency order, verification, and archiving. [SOURCE: external/skills/ralph/SKILL.md:46-126] [SOURCE: external/skills/ralph/SKILL.md:233-257]
- `external/skills/prd/SKILL.md` — PRD generation discipline that feeds the loop with small, explicit stories. [SOURCE: external/skills/prd/SKILL.md:24-32] [SOURCE: external/skills/prd/SKILL.md:69-92]
- `external/AGENTS.md` — repo-level summary of the same execution model. [SOURCE: external/AGENTS.md:42-47]

### Architecture Diagram
```text
prd.json
   |
   v
ralph.sh ---> prompt.md / CLAUDE.md ---> fresh AI run
   |                                         |
   |<----- <promise>COMPLETE</promise>? -----|
   |
   +--> progress.txt append
   +--> git commit history
   +--> archive/ + .last-branch on feature switch
```

### Main Pattern
Ralph is intentionally narrow: one tiny orchestrator, one story per run, explicit verification, durable state outside the live context window, and a hard bias toward restarting fresh. [SOURCE: external/README.md:161-207] [SOURCE: external/ralph.sh:82-113]

## 3. Findings Registry

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

## 4. Rejected Recommendations

### Rejection R-001 — Do Not Replace Spec Kit Memory With Ralph's Minimal Continuity Model
- Origin iteration: `iteration-002.md`
- Rationale: Ralph's restart model works because its state is intentionally tiny. `system-spec-kit` must preserve richer semantic retrieval, checkpoints, constitutional rules, and handover continuity across broader workflows. Replacing that stack with git plus progress plus PRD state would be a regression. [SOURCE: external/README.md:163-169] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

### Rejection R-002 — Do Not Add `.last-branch` Rotation to Deep Research
- Origin iteration: `iteration-007.md`
- Rationale: Ralph's branch-based archive model solves a simpler contamination problem than `system-spec-kit`'s lineage-aware, phase-aware workflows. Deep research already has archive roots, restart/fork states, and completed-session handling; a second branch-local mechanism would duplicate state. [SOURCE: external/ralph.sh:42-73] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-176]

## 5. Cross-Phase Implications
- This phase should stay differentiated from the sibling deterministic-runtime research track. The brief explicitly reserves this phase for minimal loop mechanics and warns against drifting into richer runtime orchestration. [SOURCE: phase-research-prompt.md:19-29]
- The practical consequence is architectural: Ralph-derived work should land as overlays on existing `system-spec-kit` commands and templates, not as a competing event or replay runtime. [SOURCE: .opencode/command/spec_kit/deep-research.md:115-154]
- Any future prototype wrapper should therefore call existing `system-spec-kit` contracts, inherit current validation/memory behavior, and avoid inventing a second state model. [SOURCE: .opencode/command/spec_kit/deep-research.md:196-210] [SOURCE: .opencode/command/spec_kit/implement.md:195-205]

## 6. Recommended Next Step
Plan the task-sizing change first. Specifically, update `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, the `tasks.md` templates, and `/spec_kit:implement` together so `system-spec-kit` gains Ralph's strongest advantage without adding new runtime complexity. This has the best simplicity-to-impact ratio and unlocks the later progress-log and wrapper ideas cleanly. [SOURCE: external/skills/ralph/SKILL.md:46-126] [SOURCE: .opencode/command/spec_kit/implement.md:171-201]
