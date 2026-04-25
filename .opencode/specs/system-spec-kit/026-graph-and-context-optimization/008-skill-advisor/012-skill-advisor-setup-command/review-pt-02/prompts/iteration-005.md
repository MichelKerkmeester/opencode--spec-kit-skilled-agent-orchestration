You are running iteration 5 of 5 (final convergence) in a CLOSURE re-review loop.

# Iteration 5 — Convergence Verdict + New Findings Check (F-CONV-001 + cross-cutting)

## Goal

Final pass: aggregate the four closure-verification iterations into a verdict on this re-review run.

## Required reads
1. Strategy
2. ALL prior pt-02 iteration markdown + delta JSON (1, 2, 3, 4)
3. `review-pt-02/deep-review-state.jsonl`
4. Spot-check any finding marked PARTIAL or REGRESSED in iters 1-4

## What to verify

- F-CONV-001 (artifact gap from pt-01): pt-01 iterations 003 + 006 had log-embedded artifacts that were materialized post-loop
  → expect: `.opencode/specs/.../012-skill-advisor-setup-command/review/iterations/iteration-{003,006}.md` exist as canonical files
- Aggregate closure stats across iters 1-4
- Any cross-cutting NEW findings (e.g., a remediation introducing a regression in another file)
- newFindingsRatio across the pt-02 loop

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `.opencode/specs/.../012-skill-advisor-setup-command/review-pt-02/iterations/iteration-005.md`

Required sections:
- Summary
- Convergence Verdict (block)
- Aggregate Closure Stats (table)
- Cross-Dimension Patterns (any new ones?)
- Quality Gates (PASS/FAIL on each)
- Files Reviewed

Convergence Verdict block:
```
## Convergence Verdict
- newFindingsRatio (this run): [number]
- dimensionsCovered: ["correctness", "security", "traceability", "maintainability"]
- prior_findings_total: 30
- prior_findings_closed: N
- prior_findings_regressed: N
- prior_findings_partial: N
- new_findings_p0: N
- new_findings_p1: N
- new_findings_p2: N
- verdict: PASS | CONDITIONAL | FAIL
- closure_rate: NN%
- stop_reason: converged | max_iterations | all_findings_closed
```

Decision matrix:
- All 30 closed + 0 new P0/P1 → **PASS**
- Most closed + few partial/regressed but 0 new P0 → **CONDITIONAL** (document carry-forward)
- Any new P0 → **FAIL**

### 2. Delta JSON
Path: `review-pt-02/deltas/iteration-005.json`

### 3. State log append
JSONL line with type:"iteration", iteration:5, convergenceVerdict block, timestamp.

## Constraints
- Read-only.
- Be honest: if closure rate is below 100%, mark CONDITIONAL and list the open items.
- This is the final iteration — no further runs in this packet.
