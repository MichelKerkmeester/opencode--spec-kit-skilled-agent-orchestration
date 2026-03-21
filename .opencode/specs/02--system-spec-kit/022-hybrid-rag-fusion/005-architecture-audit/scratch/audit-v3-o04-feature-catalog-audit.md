# Architecture Audit v3 - Agent O4: Feature Catalog & Code Audit Completeness

**Auditor**: O4 (Claude Opus 4.6)
**Date**: 2026-03-21
**Scope**: 006-feature-catalog + 007-code-audit-per-feature-catalog
**Method**: Filesystem verification, cross-referencing spec claims against actual file counts, path validation, status consistency checks

---

## Executive Summary

The feature catalog (006) and code audit (007) phases represent a substantial body of work: 194 snippet files across 19 categories, 30 agent verification reports, and 21 child audit phases. The core audit and normalization work is largely sound, but several significant issues remain:

1. **14 snippet files exist on disk but are NOT referenced by the monolith index** -- the catalog is internally inconsistent.
2. **Section 20 (PHASE SYSTEM) in the monolith index has 4 features with NO corresponding snippet files** -- the reverse inconsistency.
3. **Phase 016-tooling-and-scripts claims "Draft" status while the parent 007 spec claims all 21 phases are "Complete"** -- status contradiction.
4. **30 of 30 Phase F remediation tasks remain unchecked in 006**, including T100 which was actually already completed silently.
5. **T101 and T102 remediation items contain false claims** about files that need to be removed but actually exist.
6. **Playbook count is 201, not the claimed 200** -- off-by-one from a post-spec addition.

**Finding count**: 15 total (1 CRITICAL, 4 HIGH, 7 MEDIUM, 3 LOW)

---

## Findings

### O4-001: 14 Snippet Files Not Referenced in Monolith Index
- **Severity**: CRITICAL
- **Category**: completeness
- **Location**: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- **Description**: 14 individual snippet files exist on disk but have no corresponding H3 entry or file reference in the monolith index (`feature_catalog.md`). This means the catalog's single-source-of-truth index is incomplete.
- **Evidence**: The following 14 files exist as snippets but are NOT linked from the index:
  - `01--retrieval/07-ast-level-section-retrieval-tool.md`
  - `13--memory-quality-and-indexing/19-post-save-quality-review.md`
  - `16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md`
  - `16--tooling-and-scripts/04-dead-code-removal.md`
  - `16--tooling-and-scripts/05-code-standards-alignment.md`
  - `17--governance/01-feature-flag-governance.md`
  - `17--governance/02-feature-flag-sunset-audit.md`
  - `19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` through `07-7-ci-and-build-informational.md` (all 7 files)
  The index has 184 file references but 194 snippet files exist (delta = 10 snippet files unreferenced from file links). However, section 21 (FEATURE FLAG REFERENCE) does contain H3 headings for the 7 feature-flag entries with inline content, but uses different `See [...]` link patterns pointing to the monolith index sections rather than individual files, meaning the 7 individual `19--feature-flag-reference/*.md` snippet files are orphaned from the index's link structure.
- **Impact**: Developers navigating the monolith index will miss 14 features. Automated tooling that parses the index for file references will undercount. The "194 files" claim in the spec is correct for disk but not for index coverage.
- **Recommended Fix**: Add proper `See [category/NN-name.md]` references for all 14 orphaned snippets. For section 21, link to the individual `19--feature-flag-reference/*.md` files instead of or in addition to inline content.

---

### O4-002: Section 20 (PHASE SYSTEM) Has No Snippet Files
- **Severity**: HIGH
- **Category**: completeness
- **Location**: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` (section 20)
- **Description**: The monolith index has a full section "20. PHASE SYSTEM" with 4 H3 feature entries (Phase detection and scoring, Phase folder creation, Recursive phase validation, Phase link validation), but there are no corresponding individual snippet files in any folder. All other sections (2-19, 21) have matching folders and individual files.
- **Evidence**: No folder named `20--phase-system` exists. The 4 Phase System features exist only as inline content in the monolith index. All other 190 features have individual snippet files.
- **Impact**: Inconsistent catalog structure. The Phase System features cannot be individually managed, updated, or referenced by snippet path. The gap between "197 H3 entries in index" and "194 snippet files" is explained by these 4 missing snippets plus the 1 OVERVIEW section header (197 - 194 = 3 features without files, but OVERVIEW is structural, not a feature).
- **Recommended Fix**: Create a `20--phase-system/` folder with 4 individual snippet files matching the other categories' structure (01-phase-detection-and-scoring.md, 02-phase-folder-creation.md, 03-recursive-phase-validation.md, 04-phase-link-validation.md).

---

### O4-003: Phase 016-tooling-and-scripts Status Contradiction
- **Severity**: HIGH
- **Category**: alignment
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016-tooling-and-scripts/spec.md` vs `007-code-audit-per-feature-catalog/spec.md`
- **Description**: The parent 007 spec.md PHASE DOCUMENTATION MAP declares all 21 phases as "Complete", but phase 016 (tooling-and-scripts) has `Status: Draft` in its own spec.md. Meanwhile, all 19 tasks in 016's tasks.md are marked `[x]` complete, all checklist items pass, and the implementation-summary.md documents substantial work.
- **Evidence**:
  - Parent: `| 016 | 016-tooling-and-scripts/ | Tooling/script audits | Complete |`
  - Child 016 spec.md: `| **Status** | Draft |`
  - Child 016 tasks.md: All 19 tasks marked `[x]`
  - Child 016 checklist.md: All items checked with evidence
- **Impact**: Anyone reviewing phase status will get contradictory signals. The parent says "done" while the child says "draft". This undermines trust in completion claims across the entire audit.
- **Recommended Fix**: Update 016 spec.md status from "Draft" to "Complete" since all tasks, checklist items, and implementation work are finished. Alternatively, if the phase is genuinely still in draft, update the parent PHASE DOCUMENTATION MAP.

---

### O4-004: Phase 021 Missing description.json
- **Severity**: MEDIUM
- **Category**: completeness
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/`
- **Description**: Phase 021 lacks a `description.json` file that all other 20 child phases have. This file is used by SpecKit tooling for phase discovery and metadata.
- **Evidence**: `ls` of 021 folder shows: `checklist.md, implementation-summary.md, plan.md, spec.md, tasks.md` -- no `description.json`. All other phases (001-020) include it.
- **Impact**: SpecKit tooling may fail to discover or properly index phase 021. Metadata-dependent operations (e.g., memory indexing, recursive validation) may skip this phase.
- **Recommended Fix**: Create `description.json` in the 021 folder matching the format used by sibling phases.

---

### O4-005: T100 Remediation Task Already Done But Still Marked Pending
- **Severity**: HIGH
- **Category**: alignment
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/tasks.md` (T100)
- **Description**: Task T100 states "Global replace `retry.vitest.ts` -> `retry-manager.vitest.ts` (52 snippets)" and is marked `[ ]` pending. However, the replacement has already been completed: 0 snippets now reference `retry.vitest.ts` and 50 reference `retry-manager.vitest.ts`.
- **Evidence**:
  - `grep -rl 'retry\.vitest\.ts' feature_catalog/` returns 0 matches
  - `grep -rl 'retry-manager\.vitest\.ts' feature_catalog/` returns 50 matches
  - T100 is still marked `[ ]`
- **Impact**: The task tracker shows 30 pending remediation items, but the true count is lower. This inflates the remaining work estimate and creates confusion about what actually needs to be done.
- **Recommended Fix**: Mark T100 as `[x]` with evidence noting the replacement was already completed.

---

### O4-006: T102 Claims Invalid File Path That Actually Exists
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/tasks.md` (T102)
- **Description**: T102 says "Remove `check-architecture-boundaries.ts` reference (1 snippet: 16-tooling/02)" implying the file doesn't exist. However, `scripts/evals/check-architecture-boundaries.ts` exists on disk and is a valid implementation file.
- **Evidence**:
  - File exists: `scripts/evals/check-architecture-boundaries.ts`
  - The snippet `16--tooling-and-scripts/02-architecture-boundary-enforcement.md` correctly references this file
  - The remediation manifest from the 30-agent audit likely flagged a bare `check-architecture-boundaries.ts` without the full `scripts/evals/` prefix path
- **Impact**: Acting on T102 as-is would incorrectly remove a valid source file reference. The task definition is wrong.
- **Recommended Fix**: Update T102 to reflect reality. If the issue was about path format (bare name vs full path), rephrase the task. If the reference is now correct, mark T102 as resolved/not-applicable.

---

### O4-007: T101 Targets Files That Actually Exist
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/tasks.md` (T101)
- **Description**: T101 says "Remove `slug-utils.ts` reference (2 snippets: 13-memory-quality/04, 11)" implying slug-utils.ts doesn't exist. However, `scripts/utils/slug-utils.ts` and `mcp_server/tests/slug-utils-boundary.vitest.ts` both exist on disk.
- **Evidence**:
  - `scripts/utils/slug-utils.ts` exists
  - `mcp_server/tests/slug-utils-boundary.vitest.ts` exists
  - 3 snippet files reference slug-utils.ts (not 2 as claimed): `16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`, `13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`, `13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md`
- **Impact**: Acting on T101 would incorrectly remove valid source file references. The task count is also wrong (3 files, not 2).
- **Recommended Fix**: Re-evaluate T101. The slug-utils.ts file exists and is valid. Mark as resolved/not-applicable or correct to address actual path format issues if any exist.

---

### O4-008: Playbook Count Off-By-One (201 vs Claimed 200)
- **Severity**: LOW
- **Category**: alignment
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md` (Normalization Addendum)
- **Description**: The 2026-03-21 Normalization Addendum claims "200 scenario files" but the actual playbook contains 201 files. The extra file (`13--memory-quality-and-indexing/155-post-save-quality-review.md`) was added after the spec count was recorded.
- **Evidence**:
  - `find manual_testing_playbook -name "*.md" -not -name "manual_testing_playbook.md" | wc -l` returns 201
  - Spec claims 200
  - Newest files: `16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md` and `13--memory-quality-and-indexing/155-post-save-quality-review.md`
- **Impact**: Minor documentation drift. Count claims in the spec are stale by 1.
- **Recommended Fix**: Update the normalization addendum count from 200 to 201 or to "201+" to account for ongoing additions.

---

### O4-009: Missing Test File Referenced in Snippet
- **Severity**: MEDIUM
- **Category**: dead-code
- **Location**: `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md`
- **Description**: The snippet file references `scripts/tests/post-save-review.vitest.ts` in its Source Files test table, but this file does not exist. The source file `scripts/core/post-save-review.ts` exists, but its test file was never created.
- **Evidence**:
  - `scripts/tests/post-save-review.vitest.ts` does NOT exist
  - `scripts/core/post-save-review.ts` DOES exist (implementation)
  - No test files matching `*post-save*` exist under `scripts/tests/`
- **Impact**: The snippet claims test coverage that doesn't exist. Anyone relying on the catalog for test reference will find a dead path.
- **Recommended Fix**: Either create the missing test file or update the snippet to remove the test reference and note that testing is via integration tests or is pending.

---

### O4-010: Status Inconsistency in Child Phase Naming
- **Severity**: LOW
- **Category**: alignment
- **Location**: Multiple child phase spec.md files under `007-code-audit-per-feature-catalog/`
- **Description**: Some child phases use "Complete" and others use "Completed" for the same status. While semantically identical, this is a consistency gap.
- **Evidence**:
  - "Complete" used by: 001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 014, 015, 017, 018, 019, 020
  - "Completed" used by: 012, 013, 021
  - "Draft" used by: 016
- **Impact**: Tooling that parses status values case-sensitively or expects exact matching may misclassify phases. Minor inconsistency.
- **Recommended Fix**: Normalize all to "Complete" (the majority form).

---

### O4-011: 30 Phase F Remediation Tasks Still Pending in 006
- **Severity**: HIGH
- **Category**: completeness
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/tasks.md` (Phase F section)
- **Description**: The 006 spec has status "In Progress" and Phase F contains 30 unchecked tasks covering: 4 batch fixes (E1), 18 feature rewrites (E2, minus 2 that were done as T128/T129), 63 description+path updates (E3), 81 path-only updates (E4), 11 description-only updates (E5), 77 new feature entries (E6), and 2 final sync tasks (F7). At least T100 has already been silently completed. The actual work may be partially done but is untracked.
- **Evidence**: `grep -c "^\- \[ \]" tasks.md` returns 30 pending items. T100 is confirmed already done. T101 and T102 target files that actually exist (false positives). The overall 006 status is correctly "In Progress".
- **Impact**: Large remediation backlog remains. The 49.4% description accuracy (below 95% target) from the Phase C audit has not been systematically addressed. The 77 new feature entries (48 confirmed gaps + 29 new gaps) remain uncreated.
- **Recommended Fix**: Triage Phase F: mark T100 done, invalidate T101/T102, re-assess which of the remaining 27+ tasks are still necessary given code changes since 2026-03-08. Prioritize E2 (18 feature rewrites) and E6 (77 new entries) as highest-impact remaining work.

---

### O4-012: Index-to-Folder Category Numbering Mismatch
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- **Description**: The monolith index uses sections 2-21 (20 numbered sections), but the folder structure uses `01--` through `19--` (19 numbered folders). The offset is because the index starts at "2. RETRIEVAL" (section 1 is OVERVIEW) while folders start at `01--retrieval`. Additionally, sections 20 (PHASE SYSTEM) and 21 (FEATURE FLAG REFERENCE) map to folder `19--feature-flag-reference` only -- no `20--phase-system` folder exists.
- **Evidence**:
  - Index: sections 2-21 (20 content sections)
  - Folders: `01--` through `19--` (19 folders)
  - Index section 20 (PHASE SYSTEM) has no folder
  - Index section 21 (FEATURE FLAG REFERENCE) maps to folder `19--feature-flag-reference`
  - The numbering offset (index N+1 = folder N) is confusing but consistent for sections 2-19
- **Impact**: Navigation confusion. A developer looking for "section 17 Governance" will find folder `17--governance` but the index says "18. GOVERNANCE". The off-by-one mapping works but is error-prone.
- **Recommended Fix**: This is a historical artifact that would be disruptive to renumber. Document the mapping explicitly in the catalog or rename sections to match folder numbers. Creating `20--phase-system/` (see O4-002) would partially address this.

---

### O4-013: Audit Phase 019 and 020 Have No Feature Catalog Folder Counterparts
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/` and `020-feature-flag-reference/`
- **Description**: The 007 code audit has 21 child phases, but phases 019 (decisions-and-deferrals) and 020 (feature-flag-reference) don't map to standard feature catalog categories. Phase 019 covers cross-cutting decisions, and 020 covers feature flags. While 020 does map to `19--feature-flag-reference/`, phase 019 has no corresponding category folder. Phase 021 (remediation-revalidation) is also a meta-phase with no category counterpart.
- **Evidence**:
  - Feature catalog has 19 category folders (01-- through 19--)
  - Audit has 21 phases (001 through 021)
  - Phases 019, 020, 021 are meta/structural rather than category-aligned
- **Impact**: Low -- these are legitimate meta-phases that handle cross-cutting concerns. However, the naming creates a false expectation that each audit phase maps 1:1 to a catalog category.
- **Recommended Fix**: No code change needed. Consider adding a note in the 007 parent spec clarifying that phases 019-021 are meta-phases, not category audits.

---

### O4-014: 006 Spec Claims "189" at 2026-03-16 But Index Had Only 184 File References
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md` (Current-State Addendum)
- **Description**: The 2026-03-16 addendum states "Current tree now contains 189 snippets" which matches the actual file count at that time. However, the monolith index only has 184 file reference links. The gap of 5 files (at the 189-file point) means some snippets were never indexed even at the time of the addendum.
- **Evidence**:
  - Index file references: 184 unique links
  - 2026-03-16 actual files: 189
  - 2026-03-21 actual files: 194
  - 14 current files have no index link (see O4-001)
- **Impact**: The addendum correctly counted disk files but did not verify index coverage. The 14-file gap existed before the normalization addendum and was not caught.
- **Recommended Fix**: The root fix is O4-001 (add missing references). No separate action needed here beyond documenting that the addendum was file-count-accurate but index-link-incomplete.

---

### O4-015: 006 Phase C Claimed "49.4% Description Accuracy" -- No Evidence of Improvement
- **Severity**: LOW
- **Category**: completeness
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/plan.md` (Phase C findings)
- **Description**: The Phase C synthesis found only 49.4% description accuracy against the 95% target (NFR-A01). Phase F remediation was designed to address this, but Phase F remains unexecuted (30 pending tasks). There is no evidence that description accuracy has improved since the 2026-03-08 audit.
- **Evidence**:
  - Phase C: "49.4% description accuracy (below 95% target)"
  - Phase F: 30/30 tasks still `[ ]`
  - T110-T127 (18 feature rewrites) all pending
  - T130 (63 description+path updates) pending
  - T150 (11 description-only updates) pending
- **Impact**: The feature catalog's descriptions for roughly half of all features are materially inaccurate or stale. This undermines the catalog's value as a reference document and can mislead developers or AI agents using it for context.
- **Recommended Fix**: Prioritize Phase F execution, particularly E2 (18 rewrites) and E5 (11 description updates) to improve accuracy. Consider a re-audit after fixes to measure the new accuracy level.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total findings** | 15 |
| **CRITICAL** | 1 |
| **HIGH** | 4 |
| **LOW** | 3 |
| **MEDIUM** | 7 |
| **Feature catalog snippet files (actual)** | 194 |
| **Feature catalog index H3 entries** | 197 |
| **Index file references (links)** | 184 |
| **Orphaned snippet files (no index link)** | 14 |
| **Missing snippet files (index claims, no file)** | 4 (Section 20 PHASE SYSTEM) |
| **007 child phases** | 21 |
| **007 phases claiming Complete** | 20 (parent claims 21, but 016 says Draft) |
| **006 Phase F pending tasks** | 30 (at least 1 already done, 2 are false positives) |
| **Playbook files (actual vs claimed)** | 201 vs 200 |
| **Missing source file paths in snippets** | 1 (`scripts/tests/post-save-review.vitest.ts`) |
| **Description accuracy (last measured)** | 49.4% (target: 95%) |

---

## Priority Ordering for Remediation

1. **O4-001** (CRITICAL): Fix the 14 orphaned snippet files in the monolith index. This is the single most impactful fix.
2. **O4-003** (HIGH): Resolve 016 status contradiction (Draft vs Complete).
3. **O4-005** (HIGH): Mark T100 as done. Clean up T101/T102 false positives.
4. **O4-002** (HIGH): Create `20--phase-system/` folder with 4 snippet files.
5. **O4-011** (HIGH): Triage remaining Phase F tasks, execute highest-priority items.
6. **O4-009** (MEDIUM): Fix or remove the dead test file reference.
7. **O4-004** (MEDIUM): Add description.json to phase 021.
8. **O4-012** (MEDIUM): Document the category numbering offset.
9. **O4-006**, **O4-007** (MEDIUM): Correct T101/T102 task definitions.
10. **O4-008**, **O4-010**, **O4-015** (LOW): Minor count and naming fixes.
