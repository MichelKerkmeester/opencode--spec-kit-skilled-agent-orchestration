---
title: "Spec: Constitutional Memory System README [047-constitutional-readme/spec]"
description: "Create comprehensive documentation (README.md) for the constitutional memory system located at .opencode/skill/system-spec-kit/constitutional/. The README should explain how con..."
trigger_phrases:
  - "spec"
  - "constitutional"
  - "memory"
  - "system"
  - "readme"
  - "047"
importance_tier: "important"
contextType: "decision"
---
# Spec: Constitutional Memory System README

| Metadata | Value |
|----------|-------|
| **Spec ID** | 047 |
| **Title** | Constitutional Memory System README |
| **Status** | Complete |
| **Priority** | P1 |
| **Level** | 1 |
| **Created** | 2025-12-27 |

---

## 1. Objective

Create comprehensive documentation (README.md) for the constitutional memory system located at `.opencode/skill/system-spec-kit/constitutional/`. The README should explain how constitutional memories work, how to create new ones, and how to customize existing ones.

---

## 2. Scope

### In Scope

- Create README.md in the constitutional/ directory
- Document the constitutional tier behavior (always surfaces, 3.0x boost, no decay)
- Explain YAML frontmatter requirements
- Provide templates for creating new constitutional memories
- Document trigger phrase configuration
- Include troubleshooting section

### Out of Scope

- Modifying existing constitutional memories
- Changes to the MCP server code
- Changes to the importance tier system

---

## 3. Success Criteria

- [x] README.md created in constitutional/ directory
- [x] Follows established README patterns from other skill folders
- [x] Includes TABLE OF CONTENTS with numbered sections
- [x] Documents all required frontmatter fields
- [x] Provides complete template for new constitutional memories
- [x] Includes customization guide
- [x] Has troubleshooting section

---

## 4. Technical Context

### Constitutional Tier Behavior

| Metric | Value |
|--------|-------|
| Token Budget | ~500 tokens max per search |
| Search Boost | 3.0x multiplier |
| Decay | Never |
| Auto-Expire | Never |
| Always Surfaces | Yes (top of every search) |

### File Location

```
.opencode/skill/system-spec-kit/constitutional/
├── README.md              # Created by this spec
├── gate-enforcement.md    # Existing constitutional memory
```

---

## 5. Dependencies

- Existing README patterns from `.opencode/skill/system-spec-kit/` folder
- Understanding of constitutional tier from MCP server implementation
- ANCHOR format documentation

---

## 6. Notes

This is a documentation-only task. No code changes required.
