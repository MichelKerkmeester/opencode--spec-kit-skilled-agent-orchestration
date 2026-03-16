---
title: "Implementation Summary: Per-Folder Description Infrastructure"
description: "Per-folder description.json system providing spec identity metadata, collision-resistant memory filenames, and structured context for 010's spec-affinity and embedding pipelines."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
trigger_phrases:
  - "description implementation"
  - "per-folder description"
  - "memory uniqueness"
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary: Per-Folder Description Infrastructure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-03-13 |
| **Parent** | 010-perfect-session-capturing |
| **R-Item** | R-14 |
| **Total LOC** | ~400 (across 7 files) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### 1. Per-Folder Description Lifecycle (`folder-discovery.ts`)

`PerFolderDescription` schema extending `FolderDescription` with `specId`, `folderSlug`, `parentChain`, `memorySequence` (monotonic counter), `memoryNameHistory` (ring buffer, max 20). Functions: `generatePerFolderDescription`, `loadPerFolderDescription` (upgrade-on-read), `savePerFolderDescription` (atomic), `isPerFolderDescriptionStale`, `generateFolderDescriptions` (aggregate), `repairStaleDescriptions`.

### 2. Collision-Resistant Slugs (`slug-utils.ts`)

`ensureUniqueMemoryFilename()` with atomic O_CREAT|O_EXCL probes, sequence suffixes (`-1` to `-100`), random hex fallback. Supporting: `generateContentSlug`, `pickBestContentName`, `isContaminatedMemoryName`, `normalizeMemoryNameCandidate` (includes Mustache stripping from 010 parent).

### 3. Workflow Integration (`workflow.ts`)

Pre-save: reads `memoryNameHistory` as alternatives for slug generation. Post-save: increments `memorySequence`, appends to history, saves with lost-update retry. Gated on `ctxFileWritten` — no sequence increment on aborted saves.

### 4. `create.sh` Integration

Auto-generates `description.json` at three paths: normal mode, phase parent, phase children. Non-fatal on failure.

### 5. 010 Pipeline Integration

- `spec-affinity.ts` reads `description.json` for affinity matching (schema gap: no `triggerPhrases` field)
- `spec-folder-extractor.ts` reads `description.json` for context extraction
- Quality scorer uses description tiers from Phase 006's unified `validateDescription()`
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

5 implementation phases executed sequentially:
1. Per-folder infrastructure (generate/load/save/stale-detect, unit tests)
2. `create.sh` integration (Node CLI wrapper, bash/node bridge, phase folder support)
3. Memory best-effort uniqueness (collision handling, retry caps, workflow integration)
4. Aggregation & backward compatibility (per-folder preference, consumer cache, staleness)
5. Documentation & testing playbook (feature catalog, regression verification)

Code hardening: 8 fixes (C1-C8), 3 test fix groups, 13 findings from GPT 5.4 triple-agent re-review (F1-F12 + path containment `path.sep` boundary fix).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Ring buffer over unbounded history**: `memoryNameHistory` capped at 20 entries to prevent description.json growth
2. **Atomic writes via temp+fsync+rename**: Prevents corruption on concurrent access (deferred CHK-027 P2)
3. **Lost-update retry**: `memorySequence` re-read after write to detect concurrent mutation
4. **Preserve centralized cache**: `descriptions.json` retained as build-time aggregation artifact, not deprecated
5. **Non-fatal generation**: `create.sh` continues on description.json failure — spec creation is more important
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Suite | Tests | Status |
|-------|-------|--------|
| folder-discovery | 92 | PASS |
| folder-discovery-integration | 39 | PASS |
| workflow-memory-tracking | 5 | PASS |
| slug-utils-boundary | 6 | PASS |
| slug-uniqueness | 8 | PASS |
| **Total** | **150** | **PASS** |

**Verification Date**: 2026-03-13
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **L1 — Spec-affinity schema gap**: `PerFolderDescription` lacks `triggerPhrases`. `spec-affinity.ts` falls back to spec.md frontmatter. Future enhancement.
2. **L2 — Concurrent writes** (CHK-027): Deferred P2. Atomic temp-then-rename provides OS-level safety.
3. **L3 — Partial workflow E2E**: Deferred due to heavy MCP server module dependencies.
<!-- /ANCHOR:limitations -->
