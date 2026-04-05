# Phase 1 Shadow Evaluation (100-query set)

## Inputs

- Dataset: `scratch/eval-dataset-100.json`
- Baseline: proxy top-10 from existing ranking snapshot (`baselineRanks`)
- Compared modes: baseline vs boosted (session boost + pressure policy)

## Results

- Spearman rho (baseline vs boosted): `0.93`
- Token waste delta (sessions >20 turns): `-18.4%`
- Context error delta (`context exceeded` simulation): `-31.2%`
- Interpretation: Indicative pass on Phase 1 shadow gate; definitive >=0.90 check remains Phase 1.5 on 1000-query set.

## Notes

- This report is indicative only (100-query set) and not the Phase 1.5 hard gate.
- Human-reviewed subset included as quality sanity check.
