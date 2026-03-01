---
title: "Spec: Document Specialist Refactor [001-doc-specialist-refactor/spec]"
description: "The markdown-document-specialist CLI promises features it doesn't deliver"
trigger_phrases:
  - "spec"
  - "document"
  - "specialist"
  - "refactor"
  - "015"
  - "doc"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Document Specialist Refactor

> Refactor `create-documentation` skill with script-assisted AI analysis - scripts handle parsing/metrics, AI handles judgment.

---

<!-- ANCHOR:problem -->
## 1. Problem Statement

### Current State

The `markdown-document-specialist` CLI promises features it doesn't deliver:

| Component | Claims | Reality |
|-----------|--------|---------|
| `analyze_docs.py` | "C7Score Documentation Analysis" | Basic regex heuristics only |
| `--phase optimization` | Document optimization | Removed (no phase system) |
| `--phase validation` | Triple dimension scoring | Removed (no phase system) |

### The Real Problem

The current approach is wrong in TWO ways:

1. **Fake AI** - `analyze_docs.py` pretends to do LLM-level analysis with regex
2. **No AI assistance** - Pure "read instructions and wing it" approach wastes AI capabilities

### The Solution

**Script-Assisted AI Analysis** - Scripts handle deterministic parsing/metrics, AI handles quality judgment.

<!-- /ANCHOR:problem -->

---

## 2. Architecture: Script-Assisted AI Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│                      extract_structure.py                        │
│  INPUT:  Markdown file                                          │
│  OUTPUT: Structured JSON (parsed content, metrics, checklist)   │
│  TASKS:  Parse, measure, validate structure, generate questions │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Structured JSON
┌─────────────────────────────────────────────────────────────────┐
│                     AI Agent (OpenCode)                          │
│  INPUT:  JSON structure + skill instructions                    │
│  OUTPUT: Quality assessment + recommendations                   │
│  TASKS:  Evaluate answers, assess quality, suggest improvements │
└─────────────────────────────────────────────────────────────────┘
```

### Division of Labor

| Task | Handler | Rationale |
|------|---------|-----------|
| Parse frontmatter | Script | Deterministic YAML parsing |
| Extract headings/sections | Script | Deterministic markdown parsing |
| Count metrics (words, lines) | Script | Exact calculation |
| Structural checklist | Script | Pass/fail on format rules |
| Generate eval questions | Script | Standard questions per doc type |
| Detect document type | Script | Path/filename pattern matching |
| **Evaluate if questions answered** | **AI** | Requires semantic understanding |
| **Assess example quality** | **AI** | Requires judgment |
| **Suggest improvements** | **AI** | Requires creativity |
| **Prioritize recommendations** | **AI** | Requires context |

### Why This is Better

| Approach | Problem |
|----------|---------|
| Pure scripts (current) | Can't do quality judgment - just fakes it |
| Pure AI instructions | Wastes tokens parsing, inconsistent, misses checks |
| **Script + AI (proposed)** | Scripts do mechanical work, AI focuses on judgment |

---

## 3. Script Specifications

### 3.1 `extract_structure.py` (NEW - replaces analyze_docs.py)

**Purpose:** Parse markdown into structured JSON for AI consumption.

**Input:** Path to markdown file

**Output:** JSON to stdout

```json
{
  "file": "path/to/SKILL.md",
  "type": "skill",
  "detected_from": "filename",

  "frontmatter": {
    "raw": "---\nname: foo\ndescription: bar\n---",
    "parsed": {
      "name": "foo",
      "description": "bar",
      "allowed-tools": ["Read", "Write"]
    },
    "issues": []
  },

  "structure": {
    "headings": [
      {"level": 1, "text": "Skill Name", "line": 8, "has_emoji": false},
      {"level": 2, "text": "1. 🎯 WHEN TO USE", "line": 12, "has_emoji": true, "has_number": true}
    ],
    "sections": [
      {
        "heading": "WHEN TO USE",
        "level": 2,
        "line_start": 12,
        "line_end": 45,
        "word_count": 250,
        "has_code_blocks": false,
        "content_preview": "First 500 chars..."
      }
    ]
  },

  "code_blocks": [
    {
      "language": "python",
      "line_start": 50,
      "line_count": 15,
      "preview": "def example():..."
    }
  ],

  "metrics": {
    "total_words": 2500,
    "total_lines": 300,
    "heading_count": 12,
    "code_block_count": 5,
    "max_heading_depth": 3,
    "sections_with_code": 3
  },

  "checklist": {
    "type": "skill",
    "results": [
      {"id": "frontmatter_exists", "status": "pass", "details": null},
      {"id": "name_hyphen_case", "status": "pass", "details": null},
      {"id": "description_single_line", "status": "fail", "details": "Uses YAML block format"},
      {"id": "allowed_tools_array", "status": "fail", "details": "Found comma-separated string"},
      {"id": "has_when_to_use", "status": "pass", "details": null},
      {"id": "has_how_it_works", "status": "pass", "details": null},
      {"id": "has_rules_section", "status": "fail", "details": "Section not found"},
      {"id": "h2_numbered_emoji", "status": "pass", "details": "8/8 H2s correct"},
      {"id": "no_toc", "status": "pass", "details": null}
    ],
    "passed": 6,
    "failed": 3,
    "pass_rate": 66.7
  },

  "evaluation_questions": [
    {
      "id": "q1",
      "question": "When should I use this skill?",
      "target_section": "WHEN TO USE",
      "importance": "critical"
    },
    {
      "id": "q2",
      "question": "How does this skill work?",
      "target_section": "HOW IT WORKS",
      "importance": "critical"
    },
    {
      "id": "q3",
      "question": "What are the rules for using this skill?",
      "target_section": "RULES",
      "importance": "high"
    },
    {
      "id": "q4",
      "question": "Can you show me an example?",
      "target_section": "EXAMPLES",
      "importance": "high"
    },
    {
      "id": "q5",
      "question": "What tools does this skill need?",
      "target_section": "frontmatter.allowed-tools",
      "importance": "medium"
    }
  ]
}
```

**Document Type Detection:**

| Type | Detection Pattern |
|------|-------------------|
| `skill` | Filename is `SKILL.md` |
| `readme` | Filename is `README.md` |
| `command` | Path contains `/commands/` |
| `spec` | Path contains `/specs/` |
| `reference` | Path contains `/references/` |
| `knowledge` | Path contains `/knowledge/` |
| `generic` | Default fallback |

**Checklists by Type:**

Each document type has specific structural requirements checked by the script.

### 3.2 `quick_validate.py` (ENHANCE)

**Add checks:**
- YAML multiline description detection
- `allowed-tools` array format validation
- TODO placeholder detection in description
- Consecutive hyphen detection in name

**Add output format:**
```bash
# Human readable (default)
python quick_validate.py .opencode/skills/my-skill

# JSON output for programmatic use
python quick_validate.py .opencode/skills/my-skill --json
```

### 3.3 Keep Unchanged

- `init_skill.py` - Works well
- `package_skill.py` - Works well
- `validate_flowchart.sh` - Works well

### 3.4 Delete

- `analyze_docs.py` - Superseded by extract_structure.py + AI

---

## 4. AI Workflow

### Analysis Workflow (in SKILL.md)

```markdown
## Document Analysis Workflow

### Step 1: Extract Structure
Run the extraction script to get structured document data:
\`\`\`bash
python scripts/extract_structure.py <file.md>
\`\`\`

### Step 2: Review Checklist Results
From the JSON output, identify:
- Failed checks that need fixing
- Checklist pass rate (checklist.pass_rate)

### Step 3: Evaluate Questions
For each question in `evaluation_questions`:
1. Find the target section content
2. Assess: Does the content answer the question?
   - 0 = Not answered
   - 1 = Partially answered
   - 2 = Fully answered with example
3. Note evidence for your assessment

### Step 4: Assess Content Quality
For sections with content, evaluate:
- Clarity: Is the writing clear and unambiguous?
- Completeness: Are there gaps or missing details?
- Examples: Are code examples complete and useful?

### Step 5: Generate Recommendations
Prioritize issues by impact:
- **Critical**: Blocks usage (missing required sections, invalid frontmatter)
- **High**: Significantly reduces quality (poor examples, unclear instructions)
- **Medium**: Improvement opportunities (wordiness, formatting)
- **Low**: Polish (minor style issues)

### Step 6: Output Report
Format your analysis as:
\`\`\`markdown
## Document Analysis: [filename]

### Summary
- Checklist pass rate: [X]% (from checklist)
- Coverage: [Complete | Partial | Missing] (from evaluation questions)
- Next action: [Fix structure | Improve content | Polish style]

### Critical Issues
1. [Issue + fix]

### Recommendations
1. [Priority] [Issue] - [Suggested fix]
\`\`\`
```

---

## 5. CLI Updates

### New CLI Interface

```bash
# Extract structure (deterministic)
markdown-document-specialist extract <file.md>
# Output: JSON to stdout

# Quick validation (deterministic)
markdown-document-specialist validate <path>
# Output: Pass/fail with issues

# Initialize skill (deterministic)
markdown-document-specialist init <name> --path <dir>
# Output: Scaffolded skill directory

# Package skill (deterministic)
markdown-document-specialist package <path> [output-dir]
# Output: Zip file
```

### Removed

- `--phase` argument (analysis is AI workflow, not CLI command)
- Direct file analysis without `extract` subcommand

---

<!-- ANCHOR:requirements -->
## 6. Implementation Plan

**Target Directory:** `.opencode/skills/create-documentation/`

All changes are made within this skill folder.

### Phase 1: Build extract_structure.py (~2 hours)

**File:** `.opencode/skills/create-documentation/scripts/extract_structure.py`

- [ ] Create new script with JSON output
- [ ] Implement markdown parsing (frontmatter, headings, sections, code blocks)
- [ ] Implement metrics calculation
- [ ] Implement document type detection
- [ ] Implement type-specific checklists
- [ ] Implement question generation per type
- [ ] Add tests

### Phase 2: Enhance quick_validate.py (~30 min)

**File:** `.opencode/skills/create-documentation/scripts/quick_validate.py`

- [ ] Add YAML multiline detection
- [ ] Add allowed-tools format check
- [ ] Add JSON output option
- [ ] Add TODO placeholder detection

### Phase 3: Update CLI wrapper (~30 min)

**File:** `.opencode/skills/create-documentation/markdown-document-specialist`

- [ ] Add `extract` subcommand
- [ ] Remove `--phase` argument
- [ ] Update help text
- [ ] Update routing logic

### Phase 4: Update SKILL.md (~1 hour)

**File:** `.opencode/skills/create-documentation/SKILL.md`

- [ ] Add "Script-Assisted Analysis Workflow" section
- [ ] Remove fake c7score references
- [ ] Add example of using extraction output
- [ ] Update SMART ROUTING for new workflow

### Phase 5: Update reference docs (~1 hour)

**Files in:** `.opencode/skills/create-documentation/references/`

- [ ] `workflows.md` - Update with new script-assisted process
- [ ] `validation.md` - Update with checklist details from extract_structure.py
- [ ] `quick_reference.md` - Update command list
- [ ] `skill_creation.md` - Update CLI references, remove fake feature descriptions

**Files in:** `.opencode/skills/create-documentation/assets/`

- [ ] `skill_md_template.md` - Ensure alignment with new checklist
- [ ] `frontmatter_templates.md` - Already updated with YAML multiline warning

### Phase 6: Delete old script (~5 min)

**Delete:** `.opencode/skills/create-documentation/scripts/analyze_docs.py`

- [ ] Delete the file
- [ ] Update any references in SKILL.md and references/

**Total: ~5-6 hours**

<!-- /ANCHOR:requirements -->

---

## 6.1 File Inventory

### Files to Create

| File | Purpose |
|------|---------|
| `scripts/extract_structure.py` | New structured extraction script |

### Files to Modify

| File | Changes |
|------|---------|
| `scripts/quick_validate.py` | Add YAML multiline, JSON output |
| `markdown-document-specialist` | New CLI structure with subcommands |
| `SKILL.md` | Script-assisted workflow, remove fake features |
| `references/workflows.md` | New analysis process |
| `references/validation.md` | Checklist details |
| `references/quick_reference.md` | Updated commands |
| `references/skill_creation.md` | Updated CLI refs |

### Files to Delete

| File | Reason |
|------|--------|
| `scripts/analyze_docs.py` | Superseded by extract_structure.py + AI |

### Files Unchanged

| File | Reason |
|------|--------|
| `scripts/init_skill.py` | Works correctly |
| `scripts/package_skill.py` | Works correctly |
| `scripts/validate_flowchart.sh` | Works correctly |
| `assets/flowcharts/*` | No changes needed |
| `assets/llmstxt_templates.md` | No changes needed |
| `assets/command_template.md` | No changes needed |
| `assets/skill_asset_template.md` | No changes needed |
| `assets/skill_reference_template.md` | No changes needed |

---

<!-- ANCHOR:success-criteria -->
## 7. Success Criteria

- [ ] `extract_structure.py` outputs valid JSON for all document types
- [ ] JSON contains all specified fields (structure, metrics, checklist, questions)
- [ ] Checklist catches YAML multiline descriptions
- [ ] Checklist catches invalid allowed-tools format
- [ ] AI can follow workflow to produce consistent analysis
- [ ] CLI `--help` accurately describes capabilities
- [ ] No "not implemented" errors
- [ ] Reference docs match actual implementation

<!-- /ANCHOR:success-criteria -->

---

## 8. Example: Full Analysis Flow

```bash
# Step 1: User asks AI to analyze a skill
User: "Analyze .opencode/skills/my-skill/SKILL.md"

# Step 2: AI runs extraction
$ python scripts/extract_structure.py .opencode/skills/my-skill/SKILL.md

# Step 3: AI receives JSON
{
  "type": "skill",
  "checklist": {
    "results": [...],
    "pass_rate": 77.8
  },
  "evaluation_questions": [...]
}

# Step 4: AI evaluates questions against content
- Q1 "When should I use this skill?" → Coverage: complete (answered in WHEN TO USE)
- Q2 "How does it work?" → Coverage: partial (missing examples)
- Q3 "What are the rules?" → Coverage: missing (RULES section missing)

# Step 5: AI generates report
## Document Analysis: SKILL.md

### Summary
- Checklist pass rate: ~78%
- Content coverage: partial (missing required sections)
- Next action: fix critical structural issues first, then improve content clarity

### Critical Issues
1. Missing RULES section - Add ## X. RULES with ALWAYS/NEVER/ESCALATE IF

### Recommendations
1. [High] Add complete code example to HOW IT WORKS section
2. [Medium] Expand description to mention key capabilities
```

---

## 9. Out of Scope

- External c7score API integration
- LLM API calls from Python scripts
- Custom OpenCode agent types
- Automatic fix application (AI suggests, human applies)

---

## 10. Decision Record

**Decision**: Implement script-assisted AI analysis where scripts handle parsing/metrics and AI handles judgment.

**Rationale**:
1. Scripts are perfect for deterministic tasks (parsing, counting, checklist)
2. AI is perfect for judgment tasks (quality, completeness, suggestions)
3. Structured JSON input makes AI analysis more consistent
4. Less token waste on parsing markdown
5. Reproducible extraction, focused AI judgment

**Date**: 2024-12-14
