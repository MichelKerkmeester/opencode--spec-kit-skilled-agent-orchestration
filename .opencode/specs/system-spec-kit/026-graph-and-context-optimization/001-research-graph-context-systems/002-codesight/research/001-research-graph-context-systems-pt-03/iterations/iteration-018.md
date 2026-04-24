# Iteration 18 — HTML report as projection layer

## Summary
The HTML report is not architecturally important because of its styling. It matters because it shows how far Codesight can project one `ScanResult` into a presentation surface without re-running analysis. The file is a direct formatter over the raw scan object, with all the benefits and limitations that implies.

## Files Read
- `external/src/generators/html-report.ts:9-20`
- `external/src/generators/html-report.ts:24-207`

## Findings

### Finding 1 — The report is a pure late-bound projection over `ScanResult`
- Source: `external/src/generators/html-report.ts:9-20`
- What it does: `generateHtmlReport()` just calls `buildHtml(result)` and writes the returned string to `report.html`. There is no second analysis phase and no report-specific data model.
- Why it matters for Code_Environment/Public: This reinforces the repo's best architectural idea: compute once, project many times.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: projection architecture
- Risk/cost: low

### Finding 2 — The report repeats the unrounded token-savings narrative
- Source: `external/src/generators/html-report.ts:102-107`
- What it does: the hero section prints `tokenStats.saved`, `outputTokens`, and `estimatedExplorationTokens` with full `toLocaleString()` precision.
- Why it matters for Code_Environment/Public: The same honesty problem seen in `ai-config.ts` appears here. Different output surfaces communicate the same heuristic metric with different confidence levels.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: metric consistency
- Risk/cost: low

### Finding 3 — Coverage is broad but still selective
- Source: `external/src/generators/html-report.ts:119-200`
- What it does: the report renders routes, schema, components, hot files, env vars, and middleware, but there is no equivalent rich section for `libs` or `config.configFiles` / notable dependencies.
- Why it matters for Code_Environment/Public: Even the most visual surface still reflects product prioritization. It is not a full-fidelity mirror of the scan object.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: presentation completeness
- Risk/cost: medium

### Finding 4 — Styling is dense, but the actual reusable value is the section layout
- Source: `external/src/generators/html-report.ts:30-87`, `external/src/generators/html-report.ts:119-200`
- What it does: the file spends far more code on inline CSS than on data shaping. The reusable part is not the visual language; it is the decision to present the same scan as a stat dashboard plus section-specific tables/cards.
- Why it matters for Code_Environment/Public: This confirms the report should be treated as a presentational reference, not a feature to port wholesale.
- Evidence type: source-confirmed
- Recommendation: reject
- Affected area: HTML report adoption
- Risk/cost: low

## Recommended Next Focus
Return to `scanner.ts` to close the loop on collection fidelity. That file explains many of the downstream detector and formatter limitations.

## Metrics
- newInfoRatio: 0.58
- findingsCount: 4
- focus: "iteration 18: HTML report as projection layer"
- status: insight
