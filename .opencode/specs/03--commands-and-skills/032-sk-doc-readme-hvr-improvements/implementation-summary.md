---
title: "Implementation Summary: sk-doc README and HVR Improvements"
description: "Summary of changes to hvr_rules.md, readme_template.md and the new readme_creation.md reference."
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary: sk-doc README and HVR Improvements

<!-- SPECKIT_LEVEL: 2 -->

---

## What Changed

Three sk-doc documentation files were modified or created, HVR rules were expanded with v0.210 patterns, structural format patterns were relocated, SKILL.md smart routing was integrated, and cli-codex skill got flag warnings.

### D1: HVR Rules Upgrade (hvr_rules.md)

**File**: `.opencode/skill/sk-doc/references/global/hvr_rules.md`
**Change**: Modified (332 lines to 551 lines)

Added two new sections and updated existing content:

- **Section 5: Structural Format Patterns** -- Document-level formatting rules: heading hierarchy (H2 numbered ALL CAPS, H3/H4 numbered ALL CAPS for subsections), blockquote tagline after H1, TOC format with double-dash anchors, section dividers, two-tier voice pattern, Feature subsection numbering.
- **Section 6: Recommended Table Patterns** -- Five table patterns: "How This Compares", Key Statistics, Key Features, Before/After and Parameter tables with examples.
- **Updated Section 4** -- Added triple-header pattern fix, "In simple terms" to setup language list, analogy overuse rules (max 1 per concept, max 2 "Think of it as/like" per document, place after technical statement).
- **Updated Section 10 (Pre-Publish Checklist)** -- Added scoring weights (Punctuation 15%, Structure 25%, Content 25%, Words 20%, Voice 15%), pass thresholds (85+ publish-ready, 70-84 needs revision, below 70 failing), structural checklist items.
- **Renumbered** sections 5-9 to 7-11 to accommodate the two new sections.

### D2: README Template Upgrade (readme_template.md)

**File**: `.opencode/skill/sk-doc/assets/documentation/readme_template.md`
**Change**: Modified (2 targeted additions)

- Added cross-reference to `readme_creation.md` in Section 10 (Patterns from Existing READMEs)
- Added `readme_creation.md` link in Section 15 (Related Resources) under Standards

The template already had two-tier voice, numbered subsections, comparison tables and correct heading format. No structural changes needed.

### D3: README Creation Reference (readme_creation.md)

**File**: `.opencode/skill/sk-doc/references/specific/readme_creation.md`
**Change**: Created (388 lines)

New reference file with 8 sections modeled on `install_guide_creation.md`:

1. **Overview** -- Purpose, goals, requirements
2. **Core Principles** -- Decision tree for README types, progressive disclosure, two-tier voice
3. **Required Sections** -- 9-section matrix showing Required/Optional per README type
4. **Section Writing Standards** -- Per-section guidance for all 9 README sections
5. **Writing Patterns** -- Two-tier voice examples, analogy patterns, table-first approach, code block standards
6. **Quality Criteria** -- DQI components (Structure 40%, Content 35%, Style 25%), minimum requirements per section
7. **Pre-Publish Checklist** -- Structure, content, quality, style and HVR compliance checks
8. **Cross-References** -- Links to template, HVR rules, core standards, validation and related creation guides

### Phase 2: v0.210 HVR Pattern Integration

Ported high-value patterns from the Barter HVR v0.210 source into `hvr_rules.md`:

- **Section 4 additions**: Copula avoidance ban, synonym cycling fix, false ranges, generic positive conclusions, fragmented headers, significance inflation, knowledge-cutoff disclaimers
- **Section 5 (new)**: Voice Personality (replaced removed table patterns section). Have opinions, acknowledge complexity, controlled imperfection, emotional specificity, rule precedence (first-match-wins)
- **Section 3 additions**: Quotation marks (straight only), emoji (max 1)
- **Section 7 additions**: 4 new phrase hard blockers ("The real question is", "Here's what you need to know", etc.)
- **Section 8 additions**: "discover" (-2), "put"/"take" (vague verbs), "Let me help you with that" (AI phrase), "undoubtedly" (modifier)
- **Removed**: Section 5 (Structural Format Patterns) and Section 6 (Table Patterns) -- these are documentation formatting, not voice rules
- **Renumbered**: 10 sections total (was 11)

### Phase 3: Structural Patterns Relocation

Moved the removed structural format patterns and table patterns into their proper home:

- **readme_creation.md Section 5**: Added "Structural Format Rules" subsection (heading hierarchy table, blockquote tagline, TOC anchor format, section dividers) and "Recommended Table Patterns" subsection (5 patterns with examples)
- **readme_creation.md Sections 3-4**: Deduplicated by removing the type matrix table and "Must include" lists that repeated readme_template.md content. Replaced with cross-references.

### Phase 4: Smart Router Integration

Integrated `readme_creation.md` into the sk-doc SKILL.md smart routing system:

- **SKILL.md "When to Use"**: README Creation entry now references both files with direct links
- **INTENT_SIGNALS**: Added `README_CREATION` (weight 3, keywords: "create readme", "write readme", "add documentation", "folder readme")
- **RESOURCE_MAP**: Added `README_CREATION` mapping to both `readme_creation.md` and `readme_template.md`
- **ON_DEMAND**: Removed `readme_template.md` (now routed via intent, not ON_DEMAND)

### Phase 5: cli-codex Skill Update

Added prominent flag warning to `cli-codex/SKILL.md` and `cli-codex/assets/prompt_templates.md`:
- `--reasoning`, `--reasoning-effort` and `--quiet` do NOT exist in codex exec
- Correct alternative: `-c model_reasoning_effort="high"` or config.toml default

## Verification

- All files have correct frontmatter, anchors and numbered H2 ALL CAPS sections
- Zero HVR hard blocker words in output files
- All cross-references verified (bidirectional links between hvr_rules.md, readme_creation.md, readme_template.md)
- `install_guide_creation.md` unchanged (no regressions)
- SKILL.md smart router routes "create readme" to both creation workflow and template
- skill_advisor.py already has readme/documentation boosters for Gate 2

## Delegation Note

GPT-5.4 agents via cli-codex were dispatched for the initial implementation but got blocked by Gate 3 (the project's CLAUDE.md intercepted their execution). All deliverables were written directly by Claude instead.
