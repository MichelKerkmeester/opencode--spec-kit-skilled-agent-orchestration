# Iteration 001 - Correctness

## Focus

Parent requirements and completed research synthesis.

## Files Reviewed

- `spec.md`
- `../spec.md`
- `research/research.md`
- `research/research-validation.md`
- `research/iterations/iteration-020.md`

## Findings

### DR-P1-001 - REQ-011 cross-runtime delta table is not delivered

Severity: P1

The parent packet requires a cross-runtime delta table with per-runtime context-load savings (`../spec.md:103` and `../spec.md:104`). The research synthesis provides qualitative runtime parity and says real cross-runtime context-token deltas are weak evidence (`research/research.md:39` to `research/research.md:41`). The validation follow-up asks for future cross-runtime replay rather than presenting the table (`research/research-validation.md:61` to `research/research-validation.md:68`).

Impact: REQ-011 acceptance is not met by the current artifact set.

### DR-P2-003 - Completion language can read stronger than the convergence evidence

Severity: P2

The parent acceptance says "Converged research-validation.md with findings" (`../spec.md:96`), but the terminal iteration says the strict rolling convergence threshold was not satisfied and the run stopped at max iterations (`research/iterations/iteration-020.md:21`). The state log also records `maxIterationsReached` (`research/deep-research-state.jsonl:23`).

Impact: This is not a blocker because the charter permits 20 iterations as a stop condition, but downstream readers should see the distinction between saturation and max-iteration stop.

## Delta

New findings: P1=1, P2=1. New findings ratio: 0.46.

