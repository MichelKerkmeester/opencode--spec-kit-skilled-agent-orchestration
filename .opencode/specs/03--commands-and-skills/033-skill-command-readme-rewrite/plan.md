---
title: "Implementation Plan: Skill and Command README Rewrite"
description: "Batch-rewrite 23 READMEs across 5 batches using readme_creation.md standards, two-tier voice and HVR v0.210 compliance."
trigger_phrases:
  - "readme rewrite plan"
  - "skill readme plan"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Skill and Command README Rewrite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc skill (readme_creation.md + readme_template.md) |
| **Storage** | Git (flat markdown files) |
| **Testing** | HVR compliance check + structural format validation |

### Overview

Rewrite 23 READMEs from scratch in 5 batches. Each README is sourced from its SKILL.md (or command folder contents), structured per readme_template.md Section 14 (Skill type), and written following readme_creation.md workflow and hvr_rules.md v0.210. Batching prevents context exhaustion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] readme_creation.md upgraded (spec 032)
- [x] hvr_rules.md upgraded with v0.210 patterns (spec 032)
- [x] SKILL.md smart routing integrated (spec 032)
- [x] Exemplar READMEs stable (system-spec-kit)

### Definition of Done

- [ ] All 23 READMEs rewritten
- [ ] 0 HVR hard blocker violations
- [ ] All .txt command READMEs converted to .md
- [ ] Old .txt files removed
- [ ] Every README has blockquote tagline, TOC, numbered sections, anchors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Per-README Workflow

For each README:
1. Read the skill's SKILL.md to extract: purpose, features, commands, configuration, usage patterns
2. Write README from scratch using readme_template.md Section 14 scaffold (Skill type)
3. Apply two-tier voice: narrative Features subsection (3.1) + reference subsection (3.2)
4. Add Key Statistics, Key Features and comparison tables in Overview
5. Run HVR pre-publish checklist mentally
6. For command READMEs: write .md, delete old .txt

### Batch 1: CLI Skills (4 files)

| # | File | Source |
|---|------|--------|
| 1 | `cli-claude-code/README.md` | `cli-claude-code/SKILL.md` |
| 2 | `cli-codex/README.md` | `cli-codex/SKILL.md` |
| 3 | `cli-copilot/README.md` | `cli-copilot/SKILL.md` |
| 4 | `cli-gemini/README.md` | `cli-gemini/SKILL.md` |

### Batch 2: MCP Skills (5 files)

| # | File | Source |
|---|------|--------|
| 5 | `mcp-chrome-devtools/README.md` | `mcp-chrome-devtools/SKILL.md` |
| 6 | `mcp-clickup/README.md` | `mcp-clickup/SKILL.md` |
| 7 | `mcp-coco-index/README.md` | `mcp-coco-index/SKILL.md` |
| 8 | `mcp-code-mode/README.md` | `mcp-code-mode/SKILL.md` |
| 9 | `mcp-figma/README.md` | `mcp-figma/SKILL.md` |

### Batch 3: sk-code + sk-doc Skills (5 files)

| # | File | Source |
|---|------|--------|
| 10 | `sk-code--full-stack/README.md` | `sk-code--full-stack/SKILL.md` |
| 11 | `sk-code--opencode/README.md` | `sk-code--opencode/SKILL.md` |
| 12 | `sk-code--review/README.md` | `sk-code--review/SKILL.md` |
| 13 | `sk-code--web/README.md` | `sk-code--web/SKILL.md` |
| 14 | `sk-doc/README.md` | `sk-doc/SKILL.md` |

### Batch 4: Remaining Skills (5 files)

| # | File | Source |
|---|------|--------|
| 15 | `sk-deep-research/README.md` | `sk-deep-research/SKILL.md` |
| 16 | `sk-git/README.md` | `sk-git/SKILL.md` |
| 17 | `sk-prompt-improver/README.md` | `sk-prompt-improver/SKILL.md` |
| 18 | `skill/README.md` (root) | Skill directory structure |
| 19 | `skill/scripts/README.md` | Scripts directory contents |

### Batch 5: Command READMEs (4 files, .txt → .md)

| # | File | Source |
|---|------|--------|
| 20 | `.opencode/command/README.md` | Command directory structure |
| 21 | `.opencode/command/create/README.md` | create/ command contents |
| 22 | `.opencode/command/memory/README.md` | memory/ command contents |
| 23 | `.opencode/command/spec_kit/README.md` | spec_kit/ command contents |

After writing .md files, delete the old .txt files:
- `.opencode/command/README.txt`
- `.opencode/command/create/README.txt`
- `.opencode/command/memory/README.txt`
- `.opencode/command/spec_kit/README.txt`

### Verification (after each batch)

- [ ] Every README has frontmatter (title, description)
- [ ] Every README has blockquote tagline after H1
- [ ] Every README has TOC with double-dash anchors
- [ ] All H2 sections numbered ALL CAPS with anchor markers
- [ ] Features section uses two-tier voice (3.1 narrative, 3.2 reference)
- [ ] Overview has at least one table (statistics, features or comparison)
- [ ] 0 HVR hard blocker words
- [ ] 0 em dashes in prose
- [ ] 0 semicolons
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| readme_creation.md | Internal | Green | Standards undefined |
| readme_template.md | Internal | Green | Scaffold unavailable |
| hvr_rules.md v0.210 | Internal | Green | HVR compliance undefined |
| system-spec-kit/README.md (exemplar) | Internal | Green | Quality target unclear |
| Each skill's SKILL.md | Internal | Green | Content source unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Quality too low or content inaccurate
- **Procedure**: `git checkout -- .opencode/skill/*/README.md .opencode/command/*/README.md .opencode/command/README.md`
<!-- /ANCHOR:rollback -->

---
