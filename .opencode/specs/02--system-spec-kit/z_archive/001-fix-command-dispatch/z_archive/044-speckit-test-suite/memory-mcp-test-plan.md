# Memory MCP Server Test Plan

| Metadata | Value |
|----------|-------|
| **Component** | Memory MCP Server |
| **Location** | `.opencode/skill/system-spec-kit/mcp_server/` |
| **Agent** | Agent 3 of 4 |
| **Status** | Complete |
| **Created** | 2025-12-26 |

## 1. Executive Summary

This document provides a comprehensive test plan for the Memory MCP Server, covering:
- **13 MCP Tools** exposed via the server
- **23 Library Modules** providing core functionality
- **Database Layer** (SQLite + sqlite-vec + FTS5)
- **Performance Requirements** (trigger <50ms, vector <500ms, embedding <500ms)
- **Six-Tier Importance System** with constitutional always-surface behavior

### Key Findings from Research

1. **No existing tests** - All test infrastructure must be created from scratch
2. **Main entry point**: `context-server.js` (1737 lines)
3. **Heavy database dependency**: sqlite-vec for 768-dim vectors, FTS5 for full-text search
4. **Embedding dependency**: Requires Ollama with `nomic-embed-text-v1.5` model
5. **Constitutional tier**: Special handling - always surfaces first regardless of query

---

## 2. Test Framework Recommendation

### Primary: Jest

| Criterion | Jest | Mocha | Vitest |
|-----------|------|-------|--------|
| Setup complexity | Low (zero-config) | Medium | Low |
| Mocking built-in | ✅ Yes | ❌ Requires sinon | ✅ Yes |
| Async support | ✅ Excellent | ✅ Good | ✅ Excellent |
| Coverage built-in | ✅ Yes | ❌ Requires nyc | ✅ Yes |
| Snapshot testing | ✅ Yes | ❌ No | ✅ Yes |
| SQLite compatibility | ✅ Good | ✅ Good | ⚠️ ESM issues |
| Community adoption | High | High | Growing |

**Decision**: Use **Jest** for:
- Zero-config setup
- Built-in mocking (`jest.mock()`) for sqlite-vec and Ollama
- Native async/await support
- Coverage reporting without additional tools
- Excellent error messages

### Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'lib/**/*.js',
    'context-server.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  verbose: true
};
```

---

## 3. MCP Tool Tests

### 3.1 memory_search

**File**: `context-server.js:420-580`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| MS-001 | Basic semantic search | `{ query: "authentication" }` | Returns ranked results with similarity scores | P0 |
| MS-002 | Constitutional always surfaces | `{ query: "unrelated topic" }` | Constitutional memories appear first with similarity=100 | P0 |
| MS-003 | Constitutional token budget | `{ query: "any" }` | Constitutional results ≤500 tokens total | P0 |
| MS-004 | Spec folder filter | `{ query: "test", specFolder: "005-memory" }` | Only results from specified folder | P1 |
| MS-005 | Tier filter | `{ query: "test", tier: "critical" }` | Only critical tier memories | P1 |
| MS-006 | Context type filter | `{ query: "test", contextType: "decision" }` | Only decision-type memories | P1 |
| MS-007 | Include content flag | `{ query: "test", includeContent: true }` | Results include full file content | P1 |
| MS-008 | Include contiguity | `{ query: "test", includeContiguity: true }` | Adjacent memories included | P2 |
| MS-009 | Temporal decay scoring | `{ query: "test", useDecay: true }` | Older memories ranked lower | P1 |
| MS-010 | Limit parameter | `{ query: "test", limit: 5 }` | Maximum 5 results returned | P1 |
| MS-011 | Empty query error | `{ query: "" }` | Error: INVALID_PARAMETERS | P1 |
| MS-012 | Concepts AND search | `{ concepts: ["auth", "security"] }` | Results match ALL concepts | P1 |
| MS-013 | Graceful degradation (no sqlite-vec) | `{ query: "test" }` | Falls back to FTS5-only search | P1 |

### 3.2 memory_match_triggers

**File**: `context-server.js:582-650`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| MT-001 | Exact phrase match | `{ prompt: "spec kit memory" }` | Memories with matching trigger phrases | P0 |
| MT-002 | Case insensitive | `{ prompt: "SPEC KIT" }` | Matches lowercase triggers | P0 |
| MT-003 | Performance <50ms | `{ prompt: "test phrase" }` | Response time <50ms | P0 |
| MT-004 | Limit parameter | `{ prompt: "test", limit: 3 }` | Maximum 3 results | P1 |
| MT-005 | No matches | `{ prompt: "xyznonexistent123" }` | Empty results array | P1 |
| MT-006 | Multiple phrase matches | `{ prompt: "spec kit and memory search" }` | Results sorted by match count | P1 |
| MT-007 | Empty prompt error | `{ prompt: "" }` | Error: INVALID_PARAMETERS | P1 |

### 3.3 memory_list

**File**: `context-server.js:652-720`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| ML-001 | Default pagination | `{}` | First 20 memories, sorted by created_at DESC | P0 |
| ML-002 | Custom limit | `{ limit: 50 }` | Up to 50 results | P1 |
| ML-003 | Offset pagination | `{ offset: 20, limit: 10 }` | Results 21-30 | P1 |
| ML-004 | Sort by importance | `{ sortBy: "importance_weight" }` | Highest importance first | P1 |
| ML-005 | Sort by updated | `{ sortBy: "updated_at" }` | Most recently updated first | P1 |
| ML-006 | Spec folder filter | `{ specFolder: "005-memory" }` | Only specified folder | P1 |
| ML-007 | Max limit enforcement | `{ limit: 200 }` | Capped at 100 | P1 |

### 3.4 memory_stats

**File**: `context-server.js:722-780`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| MST-001 | Returns all stats | `{}` | { total, byTier, byFolder, dates, vectorStatus } | P0 |
| MST-002 | Tier breakdown | `{}` | Counts for all 6 tiers | P1 |
| MST-003 | Top folders list | `{}` | Top 10 folders by memory count | P1 |
| MST-004 | Vector index status | `{}` | { enabled, dimensions, totalVectors } | P1 |

### 3.5 memory_save

**File**: `context-server.js:782-900`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| MSV-001 | Save valid memory file | `{ filePath: "/valid/memory.md" }` | Memory indexed, embedding generated | P0 |
| MSV-002 | Force re-index | `{ filePath: "/path.md", force: true }` | Re-indexes even if hash unchanged | P1 |
| MSV-003 | Skip unchanged | `{ filePath: "/unchanged.md" }` | Skips if content hash matches | P1 |
| MSV-004 | Invalid path error | `{ filePath: "/not/in/specs/memory/" }` | Error: File must be in memory/ directory | P0 |
| MSV-005 | Missing file error | `{ filePath: "/nonexistent.md" }` | Error: FILE_NOT_FOUND | P1 |
| MSV-006 | Invalid anchor format | `{ filePath: "/bad-anchors.md" }` | Error: ANCHOR format validation fails | P1 |
| MSV-007 | Embedding generation | `{ filePath: "/valid.md" }` | 768-dimension vector created | P1 |

### 3.6 memory_index_scan

**File**: `context-server.js:902-1020`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| MIS-001 | Scan all memory folders | `{}` | All new/changed files indexed | P0 |
| MIS-002 | Spec folder filter | `{ specFolder: "005-memory" }` | Only scans specified folder | P1 |
| MIS-003 | Force all | `{ force: true }` | Re-indexes all files | P1 |
| MIS-004 | Batch processing | `{}` | BATCH_SIZE=5, BATCH_DELAY_MS=100 | P1 |
| MIS-005 | Retry on failure | Large scan | Exponential backoff on Ollama errors | P2 |
| MIS-006 | Summary report | `{}` | { scanned, indexed, skipped, errors } | P1 |

### 3.7 memory_update

**File**: `context-server.js:1022-1120`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| MU-001 | Update title | `{ id: 1, title: "New Title" }` | Title updated, embedding regenerated | P0 |
| MU-002 | Update importance tier | `{ id: 1, importanceTier: "critical" }` | Tier changed | P1 |
| MU-003 | Update importance weight | `{ id: 1, importanceWeight: 0.9 }` | Weight updated | P1 |
| MU-004 | Update trigger phrases | `{ id: 1, triggerPhrases: ["new", "phrases"] }` | Triggers updated | P1 |
| MU-005 | Invalid ID error | `{ id: 99999, title: "X" }` | Error: MEMORY_NOT_FOUND | P1 |
| MU-006 | No embedding regen on weight-only | `{ id: 1, importanceWeight: 0.5 }` | Embedding not regenerated | P2 |

### 3.8 memory_delete

**File**: `context-server.js:1122-1200`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| MD-001 | Delete by ID | `{ id: 1 }` | Memory removed from index | P0 |
| MD-002 | Bulk delete by folder | `{ specFolder: "old-project", confirm: true }` | All folder memories deleted | P1 |
| MD-003 | Bulk delete requires confirm | `{ specFolder: "test" }` | Error: confirm required for bulk | P0 |
| MD-004 | Auto-checkpoint before delete | `{ id: 1 }` | Checkpoint created before deletion | P1 |
| MD-005 | Invalid ID error | `{ id: 99999 }` | Error: MEMORY_NOT_FOUND | P1 |
| MD-006 | History audit trail | `{ id: 1 }` | Delete recorded in history | P2 |

### 3.9 memory_validate

**File**: `context-server.js:1202-1280`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| MV-001 | Mark useful | `{ id: 1, wasUseful: true }` | Confidence increased | P0 |
| MV-002 | Mark not useful | `{ id: 1, wasUseful: false }` | Confidence decreased | P0 |
| MV-003 | Auto-promote to critical | 5+ useful validations | Normal → Critical tier | P1 |
| MV-004 | Invalid ID error | `{ id: 99999, wasUseful: true }` | Error: MEMORY_NOT_FOUND | P1 |
| MV-005 | Validation count tracking | Multiple calls | validation_count incremented | P2 |

### 3.10 checkpoint_create

**File**: `context-server.js:1282-1350`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| CC-001 | Create checkpoint | `{ name: "before-refactor" }` | Checkpoint created with all memories | P0 |
| CC-002 | With metadata | `{ name: "v1", metadata: { version: "1.0" } }` | Metadata stored | P1 |
| CC-003 | Spec folder scoped | `{ name: "test", specFolder: "005" }` | Only folder memories in checkpoint | P1 |
| CC-004 | Duplicate name error | `{ name: "existing" }` | Error: CHECKPOINT_EXISTS | P1 |
| CC-005 | Preserves embeddings | `{ name: "test" }` | Embeddings included in checkpoint | P1 |

### 3.11 checkpoint_list

**File**: `context-server.js:1352-1400`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| CL-001 | List all checkpoints | `{}` | Array of checkpoint metadata | P0 |
| CL-002 | Filter by spec folder | `{ specFolder: "005" }` | Only matching checkpoints | P1 |
| CL-003 | Limit results | `{ limit: 5 }` | Maximum 5 checkpoints | P2 |
| CL-004 | Empty list | No checkpoints | Empty array, no error | P1 |

### 3.12 checkpoint_restore

**File**: `context-server.js:1402-1500`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| CR-001 | Restore checkpoint | `{ name: "backup" }` | Memories restored to checkpoint state | P0 |
| CR-002 | Clear existing first | `{ name: "backup", clearExisting: true }` | Existing memories cleared, then restored | P1 |
| CR-003 | Merge mode (default) | `{ name: "backup" }` | Checkpoint merged with current | P1 |
| CR-004 | Invalid name error | `{ name: "nonexistent" }` | Error: CHECKPOINT_NOT_FOUND | P1 |
| CR-005 | Embeddings restored | `{ name: "backup" }` | Vector embeddings restored correctly | P1 |

### 3.13 checkpoint_delete

**File**: `context-server.js:1502-1550`

| ID | Test Case | Parameters | Expected Result | Priority |
|----|-----------|------------|-----------------|----------|
| CDL-001 | Delete checkpoint | `{ name: "old-backup" }` | Checkpoint removed | P0 |
| CDL-002 | Invalid name error | `{ name: "nonexistent" }` | Error: CHECKPOINT_NOT_FOUND | P1 |

---

## 4. Library Module Unit Tests

### 4.1 embeddings.js

**File**: `lib/embeddings.js` → re-exports from `scripts/lib/embeddings.js` (495 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| EMB-001 | Generate single embedding | `generateEmbedding(text)` | 768-dimension float array | P0 |
| EMB-002 | Batch embeddings | `generateEmbeddings(texts)` | Array of 768-dim vectors | P0 |
| EMB-003 | Empty text handling | `generateEmbedding("")` | Error or zero vector | P1 |
| EMB-004 | Long text truncation | `generateEmbedding(veryLongText)` | Handles gracefully | P1 |
| EMB-005 | Ollama connection error | Mock Ollama down | Graceful error with retry | P0 |
| EMB-006 | Model validation | Check model name | Uses `nomic-embed-text-v1.5` | P1 |
| EMB-007 | Performance <500ms | `generateEmbedding(text)` | Completes in <500ms | P1 |

### 4.2 vector-index.js

**File**: `lib/vector-index.js` (2000+ lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| VI-001 | Initialize database | `initializeDatabase()` | Creates tables, indexes | P0 |
| VI-002 | Insert memory | `insertMemory(memory)` | Memory stored with embedding | P0 |
| VI-003 | Vector search | `vectorSearch(embedding, limit)` | Nearest neighbors returned | P0 |
| VI-004 | FTS5 search | `ftsSearch(query)` | Full-text matches | P0 |
| VI-005 | Hybrid search | `hybridSearch(query, embedding)` | Combined RRF results | P0 |
| VI-006 | Update memory | `updateMemory(id, data)` | Record updated | P1 |
| VI-007 | Delete memory | `deleteMemory(id)` | Record removed | P1 |
| VI-008 | Constitutional cache | `getConstitutionalMemories()` | Cached constitutional tier | P0 |
| VI-009 | Cache invalidation | Insert constitutional | Cache refreshed | P1 |
| VI-010 | WAL mode enabled | Check pragma | `journal_mode=wal` | P1 |
| VI-011 | sqlite-vec unavailable | Mock missing extension | Graceful degradation to FTS5 | P0 |
| VI-012 | 768-dim enforcement | Insert wrong dimensions | Error: INVALID_EMBEDDING_DIMENSIONS | P1 |

### 4.3 memory-parser.js

**File**: `lib/memory-parser.js` (510 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| MP-001 | Parse valid memory file | `parseMemoryFile(content)` | { title, metadata, sections, anchors } | P0 |
| MP-002 | Extract title | `parseMemoryFile(content)` | Title from first # heading | P0 |
| MP-003 | Extract trigger phrases | `parseMemoryFile(content)` | Array of trigger phrases | P1 |
| MP-004 | Validate ANCHOR format | `validateAnchors(content)` | ANCHOR_START/END pairs valid | P0 |
| MP-005 | Missing ANCHOR_END | `validateAnchors(bad)` | Error: ANCHOR_MISMATCH | P0 |
| MP-006 | Nested anchors error | `validateAnchors(nested)` | Error: NESTED_ANCHORS | P1 |
| MP-007 | Extract importance tier | `parseMemoryFile(content)` | Tier from frontmatter | P1 |
| MP-008 | Extract context type | `parseMemoryFile(content)` | contextType from metadata | P1 |
| MP-009 | Empty file handling | `parseMemoryFile("")` | Error: EMPTY_FILE | P1 |

### 4.4 trigger-matcher.js

**File**: `lib/trigger-matcher.js` (359 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| TM-001 | Exact match | `matchTriggers(prompt, phrases)` | Matching phrases returned | P0 |
| TM-002 | Case insensitive | `matchTriggers("TEST", ["test"])` | Match found | P0 |
| TM-003 | Partial match (word boundary) | `matchTriggers("testing", ["test"])` | No match (word boundary) | P1 |
| TM-004 | Multiple matches | `matchTriggers("spec kit memory", [...])` | All matches returned | P1 |
| TM-005 | Performance <50ms | 1000 phrases | Completes <50ms | P0 |
| TM-006 | Empty prompt | `matchTriggers("", phrases)` | Empty array | P1 |
| TM-007 | Empty phrases | `matchTriggers("test", [])` | Empty array | P1 |
| TM-008 | Special characters | `matchTriggers("test-case", ["test-case"])` | Match found | P2 |

### 4.5 trigger-extractor.js

**File**: `lib/trigger-extractor.js` → re-exports from `scripts/lib/trigger-extractor.js` (830 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| TE-001 | Extract from content | `extractTriggers(content)` | Array of trigger phrases | P0 |
| TE-002 | Deduplicate | `extractTriggers(content)` | No duplicate phrases | P1 |
| TE-003 | Normalize case | `extractTriggers(content)` | Lowercase phrases | P1 |
| TE-004 | Filter common words | `extractTriggers(content)` | Stopwords excluded | P1 |
| TE-005 | Extract from headings | Content with ## headers | Heading phrases extracted | P1 |
| TE-006 | Extract from bold | Content with **bold** | Bold phrases extracted | P2 |
| TE-007 | Min phrase length | `extractTriggers(content)` | Phrases ≥3 chars | P2 |

### 4.6 hybrid-search.js

**File**: `lib/hybrid-search.js` (166 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| HS-001 | Combine FTS + vector | `hybridSearch(query, embedding)` | Merged results | P0 |
| HS-002 | RRF fusion applied | Two result sets | RRF-ranked output | P0 |
| HS-003 | Vector-only mode | sqlite-vec available | Vector results weighted | P1 |
| HS-004 | FTS-only fallback | No sqlite-vec | FTS results only | P0 |
| HS-005 | Empty query | `hybridSearch("")` | Error or empty results | P1 |

### 4.7 rrf-fusion.js

**File**: `lib/rrf-fusion.js` (180 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| RRF-001 | Basic fusion | Two ranked lists | Combined RRF scores | P0 |
| RRF-002 | K parameter | `fuse(lists, k=60)` | K affects ranking | P1 |
| RRF-003 | Duplicate handling | Same ID in both lists | Merged, not duplicated | P0 |
| RRF-004 | Empty list handling | One empty list | Other list returned | P1 |
| RRF-005 | Score normalization | `fuse(lists)` | Scores in 0-1 range | P2 |

### 4.8 reranker.js

**File**: `lib/reranker.js` (108 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| RR-001 | Rerank results | `rerank(query, results)` | Cross-encoder reranked | P2 |
| RR-002 | Python fallback | Python unavailable | Original order returned | P1 |
| RR-003 | Empty results | `rerank(query, [])` | Empty array | P2 |

### 4.9 scoring.js

**File**: `lib/scoring.js` (324 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| SC-001 | Temporal decay | `calculateDecay(date)` | Older = lower score | P0 |
| SC-002 | Importance boost | `applyImportanceBoost(score, tier)` | Tier-based multiplier | P0 |
| SC-003 | Access count factor | `applyAccessBoost(score, count)` | Higher access = boost | P1 |
| SC-004 | Combine scores | `combineScores(factors)` | Weighted combination | P1 |
| SC-005 | Score range | Any calculation | Result in 0-1 range | P1 |

### 4.10 composite-scoring.js

**File**: `lib/composite-scoring.js` (152 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| CS-001 | Multi-factor scoring | `computeCompositeScore(memory)` | Combined score | P0 |
| CS-002 | Factor weights | `setWeights(weights)` | Custom factor weights | P1 |
| CS-003 | Missing factors | Partial memory data | Graceful handling | P1 |

### 4.11 importance-tiers.js

**File**: `lib/importance-tiers.js` (385 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| IT-001 | Constitutional boost | `getTierBoost("constitutional")` | Highest boost value | P0 |
| IT-002 | Critical boost | `getTierBoost("critical")` | Second highest | P1 |
| IT-003 | Deprecated decay | `getTierDecay("deprecated")` | Highest decay | P1 |
| IT-004 | Tier validation | `isValidTier("invalid")` | false | P1 |
| IT-005 | All six tiers | Loop through tiers | All have boost/decay values | P0 |
| IT-006 | Tier ordering | `compareTiers(a, b)` | Correct sort order | P2 |

### 4.12 temporal-contiguity.js

**File**: `lib/temporal-contiguity.js` (189 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| TC-001 | Find adjacent memories | `findContiguous(memoryId)` | Temporally adjacent | P1 |
| TC-002 | Same session grouping | `groupBySession(memories)` | Clustered by time | P2 |
| TC-003 | Time window | `setWindow(minutes)` | Configurable window | P2 |

### 4.13 checkpoints.js

**File**: `lib/checkpoints.js` (496 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| CP-001 | Create checkpoint | `createCheckpoint(name)` | Snapshot created | P0 |
| CP-002 | Include embeddings | `createCheckpoint(name)` | Embeddings preserved | P0 |
| CP-003 | Restore checkpoint | `restoreCheckpoint(name)` | State restored | P0 |
| CP-004 | List checkpoints | `listCheckpoints()` | Array of checkpoints | P1 |
| CP-005 | Delete checkpoint | `deleteCheckpoint(name)` | Checkpoint removed | P1 |
| CP-006 | Metadata storage | `createCheckpoint(name, meta)` | Metadata preserved | P2 |
| CP-007 | Spec folder scope | `createCheckpoint(name, folder)` | Only folder memories | P1 |

### 4.14 access-tracker.js

**File**: `lib/access-tracker.js` (324 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| AT-001 | Track access | `recordAccess(memoryId)` | Access count incremented | P1 |
| AT-002 | Batch updates | Multiple accesses | Batched to database | P1 |
| AT-003 | Get access count | `getAccessCount(memoryId)` | Current count | P1 |
| AT-004 | Flush on shutdown | `flush()` | All pending writes committed | P1 |

### 4.15 confidence-tracker.js

**File**: `lib/confidence-tracker.js` (242 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| CT-001 | Record positive feedback | `recordValidation(id, true)` | Confidence increased | P0 |
| CT-002 | Record negative feedback | `recordValidation(id, false)` | Confidence decreased | P0 |
| CT-003 | Auto-promote threshold | 5 positive validations | Tier upgraded | P1 |
| CT-004 | Confidence range | Any validation | Score in 0-1 range | P1 |
| CT-005 | Validation count | `getValidationCount(id)` | Total validations | P2 |

### 4.16 token-budget.js

**File**: `lib/token-budget.js` (200 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| TB-001 | Estimate tokens | `estimateTokens(text)` | Approximate token count | P1 |
| TB-002 | Truncate to budget | `truncateToBudget(text, 500)` | Text ≤500 tokens | P0 |
| TB-003 | Constitutional budget | `getConstitutionalBudget()` | ~500 tokens | P0 |
| TB-004 | Preserve meaning | `truncateToBudget(text, limit)` | Truncates at sentence boundary | P2 |

### 4.17 errors.js

**File**: `lib/errors.js` (154 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| ER-001 | MemoryError class | `new MemoryError(code, msg)` | Error with code property | P0 |
| ER-002 | Error codes defined | Check all codes | All documented codes exist | P1 |
| ER-003 | Error serialization | `error.toJSON()` | Serializable format | P2 |

### 4.18 config-loader.js

**File**: `lib/config-loader.js` (132 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| CL-001 | Load JSONC config | `loadConfig(path)` | Config object with comments stripped | P1 |
| CL-002 | Missing file fallback | `loadConfig(missing)` | Default config | P1 |
| CL-003 | Invalid JSON error | `loadConfig(invalid)` | Error: INVALID_CONFIG | P1 |

### 4.19 channel.js

**File**: `lib/channel.js` (238 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| CH-001 | Get current branch | `getCurrentChannel()` | Git branch name | P1 |
| CH-002 | No git repo | Non-git directory | Default channel | P1 |
| CH-003 | Filter by channel | `filterByChannel(memories)` | Branch-specific memories | P2 |

### 4.20 entity-scope.js

**File**: `lib/entity-scope.js` (279 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| ES-001 | Session scope | `filterByScope(memories, "session")` | Current session only | P2 |
| ES-002 | Project scope | `filterByScope(memories, "project")` | All project memories | P2 |
| ES-003 | Context type filter | `filterByContextType(memories, "decision")` | Decision-type only | P1 |

### 4.21 index-refresh.js

**File**: `lib/index-refresh.js` (172 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| IR-001 | Refresh stale entries | `refreshStaleEntries()` | Outdated embeddings regenerated | P2 |
| IR-002 | Identify stale | `getStaleEntries(days)` | Entries older than threshold | P2 |
| IR-003 | Incremental refresh | `refreshIncremental()` | Only changed files | P2 |

### 4.22 retry-manager.js

**File**: `lib/retry-manager.js` (423 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| RM-001 | Retry on failure | `withRetry(fn)` | Retries up to maxAttempts | P0 |
| RM-002 | Exponential backoff | `withRetry(fn)` | Delays increase exponentially | P0 |
| RM-003 | Max attempts | `withRetry(fn, { max: 3 })` | Stops after 3 attempts | P1 |
| RM-004 | Success on retry | Fails once, succeeds | Returns success result | P1 |
| RM-005 | Non-retryable errors | `withRetry(fn)` | Some errors skip retry | P1 |

### 4.23 history.js

**File**: `lib/history.js` (406 lines)

| ID | Test Case | Function | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| HI-001 | Record action | `recordAction(type, data)` | Audit entry created | P1 |
| HI-002 | Get history | `getHistory(memoryId)` | All actions for memory | P1 |
| HI-003 | Undo support | `undo(actionId)` | Previous state restored | P2 |
| HI-004 | History pagination | `getHistory(id, { limit, offset })` | Paginated results | P2 |

---

## 5. Database Tests

### 5.1 Schema Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| DB-001 | memories table exists | Table with correct columns | P0 |
| DB-002 | embeddings table exists | 768-dim vector column | P0 |
| DB-003 | checkpoints table exists | Checkpoint storage | P1 |
| DB-004 | history table exists | Audit trail storage | P1 |
| DB-005 | FTS5 index exists | Full-text search index | P0 |
| DB-006 | WAL mode enabled | `PRAGMA journal_mode` = wal | P1 |

### 5.2 Migration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| MG-001 | Fresh install migration | All tables created | P0 |
| MG-002 | Upgrade migration | Existing data preserved | P1 |
| MG-003 | Rollback capability | Can revert migration | P2 |

---

## 6. Integration Tests

### 6.1 Full Workflow Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| INT-001 | Index → Search → Retrieve | save → search → verify content | End-to-end success | P0 |
| INT-002 | Checkpoint → Modify → Restore | checkpoint → delete → restore → verify | Original state restored | P0 |
| INT-003 | Validation → Promotion | 5x validate useful → check tier | Auto-promoted to critical | P1 |
| INT-004 | Constitutional always-surface | Add constitutional → any query | Constitutional first | P0 |
| INT-005 | Bulk scan → Search | index_scan folder → search → verify | All files searchable | P1 |

### 6.2 Error Recovery Tests

| ID | Test Case | Scenario | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| ER-001 | Ollama unavailable | Kill Ollama during embedding | Graceful error, retry | P0 |
| ER-002 | Database corruption | Corrupt SQLite file | Error detected, recovery attempted | P1 |
| ER-003 | Concurrent access | Parallel writes | WAL handles correctly | P1 |
| ER-004 | Disk full | No space for writes | Error without data loss | P2 |

---

## 7. Performance Tests

| ID | Test Case | Target | Priority |
|----|-----------|--------|----------|
| PERF-001 | Trigger matching | <50ms for 1000 phrases | P0 |
| PERF-002 | Vector search | <500ms for 10K vectors | P0 |
| PERF-003 | Embedding generation | <500ms per text | P0 |
| PERF-004 | Hybrid search | <1s for complex query | P1 |
| PERF-005 | Bulk indexing | 100 files in <60s | P1 |
| PERF-006 | Constitutional cache hit | <10ms on cache hit | P1 |

---

## 8. Mock Strategy

### 8.1 sqlite-vec Mock

```javascript
// tests/mocks/sqlite-vec.js
const mockSqliteVec = {
  available: true,
  search: jest.fn().mockResolvedValue([
    { id: 1, distance: 0.1 },
    { id: 2, distance: 0.2 }
  ]),
  insert: jest.fn().mockResolvedValue(true)
};

// Toggle availability for degradation tests
mockSqliteVec.setAvailable = (available) => {
  mockSqliteVec.available = available;
};

module.exports = mockSqliteVec;
```

### 8.2 Embeddings Mock

```javascript
// tests/mocks/embeddings.js
const mockEmbeddings = {
  generateEmbedding: jest.fn().mockResolvedValue(
    new Array(768).fill(0).map(() => Math.random())
  ),
  generateEmbeddings: jest.fn().mockImplementation((texts) =>
    Promise.resolve(texts.map(() =>
      new Array(768).fill(0).map(() => Math.random())
    ))
  )
};

module.exports = mockEmbeddings;
```

### 8.3 File System Mock

```javascript
// tests/mocks/fs.js
const mockFs = {
  readFileSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true),
  writeFileSync: jest.fn(),
  readdirSync: jest.fn().mockReturnValue([])
};

module.exports = mockFs;
```

### 8.4 Test Fixtures

```
tests/fixtures/
├── valid-memory.md          # Well-formed memory file
├── invalid-anchors.md       # Missing ANCHOR_END
├── constitutional-memory.md # Constitutional tier example
├── large-content.md         # Long content for truncation tests
└── trigger-phrases.md       # File with many trigger phrases
```

---

## 9. Test Directory Structure

```
.opencode/skill/system-spec-kit/mcp_server/
├── tests/
│   ├── setup.js                    # Jest setup, global mocks
│   ├── fixtures/                   # Test data files
│   │   ├── valid-memory.md
│   │   ├── invalid-anchors.md
│   │   └── ...
│   ├── mocks/                      # Mock implementations
│   │   ├── sqlite-vec.js
│   │   ├── embeddings.js
│   │   └── fs.js
│   ├── unit/                       # Unit tests
│   │   ├── lib/
│   │   │   ├── embeddings.test.js
│   │   │   ├── vector-index.test.js
│   │   │   ├── memory-parser.test.js
│   │   │   ├── trigger-matcher.test.js
│   │   │   ├── ... (23 files)
│   │   │   └── history.test.js
│   │   └── context-server.test.js
│   ├── integration/                # Integration tests
│   │   ├── workflow.test.js
│   │   ├── error-recovery.test.js
│   │   └── concurrent-access.test.js
│   └── performance/                # Performance tests
│       ├── trigger-matching.perf.js
│       ├── vector-search.perf.js
│       └── embedding-generation.perf.js
├── jest.config.js
└── package.json (test scripts)
```

---

## 10. Coverage Goals

| Category | Target | Metric |
|----------|--------|--------|
| **MCP Tools** | 100% | All 13 tools have tests |
| **Library Modules** | 85%+ | Line coverage |
| **Branches** | 80%+ | Branch coverage |
| **Functions** | 85%+ | Function coverage |
| **Statements** | 85%+ | Statement coverage |
| **Critical Paths** | 100% | constitutional, search, checkpoint |

### Coverage Enforcement

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:performance": "jest tests/performance --runInBand"
  }
}
```

---

## 11. Implementation Priority

### Phase 1: Foundation (Week 1)
- [ ] Jest setup and configuration
- [ ] Mock implementations (sqlite-vec, embeddings, fs)
- [ ] Test fixtures creation
- [ ] Basic smoke tests for all 13 MCP tools

### Phase 2: Core Library Tests (Week 2)
- [ ] embeddings.js tests
- [ ] vector-index.js tests
- [ ] memory-parser.js tests
- [ ] trigger-matcher.js tests
- [ ] importance-tiers.js tests

### Phase 3: Complete Library Coverage (Week 3)
- [ ] All remaining lib module tests (18 modules)
- [ ] Error handling tests
- [ ] Edge case coverage

### Phase 4: Integration & Performance (Week 4)
- [ ] Full workflow integration tests
- [ ] Error recovery tests
- [ ] Performance benchmarks
- [ ] Coverage report and gap analysis

---

## 12. Appendix: Test Case Count Summary

| Component | Test Cases |
|-----------|------------|
| MCP Tools (13) | 78 |
| Library Modules (23) | 138 |
| Database | 9 |
| Integration | 8 |
| Performance | 6 |
| **Total** | **239** |
