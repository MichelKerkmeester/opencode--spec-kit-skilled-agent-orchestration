# Tasks: Phase 009 — Agent-Improver Self-Test

## Pre-Flight Verification

- [x] T001: Verify all 8 .cjs scripts parse (`node -c`)
- [x] T002: Run `scan-integration.cjs --agent=agent-improver` standalone, capture output
- [x] T003: Run `generate-profile.cjs --agent=.opencode/agent/agent-improver.md` standalone, capture output
- [x] T004: Run `score-candidate.cjs --candidate=.opencode/agent/agent-improver.md --dynamic` standalone, capture baseline

## Loop Execution

- [x] T005: Create runtime directories under `009-sk-improve-agent-self-test/improvement/`
- [x] T006: Copy config, strategy, charter, manifest templates into runtime root
- [x] T007: Execute iteration 1: scan, propose candidate, score, benchmark, reduce
- [x] T008: Execute iteration 2: scan, propose candidate, score, benchmark, reduce
- [x] T009: Execute iteration 3: scan, propose candidate, score, benchmark, reduce (or stop if plateau)
- [x] T010: Verify stop condition fires correctly (plateau or max iterations)

## Observation Recording

- [x] T011: Document integration scan results for agent-improver
- [x] T012: Document dynamic profile extracted from agent-improver.md
- [x] T013: Document per-iteration 5-dimension scores
- [x] T014: Document self-referential anomalies or edge cases
- [x] T015: Document reducer dashboard and registry final state

## Parent Packet Updates

- [x] T016: Update root 041 spec.md — add Phase 9 to phase map
- [x] T017: Update root 041 implementation-summary.md — add Phase 9 section
- [x] T018: Update root 041 changelog.md — add Phase 9 entry

## Spec Folder Finalization

- [x] T019: Write Phase 009 implementation-summary.md
- [x] T020: Update Phase 009 tasks.md and checklist.md to final state
