You are running iteration 7 of 7 (final convergence) in a deep-review loop.

# Iteration 7 — Convergence: P0 Closure + Open Backlog + Cross-Dimension Sweep

## Focus
Final pass: aggregate prior findings, close the loop, verify P0 closure stories, and produce a clean handoff.
- Re-verify all P0 findings from iterations 1-6 against current file state (some may have been fixed mid-flight; some may still stand)
- Identify any cross-dimension finding patterns (e.g., a maintainability issue that has security implications)
- Surface any blind spots not covered by iterations 1-6
- Confirm convergence: newFindingsRatio low, dimension coverage complete, no unresolved P0 stuck states
- Write a final iteration record that the synthesis phase can use

## Required reads
1. Strategy
2. ALL prior iteration outputs (iterations 1-6 markdown + delta JSON)
3. `review/deep-review-state.jsonl` (full state log)
4. Spot-check: any file that had P0 findings — verify the finding still applies

## What to look for
- P0 findings that no longer reproduce on current file state (mark resolved)
- P0 findings still standing (carry to final report)
- Cross-dimension patterns
- Convergence signal: newFindingsRatio < 0.10
- Coverage signal: all 4 dimensions reviewed at least once
- Quality gates: evidence quality, scope, coverage all PASS

## Outputs (MANDATORY)
Same three artifacts pattern with `iteration-007` suffix. ID prefix `F-CONV-`.

Additional: include in iteration-007.md a CONVERGENCE VERDICT block:
```
## Convergence Verdict
- newFindingsRatio: [number]
- dimensionsCovered: [list]
- p0_resolved: N
- p0_outstanding: N
- p1_outstanding: N
- p2_outstanding: N
- verdict: PASS | CONDITIONAL | FAIL
- hasAdvisories: true|false
- stop_reason: converged | max_iterations | all_dimensions_clean
```

## Constraints
- Read-only.
- Do not introduce new dimension audits (this is convergence, not coverage extension).
- Cite the iteration ID where each carried-forward finding originated.
- Be honest: if newFindingsRatio is high, mark verdict CONDITIONAL.
