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
| **folder_readme** | `/create:folder_readme <path> [--type <type>] [:auto\|:confirm]` | Create an AI-optimized README.md with TOC, structure, and comprehensive documentation |
| **install_guide** | `/create:install_guide <name> [--platforms <list>] [:auto\|:confirm]` | Create a comprehensive installation guide with step-by-step setup, requirements, and troubleshooting |
| **skill** | `/create:skill <name> [description] [:auto\|:confirm]` | Create a new skill with SKILL.md, references, assets, and scripts |
| **skill_asset** | `/create:skill_asset <skill> <type> [--chained] [:auto\|:confirm]` | Create an asset file (templates, lookups, examples, guides) for an existing skill |
| **skill_reference** | `/create:skill_reference <skill> <type> [--chained] [:auto\|:confirm]` | Create a reference file (deep-dive technical docs, patterns, debugging guides) for an existing skill |
| **changelog** | `/create:changelog <spec-folder-or-component> [--bump <major\|minor\|patch\|build>] [:auto\|:confirm]` | Create a changelog entry by dynamically detecting recent work, resolving the target component folder, and generating a formatted changelog file |
| **visual_html** | `/create:visual_html <target-or-source> [--mode <auto\|create\|analyze\|verify\|custom>] [:auto\|:confirm]` | Unified visual HTML command with broad intent-based routing |
| **phase (via spec_kit)** | `/spec_kit:phase <feature> [--phases N] [--phase-names list] [:auto\|:confirm]` | Phase-aware parent/child spec decomposition used when create workflows detect large multi-domain scope |

### README Types

The `folder_readme` command accepts a `--type` flag:

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
├── folder_readme.md      # /create:folder_readme command
├── install_guide.md      # /create:install_guide command
├── skill.md              # /create:skill command
├── skill_asset.md        # /create:skill_asset command
├── skill_reference.md    # /create:skill_reference command
├── visual_html.md        # /create:visual_html command
└── assets/               # YAML workflow definitions
    ├── create_agent_auto.yaml
    ├── create_agent_confirm.yaml
    ├── create_changelog_auto.yaml
    ├── create_changelog_confirm.yaml
    ├── create_folder_readme_auto.yaml
    ├── create_folder_readme_confirm.yaml
    ├── create_install_guide_auto.yaml
    ├── create_install_guide_confirm.yaml
    ├── create_skill_auto.yaml
    ├── create_skill_confirm.yaml
    ├── create_skill_asset_auto.yaml
    ├── create_skill_asset_confirm.yaml
    ├── create_skill_reference_auto.yaml
    ├── create_skill_reference_confirm.yaml
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

The `--chained` flag on `skill_asset` and `skill_reference` indicates the command was invoked as part of a larger skill creation workflow.

---

<!-- /ANCHOR:execution-modes -->
<!-- ANCHOR:usage-examples -->
## 5. USAGE EXAMPLES

```bash
# Create a new agent in auto mode
/create:agent my-analyzer "Code analysis specialist" :auto

# Create a README for a specific folder
/create:folder_readme .opencode/skill/my-skill --type skill :confirm

# Create a full skill with references and assets
/create:skill my-new-skill "Handles database migrations" :auto

# Add an asset to an existing skill
/create:skill_asset my-skill lookup-table :confirm

# Add a reference doc to an existing skill
/create:skill_reference my-skill debugging-guide :auto

# Create an install guide for multiple platforms
/create:install_guide my-tool --platforms opencode,claude-code :confirm

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
| YAML workflow not found | Missing asset file | Check `assets/` contains the matching YAML for your mode |
| Skill not found for asset/reference | Wrong skill name | Use the exact folder name from `.opencode/skill/` |
| `--chained` has no effect | Only meaningful during skill creation pipeline | Remove flag when running standalone |
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
