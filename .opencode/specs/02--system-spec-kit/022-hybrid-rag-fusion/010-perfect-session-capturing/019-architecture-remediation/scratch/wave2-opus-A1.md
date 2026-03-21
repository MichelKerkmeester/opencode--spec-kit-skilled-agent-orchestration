# Wave 2 - OPUS-A1: Architecture Boundary Analysis
Date: 2026-03-21

## Methodology

Analyzed all `import` and `require` statements across 11 subsystems under `.opencode/skill/system-spec-kit/scripts/` plus cross-boundary imports between `scripts/` and `mcp_server/handlers/`. Used Grep to extract every import path and mapped source-subsystem to target-subsystem to build a complete dependency matrix.

## Subsystem File Counts

| Subsystem     | .ts files | Barrel (index.ts) |
|---------------|-----------|-------------------|
| core/         | 9         | Yes               |
| extractors/   | 18        | Yes               |
| lib/          | 17        | No                |
| utils/        | 19        | Yes               |
| memory/       | 8         | No                |
| renderers/    | 2         | Yes               |
| spec-folder/  | 5         | Yes               |
| types/        | 1         | No (single file)  |
| loaders/      | 2         | Yes               |
| config/       | 1         | Yes (facade)      |
| evals/        | 13        | No                |

## Dependency Matrix

Rows = importing subsystem, Columns = imported subsystem. Numbers show distinct import statements (type-only imports counted but marked).

|              | types | utils | lib | core | config | extractors | spec-folder | renderers | loaders | memory | evals | mcp_server |
|--------------|-------|-------|-----|------|--------|------------|-------------|-----------|---------|--------|-------|------------|
| **types**    | -     | 0     | 0   | 0    | 0      | 0          | 0           | 0         | 0       | 0      | 0     | 0          |
| **utils**    | 4T    | -     | 2*  | 0    | 0      | 0          | 0           | 0         | 0       | 0      | 0     | 0          |
| **lib**      | 2T    | 7     | -   | 1!   | 0      | 0          | 0           | 0         | 0       | 0      | 0     | 0          |
| **config**   | 0     | 0     | 0   | 1    | -      | 0          | 0           | 0         | 0       | 0      | 0     | 0          |
| **core**     | 2T    | 9     | 10  | -    | 0      | 10         | 1           | 1         | 1       | 0      | 0     | 2          |
| **extractors** | 1T  | 18    | 7   | 0    | 6      | -          | 1           | 0         | 0       | 0      | 0     | 0          |
| **spec-folder** | 1T | 3     | 1   | 2    | 0      | 0          | -           | 0         | 0       | 0      | 0     | 0          |
| **renderers**| 0     | 1     | 0   | 1!   | 0      | 0          | 0           | -         | 0       | 0      | 0     | 0          |
| **loaders**  | 0     | 2     | 0   | 1    | 0      | 0          | 0           | 0         | -       | 0      | 0     | 0          |
| **memory**   | 0     | 0     | 1   | 1    | 0      | 1          | 0           | 0         | 1       | -      | 0     | 1!         |
| **evals**    | 0     | 0     | 0   | 0    | 0      | 0          | 0           | 0         | 0       | 0      | -     | 0          |

Legend: T = type-only imports, * = re-export shims (layer violation), ! = flagged as violation/concern

Notes:
- `config/` is a facade that re-exports from `core/config.ts` — it exists specifically to break upward dependencies. Files importing from `../config` are correctly decoupled.
- `evals/` is fully self-contained (only stdlib + external packages).
- `types/` is a true leaf — imports nothing from scripts/.
- Numbers exclude `@spec-kit/shared/` imports (cross-package, not cross-subsystem).

## Expected Layering Rules

```
LAYER 0 (leaf):   types/          ← imports nothing from scripts/
LAYER 1 (leaf):   utils/          ← should only import from types/
LAYER 1b (facade): config/        ← re-exports from core/config.ts
LAYER 2:          lib/            ← can import from utils/, types/
LAYER 3:          core/           ← can import from lib/, utils/, types/, config/
LAYER 3:          extractors/     ← can import from lib/, utils/, types/, config/
LAYER 3:          spec-folder/    ← can import from lib/, utils/, types/, config/
LAYER 3:          renderers/      ← can import from lib/, utils/, types/, config/
LAYER 3:          loaders/        ← can import from lib/, utils/, types/, config/
LAYER 4:          memory/         ← can import from core/, extractors/, lib/, utils/, loaders/
LAYER 4:          evals/          ← standalone (no scripts/ imports)
```

## Findings

### CIRCULAR DEPENDENCIES

---

**FINDING-OPUS-A1-001** | **HIGH** | **CIRCULAR_DEP** | `lib/semantic-summarizer.ts:14` → `core/` and `core/workflow.ts:60` → `lib/semantic-summarizer`

**Description:** Bidirectional dependency between `lib/` and `core/` subsystems.

**Evidence:**
- `lib/semantic-summarizer.ts:14` — `import { CONFIG } from '../core';`
- `core/workflow.ts:60` — `} from '../lib/semantic-summarizer';`

The cycle is: `core/workflow.ts` → `lib/semantic-summarizer.ts` → `core/index.ts` → `core/config.ts`. At runtime Node resolves this because `core/index.ts` only re-exports from `config.ts` (which has no circular back-ref), so it works by accident. But structurally, `lib/` should NOT depend on `core/`.

**Recommended Fix:** `lib/semantic-summarizer.ts` should import CONFIG from `../config` (the facade module) instead of `../core`. This breaks the structural cycle and follows the same pattern already used by extractors.

---

**FINDING-OPUS-A1-002** | **HIGH** | **CIRCULAR_DEP** | `renderers/template-renderer.ts:15` → `core/` and `core/workflow.ts:24` → `renderers/`

**Description:** Bidirectional dependency between `renderers/` and `core/` subsystems.

**Evidence:**
- `renderers/template-renderer.ts:15` — `import { CONFIG } from '../core';`
- `core/workflow.ts:24` — `import { populateTemplate } from '../renderers';`

The cycle is: `core/workflow.ts` → `renderers/index.ts` → `renderers/template-renderer.ts` → `core/index.ts`. Same pattern as FINDING-001 — works at runtime because CONFIG resolves without back-reference, but structurally incorrect.

**Recommended Fix:** `renderers/template-renderer.ts` should import CONFIG from `../config` instead of `../core`.

---

**FINDING-OPUS-A1-003** | **HIGH** | **CIRCULAR_DEP** | `spec-folder/folder-detector.ts:22` → `core/` and `core/workflow.ts:23` → `spec-folder/`

**Description:** Bidirectional dependency between `spec-folder/` and `core/` subsystems.

**Evidence:**
- `spec-folder/folder-detector.ts:22` — `import { CONFIG, findActiveSpecsDir, getAllExistingSpecsDirs, SPEC_FOLDER_PATTERN, findChildFolderAsync } from '../core';`
- `spec-folder/directory-setup.ts:16` — `import { CONFIG, findActiveSpecsDir, getSpecsDirectories, SPEC_FOLDER_PATTERN } from '../core';`
- `core/workflow.ts:23` — `import { detectSpecFolder, setupContextDirectory } from '../spec-folder';`

This cycle involves value imports (not just types), making it higher risk. Node's module resolution may partially initialize one module when the other loads.

**Recommended Fix:** `spec-folder/` files should import CONFIG and spec-directory utilities from `../config` instead of `../core`. The `config/` facade already re-exports `CONFIG`, `findActiveSpecsDir`, `getSpecsDirectories`, and `getAllExistingSpecsDirs`. However, `SPEC_FOLDER_PATTERN`, `findChildFolderAsync`, and `findChildFolderSync` are exported from `core/subfolder-utils.ts` and NOT from `config/`. Either (a) add these to `config/index.ts`, or (b) create a separate `config/subfolder-utils.ts` re-export facade.

---

**FINDING-OPUS-A1-004** | **MEDIUM** | **CIRCULAR_DEP** | `loaders/data-loader.ts:17` → `core/` and `core/workflow.ts:80` → `loaders/data-loader`

**Description:** Bidirectional dependency between `loaders/` and `core/`.

**Evidence:**
- `loaders/data-loader.ts:17` — `import { CONFIG } from '../core';`
- `core/workflow.ts:80` — `import { loadCollectedData as loadCollectedDataFromLoader } from '../loaders/data-loader';`

Same CONFIG-through-core-barrel pattern. Lower severity because the loader is only called at runtime startup, reducing initialization race risk.

**Recommended Fix:** `loaders/data-loader.ts` should import CONFIG from `../config` instead of `../core`.

---

### LAYER VIOLATIONS

---

**FINDING-OPUS-A1-005** | **MEDIUM** | **LAYER_VIOLATION** | `utils/phase-classifier.ts:10-15` → `lib/phase-classifier`

**Description:** utils/ (Layer 1 leaf) imports from lib/ (Layer 2), violating the leaf constraint.

**Evidence:**
```
utils/phase-classifier.ts:10: } from '../lib/phase-classifier';
utils/phase-classifier.ts:15: } from '../lib/phase-classifier';
```

This is a re-export shim preserving backward compatibility after the canonical implementation moved to `lib/`. While the shim pattern is documented, it structurally inverts the dependency direction.

**Recommended Fix:** This is an acknowledged migration artifact. The long-term fix is to update all consumers to import directly from `lib/phase-classifier` (1 consumer: `extractors/conversation-extractor.ts:13`) and then delete the shim. LOW urgency because the shim introduces no behavior, only re-exports.

---

**FINDING-OPUS-A1-006** | **MEDIUM** | **LAYER_VIOLATION** | `utils/memory-frontmatter.ts:16` → `lib/memory-frontmatter`

**Description:** utils/ (Layer 1 leaf) imports from lib/ (Layer 2), violating the leaf constraint.

**Evidence:**
```
utils/memory-frontmatter.ts:7-16: exports re-exported from '../lib/memory-frontmatter'
```

Same re-export shim pattern as FINDING-005. Consumer: `core/workflow.ts:34` imports `deriveMemoryDescription` from `../utils/memory-frontmatter`.

**Recommended Fix:** Update `core/workflow.ts` to import from `../lib/memory-frontmatter` directly, then delete the shim. LOW urgency.

---

**FINDING-OPUS-A1-007** | **HIGH** | **LAYER_VIOLATION** | `core/workflow.ts` imports from 6 distinct subsystems

**Description:** `core/workflow.ts` is a "God module" that directly imports from extractors/, lib/, utils/, spec-folder/, renderers/, loaders/, types/, AND @spec-kit/mcp-server/. It has 34 cross-subsystem import statements (excluding same-module and stdlib).

**Evidence:**
- `extractors/`: 10 imports (collect-session-data, file-extractor, contamination-filter, quality-scorer, spec-folder-extractor, git-context-extractor + barrel)
- `lib/`: 8 imports (semantic-summarizer, flowchart-generator, content-filter, embeddings, trigger-extractor, simulation-factory, validate-memory-quality)
- `utils/`: 7 imports (slug-utils, task-enrichment, spec-affinity, memory-frontmatter, logger, source-capabilities)
- `spec-folder/`: 1 (barrel)
- `renderers/`: 1 (barrel)
- `loaders/`: 1 (data-loader direct)
- `types/`: 2 (session-types)
- `@spec-kit/mcp-server/`: 1 (api/providers)
- `@spec-kit/shared/`: 4 (memory-sufficiency, path-security, memory-template-contract, spec-doc-health)

As the main orchestrator, broad imports are expected, but the combination with circular deps (findings 001-004) and direct module imports (bypassing barrels) creates a fragile dependency web.

**Recommended Fix:** (1) Fix circular deps first (findings 001-004). (2) Consider whether `core/workflow.ts` should import from barrel exports only (extractors/, lib/) rather than individual files. (3) The direct loaders/data-loader import should go through the barrel.

---

**FINDING-OPUS-A1-008** | **MEDIUM** | **LAYER_VIOLATION** | `core/workflow.ts:35-42,48-49` bypasses extractors/ barrel

**Description:** `core/workflow.ts` imports from 6 individual extractor files directly instead of using the `extractors/` barrel export.

**Evidence:**
- `core/workflow.ts:35` — `import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';`
- `core/workflow.ts:36` — `import type { CollectedDataFull } from '../extractors/collect-session-data';`
- `core/workflow.ts:37` — `import type { SemanticFileInfo } from '../extractors/file-extractor';`
- `core/workflow.ts:38` — `import { filterContamination, ... } from '../extractors/contamination-filter';`
- `core/workflow.ts:40-42` — `import { scoreMemoryQuality, ... } from '../extractors/quality-scorer';`
- `core/workflow.ts:48` — `import { extractSpecFolderContext } from '../extractors/spec-folder-extractor';`
- `core/workflow.ts:49` — `import { extractGitContext } from '../extractors/git-context-extractor';`

Yet line 17-22 also imports from the barrel: `from '../extractors'`. Mixed barrel/direct imports create ambiguity about which path is canonical.

**Recommended Fix:** Consolidate into barrel-only imports from `../extractors`. The barrel already re-exports all these modules. If tree-shaking is a concern, that's a build-system issue, not an architecture issue.

---

**FINDING-OPUS-A1-009** | **LOW** | **LAYER_VIOLATION** | `core/memory-indexer.ts:20` imports type directly from extractors/

**Description:** `core/memory-indexer.ts` imports `CollectedDataFull` type directly from `extractors/collect-session-data` instead of through the barrel.

**Evidence:**
- `core/memory-indexer.ts:20` — `import type { CollectedDataFull } from '../extractors/collect-session-data';`

The extractors barrel (`extractors/index.ts:34`) already re-exports `* from './collect-session-data'`.

**Recommended Fix:** Change to `import type { CollectedDataFull } from '../extractors';`

---

### CROSS-BOUNDARY COUPLING

---

**FINDING-OPUS-A1-010** | **MEDIUM** | **COUPLING** | `memory/rebuild-auto-entities.ts:25` → `mcp_server/lib/` via require()

**Description:** scripts/memory/ reaches into mcp_server/ internals via a dynamic `require()`.

**Evidence:**
```
memory/rebuild-auto-entities.ts:25:
const { rebuildAutoEntities } = require('../../mcp_server/lib/extraction/entity-extractor')
```

This is documented in `import-policy-allowlist.json` (entry 4, expires 2026-06-15) but remains an architecture violation — scripts should not import from mcp_server internals.

**Recommended Fix:** Already tracked. Expose `rebuildAutoEntities` via `@spec-kit/mcp-server/api/` surface, then remove the direct require.

---

**FINDING-OPUS-A1-011** | **LOW** | **COUPLING** | `core/workflow.ts:62` → `@spec-kit/mcp-server/api/providers`

**Description:** scripts/core/ imports from mcp_server API surface.

**Evidence:**
- `core/workflow.ts:62` — `import { retryManager } from '@spec-kit/mcp-server/api/providers';`

This uses the `api/` public surface (not `lib/` internals), which is the intended boundary. However, a core orchestration module depending on an MCP server API creates a tight coupling between the CLI pipeline and the server runtime.

**Recommended Fix:** Consider whether `retryManager` should be extracted to `@spec-kit/shared/` since it's needed by both scripts and handlers. LOW priority — the current coupling is through the public API.

---

**FINDING-OPUS-A1-012** | **LOW** | **COUPLING** | `core/memory-indexer.ts:17` → `@spec-kit/mcp-server/api/search`

**Description:** scripts/core/ imports vector search from mcp_server API surface.

**Evidence:**
- `core/memory-indexer.ts:17` — `import { vectorIndex } from '@spec-kit/mcp-server/api/search';`

Same pattern as FINDING-011 — public API surface, but creates runtime coupling.

**Recommended Fix:** Consider extracting vector indexing to `@spec-kit/shared/`. LOW priority.

---

### BARREL EXPORT GAPS

---

**FINDING-OPUS-A1-013** | **LOW** | **BARREL_GAP** | `utils/index.ts` missing `toCanonicalRelativePath`

**Description:** `toCanonicalRelativePath` is exported from `utils/file-helpers.ts` but not re-exported via the `utils/index.ts` barrel.

**Evidence:**
- Consumer: `extractors/spec-folder-extractor.ts:20` — `import { toCanonicalRelativePath } from '../utils/file-helpers';`
- Not in `utils/index.ts` — only `toRelativePath`, `getDescriptionTierRank`, `validateDescription`, `isDescriptionValid`, `cleanDescription` are re-exported from file-helpers.

**Recommended Fix:** Add `toCanonicalRelativePath` to `utils/index.ts` re-exports from `./file-helpers`, then update the consumer to import from `../utils`.

---

**FINDING-OPUS-A1-014** | **LOW** | **BARREL_GAP** | `extractors/index.ts:14` re-exports from `lib/` subsystem

**Description:** The extractors barrel re-exports `lib/session-activity-signal` which crosses subsystem boundaries.

**Evidence:**
- `extractors/index.ts:14` — `export * from '../lib/session-activity-signal';`

This means consumers importing from `../extractors` get symbols that canonically live in `lib/`. This blurs the boundary between extractors and lib.

**Recommended Fix:** Remove the cross-subsystem re-export. The existing `extractors/session-activity-signal.ts` shim (which also re-exports from lib/) provides backward compatibility for direct importers. Consumers should import `buildSessionActivitySignal` from `../lib/session-activity-signal` or from the `extractors/session-activity-signal` shim, not from the barrel.

---

**FINDING-OPUS-A1-015** | **LOW** | **BARREL_GAP** | `lib/` has no barrel index.ts

**Description:** The `lib/` subsystem (17 files) has no `index.ts` barrel export. All consumers must import from individual files.

**Evidence:** No `lib/index.ts` found. All imports use direct paths like `../lib/semantic-signal-extractor`, `../lib/content-filter`, etc.

**Recommended Fix:** Create `lib/index.ts` with re-exports of the public API surface. This enables consumers to use `from '../lib'` and makes it possible to enforce which symbols are public. MEDIUM urgency — this is the largest subsystem without a barrel.

---

## Summary Statistics

| Category        | CRITICAL | HIGH | MEDIUM | LOW | Total |
|-----------------|----------|------|--------|-----|-------|
| CIRCULAR_DEP    | 0        | 3    | 1      | 0   | 4     |
| LAYER_VIOLATION | 0        | 1    | 3      | 1   | 5     |
| COUPLING        | 0        | 0    | 1      | 2   | 3     |
| BARREL_GAP      | 0        | 0    | 0      | 3   | 3     |
| **Total**       | **0**    | **4**| **5**  | **6**| **15**|

## Quick-Fix Priority (effort vs impact)

| Priority | Findings | Fix | Effort |
|----------|----------|-----|--------|
| **P1**   | 001, 002, 004 | Change `from '../core'` to `from '../config'` in 3 files | ~5 min each |
| **P2**   | 003      | Same as P1 + add subfolder-utils re-exports to config/ | ~15 min |
| **P3**   | 008, 009 | Consolidate barrel imports in core/workflow.ts and core/memory-indexer.ts | ~20 min |
| **P4**   | 013, 015 | Add barrel gaps (utils/ re-export + lib/index.ts) | ~30 min |
| **P5**   | 005, 006, 014 | Remove re-export shims after consumer migration | ~15 min |
| **Tracked** | 007, 010, 011, 012 | Larger refactors (God module, mcp-server coupling) | Hours |

## Positive Observations

1. **utils/ is a clean leaf layer** — Only imports from types/ (4 type-only imports). The 2 re-export shims (phase-classifier, memory-frontmatter) are documented migration artifacts.
2. **types/ is a true root** — Zero imports from scripts/ subsystems.
3. **config/ facade works correctly** — 6 extractor files properly use `../config` instead of `../core`, breaking the upward dependency as intended.
4. **No extractors↔spec-folder circular** — extractors/collect-session-data.ts imports from spec-folder/ but spec-folder/ does NOT import from extractors/.
5. **MCP handlers are decoupled** — No `mcp_server/handlers/` file imports directly from `scripts/` subsystems (confirmed zero matches).
6. **evals/ is fully self-contained** — No imports from any scripts/ subsystem.
7. **import-policy-allowlist.json** is maintained with expiry dates for known cross-boundary exceptions.
8. **Existing architecture enforcement** (check-architecture-boundaries.ts) covers shared/ neutrality and mcp_server/scripts/ wrapper rules.
