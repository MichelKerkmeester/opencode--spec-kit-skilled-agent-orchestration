---
title: "Create Commands"
description: "Slash commands for scaffolding OpenCode components, documentation packages, and visual artifacts."
trigger_phrases:
  - "create command"
  - "scaffold component"
  - "create agent"
  - "create skill"
  - "create readme"
  - "create feature catalog"
  - "create testing playbook"
  - "create prompt"
  - "create visual html"
  - "create changelog"
---

# Create Commands

> Slash commands for scaffolding OpenCode components, documentation packages, prompts, changelog entries, and visual artifacts with proper templates and validation.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PURPOSE](#2--purpose)
- [3. COMMANDS](#3--commands)
- [4. STRUCTURE](#4--structure)
- [5. INSTRUCTIONS](#5--instructions)
- [6. EXECUTION MODES](#6--execution-modes)
- [7. USAGE EXAMPLES](#7--usage-examples)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. RELATED DOCUMENTS](#9--related-documents)

---

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `create` command group scaffolds OpenCode components and unifies visual HTML creation under a single command entrypoint. Each command follows a structured YAML workflow and supports `:auto` (no approval prompts) and `:confirm` (pause at each step) execution modes.

Most commands run Phase 0 (@write agent self-verification). The `visual_html` command runs Phase 0 with @general agent verification.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:purpose -->
## 2. PURPOSE

Use this index to understand which `/create:*` command owns a given scaffolding workflow, which argument shape it expects, and which package contract or artifact family it generates.

This document is a routing/reference surface only. Run the command entrypoint itself for execution, setup prompting, and YAML workflow dispatch.

---

<!-- /ANCHOR:purpose -->
<!-- ANCHOR:commands -->
## 3. COMMANDS

| Command | Invocation | Description |
|---------|------------|-------------|
| **agent** | `/create:agent <name> [description] [:auto\|:confirm]` | Create a new OpenCode agent with frontmatter, tool permissions, and behavioral rules |
| **folder_readme** | `/create:folder_readme [readme\|install] <target> [flags] [:auto\|:confirm]` | Unified README + install guide creation |
| **feature-catalog** | `/create:feature-catalog <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `feature_catalog/` package using the shipped `sk-doc` contract |
| **testing-playbook** | `/create:testing-playbook <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `manual_testing_playbook/` package using the shipped `sk-doc` contract |
| **sk-skill** | `/create:sk-skill <name> <operation> [type] [--chained] [:auto\|:confirm]` | Unified skill workflow (full-create, full-update, reference-only, asset-only) |
| **prompt** | `/create:prompt <prompt-text-or-flags> [:auto\|:confirm]` | Create or improve prompts through the `sk-prompt-improver` workflow |
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
## 4. STRUCTURE

```
create/
├── agent.md              # /create:agent command
├── changelog.md          # /create:changelog command
├── feature-catalog.md    # /create:feature-catalog command
├── folder_readme.md      # /create:folder_readme — unified README + install guide command
├── prompt.md             # /create:prompt command
├── sk-skill.md           # /create:sk-skill command
├── testing-playbook.md   # /create:testing-playbook command
├── visual_html.md        # /create:visual_html command
└── assets/               # YAML workflow definitions
    ├── create_agent_auto.yaml
    ├── create_agent_confirm.yaml
    ├── create_changelog_auto.yaml
    ├── create_changelog_confirm.yaml
    ├── create_feature_catalog_auto.yaml
    ├── create_feature_catalog_confirm.yaml
    ├── create_folder_readme_auto.yaml
    ├── create_folder_readme_confirm.yaml
    ├── create_prompt_auto.yaml
    ├── create_prompt_confirm.yaml
    ├── create_sk_skill_auto.yaml
    ├── create_sk_skill_confirm.yaml
    ├── create_testing_playbook_auto.yaml
    ├── create_testing_playbook_confirm.yaml
    ├── create_visual_html_auto.yaml
    └── create_visual_html_confirm.yaml
```

---

<!-- /ANCHOR:structure -->
<!-- ANCHOR:instructions -->
## 5. INSTRUCTIONS

1. Pick the command family that matches the artifact you need.
2. Use the canonical command entrypoint, not a deprecated alias.
3. Supply `:auto` for autonomous execution or `:confirm` for checkpointed execution.
4. For rooted documentation packages, use the new package-specific commands instead of composing the files manually.
5. If the command performs file modifications, keep it attached to the active spec workflow.

---

<!-- /ANCHOR:instructions -->
<!-- ANCHOR:execution-modes -->
## 6. EXECUTION MODES

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

Each mode loads a separate YAML workflow from `assets/`:
- Auto: `create_<command>_auto.yaml`
- Confirm: `create_<command>_confirm.yaml`

The `--chained` flag on `/create:sk-skill` doc-only operations indicates parent workflow handoff.

The new documentation-package commands preserve the live `sk-doc` contracts:
- `/create:feature-catalog` -> `feature_catalog/feature_catalog.md` plus numbered category folders
- `/create:testing-playbook` -> `manual_testing_playbook/manual_testing_playbook.md` plus numbered category folders and no sidecar review/ledger files

---

<!-- /ANCHOR:execution-modes -->
<!-- ANCHOR:usage-examples -->
## 7. USAGE EXAMPLES

```bash
# Create a new agent in auto mode
/create:agent my-analyzer "Code analysis specialist" :auto

# Create a README for a specific folder
/create:folder_readme readme .opencode/skill/my-skill --type skill :confirm

# Create a full skill
/create:sk-skill my-new-skill full-create :auto

# Create a rooted feature catalog package
/create:feature-catalog system-spec-kit create :confirm

# Update an existing testing playbook package
/create:testing-playbook system-spec-kit update :auto

# Improve a prompt artifact
/create:prompt $improve "Write a release note prompt for a changelog generator" :confirm

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
## 8. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Phase 0 fails | @write agent not available | Verify agent files exist in the runtime path (`.opencode/agent/`, `.opencode/agent/chatgpt/`, or `.opencode/agent/claude/`) |
| `visual_html` Phase 0 fails | @general agent routing unavailable | Re-run as `@general /create:visual_html ...` |
| YAML workflow not found | Missing asset file | Check `assets/` contains the matching YAML for operation + mode |
| Skill not found for sk-skill operation | Wrong skill name | Use the exact folder name from `.opencode/skill/` |
| Catalog or playbook update target missing | `update` used before the package exists | Re-run with `create` or point to the correct skill root |
| Playbook scaffolds forbidden sidecar files | Using an outdated package shape | Use `/create:testing-playbook`, which keeps review/orchestration guidance in `manual_testing_playbook.md` |
| `--chained` has no effect | Only meaningful for chained sk-skill doc-only operations | Remove flag when running standalone |
| `changelog` wrong component | File path mapping mismatch | Use `--component` override or select manually in :confirm mode |
| `changelog` version conflict | File already exists | Command auto-increments BUILD segment; or specify `--bump` |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
| [sk-doc SKILL.md](../../skill/sk-doc/SKILL.md) | Templates and standards used by create commands |
| [feature_catalog_creation.md](../../skill/sk-doc/references/specific/feature_catalog_creation.md) | Standards for rooted feature catalog packages |
| [manual_testing_playbook_creation.md](../../skill/sk-doc/references/specific/manual_testing_playbook_creation.md) | Standards for rooted testing playbook packages |
| [agent_template.md](../../skill/sk-doc/assets/agents/agent_template.md) | Agent creation template |
| [command_template.md](../../skill/sk-doc/assets/agents/command_template.md) | Command creation template |
| [skill_creation.md](../../skill/sk-doc/references/specific/skill_creation.md) | Skill creation workflow reference |
| [spec_kit:phase](../spec_kit/phase.md) | Phase-aware spec setup workflow for complex features |
<!-- /ANCHOR:related-documents -->
