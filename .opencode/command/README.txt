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
- [2. STRUCTURE](#2--structure)
- [3. COMMAND GROUPS](#3--command-groups)
- [4. USAGE](#4--usage)
- [5. EXECUTION MODES](#5--execution-modes)
- [6. TROUBLESHOOTING](#6--troubleshooting)
- [7. RELATED DOCUMENTS](#7--related-documents)

---

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

Commands are invoked as slash commands (e.g., `/create:skill`, `/memory:save`, `/spec_kit:plan`). Each command is a markdown file with YAML frontmatter that defines its description, argument hints and allowed tools.

Commands are organized into three groups:

| Group | Path | Commands | Purpose |
|-------|------|----------|---------|
| **create** | `command/create/` | 7 | Scaffold OpenCode components and create unified visual HTML artifacts |
| **memory** | `command/memory/` | 6 | Memory system operations (save, knowledge, continue, learn, manage, shared) |
| **spec_kit** | `command/spec_kit/` | 7 | Spec folder workflows (plan, implement, research, debug, handover, resume, complete) |

One standalone command (`agent_router.md`) lives at the root level for routing requests to AI systems.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

```
command/
├── agent_router.md           # Route requests to AI systems
├── create/                   # Component creation commands
│   ├── agent.md              # Create new agent
│   ├── folder_readme.md      # Create folder README
│   ├── install_guide.md      # Create install guide
│   ├── skill.md              # Create new skill
│   ├── skill_asset.md        # Create skill asset file
│   ├── skill_reference.md    # Create skill reference file
│   ├── visual_html.md        # Create or verify visual HTML output
│   └── assets/               # YAML workflow definitions (14 files)
├── memory/                   # Memory system commands
│   ├── analyze.md          # Unified retrieval + analysis (intent-aware search, epistemic, causal, eval)
│   ├── continue.md           # Session recovery
│   ├── learn.md              # Constitutional memory manager
│   ├── manage.md             # Database management operations
│   ├── save.md               # Save conversation context
│   └── shared.md             # Shared-memory space lifecycle
└── spec_kit/                 # Spec folder workflow commands
    ├── complete.md           # Full end-to-end workflow
    ├── debug.md              # Debug delegation
    ├── handover.md           # Session handover
    ├── implement.md          # Execute pre-planned work
    ├── plan.md               # Spec through plan only
    ├── research.md           # Technical investigation
    ├── resume.md             # Resume existing spec work
    └── assets/               # YAML workflow definitions (13 files)
```

---

<!-- /ANCHOR:structure -->
<!-- ANCHOR:command-groups -->
## 3. COMMAND GROUPS

### Create Commands

Scaffold OpenCode components using the `sk-doc` skill. Each command supports `:auto` and `:confirm` execution modes with corresponding YAML workflow files in `create/assets/`.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Agent | `/create:agent <name>` | Create agent with frontmatter, tool permissions, behavioral rules |
| Folder README | `/create:folder_readme <path>` | Create AI-optimized README with TOC and structure |
| Install Guide | `/create:install_guide <name>` | Create phase-based installation documentation |
| Skill | `/create:skill <name>` | Create skill with SKILL.md, references, assets, scripts |
| Skill Asset | `/create:skill_asset <skill> <type>` | Create asset file for existing skill |
| Skill Reference | `/create:skill_reference <skill> <type>` | Create reference file for existing skill |
| Visual HTML | `/create:visual_html <target> --mode <auto\|create\|analyze\|verify\|custom>` | Unified visual command with broad intent-based routing |

### Memory Commands

Manage the Spec Kit Memory system for context preservation across sessions.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Analyze | `/memory:analyze <query>` or `/memory:analyze <subcommand>` | Unified retrieval + analysis (intent-aware search, epistemic, causal, eval) |
| Continue | `/memory:continue` | Recover session from crash, compaction, or timeout |
| Learn | `/memory:learn [rule] \| list \| edit \| remove \| budget` | Create and manage constitutional memories |
| Manage | `/memory:manage <subcommand>` | Database operations (scan, cleanup, tier, health, checkpoint) |
| Save | `/memory:save <spec-folder>` | Save conversation context with semantic indexing |
| Shared | `/memory:shared <subcommand>` | Shared-memory space lifecycle (create, membership, status) |

### Spec Kit Commands

Structured workflows for the spec folder development lifecycle.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Complete | `/spec_kit:complete <description>` | Full end-to-end workflow (14+ steps) |
| Debug | `/spec_kit:debug [spec-folder]` | Delegate debugging to specialized sub-agent |
| Handover | `/spec_kit:handover [spec-folder]` | Create session handover for continuation |
| Implement | `/spec_kit:implement <spec-folder>` | Execute pre-planned work (requires plan.md) |
| Plan | `/spec_kit:plan <description>` | Planning workflow (spec through plan only) |
| Research | `/spec_kit:research <topic>` | Technical investigation and documentation |
| Resume | `/spec_kit:resume [spec-folder]` | Resume work on existing spec folder |

---

<!-- /ANCHOR:command-groups -->
<!-- ANCHOR:usage -->
## 4. USAGE

### Basic Invocation

```
/create:skill my-new-skill "Description of what it does"
/create:visual_html "specs/007-auth/plan.md" --mode analyze
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

---

<!-- /ANCHOR:usage -->
<!-- ANCHOR:execution-modes -->
## 5. EXECUTION MODES

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

---

<!-- /ANCHOR:execution-modes -->
<!-- ANCHOR:troubleshooting -->
## 6. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Command not recognized | Wrong invocation format | Use `/<group>:<command>` format (e.g., `/memory:save`) |
| Agent router command not found | Used `/agents` or `/agents_router` alias | Use `/agent_router "<request>"` |
| Missing arguments error | Required argument not provided | Check the `argument-hint` in the command's frontmatter |
| YAML workflow not found | Missing asset file | Verify `assets/` folder contains the corresponding YAML |
| Tool permission denied | Command lacks required tool | Check `allowed-tools` in command frontmatter |
| Agent router has no request | Empty arguments passed | Provide an explicit request string |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related-documents -->
## 7. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [AGENTS.md](../../AGENTS.md) | Framework defining gates, protocols, agent routing |
| [sk-doc SKILL.md](../.opencode/skill/sk-doc/SKILL.md) | Documentation standards and component creation |
| [system-spec-kit SKILL.md](../.opencode/skill/system-spec-kit/SKILL.md) | Spec folder workflow and memory system |
<!-- /ANCHOR:related-documents -->
