---
title: "Memory System Integration into Spec-Kit [035-memory-speckit-merger/spec]"
description: "The current architecture has two overlapping skill folders for documentation and context management"
trigger_phrases:
  - "memory"
  - "system"
  - "integration"
  - "into"
  - "spec"
  - "035"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Memory System Integration into Spec-Kit

<!-- ANCHOR:metadata -->
## Overview

| Field | Value |
|-------|-------|
| **Spec ID** | 035-memory-speckit-merger |
| **Status** | Complete |
| **Completed** | 2025-12-25 |
| **Doc Level** | Level 3 (≥500 LOC affected) |
| **Created** | 2025-12-25 |
| **Parent** | 003-memory-and-spec-kit |

---

<!-- /ANCHOR:metadata -->
## Problem Statement

The current architecture has **two overlapping skill folders** for documentation and context management:

1. **system-spec-kit** (`/.opencode/skill/system-spec-kit/`) - Documentation templates, spec folder structure, validation
2. **system-memory** (`/.opencode/skill/system-memory/`) - MCP server, database, context preservation, constitutional memories

This separation creates:
- **Cognitive overhead**: Developers must remember which system handles what
- **Path confusion**: References scattered across 50+ files pointing to different locations
- **Maintenance burden**: Two SKILL.md files, two sets of scripts, duplicate patterns
- **Unclear ownership**: Memory is documentation context; should live with documentation tools

---

## User Stories

### As a developer using OpenCode...
1. I want a **single skill folder** for all documentation and context management so I don't have to remember two different paths
2. I want **consistent path references** in AGENTS.md, commands, and skills so I don't encounter broken references
3. I want **constitutional memories to surface reliably** during all conversations so critical project rules are enforced

### As an AI agent...
1. I need **clear skill routing** so Gate 2 (skill_advisor.py) returns unambiguous recommendations
2. I need **memory tools accessible** via the same MCP server that handles spec-kit operations
3. I need **constitutional memories** to remain project-global (not tied to individual spec folders)

---

## Scope

### In Scope (This Merger)
- [x] Move MCP server from `system-memory` to `system-spec-kit`
- [x] Move SQLite database to `system-spec-kit/database/`
- [x] Move scripts (`generate-context.js`, etc.) to `system-spec-kit/scripts/`
- [x] Move references to `system-spec-kit/references/`
- [x] Merge constitutional file handling (keep in skill folder)
- [x] Update all path references in:
  - AGENTS.md (6+ references)
  - Memory commands (4 files, 8+ references)
  - skill_advisor.py mapping
  - opencode.json MCP configuration
  - system-memory SKILL.md → merge into system-spec-kit SKILL.md
- [x] Archive old `system-memory` skill folder

### Out of Scope (NOT part of this work)
- [ ] Functional changes to MCP tools (memory_search stays memory_search)
- [ ] Database schema changes
- [ ] New features or capabilities
- [ ] Changes to Gate enforcement logic
- [ ] Renaming MCP tool functions
- [ ] Renaming /memory:* commands

---

## Success Criteria

### P0 - Hard Blockers (Must Pass)
| ID | Criterion | Validation Method |
|----|-----------|-------------------|
| S1 | MCP server starts without errors from new location | `npm start` in new path |
| S2 | `memory_search()` returns results | Test query against indexed memories |
| S3 | Constitutional memories surface at top of search | Query with `includeConstitutional: true` |
| S4 | `generate-context.js` creates valid memory files | Execute with test spec folder |
| S5 | Gates 3, 4, 5, 6 still enforce correctly | Manual gate trigger tests |

### P1 - Must Complete
| ID | Criterion | Validation Method |
|----|-----------|-------------------|
| S6 | All 23 MCP lib modules copied and functional | File count + require test |
| S7 | Database migrated with data intact | Row count comparison |
| S8 | All path references updated (50+ files) | Grep for old paths returns empty |
| S9 | `/memory:save`, `/memory:search`, `/memory:load`, `/memory:checkpoint` work | Command execution tests |

### P2 - Nice to Have
| ID | Criterion | Validation Method |
|----|-----------|-------------------|
| S10 | Old skill archived to `z_archive/` | Directory exists with contents |
| S11 | Documentation updated (this spec, SKILL.md) | Human review |

---

## Constraints

### Architectural Constraints
1. **Constitutional files MUST stay in skill folder** - They are PROJECT-GLOBAL, not tied to individual specs
2. **MCP tool names MUST NOT change** - `memory_search`, `memory_save`, etc. are referenced in AGENTS.md and commands
3. **Command names MUST NOT change** - `/memory:save`, `/memory:search`, etc. are user-facing
4. **Database location must be within skill folder** - For portability and clear ownership

### Technical Constraints
1. Node.js 18+ required for MCP server
2. SQLite database must remain single-file for simplicity
3. opencode.json must be updated atomically (server restart required)

### Process Constraints
1. Rollback checkpoint before each phase
2. Validate after each phase before proceeding
3. No functional changes during migration

---

## Architecture

### Current State
```
.opencode/skill/
├── system-spec-kit/           # Documentation templates
│   ├── SKILL.md
│   ├── templates/
│   ├── scripts/
│   │   └── skill_advisor.py
│   └── references/
│
└── system-memory/             # Memory system (SEPARATE)
    ├── SKILL.md
    ├── lib/                   # MCP server (23 modules)
    ├── database/              # SQLite + embeddings
    ├── scripts/               # generate-context.js
    ├── references/
    └── constitutional/        # Project-global rules
```

### Target State
```
.opencode/skill/
├── system-spec-kit/           # UNIFIED: Documentation + Memory
│   ├── SKILL.md               # Merged documentation
│   ├── templates/             # Unchanged
│   ├── lib/                   # MCP server (moved from system-memory)
│   │   ├── index.js
│   │   ├── server.js
│   │   ├── tools/
│   │   ├── services/
│   │   └── ... (23 modules)
│   ├── database/              # SQLite + embeddings (moved)
│   │   └── memory-index.sqlite
│   ├── scripts/               # Merged scripts
│   │   ├── skill_advisor.py   # Existing
│   │   └── generate-context.js # Moved from system-memory
│   ├── references/            # Merged references
│   │   ├── spec-folder-guide.md
│   │   └── memory-system-guide.md
│   └── constitutional/        # Project-global rules (moved)
│       └── *.md
│
└── z_archive/
    └── system-memory/         # Archived original (reference only)
```

---

## Dependencies

### Runtime Dependencies
- Node.js 18+
- npm (for MCP server dependencies)
- SQLite (bundled with better-sqlite3)

### File Dependencies
- `opencode.json` - MCP server configuration
- `AGENTS.md` - Gate enforcement references
- `.opencode/command/memory/*.md` - 4 command files
- `.opencode/skill/system-spec-kit/scripts/skill_advisor.py` - Skill routing

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| MCP server fails to start | Low | High | Test in isolation before integration |
| Database corruption during move | Very Low | High | Copy (don't move), verify row counts |
| Missed path reference | Medium | Medium | Grep validation, phased approach |
| Gate enforcement breaks | Low | High | Test each gate explicitly |
| Constitutional not surfacing | Low | Critical | Verify with memory_search query |

### Rollback Strategy
Each phase has a checkpoint. If any phase fails:
1. Restore from checkpoint
2. Document failure reason
3. Fix before retrying

---

## References

- Prior research: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/033-ux-deep-analysis`
- system-memory SKILL.md: `.opencode/skill/system-memory/SKILL.md`
- system-spec-kit SKILL.md: `.opencode/skill/system-spec-kit/SKILL.md`
- Memory commands: `.opencode/command/memory/*.md`
