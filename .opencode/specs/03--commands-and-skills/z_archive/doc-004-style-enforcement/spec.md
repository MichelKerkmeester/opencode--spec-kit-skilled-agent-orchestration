---
title: "Spec: Zero-Tolerance Documentation Formatting [004-style-enforcement/spec]"
description: "Despite having comprehensive templates (readme_template.md, skill_md_template.md) and detailed guidelines (sk-doc skill, write agent), documentation is still created w..."
trigger_phrases:
  - "spec"
  - "zero"
  - "tolerance"
  - "documentation"
  - "formatting"
  - "018"
  - "style"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Zero-Tolerance Documentation Formatting

> Eliminate documentation formatting errors through mandatory validation gates, automated template enforcement, and pre-delivery verification.

---

<!-- ANCHOR:problem -->
## Problem Statement

Despite having comprehensive templates (`readme_template.md`, `skill_md_template.md`) and detailed guidelines (sk-doc skill, write agent), documentation is still created with formatting errors:

- Missing TOC sections
- TOC without emojis
- Wrong anchor format (single dash vs double-dash)
- H2 headers missing emojis
- Section numbers inconsistent
- Template structure not followed

**Root Cause Analysis:**

| Cause | Evidence | Impact |
|-------|----------|--------|
| **Header reconstruction from memory** | Write agent §10: "#1 cause of template alignment failures" | Missing emojis, wrong format |
| **Template loading skipped** | No hard gate forcing template read before write | Structure violations |
| **No automated validation** | Manual checklist only, no script enforcement | Human error passes through |
| **Verification at wrong stage** | Validation at end, not during creation | Errors compound |
| **Emoji mapping not machine-readable** | Tables in markdown, not code | Can't auto-check |

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## Scope

### In Scope

1. **Validation Script** - Pre-delivery automated checking
2. **Template Enforcement** - Machine-readable template rules
3. **Write Agent Updates** - Mandatory validation gates
4. **sk-doc Updates** - Enforcement integration

### Out of Scope

- Changing template content (structure is good)
- New document types
- Breaking existing documents

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

| Metric | Current | Target |
|--------|---------|--------|
| README formatting errors | ~30% have issues | <5% |
| Missing H2 emojis | Common | Near-zero |
| Wrong TOC format | Frequent | Near-zero |
| Template alignment | Inconsistent | Automated check |

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:stakeholders -->
## Stakeholders

- **Primary**: AI agents (write, speckit) that create documentation
- **Secondary**: Humans reviewing/using documentation

<!-- /ANCHOR:stakeholders -->
