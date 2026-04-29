---
title: "Stress test cycle"
description: "A stress test cycle is a structured manual evaluation across packets, scored on a fixed rubric with narrative findings, a machine-readable sidecar, comparison deltas, and adversarial checks for regressions."
audited_post_018: true
---

# Stress test cycle

## 1. OVERVIEW

A stress test cycle is a structured manual evaluation across packets, scored on a fixed rubric. It freezes a representative corpus, executes each packet or scenario cell, records evidence, assigns dimension scores, and produces both human-readable findings and a machine-readable rubric sidecar.

Use this pattern when a release needs evidence that remediations actually improved behavior, when a post-fix rerun must compare against a prior baseline, or when a broad subsystem change might introduce regressions in behavior that automated unit tests do not capture.

## 2. CURRENT REALITY

The pattern emerged from three live system-spec-kit cycles.

| Cycle | Role | Evidence |
|-------|------|----------|
| v1.0.1 baseline | Established the fixed search-intelligence corpus and calibrated scoring basis. | `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/spec.md:133` documents the scenario corpus; lines 200-210 document the active v1.0.1 4-dimension calibration. |
| v1.0.2 rerun | Proved the sidecar-and-findings format against 30 cells. | `010-stress-test-rerun-v1-0-2/findings.md:3` records all 30 cells complete; `findings.md:15` records 76.7% -> 83.8%; `findings-rubric.json:65` records scoreSum 201, max 240, and percentRounded 83.8. |
| v1.0.3 wiring run | Extended the pattern with telemetry samples under `measurements/`. | `021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:5` lists envelope, audit, shadow, summary, and sidecar artifacts; lines 37-53 report the SLA panel. |

### When To Use

- Release-readiness checkpoint after multiple remediation packets.
- Post-remediation verification against a frozen prior baseline.
- Regression hunting between major behavior, routing, telemetry, or scoring changes.
- Cross-agent or cross-runtime comparison where automated tests cannot judge response quality alone.

### Inputs

The core input is a frozen corpus of representative scenarios. A cycle may use a matrix such as 30 cells from 4 dimensions across roughly 7-8 packets, or a smaller deterministic harness corpus when the domain is telemetry-heavy.

For search/RAG cycles, `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/corpus.ts` is the canonical fixture example: it declares fixed case IDs, queries, expected relevant IDs, expected channels, citation expectations, refusal expectations, and notes. Lines 41-90 define baseline cases; lines 93-180 define workstream cases.

### Rubric

The generalized v1 stress-cycle rubric uses four canonical dimensions:

| Dimension | Score 0 | Score 1 | Score 2 |
|-----------|---------|---------|---------|
| `correctness` | Answer or behavior is wrong, absent, or contradicts evidence. | Partially correct, incomplete, noisy, or only directionally useful. | Correct, complete, and supported by cited evidence. |
| `robustness` | Breaks under weak, vague, stale, or adversarial input. | Handles some rough edges but degrades inconsistently. | Handles expected weak/vague/stale inputs with bounded behavior. |
| `telemetry` | Required evidence, measurements, or audit data are absent. | Some evidence exists but is incomplete or hard to reproduce. | Evidence is complete enough to replay the verdict reasoning. |
| `regression-safety` | Worse than the prior version or unreviewed after a drop. | Mixed or unchanged with caveats. | Equal or better than prior version, with deltas calculated. |

Historical note: v1.0.2 used a related four-dimension search-quality rubric (`correctness`, `toolSelection`, `latency`, `hallucination`) held constant from v1.0.1. New generalized cycles should use the canonical dimensions above unless a packet explicitly freezes a domain-specific rubric.

### Outputs

| Artifact | Purpose |
|----------|---------|
| `findings.md` | Narrative report with status, methodology, headline numbers, per-packet verdicts, comparison block, limitations, recommendations, and adversarial self-checks for REGRESSION findings. |
| `findings-rubric.json` | Machine-readable sidecar containing version, cycle, corpus metadata, rubric dimensions, cell scores, aggregate math, verdict summary, and prior-version comparison. |
| `measurements/*` | Optional telemetry samples for wired runtime cycles, such as envelopes, audit logs, shadow sink rows, and summary metrics. |

### Verdict Ladder

| Verdict | Meaning |
|---------|---------|
| `PROVEN` | Full credit on all required dimensions, or the packet-specific evidence meets the predeclared proof threshold. |
| `NEUTRAL` | Mixed, unchanged, partially exercised, or inconclusive without evidence of harm. |
| `REGRESSION` | Worse than the prior version, or a score cell dropped and survives adversarial review. |
| `NOT-PROVEN` | Insufficient evidence to support the claimed behavior. |

Every REGRESSION finding requires an inline Hunter -> Skeptic -> Referee review. The Hunter states the strongest regression case, the Skeptic tests alternate explanations and evidence quality, and the Referee records the final disposition.

### Aggregate and Comparison

Aggregate score is:

```text
score_sum / max_possible * 100
```

`max_possible` is the number of cells multiplied by the maximum score per cell after weights are applied. Dimension weighting is optional; when used, keep weights in `findings-rubric.json` and state them in the methodology.

Each cycle compares against the prior version's rubric where possible. The comparison protocol is per-cell first, then aggregate:

1. Load the prior `findings-rubric.json`.
2. Match current cells to prior cells by stable `packet + dimension` or domain-specific cell ID.
3. Compute each cell delta.
4. Flag any dropped cell as a candidate REGRESSION.
5. Run Hunter -> Skeptic -> Referee before finalizing any REGRESSION verdict.
6. Record aggregate delta percent and any non-like-for-like caveat.

## 3. SOURCE FILES

### Worked Examples

| Path | Role |
|------|------|
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/` | v1.0.1 baseline corpus, dispatch matrix, and scenario execution |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md` | v1.0.2 narrative findings shape |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json` | v1.0.2 sidecar shape and aggregate math |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md` | v1.0.3 wired telemetry findings |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/` | v1.0.3 telemetry samples |

### Templates and Playbook

| Path | Role |
|------|------|
| `.opencode/skill/system-spec-kit/templates/stress-test/findings-rubric.template.json` | Reusable rubric sidecar template |
| `.opencode/skill/system-spec-kit/templates/stress-test/findings-rubric.schema.md` | Field-by-field schema documentation |
| `.opencode/skill/system-spec-kit/templates/stress-test/findings.template.md` | Findings narrative skeleton |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md` | Operational guide |

## 4. SOURCE METADATA

- Group: Stress testing
- Source feature title: Stress test cycle
- Current reality source: v1.0.1/v1.0.2/v1.0.3 stress-test packets
- Canonical file path: `.opencode/skill/system-spec-kit/feature_catalog/14--stress-testing/01-stress-test-cycle.md`
- Companion playbook: `.opencode/skill/system-spec-kit/manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md`

