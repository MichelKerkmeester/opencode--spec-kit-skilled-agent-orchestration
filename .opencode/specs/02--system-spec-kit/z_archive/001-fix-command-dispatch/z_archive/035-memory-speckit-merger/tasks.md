---
title: "Tasks: Memory System Integration [035-memory-speckit-merger/tasks]"
description: "STATUS: COMPLETE - Implementation used different approach than originally planned."
trigger_phrases:
  - "tasks"
  - "memory"
  - "system"
  - "integration"
  - "035"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Memory System Integration

<!-- ANCHOR:notation -->
## Task Overview

**STATUS: COMPLETE** - Implementation used different approach than originally planned.

| Phase | Task Count | Effort | Status |
|-------|------------|--------|--------|
| Phase 1: Create directories | 1 | 5 min | [x] Complete |
| Phase 2: Copy MCP server | 3 | 10 min | [x] Complete (fresh server) |
| Phase 3: Copy database + constitutional | 2 | 5 min | [x] Complete |
| Phase 4: Copy scripts | 1 | 5 min | [x] Complete |
| Phase 5: Copy references | 1 | 5 min | [x] Complete |
| Phase 6: Update internal paths | 4 | 30 min | [x] Complete |
| Phase 7: Update opencode.json | 1 | 10 min | [x] Complete |
| Phase 8: Update AGENTS.md | 1 | 15 min | [x] Complete |
| Phase 9: Update memory commands | 4 | 20 min | [x] Complete |
| Phase 10: Update skill_advisor.py | 1 | 10 min | [x] Complete |
| Phase 11: Validate | 6 | 20 min | [x] Complete |
| Phase 12: Archive old skill | 1 | 5 min | [x] Skipped (replaced) |

**Total: 26 tasks | ~2.5 hours**

### Implementation Notes

The actual implementation differed from this plan:
- Used fresh MCP server (`mcp_server/context-server.js`) instead of copying from system-memory
- Database named `context-index.sqlite` instead of `memory-index.sqlite`
- Old system-memory skill was replaced, not archived
- Cleanup performed: 215 orphaned entries removed from database (2025-12-25)

---

<!-- /ANCHOR:notation -->
## Phase 1: Create Directory Structure

### T1.1: Create target directories
**Effort:** 5 min | **Dependencies:** None

```bash
mkdir -p .opencode/skill/system-spec-kit/lib/tools
mkdir -p .opencode/skill/system-spec-kit/lib/services
mkdir -p .opencode/skill/system-spec-kit/lib/utils
mkdir -p .opencode/skill/system-spec-kit/database
mkdir -p .opencode/skill/system-spec-kit/constitutional
```

**Acceptance:**
- [ ] `lib/tools/` exists
- [ ] `lib/services/` exists
- [ ] `lib/utils/` exists
- [ ] `database/` exists
- [ ] `constitutional/` exists

---

## Phase 2: Copy MCP Server

### T2.1: Copy lib directory contents
**Effort:** 5 min | **Dependencies:** T1.1

```bash
cp -r .opencode/skill/system-memory/lib/* .opencode/skill/system-spec-kit/lib/
```

**Acceptance:**
- [ ] All 23+ modules copied
- [ ] Directory structure preserved

### T2.2: Copy package files
**Effort:** 2 min | **Dependencies:** T1.1

```bash
cp .opencode/skill/system-memory/package.json .opencode/skill/system-spec-kit/
cp .opencode/skill/system-memory/package-lock.json .opencode/skill/system-spec-kit/
```

**Acceptance:**
- [ ] package.json exists in target
- [ ] package-lock.json exists in target

### T2.3: Install dependencies and test
**Effort:** 3 min | **Dependencies:** T2.1, T2.2

```bash
cd .opencode/skill/system-spec-kit && npm install
```

**Acceptance:**
- [ ] npm install succeeds
- [ ] node_modules created

---

## Phase 3: Copy Database and Constitutional

### T3.1: Copy SQLite database
**Effort:** 2 min | **Dependencies:** T1.1

```bash
cp .opencode/skill/system-memory/database/memory-index.sqlite \
   .opencode/skill/system-spec-kit/database/
```

**Acceptance:**
- [ ] Database file copied
- [ ] File size matches source
- [ ] Row count matches (verify with sqlite3)

### T3.2: Copy constitutional files
**Effort:** 3 min | **Dependencies:** T1.1

```bash
cp -r .opencode/skill/system-memory/constitutional/* \
   .opencode/skill/system-spec-kit/constitutional/
```

**Acceptance:**
- [ ] All constitutional markdown files copied
- [ ] File count matches source

---

## Phase 4: Copy Scripts

### T4.1: Copy generate-context.js
**Effort:** 5 min | **Dependencies:** T1.1

```bash
cp .opencode/skill/system-memory/scripts/generate-context.js \
   .opencode/skill/system-spec-kit/scripts/
```

**Acceptance:**
- [ ] generate-context.js exists in target scripts/
- [ ] File is executable

---

## Phase 5: Copy References

### T5.1: Copy reference documentation
**Effort:** 5 min | **Dependencies:** T1.1

```bash
# Copy any memory-related references that don't duplicate existing
cp .opencode/skill/system-memory/references/*.md \
   .opencode/skill/system-spec-kit/references/ 2>/dev/null || true
```

**Acceptance:**
- [ ] Memory system documentation copied (if exists)
- [ ] No overwrites of existing spec-kit references

---

## Phase 6: Update Internal Paths

### T6.1: Update lib/config.js
**Effort:** 10 min | **Dependencies:** T2.1

**Changes:**
- Replace `system-memory` with `system-spec-kit` in all path references
- Update database path constant
- Update constitutional directory path

**Acceptance:**
- [ ] No `system-memory` references remain
- [ ] Paths resolve correctly

### T6.2: Update lib/services/database.js
**Effort:** 5 min | **Dependencies:** T2.1

**Changes:**
- Update database file path reference

**Acceptance:**
- [ ] Database path points to `system-spec-kit/database/`

### T6.3: Update lib/services/file-scanner.js
**Effort:** 5 min | **Dependencies:** T2.1

**Changes:**
- Update constitutional directory scan path

**Acceptance:**
- [ ] Constitutional path points to `system-spec-kit/constitutional/`

### T6.4: Update scripts/generate-context.js
**Effort:** 10 min | **Dependencies:** T4.1

**Changes:**
- Update any self-referencing paths
- Update MCP server import paths (if any)

**Acceptance:**
- [ ] Script runs without path errors

---

## Phase 7: Update opencode.json

### T7.1: Update MCP server configuration
**Effort:** 10 min | **Dependencies:** T6.1-T6.4

**File:** `opencode.json` (project root)

**Changes:**
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

**Acceptance:**
- [ ] MCP server path updated
- [ ] Restart OpenCode
- [ ] `memory_search()` returns results
- [ ] `memory_stats()` returns data

---

## Phase 8: Update AGENTS.md

### T8.1: Update all system-memory references
**Effort:** 15 min | **Dependencies:** T7.1

**File:** `AGENTS.md` (project root)

**References to update:**
| Line Area | Current | Target |
|-----------|---------|--------|
| Gate 5 | `.opencode/skill/system-memory/scripts/generate-context.js` | `.opencode/skill/system-spec-kit/scripts/generate-context.js` |
| Section 6 table | `system-memory` database location | `system-spec-kit` |
| SKILL.md refs | `.opencode/skill/system-memory/SKILL.md` | `.opencode/skill/system-spec-kit/SKILL.md` |

**Acceptance:**
- [ ] Grep for `system-memory` returns only z_archive refs
- [ ] Gate enforcement still works

---

## Phase 9: Update Memory Commands

### T9.1: Update save.md
**Effort:** 5 min | **Dependencies:** T8.1

**File:** `.opencode/command/memory/save.md`

**Changes:**
- Line 167: `system-memory/scripts/generate-context.js` → `system-spec-kit/scripts/generate-context.js`
- Line 357: Same change
- Line 379: Same change
- Line 537: `system-memory/SKILL.md` → `system-spec-kit/SKILL.md`

**Acceptance:**
- [ ] No `system-memory` references remain

### T9.2: Update search.md
**Effort:** 5 min | **Dependencies:** T8.1

**File:** `.opencode/command/memory/search.md`

**Changes:**
- Line 594: `system-memory/SKILL.md` → `system-spec-kit/SKILL.md`

**Acceptance:**
- [ ] No `system-memory` references remain

### T9.3: Update load.md
**Effort:** 5 min | **Dependencies:** T8.1

**File:** `.opencode/command/memory/load.md`

**Changes:**
- Line 293: `system-memory/SKILL.md` → `system-spec-kit/SKILL.md`

**Acceptance:**
- [ ] No `system-memory` references remain

### T9.4: Update checkpoint.md
**Effort:** 5 min | **Dependencies:** T8.1

**File:** `.opencode/command/memory/checkpoint.md`

**Changes:**
- Line 471: `system-memory/SKILL.md` → `system-spec-kit/SKILL.md`

**Acceptance:**
- [ ] No `system-memory` references remain

---

## Phase 10: Update Skill Advisor

### T10.1: Update skill_advisor.py mapping
**Effort:** 10 min | **Dependencies:** T9.1-T9.4

**File:** `.opencode/skill/system-spec-kit/scripts/skill_advisor.py`

**Changes:**
- Remove separate `system-memory` skill entry
- Add memory-related keywords to `system-spec-kit` entry:
  - "memory", "save context", "search memory", "checkpoint"
  - "constitutional", "memory_search", "memory_save"

**Acceptance:**
- [ ] `python3 skill_advisor.py "save memory"` → `system-spec-kit`
- [ ] `python3 skill_advisor.py "create spec folder"` → `system-spec-kit`
- [ ] No `system-memory` skill in output

---

## Phase 11: Validation

### T11.1: Validate MCP server starts
**Effort:** 3 min | **Dependencies:** T7.1

```bash
node .opencode/skill/system-spec-kit/lib/index.js
```

**Acceptance:**
- [ ] Server starts without errors
- [ ] Logs "MCP server started" or equivalent

### T11.2: Validate memory_search works
**Effort:** 3 min | **Dependencies:** T11.1

```javascript
memory_search({ query: "test", limit: 5 })
```

**Acceptance:**
- [ ] Returns array of results
- [ ] No errors in response

### T11.3: Validate constitutional surfacing
**Effort:** 3 min | **Dependencies:** T11.1

```javascript
memory_search({ query: "anything", includeConstitutional: true })
```

**Acceptance:**
- [ ] Constitutional memories appear at top
- [ ] `isConstitutional: true` flag present

### T11.4: Validate generate-context.js
**Effort:** 5 min | **Dependencies:** T6.4

```bash
node .opencode/skill/system-spec-kit/scripts/generate-context.js \
  .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger
```

**Acceptance:**
- [ ] Memory file created in `memory/` directory
- [ ] File contains valid ANCHOR tags
- [ ] No path errors

### T11.5: Validate gates work
**Effort:** 5 min | **Dependencies:** T8.1

Manual tests:
1. Gate 3: Request file change → Spec folder question appears
2. Gate 5: Run `/memory:save` → Script executes from new path

**Acceptance:**
- [ ] Gate 3 triggers correctly
- [ ] Gate 5 uses new script path

### T11.6: Validate no stale references
**Effort:** 2 min | **Dependencies:** T9.1-T10.1

```bash
grep -r "system-memory" .opencode/ --include="*.md" --include="*.js" --include="*.json" --include="*.py" | grep -v z_archive
```

**Acceptance:**
- [ ] Returns empty (no matches outside archive)

---

## Phase 12: Archive Old Skill

### T12.1: Move system-memory to archive
**Effort:** 5 min | **Dependencies:** T11.1-T11.6 (all validation passed)

```bash
mkdir -p .opencode/skill/z_archive
mv .opencode/skill/system-memory .opencode/skill/z_archive/
```

**Acceptance:**
- [ ] `.opencode/skill/system-memory/` no longer exists
- [ ] `.opencode/skill/z_archive/system-memory/` contains all original files
- [ ] Final smoke test: memory commands still work

---

## Rollback Procedures

### If Phase 2-5 fails (copy operations):
```bash
rm -rf .opencode/skill/system-spec-kit/lib
rm -rf .opencode/skill/system-spec-kit/database
rm -rf .opencode/skill/system-spec-kit/constitutional
rm .opencode/skill/system-spec-kit/package*.json
```

### If Phase 6-10 fails (path updates):
```bash
git checkout -- .opencode/skill/system-spec-kit/
git checkout -- opencode.json
git checkout -- AGENTS.md
git checkout -- .opencode/command/memory/
```

### If Phase 12 fails (archive):
```bash
mv .opencode/skill/z_archive/system-memory .opencode/skill/
```

---

## Task Dependencies Graph

```
T1.1 ─────┬─> T2.1 ──> T2.3
          │   T2.2 ────┘
          │
          ├─> T3.1
          ├─> T3.2
          ├─> T4.1
          └─> T5.1
                │
                v
          T6.1 ─┬─> T6.2
                ├─> T6.3
                └─> T6.4
                      │
                      v
                    T7.1
                      │
                      v
                    T8.1
                      │
                      v
          T9.1 ─┬─> T9.2 ─┬─> T9.3 ─┬─> T9.4
                │         │         │
                v         v         v
                      T10.1
                        │
                        v
          T11.1 ──> T11.2 ──> T11.3
                        │
          T11.4 ────────┤
                        │
          T11.5 ────────┤
                        │
          T11.6 ────────┤
                        │
                        v
                      T12.1
```
