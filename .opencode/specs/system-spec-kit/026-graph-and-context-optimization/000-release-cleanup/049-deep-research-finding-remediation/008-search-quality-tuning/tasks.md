---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 008 Search Quality Tuning [template:level_2/tasks.md]"
description: "Task list for closing F-011-C1-01..05. Five surgical fixes plus targeted tests + validate + commit + push."
trigger_phrases:
  - "F-011-C1 tasks"
  - "008 search quality tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/008-search-quality-tuning"
    last_updated_at: "2026-05-01T08:20:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "All tasks complete"
    next_safe_action: "Commit and push"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/metrics.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-008-search-quality"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 008 Search Quality Tuning

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046 (P1 or P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P1] Re-read packet 046 §11 (C1: search quality) to confirm finding IDs and cited line ranges (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/research.md`)
- [x] T002 [P1] Verify each cited file:line still matches research.md claim before editing (five target files)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P2] Add NDCG@K and MRR pure functions; surface NDCG@3, NDCG@10, MRR through `summarizeSearchQualityRun` (F-011-C1-01) (`mcp_server/stress_test/search-quality/metrics.ts`)
- [x] T004 [P2] Add `ndcg-mrr.vitest.ts` with unit tests for NDCG@3, NDCG@10, MRR + `summarizeSearchQualityRun` extension (F-011-C1-01) (`mcp_server/stress_test/search-quality/`)
- [x] T005 [P1] Lower rerank gate candidate-count floor to 2 when weak-margin or disagreement triggers fire; preserve floor=4 otherwise (F-011-C1-02) (`mcp_server/lib/search/rerank-gate.ts`)
- [x] T006 [P1] Extend W4 with a weak-margin 3-candidate gate-pass assertion (F-011-C1-02) (`mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts`)
- [x] T007 [P1] Enforce provider `maxDocuments` window before the cross-encoder API call; merge tail with `scoringMethod: 'cross-encoder-tail'` (F-011-C1-03) (`mcp_server/lib/search/cross-encoder.ts`)
- [x] T008 [P1] Add a candidate-cap-enforced unit test in a new `cross-encoder-cap.vitest.ts` under stress_test/search-quality/ that exercises the cap path with a mocked provider (F-011-C1-03)
- [x] T009 [P2] Graduate adaptive overfetch behind `SPECKIT_COCOINDEX_GRADUATED_OVERFETCH` flag (default OFF, multiplier 2x when ON + duplicate density >= 0.35; existing 4x flag wins) (F-011-C1-04) (`mcp_server/lib/search/cocoindex-calibration.ts`)
- [x] T010 [P2] Extend W11 with a graduated-overfetch flag assertion (F-011-C1-04) (`mcp_server/stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts`)
- [x] T011 [P2] Promote learned blend weight via `SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT` (default 0.0, clamp to [0, 0.05]); blend `(1-w)*manual + w*learned` only when w > 0 + model loaded (F-011-C1-05) (`mcp_server/lib/search/pipeline/stage2-fusion.ts`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [P1] Run targeted vitest: `npx vitest run stress_test/search-quality/` from `mcp_server/` — must exit 0 (18 files / 61 tests / exit 0)
- [x] T013 [P1] Run full `npm run stress` from `mcp_server/` — 58 files / 195 tests / exit 0 (exceeds 56/163 baseline)
- [x] T014 [P1] Run `validate.sh --strict` on this packet — 0 errors (5 informational warnings, same pattern as worked-pilot 010)
- [x] T015 [P1] Run `generate-context.js` to refresh `description.json` and `graph-metadata.json`
- [x] T016 [P1] Confirm git diff shows only the five product files + new/extended test files + this packet's spec docs
- [x] T017 [P1] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All five findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- `validate.sh --strict` exit 0 on this packet
- `npm run stress` exit 0 with >= 56 files / >= 163 tests
- Commit pushed to origin main with finding IDs in body
- No spec docs in `scratch/`; all spec docs at packet root
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` §11 (C1: search quality)
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot pattern: `../010-cli-orchestrator-drift/` (commit `889d1ee08`)
<!-- /ANCHOR:cross-refs -->
