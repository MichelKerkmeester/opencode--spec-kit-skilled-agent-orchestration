---
title: "Implementation Plan"
---
<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/plan.md -->
---
title: "Implementation Plan: Refactor /memory:learn → Constitutional Memory Manager"
status: done
level: 2
created: 2025-12-01
updated: 2026-03-08
---
<!-- ANCHOR:plan -->
# Implementation Plan

## Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command spec (AI prompt engineering) |
| **Framework** | OpenCode command system (`.opencode/command/`) |
| **Storage** | Constitutional memory files in `.opencode/skill/system-spec-kit/constitutional/` |
| **Testing** | Manual grep verification + cross-reference checks |

The `/memory:learn` command is a markdown-based AI instruction file that defines behavior for the `memory:learn` skill invocation. The refactor replaces the generic learning classifier with a focused constitutional memory manager. No TypeScript/JavaScript code changes are required — only markdown command definitions and their cross-references.

## Architecture

The refactor is contained entirely within the OpenCode command layer — no runtime code changes:

```
.opencode/command/memory/learn.md  ← primary rewrite target
.opencode/command/memory/README.txt ← cross-ref update
CLAUDE.md                           ← quick-reference update
.opencode/skill/system-spec-kit/README.md ← description update
```

The constitutional memory files themselves live in `.opencode/skill/system-spec-kit/constitutional/` and are managed by the MCP server's `memory_save()` handler for indexing.

## Phase 1: Core Command Rewrite

### Step 1: Rewrite `.opencode/command/memory/learn.md`

Complete replacement of the 620-line generic learning capture with a ~250-line constitutional memory manager.

#### New Structure
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

## Phase 2: Cross-Reference Updates and Verification

### Step 2: Update `.opencode/command/memory/README.txt`

- Update learn command description in table (line 50)
- Replace learn subcommands table (lines 66-73)
- Update usage examples (lines 114-118)

### Step 3: Update `CLAUDE.md` (project root)

- Quick Reference table: "Learn from mistakes" → "Create constitutional memory"
- Any other references to old learning types

### Step 4: Update `.opencode/skill/system-spec-kit/README.md`

- Line 525 area: update /memory:learn description

### Step 5: Verify

- Check no broken cross-references
- Verify constitutional/ directory structure documented correctly

## Implementation Notes

- The rewrite is a complete replacement — no incremental migration needed
- The old learn.md content is discarded entirely; it provided negligible value over `/memory:save`
- Constitutional memory files already have proper MCP indexing support via `memory_save()`
- No database schema changes or new MCP tools required

## Risk and Dependencies

- **Risk**: Existing users may expect old `/memory:learn` behavior — mitigated by updating all cross-references
- **Dependency**: `.opencode/skill/system-spec-kit/constitutional/` directory must exist (already does)
- **Dependency**: `memory_save()` MCP handler must support constitutional tier (already does)
<!-- /ANCHOR:plan -->
