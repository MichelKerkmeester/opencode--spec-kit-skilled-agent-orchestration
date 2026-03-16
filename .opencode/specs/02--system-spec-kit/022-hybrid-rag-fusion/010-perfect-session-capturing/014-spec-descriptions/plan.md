---
title: "Implementation Plan: Spec Folder Description System Refactor"
description: "Refactor centralized descriptions.json into per-folder description.json files with collision-resistant memory naming, integrated into spec folder creation automation."
trigger_phrases:
  - "description system refactor"
  - "per-folder description"
  - "memory uniqueness"
  - "descriptions.json"
  - "spec folder description"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Spec Folder Description System Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server), Bash (create.sh) |
| **Framework** | Node.js (fs sync/async), Vitest (testing) |
| **Storage** | JSON files on disk (description.json per folder) |
| **Testing** | Vitest unit + integration tests |

### Overview
This plan refactors the centralized `specs/descriptions.json` aggregation flow into per-folder `description.json` files generated automatically during spec folder creation. It also adds collision-resistant memory filename generation to guarantee uniqueness even when 10+ memories are saved to the same folder. The centralized file is preserved as a build-time aggregation artifact for backward compatibility.

### Current Architecture (AS-IS)

```
spec.md → extractDescription() → generateFolderDescriptions() → specs/descriptions.json (centralized aggregate)
                                                                       ↓
                                                              ensureDescriptionCache() → findRelevantFolders() → discoverSpecFolder()
```

### Target Architecture (TO-BE)

```
create.sh → generates description.json in each spec folder root
                  ↓
spec.md → extractDescription() → per-folder description.json (1 per folder, any depth)
                  ↓                        ↓
      Memory naming context        Aggregation sweep
      (unique slugs + counter)           ↓
                              specs/descriptions.json (rebuilt from per-folder files)
```
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (folder-discovery.ts API consumers)

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-008)
- [x] Tests passing: existing + new per-folder + uniqueness tests
- [x] Docs updated: spec/plan/tasks/feature catalog/testing playbook
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Module Extension: extend existing `folder-discovery.ts` with per-folder capabilities while preserving its public API.

**Authority contract:** Each spec folder's `description.json` is the source of truth for description metadata. The centralized `specs/descriptions.json` is strictly derived from per-folder files, read-only for consumers, and must never be treated as the authoritative mutation target.

### Key Components

- **`folder-discovery.ts`** (extended): New functions `generatePerFolderDescription()`, `loadPerFolderDescription()`, `savePerFolderDescription()`. `loadPerFolderDescription()` schema-validates all persisted field types on load (`specId: string`, `parentChain: string[]`, `memorySequence: number`) and returns `null` for corrupt shapes; `generateFolderDescriptions()` then repairs stale/corrupt existing files from `spec.md`, while missing files keep pure fallback behavior without implicit backfill writes.

- **`create.sh`** (extended): Post-creation hook generates `description.json` in new folder. Uses Node.js helper for consistent extraction logic.

- **`slug-utils.ts`** (extended): New `ensureUniqueMemoryFilename()` function that checks existing filenames in `memory/` directory and appends sequence suffix (`-1`, `-2`, etc.) on collision.

- **`workflow.ts`** (modified): Uses `ensureUniqueMemoryFilename()` before constructing `ctxFilename`.

- **`file-writer.ts`** (modified): Add filename existence check before atomic write (defense-in-depth). Note: check-then-write is subject to TOCTOU race. For production safety, use `O_EXCL` (exclusive create) semantics on the target file.

### Per-Folder description.json Schema

```typescript
interface PerFolderDescription {
  specFolder: string;           // Relative path from specs root
  description: string;          // 1-sentence from spec.md (max 150 chars)
  keywords: string[];           // Extracted significant keywords
  lastUpdated: string;          // ISO timestamp
  specId: string;               // Numeric prefix (e.g., "010")
  folderSlug: string;           // Slugified folder name (e.g., "spec-descriptions")
  parentChain: string[];        // Ancestor folder names for context
  memorySequence: number;       // Monotonic counter, incremented per memory save
  memoryNameHistory: string[];  // Last N memory slugs used (ring buffer, max 20)
}
```

### Data Flow

1. **On `create.sh`**: Extract description from template spec.md → write `description.json`
2. **On `spec.md` edit**: Stale detection → regenerate per-folder `description.json`
3. **On memory save**: Read per-folder `description.json` → use `parentChain` + `specId` as contextual slug inputs → increment `memorySequence` → update `memoryNameHistory` ring buffer (max 20 entries)
4. **On cache rebuild**: Walk all per-folder files → aggregate into centralized `descriptions.json`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Per-Folder Description Infrastructure
**Goal**: Core read/write for per-folder `description.json`

- [ ] Define `PerFolderDescription` interface in `folder-discovery.ts`
- [ ] Implement `generatePerFolderDescription(specMdPath, folderPath, basePath): PerFolderDescription | null`
- [ ] Implement `loadPerFolderDescription(folderPath): PerFolderDescription | null`
  - Schema validation on load: validate `specId` is `string`, `parentChain` is `string[]`, and `memorySequence` is `number`
  - If any field has the wrong type, treat the file as corrupted and regenerate from `spec.md`
- [ ] Implement `savePerFolderDescription(desc, folderPath): void`
- [ ] Add atomic write (temp-then-rename) for per-folder files
  - Temp file MUST be created in the same directory as the target file
  - Temp filename MUST use a random/unique suffix (not a predictable `.tmp` name)
  - Writer MUST `fsync` the temp file before rename
  - Writer MUST use try/finally cleanup to remove the temp file on failure
- [ ] Add stale detection: compare `description.json` mtime vs `spec.md` mtime
- [ ] Unit tests for new functions

### Phase 2: create.sh Integration
**Goal**: Auto-generate `description.json` on folder creation

- [ ] New TypeScript files must include the standard module header: `// --- MODULE: [Name] ---`
- [ ] Add `generate_description_json()` function in `create.sh`
- [ ] Call Node.js helper script: `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js <folder-path>`
- [ ] Create `scripts/spec-folder/generate-description.ts` - thin CLI wrapper calling `generatePerFolderDescription()`
- [ ] MUST validate `folderPath` is within allowed specs base paths before any I/O operations
- [ ] Integrate into `create.sh` post-template-copy step
- [ ] Handle `--phase` flag: generate `description.json` in each child phase folder
- [ ] Test: `create.sh` produces description.json for L1/L2/L3 folders at any depth

### Phase 3: Memory Best-Effort Uniqueness
**Goal**: Best-effort unique memory filenames even with 10+ rapid saves

- [ ] Add `ensureUniqueMemoryFilename(contextDir, filename): string` to `slug-utils.ts`
  - Scan existing `*.md` files in `contextDir`
  - If `${dateTime}__${baseSlug}.md` exists → try `${dateTime}__${baseSlug}-1.md`, `-2`, etc.
  - Returns: the unique filename string (including `.md` extension). Caller uses it directly as the output filename.
  - Max 100 iterations (fail-safe)
  - On iteration 101 (exhaustion): reserve a random 12-character hex fallback candidate (from `crypto.randomBytes(6).toString('hex')`) using the same `O_CREAT|O_EXCL` guard before returning.
- [ ] Integrate `ensureUniqueMemoryFilename()` in `workflow.ts` before `ctxFilename` construction (line ~644)
- [ ] Update per-folder `description.json` `memorySequence` counter on each save
  - Concurrency: `memorySequence` uses read-modify-write without locking. Concurrent saves may read the same value. This is acceptable for the single-user CLI use case.
- [ ] Update `memoryNameHistory` ring buffer (last 20 slugs)
- [ ] Add defense-in-depth: `writeFilesAtomically()` checks filename existence before write
  - Note: check-then-write is subject to TOCTOU race. For production safety, use `O_EXCL` (exclusive create) semantics on the target file.
- [ ] Unit tests: 10 rapid saves → 10 unique files
- [ ] Unit tests: same slug + same timestamp → sequential suffix

### Phase 4: Aggregation & Backward Compatibility
**Goal**: Centralized `descriptions.json` rebuilt from per-folder files

- [ ] Refactor `generateFolderDescriptions()` to prefer per-folder `description.json` over spec.md extraction
  - If per-folder file exists and not stale → use it
  - If stale/corrupt and file exists → repair from `spec.md`; if missing → fall back to `spec.md` extraction without implicit writes
- [ ] `ensureDescriptionCache()` continues to work identically for consumers
- [ ] `isCacheStale()` extended: also checks per-folder files' mtimes
- [ ] Backward compat: if NO per-folder files exist, behavior identical to current
- [ ] Integration tests: mixed scenario (some folders have description.json, some don't)

### Phase 5: Documentation & Testing Playbook
**Goal**: Update all documentation

- [ ] Update feature catalog `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`
  - Add per-folder architecture section
  - Update source files table
  - Add uniqueness guarantee documentation
- [ ] Update testing playbook with description system test scenarios
- [ ] Update `folder-discovery-integration.vitest.ts` with per-folder tests
- [ ] Ensure all existing tests pass (no regressions)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `generatePerFolderDescription()`, `ensureUniqueMemoryFilename()`, `loadPerFolderDescription()` | Vitest |
| Unit | `ensureUniqueMemoryFilename()` collision scenarios (same second, 10+ saves) | Vitest |
| Integration | `create.sh` → `description.json` generation | Vitest + bash |
| Integration | Aggregation: per-folder → centralized cache | Vitest |
| Regression | All existing `folder-discovery.vitest.ts` tests | Vitest |

**Filesystem test strategy**: Tests requiring real fs semantics (atomic rename, corruption recovery, staleness detection) use `os.tmpdir()`-based temp directories with real I/O. Pure logic tests (slug generation, keyword extraction) use mocked fs.

### Critical Test Scenarios

1. **Uniqueness under rapid saves**: Save 10 memories to same folder in same second → 10 unique filenames
2. **Per-folder at depth 5+**: Nested folder `001/002/003/004/005/` gets its own `description.json`
3. **Stale detection**: Edit `spec.md` → `description.json` detected as stale → regenerated
4. **Negative stale-check**: Fresh `description.json` is NOT regenerated unnecessarily when `spec.md` has not changed
5. **Mixed mode**: Some folders have `description.json`, some don't → aggregation works for both
6. **Legacy mode**: Verify correct behavior when NO per-folder `description.json` files exist (pure centralized fallback)
7. **Phase creation**: Verify `--phase` flag produces child-folder `description.json`
8. **Empty spec.md**: `description.json` generated with empty `description` and empty `keywords` while identity fields remain valid
9. **Concurrent writes**: Test with 10 parallel writers to same folder using `Promise.all()`. Assert: all files created, no data loss, no corrupt `description.json`. Verify temp-file/rename atomicity under contention.
10. **Very long spec title (>200 chars)**: Verify generated description is truncated to the 150-character maximum
11. **spec.md with no H1 heading**: Verify description generation falls back to the folder name
12. **description.json write failure (read-only dir)**: Verify graceful error handling and no process crash
13. **Corrupted description.json (invalid JSON)**: Verify discovery falls back to `spec.md` and repairs existing on-disk `description.json`
14. **Missing parent folder in `parentChain`**: Verify `parentChain` falls back to an empty array
15. **Same task description repeated (empty fallback + empty task)**: Verify a content-hash suffix differentiates filenames when the base slug is empty
16. **Performance: Per-folder description.json read <5ms (NFR-P01)**: Benchmark a single-folder `description.json` load and assert steady-state read completes under 5ms
17. **Performance: Full 500-folder aggregation scan <500ms (NFR-P02)**: Build a temp folder structure with 500 spec folders containing `description.json` fixtures, run the aggregation sweep, and verify completion under 500ms
18. **End-to-end pipeline**: `create.sh` → `description.json` generated → memory save → unique filename → second save → unique filename → aggregation scan includes both folders

### Risk-Mitigation Validation Notes

- **Lazy-read caching**: `description.json` files are read on-demand and cached in-memory for the duration of the aggregation scan. **Test**: verify second read of same folder returns cached result without filesystem I/O.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `folder-discovery.ts` public API | Internal | Green | Consumers must not break |
| `create.sh` bash environment | Internal | Green | Description generation fallback |
| `writeFilesAtomically()` | Internal | Green | Core write path |
| Vitest test runner | Internal | Green | All tests must pass |
| Node.js `fs` module | External | Green | Standard library |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Existing tests fail, or `ensureDescriptionCache()` returns incorrect results
- **Procedure**: Revert changes to `folder-discovery.ts`, `workflow.ts`, `slug-utils.ts`. Per-folder `description.json` files are harmless side-effects (ignored by old code).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Infrastructure) ──────┐
                                ├──► Phase 3 (Uniqueness) ──► Phase 5 (Docs)
Phase 2 (create.sh) ───────────┘                               ↑
                                                                │
Phase 4 (Aggregation) ─────────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Infrastructure | None | 2, 3, 4 |
| 2. create.sh | Phase 1 | 5 |
| 3. Uniqueness | Phase 1 | 5 |
| 4. Aggregation | Phase 1 | 5 |
| 5. Documentation | Phases 2, 3, 4 | None |

**Note**: Phases 2, 3 and 4 can be DEVELOPED in parallel after Phase 1, but ROLLOUT order matters. Phase 3 tracking updates only function where `description.json` exists (requires Phase 2 or migration). Phase 4 mixed-mode aggregation benefits from Phase 2 having populated files.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1. Infrastructure | Medium | Core: new interface + 4 functions + tests |
| 2. create.sh | Low-Medium | Bash integration + Node CLI wrapper |
| 3. Uniqueness | Medium | Slug collision detection + ring buffer + tests |
| 4. Aggregation | Low | Refactor existing function + compat tests |
| Architecture note | — | Module boundary recommendation: per-folder CRUD operations (load, save, generate, stale-check) could be extracted to a separate `description-store.ts` module. Consciously deferred — current cohesion in `folder-discovery.ts` is acceptable for the module's scope. |
| 5. Documentation | Low | Feature catalog + testing playbook updates |

**Revised assessment**: dual-store transition logic, backward compatibility layer, bash/TypeScript integration boundary, and best-effort concurrency handling increase effective complexity to mid-range Level 2 (estimated 45-50/70).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All existing `folder-discovery.vitest.ts` tests pass
- [ ] All existing `folder-discovery-integration.vitest.ts` tests pass
- [ ] `ensureDescriptionCache()` returns same results as before for existing folders

### Rollback Procedure
1. Revert TypeScript changes (folder-discovery.ts, workflow.ts, slug-utils.ts)
2. Per-folder `description.json` files are inert; old code ignores them
3. Centralized `descriptions.json` continues to work unchanged
4. No data migration needed; per-folder files are additive

### Data Reversal
- **Has data migrations?** No; per-folder files are new additions, not replacements
- **Reversal procedure**: N/A; old code simply ignores `description.json` files in spec folders
- **Migration note**: One-shot backfill populated per-folder `description.json` files across the then-active spec inventory. New folders continue to receive `description.json` automatically at creation time via `create.sh`.
<!-- /ANCHOR:enhanced-rollback -->

---

### Key Codebase Findings

### Finding 1: No Filename Collision Detection
**Source**: `file-writer.ts:55-82`
`writeFilesAtomically()` uses temp-then-rename but does NOT check if the target filename already exists or whether the target path is a symlink before rename. Same-second saves with identical slugs silently overwrite, and atomic hardening must reject symlink targets before the final rename step.

### Finding 2: Memory Filename Format
**Source**: `workflow.ts:644`
```typescript
const ctxFilename = `${sessionData.DATE}_${sessionData.TIME}__${contentSlug}.md`;
```
DATE=DD-MM-YY, TIME=HH-MM. Resolution is 1 minute, so all saves within the same minute with the same contentSlug produce the same filename.

### Finding 3: create.sh Has No Description Integration
**Source**: `create.sh` (full file)
Creates `memory/`, `scratch/`, template files and git branch, but never generates `description.json`. Description cache is only rebuilt on-demand by `ensureDescriptionCache()` in the MCP server.

### Finding 4: Centralized Cache Path Hardcoded
**Source**: `folder-discovery.ts:598`
```typescript
const cachePath = path.join(normalizedBasePaths[0], 'descriptions.json');
```
Always writes to the first base path's root. Per-folder files require a new code path.

### Finding 5: Content-Hash Dedup Exists but Insufficient
**Source**: `file-writer.ts:30-53`
`checkForDuplicateContent()` catches identical content but NOT similar-but-different saves (e.g., slightly different conversation contexts with the same task slug).

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
