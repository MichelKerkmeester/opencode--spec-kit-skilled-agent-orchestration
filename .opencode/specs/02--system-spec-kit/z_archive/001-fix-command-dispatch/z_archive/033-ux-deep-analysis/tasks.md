---
title: "Tasks - UX Deep Analysis [033-ux-deep-analysis/tasks]"
description: "tasks document for 033-ux-deep-analysis."
trigger_phrases:
  - "tasks"
  - "deep"
  - "analysis"
  - "033"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks - UX Deep Analysis

## P0 Tasks (Must Complete)
- [x] P0-1: Fix MCP tool naming in save.md, search.md, load.md, checkpoint.md (30+ instances fixed in 4 files)
- [x] P0-2: Create root README.md with intro and getting started (already comprehensive - verified)
- [x] P0-3: Document Windows ${HOME} workaround in opencode.json
- [x] P0-4: Document Git Bash/WSL requirement for Windows
- [x] P0-5: Fix retry-manager.js to use initializeDb() instead of getDb() (NO FIX NEEDED - getDb() is exported)
- [x] P0-6: Add spec folder existence check in generate-context.js
- [x] P0-7: Update template count from 12 to 14 in SKILL.md
- [x] P0-8: Standardize placeholder format in debug-delegation.md (37 instances fixed)
- [x] P0-9: Add "What is a spec folder?" definition to SpecKit SKILL.md
- [x] P0-10: Fix script example in SpecKit SKILL.md
- [x] P0-11: Document OpenCode CLI installation (already documented in README - verified)
- [x] P0-12: Add .gitattributes for line endings

## P1 Tasks (High Priority)
- [x] P1-1: Fix decay formula to ~62-day half-life everywhere (12+ instances fixed)
- [x] P1-2: Standardize command notation to colon format (already standardized - verified)
- [x] P1-3: Create command index README (created .opencode/command/README.md)
- [x] P1-4: Create QUICKSTART.md
- [ ] P1-5: Add /memory:help, /search:help commands
- [x] P1-6: Document missing templates (4 templates added to template_guide.md)
- [ ] P1-7: Fix anchor format inconsistency
- [x] P1-8: Add Gate 4 to resume.md
- [x] P1-9: Fix leann_ask → leann_leann_ask in AGENTS.md
- [ ] P1-10: Add mcp-narsil to system prompt available_skills

## P2 Tasks (Medium Priority)
- [ ] P2-1: Add error codes to MCP tool errors
- [ ] P2-2: Add memory_cleanup MCP tool
- [ ] P2-3: Expand worked_examples.md
- [ ] P2-4: Add filled template examples
- [ ] P2-5: Create command cheatsheet
- [ ] P2-6: Add database maintenance documentation
- [ ] P2-7: Improve JSON parse error messages
- [ ] P2-8: Add /spec_kit:validate command
