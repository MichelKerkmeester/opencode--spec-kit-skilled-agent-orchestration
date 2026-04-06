---
title: "Plan: 004-graphify Research Phase"
description: "Research execution plan for the graphify external repo audit phase"
trigger_phrases:
  - "graphify research plan"
  - "004-graphify execution plan"
importance_tier: "important"
contextType: "plan"
---
# Plan: 004-graphify Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

## 1. Approach

7-iteration deep-research loop dispatched via `/spec_kit:deep-research:auto`, with each iteration focused on a distinct subset of the 12 research questions in `phase-research-prompt.md`. State externalized to JSONL + strategy + findings registry. Convergence detection on coverage threshold.

## 2. Execution Steps

1. **Iteration 1 — Pipeline Architecture Lock**: Read `external/ARCHITECTURE.md`, `external/README.md`, `external/graphify/__main__.py`. Map file inventory and seven-stage pipeline.
2. **Iteration 2 — AST Extraction Internals**: Read `external/graphify/detect.py` end-to-end + `extract.py` dispatch table + Python extractor + cross-file `uses` inference + sample JS/Go/Rust extractors.
3. **Iteration 3 — Semantic Merge Cache Promotion**: Read `external/skills/graphify/skill.md`, `cache.py`, `build.py`, `validate.py`, `export.py:264-275`.
4. **Iteration 4 — Clustering Analyze Report**: Read `cluster.py`, `analyze.py`, `report.py` end-to-end.
5. **Iteration 5 — Hooks Cache Rebuild**: Read `__main__.py`, `watch.py`, `hooks.py` end-to-end.
6. **Iteration 6 — Multimodal Pipeline**: Read `ingest.py`, `security.py`, re-cite skill.md image instructions and detect.py PDF logic.
7. **Iteration 7 — Benchmark Credibility**: Read `benchmark.py`, validate against `external/worked/karpathy-repos/{README,GRAPH_REPORT,review}.md`.
8. **Synthesis**: Compile `research/research.md` with 17 sections, 12 findings, Adopt/Adapt/Reject recommendations.
9. **Memory save + validation**: Run `generate-context.js`, `validate.sh --strict`, write `implementation-summary.md`.

## 3. Engine Strategy

- **Iteration 1**: codex CLI gpt-5.4 reasoning effort=high (per user directive "use cli-codex wherever possible")
- **Iterations 2-7**: claude-opus-direct (after iter 2 codex starved on parallel-job API contention; user directive "do faster")

## 4. Risk Mitigation

- Each iteration writes to its own `iteration-NNN.md` file → no context loss across iterations
- JSONL state log is append-only → safe to replay or recover
- Reducer runs after each iteration to refresh strategy/registry/dashboard
- Cross-phase awareness loaded into strategy.md "Known Context" section to prevent duplicating 002/003 findings

## 5. Validation Strategy

- 12 research questions tracked in `findings-registry.json` openQuestions
- Coverage threshold 85% triggers convergence detection
- Every finding requires file:line citation (rule enforced in iteration template)
- Quality guards check source diversity, focus alignment, and single-weak-source answers

## 6. Deliverables

- `research/research.md` (canonical synthesis, 17 sections, 12+ findings, Adopt/Adapt/Reject table)
- `research/iterations/iteration-{001..007}.md`
- `research/deep-research-{config,state,strategy,dashboard,findings-registry}.{json,md,jsonl}`
- `implementation-summary.md`
- Memory artifact at `memory/<timestamp>__deep-research-graphify-survey.md`
- `spec.md`, `plan.md`, `tasks.md` (Level 1 stubs pointing at research.md)
