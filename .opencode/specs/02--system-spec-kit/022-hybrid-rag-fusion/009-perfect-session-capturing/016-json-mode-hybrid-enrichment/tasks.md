---
title: "Tasks: JSON Mode Hybrid Enrichment (Phase 1B)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "json mode"
  - "hybrid enrichment"
importance_tier: "normal"
contextType: "general"
---
# Tasks: JSON Mode Hybrid Enrichment (Phase 1B)

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

- [x] T001 Define shipped structured-summary fields such as `toolCalls` and `exchanges` in `scripts/types/session-types.ts`
- [x] T002 Confirm file-backed JSON remains authoritative in `scripts/core/workflow.ts`
- [x] T003 Confirm the new structured fields remain optional for backward compatibility
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Carry structured summary support through the shared JSON contract and help text
- [x] T005 Preserve file-backed JSON authority instead of introducing a dedicated hybrid branch
- [x] T006 Record Wave 2 fixes for decision confidence, outcomes truncation, changed-file counts, and template-level count overrides
- [x] T007 Correct the phase docs so they no longer claim `enrichFileSourceData()` shipped in phase 016
- [x] T008 Reframe the research artifact as archival analysis of the non-shipped design
- [x] T009 Synchronize checklist evidence with the corrected plan, spec, ADR, and implementation summary
- [x] T019 RC5: Move `decisionCount` check before `total===0` early return in `detectContextType()` (`session-extractor.ts`)
- [x] T020 RC5: Add `explicitContextType` parameter to `detectSessionCharacteristics()` (`session-extractor.ts`)
- [x] T021 RC5: Add `contextType`/`context_type` to `RawInputData`, `NormalizedData`, and `CollectedDataBase` interfaces
- [x] T022 RC5: Propagate `contextType` through both fast-path and slow-path in `normalizeInputData()` (`input-normalizer.ts`)
- [x] T023 RC5: Extract and thread `explicitContextType` in `collectSessionData()` (`collect-session-data.ts`)
- [x] T024 RC3: Propagate `keyDecisions` through fast-path — create `_manualDecisions` + decision-type observations (`input-normalizer.ts`)
- [x] T025 RC2: Merge `_manualTriggerPhrases` into `preExtractedTriggers` before folder token dedup (`workflow.ts`)
- [x] T026 RC1: Add `_JSON_SESSION_SUMMARY` to `SessionData` interface (`session-types.ts`)
- [x] T027 RC1: Pass through `data.sessionSummary` as `_JSON_SESSION_SUMMARY` in `collectSessionData()` (`collect-session-data.ts`)
- [x] T028 RC1: Add `sessionData._JSON_SESSION_SUMMARY` as first candidate in `pickPreferredMemoryTask()` (`workflow.ts`)
- [x] T029 Create post-save quality review module (`scripts/core/post-save-review.ts`)
- [x] T030 Integrate Step 10.5 post-save review in workflow after file write, before indexing (`workflow.ts`)
- [x] T031 Add post-save review instructions to the 4 tracked instruction files present in this repo (CLAUDE.md, AGENTS.md, GEMINI.md, AGENTS_example_fs_enterprises.md)
- [x] T032 Update the phase-016 feature catalog entry with RC fixes and post-save review coverage
- [x] T033 Create the post-save quality review feature catalog entry under the memory-quality-and-indexing catalog
- [x] T034 Update the phase-153 manual testing playbook entry with field propagation tests
- [x] T035 Create the post-save quality review manual testing playbook entry under the memory-quality-and-indexing playbook set
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `npx tsc --noEmit`
- [x] T015 Run `npx tsc -b`
- [x] T016 Verify file-backed JSON remains on the authoritative structured path
- [x] T017 Verify structured summary fields and Wave 2 fixes remain documented and tested accurately
- [x] T018 Update phase documentation, implementation summary, and research framing
- [x] T036 Run `npx tsc --noEmit` — clean compilation
- [x] T037 Run `npx tsc` (scripts project) — dist files generated including `post-save-review.js`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks are marked `[x]`
- [x] No blocked tasks remain for this phase
- [x] Validation evidence exists for the new JSON metadata path and Wave 2 hardening fixes
- [x] Wave 3 RC fixes resolve all 5 JSON payload field propagation bugs (RC1-RC5)
- [x] Post-save quality review module detects silent field overrides
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
