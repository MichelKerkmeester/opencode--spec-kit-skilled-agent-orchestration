---
title: "Anchor System Enforcement [014-anchor-enforcement/spec]"
description: "Enforce correct anchor format throughout memory system to enable section-specific retrieval with 93% token savings."
trigger_phrases:
  - "anchor"
  - "system"
  - "enforcement"
  - "spec"
  - "014"
importance_tier: "important"
contextType: "decision"
---
# Anchor System Enforcement

## Overview

Enforce correct anchor format throughout memory system to enable section-specific retrieval with 93% token savings.

## Problem Statement

Memory files were using inconsistent anchor formats:
- Some used `<!-- ANCHOR_EXAMPLE: id -->` (lowercase, no closing tag)
- MCP server expected `<!-- ANCHOR_EXAMPLE:id -->` (UPPERCASE with closing tag)
- Result: `memory_load({ anchorId: "..." })` always failed silently

## Solution

1. **Standardize on MCP server format:**
   ```html
   <!-- ANCHOR_EXAMPLE:anchor-id -->
   Content...
   <!-- /ANCHOR_EXAMPLE:anchor-id -->
   ```

2. **Enforce through documentation:**
   - Updated save.md command with anchor generation section
   - Updated search.md command with anchor-aware loading UI
   - Updated workflows-memory SKILL.md with correct format
   - Fixed context_template.md (all 16 anchor references)

## Anchor ID Pattern

Format: `[context-type]-[keywords]-[spec-number]`

| Context Type | Use For | Example |
|--------------|---------|---------|
| `implementation` | Code patterns | `implementation-oauth-callback-049` |
| `decision` | Architecture choices | `decision-database-schema-005` |
| `research` | Investigation | `research-lenis-scroll-006` |
| `discovery` | Learnings | `discovery-api-limits-011` |
| `general` | Mixed content | `general-session-summary-049` |

## Files Modified

| File | Changes |
|------|---------|
| `.opencode/command/memory/save.md` | Added Step 2.5: Anchor Generation (MANDATORY) |
| `.opencode/command/memory/search.md` | Added anchorId to MCP signatures, anchor-aware detail view |
| `.opencode/skills/workflows-memory/SKILL.md` | Fixed anchor format documentation |
| `.opencode/memory/templates/context_template.md` | Fixed 16 anchors to UPPERCASE format |

## Verification

```bash
# Should find UPPERCASE anchors
grep -c "ANCHOR:" .opencode/memory/templates/context_template.md
# Expected: 16

# Should find NO lowercase anchors
grep -c "anchor:" .opencode/memory/templates/context_template.md
# Expected: 0
```

## Token Savings

When loading a specific anchor vs full file:
- Full file: ~10,000-15,000 tokens
- Single anchor section: ~500-1,500 tokens
- **Savings: ~93%**
