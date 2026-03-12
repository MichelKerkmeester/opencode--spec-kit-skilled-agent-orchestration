# Scoring observability

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Scoring observability.

## 2. CURRENT REALITY

Scoring observability logs to `scoring_observations` with a 5% sampler (`SAMPLING_RATE = 0.05`). Each observation includes memory/query identifiers, score-before/score-after values, score delta, and novelty/interference fields provided by the caller.

The observability module does not remove novelty fields or hardcode novelty values; it persists whatever `ScoringObservation` payload it receives. This keeps schema compatibility while allowing calling code to set novelty data to zero when the runtime feature is inactive.

Failures are fail-safe but not silent: initialization, insert, and stats-query errors are caught and logged with `console.error`, and scoring execution continues unchanged.

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

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Scoring observability
- Current reality source: feature_catalog.md

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-013
