---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 003 Advisor Quality [template:level_2/tasks.md]"
description: "Task list for closing F-006-B1-01..03, F-012-C2-01..04, F-013-C3-01. Eight surgical fixes plus one additive scorer vitest + fixture update + validate + commit + push."
trigger_phrases:
  - "F-006-B1 tasks"
  - "F-012-C2 tasks"
  - "F-013-C3 tasks"
  - "003 advisor quality tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/003-advisor-quality"
    last_updated_at: "2026-04-30T00:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-003-advisor-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 003 Advisor Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046 (P1 or P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P1] Re-read packet 046 §6/§12/§13 to confirm finding IDs and cited line ranges
- [x] T002 [P1] Verify each cited file:line still matches research.md claim before editing (eight target files)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P2] Route Codex timeout fallback through `renderAdvisorBrief()`; remove bespoke "Advisor: stale (cold-start timeout)" string (F-006-B1-01) (`mcp_server/hooks/codex/user-prompt-submit.ts`)
- [x] T004 [P2] OpenCode bridge disabled mode returns `brief: null, status: 'skipped'` (silent fail-open); remove model-visible "Advisor: disabled by ..." string (F-006-B1-02) (`mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`)
- [x] T005 [P2] Remove dead `renderNativeBrief()` from bridge file (F-006-B1-03) (`mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`)
- [x] T006 [P1] Preserve negative graph-causal contributions through lane emit; clamp signed range to [-1, 1] (F-012-C2-01) (`mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts`)
- [x] T007 [P1] Distinguish `derivedTriggers` (from `trigger_phrases`) from `derivedKeywords` (from `key_topics + entities + key_files + source_docs`) in both SQLite and filesystem projection paths (F-012-C2-02) (`mcp_server/skill_advisor/lib/scorer/projection.ts`)
- [x] T008 [P1] Add token-stuffing dispersion guard before task-intent confidence floor short-circuit (F-012-C2-03) (`mcp_server/skill_advisor/lib/scorer/fusion.ts`)
- [x] T009 [P2] Compute ambiguity from ranking `score` (not `confidence`); cluster all passing candidates within `AMBIGUITY_MARGIN` of top; populate `ambiguousWith` for every cluster member (F-012-C2-04) (`mcp_server/skill_advisor/lib/scorer/ambiguity.ts`)
- [x] T010 [P1] Add review-plus-write disambiguation rule in explicit lane (`+0.6` sk-code, `-0.4` sk-code-review when prompt has `review` AND any of `update|edit|fix|modify`) (F-013-C3-01) (`mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`)
- [x] T011 [P1] Update regression fixture row P1-REVIEW-007: `expected_top_any` → `["sk-code"]` (F-013-C3-01) (`mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`)
- [x] T012 [P1] Author `advisor-quality-049-003.vitest.ts` with five describe blocks: graph-causal conflict preservation (C2-01), distinct derived fields (C2-02), token-stuffing dispersion guard (C2-03), ambiguity tie-cluster (C2-04), review-plus-write disambiguation (C3-01) (`mcp_server/skill_advisor/tests/scorer/`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P1] Run targeted vitest: `npx vitest run skill_advisor/lib/scorer/ skill_advisor/tests/scorer/` from `mcp_server/` — must exit 0
- [x] T014 [P1] Run full `npm run stress` from `mcp_server/` — exit 0, >= 58 files, >= 195 tests
- [x] T015 [P1] Run `validate.sh --strict` on this packet — exit 0 errors
- [x] T016 [P1] Run `generate-context.js` to refresh `description.json` and `graph-metadata.json`
- [x] T017 [P1] Confirm git diff stages only sub-phase 003 spec docs + the seven product files + new test file + one fixture row
- [x] T018 [P1] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All eight findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- `validate.sh --strict` exit 0 errors on this packet
- `npm run stress` exit 0 with >= 58 files / >= 195 tests
- Commit pushed to origin main with finding IDs in body
- No spec docs in `scratch/`; all spec docs at packet root
- Template artifact `README.md` removed from packet root (was Level 1 fragment)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../../046-system-deep-research-bugs-and-improvements/research/research.md` §6 (B1), §12 (C2), §13 (C3)
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot pattern: `../008-search-quality-tuning/` (commit `61f11c684`) and `../010-cli-orchestrator-drift/` (commit `889d1ee08`)
<!-- /ANCHOR:cross-refs -->
