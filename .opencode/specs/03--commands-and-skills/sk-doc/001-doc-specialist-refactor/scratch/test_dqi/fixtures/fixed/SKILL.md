---
name: create-documentation
description: Unified markdown and skill management specialist providing document quality enforcement, content optimization, and ASCII flowchart creation.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 5.0.0
---

<!-- Keywords: create-documentation -->

# Documentation Creation Specialist - Unified Markdown & Skill Management

Unified specialist providing document quality pipeline with structure enforcement, content optimization, and style guide compliance via script-assisted AI analysis.

---

## 1. WHEN TO USE

Use this skill when:

- Writing or optimizing markdown documentation
- Enforcing structural standards through validation
- Improving AI-friendliness of documentation
- Creating new OpenCode skills

---

## 2. HOW IT WORKS

The skill operates through script-assisted AI analysis:

1. `extract_structure.py` parses documents into structured JSON
2. AI evaluates quality based on the parsed data
3. Recommendations are provided for improvements

```javascript
const config = { valid: true };
```

---

## 3. RULES

Follow these rules when using this skill:

- All H2 headings must have number + emoji + ALL CAPS
- Code blocks must have language tags
- No placeholder markers in final documents
- H1 must not have emoji for skill files

---

## 4. REFERENCES

- [Validation Reference](./references/validation.md)
- [Core Standards](./references/core_standards.md)

This file demonstrates a properly formatted SKILL.md with:
1. Clean H1 (no emoji)
2. All H2s have number + emoji + ALL CAPS
3. Code blocks have language tags
4. No placeholders
5. Sequential section numbering
