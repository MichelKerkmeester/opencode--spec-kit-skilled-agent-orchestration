# Diagnosis Findings: Which Improvements Are Needed?

## Date: 2026-04-01

## Summary
All 8 planned improvements are confirmed needed. None are already handled by existing features. Some existing infrastructure can be extended rather than built from scratch.

## Improvement-by-Improvement Assessment

| # | Improvement | Already Working? | Action |
|---|-------------|------------------|--------|
| 1 | Community detection + summaries | No | Build from scratch (Phase A) |
| 2 | Dual-level retrieval | No | Build from scratch (Phase B) |
| 3 | Query expansion via graph | Partial — concept routing traces but doesn't expand | Extend entity-linker concept routing (Phase B) |
| 4 | Graph-expanded fallback | Partial — recovery payload suggests but doesn't retry | Extend recovery-payload.ts (Phase B) |
| 5 | Always-on graph injection | Partial — co-activation fires but not comprehensive | Extend causal-boost.ts (Phase B) |
| 6 | Provenance in results | No | Build, use existing envelope.hints (Phase C) |
| 7 | Temporal edges + contradiction | No | Build from scratch (Phase D) |
| 8 | Usage-weighted ranking | No | Build from scratch (Phase D) |

## Scope Update
No reductions possible — all 8 improvements needed as planned. Minor reuse opportunities:
- Extend `query-intent-classifier.ts` for concept extraction (skip new `query-concept-extractor.ts`)
- Extend `recovery-payload.ts` for graph-expanded retry
- Use existing `envelope.hints` pipeline for provenance

## Missing Concept Alias
Add "semantic" → "embedding" (or "search") in entity-linker.ts BUILTIN_CONCEPT_ALIASES so that "Semantic Search" matches both concepts.
