---
title: "Skills Library"
description: "Canonical index of available skills and scripts in .opencode/skill with routing and usage guidance."
trigger_phrases:
  - "skills library"
  - "available skills"
  - "skill overview"
  - "what skills exist"
  - "skill routing"
  - "skill advisor"
  - "available scripts"
---

# Skills Library

> Canonical inventory of available skills, routing behavior and runnable scripts in `.opencode/skill/`.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. SKILLS CATALOG](#4--skills-catalog)
- [5. SKILL STRUCTURE](#5--skill-structure)
- [6. SKILL ROUTING](#6--skill-routing)
- [7. CREATING SKILLS](#7--creating-skills)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The Skills Library contains the current skill set under `.opencode/skill/`. Skills load on demand through Gate 2 routing or explicit invocation.

This folder now has 12 skill folders and one shared scripts folder:

| Item                         | Count        | Notes                                            |
| ---------------------------- | ------------ | ------------------------------------------------ |
| Skill folders                | 12           | Each skill has a `SKILL.md` entry point          |
| Skills with local `scripts/` | 6            | Automation lives close to the skill that owns it |
| Shared routing scripts       | 1 executable | `.opencode/skill/scripts/skill_advisor.py`       |

Skills are not passive references. Each skill contains executable guidance with references, assets or scripts.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

Three fast ways to use this library:

**1. Route with Gate 2**

```bash
python3 .opencode/skill/scripts/skill_advisor.py "rewrite README for skill library" --threshold 0.8
```

**2. Open a skill directly**

```bash
sed -n '1,120p' .opencode/skill/sk-doc/SKILL.md
```

**3. Run skill-local scripts**

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/README.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/README.md --json
```

Loading sequence:

```text
Request -> Route skill -> Load SKILL.md -> Load only needed references/assets/scripts
```

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```text
.opencode/skill/
├── mcp-chrome-devtools/
├── mcp-code-mode/
├── mcp-figma/
├── mcp-gemini-cli/
├── scripts/
├── sk-code/                # Baseline code workflow (optional by repo)
├── sk-code--*/             # Overlay code workflow skills (repo-specific)
├── sk-git/
├── sk-doc/
├── sk-doc-visual/
├── system-spec-kit/
└── README.md
```

### Shared Scripts (`.opencode/skill/scripts/`)

| File               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `skill_advisor.py` | Gate 2 skill routing with confidence scores   |
| `README.md`        | Script usage and integration reference        |
| `SET-UP_GUIDE.md`  | Setup and tuning guide for `skill_advisor.py` |

### Skill-Local Script Entry Points

| Skill                     | Scripts                                                                                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp-code-mode`           | `scripts/update-code-mode.sh`, `scripts/validate_config.py`                                                                                                                       |
| `sk-code` or `sk-code--*` | Overlay-owned scripts vary by repo (for example alignment checks or minification pipelines)                                                                                       |
| `sk-doc`                  | `scripts/init_skill.py`, `scripts/quick_validate.py`, `scripts/package_skill.py`, `scripts/validate_document.py`, `scripts/extract_structure.py`, `scripts/validate_flowchart.sh` |
| `sk-doc-visual`           | `scripts/validate-html-output.sh`, `scripts/check-version-drift.sh`, `scripts/cleanup-output.sh`                                                                                  |
| `system-spec-kit`         | `scripts/spec/create.sh`, `scripts/spec/validate.sh`, `scripts/memory/generate-context.ts`, `scripts/memory/reindex-embeddings.ts`, `scripts/setup/check-prerequisites.sh`        |

For the full `system-spec-kit` script inventory, use `system-spec-kit/scripts/scripts-registry.json`.

<!-- /ANCHOR:structure -->

<!-- ANCHOR:skills-catalog -->
## 4. SKILLS CATALOG

### Core System

#### `system-spec-kit` (v2.2.26.0)

Spec folder workflow, template validation and memory context workflows. This is the base framework for documentation governance.

### Code Workflows

#### `sk-code | sk-code--*` (version varies by repo)

Portable code workflow contract:

- Use `sk-code` as the baseline when available
- Add one overlay skill via `sk-code--*` for repo-specific standards
- Review flow: baseline + one overlay
- Overlay examples: `sk-code--opencode` | `sk-code--web` | `sk-code--full-stack`

#### `sk-git` (v1.0.8.0)

Git workflows for workspace setup, clean commits and branch completion.

### Documentation

#### `sk-doc` (v1.1.2.0)

Documentation quality workflows, HVR enforcement, component templates and validation scripts.

#### `sk-doc-visual` (v1.1.0.0)

Converts terminal output and technical context into styled, self-contained HTML visual artifacts.

### MCP Integrations

#### `mcp-code-mode` (v1.0.7.0)

TypeScript-based orchestration for MCP tools with progressive discovery and type-safe calls.

#### `mcp-chrome-devtools` (v1.0.7.0)

Browser debugging through CLI-first flow with MCP fallback for multi-tool runs.

#### `mcp-figma` (v1.0.7.0)

Figma MCP workflow for file retrieval, image export and component/style extraction.

#### `mcp-gemini-cli` (v1.1.0)

Gemini CLI orchestration for cross-AI task delegation, Google Search grounding, codebase architecture analysis, and parallel code generation.

<!-- /ANCHOR:skills-catalog -->

<!-- ANCHOR:skill-structure -->
## 5. SKILL STRUCTURE

### Recommended Layout

| Path          | Purpose                                       |
| ------------- | --------------------------------------------- |
| `SKILL.md`    | Required entry point and routing logic        |
| `references/` | Focused domain guidance                       |
| `assets/`     | Templates and static support files            |
| `scripts/`    | Optional automation for checks and generation |

### Current Folder Signals

| Skill                     | `references/` | `assets/` | `scripts/` |
| ------------------------- | ------------- | --------- | ---------- |
| `mcp-chrome-devtools`     | Yes           | No        | No         |
| `mcp-code-mode`           | Yes           | Yes       | Yes        |
| `mcp-figma`               | Yes           | Yes       | No         |
| `sk-code` or `sk-code--*` | Varies        | Varies    | Varies     |
| `sk-git`                  | Yes           | Yes       | No         |
| `sk-doc`                  | Yes           | Yes       | Yes        |
| `sk-doc-visual`           | Yes           | Yes       | Yes        |
| `mcp-gemini-cli`          | Yes           | Yes       | No         |
| `system-spec-kit`         | Yes           | Yes       | Yes        |

<!-- /ANCHOR:skill-structure -->

<!-- ANCHOR:skill-routing -->
## 6. SKILL ROUTING

Gate 2 routing is handled by:

```bash
python3 .opencode/skill/scripts/skill_advisor.py "<request>" --threshold 0.8
```

Routing policy:

| Condition           | Action                       |
| ------------------- | ---------------------------- |
| Confidence `>= 0.8` | Skill invocation is required |
| Confidence `< 0.8`  | General approach is allowed  |

Minimal flow:

```text
Request -> skill_advisor.py -> top match + confidence -> invoke or continue
```

<!-- /ANCHOR:skill-routing -->

<!-- ANCHOR:creating-skills -->
## 7. CREATING SKILLS

Use `sk-doc` for skill scaffolding and validation.

Primary references:

- `.opencode/skill/sk-doc/references/skill_creation.md`
- `.opencode/skill/sk-doc/assets/skill/skill_md_template.md`
- `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md`
- `.opencode/skill/sk-doc/assets/skill/skill_asset_template.md`

Typical flow:

```bash
python3 .opencode/skill/sk-doc/scripts/init_skill.py my-skill --path .opencode/skill
python3 .opencode/skill/sk-doc/scripts/quick_validate.py .opencode/skill/<my-skill>/ --json
python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/<my-skill>/
```

<!-- /ANCHOR:creating-skills -->

<!-- ANCHOR:related -->
## 8. RELATED

Framework and routing:

- [Main Framework README](../README.md)
- [AGENTS.md](../../AGENTS.md)
- [Shared Scripts README](scripts/README.md)
- [Skill Advisor Setup](scripts/SET-UP_GUIDE.md)

Skill folders:

- [system-spec-kit](system-spec-kit/)
- `sk-code/` or `sk-code--*/` (repo-specific code baseline and overlays)
- [sk-doc](sk-doc/)
- [sk-git](sk-git/)
- [sk-doc-visual](sk-doc-visual/)
- [mcp-chrome-devtools](mcp-chrome-devtools/)
- [mcp-code-mode](mcp-code-mode/)
- [mcp-figma](mcp-figma/)
- [mcp-gemini-cli](mcp-gemini-cli/)

<!-- /ANCHOR:related -->
