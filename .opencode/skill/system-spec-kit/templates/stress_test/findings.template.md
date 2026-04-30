---
title: "Stress test findings template"
description: "Narrative findings skeleton for a stress test cycle."
audited_post_018: true
---

# Findings - Stress-Test <cycle>

> **Status**: <complete | conditional | stopped> as of <ISO timestamp>.
>
> **Stop reason**: <all cells scored | blocked by validator | blocked by runtime | other>.
>
> **Machine-readable sidecar**: `findings-rubric.json`.
>
> **Evidence artifacts**:
> - `findings-rubric.json` - scored cell sidecar.
> - `measurements/<cycle>-summary.json` - optional telemetry summary.
> - `measurements/<cycle>-envelopes.jsonl` - optional runtime envelopes.
> - `measurements/<cycle>-audit-log-sample.jsonl` - optional decision audit sample.
> - `measurements/<cycle>-shadow-sink-sample.jsonl` - optional shadow sink sample.

## Executive Summary

**Overall verdict: <PROVEN | NEUTRAL | REGRESSION | NOT-PROVEN | CONDITIONAL>.**

Headline numbers:

1. Aggregate: `<scoreSum>/<maxPossible> = <percentRounded>%`.
2. Verdict summary: `<proven> PROVEN / <neutral> NEUTRAL / <regression> REGRESSION / <notProven> NOT-PROVEN`.
3. Comparison: `<priorVersion> -> <cycle>: <deltaPercent> percentage points`.
4. Largest win: `<cell or packet>`.
5. Largest risk: `<cell or packet>`.

## Methodology

- **Corpus**: `<corpus name>`, frozen at `<ISO timestamp>`, `<cell count>` cells.
- **Rubric**: `<dimensions>`, scale `0-2`, weights `<weights>`.
- **Scoring owner**: `<person/session/tool>`.
- **Dispatch or measurement method**: `<manual dispatch | harness | runtime telemetry | mixed>`.
- **Comparison method**: `<prior sidecar path>`, matched by `<cell id strategy>`.
- **Known scorer limits**: `<single scorer, N=1, fixture-only, live handler blocked, etc.>`.

## Aggregate Metrics

| Metric | Value |
|--------|-------|
| score sum | `<scoreSum>` |
| max possible | `<maxPossible>` |
| percent | `<percent>` |
| percent rounded | `<percentRounded>` |
| prior percent | `<prior percent or n/a>` |
| delta percent | `<deltaPercent or n/a>` |

## Comparison To Prior Cycle

| Cell | Prior | Current | Delta | Candidate Regression? | Notes |
|------|-------|---------|-------|------------------------|-------|
| `<packet>::correctness` | `<score>` | `<score>` | `<delta>` | `<Y/N>` | `<short rationale>` |

Flag any dropped cell as a candidate REGRESSION. Do not finalize REGRESSION until the adversarial block below is complete.

## Per-Packet Verdicts

### `<packet id>` - `<packet name>`

- **Verdict**: `<PROVEN | NEUTRAL | REGRESSION | NOT-PROVEN>`
- **Scores**: `correctness=<0-2>`, `robustness=<0-2>`, `telemetry=<0-2>`, `regression-safety=<0-2>`
- **Evidence**: `<file:line or artifact path>`
- **Rationale**: `<why these scores follow from the evidence>`
- **Comparison**: `<prior score/current score/delta>`
- **Limitations**: `<none or caveat>`

#### Adversarial Self-Check

Use this block for every REGRESSION candidate. Omit only when no score dropped and no regression is alleged.

```text
Hunter: <strongest evidence that this is a real regression>
Skeptic: <alternate explanations, missing evidence, environment caveats, scorer uncertainty>
Referee: <final disposition, severity, owner, and whether the verdict remains REGRESSION>
```

## Telemetry Samples

| Artifact | Count | Notes |
|----------|-------|-------|
| `measurements/<cycle>-envelopes.jsonl` | `<n>` | `<required fields observed>` |
| `measurements/<cycle>-audit-log-sample.jsonl` | `<n>` | `<audit rows observed>` |
| `measurements/<cycle>-shadow-sink-sample.jsonl` | `<n>` | `<shadow rows observed>` |
| `measurements/<cycle>-summary.json` | `1` | `<headline summary metrics>` |

## Recommendations

1. **<Priority> - <finding title>**
   - Evidence: `<file:line or artifact path>`.
   - Recommended fix: `<specific next action>`.
   - Owner: `<packet or role>`.

## Limitations

- `<single scorer / N=1 / non-like-for-like rubric / live handler gap / corpus limitation>`.

## Artifacts

- `findings.md`
- `findings-rubric.json`
- `measurements/`

