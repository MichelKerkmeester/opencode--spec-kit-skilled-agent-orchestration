---
title: Improvement Config Reference
description: Field-level documentation for improvement_config.json runtime configuration.
---

# Improvement Config Reference

Field-level reference for `improvement_config.json`. Use this when modifying runtime configuration for a agent-improver packet.

---

## 1. OVERVIEW

### Purpose

Documents each field in `improvement_config.json` so operators can tune scoring, benchmarking, stop rules, and file protection without guessing.

### When to Use

Use this reference when:
- Adjusting dimension weights for a specific target
- Changing stop rule thresholds
- Enabling or disabling dynamic profiling
- Understanding what each config section controls

---

## 2. FIELDS

### Top-Level

| Field | Type | Description |
| --- | --- | --- |
| `target` | string | Path to the canonical target agent file |
| `targetProfile` | string | Active profile ID (handover, context-prime, or dynamic) |
| `targetKind` | string | Classification: canonical, derived, or candidate-only |
| `maxIterations` | number | Maximum loop iterations before forced stop |
| `executionMode` | string | AUTONOMOUS or INTERACTIVE |
| `proposalOnly` | boolean | When true, candidates cannot be promoted |
| `promotionEnabled` | boolean | When true, guarded promotion is available |

### Scoring

| Field | Type | Description |
| --- | --- | --- |
| `thresholdDelta` | number | Minimum score improvement for candidate-better recommendation |
| `hardRejectOnMissingTemplate` | boolean | Reject if required template references are absent |
| `hardRejectOnNestedDelegation` | boolean | Reject if nested delegation is detected |
| `simplicityTieBreak` | boolean | Prefer simpler candidate when scores tie |
| `dynamicProfileEnabled` | boolean | Allow --dynamic mode with generate-profile.cjs |
| `dimensionWeights` | object | Per-dimension weights for 5D scoring (must sum to 1.0) |

### Stop Rules

| Field | Type | Description |
| --- | --- | --- |
| `maxConsecutiveTies` | number | Stop after N consecutive tie scores |
| `maxInfraFailuresPerProfile` | number | Stop after N infrastructure failures |
| `maxWeakBenchmarkRunsPerProfile` | number | Stop after N weak benchmark results |
| `stopOnDriftAmbiguity` | boolean | Stop if mirror drift report is ambiguous |
| `stopOnDimensionPlateau` | boolean | Stop if all 5 dimensions plateau (identical scores over the plateau window) |
| `plateauWindow` | number | Number of trailing scores to compare for plateau detection (default: 3) |

---

## 3. RELATED RESOURCES

- `improvement_config.json` — the actual config file
- `../references/evaluator_contract.md` — scoring rubric details
- `../references/no_go_conditions.md` — stop condition reference
