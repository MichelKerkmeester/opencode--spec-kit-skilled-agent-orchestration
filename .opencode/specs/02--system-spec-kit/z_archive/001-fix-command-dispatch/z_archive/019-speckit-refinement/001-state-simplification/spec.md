---
title: "State Simplification: Integrate State into Memory Files [001-state-simplification/spec]"
description: "Current implementation has 3 context mechanisms"
trigger_phrases:
  - "state"
  - "simplification"
  - "integrate"
  - "into"
  - "spec"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# State Simplification: Integrate State into Memory Files
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

## 1. Overview

| Field | Value |
|-------|-------|
| **Feature** | Simplify state tracking by embedding in memory files |
| **Type** | Refactoring / Simplification |
| **Priority** | High |
| **Status** | Planning |

## 2. Problem Statement

Current implementation has 3 context mechanisms:
1. quick-continue.md - Minimal handoff (~14 lines)
2. STATE.md - Project state (~50 lines)
3. memory/*.md - Full session context (~200-500 lines)

This is potentially redundant. STATE.md and memory files both capture state information.

## 3. Solution

Remove STATE.md as separate file. Instead, embed a "Project State Snapshot" section at the TOP of each memory file.

### Before
- 3 files: quick-continue.md + STATE.md + memory/*.md
- generate-context.js writes to STATE.md separately
- Resume checks STATE.md as priority 2

### After
- 2 files: quick-continue.md + memory/*.md (with embedded state)
- generate-context.js embeds state in memory file
- Resume extracts state from latest memory file

## 4. Memory File Structure (New)

```markdown
---
title: Session Context
specFolder: xxx-feature-name
timestamp: YYYY-MM-DD HH:MM
triggerPhrases:
  - phrase1
  - phrase2
importanceTier: normal
---

## Project State Snapshot

| Field | Value |
|-------|-------|
| **Phase** | [Planning/Implementation/Testing/Complete] |
| **Active File** | path/to/current/file.ext |
| **Last Action** | What was just completed |
| **Next Action** | What should happen next |

### File Progress
- [x] file1.ext - Done
- [ ] file2.ext - In progress
- [ ] file3.ext - Pending

### Blockers
- None / List any blockers

---

## Session Context

[... rest of memory file content ...]
```

## 5. Scope

### In Scope
- Modify generate-context.js to embed state in memory files
- Update resume priority chain
- Update AGENTS.md Gate 0.5
- Update SKILL.md documentation
- Remove/archive state.md template

### Out of Scope
- Changes to quick-continue.md
- Changes to /handover command
- Changes to Gate 0 or Gate 7
