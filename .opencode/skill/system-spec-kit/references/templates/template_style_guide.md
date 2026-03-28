---
title: Template Style Guide
description: Conventions and standards for system-spec-kit templates ensuring documentation consistency across all spec folders.
---

# Template Style Guide - Formatting Standards

Conventions and standards for system-spec-kit templates ensuring documentation consistency across all spec folders.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Consistent templates enable predictable documentation structure, automated validation, and seamless context recovery across sessions.

### When to Use This Guide

- Creating new spec folder templates
- Modifying existing template files
- Validating template compliance
- Understanding placeholder syntax
- Troubleshooting validation failures

### Template Inventory

Current templates (10 user-facing + 1 internal):

| Level | Templates |
|-------|-----------|
| **Level 1** | spec.md, plan.md, tasks.md, implementation-summary.md |
| **Level 2** | + checklist.md |
| **Level 3** | + decision-record.md, research/research.md |
| **Utility** | handover.md, debug-delegation.md |
| **Internal** | context_template.md (memory file generation) |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:metadata-format -->
## 2. METADATA FORMAT

### Standard Format

Use bulleted list format for metadata sections in all templates:

```markdown
### Metadata
- **Created:** [FORMAT: YYYY-MM-DD]
- **Level:** [FORMAT: 1 / 2 / 3 / 3+]
- **Status:** [YOUR_VALUE_HERE: Planning / In Progress / Complete]
- **Owner:** [YOUR_VALUE_HERE: team or person]
```

> **Note:** Level 3+ coordination-root packets may use a metadata table format with point-in-time snapshot fields.

### Format Exceptions

| Template | Format | Reason |
|----------|--------|--------|
| `context_template.md` | Mustache syntax (`{{VARIABLE}}`) | Programmatic generation via generate-context.js |
| `debug-delegation.md` | Inline format | Auto-generated content structure |

### Why Bulleted Lists

- **Consistency** - Same format across all templates
- **Readability** - Clear visual hierarchy
- **Validation** - Easier to parse programmatically
- **Flexibility** - Easy to add/remove fields

---

<!-- /ANCHOR:metadata-format -->
<!-- ANCHOR:placeholder-syntax -->
## 3. PLACEHOLDER SYNTAX

### Placeholder Types

| Format | Purpose | Example |
|--------|---------|---------|
| `[YOUR_VALUE_HERE: description]` | User-provided values | `[YOUR_VALUE_HERE: feature-name]` |
| `[FORMAT: options]` | Constrained format | `[FORMAT: YYYY-MM-DD]` |
| `[NEEDS CLARIFICATION: question]` | Multi-choice questions | `[NEEDS CLARIFICATION: (a) option (b) option]` |
| `[OPTIONAL: description]` | Optional fields | `[OPTIONAL: link to spec.md]` |
| `{{MUSTACHE}}` | Auto-generated (context_template.md only) | `{{SESSION_ID}}` |

### Usage Guidelines

**User-Provided Values:**
```markdown
- **Feature:** [YOUR_VALUE_HERE: feature name]
- **Owner:** [YOUR_VALUE_HERE: team or person responsible]
```

**Constrained Formats:**
```markdown
- **Created:** [FORMAT: YYYY-MM-DD]
- **Priority:** [FORMAT: P0 / P1 / P2]
- **Status:** [FORMAT: Planning / In Progress / Complete]
```

**Clarification Needed:**
```markdown
- **Approach:** [NEEDS CLARIFICATION: (a) refactor existing (b) rewrite from scratch]
```

**Optional Fields:**
```markdown
- **Related Spec:** [OPTIONAL: link to related spec.md]
- **Dependencies:** [OPTIONAL: list external dependencies]
```

---

<!-- /ANCHOR:placeholder-syntax -->
<!-- ANCHOR:section-numbering -->
## 4. SECTION NUMBERING

### Standard Format

Use numbered sections with emoji and UPPERCASE:

```markdown
\## 1. SECTION NAME
\## 2. ANOTHER SECTION
\## 3. THIRD SECTION
```

### Emoji Usage

Emojis are OPTIONAL in spec folder templates. When used:

| Section Type | Emoji | Example |
|--------------|-------|---------|
| Overview/Summary | - | `## 1. OVERVIEW` |
| Goals/Objectives | - | `## 2. GOALS` |
| Implementation | - | `## 3. IMPLEMENTATION` |
| Validation | - | `## 4. VALIDATION` |

### Title Case Exception

The following templates may use Title Case for improved readability:
- `handover.md` - Session handover context
- `implementation-summary.md` - Post-implementation summary

---

<!-- /ANCHOR:section-numbering -->
<!-- ANCHOR:date-formats -->
## 5. DATE FORMATS

### Standard Format

Always use ISO 8601 format: `YYYY-MM-DD`

### Examples

| Context | Format | Example |
|---------|--------|---------|
| Created date | `YYYY-MM-DD` | `2025-12-31` |
| Updated date | `YYYY-MM-DD` | `2025-12-31` |
| Placeholder | `[FORMAT: YYYY-MM-DD]` | User fills in |

### Why ISO Format

- **Unambiguous** - No confusion between MM/DD and DD/MM
- **Sortable** - Alphabetical sort = chronological sort
- **International** - Works across all locales

---

<!-- /ANCHOR:date-formats -->
<!-- ANCHOR:file-naming -->
## 6. FILE NAMING

### Naming Convention

Templates use **kebab-case**: lowercase with hyphens.

| Valid | Invalid |
|-------------|-----------------|
| `decision-record.md` | `DecisionRecord.md` |
| `implementation-summary.md` | `implementation_summary.md` |
| `spec.md` | `Spec.md` |

### Template Markers

All templates should include a source marker for validation and change tracking:

```html
<!-- SPECKIT_TEMPLATE_SOURCE: template-name | v1.0 -->
```

**Placement:** First line of the template file (before frontmatter if present).

**Purpose:**
- Enables automated validation
- Tracks template version
- Identifies template origin

---

<!-- /ANCHOR:file-naming -->
<!-- ANCHOR:frontmatter-requirements -->
## 7. FRONTMATTER REQUIREMENTS

### When Required

| Template Type | Frontmatter | Reason |
|---------------|-------------|--------|
| Memory files (`memory/*.md`) | Required | ANCHOR format for indexing |
| Spec folder files | Optional | Human-readable metadata |
| Reference files | Required | Skill system indexing |

### Memory File Frontmatter (ANCHOR Format)

```yaml
---
title: [Descriptive title for semantic search]
specFolder: [###-folder-name]
sessionId: [YYYYMMDD_HHMMSS]
triggers:
  - [keyword 1]
  - [keyword 2]
importanceTier: [normal / important / critical]
---
```

### Spec Folder File Frontmatter

```yaml
---
title: [Document title]
created: [YYYY-MM-DD]
status: [Planning / In Progress / Complete]
---
```

---

<!-- /ANCHOR:frontmatter-requirements -->
<!-- ANCHOR:validation-rules -->
## 8. VALIDATION RULES

### Automated Checks

The `validate.sh` script enforces these rules:

| Rule | Check | Severity |
|------|-------|----------|
| Folder naming | `###-short-name` pattern | ERROR |
| Required files | Level-appropriate files exist | ERROR |
| Frontmatter syntax | Valid YAML | ERROR |
| implementation-summary.md | Exists for completed specs | ERROR (Level 1+) |
| Placeholder completion | No unfilled `[YOUR_VALUE_HERE:]` | WARN |

### Manual Checks

| Rule | Description |
|------|-------------|
| Metadata format | Bulleted list format used |
| Date format | ISO 8601 (YYYY-MM-DD) |
| Section numbering | Sequential, UPPERCASE |
| File naming | kebab-case |

---

<!-- /ANCHOR:validation-rules -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Templates

| Template | Location | Purpose |
|----------|----------|---------|
| All spec templates | `templates/` | Spec folder documentation |
| context_template.md | `templates/` | Memory file generation |

### Validation

| Script | Purpose |
|--------|---------|
| `scripts/spec/validate.sh` | Spec folder validation |
| `scripts/rules/check-files.sh` | File existence checks |
| `scripts/rules/check-folder-naming.sh` | Folder naming validation |
| `scripts/rules/check-frontmatter.sh` | YAML frontmatter validation |

### Related References

- [validation_rules.md](../validation/validation_rules.md) - Complete validation rule documentation
- [memory_system.md](../memory/memory_system.md) - Memory file format and indexing
- [folder_routing.md](../structure/folder_routing.md) - Spec folder organization
<!-- /ANCHOR:related-resources -->
