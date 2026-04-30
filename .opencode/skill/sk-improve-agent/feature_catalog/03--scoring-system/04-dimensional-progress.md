---
title: "Dimensional progress"
description: "Reduces run records into per-dimension trends, best-known state, and operator-facing stop guidance."
---

# Dimensional progress

## 1. OVERVIEW

Reduces run records into per-dimension trends, best-known state, and operator-facing stop guidance.

This feature covers the reducer and supporting runtime artifacts that turn scored runs into a readable dashboard and registry.

---

## 2. CURRENT REALITY

`reduce-state.cjs` reads `agent-improvement-state.jsonl`, groups records by profile, tracks accepted and rejected candidates, stores score histories per dimension, computes latest versus best values and arrow trends, and writes both `experiment-registry.json` and `agent-improvement-dashboard.md`. The dashboard also includes sample quality, journal summary, candidate lineage, mutation coverage, guardrails, stop status, and a plain-language recommendation.

The reducer accepts more than one "good enough" label. It counts both `candidate-acceptable` and `candidate-better` as accepted candidates when building profile buckets. Supporting runtime helpers feed extra context into that view: `mutation-coverage.cjs` stores trajectory data, `improvement-journal.cjs` exposes stop reason and session outcome, and `candidate-lineage.cjs` tracks the active leaf and lineage depth.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | Reducer | Rebuilds the registry, dashboard, stop status, and dimensional trend summary from the ledger. |
| `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs` | Coverage tracker | Records mutation attempts and per-dimension trajectory points consumed by reducer-side summaries. |
| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Journal helper | Stores typed lifecycle events, stop reasons, and session outcomes for replay consumers. |
| `.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs` | Lineage helper | Tracks parent-child candidate relationships and the active lineage leaf. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts` | Automated test | Verifies trajectory recording and convergence eligibility rules. |
| `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts` | Automated test | Verifies event validation, stop-reason enums, and journal replay helpers. |
| `.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts` | Automated test | Verifies lineage recording, ancestry lookup, and wave filtering. |

---

## 4. SOURCE METADATA

- Group: Scoring system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--scoring-system/04-dimensional-progress.md`
