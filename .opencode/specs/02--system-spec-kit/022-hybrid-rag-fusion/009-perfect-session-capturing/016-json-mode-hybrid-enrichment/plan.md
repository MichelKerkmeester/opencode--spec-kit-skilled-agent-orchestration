# Implementation Plan: 016-json-mode-hybrid-enrichment

## Overview

Phase container for JSON-mode memory capturing quality improvements. Implementation follows two priority tiers derived from the 10-agent deep-research investigation (74 findings, 20 actionable recommendations).

## Implementation Architecture

### PR1: Critical Fixes (P0)

1. **Extend contamination filter** to cover `_JSON_SESSION_SUMMARY`, `_manualDecisions`, `recentContext`, `technicalContext` (currently only covers observations + SUMMARY)
2. **Recalibrate quality scorer** — bonus system (+0.20) masks all penalties, making `quality_score` always ~1.00
3. **Fix fast-path `filesModified` drop** — add conversion to `FILES` array on fast path
4. **Surface RetryStats** through `memory_health` MCP tool for embedding visibility monitoring
5. **Fix Vitest calibration test import** — point to extractors scorer, not dead-code core scorer

### PR2: High-Priority Improvements (P1)

1. **Add `resolveProjectPhase()` explicit override** following contextType/importanceTier pattern
2. **Add trigger phrase quality filtering** — suppress path fragments, n-gram shingles, generic tokens
3. **Add template consumption** for `toolCalls` and `exchanges` fields (currently ingested but never rendered)
4. **Add unknown-field warnings** in `validateInputData` for typo detection
5. **Increase truncation limit** to prevent premature content loss

## Phase Children

Each phase child (002-004) addresses a specific domain cluster from the research findings:
- **002-scoring-and-filter**: Quality scorer recalibration + contamination filter scope expansion
- **003-field-integrity-and-schema**: Fast-path field drops, validation gaps, V-rule coverage
- **004-indexing-and-coherence**: Trigger phrase quality, template consumption, cross-session dedup

## Dependencies

- Research findings: `research.md` (74 findings from Round 2)
- Related provenance: [Deleted — 013-memory-generation-quality was removed from the tree]; foundational PR1/PR2 architecture notes were retained in surviving research artifacts.
- Child phase 001 (initial enrichment): Complete

## Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| Phase children 001-004 complete | 2026-03-22 | Complete |
| All P0 critical fixes landed | 2026-03-22 | Complete |
| P1 improvements tracked | 2026-03-23 | In Progress |
