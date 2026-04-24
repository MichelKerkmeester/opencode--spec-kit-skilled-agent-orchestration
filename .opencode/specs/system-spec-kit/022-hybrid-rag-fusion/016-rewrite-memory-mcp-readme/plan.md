---
title: "Plan: Rewrite Memory MCP README [system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/plan]"
description: "Implementation plan for a complete rewrite of the MCP server README grounded in the feature catalog and readme template."
trigger_phrases:
  - "plan"
  - "rewrite"
  - "memory"
  - "mcp"
  - "readme"
  - "016"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_LEVEL: 1 -->
# Plan: 016-rewrite-memory-mcp-readme

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
| **Source of truth** | Feature catalog + `tool-schemas.ts` |

### Overview

Complete rewrite of the MCP server README in **simple-terms voice** modeled after `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md`. Two-tier architecture: narrative explanations use analogies and plain language, tool parameter tables stay technical. Research extracts all 33 tools, architecture details, and feature categories from the catalog. Shared memory logic references `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md`. Drafting follows the readme template 9-section structure. Review validates DQI, HVR, and accuracy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (feature catalog, template, tool schemas)

### Definition of Done
- [ ] All 33 tools documented with parameters
- [ ] DQI >= 75 verified by `validate_document.py`
- [ ] No banned HVR words
- [ ] Section structure matches readme template
- [ ] Cross-references to sibling docs verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation rewrite — single output file grounded in multiple source files.

### Key Components
- **Feature catalog**: Authoritative feature inventory (21 categories, 222 features)
- **Simple-terms catalog**: Voice and tone reference (`.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md`)
- **Tool schemas**: Canonical tool definitions (33 tools, L1-L7 layers)
- **Shared memory guide**: `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md` for shared-space documentation
- **README template**: 9-section structure and ordering guide
- **sk-doc HVR**: Voice and word-choice rules

### Data Flow
```
FEATURE_CATALOG.md + tool-schemas.ts → research brief → draft → review → final README.md
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research
- [ ] Extract all 32 tool names, descriptions, and parameters from `tool-schemas.ts`
- [ ] Map all 22 feature categories from the catalog to README sections
- [ ] Identify architecture details: hybrid search, FSRS, 6-tier, 5-state, feature flags
- [ ] Write research brief to `scratch/research-brief.md`

### Phase 2: Draft
- [ ] Write new README from scratch following readme template section order
- [ ] Document all 33 tools with parameters and layer annotations
- [ ] Write newcomer-friendly Overview and Quick Start
- [ ] Add architecture section covering hybrid search pipeline
- [ ] Add configuration, troubleshooting, and FAQ sections

### Phase 3: Review
- [ ] DQI scoring via `validate_document.py`
- [ ] HVR banned-word check
- [ ] Accuracy: verify all 33 tools present, parameters correct
- [ ] Template compliance: section headers match readme template
- [ ] Cross-reference check: links to sibling docs resolve

### Phase 4: Assembly
- [ ] Apply P1 fixes from review
- [ ] Final DQI check
- [ ] Replace current README with rewritten version
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Quality | DQI score >= 75 | `validate_document.py` |
| Compliance | No banned HVR words | grep / sk-doc rules |
| Accuracy | All 33 tools present | Compare against `tool-schemas.ts` |
| Structure | Section headers match template | Manual comparison |
| Links | Cross-references resolve | Path existence check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature catalog | Internal | Green | Cannot ground content without it |
| `tool-schemas.ts` | Internal | Green | Cannot verify tool completeness |
| readme_template.md | Internal | Green | Section structure undefined |
| sk-doc HVR rules | Internal | Green | Cannot validate voice compliance |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: DQI < 75 after two review cycles or major accuracy errors
- **Procedure**: Restore from `README.md.bak` created before rewrite
<!-- /ANCHOR:rollback -->

---

<!--
PLAN: 016-rewrite-memory-mcp-readme
In Progress (2026-03-15)
4-phase: Research → Draft → Review → Assembly
-->
