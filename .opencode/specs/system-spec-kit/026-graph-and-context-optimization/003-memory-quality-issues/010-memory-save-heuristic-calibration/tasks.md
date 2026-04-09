---
title: "Tasks: Memory Save Heuristic Calibration"
description: "Task breakdown for packet 010 across setup, runtime implementation, verification, and closeout."
trigger_phrases:
  - "010 heuristic calibration tasks"
  - "memory save calibration tasks"
importance_tier: "important"
contextType: "tasks"
---
# Tasks: Memory Save Heuristic Calibration

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the two motivating audit reports end-to-end.
- [x] T002 Scaffold the `010-memory-save-heuristic-calibration` Level 3 packet.
- [x] T003 Update the parent phase count and phase map in `../spec.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Fix Lane 1: accept and propagate explicit `title` and `description`.
- [x] T011 Fix Lane 2: preserve manual trigger phrases while keeping extracted-junk filtering intact.
- [x] T012 Fix Lane 3: narrow V8 `SPEC_ID_REGEX`.
- [x] T013 Fix Lane 4: normalize V12 slug-vs-prose matching and pass `filePath`.
- [x] T014 Fix Lane 5: accept explicit `causalLinks` and align D5 linker/reviewer behavior.
- [x] T015 Fix Lane 6: migrate remaining `decision-extractor.ts` truncation callsites.
- [x] T016 Fix packet-closeout support surfaces, including parent packet summary sync and packet-doc updates.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Add or extend regression coverage for every shipped lane.
- [x] T021 Rebuild `scripts/dist`.
- [x] T022 Run `cd .opencode/skill/system-spec-kit/scripts && npm test`.
- [x] T023 Run `cd .opencode/skill/system-spec-kit/mcp_server && npm test` and classify unrelated pre-existing failures.
- [x] T024 Run strict packet validation.
- [x] T025 Execute the real dist-based save verification against `026-graph-and-context-optimization`.
- [x] T026 Replace placeholder packet docs with final evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `T001-T026` are complete.
- [x] Every shipped lane has regression coverage.
- [x] The real save is quality-gate clean and semantically indexed.
- [x] Packet docs and parent sync reflect the shipped implementation and verification state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent packet spec: `../spec.md`
- Parent packet implementation summary: `../implementation-summary.md`
- Motivating RCA: `../../scratch/codex-root-cause-memory-quality-gates.md`
- Skipped recommendations audit: `../../scratch/codex-skipped-research-recommendations.md`
<!-- /ANCHOR:cross-refs -->
