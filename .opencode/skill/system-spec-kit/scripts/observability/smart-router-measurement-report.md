# Smart Router Static Measurement Report

Generated: 2026-04-19T17:56:59.634Z

## Summary

- Total prompts: 200
- Advisor top-1 accuracy vs corpus labels: 112/200 (56.00%)
- Methodology caveat: Static measurement only: predicted routes and advisor labels were measured. No live AI read behavior was observed.

## Per-Skill Accuracy And Savings

| Skill | Prompts | Correct | Accuracy | ON_DEMAND Hit Rate | Avg Allowed Resources | Median Allowed Resources | Avg Brief Bytes | Avg Full Tree Bytes | Avg Predicted Context Bytes | Avg Brief Savings | Avg Predicted Context Savings |
|-------|---------|---------|----------|--------------------|-----------------------|--------------------------|-----------------|---------------------|-----------------------------|-------------------|-------------------------------|
| cli-codex | 1 | 0 | 0.00% | 0.00% | 4.00 | 4.00 | 67.00 | 151220.00 | 101477.00 | 99.96% | 32.89% |
| command-create-feature-catalog | 1 | 0 | 0.00% | 0.00% | 0.00 | 0.00 | 88.00 | 0.00 | 0.00 | 0.00% | 0.00% |
| command-create-testing-playbook | 2 | 0 | 0.00% | 0.00% | 0.00 | 0.00 | 89.00 | 0.00 | 0.00 | 0.00% | 0.00% |
| command-spec-kit-resume | 1 | 0 | 0.00% | 0.00% | 0.00 | 0.00 | 81.00 | 0.00 | 0.00 | 0.00% | 0.00% |
| mcp-chrome-devtools | 12 | 3 | 25.00% | 25.00% | 1.50 | 1.00 | 77.00 | 68521.00 | 44018.50 | 99.89% | 35.76% |
| mcp-clickup | 3 | 3 | 100.00% | 100.00% | 4.00 | 4.00 | 69.00 | 59318.00 | 59318.00 | 99.88% | 0.00% |
| mcp-coco-index | 5 | 4 | 80.00% | 80.00% | 2.60 | 3.00 | 72.00 | 78656.00 | 56621.00 | 99.91% | 28.01% |
| mcp-figma | 4 | 4 | 100.00% | 100.00% | 3.00 | 3.00 | 67.00 | 44279.00 | 44279.00 | 99.85% | 0.00% |
| sk-code-opencode | 3 | 3 | 100.00% | 0.00% | 0.00 | 0.00 | 74.00 | 310234.00 | 33686.00 | 99.98% | 89.14% |
| sk-code-review | 26 | 15 | 57.69% | 0.00% | 4.08 | 4.00 | 72.00 | 50872.00 | 35270.85 | 99.86% | 30.67% |
| sk-code-web | 3 | 0 | 0.00% | 0.00% | 0.00 | 0.00 | 69.00 | 631290.00 | 30366.00 | 99.99% | 95.19% |
| sk-deep-research | 26 | 23 | 88.46% | 34.62% | 3.15 | 3.00 | 74.00 | 208957.00 | 131726.62 | 99.96% | 36.96% |
| sk-deep-review | 22 | 18 | 81.82% | 50.00% | 3.27 | 4.00 | 72.00 | 167013.00 | 113178.86 | 99.96% | 32.23% |
| sk-doc | 4 | 4 | 100.00% | 100.00% | 2.00 | 2.00 | 64.00 | 643349.00 | 74266.00 | 99.99% | 88.46% |
| sk-git | 3 | 3 | 100.00% | 100.00% | 5.33 | 5.00 | 64.00 | 157512.00 | 97241.67 | 99.96% | 38.26% |
| sk-improve-prompt | 21 | 9 | 42.86% | 0.00% | 0.00 | 0.00 | 75.00 | 119583.00 | 19489.00 | 99.94% | 83.70% |
| system-spec-kit | 26 | 23 | 88.46% | 65.38% | 6.42 | 6.50 | 73.00 | 580449.00 | 210416.19 | 99.99% | 63.75% |
| UNKNOWN | 37 | 0 | 0.00% | 0.00% | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00% | 0.00% |

## Allowed-Resource Count Distribution

| Allowed Resources | Prompt Count |
|-------------------|--------------|
| 0 | 68 |
| 1 | 26 |
| 2 | 5 |
| 3 | 19 |
| 4 | 42 |
| 5 | 20 |
| 6 | 7 |
| 7 | 4 |
| 8 | 5 |
| 9 | 1 |
| 10 | 3 |

## Caveats

- This report measures advisor output and the predicted SMART ROUTING resource route only.
- It does not measure actual AI tool reads, skipped SKILL.md behavior, or whether a model followed a route.
- Compliance JSONL records emitted by this static harness intentionally classify as `unknown_unparsed` to avoid implying live-session compliance.
- Causal claims about AI reasoning require live-session telemetry collected with the wrapper.

