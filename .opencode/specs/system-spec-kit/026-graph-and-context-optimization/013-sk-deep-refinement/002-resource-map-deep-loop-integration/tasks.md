---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Tasks: Resource Map Deep-Loop Integration"
description: "Ordered task list for authoring the shared extractor and wiring it into both deep-loop skills."
trigger_phrases:
  - "026/013 tasks"
  - "deep loop integration tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 tasks"
    next_safe_action: "Begin T001"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: Resource Map Deep-Loop Integration

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Inspect a completed loop's delta files (review + research) to confirm shape fields.
- [ ] T002 Draft a normalized evidence type shared by both skills.
- [ ] T003 Decide the extractor folder location (scripts/resource-map/ vs scripts/memory/).
- [ ] T004 Confirm the `resolveArtifactRoot()` signature and return shape.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Write `scripts/resource-map/extract-from-evidence.cjs` (shape adapters + category classifier + template renderer).
- [ ] T011 Write `scripts/resource-map/README.md` (input/output contract).
- [ ] T012 [P] Write vitest fixtures + snapshots in `scripts/tests/resource-map-extractor.vitest.ts`.
- [ ] T013 Wire `sk-deep-review/scripts/reduce-state.cjs` convergence branch to call the extractor.
- [ ] T014 Wire `sk-deep-research/scripts/reduce-state.cjs` convergence branch to call the extractor.
- [ ] T015 [P] Update `spec_kit_deep-review_auto.yaml` with `resource_map.emit` config + emission step.
- [ ] T016 [P] Update `spec_kit_deep-review_confirm.yaml` — same.
- [ ] T017 [P] Update `spec_kit_deep-research_auto.yaml` — same.
- [ ] T018 [P] Update `spec_kit_deep-research_confirm.yaml` — same.
- [ ] T019 Update `sk-deep-review/SKILL.md` to document the new output surface and opt-out.
- [ ] T020 Update `sk-deep-research/SKILL.md` — same.
- [ ] T021 Update `command/spec_kit/deep-review.md` with a brief mention.
- [ ] T022 Update `command/spec_kit/deep-research.md` — same.
- [ ] T023 Update `sk-deep-review/references/convergence.md` to include the emission step.
- [ ] T024 Update `sk-deep-research/references/convergence.md` — same.
- [ ] T025 [P] Create `sk-deep-review/feature_catalog/**/resource-map-emission.md`.
- [ ] T026 [P] Create `sk-deep-research/feature_catalog/**/resource-map-emission.md`.
- [ ] T027 [P] Create `sk-deep-review/manual_testing_playbook/**/resource-map-emission.md`.
- [ ] T028 [P] Create `sk-deep-research/manual_testing_playbook/**/resource-map-emission.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run `npx vitest run tests/resource-map-extractor.vitest.ts` — exit 0.
- [ ] T031 Run `cd mcp_server && npm run typecheck` — exit 0.
- [ ] T032 Manual dispatch `/spec_kit:deep-review :auto` on a small fixture packet; confirm map output.
- [ ] T033 Manual dispatch `/spec_kit:deep-research :auto` on a small fixture packet; confirm map output.
- [ ] T034 Test opt-out: `--no-resource-map` skips emission cleanly.
- [ ] T035 Run `validate.sh --strict` on this packet — exit 0.
- [ ] T036 `grep -rn "resource-map"` across updated surfaces — coverage check.
- [ ] T037 Finalize `implementation-summary.md` with Files Changed + Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 + P1 acceptance criteria from spec.md met.
- [ ] Vitest green.
- [ ] Two manual integration runs produce expected maps.
- [ ] Opt-out path exercised.
- [ ] `validate.sh --strict` exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Prerequisite phases**: 001-reverse-parent-research-review-folders (path-policy rollback) and 012-resource-map-template (template shape is locked)
<!-- /ANCHOR:cross-refs -->
