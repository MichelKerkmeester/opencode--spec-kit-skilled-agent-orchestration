---
title: "Implementation Plan: Refactor /memory:learn → Constitutional Memory Manager"
---
# Implementation Plan

## Step 1: Rewrite `.opencode/command/memory/learn.md`

Complete replacement of the 620-line generic learning capture with a ~250-line constitutional memory manager.

### New Structure
1. Frontmatter — updated description, argument-hint, allowed-tools
2. Subcommand routing — create (default), list, edit, remove, budget
3. Contract — Constitutional Memory Manager role
4. CREATE workflow (5 phases): extract → qualify → structure → budget-check → write+index
5. LIST subcommand — show all constitutional files + token budget
6. EDIT subcommand — modify existing constitutional memory
7. REMOVE subcommand — delete file + re-index
8. BUDGET subcommand — token budget status
9. MCP enforcement matrix
10. Examples
11. Error handling
12. Quick reference

## Step 2: Update `.opencode/command/memory/README.txt`

- Update learn command description in table (line 50)
- Replace learn subcommands table (lines 66-73)
- Update usage examples (lines 114-118)

## Step 3: Update `CLAUDE.md` (project root)

- Quick Reference table: "Learn from mistakes" → "Create constitutional memory"
- Any other references to old learning types

## Step 4: Update `.opencode/skill/system-spec-kit/README.md`

- Line 525 area: update /memory:learn description

## Step 5: Verify

- Check no broken cross-references
- Verify constitutional/ directory structure documented correctly
