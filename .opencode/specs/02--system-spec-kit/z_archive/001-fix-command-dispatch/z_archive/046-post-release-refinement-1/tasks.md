---
title: "Task Breakdown: Post-Release Refinement 1 [046-post-release-refinement-1/tasks]"
description: "Description"
trigger_phrases:
  - "task"
  - "breakdown"
  - "post"
  - "release"
  - "refinement"
  - "tasks"
  - "046"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown: Post-Release Refinement 1

<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit/templates/tasks.md -->

| Metadata | Value |
|----------|-------|
| **Total Tasks** | 69 |
| **Critical (P0)** | 6 |
| **High (P1)** | 10 |
| **Medium (P1/P2)** | 20 |
| **Low (P2)** | 33 |

---

## TASK LEGEND

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed |
| `[-]` | Blocked |
| `[!]` | Needs review |

| Priority | Color | Action |
|----------|-------|--------|
| **P0** | CRITICAL | Must fix immediately |
| **P1** | HIGH | Must fix this sprint |
| **P2** | MEDIUM | Should fix |
| **P3** | LOW | Nice to have |

---

## PHASE 1: CRITICAL BUG FIXES (P0)

### C1: Fix Duplicate Entries on Checkpoint Restore
- **Priority:** P0 CRITICAL
- **Effort:** 2h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js`
- **Lines:** 405-479
- **Dependencies:** None

**Description:**
Checkpoint restore may insert duplicate memory entries despite UNIQUE constraint on `(spec_folder, file_path, anchor_id)`. This happens when any of these values differs slightly.

**Implementation:**
```javascript
// In restoreCheckpoint(), before batch insert:
const existing = db.prepare(`
  SELECT id FROM memory_index 
  WHERE file_path = ? AND spec_folder = ?
`).get(memory.file_path, memory.spec_folder);

if (existing) {
  // Update instead of insert
  db.prepare(`UPDATE memory_index SET ... WHERE id = ?`).run(..., existing.id);
} else {
  // Insert new
  db.prepare(`INSERT INTO memory_index ...`).run(...);
}
```

**Acceptance Criteria:**
- [ ] Checkpoint restore twice produces no duplicates
- [ ] `memory_search` returns unique results
- [ ] Database row count stable after multiple restores

---

### C2: Add Orphaned File Detection
- **Priority:** P0 CRITICAL
- **Effort:** 3h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Lines:** 2824-2848
- **Dependencies:** None

**Description:**
`verifyIntegrity()` only checks vector-to-index consistency but NOT if the referenced files actually exist on the filesystem. Deleted files remain in database indefinitely.

**Implementation:**
```javascript
// In verifyIntegrity(), add new check:
async checkOrphanedFiles() {
  const memories = db.prepare('SELECT id, file_path FROM memory_index').all();
  const orphaned = [];
  
  for (const memory of memories) {
    if (!fs.existsSync(memory.file_path)) {
      orphaned.push({
        id: memory.id,
        file_path: memory.file_path,
        reason: 'File no longer exists'
      });
    }
  }
  
  return orphaned;
}
```

**Acceptance Criteria:**
- [ ] Delete a memory file manually
- [ ] Run `verifyIntegrity()`
- [ ] Orphaned file is reported
- [ ] Option to auto-cleanup provided

---

### C3: Fix Broken Skill References in Command YAML
- **Priority:** P0 CRITICAL
- **Effort:** 30m
- **Files:**
  - `.opencode/command/create/assets/create_skill_reference.yaml:430`
  - `.opencode/command/create/assets/create_skill_asset.yaml:318`
  - `.opencode/command/create/assets/create_folder_readme.yaml:413,197`
- **Dependencies:** None

**Description:**
Commands reference non-existent skill `.opencode/skill/system-memory/SKILL.md`. Should reference `system-spec-kit`.

**Implementation:**
```yaml
# Before:
- path: .opencode/skill/system-memory/SKILL.md

# After:
- path: .opencode/skill/system-spec-kit/SKILL.md
```

**Acceptance Criteria:**
- [ ] grep "system-memory" returns no results in command folder
- [ ] Commands execute without "file not found" errors
- [ ] Example loading works correctly

---

### C4: Standardize Gate Numbering
- **Priority:** P0 CRITICAL
- **Effort:** 1h
- **File:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Lines:** 82, 253, 255, 271, 409, 447, 606, 620, 685, 797, 798, 854
- **Dependencies:** None

**Description:**
SKILL.md uses "Gate 4, 5, 6" but AGENTS.md uses "Gate 1, 2, 3". This causes confusion and incorrect gate enforcement.

**Implementation:**
| Old Reference | New Reference |
|---------------|---------------|
| Gate 4 | Gate 3 |
| Gate 5 | (remove or rename) |
| Gate 6 | (remove or rename) |

**Acceptance Criteria:**
- [ ] `grep -E "Gate [4-9]" SKILL.md` returns no results
- [ ] All gate references match AGENTS.md numbering
- [ ] Documentation is internally consistent

---

### C5: Replace Hardcoded Absolute Paths
- **Priority:** P0 CRITICAL
- **Effort:** 30m
- **File:** `.utcp_config.json`
- **Lines:** 117, 120
- **Dependencies:** None

**Description:**
Narsil binary and workspace paths are hardcoded to `/Users/michelkerkmeester/...`, making configuration non-portable.

**Implementation:**
```json
// Before:
"command": "/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/target/release/narsil-mcp",
"args": ["--workspace", "/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"]

// After (Option A - relative to project):
"command": "${workspaceFolder}/../../../MCP Servers/narsil-mcp/target/release/narsil-mcp",
"args": ["--workspace", "${workspaceFolder}"]

// After (Option B - environment variable):
"command": "${NARSIL_BINARY:-narsil-mcp}",
"args": ["--workspace", "${WORKSPACE_ROOT:-.}"]
```

**Acceptance Criteria:**
- [ ] Configuration works without user-specific paths
- [ ] Narsil MCP server starts successfully
- [ ] Environment variable fallbacks work

---

### C6: Add Transaction to recordValidation
- **Priority:** P0 CRITICAL
- **Effort:** 1h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/confidence-tracker.js`
- **Lines:** 49-79
- **Dependencies:** None

**Description:**
`recordValidation()` performs read-modify-write without transaction wrapper, causing race conditions under concurrent access.

**Implementation:**
```javascript
// Before:
async recordValidation(memoryId, wasUseful) {
  const memory = await this.db.prepare('SELECT ...').get(memoryId);
  const newConfidence = calculateConfidence(...);
  await this.db.prepare('UPDATE ...').run(newConfidence, memoryId);
}

// After:
recordValidation(memoryId, wasUseful) {
  return this.db.transaction(() => {
    const memory = this.db.prepare('SELECT ...').get(memoryId);
    if (!memory) throw new Error('Memory not found');
    const newConfidence = calculateConfidence(...);
    this.db.prepare('UPDATE ...').run(newConfidence, memoryId);
    return { success: true, newConfidence };
  })();
}
```

**Acceptance Criteria:**
- [ ] Concurrent validation calls produce correct counts
- [ ] No lost updates under load
- [ ] Transaction properly rolls back on error

---

## PHASE 2: HIGH SEVERITY BUG FIXES (P1)

### H1: Create Missing Validation Scripts
- **Priority:** P1 HIGH
- **Effort:** 2h
- **Files:**
  - `.opencode/skill/system-spec-kit/scripts/validate-spec-folder.js` (create)
  - `.opencode/skill/system-spec-kit/scripts/validate-memory-file.js` (create)
  - `.opencode/skill/system-spec-kit/SKILL.md:187-188` (update)
- **Dependencies:** None

**Description:**
SKILL.md documents validation scripts that don't exist. Decision: Create stub implementations.

**Implementation:**
```javascript
// validate-spec-folder.js
const fs = require('fs');
const path = require('path');

function validateSpecFolder(folderPath) {
  const issues = [];
  const requiredFiles = ['spec.md', 'plan.md'];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(folderPath, file))) {
      issues.push({ severity: 'error', message: `Missing required file: ${file}` });
    }
  }
  
  return { valid: issues.length === 0, issues };
}

module.exports = { validateSpecFolder };
```

**Acceptance Criteria:**
- [ ] Both scripts exist and export expected functions
- [ ] Scripts can be imported without errors
- [ ] SKILL.md references are accurate

---

### H2: Fix Anchor Links in workflows-code
- **Priority:** P1 HIGH
- **Effort:** 1h
- **File:** `.opencode/skill/workflows-code/SKILL.md`
- **Lines:** 91-107
- **Dependencies:** None

**Description:**
Anchor links to reference files have incorrect section numbers (off by 1).

**Implementation:**
| Line | Current (Wrong) | Fixed |
|------|-----------------|-------|
| 91 | `#1-🕐-condition-based-waiting` | `#2-⏱️-condition-based-waiting` |
| 92 | `#2-🛡️-defense-in-depth-validation` | `#3-🛡️-defense-in-depth-validation` |
| 93 | `#3-🔄-cdn-version-management` | `#4-🔄-cdn-version-management` |
| 105 | `#1-🔍-systematic-debugging` | `#2-🔍-systematic-debugging` |
| 106 | `#2-🔎-root-cause-tracing` | `#3-🎯-root-cause-tracing` |
| 107 | `#3-🔍-performance-debugging` | `#4-🔍-performance-debugging` |

**Acceptance Criteria:**
- [ ] Each anchor link resolves to correct section
- [ ] Manual verification of all 6+ links

---

### H3: Document Real-time Memory Sync Limitation
- **Priority:** P1 HIGH
- **Effort:** 1h
- **Files:**
  - `.opencode/skill/system-spec-kit/SKILL.md` (document limitation)
  - `AGENTS.md` (add note about manual sync)
- **Dependencies:** None

**Description:**
No file watcher exists for real-time memory sync. Changes after startup require manual `memory_index_scan`.

**Implementation:**
Add documentation noting:
1. Memory files are indexed on server startup
2. Changes after startup require `memory_index_scan` or `memory_save`
3. Future enhancement: file watcher (out of scope for this refinement)

**Acceptance Criteria:**
- [ ] Limitation documented in SKILL.md
- [ ] Workaround documented (manual index scan)
- [ ] User knows how to refresh index

---

### H4: Implement Embedding Failure Rollback
- **Priority:** P1 HIGH
- **Effort:** 2h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
- **Lines:** 981-1004
- **Dependencies:** C6 (transaction pattern)

**Description:**
When embedding regeneration fails after title change, metadata still updates but search is stale.

**Implementation:**
```javascript
// Wrap in transaction
const result = db.transaction(() => {
  // Update metadata
  const updateResult = vectorIndex.updateMemory(id, updates);
  
  // If title changed, regenerate embedding
  if (updates.title && updates.title !== existing.title) {
    const embedding = await embeddings.generateEmbedding(updates.title);
    if (!embedding) {
      throw new Error('Failed to regenerate embedding');
    }
    vectorIndex.updateEmbedding(id, embedding);
  }
  
  return updateResult;
})();
```

**Acceptance Criteria:**
- [ ] Force embedding failure (mock)
- [ ] Verify metadata unchanged after failure
- [ ] Search returns consistent results

---

### H5: Add Missing idx_history_timestamp Index
- **Priority:** P1 HIGH
- **Effort:** 1h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Lines:** 714 (add migration)
- **Dependencies:** None

**Description:**
Index defined in schema creation but not applied to existing databases.

**Implementation:**
```javascript
// Add to ensureMigrations() or createSchema()
const migrateLegacyIndexes = () => {
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_history_timestamp 
      ON memory_history(timestamp DESC)
    `);
    console.log('Created idx_history_timestamp index');
  } catch (err) {
    // Index may already exist
    if (!err.message.includes('already exists')) throw err;
  }
};
```

**Acceptance Criteria:**
- [ ] Index exists in database schema
- [ ] `ORDER BY timestamp DESC` queries use index
- [ ] Migration is idempotent

---

### H6: Standardize Timestamp Format
- **Priority:** P1 HIGH
- **Effort:** 2h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Lines:** 2329 (recordAccess), schema definitions
- **Dependencies:** H5

**Description:**
`last_accessed` column defined as INTEGER but code writes ISO strings. Mixed formats cause sorting issues.

**Implementation:**
Decision: Migrate to TEXT ISO format (see decision-record.md DR-003)
```javascript
// Update recordAccess to use consistent format
recordAccess(memoryId) {
  const now = new Date().toISOString();
  this.db.prepare(`
    UPDATE memory_index 
    SET last_accessed_at = ?, access_count = access_count + 1
    WHERE id = ?
  `).run(now, memoryId);
}
```

**Acceptance Criteria:**
- [ ] All timestamp columns use TEXT ISO format
- [ ] Sorting by last_accessed works correctly
- [ ] Migration handles existing data

---

### H7: Implement Cascade Delete for memory_history
- **Priority:** P1 HIGH
- **Effort:** 1h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Lines:** 923-939
- **Dependencies:** None

**Description:**
`deleteMemory()` doesn't clean up related `memory_history` entries, leaving orphaned audit records.

**Implementation:**
```javascript
deleteMemory(id) {
  return this.db.transaction(() => {
    // 1. Delete history entries first
    this.db.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
    
    // 2. Delete vector
    try {
      this.db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
    } catch (e) {
      // Vector may not exist, continue
    }
    
    // 3. Delete memory entry
    const result = this.db.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
    return result.changes > 0;
  })();
}
```

**Acceptance Criteria:**
- [ ] Deleting memory removes history entries
- [ ] No orphaned history records in database
- [ ] Transaction ensures atomicity

---

### H8: Standardize LEANN Tool Naming
- **Priority:** P1 HIGH
- **Effort:** 1h
- **Files:**
  - `AGENTS.md:482`
  - `.opencode/skill/mcp-code-mode/SKILL.md:480`
- **Dependencies:** None

**Description:**
Some documentation uses `leann_search()` while actual tool name is `leann_leann_search()`.

**Implementation:**
| File | Line | Current | Fixed |
|------|------|---------|-------|
| AGENTS.md | 482 | `leann_search()` | `leann_leann_search()` |
| mcp-code-mode/SKILL.md | 480 | `leann_search({...})` | `leann_leann_search({...})` |

**Acceptance Criteria:**
- [ ] All LEANN tool references use `leann_leann_*` prefix
- [ ] grep for `leann_search\(` (without double leann) returns no results

---

### H9: Preserve Error Codes in MCP Response
- **Priority:** P1 HIGH
- **Effort:** 1h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
- **Lines:** 568-578
- **Dependencies:** None

**Description:**
All tool errors return same format without MemoryError codes, preventing clients from distinguishing error types.

**Implementation:**
```javascript
// Before:
catch (error) {
  return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
}

// After:
catch (error) {
  const errorResponse = {
    type: 'text',
    text: JSON.stringify({
      error: error.message,
      code: error.code || 'UNKNOWN',
      details: error.details || null
    })
  };
  return { content: [errorResponse], isError: true };
}
```

**Acceptance Criteria:**
- [ ] Error responses include error code
- [ ] Clients can parse structured error
- [ ] Different error types have different codes

---

### H10: Add Botpoison Failure Logging
- **Priority:** P1 HIGH
- **Effort:** 30m
- **File:** `src/2_javascript/form/form_submission.js`
- **Lines:** 161-166
- **Dependencies:** None

**Description:**
Both timeout and other Botpoison errors silently return null without logging.

**Implementation:**
```javascript
// Before:
} catch (error) {
  if (error && error.message === 'Botpoison timeout') {
    return null;
  }
  return null;
}

// After:
} catch (error) {
  console.error('[Botpoison] Verification failed:', error?.message || 'Unknown error');
  // Continue without bot verification rather than blocking form
  return null;
}
```

**Acceptance Criteria:**
- [ ] Botpoison failures are logged
- [ ] Form submission continues (graceful degradation)
- [ ] Errors can be monitored in production

---

## PHASE 3: MEDIUM SEVERITY BUG FIXES (P1/P2)

### M1: Fix Step Count Mismatch
- **Priority:** P2 MEDIUM
- **Effort:** 15m
- **File:** `.opencode/command/spec_kit/implement.md`
- **Lines:** 227, 268-280
- **Dependencies:** None

**Task:** Change `sequential_8_step` to `sequential_9_step` in YAML block to match documentation.

**Acceptance Criteria:**
- [ ] YAML and documentation show same step count

---

### M2: Fix allowed-tools in Skill Frontmatter
- **Priority:** P2 MEDIUM
- **Effort:** 30m
- **Files:**
  - `.opencode/skill/mcp-chrome-devtools/SKILL.md`
  - `.opencode/skill/sk-git/SKILL.md`
- **Dependencies:** None

**Task:** Replace `mcp-code-mode` (skill name) with actual tool names like `call_tool_chain`.

**Acceptance Criteria:**
- [ ] Frontmatter lists tool names, not skill names

---

### M3: Fix Unreachable INTENT_BOOSTERS
- **Priority:** P1 MEDIUM
- **Effort:** 1h
- **File:** `.opencode/scripts/skill_advisor.py`
- **Dependencies:** None

**Task:** Add non-hyphenated variants for `dead-code` and `call-graph`:
```python
"deadcode": ("mcp-narsil", 0.8),
"callgraph": ("mcp-narsil", 0.8),
```

**Acceptance Criteria:**
- [ ] `deadcode` and `callgraph` queries route to mcp-narsil

---

### M4: Add Cross-Platform stat Commands
- **Priority:** P2 MEDIUM
- **Effort:** 1h
- **File:** `.opencode/command/search/index.md`
- **Lines:** 86-89
- **Dependencies:** None

**Task:** Add platform detection for stat command syntax:
```bash
if [[ "$OSTYPE" == "darwin"* ]]; then
  stat -f '%m' "$file"
else
  stat -c '%Y' "$file"
fi
```

**Acceptance Criteria:**
- [ ] Commands work on macOS
- [ ] Commands work on Linux

---

### M5: Optimize LRU Cache Eviction
- **Priority:** P2 MEDIUM
- **Effort:** 2h
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Lines:** 2363-2398
- **Dependencies:** None

**Task:** Replace O(n) linear scan with O(1) linked-list based eviction.

**Acceptance Criteria:**
- [ ] Cache eviction is O(1)
- [ ] Cache behavior unchanged
- [ ] Performance improved for large cache

---

### M6: Add Temp File Cleanup
- **Priority:** P2 MEDIUM
- **Effort:** 30m
- **File:** `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- **Lines:** 2409
- **Dependencies:** None

**Task:** Add finally block to clean up `.tmp` files on failure:
```javascript
} catch (fileError) {
  try { await fs.unlink(tempPath); } catch {}
  throw fileError;
}
```

**Acceptance Criteria:**
- [ ] No orphaned .tmp files after failures

---

### M7: Fix Priority Tags False Positives
- **Priority:** P2 MEDIUM
- **Effort:** 1h
- **File:** `.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh`
- **Dependencies:** None

**Task:** Update regex to recognize `**P0**` bold format as valid priority marker.

**Acceptance Criteria:**
- [ ] `**P0**` format not flagged as missing context

---

### M8: Remove Outdated Docker Requirement
- **Priority:** P2 MEDIUM
- **Effort:** 30m
- **Files:**
  - `.opencode/skill/sk-git/SKILL.md:39, 128`
  - `.opencode/skill/sk-git/references/finish_workflows.md:198`
- **Dependencies:** None

**Task:** Remove/update references to Docker requirement for GitHub MCP (uses npx).

**Acceptance Criteria:**
- [ ] No Docker requirement mentioned for GitHub MCP

---

### M9-M20: Additional Medium Severity Tasks

| ID | Description | File | Effort |
|----|-------------|------|--------|
| M9 | Handle partial embedding update | context-server.js | 1h |
| M10 | Clear constitutional cache on tier change | vector-index.js | 30m |
| M11 | Handle checkpoint creation failure | context-server.js | 30m |
| M12 | (Covered by H7) | - | - |
| M13 | Add JSON schema validation | generate-context.js | 2h |
| M14 | Handle vector deletion error in transaction | vector-index.js | 30m |
| M15 | Block server until model warmup | context-server.js | 1h |
| M16 | Enforce implementation-summary.md for L1 | check-files.sh | 1h |
| M17 | Add sub-folder versioning automation | create-spec-folder.sh | 2h |
| M18 | Add template hash validation | validate-spec.sh | 1h |
| M19 | Add migration versioning | vector-index.js | 2h |
| M20 | Add Code Mode tools to mcp-narsil | mcp-narsil/SKILL.md | 30m |

---

## PHASE 4: LOW SEVERITY TASKS (P2/P3)

### Documentation & Cleanup

| ID | Description | File | Effort |
|----|-------------|------|--------|
| L1 | Standardize allowed-tools array formatting | Multiple SKILL.md | 1h |
| L2 | Add command index README | .opencode/command/README.md | 30m |
| L3 | Document scripts/lib/ contents | SKILL.md | 30m |
| L4 | Document scripts/rules/ contents | SKILL.md | 30m |
| L5 | Add `// intentionally empty` to catch blocks | Multiple | 2h |
| L6 | Add handover YAML variants | command/spec_kit/ | 1h |
| L7 | Fix description casing consistency | Multiple commands | 30m |
| L8 | Add skill advisor `--threshold` CLI option | skill_advisor.py | 1h |
| L9 | Add `git` to INTENT_BOOSTERS | skill_advisor.py | 15m |
| L10 | Document confidence formula | skill_advisor.py | 30m |

### Code Quality

| ID | Description | File | Effort |
|----|-------------|------|--------|
| L11 | Remove duplicate `last_accessed` column | vector-index.js | 2h |
| L12 | Add embedding timeout wrapper | embeddings.js | 1h |
| L13 | Add batch embedding API | embeddings.js | 3h |
| L14 | Implement granular cache invalidation | vector-index.js | 2h |
| L15 | Add rate limiting for index scan | context-server.js | 1h |
| L16 | Add health check endpoint | context-server.js | 30m |

### Error Handling Improvements

| ID | Description | File | Effort |
|----|-------------|------|--------|
| L17 | Improve error messages with context | Multiple | 2h |
| L18 | Add structured logging (JSON format) | generate-context.js | 2h |
| L19 | Add input sanitization for paths | generate-context.js | 1h |
| L20 | Handle library import failures | generate-context.js | 30m |

### Testing

| ID | Description | Effort |
|----|-------------|--------|
| L21 | Add integration tests for memory CRUD | 4h |
| L22 | Add regression tests for each critical fix | 4h |
| L23 | Document manual testing procedures | 2h |
| L24 | Add checkpoint save/restore tests | 2h |

---

## TASK DEPENDENCIES

```
C6 ─────────────────────────────┐
                                ├──► H4 (uses transaction pattern)
C1, C2 ─────────────────────────┘

H5 ─────────────────────────────┐
                                ├──► H6 (timestamp migration)
                                │
H6 ─────────────────────────────┼──► M19 (migration versioning)
                                │
H7 ─────────────────────────────┘

M5 depends on H7 (LRU uses delete pattern)

All documentation tasks (C3, C4, H1, H2, H8, M1, M2, M8) have no code dependencies
```

---

## EFFORT SUMMARY

| Phase | Tasks | Total Effort |
|-------|-------|--------------|
| Phase 1 (Critical) | 6 | ~8h |
| Phase 2 (High) | 10 | ~13h |
| Phase 3 (Medium) | 20 | ~18h |
| Phase 4 (Low) | 33 | ~35h |
| **Total** | **69** | **~74h** |

---

## COMPLETION TRACKING

| Phase | Total | Completed | Remaining |
|-------|-------|-----------|-----------|
| Phase 1 | 6 | 0 | 6 |
| Phase 2 | 10 | 0 | 10 |
| Phase 3 | 20 | 0 | 20 |
| Phase 4 | 33 | 0 | 33 |
