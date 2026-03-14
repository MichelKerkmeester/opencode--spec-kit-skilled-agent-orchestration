# BM25-only baseline

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)
- [6. PLAYBOOK COVERAGE](#6--playbook-coverage)

## 1. OVERVIEW
Describes the FTS5-only baseline measurement (MRR@5 of 0.2083) that confirmed hybrid retrieval adds real value over keyword search alone.

## 2. CURRENT REALITY
Running FTS5 alone (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) runs behind the `ENABLE_BM25` flag (default ON, set `ENABLE_BM25=false` to disable).

## 3. IN SIMPLE TERMS
This test answered a simple question: "Would basic keyword search be good enough on its own?" By running just keyword matching against 110 test questions and measuring how poorly it performed, the team proved that the more advanced multi-method search approach is worth the extra effort. Without this baseline measurement, you would be guessing whether the added complexity actually helps.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/bm25-baseline.ts` | Lib | BM25-only baseline evaluation |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/bm25-baseline.vitest.ts` | BM25 baseline evaluation |
| `mcp_server/tests/eval-metrics.vitest.ts` | Eval metrics computation |
| `mcp_server/tests/ground-truth.vitest.ts` | Ground truth tests |

## 5. SOURCE METADATA
- Group: Evaluation and measurement
- Source feature title: BM25-only baseline
- Current reality source: feature_catalog.md

## 6. PLAYBOOK COVERAGE
- Mapped to manual testing playbook scenario NEW-011

