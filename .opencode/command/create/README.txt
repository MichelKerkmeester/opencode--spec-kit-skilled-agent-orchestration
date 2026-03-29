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
- [8. FAQ](#8--faq)
- [9. TROUBLESHOOTING](#9--troubleshooting)
- [10. RELATED DOCUMENTS](#10--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `create` command group scaffolds OpenCode components, documentation packages, prompt artifacts, and changelog entries. Most commands follow a structured YAML workflow and support `:auto` (no approval prompts) and `:confirm` (pause at each step) execution modes.

Most shipped `create` commands run Phase 0 (@write agent self-verification). `/create:prompt` is the notable exception and uses an inline `@general` workflow instead of `@write` plus YAML assets.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:purpose -->
## 2. PURPOSE

Use this index to understand which `/create:*` command owns a given scaffolding workflow, which argument shape it expects, and which package contract or artifact family it generates.

This document is a routing and reference surface only. Run the command entrypoint itself for execution, setup prompting, and YAML workflow dispatch.

<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:commands -->
## 3. COMMANDS

| Command | Invocation | Description |
|---------|------------|-------------|
| **agent** | `/create:agent <name> [description] [:auto\|:confirm]` | Create a new OpenCode agent with frontmatter, tool permissions, and behavioral rules |
| **folder_readme** | `/create:folder_readme [readme\|install] <target> [flags] [:auto\|:confirm]` | Unified README and install guide creation |
| **feature-catalog** | `/create:feature-catalog <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `feature_catalog/` package using the shipped `sk-doc` contract |
| **testing-playbook** | `/create:testing-playbook <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `manual_testing_playbook/` package using the shipped `sk-doc` contract |
| **sk-skill** | `/create:sk-skill <name> <operation> [type] [--chained] [:auto\|:confirm]` | Unified skill workflow (full-create, full-update, reference-only, asset-only) |
| **prompt** | `/create:prompt <prompt-text-or-flags> [:auto\|:confirm]` | Create or improve prompts through the `sk-prompt-improver` workflow |
| **changelog** | `/create:changelog <spec-folder-or-component> [--bump <major\|minor\|patch\|build>] [:auto\|:confirm]` | Create a changelog entry by detecting recent work, resolving the target component folder, and generating a formatted changelog file |
| **phase (via spec_kit)** | `/spec_kit:plan <feature> :with-phases [--phases N] [--phase-names list] [:auto\|:confirm]` | Phase-aware parent/child spec decomposition integrated into plan/complete workflows |

### README Types

The `readme` operation in `/create:folder_readme` accepts a `--type` flag:

| Type | Use Case |
|------|----------|
| `project` | Root-level project documentation |
| `component` | Reusable module or library |
| `feature` | Specific feature or system |
| `skill` | AI skill supplementary documentation |

<!-- /ANCHOR:commands -->

---

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
└── assets/               # YAML workflow definitions
    ├── create_agent_auto.yaml
    ├── create_agent_confirm.yaml
    ├── create_changelog_auto.yaml
    ├── create_changelog_confirm.yaml
    ├── create_feature_catalog_auto.yaml
    ├── create_feature_catalog_confirm.yaml
    ├── create_folder_readme_auto.yaml
    ├── create_folder_readme_confirm.yaml
    ├── create_sk_skill_auto.yaml
    ├── create_sk_skill_confirm.yaml
    ├── create_testing_playbook_auto.yaml
    └── create_testing_playbook_confirm.yaml
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:instructions -->
## 5. INSTRUCTIONS

1. Pick the command family that matches the artifact you need.
2. Use the canonical command entrypoint, not a deprecated alias.
3. Supply `:auto` for autonomous execution or `:confirm` for checkpointed execution.
4. For rooted documentation packages, use the package-specific commands instead of composing the files manually.
5. If the command performs file modifications, keep it attached to the active spec workflow.

<!-- /ANCHOR:instructions -->

---

<!-- ANCHOR:execution-modes -->
## 6. EXECUTION MODES

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

Each mode loads a separate YAML workflow from `assets/` when that command ships YAML assets:
- Auto: `create_<command>_auto.yaml`
- Confirm: `create_<command>_confirm.yaml`

`/create:prompt` is an inline command document and does not currently have companion YAML workflow files in `assets/`.

The `--chained` flag on `/create:sk-skill` doc-only operations indicates parent workflow handoff.

The documentation-package commands preserve the live `sk-doc` contracts:
- `/create:feature-catalog` produces `feature_catalog/feature_catalog.md` plus numbered category folders
- `/create:testing-playbook` produces `manual_testing_playbook/manual_testing_playbook.md` plus numbered category folders and no sidecar review/ledger files

<!-- /ANCHOR:execution-modes -->

---

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
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: When should I use `create` vs `update` for feature-catalog and testing-playbook commands?**

A: Use `create` when the package folder does not yet exist under the skill root. Use `update` when the package already exists and you want to add or revise content within it. Running `create` on an existing package will produce a conflict error.

**Q: Does `/create:prompt` support YAML workflow assets like the other commands?**

A: No. `/create:prompt` is an inline command that runs entirely within the document itself using an `@general` workflow. It does not load a YAML asset file from `assets/`. All other `create` commands that modify files ship paired YAML assets for `:auto` and `:confirm` modes.

**Q: What does the `--chained` flag do on `/create:sk-skill`?**

A: The `--chained` flag signals that the command was dispatched from a parent workflow (for example, a `full-create` that hands off to a doc-only phase). It changes how the command reports completion and does not affect the output files. Remove it when running the command standalone.

**Q: How does `/create:changelog` determine which version to assign?**

A: The command reads the most recent changelog entry in the target component folder and auto-increments the BUILD segment. Supply `--bump major`, `--bump minor`, or `--bump patch` to override and bump a higher segment. In `:confirm` mode you can also select the version manually during execution.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Phase 0 fails | @write agent not available | Verify agent files exist in the runtime path (`.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, or `.gemini/agents/`) |
| YAML workflow not found | Missing asset file | Check `assets/` contains the matching YAML for operation and mode |
| Skill not found for sk-skill operation | Wrong skill name | Use the exact folder name from `.opencode/skill/` |
| Catalog or playbook update target missing | `update` used before the package exists | Re-run with `create` or point to the correct skill root |
| Playbook scaffolds forbidden sidecar files | Using an outdated package shape | Use `/create:testing-playbook`, which keeps review/orchestration guidance in `manual_testing_playbook.md` |
| `--chained` has no effect | Only meaningful for chained sk-skill doc-only operations | Remove flag when running standalone |
| `changelog` wrong component | File path mapping mismatch | Use `--component` override or select manually in `:confirm` mode |
| `changelog` version conflict | File already exists | Command auto-increments BUILD segment. Specify `--bump` to override |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 10. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.md) | Overview of all command groups |
| [sk-doc SKILL.md](../../skill/sk-doc/SKILL.md) | Templates and standards used by create commands |
| [feature_catalog_creation.md](../../skill/sk-doc/references/specific/feature_catalog_creation.md) | Standards for rooted feature catalog packages |
| [manual_testing_playbook_creation.md](../../skill/sk-doc/references/specific/manual_testing_playbook_creation.md) | Standards for rooted testing playbook packages |
| [agent_template.md](../../skill/sk-doc/assets/agents/agent_template.md) | Agent creation template |
| [command_template.md](../../skill/sk-doc/assets/agents/command_template.md) | Command creation template |
| [skill_creation.md](../../skill/sk-doc/references/specific/skill_creation.md) | Skill creation workflow reference |
| [spec_kit:plan :with-phases](../spec_kit/plan.md) | Phase decomposition integrated into plan workflow |

<!-- /ANCHOR:related-documents -->
