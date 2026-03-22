# Cross-Check Report: Playbook IDs vs Phase Folder Assignments

> Generated: 2026-03-22
> Source: `context-playbook.md` (playbook) vs `001-*/spec.md` through `019-*/spec.md` (phases)

---

## Result: PASSED

All 265 playbook scenario IDs are assigned to exactly one phase folder. No missing, duplicate, or orphan IDs found.

---

## Summary Counts

| Metric | Count |
|--------|-------|
| Total unique scenario IDs in playbook | **265** |
| Total unique scenario IDs across all 19 phases | **265** |
| IDs in playbook but NOT assigned to any phase (MISSING) | **0** |
| IDs assigned to multiple phases (DUPLICATES) | **0** |
| IDs assigned to a phase but NOT in playbook (ORPHANS) | **0** |

---

## Per-Phase Breakdown

| Phase | Folder | Playbook IDs | Phase IDs | Match |
|-------|--------|-------------|-----------|-------|
| 001 | `001-retrieval/` | 11 | 11 | OK |
| 002 | `002-mutation/` | 9 | 9 | OK |
| 003 | `003-discovery/` | 3 | 3 | OK |
| 004 | `004-maintenance/` | 2 | 2 | OK |
| 005 | `005-lifecycle/` | 10 | 10 | OK |
| 006 | `006-analysis/` | 7 | 7 | OK |
| 007 | `007-evaluation/` | 2 | 2 | OK |
| 008 | `008-bug-fixes-and-data-integrity/` | 11 | 11 | OK |
| 009 | `009-evaluation-and-measurement/` | 16 | 16 | OK |
| 010 | `010-graph-signal-activation/` | 15 | 15 | OK |
| 011 | `011-scoring-and-calibration/` | 22 | 22 | OK |
| 012 | `012-query-intelligence/` | 10 | 10 | OK |
| 013 | `013-memory-quality-and-indexing/` | 34 | 34 | OK |
| 014 | `014-pipeline-architecture/` | 18 | 18 | OK |
| 015 | `015-retrieval-enhancements/` | 11 | 11 | OK |
| 016 | `016-tooling-and-scripts/` | 60 | 60 | OK |
| 017 | `017-governance/` | 5 | 5 | OK |
| 018 | `018-ux-hooks/` | 11 | 11 | OK |
| 019 | `019-feature-flag-reference/` | 8 | 8 | OK |
| **TOTAL** | | **265** | **265** | **OK** |

---

## Methodology

1. Extracted all exact scenario IDs from `scratch/context-playbook.md` per-category `Exact IDs:` lines (source of truth).
2. For each of the 19 phase folders (`001-retrieval/` through `019-feature-flag-reference/`), read the `spec.md` and extracted all scenario IDs from the requirements/scenario tables.
3. Computed set differences:
   - **MISSING** = playbook IDs minus phase IDs
   - **ORPHANS** = phase IDs minus playbook IDs
   - **DUPLICATES** = IDs appearing in more than one phase folder
4. All three sets are empty, confirming a 1:1 mapping between playbook and phases.

---

## Sub-Scenario Verification

The 39 sub-scenario IDs (responsible for the 226 files to 265 IDs expansion) are all correctly assigned:

| Parent | Sub-IDs | Phase | Verified |
|--------|---------|-------|----------|
| M-005 | M-005a, M-005b, M-005c | 013-memory-quality-and-indexing | OK |
| M-006 | M-006a, M-006b, M-006c | 013-memory-quality-and-indexing | OK |
| 155 | 155-F | 013-memory-quality-and-indexing | OK |
| M-007 | M-007a through M-007q (17 sub-IDs) | 016-tooling-and-scripts | OK |
| 153 | 153-A through 153-O (15 sub-IDs) | 016-tooling-and-scripts | OK |

---

## Missing IDs

None.

## Duplicate IDs

None.

## Orphan IDs

None.
