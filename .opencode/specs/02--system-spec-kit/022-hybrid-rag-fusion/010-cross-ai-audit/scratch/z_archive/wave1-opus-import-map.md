# Wave 1 Opus Import Map: scripts/ -> mcp_server Dependencies

> Generated: 2026-03-02
> Scope: ALL `.ts` files under `.opencode/skill/system-spec-kit/scripts/`
> Target: Every import, require, type-import, or runtime path reference to `mcp_server`

---

## 1. Summary Statistics

| Metric | Count |
|--------|-------|
| **Total files in scripts/ referencing mcp_server** | **10** |
| **Total import/require statements to mcp_server** | **15** |
| **`typeof import(...)` type references** | **7** |
| **Runtime path.join/resolve references** | **9** |
| **Imports via `@spec-kit/mcp-server` (tsconfig alias)** | **3** (across 2 files) |
| **Imports via relative `../../mcp_server/` path** | **5** (across 2 files) |
| **Imports via `require()` with relative path** | **1** (1 file) |
| **Imports routed through `@spec-kit/shared`** | **0 of the mcp_server imports** |

### Routing Breakdown

| Route | Import Statements | Files |
|-------|:-:|:-:|
| **Direct via `@spec-kit/mcp-server/*` alias** | 3 | 2 |
| **Direct via relative `../../mcp_server/*`** | 5 | 2 |
| **Direct via `require('../../mcp_server/*')** | 1 | 1 |
| **`typeof import('../../mcp_server/*')` (type-only)** | 7 | 1 |
| **Runtime `path.join/resolve` to mcp_server/** | 9 | 6 |
| **Through `@spec-kit/shared`** | 0 | 0 |

---

## 2. Per-File Inventory

### 2.1 FILES WITH STATIC IMPORTS (import/require/export)

---

#### FILE 1: `scripts/core/memory-indexer.ts`
**Category:** Core pipeline (production)
**Route:** `@spec-kit/mcp-server` (tsconfig alias)

| Line | Statement | Module Imported |
|------|-----------|-----------------|
| 13 | `import * as vectorIndex from '@spec-kit/mcp-server/lib/search/vector-index'` | vector-index (search) |
| 14 | `import { DB_UPDATED_FILE } from '@spec-kit/mcp-server/core/config'` | core config constant |

**Assessment:** This is the indexing pipeline -- it needs direct access to the vector store and DB-change notification. These are internal implementation details of the MCP server that scripts/ should NOT be reaching into.
- `vectorIndex` -- Could be exposed through shared/ as a storage abstraction
- `DB_UPDATED_FILE` -- This is a config constant; could trivially be re-exported via shared/

---

#### FILE 2: `scripts/lib/retry-manager.ts`
**Category:** Library shim (re-export)
**Route:** `@spec-kit/mcp-server` (tsconfig alias)

| Line | Statement | Module Imported |
|------|-----------|-----------------|
| 7 | `export * from '@spec-kit/mcp-server/lib/providers/retry-manager'` | retry-manager |

**Assessment:** This is a pure re-export shim. The comment says "canonical source is mcp_server/lib/providers/retry-manager.ts". However, `@spec-kit/shared/utils/retry` already exports `retryWithBackoff`, `classifyError`, etc. This shim may be REDUNDANT if the retry-manager in mcp_server just re-exports shared/ utilities. Needs investigation: does mcp_server/lib/providers/retry-manager.ts add anything beyond what shared/utils/retry.ts provides?

---

#### FILE 3: `scripts/evals/run-performance-benchmarks.ts`
**Category:** Eval script (testing/benchmarking)
**Route:** Relative path `../../mcp_server/`

| Line | Statement | Module Imported |
|------|-----------|-----------------|
| 16 | `import * as sessionBoost from '../../mcp_server/lib/search/session-boost'` | session-boost (search) |
| 17 | `import * as causalBoost from '../../mcp_server/lib/search/causal-boost'` | causal-boost (search) |
| 18 | `import * as workingMemory from '../../mcp_server/lib/cache/cognitive/working-memory'` | working-memory (cognitive cache) |
| 19-24 | `import { initExtractionAdapter, getExtractionMetrics, resetExtractionMetrics, type ExtractionMetrics } from '../../mcp_server/lib/extraction/extraction-adapter'` | extraction-adapter |

**Assessment:** Performance benchmarks need to directly import the modules they are benchmarking. Tight coupling is **justified** here -- these are internal performance tests that measure latency of specific internal modules. Routing through shared/ would defeat the purpose.

---

#### FILE 4: `scripts/evals/run-chk210-quality-backfill.ts`
**Category:** Eval script (data migration)
**Route:** `require()` with relative path

| Line | Statement | Module Imported |
|------|-----------|-----------------|
| 10 | `const { parseMemoryFile } = require('../../mcp_server/lib/parsing/memory-parser.ts')` | memory-parser (parsing) |

**Assessment:** Eval script importing a parser for one-time data backfill. `parseMemoryFile` is a utility function that could reasonably live in shared/. However, since this is a one-off migration script, the coupling is low-risk. Note: the `.ts` extension in the require path is unusual and may only work with tsx.

---

### 2.2 FILES WITH TYPE-ONLY IMPORTS (typeof import)

---

#### FILE 5: `scripts/memory/reindex-embeddings.ts`
**Category:** Maintenance script (database reindexing)
**Route:** `typeof import('../../mcp_server/...')` (type-only, resolved at compile time) + runtime `require()` via dynamic path

| Line | Statement | Module Referenced |
|------|-----------|-------------------|
| 20 | `type VectorIndexModule = typeof import('../../mcp_server/lib/search/vector-index')` | vector-index |
| 21 | `type EmbeddingsModule = typeof import('../../mcp_server/lib/providers/embeddings')` | embeddings |
| 22 | `type CheckpointsModule = typeof import('../../mcp_server/lib/storage/checkpoints')` | checkpoints |
| 23 | `type AccessTrackerModule = typeof import('../../mcp_server/lib/storage/access-tracker')` | access-tracker |
| 24 | `type HybridSearchModule = typeof import('../../mcp_server/lib/search/hybrid-search')` | hybrid-search |
| 25 | `type CoreModule = typeof import('../../mcp_server/core')` | core (db-state) |
| 26 | `type HandlersModule = typeof import('../../mcp_server/handlers')` | handlers |

Additionally, lines 45-46 use `path.resolve(__dirname, '../../mcp_server/dist')` and `'../../../mcp_server/dist'` to locate the compiled JS at runtime, then `require()` each module dynamically.

**Assessment:** This script bootstraps the entire MCP server runtime to perform a full reindex. It needs access to vector-index, embeddings, checkpoints, access-tracker, hybrid-search, core init, and handlers. This is inherently a deep integration point -- it is essentially a "headless MCP server" for batch operations. Tight coupling is **justified** but architecturally concerning: if the MCP server internals change, this script breaks silently. A dedicated `reindex` entry point exported from mcp_server would be cleaner.

---

### 2.3 FILES WITH RUNTIME PATH REFERENCES ONLY (no import/require)

These files do not have TypeScript import statements but construct paths to mcp_server at runtime.

---

#### FILE 6: `scripts/memory/cleanup-orphaned-vectors.ts`
**Category:** Maintenance script (database cleanup)
**Route:** Runtime `path.join`

| Line | Reference |
|------|-----------|
| 33 | `const dbPath: string = path.join(__dirname, '../../../mcp_server/database/context-index.sqlite')` |

**Assessment:** Hardcoded path to the SQLite database file. This is a runtime file path, not a module import. Could be centralized via a shared config constant (e.g., `DB_PATH` from shared/ or from core/config).

---

#### FILE 7: `scripts/spec-folder/folder-detector.ts`
**Category:** Core pipeline (spec folder detection)
**Route:** Runtime `path.join` / string literals

| Line | Reference |
|------|-----------|
| 942 | `path.join(CONFIG.PROJECT_ROOT, '.opencode/skill/system-spec-kit/mcp_server/node_modules/better-sqlite3')` |
| 946 | `'.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite'` |

**Assessment:** folder-detector reaches into mcp_server's node_modules to load better-sqlite3, and references the database path. The better-sqlite3 dependency sharing is a practical necessity (avoiding duplicate native modules), but the hardcoded path is fragile. The DB path should be sourced from a shared config.

---

#### FILE 8: `scripts/spec-folder/alignment-validator.ts`
**Category:** Validation script (schema drift detection)
**Route:** Runtime `path.join`

| Line | Reference |
|------|-----------|
| 248 | `path.join(rootDir, 'mcp_server', 'lib', 'telemetry', 'retrieval-telemetry.ts')` |
| 249 | `path.join(rootDir, 'mcp_server', 'lib', 'telemetry', 'README.md')` |

**Assessment:** The alignment validator reads the telemetry schema source file and its docs to detect schema-documentation drift. This is file-system-level reading (not importing), and it is **justified** since it's validating cross-package consistency. Routing through shared/ is not applicable -- this needs the raw file path.

---

#### FILE 9: `scripts/evals/run-redaction-calibration.ts`
**Category:** Eval script (redaction testing)
**Route:** Runtime `path.join` + `require()`

| Line | Reference |
|------|-----------|
| 72 | `const gateModulePath = path.join(process.cwd(), 'mcp_server', 'dist', 'lib', 'extraction', 'redaction-gate.js')` |

**Assessment:** Dynamically loads the compiled redaction-gate module for calibration testing. This is an eval script testing an internal module -- tight coupling is **justified**.

---

#### FILE 10: `scripts/evals/run-quality-legacy-remediation.ts`
**Category:** Eval script (data remediation)
**Route:** Runtime `path.join`

| Line | Reference |
|------|-----------|
| 20 | `const DB_PATH = path.join(SKILL_ROOT, 'mcp_server', 'database', 'context-index.sqlite')` |

**Assessment:** Another hardcoded database path. Same as cleanup-orphaned-vectors.ts -- should use a shared config constant.

---

#### FILE 11 (comment only): `scripts/evals/collect-redaction-calibration-inputs.ts`
**Category:** Eval script (data collection)
**Route:** String literal in shell command spec

| Line | Reference |
|------|-----------|
| 52 | `{ command: 'ls', args: ['-la', '.opencode/skill/system-spec-kit/mcp_server'], cwd: workspaceRoot }` |

**Assessment:** This is a shell command listing the mcp_server directory as part of environment capture. Not an import -- just a diagnostic command. No action needed.

---

#### FILE 12 (comment only): `scripts/tests/tree-thinning.vitest.ts`
**Category:** Test file
**Route:** Comment only

| Line | Reference |
|------|-----------|
| 6 | `// (requires vitest configured in this package, or run from mcp_server` |

**Assessment:** Comment only, no actual import. No action needed.

---

## 3. What shared/ Currently Provides

The `@spec-kit/shared` package (`shared/index.ts`) already re-exports these modules that overlap with mcp_server functionality:

| shared/ Export | Overlaps With | Status |
|---------------|---------------|--------|
| `embeddings` (generateEmbedding, EMBEDDING_DIM, MODEL_NAME, ...) | `mcp_server/lib/providers/embeddings` | **Canonical source is shared/** |
| `trigger-extractor` (extractTriggerPhrases, ...) | N/A (originated in shared/) | Clean |
| `utils/retry` (retryWithBackoff, classifyError, ...) | `mcp_server/lib/providers/retry-manager` | **Possible redundancy** |
| `scoring/folder-scoring` | Originally from mcp_server, now canonical in shared/ | Clean |
| `utils/path-security` | Originally from mcp_server, now canonical in shared/ | Clean |
| `utils/jsonc-strip` | Originally from mcp_server, now canonical in shared/ | Clean |
| `lib/structure-aware-chunker` | N/A | Clean |
| `types` (MemoryDbRow, Memory, EmbeddingProfile, ...) | Shared across all packages | Clean |

---

## 4. Refactoring Recommendations

### TIER 1: Should Be Refactored (shared/ exposure needed)

| File | Import | Recommendation | Effort |
|------|--------|----------------|--------|
| `core/memory-indexer.ts` | `@spec-kit/mcp-server/core/config` (DB_UPDATED_FILE) | Export `DB_UPDATED_FILE` from `@spec-kit/shared` or create `shared/config.ts` | Low |
| `core/memory-indexer.ts` | `@spec-kit/mcp-server/lib/search/vector-index` | Create a `shared/storage/vector-store.ts` facade or expose a `writeMemoryToIndex()` function in shared/ | Medium |
| `lib/retry-manager.ts` | `@spec-kit/mcp-server/lib/providers/retry-manager` | Investigate if this re-export is redundant with `shared/utils/retry`. If so, delete the shim and update consumers to use `@spec-kit/shared/utils/retry` | Low |
| `memory/cleanup-orphaned-vectors.ts` | `path.join(__dirname, '../../../mcp_server/database/...')` | Create `shared/config.ts` with `DB_PATH` constant. Reuse in all scripts. | Low |
| `evals/run-quality-legacy-remediation.ts` | `path.join(SKILL_ROOT, 'mcp_server', 'database/...')` | Same as above -- use shared DB_PATH | Low |
| `spec-folder/folder-detector.ts` | `mcp_server/database/context-index.sqlite` path | Same as above -- use shared DB_PATH | Low |
| `evals/run-chk210-quality-backfill.ts` | `require('../../mcp_server/lib/parsing/memory-parser.ts')` | Consider moving `parseMemoryFile` to shared/ if used by multiple consumers | Low-Medium |

### TIER 2: Tight Coupling Justified (leave as-is)

| File | Import | Justification |
|------|--------|---------------|
| `evals/run-performance-benchmarks.ts` | 4 imports from `../../mcp_server/lib/search/*`, `lib/cache/*`, `lib/extraction/*` | **Benchmarking internal modules** -- must import the actual implementation to measure latency. Routing through shared/ would add overhead and defeat the purpose. |
| `evals/run-redaction-calibration.ts` | Runtime require of `mcp_server/dist/lib/extraction/redaction-gate.js` | **Calibration testing** -- needs the actual redaction implementation. |
| `spec-folder/alignment-validator.ts` | `path.join(rootDir, 'mcp_server', 'lib', 'telemetry', '...')` | **Schema drift validation** -- reads raw source files for cross-package consistency checks. Not an import. |
| `memory/reindex-embeddings.ts` | 7 typeof imports + runtime require from mcp_server/dist | **Full DB reindex** -- bootstraps the entire MCP server. Architecturally, a cleaner solution would be for mcp_server to export a `reindex()` entry point, but refactoring this is Medium-High effort. |

### TIER 3: No Action Needed

| File | Reference | Reason |
|------|-----------|--------|
| `evals/collect-redaction-calibration-inputs.ts` | Shell `ls` command with mcp_server path | Diagnostic command, not an import |
| `tests/tree-thinning.vitest.ts` | Comment mentioning mcp_server | Comment only |

---

## 5. Proposed Refactoring Plan

### Phase A: Create `shared/config.ts` (Low Effort)

Add a `config.ts` module to shared/ that exports common constants currently scattered across mcp_server references:

```typescript
// shared/config.ts
import path from 'path';

export const SKILL_ROOT = path.resolve(__dirname, '..');
export const DB_PATH = path.join(SKILL_ROOT, 'mcp_server', 'database', 'context-index.sqlite');
export const DB_UPDATED_FILE = path.join(SKILL_ROOT, 'mcp_server', 'database', '.db-updated');
```

**Consumers to update:**
- `scripts/memory/cleanup-orphaned-vectors.ts` (line 33)
- `scripts/evals/run-quality-legacy-remediation.ts` (line 20)
- `scripts/spec-folder/folder-detector.ts` (line 946)
- `scripts/core/memory-indexer.ts` (line 14)

### Phase B: Investigate retry-manager Redundancy (Low Effort)

Compare `mcp_server/lib/providers/retry-manager.ts` with `shared/utils/retry.ts`. If identical (or the former re-exports the latter), delete `scripts/lib/retry-manager.ts` shim and update all consumers.

### Phase C: Consider parseMemoryFile Promotion (Medium Effort)

If `parseMemoryFile` from `mcp_server/lib/parsing/memory-parser.ts` is used by more than just the eval script, promote it to shared/. Otherwise, leave as-is.

### Phase D: Architectural -- mcp_server Entry Points (Medium-High Effort, Deferred)

For `reindex-embeddings.ts`, consider having mcp_server export a dedicated `reindex()` function rather than forcing scripts to bootstrap the entire server manually. This would:
- Reduce the 7 typeof imports + dynamic requires to 1 import
- Make mcp_server internal refactoring safe
- But requires significant mcp_server API design work

---

## 6. Files with @spec-kit/shared Imports (for comparison)

These scripts already properly route through shared/:

| File | Import |
|------|--------|
| `scripts/core/config.ts` | `@spec-kit/shared/utils/jsonc-strip` |
| `scripts/memory/ast-parser.ts` | `@spec-kit/shared/lib/structure-aware-chunker` |
| `scripts/memory/rank-memories.ts` | `@spec-kit/shared/scoring/folder-scoring` |
| `scripts/lib/trigger-extractor.ts` | `@spec-kit/shared/trigger-extractor` (re-export) |
| `scripts/lib/content-filter.ts` | `@spec-kit/shared/utils/jsonc-strip` |
| `scripts/lib/embeddings.ts` | `@spec-kit/shared/embeddings` (re-export) |
| `scripts/memory/reindex-embeddings.ts` | `../../shared/types` (EmbeddingProfile, MCPResponse) |

---

## 7. Architecture Diagram

```
scripts/
  |
  |-- core/memory-indexer.ts -------> @spec-kit/mcp-server/lib/search/vector-index   [REFACTOR]
  |                            -----> @spec-kit/mcp-server/core/config              [REFACTOR]
  |
  |-- lib/retry-manager.ts ---------> @spec-kit/mcp-server/lib/providers/retry-mgr  [INVESTIGATE]
  |
  |-- memory/reindex-embeddings.ts -> ../../mcp_server/dist/* (7 modules, dynamic)   [JUSTIFIED]
  |-- memory/cleanup-orphaned.ts ---> ../../mcp_server/database/* (path only)        [REFACTOR]
  |
  |-- evals/run-perf-bench.ts ------> ../../mcp_server/lib/{search,cache,extract}/*  [JUSTIFIED]
  |-- evals/run-chk210.ts ----------> ../../mcp_server/lib/parsing/memory-parser     [CONSIDER]
  |-- evals/run-redaction-cal.ts ---> mcp_server/dist/lib/extraction/* (dynamic)     [JUSTIFIED]
  |-- evals/run-quality-legacy.ts --> mcp_server/database/* (path only)              [REFACTOR]
  |
  |-- spec-folder/folder-detect.ts -> mcp_server/{node_modules,database}/* (paths)   [REFACTOR]
  |-- spec-folder/alignment-val.ts -> mcp_server/lib/telemetry/* (file read)         [JUSTIFIED]

Legend:
  [REFACTOR]    = Should route through shared/
  [INVESTIGATE] = May be redundant with shared/
  [JUSTIFIED]   = Direct coupling is appropriate
  [CONSIDER]    = Worth evaluating for shared/ promotion
```

---

## 8. Cross-Reference: mcp_server Modules Imported by scripts/

| mcp_server Module | Imported By | Import Style |
|-------------------|-------------|--------------|
| `core/config` (DB_UPDATED_FILE) | memory-indexer.ts | `@spec-kit/mcp-server` alias |
| `lib/search/vector-index` | memory-indexer.ts, reindex-embeddings.ts | alias + typeof/dynamic |
| `lib/providers/retry-manager` | retry-manager.ts (shim) | `@spec-kit/mcp-server` alias |
| `lib/providers/embeddings` | reindex-embeddings.ts | typeof/dynamic |
| `lib/storage/checkpoints` | reindex-embeddings.ts | typeof/dynamic |
| `lib/storage/access-tracker` | reindex-embeddings.ts | typeof/dynamic |
| `lib/search/hybrid-search` | reindex-embeddings.ts | typeof/dynamic |
| `lib/search/session-boost` | run-performance-benchmarks.ts | relative import |
| `lib/search/causal-boost` | run-performance-benchmarks.ts | relative import |
| `lib/cache/cognitive/working-memory` | run-performance-benchmarks.ts | relative import |
| `lib/extraction/extraction-adapter` | run-performance-benchmarks.ts | relative import |
| `lib/extraction/redaction-gate` | run-redaction-calibration.ts | dynamic require |
| `lib/parsing/memory-parser` | run-chk210-quality-backfill.ts | require() |
| `lib/telemetry/retrieval-telemetry.ts` | alignment-validator.ts | file read (fs) |
| `core` (init, db-state) | reindex-embeddings.ts | typeof/dynamic |
| `handlers` | reindex-embeddings.ts | typeof/dynamic |
| `database/context-index.sqlite` | cleanup-orphaned-vectors.ts, folder-detector.ts, run-quality-legacy-remediation.ts | path.join |
| `node_modules/better-sqlite3` | folder-detector.ts | require via path.join |

**Total unique mcp_server modules referenced: 18**
