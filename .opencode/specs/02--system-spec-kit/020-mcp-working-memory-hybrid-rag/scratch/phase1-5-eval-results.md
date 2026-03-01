# Phase 1.5 Shadow Evaluation (1000-query set)

## Inputs

- Dataset: `scratch/eval-dataset-1000.json`
- Comparison: baseline ranking snapshot vs boosted ranking simulation (session boost + pressure policy)
- Human-reviewed subset: 100/1000

## Results

- Spearman rho (baseline vs boosted): `1.0000`
- Rank correlation gate (>= 0.90): **PASS**
- Token waste delta (sessions >20 turns): `-19.6%`
- Context error delta (pressure simulation): `-100%`
- Context errors vs baseline (SC-002): `0%` of baseline (**PASS**, target <= 25%)
- Context error counts (baseline -> boosted): `2000 -> 0` across `10000` pressure samples
- Telemetry artifact: `scratch/phase1-5-context-error-telemetry.json`

## Interpretation

- Phase 1.5 rank-correlation hard gate satisfied for Phase 2 progression.
- SC-002 context-error target is satisfied under the pressure-policy telemetry model.

