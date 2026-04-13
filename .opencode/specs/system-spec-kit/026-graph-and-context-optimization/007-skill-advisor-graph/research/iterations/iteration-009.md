## Summary

This iteration tested regression risk for the current graph-integrated `skill_advisor.py` routing path, with emphasis on whether graph boosts can change the winning recommendation in harmful ways. The relevant integration points are `_apply_graph_boosts()` and `_apply_family_affinity()` in `.opencode/skill/skill-advisor/scripts/skill_advisor.py:81-143`, invoked before lexical scoring and ranking in `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1496-1498`.

The main result is reassuring but not zero-risk:

- The official regression harness still passes cleanly: `44/44` cases passed, `top1_accuracy=1.0`, `p0_pass_rate=1.0`, `command_bridge_fp_rate=0.0`.
- Only `1/44` cases changed top-1 when compared against a controlled no-graph-boost baseline.
- That single top-1 flip was `P1-FULLSTACK-001`, where graph family affinity promoted `sk-code-full-stack` over `sk-code-opencode`. This is not currently a regression because the fixture explicitly allows either winner (`.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:38`).
- The three requested edge-case prompts did not change top-1 with graph boosts enabled.

Method used for the with-graph vs without-graph comparison:

- Baseline run: current production behavior.
- No-graph-boost replay: monkey-patched `_apply_graph_boosts()` and `_apply_family_affinity()` to no-op in memory, while leaving the rest of the routing pipeline unchanged. This isolates the effect of boost propagation and family affinity specifically.

## Regression Results

Official regression command:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

Full output:

```json
{
  "dataset": ".opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl",
  "mode": "both",
  "thresholds": {
    "confidence": 0.8,
    "uncertainty": 0.35,
    "min_top1_accuracy": 0.92,
    "max_command_bridge_fp_rate": 0.05,
    "min_p0_pass_rate": 1.0
  },
  "metrics": {
    "total_cases": 44,
    "passed_cases": 44,
    "failed_cases": 0,
    "pass_rate": 1.0,
    "p0_total": 12,
    "p0_passed": 12,
    "p0_pass_rate": 1.0,
    "top1_cases": 40,
    "top1_accuracy": 1.0,
    "command_bridge_eval_cases": 37,
    "command_bridge_fp": 0,
    "command_bridge_fp_rate": 0.0
  },
  "gates": {
    "top1_accuracy": true,
    "command_bridge_fp_rate": true,
    "p0_pass_rate": true,
    "all_cases_passed": true
  },
  "overall_pass": true,
  "failures": []
}
```

Failure analysis:

- There were no harness failures to investigate.
- This means graph integration does not currently break any existing success criteria captured by the 44-case fixture.

Top-1 change check across all 44 cases:

- `43/44` cases kept the same top-1 recommendation with and without graph boosts.
- `1/44` cases changed top-1.
- Changed case id: `P1-FULLSTACK-001`.

Changed case detail:

- Prompt: `build full stack typescript service`
- Graph on top-1:

```json
{
  "skill": "sk-code-full-stack",
  "kind": "skill",
  "confidence": 0.95,
  "uncertainty": 0.2,
  "passes_threshold": true,
  "reason": "Matched: !graph:family(sk-code), full(name), implement~, stack(name)"
}
```

- Graph-off top-1:

```json
{
  "skill": "sk-code-opencode",
  "kind": "skill",
  "confidence": 0.89,
  "uncertainty": 0.2,
  "passes_threshold": true,
  "reason": "Matched: !full stack typescript(phrase), !typescript, typescript"
}
```

Interpretation:

- The winning route changes because family affinity gives `sk-code-full-stack` enough score to surface from zero lexical intent into first place.
- This is the clearest evidence that graph boosts can change production routing, but the current fixture intentionally tolerates either outcome, so it is not a failing regression under the present contract.

Additional aggregate signals from the 44-case diff:

- `2/44` top-1 winners included an explicit `!graph:` reason.
- `11/44` cases changed top-3 membership even when top-1 stayed the same.
- The lower-rank churn is concentrated in family and sibling spillover, especially MCP-family and CLI-family suggestions.

Representative secondary-noise cases:

- `P0-CHROME-002`: graph adds `mcp-code-mode` under `mcp-chrome-devtools`.
- `P1-REVIEW-003`: graph adds `sk-deep-research` under `sk-deep-review`.
- `P1-WEB-001`: graph adds `sk-code-full-stack` and `sk-code-review` under `sk-code-web`.
- `P1-CLI-003`: graph expands `cli-claude-code` into `cli-codex` and `cli-copilot`.

## Edge Case Tests

### A. `save context and create spec folder`

Command:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py 'save context and create spec folder' --threshold 0
```

Full output:

```json
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !context, !context(multi), !folder, !intent:memory, !save(multi)"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.35,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: implement~, specification~, spec~"
  },
  {
    "skill": "command-spec-kit",
    "kind": "command",
    "confidence": 0.88,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create, new, plan~, spec(name)"
  },
  {
    "skill": "command-memory-save",
    "kind": "command",
    "confidence": 0.79,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, context, memory(name), save(name)"
  },
  {
    "skill": "command-create-folder-readme",
    "kind": "command",
    "confidence": 0.73,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create(name), document~, folder(name)"
  },
  {
    "skill": "command-create-agent",
    "kind": "command",
    "confidence": 0.57,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create(name), new"
  }
]
```

Graph-risk assessment:

- Top-1 is stable with and without graph boosts: `system-spec-kit`.
- This is a low-risk route because the primary intent is already dominated by strong lexical memory/spec signals.
- Graph boosts did not introduce the winning skill here.

### B. `improve this agent evaluation`

Command:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py 'improve this agent evaluation' --threshold 0
```

Full output:

```json
[
  {
    "skill": "sk-improve-agent",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !agent evaluation(phrase), improve(name)"
  },
  {
    "skill": "sk-improve-prompt",
    "kind": "skill",
    "confidence": 0.81,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !graph:sibling(sk-improve-agent,0.4), !improve(multi), improve(name)"
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
    "confidence": 0.41,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:family(sk-util)"
  },
  {
    "skill": "sk-git",
    "kind": "skill",
    "confidence": 0.41,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:family(sk-util)"
  }
]
```

Graph-risk assessment:

- Top-1 is stable with and without graph boosts: `sk-improve-agent`.
- The main graph side effect is lower-rank noise: `sk-doc` and `sk-git` appear via `!graph:family(sk-util)` even though the prompt is about agent improvement, not documentation or git workflow.
- This is not a top-1 regression, but it is a precision loss in the ranked tail.

### C. `delegate code review to external cli`

Command:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py 'delegate code review to external cli' --threshold 0
```

Full output:

```json
[
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code review(phrase), !intent:review, !review, !review(multi), code(name)"
  },
  {
    "skill": "cli-claude-code",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !delegate(multi), cli(name), code(name), external, review"
  },
  {
    "skill": "cli-copilot",
    "kind": "skill",
    "confidence": 0.93,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !delegate(multi), cli(name), code, external"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.89,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-review,0.7), code(name)"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.84,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !external, code(name), external"
  },
  {
    "skill": "cli-codex",
    "kind": "skill",
    "confidence": 0.81,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !delegate(multi), cli(name), code, review"
  },
  {
    "skill": "cli-gemini",
    "kind": "skill",
    "confidence": 0.8,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !delegate(multi), cli(name), code"
  },
  {
    "skill": "sk-code-web",
    "kind": "skill",
    "confidence": 0.79,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !graph:enhances(sk-code-review,0.7), code(name)"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.77,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !graph:enhances(sk-code-review,0.7), code(name)"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.6,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: code, external~, review(name)"
  }
]
```

Graph-risk assessment:

- Top-1 is stable with and without graph boosts: `sk-code-review`.
- The CLI routing lane remains intact because `cli-claude-code` stays second with or without graph boosts.
- The main graph side effect is again secondary inflation, especially `sk-code-full-stack`, `sk-code-web`, and `sk-code-opencode` via `sk-code-review` relationship propagation.

## Risk Assessment

Current production risk level: low to moderate.

Why the risk is low:

- The official regression suite is fully green.
- All `12/12` P0 cases remain correct.
- The three targeted edge prompts do not change top-1.
- Only one top-1 change appears across the full 44-case corpus.

Why the risk is not zero:

- Graph boosts are already strong enough to change the winner in at least one prompt.
- That winner change is driven by family affinity rather than direct lexical evidence.
- `11/44` cases show top-3 churn, meaning the graph is materially altering the suggestion set even when the winner stays stable.
- Family and sibling propagation continue to inject unrelated but same-family options into the ranked tail.

Most likely harmful production scenario:

- Ambiguous prompts that mention a broad code family, such as `sk-code`, but do not specify whether the user wants OpenCode-specific standards, full-stack guidance, or web guidance.
- In those prompts, `!graph:family(...)` can manufacture a confident alternative winner or overpopulate the candidate set with siblings that were not lexically earned.

Most likely safe production scenario:

- Prompts with strong explicit lexical intent, such as `save context`, `spec folder`, `agent evaluation`, `code review`, `chrome devtools`, or a directly named CLI skill. In those cases the graph mostly behaves like a companion-ranking system rather than a route override.

Bottom line:

- I do not see evidence of broad harmful routing regressions today.
- I do see measurable ranking drift from family affinity, and it has already crossed the threshold from "explanatory side signal" into "winner-changing signal" once.
- If production risk needs to be reduced further, the best next target is `!graph:family(...)`, not the direct `enhances` or `depends_on` edges. Family affinity is the least lexically grounded mechanism and the one most likely to create incorrect routing changes under ambiguous prompts.

## Metrics

- `newInfoRatio`: `0.45`
- `regressionSuitePassRate`: `1.0`
- `top1ChangedCases`: `1/44`
- `top3ChangedCases`: `11/44`
- `edgeCaseTop1Changed`: `0/3`
