---
title: "Tasks: Foundational Runtime Deep Review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "016 tasks"
  - "foundational review tasks"
  - "deep review tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review"
    last_updated_at: "2026-04-16T00:00:00Z"
    last_updated_by: "claude-opus-4.6"
    recent_action: "Deep-dive analysis complete, Phase 0.5 deep-research added"
    next_safe_action: "Run T005 deep-research (50 iterations)"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:016-tasks-v1-2026-04-16"
      session_id: "016-planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Foundational Runtime Deep Review

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

<!-- ANCHOR:phase-0 -->
## Phase 0: Preflight

- [x] T001 Verify all 19 candidate files still exist at expected paths
- [x] T002 Check 015 remediation state for H6/H7 overlap (reconsolidation-bridge, post-insert)
- [x] T003 Cross-reference 015 findings to avoid duplicate review effort
- [x] T004 Deep-dive analysis — copilot gpt-5.4 produced 5 scratch reports (high/medium/low deep-dives, cross-cutting patterns, deep-review prompts)
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-05 -->
## Phase 0.5: Deep Research (50 iterations)

- [ ] T005 `/spec_kit:deep-research` on cross-cutting themes — silent fail-open, state contract honesty, concurrency/write coordination, stringly typed governance, test coverage gaps
- [ ] T006 Synthesize research findings into actionable review focus areas
<!-- /ANCHOR:phase-05 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: HIGH-Priority Deep Review

- [ ] T010 [P] `/spec_kit:deep-review` on `session-stop.ts` -- regex detection, autosave timeout, fingerprint contract (H1)
- [ ] T011 [P] `/spec_kit:deep-review` on `hook-state.ts` -- stale-state selection, atomic saves, concurrent sessions (H2)
- [ ] T012 [P] `/spec_kit:deep-review` on `shared-payload.ts` -- trust enum forward-compatibility, exhaustiveness (H3)
- [ ] T013 [P] `/spec_kit:deep-review` on `graph-metadata-parser.ts` -- manual/derived merge, legacy normalization, status derivation (H4)
- [ ] T014 [P] `/spec_kit:deep-review` on `adaptive-fusion.ts` -- hidden continuity profile, weight drift, resume-only activation (H5)
- [ ] T015 [P] `/spec_kit:deep-review` on `reconsolidation-bridge.ts` -- cross-boundary scope combinations, governance metadata (H6)
- [ ] T016 [P] `/spec_kit:deep-review` on `post-insert.ts` -- planner-mode contract, env-flag interactions, accidental mutation (H7)
- [ ] T017 Aggregate Phase 1 findings into interim summary
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: MEDIUM-Priority Deep Review

- [ ] T020 [P] `/spec_kit:deep-review` on `post-save-review.ts` -- lineage heuristics, over/under-linking (M1)
- [ ] T021 [P] `/spec_kit:deep-review` on `trigger-phrase-sanitizer.ts` -- unicode/HTML/control-char fuzzing (M2)
- [ ] T022 [P] `/spec_kit:deep-review` on `code-graph/query.ts` -- cyclic graphs, blast-radius, interaction matrix (M3)
- [ ] T023 [P] `/spec_kit:deep-review` on `backfill-graph-metadata.ts` -- derived-metadata entrenchment, bad propagation (M4)
- [ ] T024 [P] `/spec_kit:deep-review` on `skill_advisor.py` -- dual-source divergence, transitive boost damping (M5)
- [ ] T025 [P] `/spec_kit:deep-review` on `skill_graph_compiler.py` -- advisory vs release-gating integrity checks (M6)
- [ ] T026 [P] `/spec_kit:deep-review` on `spec_kit_plan_auto.yaml` -- concurrency, idempotence, folder-state edges (M7)
- [ ] T027 [P] `/spec_kit:deep-review` on `015 implementation-summary.md` -- residual fragility research pass (M8)
- [ ] T028 Aggregate Phase 2 findings into interim summary
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Synthesis and Remediation

- [ ] T030 Aggregate all findings from Phase 1 and Phase 2
- [ ] T031 Deduplicate findings against 015 review-report.md
- [ ] T032 Classify findings by severity (P0/P1/P2)
- [ ] T033 Identify cross-cutting patterns across candidates
- [ ] T034 Produce remediation backlog with effort estimates
- [ ] T035 Write implementation summary
- [ ] T036 Update parent 026 spec.md with 016 completion status
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 7 HIGH files reviewed
- [ ] All 8 MEDIUM files reviewed
- [ ] Findings synthesized and remediation backlog produced
- [ ] `validate.sh --strict` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Analysis Source**: See `scratch/026-analysis-output.md`
- **Prior Review**: See `015-implementation-deep-review/`
<!-- /ANCHOR:cross-refs -->
