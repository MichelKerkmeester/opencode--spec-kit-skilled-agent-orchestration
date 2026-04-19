# Smart Router Telemetry Analysis Report

Generated: 2026-04-19T17:57:07.192Z
Input: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/.smart-router-telemetry/compliance.jsonl

## Summary

- Total records: 202
- Parse errors skipped: 0

## Compliance Class Distribution

| Class | Count | Share |
|-------|-------|-------|
| always | 0 | 0.00% |
| conditional_expected | 0 | 0.00% |
| on_demand_expected | 0 | 0.00% |
| extra | 0 | 0.00% |
| missing_expected | 2 | 0.99% |
| unknown_unparsed | 200 | 99.01% |

## Per-Skill Compliance

| Skill | Records | Always | Conditional | ON_DEMAND | Extra | Missing | Unknown | Over-Load Rate | Under-Load Rate | ON_DEMAND Trigger Rate |
|-------|---------|--------|-------------|-----------|-------|---------|---------|----------------|-----------------|------------------------|
| cli-codex | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0.00% | 0.00% | 0.00% |
| command-create-feature-catalog | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0.00% | 0.00% | 0.00% |
| command-create-testing-playbook | 2 | 0 | 0 | 0 | 0 | 0 | 2 | 0.00% | 0.00% | 0.00% |
| command-spec-kit-resume | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0.00% | 0.00% | 0.00% |
| mcp-chrome-devtools | 12 | 0 | 0 | 0 | 0 | 0 | 12 | 0.00% | 0.00% | 25.00% |
| mcp-clickup | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 0.00% | 0.00% | 100.00% |
| mcp-coco-index | 5 | 0 | 0 | 0 | 0 | 0 | 5 | 0.00% | 0.00% | 80.00% |
| mcp-figma | 4 | 0 | 0 | 0 | 0 | 0 | 4 | 0.00% | 0.00% | 100.00% |
| sk-code-opencode | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 0.00% | 0.00% | 0.00% |
| sk-code-review | 26 | 0 | 0 | 0 | 0 | 0 | 26 | 0.00% | 0.00% | 19.23% |
| sk-code-web | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 0.00% | 0.00% | 0.00% |
| sk-deep-research | 26 | 0 | 0 | 0 | 0 | 0 | 26 | 0.00% | 0.00% | 34.62% |
| sk-deep-review | 22 | 0 | 0 | 0 | 0 | 0 | 22 | 0.00% | 0.00% | 50.00% |
| sk-doc | 6 | 0 | 0 | 0 | 0 | 2 | 4 | 0.00% | 33.33% | 66.67% |
| sk-git | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 0.00% | 0.00% | 100.00% |
| sk-improve-prompt | 21 | 0 | 0 | 0 | 0 | 0 | 21 | 0.00% | 0.00% | 0.00% |
| system-spec-kit | 26 | 0 | 0 | 0 | 0 | 0 | 26 | 0.00% | 0.00% | 65.38% |
| UNKNOWN | 37 | 0 | 0 | 0 | 0 | 0 | 37 | 0.00% | 0.00% | 0.00% |

## Interpretation Notes

- Over-load rate counts records classified as `extra`: the session read resources outside the predicted route.
- Under-load rate counts records classified as `missing_expected`: the session missed a predicted required resource.
- ON_DEMAND trigger rate counts records with an ON_DEMAND route or ON_DEMAND compliance class.
- Static measurement records from `smart-router-measurement.ts` intentionally appear as `unknown_unparsed` and should not be mixed with live-session compliance conclusions.

