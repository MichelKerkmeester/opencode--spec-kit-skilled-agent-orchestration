---
title: "Tasks: Merge Specs 022 & 023 into Unified 022-hybrid-rag-fusion [template:level_3/tasks.md]"
description: "55 atomic tasks across 6 sequential phases: safety, structure merge, memory consolidation, reference updates, cleanup, verification."
trigger_phrases:
  - "merge tasks"
  - "022 023 task breakdown"
  - "spec merge tasks"
  - "renumbering tasks"
importance_tier: "critical"
contextType: "architecture"
---
# Tasks: Merge Specs 022 & 023 into Unified 022-hybrid-rag-fusion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Safety Checkpoint

- [ ] T001 Ensure clean git working tree — commit or stash all pending changes
- [ ] T002 Record pre-merge file counts for 022 — folders, files, memories (`find specs/02--system-spec-kit/022-hybrid-rag-fusion/ | wc -l`)
- [ ] T003 Record pre-merge file counts for 023 — folders, files, memories (`find specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/ | wc -l`)
- [ ] T004 Create memory checkpoint via `checkpoint_create` named "pre-merge-022-023"
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Structure Merge (Folder Operations)

### Root Document Promotion
- [ ] T005 Copy `023/000-feature-overview/spec.md` to `022/spec.md` (root parent doc)
- [ ] T006 Copy `023/000-feature-overview/plan.md` to `022/plan.md`
- [ ] T007 Copy `023/000-feature-overview/tasks.md` to `022/tasks.md`
- [ ] T008 [P] Copy `023/000-feature-overview/checklist.md` to `022/checklist.md`
- [ ] T009 [P] Copy `023/000-feature-overview/decision-record.md` to `022/decision-record.md`
- [ ] T010 [P] Copy `023/000-feature-overview/implementation-summary.md` to `022/implementation-summary.md`
- [ ] T011 [P] Copy `023/000-feature-overview/scratch/` contents to `022/000-feature-overview/scratch/` (preserve as phase)

### Phase Rename Batch 1 (023 phases 001-009 → 022 phases 010-018)
- [ ] T012 Move `023/001-sprint-0-foundation/` → `022/010-sprint-0-foundation/`
- [ ] T013 Move `023/002-sprint-1-core-search/` → `022/011-sprint-1-core-search/`
- [ ] T014 Move `023/003-sprint-2-advanced-search/` → `022/012-sprint-2-advanced-search/`
- [ ] T015 Move `023/004-sprint-3-evaluation/` → `022/013-sprint-3-evaluation/`
- [ ] T016 Move `023/005-sprint-4-learning/` → `022/014-sprint-4-learning/`
- [ ] T017 Move `023/006-sprint-5-causal/` → `022/015-sprint-5-causal/`
- [ ] T018 Move `023/007-sprint-5b-causal-refinement/` → `022/016-sprint-5b-causal-refinement/`
- [ ] T019 Move `023/008-sprint-6-ablation/` → `022/017-sprint-6-ablation/`
- [ ] T020 Move `023/009-sprint-7-telemetry/` → `022/018-sprint-7-telemetry/`

### Phase Rename Batch 2 (023 phases 010-018 → 022 phases 019-027)
- [ ] T021 Move `023/010-sprint-8-adaptive/` → `022/019-sprint-8-adaptive/`
- [ ] T022 Move `023/011-sprint-8b-hardening/` → `022/020-sprint-8b-hardening/`
- [ ] T023 Move `023/012-code-quality-hardening/` → `022/021-code-quality-hardening/`
- [ ] T024 Move `023/013-pipeline-v2-migration/` → `022/022-pipeline-v2-migration/`
- [ ] T025 Move `023/014-modularization-phase-1/` → `022/023-modularization-phase-1/`
- [ ] T026 Move `023/015-modularization-phase-2/` → `022/024-modularization-phase-2/`
- [ ] T027 Move `023/016-sprint-9-context-features/` → `022/025-sprint-9-context-features/`
- [ ] T028 Move `023/017-context-and-search-improvements/` → `022/026-context-and-search-improvements/`
- [ ] T029 Move `023/018-refinement-phase-7/` → `022/027-refinement-phase-7/`

### Phase Rename Batch 3 (023 phases 019-022 → 022 phases 028-031)
- [ ] T030 Move `023/019-sprint-9-extra-features/` → `022/028-sprint-9-extra-features/`
- [ ] T031 Move `023/020-refinement-phase-8/` → `022/029-refinement-phase-8/`
- [ ] T032 Move `023/021-architecture-boundary-enforcement/` → `022/030-architecture-boundary-enforcement/`
- [ ] T033 Move `023/022-merge-spec-022-023/` → `022/031-merge-spec-022-023/`

### Phase Rename Batch 4 (023 phases 024-025 → 022 phases 032-033)
- [ ] T034 Move `023/024-sprint-10-hybrid-rag/` → `022/032-sprint-10-hybrid-rag/`
- [ ] T035 Move `023/025-final-testing-and-validation/` → `022/033-final-testing-and-validation/`

### Support Directory Migration
- [ ] T036 Move `023/feature_catalog/` → `022/feature_catalog/`
- [ ] T037 Move `023/manual_testing_playbook/` → `022/manual_testing_playbook/`
- [ ] T038 Verify all 33 phase folders present in 022 (`ls 022/` shows 001-033)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Memory Consolidation

- [ ] T039 Read content of 022's 6 generic-named memory files to determine task descriptions
- [ ] T040 Generate content-aware slugs for each of 022's 6 memories using `generateContentSlug()` logic
- [ ] T041 Rename 022's 6 memory files with new content-aware slugs (preserving date prefix)
- [ ] T042 Move 023's 25 memory files to `022/memory/`
- [ ] T043 Run SHA-256 dedup check across all 31 memory files — remove exact duplicates
- [ ] T044 Merge metadata.json from both folders (combine entries, update paths)
- [ ] T045 Verify 31 unique memory files in `022/memory/` (or fewer if dedup found matches)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Reference Updates

### Folder Name Replacement
- [ ] T046 Find all files containing "023-hybrid-rag-fusion-refinement" (`grep -r`)
- [ ] T047 Replace "023-hybrid-rag-fusion-refinement" → "022-hybrid-rag-fusion" in all spec docs (batch 1: phase folders 010-018)
- [ ] T048 Replace "023-hybrid-rag-fusion-refinement" → "022-hybrid-rag-fusion" in spec docs (batch 2: phase folders 019-027)
- [ ] T049 Replace "023-hybrid-rag-fusion-refinement" → "022-hybrid-rag-fusion" in spec docs (batch 3: phase folders 028-033)
- [ ] T050 Replace "023-hybrid-rag-fusion-refinement" → "022-hybrid-rag-fusion" in root docs, feature catalog, memory frontmatter

### Phase Number Cross-References
- [ ] T051 Update internal cross-references from old 023 phase numbers to new merged numbers in phase docs
- [ ] T052 Update parent navigation links (`../spec.md`, `../plan.md`) in moved phases if they reference 023 paths

### External References
- [ ] T053 Update test fixture in `mcp_server/tests/hybrid-search-context-headers.vitest.ts` lines 36, 41
- [ ] T054 Update `ARCHITECTURE_BOUNDARIES.md` if it references 023 paths
- [ ] T055 Update memory frontmatter `specFolder` references in all 31 memory files
- [ ] T056 Verify zero hits for `grep -r "023-hybrid-rag-fusion-refinement"` across entire repo
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Cleanup

- [ ] T057 Verify 023 folder is empty (all content moved — only folder shell remaining)
- [ ] T058 Delete 023 folder (`rm -rf specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/`)
- [ ] T059 Re-index memories via `memory_index_scan` for the merged 022 spec folder
- [ ] T060 Verify memory search returns results under new `022-hybrid-rag-fusion` paths
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Verification

- [ ] T061 Run `npx tsc --noEmit` in scripts workspace — must exit 0
- [ ] T062 Run `npx tsc --noEmit` in mcp_server workspace — must exit 0
- [ ] T063 Run `npm run check` from scripts/ — all enforcement stages pass
- [ ] T064 Compare pre/post file counts — total must match (zero content loss)
- [ ] T065 Run final `grep -r "023-hybrid-rag-fusion-refinement"` — must return zero hits
- [ ] T066 Spot-check 5 random cross-references from different phases — all resolve correctly
- [ ] T067 Verify feature catalog integrity — 25 groups, 144+ snippet files present
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 67 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Pre/post file count verification passed
- [ ] All build checks passed (tsc, npm run check)
- [ ] Zero stale "023" references in repository
- [ ] Memory search operational under new paths
- [ ] Committed to git with descriptive merge commit message
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
