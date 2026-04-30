---
title: "Stress test findings rubric schema"
description: "Field-by-field documentation for the stress test findings-rubric.json sidecar template."
audited_post_018: true
---

# Stress test findings rubric schema

## 1. OVERVIEW

This schema documents `.opencode/skill/system-spec-kit/templates/stress_test/findings-rubric.template.json`. The sidecar is the machine-readable record of a stress test cycle: cycle metadata, frozen corpus metadata, rubric definition, scored cells, aggregate math, verdict counts, and comparison to the prior cycle.

The template is valid JSON. Do not add comments to completed `findings-rubric.json` files; place explanatory notes in `findings.md` or a sibling schema document.

## 2. FIELD DEFINITIONS

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `version` | string | Yes | Template/schema version. Use semver-like values such as `1.0.0`. |
| `cycle` | string | Yes | Human cycle version, for example `v1.0.4`. |
| `corpus` | object | Yes | Frozen corpus descriptor. |
| `corpus.name` | string | Yes | Stable corpus identifier. |
| `corpus.frozenAt` | string | Yes | ISO 8601 timestamp for when the corpus was frozen. |
| `corpus.cells` | integer | Yes | Count of scored cells. Must be >= 0 and must match `cells.length` unless documented otherwise. |
| `rubric` | object | Yes | Rubric descriptor used for this cycle. |
| `rubric.dimensions` | string array | Yes | For v1 generalized cycles, exactly `correctness`, `robustness`, `telemetry`, `regression-safety`. Domain-specific cycles may freeze a different list but must document the reason in `findings.md`. |
| `rubric.scale` | object | Yes | Numeric score bounds. |
| `rubric.scale.min` | integer | Yes | Must be `0` for v1. |
| `rubric.scale.max` | integer | Yes | Must be `2` for v1 generalized cycles. |
| `rubric.weights` | object | Yes | Numeric weight per dimension. Every dimension must have a weight. Default is `1`. |
| `cells` | object array | Yes | One scored record per packet x dimension or domain-specific stable cell. |
| `cells[].id` | string | Yes | Stable cell ID. Recommended format: `<packet-id>::<dimension>`. |
| `cells[].packet` | string | Yes | Packet slug or stable scenario group. |
| `cells[].dimension` | string | Yes | Must be one of `rubric.dimensions`. |
| `cells[].score` | integer | Yes | Must be an integer in `[0, 2]` for v1 generalized cycles. |
| `cells[].rationale` | string | Yes | Short evidence-grounded rationale. Keep detailed evidence in `findings.md`. |
| `aggregate` | object | Yes | Aggregate math derived from `cells`. |
| `aggregate.scoreSum` | integer | Yes | Sum of weighted cell scores. Must be >= 0. |
| `aggregate.maxPossible` | integer | Yes | Sum of max possible weighted scores. Must be > 0 when cells exist. |
| `aggregate.percent` | number | Yes | `(scoreSum / maxPossible) * 100`. |
| `aggregate.percentRounded` | number | Yes | Rounded display value, usually one decimal place. |
| `verdictSummary` | object | Yes | Count of packet-level verdicts. |
| `verdictSummary.proven` | integer | Yes | Count of `PROVEN` packet verdicts. |
| `verdictSummary.neutral` | integer | Yes | Count of `NEUTRAL` packet verdicts. |
| `verdictSummary.regression` | integer | Yes | Count of `REGRESSION` packet verdicts. |
| `verdictSummary.notProven` | integer | Yes | Count of `NOT-PROVEN` packet verdicts. |
| `comparison` | object | Yes | Prior-cycle comparison summary. |
| `comparison.priorVersion` | string or null | Yes | Prior cycle version, or `null` for first baseline. |
| `comparison.deltaPercent` | number or null | Yes | Current percent minus prior percent. Use `null` if no prior cycle exists. |

## 3. VALUE CONSTRAINTS

- `score` must be an integer between `0` and `2` inclusive.
- `dimension` must be listed in `rubric.dimensions`.
- v1 generalized dimensions are `correctness`, `robustness`, `telemetry`, and `regression-safety`.
- `weights` must include every dimension and should use positive numbers.
- `aggregate.percent` must equal `aggregate.scoreSum / aggregate.maxPossible * 100` when `maxPossible > 0`.
- Verdict count keys map to `PROVEN`, `NEUTRAL`, `REGRESSION`, and `NOT-PROVEN`.
- Any cell whose score drops versus the prior version is a candidate REGRESSION until Hunter -> Skeptic -> Referee review is documented in `findings.md`.

## 4. WORKED EXAMPLE REFERENCES

The v1.0.2 rerun sidecar is the closest historical source shape: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json`. It records 30 cells, `scoreSum` 201, `maxScore` 240, and `percentRounded` 83.8.

The generalized template intentionally renames `maxScore` to `maxPossible` and uses the canonical dimensions from the stress-test cycle feature catalog. If a future cycle keeps the historical v1.0.2 dimensions for comparability, document that in `findings.md` and keep the sidecar internally consistent.

## 5. SOURCE METADATA

- Group: Stress testing
- Template: `.opencode/skill/system-spec-kit/templates/stress_test/findings-rubric.template.json`
- Companion findings template: `.opencode/skill/system-spec-kit/templates/stress_test/findings.template.md`

