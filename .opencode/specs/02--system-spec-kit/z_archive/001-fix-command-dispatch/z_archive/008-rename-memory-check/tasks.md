---
title: "Tasks: Rename Memory Command (Two-Phase Rename) [008-rename-memory-check/tasks]"
description: "tasks document for 008-rename-memory-check."
trigger_phrases:
  - "tasks"
  - "rename"
  - "memory"
  - "command"
  - "two"
  - "008"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Rename Memory Command (Two-Phase Rename)

## Phase 1: `/memory` → `/memory:check` (COMPLETED)

### Task Breakdown

#### Agent 1: Command Files
- [x] 1.1 Rename `memory.md` to `check.md`
- [x] 1.2 Update all internal `/memory` refs in `check.md` (17 occurrences)
- [x] 1.3 Update `save.md` line 321 (Related Commands)
- [x] 1.4 Update `checkpoint.md` line 466 (Related Commands)

#### Agent 2: Skills
- [x] 2.1 Update `SKILL.md` lines 65, 86-106 (routing diagram)
- [x] 2.2 Update `SKILL.md` lines 229-230 (quick overview table)
- [x] 2.3 Update `SKILL.md` line 387 (context recovery)
- [x] 2.4 Update `SKILL.md` lines 490-493 (quick reference)
- [x] 2.5 Check `references/*.md` for dashboard refs - updated execution_methods.md

#### Agent 3: MCP Server Docs
- [x] 3.1 README.md - No changes needed (only documents sub-commands)
- [x] 3.2 INSTALL_GUIDE.md - No changes needed (only documents sub-commands)

#### Verification
- [x] 4.1 Grep full `.opencode/` for remaining `/memory` dashboard refs
- [x] 4.2 Confirm `/memory:save` and `/memory:checkpoint` unchanged
- [x] 4.3 Confirm MCP tool names unchanged

#### Additional Fixes Found
- [x] 5.1 Update `AGENTS.md` line 184 (`/memory:search` → `/memory:check`)
- [x] 5.2 Update `AGENTS (Universal).md` line 176 (`/memory:search` → `/memory:check`)
- [x] 5.3 Update `.opencode/command/cli/codex.md` line 357
- [x] 5.4 Update `.opencode/command/cli/gemini.md` line 361

---

## Phase 2: `/memory:check` → `/memory:search` (COMPLETED)

### Task Breakdown

#### Agent 1: search.md (renamed from check.md)
- [x] 1.1 Rename `check.md` to `search.md`
- [x] 1.2 Update all internal `/memory:check` refs (16 occurrences)

#### Agent 2: Command Files
- [x] 2.1 Update `save.md` Related Commands section
- [x] 2.2 Update `checkpoint.md` Related Commands section

#### Agent 3: workflows-memory SKILL.md
- [x] 3.1 Update routing diagram
- [x] 3.2 Update quick overview table
- [x] 3.3 Update context recovery instruction
- [x] 3.4 Update quick reference table
- [x] Total: 11 references updated

#### Agent 4: execution_methods.md
- [x] 4.1 Update line 120 (1 reference)

#### Agent 5: AGENTS.md files
- [x] 5.1 Update `AGENTS.md` line 184
- [x] 5.2 Update `AGENTS (Universal).md` line 176

#### Agent 6: CLI command files
- [x] 6.1 Update `codex.md` line 357
- [x] 6.2 Update `gemini.md` line 361

### Verification
- [x] Final grep sweep - zero stale `/memory:check` refs in active files
- [x] Historical spec files preserved (intentional)

---

## Summary

| Phase | From | To | Files Modified | Refs Updated |
|-------|------|-----|----------------|--------------|
| 1 | `/memory` | `/memory:check` | 9 | 34 |
| 2 | `/memory:check` | `/memory:search` | 8 | 32 |
| **Total** | `/memory` | `/memory:search` | 9 | 66 |

## Files Modified (Final State)

| File | Status |
|------|--------|
| `.opencode/command/memory/search.md` | Renamed from memory.md → check.md → search.md |
| `.opencode/command/memory/save.md` | Updated Related Commands |
| `.opencode/command/memory/checkpoint.md` | Updated Related Commands |
| `.opencode/skills/workflows-memory/SKILL.md` | Updated all dashboard refs |
| `.opencode/skills/workflows-memory/references/execution_methods.md` | Updated command reference |
| `.opencode/command/cli/codex.md` | Updated Related Commands |
| `.opencode/command/cli/gemini.md` | Updated Related Commands |
| `AGENTS.md` | Updated memory command ref |
| `AGENTS (Universal).md` | Updated memory command ref |
