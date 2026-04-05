# Tasks: Phase 010 — Self-Test Fixes and Reducer Improvements

## Bug Fix: Stale Command Path (D1)

- [x] T001: Fix command slug and path in `.opencode/agent/agent-improver.md` line 156
- [x] T002: Sync fix to `.claude/agents/agent-improver.md`
- [x] T003: Sync fix to `.agents/agents/agent-improver.md`
- [x] T004: Sync fix to `.codex/agents/agent-improver.toml`
- [x] T005: Verify `score-candidate.cjs --dynamic` scores systemFitness=100

## Candidate Promotion (D2)

- [x] T006: Reorder Required Inputs (charter/manifest before canonical target)
- [x] T007: Add HALT CONDITION block with structured error JSON
- [x] T008: Merge two checklist blocks into one flat list
- [x] T009: Convert Self-Validation to checkbox format + add input-check item
- [x] T010: Add 4th anti-pattern (never proceed with missing inputs)
- [x] T011: Add scan-integration.cjs provenance note to Step 2
- [x] T012: Update summary box Step 2 label
- [x] T013: Sync all promoted changes to 3 runtime mirrors

## Reducer: Family Fix (D3)

- [x] T014: Refactor `inferFamily()` in reduce-state.cjs line 66
- [x] T015: Verify agent-improver profile shows correct family in dashboard

## Reducer: Configurable Plateau Window (D4)

- [x] T016: Add `stopRules.plateauWindow` config reading in reduce-state.cjs
- [x] T017: Replace hardcoded `3` with configurable window (lines 305-308)
- [x] T018: Add `plateauWindow` field to improvement_config.json
- [x] T019: Document new field in assets/improvement_config_reference.md

## Reducer: Fix Accepted Counting (D5)

- [x] T020: Update counting logic in reduce-state.cjs lines 207-215 to count candidate-acceptable/candidate-better as accepted and candidate-worse/candidate-rejected as rejected

## Verification (D6)

- [x] T021: All 8 .cjs scripts parse OK
- [x] T022: Dynamic scorer on agent-improver: 100 across all 5 dimensions
- [x] T023: Integration scanner: all mirrors aligned (including .gemini/ if mirror exists)
- [x] T024: Re-run reducer with Phase 009 ledger: correct family, working plateau, non-zero accepted
- [x] T025: Update parent 041 spec.md phase map with Phase 10
