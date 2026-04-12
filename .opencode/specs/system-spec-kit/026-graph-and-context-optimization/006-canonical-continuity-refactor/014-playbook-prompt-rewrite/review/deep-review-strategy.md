# Deep Review Strategy: 014-playbook-prompt-rewrite

## Review Dimensions

- [x] Traceability - Packet claims compared against actual playbook scenario files in all three named playbook roots
- [x] Maintainability - Legacy matrix format and mixed prompt block styles assessed for reviewer/operator usability
- [x] Correctness - Representative system-spec-kit scenarios checked for the required section-headed prose structure
- [ ] Security - No distinct security issue emerged in this document-format slice beyond the traceability regressions

## Completed Dimensions

| Dimension | Iteration | Verdict |
|-----------|-----------|---------|
| Traceability | 001-002 | CONDITIONAL |
| Maintainability | 001-002 | CONDITIONAL |
| Correctness | 002 | CONDITIONAL |

## Running Findings

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 3 |
| P2 | 0 |

## What Worked

- Reviewing the packet claims first made it clear the target question was not "are these files readable?" but "is the rewrite actually complete across the named playbook roots?"
- Sampling one representative scenario from each requested playbook root was enough to confirm the regressions on actual shipped files.

## What Failed

- The packet's "already rewrote prompt fields across the manual testing playbook" framing does not survive contact with the current playbook corpus.

## Exhausted Approaches

- Checked both cross-skill playbook roots (`sk-deep-review` and `sk-deep-research`) for the legacy matrix shape; both still ship it.
- Checked representative `system-spec-kit` scenarios for the required `### Prompt / Commands / Expected / Evidence / Pass / Fail / Failure Triage` sections; sampled files still use older dash-prefixed blocks instead.

## Next Focus

Review complete. The next remediation needs to finish the actual playbook rewrite across the three named roots and then refresh Phase 014 so it stops describing the rewrite as already complete.
