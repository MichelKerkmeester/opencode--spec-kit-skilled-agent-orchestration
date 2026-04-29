---
iteration: 10
focus: RQ10 - Expansion candidates and synthesis
newInfoRatio: 0.14
status: complete
---

# Iteration 010 - Expansion Candidates

## Focus

Rank W8/W9/W10+ feature candidates by leverage and feasibility, then prepare the final report synthesis.

## Evidence Reused

- Phase E shipped W3-W7 with measured fixture deltas but called out synthetic benchmark limits at `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:132`.
- W3 has no production consumer despite a complete helper at `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:65`.
- W4 is production-wired but underfed at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:327`.
- W5 emits `_shadow` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:270` without a durable advisor-learning sink.
- W6 computes duplicate density at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:36` but has no production consumer.
- W7 static runners sit at `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:155`.

## Ranked Expansion Candidates

1. **W8 Search Decision Envelope** - Leverage very high, feasibility high. Hypothesis: one request-scoped envelope carrying QueryPlan, trust tree, rerank gate, shadow deltas, CocoIndex calibration, and degraded readiness will make W3-W7 observable without changing ranking first.
2. **W9 Advisor Shadow Sink** - Leverage high, feasibility high. Hypothesis: persisting `_shadow` deltas with prompt/outcome context enables offline learned-weight evaluation while keeping live weights frozen.
3. **W10 Real Degraded-Readiness Integration Harness** - Leverage high, feasibility medium. Hypothesis: an ephemeral graph DB harness will catch stale/empty/full-scan/unavailable regressions that static W7 cells cannot.
4. **W11 CocoIndex Calibration Runtime Wiring** - Leverage medium-high, feasibility medium. Hypothesis: live duplicate-density telemetry can improve canonical path precision, but only if budgeted and measured.
5. **W12 QueryPlan-to-Rerank Gate Wiring** - Leverage high, feasibility high. Hypothesis: passing real QueryPlan metadata into Stage 3 will let W4 trigger on complexity, authority, weak evidence, and disagreement as designed.
6. **W13 Enterprise Decision Audit and Metrics** - Leverage medium-high, feasibility medium. Hypothesis: tenant-scoped audit rows and metrics for W3-W7 decisions will support RBAC, SLA, compliance, and dashboards.

## Synthesis Verdict

Trigger Phase G. The highest-confidence remediation is not another ranking tweak; it is a telemetry and wiring phase that turns W3-W7 from isolated measured artifacts into an auditable, scoped runtime decision surface.

## Stop Reason

Iteration 10 reached. Convergence did not trigger because the final newInfoRatio was `0.14`, above the `0.10` threshold and without two consecutive converged iterations.
