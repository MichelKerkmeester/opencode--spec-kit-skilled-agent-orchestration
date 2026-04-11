---
title: Benchmark Operator Guide
description: Step-by-step guide for running repeatable fixture benchmarks for sk-improve-agent target profiles.
---

# Benchmark Operator Guide

Operational guide for running improve-agent benchmarks against packet-local outputs. Use it when you need deterministic evidence that a target profile still behaves consistently across repeated runs.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Explains how to run deterministic fixture benchmarks, where to store the resulting evidence, and how to interpret repeatability.

### When to Use

Use this reference when:
- Running the benchmark runner for any dynamic-mode target
- Building repeatability evidence for a promotion gate
- Checking whether a target profile is stable enough to trust

### Core Principle

Benchmark truth is output-based. The runner judges produced packet-local artifacts, not just how a prompt file reads.

The copied runtime templates use the `improvement_*` asset names, but the packet-local runtime files produced by the current workflow use the `agent-improvement-*` naming family.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:runner-command -->
## 2. RUNNER COMMAND

```text
node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \
  --profile={agent-name} \
  --outputs-dir={spec_folder}/improvement/benchmark-runs/{agent-name}/baseline \
  --output={spec_folder}/improvement/benchmark-runs/{agent-name}/run-001.json \
  --state-log={spec_folder}/improvement/agent-improvement-state.jsonl \
  --label={agent-name}-baseline-run-001
```

### Integration Benchmark

When running with an integration report, add the `--integration-report` flag:

```text
node scripts/run-benchmark.cjs --profile={agent-name} --outputs-dir=... --output=... --integration-report=integration-report.json
```

The integration report adds `integrationScore` and `integrationDetails` to the benchmark output:
- `mirrorScore` (0-100): deducts 30 per missing mirror, 20 per diverged mirror
- `commandScore` (0/100): at least 1 command references the agent
- `skillScore` (0/100): at least 1 skill references the agent
- Weighted: 60% mirror + 20% command + 20% skill

---

<!-- /ANCHOR:runner-command -->
<!-- ANCHOR:required-layout -->
## 3. REQUIRED LAYOUT

```text
{spec_folder}/improvement/benchmark-runs/
  {agent-name}/
    baseline/
    candidate-weak/
    candidate-strong/
```

---

<!-- /ANCHOR:required-layout -->
<!-- ANCHOR:repeatability -->
## 4. REPEATABILITY RULE

- Run the same fixture or output set at least twice
- Scores must remain identical when inputs are identical
- If scores drift, stop and treat the harness as unstable

---

<!-- /ANCHOR:repeatability -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Benchmark success means:
- aggregate score meets the profile threshold
- no fixture falls below the profile minimum fixture score
- forbidden placeholder or fabrication patterns do not appear
- the benchmark record is appended to the packet-local ledger

Benchmark success does not mean:
- a mirror sync passed downstream checks
- a prompt-surface score exists with no benchmark evidence
- a benchmark run passed only once

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

- `evaluator_contract.md`
- `loop_protocol.md`
- `promotion_rules.md`

<!-- /ANCHOR:related-resources -->
