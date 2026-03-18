---
title: "H2 Emoji Enforcement - Specification [003-h2-emoji-enforcement/spec]"
description: "When creating documentation from templates, H2 section headers were reconstructed from memory instead of copied verbatim, leading to omission of required emojis. The validation ..."
trigger_phrases:
  - "emoji"
  - "enforcement"
  - "specification"
  - "spec"
  - "017"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# H2 Emoji Enforcement - Specification

<!-- ANCHOR:problem -->
## Problem Statement

When creating documentation from templates, H2 section headers were reconstructed from memory instead of copied verbatim, leading to omission of required emojis. The validation system failed to catch this error because:

1. **Incomplete checklist** - Only checked first/last sections for emojis, not ALL H2 headers
2. **No copy-first instruction** - Workflow said "apply template" but didn't mandate copying headers exactly
3. **Warning not blocking** - `extract_structure.py` flagged missing emojis as warnings, not errors
4. **Reconstruction from memory** - AI understood the pattern but rebuilt it imperfectly

### Evidence

**Incident:** README.md created with numbered H2 sections but missing emojis:
```markdown
## 1. OVERVIEW          ← Missing
## 2. QUICK START       ← Missing
## 3. STRUCTURE         ← Missing
...
```

**Expected format (from template):**
```markdown
## 1. OVERVIEW
## 2. QUICK START
## 3. STRUCTURE
...
```

<!-- /ANCHOR:problem -->

---

## Solution Overview

Implement a **"Copy-First, Validate-All"** approach with three layers of defense:

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| **Prevention** | "Copy skeleton first" workflow step | Eliminates reconstruction errors |
| **Detection** | Comprehensive H2 emoji validation | Catches errors if they occur |
| **Blocking** | Make missing emoji a blocking error | Prevents delivery of non-compliant docs |

---

<!-- ANCHOR:scope -->
## Scope

### In Scope

1. **write.md agent** - Add copy-skeleton step, comprehensive checklist, anti-pattern
2. **extract_structure.py** - Make H2 emoji check blocking for template-based documents
3. **sk-doc SKILL.md** - Add document-type emoji requirements table
4. **core_standards.md** - Add H2 emoji as blocking violation

### Out of Scope

- Changes to other agents
- Changes to template files (they're already correct)
- Automated emoji insertion (fix is prevention, not auto-correction)

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

| Criterion | Validation Method |
|-----------|-------------------|
| write.md workflow requires skeleton copy | Manual review of workflow steps |
| extract_structure.py flags missing H2 emoji as error | Run script on test file with missing emoji |
| Checklist fails for template-based docs missing emoji | Run script, verify checklist failure |
| Documentation states emoji requirements per type | Review SKILL.md and core_standards.md |

<!-- /ANCHOR:success-criteria -->

---

## Document Type Emoji Requirements

| Document Type | H2 Emoji | Enforcement | Template |
|---------------|----------|-------------|----------|
| SKILL.md | REQUIRED | Blocking | skill_md_template.md |
| README.md (template-based) | REQUIRED | Blocking | readme_template.md |
| Reference files | REQUIRED | Blocking | skill_reference_template.md |
| Asset files | REQUIRED | Blocking | skill_asset_template.md |
| Install guides | REQUIRED | Blocking | install_guide_template.md |
| Knowledge files | OPTIONAL | Warning | N/A |
| Spec files | OPTIONAL | None | N/A |
| Command files | SEMANTIC ONLY | Warning | command_template.md |

**Template-based detection:** Document has numbered H2 sections (## 1., ## 2., etc.)

---

## Standard Section Emojis

| Section Name | Emoji | Used In |
|--------------|-------|---------|
| OVERVIEW | 📖 | README, SKILL, Reference, Asset |
| QUICK START | 🚀 | README |
| STRUCTURE | 📁 | README |
| FEATURES | ⚡ | README |
| CONFIGURATION | ⚙️ | README, Install Guide |
| USAGE EXAMPLES | 💡 | README |
| TROUBLESHOOTING | 🛠️ | README, Install Guide |
| FAQ | ❓ | README |
| RELATED DOCUMENTS/RESOURCES | 📚 | README, SKILL, Reference, Asset |
| WHEN TO USE | 🎯 | SKILL |
| SMART ROUTING | 🧭 | SKILL |
| HOW IT WORKS | 🔍 | SKILL |
| RULES | 📋 | SKILL |
| SUCCESS CRITERIA | 🏆 | SKILL |
| INTEGRATION POINTS | 🔌 | SKILL |
| ANTI-PATTERNS | 🚫 | Agent |
| CORE WORKFLOW | 🔄 | Agent |
| CAPABILITY SCAN | 🔍 | Agent |

---

## Related Documents

- [write.md](.opencode/agent/write.md) - Write agent to be modified
- [extract_structure.py](.opencode/skill/sk-doc/scripts/extract_structure.py) - Validation script
- [readme_template.md](.opencode/skill/sk-doc/assets/readme_template.md) - Source of truth for README format
- [core_standards.md](.opencode/skill/sk-doc/references/core_standards.md) - Structural standards
