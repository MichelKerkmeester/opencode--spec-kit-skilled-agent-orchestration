# Task Tracker: 016-json-mode-hybrid-enrichment

## Status Summary

| Status | Count |
|--------|-------|
| Complete | 10 |
| In Progress | 1 |
| Planned | 2 |

## P0 — Critical Tasks

- [x] T-001: Extend contamination filter to cover all text fields (Domain E)
- [x] T-002: Recalibrate quality scorer bonus system (Domain C)
- [x] T-003: Fix fast-path `filesModified` drop (Domain A)
- [x] T-004: Surface RetryStats through `memory_health` tool (Domain D)
- [x] T-005: Fix Vitest calibration test import (Domain C)

## P1 — High-Priority Tasks

- [x] T-006: Add trigger phrase quality filtering (Domain D)
- [x] T-007: Promote `toolCalls` field to template consumption (Domain F)
- [x] T-008: Promote `exchanges` field to template consumption (Domain F)
- [ ] T-009: Add `resolveProjectPhase()` explicit override (Domain E) — In Progress
- [x] T-010: Add unknown-field warnings in `validateInputData` (Domain B)

## P2 — Improvement Tasks

- [ ] T-011: Remove phantom V2.2 placeholders (Domain F) — Planned
- [ ] T-012: Un-suppress 9 OPTIONAL_PLACEHOLDERS with active data sources (Domain F) — Planned
- [x] T-013: Increase truncation limit for content density (Domain B)

## Phase Child Tasks

- [x] 001-initial-enrichment: Complete
- [x] 002-scoring-and-filter: Complete
- [x] 003-field-integrity-and-schema: Complete
- [x] 004-indexing-and-coherence: Complete

## Notes

- Research source: `research.md` (Round 2: 74 findings, 10-agent investigation)
- PR1/PR2 architecture provenance retained in surviving research artifacts [Deleted — 013-memory-generation-quality was removed from the tree]
- All 4 phase children are complete; remaining tasks are tracked at container level
