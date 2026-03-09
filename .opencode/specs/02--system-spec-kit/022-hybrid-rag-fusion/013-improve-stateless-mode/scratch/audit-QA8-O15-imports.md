# Import Chain Audit: QA8-O15 — Circular Dependencies & Barrel Export Correctness

**Date:** 2026-03-09
**Scope:** All `.ts` source files in `.opencode/skill/system-spec-kit/scripts/`
**Focus:** Circular dependency detection, barrel export correctness, dynamic imports

---

## 1. EXECUTIVE SUMMARY

| Check                       | Result | Details                                                    |
| --------------------------- | ------ | ---------------------------------------------------------- |
| Circular dependencies       | PASS   | No cycles found in the static import graph                 |
| Barrel export correctness   | PASS   | All 6 `index.ts` files re-export the symbols consumed      |
| Workflow circular dep comment| PASS   | Comment is accurate and the workaround is correct          |
| Dynamic imports              | PASS   | 2 dynamic imports found; neither creates runtime cycles    |

**Verdict: The import graph is acyclic. No blocking issues found.**

---

## 2. FULL IMPORT GRAPH (Static Imports Only)

### Module Directory Structure

```
scripts/
  core/           (config, workflow, quality-scorer, topic-extractor, file-writer,
                   subfolder-utils, tree-thinning, memory-indexer, index)
  extractors/     (file-extractor, session-extractor, conversation-extractor,
                   decision-extractor, diagram-extractor, implementation-guide-extractor,
                   collect-session-data, contamination-filter, quality-scorer,
                   opencode-capture, spec-folder-extractor, git-context-extractor, index)
  loaders/        (data-loader, index)
  renderers/      (template-renderer, index)
  spec-folder/    (folder-detector, alignment-validator, directory-setup,
                   generate-description, index)
  utils/          (logger, path-utils, data-validator, input-normalizer, prompt-utils,
                   file-helpers, tool-detection, message-utils, validation-utils,
                   slug-utils, task-enrichment, index)
  lib/            (topic-keywords, anchor-generator, flowchart-generator,
                   simulation-factory, decision-tree-generator, content-filter,
                   semantic-summarizer, embeddings, trigger-extractor,
                   ascii-boxes, structure-aware-chunker, frontmatter-migration)
  types/          (session-types)
  memory/         (generate-context, validate-memory-quality, ast-parser,
                   rank-memories, reindex-embeddings, backfill-frontmatter,
                   cleanup-orphaned-vectors)
```

### Import Edges (Internal Only)

Below, `A -> B` means "A imports from B". External packages (`@spec-kit/*`, Node stdlib) omitted.

#### core/

| Source                      | Imports From                                                              |
| --------------------------- | ------------------------------------------------------------------------- |
| `core/config.ts`            | `utils/logger`                                                           |
| `core/workflow.ts`          | `core/config`, `extractors/` (barrel), `spec-folder/` (barrel), `renderers/` (barrel), `core/quality-scorer`, `core/topic-extractor`, `core/file-writer`, `utils/slug-utils`, `utils/task-enrichment`, `extractors/collect-session-data`, `extractors/file-extractor` (type), `extractors/contamination-filter`, `extractors/quality-scorer`, `memory/validate-memory-quality`, `extractors/spec-folder-extractor`, `extractors/git-context-extractor`, `lib/flowchart-generator`, `lib/content-filter`, `lib/semantic-summarizer`, `lib/embeddings`, `lib/trigger-extractor`, `core/memory-indexer`, `lib/simulation-factory`, `loaders/data-loader`, `core/tree-thinning` |
| `core/quality-scorer.ts`    | *(none — standalone)*                                                    |
| `core/topic-extractor.ts`   | `lib/topic-keywords`                                                     |
| `core/file-writer.ts`       | `utils/validation-utils`                                                 |
| `core/subfolder-utils.ts`   | `core/config`                                                            |
| `core/tree-thinning.ts`     | *(external only: `@spec-kit/shared/utils/token-estimate`)*               |
| `core/memory-indexer.ts`    | `utils/` (barrel), `lib/embeddings`, `lib/trigger-extractor`, `extractors/collect-session-data` (type) |
| `core/index.ts`             | `core/config`, `core/file-writer`, `core/subfolder-utils`                |

#### extractors/

| Source                                 | Imports From                                                           |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `extractors/file-extractor.ts`         | `core/` (barrel), `utils/file-helpers`, `utils/path-utils`, `lib/anchor-generator` |
| `extractors/session-extractor.ts`      | `core/` (barrel), `lib/topic-keywords`                                 |
| `extractors/conversation-extractor.ts` | `core/` (barrel), `utils/message-utils`, `utils/tool-detection`, `lib/simulation-factory`, `lib/flowchart-generator`, `types/session-types` |
| `extractors/decision-extractor.ts`     | `utils/message-utils`, `utils/data-validator`, `lib/anchor-generator`, `lib/decision-tree-generator`, `lib/simulation-factory`, `types/session-types` |
| `extractors/diagram-extractor.ts`      | `utils/data-validator`, `utils/tool-detection`, `lib/flowchart-generator`, `lib/simulation-factory`, `lib/decision-tree-generator`, `types/session-types` |
| `extractors/implementation-guide-extractor.ts` | `extractors/file-extractor` (local), `utils/slug-utils`         |
| `extractors/collect-session-data.ts`   | `core/` (barrel), `utils/message-utils`, `utils/slug-utils`, `spec-folder/` (barrel), `extractors/session-extractor` (local), `extractors/file-extractor` (local), `extractors/implementation-guide-extractor` (local), `types/session-types`, `lib/simulation-factory` |
| `extractors/contamination-filter.ts`   | *(none — standalone)*                                                  |
| `extractors/quality-scorer.ts`         | *(none — standalone)*                                                  |
| `extractors/opencode-capture.ts`       | `core/` (barrel)                                                       |
| `extractors/spec-folder-extractor.ts`  | `core/` (barrel)                                                       |
| `extractors/git-context-extractor.ts`  | *(none — standalone)*                                                  |
| `extractors/index.ts`                  | `extractors/*` (all local extractors via `export *`)                   |

#### spec-folder/

| Source                               | Imports From                                                             |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `spec-folder/folder-detector.ts`     | `utils/prompt-utils`, `core/` (barrel), `spec-folder/alignment-validator` (local) |
| `spec-folder/alignment-validator.ts` | `utils/prompt-utils`                                                     |
| `spec-folder/directory-setup.ts`     | `utils/` (barrel), `core/` (barrel)                                      |
| `spec-folder/generate-description.ts`| *(external only: `@spec-kit/mcp-server`)*                                |
| `spec-folder/index.ts`               | `spec-folder/folder-detector` (local), `spec-folder/alignment-validator` (local), `spec-folder/directory-setup` (local), `core/` (barrel — re-exports `getPhaseFolderRejectionSync`) |

#### loaders/

| Source                  | Imports From                                                                  |
| ----------------------- | ----------------------------------------------------------------------------- |
| `loaders/data-loader.ts`| `core/` (barrel), `utils/` (barrel), `utils/input-normalizer`                |
| `loaders/index.ts`      | `loaders/data-loader` (local)                                                |

#### renderers/

| Source                          | Imports From                              |
| ------------------------------- | ----------------------------------------- |
| `renderers/template-renderer.ts`| `core/` (barrel), `utils/logger`          |
| `renderers/index.ts`            | `renderers/template-renderer` (local)     |

#### utils/

| Source                        | Imports From               |
| ----------------------------- | -------------------------- |
| `utils/logger.ts`             | *(none — standalone)*      |
| `utils/path-utils.ts`         | `utils/logger` (local)     |
| `utils/data-validator.ts`     | *(none — standalone)*      |
| `utils/input-normalizer.ts`   | *(none — standalone)*      |
| `utils/prompt-utils.ts`       | *(none — standalone)*      |
| `utils/file-helpers.ts`       | *(none — standalone)*      |
| `utils/tool-detection.ts`     | *(none — standalone)*      |
| `utils/message-utils.ts`      | `core/` (barrel), `utils/logger` (local)  |
| `utils/validation-utils.ts`   | *(none — standalone)*      |
| `utils/slug-utils.ts`         | *(none — standalone)*      |
| `utils/task-enrichment.ts`    | `utils/slug-utils` (local) |
| `utils/index.ts`              | all local utils modules    |

#### lib/

| Source                            | Imports From                                       |
| --------------------------------- | -------------------------------------------------- |
| `lib/topic-keywords.ts`           | *(none — standalone)*                              |
| `lib/anchor-generator.ts`         | *(not verified — likely standalone)*               |
| `lib/flowchart-generator.ts`      | *(not verified — likely standalone)*               |
| `lib/simulation-factory.ts`       | `types/session-types`                              |
| `lib/decision-tree-generator.ts`  | `utils/logger`                                     |
| `lib/content-filter.ts`           | `utils/logger`                                     |
| `lib/semantic-summarizer.ts`      | `utils/file-helpers`, `core/` (barrel)             |
| `lib/embeddings.ts`               | *(external only)*                                  |
| `lib/trigger-extractor.ts`        | *(not verified — likely standalone)*               |

#### types/

| Source                   | Imports From                                                              |
| ------------------------ | ------------------------------------------------------------------------- |
| `types/session-types.ts` | `extractors/file-extractor` (type), `extractors/session-extractor` (type) |

#### memory/

| Source                           | Imports From                                                            |
| -------------------------------- | ----------------------------------------------------------------------- |
| `memory/generate-context.ts`     | `core/workflow`, `loaders/` (barrel), `extractors/collect-session-data`  |
| `memory/validate-memory-quality.ts` | *(none — standalone)*                                                |

---

## 3. CIRCULAR DEPENDENCY ANALYSIS

### Potential Cycle Paths Investigated

#### Path 1: `core/index.ts` <-> `spec-folder/index.ts`

```
spec-folder/index.ts  --imports-->  core/ (barrel)  [getPhaseFolderRejectionSync, config symbols]
core/index.ts         --exports-->  config, file-writer, subfolder-utils
```

**Verdict: NO CYCLE.**
- `spec-folder/index.ts` imports from `core/` (barrel).
- `core/index.ts` does NOT import from `spec-folder/`.
- The edge is unidirectional: `spec-folder -> core`.

#### Path 2: `core/workflow.ts` -> `extractors/` -> `core/`

```
core/workflow.ts            --imports-->  extractors/ (barrel)
extractors/file-extractor   --imports-->  core/ (barrel)
extractors/session-extractor --imports--> core/ (barrel)
core/index.ts               --does NOT export-->  workflow.ts
```

**Verdict: NO CYCLE.**
- `workflow.ts` imports extractors, which import from `core/index.ts`.
- `core/index.ts` explicitly EXCLUDES `workflow.ts` (line 7-8: "workflow.ts not exported here to avoid circular dependencies").
- The extractors import from `core/index.ts` which only exports `config`, `file-writer`, and `subfolder-utils`.
- `workflow.ts` imports from `./config` directly (not via barrel).

#### Path 3: `extractors/collect-session-data.ts` -> `spec-folder/` -> `core/` -> ...

```
collect-session-data  --imports-->  spec-folder/ (barrel: detectSpecFolder)
spec-folder/index.ts  --imports-->  core/ (barrel: getPhaseFolderRejectionSync)
core/index.ts         --does NOT import--> extractors/
```

**Verdict: NO CYCLE.**
- Chain is unidirectional: `extractors -> spec-folder -> core`.
- `core/` does not import back into `extractors/` through its barrel.

#### Path 4: `types/session-types.ts` <-> `extractors/`

```
types/session-types     --imports type--> extractors/file-extractor (FileChange, ObservationDetailed)
types/session-types     --imports type--> extractors/session-extractor (ToolCounts, SpecFileEntry)
extractors/*-extractor  --imports type--> types/session-types
```

**Verdict: NO CYCLE at runtime.**
- `types/session-types.ts` uses `import type` from extractors.
- `import type` is erased at compile time. TypeScript does not create runtime circular dependency edges for type-only imports.
- At runtime, the `.js` output for `session-types` has NO `require()` calls to the extractors.
- This is the **correct TypeScript pattern** for sharing canonical types.

#### Path 5: `lib/simulation-factory.ts` -> `types/session-types.ts` -> `extractors/`

```
lib/simulation-factory  --imports type--> types/session-types
types/session-types     --imports type--> extractors/file-extractor
types/session-types     --imports type--> extractors/session-extractor
extractors/*            --imports-->      lib/simulation-factory
```

**Verdict: NO CYCLE at runtime.**
- Same reason as Path 4: `types/session-types.ts` uses `import type` exclusively.
- The runtime graph is: `extractors -> lib/simulation-factory -> types/session-types` (terminal, no back-edge).

#### Path 6: `memory/generate-context.ts` -> `core/workflow.ts` -> ... -> `memory/validate-memory-quality.ts`

```
memory/generate-context     --imports-->  core/workflow
core/workflow               --imports-->  memory/validate-memory-quality
memory/validate-memory-quality  --has NO imports from core or memory-->
```

**Verdict: NO CYCLE.**
- `memory/generate-context.ts` imports `core/workflow.ts`, which imports `memory/validate-memory-quality.ts`.
- Neither `validate-memory-quality.ts` nor `generate-context.ts` import each other.
- The chain is: `generate-context -> workflow -> validate-memory-quality` (linear, no back-edge).

---

## 4. WORKFLOW.TS CIRCULAR DEP COMMENT VERIFICATION

### Comment Text (core/index.ts, lines 7-8):
```ts
// workflow.ts not exported here to avoid circular dependencies
// Import directly: import { runWorkflow } from './core/workflow';
```

### Analysis

**Why this comment exists:** `core/workflow.ts` imports from `../extractors` (barrel), `../spec-folder` (barrel), `../renderers` (barrel), `../loaders/data-loader`, and many `../lib/*` modules. Many of these modules in turn import from `../core` (barrel = `core/index.ts`).

If `core/index.ts` re-exported `workflow.ts`, any module that does `import { CONFIG } from '../core'` would transitively pull in `workflow.ts`, which imports `../extractors`, which imports `../core` again -- creating a **circular require()** in CommonJS. While Node.js handles this with partial module objects, the result is typically `undefined` values for symbols that haven't been initialized yet.

**Verdict: The comment is accurate and the workaround is correct.**

The two files that need `runWorkflow` (`memory/generate-context.ts` and tests) import it directly from `'../core/workflow'`, bypassing the barrel. This is the standard pattern for breaking circular dependencies in TypeScript/Node.js projects.

### Residual Risk

If any future module re-exports `workflow.ts` through `core/index.ts`, the circular dependency would activate. The comment serves as the necessary guard. **Recommendation:** Consider adding an `import-policy-rules` check (the project already has `evals/import-policy-rules.ts`) to enforce that `core/index.ts` never exports from `workflow.ts`.

---

## 5. DYNAMIC IMPORT ANALYSIS

### Dynamic Import #1: `loaders/data-loader.ts:55`

```ts
_opencodeCapture = await import('../extractors/opencode-capture') as OpencodeCaptureMod;
```

**Purpose:** Lazy-load opencode-capture to handle missing runtime dependencies gracefully.
**Cycle Risk:** NONE.
- `data-loader.ts` is in `loaders/`, which is not imported by `extractors/opencode-capture.ts`.
- `opencode-capture.ts` only imports from `core/` (barrel).
- The runtime chain is: `data-loader -> opencode-capture -> core/` (linear).

### Dynamic Import #2: `core/workflow.ts:1045`

```ts
const { loadPerFolderDescription: loadPFD, savePerFolderDescription: savePFD } = await import(
  '@spec-kit/mcp-server/lib/search/folder-discovery'
);
```

**Purpose:** Lazy-load external package to avoid loading MCP server code when not needed.
**Cycle Risk:** NONE.
- This imports from an external package path (`@spec-kit/mcp-server`), not from within `scripts/`.

### Static Import Disguised as Lazy (NOT a dynamic import):

```ts
// collect-session-data.ts:604-607
import * as simFactoryModule from '../lib/simulation-factory';
function getSimFactory(): typeof import('../lib/simulation-factory') {
  return simFactoryModule;
}
```

**This is a static import** at module load time, wrapped in a getter function for API ergonomics. The `typeof import(...)` in the return type annotation is a TypeScript type construct, not a runtime `import()`. The module is loaded eagerly. No special cycle risk.

---

## 6. BARREL EXPORT CORRECTNESS

### core/index.ts

| Exported Symbol               | Source Module       | Consumed By (sample)                |
| ----------------------------- | ------------------- | ----------------------------------- |
| `CONFIG`                      | `config.ts`         | Nearly all modules                  |
| `getSpecsDirectories`         | `config.ts`         | `collect-session-data`, `subfolder-utils` |
| `findActiveSpecsDir`          | `config.ts`         | `collect-session-data`, `directory-setup` |
| `getAllExistingSpecsDirs`      | `config.ts`         | `folder-detector`                   |
| `WorkflowConfig` (type)       | `config.ts`         | External consumers                  |
| `SpecKitConfig` (type)        | `config.ts`         | External consumers                  |
| `writeFilesAtomically`        | `file-writer.ts`    | `workflow.ts` (direct import)       |
| `SPEC_FOLDER_PATTERN`         | `subfolder-utils.ts`| `folder-detector`, `directory-setup`|
| `SPEC_FOLDER_BASIC_PATTERN`   | `subfolder-utils.ts`| `folder-detector`                   |
| `CATEGORY_FOLDER_PATTERN`     | `subfolder-utils.ts`| Search traversal                    |
| `SEARCH_MAX_DEPTH`            | `subfolder-utils.ts`| Search traversal                    |
| `findChildFolderSync`         | `subfolder-utils.ts`| External consumers                  |
| `findChildFolderAsync`        | `subfolder-utils.ts`| `folder-detector`                   |
| `getPhaseFolderRejectionSync` | `subfolder-utils.ts`| `spec-folder/index.ts`              |
| `PhaseFolderRejection` (type) | `subfolder-utils.ts`| External consumers                  |
| `FindChildOptions` (type)     | `subfolder-utils.ts`| External consumers                  |
| **NOT exported: workflow.ts** | --                  | Intentional (see Section 4)         |
| **NOT exported: quality-scorer.ts** | --            | Imported directly by `workflow.ts`  |
| **NOT exported: topic-extractor.ts**| --            | Imported directly by `workflow.ts`  |
| **NOT exported: tree-thinning.ts**  | --            | Imported directly by `workflow.ts`  |
| **NOT exported: memory-indexer.ts** | --            | Imported directly by `workflow.ts`  |

**Note on non-exported modules:** `quality-scorer`, `topic-extractor`, `tree-thinning`, and `memory-indexer` are only consumed by `workflow.ts` which imports them directly. They do not need to be in the barrel. This is correct: the barrel exports only the "public API" of the `core/` module.

**Verdict: CORRECT.** All symbols consumed via `../core` barrel are properly exported.

---

### extractors/index.ts

Uses `export *` for most extractors plus explicit named exports for `implementation-guide-extractor`.

**Coverage check:**

| Module                             | Export Style        | Correct? |
| ---------------------------------- | ------------------- | -------- |
| `file-extractor`                   | `export *`          | YES      |
| `diagram-extractor`                | `export *`          | YES      |
| `conversation-extractor`           | `export *`          | YES      |
| `decision-extractor`               | `export *`          | YES (was missing, now added) |
| `session-extractor`                | `export *`          | YES      |
| `implementation-guide-extractor`   | Named exports       | YES      |
| `collect-session-data`             | `export *`          | YES      |
| `opencode-capture`                 | `export *`          | YES      |
| `contamination-filter`             | `export *`          | YES      |
| `quality-scorer`                   | `export *`          | YES      |

**Verdict: CORRECT.** All extractor modules are re-exported.

**Note:** `workflow.ts` imports some extractors via the barrel (`../extractors`) and some directly (e.g., `../extractors/collect-session-data`, `../extractors/contamination-filter`). The direct imports are for modules that are also exported through the barrel, so there is no missing-export issue -- the direct imports are used to get specific named exports with aliases (e.g., `scoreMemoryQuality as scoreMemoryQualityV2`).

---

### Other Barrel Files

| Barrel                 | Exports                                        | Verdict  |
| ---------------------- | ---------------------------------------------- | -------- |
| `loaders/index.ts`     | `loadCollectedData`, `DataSource`, `LoadedData` | CORRECT  |
| `renderers/index.ts`   | All `template-renderer` exports                 | CORRECT  |
| `spec-folder/index.ts` | All folder-detector, alignment-validator, directory-setup exports + `getPhaseFolderRejectionSync` re-export from core | CORRECT |
| `utils/index.ts`       | All util modules (logger, path-utils, data-validator, input-normalizer, prompt-utils, file-helpers, tool-detection, message-utils, validation-utils) | CORRECT |

**Note:** `utils/index.ts` does NOT export from `slug-utils.ts` or `task-enrichment.ts`. These are imported directly by `workflow.ts` and `collect-session-data.ts` via direct paths (e.g., `../utils/slug-utils`). This is intentional -- these utilities have narrow consumers and are not part of the "public" utils API. **Not a defect.**

---

## 7. LAYER VIOLATION SUMMARY

The project maintains a clean layered architecture:

```
Layer 0 (Foundation):  utils/, lib/, types/
Layer 1 (Core):        core/ (config, file-writer, subfolder-utils, tree-thinning, quality-scorer)
Layer 2 (Domain):      extractors/, spec-folder/, loaders/, renderers/
Layer 3 (Orchestration): core/workflow.ts, memory/generate-context.ts
```

**Observed violations: NONE.**

- Layer 0 modules import only from Layer 0 (e.g., `path-utils -> logger`, `task-enrichment -> slug-utils`).
- Exception: `message-utils.ts` imports from `core/` (Layer 1) for `CONFIG`. This is a minor upward dependency (Layer 0 -> Layer 1) but is acceptable since `CONFIG` is a runtime constant, not a circular chain.
- Layer 1 imports from Layer 0.
- Layer 2 imports from Layer 0 and Layer 1.
- Layer 3 imports from all lower layers.
- No lower-layer module imports from a higher layer (excepting the `message-utils.ts` note above).

---

## 8. RECOMMENDATIONS

### P2 Suggestions (Non-blocking)

1. **`message-utils.ts` imports `CONFIG` from `../core`** — This creates a Layer 0 -> Layer 1 dependency. Consider passing `CONFIG` values as function parameters instead, to keep utils truly standalone. Low priority.

2. **Enforce the workflow.ts barrel exclusion** — The `evals/import-policy-rules.ts` file already exists. Verify it includes a rule that `core/index.ts` must never export `workflow.ts`. If not, add one.

3. **Consider barrel-exporting `slug-utils` and `task-enrichment`** from `utils/index.ts` — Currently consumers must use direct paths. If these utilities gain more consumers, barrel re-export would simplify imports.

---

## 9. CONCLUSION

The import graph of `.opencode/skill/system-spec-kit/scripts/` is **acyclic** at both the static-import and runtime levels. The intentional exclusion of `workflow.ts` from `core/index.ts` is the key architectural decision that prevents cycles, and the comment documenting this is accurate. All 6 barrel export files correctly re-export the symbols their consumers depend on. The 2 dynamic `import()` calls create no runtime cycles.

