---
title: "Spec Descriptions"
status: "complete"
level: 2
created: "2025-12-01"
updated: "2026-03-08"
description: "Refactor the centralized descriptions.json into per-folder description.json files, improve memory filename uniqueness and integrate description generation into spec folder creation automation."
trigger_phrases:
  - "descriptions.json"
  - "description system"
  - "spec folder descriptions"
  - "per-folder description"
  - "memory uniqueness"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Spec Folder Description System Refactor

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
| **Branch** | `010-spec-descriptions` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current descriptions.json system stores ALL spec folder descriptions in a single centralized file at `specs/descriptions.json` (103KB, 400+ entries). This creates three problems: (1) AI agents cannot reliably generate unique memory names when multiple memories are saved to the same spec folder because the description context is global rather than local, (2) the `create.sh` spec folder creation script does not generate a `description.json` on folder creation, requiring a separate cache regeneration step and (3) the centralized file becomes a bottleneck for concurrent operations and grows unboundedly.

### Purpose
Each spec folder at any nesting depth automatically gets its own `description.json` containing its description, keywords and metadata, which enables AI agents to always generate unique memory filenames even when saving 10+ memories to the same folder in rapid succession.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refactor `folder-discovery.ts` to support per-folder `description.json` generation and reading
- Modify `create.sh` to auto-generate `description.json` in each new spec folder
- Improve `slug-utils.ts` / `workflow.ts` memory filename generation for guaranteed uniqueness
- Update `ensureDescriptionCache()` to aggregate from per-folder files instead of one centralized file
- Update feature catalog entry `04-spec-folder-description-discovery.md`
- Update existing tests and add new tests for per-folder description files
- Update testing playbook with description system test scenarios

### Out of Scope
- Changing any part of the memory MCP server's search/indexing pipeline beyond the description discovery layer
- Migrating existing `specs/descriptions.json` data (backward compatibility maintained during transition)
- Changing the memory anchor format or template system

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/folder-discovery.ts` | Modify | Add per-folder description.json read/write; keep centralized cache as aggregation layer |
| `scripts/spec/create.sh` | Modify | Add description.json generation on folder creation |
| `scripts/utils/slug-utils.ts` | Modify | Add collision-resistant slug generation with sequence suffix |
| `scripts/core/workflow.ts` | Modify | Use per-folder description for unique memory name context |
| `scripts/core/file-writer.ts` | Modify | Extend atomic write support for description.json |
| `scripts/spec-folder/generate-description.ts` | Create | CLI wrapper calling generatePerFolderDescription() |
| `mcp_server/tests/folder-discovery.vitest.ts` | Modify | Add per-folder description tests |
| `mcp_server/tests/folder-discovery-integration.vitest.ts` | Modify | Integration tests for per-folder files |
| `feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md` | Modify | Update feature catalog documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Per-folder `description.json` generated on spec folder creation | Running `create.sh` produces a `description.json` in the new folder root |
| REQ-002 | Per-folder `description.json` generated at any nesting depth | Folders at depth 1-8 all get their own `description.json` |
| REQ-003 | Memory filenames guaranteed unique within a folder | 10 rapid saves to the same folder produce 10 distinct filenames |
| REQ-004 | Backward compatibility with existing centralized `descriptions.json` | `ensureDescriptionCache()` still works with old-format single file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Centralized cache rebuilt from per-folder files | `generateFolderDescriptions()` aggregates per-folder `description.json` files |
| REQ-006 | `description.json` schema includes uniqueness context for memory naming | Schema includes `specId`, `folderSlug`, `parentChain` fields |
| REQ-007 | Feature catalog and testing playbook updated | Documentation reflects new per-folder architecture |
| REQ-008 | Stale per-folder `description.json` detection | `isCacheStale()` works for individual folder files, not just global cache |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every new spec folder created via `create.sh` contains a `description.json` at its root
- **SC-002**: 10 consecutive memory saves to a single spec folder produce 10 files with distinct names
- **SC-003**: All existing tests pass. New tests cover per-folder generation, aggregation and uniqueness
- **SC-004**: Centralized `specs/descriptions.json` is buildable from per-folder files (aggregation)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking existing cache consumers | High | Maintain backward-compatible `ensureDescriptionCache()` API |
| Risk | Race conditions on concurrent description.json writes | Med | Use atomic write pattern (write-to-temp then rename) |
| Risk | Performance regression from reading many small files vs. one large file | Low | Lazy loading + in-memory cache of per-folder descriptions |
| Dependency | `folder-discovery.ts` API used by MCP handlers | High | Preserve existing public API signatures |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-folder description.json read: <5ms per file
- **NFR-P02**: Full aggregation scan: <500ms for 500 folders

### Reliability
- **NFR-R01**: Graceful degradation if per-folder file is missing (fall back to spec.md extraction)
- **NFR-R02**: Atomic writes prevent corruption on concurrent access

### Compatibility
- **NFR-C01**: Existing `descriptions.json` consumers work without changes during transition
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty spec.md: description.json gets empty description field, slug falls back to folder name
- Very long spec titles (>150 chars): Truncated per existing extractDescription() logic
- spec.md with no heading: Falls through to problem statement or first line

### Error Scenarios
- description.json write failure: Log warning, continue without file (graceful degradation)
- Corrupted description.json: Regenerate from spec.md on next read
- Missing parent folder: create.sh already handles recursive mkdir

### Uniqueness Edge Cases
- 10 memories saved in same second: Sequence counter appended (e.g., `__slug-1.md`, `__slug-2.md`)
- Same task description repeated: Content hash differentiator added to slug
- Empty task + empty fallback: Hash-based fallback slug (existing `hashFallbackSlug()`)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 9 files across 4 domains |
| Risk | 12/25 | Backward compat required, public API preservation |
| Research | 8/20 | Well-understood codebase, patterns clear |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Q1: Should per-folder `description.json` include memory name history to prevent slug collisions? RESOLVED: Yes, via memoryNameHistory ring buffer (max 20) and memorySequence counter.
- Q2: Should the centralized `descriptions.json` be deprecated entirely or kept as a build artifact? RESOLVED: Retain centralized descriptions.json as build-time aggregation artifact derived from per-folder files.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
