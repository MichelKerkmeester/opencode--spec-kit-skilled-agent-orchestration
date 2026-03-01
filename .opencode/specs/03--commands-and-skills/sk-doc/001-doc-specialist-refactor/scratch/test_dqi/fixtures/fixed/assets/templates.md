# SKILL.md File Templates

Comprehensive templates and guidelines for creating effective SKILL.md files for AI agent skills.

---

## 1. INTRODUCTION

This guide provides templates for creating SKILL.md files of varying complexity levels.

Templates are flexible and can be adapted for simple single-purpose tools to complex multi-mode orchestrators.

---

## 2. BASIC TEMPLATE

A minimal template for simple skills:

```yaml
---
name: my-skill
description: A brief description of what this skill does.
allowed-tools: [Read, Write, Edit]
version: 1.0.0
---
```

```markdown
# My Skill Title

Brief introduction paragraph.

---

## 1. WHEN TO USE

Use this skill when...

---

## 2. HOW IT WORKS

The skill works by...
```

---

## 3. ADVANCED TEMPLATE

For complex multi-mode skills with bundled resources:

```yaml
name: advanced-skill
description: An advanced skill with multiple modes and resources.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 2.0.0
```

Advanced skills include references/, assets/, and scripts/ folders.

---

## 4. REFERENCES

- [Skill Creation Guide](./references/skill_creation.md)
- [Validation Reference](./references/validation.md)

This file demonstrates a properly formatted asset/template with:
1. Clean H1 (no emoji)
2. All H2s have number + emoji + title
3. Code blocks have language tags (yaml, markdown)
4. No placeholders
5. Sequential section numbering (1-4)
6. Introduction paragraph after H1
