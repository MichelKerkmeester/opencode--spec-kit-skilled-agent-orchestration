---
title: "Implementation Plan [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger/plan]"
description: "This merger is a pure file migration with path updates. No functional changes."
trigger_phrases:
  - "implementation"
  - "plan"
  - "memory"
  - "system"
  - "integration"
  - "035"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Memory System Integration

<!-- ANCHOR:summary -->
## Technical Approach

This merger is a **pure file migration** with path updates. No functional changes.

### Strategy
1. **Copy-first, verify-second** - Never delete until new location is verified
2. **Phased migration** - Each component moved and tested independently
3. **Checkpoint per phase** - Rollback points before each major change
4. **Grep validation** - Verify no stale references remain

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:architecture -->
## Architecture: Final Directory Structure

```
.opencode/skill/system-spec-kit/
├── SKILL.md                          # Merged: spec-kit + memory docs
├── package.json                      # MCP server dependencies
├── package-lock.json
│
├── lib/                              # MCP server (from system-memory)
│   ├── index.js                      # Entry point
│   ├── server.js                     # MCP server implementation
│   ├── config.js                     # Configuration
│   ├── tools/                        # MCP tool implementations
│   │   ├── memory-search.js
│   │   ├── memory-save.js
│   │   ├── memory-list.js
│   │   ├── memory-delete.js
│   │   ├── memory-update.js
│   │   ├── memory-validate.js
│   │   ├── memory-match-triggers.js
│   │   ├── memory-stats.js
│   │   ├── checkpoint-create.js
│   │   ├── checkpoint-restore.js
│   │   ├── checkpoint-list.js
│   │   └── checkpoint-delete.js
│   ├── services/                     # Shared services
│   │   ├── database.js
│   │   ├── embeddings.js
│   │   ├── file-scanner.js
│   │   └── markdown-parser.js
│   └── utils/                        # Utilities
│       ├── paths.js
│       ├── logger.js
│       └── validators.js
│
├── database/                         # SQLite storage (from system-memory)
│   └── memory-index.sqlite
│
├── scripts/                          # Merged scripts
│   ├── skill_advisor.py              # Existing (update mapping)
│   ├── generate-context.js           # From system-memory
│   └── validate-spec.js              # Existing
│
├── templates/                        # Existing (unchanged)
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   ├── checklist.md
│   └── decision-record.md
│
├── references/                       # Merged references
│   ├── spec-folder-guide.md          # Existing
│   ├── memory-system-guide.md        # From system-memory
│   └── gate-enforcement.md           # Existing
│
└── constitutional/                   # Project-global rules (from system-memory)
    └── *.md                          # Constitutional memory files
```

<!-- /ANCHOR:architecture -->
---

## Migration Phases

### Phase 1: Create Directory Structure
**Effort:** 5 min | **Risk:** None | **Rollback:** Delete directories

Create target directories in system-spec-kit:
```bash
mkdir -p .opencode/skill/system-spec-kit/lib/tools
mkdir -p .opencode/skill/system-spec-kit/lib/services
mkdir -p .opencode/skill/system-spec-kit/lib/utils
mkdir -p .opencode/skill/system-spec-kit/database
mkdir -p .opencode/skill/system-spec-kit/constitutional
```

**Validation:** Directories exist

---

### Phase 2: Copy MCP Server
**Effort:** 10 min | **Risk:** Low | **Rollback:** Delete copied files

Copy all lib modules:
```bash
cp -r .opencode/skill/system-memory/lib/* .opencode/skill/system-spec-kit/lib/
cp .opencode/skill/system-memory/package.json .opencode/skill/system-spec-kit/
cp .opencode/skill/system-memory/package-lock.json .opencode/skill/system-spec-kit/
```

**Validation:** 
- File count matches source
- `npm install` succeeds in new location
- Server starts without errors (standalone test)

---

### Phase 3: Copy Database and Constitutional
**Effort:** 5 min | **Risk:** Low | **Rollback:** Delete copied files

Copy database:
```bash
cp .opencode/skill/system-memory/database/memory-index.sqlite \
   .opencode/skill/system-spec-kit/database/
```

Copy constitutional files:
```bash
cp -r .opencode/skill/system-memory/constitutional/* \
   .opencode/skill/system-spec-kit/constitutional/
```

**Validation:**
- Database file size matches
- Row count matches (sqlite3 query)
- Constitutional file count matches

---

### Phase 4: Copy Scripts
**Effort:** 5 min | **Risk:** Low | **Rollback:** Delete copied files

Copy generate-context.js:
```bash
cp .opencode/skill/system-memory/scripts/generate-context.js \
   .opencode/skill/system-spec-kit/scripts/
```

**Validation:** Script exists and is executable

---

### Phase 5: Copy References and Config
**Effort:** 5 min | **Risk:** Low | **Rollback:** Delete copied files

Copy reference files:
```bash
cp .opencode/skill/system-memory/references/*.md \
   .opencode/skill/system-spec-kit/references/
```

**Validation:** Files exist

---

### Phase 6: Update Internal Paths
**Effort:** 30 min | **Risk:** Medium | **Rollback:** Git restore

Update paths within copied files:
1. `lib/config.js` - Update database path
2. `lib/services/database.js` - Update database path
3. `lib/services/file-scanner.js` - Update constitutional path
4. `scripts/generate-context.js` - Update output paths

**Files to Update:**
| File | Change |
|------|--------|
| `lib/config.js` | `system-memory` → `system-spec-kit` |
| `lib/services/database.js` | Database path reference |
| `lib/services/file-scanner.js` | Constitutional directory path |
| `scripts/generate-context.js` | Script path self-reference |

**Validation:**
- Grep for `system-memory` in new lib/ returns empty
- Server starts and queries work

---

### Phase 7: Update opencode.json
**Effort:** 10 min | **Risk:** Medium | **Rollback:** Git restore

Update MCP server path in `opencode.json`:
```json
{
  "mcpServers": {
    "semantic_memory": {
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/lib/index.js"]
    }
  }
}
```

**Validation:**
- Restart OpenCode
- `memory_search()` works
- `memory_stats()` returns data

---

### Phase 8: Update AGENTS.md
**Effort:** 15 min | **Risk:** Medium | **Rollback:** Git restore

Update all references to `system-memory`:
1. Section 2 (Gates) - generate-context.js path
2. Section 6 (Tools) - Database location table
3. Section 6 (Tools) - SKILL.md reference
4. Any other scattered references

**Target Locations (from research):**
- Line ~155: generate-context.js path in Gate 5
- Line ~380: Database location in "Two Semantic Systems" table
- Line ~xxx: SKILL.md path references

**Validation:**
- Grep for `system-memory` in AGENTS.md returns empty (except z_archive references)
- Gates still trigger correctly

---

### Phase 9: Update Memory Commands
**Effort:** 20 min | **Risk:** Medium | **Rollback:** Git restore

Update 4 command files in `.opencode/command/memory/`:

| File | References to Update |
|------|---------------------|
| `save.md` | `system-memory/scripts/generate-context.js` (3x) |
| `save.md` | `system-memory/SKILL.md` (1x) |
| `search.md` | `system-memory/SKILL.md` (1x) |
| `load.md` | `system-memory/SKILL.md` (1x) |
| `checkpoint.md` | `system-memory/SKILL.md` (1x) |

**Validation:**
- Grep for `system-memory` in command files returns empty
- Commands execute without errors

---

### Phase 10: Update skill_advisor.py
**Effort:** 10 min | **Risk:** Low | **Rollback:** Git restore

Update skill mapping to remove `system-memory` as separate entry.

**Changes:**
- Remove `system-memory` skill entry
- Update `system-spec-kit` keywords to include memory-related terms
- Ensure routing points to unified skill

**Validation:**
- `python3 skill_advisor.py "save memory"` returns `system-spec-kit`
- `python3 skill_advisor.py "search memories"` returns `system-spec-kit`

---

### Phase 11: Validate All Gates
**Effort:** 20 min | **Risk:** N/A | **Rollback:** N/A

Test each gate:

| Gate | Test Method | Expected |
|------|-------------|----------|
| Gate 1 | Send new message | memory_match_triggers() called |
| Gate 3 | Request file change | Spec folder question asked |
| Gate 4 | Select existing spec | memory_search() loads context |
| Gate 5 | Run /memory:save | generate-context.js executes from new path |
| Gate 6 | Claim "done" | checklist.md verified |

**Validation:** All gates pass

---

### Phase 12: Archive Old Skill
**Effort:** 5 min | **Risk:** None | **Rollback:** Move back

Move old skill to archive:
```bash
mkdir -p .opencode/skill/z_archive
mv .opencode/skill/system-memory .opencode/skill/z_archive/
```

**Validation:**
- Old location does not exist
- Archive contains all files
- System still works (final smoke test)

---

## Risk Assessment

| Phase | Risk Level | Mitigation |
|-------|------------|------------|
| 1-5 | Low | Copy-only, no functional impact |
| 6 | Medium | Internal path updates - test server start |
| 7 | Medium | MCP config change - test immediately after |
| 8-9 | Medium | Reference updates - grep validation |
| 10 | Low | Skill routing update - test advisor |
| 11 | None | Validation only |
| 12 | Low | Archive only after all tests pass |

---

<!-- ANCHOR:dependencies -->
## Dependencies Between Phases

```
Phase 1 (dirs) ─┬─> Phase 2 (MCP server)
                │
                ├─> Phase 3 (database)
                │
                ├─> Phase 4 (scripts)
                │
                └─> Phase 5 (references)
                         │
                         v
               Phase 6 (internal paths)
                         │
                         v
               Phase 7 (opencode.json)
                         │
                         v
               Phase 8 (AGENTS.md)
                         │
                         v
               Phase 9 (commands)
                         │
                         v
               Phase 10 (skill_advisor)
                         │
                         v
               Phase 11 (validation)
                         │
                         v
               Phase 12 (archive)
```

<!-- /ANCHOR:dependencies -->
---

## Estimated Total Effort

| Category | Time |
|----------|------|
| File operations (Phases 1-5) | 30 min |
| Path updates (Phases 6-10) | 85 min |
| Validation (Phase 11) | 20 min |
| Archive (Phase 12) | 5 min |
| **Total** | **~2.5 hours** |

---

## Post-Migration Verification

After Phase 12, run these final checks:

1. **MCP Server Health**
   ```bash
   # Start server manually
   node .opencode/skill/system-spec-kit/lib/index.js
   # Should output: "MCP server started"
   ```

2. **Memory Search**
   ```javascript
   memory_search({ query: "test", limit: 5 })
   // Should return results
   ```

3. **Constitutional Surfacing**
   ```javascript
   memory_search({ query: "anything", includeConstitutional: true })
   // Constitutional memories at top
   ```

4. **Generate Context**
   ```bash
   node .opencode/skill/system-spec-kit/scripts/generate-context.js .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger
   # Should create memory file
   ```

5. **No Stale References**
   ```bash
   grep -r "system-memory" .opencode/ --include="*.md" --include="*.js" --include="*.json" --include="*.py" | grep -v z_archive
   # Should return empty
   ```
