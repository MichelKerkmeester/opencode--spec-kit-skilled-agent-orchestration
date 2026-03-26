---
title: "Scoring observability"
description: "Describes the 5%-sampled scoring observation logger that persists before/after score deltas and novelty/interference fields to `scoring_observations` without blocking scoring execution."
---

# Scoring observability

## 1. OVERVIEW

Describes the 5%-sampled scoring observation logger that persists before/after score deltas and novelty/interference fields to `scoring_observations` without blocking scoring execution.

This is like a security camera for how scores change. It randomly samples a small percentage of scoring events and saves a before-and-after snapshot. If scores start behaving strangely, you can look at these recordings to understand what happened. The sampling keeps it lightweight so it does not slow anything down.

---

## 2. CURRENT REALITY

Scoring observability logs to `scoring_observations` with a 5% sampler (`SAMPLING_RATE = 0.05`). Each observation includes memory/query identifiers, score-before/score-after values, score delta and novelty/interference fields provided by the caller.

The observability module does not remove novelty fields or hardcode novelty values. It persists whatever `ScoringObservation` payload it receives. This keeps schema compatibility while allowing calling code to set novelty data to zero when the runtime feature is inactive.

Failures are fail-safe but not silent. Initialization, insert and stats-query errors are caught and logged with `console.error`, and scoring execution continues unchanged.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/scoring-observability.vitest.ts` | Scoring observability tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Scoring observability
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 013
