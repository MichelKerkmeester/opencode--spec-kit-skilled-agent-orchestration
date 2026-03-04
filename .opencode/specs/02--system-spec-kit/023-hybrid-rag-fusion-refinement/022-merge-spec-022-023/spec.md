---
title: "Feature Specification: Merge Specs 022 & 023 into Unified 022-hybrid-rag-fusion [template:level_3/spec.md]"
description: "Two separate spec folders (022-hybrid-rag-fusion, 023-hybrid-rag-fusion-refinement) track the same system, causing context fragmentation, duplicate structures, and confusing navigation. This merge consolidates them into a single 022-hybrid-rag-fusion folder."
trigger_phrases:
  - "merge spec 022 023"
  - "consolidate hybrid rag fusion"
  - "spec folder merge"
  - "022 023 unification"
importance_tier: "critical"
contextType: "architecture"
---
# Feature Specification: Merge Specs 022 & 023 into Unified 022-hybrid-rag-fusion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Two spec folders track the same Hybrid RAG Fusion system: `022-hybrid-rag-fusion` (9 phases, 6 memories, initial development) and `023-hybrid-rag-fusion-refinement` (25 phases, 25 memories, 144 feature catalog snippets, refinement work). This merge consolidates both into a single `022-hybrid-rag-fusion` folder, eliminating split-spec overhead and creating one source of truth.

**Key Decisions**: +9 phase offset for renumbering (ADR-001), feature catalog moves as-is without group renumbering (ADR-004)

**Critical Dependencies**: Clean git state before merge, memory checkpoint for rollback safety

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two separate spec folders track the same system. Spec `022-hybrid-rag-fusion` covers initial development (9 phases, 6 memories with generic filenames). Spec `023-hybrid-rag-fusion-refinement` covers refinement (25 phases, 25 memories, feature catalog with 144 snippet files). This split causes: (1) context fragmentation across memory searches that hit one folder but miss the other, (2) duplicate folder structures requiring contributors to check two locations, and (3) confusing navigation where related work lives in different parent folders.

### Purpose
Consolidate both specs into a single `022-hybrid-rag-fusion` folder with all 33 phases correctly numbered, 31 memories with content-aware names in the root `memory/` directory, and zero broken cross-references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Folder merge: move all 023 phase folders into 022 with +9 offset renumbering
- Root document promotion: 023's `000-feature-overview/` docs become 022 root-level documents
- Memory consolidation: rename 022's 6 generic memories with content-aware slugs, move 023's 25 memories, dedup
- Feature catalog and manual testing playbook migration to 022 root
- Reference updates: all cross-references updated from `023-hybrid-rag-fusion-refinement` to `022-hybrid-rag-fusion`
- Test fixture update: `mcp_server/tests/hybrid-search-context-headers.vitest.ts` lines 36, 41
- Memory re-indexing via `memory_index_scan`

### Out of Scope
- Code changes (no runtime behavior changes) — this is a documentation/structure operation only
- New feature work — the merge does not introduce any new capabilities
- Feature catalog group renumbering — catalog groups are independent of phase numbers (ADR-004)
- Changes to the MCP server runtime, handlers, or tool schemas

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/02--system-spec-kit/022-hybrid-rag-fusion/` | Modify | Receive all merged content |
| `specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/` | Delete | Emptied and removed after merge |
| `022-hybrid-rag-fusion/memory/*.md` (6 files) | Modify | Rename with content-aware slugs |
| `023-hybrid-rag-fusion-refinement/001-*` through `025-*` | Move | 24 phase folders → 022 with +9 offset |
| `023-hybrid-rag-fusion-refinement/000-feature-overview/` | Move | Root docs promoted to 022 parent level |
| `023-hybrid-rag-fusion-refinement/feature_catalog/` | Move | Entire catalog tree to 022 root |
| `023-hybrid-rag-fusion-refinement/manual_testing_playbook/` | Move | Playbook directory to 022 root |
| `023-hybrid-rag-fusion-refinement/memory/*.md` (25 files) | Move | All memories to 022/memory/ |
| `mcp_server/tests/hybrid-search-context-headers.vitest.ts` | Modify | Update hardcoded "023" references |
| ~200+ spec doc files | Modify | Find-replace folder name references |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 33 phase folders present in merged structure | `ls` shows 001-009 (original) + 010-033 (ex-023) |
| REQ-002 | All 31 memory files in root `memory/` with content-aware names | No generic slugs like `hybrid-rag-fusion-refinement.md`; all files under `022-hybrid-rag-fusion/memory/` |
| REQ-003 | Zero content loss | Pre/post file count comparison matches |
| REQ-004 | All internal cross-references updated | `grep -r "023-hybrid-rag-fusion-refinement"` returns zero hits |
| REQ-005 | TypeScript compilation passes | `npx tsc --noEmit` succeeds in both scripts/ and mcp_server/ workspaces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Feature catalog intact | All 25 groups and 144+ snippet files present under `022-hybrid-rag-fusion/feature_catalog/` |
| REQ-007 | Memory re-indexed under new paths | `memory_index_scan` completes; `memory_search` returns results for merged content |
| REQ-008 | Old 023 folder fully deleted | `023-hybrid-rag-fusion-refinement/` directory does not exist |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Single spec folder `022-hybrid-rag-fusion` contains all 33 phases, 31 memories, feature catalog, and manual testing playbook
- **SC-002**: Zero stale references to `023-hybrid-rag-fusion-refinement` anywhere in the repository
- **SC-003**: All build checks pass (`npx tsc --noEmit`, `npm run check`)
- **SC-004**: Memory search returns correct results for content that previously lived in both 022 and 023
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R-001: Content loss during folder moves | High | Pre/post file count verification; git history preserves all moves |
| Risk | R-002: Broken cross-references after rename | High | Automated grep sweep + manual spot-check of 5 random references |
| Risk | R-003: Memory index corruption from path changes | Med | Create memory checkpoint before merge; full re-index after |
| Risk | R-004: Phase number collision during renumbering | Low | +9 arithmetic offset guarantees no overlap (022 max=009, 023 starts at 010) |
| Dependency | Clean git working tree | Blocks Phase 1 | Commit or stash all pending changes first |
| Dependency | Memory checkpoint system operational | Blocks safety net | Verify `checkpoint_create` works before proceeding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Data Integrity
- **NFR-D01**: Zero files lost during merge (verified by pre/post count)
- **NFR-D02**: Git history preserved for all moved files (use `git mv` where possible)

### Consistency
- **NFR-C01**: All memory files follow content-aware naming convention from `slug-utils.ts`
- **NFR-C02**: Phase numbering follows sequential order without gaps (001-033)

---

## 8. EDGE CASES

### Data Boundaries
- Duplicate memory content: SHA-256 hash comparison resolves exact duplicates
- Empty phase folders: Preserve `scratch/.gitkeep` to maintain directory structure

### Error Scenarios
- Phase folder name collision: +9 offset eliminates this — 022 uses 001-009, merged 023 uses 010-033
- Feature catalog snippet references to old paths: catalog groups are numbered independently and don't reference phase folder paths

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 200+, Folders: 33 phases + support dirs, Systems: 2 spec folders |
| Risk | 18/25 | Content loss: Y, Reference breakage: Y, Memory fragmentation: Y |
| Research | 12/20 | Structure fully mapped, references cataloged, path resolution analyzed |
| Multi-Agent | 8/15 | Parallelizable rename waves in batches of 3 |
| Coordination | 10/15 | Sequential: rename → reference-update → verify chain |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Content loss during folder move operations | H | M | Pre/post file counts; git preserves history |
| R-002 | Broken cross-references after path changes | H | H | Automated grep + manual spot-checks |
| R-003 | Memory index corruption from bulk path changes | M | L | Checkpoint before, full re-index after |
| R-004 | Phase number collision in merged structure | M | L | +9 offset arithmetic guarantees no overlap |
| R-005 | Test fixture breakage from hardcoded paths | L | M | Only 1 file affected; update lines 36, 41 |

---

## 11. USER STORIES

### US-001: Architecture Maintainer (Priority: P0)

**As an** architecture maintainer, **I want** a single spec folder for the Hybrid RAG Fusion system, **so that** I can find all phases, decisions, and memories in one location without checking two folders.

**Acceptance Criteria**:
1. Given the merged spec folder, When I browse `022-hybrid-rag-fusion/`, Then I see all 33 phases in sequential order
2. Given memory search, When I query "hybrid rag fusion", Then results come from a single consolidated folder

---

### US-002: New Contributor (Priority: P1)

**As a** new contributor, **I want** clear phase numbering without gaps or overlaps, **so that** I can understand the project's chronological development history.

**Acceptance Criteria**:
1. Given the phase listing, When I read folder names 001-033, Then the chronological order matches development history (022 phases first, 023 refinement phases after)

---

### US-003: Memory Searcher (Priority: P1)

**As a** user searching memories, **I want** all 31 memories indexed under one spec folder path, **so that** memory search returns complete results without missing context from the other folder.

**Acceptance Criteria**:
1. Given a memory search query, When results are returned, Then they include memories from both original development and refinement work
2. Given the memory directory, When I list files, Then all 31 files have content-aware names (no generic `hybrid-rag-fusion-refinement.md` slugs)

---

### US-004: CI/Build System (Priority: P0)

**As the** CI pipeline, **I want** all TypeScript compilation and enforcement checks to pass, **so that** the merge doesn't break existing workflows.

**Acceptance Criteria**:
1. Given the merged codebase, When `npx tsc --noEmit` runs, Then it exits 0 in both workspaces
2. Given the merged codebase, When `npm run check` runs from scripts/, Then all enforcement stages pass

---

## 12. OPEN QUESTIONS

- None — all architectural decisions resolved via ADRs (see `decision-record.md`)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
