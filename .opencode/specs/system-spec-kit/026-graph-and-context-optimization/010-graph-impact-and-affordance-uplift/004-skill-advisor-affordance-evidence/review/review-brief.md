# Deep Review — 004-skill-advisor-affordance-evidence

You are an autonomous code-review agent. **No conversation context.** This brief is everything you need.

## Your role

Conduct **7 independent review iterations** of sub-phase `004-skill-advisor-affordance-evidence` of phase `010-graph-impact-and-affordance-uplift`. Each iteration is a focused audit pass on a different dimension. Track findings as P0/P1/P2 with file:line evidence. Produce a single `review-report.md` at the end.

## Scope

**Sub-phase root:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence/`

**Implementation surface (read in full before reviewing):**
- mcp_server/skill_advisor/lib/affordance-normalizer.ts (NEW)
- mcp_server/skill_advisor/scripts/skill_graph_compiler.py
- mcp_server/skill_advisor/lib/scorer/types.ts
- mcp_server/skill_advisor/lib/scorer/fusion.ts
- mcp_server/skill_advisor/lib/scorer/lanes/derived.ts
- mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts
- 3 vitest files in skill_advisor/tests/

**Spec context:**
- `010/004-skill-advisor-affordance-evidence/spec.md` (requirements)
- `010/004-skill-advisor-affordance-evidence/checklist.md` (verification items)
- `010/004-skill-advisor-affordance-evidence/implementation-summary.md` (what was built)
- `010/decision-record.md` (phase ADRs)

**Source-of-truth research:**
- `001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/research.md` §11 / §12 / §13

## Iteration plan (exactly 7)

| # | Dimension | Focus |
|---|---|---|
| 1 | **Correctness** | Logic vs spec; edge-case handling; invariant adherence (e.g. status:blocked, no-schema-change, sanitization-mandatory rules) |
| 2 | **Security & Privacy** | Input validation; secret leakage; PII in payloads; prompt-stuffing surfaces; trust-boundary violations |
| 3 | **Integration** | Cross-module contracts; backward compat; type-shape stability; existing test-suite regression risk; API drift |
| 4 | **Performance** | Hot paths; N+1 queries; over-fetching; redundant computation; cache thrashing; memory growth |
| 5 | **Maintainability** | Naming; cohesion; duplication; comment-noise; dead code; coupling; readability |
| 6 | **Observability** | Error paths; logging; metric emission; failure attribution; debuggability |
| 7 | **Evolution** | Forward-looking gaps; tech debt; deferred items from spec; sequencing risk; future-PR readiness |

## Each iteration MUST

- Read fresh — do NOT reuse buffer from prior iteration
- Cite findings with `file:line` evidence
- Tag severity: P0 (blocking), P1 (must-fix before next packet), P2 (cleanup)
- Note explicit "no findings" when a dimension is clean (don't fabricate)

## Output contract

Write `010/004-skill-advisor-affordance-evidence/review/review-report.md` (create directory if needed):

```markdown
---
title: "Deep Review — 004-skill-advisor-affordance-evidence"
description: "7-iteration scoped review with P0/P1/P2 findings."
generated_by: cli-codex gpt-5.5 high fast
generated_at: <ISO-8601-now>
iteration_count: 7
---

# Deep Review — 004-skill-advisor-affordance-evidence

## Findings by Iteration

### Iteration 1 — Correctness
[findings or "no findings"]

### Iteration 2 — Security & Privacy
[…]

… (iterations 3-7)

## Severity Roll-Up

| Severity | Count |
|---|---|
| P0 | N |
| P1 | N |
| P2 | N |

## Top 3 Recommendations

1. [highest-leverage fix]
2. […]
3. […]

## Convergence

- Iterations completed: 7/7
- New-info ratio per iteration: [it1: X, it2: Y, …]
- Final state: ALL_FINDINGS_DOCUMENTED | DEFERRED | BLOCKED
```

## Constraints

- **Read-only.** Do NOT modify any code or spec file. Only WRITE the new `review/review-report.md`.
- Stay scoped to `004-skill-advisor-affordance-evidence` — don't audit other sub-phases.
- 30-min budget per agent run; if you can't complete 7 iterations, ship a partial report with `[ITERATION INCOMPLETE]` markers.
- File:line citations are mandatory for every finding.
- Tool-call budget: ~25 reads + ~5 greps per iteration; 7 × 30 = 210 max.

## Done signal

Print at end: `EXIT_STATUS=DONE | findings: P0=N P1=N P2=N | LOC reviewed: X`
