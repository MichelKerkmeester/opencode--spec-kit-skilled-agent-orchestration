---
title: "Fix Plan - UX Deep Analysis [033-ux-deep-analysis/plan]"
description: "1. Fix MCP tool naming in all memory commands"
trigger_phrases:
  - "fix"
  - "plan"
  - "deep"
  - "analysis"
  - "033"
importance_tier: "important"
contextType: "decision"
---
# Fix Plan - UX Deep Analysis

## Phase 1: P0 Critical Fixes (Blocking)
1. Fix MCP tool naming in all memory commands
2. Create root README.md
3. Document Windows compatibility requirements
4. Fix retry-manager.js getDb() bug
5. Add spec folder validation to generate-context.js
6. Fix template count documentation

## Phase 2: P1 High-Impact Fixes
1. Fix decay formula (90-day → ~62-day)
2. Standardize command notation (colon format)
3. Add global /help command
4. Add "What is a spec folder?" definition
5. Create QUICKSTART.md
6. Document missing templates

## Phase 3: P2 UX Improvements
1. Improve error messages with codes
2. Add database cleanup MCP tool
3. Expand worked_examples.md
4. Add filled template examples
5. Create command cheatsheet

## Phase 4: P3 Polish
1. Add visual diagrams
2. Create video walkthrough reference
3. Add version history
4. Improve progressive disclosure

## Dependencies
- Phase 1 must complete before public release
- Phase 2 recommended before public release
- Phase 3-4 can be iterative post-release
