---
title: "Tasks: Performance Loading on User Interaction - anobel.com"
description: "Task Format: T### [P?] Description (file path/workstream)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "interaction gating"
  - "deferred loading"
  - "performance"
  - "035"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Performance Loading on User Interaction - anobel.com

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

**Task Format**: `T### [P?] Description (file path/workstream)`

**Workstream tags**:
- `[W:SITE]` Website implementation work
- `[W:SKILL]` External `sk-code--web` updates
- `[W:VERIFY]` Measurement and regression verification

## Canonical Matrix Mapping

| Matrix ID | Primary Tasks |
|-----------|---------------|
| CM-001 | T010, T011, T012, T021 |
| CM-002 | T010, T011, T012, T021 |
| CM-003 | T013, T021 |
| CM-004 | T014, T021 |
| CM-005 | T015, T021 |
| CM-006 | T016, T021 |
| CM-007 | T017, T021 |
| CM-008 | T029 |
| CM-009 | T029 |
| CM-010 | T029 |
| CM-011 | T018, T019, T030 |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline and Taxonomy Lock

- [ ] T001 [W:VERIFY] Capture Lighthouse/PageSpeed baseline for `home`, `contact`, `werken_bij` (`scratch/metrics/*`)
- [ ] T002 [W:SITE] Freeze canonical matrix CM-001..CM-011 (gate, trigger, fallback, exclusion, verification) (`spec.md`, `plan.md`)
- [ ] T003 [W:SITE] Confirm non-deferrable exclusion list (hero/LCP + cookie consent) (`spec.md`)
- [ ] T004 [W:SITE] Define rollout guardrails: canary scope, halt conditions, rollback toggle path, SW transition rules (`plan.md`, `checklist.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Shared Bootstrap Architecture

- [ ] T005 [W:SITE] Implement centralized gate runtime bootstrap (`src/0_html/global.html`)
- [ ] T006 [W:SITE] Add idempotent gate adapter API for module init (`src/2_javascript/global/*`)
- [ ] T007 [W:SITE] Add interaction triggers (pointer/key/scroll) with fallback behavior (`src/2_javascript/global/*`)
- [ ] T008 [W:SITE] Add viewport triggers for component-bound modules (`src/2_javascript/global/*`)
- [ ] T009 [W:SITE] Add idle trigger strategy with timeout fallback (`src/2_javascript/global/*`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Website Candidate Migration

- [ ] T010 [W:SITE] Migrate CM-001/CM-002 form entry scripts to interaction gates (`src/0_html/contact.html`, `src/0_html/werken_bij.html`)
- [ ] T011 [W:SITE] Implement CM-001/CM-002 gate-aware startup in form submission flow (`src/2_javascript/form/form_submission.js`)
- [ ] T012 [W:SITE] Implement CM-001/CM-002 gate-aware upload initialization (`src/2_javascript/form/input_upload.js`)
- [ ] T013 [W:SITE] Apply CM-003 Lenis interaction trigger policy (`src/0_html/global.html`)
- [ ] T014 [P] [W:SITE] Apply CM-004 marquee viewport-first policy (`src/2_javascript/swiper/marquee_brands.js`)
- [ ] T015 [P] [W:SITE] Apply CM-005 timeline viewport-first policy (`src/2_javascript/swiper/timeline.js`)
- [ ] T016 [W:SITE] Apply CM-006 two-step HLS hover/background policy (`src/2_javascript/video/video_background_hls_hover.js`, `src/2_javascript/video/video_background_hls.js`)
- [ ] T017 [W:SITE] Apply CM-007 navigation interaction policy with Motion-ready guard (`src/2_javascript/navigation/nav_mobile_menu.js`, `src/2_javascript/navigation/nav_dropdown.js`, `src/2_javascript/navigation/nav_language_selector.js`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Cache and Reliability Hardening

- [ ] T018 [W:SITE] Align CM-011 service worker precache/runtime lists with deferred strategy (`src/2_javascript/global/service_worker.js`)
- [ ] T019 [W:SITE] Implement CM-011 cache invalidation and policy-version checks (`src/2_javascript/global/service_worker.js`)
- [ ] T020 [W:VERIFY] Validate no-interaction/no-idle/no-intersection fallback behavior (browser test evidence)
- [ ] T021 [W:VERIFY] Run regression checks for forms, uploads, navigation, sliders, and video flows (test evidence)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: External Skill `sk-code--web` Improvements

- [ ] T022 [W:SKILL] Extend PERFORMANCE task signals for interaction/defer/Lighthouse/TBT/INP terminology (`sk-code--web` skill manifest)
- [ ] T023 [W:SKILL] Expand `RESOURCE_MAP["PERFORMANCE"]` to include high-value performance references (`sk-code--web` skill manifest)
- [ ] T024 [W:SKILL] Create interaction-gated loading reference (`references/performance/interaction_gated_loading` markdown doc)
- [ ] T025 [W:SKILL] Create reusable interaction gate pattern asset (`.../sk-code--web/assets/patterns/interaction_gate_patterns.js`) [Required first increment]
- [ ] T026 [W:SKILL] Create performance loading checklist asset (`assets/checklists/performance_loading_checklist`) [Required first increment]
- [ ] T027 [W:VERIFY] Validate router picks new resources for a 10-prompt test set (pass threshold >= 9/10) (routing test evidence)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Verification and Rollout Readiness

- [ ] T028 [W:VERIFY] Capture after-change Lighthouse/PageSpeed measurements and compare with baseline (`scratch/metrics/*`)
- [ ] T029 [W:VERIFY] Confirm non-deferrable flows remain unchanged (hero/LCP/cookie consent evidence)
- [ ] T030 [W:VERIFY] Run canary readiness checks (C1/C2/GA) including SW transition verification and finalize rollout recommendation (`checklist.md`)
- [ ] T031 [W:SITE] Prepare implementation summary after implementation completes (implementation summary document)
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks complete and verified with evidence.
- [ ] No `[B]` blocked task remains on critical path (T001, T005, T010, T018, T028, T030).
- [ ] Skill routing improvements validated for interaction-gated prompts.
- [ ] Final checklist P0/P1 status reflects implementation reality.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
