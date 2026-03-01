---
name: bad-multiline
# Multiline YAML block scalars are not allowed in SKILL frontmatter.
description: |
  This should fail because description uses a block scalar.
allowed-tools: [Read, Edit]
version: 0.1.0
---

# Bad Multiline

## 1. WHEN TO USE

- Test multiline `description: |` detection.

## 2. ️ HOW TO USE

Run validation against this file.

## 3. RULES

- ✅ Validators must reject multiline description.

## 4. SUCCESS CRITERIA

- ✅ Validation fails with multiline description error.
