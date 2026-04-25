# Iteration 021 — Dimension(s): D5

## Scope this iteration
Re-verified the plugin-vs-hook threshold mismatch using fresh code and catalog evidence to ensure the parity defect remains live in both runtime behavior and published current-reality docs.

## Evidence read
- `.opencode/plugins/spec-kit-skill-advisor.js:13-15` and `:35-39` -> plugin default `thresholdConfidence` remains `0.7`.
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:86-90` and `:107-110` -> bridge threshold helper and forwarded `thresholdConfidence` remain anchored to `0.7 / 0.35`.
- `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:543-547` -> catalog explicitly documents the plugin’s `thresholdConfidence` as `0.7`, while the main advisor docs retain `0.8 / 0.35` as the default hook threshold.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- `P1-005-01`: status: re-verified via `.opencode/plugins/spec-kit-skill-advisor.js:13-15`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:86-90`, and `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:543-547`.

## Metrics
- newInfoRatio: 0.05
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 2
- dimensions_advanced: [D5]
- stuck_counter: 5

## Next iteration focus
Go back to D6 and verify whether the broader hook suites now cover the previously identified subprocess/privacy and plugin/parity drift vectors.
