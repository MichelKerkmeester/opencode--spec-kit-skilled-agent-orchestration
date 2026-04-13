---
title: "Deterministic scoring"
description: "Produces repeatable score and benchmark outputs from the dynamic scorer and fixture runner."
---

# Deterministic scoring

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Produces repeatable score and benchmark outputs from the dynamic scorer and fixture runner.

This feature covers the JSON outputs that later gates, dashboards, and manual decisions consume.

---

## 2. CURRENT REALITY

`score-candidate.cjs` always runs in `dynamic-5d` mode. It reads the candidate, parses the JSONC manifest when one is supplied, regenerates the profile on the fly, optionally accepts a `--weights` override, and emits structured output with `status`, `profileId`, `family`, `evaluationMode`, `score`, `dimensions`, `recommendation`, and `failureModes`. Scores below `60` on a dimension become `weak-*` failure modes, and the weighted-score threshold for `candidate-acceptable` is `70`.

`run-benchmark.cjs` is also deterministic once a profile exists. It loads a profile JSON from `assets/target-profiles`, scores fixture outputs against required headings and patterns, optionally folds in integration-report data, and appends benchmark-run records to the state log. Because the current release ships dynamic scoring without a populated static profile catalog, benchmark execution only becomes directly runnable when a profile-specific fixture directory and profile JSON are supplied for the target being tested.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Scorer | Emits the current dynamic score payload and recommendation labels. |
| `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs` | Benchmark runner | Scores fixture outputs and optional integration-report data against a loaded profile. |
| `.opencode/skill/sk-improve-agent/references/evaluator_contract.md` | Contract reference | Documents the scorer output schema, benchmark schema, and recommendation threshold. |
| `.opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md` | Operator reference | Defines the benchmark command shape, repeatability rule, and integration-benchmark fields. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts` | Automated test | Verifies the replay-stability helper that sits beside benchmark verdicts. |
| `.opencode/skill/sk-improve-agent/README.md` | Package reference | Mirrors the current weighted-score threshold and benchmark expectations for operators. |

---

## 4. SOURCE METADATA

- Group: Scoring system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--scoring-system/03-deterministic-scoring.md`
