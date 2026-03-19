---
title: Document Quality Workflows - Mode 1 Reference
description: Execution modes, validation patterns, and phase interactions for Mode 1 document quality workflows.
---

# Document Quality Workflows - Mode 1 Reference

Execution modes, validation patterns, and phase interactions for Mode 1 (Document Quality) workflows.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Are Workflows?

Workflows define the execution patterns and operational modes for the markdown documentation workflow. These workflows orchestrate structure checks, AI-assisted review, and (when desired) content improvement.

**Core Purpose**:
- **Mode selection** - Four execution modes for different use cases
- **Validation workflow** - Post-operation and pre-submission validation patterns
- **Phase orchestration** - Sequential or independent phase execution
- **Error handling** - Graceful degradation with clear error messages

> **📍 Context**: This is a Level 3 reference file (loaded on-demand). For the complete progressive disclosure architecture, see [skill_creation.md § Progressive Disclosure](../specific/skill_creation.md#progressive-disclosure).

This reference provides deep-dive technical guidance on execution modes, validation patterns, and workflow orchestration.

**Scope Note**: This reference covers Mode 1 (Document Quality) workflows only. For other modes, see:
- Mode 2 (Skill Creation): [skill_creation.md](../specific/skill_creation.md)
- Mode 3 (Flowcharts): [assets/flowcharts/](../../assets/flowcharts/)
- Mode 4 (Install Guides): [install_guide_creation.md](../specific/install_guide_creation.md)
- Mode 5 (Playbooks): [manual_testing_playbook_creation.md](../specific/manual_testing_playbook_creation.md), [manual_testing_playbook_template.md](../../assets/documentation/testing_playbook/manual_testing_playbook_template.md), and [manual_testing_playbook_snippet_template.md](../../assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md)
- Companion catalog workflow: [feature_catalog_creation.md](../specific/feature_catalog_creation.md) plus the [feature catalog template bundle](../../assets/documentation/feature_catalog/)

The playbook workflow assumes a root directory playbook plus required per-feature files in numbered category folders at the playbook root. Current validation remains root-doc focused and does not recurse into those category folders.

### Core Principle

**"Structure first, optimize second, validate always"** - Enforce valid markdown structure before content optimization, then verify quality at every stage.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:four-execution-modes -->
## 2. FOUR EXECUTION MODES

| Workflow | Phases | Command | Use When | Output |
| --- | --- | --- | --- | --- |
| **Script-assisted review** | 1+2 | `python scripts/extract_structure.py` + AI eval | Critical docs (specs, skills, READMEs) | JSON output + qualitative assessment + recommendations |
| **Structure checks** | 1 | `python scripts/quick_validate.py` | File save, structural validation | Checklist results + fix list |
| **Content optimization** | 2 | `python scripts/extract_structure.py` + AI eval | Improve existing docs for AI | Recommendations for clarity + AI-friendliness |
| **Audit snapshot** | 1 (JSON only) | `python scripts/extract_structure.py` | Quality audit, no changes | JSON report for another agent |

**Mode selection**:
- Creating new SKILL/Knowledge → Script-assisted review
- Saving files → Structure checks
- Improving README → Content optimization
- Pre-release check → Structure checks + review

---

<!-- /ANCHOR:four-execution-modes -->
<!-- ANCHOR:validation-integration -->
## 3. VALIDATION INTEGRATION

> **Note**: These validation patterns are conceptual workflows describing when and how validation should occur. They are not implemented as automated hooks - apply these checks manually using the available scripts.

**Pre-Delivery Format Validation** (MANDATORY for READMEs):
- **When**: Before claiming completion on any README
- **Script**: `python scripts/validate_document.py <file>`
- **Action**: Check TOC, H2 format, anchor format, required sections
- **Blocking**: Yes - exit code 1 blocks delivery
- **Auto-fix**: Use `--fix` for safe issues (single-dash anchors)

**Post-Write Validation Pattern** (manual):
- **When**: After Write/Edit operations on `.md` files
- **Script**: `python scripts/quick_validate.py <path>`
- **Action**: Filename corrections (ALL CAPS → lowercase, hyphens → underscores)
- **Blocking**: No (logs only)

**Pre-Submit Quality Pattern** (manual):
- **When**: Before finalizing documentation
- **Script**: `python scripts/extract_structure.py <file>`
- **Action**: Structure validation + AI-assisted quality assessment
- **Blocking**: Recommend blocking on critical violations

**Manual Validation Workflow**:
```
User saves file
    ↓
Run: python scripts/validate_document.py <file>  ← NEW: Format validation
    ├─ Exit 0 → Continue
    └─ Exit 1 → Fix blocking errors → Re-run
    ↓
Run: python scripts/quick_validate.py <path>
    ↓
Review output, fix issues
    ↓
Run: python scripts/extract_structure.py <file>
    ├─ Safe violations → Fix manually → Re-run
    └─ Critical violations → Address before proceeding
```

---

<!-- /ANCHOR:validation-integration -->
<!-- ANCHOR:enforcement-workflows -->
## 4. ENFORCEMENT WORKFLOWS

> **Note**: These are manual workflow patterns for the AI agent to follow when violations are detected. They are not automated scripts.

### Workflow 1: Add Missing Frontmatter

**Detection**: SKILL/Command file, no `---` at line 1

**Fix approach**:
1. Determine document type (SKILL vs Command)
2. Ask the user for metadata
3. Insert frontmatter template at line 1

**Approval prompt template**:
```
Missing required frontmatter. Add the following to line 1?

---
name: [skill-name]
description: [Brief description]
allowed-tools: Read, Write, Edit, Bash
---

Options:
A) Add frontmatter as shown
B) Let me edit manually
C) Skip this file
```

### Workflow 2: Fix Section Order

**Detection**: Required sections out of sequence

**Fix approach**:
1. Identify current section order
2. Map to required order for document type
3. Show proposed reordering

**Approval prompt template**:
```
Section order incorrect. Reorder to match standard?

Current: [current order]
Required: [required order]

Options:
A) Reorder automatically
B) Let me reorder manually
C) Skip validation
```

### Workflow 3: Add Missing Sections

**Detection**: Required section absent (e.g., RULES in SKILL)

**Fix approach**:
1. Identify missing sections
2. Generate section template
3. Insert at appropriate position

**Approval prompt template**:
```
Missing required section: [SECTION NAME]

Add template section at line [N]?

## N.  [SECTION NAME]
[Template content]

Options:
A) Add template section
B) Let me add manually
C) Skip this section
```

---

<!-- /ANCHOR:enforcement-workflows -->
<!-- ANCHOR:phase-interactions -->
## 5. PHASE INTERACTIONS

**Independent execution**:
- Phase 1 (Enforcement) → Standalone structure validation
- Phase 2 (Optimization) → Standalone content improvement
- Phase 3 (Recommendations) → Standalone review output

**Sequential chaining** (script-assisted review):
```
Phase 1: Extract structure (extract_structure.py)
    ├─ Critical violations in checklist? → STOP
    └─ Valid → Continue
        ↓
Phase 2: AI evaluates JSON output
    ├─ Low quality assessment? → WARNING
    └─ Continue
        ↓
Phase 3: AI provides recommendations
    ├─ Issues found? → REPORT
    └─ Complete
```

**Error handling**:
- Phase 1 critical → Block execution, manual fix required
- Phase 2 weak content → Warning + suggestions, continues
- Phase 3 gaps detected → Report + improvement plan

---

<!-- /ANCHOR:phase-interactions -->
<!-- ANCHOR:common-workflow-examples -->
## 6. COMMON WORKFLOW EXAMPLES

**Example 1: New SKILL Creation**
```bash
# 1. Create file
mkdir .opencode/skill/my-skill
cd .opencode/skill/my-skill

# 2. Write initial SKILL.md
# (Run quick validation to check frontmatter)
scripts/quick_validate.py .

# 3. Extract structure for AI analysis
scripts/extract_structure.py SKILL.md
# AI evaluates JSON output and provides quality assessment

# Expected: No checklist failures, high AI-friendliness rating
```

**Example 2: README Optimization**
```bash
# Extract current README structure
scripts/extract_structure.py README.md

# AI receives JSON with:
# - Metrics (word count, heading depth, code ratio)
# - Checklist results for README type
# - Evaluation questions to answer

# AI provides improvement recommendations
```

**Example 3: Pre-Commit Validation**
```bash
# Extract spec structure for review
scripts/extract_structure.py specs/042/spec.md

# AI evaluates:
# - Structure checklist results
# - Content quality assessment
# - Improvement recommendations (if any)
```

---

<!-- /ANCHOR:common-workflow-examples -->
<!-- ANCHOR:batch-processing -->
## 7. BATCH PROCESSING

**Multi-file extraction**:
```bash
# Extract structure from all spec files for batch analysis
for file in $(find specs/ -name "spec.md"); do
  echo "=== $file ==="
  scripts/extract_structure.py "$file"
done
```

**Quick validation batch**:
```bash
# Validate all skills in directory
for skill in $(find .opencode/skill/ -maxdepth 1 -type d); do
  scripts/quick_validate.py "$skill" --json
done
```

---

<!-- /ANCHOR:batch-processing -->
<!-- ANCHOR:quick-troubleshooting -->
## 8. QUICK TROUBLESHOOTING

| Issue | Cause | Solution |
|-------|-------|----------|
| "Execution blocked" | Critical violation | Read error message, apply suggested fix |
| JSON parse error | Invalid markdown structure | Check for unclosed code blocks or frontmatter |
| Wrong type detected | File location mismatch | Check document type detection in JSON output |
| Checklist failures | Structure issues | Review checklist results in JSON, fix violations |
| Validation not running | Environment difference | Apply checks manually (see Section 3) |
| Safe fix not applied | Permission issue | Check file permissions |

---

<!-- /ANCHOR:quick-troubleshooting -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Reference Files
- [core_standards.md](./core_standards.md) - Document type rules and structural requirements
- [optimization.md](./optimization.md) - Content transformation patterns
- [validation.md](./validation.md) - Quality scoring and validation workflows
- [quick_reference.md](./quick_reference.md) - Quick command reference
- [skill_creation.md](../specific/skill_creation.md) - Skill creation workflow
- [install_guide_creation.md](../specific/install_guide_creation.md) - Install guide standards and workflow

### Templates
- [skill_md_template.md](../../assets/skill/skill_md_template.md) - SKILL.md file templates
- [command_template.md](../../assets/agents/command_template.md) - Command file templates
<!-- /ANCHOR:related-resources -->
