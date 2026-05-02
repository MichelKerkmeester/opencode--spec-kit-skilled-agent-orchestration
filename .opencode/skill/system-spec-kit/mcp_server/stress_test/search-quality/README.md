---
title: "Search Quality Stress Tests: Retrieval Metrics And Degraded Modes"
description: "Stress harness, fixtures and Vitest coverage for search quality metrics, degraded readiness, reranking and calibration behavior."
trigger_phrases:
  - "search quality stress"
  - "retrieval metrics"
  - "degraded search readiness"
---

# Search Quality Stress Tests: Retrieval Metrics And Degraded Modes

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

---

## 1. OVERVIEW

`stress_test/search-quality/` contains stress coverage for retrieval quality measurement, degraded readiness, reranking, CocoIndex calibration, decision envelopes and metric output. It combines a harness, fixtures, metrics helpers and many targeted Vitest suites.

Current state:

- Provides reusable corpus, harness, fixture and metric helpers.
- Covers NDCG, MRR, reranking, learned weights and degraded readiness paths.
- Tests search decision envelopes, telemetry export and calibration scenarios.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    SEARCH QUALITY STRESS TESTS                   │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌──────────────────┐
│ Vitest suite │ ───▶ │ Harness        │ ───▶ │ Search pipeline  │
│ w*.vitest.ts │      │ harness.ts     │      │ memory / graph   │
└──────┬───────┘      └───────┬────────┘      └────────┬─────────┘
       │                      │                        │
       │                      ▼                        ▼
       │              ┌───────────────┐        ┌────────────────┐
       └───────────▶  │ Fixtures      │ ───▶   │ Metrics        │
                      │ corpus        │        │ ndcg / mrr     │
                      └───────────────┘        └────────────────┘

Dependency direction: test suites -> harness -> fixtures and metrics
```

---

## 3. PACKAGE TOPOLOGY

```text
search-quality/
+-- corpus.ts                         # Test corpus helpers
+-- harness.ts                        # Search quality stress harness
+-- measurement-fixtures.ts           # Measurement fixture data
+-- metrics.ts                        # Metric helpers
+-- baseline.vitest.ts                # Baseline coverage
+-- ndcg-mrr.vitest.ts                # Metric coverage
+-- w*-*.vitest.ts                    # Targeted stress waves
+-- query-surrogates-stress.vitest.ts # Query surrogate stress coverage
`-- README.md
```

Allowed direction:

```text
stress suites -> harness
harness -> corpus, fixtures and metrics
stress suites -> search pipeline under test
```

---

## 4. DIRECTORY TREE

```text
search-quality/
+-- baseline.vitest.ts
+-- cross-encoder-cap.vitest.ts
+-- harness-telemetry-export.vitest.ts
+-- measurement-output.vitest.ts
+-- ndcg-mrr.vitest.ts
+-- query-surrogates-stress.vitest.ts
+-- w7-degraded-empty.vitest.ts
+-- w7-degraded-full-scan.vitest.ts
+-- w7-degraded-stale.vitest.ts
+-- w7-degraded-unavailable.vitest.ts
+-- w8-search-decision-envelope.vitest.ts
+-- w11-cocoindex-calibration-telemetry.vitest.ts
+-- w13-decision-audit.vitest.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `harness.ts` | Runs search quality measurement scenarios. |
| `metrics.ts` | Computes retrieval metrics used by stress assertions. |
| `measurement-fixtures.ts` | Provides measurement fixtures. |
| `ndcg-mrr.vitest.ts` | Covers NDCG and MRR metric behavior. |
| `w7-degraded-stale.vitest.ts` | Covers stale degraded-readiness behavior. |
| `w8-search-decision-envelope.vitest.ts` | Covers decision envelope behavior. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Stress suites may import harness helpers and retrieval modules under test. |
| Exports | Helper modules support tests only. They are not production tool surfaces. |
| Ownership | Put search quality stress and metric harness code here. Put memory or code-graph package tests in their own folders. |

Main flow:

```text
measurement fixture
  -> harness and search pipeline
  -> ranked or degraded result
  -> metric calculation
  -> stress assertion
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `harness.ts` | Test helper | Search quality harness. |
| `metrics.ts` | Test helper | Metric calculations. |
| `baseline.vitest.ts` | Test file | Baseline search quality coverage. |
| `w8-search-decision-envelope.vitest.ts` | Test file | Decision envelope stress coverage. |

---

## 8. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/README.md
```

Expected result: exit code `0`.

---

## 9. RELATED

- [`../memory/README.md`](../memory/README.md)
- [`../code-graph/README.md`](../code-graph/README.md)
