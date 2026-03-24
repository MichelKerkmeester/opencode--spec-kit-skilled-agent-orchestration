# Phase 016: JSON Mode Hybrid Enrichment — Phase Container

**Status**: In Progress
**Priority**: P0
**Level**: 3+
**Created**: 2026-03-20
**Updated**: 2026-03-24
**Parent**: [009-perfect-session-capturing](../spec.md)
**Predecessor**: [015-runtime-contract-and-indexability](../015-runtime-contract-and-indexability/spec.md)
**Successor**: [017-json-primary-deprecation](../017-json-primary-deprecation/spec.md)

---

## Overview

Phase container for JSON-mode memory capturing quality improvements. Houses the original enrichment implementation (001) plus follow-up improvement phases derived from a 10-agent deep-research investigation (74 findings, 20 actionable recommendations). The child phases are complete, but the container remains open while remaining P1/P2 follow-on tasks are closed.

## Container Status Truth

- `plan.md` and `implementation-summary.md` both record this packet as active/in-progress.
- `tasks.md` still tracks open follow-on items (`T-009`, `T-011`, `T-012`), so this container is not yet truthfully closed.

## Phase Tree

| Phase | Name | Focus | Status |
|-------|------|-------|--------|
| 001 | [Initial Enrichment](001-initial-enrichment/spec.md) | Structured JSON support, Wave 2/3 hardening, RC1-RC5 fixes, post-save review | Complete |
| 002 | [Scoring & Filter](002-scoring-and-filter/spec.md) | Quality scorer recalibration + contamination filter scope expansion (Domains C+E) | Complete |
| 003 | [Field Integrity & Schema](003-field-integrity-and-schema/spec.md) | Fast-path field drops, validation gaps, V-rule coverage (Domains A+B) | Complete |
| 004 | [Indexing & Coherence](004-indexing-and-coherence/spec.md) | Trigger phrase quality, template consumption, cross-session dedup (Domains D+F) | Complete |

## Shared Resources

- [research.md](research.md) — Deep research findings (Round 1 archived + Round 2 active: 74 findings)
- [prompts/](prompts/) — CRAFT research prompt used for the 10-agent investigation

## Research Summary

Round 2 (2026-03-21) dispatched 10 Claude Opus 4.6 agents across 2 waves investigating 6 domains. Top 5 critical findings:

1. Quality scorer bonus system masks all penalties (score always ~1.00)
2. Contamination filter covers only observations + SUMMARY, missing 6+ text fields
3. 15+ AI-composed fields ingested but never template-rendered
4. Trigger phrase auto-extraction produces path fragment noise
5. Zero automated cross-session contradiction detection

## Navigation

- **Parent**: [009-perfect-session-capturing](../spec.md)
- **Siblings**: [017-json-primary-deprecation](../017-json-primary-deprecation/spec.md), [018-memory-save-quality-fixes](../018-memory-save-quality-fixes/spec.md)
