---
title: "Implementation Plan: Remaining Bugs Remediation [054-remaining-bugs-remediation/plan]"
description: "The implementation follows a 4-phase approach organized by severity and dependency"
trigger_phrases:
  - "implementation"
  - "plan"
  - "remaining"
  - "bugs"
  - "remediation"
  - "054"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Remaining Bugs Remediation

| Field | Value |
|-------|-------|
| **Spec ID** | 054-remaining-bugs-remediation |
| **Estimated LOC** | ~600 |
| **Estimated Duration** | 4-6 hours |
| **Risk Level** | Medium |

---

## 1. Implementation Strategy

### 1.1 Phased Approach

The implementation follows a **4-phase approach** organized by severity and dependency:

```
Phase 1: Critical (P0)     → Transaction safety, connection coordination
    ↓
Phase 2: Major (P1)        → Startup timing, caching, validation
    ↓
Phase 3: Minor (P2)        → Edge cases, configurability
    ↓
Phase 4: Verification      → Integration testing, regression checks
```

### 1.2 Work Streams

| Stream | Files | Bugs |
|--------|-------|------|
| **WS-1: Database Layer** | vector-index.js, checkpoints.js | BUG-001, BUG-002, BUG-006 |
| **WS-2: Server Layer** | context-server.js | BUG-005, BUG-007 |
| **WS-3: Embedding Layer** | vector-index.js | BUG-003, BUG-004 |
| **WS-4: Parser Layer** | memory-parser.js | BUG-008 |
| **WS-5: Scripts Layer** | generate-context.js | BUG-011 |
| **WS-6: Configuration** | vector-index.js, configs/ | BUG-009, BUG-010, BUG-012, BUG-013 |

---

## 2. Phase 1: Critical Fixes (P0)

**Duration**: 1-2 hours
**Risk**: High - Core database operations

### 2.1 BUG-001: Race Condition Fix

**Approach**: Implement database change notification mechanism

```javascript
// Option A: File-based notification (simpler)
// After write in generate-context.js:
fs.writeFileSync('.opencode/skill/system-spec-kit/database/.db-updated', Date.now().toString());

// In context-server.js, check on each request:
const dbUpdatedFile = path.join(dbDir, '.db-updated');
if (fs.existsSync(dbUpdatedFile)) {
  const updateTime = parseInt(fs.readFileSync(dbUpdatedFile, 'utf8'));
  if (updateTime > lastDbCheck) {
    await reinitializeConnection();
    lastDbCheck = updateTime;
  }
}

// Option B: SQLite WAL mode (more robust)
// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');
```

**Decision**: Use Option A (file-based) for simplicity, document Option B for future consideration.

### 2.2 BUG-002: Transaction Rollback Fix

**Approach**: Add explicit rollback and cleanup on failure

```javascript
// In vector-index.js indexMemory():
async function indexMemory(filePath, content, metadata) {
  const db = getDatabase();
  
  try {
    db.exec('BEGIN TRANSACTION');
    
    // Insert metadata
    const metadataId = insertMetadata(db, metadata);
    
    // Generate and insert vector
    const embedding = await generateEmbedding(content);
    insertVector(db, metadataId, embedding);
    
    db.exec('COMMIT');
    return metadataId;
  } catch (error) {
    db.exec('ROLLBACK');
    // Clean up any partial state
    if (metadataId) {
      deleteMetadata(db, metadataId);
    }
    throw error;
  }
}
```

---

## 3. Phase 2: Major Fixes (P1)

**Duration**: 2-3 hours
**Risk**: Medium - Timing and caching logic

### 3.1 BUG-003: Dimension Mismatch Fix

**Approach**: Delay schema creation until provider is confirmed

```javascript
// In vector-index.js:
let schemaInitialized = false;

async function ensureSchema() {
  if (schemaInitialized) return;
  
  // Wait for provider warmup (max 5 seconds)
  const dimension = await getConfirmedEmbeddingDimension(5000);
  
  // Create schema with confirmed dimension
  createVectorTable(dimension);
  schemaInitialized = true;
}

async function getConfirmedEmbeddingDimension(timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const dim = getEmbeddingDimension();
    if (dim !== 768 || process.env.EMBEDDING_DIM === '768') {
      return dim; // Confirmed non-default or explicitly set
    }
    await sleep(100);
  }
  console.warn('Using default dimension 768 after timeout');
  return 768;
}
```

### 3.2 BUG-004: Constitutional Cache Invalidation

**Approach**: Add database modification timestamp check

```javascript
// In vector-index.js:
let lastDbModTime = 0;

function isConstitutionalCacheValid() {
  const dbPath = getDatabasePath();
  const stats = fs.statSync(dbPath);
  if (stats.mtimeMs > lastDbModTime) {
    lastDbModTime = stats.mtimeMs;
    return false; // Cache invalid
  }
  return Date.now() - constitutionalCache.timestamp < CONSTITUTIONAL_CACHE_TTL;
}
```

### 3.3 BUG-005: Persistent Rate Limiting

**Approach**: Store rate limit state in database

```javascript
// In context-server.js:
async function getLastScanTime() {
  const db = getDatabase();
  const row = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan');
  return row ? parseInt(row.value) : 0;
}

async function setLastScanTime(time) {
  const db = getDatabase();
  db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run('last_index_scan', time.toString());
}
```

### 3.4 BUG-006: Prepared Statement Cleanup

**Approach**: Add clearPreparedStatements() to all reset paths

```javascript
// In vector-index.js:
function resetDatabase() {
  clearPreparedStatements(); // Add this
  closeDatabase();
  // ... rest of reset logic
}

function closeDatabase() {
  clearPreparedStatements(); // Add this
  if (db) {
    db.close();
    db = null;
  }
}
```

### 3.5 BUG-007: Query Validation

**Approach**: Normalize and validate before any processing

```javascript
// In context-server.js handleMemorySearch():
function validateQuery(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }
  const normalized = query.trim();
  if (normalized.length === 0) {
    throw new Error('Query cannot be empty or whitespace-only');
  }
  if (normalized.length > MAX_QUERY_LENGTH) {
    throw new Error(`Query exceeds maximum length of ${MAX_QUERY_LENGTH}`);
  }
  return normalized;
}
```

---

## 4. Phase 3: Minor Fixes (P2)

**Duration**: 1-2 hours
**Risk**: Low - Edge cases and configuration

### 4.1 BUG-008: UTF-8 BOM Detection

```javascript
// In memory-parser.js:
function detectBOM(buffer) {
  if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    return { encoding: 'utf8', offset: 3 };
  }
  if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
    return { encoding: 'utf16be', offset: 2 };
  }
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    return { encoding: 'utf16le', offset: 2 };
  }
  return { encoding: 'utf8', offset: 0 };
}
```

### 4.2 BUG-009: Cache Key Collision Prevention

```javascript
// In vector-index.js:
function getCacheKey(query, limit, options) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify({ query, limit, options }));
  return hash.digest('hex').substring(0, 16);
}
```

### 4.3 BUG-010: Configurable Trigger Limit

```javascript
// In configs/search-weights.json:
{
  "maxTriggersPerMemory": 10,
  // ... other config
}

// In vector-index.js:
const config = require('../configs/search-weights.json');
const MAX_TRIGGERS = config.maxTriggersPerMemory || 10;
```

### 4.4 BUG-011: Non-Interactive Mode Failure

```javascript
// In generate-context.js:
if (!process.stdout.isTTY && requiresUserInput) {
  console.error('ERROR: This operation requires user input but running in non-interactive mode.');
  console.error('Please specify --spec-folder <path> explicitly.');
  process.exit(1);
}
```

### 4.5 BUG-012: Scoring Constants

```javascript
// In configs/search-weights.json:
{
  "smartRanking": {
    "recencyWeight": 0.5,
    "accessWeight": 0.3,
    "relevanceWeight": 0.2
  }
}
```

### 4.6 BUG-013: Auto-Clean Orphaned Vectors

```javascript
// In vector-index.js verifyIntegrity():
async function verifyIntegrity(options = { autoClean: false }) {
  const orphaned = findOrphanedVectors();
  if (orphaned.length > 0 && options.autoClean) {
    console.log(`Cleaning ${orphaned.length} orphaned vectors...`);
    deleteOrphanedVectors(orphaned);
  }
  return { orphanedCount: orphaned.length, cleaned: options.autoClean };
}
```

---

## 5. Phase 4: Verification

**Duration**: 1 hour
**Risk**: Low - Testing only

### 5.1 Test Cases

| Test | Validates |
|------|-----------|
| TC-001 | Database changes visible across connections |
| TC-002 | Failed vector insertion rolls back cleanly |
| TC-003 | Schema uses correct dimension for provider |
| TC-004 | Constitutional cache invalidates on DB change |
| TC-005 | Rate limiting persists across restart |
| TC-006 | Prepared statements cleared on reset |
| TC-007 | Empty queries rejected |
| TC-008 | UTF-8 BOM files parsed correctly |
| TC-009 | Cache keys don't collide |
| TC-010 | Trigger limit configurable |
| TC-011 | Non-interactive mode fails explicitly |
| TC-012 | Scoring uses config constants |
| TC-013 | Orphaned vectors auto-cleaned |

### 5.2 Regression Tests

- MCP server health check
- Memory search with various queries
- Checkpoint create/restore
- Memory indexing workflow
- Constitutional memory surfacing

---

## 6. Rollback Plan

If issues are discovered:

1. **Phase 1 rollback**: Revert transaction changes, restore original indexMemory()
2. **Phase 2 rollback**: Revert timing/caching changes, restore original startup
3. **Phase 3 rollback**: Revert config changes, restore hardcoded values

Each phase can be rolled back independently.

---

## 7. Definition of Done

- [ ] All 13 bugs have fixes implemented
- [ ] All fixes have corresponding test cases
- [ ] No regression in existing functionality
- [ ] Code reviewed and approved
- [ ] Documentation updated (SKILL.md, README)
- [ ] Memory file saved with session context
- [ ] Checklist.md fully verified
