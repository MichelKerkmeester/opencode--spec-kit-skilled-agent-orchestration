---
title: "OpenCode Commands"
description: "Slash commands for OpenCode providing structured workflows for component creation, memory management, and spec kit operations."
trigger_phrases:
  - "opencode commands"
  - "slash commands"
  - "command reference"
  - "available commands"
---

# OpenCode Commands

> Slash commands that provide structured workflows for component creation, memory management, and spec kit operations.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PURPOSE](#2--purpose)
- [3. STRUCTURE](#3--structure)
- [4. COMMAND GROUPS](#4--command-groups)
- [5. INSTRUCTIONS](#5--instructions)
- [6. USAGE](#6--usage)
- [7. EXECUTION MODES](#7--execution-modes)
- [8. FAQ](#8--faq)
- [9. TROUBLESHOOTING](#9--troubleshooting)
- [10. RELATED DOCUMENTS](#10--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Commands are invoked as slash commands (e.g., `/create:feature-catalog`, `/memory:save`, `/spec_kit:plan`). Each command is a markdown file with YAML frontmatter that defines its description, argument hints, and allowed tools.

Commands are organized into three groups:

| Group | Path | Commands | Purpose |
|-------|------|----------|---------|
| **create** | `command/create/` | 7 | Scaffold OpenCode components, documentation packages, prompt artifacts, and changelogs |
| **memory** | `command/memory/` | 4 | Memory system operations (search, save, learn, manage with shared lifecycle) |
| **spec_kit** | `command/spec_kit/` | 9 | Spec folder workflows (plan, implement, deep-research, deep-review, debug, handover, resume, complete, phase) |

One standalone command (`agent_router.md`) lives at the root level for routing requests to AI systems.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:purpose -->
## 2. PURPOSE

Use this document as the top-level routing reference for the OpenCode slash-command surface. It explains which command group owns which workflow and points readers to the canonical sub-index for deeper command-family detail.

This file is descriptive only. The executable contract for any workflow lives in the command entrypoint markdown file itself.

<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
command/
├── agent_router.md           # Route requests to AI systems
├── create/                   # Component creation commands
│   ├── agent.md              # Create new agent
│   ├── changelog.md          # Create changelog entry
│   ├── feature-catalog.md    # Create or update feature catalog package
│   ├── folder_readme.md      # Create folder README
│   ├── prompt.md             # Create or improve prompts
│   ├── sk-skill.md           # Create or update skill package/files
│   ├── testing-playbook.md   # Create or update manual testing playbook package
│   └── assets/               # YAML workflow definitions
├── memory/                   # Memory system commands
│   ├── search.md            # Unified retrieval + analysis (intent-aware search, epistemic, causal, eval)
│   ├── learn.md              # Constitutional memory manager
│   ├── manage.md             # Database management, ingest, and shared lifecycle
│   ├── save.md               # Save conversation context
│   └── README.txt            # Memory command index
└── spec_kit/                 # Spec folder workflow commands
    ├── complete.md           # Full end-to-end workflow
    ├── debug.md              # Debug delegation
    ├── handover.md           # Session handover
    ├── implement.md          # Execute pre-planned work
    ├── deep-research.md      # Iterative deep research workflow
    ├── deep-review.md        # Iterative code review workflow
    ├── phase.md              # Parent/child phase decomposition
    ├── plan.md               # Spec through plan only
    ├── resume.md             # Resume existing spec work
    └── assets/               # YAML workflow definitions (15 files)
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:command-groups -->
## 4. COMMAND GROUPS

### Create Commands

Scaffold OpenCode components using the `sk-doc` skill. Each command supports `:auto` and `:confirm` execution modes with corresponding YAML workflow files in `create/assets/`.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Agent | `/create:agent <name>` | Create agent with frontmatter, tool permissions, behavioral rules |
| Folder README | `/create:folder_readme [readme\|install] <target>` | Unified README and install guide workflow |
| Feature Catalog | `/create:feature-catalog <skill> [create\|update]` | Create or update a rooted `feature_catalog/` package |
| Testing Playbook | `/create:testing-playbook <skill> [create\|update]` | Create or update a rooted `manual_testing_playbook/` package |
| Skill | `/create:sk-skill <name> <operation> [type]` | Unified skill create/update/reference/asset workflow |
| Prompt | `/create:prompt <prompt-text-or-flags>` | Create or improve prompts through `sk-prompt-improver` |
| Changelog | `/create:changelog <spec-folder-or-component>` | Create a changelog entry from recent work |

### Memory Commands

Manage the Spec Kit Memory system for context preservation across sessions.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Search | `/memory:search <query>` or `/memory:search <subcommand>` | Unified retrieval + analysis (intent-aware search, epistemic, causal, eval) |
| Learn | `/memory:learn [rule] \| list \| edit \| remove \| budget` | Create and manage constitutional memories |
| Manage | `/memory:manage <subcommand>` | Database operations plus shared-memory lifecycle (`scan`, `cleanup`, `tier`, `health`, `checkpoint`, `ingest`, `shared ...`) |
| Save | `/memory:save <spec-folder>` | Save conversation context with semantic indexing |

### Spec Kit Commands

Structured workflows for the spec folder development lifecycle.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Complete | `/spec_kit:complete <description>` | Full end-to-end workflow (14+ steps) |
| Debug | `/spec_kit:debug [spec-folder]` | Delegate debugging to specialized sub-agent |
| Handover | `/spec_kit:handover [spec-folder]` | Create session handover for continuation |
| Implement | `/spec_kit:implement <spec-folder>` | Execute pre-planned work (requires plan.md) |
| Plan | `/spec_kit:plan <description>` | Planning workflow (spec through plan only) |
| Deep Research | `/spec_kit:deep-research <topic> [:auto\|:confirm]` | Iterative technical investigation with convergence |
| Deep Review | `/spec_kit:deep-review <target> [:auto\|:confirm]` | Iterative code review with severity-weighted findings |
| Plan (with phases) | `/spec_kit:plan <description> :with-phases [--phases N]` | Phase decomposition integrated into plan workflow |
| Resume | `/spec_kit:resume [spec-folder]` | Resume work on existing spec folder |

<!-- /ANCHOR:command-groups -->

---

<!-- ANCHOR:instructions -->
## 5. INSTRUCTIONS

1. Choose the command group that matches your intent: `create`, `memory`, or `spec_kit`.
2. Use the canonical slash-command form `/<group>:<command>` unless the command is a top-level utility such as `/agent_router`.
3. Prefer the unified commands over historical split commands.
4. When a command supports `:auto` and `:confirm`, pick the mode that matches how much checkpointing you want.
5. Follow the family-specific index under `command/<group>/README.md` when you need detailed routing help.

<!-- /ANCHOR:instructions -->

---

<!-- ANCHOR:usage -->
## 6. USAGE

### Basic Invocation

```
/create:feature-catalog system-spec-kit create :confirm
/create:testing-playbook system-spec-kit update :auto
/create:sk-skill my-new-skill full-create :auto
/memory:save specs/007-feature
/spec_kit:plan "Add user authentication" :auto
```

### With Execution Modes

```
# Auto mode: execute without approval prompts
/spec_kit:complete "Add dark mode" :auto

# Confirm mode: pause at each step for approval
/create:agent my-agent :confirm

# With research phase
/spec_kit:complete "New feature" :with-research

# With auto-debug on failure
/spec_kit:complete "Fix auth" :auto-debug
```

### Agent Router

```
# Route a request through intelligent agent selection
# Use the exact command name (not /agents or /agents_router)
/agent_router "Build a new authentication system"
```

<!-- /ANCHOR:usage -->

---

<!-- ANCHOR:execution-modes -->
## 7. EXECUTION MODES

Most commands in `create/` and `spec_kit/` support two execution modes controlled by a suffix argument.

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

Each mode maps to a separate YAML workflow file in the command's `assets/` folder:
- Auto: `<command>_auto.yaml`
- Confirm: `<command>_confirm.yaml`

The `spec_kit:complete` command supports two additional modes:
- `:with-research` adds a research phase before planning
- `:auto-debug` enables automatic debug delegation on failure

<!-- /ANCHOR:execution-modes -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: What is the difference between `:auto` and `:confirm` mode?**

A: `:auto` runs all steps in sequence without pausing. `:confirm` stops at each step and waits for your approval before continuing. Use `:auto` when you trust the workflow and want speed. Use `:confirm` when you want to review or adjust each step before it executes.

**Q: Can I use a command without specifying a mode?**

A: Yes. Most commands fall back to `:confirm` behavior when no mode suffix is given. Check the command's frontmatter for its default if the behavior is unclear.

**Q: When should I use `/spec_kit:plan` instead of `/spec_kit:complete`?**

A: Use `/spec_kit:plan` when you want to produce a spec and plan document for review before any implementation begins. Use `/spec_kit:complete` when you are ready to run the full workflow end-to-end, including implementation.

**Q: How do I recover a session that was interrupted?**

A: Run `/spec_kit:resume`. This loads the most relevant continuation context for the active spec folder, including recent handover state, resume-mode memory retrieval, crash breadcrumbs, and task progress so you can pick up where you left off.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Command not recognized | Wrong invocation format | Use `/<group>:<command>` format (e.g., `/memory:save`) |
| Agent router command not found | Used `/agents` or `/agents_router` alias | Use `/agent_router "<request>"` |
| Missing arguments error | Required argument not provided | Check the `argument-hint` in the command's frontmatter |
| YAML workflow not found | Missing asset file | Verify `assets/` folder contains the corresponding YAML |
| `create` vs `update` mismatch | Target package exists/does not exist as expected | Re-run the command with the matching operation |
| Tool permission denied | Command lacks required tool | Check `allowed-tools` in command frontmatter |
| Agent router has no request | Empty arguments passed | Provide an explicit request string |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 10. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [AGENTS.md](../../AGENTS.md) | Framework defining gates, protocols, agent routing |
| [Create Commands](create/README.md) | Detailed index for all `/create:*` commands |
| [sk-doc SKILL.md](../skill/sk-doc/SKILL.md) | Documentation standards and component creation |
| [system-spec-kit SKILL.md](../skill/system-spec-kit/SKILL.md) | Spec folder workflow and memory system |
| [Memory Commands](memory/README.md) | Memory save, analyze, learn, manage, and shared commands |
| [Spec Kit Commands](spec_kit/README.md) | SpecKit plan, implement, complete, and phase workflows |

<!-- /ANCHOR:related-documents -->
