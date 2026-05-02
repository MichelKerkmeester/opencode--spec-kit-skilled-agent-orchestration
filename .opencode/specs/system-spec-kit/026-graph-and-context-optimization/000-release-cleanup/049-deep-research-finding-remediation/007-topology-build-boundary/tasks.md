---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 007 Topology And Build/Dist Boundary Remediation [template:level_2/tasks.md]"
description: "Task list for closing F-019-D4-02..03 and F-020-D5-01..04. Six surgical edits + 3 new vitest files + 1 dist orphan deletion + validate + stress + commit + push."
trigger_phrases:
  - "F-019-D4 tasks"
  - "F-020-D5 tasks"
  - "007 topology and build dist boundary tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/007-topology-build-boundary"
    last_updated_at: "2026-05-01T06:55:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Validate + commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-007-topology-build-boundary"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: 007 Topology And Build/Dist Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046 (P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P2] Re-read packet 046 D4 (phase topology) and D5 (build/dist boundary) sections to confirm finding IDs and cited line ranges (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/research.md`)
- [x] T002 [P2] Verify each cited file:line still matches research.md claim before editing (6 target files)
- [x] T003 [P2] Capture entering stress baseline (58 files / 195 tests / exit 0)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P2] Add additive `phase_path_grammar` documentation block under `phase_folder_awareness` (F-019-D4-02) (`.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`)
- [x] T005 [P2] Export `assessPhaseParentHealth()` plus warning/error thresholds (F-019-D4-03) (`mcp_server/lib/spec/is-phase-parent.ts`)
- [x] T006 [P2] Mirror health helper export plus CLI entrypoint (`health <folder>`) (F-019-D4-03) (`scripts/spec/is-phase-parent.ts`)
- [x] T007 [P2] Append manifest-size advisory via dist CLI; soft-fail when node/dist absent (F-019-D4-03) (`scripts/rules/check-phase-parent-content.sh`)
- [x] T008 [P2] Swap kebab→snake `dist/skill_advisor/compat/index.js` cache-signature path (F-020-D5-01) (`.opencode/plugins/spec-kit-skill-advisor.js`)
- [x] T009 [P2] Broaden DIST_TARGETS to 17 entries; soften missing-root from `process.exit(2)` to `continue`; fix `mapDistFileToSource` segment derivation; add 3-entry allowlist (F-020-D5-02) (`scripts/evals/check-source-dist-alignment.ts`)
- [x] T010 [P2] Verify no imports of `dist/tests/search-quality/harness`; delete orphan + companions (F-020-D5-03) (`mcp_server/dist/tests/search-quality/harness.{js,js.map,d.ts,d.ts.map}`)
- [x] T011 [P2] Add source-of-truth decision-record header pointing at smoke test (F-020-D5-04) (`mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [P2] Add vitest for assessPhaseParentHealth thresholds + edge cases (9 cases) (`mcp_server/tests/phase-parent-health.vitest.ts`)
- [x] T013 [P2] Add bridge smoke vitest covering envelope shape + fail-open paths (5 cases) (`mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts`)
- [x] T014 [P2] Add alignment-checker orphan vitest covering broadened scope + allowlist + harness deletion (6 cases) (`scripts/tests/check-source-dist-alignment-orphans.vitest.ts`)
- [x] T015 [P2] Run `tsc --build` for both `mcp_server/` and `scripts/` so dist exposes new exports
- [x] T016 [P2] Run `npx tsx evals/check-source-dist-alignment.ts` — must exit 0 with 3 allowlisted, 0 violations
- [x] T017 [P2] Run targeted vitest for the 3 new files — all pass
- [ ] T018 [P2] Run `validate.sh --strict` on this packet — must exit 0
- [x] T019 [P2] Run `npm run stress` — matches entering baseline (1 unrelated code_graph test failure pre-existed in working tree from a parallel track)
- [ ] T020 [P2] Run `generate-context.js` to refresh metadata for this packet
- [ ] T021 [P2] Confirm git diff shows only target product files + this packet's spec docs + new tests + the dist deletion
- [ ] T022 [P2] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All 6 findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- `validate.sh --strict` exit 0 on this packet
- `npm run stress` matches entering baseline of 58/195 (1 unrelated code_graph test failure from parallel track is pre-existing)
- Commit pushed to origin main with finding IDs in body
- 3 new vitest files pass (20+ tests total)
- Orphan `harness.js` deleted; alignment checker exit 0 with 3 time-boxed allowlisted entries
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` D4 (phase topology, F-019) + D5 (build/dist boundary, F-020)
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot pattern: `../004-validation-and-memory/` (commit `1822a1e69`) and `../010-cli-orchestrator-drift/` (commit `889d1ee08`)
<!-- /ANCHOR:cross-refs -->
