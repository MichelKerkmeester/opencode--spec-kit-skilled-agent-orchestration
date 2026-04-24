---
title: "...kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/002-scoring-and-filter/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "scoring filter tasks"
  - "quality scorer tasks"
  - "contamination filter tasks"
  - "002-scoring-and-filter tasks"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/002-scoring-and-filter"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Scoring and Filter

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
## Phase 1: Setup

- [x] T001 Record baseline Vitest pass count before any changes (`npx vitest run`)
- [x] T002 Fix calibration test import: line 5, change `core/quality-scorer` to `extractors/quality-scorer` (scripts/tests/quality-scorer-calibration.vitest.ts)
- [x] T003 Run calibration tests after import fix; confirm tests exercise live scorer (`npx vitest run quality-scorer-calibration`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read extractors/quality-scorer.ts lines 113-205 and map current bonus constants and penalty structure
- [x] T005 Remove the three bonus additions (+0.05 messages, +0.05 tools, +0.10 decisions) from extractors/quality-scorer.ts
- [x] T006 Verify penalty math after removal: five simultaneous MEDIUM penalties should produce a score meaningfully below 0.90
- [x] T007 Adjust penalty weights if needed so the full 0.60-1.00 range is in active use for real sessions
- [x] T008 Run calibration tests after recalibration; confirm expected score distribution
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Contamination Filter Extension (P0)

- [x] T009 Read workflow.ts lines 548-602 and map all existing filterContamination call sites
- [x] T010 Add filterContamination call for `_JSON_SESSION_SUMMARY` with undefined guard (core/workflow.ts)
- [x] T011 Add filterContamination call looped over each entry in `_manualDecisions` array (core/workflow.ts)
- [x] T012 Add filterContamination call looped over each entry in `recentContext` array (core/workflow.ts)
- [x] T013 Add filterContamination call for `technicalContext` KEY strings (core/workflow.ts)
- [x] T014 Add filterContamination call for `technicalContext` VALUE strings (core/workflow.ts)
- [x] T015 Manual test: save a JSON payload with "I think this is important" in sessionSummary; confirm saved memory does not contain that phrase

---

### Missing Contamination Categories (P1)

- [x] T016 [P] Read contamination-filter.ts and enumerate current 29 patterns; confirm count
- [x] T017 [P] Add hedging phrases category: "I think", "it seems", "perhaps", "might be", "could be" (extractors/contamination-filter.ts)
- [x] T018 [P] Add conversational acknowledgment: "Certainly!", "Of course!", "Sure!", "Absolutely!" (extractors/contamination-filter.ts)
- [x] T019 [P] Add meta-commentary: "As an AI", "As a language model", "I should note that" (extractors/contamination-filter.ts)
- [x] T020 [P] Add instruction echoing patterns for common prompt-fragment repetition (extractors/contamination-filter.ts)
- [x] T021 [P] Add markdown artifact patterns for orphaned headers and stray backtick blocks in prose (extractors/contamination-filter.ts)
- [x] T022 [P] Add safety disclaimer patterns: "I'm not able to", "I cannot", "Please consult" (extractors/contamination-filter.ts)
- [x] T023 [P] Add redundant certainty markers: "It is important to note", "It is worth mentioning" (extractors/contamination-filter.ts)
- [x] T024 Run contamination filter unit tests; confirm no over-stripping of valid content

---

### projectPhase Override (P1)

- [x] T025 Read session-extractor.ts lines 188-207 to understand resolveContextType() and resolveImportanceTier() explicit-override pattern
- [x] T026 Implement resolveProjectPhase() following the same pattern (scripts/extractors/session-extractor.ts)
- [x] T027 Read input-normalizer.ts lines 437-491 (fast path) to find current projectPhase handling (if any)
- [x] T028 Add projectPhase propagation in fast-path normalization branch (scripts/utils/input-normalizer.ts)
- [x] T029 Add projectPhase propagation in slow-path normalization branch (scripts/utils/input-normalizer.ts)
- [x] T030 Manual test: JSON save with `"projectPhase": "IMPLEMENTATION"` produces `PROJECT_PHASE: IMPLEMENTATION` in saved memory frontmatter (tested via resolveProjectPhase unit verification)
- [x] T031 Manual test: JSON save without projectPhase field produces `PROJECT_PHASE: RESEARCH` (inferred default, unchanged) (tested via resolveProjectPhase unit verification)

---

### Post-Save Review Score Feedback (P1)

- [x] T032 Read post-save-review.ts to understand finding severity output structure (HIGH / MEDIUM / LOW)
- [x] T033 Define penalty values per severity level (document decision in decision-record.md ADR-003 before implementing)
- [x] T034 Add score adjustment in post-save-review.ts: compute total penalty from findings, pass to scorer (scripts/core/post-save-review.ts)
- [x] T035 Add adjustment hook in extractors/quality-scorer.ts or apply post-review delta at call site
- [x] T036 Manual test: trigger a HIGH post-save finding and confirm quality_score in saved file is lower than pre-review value (advisory logging verified; file patching removed to preserve dedup)

---

### Final Verification

- [x] T037 Run full `npx vitest run`; confirm zero regressions against baseline from T001
- [x] T038 End-to-end save with deliberately low-quality JSON payload (short summary, few observations, vague decisions); confirm quality_score < 0.80
- [x] T039 End-to-end save with clean, rich JSON payload; confirm quality_score >= 0.90
- [x] T040 End-to-end save with contaminated text in all 4 newly covered fields; inspect saved memory for absence of contamination
- [x] T041 Confirm PROJECT_PHASE behaves correctly for both supplied and absent projectPhase inputs
- [x] T042 Mark all checklist.md P0 items [x] with evidence references
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks (T001-T015, T037-T042) marked `[x]`
- [x] All P1 tasks (T016-T036) marked `[x]` OR individually deferred with user approval
- [x] No `[B]` blocked tasks remaining without documented resolution
- [x] `npx vitest run` passes with zero regressions
- [x] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Research**: `../research/research.md` (Round 2, Domains C + E)
<!-- /ANCHOR:cross-refs -->
