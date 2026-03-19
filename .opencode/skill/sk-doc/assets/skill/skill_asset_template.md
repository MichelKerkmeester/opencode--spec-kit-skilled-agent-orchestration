---
title: Skill Asset File Templates
description: Templates and guidelines for creating asset files in AI agent skills.
---

# Skill Asset File Templates - Creation Guidelines

Templates and guidelines for creating asset files in AI agent skills.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Location & Naming

**Location:** `.opencode/skill/[skill-name]/assets/`

**Naming Convention:** snake_case with appropriate extension

| ✅ Valid Names | ❌ Invalid Names |
|---------------|-----------------|
| `frontmatter_templates.md` | `FrontmatterTemplates.md` (PascalCase) |
| `config_examples.yaml` | `config-examples.yaml` (kebab-case) |
| `validation_checklist.md` | `ValidationChecklist.MD` (wrong case) |
| `emoji_reference.md` | `emojiReference.md` (camelCase) |

### When to Create Assets

**Create an asset file when:**
- Templates users apply repeatedly
- Reference data >50 lines and self-contained
- Multiple examples of same pattern exist
- Lookup tables or decision matrices needed
- Template variations for different scenarios

**Keep in SKILL.md when:**
- Content <30 lines
- Tightly coupled to workflow logic
- Needs to be visible immediately (not progressive disclosure)
- Part of core instructions (RULES, WORKFLOW sections)

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:asset-file-types -->
## 2. ASSET FILE TYPES

### Template Files
**Purpose**: Provide copy-paste starting points for common tasks

**Naming**: `[content-type]_templates.md`
- Example: `frontmatter_templates.md`, `structure_templates.md`

**Structure**:
- One template per section
- Include field descriptions
- Show complete examples
- Explain when to use each template

**Use cases**:
- Document templates (SKILL.md, commands, knowledge files)
- Configuration templates (YAML, JSON)
- Code templates (functions, classes, modules)

### Reference Files
**Purpose**: Provide lookup tables, decision trees, or reference data

**Naming**: `[topic]_reference.md`
- Example: `emoji_reference.md`, `validation_reference.md`

**Structure**:
- Tables or lists for quick lookup
- Decision matrices
- Classification systems
- Standards and conventions

**Use cases**:
- Emoji selection guides
- File type classifications
- Validation rule sets
- Naming conventions

### Example Files
**Purpose**: Show working examples of skill outputs

**Naming**: `[topic]_examples.md`
- Example: `optimization_examples.md`, `skill_examples.md`

**Structure**:
- Before/after comparisons
- Annotated examples
- Multiple variations
- Anti-patterns to avoid

**Use cases**:
- Complete skill applications
- Common patterns
- Edge cases
- Quality standards

### Guide Files
**Purpose**: Detailed how-to guides for complex processes

**Naming**: `[process]_guide.md`
- Example: `packaging_guide.md`, `distribution_guide.md`

**Structure**:
- Step-by-step instructions
- Troubleshooting sections
- Best practices
- Common pitfalls

**Use cases**:
- Multi-step processes
- Advanced techniques
- Workflow deep-dives
- Integration guides

---

<!-- /ANCHOR:asset-file-types -->
<!-- ANCHOR:document-structure -->
## 3. DOCUMENT STRUCTURE

### Retrieval Anchor Convention (Required)

Use retrieval anchors for every H2 section so sections can be loaded by anchor ID.

**Format**:
- Open marker immediately before each H2: `<!-- ANCHOR:section-slug -->`
- Close marker immediately before the next H2 (or EOF): `<!-- /ANCHOR:section-slug -->`
- Slug rules: kebab-case from H2 text, strip numbering/emojis/punctuation
- Duplicate slugs: append `-2`, `-3`, etc.

**Example**:

```markdown
## 1. OVERVIEW

[Section content]

## 2. ASSET FILE TYPES
```

### Title and Intro

**CRITICAL: The intro after the H1 title must be 1-2 SHORT sentences only.**

```markdown
---
title: [Title]
description: [One-line description - same as intro]
---

# [Title]

[1-2 SHORT sentences only. Brief hook/summary. NO subsections, NO headers here.]

## 1. OVERVIEW

### Purpose

[Why this asset exists]

### Usage

[How to use this asset - copy instructions, customization notes]

---

## 2. [Content Section]

[The actual template/checklist/snippet content]

---

## N. Related Resources (optional, if present must be last)

[Links to related files]

```

> **WARNING: DO NOT duplicate content between intro and OVERVIEW section.**
> The intro is a hook; OVERVIEW provides the details.

#### ✅ GOOD Intro Structure

```markdown
# Git Commit Templates

Copy-paste templates for creating well-structured commit messages.

## 1. OVERVIEW

### Purpose

Provides consistent commit message formats for atomic commits...

### Usage

Copy the appropriate template based on commit type...

---

## 2. COMMIT TEMPLATES
...
```

#### ❌ BAD Intro Structure (too long, has subsections)

```markdown
# Git Commit Templates

Copy-paste templates for creating well-structured commit messages.

### Core Principle    ← WRONG: No headers in intro!
Atomic commits with clear intent = maintainable history.

### When to Use       ← WRONG: This belongs in OVERVIEW section!
- Creating new features
- Fixing bugs

---
```

### Intro vs OVERVIEW Content Placement

| Content Type          | Intro (after H1) | OVERVIEW Section       |
| --------------------- | ---------------- | ---------------------- |
| 1-2 sentence summary  | ✅ YES            | ❌ NO (don't repeat)    |
| Core Principle        | ❌ NO             | ✅ YES (in Purpose)     |
| When to Use           | ❌ NO             | ✅ YES (in Purpose)     |
| How to copy/customize | ❌ NO             | ✅ YES (in Usage)       |
| Prerequisites         | ❌ NO             | ✅ YES (in Usage)       |
| Any H2/H3 subsections | ❌ NEVER          | ✅ YES                  |

---

<!-- /ANCHOR:document-structure -->
<!-- ANCHOR:standard-asset-structure -->
## 4. STANDARD ASSET STRUCTURE

**Template**:

```markdown
# Asset Title - Descriptive Subtitle

Brief introduction (1-2 sentences) explaining what this asset provides and when to use it.

## 1. OVERVIEW

### Purpose

[Why this asset exists, what problem it solves]

### Usage

[How to use this asset - copy instructions, customization notes]

---

## 2. SECTION NAME

**Key Points**:
- Point 1
- Point 2
- Point 3

**Template**:
```[language]
# Template content here
# With explanatory comments
```

**Field Guidelines**:

**`field_name`**:
- Description of field
- Format requirements
- Example: `value-example`

**Complete Example**:
```[language]
# Complete working example
# Ready to copy and adapt
```

---

## 3. SECTION NAME

[Continue pattern...]

---

## N. RELATED RESOURCES

[Links to related files - MUST be last section if present]

```

---

<!-- /ANCHOR:standard-asset-structure -->
<!-- ANCHOR:logic-representation-patterns -->
## 5. LOGIC REPRESENTATION PATTERNS

**Purpose**: Guidelines for representing logic, workflows, and decision trees in asset files using structured formats instead of prose.

**Why Structured Logic?**
- **Clarity**: Executable-style logic is easier to understand than prose
- **AI-Friendly**: LLMs parse structured logic better than narrative descriptions
- **Maintainability**: Changes to logic are more visible in structured formats
- **Consistency**: Same patterns across all asset files

### When to Use Each Format

**Use Python Pseudo-Code When:**
- Complex branching logic (multiple IF/ELIF/ELSE conditions)
- Function/method definitions with clear inputs/outputs
- State management or algorithmic processes
- Validation or transformation logic
- Examples: Mode detection, validation pipelines, decision functions

**Use YAML Structures When:**
- Configuration data (settings, options, parameters)
- Pipeline definitions (multi-step workflows with clear phases)
- Hierarchical workflows (nested processes)
- Metadata structures (categorization, tagging)
- Examples: Workflow definitions, configuration templates, feature matrices

**Use Markdown Decision Trees When:**
- Simple branching logic (2-5 branches)
- Visual flow representation (user-facing paths)
- Classification systems (type determination)
- Quick decision guides
- Examples: Document type selection, frontmatter requirements

**Keep Markdown Prose When:**
- Explanatory text and conceptual overviews
- Narrative examples with context
- Best practices guidance
- Introductions and summaries

---

<!-- /ANCHOR:logic-representation-patterns -->
<!-- ANCHOR:decision-logic-examples -->
## 6. DECISION LOGIC EXAMPLES

**Purpose**: Demonstrate how to convert markdown prose into structured decision logic.

### Python Pseudo-Code: Mode Detection

**Before (Markdown Prose)**:
```markdown
Check user input for mode indicators:
- If "$quick" is present, use quick mode with auto-scaling depth
- If "$ticket" is present, use ticket mode with depth 10
- Otherwise, use interactive mode with depth 10
```

**After (Python Pseudo-Code)**:
```python
def detect_mode(request):
    """Detect execution mode from user request markers"""

    if '$quick' in request:
        mode = 'quick'
        depth = 'auto_scale_1_to_5'
    elif '$ticket' in request:
        mode = 'ticket'
        depth = 'depth_10_rounds'
    else:
        # DEFAULT TO INTERACTIVE
        mode = 'interactive'
        depth = 'depth_10_rounds'

    return mode, depth
```

### Markdown Decision Tree: Frontmatter Requirements

**Before (Markdown Prose)**:
```markdown
Different document types have different frontmatter requirements:
- SKILL.md files must have frontmatter with name, description, and allowed-tools
- Command files must have frontmatter with description and argument-hint
- Knowledge files should not have frontmatter
- Spec files typically don't have frontmatter
```

**After (Markdown Decision Tree)**:
```
Document type?
├─> SKILL.md       → MUST have frontmatter (name, description, allowed-tools)
├─> Command        → MUST have frontmatter (description, argument-hint, allowed-tools)
├─> Knowledge      → MUST NOT have frontmatter (remove if present)
├─> Spec           → SHOULD NOT have frontmatter (suggest removal)
└─> README         → No specific requirement (usually none)
```

### Python Pseudo-Code: Validation Logic

**Before (Markdown Prose)**:
```markdown
Validate the document structure:
1. Check if required sections exist
2. Verify section ordering is correct
3. Ensure frontmatter is valid (if present)
4. Check emoji usage in headers
```

**After (Python Pseudo-Code)**:
```python
def validate_document(doc, doc_type):
    """Validate document structure and content"""

    errors = []

    # Check required sections
    required_sections = get_required_sections(doc_type)
    for section in required_sections:
        if section not in doc.sections:
            errors.append(f"Missing required section: {section}")

    # Verify section ordering
    expected_order = get_section_order(doc_type)
    actual_order = [s.name for s in doc.sections]
    if actual_order != expected_order:
        errors.append(f"Section order incorrect. Expected: {expected_order}")

    # Validate frontmatter
    if doc.has_frontmatter:
        frontmatter_errors = validate_frontmatter(doc.frontmatter, doc_type)
        errors.extend(frontmatter_errors)

    # Check emoji usage
    for section in doc.sections:
        if not section.has_emoji and section.level <= 2:
            errors.append(f"Section '{section.name}' missing emoji")

    return errors
```

---

<!-- /ANCHOR:decision-logic-examples -->
<!-- ANCHOR:workflow-patterns -->
## 7. WORKFLOW PATTERNS

**Purpose**: Show how to represent multi-step workflows using YAML structures.

### YAML Pipeline: Document Creation Workflow

**Before (Markdown List)**:
```markdown
1. Analyze the request and determine document type
2. Select appropriate template
3. Populate template with content
4. Validate structure and content
5. Apply formatting standards
6. Run quality checks
```

**After (YAML Pipeline)**:
```yaml
document_creation_workflow:
  phase_1_analysis:
    action: "Analyze request and determine document type"
    output: "Document type classification"
    validation: "Type must be one of: SKILL, Command, Knowledge, Spec, README"

  phase_2_template_selection:
    action: "Select appropriate template based on document type"
    output: "Template file path"
    depends_on: "phase_1_analysis"

  phase_3_population:
    action: "Populate template with user-provided content"
    output: "Draft document with filled sections"
    depends_on: "phase_2_template_selection"

  phase_4_validation:
    action: "Validate structure, frontmatter, section ordering"
    output: "Validation report (errors/warnings)"
    depends_on: "phase_3_population"

  phase_5_formatting:
    action: "Apply code standards (emoji, spacing, headers)"
    output: "Formatted document"
    depends_on: "phase_4_validation"

  phase_6_quality_check:
    action: "Review checklist + run AI quality evaluation"
    output: "Quality notes and improvement recommendations"
    depends_on: "phase_5_formatting"
```

### YAML Configuration: Feature Flags

**Before (Markdown Table)**:
```markdown
| Feature           | Default | Description                         |
| ----------------- | ------- | ----------------------------------- |
| strict_validation | true    | Enforce all validation rules        |
| auto_fix          | false   | Automatically fix formatting issues |
| emoji_required    | true    | Require emoji in H2/H3 headers      |
```

**After (YAML Configuration)**:
```yaml
feature_flags:
  strict_validation:
    default: true
    description: "Enforce all validation rules without warnings"
    values: [true, false]

  auto_fix:
    default: false
    description: "Automatically fix formatting issues during validation"
    values: [true, false]
    warning: "Use with caution - may change document semantics"

  emoji_required:
    default: true
    description: "Require emoji in H2/H3 headers per code standards"
    values: [true, false]
    enforcement_level: "error"
```

### YAML Workflow: Multi-Branch Decision Process

**Before (Markdown Prose)**:
```markdown
The system should detect when to generate variants:
- If user explicitly requests options (shows me options, variations, different approaches)
- If complexity is high (7+) and uncertainty signals are present (not sure, what would work)
- Otherwise, generate single solution

Variant count depends on complexity:
- Simple: 2-3 variants
- Standard: 3-5 variants
- Complex: 5-10 variants
```

**After (YAML Multi-Branch)**:
```yaml
variant_generation_logic:
  triggers:
    explicit:
      keywords: ["show me options", "variations", "different approaches", "multiple designs"]
      action: "Generate variants immediately"
      priority: "high"

    implicit:
      conditions:
        - "complexity >= 7"
        - "uncertainty_signals present"
      uncertainty_signals: ["not sure", "what would work", "best approach"]
      action: "Generate variants with uncertainty disclaimer"
      priority: "medium"

    default:
      action: "Generate single optimal solution"
      priority: "low"

  variant_count_guidelines:
    simple:
      complexity_range: [1, 3]
      variant_count: "2-3"

    standard:
      complexity_range: [4, 6]
      variant_count: "3-5"

    complex:
      complexity_range: [7, 10]
      variant_count: "5-10"

    user_specified:
      action: "Honor user's requested count"
      override: true
```

---

<!-- /ANCHOR:workflow-patterns -->
<!-- ANCHOR:configuration-templates -->
## 8. CONFIGURATION TEMPLATES

**Purpose**: Demonstrate structured data formats for configuration and metadata.

### YAML: Tool Configuration

```yaml
tool_configuration:
  name: "document-validator"
  version: "2.1.0"

  settings:
    validation:
      strictness: "high"  # low | medium | high
      fail_on_warnings: false
      ignore_patterns:
        - "*.draft.md"
        - "temp/**"

    formatting:
      max_line_length: 100
      emoji_style: "unicode"  # unicode | shortcode
      heading_style: "atx"    # atx | setext

    output:
      format: "json"          # json | yaml | markdown
      verbosity: "normal"     # minimal | normal | verbose
      show_suggestions: true

  rules:
    frontmatter:
      required_for: ["SKILL.md", "commands"]
      forbidden_for: ["knowledge"]
      optional_for: ["README.md"]

    sections:
      require_toc_when: "lines > 100"
      require_emoji: true
      numbering: "sequential"  # sequential | hierarchical | none
```

### Python: Data Structures

```python
# Classification matrix for document types
DOCUMENT_CLASSIFICATIONS = {
    "SKILL.md": {
        "category": "skill",
        "requires_frontmatter": True,
        "required_fields": ["name", "description", "allowed-tools"],
        "optional_fields": ["tags", "category", "version"],
        "max_lines": 900,
        "required_sections": ["OBJECTIVE", "RULES", "WORKFLOW", "SUCCESS CRITERIA"],
    },

    "command": {
        "category": "command",
        "requires_frontmatter": True,
        "required_fields": ["description", "argument-hint"],
        "optional_fields": ["allowed-tools", "example"],
        "max_lines": 300,
        "required_sections": [],
    },

    "knowledge": {
        "category": "knowledge",
        "requires_frontmatter": False,
        "required_fields": [],
        "optional_fields": [],
        "max_lines": 500,
        "required_sections": [],
    },
}

# Validation severity levels
VALIDATION_LEVELS = {
    "MUST": {
        "severity": "error",
        "blocking": True,
        "examples": ["Required sections missing", "Invalid frontmatter syntax"],
    },

    "SHOULD": {
        "severity": "warning",
        "blocking": False,
        "examples": ["Emoji missing in headers", "Line length exceeds 100"],
    },

    "MAY": {
        "severity": "info",
        "blocking": False,
        "examples": ["Consider adding examples", "Section could be split"],
    },
}
```

---

<!-- /ANCHOR:configuration-templates -->
<!-- ANCHOR:template-guidelines -->
## 9. TEMPLATE GUIDELINES

### Naming Conventions

**File Names** (snake_case required):
- Format: `[topic]_[type].md`
- Use underscores, not hyphens (snake_case)
- Lowercase only
- Descriptive and specific
- Examples:
  - ✅ `frontmatter_templates.md`
  - ✅ `validation_reference.md`
  - ✅ `config_examples.yaml`
  - ✅ `packaging_guide.md`
  - ❌ `templates.md` (too generic)
  - ❌ `FrontmatterTemplates.md` (wrong case)
  - ❌ `frontmatter-templates.md` (hyphens not allowed)

**Type-Specific Patterns**:

| Asset Type | Naming Pattern           | snake_case Examples          |
| ---------- | ------------------------ | ---------------------------- |
| Template   | `[content]_templates.md` | `frontmatter_templates.md`   |
| Reference  | `[topic]_reference.md`   | `emoji_reference.md`         |
| Example    | `[topic]_examples.md`    | `optimization_examples.md`   |
| Guide      | `[process]_guide.md`     | `packaging_guide.md`         |
| Checklist  | `[topic]_checklist.md`   | `validation_checklist.md`    |

**Section Names**:
- Start with emoji (contextually appropriate)
- Use title case
- Be descriptive but concise
- Number if sequential: `1. 📋 Template Name`


### Content Organization

**Progressive Disclosure**:
1. **Introduction**: What this is, why it exists (1-2 sentences)
2. **Sections**: Each covers one topic completely
3. **Examples**: Show, don't just tell
4. **Quick Reference**: Summary at end (optional)

**Section Structure**:
- **Purpose**: Why this section exists
- **Guidelines**: How to use the content
- **Template**: Copy-paste starting point
- **Example**: Complete working example

### Formatting Standards

**Code Blocks**:
- Always specify language: ` ```yaml `, ` ```markdown `, ` ```bash `
- Include comments explaining non-obvious parts
- Show complete, runnable examples
- Use placeholder values that are obviously placeholders

**Placeholders**:
- Format: `[descriptive-name]` or `your-value-here`
- Examples:
  - ✅ `[skill-name]`, `[feature-description]`, `your-project-name`
  - ❌ `xxx`, `placeholder`, `FIXME`

**Emoji Usage**:
- One emoji per H2/H3 header (at start)
- Choose contextually appropriate emojis
- Be consistent within file (same emoji for same concepts)
- See `emoji_reference.md` for recommendations (if it exists)

**Lists**:
- Use `-` for unordered lists
- Use `1.` for ordered lists
- Nested lists indent by 2 spaces
- Keep items parallel in structure

**Tables**:
- Include header row
- Align consistently (usually left-aligned)
- Keep rows concise (1-2 lines)
- Use for comparisons or reference data

### Writing Style

**Clarity**:
- Write for someone unfamiliar with your skill
- Define domain-specific terms on first use
- Use active voice: "Create the file" not "The file should be created"
- Be concise but complete

**Examples**:
- Every template should have a complete example
- Show real-world usage, not toy examples
- Include common variations
- Annotate non-obvious parts

**Consistency**:
- Use same terminology throughout
- Follow patterns from other assets in the skill
- Match style of SKILL.md
- Use consistent formatting

---

<!-- /ANCHOR:template-guidelines -->
<!-- ANCHOR:asset-file-checklist -->
## 10. ASSET FILE CHECKLIST

**Before creating an asset file, verify**:

```markdown
Structure:
□ Title with descriptive subtitle
□ Introduction paragraph (1-2 sentences)
□ Numbered sections with emojis
□ Horizontal rules (---) between major sections

Content:
□ Each template has complete example
□ Field descriptions explain purpose and format
□ Placeholders are obviously placeholders
□ Examples are realistic and working
□ No references to undefined sections

Quality:
□ File name follows conventions ([topic]_[type].md)
□ All code blocks specify language
□ Headers use consistent emoji style
□ No spelling or grammar errors
□ Links work correctly

Integration:
□ SKILL.md references this asset where appropriate
□ Asset complements (doesn't duplicate) SKILL.md content
□ File size appropriate (typically 100-800 lines)
□ Content is self-contained (doesn't require external context)
```

---

<!-- /ANCHOR:asset-file-checklist -->
<!-- ANCHOR:examples-from-this-skill -->
## 11. EXAMPLES FROM THIS SKILL

### Example 1: Template File

**File**: `frontmatter_templates.md`
**Purpose**: Provide YAML frontmatter templates for different document types
**Structure**:
- Introduction explaining frontmatter purpose
- One section per document type (SKILL.md, commands, knowledge files)
- Each section includes: required fields, template, field guidelines, complete example

**Key Features**:
- Clear separation by document type
- Field-by-field explanations
- Complete working examples
- Guidance on when to use vs. not use


### Example 2: Structure File

**File**: `structure_templates.md`
**Purpose**: Show correct document structure for each file type
**Structure**:
- TOC listing all templates
- One section per document type
- Section order requirements
- Emoji standards
- Quick validation checklist

**Key Features**:
- Visual structure examples
- Enforcement level specified
- Complete document templates
- Section ordering rules


### Example 3: Reference File

**File**: `llmstxt_templates.md`
**Purpose**: Templates for creating llms.txt files (AI-friendly site maps)
**Structure**:
- Format explanation
- Template sections for different scenarios
- Field descriptions
- Complete examples
- Best practices

**Key Features**:
- Multiple template variations
- Integration instructions
- Troubleshooting guidance
- Real-world examples

---

<!-- /ANCHOR:examples-from-this-skill -->
<!-- ANCHOR:asset-maintenance -->
## 12. ASSET MAINTENANCE

### When to Update Assets

**Update asset files when**:
- New template variations emerge
- User feedback reveals confusion
- Standards or conventions change
- New use cases discovered
- Examples become outdated

**Version control**:
- Note significant changes in skill version bump
- Keep examples current with latest patterns
- Remove deprecated templates
- Add migration notes for breaking changes


### Deprecation Strategy

**If removing a template**:
1. Mark as deprecated in section header: `## DEPRECATED: Template Name`
2. Explain why deprecated and what to use instead
3. Keep for 1-2 skill versions (with deprecation warning)
4. Remove after migration period

**Example**:
```markdown
## DEPRECATED: OLD TEMPLATE NAME

⚠️ **This template is deprecated as of v3.0.0**

**Use instead**: `new_template_name.md` (see Section 2)

**Migration**: Replace X with Y in your existing files
```

---

<!-- /ANCHOR:asset-maintenance -->
<!-- ANCHOR:best-practices-summary -->
## 13. BEST PRACTICES SUMMARY

**DO**:
- ✅ Create assets for reference data >50 lines
- ✅ Include complete, working examples
- ✅ Use clear, descriptive file names
- ✅ Reference from SKILL.md where relevant
- ✅ Keep assets focused (one topic per file)
- ✅ Use consistent formatting and emoji style

**DON'T**:
- ❌ Duplicate SKILL.md core content in assets
- ❌ Create assets for tiny snippets (<30 lines)
- ❌ Use generic file names (`templates.md`)
- ❌ Mix multiple topics in one asset file
- ❌ Create assets that require external context
- ❌ Forget to update SKILL.md references
- ❌ Include incomplete or broken examples

---

<!-- /ANCHOR:best-practices-summary -->
<!-- ANCHOR:asset-file-naming-quick-reference -->
## 14. ASSET FILE NAMING QUICK REFERENCE

**Location**: `.opencode/skill/[skill-name]/assets/`

**Format**: snake_case (underscores, lowercase)

| Asset Type | Naming Pattern           | Example                    | Purpose                    |
| ---------- | ------------------------ | -------------------------- | -------------------------- |
| Templates  | `[content]_templates.md` | `frontmatter_templates.md` | Copy-paste starting points |
| References | `[topic]_reference.md`   | `emoji_reference.md`       | Lookup tables, decisions   |
| Examples   | `[topic]_examples.md`    | `optimization_examples.md` | Working code examples      |
| Guides     | `[process]_guide.md`     | `packaging_guide.md`       | Step-by-step how-tos       |
| Checklists | `[topic]_checklist.md`   | `validation_checklist.md`  | Verification lists         |

**Naming Rules**:
- ✅ Use snake_case: `frontmatter_templates.md`
- ✅ Lowercase only: `config_examples.yaml`
- ❌ No hyphens: `frontmatter-templates.md`
- ❌ No PascalCase: `FrontmatterTemplates.md`

---

<!-- /ANCHOR:asset-file-naming-quick-reference -->
<!-- ANCHOR:related-resources -->
## 15. RELATED RESOURCES

### Templates
- [frontmatter_templates.md](../documentation/frontmatter_templates.md) - Frontmatter by document type
- [skill_md_template.md](./skill_md_template.md) - If converting to skill
- [skill_reference_template.md](./skill_reference_template.md) - Reference file templates
- [llmstxt_templates.md](../documentation/llmstxt_templates.md) - llms.txt file templates

### Standards
- [core_standards.md](../../references/global/core_standards.md) - Document type rules
- [skill_creation.md](../../references/specific/skill_creation.md) - Full skill creation workflow
<!-- /ANCHOR:related-resources -->
