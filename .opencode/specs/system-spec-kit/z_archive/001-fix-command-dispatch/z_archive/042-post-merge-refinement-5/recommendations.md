# Recommendations: Post-Merge Refinement Phase 5

> Prioritized action plan for fixing identified issues in the Spec Kit Memory system

---

## Overview

### Priority Definitions

| Priority | Label | Description | SLA |
|----------|-------|-------------|-----|
| **P0** | Critical | System broken or data loss risk | Fix immediately |
| **P1** | Significant | Causes confusion or degraded experience | Fix this sprint |
| **P2** | Refinement | Improves quality but not blocking | Backlog |

### Effort Summary

| Priority | Count | Total Effort |
|----------|-------|--------------|
| P0 | 7 | ~12 hours |
| P1 | 8 | ~11.5 hours |
| P2 | 10 | ~28 hours |
| **Total** | **25** | **~51.5 hours** |

---

## P0 - Critical Bug Fixes

### P0-001: Fix Duplicate getConstitutionalMemories Function

**Problem**: Function defined twice in `vector-index.js` with different signatures:
- Line 209: Cached version with proper memoization
- Line 1111: Uncached version that bypasses optimization

**Impact**: Constitutional memory cache is bypassed, causing repeated database queries on every search. This significantly degrades performance.

**Solution**:
1. Remove the duplicate function at line 1111
2. Export only the cached version from line 209
3. Update any internal references to use the cached version

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js:209, 1111`

**Effort**: 1 hour

**Dependencies**: None

**Verification**: Run `memory_search()` twice - second call should show cache hit in debug logs

---

### P0-002: Fix Column Name Mismatch

**Problem**: Code references `last_accessed_at` but schema defines column as `last_accessed`

**Location**: 
- Code: `vector-index.js:2242` uses `last_accessed_at`
- Schema: line 546 defines `last_accessed`

**Impact**: Access tracking fails silently. LRU-based cache eviction and decay scoring are broken.

**Solution**: Update code to use `last_accessed` consistently:
```javascript
// Before
UPDATE memory_index SET last_accessed_at = datetime('now')

// After  
UPDATE memory_index SET last_accessed = datetime('now')
```

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js:2242`

**Effort**: 30 minutes

**Dependencies**: None

**Verification**: Call `memory_search()`, then query DB to confirm `last_accessed` updated

---

### P0-003: Add Missing related_memories Column

**Problem**: `linkRelatedOnSave()` function writes to `related_memories` column that doesn't exist in schema

**Impact**: SQLite throws error when saving memories with relations. The entire save operation may fail.

**Solution**:
1. Add migration to create column:
```sql
ALTER TABLE memory_index ADD COLUMN related_memories TEXT;
```
2. Add to schema definition for new databases
3. Handle JSON serialization for the array of related IDs

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js` (schema and migration)

**Effort**: 1 hour

**Dependencies**: None

**Verification**: Save a memory, verify no SQLite error, query column exists

---

### P0-004: Implement Missing Functions

**Problem**: Two functions are called but don't exist:
- `verifyIntegrityWithPaths()` - called at line 1696
- `cleanupOrphans()` - called at line 1700

**Impact**: Runtime errors on MCP server startup. Server may crash or operate in degraded mode.

**Solution**: Either:
- **Option A**: Implement the missing functions based on their intended behavior
- **Option B**: Use existing `verifyIntegrity()` function and remove the undefined calls

Recommended: Option B (simpler, lower risk)

```javascript
// Replace
await verifyIntegrityWithPaths(indexedPaths);
await cleanupOrphans();

// With
await verifyIntegrity();
```

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js:1696, 1700`

**Effort**: 2 hours

**Dependencies**: None

**Verification**: Start MCP server, confirm no startup errors

---

### P0-005: Fix Empty Trigger Phrases

**Problem**: Trigger phrase extraction fails on generated content (like context files), producing empty arrays `[]`

**Root Cause**: Algorithm depends on natural headings/emphasis that generated files lack

**Impact**: Proactive memory surfacing (`memory_match_triggers()`) never finds these memories. Critical context is invisible to fast-path matching.

**Solution**: Add fallback extraction chain:
1. Try standard extraction from content
2. If empty, extract from H1/H2 headers
3. If still empty, extract from file path components
4. If still empty, extract from spec folder name
5. Always include at least 3 trigger phrases

```javascript
function extractTriggers(content, filePath, specFolder) {
  let triggers = extractFromContent(content);
  if (triggers.length === 0) {
    triggers = extractFromHeaders(content);
  }
  if (triggers.length === 0) {
    triggers = extractFromPath(filePath);
  }
  if (triggers.length === 0) {
    triggers = extractFromSpecFolder(specFolder);
  }
  return triggers.slice(0, 10); // Max 10 triggers
}
```

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/trigger-extractor.js:658-673`

**Effort**: 3 hours

**Dependencies**: None

**Verification**: Run `memory_index_scan()`, verify all memories have non-empty trigger_phrases

---

### P0-006: Include Embeddings in Checkpoint Snapshots

**Problem**: Checkpoint creation serializes `memory_index` but not `vec_memories` table containing embeddings

**Impact**: 
- Restored memories have no embeddings
- Semantic search returns 0 results until `memory_index_scan()` is run
- User may not realize memories are broken

**Solution**: Modify checkpoint creation to include both tables:
```javascript
// In checkpoint_create
const memoryData = db.prepare('SELECT * FROM memory_index').all();
const vectorData = db.prepare('SELECT * FROM vec_memories').all();

checkpoint.data = {
  memories: memoryData,
  embeddings: vectorData
};
```

Also update restore logic to rebuild `vec_memories`.

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/checkpoints.js:263-296`

**Effort**: 4 hours

**Dependencies**: None

**Verification**: Create checkpoint, restore it, run `memory_search()` - should return semantic results

---

### P0-007: Fix includeContiguity Parameter Passthrough

**Problem**: `includeContiguity` option is extracted from request but never passed to `hybridSearch()`

```javascript
// Current code (broken)
const includeContiguity = options.includeContiguity ?? false;
// ... includeContiguity never used

const results = await hybridSearch(query, limit);  // Missing parameter!
```

**Impact**: Users cannot retrieve adjacent memories even when explicitly requesting them

**Solution**: Pass parameter through the call chain:
```javascript
const results = await hybridSearch(query, limit, { includeContiguity });
```

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js:652-657`

**Effort**: 30 minutes

**Dependencies**: None

**Verification**: Call `memory_search({ includeContiguity: true })`, verify adjacent memories returned

---

## P1 - Significant Issues

### P1-001: Align Gate Numbering

**Problem**: Documentation inconsistently references gate numbers:
- SKILL.md: References "Gate 3" for spec folder question
- Commands: Reference "Gate 3"
- AGENTS.md: Defines spec folder as "Gate 5"

**Impact**: Users and agents get confused about which gate handles spec folder routing

**Solution**: Update all references to use Gate 5 consistently (matching AGENTS.md as source of truth)

**Files**:
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/command/spec_kit/*.md` (all command files)

**Effort**: 2 hours

**Dependencies**: None

---

### P1-002: Fix Step Count Mismatch

**Problem**: `complete.md` claims "13-step workflow" but actually contains 14 steps

**Impact**: Users may skip a step or get confused by the mismatch

**Solution**: Update documentation header to say "14-step workflow"

**Files**:
- `.opencode/command/spec_kit/complete.md`

**Effort**: 30 minutes

**Dependencies**: None

---

### P1-003: Align Level 1 Requirements

**Problem**: AGENTS.md and SKILL.md define different requirements for Level 1 spec folders

| Source | Level 1 Files |
|--------|---------------|
| AGENTS.md | spec.md, plan.md, tasks.md |
| SKILL.md | spec.md, plan.md (no tasks.md) |

**Impact**: Validation may fail or pass inconsistently depending on which source is followed

**Solution**: Standardize on AGENTS.md definition (spec.md, plan.md, tasks.md) and update SKILL.md

**Files**:
- `.opencode/skill/system-spec-kit/SKILL.md`
- Validation scripts if affected

**Effort**: 1 hour

**Dependencies**: None

---

### P1-004: Clean Deprecated Constitutional Files

**Problem**: Files in `z_archive/` marked as `importanceTier: deprecated` in YAML still show as constitutional tier in database

**Impact**: Deprecated memories appear in constitutional results, polluting context

**Solution**: 
1. Update indexing to honor YAML `importanceTier` field
2. Re-index archived files to update their tier
3. Or delete archived memories from database entirely

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js` (indexing logic)
- Database records for z_archive files

**Effort**: 1 hour

**Dependencies**: None

---

### P1-005: Fix LRU Cache Eviction

**Problem**: Cache claims to be LRU but actually evicts first-inserted item (FIFO behavior)

```javascript
// Current (FIFO - wrong)
if (cache.size >= maxSize) {
  const firstKey = cache.keys().next().value;
  cache.delete(firstKey);
}
```

**Impact**: Frequently accessed items may be evicted while rarely-used items persist

**Solution**: Track access time per entry, evict based on oldest access:
```javascript
// LRU implementation
cache.set(key, { value, accessTime: Date.now() });

function evictLRU() {
  let oldest = Infinity, oldestKey;
  for (const [k, v] of cache) {
    if (v.accessTime < oldest) {
      oldest = v.accessTime;
      oldestKey = k;
    }
  }
  cache.delete(oldestKey);
}
```

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js:2158-2164`

**Effort**: 2 hours

**Dependencies**: None

---

### P1-006: Add Content Hash Comparison

**Problem**: `memory_index_scan()` re-indexes all files even when content unchanged

**Impact**: Slow scans, wasted API calls for embeddings, unnecessary database writes

**Solution**: 
1. Store content hash in database when indexing
2. Before re-indexing, compare current hash to stored hash
3. Skip files with matching hashes

```javascript
const currentHash = crypto.createHash('sha256').update(content).digest('hex');
if (currentHash === storedHash) {
  console.log(`Skipping unchanged: ${filePath}`);
  continue;
}
```

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`

**Effort**: 2 hours

**Dependencies**: None

---

### P1-007: Invalidate Trigger Cache on Mutations

**Problem**: Trigger phrase cache persists stale data after memory mutations until TTL expires

**Impact**: Updated memories not found by trigger matching for up to TTL period

**Solution**: Call `clearCache()` after any memory mutation:
```javascript
// After memory_save, memory_update, memory_delete
triggerMatcher.clearCache();
```

**Files**:
- `.opencode/skill/system-spec-kit/mcp-server/src/trigger-matcher.js:150-153`
- Mutation handlers in context-server.js

**Effort**: 1 hour

**Dependencies**: None

---

### P1-008: Fix Validation False Positives

**Problem**: Validation script requires `implementation-summary.md` even for new/in-progress spec folders

**Impact**: Validation fails prematurely, blocking work on incomplete specs

**Solution**: Make `implementation-summary.md` optional for spec folders without completed checklist:
```bash
# Only require if checklist.md exists and has completed items
if grep -q "\[x\]" "$SPEC_FOLDER/checklist.md" 2>/dev/null; then
  check_file "implementation-summary.md"
fi
```

**Files**:
- `.opencode/skill/system-spec-kit/scripts/check-files.sh:29`

**Effort**: 1 hour

**Dependencies**: None

---

## P2 - Refinements

### P2-001: Add Missing Database Indexes

**Problem**: Queries on `file_path`, `content_hash`, and `last_accessed` are unindexed

**Solution**:
```sql
CREATE INDEX IF NOT EXISTS idx_memory_file_path ON memory_index(file_path);
CREATE INDEX IF NOT EXISTS idx_memory_content_hash ON memory_index(content_hash);
CREATE INDEX IF NOT EXISTS idx_memory_last_accessed ON memory_index(last_accessed);
```

**Effort**: 1 hour

---

### P2-002: Standardize Timestamp Formats

**Problem**: Mix of INTEGER (Unix epoch), TEXT (ISO), and REAL (Julian) timestamps

**Solution**: Migrate all columns to TEXT ISO format for consistency and human readability

**Effort**: 3 hours

---

### P2-003: Add Schema Version Tracking

**Problem**: No way to track which migrations have been applied

**Solution**: Create `schema_version` table with migration history:
```sql
CREATE TABLE schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now')),
  description TEXT
);
```

**Effort**: 2 hours

---

### P2-004: Improve Error Messages

**Problem**: Error messages lack context (line numbers, expected formats)

**Solution**: Enhance all error messages with:
- File path and line number where applicable
- Expected vs actual format
- Suggested fix

**Effort**: 4 hours

---

### P2-005: Add Health Check Endpoint

**Problem**: No way to verify system health without querying multiple tools

**Solution**: Create `memory_health` tool returning:
- Database size and record count
- Embedding model status
- Cache hit rates
- Last indexing timestamp
- Any detected issues

**Effort**: 2 hours

---

### P2-006: Document All Scripts

**Problem**: Scripts in `scripts/` folder lack documentation

**Solution**: Create `references/scripts_reference.md` documenting:
- Purpose of each script
- Required arguments
- Example usage
- Output format

**Effort**: 3 hours

---

### P2-007: Add --fix Flag to Validation

**Problem**: Validation only reports issues, doesn't fix them

**Solution**: Add `--fix` flag to auto-fix simple issues:
- Missing sections → add with placeholder
- Wrong frontmatter format → correct YAML
- Missing required files → create from template

**Effort**: 4 hours

---

### P2-008: Add Checkpoint Comparison

**Problem**: No way to see differences between two checkpoints

**Solution**: Implement `checkpoint_diff` tool:
```javascript
checkpoint_diff({ from: "checkpoint-a", to: "checkpoint-b" })
// Returns: { added: [...], removed: [...], modified: [...] }
```

**Effort**: 3 hours

---

### P2-009: Add Fuzzy Trigger Matching

**Problem**: Trigger matching is exact-only, missing near-matches

**Solution**: Implement Levenshtein distance for typo tolerance:
- Distance 1-2 for short phrases
- Distance 2-3 for longer phrases
- Configurable threshold

**Effort**: 4 hours

---

### P2-010: Add Pagination to Search

**Problem**: Large result sets returned all at once

**Solution**: Add `offset` parameter to `memory_search`:
```javascript
memory_search({ query: "...", limit: 10, offset: 20 })
```

**Effort**: 2 hours

---

## Implementation Order

### Dependency Graph

```
P0-002 ─┬─→ P0-001 (both affect query layer)
        │
P0-003 ─┴─→ P0-005 (both affect save flow)
        
P0-004 ─────→ P0-006 (startup must work before checkpoint)

P0-007 ─────→ (independent)

P1-001 ─┬─→ P1-003 (documentation alignment)
        │
P1-002 ─┘

P1-005 ─────→ P1-006 (cache improvements)

P1-007 ─────→ (independent)

P1-004 ─────→ P1-008 (validation improvements)
```

### Recommended Execution Order

**Phase 1: Data Integrity (Day 1)**
1. P0-002: Fix column name mismatch
2. P0-003: Add missing column
3. P0-004: Implement missing functions

**Phase 2: Core Functionality (Day 2)**
4. P0-001: Fix duplicate function
5. P0-007: Fix parameter passthrough
6. P0-005: Fix empty triggers

**Phase 3: Data Persistence (Day 3)**
7. P0-006: Include embeddings in checkpoints

**Phase 4: Documentation (Day 4)**
8. P1-001: Align gate numbering
9. P1-002: Fix step count
10. P1-003: Align level requirements

**Phase 5: Performance (Day 5)**
11. P1-005: Fix LRU cache
12. P1-006: Add content hash comparison
13. P1-007: Invalidate trigger cache

**Phase 6: Cleanup (Day 6)**
14. P1-004: Clean deprecated files
15. P1-008: Fix validation false positives

**Phase 7: Refinements (Backlog)**
16-25. P2 items as capacity allows

---

## Effort Summary Table

| ID | Title | Priority | Effort | Dependencies |
|----|-------|----------|--------|--------------|
| P0-001 | Fix Duplicate getConstitutionalMemories | P0 | 1h | None |
| P0-002 | Fix Column Name Mismatch | P0 | 30m | None |
| P0-003 | Add Missing related_memories Column | P0 | 1h | None |
| P0-004 | Implement Missing Functions | P0 | 2h | None |
| P0-005 | Fix Empty Trigger Phrases | P0 | 3h | None |
| P0-006 | Include Embeddings in Checkpoints | P0 | 4h | None |
| P0-007 | Fix includeContiguity Passthrough | P0 | 30m | None |
| P1-001 | Align Gate Numbering | P1 | 2h | None |
| P1-002 | Fix Step Count Mismatch | P1 | 30m | None |
| P1-003 | Align Level 1 Requirements | P1 | 1h | None |
| P1-004 | Clean Deprecated Constitutional Files | P1 | 1h | None |
| P1-005 | Fix LRU Cache Eviction | P1 | 2h | None |
| P1-006 | Add Content Hash Comparison | P1 | 2h | None |
| P1-007 | Invalidate Trigger Cache on Mutations | P1 | 1h | None |
| P1-008 | Fix Validation False Positives | P1 | 1h | None |
| P2-001 | Add Missing Database Indexes | P2 | 1h | None |
| P2-002 | Standardize Timestamp Formats | P2 | 3h | None |
| P2-003 | Add Schema Version Tracking | P2 | 2h | None |
| P2-004 | Improve Error Messages | P2 | 4h | None |
| P2-005 | Add Health Check Endpoint | P2 | 2h | None |
| P2-006 | Document All Scripts | P2 | 3h | None |
| P2-007 | Add --fix Flag to Validation | P2 | 4h | None |
| P2-008 | Add Checkpoint Comparison | P2 | 3h | None |
| P2-009 | Add Fuzzy Trigger Matching | P2 | 4h | None |
| P2-010 | Add Pagination to Search | P2 | 2h | None |

---

## Risk Assessment

### High Risk Items

| Item | Risk | Mitigation |
|------|------|------------|
| P0-003 | Schema migration could fail on existing DBs | Test on copy first, add rollback |
| P0-006 | Checkpoint format change breaks existing | Version checkpoints, support both formats |
| P1-005 | LRU change could introduce new bugs | Extensive testing, feature flag |

### Medium Risk Items

| Item | Risk | Mitigation |
|------|------|------------|
| P0-005 | Fallback triggers may be low quality | Manual review of generated triggers |
| P1-006 | Hash comparison adds complexity | Keep simple, well-tested |

### Low Risk Items

All documentation changes (P1-001, P1-002, P1-003) and most P2 items carry low risk as they don't affect core functionality.

---

## Success Metrics

After implementing all P0 items:
- [ ] No runtime errors on MCP server startup
- [ ] Constitutional memories cached (verify via debug logs)
- [ ] Trigger matching works for all indexed memories
- [ ] Checkpoints restore with full functionality
- [ ] All search parameters work as documented

After implementing all P1 items:
- [ ] Documentation consistent across all files
- [ ] Validation passes for valid spec folders
- [ ] Cache behavior is truly LRU
- [ ] Index scans skip unchanged files

---

*Document created: 2024-12-25*
*Last updated: 2024-12-25*
*Status: Ready for implementation*
