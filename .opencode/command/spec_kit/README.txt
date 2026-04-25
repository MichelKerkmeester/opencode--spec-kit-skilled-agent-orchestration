---
title: "Spec Kit Commands"
description: "Slash commands for the spec folder development lifecycle including planning, implementation, deep-research, debugging, handover, resumption, and interrupted-session recovery."
trigger_phrases:
  - "spec kit command"
  - "spec kit plan"
  - "spec kit implement"
  - "spec kit deep-research"
  - "spec kit debug"
  - "spec kit handover"
  - "spec kit resume"
  - "spec kit deep-review"
  - "spec kit phase"
  - "spec kit complete"
---

# Spec Kit Commands

> Slash commands for the spec folder development lifecycle from planning through completion.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. COMMANDS](#2--commands)
- [3. STRUCTURE](#3--structure)
- [4. WORKFLOW PROGRESSION](#4--workflow-progression)
- [5. EXECUTION MODES](#5--execution-modes)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. FAQ](#7--faq)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `spec_kit` command group manages the full development lifecycle around spec folders. Commands cover planning, implementation, deep-research, resumption, and end-to-end workflows.

Each command loads a YAML workflow from `assets/` and executes it step by step. Most commands support `:auto` and `:confirm` execution modes.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Invocation | Steps | Description |
|---------|------------|-------|-------------|
| **plan** | `/spec_kit:plan <description> [:auto\|:confirm] [:with-phases]` | 7 | Create spec folder and plan without implementation. `:with-phases` adds phase decomposition pre-workflow |
| **implement** | `/spec_kit:implement <spec-folder> [:auto\|:confirm]` | 9 | Execute pre-planned work (requires existing plan.md) |
| **deep-research** | `/spec_kit:deep-research <topic> [:auto\|:confirm\|:review\|:review:auto\|:review:confirm]` | iterative | Autonomous deep research loop with convergence detection |
| **deep-review** | `/spec_kit:deep-review <target> [:auto\|:confirm]` | iterative | Autonomous code review loop with severity-weighted findings |
| **resume** | `/spec_kit:resume [spec-folder] [:auto\|:confirm]` | varies | Resume or recover work on an existing spec folder |
| **skill-advisor** | `/spec_kit:skill-advisor [:auto\|:confirm] [--scope=...] [--dry-run] [--skip-tests]` | 5 | Analyze all skills, optimize advisor scoring tables (TOKEN_BOOSTS, PHRASE_BOOSTS, graph-metadata.json), re-index skill graph, validate with tests |
| **plan --intake-only** | `/spec_kit:plan --intake-only [description] [:auto\|:confirm]` | intake-only | Standalone intake that publishes `spec.md`, `description.json`, and `graph-metadata.json` |
| **complete** | `/spec_kit:complete <description> [:auto\|:confirm] [:with-research] [:with-phases]` | 14+ | Full end-to-end workflow combining all phases. `:with-phases` adds phase decomposition pre-workflow |

### Command Dependencies

| Command | Requires |
|---------|----------|
| `plan` | Nothing (creates new spec folder) |
| `implement` | Existing `plan.md` in spec folder |
| `deep-research` | Nothing (iterative research with convergence detection) |
| `deep-review` | Target files or spec folder to review |
| `resume` | Existing spec folder with saved state or recoverable session context |
| `skill-advisor` | Existing `.opencode/skill/*/` skills and built advisor MCP package |
| `complete` | Nothing (runs full lifecycle) |

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```text
spec_kit/
├── README.txt        # This file, 6-command index and workflow guide
├── complete.md       # /spec_kit:complete - Full end-to-end workflow
├── deep-research.md  # /spec_kit:deep-research - Autonomous deep research loop
├── deep-review.md    # /spec_kit:deep-review - Autonomous code review loop
├── implement.md      # /spec_kit:implement - Execute planned work
├── plan.md           # /spec_kit:plan - Planning only (+ `--intake-only` standalone intake)
├── resume.md         # /spec_kit:resume - Resume existing work
├── skill-advisor.md  # /spec_kit:skill-advisor - Optimize advisor scoring + re-index graph
└── assets/           # YAML workflow definitions
    ├── spec_kit_complete_auto.yaml
    ├── spec_kit_complete_confirm.yaml
    ├── spec_kit_deep-research_auto.yaml
    ├── spec_kit_deep-research_confirm.yaml
    ├── spec_kit_deep-review_auto.yaml
    ├── spec_kit_deep-review_confirm.yaml
    ├── spec_kit_implement_auto.yaml
    ├── spec_kit_implement_confirm.yaml
    ├── spec_kit_plan_auto.yaml
    ├── spec_kit_plan_confirm.yaml
    ├── spec_kit_resume_auto.yaml
    ├── spec_kit_resume_confirm.yaml
    ├── spec_kit_skill-advisor_auto.yaml
    └── spec_kit_skill-advisor_confirm.yaml
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:workflow-progression -->
## 4. WORKFLOW PROGRESSION

The typical development lifecycle follows this progression:

```text
deep-research (optional)
    |
    v
plan (create spec folder + plan.md)
    |
    v
phase (optional: decompose into phase children)
    |
    v
implement (execute plan.md tasks)
    |
    v
resume (continue in a new or interrupted session)
```

The `complete` command combines deep-research, plan, and implement into a single invocation.

### Agent Delegation

| Command | Delegates To |
|---------|-------------|
| plan | Main agent owns planning and may reuse the shared intake contract (`../../skill/system-spec-kit/references/intake-contract.md`); @deep-research optional |
| implement | @general (code changes), distributed governance for packet docs |
| deep-research | @deep-research (iterative investigation) |
| deep-review | @deep-review (iterative code audit) |
| resume | Loads memory context, continues from last state |
| phase | Main agent creates packet folders, @general runs scripts as needed |
| complete | @deep-research and @general as needed, with the shared intake contract (`../../skill/system-spec-kit/references/intake-contract.md`) when packet state requires repair |

<!-- /ANCHOR:workflow-progression -->

---

<!-- ANCHOR:execution-modes -->
## 5. EXECUTION MODES

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

The `complete` command supports two additional flags:

| Flag | Effect |
|------|--------|
| `:with-research` | Add research phase before planning |

Each mode maps to a YAML workflow file in `assets/`:
- Auto: `spec_kit_<command>_auto.yaml`
- Confirm: `spec_kit_<command>_confirm.yaml`

<!-- /ANCHOR:execution-modes -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

```bash
# Plan a new feature (creates spec folder + plan.md)
/spec_kit:plan "Add rate limiting to API" :auto

# Implement from an existing plan
/spec_kit:implement specs/012-rate-limiting :confirm

# Deep research a topic before planning
/spec_kit:deep-research "OAuth 2.0 token refresh patterns" :auto

# Decompose a complex feature into phases
/spec_kit:plan:auto "Build hybrid RAG search system" :with-phases --phases 3

# Save continuity before ending a long session
/memory:save specs/012-rate-limiting

# Resume work in a new or interrupted session
/spec_kit:resume specs/012-rate-limiting :auto

# Optimize skill advisor scoring after adding a new skill
/spec_kit:skill-advisor :auto

# Full end-to-end with research
/spec_kit:complete "Add WebSocket support" :auto :with-research
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:faq -->
## 7. FAQ

**Q: What is the difference between `/spec_kit:plan` and `/spec_kit:complete`?**

`/spec_kit:plan` creates the spec folder and plan.md, then stops. It does not implement anything. `/spec_kit:complete` runs the full lifecycle: optional research, planning, and implementation in a single command. Use `plan` when you want to review and adjust the plan before committing to implementation. Use `complete` when you want to run the whole workflow without interruption.

**Q: When should I dispatch `@debug` instead of just fixing the issue directly?**

Dispatch `@debug` via the Task tool after 3 or more failed fix attempts on the same task. The specialist brings a fresh context and a 5-phase methodology, which helps avoid compounding the current session's assumptions when the root cause is still unclear.

**Q: Can I resume a spec folder that was never explicitly saved?**

Yes. `/spec_kit:resume` loads the best available continuation context for the spec folder even if you never wrote a handover entry. The canonical recovery ladder is `handover.md` -> `_memory.continuity` -> canonical spec docs. If one rung is missing, resume continues with the next packet-local source. If no saved state exists anywhere in that ladder, the command prompts you to start fresh with `/spec_kit:plan`. Running `/memory:save` before ending a session still improves the first recovery pass, but it is not required.

**Q: How does `:with-phases` relate to the parent spec folder?**

The `:with-phases` flag on `/spec_kit:plan` or `/spec_kit:complete` creates a parent spec folder and one or more child phase folders under it (e.g., `specs/015-feature/001-phase/`, `specs/015-feature/002-phase/`). Each phase is a self-contained spec folder with its own plan.md, tasks.md, and checklist.md. The parent folder holds the top-level spec.md and coordinates the phases. Use `:with-phases` for work that is too large for a single spec folder or that has clearly sequential milestones.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 8. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Implement fails: "no plan.md" | Spec folder missing plan.md | Run `/spec_kit:plan` first |
| Resume finds no context | No saved memory for spec folder | Start fresh with `/spec_kit:plan` |
| Debug routing unclear | No clear failing task or repeated failure pattern | Dispatch `@debug` via Task tool once failure_count >= 3 and provide specific error context |
| YAML workflow not found | Missing asset file | Verify `assets/` contains matching YAML for your mode |
| Continuity save adds little context | No significant work in session | Use `/memory:save` after meaningful progress or rely on `/spec_kit:resume` ladder |
| Phase creates wrong structure | Incorrect --phases or --phase-names | Verify parent spec folder exists, re-run with correct arguments |
| Complete takes too long | Full lifecycle runs all phases | Use specific commands (plan, implement) for faster execution |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.md) | Overview of all command groups |
| [system-spec-kit SKILL.md](../../skill/system-spec-kit/SKILL.md) | Spec folder workflow, documentation levels, memory system |
| [AGENTS.md](../../../AGENTS.md) | Gate system, agent routing, spec folder requirements |
| [Memory Commands](../memory/README.md) | Memory operations used by spec kit workflows |

<!-- /ANCHOR:related-documents -->
