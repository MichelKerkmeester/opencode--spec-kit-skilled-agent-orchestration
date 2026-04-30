---
title: "Tasks: Deep-Review/Research Skill Contract Fixes"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task breakdown for resolver + YAML stage step + docs."
trigger_phrases:
  - "028-deep-review-skill-contract-fixes tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes"
    last_updated_at: "2026-04-29T09:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task ledger"
    next_safe_action: "Validate"
    blockers: []
    completion_pct: 90
---

# Tasks: Deep-Review/Research Skill Contract Fixes

<!-- SPECKIT_LEVEL: 1 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm scope is isolated from 025/026/027 file lists
- [x] T002 Locate resolver + YAML synthesis anchors + doc references
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite `resolveArtifactRoot` in `shared/review-research-paths.cjs`
- [x] T004 Update + extend tests in `scripts/tests/review-research-paths.vitest.ts`
- [x] T005 [P] Add `step_stage_artifact_dir` to `spec_kit_deep-review_auto.yaml`
- [x] T006 [P] Add `step_stage_artifact_dir` to `spec_kit_deep-review_confirm.yaml`
- [x] T007 [P] Add `step_stage_artifact_dir` to `spec_kit_deep-research_auto.yaml`
- [x] T008 [P] Add `step_stage_artifact_dir` to `spec_kit_deep-research_confirm.yaml`
- [x] T009 [P] Update sk-deep-review SKILL doc flat-first prose
- [x] T010 [P] Update sk-deep-research SKILL doc flat-first prose
- [x] T011 [P] Update sk-deep-review state_format reference
- [x] T012 [P] Update sk-deep-research state_format reference
- [x] T013 [P] Update system-spec-kit folder_structure reference
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 vitest on resolver suite — 7/7 passed
- [ ] T015 Strict validator on this packet
- [ ] T016 Implementation summary authored
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [ ] Validator green
- [ ] Implementation summary present
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source bugs**:
  - Bug 1: commit `6a8095907 feat(026/000/005/005): post-program cleanup loop + validator local-leak fix` shipped only review-report.md
  - Bug 2: `resolveArtifactRoot` always-pt-NN branch (`shared/review-research-paths.cjs:199-224` pre-028)
<!-- /ANCHOR:cross-refs -->
