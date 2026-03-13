# Phase 3-4 Readiness Assessment — 010 Spec Descriptions

Overall assessment: **partially ready, with important caveats**. The codebase already contains most of the Phase 3-4 plumbing, but some task targets are out of date, one requested helper name does not exist under that exact API, and Phase 4 staleness detection is not fully aligned with the plan.

## File Inventory
| File | Exists | Relevant Functions | Notes |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts` | Yes | `generateContentSlug()`, `pickBestContentName()`, `ensureUniqueMemoryFilename()` | No `ensureUniqueSlug()` export. Current helper already resolves collisions by scanning `*.md`, appending `-1..-100`, then reserving a random `crypto.randomBytes(6)` fallback candidate. |
| `.opencode/skill/system-spec-kit/scripts/workflow.ts` | No | — | Actual file is `scripts/core/workflow.ts`. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Yes | Uses `ensureUniqueMemoryFilename()`; updates `memorySequence` / `memoryNameHistory` after writes | Integration already exists at the workflow layer. |
| `.opencode/skill/system-spec-kit/scripts/utils/folder-discovery.ts` | No | — | Actual implementation lives in `mcp_server/lib/search/folder-discovery.ts`, not under `scripts/utils/`. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Yes | `PerFolderDescription`, `generateFolderDescriptions()`, `generatePerFolderDescription()`, `loadPerFolderDescription()`, `savePerFolderDescription()`, `isPerFolderDescriptionStale()`, `isCacheStale()`, `ensureDescriptionCache()` | This is the real Phase 4 integration surface. Aggregation already prefers per-folder `description.json` when fresh. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` | Yes | CLI wrapper around `generatePerFolderDescription()` / `savePerFolderDescription()` | Only `*description*.ts/js` file found under `scripts/`. |
| `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts` | Yes | `writeFilesAtomically()`, `checkForDuplicateContent()` | Has overwrite warning, but does not hard-block existing filenames or use exclusive create semantics. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts` | Yes | Inline `ensureUniqueMemoryFilename()` test copy | Test coverage exists, but it mirrors the production function instead of importing it. |

## Phase 3 Tasks

### Task: ensureUniqueSlug()
- **Target:** `scripts/utils/slug-utils.ts`
- **Status:** EXISTS_UNDER_DIFFERENT_NAME
- **What exists now:** `ensureUniqueMemoryFilename(contextDir, filename)` already implements collision resolution with sequential suffixes and a reserved random `crypto.randomBytes(6)` fallback candidate.
- **Integration points:** Imported and used by `scripts/core/workflow.ts` before final `ctxFilename` is assigned.
- **Assessment:** The behavior mostly exists already; the gap is API shape/naming, not core logic.
- **Effort:** **S**

### Task: collision retry guardrails
- **Target:** `scripts/utils/slug-utils.ts`
- **Status:** EXISTS
- **What exists now:** Retry loop is capped at 100 attempts, then reserves a random 12-character hex candidate from `crypto.randomBytes(6)` using exclusive-create semantics.
- **Integration points:** No additional integration required unless the helper is renamed to `ensureUniqueSlug()`.
- **Assessment:** Implemented.
- **Effort:** **S**

### Task: workflow.ts integration
- **Target:** `scripts/core/workflow.ts`
- **Status:** EXISTS
- **What exists now:** Workflow generates `rawCtxFilename` and immediately passes it through `ensureUniqueMemoryFilename()` before writing files.
- **Integration points:** `slug-utils.ts`, `file-writer.ts`, and the generated `ctxFilename` consumers later in the workflow.
- **Assessment:** Already wired. If the team still wants the `ensureUniqueSlug(contextDir, baseSlug, dateTime)` API from the plan, this is a small adaptation rather than a new integration.
- **Effort:** **S**

### Task: memorySequence counter
- **Target:** `scripts/core/workflow.ts` + `mcp_server/lib/search/folder-discovery.ts`
- **Status:** EXISTS
- **What exists now:** After successful writes, workflow dynamically loads per-folder description helpers, increments `memorySequence`, appends the current filename to `memoryNameHistory`, and saves the updated `description.json`.
- **Integration points:** Requires `description.json` to exist and uses `loadPerFolderDescription()` / `savePerFolderDescription()`.
- **Assessment:** Already implemented as best-effort tracking.
- **Effort:** **S**

### Task: memoryNameHistory ring buffer
- **Target:** `scripts/core/workflow.ts`
- **Status:** EXISTS
- **What exists now:** Workflow keeps the last 20 entries by slicing the prior history to 19 items and appending the newest filename.
- **Integration points:** Same as `memorySequence`.
- **Assessment:** Already implemented.
- **Effort:** **S**

### Task: atomic writer overwrite defense
- **Target:** `scripts/core/file-writer.ts`
- **Status:** PARTIAL
- **What exists now:** `writeFilesAtomically()` warns if the target filename already exists, but still writes via temp file + rename, so an existing file can still be replaced.
- **Integration points:** Called by workflow before the description tracking update.
- **Assessment:** Best-effort collision avoidance is present upstream, but defense-in-depth is incomplete here.
- **Effort:** **M**

### Task: rapid-save / collision tests
- **Target:** `mcp_server/tests/slug-uniqueness.vitest.ts` and workflow/integration tests
- **Status:** PARTIAL
- **What exists now:** There is a dedicated slug uniqueness test file covering no-collision, first collision, incrementing suffixes, and 10 identical inputs.
- **Integration points:** Current test file uses an inline copy of the helper logic instead of importing the production function, and it does not exercise the full workflow write path.
- **Assessment:** Logic coverage exists, but end-to-end confidence is weaker than the checklist/task wording implies.
- **Effort:** **M**

## Phase 4 Tasks

### Task: aggregation refactor
- **Target:** `mcp_server/lib/search/folder-discovery.ts`
- **Status:** EXISTS
- **What exists now:** `generateFolderDescriptions()` already prefers per-folder `description.json` when present and fresh; stale/corrupt existing files are repaired during discovery, while missing files fall back to `spec.md` extraction without implicit writes.
- **Integration points:** `loadPerFolderDescription()`, `isPerFolderDescriptionStale()`, `_processSpecFolder()`.
- **Assessment:** This refactor is already in place.
- **Effort:** **S**

### Task: ensureDescriptionCache() compatibility
- **Target:** `mcp_server/lib/search/folder-discovery.ts`
- **Status:** EXISTS
- **What exists now:** `ensureDescriptionCache()` still loads `descriptions.json`, checks staleness, regenerates via `generateFolderDescriptions()`, and saves the aggregate to the base-path cache location.
- **Integration points:** `loadDescriptionCache()`, `isCacheStale()`, `saveDescriptionCache()`.
- **Assessment:** Consumer-facing shape appears preserved.
- **Effort:** **S**

### Task: stale detection for new architecture
- **Target:** `mcp_server/lib/search/folder-discovery.ts`
- **Status:** PARTIAL
- **What exists now:** `isPerFolderDescriptionStale()` correctly compares `description.json` vs `spec.md` for a single folder. However, `isCacheStale()` only compares the aggregate cache timestamp against discovered `spec.md` mtimes and folder membership; it does **not** incorporate per-folder `description.json` mtimes into the cache-level stale check.
- **Integration points:** `collectDiscoveredSpecState()` is the key place that would need expansion.
- **Assessment:** This is the clearest remaining Phase 4 gap.
- **Effort:** **M**

### Task: no-per-folder backward compatibility
- **Target:** `mcp_server/lib/search/folder-discovery.ts`
- **Status:** EXISTS
- **What exists now:** When a per-folder file is missing, aggregation falls back to the legacy `spec.md` extraction path without implicit writes.
- **Integration points:** `generateFolderDescriptions()` fallback branch and `ensureDescriptionCache()`.
- **Assessment:** Backward-compatibility behavior is present in code.
- **Effort:** **S**

### Task: mixed-mode aggregation tests
- **Target:** `mcp_server/tests/folder-discovery-integration.vitest.ts`
- **Status:** EXISTS
- **What exists now:** Integration tests cover stale/corrupt existing-file repair and mixed-mode discovery where one folder uses `description.json` and another falls back to `spec.md`.
- **Integration points:** `generateFolderDescriptions()` + `savePerFolderDescription()`.
- **Assessment:** Test scaffolding is already present for this area.
- **Effort:** **S**

## Dependencies & Risks

- **Path drift in planning docs vs code:** The readiness target list names `scripts/workflow.ts` and `scripts/utils/folder-discovery.ts`, but the real implementation lives in `scripts/core/workflow.ts` and `mcp_server/lib/search/folder-discovery.ts`. This can easily cause implementation work to start in the wrong place.
- **API drift:** The plan/tasks refer to `ensureUniqueSlug()`, but the code exports `ensureUniqueMemoryFilename()`. Behavior exists, but the implementation does not match the planned helper contract exactly.
- **Phase 3 is more implemented than tasks.md suggests:** Workflow integration, `memorySequence`, and `memoryNameHistory` already exist in source. If work starts from `tasks.md` alone, there is a risk of duplicating or rewriting already-landed logic.
- **Phase 4 cache staleness is incomplete:** Cache-level freshness currently tracks `spec.md` changes, not per-folder `description.json` mutations. That is the main remaining correctness gap for Phase 4.
- **Defense-in-depth is incomplete in the write path:** Upstream uniqueness handling reduces collisions, but `writeFilesAtomically()` still allows overwrite on rename after only logging a warning.
- **Test realism gap:** `slug-uniqueness.vitest.ts` mirrors the helper inline instead of importing the production implementation, so it proves intended logic more than wired behavior.

## Bottom Line

- **Phase 3 readiness:** **High for implementation refinement, low for greenfield work**. Most functionality already exists; the main remaining work is normalization/hardening (API alignment, write-path defense, stronger integrated testing).
- **Phase 4 readiness:** **Moderate to high**. Aggregation and compatibility code are already present, but cache-level stale detection still needs to be finished to fully match the plan.
