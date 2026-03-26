---
title: "Implementation Plan: sk-doc README and HVR Improvements"
description: "Four-phase plan: research patterns from exemplar READMEs, delegate 3 workstreams to GPT-5.4 agents via cli-codex, Claude reviews and refines all output, then verify."
trigger_phrases:
  - "hvr plan"
  - "readme upgrade plan"
  - "sk-doc improvement plan"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: sk-doc README and HVR Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc skill (reference + asset files) |
| **Storage** | Git (flat markdown files) |
| **Testing** | Manual review + HVR compliance check |

### Overview

Upgrade three sk-doc documentation files by extracting proven patterns from production-quality system-spec-kit READMEs. Work is split into three independent workstreams delegated to GPT-5.4 agents via cli-codex with `high` reasoning effort. Claude reviews all agent output for voice quality, HVR compliance and cross-reference accuracy before acceptance.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (exemplar READMEs exist in repo)
- [x] Source files read and analyzed

### Definition of Done

- [ ] All three deliverables written and reviewed
- [ ] HVR compliance verified (0 hard blockers per file)
- [ ] `skill_reference_template.md` format verified (frontmatter, anchors, numbered H2)
- [ ] Cross-references between files are correct and bidirectional
- [ ] Checklist.md all P0 items marked [x] with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation refactoring with parallel agent delegation.

### Key Components

- **`references/global/hvr_rules.md`** (D1): Cross-cutting writing standards. Referenced by all document creation workflows.
- **`assets/documentation/readme_template.md`** (D2): Copy-paste scaffold for new READMEs. The "what to fill in" artifact.
- **`references/specific/readme_creation.md`** (D3): Workflow and standards guide. The "how to fill it in" artifact. Complements the template.

### Relationship Between D2 and D3

```
readme_creation.md (workflow + standards + quality criteria)
        │
        │ "Use this template"
        ▼
readme_template.md (scaffold with placeholders)
        │
        │ "Follow these writing rules"
        ▼
hvr_rules.md (voice and word-level standards)
```

The creation reference tells you **how** to create a README and **what quality to aim for**. The template gives you **what to fill in**. HVR rules enforce **how to write** the content.

### Data Flow

1. User invokes README creation (via sk-doc or `/create:folder_readme`)
2. AI loads `readme_creation.md` for workflow guidance
3. AI loads `readme_template.md` for the scaffold
4. AI applies `hvr_rules.md` during writing
5. AI runs pre-publish checklist from `readme_creation.md` before finalizing
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research and Brief Preparation (Claude, sequential)

Extract patterns from the three exemplar READMEs into structured briefs for each agent. This phase produces the detailed instructions each GPT agent needs.

**Inputs to analyze:**
- `system-spec-kit/README.md` -- two-tier voice, numbered Feature subsections, comparison tables, analogy patterns, `---` dividers
- `system-spec-kit/mcp_server/README.md` -- narrative/reference split in Features, parameter tables, key statistics, FAQ format
- `system-spec-kit/SHARED_MEMORY_DATABASE.md` -- use cases section, concise overview, role tables, architecture diagrams

**Pattern extraction targets:**

| Pattern Category | Where Found | Apply To |
|-----------------|-------------|----------|
| Two-tier voice (narrative + reference) | mcp_server/README Features 3.1 vs 3.2 | D2 (template), D3 (creation ref) |
| Numbered Feature subsections with `---` dividers | All three READMEs | D2 (template) |
| "How This Compares" tables | system-spec-kit README Overview | D2 (template) |
| Analogy-then-technical pattern | mcp_server/README 3.1.x sections | D1 (HVR rules), D3 (creation ref) |
| Key Statistics table | Both READMEs Overview section | D2 (template) |
| Before/After comparison tables | system-spec-kit README Overview | D2 (template) |
| Structural heading format (H2 ALL CAPS, H3 numbered ALL CAPS, H4 numbered ALL CAPS) | All three READMEs | D1 (HVR rules) |
| Section dividers between Feature subsections | `<!-- divider:N.N -->` or `---` | D2 (template) |
| Blockquote tagline after H1 | All three READMEs | D2 (template) |
| TOC with subsection entries | system-spec-kit README, mcp_server README | D2 (template) |

- [ ] Read and annotate exemplar READMEs
- [ ] Draft agent brief for D1 (HVR rules upgrade)
- [ ] Draft agent brief for D2 (README template upgrade)
- [ ] Draft agent brief for D3 (readme_creation reference)

### Phase 2: Parallel Agent Implementation (3 GPT-5.4 agents via cli-codex)

Dispatch three independent workstreams. Each agent receives a detailed brief with source material, target file, format requirements and specific instructions.

**Agent allocation:**

| Agent | Deliverable | Input Files | Output File |
|-------|------------|-------------|-------------|
| Agent 1 | D1: HVR Rules upgrade | Current `hvr_rules.md`, `skill_reference_template.md`, pattern extraction from Phase 1 | Updated `hvr_rules.md` |
| Agent 2 | D2: README template upgrade | Current `readme_template.md`, exemplar READMEs, pattern extraction from Phase 1 | Updated `readme_template.md` |
| Agent 3 | D3: readme_creation reference | `install_guide_creation.md` (model), `readme_template.md`, `hvr_rules.md`, exemplar READMEs | New `readme_creation.md` |

**Agent instructions (common):**
- Use `codex exec` with `--model gpt-5.4` and `--reasoning high`
- Provide full file content in prompt (no tool calls needed)
- Request output as complete file content
- Specify format requirements explicitly (frontmatter, anchors, numbered sections)

**Agent 1 brief (D1: HVR Rules):**
Add these sections/patterns to `hvr_rules.md`:
1. **Section-level structural patterns** (new section after Section 4): heading format rules (H2 ALL CAPS, H3/H4 numbered ALL CAPS for subsections), TOC format, blockquote tagline after H1, `---` dividers between major sections
2. **Recommended structural patterns** (new section): comparison tables ("How This Compares"), Key Statistics tables, Before/After tables, two-tier voice (narrative + reference)
3. **Scoring calibration** (update Section 8): category weights (punctuation 15%, structure 25%, content 25%, words 20%, voice 15%), pass threshold guidance
4. **Additional banned patterns**: "In simple terms" as setup language, "Think of it as" overuse (max 2 per document), stacked analogies
5. Maintain existing format: frontmatter, numbered H2 ALL CAPS, `<!-- ANCHOR:slug -->` markers

**Agent 2 brief (D2: README template):**
Upgrade `readme_template.md` with these patterns:
1. **Overview section**: Add "How This Compares" table, Key Statistics table, Before/After comparison table patterns. Add Innovation/Differentiator table option.
2. **Features section**: Restructure to show two-tier voice (3.1 narrative, 3.2 reference). Add numbered H3/H4 ALL CAPS subsections with `---` dividers. Show `<!-- divider:N.N -->` markers.
3. **Section deep dives** (Section 5): Update Features guidance with two-tier voice explanation, subsection numbering rules, analogy placement rules.
4. **Style reference** (Section 7): Ensure heading format table matches actual README practice (H3/H4 numbered ALL CAPS for subsections within Features).
5. Keep all existing sections and content. Additions only, no removals.

**Agent 3 brief (D3: readme_creation reference):**
Create `readme_creation.md` modeled on `install_guide_creation.md` structure:
1. **Section 1 OVERVIEW**: Purpose, core philosophy, goals, requirements summary
2. **Section 2 CORE PRINCIPLES**: README type decision tree, progressive disclosure principle, two-tier voice principle
3. **Section 3 REQUIRED SECTIONS**: 9-section structure table with required/optional per README type
4. **Section 4 SECTION WRITING STANDARDS**: Per-section guidance (Overview, Quick Start, Features, Structure, Configuration, Usage Examples, Troubleshooting, FAQ, Related Documents)
5. **Section 5 WRITING PATTERNS**: Two-tier voice, analogy patterns, table-first approach, code block standards, placeholder conventions
6. **Section 6 QUALITY CRITERIA**: DQI components for READMEs (Structure 40%, Content 35%, Style 25%), minimum requirements per section
7. **Section 7 PRE-PUBLISH CHECKLIST**: Structure, content, quality, style and HVR compliance checks
8. **Section 8 CROSS-REFERENCES**: Links to readme_template.md, hvr_rules.md, core_standards.md, validation.md

- [ ] Dispatch Agent 1 (D1: HVR rules)
- [ ] Dispatch Agent 2 (D2: README template)
- [ ] Dispatch Agent 3 (D3: readme_creation)
- [ ] Collect all agent outputs

### Phase 3: Review and Refinement (Claude)

Claude reviews each agent's output for quality. GPT agents are capable at structure but produce AI-sounding prose. Claude focuses on voice refinement.

**Review checklist per deliverable:**
1. **HVR compliance**: Run the pre-publish checklist from hvr_rules.md against the output. Zero hard blockers required.
2. **Format compliance**: Frontmatter present, anchors correct, H2 numbered ALL CAPS, section order matches template.
3. **Voice quality**: Rewrite any passages that sound like GPT (hedging, stacked three-item lists, em dashes, AI enthusiasm words).
4. **Cross-reference accuracy**: All internal links point to real files with correct relative paths.
5. **Content accuracy**: Verify rules and patterns match what the exemplar READMEs actually do.
6. **No duplication**: readme_creation.md references hvr_rules.md and readme_template.md, does not repeat their content.

- [ ] Review Agent 1 output (D1: HVR rules)
- [ ] Review Agent 2 output (D2: README template)
- [ ] Review Agent 3 output (D3: readme_creation)
- [ ] Refine voice and prose in all three files
- [ ] Fix cross-references
- [ ] Write final versions to disk

### Phase 4: Verification (Claude)

- [ ] Verify all files have correct frontmatter, anchors, heading format
- [ ] Verify hvr_rules.md covers structural AND word-level AI tells
- [ ] Verify readme_template.md reflects two-tier voice pattern
- [ ] Verify readme_creation.md covers the full README creation workflow
- [ ] Verify no regressions to install_guide_creation.md
- [ ] Cross-reference links all resolve
- [ ] Update spec folder (tasks.md, checklist.md, implementation-summary.md)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Format compliance | All 3 files | Manual check: frontmatter, anchors, H2 format |
| HVR compliance | All 3 files | Manual check against hvr_rules.md pre-publish checklist |
| Cross-reference validation | All 3 files | Verify every `[link](path)` resolves |
| Content accuracy | All 3 files | Compare rules/patterns against exemplar READMEs |
| Non-regression | install_guide_creation.md | Verify unchanged |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-spec-kit/README.md | Internal (exemplar) | Green | Cannot extract two-tier voice patterns |
| system-spec-kit/mcp_server/README.md | Internal (exemplar) | Green | Cannot extract narrative/reference split |
| system-spec-kit/SHARED_MEMORY_DATABASE.md | Internal (exemplar) | Green | Cannot extract use case patterns |
| install_guide_creation.md | Internal (model) | Green | Cannot model readme_creation.md structure |
| skill_reference_template.md | Internal (format spec) | Green | Cannot verify format compliance |
| cli-codex skill | Internal (delegation) | Green | Fall back to Claude-only implementation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Agent output quality too low to salvage, or changes break existing workflows
- **Procedure**: `git checkout -- .opencode/skill/sk-doc/references/global/hvr_rules.md .opencode/skill/sk-doc/assets/documentation/readme_template.md` and delete `readme_creation.md`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Research) ──► Phase 2 (Parallel Agents) ──► Phase 3 (Review) ──► Phase 4 (Verify)
                           │  │  │
                           │  │  └─ Agent 3: readme_creation.md
                           │  └──── Agent 2: readme_template.md
                           └─────── Agent 1: hvr_rules.md
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research | None | Parallel Agents |
| Parallel Agents | Research | Review |
| Review | Parallel Agents | Verify |
| Verify | Review | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research and Brief Preparation | Low | Claude: analysis + brief drafting |
| Parallel Agent Implementation | Med | 3 GPT-5.4 agents in parallel |
| Review and Refinement | Med | Claude: voice + quality review per file |
| Verification | Low | Claude: format + cross-ref checks |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Current hvr_rules.md backed up (via git)
- [ ] Current readme_template.md backed up (via git)
- [ ] No readme_creation.md exists yet (clean create)

### Rollback Procedure

1. Revert modified files: `git checkout -- .opencode/skill/sk-doc/references/global/hvr_rules.md .opencode/skill/sk-doc/assets/documentation/readme_template.md`
2. Delete new file: `rm .opencode/skill/sk-doc/references/specific/readme_creation.md`
3. Verify: confirm files match pre-change state

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A (documentation-only changes)
<!-- /ANCHOR:enhanced-rollback -->

---
