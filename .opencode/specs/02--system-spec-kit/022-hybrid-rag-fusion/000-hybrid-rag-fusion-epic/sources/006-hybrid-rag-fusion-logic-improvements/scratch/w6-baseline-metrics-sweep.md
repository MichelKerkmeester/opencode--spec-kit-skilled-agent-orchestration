# W6 Baseline Metrics Sweep

## Artifact Path

- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/scratch/w6-baseline-metrics-sweep.md

## Commands Run
- FAIL(1): `cd /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public && node .opencode/skill/system-spec-kit/scripts/dist/evals/run-performance-benchmarks.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements`
- OK: `cd /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public && node .opencode/skill/system-spec-kit/scripts/evals/run-phase2-closure-metrics.mjs .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements`
- FAIL(1): `cd /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public && node .opencode/skill/system-spec-kit/scripts/dist/evals/run-phase3-telemetry-dashboard.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements`

## Metric Summary
- Session/automation precision=100.00% recall=88.89% manual_save_ratio=24.00% reduction=76.00% mrr_ratio=0.9811x

## Unavailable Metrics
- Phase 3 telemetry metrics unavailable (dashboard not generated):   path: '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/scratch/eval-dataset-1000.json' | } | Node.js v25.6.1
- Recovery-specific extraction metrics unavailable from performance benchmark output.
- Dedicated crash-recovery time budget (RTO/RPO style) unavailable: no standalone benchmark/eval script found in scripts/evals for crash recovery latency.
