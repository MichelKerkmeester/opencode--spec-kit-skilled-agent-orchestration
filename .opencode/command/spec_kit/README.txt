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

The `spec_kit` command group manages the full development lifecycle around spec folders. Commands cover planning, implementation, deep-research, debugging, session handover, resumption, and end-to-end workflows.

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
| **debug** | `/spec_kit:debug [spec-folder]` | varies | Delegate debugging to a specialized sub-agent |
| **handover** | `/spec_kit:handover [spec-folder]` | varies | Create session handover document for continuation |
| **resume** | `/spec_kit:resume [spec-folder] [:auto\|:confirm]` | varies | Resume or recover work on an existing spec folder |
| **complete** | `/spec_kit:complete <description> [:auto\|:confirm] [:with-research] [:with-phases] [:auto-debug]` | 14+ | Full end-to-end workflow combining all phases. `:with-phases` adds phase decomposition pre-workflow |

### Command Dependencies

| Command | Requires |
|---------|----------|
| `plan` | Nothing (creates new spec folder) |
| `implement` | Existing `plan.md` in spec folder |
| `deep-research` | Nothing (iterative research with convergence detection) |
| `debug` | Existing spec folder with failing task |
| `handover` | Existing spec folder with work history |
| `resume` | Existing spec folder with saved state or recoverable session context |
| `complete` | Nothing (runs full lifecycle) |

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```text
spec_kit/
├── README.md         # This file, 8-command index and workflow guide
├── complete.md       # /spec_kit:complete - Full end-to-end workflow
├── debug.md          # /spec_kit:debug - Debug delegation
├── handover.md       # /spec_kit:handover - Session handover
├── implement.md      # /spec_kit:implement - Execute planned work
├── plan.md           # /spec_kit:plan - Planning only
├── deep-research.md  # /spec_kit:deep-research - Autonomous deep research loop
├── resume.md         # /spec_kit:resume - Resume existing work
└── assets/           # YAML workflow definitions
    ├── spec_kit_complete_auto.yaml
    ├── spec_kit_complete_confirm.yaml
    ├── spec_kit_debug_auto.yaml
    ├── spec_kit_debug_confirm.yaml
    ├── spec_kit_handover_full.yaml
    ├── spec_kit_implement_auto.yaml
    ├── spec_kit_implement_confirm.yaml
    ├── spec_kit_plan_auto.yaml
    ├── spec_kit_plan_confirm.yaml
    ├── spec_kit_deep-research_auto.yaml
    ├── spec_kit_deep-research_confirm.yaml
    ├── spec_kit_deep-research_review_auto.yaml
    ├── spec_kit_deep-research_review_confirm.yaml
    ├── spec_kit_resume_auto.yaml
    └── spec_kit_resume_confirm.yaml
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
debug (if issues arise, 3+ failed attempts)
    |
    v
handover (preserve context for next session)
    |
    v
resume (continue in new session)
```

The `complete` command combines deep-research, plan, and implement into a single invocation.

### Agent Delegation

| Command | Delegates To |
|---------|-------------|
| plan | @speckit (spec folder creation), @deep-research (optional) |
| implement | @general (code changes), @speckit (documentation) |
| deep-research | @deep-research (iterative investigation) |
| debug | @debug (fresh perspective analysis) |
| handover | @handover (context preservation) |
| resume | Loads memory context, continues from last state |
| phase | @speckit (folder creation), @general (script execution) |
| complete | @deep-research, @speckit, @general as needed |

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
| `:auto-debug` | Automatically delegate to @debug on failure |

Each mode maps to a YAML workflow file in `assets/`:
- Auto: `spec_kit_<command>_auto.yaml`
- Confirm: `spec_kit_<command>_confirm.yaml`
- Handover uses a single file: `spec_kit_handover_full.yaml`

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

# Delegate debugging after repeated failures
/spec_kit:debug specs/012-rate-limiting

# Create handover for session continuation
/spec_kit:handover specs/012-rate-limiting

# Resume work in a new or interrupted session
/spec_kit:resume specs/012-rate-limiting :auto

# Full end-to-end with research and auto-debug
/spec_kit:complete "Add WebSocket support" :auto :with-research :auto-debug
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:faq -->
## 7. FAQ

**Q: What is the difference between `/spec_kit:plan` and `/spec_kit:complete`?**

`/spec_kit:plan` creates the spec folder and plan.md, then stops. It does not implement anything. `/spec_kit:complete` runs the full lifecycle: optional research, planning, and implementation in a single command. Use `plan` when you want to review and adjust the plan before committing to implementation. Use `complete` when you want to run the whole workflow without interruption.

**Q: When should I use `/spec_kit:debug` instead of just fixing the issue directly?**

Use `/spec_kit:debug` after 3 or more failed fix attempts on the same task. The debug command delegates to a specialized sub-agent with a fresh context, which avoids compounding errors from the current session's assumptions. It is also the right choice when the root cause is unclear and you need a structured diagnosis rather than another patch attempt.

**Q: Can I resume a spec folder that was never explicitly handed over?**

Yes. `/spec_kit:resume` loads the best available continuation context for the spec folder regardless of whether a handover document exists. It prefers a fresh `handover.md`, then uses resume-mode memory retrieval, `CONTINUE_SESSION.md`, and anchored search fallbacks when needed. If no saved state is found, the command prompts you to start fresh with `/spec_kit:plan`. Running `/spec_kit:handover` before ending a session improves the quality of what `resume` can recover, but it is not required.

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
| Debug produces no result | No clear failing task to debug | Provide specific error context in the spec folder |
| YAML workflow not found | Missing asset file | Verify `assets/` contains matching YAML for your mode |
| Handover doc is empty | No significant work in session | Ensure you have completed tasks before handover |
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
