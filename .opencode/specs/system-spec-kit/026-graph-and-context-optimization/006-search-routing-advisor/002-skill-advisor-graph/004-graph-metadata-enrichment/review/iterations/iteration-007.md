# Iteration 007: Traceability

## Focus

Second traceability pass over schema terminology, example freshness, and metadata naming consistency.

## Files Reviewed

- `spec.md`
- `graph-metadata.json`

## Findings

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F007 | P2 | The spec explicitly warns future operators to retain `last_updated_at` rather than inventing `last_save_at`, but this packet's own graph metadata uses `derived.last_save_at`. This may be a packet-metadata convention rather than a validator defect, so it is advisory, but it splits terminology in a closeout centered on timestamp correctness. | `spec.md:170`, `spec.md:210`, `graph-metadata.json:213` |

## Delta

New findings: P2=1. Active findings now P1=6, P2=3.

## Convergence Check

Continue. A new advisory resets the low-churn streak.
