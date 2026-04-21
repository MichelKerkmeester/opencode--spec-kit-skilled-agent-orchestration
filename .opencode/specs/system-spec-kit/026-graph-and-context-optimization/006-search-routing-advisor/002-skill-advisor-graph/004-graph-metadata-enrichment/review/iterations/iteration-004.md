# Iteration 004: Maintainability

## Focus

Maintainability pass over drift resistance, future corpus growth, and document structure.

## Files Reviewed

- `spec.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`

## Findings

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F008 | P2 | The packet hard-codes the corpus count as `21` and acknowledges future count drift, but it does not define the inclusion rule that distinguishes live skill metadata from fixtures. This makes the same `find` command fragile and already ambiguous. | `spec.md:147`, `implementation-summary.md:90`, `checklist.md:65` |
| F009 | P2 | ADR-001 has detailed anchors for context, decision, alternatives, consequences, checks, and implementation; ADR-002 is structurally lighter and lacks matching anchors. This is not a strict validator failure, but it weakens structured retrieval consistency. | `decision-record.md:29`, `decision-record.md:128` |

## Delta

New findings: P2=2. All four dimensions have now been covered at least once.

## Convergence Check

Continue. Dimension coverage is complete, but active P1 findings block a clean stop.
