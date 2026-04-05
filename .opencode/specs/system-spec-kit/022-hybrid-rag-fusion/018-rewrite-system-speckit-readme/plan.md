---
title: "Plan: Rewrite System Spec Kit README [system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/plan]"
description: "Implementation plan for a complete rewrite of the system-spec-kit README."
trigger_phrases:
  - "plan"
  - "rewrite"
  - "system"
  - "spec"
  - "kit"
  - "018"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 1 -->
# Plan: 018-rewrite-system-speckit-readme

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Document type** | README.md (Markdown) |
| **Template** | readme_template.md from sk-doc |
| **Quality standard** | DQI >= 75, HVR compliant |
| **Source of truth** | SKILL.md + feature catalog + command files + templates |

### Overview

Complete rewrite of the Spec Kit README. Research catalogs all skill components (levels, commands, templates, scripts, MCP tools). Drafting follows the readme template with deliberate links to the MCP README for tool details. Review validates DQI, HVR, and cross-reference consistency.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (SKILL.md, feature catalog, commands, templates)

### Definition of Done
- [x] All components documented (levels, memory, tools, commands, templates, scripts)
- [x] DQI >= 75 verified
- [x] No banned HVR words
- [x] Links to MCP README verified
- [x] No content duplication with MCP README
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation rewrite — single output file summarizing a multi-component skill.

### Key Components
- **SKILL.md**: When to use, rules, integration points
- **Feature catalog**: 22 categories, 189 features
- **Command files**: 13 commands (8 spec_kit + 5 memory)
- **Templates**: CORE + ADDENDUM v2.2 architecture
- **Scripts**: Validation, description generation, memory tools

### Data Flow
```
SKILL.md + feature_catalog + commands + templates → research brief → draft → review → final README.md
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research
- [ ] Catalog all skill components from SKILL.md and directory structure
- [ ] Extract documentation level definitions from templates
- [ ] List all 13 commands with descriptions
- [ ] Identify script inventory and validation tools
- [ ] Write research brief to `scratch/research-brief.md`

### Phase 2: Draft
- [ ] Write Overview and Quick Start (what Spec Kit does, how to start)
- [ ] Write Components section (directory structure, key files)
- [ ] Write Documentation Levels section (1-3+ with CORE+ADDENDUM details)
- [ ] Write Memory System section (overview, link to MCP README)
- [ ] Write Commands section (all 13 with descriptions and examples)
- [ ] Write Templates and Scripts sections
- [ ] Write Troubleshooting, FAQ, and Related Resources

### Phase 3: Review
- [ ] DQI scoring
- [ ] HVR compliance check
- [ ] Cross-reference validation (MCP README, root README, SKILL.md)
- [ ] No-duplication check against MCP README

### Phase 4: Assembly
- [ ] Apply review fixes
- [ ] Final DQI check
- [ ] Replace current README
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Quality | DQI score >= 75 | `validate_document.py` |
| Compliance | No banned HVR words | grep / sk-doc rules |
| Accuracy | All 13 commands listed | Compare against command directory |
| Structure | Section headers match template | Manual comparison |
| Links | Cross-references resolve | Path existence check |
| Dedup | No content duplicated from MCP README | Manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP README rewrite (D1) | Internal | In Progress | Must coordinate cross-references |
| SKILL.md | Internal | Green | Primary skill documentation |
| Feature catalog | Internal | Green | Feature grounding |
| Command files | Internal | Green | Command inventory |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: DQI < 75 after two review cycles
- **Procedure**: Restore from `README.md.bak`
<!-- /ANCHOR:rollback -->

---

<!--
PLAN: 018-rewrite-system-speckit-readme
Complete (2026-03-25)
4-phase: Research → Draft → Review → Assembly
-->
