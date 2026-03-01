---
title: "Decision Record: Post-Release Refinement 1 [046-post-release-refinement-1/decision-record]"
description: "Checkpoint restore can insert duplicate memory entries. The UNIQUE constraint on (spec_folder, file_path, anchor_id) should prevent this, but duplicates occur when values differ..."
trigger_phrases:
  - "decision"
  - "record"
  - "post"
  - "release"
  - "refinement"
  - "decision record"
  - "046"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Post-Release Refinement 1

<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit/templates/decision-record.md -->

| Metadata | Value |
|----------|-------|
| **Level** | 3 |
| **Status** | Draft |
| **Created** | 2025-12-26 |
| **Decisions** | 8 |

---

## DECISION LOG

| ID | Title | Status | Date |
|----|-------|--------|------|
| DR-001 | Checkpoint Deduplication Strategy | Proposed | 2025-12-26 |
| DR-002 | Missing Validation Scripts Approach | Proposed | 2025-12-26 |
| DR-003 | Timestamp Format Standardization | Proposed | 2025-12-26 |
| DR-004 | Path Configuration Strategy | Proposed | 2025-12-26 |
| DR-005 | Transaction Wrapping Patterns | Proposed | 2025-12-26 |
| DR-006 | Gate Numbering Alignment | Proposed | 2025-12-26 |
| DR-007 | INTENT_BOOSTERS Hyphen Handling | Proposed | 2025-12-26 |
| DR-008 | LRU Cache Implementation | Proposed | 2025-12-26 |

---

## DR-001: Checkpoint Deduplication Strategy

### Context
Checkpoint restore can insert duplicate memory entries. The UNIQUE constraint on `(spec_folder, file_path, anchor_id)` should prevent this, but duplicates occur when values differ slightly (e.g., trailing slashes, different anchor_ids for same content).

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | INSERT OR REPLACE | Simple, atomic | May lose metadata (triggers, importance) |
| **B** | Check existence, then UPDATE or INSERT | Preserves metadata | Two queries, more complex |
| **C** | Delete all entries for file before insert | Clean slate | Loses history tracking |
| **D** | Normalize paths before comparison | Prevents most duplicates | Doesn't handle anchor_id variants |

### Decision
**Option B: Check existence, then UPDATE or INSERT**

### Rationale
- Preserves existing metadata (trigger phrases, importance tier, confidence scores)
- Maintains history tracking
- More explicit about what's happening
- Allows logging of "updated vs inserted" statistics

### Implementation
```javascript
// In restoreCheckpoint(), for each memory:
const existing = db.prepare(`
  SELECT id FROM memory_index 
  WHERE file_path = ? AND spec_folder = ?
`).pluck().get(memory.file_path, memory.spec_folder);

if (existing) {
  // Update existing entry, preserve trigger_phrases and importance
  db.prepare(`
    UPDATE memory_index SET
      title = ?,
      content_hash = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(memory.title, memory.content_hash, existing);
  stats.updated++;
} else {
  // Insert new entry
  db.prepare(`INSERT INTO memory_index ...`).run(...);
  stats.inserted++;
}
```

### Consequences
- Checkpoint restore is slightly slower (extra query per entry)
- Better data integrity
- Statistics available for restore operations

---

## DR-002: Missing Validation Scripts Approach

### Context
`system-spec-kit/SKILL.md` documents two validation scripts that don't exist:
- `validate-spec-folder.js`
- `validate-memory-file.js`

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Remove references from SKILL.md | Quick fix | Loses documented capability |
| **B** | Create stub implementations | Documents intent | Minimal functionality |
| **C** | Create full implementations | Complete solution | More effort (4-6h) |
| **D** | Defer to existing shell scripts | Reuse existing code | JavaScript/shell mismatch |

### Decision
**Option B: Create stub implementations (with Option C as future enhancement)**

### Rationale
- Documents the expected interface
- Allows other code to import without errors
- Provides foundation for full implementation
- Matches documentation immediately

### Implementation
```javascript
// validate-spec-folder.js
const fs = require('fs');
const path = require('path');

const LEVEL_REQUIREMENTS = {
  1: ['spec.md', 'plan.md', 'tasks.md'],
  2: ['spec.md', 'plan.md', 'tasks.md', 'checklist.md'],
  3: ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md']
};

function validateSpecFolder(folderPath, options = {}) {
  const issues = [];
  const level = options.level || detectLevel(folderPath);
  const required = LEVEL_REQUIREMENTS[level] || LEVEL_REQUIREMENTS[1];
  
  for (const file of required) {
    if (!fs.existsSync(path.join(folderPath, file))) {
      issues.push({
        severity: 'error',
        file,
        message: `Missing required file: ${file}`
      });
    }
  }
  
  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    level,
    issues
  };
}

function detectLevel(folderPath) {
  if (fs.existsSync(path.join(folderPath, 'decision-record.md'))) return 3;
  if (fs.existsSync(path.join(folderPath, 'checklist.md'))) return 2;
  return 1;
}

module.exports = { validateSpecFolder, detectLevel };
```

### Consequences
- Scripts exist immediately
- Basic validation available
- Full implementation can be added incrementally

---

## DR-003: Timestamp Format Standardization

### Context
The `last_accessed` column in `memory_index` has inconsistent handling:
- Column type: INTEGER (documented)
- Code writes: ISO strings (actual)
- Duplicate column exists: `last_accessed_at` (TEXT)

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Use INTEGER Unix timestamps | Efficient sorting/comparison | Less human-readable |
| **B** | Use TEXT ISO strings | Human-readable, consistent with created_at | Slightly larger storage |
| **C** | Keep both columns | Backward compatible | Confusing, wastes space |
| **D** | Migrate to single TEXT column | Clean solution | Breaking change |

### Decision
**Option B: Use TEXT ISO strings consistently**

### Rationale
- Consistent with `created_at` and `updated_at` columns
- Human-readable in database queries
- ISO strings sort lexicographically correctly
- SQLite handles TEXT efficiently

### Implementation
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

// Deprecate last_accessed (INTEGER), use last_accessed_at (TEXT)
// Future migration: DROP COLUMN last_accessed
```

### Migration Plan
1. Ensure all code uses `last_accessed_at` (TEXT)
2. Stop writing to `last_accessed` (INTEGER)
3. (Future) Add migration to drop `last_accessed` column

### Consequences
- Consistent timestamp format across all columns
- Existing `last_accessed` data becomes stale (acceptable)
- Future migration needed to clean up schema

---

## DR-004: Path Configuration Strategy

### Context
`.utcp_config.json` contains hardcoded absolute paths:
- `/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp/...`
- `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com`

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Environment variables | Flexible, standard | Requires env setup |
| **B** | Relative paths | Portable | May break if working dir changes |
| **C** | Project-root relative | Self-contained | Limited to project scope |
| **D** | Config override file | User-specific | Multiple config files |

### Decision
**Option A: Environment variables with sensible defaults**

### Rationale
- Standard approach for sensitive/machine-specific configuration
- Works with existing environment setup patterns
- Allows per-user customization without modifying tracked files
- Supports CI/CD scenarios

### Implementation
```json
// .utcp_config.json
{
  "manual_templates": {
    "narsil": {
      "command": "${NARSIL_BINARY:-narsil-mcp}",
      "args": [
        "--workspace",
        "${WORKSPACE_ROOT:-.}"
      ]
    }
  }
}
```

### Environment Variables
| Variable | Purpose | Default |
|----------|---------|---------|
| `NARSIL_BINARY` | Path to Narsil MCP binary | `narsil-mcp` (assumes in PATH) |
| `WORKSPACE_ROOT` | Project root directory | `.` (current directory) |

### Documentation Update
Add to README or install guide:
```bash
# Add to ~/.zshrc or ~/.bashrc
export NARSIL_BINARY="/path/to/narsil-mcp"
export WORKSPACE_ROOT="/path/to/project"
```

### Consequences
- Configuration is portable
- Users must set environment variables (or accept defaults)
- Documentation must be updated

---

## DR-005: Transaction Wrapping Patterns

### Context
Several operations perform read-modify-write without transaction protection:
- `recordValidation()` - confidence calculation
- `deleteMemory()` - multi-table cleanup
- `handleMemoryUpdate()` - metadata + embedding update

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Wrap each operation individually | Targeted fix | Inconsistent patterns |
| **B** | Create transaction utility wrapper | Reusable, consistent | Additional abstraction |
| **C** | Use better-sqlite3 transaction method | Built-in, optimized | Sync-only (not async) |

### Decision
**Option C: Use better-sqlite3 transaction method**

### Rationale
- better-sqlite3's `transaction()` method is optimized and handles rollback automatically
- Synchronous operations are fine for SQLite (in-process)
- Simple, no additional abstraction needed
- Transaction is automatically committed or rolled back

### Implementation Pattern
```javascript
// Standard pattern for multi-step operations
const result = db.transaction(() => {
  // Step 1: Read
  const existing = db.prepare('SELECT ...').get(id);
  if (!existing) throw new Error('Not found');
  
  // Step 2: Modify
  const newValue = calculateNewValue(existing);
  
  // Step 3: Write
  db.prepare('UPDATE ...').run(newValue, id);
  
  return { success: true, newValue };
})();

// Transaction auto-commits on success, auto-rollbacks on throw
```

### Where to Apply
| Location | Operation |
|----------|-----------|
| `confidence-tracker.js:recordValidation` | Read confidence → calculate → update |
| `vector-index.js:deleteMemory` | Delete history → delete vector → delete memory |
| `context-server.js:handleMemoryUpdate` | Update metadata → regenerate embedding |
| `checkpoints.js:restoreCheckpoint` | Clear existing → insert new |

### Consequences
- All multi-step operations are atomic
- Consistent error handling
- Slight performance overhead (negligible for SQLite)

---

## DR-006: Gate Numbering Alignment

### Context
`system-spec-kit/SKILL.md` uses Gate 4, 5, 6 while `AGENTS.md` uses Gate 1, 2, 3. This causes confusion about which gates exist and their enforcement order.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Update SKILL.md to match AGENTS.md | AGENTS.md is source of truth | Changes documentation |
| **B** | Update AGENTS.md to match SKILL.md | Keeps SKILL.md stable | AGENTS.md is main entry point |
| **C** | Create mapping between numbering schemes | Preserves both | Confusing, extra complexity |
| **D** | Rename to descriptive names (not numbers) | Self-documenting | Breaking change, more work |

### Decision
**Option A: Update SKILL.md to match AGENTS.md**

### Rationale
- AGENTS.md is the primary documentation developers read
- AGENTS.md gate numbering is already established and in use
- Fewer files to update (SKILL.md only)
- Clear source of truth

### Mapping
| SKILL.md (Old) | AGENTS.md (New) | Purpose |
|----------------|-----------------|---------|
| Gate 4 | Gate 3 | Spec Folder Question |
| Gate 5 | (remove) | Memory Context Loading (part of Gate 3 flow) |
| Gate 6 | (remove) | Completion Verification (post-execution rule) |

### Implementation
Search and replace in `system-spec-kit/SKILL.md`:
1. `Gate 4` → `Gate 3`
2. References to Gate 5, 6 → Update context to match AGENTS.md terminology

### Consequences
- Consistent gate numbering across all documentation
- AGENTS.md remains authoritative
- May need to update any external references

---

## DR-007: INTENT_BOOSTERS Hyphen Handling

### Context
`skill_advisor.py` has INTENT_BOOSTERS entries like `"dead-code"` and `"call-graph"` that are unreachable because tokenization splits on hyphens:
- `"dead-code"` becomes `["dead", "code"]`
- `"call-graph"` becomes `["call", "graph"]`

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Add non-hyphenated variants | Simple, no regex change | Duplicate entries |
| **B** | Modify tokenization to preserve hyphens | Matches compound terms | May affect other matching |
| **C** | Use multi-word boost matching | Matches sequences | More complex logic |
| **D** | Remove unreachable entries | Clean up | Loses documentation of intent |

### Decision
**Option A: Add non-hyphenated variants**

### Rationale
- Simplest implementation
- Doesn't change tokenization behavior (which works well elsewhere)
- Explicit about what matches
- Handles both `dead-code` and `deadcode` queries

### Implementation
```python
# Add to INTENT_BOOSTERS (keep hyphenated for documentation)
"dead-code": ("mcp-narsil", 0.8),    # unreachable but documents intent
"deadcode": ("mcp-narsil", 0.8),     # actually reachable
"call-graph": ("mcp-narsil", 0.8),   # unreachable but documents intent
"callgraph": ("mcp-narsil", 0.8),    # actually reachable

# Also add individual words for partial matches
"dead": ("mcp-narsil", 0.4),
"graph": ("mcp-narsil", 0.3),
```

### Consequences
- More entries in INTENT_BOOSTERS
- Both `deadcode` and `dead code` queries work
- Hyphenated entries serve as documentation

---

## DR-008: LRU Cache Implementation

### Context
Current LRU cache in `vector-index.js` uses O(n) eviction by iterating all entries to find the oldest. With 500 entry limit, this adds latency.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Keep current implementation | No changes | O(n) eviction persists |
| **B** | Use Map with doubly-linked list | O(1) eviction | More complex code |
| **C** | Use external LRU library | Battle-tested | Additional dependency |
| **D** | Reduce cache size | Fewer entries to scan | Less caching benefit |

### Decision
**Option B: Use Map with doubly-linked list**

### Rationale
- O(1) eviction and access
- No external dependencies
- Well-understood algorithm
- Cache size can grow without performance concern

### Implementation
```javascript
class LRUCache {
  constructor(maxSize, ttlMs) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
    this.head = { prev: null, next: null }; // Sentinel head
    this.tail = { prev: this.head, next: null }; // Sentinel tail
    this.head.next = this.tail;
  }

  get(key) {
    const node = this.cache.get(key);
    if (!node) return null;
    
    // Check TTL
    if (Date.now() - node.timestamp > this.ttlMs) {
      this._remove(node);
      this.cache.delete(key);
      return null;
    }
    
    // Move to front (most recently used)
    this._moveToFront(node);
    return node.value;
  }

  set(key, value) {
    let node = this.cache.get(key);
    
    if (node) {
      // Update existing
      node.value = value;
      node.timestamp = Date.now();
      this._moveToFront(node);
    } else {
      // Add new
      node = { key, value, timestamp: Date.now(), prev: null, next: null };
      this._addToFront(node);
      this.cache.set(key, node);
      
      // Evict if over capacity
      if (this.cache.size > this.maxSize) {
        const oldest = this.tail.prev;
        this._remove(oldest);
        this.cache.delete(oldest.key);
      }
    }
  }

  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _moveToFront(node) {
    this._remove(node);
    this._addToFront(node);
  }

  clear() {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
}
```

### Consequences
- Cache operations are O(1)
- Slightly more memory per entry (prev/next pointers)
- More complex code to maintain
- Better scalability for larger caches

---

## APPENDIX: Decision Status Definitions

| Status | Definition |
|--------|------------|
| **Proposed** | Under consideration, not yet approved |
| **Approved** | Accepted for implementation |
| **Implemented** | Code changes complete |
| **Superseded** | Replaced by newer decision |
| **Rejected** | Not proceeding with this option |
