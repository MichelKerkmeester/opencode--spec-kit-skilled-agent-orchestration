---
title: "Plan: Rename workflows- [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/025-system-memory-rename/plan]"
description: "Based on the proven pattern from .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/007-system-spec-kit-rename, this rename will follow a 5-phase architecture with parallel agent execution where possible."
trigger_phrases:
  - "plan"
  - "rename"
  - "workflows"
  - "memory"
  - "system"
  - "025"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Rename workflows-memory → system-memory

<!-- ANCHOR:summary -->
<!-- ANCHOR:architecture -->
## Implementation Architecture

### 5-Phase Execution Model

Based on the proven pattern from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/007-system-spec-kit-rename`, this rename will follow a 5-phase architecture with parallel agent execution where possible.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           ORCHESTRATION OVERVIEW                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Phase 1: DIRECTORY RENAME (Blocking - Sequential)                       │
│  ─────────────────────────────────────────────────                       │
│  Single atomic operation: mv .opencode/skills/workflows-memory/          │
│                        → .opencode/skills/system-memory/                 │
│                                                                          │
│                              ↓ COMPLETE                                  │
│                                                                          │
│  Phase 2: INTERNAL SKILL UPDATES (Parallel - 8 Agents)                   │
│  ───────────────────────────────────────────────────────                 │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│  │Agent 2A │Agent 2B │Agent 2C │Agent 2D │Agent 2E │Agent 2F │Agent 2G │Agent 2H │
│  │SKILL.md │README.md│config   │mcp_srv  │scripts  │scripts  │referenc │templtes │
│  │(6 refs) │(12 refs)│(2 refs) │INSTALL  │*.js     │pkg.json │/*.md    │/*.md    │
│  │         │         │         │(18 refs)│(6 refs) │(4 refs) │(20 refs)│(2 refs) │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
│                                                                          │
│                              ↓ ALL COMPLETE                              │
│                                                                          │
│  Phase 3: EXTERNAL REFERENCES (Parallel - 8 Agents)                      │
│  ─────────────────────────────────────────────────                       │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│  │Agent 3A │Agent 3B │Agent 3C │Agent 3D │Agent 3E │Agent 3F │Agent 3G │Agent 3H │
│  │AGENTS.md│AGENTS   │opencode │command/ │command/ │command/ │other    │orchestr │
│  │(20 refs)│Univ.md  │.json    │memory/* │spec_kit │create/* │skills   │ator.md  │
│  │         │(15 refs)│(2 paths)│(6 refs) │/*.yaml  │(9 refs) │(13 refs)│(4 refs) │
│  │         │         │         │         │(32 refs)│         │         │         │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
│                                                                          │
│                              ↓ ALL COMPLETE                              │
│                                                                          │
│  Phase 4: VERIFICATION (Parallel - 6 Agents)                             │
│  ──────────────────────────────────────────                              │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐           │
│  │Agent 4A │Agent 4B │Agent 4C │Agent 4D │Agent 4E │Agent 4F │           │
│  │grep     │grep     │MCP      │command  │skill    │database │           │
│  │internal │external │server   │tests    │invoke   │connect  │           │
│  │skill    │refs     │tests    │         │tests    │test     │           │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘           │
│                                                                          │
│                              ↓ ALL PASS                                  │
│                                                                          │
│  Phase 5: DOCUMENTATION & CLEANUP (Sequential)                           │
│  ─────────────────────────────────────────────                           │
│  - Save memory context using generate-context.js                         │
│  - Update checklist.md with verification results                         │
│  - Mark spec as complete                                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

<!-- /ANCHOR:summary -->
<!-- /ANCHOR:architecture -->
## Phase 1: Directory Rename (BLOCKING)

**Agent Count:** 1 (Orchestrator direct)
**Status:** Sequential - Must complete before Phase 2

### Task 1.1: Rename Directory
```bash
mv .opencode/skills/workflows-memory/ .opencode/skills/system-memory/
```

### Verification
- [ ] Old directory does NOT exist: `.opencode/skills/workflows-memory/`
- [ ] New directory EXISTS: `.opencode/skills/system-memory/`
- [ ] All 30+ files preserved in new location

---

## Phase 2: Internal Skill Updates (PARALLEL)

**Agent Count:** 8 (Parallel)
**Dependencies:** Phase 1 complete

### Agent 2A: SKILL.md Updates
**File:** `.opencode/skills/system-memory/SKILL.md`
**References:** 6

| Line | Original | Replacement |
|------|----------|-------------|
| 2 | `name: workflows-memory` | `name: system-memory` |
| 140 | `Resource Router for workflows-memory skill` | `Resource Router for system-memory skill` |
| 475 | `node .opencode/skills/workflows-memory/scripts/` | `node .opencode/skills/system-memory/scripts/` |
| 769 | `.opencode/skills/workflows-memory/mcp_server/` | `.opencode/skills/system-memory/mcp_server/` |
| 770 | `.opencode/skills/workflows-memory/scripts/` | `.opencode/skills/system-memory/scripts/` |
| 771 | `.opencode/skills/workflows-memory/database/` | `.opencode/skills/system-memory/database/` |

### Agent 2B: README.md Updates
**File:** `.opencode/skills/system-memory/README.md`
**References:** 12

| Line(s) | Pattern |
|---------|---------|
| 1083-1085 | Database path references |
| 1647 | `MEMORY_INDEX_PATH` default |
| 1765 | Vector Index location |
| 1776 | `cd .opencode/skills/workflows-memory` |
| 1912, 1927 | sqlite3 commands |
| 1937 | Log path reference |
| 2011 | Skills SKILL.md path |
| 2025, 2028 | sqlite3 verification |

### Agent 2C: Config Files
**Files:** `.opencode/skills/system-memory/config.jsonc`
**References:** 2

| Line | Change |
|------|--------|
| 24 | `databasePath` update |
| 181 | Documentation comment |

### Agent 2D: MCP Server INSTALL_GUIDE.md
**File:** `.opencode/skills/system-memory/mcp_server/INSTALL_GUIDE.md`
**References:** 18

All path references to `workflows-memory` → `system-memory`

### Agent 2E: JavaScript Files (mcp_server + scripts)
**Files:** 
- `.opencode/skills/system-memory/mcp_server/lib/vector-index.js`
- `.opencode/skills/system-memory/scripts/generate-context.js`
- `.opencode/skills/system-memory/scripts/lib/vector-index.js`

**References:** 6

| File | Lines |
|------|-------|
| `mcp_server/lib/vector-index.js` | 28, 30 |
| `scripts/generate-context.js` | 155, 157-158 |
| `scripts/lib/vector-index.js` | 46, 48 |

### Agent 2F: Package JSON Files
**Files:**
- `.opencode/skills/system-memory/scripts/package.json`
- `.opencode/skills/system-memory/scripts/package-lock.json`

**References:** 4

| File | Line | Change |
|------|------|--------|
| `scripts/package.json` | 2 | `"name": "system-memory-scripts"` |
| `scripts/package-lock.json` | 2, 8 | Package name updates |

### Agent 2G: Reference Files
**Files:** `.opencode/skills/system-memory/references/*.md`
**References:** 20

| File | Lines |
|------|-------|
| `spec_folder_detection.md` | 339 |
| `semantic_memory.md` | 354, 431, 443, 453, 456, 473 |
| `troubleshooting.md` | 48 |
| `alignment_scoring.md` | 174, 181, 204 |
| `execution_methods.md` | 187, 206, 217, 223, 228, 231, 246, 404, 413 |

### Agent 2H: Template Files
**File:** `.opencode/skills/system-memory/templates/context_template.md`
**References:** 2

| Line | Change |
|------|--------|
| 243 | Path reference update |
| 446 | "Generated by system-memory skill" |

---

## Phase 3: External References (PARALLEL)

**Agent Count:** 8 (Parallel)
**Dependencies:** Phase 2 complete

### Agent 3A: AGENTS.md
**File:** `AGENTS.md`
**References:** 20

| Line | Content Type |
|------|--------------|
| 78 | Self-verification checklist |
| 188 | Phase 2 documentation |
| 422 | Scratch vs Memory section |
| 655 | Database disambiguation table |
| 664 | Troubleshooting path |
| 819-823 | Skills table entry |
| + ~14 more | semantic memory section refs |

### Agent 3B: AGENTS (Universal).md
**File:** `AGENTS (Universal).md`
**References:** 15

| Line | Content Type |
|------|--------------|
| 179 | Phase 2 documentation |
| 391 | Memory guidelines |
| 705-709 | Skills table entry |
| + ~12 more | semantic memory refs |

### Agent 3C: opencode.json
**File:** `opencode.json`
**References:** 2 (CRITICAL - absolute paths)

| Line | Change |
|------|--------|
| 59 | MCP server path: `workflows-memory` → `system-memory` |
| 62 | Database note path: `workflows-memory` → `system-memory` |

### Agent 3D: Memory Commands
**Files:** `.opencode/command/memory/*.md`
**References:** 6

| File | Lines |
|------|-------|
| `save.md` | 135, 275, 316, 485 |
| `search.md` | 586 |
| `checkpoint.md` | 473 |

### Agent 3E: SpecKit Command YAMLs
**Files:** `.opencode/command/spec_kit/assets/*.yaml`
**References:** 32

| File | Refs |
|------|------|
| `spec_kit_complete_auto.yaml` | 6 |
| `spec_kit_complete_confirm.yaml` | 6 |
| `spec_kit_implement_auto.yaml` | 4 |
| `spec_kit_implement_confirm.yaml` | 4 |
| `spec_kit_plan_auto.yaml` | 2 |
| `spec_kit_plan_confirm.yaml` | 2 |
| `spec_kit_research_auto.yaml` | 4 |
| `spec_kit_research_confirm.yaml` | 4 |

### Agent 3F: Create Commands
**Files:** `.opencode/command/create/assets/*.yaml`, `.opencode/command/create/*.md`
**References:** 9

| File | Refs |
|------|------|
| `create_skill.yaml` | 2 |
| `create_skill_asset.yaml` | 2 |
| `create_skill_reference.yaml` | 2 |
| `create_folder_readme.yaml` | 3 |
| `create_install_guide.yaml` | 2 |
| `folder_readme.md` | 1 |

### Agent 3G: Other Skills
**Files:** Various skills referencing workflows-memory
**References:** 13

| Skill | File | Refs |
|-------|------|------|
| cli-codex | SKILL.md | 1 |
| cli-gemini | SKILL.md | 1 |
| sk-doc | SKILL.md, quick_reference.md, assets | 3 |
| system-spec-kit | SKILL.md, README.md, references | 6 |

### Agent 3H: Orchestrator Agent
**File:** `.opencode/agent/orchestrator.md`
**References:** 4

| Line | Content |
|------|---------|
| 88 | Skill routing table |
| 152 | Agent assignments |
| 260 | Memory skill reference |
| 281 | Context saving |

---

## Phase 4: Verification (PARALLEL)

**Agent Count:** 6 (Parallel)
**Dependencies:** Phase 3 complete

### Agent 4A: Grep Internal Skill
**Scope:** `.opencode/skills/system-memory/`
**Command:** `grep -r "workflows-memory" .opencode/skills/system-memory/`
**Expected:** 0 matches

### Agent 4B: Grep External References
**Scope:** Active files (excluding specs/)
**Command:** `grep -r "workflows-memory" --include="*.md" --include="*.json" --include="*.yaml" --include="*.js" . | grep -v "specs/"`
**Expected:** 0 matches

### Agent 4C: MCP Server Test
**Test:** Verify semantic_memory MCP tools respond
**Commands:**
1. Check MCP server starts without errors
2. Verify `memory_search` tool accessible
3. Verify `memory_list` tool accessible

### Agent 4D: Command Tests
**Test:** All /memory:* commands functional
**Commands:**
1. Verify `/memory:save` command loads
2. Verify `/memory:search` command loads
3. Verify `/memory:checkpoint` command loads

### Agent 4E: Skill Invocation Test
**Test:** `openskills read system-memory`
**Expected:** SKILL.md content loads successfully

### Agent 4F: Database Connection Test
**Test:** Verify database path works
**Command:** `sqlite3 .opencode/skills/system-memory/database/memory-index.sqlite "SELECT count(*) FROM memories;"`
**Expected:** Returns count without errors

---

## Phase 5: Documentation & Cleanup (SEQUENTIAL)

**Agent Count:** 1 (Orchestrator)
**Dependencies:** Phase 4 all pass

### Task 5.1: Update Checklist
- Mark all verification items with evidence
- Document any remediation needed

### Task 5.2: Save Memory Context
Run generate-context.js to preserve context for future sessions:
```bash
node .opencode/skills/system-memory/scripts/generate-context.js \
  --spec-folder "009-system-memory-rename" \
  --topic "system-memory-rename"
```

### Task 5.3: Mark Complete
- Update spec.md status to "Complete"
- Update tasks.md with completion markers

---

## Estimated Totals

| Phase | Agents | References | Duration |
|-------|--------|------------|----------|
| Phase 1 | 1 | 1 operation | ~1 min |
| Phase 2 | 8 | ~71 refs | ~5 min |
| Phase 3 | 8 | ~94 refs | ~5 min |
| Phase 4 | 6 | N/A (verification) | ~3 min |
| Phase 5 | 1 | N/A (docs) | ~2 min |
| **TOTAL** | **24** | **~165** | **~16 min** |

---

<!-- ANCHOR:rollback -->
## Rollback Plan

If critical failures occur:

1. **Directory rollback:**
   ```bash
   mv .opencode/skills/system-memory/ .opencode/skills/workflows-memory/
   ```

2. **Git restore:**
   ```bash
   git checkout -- .opencode/skills/workflows-memory/
   git checkout -- AGENTS.md
   git checkout -- opencode.json
   # etc.
   ```

3. **Partial rollback:** Restore specific files using git while keeping directory rename

<!-- /ANCHOR:rollback -->
---

## Related Documentation

- Previous successful rename: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/007-system-spec-kit-rename`
- Skill rename pattern: `.opencode/specs/03--commands-and-skills/z_archive/002-doc-skill-rename`
- Current skill documentation: `.opencode/skills/workflows-memory/SKILL.md`
