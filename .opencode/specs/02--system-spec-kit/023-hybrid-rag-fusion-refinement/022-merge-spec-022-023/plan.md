---
title: "Implementation Plan: Merge Specs 022 & 023 into Unified 022-hybrid-rag-fusion [template:level_3/plan.md]"
description: "6-phase sequential merge plan: safety checkpoint, structure merge with +9 offset renumbering, memory consolidation with content-aware slugs, reference updates, cleanup, and verification."
trigger_phrases:
  - "merge plan"
  - "022 023 merge implementation"
  - "spec consolidation plan"
  - "phase renumbering plan"
importance_tier: "critical"
contextType: "architecture"
---
# Implementation Plan: Merge Specs 022 & 023 into Unified 022-hybrid-rag-fusion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Markdown documentation |
| **Framework** | system-spec-kit tooling + mcp_server runtime |
| **Storage** | SQLite memory/index stores (re-indexing required after path changes) |
| **Testing** | `npx tsc --noEmit` (both workspaces), `npm run check` (enforcement pipeline), manual grep verification |

### Overview
This plan merges two spec folders tracking the same Hybrid RAG Fusion system into one. Spec 022 retains its 9 original phases (001-009). Spec 023's 24 phase folders are moved into 022 with a +9 number offset (becoming 010-033). Spec 023's root documentation (from `000-feature-overview/`) is promoted to 022's parent-level docs. All 31 memory files are consolidated in `022-hybrid-rag-fusion/memory/` with content-aware names. The approach is strictly sequential: safety first, then structure, then references, then verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Full inventory of both spec folders completed (022: 9 phases, 6 memories; 023: 25 phases, 25 memories, 144 catalog snippets)
- [x] Renumbering strategy confirmed (+9 offset, no collisions)
- [x] Path resolution analysis confirmed (dynamic — only 1 test file with hardcoded "023" references)
- [x] ADRs documented for all major decisions

### Definition of Done
- [ ] All 33 phase folders present in `022-hybrid-rag-fusion/` with correct numbers
- [ ] All 31 memory files in root `memory/` with content-aware names
- [ ] Zero hits for `grep -r "023-hybrid-rag-fusion-refinement"` in the repository
- [ ] `npx tsc --noEmit` passes both workspaces
- [ ] `npm run check` passes all enforcement stages
- [ ] Pre/post file count matches (zero content loss)
- [ ] 023 folder fully deleted
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential folder merge with offset renumbering.

### Key Components
- **Source folder 022** (`022-hybrid-rag-fusion/`): 9 phases (001-009), 6 memories, scratch folder. No root-level parent docs.
- **Source folder 023** (`023-hybrid-rag-fusion-refinement/`): 25 phases (000-025, no 023), 25 memories, `feature_catalog/` (25 groups, 144 snippets), `manual_testing_playbook/`.
- **Target** (`022-hybrid-rag-fusion/`): Merged result with 33 phases, 31 memories, feature catalog, playbook, and root docs.

### Data Flow
1. Pre-merge state captured (file counts, memory checkpoint).
2. 023's root docs promoted to 022 parent level.
3. 023's phase folders moved with +9 offset renumbering.
4. Support directories (feature_catalog, manual_testing_playbook) moved to 022 root.
5. Memories consolidated: 022's renamed with content-aware slugs, 023's moved, deduped.
6. All references updated from "023-hybrid-rag-fusion-refinement" to "022-hybrid-rag-fusion".
7. 023 folder deleted; memories re-indexed.

### Phase Renumbering Map

| 023 Source | 022 Target | Folder Name (suffix preserved) |
|-----------|-----------|-------------------------------|
| 000-feature-overview | _(root docs)_ | Promoted to parent-level spec.md, plan.md, etc. |
| 001-sprint-0-foundation | 010-sprint-0-foundation | Phase offset +9 |
| 002-sprint-1-core-search | 011-sprint-1-core-search | Phase offset +9 |
| 003-sprint-2-advanced-search | 012-sprint-2-advanced-search | Phase offset +9 |
| 004-sprint-3-evaluation | 013-sprint-3-evaluation | Phase offset +9 |
| 005-sprint-4-learning | 014-sprint-4-learning | Phase offset +9 |
| 006-sprint-5-causal | 015-sprint-5-causal | Phase offset +9 |
| 007-sprint-5b-causal-refinement | 016-sprint-5b-causal-refinement | Phase offset +9 |
| 008-sprint-6-ablation | 017-sprint-6-ablation | Phase offset +9 |
| 009-sprint-7-telemetry | 018-sprint-7-telemetry | Phase offset +9 |
| 010-sprint-8-adaptive | 019-sprint-8-adaptive | Phase offset +9 |
| 011-sprint-8b-hardening | 020-sprint-8b-hardening | Phase offset +9 |
| 012-code-quality-hardening | 021-code-quality-hardening | Phase offset +9 |
| 013-pipeline-v2-migration | 022-pipeline-v2-migration | Phase offset +9 |
| 014-modularization-phase-1 | 023-modularization-phase-1 | Phase offset +9 |
| 015-modularization-phase-2 | 024-modularization-phase-2 | Phase offset +9 |
| 016-sprint-9-context-features | 025-sprint-9-context-features | Phase offset +9 |
| 017-context-and-search-improvements | 026-context-and-search-improvements | Phase offset +9 |
| 018-refinement-phase-7 | 027-refinement-phase-7 | Phase offset +9 |
| 019-sprint-9-extra-features | 028-sprint-9-extra-features | Phase offset +9 |
| 020-refinement-phase-8 | 029-refinement-phase-8 | Phase offset +9 |
| 021-architecture-boundary-enforcement | 030-architecture-boundary-enforcement | Phase offset +9 |
| 022-merge-spec-022-023 | 031-merge-spec-022-023 | Phase offset +9 |
| 024-sprint-10-hybrid-rag | 032-sprint-10-hybrid-rag | Phase offset +9 |
| 025-final-testing-and-validation | 033-final-testing-and-validation | Phase offset +9 |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Safety Checkpoint
- [ ] Ensure clean git working tree (commit or stash pending changes)
- [ ] Record pre-merge file counts for 022 (folders, files, memories)
- [ ] Record pre-merge file counts for 023 (folders, files, memories)
- [ ] Create memory checkpoint via `checkpoint_create` for rollback safety

### Phase 2: Structure Merge (Folder Operations)
- [ ] Copy 023's `000-feature-overview/` root docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md) to 022 root level
- [ ] Rename+move 023 phases 001-009 → 022 as 010-018 (batch 1)
- [ ] Rename+move 023 phases 010-018 → 022 as 019-027 (batch 2)
- [ ] Rename+move 023 phases 019-021 → 022 as 028-030 (batch 3)
- [ ] Rename+move 023 phase 022 → 022 as 031 (this merge phase)
- [ ] Rename+move 023 phases 024-025 → 022 as 032-033
- [ ] Move `feature_catalog/` to 022 root
- [ ] Move `manual_testing_playbook/` to 022 root

### Phase 3: Memory Consolidation
- [ ] Read content of 022's 6 generic-named memory files
- [ ] Generate content-aware slugs using `generateContentSlug()` logic
- [ ] Rename 022 memories with new content-aware slugs
- [ ] Move 023's 25 memories to 022/memory/
- [ ] Run SHA-256 dedup check across all 31 memory files
- [ ] Merge/regenerate metadata.json
- [ ] Verify 31 unique memory files in 022/memory/

### Phase 4: Reference Updates
- [ ] Find all files containing "023-hybrid-rag-fusion-refinement"
- [ ] Batch replace "023-hybrid-rag-fusion-refinement" → "022-hybrid-rag-fusion" in all spec docs
- [ ] Update phase number cross-references (old 023 numbers → new merged numbers)
- [ ] Update test fixture: `mcp_server/tests/hybrid-search-context-headers.vitest.ts` lines 36, 41
- [ ] Update parent navigation links (`../spec.md`) in moved phase folders
- [ ] Update memory frontmatter spec folder references
- [ ] Update ARCHITECTURE_BOUNDARIES.md if it references 023

### Phase 5: Cleanup
- [ ] Verify 023 folder is empty (all content moved)
- [ ] Delete 023 folder
- [ ] Re-index memories via `memory_index_scan`
- [ ] Verify memory search returns results under new paths

### Phase 6: Verification
- [ ] `npx tsc --noEmit` (scripts workspace)
- [ ] `npx tsc --noEmit` (mcp_server workspace)
- [ ] `npm run check` (scripts/)
- [ ] Compare pre/post file counts (zero content loss)
- [ ] `grep -r "023-hybrid-rag-fusion-refinement"` returns zero hits
- [ ] Spot-check 5 random cross-references manually
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| TypeScript compilation | Both workspaces (scripts/, mcp_server/) | `npx tsc --noEmit` |
| Enforcement pipeline | Import policy, architecture boundary checks | `npm run check` |
| Reference integrity | Zero stale "023" references in repo | `grep -r "023-hybrid-rag-fusion-refinement"` |
| Content integrity | Pre/post file count comparison | `find` + `wc` |
| Memory indexing | Memories discoverable under new paths | `memory_index_scan`, `memory_search` |
| Manual spot-check | 5 random cross-references resolve correctly | Manual file reads |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Clean git working tree | Internal | Green | Cannot proceed safely without clean state |
| Memory checkpoint system | Internal | Green | Losing rollback safety net |
| Content-aware slug generation (`slug-utils.ts`) | Internal | Green | Already implemented and tested |
| Dynamic path resolution in MCP runtime | Internal | Green | Confirmed — only 1 test file has hardcoded paths |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Content loss detected (file count mismatch), broken cross-references after reference update, or TypeScript compilation failures that can't be fixed.
- **Procedure**:
1. `git reset --hard HEAD~1` to revert all file moves and renames.
2. Restore memory checkpoint via `checkpoint_restore` to recover memory index state.
3. Verify both original spec folders are intact with `ls` and file counts.
4. Investigate root cause before re-attempting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Safety) → Phase 2 (Structure) → Phase 3 (Memories) → Phase 4 (References) → Phase 5 (Cleanup) → Phase 6 (Verify)
```

All phases are strictly sequential. Each depends on the previous phase completing successfully.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Safety | None | Phase 2 |
| Phase 2: Structure | Phase 1 | Phase 3, Phase 4 |
| Phase 3: Memories | Phase 2 | Phase 4 |
| Phase 4: References | Phase 2, Phase 3 | Phase 5 |
| Phase 5: Cleanup | Phase 4 | Phase 6 |
| Phase 6: Verification | Phase 5 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Safety Checkpoint | Low | 15 min |
| Phase 2: Structure Merge | Medium-High | 1-2 hours |
| Phase 3: Memory Consolidation | Medium | 30-60 min |
| Phase 4: Reference Updates | High | 2-4 hours |
| Phase 5: Cleanup | Low | 15 min |
| Phase 6: Verification | Medium | 30-60 min |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git working tree clean (committed or stashed)
- [ ] Memory checkpoint created via `checkpoint_create`
- [ ] Pre-merge file counts recorded

### Rollback Procedure
1. `git reset --hard HEAD~1` to revert all structural changes
2. `checkpoint_restore` to recover memory index state
3. Verify both 022 and 023 folders intact with original content
4. Run `npx tsc --noEmit` to confirm clean compile

### Data Reversal
- **Has data migrations?** Yes — memory index paths change
- **Reversal procedure**: Memory checkpoint restore handles this; alternatively, full `memory_index_scan` on original paths
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1    │────►│     Phase 2      │────►│     Phase 3      │
│   Safety     │     │  Structure Merge  │     │ Memory Consolid. │
└──────────────┘     └────────┬─────────┘     └────────┬─────────┘
                              │                        │
                              └────────────┬───────────┘
                                           ▼
                              ┌──────────────────┐
                              │     Phase 4      │
                              │ Reference Updates │
                              └────────┬─────────┘
                                       │
                              ┌────────▼─────────┐     ┌──────────────┐
                              │     Phase 5      │────►│   Phase 6    │
                              │     Cleanup      │     │ Verification │
                              └──────────────────┘     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Safety Checkpoint | None | File counts, memory checkpoint | All other phases |
| Structure Merge | Safety | Merged folder structure | Memory consolidation, References |
| Memory Consolidation | Structure | 31 consolidated memories | References |
| Reference Updates | Structure, Memories | Updated cross-references | Cleanup |
| Cleanup | References | Clean repo (no 023 folder) | Verification |
| Verification | Cleanup | Pass/fail evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Safety Checkpoint** — 15 min — CRITICAL
2. **Phase 2: Structure Merge** — 1-2 hours — CRITICAL
3. **Phase 3: Memory Consolidation** — 30-60 min — CRITICAL
4. **Phase 4: Reference Updates** — 2-4 hours — CRITICAL
5. **Phase 5: Cleanup** — 15 min — CRITICAL
6. **Phase 6: Verification** — 30-60 min — CRITICAL

**Total Critical Path**: 5-8 hours

**Parallel Opportunities**:
- None — all phases are strictly sequential due to data dependencies
- Within Phase 2, batch rename operations (batches 1-3) can run sequentially but are independent of feature_catalog/playbook moves
- Within Phase 4, folder name replacement and phase number updates are independent operations
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Structure merged | All 33 phases in 022, feature catalog + playbook moved | Phase 2 |
| M2 | Memories consolidated | 31 files in 022/memory/, zero duplicates, content-aware names | Phase 3 |
| M3 | References clean | Zero stale "023-hybrid-rag-fusion-refinement" references | Phase 4 |
| M4 | Verified and committed | All checks pass, counts match, committed to git | Phase 6 |
<!-- /ANCHOR:milestones -->

---

## AI Execution Protocol

### Pre-Task Checklist
- Confirm clean git working tree before any file operations.
- Record pre-merge file counts as first action.
- Create memory checkpoint before any moves.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute phases strictly in order (1→2→3→4→5→6). Do not skip ahead. |
| TASK-SCOPE | Only modify files within the two spec folders and the one test fixture file. |
| TASK-VERIFY | After each phase, verify expected state before proceeding to next phase. |
| TASK-COUNT | Maintain running file count to detect content loss at any point. |

### Status Reporting Format
`DONE | IN_PROGRESS | BLOCKED` with file path and command evidence per update.

### Blocked Task Protocol
If BLOCKED, record blocker, rollback to last safe state, and report before attempting alternative approach.
