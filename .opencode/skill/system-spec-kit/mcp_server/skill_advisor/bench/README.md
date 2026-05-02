---
title: "Skill Advisor Benchmarks: Latency And Calibration"
description: "Benchmark suites and baselines for advisor latency, scorer calibration, hook signal quality and code-graph query behavior."
trigger_phrases:
  - "skill advisor benchmarks"
  - "scorer calibration bench"
  - "advisor latency bench"
---

# Skill Advisor Benchmarks: Latency And Calibration

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

`skill_advisor/bench/` contains benchmark suites and baseline data for advisor latency, scorer calibration, watcher behavior, hook brief signal quality and code-graph integration paths. These files are measurement assets, not production runtime modules.

Current state:

- Tracks latency and calibration benchmarks for the advisor scorer.
- Includes code-graph parsing and query latency benchmarks.
- Stores baseline JSON used for regression comparison.

---

## 2. DIRECTORY TREE

```text
bench/
+-- code-graph-parse-latency.bench.ts       # Code graph parse benchmark
+-- code-graph-query-latency.baseline.json  # Query latency baseline
+-- code-graph-query-latency.bench.ts       # Query latency benchmark
+-- hook-brief-signal-noise.bench.ts        # Hook brief signal benchmark
+-- latency-bench.ts                        # Advisor latency benchmark
+-- scorer-bench.ts                         # Scorer benchmark
+-- scorer-calibration-baseline.json        # Scorer calibration baseline
+-- scorer-calibration.bench.ts             # Scorer calibration benchmark
+-- watcher-benchmark.ts                    # Watcher benchmark
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `latency-bench.ts` | Measures advisor latency paths. |
| `scorer-bench.ts` | Measures scorer performance. |
| `scorer-calibration.bench.ts` | Measures scorer calibration against baseline expectations. |
| `hook-brief-signal-noise.bench.ts` | Measures hook brief signal-to-noise behavior. |
| `code-graph-query-latency.bench.ts` | Measures code graph query latency. |
| `watcher-benchmark.ts` | Measures watcher behavior. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Benchmarks may import advisor, scorer and code-graph modules needed for measurement. |
| Exports | Benchmark files export no production behavior. |
| Ownership | Keep performance and calibration measurement here. Put correctness tests in `../tests/`. |

Main flow:

```text
benchmark scenario
  -> advisor, scorer or code-graph path
  -> timing or calibration metric
  -> baseline comparison or report
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `latency-bench.ts` | Benchmark | Advisor latency measurement. |
| `scorer-calibration.bench.ts` | Benchmark | Scorer calibration measurement. |
| `code-graph-query-latency.bench.ts` | Benchmark | Code graph query latency measurement. |
| `watcher-benchmark.ts` | Benchmark | Watcher measurement. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/bench/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../tests/README.md`](../tests/README.md)
- [`../lib/scorer/README.md`](../lib/scorer/README.md)
