---
title: "Spec Kit [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/042-post-merge-refinement-5/decision-record]"
description: "Architecture Decision Record (ADR) documenting significant technical decisions for the post-merge refinement phase."
trigger_phrases:
  - "spec"
  - "kit"
  - "memory"
  - "system"
  - "architecture"
  - "decision record"
  - "042"
  - "post"
importance_tier: "important"
contextType: "planning"
---
# Spec Kit Memory System - Architecture Decision Record

Architecture Decision Record (ADR) documenting significant technical decisions for the post-merge refinement phase.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-042
- **Status**: Accepted
- **Date**: 2025-12-25
- **Deciders**: Development Team
- **Related Feature**: [Analysis Report](./analysis.md), [Recommendations](./recommendations.md)
- **Supersedes**: N/A
- **Superseded By**: N/A

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement

The Spec Kit Memory System analysis (042-post-merge-refinement-5) identified 34 critical bugs and 45+ potential issues across 10 components. This ADR documents the key architectural decisions made to address these issues, focusing on the 8 most significant decisions that affect system behavior and data integrity.

### Current Situation

- **Overall System Health**: 7.05/10 (Fair - Requires Attention)
- **P0 (Blocker) Issues**: 7
- **P1 (High) Issues**: 15
- Components with lowest scores: Checkpoint System (6/10), Memory File Format (6/10)
- Critical bugs include duplicate function definitions, missing database columns, and embedding loss during checkpoint restore

### Constraints

- Must maintain backward compatibility with existing checkpoint files
- Cannot break existing MCP tool interfaces
- Database migrations must be non-destructive
- Changes must work with SQLite's limitations (no concurrent writes)

### Assumptions

- Existing databases may have schema mismatches that need migration
- Users expect checkpoint restore to be complete and immediate
- Generated content will continue to have poor-quality text for trigger extraction
- Gate 5 numbering in AGENTS.md is authoritative

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISIONS

This ADR consolidates 8 related decisions addressing the identified critical issues.

---

### DR-001: Remove Duplicate Function Definition

#### Summary

Remove the duplicate `getConstitutionalMemories` function at line 1111 and export only the cached version from line 209.

#### Context

The `getConstitutionalMemories` function is defined twice in vector-index.js:
- **Line 209**: Cached version with `(database, specFolder)` signature
- **Line 1111**: Uncached version with `(options)` signature

The second definition shadows the first, breaking the caching mechanism and causing repeated database queries.

#### Technical Approach

```javascript
// BEFORE: Two definitions
// Line 209 (cached)
const getConstitutionalMemories = memoize((database, specFolder) => {...});

// Line 1111 (uncached - shadows above)
function getConstitutionalMemories(options) {...}

// AFTER: Single cached version
const getConstitutionalMemories = memoize((database, specFolder) => {...});
// Line 1111 removed entirely
```

#### Rationale

- The cached version provides better performance
- The duplicate shadows the cached version, breaking caching
- Single source of truth reduces maintenance burden

#### Alternatives Considered

| Option | Score | Reason |
|--------|-------|--------|
| **Remove duplicate (chosen)** | 9/10 | Simplest, preserves caching |
| Merge both implementations | 6/10 | Would require refactoring callers |
| Keep both with different names | 4/10 | Adds confusion, maintenance burden |
| Remove caching entirely | 3/10 | Performance regression |

---

### DR-002: Include Embeddings in Checkpoint Snapshots

#### Summary

Modify checkpoint creation to include `vec_memories` table data alongside `memory_index` data.

#### Context

Current checkpoints serialize `memory_index` but not `vec_memories` (embeddings). Restored memories have no embeddings, causing semantic search to return 0 results until `memory_index_scan()` runs.

#### Technical Approach

```javascript
// In checkpoint_create
const memoryData = db.prepare('SELECT * FROM memory_index').all();
const vectorData = db.prepare('SELECT * FROM vec_memories').all();

checkpoint.data = {
  version: 2,  // Bump version for new format
  memories: memoryData,
  embeddings: vectorData
};

// In checkpoint_restore
if (checkpoint.data.version >= 2 && checkpoint.data.embeddings) {
  for (const vec of checkpoint.data.embeddings) {
    db.prepare('INSERT INTO vec_memories ...').run(vec);
  }
}
```

#### Rationale

- Embeddings are expensive to regenerate (API calls, compute time)
- Users expect checkpoint restore to be complete
- Semantic search should work immediately after restore

#### Alternatives Considered

| Option | Score | Reason |
|--------|-------|--------|
| **Include in snapshot (chosen)** | 9/10 | Complete restore, best UX |
| Keep current, document limitation | 4/10 | Poor UX |
| Auto-run memory_index_scan after restore | 5/10 | Slow, requires model |
| Store embeddings separately | 6/10 | Complex, two-file checkpoints |

#### Consequences

- Checkpoint files will be larger (~3KB per embedding)
- Restore is complete and immediate
- Need to handle embedding dimension changes between versions

---

### DR-003: Cascading Trigger Phrase Fallback

#### Summary

Implement a cascading fallback strategy for trigger phrase extraction when primary extraction fails.

#### Context

Trigger phrase extraction fails on generated content (like context files), producing empty arrays. This breaks proactive memory surfacing via `memory_match_triggers()`.

#### Technical Approach

```javascript
function extractTriggers(content, filePath, specFolder) {
  // Primary: Extract from content
  let triggers = extractFromContent(content);
  
  // Fallback 1: Extract from section headers
  if (triggers.length === 0) {
    triggers = extractFromHeaders(content);
  }
  
  // Fallback 2: Extract from file path
  if (triggers.length === 0) {
    triggers = extractFromPath(filePath);
  }
  
  // Fallback 3: Extract from spec folder name
  if (triggers.length === 0) {
    triggers = extractFromSpecFolder(specFolder);
  }
  
  return triggers.slice(0, 10); // Max 10 triggers
}
```

#### Rationale

- Generated content often has poor quality text for extraction
- Headers and paths contain meaningful keywords
- Spec folder names are intentionally descriptive
- Guarantees all memories have some trigger phrases

#### Alternatives Considered

| Option | Score | Reason |
|--------|-------|--------|
| **Cascading fallback (chosen)** | 9/10 | Guarantees coverage |
| Require manual trigger phrases | 4/10 | Burden on users |
| Use LLM to generate triggers | 6/10 | Expensive, slow |
| Skip indexing low-quality content | 3/10 | Loses context |

---

### DR-004: Standardize Gate Numbering

#### Summary

Standardize all documentation to use Gate 5 for spec folder question, matching AGENTS.md as the authoritative source.

#### Context

SKILL.md references "Gate 3" for spec folder question, but AGENTS.md defines it as "Gate 5". Commands have mixed references causing agent confusion.

#### Technical Approach

Update all references in:
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/command/spec_kit/*.md` (all command files)

```markdown
<!-- BEFORE -->
Gate 3: Determine spec folder for tracking

<!-- AFTER -->
Gate 5: Determine spec folder for tracking
```

#### Rationale

- AGENTS.md is the authoritative source for gate definitions
- Consistency reduces confusion for both users and agents
- Gate 5 is already documented in the main workflow

#### Alternatives Considered

| Option | Score | Reason |
|--------|-------|--------|
| **Use AGENTS.md numbering (chosen)** | 9/10 | Single source of truth |
| Renumber AGENTS.md gates | 3/10 | Would break existing knowledge |
| Use gate names instead of numbers | 5/10 | More verbose |
| Keep inconsistency, add mapping | 4/10 | Confusing |

---

### DR-005: Proper LRU Cache Implementation

#### Summary

Replace current FIFO cache eviction with proper LRU (Least Recently Used) that tracks access time per entry.

#### Context

Current cache claims to be LRU but evicts first-inserted entries (FIFO behavior). This may evict frequently accessed items while rarely-used items persist.

#### Technical Approach

```javascript
// BEFORE (FIFO - incorrect)
if (cache.size >= maxSize) {
  const firstKey = cache.keys().next().value;
  cache.delete(firstKey);
}

// AFTER (LRU - correct)
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (entry) {
      entry.accessTime = Date.now();
      return entry.value;
    }
    return undefined;
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    this.cache.set(key, { value, accessTime: Date.now() });
  }
  
  evictLRU() {
    let oldest = Infinity, oldestKey;
    for (const [k, v] of this.cache) {
      if (v.accessTime < oldest) {
        oldest = v.accessTime;
        oldestKey = k;
      }
    }
    this.cache.delete(oldestKey);
  }
}
```

#### Rationale

- LRU is the expected behavior for this cache type
- Frequently accessed entries should be preserved
- Current behavior may evict hot entries causing performance issues

#### Alternatives Considered

| Option | Score | Reason |
|--------|-------|--------|
| **Proper LRU (chosen)** | 9/10 | Correct behavior |
| Use Map with manual ordering | 5/10 | Current broken approach |
| Use third-party LRU library | 7/10 | Adds dependency |
| Switch to TTL-only cache | 6/10 | Loses LRU benefits |

---

### DR-006: Content Hash Comparison for Indexing

#### Summary

Compare content hash before re-indexing files; skip unchanged files unless `force=true`.

#### Context

`memory_index_scan()` re-indexes all files even when content is unchanged, wasting embedding API calls and causing unnecessary database writes.

#### Technical Approach

```javascript
const crypto = require('crypto');

async function indexFile(filePath, content, force = false) {
  const currentHash = crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
  
  const stored = db.prepare(
    'SELECT content_hash FROM memory_index WHERE file_path = ?'
  ).get(filePath);
  
  if (!force && stored?.content_hash === currentHash) {
    console.log(`Skipping unchanged: ${filePath}`);
    return { skipped: true };
  }
  
  // Proceed with indexing...
  const embedding = await generateEmbedding(content);
  // Store with new hash...
}
```

#### Rationale

- Embeddings are expensive to generate (API calls, compute time)
- Most files don't change between scans
- `force=true` provides escape hatch when needed

#### Alternatives Considered

| Option | Score | Reason |
|--------|-------|--------|
| **Content hash comparison (chosen)** | 9/10 | Efficient, reliable |
| Use file modification time | 6/10 | Less reliable than hash |
| Always re-index | 3/10 | Current wasteful behavior |
| Manual re-index only | 5/10 | Loses auto-discovery |

---

### DR-007: Flexible Validation for New Spec Folders

#### Summary

Make `implementation-summary.md` optional for new/in-progress spec folders, detected by absence of completed checklist items.

#### Context

Validation requires `implementation-summary.md` for all levels, but this file is created after implementation. This causes false positives on new specs.

#### Technical Approach

```bash
# In check-files.sh
validate_implementation_summary() {
  local spec_folder="$1"
  
  # Only require if checklist.md exists and has completed items
  if [ -f "$spec_folder/checklist.md" ]; then
    if grep -q "\[x\]" "$spec_folder/checklist.md" 2>/dev/null; then
      check_required_file "$spec_folder/implementation-summary.md"
    else
      echo "INFO: implementation-summary.md not required (no completed items)"
    fi
  fi
}
```

#### Rationale

- New specs shouldn't fail validation prematurely
- Completed specs should still require the file for QA
- Heuristic detection (completed checklist items) is reliable

#### Alternatives Considered

| Option | Score | Reason |
|--------|-------|--------|
| **Flexible validation (chosen)** | 9/10 | Smart detection |
| Remove requirement entirely | 4/10 | Loses QA value |
| Add explicit "new" flag | 6/10 | Burden on users |
| Require placeholder file | 5/10 | Adds noise |

---

### DR-008: Database Index Strategy

#### Summary

Add indexes for frequently queried columns: `file_path`, `content_hash`, `last_accessed`.

#### Context

Several columns lack indexes, causing slow queries on large datasets with full table scans.

#### Technical Approach

```sql
-- Add during schema initialization or migration
CREATE INDEX IF NOT EXISTS idx_memory_file_path 
  ON memory_index(file_path);

CREATE INDEX IF NOT EXISTS idx_memory_content_hash 
  ON memory_index(content_hash);

CREATE INDEX IF NOT EXISTS idx_memory_last_accessed 
  ON memory_index(last_accessed);

CREATE INDEX IF NOT EXISTS idx_memory_spec_folder 
  ON memory_index(spec_folder);
```

#### Rationale

- These columns are frequently queried in file lookups, deduplication, and LRU eviction
- Indexes improve query performance significantly (O(log n) vs O(n))
- Storage overhead is minimal for these column types

#### Alternatives Considered

| Option | Score | Reason |
|--------|-------|--------|
| **Single-column indexes (chosen)** | 9/10 | Simple, flexible |
| Composite indexes | 6/10 | More complex, less flexible |
| No indexes, optimize queries | 4/10 | Limited improvement |
| Partial indexes | 5/10 | SQLite support limited |

<!-- /ANCHOR:decision -->
---

## 4. SUMMARY TABLE

| ID | Decision | Status | Impact | Effort |
|----|----------|--------|--------|--------|
| DR-001 | Remove duplicate function | Approved | High | 1h |
| DR-002 | Include embeddings in checkpoints | Approved | High | 4h |
| DR-003 | Cascading trigger fallback | Approved | High | 3h |
| DR-004 | Standardize gate numbering | Approved | Medium | 2h |
| DR-005 | Proper LRU implementation | Approved | Medium | 2h |
| DR-006 | Content hash comparison | Approved | Medium | 2h |
| DR-007 | Flexible validation | Approved | Low | 1h |
| DR-008 | Database indexes | Approved | Low | 1h |

---

<!-- ANCHOR:consequences -->
## 5. CONSEQUENCES

### Positive Consequences

- Constitutional memory caching works correctly (DR-001)
- Checkpoint restore is complete and immediate (DR-002)
- All memory files have trigger phrases for proactive surfacing (DR-003)
- Documentation is consistent across all sources (DR-004)
- Cache eviction behaves as expected (DR-005)
- Index scans are faster and use fewer API calls (DR-006)
- New specs can be validated without false positives (DR-007)
- Query performance improves significantly (DR-008)

### Negative Consequences

| Decision | Negative Consequence | Mitigation |
|----------|---------------------|------------|
| DR-001 | Callers using `(options)` signature need updating | Search and update all call sites |
| DR-002 | Checkpoint files will be larger | Acceptable trade-off for completeness |
| DR-003 | Trigger quality may vary (path-based less semantic) | Primary extraction still preferred |
| DR-004 | Users familiar with "Gate 3" need relearning | Clear documentation update |
| DR-005 | Slightly more memory per cache entry | Negligible overhead |
| DR-006 | Need to handle hash storage | Add column if missing |
| DR-007 | Heuristic may have edge cases | Default to lenient behavior |
| DR-008 | Slightly slower inserts (index maintenance) | Acceptable for read performance |

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Schema migration fails on existing DBs | High | Low | Test on copy first, add rollback |
| Checkpoint format change breaks existing | High | Low | Version checkpoints, support both |
| LRU change introduces new bugs | Medium | Low | Extensive testing, feature flag |
| Fallback triggers low quality | Low | Medium | Manual review of generated triggers |

<!-- /ANCHOR:consequences -->
---

## 6. IMPLEMENTATION NOTES

### Parallel Work Opportunities

- [P] DR-001: Remove duplicate function
- [P] DR-004: Standardize gate numbering
- [P] DR-008: Add database indexes
- DR-002: Include embeddings (depends on schema stability)
- DR-003: Cascading fallback (depends on indexing path)
- DR-005: LRU implementation (independent but risky)
- DR-006: Content hash comparison (depends on schema)
- DR-007: Flexible validation (independent)

### Recommended Execution Order

1. **Phase 1 - Data Integrity**: DR-001, DR-008
2. **Phase 2 - Core Functionality**: DR-003, DR-005, DR-006
3. **Phase 3 - Data Persistence**: DR-002
4. **Phase 4 - Documentation**: DR-004
5. **Phase 5 - Validation**: DR-007

---

## 7. IMPACT ASSESSMENT

### Systems Affected

| System | Impact | Changes Required |
|--------|--------|------------------|
| MCP Server | High | Function consolidation, checkpoint changes |
| Database | Medium | New indexes, potential schema migration |
| Validation Scripts | Low | Flexible file requirements |
| Documentation | Medium | Gate numbering updates |

### Migration Path

1. Add database indexes (non-breaking)
2. Add content_hash column if missing
3. Update function exports
4. Update checkpoint format with version flag
5. Update documentation
6. Update validation scripts

### Rollback Strategy

- **DR-001**: Re-add function (simple)
- **DR-002**: Checkpoints versioned; old format still works
- **DR-003**: Disable fallback chain, return empty arrays
- **DR-004**: Revert documentation changes
- **DR-005**: Feature flag to restore FIFO behavior
- **DR-006**: Set `force=true` as default
- **DR-007**: Restore strict validation
- **DR-008**: Drop indexes if performance issues

---

## 8. TIMELINE

- **Decision Made**: 2025-12-25
- **Implementation Start**: TBD
- **Target Completion**: TBD
- **Review Date**: 2026-01-25 (30-day review)

---

## 9. REFERENCES

### Related Documents

- **Analysis Report**: [./analysis.md](./analysis.md)
- **Recommendations**: [./recommendations.md](./recommendations.md)
- **Parent Spec Folder**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/042-post-merge-refinement-5`

### External References

- SQLite FTS5 Documentation: https://sqlite.org/fts5.html
- LRU Cache Patterns: Standard algorithm reference
- YAML Frontmatter Spec: Jekyll/Hugo conventions

---

## 10. APPROVAL & SIGN-OFF

### Status Changes

| Date | Previous Status | New Status | Reason |
|------|----------------|------------|--------|
| 2025-12-25 | - | Proposed | Initial analysis complete |
| 2025-12-25 | Proposed | Accepted | Decisions approved for implementation |

---

## 11. UPDATES & AMENDMENTS

### Amendment History

| Date | Change | Reason | Updated By |
|------|--------|--------|------------|
| 2025-12-25 | Initial creation | Document 8 key decisions | Development Team |

---

**Review Schedule**: This decision record should be reviewed on 2026-01-25 to assess implementation progress and validate decisions still meet system needs.
