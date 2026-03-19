---
title: Validation - Quality Assessment and Gates
description: Quality gates, DQI scoring, and improvement recommendations for markdown documentation.
---

# Validation - Quality Assessment and Gates

Quality gates, DQI scoring, and script-assisted AI analysis for markdown documentation.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Is Validation?

Validation provides a comprehensive quality assessment framework for markdown documentation. The `extract_structure.py` script parses documents into structured JSON; AI uses this data to evaluate quality across structure, content, and style dimensions.

**Core Purpose**:
- **Quality assessment** - AI-evaluated judgement across structure, content, and style
- **Quality gates** - Document-specific thresholds for production readiness
- **Improvement guidance** - Actionable recommendations based on AI analysis
- **Checklist validation** - Automated structural checks via script

> **📍 Context**: This is a Level 3 reference file (loaded on-demand). For the complete progressive disclosure architecture, see [skill_creation.md § Progressive Disclosure](../specific/skill_creation.md#progressive-disclosure).

This reference provides deep-dive technical guidance on qualitative assessment, quality gates, and interpretation patterns.

### Core Principle

**"Measure what matters, gate what guarantees quality"** - Structure ensures validity, Content ensures AI-friendliness, Style ensures consistency. AI evaluates all dimensions based on `extract_structure.py` output.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:script-assisted-ai-evaluation -->
## 2. SCRIPT-ASSISTED AI EVALUATION

**Two-stage validation pipeline:**

### Stage 1: Format Validation (validate_document.py)

**Pre-delivery format checks with blocking errors:**

```bash
python scripts/validate_document.py document.md
# Exit 0 = valid, Exit 1 = blocking errors, Exit 2 = file error
```

**Checks:**
| Check | Severity | Auto-Fixable |
|-------|----------|--------------|
| Missing TOC section | blocking | No |
| TOC anchor single-dash (should be `#1--`) | blocking | Yes |
| Missing required section | blocking | No |
| Non-sequential numbering | warning | No |

**Options:**
- `--json` - Output results as JSON
- `--fix` - Apply auto-fixes for safe issues
- `--fix --dry-run` - Preview fixes without applying
- `--type readme|skill|reference|asset|agent` - Explicit document type

**MANDATORY**: Run `validate_document.py` before delivery. Exit code 0 required.

### Stage 2: Quality Assessment (extract_structure.py)

**Validation uses `extract_structure.py` to parse documents, then AI evaluates:**

```
INPUT: Markdown Document
    ↓
SCRIPT: extract_structure.py
    - Parses frontmatter (values + issues)
    - Extracts structure (headings, sections, code blocks)
    - Calculates metrics (word count, heading depth, code ratio)
    - Runs type-specific checklist
    - Generates evaluation questions
    ↓
OUTPUT: Structured JSON
    ↓
AI EVALUATION:
    - Reviews checklist results
    - Answers evaluation questions
    - Assesses content quality
    - Provides recommendations
    ↓
RESULT: Quality Assessment + Recommendations
```

---

<!-- /ANCHOR:script-assisted-ai-evaluation -->
<!-- ANCHOR:checklist-based-validation -->
## 3. CHECKLIST-BASED VALIDATION

### Structure Checklist (from extract_structure.py)

The script runs type-specific checklists and reports pass/fail results:

**Common Checks** (all document types):
- ✅ Single H1, no duplicates
- ✅ Proper heading hierarchy (no skipped levels)
- ✅ Code blocks properly fenced
- ✅ No unclosed markdown elements
- ✅ Section separators (`---`) correct
- ✅ H3/H4 semantic emoji correct (only in RULES sections)

**SKILL-Specific Checks** (14 checks total):
- ✅ `frontmatter_exists` - YAML frontmatter present
- ✅ `name_present` - Has name field
- ✅ `name_hyphen_case` - Name is hyphen-case (lowercase, digits, hyphens only)
- ✅ `description_present` - Has description field
- ✅ `description_single_line` - Description is single line (no YAML multiline)
- ✅ `allowed_tools_present` - Has allowed-tools field
- ✅ `allowed_tools_array` - allowed-tools in array format `[Tool1, Tool2]`
- ✅ `has_when_to_use` - Has WHEN TO USE section
- ✅ `has_how_it_works` - Has HOW IT WORKS or HOW TO USE section
- ✅ `has_rules` - Has RULES section
- ✅ `h2_numbered` - H2s have number prefix format
- ✅ `no_toc` - No table of contents section
- ✅ `no_placeholders` - No placeholder markers ([TODO], [PLACEHOLDER], etc.)
- ✅ `code_has_language` - Code blocks have language tags

**README-Specific Checks**:
- ✅ No frontmatter (or optional)
- ✅ Clear purpose/introduction section
- ✅ Usage examples present

**Checklist Results** in JSON:
```json
{
  "checklist": {
    "results": [
      {"check": "single_h1", "status": "pass"},
      {"check": "frontmatter_valid", "status": "pass"},
      {"check": "description_single_line", "status": "fail", 
       "message": "Description uses multiline format"}
    ],
    "passed": 8,
    "failed": 1,
    "total": 9
  }
}
```

### Content Quality (AI-Evaluated)

AI evaluates content based on extracted data and evaluation questions:

**Evaluation Questions** (generated by script):
- Is the purpose clear from the introduction?
- Are examples practical and complete?
- Is information well-organized and scannable?
- Are there any gaps in coverage?

**AI Assessment Criteria**:
- Clarity and completeness
- Practical usefulness
- AI-friendliness (scannable, question-answering format)
- Appropriate level of detail

### Style Compliance (AI-Evaluated)

AI checks style based on core_standards.md:

**Key Style Checks**:
- ✅ H2 numbered headings: ALL CAPS (e.g., `## 1. WHEN TO USE`)
- ✅ H3/H4 RULES headings: Only semantic emojis (✅ ❌ ⚠️), no decorative emojis
- ✅ Code examples include comments
- ✅ Bullet lists under 7 items
- ✅ Consistent terminology
- ✅ Active voice preferred

---

<!-- /ANCHOR:checklist-based-validation -->
<!-- ANCHOR:document-quality-index-dqi -->
## 4. DOCUMENT QUALITY INDEX (DQI)

The `extract_structure.py` script computes a **Document Quality Index (DQI)** - a 100% deterministic score from 0-100 based on measurable document attributes. This replaces subjective AI-only assessment with quantifiable metrics.

### DQI Components

| Component | Max | What It Measures |
|-----------|-----|------------------|
| **Structure** | 40 | Checklist pass rate (type-specific validation) |
| **Content** | 30 | Word count, heading density, code examples, tables/lists, links |
| **Style** | 30 | H2 formatting (number+CAPS), section dividers, intro paragraph |

### Content Score Breakdown (30 points)

| Metric | Max | Criteria |
|--------|-----|----------|
| Word count | 10 | Within type-specific range (e.g., skills: 2000-8000 words) |
| Heading density | 8 | Appropriate H2 count per 500 words |
| Code examples | 6 | 3+ code blocks with language tags = full points |
| Tables/lists | 3 | Presence of tables (+2) and lists (+1) |
| Links | 3 | Internal links (+2) and external links (+1) |

### Style Score Breakdown (30 points)

| Metric | Max | Criteria |
|--------|-----|----------|
| H2 formatting | 12 | Number + ALL CAPS on H2 headings |
| Section dividers | 6 | Horizontal rules between H2 sections |
| Style issues | 8 | Penalty of -2 per style issue detected |
| Intro paragraph | 4 | Brief introduction after H1 |

### Quality Bands

| Band | Score Range | Status | Action |
|------|-------------|--------|--------|
| **Excellent** | 90-100 | ✅ Production-ready | None needed |
| **Good** | 75-89 | ✅ Shareable | Minor improvements recommended |
| **Acceptable** | 60-74 | ⚠️ Functional | Several areas need attention |
| **Needs Work** | <60 | ❌ Not ready | Significant improvements required |

### DQI JSON Output

```json
{
  "dqi": {
    "total": 96,
    "band": "excellent",
    "band_description": "Production-ready documentation",
    "components": {
      "structure": 40,
      "structure_max": 40,
      "content": 26,
      "content_max": 30,
      "style": 30,
      "style_max": 30
    },
    "breakdown": {
      "checklist_pass_rate": 100.0,
      "word_count": 4168,
      "word_count_score": 10,
      "h2_count": 9,
      "heading_score": 8,
      "code_block_count": 8,
      "code_score": 6,
      "h2_format_score": 12,
      "style_issue_count": 0
    }
  }
}
```

### Key Principles

1. **100% Deterministic**: Every point is computed from measurable data, not AI judgment
2. **Transparent**: Full breakdown shows exactly where points are earned/lost
3. **Type-Aware**: Thresholds adjust based on document type (skill, reference, asset, etc.)
4. **Actionable**: Low scores in specific components guide improvement priorities

---

<!-- /ANCHOR:document-quality-index-dqi -->
<!-- ANCHOR:quality-gates -->
## 5. QUALITY GATES

Quality bands are defined in Section 4 (DQI). This section specifies document-specific enforcement requirements.

### Document-Specific Requirements

**SKILL.md**:
- Checklist: No failures allowed (strict)
- Content: Highly AI-friendly required
- Style: Exemplary compliance
- Expected: Excellent

**Knowledge**:
- Checklist: No failures allowed (strict, no frontmatter)
- Content: Good AI-friendliness
- Style: Consistent formatting
- Expected: Good

**README**:
- Checklist: Minor issues acceptable (flexible)
- Content: Highly AI-friendly
- Style: Good compliance
- Expected: Good

**Command**:
- Checklist: No failures allowed (strict)
- Content: Functional coverage
- Style: Consistent formatting
- Expected: Acceptable+

**Spec**:
- Checklist: Issues acceptable (loose, working doc)
- Content: N/A (development document)
- Style: Basic compliance
- Expected: Acceptable

**Reference**:
- Checklist: No critical failures (moderate)
- Content: Good depth and practical guidance
- Style: H2 numbered, intro paragraph
- Expected: Good

**Template**:
- Checklist: No critical failures (moderate, placeholders allowed)
- Content: Clear examples and field documentation
- Style: H2 numbered, code has language tags
- Expected: Good

**Flowchart**:
- Checklist: Minimal (flexible, ASCII diagrams)
- Content: Substantial content (>500 chars)
- Style: Brief intro, contains ASCII diagram
- Expected: Acceptable

---

<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:assessment-interpretation -->
## 6. ASSESSMENT INTERPRETATION

### Checklist Passes, Low Content Quality

**Diagnosis**: Valid structure but content needs improvement

**Fix**: AI will recommend content improvements:
- Add question-answering snippets
- Combine installation with usage examples
- Provide complete workflow examples
- Add practical context

### Good Content, Checklist Failures

**Diagnosis**: Good content but structural issues

**Fix**: Address checklist failures first:
- Fix frontmatter issues (single-line description, array format)
- Fix heading hierarchy
- Add missing required sections
- Close unclosed elements

### Style Issues

**Diagnosis**: Valid structure, good content, but inconsistent formatting

**Fix**: Apply style guide compliance:
- Fix H2 heading format (ALL CAPS)
- Add code comments
- Break long bullet lists (max 7 items)
- Use consistent terminology

### Multiple Issues

**Diagnosis**: Both checklist failures and content issues

**Fix**: Address in order:
1. Fix critical checklist failures first
2. Improve content quality
3. Apply style fixes last

---

<!-- /ANCHOR:assessment-interpretation -->
<!-- ANCHOR:improvement-recommendations -->
## 7. IMPROVEMENT RECOMMENDATIONS

**When Quality Rating < 80**:

1. **Review checklist results** - Fix failures first
2. **Read evaluation questions** - Address gaps
3. **Apply AI recommendations** - Follow suggested improvements
4. **Re-extract and evaluate** - Check improvement
5. **Iterate** - Repeat until threshold met

**Priority order**:
1. Critical checklist failures - Must be fixed
2. Content quality issues - Primary improvement target
3. Style compliance - Polish for consistency

**Quick fixes** (high impact, low effort):
- Structure: Fix frontmatter format, add missing sections
- Content: Add examples, combine concepts with usage
- Style: Fix H2 format, break long lists

---

<!-- /ANCHOR:improvement-recommendations -->
<!-- ANCHOR:json-output-format -->
## 8. JSON OUTPUT FORMAT

**Example extract_structure.py output**:
```json
{
  "file": "example-skill/SKILL.md",
  "type": "skill",
  "detected_from": "filename",
  "frontmatter": {
    "raw": "name: example-skill\ndescription: Brief description\nallowed-tools: [Read, Edit]",
    "parsed": {
      "name": "example-skill",
      "description": "Brief description",
      "allowed-tools": ["Read", "Edit"]
    },
    "issues": []
  },
  "structure": {
    "headings": [
      {"level": 1, "text": "Example Skill - Subtitle", "line": 5, "has_emoji": false, "has_number": false},
      {"level": 2, "text": "1. WHEN TO USE", "line": 10, "has_emoji": false, "has_number": true}
    ],
    "sections": [...]
  },
  "code_blocks": [
    {"language": "bash", "line_start": 15, "line_count": 3, "preview": "npm install..."}
  ],
  "metrics": {
    "total_words": 2500,
    "total_lines": 180,
    "heading_count": 8,
    "code_block_count": 4,
    "max_heading_depth": 3,
    "sections_with_code": 3
  },
  "checklist": {
    "type": "skill",
    "results": [
      {"id": "frontmatter_exists", "check": "Has YAML frontmatter", "status": "pass", "details": null},
      {"id": "name_present", "check": "Has name field", "status": "pass", "details": null},
      {"id": "name_hyphen_case", "check": "Name is hyphen-case", "status": "pass", "details": null}
    ],
    "passed": 14,
    "failed": 0,
    "pass_rate": 100.0
  },
  "content_issues": [],
  "style_issues": [],
  "dqi": {
    "total": 96,
    "band": "excellent",
    "band_description": "Production-ready documentation",
    "components": {
      "structure": 40,
      "structure_max": 40,
      "content": 26,
      "content_max": 30,
      "style": 30,
      "style_max": 30
    },
    "breakdown": {
      "checklist_pass_rate": 100.0,
      "word_count": 2500,
      "word_count_range": [2000, 8000],
      "word_count_score": 10,
      "h2_count": 6,
      "heading_density": 1.5,
      "heading_score": 8,
      "code_block_count": 4,
      "code_score": 6,
      "h2_format_score": 12,
      "style_issue_count": 0
    }
  },
  "evaluation_questions": [
    {"id": "q1", "question": "When should I use this skill?", "target_section": "WHEN TO USE", "importance": "critical"},
    {"id": "q2", "question": "How does this skill work?", "target_section": "HOW IT WORKS", "importance": "critical"}
  ]
}
```

**AI then provides assessment**:
```
=== Quality Assessment: specs/042/spec.md ===

Document Type: spec (loose enforcement)

CHECKLIST RESULTS: 6/6 passed ✅

CONTENT EVALUATION:
✓ Purpose clear from introduction
✓ Good heading structure
⚠ Could use more practical examples
⚠ Some sections could be more scannable

STYLE NOTES:
✓ H2 format correct
⚠ Some bullet lists exceed 7 items

OVERALL: Good (85) - Ready for use

RECOMMENDATIONS:
1. Add integration examples
2. Break long bullet lists
```

---

<!-- /ANCHOR:json-output-format -->
<!-- ANCHOR:validation-commands -->
## 9. VALIDATION COMMANDS

**Extract structure for single file**:
```bash
scripts/extract_structure.py document.md
# Outputs JSON to stdout for AI evaluation
```

**Quick validation** (skill folders):
```bash
scripts/quick_validate.py .opencode/skill/my-skill
# Fast check for essential requirements
```

**Quick validation with JSON output**:
```bash
scripts/quick_validate.py .opencode/skill/my-skill --json
# Machine-readable output for automation
```

**Batch extraction**:
```bash
for file in $(find specs/ -name "*.md"); do
  echo "=== $file ==="
  scripts/extract_structure.py "$file"
done
```

**CI/CD integration** (example):
```bash
# Extract structure and check for critical failures
output=$(scripts/extract_structure.py README.md)
if echo "$output" | grep -q '"status": "fail"'; then
  echo "Checklist failures detected"
  exit 1
fi
```

---

<!-- /ANCHOR:validation-commands -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Reference Files
- [core_standards.md](./core_standards.md) - Document type rules and structural requirements
- [workflows.md](./workflows.md) - Execution modes and workflow details
- [optimization.md](./optimization.md) - Content transformation patterns
- [quick_reference.md](./quick_reference.md) - Quick command reference
- [skill_creation.md](../specific/skill_creation.md) - Skill creation workflow
- [install_guide_creation.md](../specific/install_guide_creation.md) - Install guide standards and workflow

### Templates
- [skill_md_template.md](../../assets/skill/skill_md_template.md) - SKILL.md file templates
- [skill_asset_template.md](../../assets/skill/skill_asset_template.md) - Bundled asset structure
- [readme_template.md](../../assets/documentation/readme_template.md) - Comprehensive README guide (13 sections)
- [command_template.md](../../assets/agents/command_template.md) - Command creation guide (19 sections)
- [install_guide_template.md](../../assets/documentation/install_guide_template.md) - Install guide template (14 sections)
- [llmstxt_templates.md](../../assets/documentation/llmstxt_templates.md) - llms.txt with decision framework
- [frontmatter_templates.md](../../assets/documentation/frontmatter_templates.md) - Frontmatter validation & templates (11 sections)
<!-- /ANCHOR:related-resources -->
