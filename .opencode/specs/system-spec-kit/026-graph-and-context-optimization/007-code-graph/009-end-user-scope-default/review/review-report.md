# Deep Review Report v2 — 009 end-user-scope-default

**Generated:** 2026-05-02T14:30:59.639Z
**SessionId (gen 2):** 2026-05-02T14:00:34.910Z
**Parent SessionId (gen 1):** 2026-05-02T12:34:30.068Z (run 1, converged at iter 6, archived)
**Executor:** cli-copilot model=gpt-5.5
**Iterations completed:** 10 of 10
**Stop reason:** maxIterationsReached

## Verdict: **FAIL**

| Severity | Count |
|---|---|
| P0 (Blocker) | 1 |
| P1 (Required) | 3 |
| P2 (Suggestion) | 6 |

## Dimension Coverage (this run)

- maintainability: ✓
- correctness: ✓
- security: ✓
- traceability: ✓

## P0 Findings (REGRESSION or NEW BLOCKER)

- **R2-I7-P0-001** [security]  — REGRESSION: R4-P2-001 scan data.errors still expose absolute indexed file paths

## P1 Findings (NEW)

- **R2-I4-P1-001** [maintainability]  — Default-scope scan test inherits maintainer env opt-in and fails under documented shell state
- **R2-I5-P1-001** [correctness]  — code-graph-indexer regression tests do not cover the full six-case scope precedence matrix
- **R2-I9-P1-001** [correctness]  — code_graph_status cannot evaluate the per-call scan scope and reports env-only active scope after one-off overrides

## P2 Findings

- **R2-I1-P2-001** [maintainability]  — Skill-scope path literals still have multiple source-code representations
- **R2-I2-P2-001** [maintainability]  — README topology omits the scope policy module that now owns the include-skills contract
- **R2-I3-P2-001** [maintainability]  — Readiness stale reason leaks internal manifest vocabulary
- **R2-I8-P2-001** [traceability]  — ADR-001 still has five sub-decisions; precedence is only recorded in ADR-002
- **R2-I8-P2-002** [traceability]  — Remediation summary names six fixes but does not provide file:line evidence
- **R2-I8-P0-001** [traceability]  — Downgraded to P2: P0 claim was based on moving `main~1..HEAD` range; map matches the FIX-009 SHA `79e97aec9`.

## Regression Summary

Run-1 closed findings re-verified across iters 5-8:
- R1-P1-001 (precedence) — see iteration-005.md regression check
- R3-P1-001 (symlink) — see iteration-006.md regression check
- R1-P2-001/R2-P2-001/R4-P2-002 (resource-map drift) — see iteration-008.md regression check
- R4-P2-001 (abs path leakage) — see iteration-007.md regression check

## Iteration Log

### Iteration 1

See `review/iterations/iteration-001.md` for full narrative.

### Iteration 2

See `review/iterations/iteration-002.md` for full narrative.

### Iteration 3

See `review/iterations/iteration-003.md` for full narrative.

### Iteration 4

See `review/iterations/iteration-004.md` for full narrative.

### Iteration 5

See `review/iterations/iteration-005.md` for full narrative.

### Iteration 6

See `review/iterations/iteration-006.md` for full narrative.

### Iteration 7

See `review/iterations/iteration-007.md` for full narrative.

### Iteration 8

See `review/iterations/iteration-008.md` for full narrative.

### Iteration 9

See `review/iterations/iteration-009.md` for full narrative.

### Iteration 10

See `review/iterations/iteration-010.md` for full narrative.

## Next Steps

- Run `/spec_kit:plan` to create a remediation packet for new P0/P1 findings
- Re-run deep-review after fixes
