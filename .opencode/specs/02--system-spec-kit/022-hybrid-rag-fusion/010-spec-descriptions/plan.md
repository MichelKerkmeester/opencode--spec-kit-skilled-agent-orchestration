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
This plan refactors the centralized `specs/descriptions.json` (103KB, 400+ entries) into per-folder `description.json` files generated automatically during spec folder creation. It also adds collision-resistant memory filename generation to guarantee uniqueness even when 10+ memories are saved to the same folder. The centralized file is preserved as a build-time aggregation artifact for backward compatibility.

### Current Architecture (AS-IS)

```
spec.md → extractDescription() → generateFolderDescriptions() → specs/descriptions.json (centralized, 400+ entries)
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
- [ ] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] Tests passing — existing + new per-folder + uniqueness tests
- [ ] Docs updated — spec/plan/tasks/feature catalog/testing playbook
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Module Extension — extending existing `folder-discovery.ts` with per-folder capabilities while preserving its public API.

### Key Components

- **`folder-discovery.ts`** (extended): New functions `generatePerFolderDescription()`, `loadPerFolderDescription()`, `savePerFolderDescription()`. Existing `generateFolderDescriptions()` refactored to aggregate from per-folder files.

- **`create.sh`** (extended): Post-creation hook generates `description.json` in new folder. Uses Node.js helper for consistent extraction logic.

- **`slug-utils.ts`** (extended): New `ensureUniqueSlug()` function that checks existing filenames in `memory/` directory and appends sequence suffix (`-1`, `-2`, etc.) on collision.

- **`workflow.ts`** (modified): Uses `ensureUniqueSlug()` before constructing `ctxFilename`.

- **`file-writer.ts`** (modified): Add filename existence check before atomic write (defense-in-depth).

### Per-Folder description.json Schema

```typescript
// Extended per-folder schema (backward-compatible with FolderDescription)
interface PerFolderDescription {
  // Core fields (same as FolderDescription)
  specFolder: string;           // Relative path from specs root
  description: string;          // 1-sentence from spec.md (max 150 chars)
  keywords: string[];           // Extracted significant keywords
  lastUpdated: string;          // ISO timestamp

  // New identity fields for memory uniqueness
  specId: string;               // Numeric prefix (e.g., "010")
  folderSlug: string;           // Slugified folder name (e.g., "spec-descriptions")
  parentChain: string[];        // Ancestor folder names for context

  // Memory naming support
  memorySequence: number;       // Monotonic counter, incremented per memory save
  memoryNameHistory: string[];  // Last N memory slugs used (ring buffer, max 20)
}
```

### Data Flow

1. **On `create.sh`**: Extract description from template spec.md → write `description.json`
2. **On `spec.md` edit**: Stale detection → regenerate per-folder `description.json`
3. **On memory save**: Read per-folder `description.json` → use `parentChain` + `specId` + `memorySequence` for unique slug → increment `memorySequence` → update `description.json`
4. **On cache rebuild**: Walk all per-folder files → aggregate into centralized `descriptions.json`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Per-Folder Description Infrastructure
**Goal**: Core read/write for per-folder `description.json`

- [ ] Define `PerFolderDescription` interface in `folder-discovery.ts`
- [ ] Implement `generatePerFolderDescription(specMdPath, folderPath, basePath): PerFolderDescription`
- [ ] Implement `loadPerFolderDescription(folderPath): PerFolderDescription | null`
- [ ] Implement `savePerFolderDescription(desc, folderPath): void`
- [ ] Add atomic write (temp-then-rename) for per-folder files
- [ ] Add stale detection: compare `description.json` mtime vs `spec.md` mtime
- [ ] Unit tests for new functions

### Phase 2: create.sh Integration
**Goal**: Auto-generate `description.json` on folder creation

- [ ] Add `generate_description_json()` function in `create.sh`
- [ ] Call Node.js helper script: `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js <folder-path>`
- [ ] Create `scripts/spec-folder/generate-description.ts` — thin CLI wrapper calling `generatePerFolderDescription()`
- [ ] Integrate into `create.sh` post-template-copy step
- [ ] Handle `--phase` flag: generate `description.json` in each child phase folder
- [ ] Test: `create.sh` produces description.json for L1/L2/L3 folders at any depth

### Phase 3: Memory Uniqueness Guarantees
**Goal**: Collision-free memory filenames even with 10+ rapid saves

- [ ] Add `ensureUniqueSlug(contextDir, baseSlug, dateTime): string` to `slug-utils.ts`
  - Scan existing `*.md` files in `contextDir`
  - If `${dateTime}__${baseSlug}.md` exists → try `${dateTime}__${baseSlug}-1.md`, `-2`, etc.
  - Max 100 iterations (fail-safe)
- [ ] Integrate `ensureUniqueSlug()` in `workflow.ts` before `ctxFilename` construction (line ~644)
- [ ] Update per-folder `description.json` `memorySequence` counter on each save
- [ ] Update `memoryNameHistory` ring buffer (last 20 slugs)
- [ ] Add defense-in-depth: `writeFilesAtomically()` checks filename existence before write
- [ ] Unit tests: 10 rapid saves → 10 unique files
- [ ] Unit tests: same slug + same timestamp → sequential suffix

### Phase 4: Aggregation & Backward Compatibility
**Goal**: Centralized `descriptions.json` rebuilt from per-folder files

- [ ] Refactor `generateFolderDescriptions()` to prefer per-folder `description.json` over spec.md extraction
  - If per-folder file exists and not stale → use it
  - If missing → fall back to spec.md extraction (existing logic)
- [ ] `ensureDescriptionCache()` continues to work identically for consumers
- [ ] `isCacheStale()` extended: also checks per-folder files' mtimes
- [ ] Backward compat: if NO per-folder files exist, behavior identical to current
- [ ] Integration tests: mixed scenario (some folders have description.json, some don't)

### Phase 5: Documentation & Testing Playbook
**Goal**: Update all documentation

- [ ] Update feature catalog `04-spec-folder-description-discovery.md`
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
| Unit | `generatePerFolderDescription()`, `ensureUniqueSlug()`, `loadPerFolderDescription()` | Vitest |
| Unit | `ensureUniqueSlug()` collision scenarios (same second, 10+ saves) | Vitest |
| Integration | `create.sh` → `description.json` generation | Vitest + bash |
| Integration | Aggregation: per-folder → centralized cache | Vitest |
| Regression | All existing `folder-discovery.vitest.ts` tests | Vitest |

### Critical Test Scenarios

1. **Uniqueness under rapid saves**: Save 10 memories to same folder in same second → 10 unique filenames
2. **Per-folder at depth 5+**: Nested folder `001/002/003/004/005/` gets its own `description.json`
3. **Stale detection**: Edit `spec.md` → `description.json` detected as stale → regenerated
4. **Mixed mode**: Some folders have `description.json`, some don't → aggregation works for both
5. **Empty spec.md**: `description.json` generated with folder-name-based fallback description
6. **Concurrent writes**: Two saves to same folder → no corruption (atomic write)
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

**Note**: Phases 2, 3, and 4 are independent of each other and can be parallelized after Phase 1.
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
| 5. Documentation | Low | Feature catalog + testing playbook updates |
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
2. Per-folder `description.json` files are inert — old code ignores them
3. Centralized `descriptions.json` continues to work unchanged
4. No data migration needed — per-folder files are additive

### Data Reversal
- **Has data migrations?** No — per-folder files are new additions, not replacements
- **Reversal procedure**: N/A — old code simply ignores `description.json` files in spec folders
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:key-findings -->
## APPENDIX: KEY CODEBASE FINDINGS

### Finding 1: No Filename Collision Detection
**Source**: `file-writer.ts:55-82`
`writeFilesAtomically()` uses temp-then-rename but does NOT check if the target filename already exists. Same-second saves with identical slugs silently overwrite.

### Finding 2: Memory Filename Format
**Source**: `workflow.ts:644`
```typescript
const ctxFilename = `${sessionData.DATE}_${sessionData.TIME}__${contentSlug}.md`;
```
DATE=DD-MM-YY, TIME=HH-MM. Resolution is 1 minute — all saves within the same minute with the same contentSlug produce the same filename.

### Finding 3: create.sh Has No Description Integration
**Source**: `create.sh` (full file)
Creates `memory/`, `scratch/`, template files, git branch — but never generates `description.json`. Description cache is only rebuilt on-demand by `ensureDescriptionCache()` in the MCP server.

### Finding 4: Centralized Cache Path Hardcoded
**Source**: `folder-discovery.ts:598`
```typescript
const cachePath = path.join(normalizedBasePaths[0], 'descriptions.json');
```
Always writes to the first base path's root. Per-folder files require a new code path.

### Finding 5: Content-Hash Dedup Exists but Insufficient
**Source**: `file-writer.ts:30-53`
`checkForDuplicateContent()` catches identical content but NOT similar-but-different saves (e.g., slightly different conversation contexts with the same task slug).
<!-- /ANCHOR:key-findings -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
