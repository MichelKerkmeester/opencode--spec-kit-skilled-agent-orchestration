---
title: YAML Frontmatter Templates
description: Templates and validation rules for YAML frontmatter across all document types in the OpenCode ecosystem.
---

# YAML Frontmatter Templates - Document Type Reference

Templates and validation rules for YAML frontmatter by document type.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Is YAML Frontmatter?

**YAML frontmatter** is a metadata block at the beginning of markdown files, delimited by `---` markers. It provides machine-readable configuration that controls how AI agents and tools process the document.

```yaml
---
name: skill-name
description: What this skill does
allowed-tools: Read, Write, Bash
---

# Document Content Starts Here
```

**Core Purpose**:
- **Tool configuration** - Define which AI tools a skill/command can use
- **Discovery** - Enable programmatic listing and searching of skills/commands
- **Argument parsing** - Specify expected inputs for commands
- **Metadata storage** - Version, category, tags for organization

**Key Difference from Inline Metadata**:
- YAML frontmatter = Machine-parseable, strict format, at file start
- Inline metadata = Human-readable, flexible format, anywhere in document

### Document Types and Frontmatter Requirements

| Document Type | Frontmatter Required? | Reason |
|---------------|----------------------|--------|
| **SKILL.md** | ✅ **Required** | AI needs metadata to discover and invoke skills |
| **Command** | ✅ **Required** | Arguments and tools must be declared |
| **Knowledge** | ❌ **Forbidden** | Pure content, no programmatic interface |
| **Spec** | ❌ **Not recommended** | Use inline metadata for flexibility |
| **README** | ⚪ **Optional** | Usually none, unless documenting a skill |

### Core Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Delimiter syntax** | Must start and end with `---` on separate lines |
| **Position** | Must be at the very beginning of the file (line 1) |
| **YAML format** | Key-value pairs, no nested objects for required fields |
| **Single-line values** | Description must be on one line (parser limitation) |
| **Case-sensitive** | Field names are lowercase (`name`, not `Name`) |

### How Frontmatter Is Parsed

```
File loaded by OpenCode
         │
         ├─► Check line 1 for opening `---`
         │   └─► Not found? → No frontmatter (may be error for SKILL/Command)
         │
         ├─► Find closing `---` (within first 20 lines)
         │   └─► Not found? → Malformed frontmatter error
         │
         ├─► Parse YAML between delimiters
         │   └─► Invalid YAML? → Parse error
         │
         └─► Validate required fields by document type
             └─► Missing required? → Validation error
```

### Progressive Validation

```
Level 1: Structural Check
         └─ Delimiters present and properly formatted
            ↓
Level 2: Field Presence
         └─ Required fields exist for document type
            ↓
Level 3: Field Format
         └─ Values match expected patterns (e.g., lowercase-with-hyphens)
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-add-frontmatter -->
## 2. WHEN TO ADD FRONTMATTER

### Add Frontmatter When

**Programmatic Interface Needed**:
- Document is a SKILL.md that AI agents invoke
- Document is a command triggered via `/command-name`
- Document needs tool restrictions (`allowed-tools`)
- Document requires argument specification

**Discovery Required**:
- Skills/commands need to appear in listings
- Metadata enables search and filtering
- Version tracking needed

**By Document Type**:

| Document Type | Add Frontmatter? | Required Fields | Optional Fields |
|---------------|------------------|-----------------|-----------------|
| **SKILL.md** | ✅ Always | `name`, `description`, `allowed-tools` | `tags`, `category`, `version` |
| **Command** | ✅ Always | `description`, `argument-hint`, `allowed-tools` | `name`, `model`, `version` |
| **Knowledge** | ❌ Never | — | — |
| **Spec** | ❌ Avoid | — | Use inline metadata instead |
| **README** | ⚪ Rarely | Only if in `.opencode/skill/*/` | — |

### Remove Frontmatter When

**Content-Only Documents**:
- Knowledge files (reference documentation)
- Spec files (planning documents)
- General markdown files

**Why Remove from Knowledge/Spec**:
- Frontmatter implies programmatic interface
- These documents are pure content
- Adds confusion about document purpose

### Decision Framework

```
Is this document invoked programmatically?
├─► YES
│   │
│   ├─► Is it a SKILL.md?
│   │   └─► Add frontmatter: name, description, allowed-tools
│   │
│   └─► Is it a Command?
│       └─► Add frontmatter: description, argument-hint, allowed-tools
│
└─► NO
    │
    ├─► Is it a Knowledge file?
    │   └─► Remove frontmatter if present
    │
    ├─► Is it a Spec file?
    │   └─► Remove frontmatter, use inline metadata
    │
    └─► Is it a README?
        ├─► In .opencode/skill/*/? → Optional skill-style frontmatter
        └─► Elsewhere? → No frontmatter needed
```

### Frontmatter Field Summary

| Field | SKILL.md | Command | Purpose |
|-------|----------|---------|---------|
| `name` | ✅ Required | ⚪ Optional | Identifier (lowercase-with-hyphens) |
| `description` | ✅ Required | ✅ Required | One-line explanation of purpose |
| `allowed-tools` | ✅ Required | ✅ Required | Comma-separated tool list |
| `argument-hint` | ❌ N/A | ✅ Required | Syntax hint: `<required> [optional]` |
| `model` | ❌ N/A | ⚪ Optional | Override default model (rarely used) |
| `version` | ⚪ Optional | ⚪ Optional | Semantic version |
| `tags` | ⚪ Optional | ❌ N/A | Categorization keywords |

---

<!-- /ANCHOR:when-to-add-frontmatter -->
<!-- ANCHOR:field-reference -->
## 3. FIELD REFERENCE

### `name` Field

**Purpose**: Unique identifier for skills

**Format Requirements**:
- Pattern: `^[a-z][a-z0-9-]*$`
- Style: `lowercase-with-hyphens`
- Should match directory name

**Examples**:
```yaml
# GOOD
name: document-style-validator
name: git-commit
name: system-spec-kit

# BAD
name: DocumentStyleValidator  # No uppercase
name: document_style_validator  # No underscores
name: 123-skill  # Cannot start with number
```

### `description` Field

**Purpose**: Human-readable explanation of what the skill/command does

**Format Requirements**:
- One to two sentences maximum
- **MUST be on a single line** (parser limitation)
- 10-200 characters recommended

**Critical Warning**:

> ⚠️ **YAML Multiline Strings Are Not Parsed**
>
> The skill parser does not handle YAML multiline block format. Keep your description on a single line after the colon.
>
> ```yaml
> # ❌ BAD - Will not be parsed correctly
> description:
>   This is my skill description
>   spanning multiple lines.
>
> # ✅ GOOD - Single line after colon
> description: This is my skill description all on one line.
> ```
>
> **Note**: Prettier and other formatters may auto-format long descriptions to multiline. If this happens, manually revert to single-line format.

**Examples**:
```yaml
# GOOD
description: Validates markdown document structure against style guide requirements
description: Four-phase debugging framework for browser console errors and CSS issues

# BAD
description: Validates  # Too short
description:  # Empty
```

### `allowed-tools` Field

**Purpose**: Restricts which AI tools the skill/command can use

**Format Requirements**:
- Comma-separated list
- Order by frequency of use (most common first)
- Use exact tool names

**Common Tools**:
| Tool | Purpose |
|------|---------|
| `Read` | Read file contents |
| `Write` | Create/overwrite files |
| `Edit` | Modify existing files |
| `Bash` | Execute shell commands |
| `Grep` | Search file contents |
| `Glob` | Find files by pattern |
| `WebFetch` | Fetch web content |
| `Task` | Spawn sub-agents |

**Examples**:
```yaml
# Common patterns
allowed-tools: Read, Write, Edit, Bash
allowed-tools: Read, Grep, Glob
allowed-tools: Read, Bash, WebFetch

# MCP tools
allowed-tools: Read, mcp__semantic-search__semantic_search
```

### `argument-hint` Field (Commands Only)

**Purpose**: Shows expected command syntax in `/help` output

**Format Conventions**:
| Syntax | Meaning | Example |
|--------|---------|---------|
| `<arg>` | Required argument | `<query>` |
| `[arg]` | Optional argument | `[--verbose]` |
| `[:mode]` | Mode suffix | `[:auto\|:confirm]` |

**Examples**:
```yaml
argument-hint: <query>
argument-hint: <task> [:auto|:confirm]
argument-hint: <name> [type] [--force]
argument-hint: [--confirm]
```

### `model` Field (Commands Only)

**Purpose**: Override default AI model for command execution

**Usage**: Use sparingly - only for commands requiring complex reasoning

```yaml
# Only use for genuinely complex workflows
model: opus
```

---

<!-- /ANCHOR:field-reference -->
<!-- ANCHOR:document-type-templates -->
## 4. DOCUMENT TYPE TEMPLATES

### SKILL.md Frontmatter Template

**Required Fields**: `name`, `description`, `allowed-tools`

```yaml
---
name: skill-name
description: Brief one-line description of what this skill does and when to use it
allowed-tools: Read, Write, Edit, Bash, Grep
---
```

**Complete Example**:
```yaml
---
name: code-systematic-debugging
description: Four-phase debugging framework for browser console errors, CSS layout issues, JavaScript animations, and Webflow-specific bugs
allowed-tools: Read, Bash, Grep
---
```

### Command Frontmatter Template

**Required Fields**: `description`, `argument-hint`, `allowed-tools`

```yaml
---
description: Brief description of what this command does
argument-hint: <required_arg> [optional_arg]
allowed-tools: Read, Write, Bash
---
```

**Complete Example**:
```yaml
---
description: Generate properly structured command files with correct YAML frontmatter
argument-hint: <name> [purpose]
allowed-tools: Read, Write, Bash
---
```

### Knowledge File (No Frontmatter)

**Rule**: Knowledge files should **NOT** have YAML frontmatter.

```markdown
# ❌ BEFORE (incorrect)
---
name: document-style-guide
description: Style guide for documentation
---

# Document Style Guide

Content...

# ✅ AFTER (correct)
# Document Style Guide

Content...
```

### Spec File (Inline Metadata Instead)

**Rule**: Specs use inline metadata, not YAML frontmatter.

```markdown
# Feature Name - Spec

**Date**: 2025-01-15
**Version**: 1.0
**Priority**: HIGH

Brief introduction...
```

**Rationale**: Specs evolve rapidly during planning. YAML frontmatter adds formality that slows iteration.

---

<!-- /ANCHOR:document-type-templates -->
<!-- ANCHOR:validation-rules -->
## 5. VALIDATION RULES

### Validation by Document Type

```yaml
validation_rules:
  SKILL:
    frontmatter_required: true
    required_fields:
      - name
      - description
      - allowed-tools
    optional_fields:
      - tags
      - category
      - version
    field_formats:
      name:
        pattern: "^[a-z][a-z0-9-]*$"
        description: "lowercase-with-hyphens"
      description:
        min_length: 10
        max_length: 200
      allowed-tools:
        type: "comma-separated-list"

  Command:
    frontmatter_required: true
    required_fields:
      - description
      - argument-hint
      - allowed-tools
    optional_fields:
      - name
      - model
      - version
    field_formats:
      description:
        min_length: 10
        max_length: 100
      argument-hint:
        pattern: "contains < or ["

  Knowledge:
    frontmatter_required: false
    action_if_present: "remove"

  Spec:
    frontmatter_required: false
    action_if_present: "suggest_removal"

  README:
    frontmatter_required: false
    action_if_present: "no_action"
```

### Validation Checklist

**Structural Checks**:
- [ ] File starts with `---` on line 1
- [ ] Closing `---` found within first 20 lines
- [ ] Valid YAML syntax between delimiters

**Field Presence (SKILL.md)**:
- [ ] `name` field present
- [ ] `description` field present
- [ ] `allowed-tools` field present

**Field Presence (Command)**:
- [ ] `description` field present
- [ ] `argument-hint` field present
- [ ] `allowed-tools` field present

**Field Format**:
- [ ] `name` is lowercase-with-hyphens
- [ ] `description` is single line, 10-200 chars
- [ ] `allowed-tools` is comma-separated list
- [ ] `argument-hint` uses `<required>` and `[optional]` syntax

---

<!-- /ANCHOR:validation-rules -->
<!-- ANCHOR:common-fixes -->
## 6. COMMON FIXES

### Missing Frontmatter

**SKILL.md without frontmatter**:
```yaml
# ADD at beginning of file:
---
name: inferred-from-directory
description: Inferred from H1 subtitle or first paragraph
allowed-tools: Read, Write, Bash
---
```

### Missing Fields

```yaml
# BEFORE (missing allowed-tools)
---
name: my-skill
description: My skill description
---

# AFTER (field added)
---
name: my-skill
description: My skill description
allowed-tools: Read, Write, Bash
---
```

### Incorrect Field Names

```yaml
# BEFORE (wrong field names)
---
Name: my-skill       # Should be lowercase
desc: Description    # Should be 'description'
tools: Read          # Should be 'allowed-tools'
---

# AFTER (corrected)
---
name: my-skill
description: Description
allowed-tools: Read
---
```

### Malformed Delimiters

```yaml
# BEFORE (missing closing delimiter)
---
name: my-skill
description: Description
allowed-tools: Read

# Content starts here...

# AFTER (delimiter added)
---
name: my-skill
description: Description
allowed-tools: Read
---

# Content starts here...
```

### Multiline Description Fix

```yaml
# BEFORE (multiline - won't parse)
---
name: my-skill
description:
  This is a long description
  that spans multiple lines
allowed-tools: Read
---

# AFTER (single line)
---
name: my-skill
description: This is a long description that spans multiple lines
allowed-tools: Read
---
```

### Remove from Knowledge File

```yaml
# BEFORE (knowledge file with frontmatter)
---
name: style-guide
description: Documentation standards
---

# Style Guide

Content...

# AFTER (frontmatter removed)
# Style Guide

Content...
```

---

<!-- /ANCHOR:common-fixes -->
<!-- ANCHOR:auto-generation-guidelines -->
## 7. AUTO-GENERATION GUIDELINES

### Field Inference Rules

When auto-generating frontmatter, infer values from document content:

**`name` Field**:
```
Source: Parent directory name
Method: Extract from file path

Example:
  Input: .opencode/skill/my-skill/SKILL.md
  Output: my-skill
```

**`description` Field**:
```
Source: H1 subtitle or first paragraph
Method: 
  1. Look for " - " in H1 (e.g., "# Skill Name - Description")
  2. Fallback to first paragraph after H1

Example:
  H1: "# My Skill - Brief description of purpose"
  Output: "Brief description of purpose"
```

**`argument-hint` Field** (Commands):
```
Source: INPUTS section or CONTRACT section
Method: Extract from Required/Optional input lists

Example:
  Content:
    ### Required Inputs
    - `name`: Skill name
    ### Optional Inputs  
    - `version`: Version number
  
  Output: <name> [version]
```

**`allowed-tools` Field**:
```
Source: WORKFLOW section code examples
Method: Extract tool names from code blocks

Example:
  Content:
    ```
    Read("file.md")
    Write("output.md", content)
    Bash("ls -la")
    ```
  
  Output: Read, Write, Bash
```

### Auto-Generation Decision Tree

```
Document type detected?
├─► SKILL.md
│   ├─ Has frontmatter? → Validate fields
│   └─ Missing frontmatter? → Auto-generate + ask user to review
│
├─► Command
│   ├─ Has frontmatter? → Validate fields
│   └─ Missing frontmatter? → Auto-generate from content
│
├─► Knowledge
│   ├─ Has frontmatter? → Remove it
│   └─ No frontmatter? → Valid (no action)
│
├─► Spec
│   ├─ Has frontmatter? → Suggest removal
│   └─ No frontmatter? → Valid (no action)
│
└─► README
    ├─ In .opencode/skill/*/? → Optional skill-style
    └─ Elsewhere? → No frontmatter needed
```

---

<!-- /ANCHOR:auto-generation-guidelines -->
<!-- ANCHOR:interactive-workflow -->
## 8. INTERACTIVE WORKFLOW

### Adding Frontmatter Interactively

**Step 1: Present Inferred Template**
```
STRUCTURAL FIX: Add YAML Frontmatter

File: .opencode/skill/new-skill/SKILL.md
Type: SKILL.md (frontmatter required)

Proposed frontmatter (inferred from document):
---
name: new-skill
description: Brief description inferred from H1 subtitle
allowed-tools: Read, Write, Bash
---

Options:
1. Accept as-is
2. Edit values before applying
3. Skip (leave non-compliant)

Choice:
```

**Step 2: Edit Values (if selected)**
```
Edit frontmatter values:

name [new-skill]: _
description [Brief description...]: _
allowed-tools [Read, Write, Bash]: _

Press Enter to keep default, or type new value.
```

**Step 3: Apply**
```bash
# Insert at beginning of file
{
  echo "---"
  echo "name: $name"
  echo "description: $description"
  echo "allowed-tools: $allowed_tools"
  echo "---"
  echo ""
  cat original_file.md
} > updated_file.md
```

---

<!-- /ANCHOR:interactive-workflow -->
<!-- ANCHOR:best-practices-summary -->
## 9. BEST PRACTICES SUMMARY

### DO

| Practice | Reason |
|----------|--------|
| Keep description on single line | Parser limitation |
| Match `name` to directory name | Consistency, discoverability |
| Order tools by frequency | Most used first |
| Use exact tool names | Case-sensitive matching |
| Validate before committing | Catch errors early |

### DON'T

| Anti-Pattern | Problem |
|--------------|---------|
| Multiline descriptions | Won't parse correctly |
| Uppercase in `name` | Violates format requirement |
| Frontmatter on knowledge files | Implies programmatic interface |
| Empty required fields | Validation failure |
| Made-up tool names | Tools won't be available |

---

<!-- /ANCHOR:best-practices-summary -->
<!-- ANCHOR:quick-reference -->
## 10. QUICK REFERENCE

### Frontmatter Decision Tree

```
Document type?
├─► SKILL.md       → MUST have: name, description, allowed-tools
├─► Command        → MUST have: description, argument-hint, allowed-tools
├─► Knowledge      → MUST NOT have frontmatter (remove if present)
├─► Spec           → SHOULD NOT have frontmatter (use inline metadata)
└─► README         → No requirement (usually none)
```

### Field Requirements Matrix

| Document Type | name | description | argument-hint | allowed-tools |
|---------------|------|-------------|---------------|---------------|
| **SKILL.md** | ✅ Required | ✅ Required | ❌ N/A | ✅ Required |
| **Command** | ⚪ Optional | ✅ Required | ✅ Required | ✅ Required |
| **Knowledge** | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **Spec** | ❌ Not used | ❌ Not used | ❌ Not used | ❌ Not used |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Knowledge file with frontmatter | Remove frontmatter |
| SKILL.md missing `name` | Add with directory name |
| Command missing `argument-hint` | Infer from content or ask |
| Spec with YAML frontmatter | Convert to inline metadata |
| Wrong field names (Name vs name) | Use lowercase field names |
| Multiline description | Collapse to single line |

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

### Templates
- [skill_md_template.md](../opencode/skill_md_template.md) - SKILL.md file templates
- [command_template.md](../opencode/command_template.md) - Command file templates

### Standards
- [core_standards.md](../../references/global/core_standards.md) - Document type rules
- [validation.md](../../references/global/validation.md) - Quality scoring
<!-- /ANCHOR:related-resources -->
