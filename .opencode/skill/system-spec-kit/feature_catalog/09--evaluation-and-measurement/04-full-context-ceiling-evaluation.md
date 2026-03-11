# Full-context ceiling evaluation

## Current Reality

How good could retrieval be if the system had perfect recall? To answer that, an LLM receives all memory titles and summaries and ranks them for each ground truth query. The resulting MRR@5 score is the theoretical upper bound. The gap between this ceiling and actual hybrid performance tells you how much room for improvement exists. A 2x2 matrix alongside the BM25 baseline puts both numbers in context: the BM25 floor shows the minimum, the LLM ceiling shows the maximum, and the hybrid pipeline sits somewhere between.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-ceiling.ts` | Lib | Full context ceiling evaluation |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/ceiling-quality.vitest.ts` | Ceiling evaluation and quality proxy validation |
| `mcp_server/tests/eval-metrics.vitest.ts` | Eval metrics computation |

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Full-context ceiling evaluation
- Current reality source: feature_catalog.md

## Playbook Coverage

- Mapped to evaluation playbook scenarios NEW-050 through NEW-072 (phase-level)
