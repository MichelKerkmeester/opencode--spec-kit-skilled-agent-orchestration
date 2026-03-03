---
title: "Create Commands"
description: "Slash commands for scaffolding OpenCode components and creating visual HTML artifacts."
trigger_phrases:
  - "create command"
  - "scaffold component"
  - "create agent"
  - "create skill"
  - "create readme"
  - "create visual html"
  - "create changelog"
---

# Create Commands

> Slash commands for scaffolding OpenCode components with proper structure, templates, validation, and visual HTML delivery.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. COMMANDS](#2--commands)
- [3. STRUCTURE](#3--structure)
- [4. EXECUTION MODES](#4--execution-modes)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. TROUBLESHOOTING](#6--troubleshooting)
- [7. RELATED DOCUMENTS](#7--related-documents)

---

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `create` command group scaffolds OpenCode components and unifies visual HTML creation under a single command entrypoint. Each command follows a structured YAML workflow and supports `:auto` (no approval prompts) and `:confirm` (pause at each step) execution modes.

Most commands run Phase 0 (@write agent self-verification). The `visual_html` command runs Phase 0 with @general agent verification.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Invocation | Description |
|---------|------------|-------------|
| **agent** | `/create:agent <name> [description] [:auto\|:confirm]` | Create a new OpenCode agent with frontmatter, tool permissions, and behavioral rules |
| **folder_readme** | `/create:folder_readme [readme\|install] <target> [flags] [:auto\|:confirm]` | Unified README + install guide creation |
| **sk-skill** | `/create:sk-skill <name> <operation> [type] [--chained] [:auto\|:confirm]` | Unified skill workflow (full-create, full-update, reference-only, asset-only) |
| **changelog** | `/create:changelog <spec-folder-or-component> [--bump <major\|minor\|patch\|build>] [:auto\|:confirm]` | Create a changelog entry by dynamically detecting recent work, resolving the target component folder, and generating a formatted changelog file |
| **visual_html** | `/create:visual_html <target-or-source> [--mode <auto\|create\|analyze\|verify\|custom>] [:auto\|:confirm]` | Unified visual HTML command with broad intent-based routing |
| **phase (via spec_kit)** | `/spec_kit:phase <feature> [--phases N] [--phase-names list] [:auto\|:confirm]` | Phase-aware parent/child spec decomposition used when create workflows detect large multi-domain scope |

### README Types

The `readme` operation in `/create:folder_readme` accepts a `--type` flag:

| Type | Use Case |
|------|----------|
| `project` | Root-level project documentation |
| `component` | Reusable module or library |
| `feature` | Specific feature or system |
| `skill` | AI skill supplementary documentation |

---

<!-- /ANCHOR:commands -->
<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
create/
├── agent.md              # /create:agent command
├── changelog.md          # /create:changelog command
├── folder_readme.md      # /create:folder_readme — unified README + install guide command
├── sk-skill.md           # /create:sk-skill command
├── visual_html.md        # /create:visual_html command
└── assets/               # YAML workflow definitions
    ├── create_agent_auto.yaml
    ├── create_agent_confirm.yaml
    ├── create_changelog_auto.yaml
    ├── create_changelog_confirm.yaml
    ├── create_folder_readme_auto.yaml
    ├── create_folder_readme_confirm.yaml
    ├── create_sk_skill_auto.yaml
    ├── create_sk_skill_confirm.yaml
    ├── create_visual_html_auto.yaml
    └── create_visual_html_confirm.yaml
```

---

<!-- /ANCHOR:structure -->
<!-- ANCHOR:execution-modes -->
## 4. EXECUTION MODES

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

Each mode loads a separate YAML workflow from `assets/`:
- Auto: `create_<command>_auto.yaml`
- Confirm: `create_<command>_confirm.yaml`

The `--chained` flag on `/create:sk-skill` doc-only operations indicates parent workflow handoff.

---

<!-- /ANCHOR:execution-modes -->
<!-- ANCHOR:usage-examples -->
## 5. USAGE EXAMPLES

```bash
# Create a new agent in auto mode
/create:agent my-analyzer "Code analysis specialist" :auto

# Create a README for a specific folder
/create:folder_readme readme .opencode/skill/my-skill --type skill :confirm

# Create a full skill
/create:sk-skill my-new-skill full-create :auto

# Add a reference doc to an existing skill
/create:sk-skill my-skill reference-only debugging :confirm

# Create an install guide for multiple platforms
/create:folder_readme install my-tool --platforms opencode,claude-code :confirm

# Create a changelog from a completed spec folder
/create:changelog .opencode/specs/01--system-spec-kit/042-memory-upgrade :auto

# Create a changelog for a specific component
/create:changelog sk-doc --bump minor :confirm

# Generate a visual HTML artifact from a spec plan
/create:visual_html specs/007-auth/plan.md --mode analyze :auto
```

---

<!-- /ANCHOR:usage-examples -->
<!-- ANCHOR:troubleshooting -->
## 6. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Phase 0 fails | @write agent not available | Verify agent files exist in the runtime path (`.opencode/agent/`, `.opencode/agent/chatgpt/`, or `.opencode/agent/claude/`) |
| `visual_html` Phase 0 fails | @general agent routing unavailable | Re-run as `@general /create:visual_html ...` |
| YAML workflow not found | Missing asset file | Check `assets/` contains the matching YAML for operation + mode |
| Skill not found for sk-skill operation | Wrong skill name | Use the exact folder name from `.opencode/skill/` |
| `--chained` has no effect | Only meaningful for chained sk-skill doc-only operations | Remove flag when running standalone |
| `changelog` wrong component | File path mapping mismatch | Use `--component` override or select manually in :confirm mode |
| `changelog` version conflict | File already exists | Command auto-increments BUILD segment; or specify `--bump` |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related-documents -->
## 7. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
| [sk-doc SKILL.md](../../skill/sk-doc/SKILL.md) | Templates and standards used by create commands |
| [agent_template.md](../../skill/sk-doc/assets/agents/agent_template.md) | Agent creation template |
| [command_template.md](../../skill/sk-doc/assets/agents/command_template.md) | Command creation template |
| [skill_creation.md](../../skill/sk-doc/references/skill_creation.md) | Skill creation workflow reference |
| [spec_kit:phase](../spec_kit/phase.md) | Phase-aware spec setup workflow for complex features |
<!-- /ANCHOR:related-documents -->
