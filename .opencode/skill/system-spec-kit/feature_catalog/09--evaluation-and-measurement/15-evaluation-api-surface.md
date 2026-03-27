---
title: "Evaluation API Surface"
description: "The evaluation API surface provides a stable public import boundary for ablation runs, BM25 baselines, ground-truth loading, and evaluation database setup."
---

# Evaluation API Surface

## TABLE OF CONTENTS
- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW
The Evaluation API Surface is a narrow public facade for the system's evaluation tooling. Instead of having scripts import directly from internal `lib/eval/*` modules, the codebase exposes a single stable entry point at `mcp_server/api/eval.ts` for ablation experiments, BM25 baseline runs, ground-truth loading, and evaluation database initialization.

Its main job is architectural, not algorithmic. The file is explicitly marked as a public surface for scripts and as an `ARCH-1` stability boundary, which means internal evaluation modules can move or refactor without forcing downstream scripts to chase new import paths. In practice, the API surface reduces coupling by concentrating evaluation imports behind one maintained file.

---
## 2. CURRENT REALITY
`mcp_server/api/eval.ts` contains no local implementation logic. Its entire responsibility is to re-export evaluation capabilities from internal modules. The ablation portion of the surface exports `runAblation`, `storeAblationResults`, `formatAblationReport`, `toHybridSearchFlags`, `isAblationEnabled`, `ALL_CHANNELS`, and the related `AblationChannel`, `AblationSearchFn`, and `AblationReport` types. This makes the ablation workflow available through a single public import path rather than by reaching into `lib/eval/ablation-framework`.

The same facade pattern is used for BM25 baseline evaluation. The file re-exports `runBM25Baseline` and `recordBaselineMetrics`, along with the `BM25SearchFn`, `BM25SearchResult`, and `BM25BaselineResult` types, so baseline measurement code can depend on a stable API boundary even if the underlying baseline implementation changes location or internal structure.

The surface also exposes `loadGroundTruth` and `initEvalDb` directly from their underlying modules. Together, these exports define the current evaluation API contract: ablation execution and reporting, BM25 baseline execution and metrics capture, ground-truth dataset loading, and evaluation database bootstrap. Because the file adds no wrappers, validation, or transformation logic of its own, its runtime behavior is purely pass-through and its maintenance burden is intentionally concentrated on keeping the public export list aligned with the internal evaluation modules.

---
## 3. SOURCE FILES
### Implementation
| File | Layer | Role |
|------|-------|------|
| `mcp_server/api/eval.ts` | API | Stable public evaluation facade for scripts and external callers |
| `mcp_server/lib/eval/ablation-framework.ts` | Lib | Source of ablation execution, reporting, channel constants, and ablation types |
| `mcp_server/lib/eval/bm25-baseline.ts` | Lib | Source of BM25 baseline execution, metrics recording, and baseline result types |
| `mcp_server/lib/eval/ground-truth-generator.ts` | Lib | Source of ground-truth loading exported through the public facade |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Source of evaluation database initialization exported through the public facade |

### Tests
| File | Focus |
|------|-------|
| `mcp_server/tests/api-public-surfaces.vitest.ts` | Direct export contract for the public eval/search barrels and top-level API barrel parity |

---
## 4. SOURCE METADATA
- Group: Evaluation and measurement
- Source feature title: Evaluation API Surface
- Current reality source: direct implementation audit of `mcp_server/api/eval.ts` and the explicit API-surface export test
