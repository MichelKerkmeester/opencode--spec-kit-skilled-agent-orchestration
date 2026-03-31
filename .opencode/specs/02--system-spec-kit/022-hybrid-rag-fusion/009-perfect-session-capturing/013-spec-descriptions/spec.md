---
title: "Per-Folder Descript [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/013-spec-descriptions/spec]"
description: "Per-folder description.json system providing spec identity metadata, collision-resistant memory filenames, and structured context for 010's spec-affinity and embedding pipelines."
trigger_phrases:
  - "descriptions.json"
  - "description system"
  - "spec folder descriptions"
  - "per-folder description"
  - "memory uniqueness"
  - "memorysequence"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Per-Folder Description Infrastructure

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-08 |
| **Completed** | 2026-03-17 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 13 |
| **Predecessor** | [012-auto-detection-fixes](../012-auto-detection-fixes/spec.md) |
| **Successor** | [014-stateless-quality-gates](../014-stateless-quality-gates/spec.md) |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-14 |
| **Sequence** | B4 (after 006, 008, 009) |
| **Origin** | Evolved from `022-hybrid-rag-fusion/009-spec-descriptions/` |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 14** of the Perfect Session Capturing specification.

**Scope Boundary**: The centralized specs/descriptions.json stores all spec folder descriptions in a single file, creating three problems.
**Dependencies**: 012-auto-detection-fixes
**Deliverables**: Per-folder description.json generation, reading, staleness detection, and atomic write; collision-resistant slug generation via ensureUniqueMemoryFilename()
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The centralized `specs/descriptions.json` stores all spec folder descriptions in a single file, creating three problems:

1. **Memory filename collisions**: AI agents cannot generate unique memory names when saving multiple memories to the same folder because the description context is global, not local. This is critical for 010's session-capture pipeline where rapid saves are common.
2. **Missing creation-time metadata**: `create.sh` does not generate a `description.json` on folder creation, requiring separate cache regeneration. Without it, 010's spec-affinity layer (`spec-affinity.ts`) has no structured metadata to read for newly created folders.
3. **Scalability bottleneck**: The centralized file grows unboundedly and becomes a contention point for concurrent operations.

### Purpose

Give each spec folder its own `description.json` containing identity metadata (`specId`, `folderSlug`, `parentChain`), a `memorySequence` counter, and a `memoryNameHistory` ring buffer. This enables:

- Collision-resistant memory filenames even under 10+ rapid saves
- Structured metadata for 010's spec-affinity matching (via `buildSpecAffinityTargets()`)
- Per-folder staleness detection independent of the aggregate cache
- Atomic writes preventing corruption on concurrent access
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Per-folder `description.json` generation, reading, staleness detection, and atomic write
- `create.sh` integration: auto-generate `description.json` at all three creation paths (normal, phase parent, phase children)
- Collision-resistant slug generation via `ensureUniqueMemoryFilename()` with O_CREAT/O_EXCL probes, sequence suffixes, and random hex fallback
- `memorySequence` monotonic counter and `memoryNameHistory` ring buffer (max 20) in `workflow.ts`
- Aggregate cache rebuilt from per-folder files with preference over spec.md extraction
- Backward compatibility with existing `descriptions.json` consumers

### Out of Scope

- Changing the memory MCP server's search/indexing pipeline beyond the description discovery layer
- Migrating existing centralized data (backward compat maintained during transition)
- Changing the memory anchor format or template system
- Adding `triggerPhrases` to the `PerFolderDescription` schema (see open questions and known limitations below)

### Files to Change

| Path | Change Type | Purpose |
|------|-------------|---------|
| `mcp_server/lib/search/folder-discovery.ts` | Modify | Per-folder description.json lifecycle (generate, load, save, stale detect, aggregate) |
| `scripts/spec/create.sh` | Modify | Auto-generate description.json at 3 creation paths |
| `scripts/utils/slug-utils.ts` | Modify | `ensureUniqueMemoryFilename()` with atomic probes, sequence suffixes |
| `scripts/core/workflow.ts` | Modify | Read `memoryNameHistory` for slug alternatives; write `memorySequence` + history post-save |
| `scripts/spec-folder/generate-description.ts` | Create | CLI wrapper bridging `create.sh` to `generatePerFolderDescription()` |
| `mcp_server/tests/folder-discovery.vitest.ts` | Modify | Per-folder generation, stale detection, aggregation tests |
| `mcp_server/tests/folder-discovery-integration.vitest.ts` | Modify | Integration tests for per-folder files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Per-folder `description.json` generated on spec folder creation | `create.sh` produces `description.json` in the new folder via `generate-description.js` |
| REQ-002 | Per-folder generation works at any nesting depth (1-8) | `MAX_SPEC_DISCOVERY_DEPTH = 8` in `folder-discovery.ts`; recursive discovery handles all depths |
| REQ-003 | Memory filenames guaranteed unique within a folder | 10 rapid saves produce 10 distinct filenames via sequence suffix + O_CREAT/O_EXCL probes |
| REQ-004 | Backward compatibility with centralized `descriptions.json` | `ensureDescriptionCache()` works with old-format single file |
| REQ-005 | Centralized cache rebuilt from per-folder files | `generateFolderDescriptions()` prefers fresh per-folder files, repairs stale ones in-place |

### P1

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-006 | Schema includes identity fields for memory naming context | `PerFolderDescription` includes `specId`, `folderSlug`, `parentChain` |
| REQ-007 | Stale per-folder detection | `isPerFolderDescriptionStale()` compares spec.md mtime vs description.json mtime |
| REQ-008 | `memorySequence` tracks save count per folder | Monotonic counter incremented on successful write, with lost-update retry in `workflow.ts` |
| REQ-009 | `memoryNameHistory` prevents slug reuse | Ring buffer (max 20) passed as `alternatives` to `generateContentSlug()` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every new spec folder created via `create.sh` contains a `description.json`
- 10 consecutive memory saves to a single folder produce 10 files with distinct names
- All existing tests pass; new tests cover per-folder generation, aggregation, and uniqueness
- Centralized `descriptions.json` is buildable from per-folder files
- `memorySequence` does not increment on aborted saves (sufficiency/quality/contamination rejections)
- 161/161 Vitest tests pass across 5 suites (folder-discovery 93, folder-discovery-integration 44, workflow-memory-tracking 5, slug-utils-boundary 10, slug-uniqueness 9)

### Acceptance Scenarios

### Scenario 1: Creation-time metadata
**Given** a new spec folder created through `create.sh`
**When** template generation completes
**Then** the new folder already contains a sibling `description.json`

### Scenario 2: Same-minute memory saves
**Given** multiple saves targeting the same spec folder in the same minute
**When** the generated base slug repeats
**Then** the saved filenames remain unique and do not overwrite prior memory files

### Scenario 3: Stale description repair
**Given** a spec folder whose `spec.md` changed after `description.json` was written
**When** discovery or cache regeneration runs
**Then** the stale per-folder description is regenerated from the newer spec content

### Scenario 4: Mixed-mode aggregation
**Given** a repository where some spec folders have `description.json` and others do not
**When** `generateFolderDescriptions()` rebuilds the aggregate cache
**Then** fresh per-folder metadata is preferred while missing folders still fall back to `spec.md`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking existing cache consumers | High | Maintain backward-compatible `ensureDescriptionCache()` API |
| Risk | Race conditions on concurrent writes | Medium | Atomic write pattern (temp file + fsync + rename) |
| Risk | `workflow.ts` contention with phases 001, 002, 005, 009, 011 | Medium | Description tracking section (lines ~1674-1729) is structurally isolated from other phases' changes |
| Dependency | Phase 006 (Description Enrichment) | Shipped | Unified `validateDescription()` in `file-helpers.ts`. Description quality tiers could inform description.json generation. |
| Dependency | Phase 008 (Signal Extraction) | Shipped | `SemanticSignalExtractor` could be used for keyword extraction in description.json |
| Dependency | Phase 009 (Embedding Optimization) | Shipped | Weighted embedding builder in `workflow.ts` could consume description.json metadata |
| Dependency | 010 Parent (slug-utils) | Shipped | Mustache token stripping in `slug-utils.ts`. Uniqueness code builds on top of this. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-folder description.json read: <5ms per file
- **NFR-P02**: Full aggregation scan: <500ms for 500 folders

### Reliability
- **NFR-R01**: Graceful degradation if per-folder file is missing (fall back to spec.md extraction)
- **NFR-R02**: Atomic writes prevent corruption on concurrent access
- **NFR-R03**: `memorySequence` clamped to safe integer range; lost-update retry on concurrent save

### Compatibility
- **NFR-C01**: Existing `descriptions.json` consumers work without changes during transition
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## 8. L2: EDGE CASES

- Blank/whitespace-only spec.md: description.json is valid with empty `description`, empty `keywords`, intact identity metadata
- Very long spec titles (>150 chars): Truncated per `extractDescription()` logic
- description.json write failure: Logged as warning, save continues (non-fatal)
- Stale/corrupt description.json: Repaired from spec.md during `generateFolderDescriptions()` scan
- 10 memories saved in same second: Sequence counter appends collision suffixes such as `-1` and `-2`
- Save aborted by sufficiency gate: `memorySequence` not incremented (gated on `ctxFileWritten`)
- O_CREAT/O_EXCL probe for aborted save: File immediately unlinked; no phantom reservation
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Touches folder-discovery lifecycle, create.sh integration, slug-utils uniqueness, workflow tracking, and aggregation -- contained within a clear boundary |
| Risk | 12/25 | Concurrent write semantics and backward compatibility with existing cache consumers carry moderate risk; atomic write pattern and graceful fallback mitigate |
| Research | 9/20 | Required review of existing description pipeline, workflow.ts save path, and downstream affinity/embedding consumers |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved Decisions

- **Q1**: Should per-folder files include memory name history? **YES**. `memoryNameHistory` ring buffer (max 20) + `memorySequence` counter.
- **Q2**: Should centralized file be deprecated? **NO**. Retained as build-time aggregation artifact.

### Known Limitations

- **L1: spec-affinity schema gap**: `spec-affinity.ts` (`buildSpecAffinityTargets()` line 244) reads `description.json` looking for `triggerPhrases` and `title` fields. The `PerFolderDescription` schema defines `keywords` and `description` but not `triggerPhrases` or `title`. The affinity system falls back to spec.md frontmatter trigger_phrases, so this is functional but suboptimal. Adding `triggerPhrases` to the schema is a potential future enhancement.
- **L2: concurrent-write scope**: Two-writer parallel-save integrity is now proven directly by `folder-discovery-integration.vitest.ts`. Broader multi-process stress beyond the checklist contract remains out of scope for this phase.

### 010 Pipeline Integration

This phase provides prerequisite infrastructure consumed by the 010 session-capture pipeline:

| Consumer | How It Uses description.json | Integration Point |
|----------|-------------------------------|-------------------|
| `spec-affinity.ts` | Reads `description`/`keywords` for target-spec affinity matching | `buildSpecAffinityTargets()` line 244 |
| `spec-folder-extractor.ts` | Reads `description.json` during spec-folder context extraction | Line 281 |
| `workflow.ts` | Reads `memoryNameHistory` for slug alternatives; writes `memorySequence` + history | Lines 1314-1327 (read), 1674-1729 (write) |
| `quality-scorer.ts` | Indirect: `_provenance` on files uses description tiers from `file-helpers.ts` (Phase 006) | Trust multiplier scoring |
| Embedding pipeline | Indirect: description metadata could feed `buildWeightedDocumentText()` (Phase 009) | Potential future integration |

The `memorySequence` counter correctly does NOT increment on saves aborted by 010's sufficiency gate (`INSUFFICIENT_CONTEXT_ABORT`), contamination gate, or quality gate, because the tracking code at line 1674 is gated on `ctxFileWritten`.
<!-- /ANCHOR:questions -->
