---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: Post-Stress Follow-Up Research"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "T001-T204 task ledger covering scaffold (Phase 1), invocation (Phase 2), iteration loop (Phase 3), synthesis (Phase 4), verification (Phase 5)."
trigger_phrases:
  - "post-stress follow-up tasks"
  - "v1.0.2 follow-up tasks"
importance_tier: "important"
contextType: "tasks-ledger"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research"
    last_updated_at: "2026-04-27T18:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "T004 validate scaffold"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Post-Stress Follow-Up Research

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending
- `[x]` complete
- `[~]` in progress
- `[!]` blocked
- Each task has `Tnnn` ID, action, optional file refs, and acceptance criterion.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Author `spec.md` with metadata, problem, scope (4 follow-ups + 1 light arch touch), REQ-001..010, SC-001..007, risks, open questions.
  - **File**: `spec.md`
  - **Acceptance**: Required anchors present (metadata/problem/scope/requirements/success-criteria/risks/open-questions); v2.2 frontmatter; LEVEL=1.

- [x] **T002** Author `plan.md` with technical context, ASCII architecture diagram, 5-phase plan, canonical topic prompt, dependencies, rollback.
  - **File**: `plan.md`
  - **Acceptance**: Required anchors present (context/architecture/phases/testing/dependencies/rollback); plan §4 contains the verbatim topic prompt for T101.

- [x] **T003** Author `tasks.md` (this file).
  - **File**: `tasks.md`
  - **Acceptance**: T001-T304 covered with Phase 1-5 anchors + cross-refs.

- [ ] **T004** Author `checklist.md` with P0/P1/P2 quality gates (each follow-up has falsifiable proposal; intelligence-system seam touched ≥1; no fabricated paths in research.md; convergence stop reason valid).
  - **File**: `checklist.md`
  - **Acceptance**: Required anchor `checklist`; gates P0/P1/P2 grouped.

- [ ] **T005** Author `description.json` with `specId="011"`, slug + trigger phrases.
  - **File**: `description.json`
  - **Acceptance**: Schema matches sibling 010 packet; `parentChain` resolves to `011-mcp-runtime-stress-remediation`.

- [ ] **T006** Author `graph-metadata.json` with `parent_id`, `children_ids:[]`, `manual.depends_on=[010]`, `manual.related_to=[003-009]`.
  - **File**: `graph-metadata.json`
  - **Acceptance**: schema_version=1; `derived.status="draft"`; `last_save_at` and `last_active_at` set.

- [ ] **T007** Update parent `011-mcp-runtime-stress-remediation/spec.md` PHASE DOCUMENTATION MAP with row 11.
  - **File**: `../spec.md`
  - **Acceptance**: row references `011-post-stress-followup-research/`.

- [ ] **T008** Update parent `description.json` `migration.child_phase_folders` + `lastUpdated`.
  - **File**: `../description.json`
  - **Acceptance**: child path appended; `lastUpdated` bumped.

- [ ] **T009** Update parent `graph-metadata.json` `derived.children_ids` + `last_active_child_id` + `last_save_at`.
  - **File**: `../graph-metadata.json`
  - **Acceptance**: child packet appears in children_ids; last_active_child_id points at it.

- [ ] **T010** Update parent `resource-map.md` Specs section + bump counts.
  - **File**: `../resource-map.md`
  - **Acceptance**: ≥1 row references new packet; total counts incremented.

- [ ] **T011** Update parent `HANDOVER-deferred.md` §3 items 4-6 (newly-surfaced from v1.0.2): point to this packet for research follow-up.
  - **File**: `../HANDOVER-deferred.md`
  - **Acceptance**: §3 items 4-6 reference `011-post-stress-followup-research/research/research.md` as the convergence target.

- [ ] **T012** Run `validate.sh --strict` on new packet; expect 0 errors at scaffold time.
  - **Acceptance**: Errors=0 at scaffold time; warnings allowed.

- [ ] **T013** Commit scaffold (`feat(026/011/011): scaffold post-stress-followup-research packet`).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T101** Compose unified topic prompt (see `plan.md` §4 for canonical text).
  - **Acceptance**: Topic prompt contains all 4 numbered follow-ups + light arch touch + source-of-evidence paths.

- [ ] **T102** Invoke `/spec_kit:deep-research:auto` with the configured CLI flags:
  ```
  /spec_kit:deep-research:auto "<topic>" \
    --max-iterations=10 \
    --convergence=0.05 \
    --executor=cli-codex --model=gpt-5.5 --reasoning-effort=high --service-tier=fast \
    --executor-timeout=900 \
    --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research
  ```
  - **Acceptance**: Loop accepts config and writes `deep-research-config.json` with executor block matching flags.

- [ ] **T103** Confirm `deep-research-config.json` records `executor.kind="cli-codex"`, `model="gpt-5.5"`, `reasoningEffort="high"`, `serviceTier="fast"`.
  - **File**: `research/deep-research-config.json`
  - **Acceptance**: All four fields populated.

- [ ] **T104..T113** 10 iterations dispatch (autonomous; one per loop step).
  - **Per-iteration acceptance**: `iterations/iteration-NNN.md` non-empty; `deltas/iter-NNN.jsonl` contains one record with required fields (`iteration`, `newInfoRatio`, `status`, `focus`).
  - **Loop-level acceptance**: state.jsonl contains lifecycle events; strategy.md regenerated per iteration; dashboard.md current.

- [ ] **T199** Convergence check after each iteration; loop stops when 10 hit OR weighted stop-score > 0.60 with quality guards passing.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T201** Workflow writes `research/research.md` at convergence.
  - **File**: `research/research.md`
  - **Acceptance**: Non-empty; covers all 4 P0/P1/P2 follow-ups + ≥1 architectural seam.

- [ ] **T202** Workflow emits `research/resource-map.md`.
  - **File**: `research/resource-map.md`
  - **Acceptance**: Lists all read targets cited during the loop.

- [ ] **T203** User reviews `research.md`. Per-follow-up next-packet authoring is downstream work (out of scope for this packet).

- [ ] **T204** Update parent HANDOVER-deferred §3 items 4-6 from "Pending → research" to "Research converged → packet authoring next".
  - **File**: `../HANDOVER-deferred.md`

- [ ] **T301** Sample-verify ≥10 cited file paths in `research.md` exist on disk.
  - **Acceptance**: 0 fabrications detected.

- [ ] **T302** Verify parent metadata updates landed (grep for `011-post-stress-followup-research` in 4 parent files).
  - **Acceptance**: Each of the 4 files returns ≥1 hit.

- [ ] **T303** Run `validate.sh --strict` on new packet post-execution.
  - **Acceptance**: 0 errors (SPEC_DOC_INTEGRITY false-positive references to `research/iterations/*.md` etc. accepted as known noise).

- [ ] **T304** Commit final state and push to main.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

This packet is complete when:
- All 5 phases above are checked off.
- `research/research.md` exists, covers the 4 follow-ups + ≥1 arch seam, with 0 fabricated paths.
- HANDOVER-deferred §3 items 4-6 reference the converged research as input for downstream packet authoring.
- Final commit pushed to main.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of evidence: `../010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1-5
- Sibling remediation packets: `../003-memory-context-truncation-contract/`, `../004-cocoindex-overfetch-dedup/`, `../005-code-graph-fast-fail/`, `../006-causal-graph-window-metrics/`, `../007-intent-classifier-stability/`, `../008-mcp-daemon-rebuild-protocol/`, `../009-memory-search-response-policy/`
- Predecessor v1.0.1 baseline: `../001-search-intelligence-stress-test/002-scenario-execution/findings.md`
- Workflow: `.opencode/skill/sk-deep-research/SKILL.md`, `.opencode/command/spec_kit/deep-research.md`
<!-- /ANCHOR:cross-refs -->
