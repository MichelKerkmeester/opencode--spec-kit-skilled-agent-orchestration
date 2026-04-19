# Iteration 015: Evidence Strength and Limits

## Focus Question(s)

Cross-cutting - which findings are deterministic, observational, or design-only?

## Tools Used

- Evidence classification over V1-V10 results
- Metrics review

## Sources Queried

- `/tmp/smart_router_metrics.json`
- `.opencode/skill/*/SKILL.md`
- `.opencode/specs/**/research/iterations/iteration-*.md`

## Findings

- Strong evidence: V1 inventory, V2 byte budgets, V6 bloat ratios, V7 exact keyword hits, V8 fallback text, and V9 absence of enforcement candidates in searched runtime/config surfaces.
- Moderate evidence: V3 and V5 behavior, because iteration artifacts are not raw Read-call telemetry.
- Moderate evidence: V4, because the corpus labels top skill rather than intended intra-skill resource route.
- Design-only evidence: V10, because no live instrumentation was run.
- The final report should not claim "the AI does or does not follow tiers" as a universal fact; it should say current artifacts show partial advisory uptake and require instrumentation for exact compliance.

## Novelty Justification

This calibrated claims before synthesis and reduced overclaim risk.

## New-Info-Ratio

0.08

## Next Iteration Focus

Concrete enforcement design options.
